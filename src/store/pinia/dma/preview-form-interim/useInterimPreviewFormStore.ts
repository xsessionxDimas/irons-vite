import { General } from "@/core/types/entities/dma/e-form/general/General";
import {
  Mechanic
} from "@/core/types/entities/dma/e-form/general/ServicePersonnel";
import { Group } from "@/core/types/entities/dma/e-form/group";
import { SubGroup } from "@/core/types/entities/dma/e-form/subGroup";
import {
  GenerateInterimEngineServiceSheet
} from "@/core/types/entities/dma/e-form/generateServiceSheet";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import {
  GENERAL_SERVICE_SHEET_API_URL,
  GENERATE_SERVICE_SHEET_API_URL,
  GET_SERVICE_SHEET_DETAIL_DATA_BY_PARAM_API_URL,
  GET_TASK_PROGRESS_API_URL
} from "../interim-engine-service/urls";
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
import { GET_DEFECT_DETAIL } from "../interim-engine-service/defects/urls";
import {
  PropertyParam
} from "@/core/types/entities/dma/e-form/update-data/propertyParam";
import {
  useAuthenticationStore
} from "../../application/useAuthenticationStore";
import {
  List as WorkOrder
} from "@/core/types/entities/dma/monitoring-status/List";
import { DisabledItem } from "@/core/types/entities/dma/disabledItem";
import {
  riskAssesmentValueConverter,
  stringToImageInfoConvert
} from "@/core/helpers/string-to-imageinfo-converter";
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo";
import { getPercentageTaskProgressAllTab } from "../e-form/helpers";
import { Audit } from "@/core/types/intervention/Audit";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useInterimPreviewFormStore = defineStore({
  id: "InterimDmaPreviewForm",
  state: () => {
    return {
      stateGroups: [] as Group[],
      stateSelectedSubGroups: [] as SubGroup[],
      stateGeneralForm: {} as General,
      stateModelId: "" as string,
      statePsTypeId: "" as string,
      stateWorkOrder: '' as string,
      stateUnitNumber: '' as string,
      stateEmployee: {} as Mechanic,
      stateSelectedGroup: undefined as Group | undefined,
      stateServiceSheets: [] as Group[],
      // flag to show form and hide current component
      stateFormPreview: true,
      stateDefectList: [] as DefectList[],
      stateError: '' as string,
      stateStoredSuspensionCylinderValue: [] as DisabledItem[],
      stateStoredAdjustedSuspensionCylinderValue: [] as DisabledItem[],
      stateStoredAdjustmentOptionValue: "",
      stateIsFormSelectedByOtherSupervisor: false,
      stateSelectedWorkorder: {} as WorkOrder
    }
  },
  getters: {
    serviceSheets: (state) => {
      return state.stateServiceSheets;
    },
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
    async postGenerateServiceSheet(id: string, name: string, site: string) {
      this.stateDefectList = []
      const body = {
        employee: {
          id: id,
          name: name,
        },
        modelId: this.stateModelId,
        psTypeId: this.statePsTypeId,
        workOrder: this.stateWorkOrder,
        unitNumber: this.stateUnitNumber,
        siteId: site
      };
      const params = {
        ver: "v1",
      };
      try {
        const response: AxiosResponse<SingleApiResponse<GenerateInterimEngineServiceSheet>> =
          await ApiService.post(
            `${GENERATE_SERVICE_SHEET_API_URL}?${new URLSearchParams(
              params,
            ).toString()}`,
            body as AxiosRequestConfig,
          );

        if (response.data.statusCode != 200) {
          this.stateError = response.data.result.message
        } else {
          this.stateError = ""
          if (response.data.result.message == 'Cannot Access With Different Supervisor') {
            this.stateIsFormSelectedByOtherSupervisor = true
          } else {
            try {
              this.stateGeneralForm = response.data.result.content.general;
              this.stateServiceSheets = response.data.result.content.suckBlowSheet;
              this.getGroups();
              this.getTaskProgress();
              this.stateSelectedGroup = this.groups[0];

              // get images on prerisk
              const camStore = useCameraStore()
              const attachmentStore = useAttachmentStore()
              camStore.setCurrent("preview-risk");
              camStore.clearCurrent();
              if (isArray(this.generalForm.riskAssesment[0].value)) {
                this.generalForm.riskAssesment[0].value = riskAssesmentValueConverter(this.generalForm.riskAssesment[0].value as any[]) as any[]
                this.preRiskImages.ImageInfos = stringToImageInfoConvert(this.preRiskImages.ImageInfos)
                this.generalForm.riskAssesment[0].value.forEach((element) => {
                  (this.preRiskImages.ImageInfos as ImageInfo[]).push(element);
                });
              }
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
      let groupArr = [
        {
          id: this.generalForm.id,
          modelId: this.generalForm.modelId,
          psTypeId: this.generalForm.psTypeId,
          workOrder: this.generalForm.workOrder,
          groupName: "General-interim",
          groupSeq: 1,
          key: "1",
          headerId: "g1",
          isActive: this.generalForm.isActive.toString(),
          isDeleted: this.generalForm.isDeleted.toString(),
          createdBy: this.generalForm.createdBy,
          createdDate: this.generalForm.createdDate,
          updatedBy: "",
          updatedDate: this.generalForm.updatedDate,
          _rid: this.generalForm._rid,
          _self: this.generalForm._self,
          _etag: this.generalForm._etag,
          _attachments: this.generalForm._attachments,
          _ts: this.generalForm._ts,
          isSelected: true,
          groupLabel: "General",
          subGroup: [] as SubGroup[],
          totalTask: 0,
          doneTask: 0,
        },
      ];
      this.serviceSheets.forEach((el) => {
        const group = {
          id: el.id,
          modelId: el.modelId,
          psTypeId: el.psTypeId,
          workOrder: el.workOrder,
          groupName: el.groupName,
          groupSeq: el.groupSeq,
          key: el.key,
          headerId: el.headerId,
          isActive: el.isActive,
          isDeleted: el.isDeleted,
          createdBy: el.createdBy,
          createdDate: el.createdDate,
          updatedBy: el.updatedBy,
          updatedDate: el.updatedDate,
          _rid: el._rid,
          _self: el._self,
          _etag: el._etag,
          _attachments: el._attachments,
          _ts: el._ts,
          isSelected: false,
          groupLabel: el.subGroup[0].name,
          subGroup: el.subGroup,
          totalTask: 0,
          doneTask: 0,
          isDisable: !isUndefined(el.isDisable) ? el.isDisable : 'false'
        };
        groupArr.push(group);
      });
      groupArr = _.sortBy(groupArr, "groupSeq");
      this.stateGroups = groupArr;
    },
    async getTaskProgress() {
      const params = {
        ver: "v1",
      };
      try {
        const body = {
          modelId: this.generalForm.modelId,
          psTypeId: this.generalForm.psTypeId,
          workOrder: this.generalForm.workOrder,
          headerId: this.serviceSheets[0].headerId
        };
        const response: AxiosResponse<SingleApiResponse<TaskProgress[]>> =
          await ApiService.post(
            `${GET_TASK_PROGRESS_API_URL}?${new URLSearchParams(
              params,
            ).toString()}`,
            body as AxiosRequestConfig,
          );
        response.data.result.content.forEach((item) => {
          const currGroup = this.groups.find((groupItem) => {
            return item.group === groupItem.key;
          });
          if (currGroup) {
            currGroup.doneTask = item.doneTask;
            currGroup.totalTask = item.totalTask;
          }
        });
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error as string)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    setModelAndPsTypeId(modelId: string, psTypeId: string, workOrder, unitNumber) {
      this.stateModelId = modelId;
      this.statePsTypeId = psTypeId;
      this.stateWorkOrder = workOrder
      this.stateUnitNumber = unitNumber
    },
    setShowPreviewForm(status) {
      this.stateFormPreview = status
    },
    setSelectedGroup(id: any) {
      this.stateGroups.forEach((el) => {
        if (el.id === id) {
          el.isSelected = true;
        } else {
          el.isSelected = false;
        }
      });
      this.stateSelectedGroup = this.groups.find((g) => {
        return g.isSelected;
      });
      if (this.stateSelectedGroup!.subGroup.length > 0) {
        this.getSubGroups();
      }
    },
    getSubGroups() {
      const selectedGroup: Group = this.groups.find((el) => {
        return el.isSelected;
      }) as Group;
      if (selectedGroup.groupSeq == 1) {
        this.stateSelectedSubGroups = [];
      } else {
        const groupFromServiceSheet = this.serviceSheets.find((el) => {
          return selectedGroup.id === el.id;
        }) as Group;
        this.stateSelectedSubGroups = groupFromServiceSheet.subGroup;
      }
    },
    async updateGroupByParam(groupName: string) {
      if (groupName !== "General-interim") {
        try {
          const body = {
            modelId: this.generalForm.modelId,
            psTypeId: this.generalForm.psTypeId,
            workOrder: this.generalForm.workOrder,
            groupName: groupName,
          };
          const params = {
            ver: "v1",
          };
          const response: AxiosResponse<SingleApiResponse<Group>> =
            await ApiService.post(
              `${GET_SERVICE_SHEET_DETAIL_DATA_BY_PARAM_API_URL}?${new URLSearchParams(
                params,
              ).toString()}`,
              body as AxiosRequestConfig,
            );
          this.stateSelectedSubGroups = response.data.result.content.subGroup;
          this.stateSelectedSubGroups.forEach((subGroup) => {
            subGroup.taskGroup.forEach((taskGroup) => {
              taskGroup.task.forEach((task) => {
                if (!isUndefined(task.adjustment) && task.adjustment.rating) {
                  task.isShowAdjustmentRow = true
                }
              })
            })
          })
        } catch (error) {
          updateLoggedInStatusFromAPIResponse(error as string)
          sendErrorEvent('IRONS', error);
          console.log(error);
        }
      }
    },
    setShowNextPage() {
      const currentGroup = this.stateGroups.findIndex((group) => {
        return group.groupName == this.stateSelectedGroup?.groupName
      })
      // const nextGroup = this.stateGroups[(currentGroup + 1)]
      let inc = 1
      let nextGroup = this.stateGroups[(currentGroup + inc)]
      while (!isUndefined(nextGroup.isDisable) && nextGroup.isDisable == "true") {
        inc++
        nextGroup = this.stateGroups[(currentGroup + inc)]
      }
      this.setSelectedGroup(nextGroup.id)
      this.getTaskProgress()
      this.updateGroupByParam(nextGroup.groupName)
    },
    setShowPrevPage() {
      const currentGroup = this.stateGroups.findIndex((group) => {
        return group.groupName == this.stateSelectedGroup?.groupName
      })
      let inc = 1
      let nextGroup = this.stateGroups[(currentGroup - inc)]
      while (!isUndefined(nextGroup.isDisable) && nextGroup.isDisable == "true") {
        inc++
        nextGroup = this.stateGroups[(currentGroup - inc)]
      }
      // const nextGroup = this.stateGroups[(currentGroup - 1)]
      this.setSelectedGroup(nextGroup.id)
      this.updateGroupByParam(nextGroup.groupName)
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
        workorder: this.generalForm.workOrder
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
    setSelectedWorkOrder(workOrder) {
      this.stateSelectedWorkorder = workOrder
    },
    pushDataToSuspensionCylinderStoredValue(item: DisabledItem[]) {
      this.stateStoredSuspensionCylinderValue = item
    },
    pushDataToAdjustedSuspensionCylinderStoredValue(item: DisabledItem[]) {
      this.stateStoredAdjustedSuspensionCylinderValue = item
    },
    updateStoredAdjustmentOptionValue(value) {
      this.stateStoredAdjustmentOptionValue = value
    },
    setSerialNumberGeneral(serialNumber: string) {
      this.stateGeneralForm.serialNumber = serialNumber
    },
    updateSMUONGeneral(params : {
      value: string,
      smuBy: Audit,
      smuDate: string
    }) {
      const { value, smuBy, smuDate } = params
      this.generalForm.smu = value
      this.generalForm.smuBy = smuBy
      this.generalForm.smuDate = smuDate
    },
    updateSMUImages(newImages) {
      this.stateGeneralForm.imageEquipment = newImages
    },
  }
})
