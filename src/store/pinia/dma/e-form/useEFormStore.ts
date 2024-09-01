import { Group } from "@/core/types/entities/dma/e-form/group";
import { SubGroup } from "@/core/types/entities/dma/e-form/subGroup";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import ApiService from "@/core/services/ApiService";
import {
  GENERATE_SERVICE_SHEET_API_URL,
  GET_TASK_PROGRESS_API_URL,
  PUT_SERVICE_SHEET_API_URL,
  GET_SERVICE_SHEET_DETAIL_DATA_BY_PARAM_API_URL,
  GET_PARAMETER_EHMS_API_URL,
  GET_DETAIL_FIELD_VALUE,
  GENERAL_SERVICE_SHEET_API_URL,
  GETDEFECTHEADERBYPARAMURL,
  UPDATEDEFECTHEADERURL,
  PRE_SERVICE_SKIP_TASK_REASEON,
  UPDATE_DEFECT_HEADER,
  CBM_REPLACEMENT_DEFAULT_URL,
  GET_PREVIOUS_REPLACEMENT,
  GET_FIELD_VALUE
} from "./urls";
import {
  GenerateServiceSheet
} from "@/core/types/entities/dma/e-form/generateServiceSheet";
import { General } from "@/core/types/entities/dma/e-form/general/General";
import {
  UpdateParam
} from "@/core/types/entities/dma/e-form/update-data/updateParam";
import { TaskProgress } from "@/core/types/entities/dma/e-form/taskProgress";
import { defineStore } from "pinia";
import { isUndefined, floor, sortBy } from "lodash";
import {
  Task,
  TaskCategoryEnum,
  TaskRatingEnum
} from "@/core/types/entities/dma/e-form/Task";
import {
  CategoryItemTypeEnum,
  Item
} from "@/core/types/entities/dma/e-form/Item";
import { ListItem } from "@/core/types/entities/dma/e-form/cbm/list";
import { checkMaxValue, checkMinValue, checkRating } from "./helpers";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  Mechanic
} from "@/core/types/entities/dma/e-form/general/ServicePersonnel";
import {
  useAuthenticationStore
} from "../../application/useAuthenticationStore";
import { UPDATE_TASK_WITH_DEFECT } from "./cracks/urls";
import { dayNightConverter } from "@/core/helpers/date-format";
import { CheckboxModel } from "@/core/types/misc/CheckboxModel";
import {
  PropertyParam
} from "@/core/types/entities/dma/e-form/update-data/propertyParam";
import {
  ListItem as OilToleranceListItem
} from "@/core/types/entities/iron-lake/parameter/oil-tolerance-setting/ListItem"
import {
  CRUD_URL
} from "../../iron-lake/parameter/oil-tolerance-setting/urls";
import { OilTolerance } from "@/core/types/entities/dma/e-form/OilTolerance";
import { useGeneralFormStore } from "./useGeneralFormStore";
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import { DefectList } from "@/core/types/entities/dma/approval/DefectList";
import {
  useGlobalConnectionStore
} from "../../application/useGlobalConnectionStore";
import { DisabledItem } from "@/core/types/entities/dma/disabledItem";
import { urlAPIBasicParam } from "@/core/const/api";
import {
  handleScrollToError
} from "@/core/helpers/ironforms/defects-form/defect-form";
import { ElLoading } from "element-plus";
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore";
import {
  RiskAssesmentValue
} from "@/core/types/entities/dma/RiskAssesmentValue";
import { sendCustomEvent } from "@/core/helpers/azure-app-insight";
import {
  MultiplePreviousCrack
} from "@/core/types/entities/dma/e-form/cracks/MultiplePreviousCrack";
import {
  ReplacementDefaultPayloadType,
  ReplacementDefaultResponseType
} from "@/core/types/entities/dma/e-form/cbm/ReplacementDefaultType"
import { GET_PREVIOUS_CRACK_BY_WO } from "../daily-schedule/urls";
import {
  useTaskReplacement
} from "@/core/helpers/ironforms/useTaskReplacement";
import { useCameraStore } from "../../application/useCameraStore";
import {
  PreviousReplacement
} from "@/core/types/entities/dma/e-form/cbm/PreviousReplacement";
import { ServiceSheetErrorMessages } from "@/store/enums/ErrorMessagesEnum";
import { checkPrevValFirstHandler } from "@/core/helpers/prev-val-handler";
import { GetPrevValueBasedOnCategoryTypeArgument } from "../e-form-offline/useEFormStore";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useEFormStore = defineStore({
  id: "EForm",
  state: () => {
    return {
      stateServiceSheets: [] as Group[],
      stateGroups: [] as Group[],
      stateSelectedSubGroups: [] as SubGroup[],
      stateGeneralForm: {} as General,
      // model id is model merged with brand
      stateModelId: '' as string,
      // model name is only the model of form
      stateModelName: '' as string,
      statePsTypeId: '' as string,
      stateWorkOrder: '' as string,
      stateUnitNumber: '' as string,
      stateEmployee: {} as Mechanic,
      stateMeasurementValue: '' as string,
      stateImageKey: '' as string,
      stateUOM: '' as string,
      stateSelectedGroup: undefined as Group | undefined,
      stateIsSet: false,
      stateCBMFormulas: [] as ListItem[],
      stateTaskUpdated: undefined as boolean | undefined,
      stateServiceStart: '',
      stateShift: '',
      stateCheckbeforeTruck: [] as Array<CheckboxModel>,
      stateRatingNotMapped: false,
      stateOilToleranceNotMapped: false,
      stateOilTolerance: { } as OilTolerance,
      stateTaskAlreadyUpdated: false,
      stateTaskErrorDialog: false,
      stateErrorMessageTaskErrorDialog: "",
      stateFormAlreadySubmitted: false,
      stateFormAlreadyClose: false,
      stateIsFormSelectedByOtherSupervisor: false,
      stateStoredDisableKeyValue: [] as DisabledItem[],
      // used to identify current which item is processing
      stateItemKey: '',
      stateFromHomePage: true,
      stateAvgTargetKey: "",
      stateInputCameraMandatoryKey: "",
      stateStoredSuspensionCylinderValue: [] as DisabledItem[],
      stateStoredAdjustedSuspensionCylinderValue: [] as DisabledItem[],
      stateShowSCConfirmToSPC: false,
      stateShowConfirmToCalibrateSC: false,
      stateShowSCAdjustmentWarning: false,
      stateStoredAdjustmentOptionValue: "",
      stateStoredBrakeTypeValue: [] as DisabledItem[],
      stateIsShowCalibrationConfirm: false,
      stateShowPreTaskNotComplete: false,
      stateToggleExpandTaskGroup: false,
      stateTaskGroupClosed: 100,
      statePreviousTandemTasks: [] as string[],
      stateNewPreviousTandemTasks: [] as DisabledItem[],
      // preservice
      stateSkipPreService: false,
      stateSkipPreServiceReasonOptions: [] as string[],
      // dialog defect yes/no
      stateConfirmSubmitVisibility: "",
      stateMultiDefectList: {},
      stateDropdownToolGroup: {},
      stateReasonNA: "",
      stateCameraItemCBMTakePhotoCompleteRating: {},
      stateResetValue: false,
      statePreviousCrackArr: [] as MultiplePreviousCrack[],
      statePreviousReplacement: [] as PreviousReplacement[],
      stateGetDataByParam: false,
      // replacement
      stateReplacementValue: null as null | string,
      stateIsReplaceValue: false
    };
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
    isSet: (state) => {
      return state.stateIsSet;
    },
    selectedGroup: (state) => {
      return state.stateSelectedGroup;
    },
    taskUpdated: (state) => {
      return state.stateTaskUpdated;
    },
    serviceStart: (state) => {
      return state.stateServiceStart;
    },
    shift: (state) => {
      return state.stateShift;
    },
    checkBeforeTruck: (state) => {
      return state.stateCheckbeforeTruck as Array<CheckboxModel>;
    },
    ratingNotMapped: (state) => {
      return state.stateRatingNotMapped;
    },
    taskAlreadyUpdated: (state) => {
      return state.stateTaskAlreadyUpdated;
    },
    taskErrorDialog: (state) => {
      return state.stateTaskErrorDialog;
    },
    errorMessageTaskErrorDialog: (state) => {
      return state.stateErrorMessageTaskErrorDialog;
    },
    unitNumber: (state) => {
      return state.stateUnitNumber;
    },
    oilTolerance: (state) => {
      return state.stateOilTolerance
    },
    formAlreadySubmitted: (state) => {
      return state.stateFormAlreadySubmitted
    },
    formAlreadyClose: (state) => {
      return state.stateFormAlreadyClose
    },
    generalFormStore: () => {
      return useGeneralFormStore()
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
    percentageTaskProgressAllTab: (state) => {
      let totalTask = 0
      let totalDoneTask = 0
      state.stateGroups.forEach((val) => {
        if (val.groupName != 'DEFECT_IDENTIFIED_SERVICE') {
          totalDoneTask = totalDoneTask + val.doneTask
          totalTask = totalTask + val.totalTask
        }
      })
      if (totalTask == 0) {
        return 100
      }
      return floor((totalDoneTask / totalTask) * 100)
    },
    globalConnectionStore: () => {
      return useGlobalConnectionStore()
    },
    skipPreService: (state) => {
      return state.stateSkipPreService
    },
    isAllPreServiceFinished: (state) => {
      const preseviceName = "PRE_SERVICE_OPERATIONAL_CHECK"
      const preserviceTask = state.stateGroups.find((group) => {
        return group.groupName == preseviceName
      })
      return preserviceTask?.doneTask == preserviceTask?.totalTask
    },
    confirmSubmitVisibility: (state) => {
      return state.stateConfirmSubmitVisibility
    },
    multiDefectList: (state) => {
      return state.stateMultiDefectList
    },
    dropdownToolGroup: (state) => {
      return state.stateDropdownToolGroup
    },
    reasonNA: (state) => {
      return state.stateReasonNA
    },
    CameraItemCBMTakePhotoCompleteRating: (state) => {
      return state.stateCameraItemCBMTakePhotoCompleteRating
    },
    cameraStore: () => {
      return useCameraStore()
    }
  },
  actions: {
    toggleIsReplaceValue(status: boolean) {
      this.stateIsReplaceValue = status
    },
    setResetValue(status: boolean) {
      this.stateResetValue = status
    },
    setSkipPreService(skip: boolean) {
      this.stateSkipPreService = skip
    },
    setReasonNA(reason: string) {
      this.stateReasonNA = reason
    },
    setInputCameraMandatoryKey(val) {
      this.stateInputCameraMandatoryKey = val
    },
    setAvgTargetKey(val) {
      this.stateAvgTargetKey = val
    },
    setFromHomePage(status) {
      this.stateFromHomePage = status
    },
    setStateItemKey(val) {
      this.stateItemKey = val
    },
    updateStoredDisableKeyValue(value) {
      this.stateStoredDisableKeyValue = value
    },
    pushStoredDisabledItems(disabled: DisabledItem) {
      this.stateStoredDisableKeyValue.push(disabled)
    },
    updateAllItems(key, val) {
      this.stateStoredDisableKeyValue.forEach((item) => {
        if (item.key == key) item.value = val
      })
    },
    toggleFormAlreadySubmitted(val) {
      this.stateFormAlreadySubmitted = val
    },
    toggleFormAlreadyClose(val) {
      this.stateFormAlreadyClose = val
    },
    toggleConfirmSubmitVisibility(task) {
      this.stateConfirmSubmitVisibility = task
    },
    getGroups() {
      let groupArr = [
        {
          id: "1",
          modelId: '',
          psTypeId: '',
          workOrder: '',
          groupName: "General",
          groupSeq: 1,
          key: "1",
          headerId: "g1",
          isActive: '',
          isDeleted: '',
          createdBy: {
            id: '',
            name: '',
          },
          createdDate: '',
          updatedBy: '',
          updatedDate: '',
          _rid: '',
          _self: '',
          _etag: '',
          _attachments: '',
          _ts: 0,
          isSelected: true,
          groupLabel: "General",
          subGroup: [] as SubGroup[],
          totalTask: 0,
          doneTask: 0,
        }
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
      groupArr = sortBy(groupArr, "groupSeq");
      this.stateGroups = groupArr;
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
    setCheckTruckItems(items) {
      this.generalForm.checkBeforeTruck.items = items
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
      this.getSubGroups();
    },
    setMeasurementValueAndUOM(value: string, uom: string, imageKey: string): void {
      this.stateMeasurementValue = value;
      this.stateUOM = uom;
      this.stateImageKey = imageKey;
    },
    setModelAndPsTypeId(modelId: string, psTypeId: string, workOrder, modelName, unitNumber) {
      this.stateModelId = modelId;
      this.statePsTypeId = psTypeId;
      this.stateWorkOrder = workOrder
      this.stateModelName = modelName
      this.stateUnitNumber = unitNumber
    },
    resetTaskUpdated() {
      this.stateTaskUpdated = undefined;
    },
    async refreshWash(id: string, name: string, site: string) {
      this.generalFormStore.setSkipWash("false")
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
        if (response.data.result.message == 'Cannot Access With Different Supervisor') {
          this.stateIsFormSelectedByOtherSupervisor = true
          return false
        } else {
          try {
            this.stateGeneralForm.checkBeforeTruck = response.data.result.content.general.checkBeforeTruck
            this.stateGeneralForm.checkBeforeTruck.items.every((checkbox) => {
              if (checkbox.category == 'skipOtherWash') {
                this.generalFormStore.setSkipWash(checkbox.value as string)
                return false
              }
              return true
            })
            /* set checkboxes */
            this.setCheckboxes();
            return true
          } catch (error) {
            try {
              updateLoggedInStatusFromAPIResponse(error)
              console.log(error);
              sendErrorEvent('IRONS', error);
              return false
            } catch (error) {
              console.log('error', error);
            }
          }
        }
      } catch (error) {
        sendCustomEvent("fe_event_error_get_service_sheet_data", {
          errorMessage: error
        })
      }
    },
    async postGenerateServiceSheet(id: string, name: string, site: string) {
      const generalStore = useGeneralFormStore()
      // reset
      generalStore.setSkipWash("false")
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
        if (response.data.result.message == 'Cannot Access With Different Supervisor') {
          this.stateIsFormSelectedByOtherSupervisor = true
          return false
        } else {
          try {
            this.stateGeneralForm = response.data.result.content.general;
            this.stateGeneralForm.checkBeforeTruck.items.every((checkbox) => {
              if (checkbox.category == 'skipOtherWash') {
                generalStore.setSkipWash(checkbox.value as string)
                return false
              }
              return true
            })
            /* set checkboxes */
            this.setCheckboxes();
            this.stateServiceSheets = response.data.result.content.serviceSheet;
            this.getGroups();
            this.getTaskProgress();
            this.stateSelectedGroup = this.groups[0];
            this.stateIsSet = true;
            return true
          } catch (error) {
            try {
              updateLoggedInStatusFromAPIResponse(error)
              sendErrorEvent('IRONS', error);
              console.log(error);
              return false
            } catch (error) {
              console.log('error', error);
            }
          }
        }
      } catch (error) {
        sendCustomEvent("fe_event_error_get_service_sheet_data", {
          errorMessage: error
        })
      }
    },
    changeIsFormSelectedByOtherSupervisor(status) {
      this.stateIsFormSelectedByOtherSupervisor = status
    },
    setCheckboxes() {
      this.stateCheckbeforeTruck = [];
      this.generalForm.checkBeforeTruck.items.forEach((i) => {
        this.stateCheckbeforeTruck.push({
          label: i.caption as string,
          value: false
        });
      });
    },
    setTaskUpdated() {
      this.stateTaskUpdated = true;
    },
    clearTruckCheckBoxes() {
      this.stateCheckbeforeTruck.forEach((trck) => {
        trck.value = false
      })
    },
    async updateDefectHeaderWithTaskKey(
      key,
      payload: UpdateParam[],
      cbmRatingType = ""
    ) {
      const params = {
        ver: "v1",
      };
      try {
        const selectedGroup = this.groups.find((el) => {
          return el.isSelected;
        }) as Group;
        const body = {
          serviceSheetDetailId: selectedGroup.id,
          workorder: selectedGroup.workOrder,
          taskKey: key,
          updateParams: payload,
          employee: {
            id: this.employee.id,
            name: this.employee.name,
          },
        };
        if (cbmRatingType != "") {
          body["cbmRatingType"] = cbmRatingType
        }
        this.stateTaskUpdated = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}?${new URLSearchParams(
            params,
          ).toString()}`,
            body as AxiosRequestConfig,
        );
      } catch (error) {
        sendCustomEvent("fe_event_error_update_defect_with_task_key", {
          errorMessage: error
        })
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        this.globalConnectionStore.setSubmitConnectionError(isNoNetwork)
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
      }
    },
    async updateServiceSheetTaskValue(
      payload: UpdateParam[],
      id: string,
      name: string,
      isHitupdateGroupByParam = true,
      taskKey = ""
    ) {
      let updateStatus = false
      const params = {
        ver: "v1",
      };
      const selectedGroup = this.groups.find((el) => {
        return el.isSelected;
      }) as Group;
      try {
        const body = {
          headerId: selectedGroup.headerId,
          workorder: selectedGroup.workOrder,
          id: selectedGroup.id,
          updateParams: payload,
          employee: {
            id: this.employee.id,
            name: this.employee.name,
          },
        } as any;
        if (taskKey) {
          body.taskKey = taskKey
        }
        this.stateTaskUpdated = false;
        const res = await ApiService.post(
          `${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(
            params,
          ).toString()}`,
            body as AxiosRequestConfig,
        );
        switch (res.data.result.message) {
          case ServiceSheetErrorMessages.SUBMITTED:
            this.stateFormAlreadySubmitted = true
            break;
          case ServiceSheetErrorMessages.CLOSE:
            this.stateFormAlreadyClose = true
            break;
          case ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER:
            this.stateTaskAlreadyUpdated = true
            break;
          default:
            if (res.data.statusCode == 400) {
              this.stateTaskErrorDialog = true
              this.stateErrorMessageTaskErrorDialog = res.data.result.message
            }
            break;
        }
        this.getTaskProgress();
        if (isHitupdateGroupByParam) this.updateGroupByParam(selectedGroup?.groupName, true);
        updateStatus = true
        this.setTaskUpdated()
      } catch (error) {
        sendCustomEvent("fe_event_error_post_service_sheet_task", {
          errorMessage: error
        })
        this.getTaskProgress();
        this.updateGroupByParam(selectedGroup?.groupName, true);
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        this.globalConnectionStore.setSubmitConnectionError(isNoNetwork)
        updateLoggedInStatusFromAPIResponse(error)
        if (isNoNetwork) updateStatus = false
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
      this.stateTaskUpdated = true;
      return updateStatus
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
        sendCustomEvent("fe_event_error_get_task_progress", {
          errorMessage: error
        })
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async getMultiDefectListPerKey(key) {
      const defectStore = useDefectsFormStore();
      this.stateMultiDefectList[key] = await defectStore.getMultipleDefectList(this.stateGeneralForm.workOrder, key, this.selectedGroup?.id as string)
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
    setDropdownToolGroup(key, value) {
      if (value != '') {
        this.stateDropdownToolGroup[key].isFilled = true
        this.stateDropdownToolGroup[key].value = value
      } else {
        this.stateDropdownToolGroup[key].isFilled = false
        this.stateDropdownToolGroup[key].value = ''
      }
    },
    getTaskDataBasedOnTaskKey(taskKey) {
      let taskFound = {}
      this.stateSelectedSubGroups.forEach((subGroup) => {
        subGroup.taskGroup.forEach((taskGroup) => {
          taskGroup.task.forEach((task) => {
            if (task.key == taskKey) {
              taskFound = task
            }
          })
        })
      })
      return taskFound
    },
    async resetCBMAutomation(task) {
      const resetUpdateByDate: PropertyParam[] = [
        {
          propertyName: 'updatedBy',
          propertyValue: ''
        },
        {
          propertyName: 'updatedDate',
          propertyValue: ''
        }
      ]
      const payloadResetTaskValue: UpdateParam[] = [{
        keyValue: task.key as string,
        propertyParams: [
          {
            propertyName: 'taskValue',
            propertyValue: ''
          },
          ...resetUpdateByDate
        ]
      }]

      const payloadResetAdjustment: UpdateParam[] = []
      if (task.adjustment) {
        payloadResetAdjustment.push(
          {
            keyValue: task.adjustment.key as string,
            propertyParams: [
              {
                propertyName: "measurement",
                propertyValue: ''
              },
              {
                propertyName: "rating",
                propertyValue: ''
              },
              {
                propertyName: "pictures",
                propertyValue: JSON.stringify([])
              },
              {
                propertyName: "createdBy",
                propertyValue: ''
              },
              {
                propertyName: "createdDate",
                propertyValue: ''
              },
              {
                propertyName: "commentValue",
                propertyValue: ''
              },
              ...resetUpdateByDate
            ]
          }
        )
      }
      const payloadResetInputCBMAndCamera: UpdateParam[] = []
      const inputCBMAutomaticCategoryItemType = [
        'paramRating',
        'targetRating'
      ]
      task.items.forEach((item) => {
        if ((item.itemType == 'input' && inputCBMAutomaticCategoryItemType.includes(item.categoryItemType)) || item.itemType == 'smallCamera') {
          payloadResetInputCBMAndCamera.push(
            {
              keyValue: item.key,
              propertyParams: [
                {
                  propertyName: 'value',
                  propertyValue: ''
                },
                ...resetUpdateByDate
              ]
            }
          )
        }
      })
      const payload: UpdateParam[] = [
        ...payloadResetTaskValue,
        ...payloadResetInputCBMAndCamera,
        ...payloadResetAdjustment
      ]
      await this.updateServiceSheetTaskValue(payload, "", "")
    },
    updateCameraItemCBMTakePhotoCompleteRating(mappingCamera, itemKey, value) {
      if (this.stateCameraItemCBMTakePhotoCompleteRating[mappingCamera]) {
        this.stateCameraItemCBMTakePhotoCompleteRating[mappingCamera].every((item) => {
          if (item.key == itemKey) {
            item.value = value
            return false
          }
          return true
        })
      }
    },
    async updateGroupByParam(groupName: string, fromUpdateTask = false) {
      this.stateGetDataByParam = false
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
          if ((fromUpdateTask && this.stateSelectedGroup?.groupName == groupName) || !fromUpdateTask) {
            this.stateCameraItemCBMTakePhotoCompleteRating = {}
            this.stateSelectedSubGroups = response.data.result.content.subGroup;
            if (this.stateSelectedGroup) {
              this.stateSelectedGroup.subGroup = response.data.result.content.subGroup;
            }
            this.stateSelectedSubGroups.forEach((subGroup) => {
              subGroup.taskGroup.forEach((taskGroup) => {
                taskGroup.task.forEach((task) => {
                  // only with 'MANUAL_MOUNTING_LEAK'
                  if (task.category == "CBM" && task.rating == "MANUAL_MOUNTING_LEAK") {
                    const cameraItem = task.mappingCamera
                    if (!this.stateCameraItemCBMTakePhotoCompleteRating[cameraItem]) {
                      this.stateCameraItemCBMTakePhotoCompleteRating[cameraItem] = []
                    }
                    task.items.forEach((item) => {
                      if (item.itemType == 'dropDown' && item.ratingType) {
                        // leak & mounting dropdown push to stateCameraItemCBMTakePhotoCompleteRating
                        this.stateCameraItemCBMTakePhotoCompleteRating[cameraItem].push({
                          key: item.key,
                          value: item.value
                        })
                      }
                    })
                  }
                  if (!isUndefined(task.adjustment) && (task.adjustment.rating != '' || task.adjustment.commentValue != '' || task.adjustment.measurement != '')) {
                    task.isShowAdjustmentRow = true
                  }
                  if (!isUndefined(task.replacement) && (task.replacement.rating != '' || task.replacement.commentValue != '' || task.replacement.measurement != '')) {
                    task.isShowReplacementRow = true
                  }
                  if (task.category == "CBM" && task.mappingToolGroup) {
                    if (!this.stateDropdownToolGroup[task.mappingToolGroup]) {
                      this.stateDropdownToolGroup[task.mappingToolGroup] = {
                        isFilled: false,
                        itemKeyDisabledReset: [],
                        value: '',
                        tasksReset: []
                      };
                    }
                    if (this.stateDropdownToolGroup[task.mappingToolGroup].tasksReset.indexOf(task.key) === -1) {
                      this.stateDropdownToolGroup[task.mappingToolGroup].tasksReset.push(task.key);
                    }
                    task.items.forEach((item) => {
                      if (
                        item.itemType == "input" &&
                      item.categoryItemType == "paramRating"
                      ) {
                        if (this.stateDropdownToolGroup[task.mappingToolGroup].itemKeyDisabledReset.indexOf(item.key) === -1) {
                          this.stateDropdownToolGroup[task.mappingToolGroup].itemKeyDisabledReset.push(item.key);
                        }
                      }
                      if (
                        item.key == task.mappingToolGroup && item.value != ''
                      ) {
                        this.stateDropdownToolGroup[task.mappingToolGroup].isFilled = true
                        this.stateDropdownToolGroup[task.mappingToolGroup].value = item.value
                      }
                    });
                  }
                })
              })
            })
            await this.getMultiDefectList()
            await this.getPreviousTandemValue()
            await this.getPreviousBrakePackValue();
            await this.getPreviousReplacementValue(fromUpdateTask)
            this.stateGetDataByParam = true
            // this.getDropdownToolGroupList()
          }
          this.resetCollapse()
        } catch (error) {
          sendCustomEvent("fe_event_error_get_current_tab_service_sheet_data", {
            errorMessage: error
          })
          updateLoggedInStatusFromAPIResponse(error)
          sendErrorEvent('IRONS', error);
          console.log(error);
        }
      } else {
        const generalStore = useGeneralFormStore()
        await generalStore.getServerTimestamp()
      }
    },
    toggleStateGetDataByParam(status) {
      this.stateGetDataByParam = status
    },
    async getPreviousTandemValue() {
      let isFormHasTaskPrevious = false
      let isPreviousTandemHasFilled = false
      if (this.stateSelectedGroup?.key == "MECHANICAL_SERVICE" || this.stateSelectedGroup?.key == "Mechanical_Service") {
        this.statePreviousTandemTasks = []
        this.stateSelectedSubGroups.forEach((subGroup) => {
          subGroup.taskGroup.forEach((taskGroup) => {
            taskGroup.task.forEach((task) => {
              if (task.rating == "AUTOMATIC_PREVIOUS") {
                isFormHasTaskPrevious = true
                const prevTask = {} as DisabledItem
                isFormHasTaskPrevious = true
                prevTask.key = task.key
                this.statePreviousTandemTasks.push(task.key)

                task.items.forEach((item) => {
                  if (item.categoryItemType == "previousParamRating") {
                    if (item.value != "" && item.value != "-") {
                      isPreviousTandemHasFilled = true
                    }
                    prevTask.value = item.value
                  }
                })
                this.stateNewPreviousTandemTasks.push(prevTask)
              }
            })
          })
        })
        if (isFormHasTaskPrevious && !isPreviousTandemHasFilled) {
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
                modelId: this.generalForm.modelId,
                equipmentNumber: this.generalForm.equipment
              } as AxiosRequestConfig,
            );
            let previousTandemArr = [] as any[]
            previousTandemArr = res.data.result.content ? res.data.result.content : []
            // nyamain response api dengan task key
            this.stateSelectedSubGroups.forEach((subGroup) => {
              subGroup.taskGroup.forEach((taskGroup) => {
                taskGroup.task.forEach((task) => {
                  if (task.rating == "AUTOMATIC_PREVIOUS") {
                    previousTandemArr.forEach((prevTan) => {
                      if (prevTan.key == task.key) {
                        task.items.forEach(async (item) => {
                          if (item.categoryItemType == "previousParamRating") {
                            if (item.value != checkPrevValFirstHandler(prevTan)) {
                              item.value = checkPrevValFirstHandler(prevTan)
                              // update data ke task value n item previousParamRating
                              const payload = [
                                {
                                  keyValue: item.key,
                                  propertyParams: [
                                    {
                                      propertyName: "value",
                                      propertyValue: checkPrevValFirstHandler(prevTan)
                                    }
                                  ]
                                }
                              ]
                              try {
                                await this.updateItemServiceSheetDetail(payload)
                              } catch (e) {
                                console.log("serror updatedata setelah tandem drive");
                              }
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
            sendCustomEvent("fe_event_error_get_previous_tandem_data", {
              errorMessage: e
            })
            sendErrorEvent('IRONS', e);
            console.log("error get tandem", e);
          }
        }
      }
    },
    getAllReplacementTasks(): Task[] {
      if (!this.stateSelectedGroup) return []
      const taskReplacement = useTaskReplacement(this.stateSelectedGroup)
      const replacementTasks = taskReplacement.getTaskReplacementInSubGroup(this.stateSelectedSubGroups)
      return replacementTasks
    },
    getReplacementMappingGroupTaskId(tasks: Task[]): Set<string> {
      const rawGroupTaskId = tasks.map((t) => {
        return t.groupTaskId ?? ''
      })
      return new Set<string>(rawGroupTaskId)
    },
    getReplacementPerGroupTask(tasks: Task[], groupTaskId: string): Task[] {
      return tasks.filter((t) => {
        return t.groupTaskId == groupTaskId
      })
    },
    isAllTaskAlreadyHaveRating(tasks: Task[]): boolean {
      let result = true
      for (const task of tasks) {
        const item = task.items.find((i) => {
          return i.categoryItemType == 'targetRating'
        })
        if (item) {
          result = item.value != ''
        }
        if (!result) break
      }
      return result
    },
    checkIfAnyRatingValueSet(tasks: Task[]): boolean {
      let result = false
      for (const task of tasks) {
        const item = task.items.find((i) => {
          return i.categoryItemType === "targetRating"
        })
        if (!item) continue
        result = item.value != ''
        if (result) break
      }
      return result
    },
    async getPreviousReplacementValueFromAPI(): Promise<void> {
      const params = {
        ver: "v1",
      };
      const res: AxiosResponse<SingleApiResponse<PreviousReplacement[]>> = await ApiService.post(
        `${GET_PREVIOUS_REPLACEMENT}?${new URLSearchParams(
          params,
        ).toString()}`,
        {
          modelId: this.generalForm.modelId,
          equipmentNumber: this.generalForm.equipment
        } as AxiosRequestConfig,
      )

      this.statePreviousReplacement = res.data.result.content
    },
    async updatePreviousReplacementValue(tasks: Task[]): Promise<void> {
      for (const task of tasks) {
        const item = task.items.find((i) => {
          return i.categoryItemType === "previousParamRating"
        })
        if (!item) continue
        if (this.statePreviousReplacement.length < 1) {
          await this.getPreviousReplacementValueFromAPI()
        }
        const prev = this.statePreviousReplacement.find((p) => {
          return p.key == task.key
        }) as PreviousReplacement
        const payload = [
          {
            keyValue: item.key,
            propertyParams: [
              {
                propertyName: "value",
                propertyValue: checkPrevValFirstHandler(prev)
              }
            ]
          }
        ]
        try {
          await this.updateItemServiceSheetDetail(payload)
          item.value = checkPrevValFirstHandler(prev)
        } catch (e) {
          console.log(`error when update previous value replacement to server with key ${item.key}`, e);
        }
      }
      await this.updateGroupByParam('ELECTRICAL_SERVICE')
    },
    async updatePreviewReplacementPerTask() {
      console.log('test');
    },
    async getPreviousReplacementValue(isUpdateFromTask: boolean): Promise<void> {
      if (!this.stateSelectedGroup || this.stateSelectedGroup.key != "ELECTRICAL_SERVICE") return
      const replacementTasks = this.getAllReplacementTasks()
      const groupTaskIds = this.getReplacementMappingGroupTaskId(replacementTasks)
      const needToUpdates = [] as Task[]
      for (const groupTaskId of groupTaskIds) {
        const tasks = this.getReplacementPerGroupTask(replacementTasks, groupTaskId)
        const isNeedToUpdate = !this.checkIfAnyRatingValueSet(tasks)
        if (isNeedToUpdate) needToUpdates.push(...tasks)
      }
      try {
        if (needToUpdates.length < 1) return
        if (!isUpdateFromTask) {
          await this.getPreviousReplacementValueFromAPI()
        }
        for (const prev of this.statePreviousReplacement) {
          const task = needToUpdates.find((item) => {
            return item.key === prev.key
          })
          if (!task) continue
          const item = task.items.find((item) => {
            return item.categoryItemType === "previousParamRating"
          })
          if (!item) continue
          item.value = checkPrevValFirstHandler(prev)
        }
      } catch (err) {
        console.log("error when getting previous value replacement from server", err);
      }
    },
    async getCBMResult(task: Task, item: Item, cbmRatingType = '') {
      let rating = '';
      // get task with paramRatingDynamic (get selectTools)
      let toolsValue = ""
      task.items.forEach((item) => {
        if (item.categoryItemType == "dropdownTool" || item.categoryItemType == "dropdownToolDisc") {
          toolsValue = item.value as string
        }
      })

      if (task.mappingToolGroup) {
        for (const key in this.stateDropdownToolGroup) {
          if (key == task.mappingToolGroup) {
            toolsValue = this.stateDropdownToolGroup[key].value as string
          }
        }
      }

      // filter formulas where task == task
      const taskFormulas = this.stateCBMFormulas.filter((formula) => {
        const formNum = formula.taskKey;
        if (item.categoryItemType == "paramRatingDynamic" || task.mappingToolGroup) {
          const isTaskSame = formNum == task.key
          const isUomSame = formula.cbmType == toolsValue
          return isTaskSame && isUomSame
        } else {
          return (formNum == task.key);
        }
      });

      // loop filter
      if (taskFormulas.length > 0) {
        if (item.value === "") {
          await this.deleteExisitingDefectCBMAuto(task)
          return {
            value: '',
            status: true
          };
        }
        console.log(Number(item.value));
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
              headerId: this.selectedGroup!.headerId,
              workOrder: this.selectedGroup!.workOrder,
              id: this.selectedGroup?.id,
              employee: this.employee,
              defectHeader: {
                workorder: this.generalForm.workOrder,
                form: this.generalForm.form,
                serviceSheetDetailId: this.selectedGroup?.id,
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

            if (cbmRatingType != '') {
              defectPayload.defectHeader["cbmRatingType"] = cbmRatingType
            }
            try {
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
              if (res.data.result.message == ServiceSheetErrorMessages.CLOSE) {
                this.stateFormAlreadyClose = true
                return {
                  value: '',
                  status: false
                }
              }
            } catch (error) {
              sendCustomEvent("fe_event_error_post_defect_cbm", {
                errorMessage: error
              })
              sendErrorEvent('IRONS', error);
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
            await this.updateItemServiceSheetDetail(itemParam)
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
            return {
              value: rating,
              status: true
            }
          }
        } else {
          await this.deleteExisitingDefectCBMAuto(task)
          return {
            value: '',
            status: true
          };
        }
      } else {
        if (item.categoryItemType == "paramRatingDynamic" && !item.value) {
          return {
            value: '',
            status: true
          };
        } else {
          this.stateRatingNotMapped = true
          console.log('rating CBM for this task is not mapped on ADM');
          return {
            value: '',
            status: false
          };
        }
      }
    },
    getCBMFormula(taskKey: string) {
      return this.stateCBMFormulas.filter((formula) => {
        return formula.taskKey == taskKey
      })
    },
    getCBMRatingValue(formulas: ListItem[], value: string) {
      let rating = ''
      formulas.every((formula) => {
        // check 1st param
        const checkMin = checkMinValue(formula, value)
        // check 2nd param
        const checkMax = checkMaxValue(formula, value)
        rating = checkRating(checkMin, checkMax, formula)
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
      })
      return rating
    },
    isAnyPreviousMeasurement(task: Task) {
      const item = task.items.find((i) => {
        return i.categoryItemType == 'previousParamRating'
      })
      if (item) {
        return item.value && item.value != '-'
      }
      return false
    },
    createCBMDefect(task: Task, rating: string): Promise<AxiosResponse<any>> {
      const authStore = useAuthenticationStore()
      const params = {
        ver: "v1",
      }
      const taskNo = `${task.description.split(';')[0]};${task.description.split(';')[1]}`
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
        headerId: this.selectedGroup!.headerId,
        workOrder: this.selectedGroup!.workOrder,
        id: this.selectedGroup?.id,
        employee: this.employee,
        defectHeader: {
          workorder: this.generalForm.workOrder,
          form: this.generalForm.form,
          serviceSheetDetailId: this.selectedGroup?.id,
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
      }
      return ApiService.post(
        `${UPDATE_TASK_WITH_DEFECT}?${new URLSearchParams(
          params,
        ).toString()}`,
        defectPayload as AxiosRequestConfig,
      )
    },
    async updateParamRatingItem(taskKey: string, itemKey: string, rating: string) {
      const payload: UpdateParam[] = [
        {
          keyValue: itemKey,
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
        }
      ]
      if (rating == 'A' || rating == 'B') {
        payload.push({
          keyValue: taskKey,
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
        })
      }
      await this.updateServiceSheetTaskValue(
        payload,
        this.employee.id.toString(),
        this.employee.name,
        false
      )
    },
    async getCBMResultGap(task: Task, item: Item) {
      const formulas = this.getCBMFormula(task.key)
      if (formulas.length < 1) {
        this.stateRatingNotMapped = true
        return {
          value: '',
          status: false
        };
      }
      /* if item value is empty or undefined */
      if (!item.value) {
        await this.deleteExisitingDefectCBMAuto(task)
        return {
          value: '',
          status: true
        };
      }
      const currentValue = Number(item.value)
      if (currentValue > 52) {
        await this.deleteExisitingDefectCBMAuto(task)
        throw Error('value is out of range')
      }
      let rating = 'A'
      const gapFormula = formulas.filter((f) => {
        return f.cbmType == 'CBM_GAP'
      })
      /* need to check if any previous measurement */
      const hasPreviousValue = this.isAnyPreviousMeasurement(task)
      if (hasPreviousValue) {
        const prevItem = task.items.find((i) => {
          return i.categoryItemType == 'previousParamRating'
        }) as Item
        const prevValue = Number(prevItem.value)
        if (currentValue > prevValue) {
          // throw new Error
          throw Error('value is out of range')
        }
        const difference = Math.abs(currentValue - prevValue).toFixed(2)
        rating = this.getCBMRatingValue(gapFormula, difference.toString())
      }
      if (!rating) {
        await this.deleteExisitingDefectCBMAuto(task)
        return {
          value: '',
          status: true
        };
      }
      try {
        const res = await this.createCBMDefect(task, rating)
        if (res.data.result.message == ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER) {
          this.stateTaskAlreadyUpdated = true
        }
        if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
          this.stateFormAlreadySubmitted = true
        }
        if (res.data.result.message == ServiceSheetErrorMessages.CLOSE) {
          this.stateFormAlreadyClose = true
        }
        if (this.stateTaskAlreadyUpdated || this.stateFormAlreadySubmitted || this.stateFormAlreadyClose) {
          return {
            value: '',
            status: false
          }
        }
      } catch (error) {
        sendCustomEvent("fe_event_error_post_defect_cbm", {
          errorMessage: error
        })
      }
      const targetItem = task.items.find((taskItem: Item) => {
        return taskItem.categoryItemType == "targetRating";
      })
      if (targetItem) {
        targetItem.value = rating
        await this.updateParamRatingItem(task.key, targetItem.key, rating)
      }
      return {
        value: rating,
        status: true
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
            propertyName: 'taskValue',
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
        if (item.categoryItemType == "targetRating" || (task.category === "CBM" && item.itemType == "dropDown") || (task.category === "NORMAL" && item.itemType == "dropDown") || (task.category === "CRACK" && item.itemType == "dropDown")) {
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
          // console.log("ngecek item value ni c | x", item.value);
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
              sendCustomEvent("fe_event_error_update_defect_header", {
                errorMessage: error
              })
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
        headerId: this.stateSelectedGroup!.headerId,
        workorder: this.stateSelectedGroup!.workOrder,
        id: this.stateSelectedGroup!.id,
        updateParams: taskPayload,
        employee: this.employee
      }
      // send data to be
      try {
        await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
      } catch (error) {
        sendCustomEvent("fe_event_error_post_service_sheet_task", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getEhmsRating() {
      const params = {
        ver: "v1",
        model: this.stateModelName,
        psType: this.statePsTypeId,
        // psType: '10000'
      };
      if (this.stateModelName && this.statePsTypeId) {
        try {
          const response: AxiosResponse<ApiResponse<any>> = await ApiService.get(
            GET_PARAMETER_EHMS_API_URL,
            '',
            new URLSearchParams(params).toString(),
          );
          this.stateCBMFormulas = response.data.result.content[0].detail;
        } catch (error) {
          sendCustomEvent("fe_event_error_get_ehms_rating", {
            errorMessage: error
          })
          updateLoggedInStatusFromAPIResponse(error)
          sendErrorEvent('IRONS', error);
          console.log(error);
        }
      }
    },
    async getValueFromItemKey(key: string) {
      const body = {
        id: this.selectedGroup!.id,
        keyValue: key,
        propertyName: "value",
      };
      const params = {
        ver: "v1",
      };
      let val = '';
      try {
        const response: AxiosResponse<SingleApiResponse<string>> =
          await ApiService.post(
            `${GET_DETAIL_FIELD_VALUE}?${new URLSearchParams(params).toString()}`,
            body as AxiosRequestConfig,
          );
        if (!isUndefined(response.data.result.content)) {
          val = response.data.result.content;
        }
      } catch (error) {
        sendCustomEvent("fe_event_error_get_smu_tolerance_data", {
          errorMessage: error
        })
        sendErrorEvent('IRONS', error);
      }
      return val;
    },
    // fitter is employee who assigned service sheet
    updateSelectedFitter(employee: Mechanic) {
      this.stateEmployee = employee;
    },
    updateServiceStart(serviceStart: string) {
      const generalEform = useGeneralFormStore()
      this.stateServiceStart = serviceStart;
      this.stateShift = dayNightConverter(generalEform.stateTimeZone);
    },
    resetMechanic() {
      this.stateEmployee = {} as Mechanic;
      this.stateServiceStart = '';
      this.stateShift = '';
    },
    resetDefectMultiList() {
      this.stateMultiDefectList = {}
    },
    updateGeneralValue(key, value) {
      this.stateGeneralForm[key] = value
    },
    setNextPage() {
      const currentGroup = this.stateGroups.findIndex((group) => {
        return group.groupName == this.stateSelectedGroup?.groupName
      })
      // let isNextGroupActive = false
      let inc = 1
      let nextGroup = this.stateGroups[(currentGroup + inc)]
      while (!isUndefined(nextGroup.isDisable) && nextGroup.isDisable == "true") {
        inc++
        nextGroup = this.stateGroups[(currentGroup + inc)]
      }
      // nextGroup = this.stateGroups[(currentGroup + 1)]
      this.setSelectedGroup(nextGroup.id)
      this.updateGroupByParam(nextGroup.groupName)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    async setShowNextPage(buttonLable = "") {
      const params = {
        ver: "v1",
      };
      let isFormComplete = true
      try {
        const body = {
          modelId: this.generalForm.modelId,
          psTypeId: this.generalForm.psTypeId,
          workOrder: this.generalForm.workOrder,
          headerId: this.serviceSheets[0].headerId
        };
        const response: AxiosResponse<SingleApiResponse<TaskProgress[]>> = await ApiService.post(`${GET_TASK_PROGRESS_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
        if (response.data.result.content.length < 1) isFormComplete = false
        response.data.result.content.forEach((item) => {
          if (item.doneTask != item.totalTask) {
            isFormComplete = false
          }
        });
      } catch (error) {
        sendCustomEvent("fe_event_error_handle_show_next_page", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
        isFormComplete = false
        sendErrorEvent('IRONS', error);
      }
      if (!isFormComplete) {
        if (!this.stateSkipPreService) {
          const preseviceName = "PRE_SERVICE_OPERATIONAL_CHECK"
          // next group question
          if (this.selectedGroup!.groupName == preseviceName) {
            await this.getTaskProgress()
            const preserviceTask = this.groups.find((group) => {
              return group.groupName == preseviceName
            })
            if (preserviceTask!.doneTask != preserviceTask!.totalTask) {
              this.setSelectedGroup(preserviceTask!.id)
              this.updateGroupByParam(preserviceTask!.groupName)
              this.stateShowPreTaskNotComplete = true
            } else {
              this.setNextPage()
            }
          } else {
            this.setNextPage()
          }
        } else {
          this.setNextPage()
        }
        return false
      } else {
        // get status
        const generalStore = useGeneralFormStore()
        const status = await generalStore.getServiceSheetHeaderKeyValue('status')
        if (status == 'Submited') {
          if (buttonLable != "Submit") {
            this.setNextPage()
            this.stateFormAlreadySubmitted = false
          } else {
            this.stateFormAlreadySubmitted = true
          }
        } else {
          // update status to Submit
          return true
        }
      }
    },
    async submitEform() {
      const params = {
        ver: "v1"
      };
      const propertyParams: PropertyParam[] = [
        {
          propertyName: 'status',
          propertyValue: 'Submited'
        },
        {
          propertyName: 'updatedBy',
          propertyValue: JSON.stringify(this.employee)
        },
        {
          propertyName: 'updatedDate',
          propertyValue: '<<ServerDateTime>>'
        },
        {
          propertyName: 'serviceEnd',
          propertyValue: '<<ServerDateTime>>'
        },
        {
          propertyName: 'tsServiceEnd',
          propertyValue: '<<ServerTimeStamp>>'
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
        employee: this.employee,
        localStatus: this.generalForm.status
      }
      try {
        await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
        return true;
      } catch (error) {
        sendCustomEvent("fe_event_error_submit_form", {
          errorMessage: error
        })
        sendErrorEvent('IRONS', error);
        console.log(error);
        return false
      }
    },
    async updateCBMLeakMounting(task, val, item) {
      if (val == "C" || val == "X") {
        return this.updateDefect(task, val, item)
      } else {
        let labelTaskValue = "taskValue"
        if (item.ratingType) {
          if (item.ratingType == "Leak") {
            labelTaskValue = "taskValueLeak"
          } else if (item.ratingType == "Mounting") {
            labelTaskValue = "taskValueMounting"
          }
        }

        const taskValuePayload = [{
          keyValue: task.key,
          propertyParams: [
            {
              propertyName: labelTaskValue,
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
        }]

        const itemValuePayload = [{
          keyValue: item.key,
          propertyParams: [
            {
              propertyName: 'value',
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
        }]

        return this.updateServiceSheetTaskValue([
          ...taskValuePayload,
          ...itemValuePayload
        ], "", "")
      }
    },
    async updateDefect(task, val, item) {
      const authStore = useAuthenticationStore();
      const params = {
        ver: "v1",
      };
      const firstDescription = task.description.split(" ")[0].replaceAll(".", "")
      let taskNo = ''
      if (firstDescription.includes(";;")) {
        taskNo = `${firstDescription.split(';;')[0]};${firstDescription.split(';;')[1]}`
      } else {
        taskNo = `${firstDescription.split(';')[0]};${firstDescription.split(';')[1]}`;
      }

      let labelTaskValue = "taskValue"
      if (item.ratingType) {
        if (item.ratingType == "Leak") {
          labelTaskValue = "taskValueLeak"
        } else if (item.ratingType == "Mounting") {
          labelTaskValue = "taskValueMounting"
        }
      }
      const defectPayload = {
        updateParams: [
          {
            keyValue: task.key,
            propertyParams: [
              {
                propertyName: labelTaskValue,
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
        headerId: this.selectedGroup!.headerId,
        workorder: this.selectedGroup!.workOrder,
        id: this.selectedGroup?.id,
        employee: this.employee,
        defectHeader: {
          workorder: this.generalForm.workOrder,
          form: this.generalForm.form,
          serviceSheetDetailId: this.selectedGroup?.id,
          category: task.category,
          taskId: task.key,
          taskNo: taskNo,
          taskDesc: item.ratingType ? `${task.items[2].value} - ${item.ratingType}` : task.items[2].value,
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
        switch (res.data.result.message) {
          case ServiceSheetErrorMessages.SUBMITTED:
            this.toggleFormAlreadySubmitted(true)
            return false
          case ServiceSheetErrorMessages.CLOSE:
            this.toggleFormAlreadyClose(true)
            return false
          case ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER:
            this.toggleTaskAlreadyUpdatedStatus(true)
            return false
          default:
            if (res.data.statusCode == 400) {
              this.toogleTaskErrorDialog(true)
              this.stateErrorMessageTaskErrorDialog = res.data.result.message
              return false
            }
            break;
        }
        this.stateMeasurementValue = '';
        this.stateUOM = '';
        this.stateImageKey = '';

        // -------- case reset na field -------
        let resetOtherItemFieldParam = {} as UpdateParam
        let taskNormalValueParam = {} as UpdateParam
        if (item.categoryItemType == "resultRating") {
          // await this.deleteDefect(task)
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
        }) as Group
        this.getTaskProgress()
        this.updateGroupByParam(selectedGroup?.groupName)
        return true
      } catch (error) {
        sendCustomEvent("fe_event_error_post_defect_data", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
        return false
      }
    },
    toggleNotMapped(status) {
      this.stateRatingNotMapped = status
    },
    async getOilTolerance() {
      this.stateOilToleranceNotMapped = false
      const params = {
        Model: '',
        PsType: '',
        Parameter: '',
        Uom: '',
        StartDate: '',
        EndDate: '',
        Page: '1',
        PageSize: '1',
        Order: '',
        ver: 'v1'
      };
      const setDefaultOil = () => {
        this.stateOilTolerance = {
          min: -5,
          max: +5,
          uom: '%'
        }
        this.stateOilToleranceNotMapped = true
        console.log('oil tolerance not mapped on ADM');
      }
      try {
        const response: AxiosResponse<ApiResponse<OilToleranceListItem>> = await ApiService.get(CRUD_URL, '', new URLSearchParams(params).toString())
        const OilTolerance = response.data.result.content[0]
        if (!isUndefined(OilTolerance)) {
          if (OilTolerance.isActive) {
            this.stateOilTolerance = {
              min: Number(OilTolerance.valueMin),
              max: Number(OilTolerance.valueMax),
              uom: OilTolerance.uom
            }
          } else {
            setDefaultOil()
          }
        } else {
          setDefaultOil()
        }
      } catch (error) {
        sendCustomEvent("fe_event_error_get_oil_tolerance_data", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        setDefaultOil()
        sendErrorEvent('IRONS', error);
      }
    },
    toggleTaskAlreadyUpdatedStatus(status) {
      this.stateTaskAlreadyUpdated = status
    },
    toogleTaskErrorDialog(status) {
      this.stateTaskErrorDialog = status
    },
    async updateRiskAssesment(updated: RiskAssesmentValue[]) {
      this.generalForm.riskAssesment[0].value = updated as unknown as any
      await this.updatePreRiskAssesmentToBE()
    },
    async deleteRisAssesmentPic(deletedImage: string) {
      let arr = this.generalForm.riskAssesment[0].value as any[]
      arr = arr.filter((image) => {
        if (typeof image.image === 'string') {
          return image.image != deletedImage
        } else {
          return image.image.filename != deletedImage
        }
      })
      this.generalForm.riskAssesment[0].value = arr
      await this.updatePreRiskAssesmentToBE()
    },
    async updatePreRiskAssesmentToBE() {
      const authStore = useAuthenticationStore();
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
        employee: this.stateEmployee,
        localStatus: this.generalForm.status
      }
      const params = {
        ver: 'v1'
      }
      try {
        await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
        await this.refreshWash(authStore.user.EmployeeId, authStore.user.Name, authStore.user.SiteId)
      } catch (error) {
        sendCustomEvent("fe_event_error_post_risk_assessment_photo", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
        console.log('upload risk Assesment', error);
      }
    },
    async updateItemServiceSheetDetail(payload) {
      const params = {
        ver: "v1",
      }
      const selectedGroup = this.groups.find((el) => {
        return el.isSelected;
      }) as Group;
      const body = {
        headerId: selectedGroup.headerId,
        workorder: selectedGroup.workOrder,
        id: selectedGroup.id,
        updateParams: payload,
        employee: {
          id: this.employee.id,
          name: this.employee.name,
        },
      };
      try {
        await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
      } catch (error) {
        sendCustomEvent("fe_event_error_post_service_sheet_data", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
        console.log('error update item', error);
      }
    },
    // ------- adjustment CBM auto --------
    async getAdjusmentRating(task: Task) {
      const params = {
        ver: 'v1'
      }
      let rating;
      let toolsValue = "";
      if (task.mappingToolGroup) {
        for (const key in this.stateDropdownToolGroup) {
          if (key == task.mappingToolGroup) {
            toolsValue = this.stateDropdownToolGroup[key].value as string
          }
        }
      }

      // filter formulas where task == task
      // var taskFormulas berupa array mapping CBM nomor yang sedang dicari
      const taskFormulas = this.stateCBMFormulas.filter((formula) => {
        const formNum = formula.taskKey
        if (task.mappingToolGroup) {
          const isTaskSame = formNum == task.key
          const isUomSame = formula.cbmType == toolsValue
          return isTaskSame && isUomSame
        } else if (typeof task.items[0].value == "string") {
          return (formNum == task.key);
        }
      });
      // loop formula untuk mendapatkan jawaban
      if (taskFormulas.length > 0) {
        taskFormulas.every((formula) => {
          // check 1st param
          const checkMin = checkMinValue(formula, task.adjustment.measurement);
          // check 2nd param
          const checkMax = checkMaxValue(formula, task.adjustment.measurement);
          rating = checkRating(checkMin, checkMax, formula);
          if (rating) {
            return false;
          } else {
            return true;
          }
        });
      }
      if (task.adjustment.measurement == "") {
        task.adjustment.rating = ""
      } else {
        task.adjustment.rating = rating
      }
      if (rating) {
        // get defect header
        const defectHeaderPayload = {
          taskId: task.key,
          workorder: this.stateWorkOrder
        }
        const defectHeaderResponse: AxiosResponse<SingleApiResponse<DefectList>> = await ApiService.post(`${GETDEFECTHEADERBYPARAMURL}?${new URLSearchParams(params).toString()}`, defectHeaderPayload as AxiosRequestConfig);
        const defectHeader = defectHeaderResponse.data.result.content
        // update data defect by condition
        let updateDefectHeaderPayload
        if (rating == "C" || rating == "X") {
          updateDefectHeaderPayload = {
            id: defectHeader.id,
            updateParams: [
              {
                keyValue: defectHeader.key,
                propertyParams: [
                  {
                    propertyName: 'taskValue',
                    propertyValue: rating
                  },
                  {
                    propertyName: "cbmImageKey",
                    propertyValue: task.adjustment.key
                  },
                  {
                    propertyName: "cbmImageProp",
                    propertyValue: 'pictures'
                  },
                  {
                    propertyName: "cbmMeasurement",
                    propertyValue: task.adjustment.measurement
                  },
                  {
                    propertyName: "cbmUom",
                    propertyValue: task.adjustment.uom
                  },
                  {
                    propertyName: "isCbmAdjusment",
                    propertyValue: 'true'
                  },
                  {
                    propertyName: "isActive",
                    propertyValue: 'true'
                  },
                ]
              }
            ],
            employee: this.employee
          }
        } else if (rating == "A" || rating == "B") {
          updateDefectHeaderPayload = {
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
        }
        try {
          await ApiService.post(`${UPDATEDEFECTHEADERURL}?${new URLSearchParams(params).toString()}`, updateDefectHeaderPayload as AxiosRequestConfig)
        } catch (error) {
          sendCustomEvent("fe_event_error_update_defect_header_data", {
            errorMessage: error
          })
          updateLoggedInStatusFromAPIResponse(error)
          sendErrorEvent('IRONS', error);
          console.log(error)
        }
      }
      const propertyParams = {
        keyValue: task.adjustment.key, // this will be adjustment key
        propertyParams: [
          {
            propertyName: "measurement",
            propertyValue: task.adjustment.rating ? task.adjustment.measurement : ""
          },
          {
            propertyName: "rating",
            propertyValue: task.adjustment.measurement ? task.adjustment.rating : ""
          },
          {
            propertyName: "updatedBy",
            propertyValue: task.adjustment.measurement && task.adjustment.rating ? JSON.stringify(this.employee) : ""
          },
          {
            propertyName: "updatedDate",
            propertyValue: task.adjustment.measurement && task.adjustment.rating ? "<<ServerDateTime>>" : ""
          },
        ]
      }
      if (task.adjustment.createdDate == '') {
        propertyParams.propertyParams = [
          ...propertyParams.propertyParams,
          ...[
            {
              propertyName: "createdBy",
              propertyValue: JSON.stringify(this.employee)
            },
            {
              propertyName: "createdDate",
              propertyValue: "<<ServerDateTime>>"
            }
          ]
        ]
      }
      const adjustmentPayload = {
        headerId: this.selectedGroup?.headerId,
        workorder: this.stateWorkOrder,
        id: this.selectedGroup!.id,
        updateParams: [
          propertyParams
        ],
        "employee": this.employee
      }
      try {
        const res = await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, adjustmentPayload as AxiosRequestConfig);
        if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
          this.stateFormAlreadySubmitted = true
        }
        if (res.data.result.message == ServiceSheetErrorMessages.CLOSE) {
          this.stateFormAlreadyClose = true
        }
        this.getTaskProgress()
        this.updateGroupByParam(this.stateSelectedGroup!.groupName)
      } catch (error) {
        sendCustomEvent("fe_event_error_post_service_sheet_data", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
      return rating
    },
    async deleteAdjusmentTask(task: Task) {
      const params = {
        ver: 'v1'
      }
      const defectHeaderPayload = {
        taskId: task.key,
        workorder: this.stateWorkOrder
      }
      const defectHeaderResponse: AxiosResponse<SingleApiResponse<DefectList>> = await ApiService.post(`${GETDEFECTHEADERBYPARAMURL}?${new URLSearchParams(params).toString()}`, defectHeaderPayload as AxiosRequestConfig);
      const defectHeader = defectHeaderResponse.data.result.content
      // revert taskValue to initial value and change isdeleted to be false
      let imageKey = ''
      let measurementVal = ''
      task.items.forEach((item) => {
        if (item.itemType == 'smallCamera') {
          imageKey = item.key
        }
        if (item.categoryItemType == 'paramRating') {
          measurementVal = item.value as string
        }
      })
      const revertDefectHeaderPayload = {
        id: defectHeader.id,
        updateParams: [
          {
            keyValue: defectHeader.key,
            propertyParams: [
              {
                propertyName: 'taskValue',
                propertyValue: task.taskValue
              },
              {
                propertyName: "cbmImageKey",
                propertyValue: imageKey
              },
              {
                propertyName: "cbmImageProp",
                propertyValue: 'value'
              },
              {
                propertyName: "cbmMeasurement",
                propertyValue: measurementVal
              },
              {
                propertyName: "isCbmAdjusment",
                propertyValue: 'false'
              },
              {
                propertyName: "isActive",
                propertyValue: 'true'
              },
            ]
          }
        ],
        employee: this.employee
      }
      try {
        await ApiService.post(`${UPDATEDEFECTHEADERURL}?${new URLSearchParams(params).toString()}`, revertDefectHeaderPayload as AxiosRequestConfig)
      } catch (error) {
        sendCustomEvent("fe_event_error_delete_adjusment_task", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      const adjustmentPayload = {
        headerId: this.selectedGroup?.headerId,
        workorder: this.stateWorkOrder,
        id: this.selectedGroup!.id,
        updateParams: [
          {
            keyValue: task.adjustment.key, // this will be adjustment key
            propertyParams: [
              {
                propertyName: "measurement",
                propertyValue: ''
              },
              {
                propertyName: "rating",
                propertyValue: ''
              },
              {
                propertyName: "updatedBy",
                propertyValue: ''
              },
              {
                propertyName: "updatedDate",
                propertyValue: ''
              },
              {
                propertyName: "pictures",
                propertyValue: JSON.stringify([])
              },
              {
                propertyName: "createdBy",
                propertyValue: ''
              },
              {
                propertyName: "createdDate",
                propertyValue: ''
              },
              {
                propertyName: "commentValue",
                propertyValue: ''
              }
            ]
          }
        ],
        "employee": this.employee
      }
      try {
        const res = await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, adjustmentPayload as AxiosRequestConfig);
        if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
          this.stateFormAlreadySubmitted = true
        }
        if (res.data.result.message == ServiceSheetErrorMessages.CLOSE) {
          this.stateFormAlreadyClose = true
        }
        this.getTaskProgress()
        this.updateGroupByParam(this.stateSelectedGroup!.groupName)
      } catch (error) {
        sendCustomEvent("fe_event_error_post_service_sheet_task", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async addCBMAdjustmentPictures(task: Task) {
      const params = {
        ver: 'v1'
      }
      const propertyParams = {
        keyValue: task.adjustment.key, // this will be adjustment key
        propertyParams: [
          {
            propertyName: "pictures",
            propertyValue: JSON.stringify(task.adjustment.pictures)
          },
          {
            propertyName: "updatedBy",
            propertyValue: JSON.stringify(this.employee)
          },
          {
            propertyName: "updatedDate",
            propertyValue: "<<ServerDateTime>>"
          },
        ]
      }
      const adjustmentPayload = {
        headerId: this.selectedGroup?.headerId,
        workorder: this.stateWorkOrder,
        id: this.selectedGroup!.id,
        updateParams: [
          propertyParams
        ],
        "employee": this.employee
      }
      try {
        const res = await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, adjustmentPayload as AxiosRequestConfig);
        if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
          this.stateFormAlreadySubmitted = true
        }
        if (res.data.result.message == ServiceSheetErrorMessages.CLOSE) {
          this.stateFormAlreadyClose = true
        }
        this.getTaskProgress()
        this.updateGroupByParam(this.stateSelectedGroup!.groupName)
      } catch (error) {
        sendCustomEvent("fe_event_error_post_adjusment_image", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    // ------- adjustment CBM auto --------
    // ------- Update dorpdown tool and UOM and trigger rating --------
    handleGetUomFromSelectedTool(task: Task, value: string) {
      // dapetin array perhitungan di cbm mapping berdasarkan task
      // filter formulas where task == task
      const taskFormulas = this.stateCBMFormulas.filter((formula) => {
        const formNum = formula.taskKey;
        if (typeof task.items[0].value == "string") {
          return formNum == task.key
        }
      });
      console.log("value", value, "taskFormulas", taskFormulas);
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
        headerId: this.stateSelectedGroup!.headerId,
        workorder: this.stateSelectedGroup!.workOrder,
        id: this.stateSelectedGroup!.id,
        updateParams: taskPayload,
        employee: this.employee
      }
      // send data to be
      try {
        await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
      } catch (error) {
        sendCustomEvent("fe_event_error_post_service_sheet_task_tool_uom", {
          errorMessage: error
        })
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
              sendCustomEvent("fe_event_error_update_defect_header_cbm", {
                errorMessage: error
              })
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
      this.cameraStore.clearImageById(cameraValParam.keyValue)
      // payload to be sent to BE
      const body = {
        headerId: this.stateSelectedGroup!.headerId,
        workorder: this.stateSelectedGroup!.workOrder,
        id: this.stateSelectedGroup!.id,
        updateParams: taskPayload,
        employee: this.employee
      }
      // send data to be
      try {
        await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
      } catch (error) {
        sendCustomEvent("fe_event_error_post_service_sheet_task", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      await this.getTaskProgress()
      await this.updateGroupByParam(this.stateSelectedGroup!.groupName)
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
      if (!defectHeader) return
      const updateDefectHeaderPayload = {
        id: defectHeader.id,
        updateParams: [
          {
            keyValue: defectHeader.key,
            propertyParams: [
              // {
              //   propertyName: 'isDeleted',
              //   propertyValue: 'true'
              // },
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
        sendCustomEvent("fe_event_error_update_defect_header", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async updateItemFromTask(updateParam) {
      const params = {
        ver: "v1"
      }
      const body = {
        headerId: this.stateSelectedGroup!.headerId,
        workorder: this.stateSelectedGroup!.workOrder,
        id: this.stateSelectedGroup!.id,
        updateParams: updateParam,
        employee: this.employee
      }
      try {
        await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
      } catch (error) {
        sendCustomEvent("fe_event_error_post_service_sheet_task", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      await this.getTaskProgress()
      await this.updateGroupByParam(this.stateSelectedGroup!.groupName)
    },
    async updateSuspensionCylinderTask(task: Task, item: Item) {
      const taskFormulas = this.stateCBMFormulas.filter((formula) => {
        const formNum = formula.taskKey;
        return formNum == task.key
      });
      console.log("task formulas", taskFormulas);

      let rating
      taskFormulas.every((formula) => {
        // check 1st param
        const checkMin = checkMinValue(formula, item.value);
        // check 2nd param
        const checkMax = checkMaxValue(formula, item.value);
        rating = checkRating(checkMin, checkMax, formula);
        console.log("checkMin", checkMin, "checkMax", checkMax, "formula", formula);
        if (rating) {
          return false;
        } else {
          return true;
        }
      });

      const targetItem = task.items.find((taskItem: Item) => {
        return taskItem.categoryItemType == "suspensionTargetRating";
      });

      const itemParam: UpdateParam[] = [
        // task
        {
          keyValue: task.key,
          propertyParams: [
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
        // item
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
        // input item
        {
          keyValue: item!.key,
          propertyParams: [
            {
              propertyName: 'value',
              propertyValue: item.value
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
      await this.updateItemServiceSheetDetail(itemParam)
      await this.updateGroupByParam(this.stateSelectedGroup!.groupName)
      // update data to stored suspension cylinder
      this.stateStoredSuspensionCylinderValue.forEach((item) => {
        if (targetItem!.key == item.key) {
          item.value = rating
        }
      })
      console.log("this.stateStoredSuspensionCylinderValue", this.stateStoredSuspensionCylinderValue);
      // let suspensionNotFilled = false
      // this.stateStoredSuspensionCylinderValue.forEach((item) => {
      //   if (item.value == "") {
      //     suspensionNotFilled = true
      //   }
      // })
      // let suspensionOutOfSpec = false
      // if (!suspensionNotFilled) {
      // this.stateStoredSuspensionCylinderValue.forEach((item) => {
      //   if (item.value == "Out of spec" || item.value == "Out Spec") {
      //     suspensionOutOfSpec = true
      //   }
      // })
      // }
      const checkSpecValue = this.stateStoredSuspensionCylinderValue.filter((item) => {
        return item.value == "Out of spec" || item.value == "Out Spec"
      })

      if (checkSpecValue.length == 1) {
        if (rating == "Out of spec" || rating == "Out Spec") {
          this.stateShowSCConfirmToSPC = true
        }
      }
      // console.log("kelar update suspension")
    },
    async updateAdjustmentSuspensionCylinderTask(task: Task, item: Item) {
      const taskFormulas = this.stateCBMFormulas.filter((formula) => {
        const formNum = formula.taskKey;
        return formNum == item.mappingKeyId
      });
      console.log("task formulas", taskFormulas);

      let rating
      taskFormulas.every((formula) => {
        // check 1st param
        const checkMin = checkMinValue(formula, item.value);
        // check 2nd param
        const checkMax = checkMaxValue(formula, item.value);
        rating = checkRating(checkMin, checkMax, formula);
        console.log("checkMin", checkMin, "checkMax", checkMax, "formula", formula);
        if (rating) {
          return false;
        } else {
          return true;
        }
      });

      const targetItem = task.items.find((taskItem: Item) => {
        return taskItem.categoryItemType == "adjustmentSuspensionTargetRating";
      });

      const itemParam: UpdateParam[] = [
        // task
        {
          keyValue: task.key,
          propertyParams: [
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
        // item
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
      await this.updateItemServiceSheetDetail(itemParam)

      this.checkAllAdjustedSCFilled({
        key: targetItem!.key,
        value: rating as string
      })
    },
    toggleShowSCConfirmToSPV(status) {
      this.stateShowSCConfirmToSPC = status
    },
    toggleShowSCdjustmentWarning(status) {
      this.stateShowSCAdjustmentWarning = status
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
    checkAllAdjustedSCFilled(item: DisabledItem) {
      // const checkSpecValue = this.stateStoredAdjustedSuspensionCylinderValue.filter((item) => {
      //   return item.value == "Out of spec" || item.value == "Out Spec"
      // })
      // console.log("checkSpecValue", checkSpecValue);

      // if (checkSpecValue.length == 1) {
      //   if (item.value == "Out of spec" || item.value == "Out Spec") this.stateShowSCAdjustmentWarning = true
      // }
      // console.log("this.stateShowSCAdjustmentWarning", this.stateShowSCAdjustmentWarning);

      this.stateStoredAdjustedSuspensionCylinderValue.forEach((el) => {
        if (el.key == item.key) {
          el.value = item.value
        }
      })

      let adjustmentNotFilled = false
      this.stateStoredAdjustedSuspensionCylinderValue.forEach((item) => {
        if (item.value == "") {
          adjustmentNotFilled = true
        }
      })
      if (!adjustmentNotFilled && !this.stateIsShowCalibrationConfirm) {
        this.stateShowConfirmToCalibrateSC = true
        this.stateIsShowCalibrationConfirm = true
      }
    },
    toggleIsShowCalibrationConfirm(status) {
      this.stateIsShowCalibrationConfirm = status
    },
    toggleShowConfirmToCalibrateSC(status) {
      this.stateShowConfirmToCalibrateSC = status
    },
    toggleShowPreTaskNotComplete(status) {
      this.stateShowPreTaskNotComplete = status
    },
    async updateDefectCalibrationDropdown(task: Task, item: Item) {
      // update defect
      const authStore = useAuthenticationStore();
      console.log(task.description);
      const defectPayload = {
        updateParams: [
          {
            keyValue: task.key,
            propertyParams: [
              {
                propertyName: "taskValue",
                propertyValue: item.value,
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
        headerId: this.selectedGroup!.headerId,
        workorder: this.selectedGroup!.workOrder,
        id: this.selectedGroup?.id,
        employee: this.employee,
        defectHeader: {
          workorder: this.generalForm.workOrder,
          form: this.generalForm.form,
          serviceSheetDetailId: this.selectedGroup?.id,
          category: task.category,
          taskId: task.key,
          taskNo: task.description.split(";;")[0],
          taskDesc: task.description.split(";;")[1],
          defectWorkorder: '',
          formDefect: 'BA-PL-F503',
          defectType: task.rating,
          cbmMeasurement: "",
          cbmUom: "",
          cbmImageKey: "",
          cbmImageProp: "",
          isCbmAdjusment: "",
          taskValue: 2,
          repairedStatus: "Not-Repaired",
          cbmNAStatus: "Not-Confirm",
          supervisor: {
            id: authStore.user.EmployeeId,
            name: authStore.user.Name,
          },
          status: "Acknowledge",
        },
        defectDetail: {
          type: task.rating,
          title: task.description.split(";;")[1],
          assetNumber: this.generalForm.equipment,
          raisedBy: this.employee.name,
          date: "<<ServerDateTime>>"
        }
      };
      console.log("defectPayload", defectPayload);
      try {
        const res = await ApiService.post(`${UPDATE_TASK_WITH_DEFECT}?${new URLSearchParams(urlAPIBasicParam).toString()}`, defectPayload as AxiosRequestConfig);
        if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
          this.stateFormAlreadySubmitted = true
          return false
        }
        if (res.data.result.message == ServiceSheetErrorMessages.CLOSE) {
          this.stateFormAlreadyClose = true
          return false
        }
        if (res.data.result.message == ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER) {
          this.stateTaskAlreadyUpdated = true
          return false
        }
        this.stateMeasurementValue = '';
        this.stateUOM = '';
        this.stateImageKey = '';

        const itemParam: UpdateParam[] = [
          {
            keyValue: item!.key,
            propertyParams: [
              {
                propertyName: 'value',
                propertyValue: item.value as string
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
        // post task
        // update ke stateStoredAdjustmentOptionValue
        await this.updateItemServiceSheetDetail(itemParam)
        const selectedGroup = this.groups.find((el) => {
          return el.isSelected;
        }) as Group
        this.getTaskProgress()
        this.updateGroupByParam(selectedGroup?.groupName)
        this.updateStoredAdjustmentOptionValue(item.value as string)
        return true
      } catch (error) {
        sendCustomEvent("fe_event_error_post_calibration_task", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
        return false
      }
    },
    updateStoredBrakeTypeValue(item: DisabledItem) {
      const breakeTypes = this.stateStoredBrakeTypeValue.filter((el) => {
        return el.key == item.key
      })
      if (breakeTypes.length == 0) {
        this.stateStoredBrakeTypeValue.push(item)
      } else {
        breakeTypes.forEach((el) => {
          el.value = item.value
        })
      }
    },
    clearStoredBrakeTypeValue() {
      this.stateStoredBrakeTypeValue = []
    },
    async handleScrollToUnfilledTask() {
      this.stateToggleExpandTaskGroup = true
      const loading = ElLoading.service({
        lock: true,
        text: 'Scrolling to unfilled task',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await handleScrollToError("task-required", (500 + this.stateTaskGroupClosed))
      this.stateToggleExpandTaskGroup = false
      loading.close()
    },
    decreaseCollapse() {
      if (this.stateTaskGroupClosed > 100) {
        this.stateTaskGroupClosed -= 100
      }
    },
    increaseeCollapse() {
      this.stateTaskGroupClosed += 100
    },
    resetCollapse() {
      this.stateTaskGroupClosed = 100
    },
    async updateSkipPreServiceReasonOptions() {
      try {
        const response: AxiosResponse<ApiResponse<any>> = await ApiService.get(`${PRE_SERVICE_SKIP_TASK_REASEON}`)
        const reasonData: string[] = []
        response.data.result.content.forEach((reason) => {
          reasonData.push(reason.reason)
        })
        reasonData.push("Other")
        this.stateSkipPreServiceReasonOptions = reasonData
      } catch (error) {
        sendCustomEvent("fe_event_error_get_skip_pre_service_options", {
          errorMessage: error
        })
        sendErrorEvent('IRONS', error);
      }
    },
    getFieldValueByKey(key, field) {
      let res = ''
      this.stateSelectedSubGroups.forEach((subGroup) => {
        if (subGroup.key == key) {
          for (const key in subGroup) {
            if (key == field) {
              res = subGroup[key]
              return res
            }
          }
        }
        subGroup.taskGroup.forEach((taskGroup) => {
          if (taskGroup.key == key) {
            for (const key in taskGroup) {
              if (key == field) {
                res = taskGroup[key]
                return res
              }
            }
          }
          taskGroup.task.forEach((task) => {
            if (task.taskType === 'table' || task.taskType === 'collapsibleTable') {
              for (const itemIndex in task.items) {
                const item = task.items[itemIndex]
                for (const property in item) {
                  const currItem = item[property]
                  if (currItem.key == key) {
                    for (const itemKey in currItem) {
                      if (itemKey == field) {
                        res = currItem[itemKey]
                        return res
                      }
                    }
                  }
                }
              }
            }
            if (task.key == key) {
              for (const key in task) {
                if (key == field) {
                  res = task[key]
                  return res
                }
              }
            }
            task.items.forEach((item) => {
              if (item.key == key) {
                for (const key in item) {
                  if (key == field) {
                    res = item[key]
                    return res
                  }
                }
              }
            })
          })
        })
      })
      return res
    },
    async getCrackBulkData() {
      let hasCrackTab = false
      let isFormOnProgress = false
      this.stateServiceSheets.forEach((group) => {
        if (group.key == "CHASSIS_CRACK_SERVICE") {
          if (isUndefined(group.isDisable)) {
            hasCrackTab = true
          } else if (group.isDisable == "false") {
            hasCrackTab = true
          }
        }
      })
      if (this.stateGeneralForm.status == "On Progress" || this.stateGeneralForm.status == "Open") {
        isFormOnProgress = true
      }
      if (hasCrackTab && isFormOnProgress) {
        const params = {
          workOrder: this.stateWorkOrder,
          ver: "v1"
        }
        try {
          const response: AxiosResponse<SingleApiResponse<MultiplePreviousCrack[]>> = await ApiService.get(`${GET_PREVIOUS_CRACK_BY_WO}`, "", new URLSearchParams(params).toString());
          this.statePreviousCrackArr = response.data.result.content
        } catch (error) {
          sendErrorEvent('IRONS', error);
          console.log("error get previous each wo");
        }
      }
    },
    setSerialNumberGeneral(serialNumber: string) {
      this.stateGeneralForm.serialNumber = serialNumber
    },
    async getReplacementDefault(replacementDefaultPayload: ReplacementDefaultPayloadType) {
      try {
        const params = new URLSearchParams({ ver: "v1" }).toString()
        const response: AxiosResponse<SingleApiResponse<ReplacementDefaultResponseType>> = await ApiService.post(`${CBM_REPLACEMENT_DEFAULT_URL}?${params}`, replacementDefaultPayload as AxiosRequestConfig)
        this.stateReplacementValue = response.data.result.content?.defaultValue
        return this.stateReplacementValue
      } catch (error) {
        sendErrorEvent('IRONS', error);
        return error
      } finally {
        this.toggleIsReplaceValue(true)
      }
    },
    async getReplacementRating(task: Task) {
      const params = {
        ver: 'v1'
      }
      let rating;
      let toolsValue = "";
      if (task.mappingToolGroup) {
        for (const key in this.stateDropdownToolGroup) {
          if (key == task.mappingToolGroup) {
            toolsValue = this.stateDropdownToolGroup[key].value as string
          }
        }
      }

      // filter formulas where task == task
      // var taskFormulas berupa array mapping CBM nomor yang sedang dicari
      const taskFormulas = this.stateCBMFormulas.filter((formula) => {
        const formNum = formula.taskKey
        return (formNum == task.key) && formula.cbmType == 'CBM';
      });
      console.log(taskFormulas)
      // loop formula untuk mendapatkan jawaban
      if (taskFormulas.length > 0) {
        taskFormulas.every((formula) => {
          // check 1st param
          const checkMin = checkMinValue(formula, task.replacement.measurement);
          // check 2nd param
          const checkMax = checkMaxValue(formula, task.replacement.measurement);
          rating = checkRating(checkMin, checkMax, formula);
          console.log(
            "checkMin",
            checkMin,
            "checkMax",
            checkMax,
            "formula",
            formula,
            "value rossi",
            task.replacement.measurement
          );
          if (rating) {
            return false;
          } else {
            return true;
          }
        });
      }
      task.replacement.rating = rating
      if (rating) {
        // get defect header
        const defectHeaderPayload = {
          taskId: task.key,
          workorder: this.stateWorkOrder
        }
        const defectHeaderResponse: AxiosResponse<SingleApiResponse<DefectList>> = await ApiService.post(`${GETDEFECTHEADERBYPARAMURL}?${new URLSearchParams(params).toString()}`, defectHeaderPayload as AxiosRequestConfig);
        const defectHeader = defectHeaderResponse.data.result.content
        // update data defect by condition
        let updateDefectHeaderPayload
        if (rating == "C" || rating == "X") {
          updateDefectHeaderPayload = {
            id: defectHeader.id,
            updateParams: [
              {
                keyValue: defectHeader.key,
                propertyParams: [
                  {
                    propertyName: "isCbmAdjusment",
                    propertyValue: 'true'
                  },
                  {
                    propertyName: "isActive",
                    propertyValue: 'true'
                  },
                ]
              }
            ],
            employee: this.employee
          }
          try {
            await ApiService.post(`${UPDATEDEFECTHEADERURL}?${new URLSearchParams(params).toString()}`, updateDefectHeaderPayload as AxiosRequestConfig)
          } catch (error) {
            sendCustomEvent("fe_event_error_update_defect_header_data", {
              errorMessage: error
            })
            updateLoggedInStatusFromAPIResponse(error)
            sendErrorEvent('IRONS', error);
            console.log(error)
          }
        }
      }
      const propertyParams = {
        keyValue: task.replacement.key, // this will be adjustment key
        propertyParams: [
          {
            propertyName: "measurement",
            propertyValue: task.replacement.measurement
          },
          {
            propertyName: "rating",
            propertyValue: task.replacement.rating
          },
          {
            propertyName: "updatedBy",
            propertyValue: JSON.stringify(this.employee)
          },
          {
            propertyName: "updatedDate",
            propertyValue: "<<ServerDateTime>>"
          },
        ]
      }
      if (task.replacement.createdDate == '') {
        propertyParams.propertyParams = [
          ...propertyParams.propertyParams,
          ...[
            {
              propertyName: "createdBy",
              propertyValue: JSON.stringify(this.employee)
            },
            {
              propertyName: "createdDate",
              propertyValue: "<<ServerDateTime>>"
            }
          ]
        ]
      }
      const adjustmentPayload = {
        headerId: this.selectedGroup?.headerId,
        workorder: this.stateWorkOrder,
        id: this.selectedGroup!.id,
        updateParams: [
          propertyParams
        ],
        "employee": this.employee
      }
      try {
        const res = await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, adjustmentPayload as AxiosRequestConfig);
        if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
          this.stateFormAlreadySubmitted = true
        }
        if (res.data.result.message == ServiceSheetErrorMessages.CLOSE) {
          this.stateFormAlreadyClose = true
        }
        this.getTaskProgress()
        this.updateGroupByParam(this.stateSelectedGroup!.groupName)
      } catch (error) {
        sendCustomEvent("fe_event_error_post_service_sheet_data", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
      return rating
    },
    async deleteReplacementTask(task: Task) {
      const params = {
        ver: 'v1'
      }
      const defectHeaderPayload = {
        taskId: task.key,
        workorder: this.stateWorkOrder
      }
      const defectHeaderResponse: AxiosResponse<SingleApiResponse<DefectList>> = await ApiService.post(`${GETDEFECTHEADERBYPARAMURL}?${new URLSearchParams(params).toString()}`, defectHeaderPayload as AxiosRequestConfig);
      const defectHeader = defectHeaderResponse.data.result.content
      // revert taskValue to initial value and change isdeleted to be false
      let imageKey = ''
      let measurementVal = ''
      task.items.forEach((item) => {
        if (item.itemType == 'smallCamera') {
          imageKey = item.key
        }
        if (item.categoryItemType == 'paramRating') {
          measurementVal = item.value as string
        }
      })
      const revertDefectHeaderPayload = {
        id: defectHeader.id,
        updateParams: [
          {
            keyValue: defectHeader.key,
            propertyParams: [
              {
                propertyName: 'taskValue',
                propertyValue: task.taskValue
              },
              {
                propertyName: "cbmMeasurement",
                propertyValue: measurementVal
              },
              {
                propertyName: "isCbmAdjusment",
                propertyValue: 'false'
              },
              {
                propertyName: "isActive",
                propertyValue: 'true'
              },
            ]
          }
        ],
        employee: this.employee
      }
      try {
        await ApiService.post(`${UPDATEDEFECTHEADERURL}?${new URLSearchParams(params).toString()}`, revertDefectHeaderPayload as AxiosRequestConfig)
      } catch (error) {
        sendCustomEvent("fe_event_error_delete_adjusment_task", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      const adjustmentPayload = {
        headerId: this.selectedGroup?.headerId,
        workorder: this.stateWorkOrder,
        id: this.selectedGroup!.id,
        updateParams: [
          {
            keyValue: task.replacement.key, // this will be adjustment key
            propertyParams: [
              {
                propertyName: "measurement",
                propertyValue: ''
              },
              {
                propertyName: "rating",
                propertyValue: ''
              },
              {
                propertyName: "updatedBy",
                propertyValue: ''
              },
              {
                propertyName: "updatedDate",
                propertyValue: ''
              },
              {
                propertyName: "createdBy",
                propertyValue: ''
              },
              {
                propertyName: "createdDate",
                propertyValue: ''
              },
              {
                propertyName: "commentValue",
                propertyValue: ''
              }
            ]
          }
        ],
        "employee": this.employee
      }
      try {
        const res = await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, adjustmentPayload as AxiosRequestConfig);
        if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
          this.stateFormAlreadySubmitted = true
        }
        if (res.data.result.message == ServiceSheetErrorMessages.CLOSE) {
          this.stateFormAlreadyClose = true
        }
        this.getTaskProgress()
        this.updateGroupByParam(this.stateSelectedGroup!.groupName)
      } catch (error) {
        sendCustomEvent("fe_event_error_post_service_sheet_task", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    getTaskReplacement(activeGroupTaskId: string) {
      const taskReplacementArray: Task[] = []
      this.stateSelectedGroup?.subGroup[0].taskGroup.forEach((taskGroupItem) => {
        const filteredArray = taskGroupItem.task.filter((taskItem) => {
          return taskItem.groupTaskId === activeGroupTaskId
        })
        taskReplacementArray.push(...filteredArray)
      });
      return taskReplacementArray
    },
    getCameraItem(activeGroupTaskId: string) {
      const taskCamera = this.getTaskReplacement(activeGroupTaskId).find((task) => {
        return task.rating === "CAB_SIDE"
      })
      return taskCamera
    },
    async getTask(id: string, key: string, field: string) {
      try {
        const payload = {
          id: id,
          keyValue: key,
          propertyName: field
        }
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(`${GET_FIELD_VALUE}`, payload as AxiosRequestConfig)
        return response.data.result.content
      } catch (error) {
        sendErrorEvent('IRONS', error);
        return error
      }
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
                    if (newVal) {
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
        sendCustomEvent(`fe_event_error_get_service_form_previous_tandem_data`, {
          errorMessage: e
        })
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
  },
});
