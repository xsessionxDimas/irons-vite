import {
  ComponentInterventionGeneral
} from "@/core/types/entities/dma/component-intervention/ComponentInterventionGeneral";
import {
  Mechanic
} from "@/core/types/entities/dma/e-form/general/ServicePersonnel";
import {
  ComponentInterventionGroup
} from "@/core/types/entities/dma/component-intervention/ComponentInterventionGroup";
import {
  ComponentInterventionComplete
} from "@/core/types/entities/dma/component-intervention/ComponentInterventionComplete";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import {
  GENERAL_SERVICE_SHEET_API_URL,
  GENERATE_SERVICE_SHEET_API_URL,
  GET_TASK_PROGRESS_API_URL
} from "../component-intervention/urls";
import { TaskProgress } from "@/core/types/entities/dma/e-form/taskProgress";
import _, {
  isArray,
  isUndefined,
  floor
} from "lodash";
import { useCameraStore } from "../../application/useCameraStore";
import { ImageObject } from "@/core/types/entities/dma/ImageObject";
import { useAttachmentStore } from "../e-form/attachments/useAttachmentStore";
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import { DefectList } from "@/core/types/entities/dma/approval/DefectList";
import { getDefectHeaderList } from './urls';
import { GET_DEFECT_DETAIL } from "../e-form/defects/urls";
import {
  PropertyParam
} from "@/core/types/entities/dma/e-form/update-data/propertyParam";
import {
  useAuthenticationStore
} from "../../application/useAuthenticationStore";
import {
  ComponentIntervention
} from "@/core/types/entities/dma/component-intervention/ComponentIntervention";
import {
  GET_DETAIL_FIELD_VALUE
} from "../component-intervention/defects/urls";
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo";
import { getPercentageTaskProgressAllTab } from "../e-form/helpers";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const usePreviewFormStore = defineStore({
  id: "DmaPreviewForm",
  state: () => {
    return {
      stateSelectedSubGroups: [] as ComponentInterventionGroup[],
      stateGeneralForm: {} as ComponentInterventionGeneral,
      stateEmployee: {} as Mechanic,
      stateSelectedGroup: undefined as ComponentInterventionGroup | undefined,
      stateGroups: [] as ComponentInterventionGroup[],
      stateSelectedComponentIntervention: {} as ComponentIntervention,
      stateServiceSheets: {} as ComponentInterventionComplete,
      // flag to show form and hide current component
      stateFormPreview: true,
      stateDefectList: [] as DefectList[],
      stateError: '' as string,

      stateIsFormSelectedByOtherSupervisor: false,
    }
  },
  getters: {
    groups: (state) => {
      return state.stateGroups;
    },
    selectedSubGroups: (state) => {
      return state.stateSelectedSubGroups;
    },
    generalForm: (state) => {
      return state.stateGeneralForm;
    },
    employee: (state) => {
      return state.stateEmployee;
    },
    selectedGroup: (state) => {
      return state.stateSelectedGroup;
    },
    formPreview: (state) => {
      return state.stateFormPreview
    },
    preRiskImages: () => {
      const cameraStore = useCameraStore();
      return cameraStore.ImageObjects.find((p) => {
        return p.Id === "preview-risk"
      }) as ImageObject;
    },
    errorMessage: (state) => {
      return state.stateError
    },
    percentageTaskProgressAllTab: (state) => {
      return getPercentageTaskProgressAllTab(state.stateGroups)
    },
  },
  actions: {
    async postGenerateServiceSheet(id: string) {
      const body = {
        id: id,
      };
      const params = {
        ver: "v1",
      };
      const response: AxiosResponse<SingleApiResponse<ComponentInterventionComplete>> =
        await ApiService.post(
          `${GENERATE_SERVICE_SHEET_API_URL}?${new URLSearchParams(
            params,
          ).toString()}`,
          body as AxiosRequestConfig,
        );
      try {
        if (response.data.statusCode != 200) {
          this.stateError = response.data.result.message
        } else {
          this.stateError = ""
          if (response.data.result.message == 'Cannot Access With Different Supervisor') {
            this.stateIsFormSelectedByOtherSupervisor = true
          } else {
            try {
              this.stateServiceSheets = response.data.result.content
              this.stateGeneralForm = _.omit(response.data.result.content, 'details');
              this.getGroups();
              this.getTaskProgress();
              this.stateSelectedGroup = this.groups[0];

              // get images on prerisk
              const camStore = useCameraStore()
              const attachmentStore = useAttachmentStore()
              camStore.setCurrent("preview-risk");
              camStore.clearCurrent();
              if (isArray(this.generalForm.riskAssesment[0].value)) {
                this.generalForm.riskAssesment[0].value.forEach((element) => {
                  this.preRiskImages.ImageInfos.push(element);
                });
              }
              const promises = [] as Promise<Blob>[];
              this.preRiskImages.ImageInfos.forEach((f: string | ImageInfo) => {
                let filename = ''
                if (typeof f == 'string') {
                  filename = f
                } else {
                  filename = f.filename
                }
                promises.push(attachmentStore.downloadAttachment(filename) as Promise<Blob>);
              });
              Promise.all(promises).then((blobs) => {
                blobs.forEach((b) => {
                  const blob = new Blob([b]);
                  this.preRiskImages.ImageBlobs.push(blob)
                });
              })
            } catch (error: any) {
              updateLoggedInStatusFromAPIResponse(error as string)
              this.stateError = error.response.data.result.message
            }
          }
        }
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error as string)
        this.stateError = error.response.data.result.message
        sendErrorEvent('IRONS', error);
      }
    },
    getGroups() {
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

      if (this.stateServiceSheets && this.stateServiceSheets.details) {
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
        this.stateGroups = groupArr
      }
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
    setShowPreviewForm(status) {
      this.stateFormPreview = status
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
          const response: AxiosResponse<SingleApiResponse<any[]>> =
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
    setShowNextPage() {
      const currentGroup = this.stateGroups.findIndex((group) => {
        return group.name == this.stateSelectedGroup?.name
      })
      const nextGroup = this.stateGroups[(currentGroup + 1)]
      this.setSelectedGroup(nextGroup.id)
      this.getTaskProgress()
      this.updateGroupByParam(nextGroup.name)
    },
    setShowPrevPage() {
      const currentGroup = this.stateGroups.findIndex((group) => {
        return group.name == this.stateSelectedGroup?.name
      })
      const nextGroup = this.stateGroups[(currentGroup - 1)]
      this.setSelectedGroup(nextGroup.id)
      this.updateGroupByParam(nextGroup.name)
    },
    resetPreview() {
      this.stateFormPreview = false
      this.stateSelectedGroup = undefined
    },
    async getDefectList() {
      const params = {
        ver: 'v1'
      }
      const body = {
        workorder: this.generalForm.sapWorkOrder
      }
      try {
        const response: AxiosResponse<SingleApiResponse<DefectList[]>> =
          await ApiService.post(
            `${getDefectHeaderList}?${new URLSearchParams(
              params,
            ).toString()}`,
            body as AxiosRequestConfig,
          );
        this.stateDefectList = response.data.result.content
        this.stateDefectList.forEach(async (defectHeader) => {
          defectHeader.taskNumber = Number(defectHeader.taskNo.replace(/[^0-9]+/g, ""))
          if (defectHeader.category == 'NORMAL' && defectHeader.defectType == 'NO') {
            const params = {
              ver: "v1"
            };
            const payload = {
              servicesheetDetailId: defectHeader.serviceSheetDetailId,
              taskId: defectHeader.taskId
            };
            const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(`${GET_DEFECT_DETAIL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig)
            const defectActionArr = JSON.parse(response.data.result.content.detail.actions)
            defectActionArr.forEach((action, index) => {
              defectHeader.defectAction = !_.isUndefined(defectHeader.defectAction) ? defectHeader.defectAction : '' as string + action
              if ((index + 1) < defectActionArr.length) {
                defectHeader.defectAction = defectHeader.defectAction as string + ', '
              }
            })
          }
        })
        this.stateDefectList = _.orderBy(this.stateDefectList,
          ['taskNumber'],
          ['asc']
        )
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error as string)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async closeForm() {
      const authStore = useAuthenticationStore()
      const employee = {
        id: authStore.user.EmployeeId,
        name: authStore.user.Name
      }
      const params = {
        ver: "v1"
      };
      const propertyParams: PropertyParam[] = [
        {
          propertyName: 'status',
          propertyValue: 'Close'
        },
        {
          propertyName: 'serviceEnd',
          propertyValue: '<<ServerDateTime>>'
        },
        {
          propertyName: 'tsServiceEnd',
          propertyValue: '<<ServerTimeStamp>>'
        },
        {
          propertyName: 'updatedBy',
          propertyValue: JSON.stringify(employee)
        },
        {
          propertyName: 'updatedDate',
          propertyValue: '<<ServerDateTime>>'
        },
      ]
      const body = {
        id: this.generalForm.id,
        updateParams: [
          {
            keyValue: 'GENERAL',
            propertyParams: propertyParams
          },
        ],
        employee: employee
      }
      try {
        await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
        return true;
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error as string)
        sendErrorEvent('IRONS', error);
        console.log(error);
        return false
      }
    },
    changePreviewForm(status) {
      this.stateFormPreview = status
    },
  }
})
