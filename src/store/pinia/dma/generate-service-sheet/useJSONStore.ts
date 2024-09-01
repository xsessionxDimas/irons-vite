import { defineStore } from 'pinia'
import {
  GENERATE_SERVICE_SHEET,
  GET_TEMPLATE_BY_PARAM,
  GET_EXCEL_BY_PARAM,
  GET_MODEL_LIST
} from './url'
import { AxiosRequestConfig, AxiosResponse } from "axios";
import ApiService from "@/core/services/ApiService";
import {
  Model
} from '@/core/types/generate-service-sheet/Model'
import { Group } from '@/core/types/generate-service-sheet/Group';
import { get, filter, includes } from 'lodash';
import {
  TaskProblem,
  TaskProblemCode,
} from '@/core/types/generate-service-sheet/TaskProblem';
import { Task } from '@/core/types/generate-service-sheet/Task';
import { SingleApiResponse } from '@/core/types/misc/SingleApiResponse';
import {
  EquipmentModel
} from '@/core/types/entities/dma/e-form/equipmentModel';

type TaskMappingAggregate = ((task: Task, info: { has_value: boolean }) => Task);

export const useJSONStore = defineStore({
  id: "JSONStore",
  state: () => {
    return {
      // indicate when model is rendering
      excelOnRendering: false,

      /**
       * indicate when model is fetching from cosmos
       */
      fetchingExistingModel: false,

      // filename for saving json model
      fileName: "",

      // PStype that they save, it store like "5000" "4000", not "psType5000", "psType4000"
      selectedPsType: undefined as keyof Model | undefined,

      // number index of group on ps type that selected
      selectedTaskGroup: 0 as number,

      // model that used to edit
      stateModel: {} as Model,

      taskMapping: undefined as undefined | TaskMappingAggregate,

      stateSelectedModel: '',
      stateModelList: [] as EquipmentModel[]
    }
  },
  getters: {
    // get model
    model(state) {
      return state.stateModel;
    },

    // selected Model
    selectedModel(state) {
      return state.stateSelectedModel
    },

    // selected Model
    modelList(state) {
      return state.stateModelList
    },

    // excel rendering status
    isExcelOnRendering: (state) => {
      return state.excelOnRendering
    },

    availableServiceSize(state): Array<keyof Model> {
      const keys: Array<keyof Model> = (Object.keys(state.stateModel) || []) as Array<keyof Model>;

      return keys;
    },

    activePsType: (state): keyof Model => {
      return `${state.selectedPsType}` as keyof Model;
    },

    avaiableGroups(state): Group[] | undefined {
      if (!state.stateModel) return undefined;
      if (!state.selectedPsType) return undefined;
      if (!this.model[state.selectedPsType]) return undefined;

      const copiedGroups: Group[] = JSON.parse(JSON.stringify(this.model[state.selectedPsType]));

      const avaiableGroup = copiedGroups.map((group) => {
        if (group.subGroup) {
          group.subGroup.map((subGroup) => {
            subGroup.taskGroup.map((taskgroup) => {
              taskgroup.task.map((task: Task) => {
                const has_value = !!task.taskValue || task.taskValue === "";

                if (this.taskMapping) {
                  task = this.taskMapping(task, { has_value });
                }

                if (typeof task.items == 'object') {
                  task.items.map((item) => {
                    if (item.itemType == 'dropDown') {
                      // item.value = ""
                    }
                    return item;
                  })
                }
              });

              return taskgroup;
            })

            return subGroup;
          })
          return group;
        }
        return null
      }) as (Group | null)[]
      return avaiableGroup.filter((element) => {
        return element !== null
      }) as Group[];
    },

    activeGroup(state): Group | undefined {
      if (!this.avaiableGroups) return undefined;

      return this.avaiableGroups[state.selectedTaskGroup];
    },

    // TECH-DEBT: need to be more clean since all checker logic in same method, but now is okie
    activeGroupProblems(): Map<string, TaskProblem[]> | undefined {
      if (!this.activeGroup) return undefined;

      const all_problems = new Map<string, TaskProblem[]>();

      get(this.activeGroup, "subGroup", []).forEach((subGroup) => {
        subGroup.taskGroup.map((taskGroup, taskGroupIndex) => {
          // init taskgroup level problem
          const taskgroup_problems: TaskProblem[] = [];

          const is_empty_task = taskGroup.task.length < 1;
          if (is_empty_task) {
            taskgroup_problems.push({
              code: TaskProblemCode.EMPTY_TASK,
              msg: `this taskgroup HAS NOT any task and SHOULD BE DELETED`
            })
          }

          taskGroup.task.map((task, taskIndex) => {
            // init task level problem
            const task_problems: TaskProblem[] = [];

            const is_conflig_uuid = this.activeGroupDuplicateUuids.includes(task.key);
            if (is_conflig_uuid) {
              task_problems.push({
                code: TaskProblemCode.DUPLICATE_TASK_ID,
                msg: `${task.key} is duplicated task key`
              })
            }

            let is_a_subtask = false;
            if (task.description) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const [_taskNo, _subtaskNo, _description] = task.description.split(";");

              // const taskNo = _taskNo.trim();
              const subtaskNo = (_subtaskNo || "").trim();
              const description = (_description || "").trim();
              const descriptionWithoutHtml = description.replace(/<[^>]*>/g, '');
              const category = task.category

              is_a_subtask = subtaskNo.length > 0;

              const endWithDotOrDoubleDot = /(\.|:)$/gi;
              const is_end_with_dot = endWithDotOrDoubleDot.test(descriptionWithoutHtml);

              const is_description_contains_spec_or_note = /\bspec\b|\bnote\b/i.test(descriptionWithoutHtml);
              if (is_description_contains_spec_or_note) {
                task_problems.push({
                  code: TaskProblemCode.TASK_DESCRIPTION_CONTAINS_SPECS_OR_NOTE,
                  msg: `This task description has "SPEC" or "NOTE" word that maybe a problem, delete that on DESCRIPTION only and keep it on the form`
                })
              }

              if (category == 'NORMAL') {
                if (is_a_subtask) {
                  if (is_end_with_dot) {
                    task_problems.push({
                      code: TaskProblemCode.TASK_DESCRIPTION_TEXT_ENDING,
                      msg: `This description should has not '.' or ':' on end of the description`
                    })
                  }
                } else {
                  if (!is_end_with_dot) {
                    task_problems.push({
                      code: TaskProblemCode.TASK_DESCRIPTION_TEXT_ENDING,
                      msg: `This description should has '.' or ':' on end of the description`
                    })
                  }
                }
              }
            }

            // == ITEM LEVEL CHECK== //
            if (typeof task.items != 'string') {
              task.items.forEach((item, itemIdx) => {
                // init item level problem
                const item_problems: TaskProblem[] = [];

                const is_conflig_uuid = this.activeGroupDuplicateUuids.includes(item.key);
                if (is_conflig_uuid) {
                  item_problems.push({
                    code: TaskProblemCode.DUPLICATE_TASK_ID,
                    msg: `${task.key} is duplicated item key at colums ${itemIdx}`
                  })
                }

                // set all item level problem
                if (item_problems.length > 0) all_problems.set(`taskgroup-${taskGroupIndex}/task-${taskIndex}/item-${itemIdx}`, item_problems)
              })
            }


            // set all task level problem
            if (task_problems.length > 0) all_problems.set(`taskgroup-${taskGroupIndex}/task-${taskIndex}`, task_problems)

            return task;
          });

          // set all subgroup level problem
          if (taskgroup_problems.length > 0) all_problems.set(`taskgroup-${taskGroupIndex}`, taskgroup_problems)

          return taskGroup
        });
      });

      console.log("problem founds", all_problems)
      return all_problems;
    },

    /**
     * get duplicated uuids on active group
     * @returns string[]
     */
    activeGroupDuplicateUuids(): string[] {
      return filter(this.activeGroupUuids, (uuid, i, iterasi) => {
        return includes(iterasi, uuid, i + 1)
      })
    },

    /**
     * get all uuids on active group
     * @returns string[]
     */
    activeGroupUuids(): string[] | undefined {
      if (!this.activeGroup) return undefined;
      if (!get(this.activeGroup, "subGroup")) return undefined;


      const uuids: string[] = [];

      this.activeGroup.subGroup.map((subGroup) => {
        subGroup.taskGroup.map((taskGroup) => {
          taskGroup.task.map((task) => {
            // push taskgroup when doesn't exists
            if (task.key && task.key.trim().length > 0) uuids.push(task.key);

            if (typeof task.items == 'string') return task;

            task.items.map((item) => {
              // push taskgroup when doesn't exists
              if (item.key && item.key.trim().length > 0) uuids.push(item.key);
              return item
            })

            return task;
          })
          return taskGroup
        })
        return subGroup
      });

      return uuids;
    }
  },

  actions: {
    /**
     * clear model
     * @returns void
     */
    clearModel() {
      this.fileName = '';
      this.stateModel = {};
    },

    clearSelectedModel() {
      this.stateSelectedModel = '';
    },

    /**
     * mapping task before getter fetch it
     *
     * @param strategy
     */
    setTaskMapping(strategy: TaskMappingAggregate | undefined) {
      this.taskMapping = strategy;
    },

    // TECH-DEBT: can accept any json or exact model, but has validation that can be returned reject when invalid format
    /**
     * model mutator
     * @param model
     */
    async setModel(model: Model) {
      this.clearModel();
      this.stateModel = model

      this.selectedPsType = this.availableServiceSize[0]
    },

    async setSelectedModel(model: string) {
      this.clearSelectedModel();
      this.stateSelectedModel = model
    },

    /**
     * set task group
     * @param arrayIndex
     */
    async setPsType(psType: keyof Model) {
      this.selectedPsType = psType;
      this.selectedTaskGroup = 0
    },

    /**
     * set task group
     * @param arrayIndex
     */
    async setTaskGroup(idxOrGroupName: number | string) {
      if (!this.selectedPsType) return Promise.reject("ps type is not defined yet");
      if (!this.avaiableGroups) return Promise.reject("group not available");

      if (typeof idxOrGroupName == 'string') {
        this.selectedTaskGroup = this.avaiableGroups?.findIndex((group) => {
          return group.groupName == idxOrGroupName
        })
      } else {
        this.selectedTaskGroup = idxOrGroupName;
      }
    },

    // TECH-DEBT: make parameters json with transparant type instead FormData
    // TECH-DEBT: can more clean
    async postGenerateServiceSheet(formData: FormData) {
      this.stateModel = {};
      this.excelOnRendering = true;

      // TECH-DEBT: clear any
      const response: AxiosResponse<any> = await ApiService.postImages(GENERATE_SERVICE_SHEET, formData as AxiosRequestConfig).finally(() => {
        this.excelOnRendering = false;
      })

      if (response.data.statusCode == 200) {
        this.setModel(response.data.result.content.content)
        return Promise.resolve()
      } else {
        return Promise.reject({
          msg: response.data.result.message,
          errors: response.data.result.content as { lineError: string; message: string }[]
        })
      }
    },

    /**
     * build model from group collection
     *
     * @param groups Group[]
     * @returns Promise<Model>
     */
    async buildModelFromGroupCollection(groups: Group[]): Promise<Model> {
      // LOGIC: acceptable group keys
      const not_acceptable_group_keys = [
        "GENERAL",
        "DEFECT_IDENTIFIED_SERVICE"
      ];

      // CONDITION: how we accept group come in this store
      const is_acceptable_group = (group: Group) => {
        const is_not_correct_pstype_format = !/^\d+$/.test(group.psTypeId)
        if (is_not_correct_pstype_format) return; // reject

        const is_not_acceptable_key = not_acceptable_group_keys.includes(group.key)
        if (is_not_acceptable_key) return; // reject

        const is_empty_subgroup = group.subGroup.length < 1;
        if (is_empty_subgroup) return; // reject

        return true;
      }

      // OPERATION(S)
      const model: Model = groups.reduce((stack: Model, group) => {
        if (!is_acceptable_group(group)) {
          return stack;
        }

        const is_pstype_already_exists = !!stack[group.psTypeId];
        if (!is_pstype_already_exists) {
          stack[group.psTypeId] = []
        }

        stack[group.psTypeId]?.push(group);

        return stack;
      }, {} as Model)

      this.setModel(model);

      return model;
    },

    async postGenerateServiceSheetByModel(model: string) {
      this.stateModel = {};
      this.excelOnRendering = true;

      const param = {
        ver: "v1",
        modelId: model
      }

      // TECH-DEBT: clear any
      const response: AxiosResponse<any> = await ApiService.get(`${GET_TEMPLATE_BY_PARAM}?${new URLSearchParams(
        param,
      ).toString()}`).finally(() => {
        this.excelOnRendering = false;
      })

      if (response.data.statusCode == 200) {
        this.setModel(response.data.result.content)
        return Promise.resolve()
      } else {
        return Promise.reject({
          msg: response.data.result.message,
          errors: response.data.result.content as { lineError: string; message: string }[]
        })
      }
      // this.setSelectedModel(model)
      // this.setModel(tempResponse as Model)
      // setTimeout(() => {
      //   this.excelOnRendering = false
      // }, 1000);
    },

    async postDownloadExcelModel() {
      this.excelOnRendering = true;
      let psType = ''

      const regex = /\d+/;

      const match1 = this.activePsType.match(regex);

      if (match1) {
        psType = match1[0]
      }


      const param = {
        ver: "v1",
        modelId: this.selectedModel,
        psTypeId: psType
      }

      // TECH-DEBT: clear any
      const response: AxiosResponse<Blob> = await ApiService.getBlob(`${GET_EXCEL_BY_PARAM}?${new URLSearchParams(
        param,
      ).toString()}`).finally(() => {
        this.excelOnRendering = false;
      })

      if (response.status == 200) {
        const link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);

        const blob = new Blob([
          response.data
        ], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'
        });
        const objectURL = URL.createObjectURL(blob);

        link.href = objectURL;
        link.href = URL.createObjectURL(blob);
        link.download = `${this.selectedModel} - ${psType}.xlsx`;
        link.click();
        return Promise.resolve()
      } else {
        return Promise.reject({
          msg: "Error Get Template",
          // errors: response.data.result.content as { lineError: string; message: string }[]
        })
      }
    },

    async getEquipmentList() {
      this.excelOnRendering = true;

      const param = {
        ver: "v1",
      }

      const response: AxiosResponse<SingleApiResponse<EquipmentModel[]>> = await ApiService.get(`${GET_MODEL_LIST}?${new URLSearchParams(
        param,
      ).toString()}`).finally(() => {
        this.excelOnRendering = false;
      })

      if (response.data.statusCode == 200) {
        this.stateModelList = response.data.result.content
        return Promise.resolve()
      } else {
        return Promise.reject({
          msg: response.data.result.message,
          // errors: response.data.result.content as { lineError: string; message: string }[]
        })
      }
    },
  }
})
