import { General } from "@/core/types/entities/dma/e-form/general/General";
import {
  Mechanic
} from "@/core/types/entities/dma/e-form/general/ServicePersonnel";
import { Group } from "@/core/types/entities/dma/e-form/group";
import { SubGroup } from "@/core/types/entities/dma/e-form/subGroup";
import {
  GenerateServiceSheet
} from "@/core/types/entities/dma/e-form/generateServiceSheet";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import {
  GENERAL_SERVICE_SHEET_API_URL,
  GENERATE_SERVICE_SHEET_API_URL,
  GET_PREVIOUS_REPLACEMENT,
  GET_SERVICE_SHEET_DETAIL_DATA_BY_PARAM_API_URL,
  GET_TASK_PROGRESS_API_URL
} from "../e-form/urls";
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
import { getDefectHeaderList, getEmptyServiceSheet } from './urls';
import { GET_DEFECT_DETAIL } from "../e-form/defects/urls";
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
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore";
import {
  riskAssesmentValueConverter,
  stringToImageInfoConvert
} from "@/core/helpers/string-to-imageinfo-converter";
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo";
import { getPercentageTaskProgressAllTab } from "../e-form/helpers";
import { Audit } from "@/core/types/intervention/Audit";
import { checkPrevValFirstHandler } from "@/core/helpers/prev-val-handler";
import {
  CategoryTaskTypeEnum,
  Task,
  TaskCategoryEnum,
  TaskRatingEnum
} from "@/core/types/entities/dma/e-form/Task";
import { CategoryItemTypeEnum } from "@/core/types/entities/dma/e-form/Item";
import {
  PreviousReplacement
} from "@/core/types/entities/dma/e-form/cbm/PreviousReplacement";
import {
  GetPrevValueBasedOnCategoryTypeArgument
} from "../e-form-offline/useEFormStore";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const usePreviewFormStore = defineStore({
  id: "DmaPreviewForm",
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
      stateSelectedWorkorder: {} as WorkOrder,
      statePreviousTandemTasks: [] as string[],
      stateRefreshDataMultiDefect: false,
      stateMultiDefectList: {},
      stateItemTriggerDisabledValue: {}, // isi value item yg trigger disabled
      stateItemKeyWithTriggeredDisabledKey: {}, // isi list semua itemDisabled : TriggerDisabledItem,
      stateSelectedBrakeTypeDropdown: ""
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
    refreshDataMultiDefect: (state) => {
      return state.stateRefreshDataMultiDefect
    },
    multiDefectList: (state) => {
      return state.stateMultiDefectList
    },
    itemTriggerDisabledValue: (state) => {
      return state.stateItemTriggerDisabledValue
    },
    SelectedBrakeTypeDropdown: (state) => {
      return state.stateSelectedBrakeTypeDropdown;
    }
  },
  actions: {
    updateSelectedBrakeTypeDropdownValue(argument: string): void {
      this.stateSelectedBrakeTypeDropdown = argument
    },
    setRefreshDataMultiDefect(value: boolean) {
      this.stateRefreshDataMultiDefect = value
    },
    setItemTriggerDisabledValue(serviceSheet) {
      serviceSheet.subGroup[0].taskGroup.forEach(((taskgroup) => {
        taskgroup.task.forEach((task) => {
          if (task.taskType == 'inline') {
            task.items.forEach((item) => {
              if (item.disabledByItemKey) {
                const exist = item.disabledByItemKey in this.stateItemTriggerDisabledValue
                if (!exist) {
                  this.stateItemTriggerDisabledValue[item.disabledByItemKey] = ''
                  this.stateItemKeyWithTriggeredDisabledKey[item.key] = item.disabledByItemKey
                }
              }
              const isCategoryItemBrakeTypeDropdown = item.categoryItemType == CategoryItemTypeEnum.BRAKE_TYPE_DROPDOWN
              const isCategoryTaskBrakeTypeDropdown = (task as Task).categoryTaskType && (task as Task).categoryTaskType == CategoryTaskTypeEnum.BRAKE_TYPE_DROPDOWN
              if (isCategoryItemBrakeTypeDropdown && isCategoryTaskBrakeTypeDropdown) {
                this.updateSelectedBrakeTypeDropdownValue(item.value as string);
              }
            })
          } else if (task.taskType == 'table') {
            task.items.forEach((item) => {
              for (const itemCol in item) {
                if (item[itemCol].disabledByItemKey) {
                  const exist = item[itemCol].disabledByItemKey in this.stateItemTriggerDisabledValue
                  if (!exist) {
                    this.stateItemTriggerDisabledValue[item[itemCol].disabledByItemKey] = ''
                    this.stateItemKeyWithTriggeredDisabledKey[item[itemCol].key] = item[itemCol].disabledByItemKey
                  }
                }
              }
            })
          }
        })
      }))
      serviceSheet.subGroup[0].taskGroup.forEach(((taskgroup) => {
        taskgroup.task.forEach((task) => {
          if (task.taskType == 'inline') {
            task.items.forEach((item) => {
              const existKeyOnTriggerDisabled = item.key in this.stateItemTriggerDisabledValue
              if (existKeyOnTriggerDisabled) {
                this.stateItemTriggerDisabledValue[item.key] = item.value
              }
            })
          } else if (task.taskType == 'table') {
            task.items.forEach((item) => {
              for (const itemCol in item) {
                if (item[itemCol].disabledByItemKey) {
                  const existKeyOnTriggerDisabled = item[itemCol].key in this.stateItemTriggerDisabledValue
                  if (existKeyOnTriggerDisabled) {
                    this.stateItemTriggerDisabledValue[item[itemCol].key] = item[itemCol].value
                  }
                }
              }
            })
          }
        })
      }))
    },
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
        const response: AxiosResponse<SingleApiResponse<GenerateServiceSheet>> =
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
              this.stateServiceSheets = response.data.result.content.serviceSheet;
              this.getGroups();
              this.getTaskProgress();
              response.data.result.content.serviceSheet.forEach((sheet) => {
                this.setItemTriggerDisabledValue(sheet)
              })
              this.stateSelectedGroup = this.groups[0];

              // get images on prerisk
              const camStore = useCameraStore()
              camStore.setCurrent("preview-risk");
              camStore.clearCurrent();
              if (isArray(this.generalForm.riskAssesment[0].value)) {
                this.generalForm.riskAssesment[0].value = riskAssesmentValueConverter(this.generalForm.riskAssesment[0].value as any[]) as any[]
                this.preRiskImages.ImageInfos = stringToImageInfoConvert(this.preRiskImages.ImageInfos)
                this.generalForm.riskAssesment[0].value.forEach((element) => {
                  (this.preRiskImages.ImageInfos as ImageInfo[]).push(element.image);
                });
              }
            } catch (error: any) {
              updateLoggedInStatusFromAPIResponse(error as string)
              this.stateError = error.response.data.result.message
              sendErrorEvent('IRONS', error);
            }
          }
        }
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error as string)
        this.stateError = error.response.data.result.message
        sendErrorEvent('IRONS', error);
      }
    },
    async getEmptyForm() {
      const authStore = useAuthenticationStore()
      const siteId = authStore.user.SiteId
      const params = {
        ver: "v1",
        modelId: this.stateModelId,
        psTypeId: this.statePsTypeId,
        siteId: siteId
      };
      try {
        const response: AxiosResponse<SingleApiResponse<GenerateServiceSheet>> =
          await ApiService.get(
            `${getEmptyServiceSheet}?${new URLSearchParams(
              params,
            ).toString()}`
          );
        if (response.data.statusCode != 200) {
          this.stateError = response.data.result.message
        } else {
          this.stateError = ""
          if (response.data.result.message == 'Cannot Access With Different Supervisor') {
            this.stateIsFormSelectedByOtherSupervisor = true
          } else {
            try {
              if (!response.data.result.content.general) {
                this.stateError = `${this.stateModelId} form for service size ${this.statePsTypeId} is not implemented yet on ${authStore.user.Location}`
              } else {
                this.stateGeneralForm = response.data.result.content.general as any;
                this.stateServiceSheets = response.data.result.content.serviceSheet;
                this.getGroups();
                this.stateSelectedGroup = this.groups[0];
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
    // comment zapier
    getGroups() {
      let groupArr = [
        {
          id: this.generalForm.id || "General",
          modelId: this.generalForm.modelId,
          psTypeId: this.generalForm.psTypeId,
          workOrder: this.generalForm.workOrder,
          groupName: "General",
          groupSeq: 1,
          key: "1",
          headerId: "g1",
          isActive: this.generalForm.isActive && this.generalForm.isActive.toString() || "",
          isDeleted: this.generalForm.isDeleted && this.generalForm.isDeleted.toString() || "",
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
          id: el.id || el.groupName,
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
        group.subGroup.forEach((subGroup) => {
          subGroup.taskGroup.forEach((taskGroup) => {
            taskGroup.task.forEach((task) => {
              if (!isUndefined(task.adjustment) && (task.adjustment.rating != '' || task.adjustment.commentValue != '' || task.adjustment.measurement != '')) {
                task.isShowAdjustmentRow = true
              }
              if (!isUndefined(task.replacement) && (task.replacement.rating != '' || task.replacement.commentValue != '' || task.replacement.measurement != '')) {
                task.isShowReplacementRow = true
              }
              if (!isUndefined(task.cleaned) && (task.cleaned.rating != '')) {
                task.isShowCleanedRow = true
              }
            })
          })
        })
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
            currGroup.doneTask = currGroup.groupName == 'DEFECT_IDENTIFIED_SERVICE' && item.identifiedDefectCount ? item.identifiedDefectCount : item.doneTask;
            currGroup.totalTask = currGroup.groupName == 'DEFECT_IDENTIFIED_SERVICE' && item.identifiedDefectCount ? item.identifiedDefectCount : item.totalTask;
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
          if (el.id) {
            return selectedGroup.id === el.id;
          }
          return selectedGroup.groupName === el.groupName;
        }) as Group;
        this.stateSelectedSubGroups = groupFromServiceSheet.subGroup;
      }
    },
    async updateGroupByParam(groupName: string) {
      if (groupName !== "General") {
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
                if (!isUndefined(task.adjustment) && (task.adjustment.rating != '' || task.adjustment.commentValue != '' || task.adjustment.measurement != '')) {
                  task.isShowAdjustmentRow = true
                }
                if (!isUndefined(task.replacement) && (task.replacement.rating != '' || task.replacement.commentValue != '' || task.replacement.measurement != '')) {
                  task.isShowReplacementRow = true
                }
                if (!isUndefined(task.cleaned) && (task.cleaned.rating != '')) {
                  task.isShowCleanedRow = true
                }
              })
            })
          })
          this.setItemTriggerDisabledValue(response.data.result.content)
          await this.getMultiDefectList()
          await this.getPreviousTandemValue()
          await this.getPreviousBrakePackValue();
          await this.getPreviousReplacementValue()
        } catch (error) {
          updateLoggedInStatusFromAPIResponse(error as string)
          sendErrorEvent('IRONS', error);
          console.log(error);
        }
      }
    },
    async getPreviousTandemValue() {
      let isFormHasTaskPrevious = false
      let isPreviousTandemHasFilled = false
      this.statePreviousTandemTasks = []
      this.stateSelectedSubGroups.forEach((subGroup) => {
        subGroup.taskGroup.forEach((taskGroup) => {
          taskGroup.task.forEach((task) => {
            if (task.rating == "AUTOMATIC_PREVIOUS" || task.rating == "AUTOMATIC") {
              isFormHasTaskPrevious = true
              this.statePreviousTandemTasks.push(task.key)

              task.items.forEach((item) => {
                if (item.categoryItemType == "previousParamRating") {
                  if (item.value != "" && item.value != "-") {
                    isPreviousTandemHasFilled = true
                  }
                }
              })
            }
          })
        })
      })
      const formIsOpen = this.stateGeneralForm.status == "Open"
      const formIsOnProgressAndPreviousTandemNotFilled = this.stateGeneralForm.status == "On Progress" && (isFormHasTaskPrevious && !isPreviousTandemHasFilled)
      if (formIsOpen || formIsOnProgressAndPreviousTandemNotFilled) {
        const params = {
          ver: "v1",
        };
        // get API
        try {
          const res = await ApiService.post(
            `${GET_PREVIOUS_REPLACEMENT}?${new URLSearchParams(
              params,
            ).toString()}`,
            {
              equipmentNumber: this.generalForm.equipment,
              modelId: this.generalForm.modelId
            } as AxiosRequestConfig,
          );
          let previousTandemArr = [] as any[]
          previousTandemArr = res.data.result.content ? res.data.result.content : []
          // nyamain response api dengan task key
          this.stateSelectedSubGroups.forEach((subGroup) => {
            subGroup.taskGroup.forEach((taskGroup) => {
              taskGroup.task.forEach((task) => {
                if (task.rating == "AUTOMATIC_PREVIOUS" || task.rating == "AUTOMATIC") {
                  previousTandemArr.forEach((prevTan) => {
                    if (prevTan.key == task.key) {
                      task.items.forEach(async (item) => {
                        if (item.categoryItemType == "previousParamRating") {
                          if (item.value != checkPrevValFirstHandler(prevTan)) {
                            item.value = checkPrevValFirstHandler(prevTan)
                          }
                        }
                      })
                    }
                  })
                }
              })
            })
          })
        } catch (e) {
          sendErrorEvent('IRONS', e);
          console.log("error get tandem", e);
        }
      }
    },
    async getPreviousReplacementValue() {
      if (!this.stateSelectedGroup || this.stateSelectedGroup.key != "ELECTRICAL_SERVICE") return
      let isFormHasTaskPrevious = false
      let isPreviousTandemHasFilled = false
      this.statePreviousTandemTasks = []
      this.stateSelectedSubGroups.forEach((subGroup) => {
        subGroup.taskGroup.forEach((taskGroup) => {
          taskGroup.task.forEach((task) => {
            if (task.rating == "AUTOMATIC_REPLACEMENT_GAP" || task.rating == "AUTOMATIC_REPLACEMENT") {
              isFormHasTaskPrevious = true
              this.statePreviousTandemTasks.push(task.key)

              task.items.forEach((item) => {
                if (item.categoryItemType == "previousParamRating") {
                  if (item.value != "" && item.value != "-") {
                    isPreviousTandemHasFilled = true
                  }
                }
              })
            }
          })
        })
      })
      const formIsOpen = this.stateGeneralForm.status == "Open"
      const formIsOnProgressAndPreviousTandemNotFilled = this.stateGeneralForm.status == "On Progress" && (isFormHasTaskPrevious && !isPreviousTandemHasFilled)
      if (formIsOpen || formIsOnProgressAndPreviousTandemNotFilled) {
        const params = {
          ver: "v1",
        };
        // get API
        try {
          const res = await ApiService.post(
            `${GET_PREVIOUS_REPLACEMENT}?${new URLSearchParams(
              params,
            ).toString()}`,
            {
              equipmentNumber: this.generalForm.equipment,
              modelId: this.generalForm.modelId
            } as AxiosRequestConfig,
          );
          let previousTandemArr = [] as any[]
          previousTandemArr = res.data.result.content ? res.data.result.content : []
          // nyamain response api dengan task key
          this.stateSelectedSubGroups.forEach((subGroup) => {
            subGroup.taskGroup.forEach((taskGroup) => {
              taskGroup.task.forEach((task) => {
                if (task.rating == "AUTOMATIC_REPLACEMENT_GAP" || task.rating == "AUTOMATIC_REPLACEMENT") {
                  previousTandemArr.forEach((prevTan) => {
                    if (prevTan.key == task.key) {
                      task.items.forEach(async (item) => {
                        if (item.categoryItemType == "previousParamRating") {
                          if (item.value != checkPrevValFirstHandler(prevTan)) {
                            item.value = checkPrevValFirstHandler(prevTan)
                          }
                        }
                      })
                    }
                  })
                }
              })
            })
          })
        } catch (e) {
          sendErrorEvent('IRONS', e);
          console.log("error get tandem", e);
        }
      }
    },
    setShowNextPage() {
      const currentGroup = this.stateGroups.findIndex((group) => {
        return group.groupName == this.stateSelectedGroup?.groupName
      })
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
      this.setSelectedGroup(nextGroup.id)
      this.updateGroupByParam(nextGroup.groupName)
    },
    resetPreview() {
      this.stateFormPreview = false
      this.stateSelectedGroup = undefined
      this.stateItemTriggerDisabledValue = {}
      this.stateItemKeyWithTriggeredDisabledKey = {}
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
    resetDefectMultiList() {
      this.stateMultiDefectList = {}
    },
    async getMultiDefectList() {
      const defectStore = useDefectsFormStore();
      const promises = [] as any[]
      const taskKeyList = [] as any[]
      this.stateSelectedSubGroups.forEach((subGroup) => {
        subGroup.taskGroup.forEach((taskGroup) => {
          taskGroup.task.forEach((task) => {
            // only defect
            if (task.category == "NORMAL" && task.taskValue == "2") {
              taskKeyList.push(task.key)
              promises.push(new Promise((resolve) => {
                defectStore.getMultipleDefectList(this.stateGeneralForm.workOrder, task.key, this.selectedGroup?.id as string).then((res) => {
                  resolve(res)
                })
              }))
            }
          })
        })
      })
      await Promise.all(promises).then(async (defectList) => {
        defectList.forEach((res, index) => {
          this.stateMultiDefectList[taskKeyList[index]] = res
        })
      })
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
    async getPreviousBrakePackValue() {
      // cek apakah perlu ambil prev. brake pack pake function ini
      // checkPreviousBrakePackValueAlreadyFilled
      let isPrevTaskAlreadyFilled = true;
      isPrevTaskAlreadyFilled = this.checkPreviousBrakePackValueAlreadyFilled(this.stateSelectedSubGroups[0])
      // kalau iya ambil dari local atau dari server
      let prevBrakePackData = [] as PreviousReplacement[]

      if (isPrevTaskAlreadyFilled) return;

      prevBrakePackData = await this.getPreviousBrakePackData();
      // loop task

      const getPrevValueBasedOnCategoryType = (argument: GetPrevValueBasedOnCategoryTypeArgument): string => {
        let value = ""
        switch (argument.categoryItemType) {
          case CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_A:
            value = argument.previousData.lastValuePistonA ?? ""
            break;
          case CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_B:
            value = argument.previousData.lastValuePistonB ?? ""
            break;
          case CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RESULT:
            value = argument.previousData.lastValuePistonResult ?? ""
            break;
          case CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_PERCENTAGE:
            value = argument.previousData.lastValuePistonPercentage ?? ""
            break;
          case CategoryItemTypeEnum.PREVIOUS_VALUE_UOM:
            value = argument.previousData.lastUom ?? ""
            break;
          case CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING:
            value = argument.previousData.lastRating ?? ""
            break;
          default:
            break;
        }
        return value;
      }
      // kebutuhan post data offline
      let itemKey = "";
      let taskKey = "";
      for (const taskGroup of this.stateSelectedSubGroups[0].taskGroup) {
        for (const task of taskGroup.task) {
          if (!taskKey) taskKey = task.key;
          const taskObj = task as Task;
          const isCBMTask = taskObj.category == TaskCategoryEnum.CBM;
          const isOilCooledRatingTask = taskObj.rating == TaskRatingEnum.OIL_COOLED;
          if (isCBMTask && isOilCooledRatingTask) {
            for (const prevTask of prevBrakePackData) {
              if (prevTask.key == taskObj.key) {
                for (const item of taskObj.items) {
                  if (!itemKey) itemKey = item.key;
                  const isPrevPistonAItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_A;
                  const isPrevPistonBItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_B;
                  const isPrevPistonResultItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RESULT;
                  const isPrevUomItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_UOM;
                  const isPrevPistonRatingItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING;
                  const isPrevPistonPercentageItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_PERCENTAGE;
                  const isValueEmpty = item.value == "" || item.value == "-";
                  const isPreviousItems = isPrevPistonAItem || isPrevPistonBItem || isPrevPistonResultItem || isPrevUomItem || isPrevPistonRatingItem || isPrevPistonPercentageItem
                  if (isPreviousItems && isValueEmpty) {
                    const newVal = getPrevValueBasedOnCategoryType({
                      categoryItemType: item.categoryItemType,
                      previousData: prevTask
                    });
                    // jika newVal kosong gausa update ke BE
                    if (newVal && !item.updatedDate) {
                      item.value = newVal;
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    async getPreviousBrakePackData(): Promise<PreviousReplacement[]> {
      try {
        const params = {
          ver: "v1",
        };
        const res = await ApiService.post(
          `${GET_PREVIOUS_REPLACEMENT}?${new URLSearchParams(
            params,
          ).toString()}`,
          {
            equipmentNumber: this.generalForm.equipment,
            modelId: this.generalForm.modelId,
          } as AxiosRequestConfig,
        );
        const previousTandemArr = res.data.result.content ? res.data.result.content : []
        return previousTandemArr;
      } catch (e) {
        sendErrorEvent('IRONS', e);
        console.log("error get tandem", e);
        return [] as PreviousReplacement[];
      }
    },
    checkPreviousBrakePackValueAlreadyFilled(argument: SubGroup): boolean {
      let isFilled = true;
      for (const taskGroup of argument.taskGroup) {
        for (const task of taskGroup.task) {
          const taskObj = task as Task;
          const isCBMTask = taskObj.category == TaskCategoryEnum.CBM;
          const isOilCooledRatingTask = taskObj.rating == TaskRatingEnum.OIL_COOLED;
          if (isCBMTask && isOilCooledRatingTask) {
            for (const item of taskObj.items) {
              const isPrevPistonAItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_A
              const isPrevPistonBItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_B
              const isPrevPistonResultItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RESULT
              const isPrevUomItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_UOM
              const isPrevPistonRatingItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING
              const isPrevPistonPercentageItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_PERCENTAGE
              if (isPrevPistonAItem || isPrevPistonBItem || isPrevPistonResultItem || isPrevUomItem || isPrevPistonRatingItem || isPrevPistonPercentageItem) {
                if (item.value == "" || item.value == "-") {
                  isFilled = false;
                  break;
                }
              }
            }
          }
        }
      }
      return isFilled;
    },
  }
})
