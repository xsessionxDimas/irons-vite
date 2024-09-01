import { AxiosRequestConfig, AxiosResponse } from "axios";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import ApiService from "@/core/services/ApiService";
import {
  GENERATE_SERVICE_SHEET_API_URL,
  GENERAL_SERVICE_SHEET_API_URL,
  GET_TASK_PROGRESS_API_URL,
  PUT_SERVICE_SHEET_API_URL,
  UPDATE_TASK_WITH_DEFECT,
  UPDATEDEFECTHEADERURL,
  GETDEFECTHEADERBYPARAMURL,
  GET_DETAIL_FIELD_VALUE,
  GENERATE_SERVICE_SHEET_API_URL_COSMOS
} from "./urls";
import {
  GET_DEFECTS_HEADER
} from "./defects/urls"
import { defineStore } from "pinia";
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import {
  ComponentInterventionComplete
} from "@/core/types/entities/dma/component-intervention/ComponentInterventionComplete";
import {
  ComponentInterventionGroup
} from "@/core/types/entities/dma/component-intervention/ComponentInterventionGroup";
import {
  Mechanic
} from "@/core/types/entities/dma/e-form/general/ServicePersonnel";
import { TaskProgress } from "@/core/types/entities/dma/e-form/taskProgress";
import _, { isUndefined, floor } from "lodash";
import {
  UpdateParam
} from "@/core/types/entities/dma/e-form/update-data/updateParam";
import {
  useAuthenticationStore
} from "../../application/useAuthenticationStore";
import { Task } from "@/core/types/entities/dma/e-form/Task";
import { Item } from "@/core/types/entities/dma/e-form/Item";
import {
  PropertyParam
} from "@/core/types/entities/dma/e-form/update-data/propertyParam";
import { checkMaxValue, checkMinValue, checkRating } from "../e-form/helpers";
import { DefectList } from "@/core/types/entities/dma/approval/DefectList";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import { dayNightConverter } from "@/core/helpers/date-format";
import {
  useGeneralComponentInterventionFormStore
} from "./useGeneralComponentInterventionFormStore";
import {
  SubGroup
} from "@/core/types/entities/dma/component-intervention/SubGroup";
import { Header } from "@/core/types/entities/dma/defects/Header"
import { cloneDeep } from 'lodash';
import {
  dynamicFieldValueParam
} from "@/core/types/entities/dma/component-intervention/FieldValue";
import { db } from '@/database/schema/DexieSchema'
import { Intervention } from "@/core/types/intervention/Intervention";
import { ServiceSheetErrorMessages } from "@/store/enums/ErrorMessagesEnum";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useComponentInterventionEformStore = defineStore({
  id: "componentInterventionEformStore",
  state: () => {
    return {
      // header dialog
      stateInterventionId: '' as string,
      stateEquipment: '' as string,
      stateSapWorkOrder: '' as string,
      stateModelUnit: '' as string,
      stateSampleStatus: '' as string,
      statecomponentDescription: '' as string,
      // service sheet & general
      stateServiceSheets: {} as ComponentInterventionComplete,
      stateGroups: [] as ComponentInterventionGroup[],
      // load service sheet
      stateIsSet: false,
      // employee
      stateEmployee: {} as Mechanic,
      // selected
      stateSelectedGroup: undefined as ComponentInterventionGroup | undefined,
      // update
      stateTaskUpdated: undefined as boolean | undefined,
      stateFormAlreadySubmitted: false,
      stateTaskAlreadyUpdated: false,
      // SPV
      stateIsFormSelectedByOtherSupervisor: false,

      // uom
      stateMeasurementValue: '' as string,
      stateImageKey: '' as string,
      stateUOM: '' as string,

      stateRatingNotMapped: false as boolean,
      stateCBMFormulas: '' as any,
      stateWorkOrder: '' as any,
      stateShift: '' as any,
      stateServiceStart: '' as any,

      stateErrorMessage: '' as string,
      stateSerialNumber: '' as string
    };
  },
  getters: {
    selectedGroup: (state) => {
      return state.stateSelectedGroup;
    },
    groups: (state) => {
      return state.stateGroups
    },
    isSet: (state) => {
      return state.stateIsSet
    },
    employee: (state) => {
      return state.stateEmployee
    },
    intervention: (state) => {
      return state.stateServiceSheets as unknown as Intervention
    },
    generalForm: (state) => {
      return _.omit(state.stateServiceSheets, 'details')
    },
    details: (state) => {
      return state.stateServiceSheets && state.stateServiceSheets.details
    },
    formAlreadySubmitted: (state) => {
      return state.stateFormAlreadySubmitted
    },
    serviceStart: (state) => {
      return state.stateServiceStart
    },
    shift: (state) => {
      return state.stateShift
    },
    taskUpdated: (state) => {
      return state.stateTaskUpdated;
    },
    taskAlreadyUpdated: (state) => {
      return state.stateTaskAlreadyUpdated;
    },
    ratingNotMapped: (state) => {
      return state.stateRatingNotMapped;
    },
    allCustomValidationRequiredDone: (state) => {
      const tasks: any[] = []
      if (state.stateServiceSheets.details) {
        state.stateServiceSheets.details.forEach((detail) => {
          detail.tasks.forEach((task) => {
            task.tasks.forEach((taskItem) => {
              taskItem.items.forEach((item) => {
                if (item.customValidation && item.customValidation == "Required") {
                  tasks.push(item.value)
                }
              })
            })
          })
        })
      }

      let valueRequired = true
      if (tasks.length > 0) {
        const nullValue = tasks.filter((val) => {
          if (!val) return true
        })
        valueRequired = nullValue.length == 0 ? true : false
      }

      return valueRequired
    },
    isAllTaskDone: (state) => {
      let done = true
      state.stateGroups.forEach((val, idx) => {
        // idx == 0 -> General
        if (idx != 0) {
          // check if there's a not done group
          if (done) {
            if (val.totalTask != val.doneTask) {
              done = false
            }
          }
        }
      })
      return done
    },
    errorMessage: (state) => {
      return state.stateErrorMessage
    },
    percentageTaskProgressAllTab: (state) => {
      let totalTask = 0
      let totalDoneTask = 0
      state.stateGroups.forEach((val) => {
        console.log(val)
        totalDoneTask = totalDoneTask + val.doneTask
        totalTask = totalTask + val.totalTask
      })
      if (totalTask == 0) {
        return 100
      }
      return floor((totalDoneTask / totalTask) * 100)
    },
    SerialNumber: (state) => {
      return state.stateSerialNumber
    }
  },
  actions: {
    toggleFormAlreadySubmitted(val) {
      this.stateFormAlreadySubmitted = val
    },
    toggleFormUpdated(val) {
      this.stateTaskUpdated = val
    },
    setMeasurementValueAndUOM(value: string, uom: string, imageKey: string): void {
      this.stateMeasurementValue = value;
      this.stateUOM = uom;
      this.stateImageKey = imageKey;
    },
    setComponentInterventionHeader(id, equipment, sapWorkOrder, modelUnit, sampleStatus, componentDescription) {
      this.stateInterventionId = id;
      this.stateEquipment = equipment;
      this.stateSapWorkOrder = sapWorkOrder
      this.stateModelUnit = modelUnit
      this.stateSampleStatus = sampleStatus
      this.statecomponentDescription = componentDescription
    },
    setSelectedGroup(key: any) {
      this.stateGroups.forEach((el) => {
        if (el.key === key) {
          el.isSelected = true;
        } else {
          el.isSelected = false;
        }
      });
      this.stateSelectedGroup = this.stateGroups.find((g) => {
        return g.isSelected;
      });
    },
    getGroups(isMonitoring = false) {
      const groupArr = [
        {
          groupSeq: 1,
          isSelected: true,
          name: "General",
          group: "General",
          totalTask: 0,
          doneTask: 0,
          tasks: null,
          key: '0'
        }
      ] as ComponentInterventionGroup[];

      let sheetsLength = 0

      if (this.stateServiceSheets && this.stateServiceSheets.details) {
        sheetsLength = this.stateServiceSheets.details.length
        this.stateServiceSheets.details.forEach((el, index) => {
          groupArr.push({
            key: el.key,
            group: el.group,
            tasks: el.tasks,
            name: el.group,
            groupSeq: index + 2,
            isSelected: false,
            totalTask: 0,
            doneTask: 0
          })
        })
      }

      if (isMonitoring) {
        groupArr.push({
          groupSeq: 1 + sheetsLength + 1,
          isSelected: false,
          name: "Defect Identified",
          group: "Defect Identified",
          totalTask: 0,
          doneTask: 0,
          tasks: null,
          key: 'Defect Identified'
        })
      }

      this.stateGroups = groupArr
    },
    async getTaskProgress() {
      const params = {
        ver: "v1",
        id: this.generalForm.id,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<TaskProgress>> =
          await ApiService.get(
            `${GET_TASK_PROGRESS_API_URL}`,
            '',
            new URLSearchParams(params).toString()
          );
        const taskprogress = response.data.result.content
        this.stateGroups[1].doneTask = taskprogress.doneTask
        this.stateGroups[1].totalTask = taskprogress.totalTask
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    changeIsFormSelectedByOtherSupervisor(status) {
      this.stateIsFormSelectedByOtherSupervisor = status
    },
    async getInterventionData(id = "") {
      const params = {
        ver: "v1",
        keyPbi: this.stateInterventionId || id,
      };
      const response: AxiosResponse<SingleApiResponse<ComponentInterventionComplete>> =
        await ApiService.get(
          `${GENERATE_SERVICE_SHEET_API_URL}?${new URLSearchParams(
            params,
          ).toString()}`,
        );
      if (response.data.result.message == 'Cannot Access With Different Supervisor') {
        this.changeIsFormSelectedByOtherSupervisor(true)
        return false
      }
      this.stateServiceSheets = response.data.result.content;
    },
    async getInterventionDataCosmos(id = "") {
      const body = {
        id: this.stateInterventionId || id,
      };
      const params = {
        ver: "v1",
      };
      const response: AxiosResponse<SingleApiResponse<ComponentInterventionComplete>> =
        await ApiService.post(
          `${GENERATE_SERVICE_SHEET_API_URL_COSMOS}?${new URLSearchParams(
            params,
          ).toString()}`,
          body as AxiosRequestConfig,
        );
      if (response.data.result.message == 'Cannot Access With Different Supervisor') {
        this.changeIsFormSelectedByOtherSupervisor(true)
        return false
      }
      this.stateServiceSheets = response.data.result.content;
      await db.interventionDetailView.put(response.data.result.content as unknown as Intervention)
    },
    async postGenerateServiceSheet(isOnline: boolean, isMonitoring = false, isOpenMonitoring = false) {
      if (isOnline) {
        if (isMonitoring && !isOpenMonitoring) {
          await this.getInterventionDataCosmos()
        } else {
          await this.getInterventionData()
        }
      }
      try {
        const generalEform = useGeneralComponentInterventionFormStore()
        if (!this.stateServiceSheets.imageEquipment) this.stateServiceSheets.imageEquipment = []
        const general = _.omit(this.stateServiceSheets, 'details')
        generalEform.setGeneralForm(general)
        this.getGroups(isMonitoring);
        this.getTaskProgress();
        this.stateSelectedGroup = this.stateGroups[0];
        this.stateIsSet = true;
        return true
      } catch (error) {
        try {
          updateLoggedInStatusFromAPIResponse(error)
          console.log(error);
          return false
        } catch (error) {
          this.stateErrorMessage = error as string
          console.log('error', error);
        }
      }
    },
    // fitter is employee who assigned service sheet
    updateSelectedFitter(employee: Mechanic) {
      this.stateEmployee = employee;
    },
    resetMechanic() {
      this.stateEmployee = {} as Mechanic;
      this.stateServiceStart = '';
      this.stateShift = '';
    },
    // update value form general
    updateGeneralValue(key, value) {
      this.stateServiceSheets[key] = value
    },
    // update service start
    updateServiceStart(serviceStart: string) {
      const generalEform = useGeneralComponentInterventionFormStore()
      this.stateServiceStart = serviceStart;
      this.stateShift = dayNightConverter(generalEform.stateTimeZone);
    },
    // update images on risk assesment
    async updateRiskAssesment(lastImages) {
      let arr = (this.generalForm.riskAssesment && this.generalForm.riskAssesment[0].value) || ''
      if (arr == '') {
        arr = []
      }
      if (Array.isArray(arr)) {
        arr = [
          ...arr,
          ...lastImages
        ]
      } else {
        arr = []
        arr = [
          ...arr,
          ...lastImages
        ]
      }
      this.stateServiceSheets.riskAssesment[0].value = arr
      await this.updatePreRiskAssesmentToBE()
    },
    async deleteRisAssesmentPic(deletedImage) {
      let arr = this.generalForm.riskAssesment[0].value as any[]
      arr = arr.filter((image) => {
        return image.image != deletedImage
      })
      this.stateServiceSheets.riskAssesment[0].value = arr
      await this.updatePreRiskAssesmentToBE()
    },
    async updatePreRiskAssesmentToBE() {
      const payload = {
        id: this.generalForm.id,
        updateParams: [
          {
            keyValue: this.generalForm.riskAssesment[0].key,
            propertyParams: [
              {
                propertyName: 'value',
                propertyValue: JSON.stringify(this.generalForm.riskAssesment[0].value)
              },
            ]
          }
        ],
        employee: this.stateEmployee
      }
      const params = {
        ver: 'v1'
      }
      try {
        await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
        console.log('upload risk Assesment', error);
      }
    },
    async setShowNextPage() {
      const params = {
        ver: "v1",
        id: this.generalForm.id,
      };
      let isFormComplete = false
      try {
        const response: AxiosResponse<SingleApiResponse<TaskProgress>> =
          await ApiService.get(
            `${GET_TASK_PROGRESS_API_URL}`,
            '',
            new URLSearchParams(params).toString()
          );
        const taskprogress = response.data.result.content
        if (taskprogress.doneTask == taskprogress.totalTask) {
          isFormComplete = true
        }

        // if (response.data.result.content.length < 1) isFormComplete = false
        // response.data.result.content.forEach((item) => {
        //   if (item.doneTask != item.totalTask) {
        //     isFormComplete = false
        //   }
        // });
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
        isFormComplete = false
      }
      if (!isFormComplete) {
        // next group question
        // const currentGroup = this.stateGroups.findIndex((group) => {
        //   return group.name == this.stateSelectedGroup?.name
        // })
        // const nextGroup = this.stateGroups[(currentGroup + 1)]
        // this.setSelectedGroup(nextGroup.key)
        // this.updateGroupByParam(nextGroup.name)
        return false
      } else {
        // get status
        const status = await this.checkInterventionStatus()
        if (status == 'Submited') {
          this.stateFormAlreadySubmitted = true
        } else {
          // update status to Submit
          return true
        }
      }
    },
    setTaskUpdated() {
      this.stateTaskUpdated = true;
    },
    resetTaskUpdated() {
      this.stateTaskUpdated = undefined;
    },

    async updateServiceSheetTaskValue(
      payload: UpdateParam[],
      id: string,
      name: string,
      isHitupdateGroupByParam = true
    ) {
      let updateStatus = false
      const params = {
        ver: "v1",
      };
      try {
        const selectedGroup = this.groups.find((el) => {
          return el.isSelected;
        }) as ComponentInterventionGroup;
        const body = {
          id: this.generalForm.id,
          headerId: this.generalForm.id,
          workOrder: this.generalForm.sapWorkOrder,
          updateParams: payload,
          employee: {
            id: this.employee.id,
            name: this.employee.name,
          },
        };
        this.stateTaskUpdated = false;
        const res = await ApiService.post(
          `${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(
            params,
          ).toString()}`,
            body as AxiosRequestConfig,
        );
        if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
          this.stateFormAlreadySubmitted = true
        }
        if (res.data.result.message == ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER) {
          this.stateTaskAlreadyUpdated = true
        }
        this.getTaskProgress();
        this.updateGroupByParam(selectedGroup?.name);
        updateStatus = true
        this.setTaskUpdated();
      } catch (error) {
        // const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        // this.globalConnectionStore.setSubmitConnectionError(isNoNetwork)
        updateLoggedInStatusFromAPIResponse(error)
        // if (isNoNetwork) updateStatus = false
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
      this.stateTaskUpdated = true;
      return updateStatus
    },
    async updateGroupByParam(groupName: string) {
      if (groupName !== "General") {
        try {
          const body = {
            id: this.generalForm.id,
            key: this.generalForm.key,
            propertyName: "details"
          };
          const params = {
            ver: "v1",
          };
          const response: AxiosResponse<SingleApiResponse<SubGroup[]>> =
            await ApiService.post(
              `${GET_DETAIL_FIELD_VALUE}?${new URLSearchParams(
                params,
              ).toString()}`,
              body as AxiosRequestConfig,
            );
          // const selectedGroup = response.data.result.content.filter((val) => {
          //   return val.name == groupName
          // })
          this.stateServiceSheets.details = response.data.result.content
        } catch (error) {
          updateLoggedInStatusFromAPIResponse(error)
          sendErrorEvent('IRONS', error);
          console.log(error);
        }
      } else {
        // const generalStore = useGeneralFormStore()
        // await generalStore.getServerTimestamp()
      }
    },
    async getCBMResult(task: Task, item: Item) {
      let rating;
      // get task with paramRatingDynamic (get selectTools)
      let toolsValue = ""
      task.items.forEach((item) => {
        if (item.categoryItemType == "dropdownTool") {
          toolsValue = item.value as string
        }
      })

      // filter formulas where task == task
      const taskFormulas = this.stateCBMFormulas.filter((formula) => {
        const formNum = `${formula.taskNumber}${
          formula.detailNumber ? formula.detailNumber : ''
        }`;
        if (typeof task.items[0].value == "string") {
          if (item.categoryItemType == "paramRatingDynamic") {
            const isTaskSame = formNum == task.items[0].value || formNum == task.items[0].value.substring(0, task.items[0].value.length - 1)
            const isUomSame = formula.cbmType == toolsValue
            return isTaskSame && isUomSame
          } else {
            return (
              formNum == task.items[0].value ||
              formNum ==
                task.items[0].value.substring(0, task.items[0].value.length - 1)
            );
          }
        }
      });
      // loop filter
      if (taskFormulas.length > 0) {
        taskFormulas.every((formula) => {
          // check 1st param
          const checkMin = checkMinValue(formula, item.value);
          // check 2nd param
          const checkMax = checkMaxValue(formula, item.value);
          rating = checkRating(checkMin, checkMax, formula);
          console.log(
            "checkMin",
            checkMin,
            "checkMax",
            checkMax,
            "formula",
            formula,
          );
          if (rating) {
            return false;
          } else {
            return true;
          }
        });
        // get item target
        if (rating) {
          const targetItem = task.items.find((taskItem: Item) => {
            return taskItem.categoryItemType == "targetRating";
          });
          if (rating == "C" || rating == "X") {
            const authStore = useAuthenticationStore();
            const params = {
              ver: "v1",
            };
            const taskNo = `${task.description.split(';')[0]};${task.description.split(';')[1]}`;
            const defectPayload = {
              updateParams: [
                {
                  keyValue: task.key,
                  propertyParams: [
                    {
                      propertyName: "taskValue",
                      propertyValue: rating,
                    },
                    {
                      propertyName: "updatedBy",
                      propertyValue: JSON.stringify(this.employee),
                    },
                    {
                      propertyName: "updatedDate",
                      propertyValue: "<<ServerDateTime>>",
                    },
                  ],
                },
              ],
              headerId: this.generalForm.id,
              workOrder: this.generalForm.sapWorkOrder,
              id: this.generalForm.id,
              employee: this.employee,
              defectHeader: {
                workorder: this.generalForm.sapWorkOrder,
                form: this.generalForm.equipmentDesc,
                serviceSheetDetailId: "",
                interventionId: this.generalForm.id,
                category: task.category,
                taskId: task.key,
                taskNo: taskNo,
                taskDesc: task.items[2].value,
                defectWorkorder: '',
                formDefect: '',
                defectType: '',
                cbmMeasurement: this.stateMeasurementValue,
                cbmUom: this.stateUOM,
                cbmImageKey: this.stateImageKey,
                cbmImageProp: 'value',
                isCbmAdjusment: 'false',
                taskValue: rating,
                repairedStatus: "Not-Repaired",
                cbmNAStatus: "Not-Confirm",
                supervisor: {
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                },
                status: "Submit",
              },
            };
            const res: AxiosResponse<ApiResponse<any>> = await ApiService.post(
              `${UPDATE_TASK_WITH_DEFECT}?${new URLSearchParams(
                params,
              ).toString()}`,
              defectPayload as AxiosRequestConfig,
            );
            if (res.data.result.message == ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER) {
              this.stateTaskAlreadyUpdated = true
              return {
                value: '',
                status: false
              }
            }
            if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
              this.stateFormAlreadySubmitted = true
              return {
                value: '',
                status: false
              }
            }
            const itemParam: UpdateParam[] = [
              {
                keyValue: targetItem!.key,
                propertyParams: [
                  {
                    propertyName: 'value',
                    propertyValue: rating
                  },
                  {
                    propertyName: 'updatedBy',
                    propertyValue: JSON.stringify(this.employee)
                  },
                  {
                    propertyName: 'updatedDate',
                    propertyValue: '<<ServerDateTime>>'
                  },
                ]
              },
            ]
            this.updateItemServiceSheetDetail(itemParam)
            this.stateMeasurementValue = '';
            this.stateUOM = '';
            this.stateImageKey = '';
            return {
              value: rating,
              status: true
            }
          } else {
            // put data to BE
            targetItem!.value = rating;
            const payload: UpdateParam[] = [
              {
                keyValue: targetItem!.key,
                propertyParams: [
                  {
                    propertyName: "value",
                    propertyValue: rating,
                  },
                  {
                    propertyName: "updatedBy",
                    propertyValue: JSON.stringify(this.employee),
                  },
                  {
                    propertyName: "updatedDate",
                    propertyValue: "<<ServerDateTime>>",
                  },
                ],
              },
              {
                keyValue: task.key,
                propertyParams: [
                  {
                    propertyName: "taskValue",
                    propertyValue: rating,
                  },
                  {
                    propertyName: "updatedBy",
                    propertyValue: JSON.stringify(this.employee),
                  },
                  {
                    propertyName: "updatedDate",
                    propertyValue: "<<ServerDateTime>>",
                  },
                ],
              },
            ];
            await this.updateServiceSheetTaskValue(
              payload,
              this.employee.id.toString(),
              this.employee.name,
              false
            );
          }
          return {
            value: '',
            status: true
          }
        } else {
          await this.deleteExisitingDefectCBMAuto(task)
          return {
            value: '',
            status: true
          };
        }
      } else {
        this.stateRatingNotMapped = true
        console.log('rating CBM for this task is not mapped on ADM');
        return {
          value: '',
          status: false
        };
      }
    },
    async deleteExisitingDefectCBMAuto(task: Task) {
      const params = {
        ver: "v1"
      }
      // jika item rating c/x hapus defectnya
      let ratingValParam = {} as UpdateParam
      const taskValParam = {
        keyValue: task.key,
        propertyParams: [
          {
            propertyName: 'value',
            propertyValue: ""
          },
          {
            propertyName: 'updatedBy',
            propertyValue: ""
          },
          {
            propertyName: 'updatedDate',
            propertyValue: ''
          },
        ]
      }
      task.items.forEach(async (item) => {
        if (item.categoryItemType == "targetRating") {
          ratingValParam = {
            keyValue: item.key,
            propertyParams: [
              {
                propertyName: 'value',
                propertyValue: ""
              },
              {
                propertyName: 'updatedBy',
                propertyValue: ""
              },
              {
                propertyName: 'updatedDate',
                propertyValue: ''
              },
            ]
          }
          // hapus defect
          if (item.value == "C" || item.value == "X") {
            // get defect header
            const defectHeaderPayload = {
              taskId: task.key,
              workorder: this.stateWorkOrder
            }
            const defectHeaderResponse: AxiosResponse<SingleApiResponse<DefectList>> = await ApiService.post(`${GETDEFECTHEADERBYPARAMURL}?${new URLSearchParams(params).toString()}`, defectHeaderPayload as AxiosRequestConfig);
            const defectHeader = defectHeaderResponse.data.result.content
            // delete defect
            const updateDefectHeaderPayload = {
              id: defectHeader.id,
              updateParams: [
                {
                  keyValue: defectHeader.key,
                  propertyParams: [
                    {
                      propertyName: 'isActive',
                      propertyValue: 'false'
                    }
                  ]
                }
              ],
              employee: this.employee
            }
            try {
              await ApiService.post(`${UPDATEDEFECTHEADERURL}?${new URLSearchParams(params).toString()}`, updateDefectHeaderPayload as AxiosRequestConfig)
            } catch (error) {
              updateLoggedInStatusFromAPIResponse(error)
              sendErrorEvent('IRONS', error);
              console.log(error)
            }
          }
          // reset rating
          item.value = ""
        }
      })
      const taskPayload: UpdateParam[] = [
        ratingValParam,
        taskValParam
      ]
      // payload to be sent to BE
      const body = {
        headerId: this.generalForm.id,
        workorder: this.generalForm.sapWorkOrder,
        id: this.generalForm.id,
        updateParams: taskPayload,
        employee: this.employee
      }
      // send data to be
      try {
        await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getEhmsRating() {
      const params = {
        ver: "v1",
      };
      try {
        const response: AxiosResponse<ApiResponse<any>> = await ApiService.get(
          // GET_PARAMETER_EHMS_API_URL,
          '',
          new URLSearchParams(params).toString(),
        );
        this.stateCBMFormulas = response.data.result.content[0].detail;
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async getValueFromItemKey(key: string) {
      const body = {
        // id: this.selectedGroup!.id,
        keyValue: key,
        propertyName: "value",
      };
      const params = {
        ver: "v1",
      };
      let val = '';
      const response: AxiosResponse<SingleApiResponse<string>> =
        await ApiService.post(
          `${GET_DETAIL_FIELD_VALUE}?${new URLSearchParams(params).toString()}`,
          body as AxiosRequestConfig,
        );
      if (!isUndefined(response.data.result.content)) {
        val = response.data.result.content;
      }
      return val;
    },
    async checkInterventionStatus() {
      const body = {
        id: this.generalForm.id,
        key: this.generalForm.key,
        propertyName: "interventionExecution"
      };
      const params = {
        ver: "v1",
      };
      const response: AxiosResponse<SingleApiResponse<string>> =
        await ApiService.post(
          `${GET_DETAIL_FIELD_VALUE}?${new URLSearchParams(params).toString()}`,
          body as AxiosRequestConfig,
        );
      return response.data.result.content;
    },
    async updateItemServiceSheetDetail(payload) {
      const params = {
        ver: "v1",
      }
      const body = {
        headerId: this.generalForm.id,
        workorder: this.generalForm.sapWorkOrder,
        id: this.generalForm.id,
        updateParams: payload,
        employee: {
          id: this.employee.id,
          name: this.employee.name,
        },
      };
      try {
        await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
        console.log('error update item', error);
      }
    },
    async submitEform() {
      const params = {
        ver: "v1"
      };
      let hasDefect = false
      const bodyDefect = {
        interventionId: this.generalForm.id
      }
      const response: AxiosResponse<ApiResponse<Header>> = await ApiService.post(`${GET_DEFECTS_HEADER}`, bodyDefect as AxiosRequestConfig)
      if (response.data.result.content.length > 0) {
        hasDefect = true
      }

      const propertyParams: PropertyParam[] = [
        {
          propertyName: 'interventionExecution',
          propertyValue: !hasDefect ? 'Close' : 'Submited'
        },
        {
          propertyName: 'updatedBy',
          propertyValue: JSON.stringify(this.employee)
        },
        {
          propertyName: 'updatedDate',
          propertyValue: '<<ServerDateTime>>'
        },
      ]
      const statusHistoryClone = this.generalForm.statusHistory ? cloneDeep(this.generalForm.statusHistory) : []
      statusHistoryClone.push({
        status: !hasDefect ? 'Close' : 'Submited',
        updatedBy: this.employee,
        updatedDate: "<<ServerDateTime>>",
        tsUpdatedDate: "<<ServerTimeStamp>>"
      })
      propertyParams.push({
        propertyName: 'statusHistory',
        propertyValue: JSON.stringify(statusHistoryClone)
      })
      const body = {
        id: this.generalForm.id,
        updateParams: [
          {
            keyValue: this.generalForm.key,
            propertyParams: propertyParams
          },
        ],
        employee: this.employee
      }
      try {
        await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
        return true;
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
        return false
      }
    },
    async updateDefect(task, val, item) {
      const authStore = useAuthenticationStore();
      const params = {
        ver: "v1",
      };
      const taskNo = `${task.description.split(';')[0]};${task.description.split(';')[1]}`;
      const defectPayload = {
        updateParams: [
          {
            keyValue: task.key,
            propertyParams: [
              {
                propertyName: "taskValue",
                propertyValue: val,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify(this.employee),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        headerId: this.generalForm.id,
        workorder: this.generalForm.sapWorkOrder,
        id: this.generalForm.id,
        employee: this.employee,
        defectHeader: {
          workorder: this.generalForm.sapWorkOrder,
          form: this.generalForm.equipmentDesc,
          serviceSheetDetailId: "",
          interventionId: this.generalForm.id,
          category: task.category,
          taskId: task.key,
          taskNo: taskNo,
          taskDesc: task.items[2].value,
          defectWorkorder: '',
          formDefect: '',
          defectType: '',
          cbmMeasurement: this.stateMeasurementValue,
          cbmUom: this.stateUOM,
          cbmImageKey: this.stateImageKey,
          cbmImageProp: 'value',
          isCbmAdjusment: 'false',
          taskValue: val,
          repairedStatus: "Not-Repaired",
          cbmNAStatus: "Not-Confirm",
          supervisor: {
            id: authStore.user.EmployeeId,
            name: authStore.user.Name,
          },
          status: "Submit",
        },
      };
      try {
        const res = await ApiService.post(
          `${UPDATE_TASK_WITH_DEFECT}?${new URLSearchParams(
            params,
          ).toString()}`,
          defectPayload as AxiosRequestConfig,
        );
        if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
          this.stateFormAlreadySubmitted = true
          return false
        }
        if (res.data.result.message == ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER) {
          this.stateTaskAlreadyUpdated = true
          return false
        }
        this.stateMeasurementValue = '';
        this.stateUOM = '';
        this.stateImageKey = '';

        // -------- case reset na field -------
        await this.deleteDefect(task)

        let resetOtherItemFieldParam = {} as UpdateParam
        let taskNormalValueParam = {} as UpdateParam
        if (item.categoryItemType == "resultRating") {
          taskNormalValueParam = {
            keyValue: task!.key,
            propertyParams: [
              {
                propertyName: 'taskNormalValue',
                propertyValue: ""
              },
            ]
          }
          task.items.forEach((searchItem) => {
            if (searchItem.categoryItemType == "resultStatus") {
              resetOtherItemFieldParam = {
                keyValue: searchItem!.key,
                propertyParams: [
                  {
                    propertyName: 'value',
                    propertyValue: ""
                  },
                  {
                    propertyName: 'updatedBy',
                    propertyValue: ""
                  },
                  {
                    propertyName: 'updatedDate',
                    propertyValue: ''
                  },
                ]
              }
            }
          })
        }
        // -------- case reset na field -------

        const itemParam: UpdateParam[] = [
          {
            keyValue: item!.key,
            propertyParams: [
              {
                propertyName: 'value',
                propertyValue: val
              },
              {
                propertyName: 'updatedBy',
                propertyValue: JSON.stringify(this.employee)
              },
              {
                propertyName: 'updatedDate',
                propertyValue: '<<ServerDateTime>>'
              },
            ]
          },
        ]
        if (item.categoryItemType == "resultRating") {
          itemParam.push(resetOtherItemFieldParam)
          itemParam.push(taskNormalValueParam)
        }

        await this.updateItemServiceSheetDetail(itemParam)
        const selectedGroup = this.groups.find((el) => {
          return el.isSelected;
        }) as ComponentInterventionGroup
        this.getTaskProgress()
        this.updateGroupByParam(selectedGroup?.name)
        return true
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
        return false
      }
    },
    toggleNotMapped(status) {
      this.stateRatingNotMapped = status
    },
    toggleTaskAlreadyUpdatedStatus(status) {
      this.stateTaskAlreadyUpdated = status
    },
    // ------- adjustment CBM auto --------
    // ------- Update dorpdown tool and UOM and trigger rating --------
    handleGetUomFromSelectedTool(task: Task, value: string) {
      // dapetin array perhitungan di cbm mapping berdasarkan task
      // filter formulas where task == task
      const taskFormulas = this.stateCBMFormulas.filter((formula) => {
        const formNum = `${formula.taskNumber}${formula.detailNumber ? formula.detailNumber : ''}`;
        if (typeof task.items[0].value == "string") {
          return formNum == task.items[0].value || formNum == task.items[0].value.substring(0, task.items[0].value.length - 1)
        }
      });
      // cek yang sama
      let uom = ""
      taskFormulas.forEach((formula) => {
        if (formula.cbmType == value) uom = formula.uom
      })
      // return uomnya??
      return uom
    },
    async updateToolUom(task: Task, dropdownItem: Item) {
      const uom = this.handleGetUomFromSelectedTool(task, dropdownItem.value as string)
      // gather property from uom item
      let uomParam = {} as UpdateParam
      task.items.forEach((item) => {
        if (item.categoryItemType == "targetTool") {
          item.value = uom
          uomParam = {
            keyValue: item.key,
            propertyParams: [
              {
                propertyName: 'value',
                propertyValue: uom
              },
              {
                propertyName: 'updatedBy',
                propertyValue: JSON.stringify(this.employee)
              },
              {
                propertyName: 'updatedDate',
                propertyValue: '<<ServerDateTime>>'
              },
            ]
          }
        }
      })
      // gather property from tool dropdown
      const toolParam: UpdateParam = {
        keyValue: dropdownItem.key,
        propertyParams: [
          {
            propertyName: 'value',
            propertyValue: dropdownItem.value as string
          },
          {
            propertyName: 'updatedBy',
            propertyValue: JSON.stringify(this.employee)
          },
          {
            propertyName: 'updatedDate',
            propertyValue: '<<ServerDateTime>>'
          },
        ]
      }
      // gather task payloads
      const taskPayload: UpdateParam[] = [
        uomParam,
        toolParam
      ]
      // payload to be sent to BE
      const params = {
        ver: "v1",
      };
      const body = {
        headerId: this.generalForm.id,
        workorder: this.generalForm.sapWorkOrder,
        id: this.generalForm.id,
        updateParams: taskPayload,
        employee: this.employee
      }
      // send data to be
      try {
        await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      // reset cbm value and defect (if any)
      await this.resetCBMMeasurementValueAndDefect(task)
    },
    async resetCBMMeasurementValueAndDefect(task: Task) {
      const params = {
        ver: "v1",
      }
      let measurementValParam = {} as UpdateParam
      let ratingValParam = {} as UpdateParam
      let cameraValParam = {} as UpdateParam
      task.items.forEach(async (item) => {
        // reset measurement
        if (item.categoryItemType == "paramRatingDynamic") {
          item.value = ""
          measurementValParam = {
            keyValue: item.key,
            propertyParams: [
              {
                propertyName: 'value',
                propertyValue: ""
              },
              {
                propertyName: 'updatedBy',
                propertyValue: ""
              },
              {
                propertyName: 'updatedDate',
                propertyValue: ''
              },
            ]
          }
        }
        if (item.categoryItemType == "targetRating") {
          ratingValParam = {
            keyValue: item.key,
            propertyParams: [
              {
                propertyName: 'value',
                propertyValue: ""
              },
              {
                propertyName: 'updatedBy',
                propertyValue: ""
              },
              {
                propertyName: 'updatedDate',
                propertyValue: ''
              },
            ]
          }
          // hapus defect
          if (item.value == "C" || item.value == "X") {
            // get defect header
            const defectHeaderPayload = {
              taskId: task.key,
              workorder: this.stateWorkOrder
            }
            const defectHeaderResponse: AxiosResponse<SingleApiResponse<DefectList>> = await ApiService.post(`${GETDEFECTHEADERBYPARAMURL}?${new URLSearchParams(params).toString()}`, defectHeaderPayload as AxiosRequestConfig);
            const defectHeader = defectHeaderResponse.data.result.content
            // delete defect
            const updateDefectHeaderPayload = {
              id: defectHeader.id,
              updateParams: [
                {
                  keyValue: defectHeader.key,
                  propertyParams: [
                    {
                      propertyName: 'isActive',
                      propertyValue: 'false'
                    }
                  ]
                }
              ],
              employee: this.employee
            }
            try {
              await ApiService.post(`${UPDATEDEFECTHEADERURL}?${new URLSearchParams(params).toString()}`, updateDefectHeaderPayload as AxiosRequestConfig)
            } catch (error) {
              updateLoggedInStatusFromAPIResponse(error)
              sendErrorEvent('IRONS', error);
              console.log(error)
            }
          }
          // reset rating
          item.value = ""
        }
        if (item.itemType == "smallCamera") {
          cameraValParam = {
            keyValue: item.key,
            propertyParams: [
              {
                propertyName: 'value',
                propertyValue: ""
              },
              {
                propertyName: 'updatedBy',
                propertyValue: ""
              },
              {
                propertyName: 'updatedDate',
                propertyValue: ''
              },
            ]
          }
        }
      });
      // update data
      const taskValParam = {
        keyValue: task.key,
        propertyParams: [
          {
            propertyName: 'value',
            propertyValue: ""
          },
          {
            propertyName: 'updatedBy',
            propertyValue: ""
          },
          {
            propertyName: 'updatedDate',
            propertyValue: ''
          },
        ]
      }
      // gather task payloads
      const taskPayload: UpdateParam[] = [
        taskValParam,
        measurementValParam,
        ratingValParam,
        cameraValParam
      ]
      // payload to be sent to BE
      const body = {
        headerId: this.generalForm.id,
        workorder: this.generalForm.sapWorkOrder,
        id: this.generalForm.id,
        updateParams: taskPayload,
        employee: this.employee
      }
      // send data to be
      try {
        await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      await this.getTaskProgress()
      await this.updateGroupByParam(this.stateSelectedGroup!.name)
    },
    // ------- Update dorpdown tool and UOM and trigger rating --------
    async deleteDefect(task: Task) {
      const params = {
        ver: "v1"
      }
      // get defect header
      const defectHeaderPayload = {
        taskId: task.key,
        workorder: this.stateWorkOrder
      }
      const defectHeaderResponse: AxiosResponse<SingleApiResponse<DefectList>> = await ApiService.post(`${GETDEFECTHEADERBYPARAMURL}?${new URLSearchParams(params).toString()}`, defectHeaderPayload as AxiosRequestConfig);
      const defectHeader = defectHeaderResponse.data.result.content
      // delete defect
      const updateDefectHeaderPayload = {
        id: defectHeader.id,
        updateParams: [
          {
            keyValue: defectHeader.key,
            propertyParams: [
              {
                propertyName: 'isDeleted',
                propertyValue: 'true'
              },
              {
                propertyName: 'isActive',
                propertyValue: 'false'
              }
            ]
          }
        ],
        employee: this.employee
      }
      try {
        await ApiService.post(`${UPDATEDEFECTHEADERURL}?${new URLSearchParams(params).toString()}`, updateDefectHeaderPayload as AxiosRequestConfig)
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },

    setPreviewShowNextPage() {
      const currentGroup = this.stateGroups.findIndex((group) => {
        return group.name == this.stateSelectedGroup?.name
      })
      const nextGroup = this.stateGroups[(currentGroup + 1)]
      this.setSelectedGroup(nextGroup.key)
      this.getTaskProgress()
      this.updateGroupByParam(nextGroup.name)
    },
    setPreviewShowPrevPage() {
      const currentGroup = this.stateGroups.findIndex((group) => {
        return group.name == this.stateSelectedGroup?.name
      })
      const nextGroup = this.stateGroups[(currentGroup - 1)]
      this.setSelectedGroup(nextGroup.key)
      this.updateGroupByParam(nextGroup.name)
    },
    resetPreview() {
      this.stateInterventionId = ''
      this.stateEquipment = ''
      this.stateSapWorkOrder = ''
      this.stateModelUnit = ''
      this.stateSampleStatus = ''
      this.statecomponentDescription = ''
      this.stateServiceSheets = {} as ComponentInterventionComplete
      this.stateGroups = []
      this.stateIsSet = false
      this.stateEmployee = {} as Mechanic
      this.stateSelectedGroup = undefined
    },
    resetPreviewPDF() {
      this.stateSelectedGroup = undefined
    },
    async getDynamicValue(param: dynamicFieldValueParam) {
      const body = {
        id: param.id,
        keyValue: param.key,
        propertyName: param.propertyName,
      };
      const params = {
        ver: "v1",
      };
      let val = '';
      const response: AxiosResponse<SingleApiResponse<string>> =
        await ApiService.post(
          `${GET_DETAIL_FIELD_VALUE}?${new URLSearchParams(params).toString()}`,
          body as AxiosRequestConfig,
        );
      if (!isUndefined(response.data.result.content)) {
        val = response.data.result.content;
      }
      return val;
    },
    setSerialNumber(serialNumber: string) {
      this.stateSerialNumber = serialNumber
    }
  },
});
