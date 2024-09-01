import {
  Group,
  GroupKeyEnum
} from "@/core/types/entities/dma/e-form/group";
import {
  SubGroup,
  SubGroupKeyEnum
} from "@/core/types/entities/dma/e-form/subGroup";
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
  UPDATEDEFECTHEADERBYSERVICESHEETDETAILURL,
  GENERAL_SERVICE_SHEET_SUBMIT_API_URL
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
import {
  clone,
  isUndefined,
  sortBy,
  cloneDeep,
  isEmpty
} from "lodash";
import {
  Task,
  TaskCategoryEnum,
  TaskRatingEnum,
  ShowParametereEnum,
} from "@/core/types/entities/dma/e-form/Task";
import {
  CategoryItemTypeEnum,
  Item,
  ItemTypeEnum,
  BrakePackTypeDropdownValueEnum,
  JSONFieldEnum
} from "@/core/types/entities/dma/e-form/Item";
import {
  ListItem,
  CBMTypeEnum,
  CBMRatingEnum
} from "@/core/types/entities/dma/e-form/cbm/list";
import { checkMaxValue, checkMinValue, checkRating } from "./helpers";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  Mechanic
} from "@/core/types/entities/dma/e-form/general/ServicePersonnel";
import {
  useAuthenticationStore
} from "../../application/useAuthenticationStore";
import { UPDATE_TASK_WITH_DEFECT } from "./cracks/urls";
import {
  AESTCurrentDateTime,
  AESTShortCurrentDateTime,
  dayNightConverter
} from "@/core/helpers/date-format";
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
import {
  handleScrollToError
} from "@/core/helpers/ironforms/defects-form/defect-form";
import { ElLoading } from "element-plus";
import {
  GenerateServiceSheet as ServiceSheet
} from "@/core/types/entities/dma/e-form/OfflineGenerateServiceSheet";
import { db } from "@/database/schema/DexieSchema";
import { useOnline } from "@vueuse/core";
import { ServiceSheetDefect } from "@/database/schema/ServiceSheetDefect";
import {
  CBM_REPLACEMENT_DEFAULT_BULK_URL,
  CBM_REPLACEMENT_DEFAULT_URL,
  GET_FIELD_VALUE,
  GET_PREVIOUS_REPLACEMENT,
  PRE_SERVICE_SKIP_TASK_REASEON
} from "../e-form/urls";
import { useDefectsFormStore } from "./defects/useDefectsFormStore";
import { v4 as uuidv4 } from 'uuid'
import {
  deleteDefectByTaskId,
  setAllDefectIsActiveByTaskId,
  setDefectIsActiveById,
  setDefectIsActiveByTaskId
} from "@/core/helpers/ironforms/offline/defect-form";
import {
  RiskAssesmentValue
} from "@/core/types/entities/dma/RiskAssesmentValue";
import { sendCustomEvent } from "@/core/helpers/azure-app-insight";
import {
  MultiplePreviousCrack
} from "@/core/types/entities/dma/e-form/cracks/MultiplePreviousCrack";
import { GET_PREVIOUS_CRACK_BY_WO } from "../daily-schedule/urls";
import { deleteByWOItemKey } from "@/core/helpers/ironforms/offline/task";
import {
  useOfflineCameraStore
} from "../../application/useOfflineCameraStore";
import {
  useTaskReplacement
} from "@/core/helpers/ironforms/useTaskReplacement";
import {
  IntervantionReplacementDefaultBulkPayloadType,
  ReplacementDefaultBulkPayloadType,
  ReplacementDefaultPayloadType,
  ReplacementDefaultResponseType
} from "@/core/types/entities/dma/e-form/cbm/ReplacementDefaultType";
import {
  PreviousReplacement
} from "@/core/types/entities/dma/e-form/cbm/PreviousReplacement";
import { ServiceSheetErrorMessages } from "@/store/enums/ErrorMessagesEnum";
import {
  bindingKeyGeneratorServiceSheet
} from '@/core/helpers/binding-key-generator'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import { getPercentageTaskProgressAllTab } from "../e-form/helpers";
import { checkPrevValFirstHandler } from "@/core/helpers/prev-val-handler";
import {
  PendingTaskSyncStatusEnum,
  PendingTaskModuleEnum
} from "@/database/schema/QueueTask";
import { Option } from "@/core/types/misc/Option";
import { sendErrorEvent } from "@/core/helpers/analytics";
import IronformConfig from "@/core/config/IronformConfig";

type offlinePayload = {
  taskKey: string,
  targetItem: string,
  bindingKey?: string
}

type offlineDefectPayload = {
  task: Task,
  targetItem: Item
}

export type CheckApprovedLocalDefectOnTaskPayload = {
  taskKey: string
}

export type CheckApprovedLocalDefectOnTaskResponse = {
  isAlreadyHandledBySPV: boolean
}

export type GetPistonMovementRatingPercentageArgument = {
  task: Task,
  item: Item
}

export type PostFinalDataPistonMovementInputArgument = {
  task: Task,
  updateParams: UpdateParam[]
}

export interface postPistonDefectDataArgument extends PostFinalDataPistonMovementInputArgument {
  targetItem: Item,
  pistonItemRating: string
}

export interface GetPrevValueBasedOnCategoryTypeArgument {
  categoryItemType: string,
  previousData: PreviousReplacement
}

export const useEFormStore = defineStore({
  id: "offlineEForm",
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
      stateFormAlreadySubmitted: false,
      stateTaskErrorDialog: false,
      stateErrorMessageTaskErrorDialog: "",
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
      stateTaskProgress: [] as TaskProgress[],
      // preservice
      stateSkipPreService: false,
      stateSkipPreServiceReasonOptions: [] as string[],
      stateMultiDefectList: {},
      stateCameraItemCBMTakePhotoCompleteRating: {},
      stateReasonNA: "",
      stateDropdownToolGroup: {},
      statePreviousCrackArr: [] as MultiplePreviousCrack[],
      stateGetDataByParam: false,
      stateIsReplaceValue: false,
      stateReplacementValue: null as null | string,
      statePreviousReplacement: [] as PreviousReplacement[],
      stateCalculatingBrakeAvg: false,
      stateSelectedUOMToolTaskKey: "",
      stateSelectedBrakeTypeDropdown: ""
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
    taskErrorDialog: (state) => {
      return state.stateTaskErrorDialog;
    },
    errorMessageTaskErrorDialog: (state) => {
      return state.stateErrorMessageTaskErrorDialog;
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
      return getPercentageTaskProgressAllTab(state.stateGroups)
    },
    globalConnectionStore: () => {
      return useGlobalConnectionStore()
    },
    onlineStatus: () => {
      return useOnline()
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
    multiDefectList: (state) => {
      return state.stateMultiDefectList
    },
    CameraItemCBMTakePhotoCompleteRating: (state) => {
      return state.stateCameraItemCBMTakePhotoCompleteRating
    },
    reasonNA: (state) => {
      return state.stateReasonNA
    },
    dropdownToolGroup: (state) => {
      return state.stateDropdownToolGroup
    },
    cameraStore: () => {
      return useOfflineCameraStore()
    },
    useAuthenticationStore: () => {
      return useAuthenticationStore()
    },
    SelectedBrakeTypeDropdown: (state) => {
      return state.stateSelectedBrakeTypeDropdown;
    }
  },
  actions: {
    updateSelectedBrakeTypeDropdownValue(argument: string): void {
      this.stateSelectedBrakeTypeDropdown = argument
    },
    toggleSetSelectedUOMToolTaskKey(key: string) {
      this.stateSelectedUOMToolTaskKey = key
    },
    toggleCalculatingBrakeAvg(status: boolean) {
      this.stateCalculatingBrakeAvg = status
    },
    toggleIsReplaceValue(status: boolean) {
      this.stateIsReplaceValue = status
    },
    setCheckTruckItems(items) {
      this.generalForm.checkBeforeTruck.items = items
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
          headerId: this.serviceSheets[0]?.headerId ? this.serviceSheets[0]?.headerId : "g1",
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
        if (el.groupName == "General") {
          return
        }
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
          totalTask: isUndefined(el.totalTask) ? 0 : el.totalTask,
          doneTask: isUndefined(el.doneTask) ? 0 : el.doneTask,
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
    handleGenerateLeakMounting() {
      this.stateCameraItemCBMTakePhotoCompleteRating = {}
      try {
        this.stateSelectedSubGroups.forEach((subGroup) => {
          subGroup.taskGroup.forEach((taskGroup) => {
            taskGroup.task.forEach((task) => {
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
      } catch (error) {
        console.log("error", error);
      }
    },
    async setSelectedGroup(id: any) {
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
      if (isOfflineOrSlowInternetConnection()) {
        this.updateAdjustmentRow()
        await this.getMultiDefectList()
        this.handleGenerateLeakMounting()
        this.getPreviousTandemValue()
        this.getPreviousBrakePackValue()
        this.getPreviousReplacementValue(false)
      }
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
      // reset
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
            sendErrorEvent('IRONS', error);
            try {
              updateLoggedInStatusFromAPIResponse(error)
              console.log(error);
              return false
            } catch (error) {
              console.log('error', error);
            }
          }
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_get_service_sheet_data`, {
          errorMessage: error
        })
      }
    },
    async postGenerateServiceSheet(id: string, name: string, site: string) {
      // reset
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
            this.stateGeneralForm = response.data.result.content.general;
            this.stateGeneralForm.checkBeforeTruck.items.every((checkbox) => {
              if (checkbox.category == 'skipOtherWash') {
                this.generalFormStore.setSkipWash(checkbox.value as string)
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
              console.log(error);
              return false
            } catch (error) {
              sendErrorEvent('IRONS', error);
              console.log('error', error);
            }
          }
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_get_service_sheet_data`, {
          errorMessage: error
        })
      }
    },
    async postGenerateFromLocalDB(serviceSheet: ServiceSheet) {
      this.stateGeneralForm = serviceSheet.general
      this.stateServiceSheets = serviceSheet.serviceSheet
      this.getGroups();
      // this.getTaskProgress(); will add flow
      this.stateSelectedGroup = this.groups[0];
      this.stateIsSet = true;
      const localTaskProgress: TaskProgress[] = []
      for (const groupIndex in this.stateServiceSheets) {
        const group = this.stateServiceSheets[groupIndex]
        localTaskProgress.push({
          group: group.groupName,
          totalTask: group.totalTask,
          doneTask: group.doneTask,
          workorder: this.stateGeneralForm.workOrder
        })
      }
      this.stateTaskProgress = localTaskProgress
      this.stateGeneralForm.checkBeforeTruck.items.every((checkbox) => {
        if (checkbox.category == 'skipOtherWash') {
          this.generalFormStore.setSkipWash(checkbox.value as string)
          return false
        }
        return true
      })
    },
    async updateCBMRatingFromLocalDB(formulas) {
      this.stateCBMFormulas = formulas
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
    async updateServiceSheetTaskValue(
      payload: UpdateParam[],
      id: string,
      name: string,
      isHitupdateGroupByParam = true,
      taskKey = "",
      offlinePayload = {} as offlinePayload
    ) {
      let updateStatus = false
      const params = {
        ver: "v1",
      };
      try {
        const selectedGroup = this.groups.find((el) => {
          return el.isSelected;
        }) as Group;
        const body = {
          headerId: this.stateSelectedGroup!.headerId,
          workorder: this.generalForm.workOrder,
          id: this.stateSelectedGroup!.id,
          updateParams: payload,
          employee: {
            id: this.employee.id,
            name: this.employee.name,
          },
          localStatus: this.generalFormStore.stateGeneralForm.status
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
        this.updateLocalServiceSheetByParam(payload)
        this.getTaskProgress();
        if (isHitupdateGroupByParam) this.updateGroupByParam(this.stateSelectedGroup!.groupName, true);
        updateStatus = true
        this.setTaskUpdated()
      } catch (error) {
        sendCustomEvent(`fe_event_error_post_service_sheet_task`, {
          errorMessage: error
        })
        if (!isOfflineOrSlowInternetConnection()) {
          this.getTaskProgress();
          this.updateGroupByParam(this.stateSelectedGroup!.groupName, true);
        }
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        // this.globalConnectionStore.setSubmitConnectionError(isNoNetwork)
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
        if (isNoNetwork) {
          if (isEmpty(offlinePayload)) {
            this.updateServiceSheetTaskOnLocalDB(payload, offlinePayload.taskKey, offlinePayload.targetItem)
            updateStatus = true
          }
        }
        sendErrorEvent('IRONS', error);
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
        const isOfflineTaskPending = await this.checkCurrentWoPendingOfflineTask()
        if (isOfflineTaskPending) {
          this.updateTaskProgressOnLocalDB2()
          return
        }
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

          const currServiceSheetGroup = this.stateServiceSheets.find((groupItem) => {
            return item.group === groupItem.key;
          });
          if (currServiceSheetGroup) {
            currServiceSheetGroup.doneTask = item.doneTask;
            currServiceSheetGroup.totalTask = currServiceSheetGroup.groupName == 'DEFECT_IDENTIFIED_SERVICE' && item.identifiedDefectCount ? item.identifiedDefectCount : item.totalTask;
          }
        });
        this.stateServiceSheets = cloneDeep(this.groups)
        await db.serviceSheetDetail.put(cloneDeep({
          id: this.generalForm.workOrder,
          general: this.stateGeneralForm,
          serviceSheet: this.stateServiceSheets
        }))
        this.stateTaskProgress = response.data.result.content
      } catch (error) {
        sendCustomEvent(`fe_event_error_get_service_form_task_progress`, {
          errorMessage: error
        })
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
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
    async checkCurrentWoPendingOfflineTask() {
      const pendingOfflineUpdateTask = await db.pendingTask.where({
        workorder: this.stateWorkOrder,
        module: "serviceForm"
      }).toArray()
      if (pendingOfflineUpdateTask.length > 0) {
        // check all task is sync
        let isAllTaskSynced = true
        for (const pendingTask of pendingOfflineUpdateTask) {
          if (pendingTask.syncStatus == "Pending") {
            isAllTaskSynced = false
          }
        }
        return !isAllTaskSynced
      } else {
        return false
      }
    },
    updateCameraItemCBMTakePhotoCompleteRating(mappingCamera, itemKey, value) {
      if (this.stateCameraItemCBMTakePhotoCompleteRating[mappingCamera]) {
        this.stateCameraItemCBMTakePhotoCompleteRating[mappingCamera].every((item) => {
          if (item.key == itemKey) {
            item.value = value
            return true
          }
          return false
        })
      }
    },
    async updateGroupByParam(groupName: string, fromUpdateTask = false) {
      this.stateGetDataByParam = false
      if (groupName !== "General") {
        const isOfflineTaskPending = await this.checkCurrentWoPendingOfflineTask()
        if (isOfflineTaskPending) {
          return
        }
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
          if (!isOfflineOrSlowInternetConnection()) {
            if (!this.stateCalculatingBrakeAvg) {
              const response: AxiosResponse<SingleApiResponse<Group>> =
                await ApiService.post(
                  // if (db.task.where == this.wo == wo) ? length > 0
                  `${GET_SERVICE_SHEET_DETAIL_DATA_BY_PARAM_API_URL}?${new URLSearchParams(
                    params,
                  ).toString()}`,
                  body as AxiosRequestConfig,
                );
              this.stateSelectedSubGroups = response.data.result.content.subGroup;
            } else {
              this.toggleCalculatingBrakeAvg(false)
            }
          } else {
            const selectedGroup = this.stateServiceSheets.find((group) => {
              return group.groupName == groupName
            })
            this.stateSelectedSubGroups = selectedGroup!.subGroup
          }
          this.updateAdjustmentRow()
          this.handleGenerateLeakMounting()
          this.updateServiceDetailToLocalDB()
          await this.getMultiDefectList()
          await this.getPreviousTandemValue()
          await this.getPreviousBrakePackValue()
          await this.getPreviousReplacementValue(fromUpdateTask)
          this.stateGetDataByParam = true
          this.resetCollapse()
        } catch (error) {
          sendCustomEvent(`fe_event_error_get_service_form_${groupName}_tab`, {
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
    updateAdjustmentRow() {
      this.stateSelectedSubGroups.forEach((subGroup) => {
        subGroup.taskGroup.forEach((taskGroup) => {
          taskGroup.task.forEach((task) => {
            if (task.isShowAdjustmentRow) {
              task.isShowAdjustmentRow = false
            }
            if (!isUndefined(task.adjustment) && (task.adjustment.rating != '' || task.adjustment.commentValue != '' || task.adjustment.measurement != '')) {
              task.isShowAdjustmentRow = true
            }
            if (task.isShowReplacementRow) {
              task.isShowReplacementRow = false
            }
            if (!isUndefined(task.replacement) && (task.replacement.rating != '' || task.replacement.commentValue != '' || task.replacement.measurement != '')) {
              task.isShowReplacementRow = true
            }
            // cleaned task
            if (task.isShowCleanedRow) {
              task.isShowCleanedRow = false
            }
            if (!isUndefined(task.cleaned) && (task.cleaned.rating != '')) {
              task.isShowCleanedRow = true
            }
          })
        })
      })
    },
    async getPreviousTandemValue() {
      let isFormHasTaskPrevious = false
      let isFormHasTaskPreviousGroup = false
      let isPreviousTandemHasFilled = false
      let isPreviousTandemGroupHasFilled = false
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
            } else if (task.rating == "AUTOMATIC_PREVIOUS_GROUP") {
              isFormHasTaskPreviousGroup = true
              const prevTask = {} as DisabledItem
              isFormHasTaskPreviousGroup = true
              prevTask.key = task.key

              this.statePreviousTandemTasks.push(task.key)

              task.items.forEach((item) => {
                if (item.categoryItemType == "previousParamRating") {
                  if (item.value != "" && item.value != "-") {
                    isPreviousTandemGroupHasFilled = true
                  }
                  prevTask.value = item.value
                }
              })
              this.stateNewPreviousTandemTasks.push(prevTask)
            }
          })
        })
      })
      if ((isFormHasTaskPrevious && !isPreviousTandemHasFilled) || (isFormHasTaskPreviousGroup && !isPreviousTandemGroupHasFilled)) {
        const params = {
          ver: "v1",
        };
        // get API
        try {
          let previousTandemArr = [] as any[]
          const prevTandemLocal = await db.serviceFormPreviousTandem.where({
            id: `${this.generalForm.workOrder}`
          }).first()
          if (prevTandemLocal) {
            previousTandemArr = prevTandemLocal.previousTandem
          } else {
            if (!isOfflineOrSlowInternetConnection()) {
              const res = await ApiService.post(
                `${GET_PREVIOUS_REPLACEMENT}?${new URLSearchParams(
                  params,
                ).toString()}`,
                {
                  equipmentNumber: this.generalForm.equipment,
                  modelId: this.generalForm.modelId,
                } as AxiosRequestConfig,
              );
              previousTandemArr = res.data.result.content ? res.data.result.content : []
            }
          }
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
                              if (!isOfflineOrSlowInternetConnection()) {
                                await this.updateItemServiceSheetDetail(payload)
                              } else {
                                await this.updateServiceSheetTaskOnLocalDB(payload, task!.key, item.key, false, task.key)
                              }
                            } catch (e) {
                              console.log("serror updatedata setelah tandem drive");
                            }
                          }
                        }
                      })
                    }
                  })
                } else if (task.rating == "AUTOMATIC_PREVIOUS_GROUP") {
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
                              if (!isOfflineOrSlowInternetConnection()) {
                                await this.updateItemServiceSheetDetail(payload)
                              } else {
                                let bindingKey = task.key
                                // check apakah dia brake type
                                if (task.parentGroupTaskId) {
                                  bindingKey = task.parentGroupTaskId
                                } else if (task.childGroupTaskId) {
                                  bindingKey = task.childGroupTaskId
                                }
                                await this.updateServiceSheetTaskOnLocalDB(payload, task!.key, item.key, false, bindingKey)
                              }
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
          sendCustomEvent(`fe_event_error_get_service_form_previous_tandem_data`, {
            errorMessage: e
          })
          sendErrorEvent('IRONS', e);
          console.log("error get tandem", e);
        }
      }
    },
    async getCBMResult(task: Task, item: Item, cbmRatingType = '') {
      let rating;
      const bindingKey = bindingKeyGeneratorServiceSheet(task)
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
        } else if (task.rating === "AUTOMATIC_REPLACEMENT_GAP") {
          const isTaskSame = formNum == task.key
          const isCBMTypeSame = formula.cbmType == "CBM"
          return isTaskSame && isCBMTypeSame
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
          const prevValArrUpdateParams = [] as UpdateParam[];
          for (const item of task.items) {
            const isPrevUomItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_UOM
            const isPrevParamRating = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_PARAM_RATING;
            const isPrevTargetRating = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_TARGET_RATING
            const isAutoPrevGroupItemsType = isPrevParamRating || isPrevTargetRating || isPrevUomItem

            if (isAutoPrevGroupItemsType) {
              const isItemNotUpdated = !item.updatedDate || item.updatedDate == "";
              const isItemValNotEmpty = item.value && item.value != "";
              if (isItemNotUpdated && isItemValNotEmpty) {
                prevValArrUpdateParams.push({
                  keyValue: item.key,
                  propertyParams: [
                    {
                      propertyName: JSONFieldEnum.VALUE,
                      propertyValue: item.value as string,
                    },
                    {
                      propertyName: JSONFieldEnum.UPDATED_BY,
                      propertyValue: JSON.stringify(this.employee),
                    },
                    {
                      propertyName: JSONFieldEnum.UPDATED_DATE,
                      propertyValue: AESTCurrentDateTime(),
                    },
                  ],
                });
              }
            }
          }
          const targetItem = task.items.find((taskItem: Item) => {
            return taskItem.categoryItemType == "targetRating";
          });
          if (rating == "C" || rating == "X") {
            const authStore = useAuthenticationStore();
            const params = {
              ver: "v1",
            };
            let taskNo = `${task.description.split(';')[0]};${task.description.split(';')[1]}`;
            let taskDesc = task.items[2].value;

            if (task.rating == TaskRatingEnum.CALIPER) {
              taskNo = `${task.description.split(';')[0]};`;
              taskDesc = `${task.description.split(';')[1]}. ${task.description.split(';')[2]}`;
            }
            const defectHeaderId = uuidv4()
            const defectDetailId = uuidv4()
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
                      propertyValue: AESTCurrentDateTime(),
                    },
                  ],
                },
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
                      propertyValue: AESTCurrentDateTime()
                    },
                  ]
                },
                ...prevValArrUpdateParams,
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
                taskDesc: taskDesc,
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
                defectStatus: "Submited",
                isActive: "true",
                defectHeaderId: defectHeaderId,
                defectDetailId: defectDetailId
              },
            };
            if (cbmRatingType != '') {
              defectPayload.defectHeader["cbmRatingType"] = cbmRatingType
            }
            let defectUpdateStatus = false
            const defectOfflinePayload = {
              task: task,
              targetItem: targetItem
            } as offlineDefectPayload
            if (!isOfflineOrSlowInternetConnection()) {
              defectUpdateStatus = await this.updateDefectOnServer(params, defectPayload, defectOfflinePayload)
            } else {
              let isTaskValue = false
              if (!isUndefined(targetItem!.isTaskValue) && targetItem!.isTaskValue) {
                isTaskValue = true
              }
              defectUpdateStatus = await this.updateDefectOnLocalDB(defectPayload, task, targetItem, bindingKey)
            }
            if (!defectUpdateStatus) {
              return {
                value: '',
                status: defectUpdateStatus
              }
            }
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
                    propertyValue: AESTCurrentDateTime(),
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
                    propertyValue: AESTCurrentDateTime(),
                  },
                ],
              },
              ...prevValArrUpdateParams
            ];
            const offlinePayload = {
              taskKey: task.key,
              targetItem: targetItem?.key
            } as offlinePayload
            if (!isOfflineOrSlowInternetConnection()) {
              await this.updateServiceSheetTaskValue(
                payload,
                this.employee.id.toString(),
                this.employee.name,
                false,
                "",
                offlinePayload
              );
              setDefectIsActiveByTaskId(this.stateGeneralForm.workOrder, task.key, "false")
            } else {
              let isTaskValue = false
              if (!isUndefined(targetItem!.isTaskValue) && targetItem!.isTaskValue) {
                isTaskValue = true
              }
              this.updateServiceSheetTaskOnLocalDB(payload, task.key, targetItem?.key, false, bindingKey)
              setDefectIsActiveByTaskId(this.stateGeneralForm.workOrder, task.key, "false")
            }
            return {
              value: rating,
              status: true
            }
          }
          return {
            value: '',
            status: true
          }
        } else {
          if (!isOfflineOrSlowInternetConnection()) {
            await this.deleteExisitingDefectCBMAuto(task)
          } else {
            await this.deleteExisitingDefectCBMAuto(task)
            this.deleteDefectOnLocal(task)
          }
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
          return {
            value: '',
            status: false
          };
        }
      }
    },
    async deleteExisitingDefectCBMAuto(task: Task) {
      const params = {
        ver: "v1"
      }
      let targetItemKey = ""
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
          if (item.categoryItemType == "dropdownTool") {
            return
          }
          targetItemKey = item.key
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
            try {
              if (!isOfflineOrSlowInternetConnection()) {
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
                await ApiService.post(`${UPDATEDEFECTHEADERURL}?${new URLSearchParams(params).toString()}`, updateDefectHeaderPayload as AxiosRequestConfig)
                setDefectIsActiveByTaskId(this.stateGeneralForm.workOrder, task.key, "false")
              } else {
                setDefectIsActiveByTaskId(this.stateGeneralForm.workOrder, task.key, "false")
              }
            } catch (error) {
              sendCustomEvent(`fe_event_error_service_form_update_defect_header`, {
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
        employee: this.employee,
        localStatus: this.generalFormStore.stateGeneralForm.status
      }
      // send data to be
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
          this.updateLocalServiceSheetByParam(taskPayload)
        } else {
          await this.updateServiceSheetTaskOnLocalDB(taskPayload, task!.key, targetItemKey, true, task.key)
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_post_task`, {
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
          sendCustomEvent(`fe_event_error_service_form_get_ehms_rating`, {
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
        sendCustomEvent(`fe_event_error_service_form_get_value`, {
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
    updateGeneralValue(key, value) {
      this.stateGeneralForm[key] = value
    },
    async setNextPage() {
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
      const isOfflineTaskPending = await this.checkCurrentWoPendingOfflineTask()
      if (!isOfflineOrSlowInternetConnection() && !isOfflineTaskPending) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    async setShowNextPage(buttonLable = "") {
      const isOfflineTaskPending = await this.checkCurrentWoPendingOfflineTask()
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
        if (!isOfflineOrSlowInternetConnection() && !isOfflineTaskPending) {
          const response: AxiosResponse<SingleApiResponse<TaskProgress[]>> = await ApiService.post(`${GET_TASK_PROGRESS_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
          if (response.data.result.content.length < 1) isFormComplete = false
          this.stateTaskProgress = response.data.result.content
        }
        this.stateTaskProgress.forEach((item) => {
          if (item.doneTask != item.totalTask) {
            isFormComplete = false
          }
        });
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_show_next_page`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
        isFormComplete = false
        sendErrorEvent('IRONS', error);
      }
      if (!isFormComplete) {
        if (!this.stateSkipPreService && IronformConfig.enableSkipPreservice) {
          const preseviceName = "PRE_SERVICE_OPERATIONAL_CHECK"
          // next group question
          if (this.selectedGroup!.groupName == preseviceName) {
            if (!this.generalFormStore.generalUpdated) {
              this.setNextPage();
              return;
            }
            if (!isOfflineOrSlowInternetConnection()) {
              await this.getTaskProgress()
            }
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
          return false
        } else {
          this.setNextPage()
        }
      } else {
        // get status
        const generalStore = useGeneralFormStore()
        let status = ""
        if (!isOfflineOrSlowInternetConnection()) {
          status = await generalStore.getServiceSheetHeaderKeyValue('status') as string
        } else {
          status = this.generalForm.status
        }
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
      const isOfflineTaskPending = await this.checkCurrentWoPendingOfflineTask()
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
          propertyValue: AESTCurrentDateTime()
        },
        {
          propertyName: 'serviceEnd',
          propertyValue: AESTCurrentDateTime()
        },
        {
          propertyName: 'tsServiceEnd',
          propertyValue: AESTCurrentDateTime()
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
        localStatus: this.generalFormStore.stateGeneralForm.status
      }
      try {
        if (!isOfflineOrSlowInternetConnection() && !isOfflineTaskPending) {
          await ApiService.post(`${GENERAL_SERVICE_SHEET_SUBMIT_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
        } else {
          this.stateGeneralForm.status = "Submited"
          this.stateGeneralForm.updatedBy = this.employee
          this.stateGeneralForm.updatedDate = AESTCurrentDateTime()
          this.stateGeneralForm.serviceEnd = AESTCurrentDateTime()
          this.stateGeneralForm.tsServiceEnd = AESTCurrentDateTime()
          await db.pendingTask.add({
            module: 'serviceForm',
            section: 'E-Form',
            type: 'SubmitGeneral',
            workorder: this.stateGeneralForm.workOrder,
            key: `SUBMIT-${this.stateGeneralForm.key}`,
            bindingKey: `SUBMIT-${this.stateGeneralForm.key}`,
            payload: JSON.stringify(body),
            syncDate: AESTShortCurrentDateTime(),
            syncStatus: 'Pending'
          })
          await db.serviceSheetDetail.put(cloneDeep({
            id: this.generalForm.workOrder,
            general: this.stateGeneralForm,
            serviceSheet: this.stateServiceSheets
          }))
        }
        return true;
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_submit_form`, {
          errorMessage: error
        })
        console.log(error);
        sendErrorEvent('IRONS', error);
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
              propertyValue: AESTCurrentDateTime(),
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
              propertyValue: AESTCurrentDateTime(),
            },
          ],
        }]

        if (!isOfflineOrSlowInternetConnection()) {
          await this.deleteDefect(task)
          await this.deleteDefectOnLocal(task, item)
          return this.updateServiceSheetTaskValue([
            ...taskValuePayload,
            ...itemValuePayload
          ], "", "")
        } else {
          await this.deleteDefectOnLocal(task, item)
          return await this.updateServiceSheetTaskOnLocalDB([
            ...taskValuePayload,
            ...itemValuePayload
          ], task.key, item.key)
        }
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

      const defectHeaderId = uuidv4()
      const defectDetailId = uuidv4()
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
                propertyValue: AESTCurrentDateTime(),
              },
            ],
          },
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
                propertyValue: AESTCurrentDateTime()
              },
            ]
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
          isActive: "true",
          defectHeaderId: defectHeaderId,
          defectDetailId: defectDetailId
        },
      };
      try {
        let defectUpdateStatus = false
        if (!isOfflineOrSlowInternetConnection()) {
          const defectOfflinePayload = {
            task: task,
            targetItem: item
          } as offlineDefectPayload
          defectUpdateStatus = await this.updateDefectOnServer(params, defectPayload, defectOfflinePayload)
        } else {
          defectUpdateStatus = await this.updateDefectOnLocalDB(defectPayload, task, item)
        }
        if (!defectUpdateStatus) return defectUpdateStatus
        this.stateMeasurementValue = '';
        this.stateUOM = '';
        this.stateImageKey = '';

        // -------- case reset na field -------
        let naItemKey = ''
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
              naItemKey = searchItem!.key
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

        const itemParam: UpdateParam[] = []
        if (item.categoryItemType == "resultRating") {
          itemParam.push(resetOtherItemFieldParam)
          itemParam.push(taskNormalValueParam)
        }

        if (itemParam.length == 0) {
          return true
        }
        if (!isOfflineOrSlowInternetConnection()) {
          await this.updateItemServiceSheetDetail(itemParam)
          const selectedGroup = this.groups.find((el) => {
            return el.isSelected;
          }) as Group
          this.getTaskProgress()
          this.updateGroupByParam(this.stateSelectedGroup!.groupName)
        } else {
          let isTaskValue = false
          if (!isUndefined(item.isTaskValue) && item.isTaskValue) {
            isTaskValue = true
          }
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, naItemKey)
          // clear with task key karena di NA dia update with task Key sebagai identifier
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `reset-${task.key}`)
          this.updateServiceSheetTaskOnLocalDB(itemParam, task.key, `reset-${item.key}`, false, task.key)
        }
        return true
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
        return false
      }
    },
    async addDefectToServiceSheetDefectLocalDB(header) {
      let defectDetail = ""
      if (header?.defectDetail) {
        defectDetail = header?.defectDetail
      }
      const defectPayload = {
        ...clone(header),
        statusSync: !isOfflineOrSlowInternetConnection() ? "Sync" : "",
        defectData: defectDetail,
        key: "",
        assetNumber: "",
        imageAvailable: true,
        createdBy: clone(this.employee),
        createdDate: AESTCurrentDateTime(),
        updatedBy: clone(this.employee),
        updatedDate: AESTCurrentDateTime(),
      } as ServiceSheetDefect
      await db.serviceSheetDefect.add(defectPayload)
    },
    async updateDefectOnLocalDB(defect, task, item = {} as Item, bindingKey = '') {
      // delete existing defect
      await this.deleteDefectOnLocal(task, item)
      // save defect to defect table
      const clonedHeader = clone(defect.defectHeader) as any
      delete clonedHeader.supervisor
      delete clonedHeader.defectStatus
      if (defect.defectDetail) {
        clonedHeader.defectDetail = defect.defectDetail
      }
      await this.addDefectToServiceSheetDefectLocalDB(clonedHeader)
      await deleteByWOItemKey(this.stateGeneralForm.workOrder, `update-defect-adjustment-${task.key}`)
      await deleteByWOItemKey(this.stateGeneralForm.workOrder, item.key)
      // save defect to task
      await db.pendingTask.add({
        module: 'serviceForm',
        section: 'E-Form',
        type: 'Defect',
        workorder: this.generalForm.workOrder,
        key: task.key,
        bindingKey: bindingKey,
        payload: JSON.stringify(defect),
        syncDate: AESTShortCurrentDateTime(),
        itemKey: item.key,
        syncStatus: 'Pending'
      })
      // update task to service sheet detail table
      this.updateLocalServiceSheetByParam(defect.updateParams)
      await this.updateServiceDetailToLocalDB()
      this.updateTaskProgressOnLocalDB2()
      return true
    },
    async updateDefectOnServer(params, defectPayload, defectOfflinePayload = {} as offlineDefectPayload) {
      try {
        const res = await ApiService.post(
          `${UPDATE_TASK_WITH_DEFECT}?${new URLSearchParams(
            params,
          ).toString()}`,
          defectPayload as AxiosRequestConfig,
        );
        this.updateLocalServiceSheetByParam(defectPayload.updateParams)
        await this.updateServiceDetailToLocalDB()
        this.addDefectToServiceSheetDefectLocalDB(cloneDeep(defectPayload.defectHeader))

        switch (res.data.result.message) {
          case ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER:
            this.toggleTaskAlreadyUpdatedStatus(true)
            return false
          case ServiceSheetErrorMessages.SUBMITTED:
            this.toggleFormAlreadySubmitted(true)
            return false
          case ServiceSheetErrorMessages.CLOSE:
            this.toggleFormAlreadyClose(true)
            return false
          default:
            if (res.data.statusCode == 400) {
              this.toogleTaskErrorDialog(true)
              this.stateErrorMessageTaskErrorDialog = res.data.result.message
              return false
            }
            break;
        }
        return true
      } catch (error: any) {
        if (error.toString().includes("Network Error")) {
          const defectLocal = await this.updateDefectOnLocalDB(defectPayload, defectOfflinePayload.task, defectOfflinePayload.targetItem)
          return defectLocal
        }
        console.log("error post defect server", error.toString());
        sendCustomEvent(`fe_event_error_post_defect_data`, {
          errorMessage: error
        })
        sendErrorEvent('IRONS', error);
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
      const setDefaultOil = async () => {
        this.stateOilTolerance = {
          min: -5,
          max: +5,
          uom: '%'
        }
        const data = clone(this.stateOilTolerance)
        await db.oilTolerance.add(data)
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
            const data = clone(this.stateOilTolerance)
            await db.oilTolerance.clear()
            await db.oilTolerance.add(data)
          } else {
            setDefaultOil()
          }
        } else {
          setDefaultOil()
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_get_oil_tolerance`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        setDefaultOil()
      }
    },
    async getOilToleranceFromLocalDB() {
      const oilTolerance = await db.oilTolerance.limit(1).first()
      if (oilTolerance) {
        this.stateOilTolerance = oilTolerance
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
      if (!isOfflineOrSlowInternetConnection()) {
        await this.updatePreRiskAssesmentToBE()
      } else {
        await this.updateRiskAssesmentToLocalDB()
      }
    },
    async deleteRisAssesmentPic(deletedImage) {
      let arr = this.generalForm.riskAssesment[0].value as any[]
      arr = arr.filter((image) => {
        return image.image != deletedImage
      })
      this.generalForm.riskAssesment[0].value = arr
      if (!isOfflineOrSlowInternetConnection()) {
        await this.updatePreRiskAssesmentToBE()
      } else {
        await this.updateRiskAssesmentToLocalDB()
      }
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
        localStatus: this.generalFormStore.stateGeneralForm.status
      }
      const params = {
        ver: 'v1'
      }
      try {
        await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
        await this.refreshWash(authStore.user.EmployeeId, authStore.user.Name, authStore.user.SiteId)
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_post_ris_assessment_image`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
        console.log('upload risk Assesment', error);
        sendErrorEvent('IRONS', error);
      }
    },
    async updateRiskAssesmentToLocalDB() {
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
      await db.pendingTask.add({
        module: 'serviceForm',
        section: 'E-Form',
        type: 'General',
        workorder: this.stateGeneralForm.workOrder,
        key: this.stateGeneralForm.key,
        bindingKey: this.stateGeneralForm.key,
        payload: JSON.stringify(payload),
        syncDate: AESTShortCurrentDateTime(),
        syncStatus: 'Pending'
      })
      // komen dulu nanti di unkomen
      await db.serviceSheetDetail.put(cloneDeep({
        id: this.generalForm.workOrder,
        general: this.stateGeneralForm,
        serviceSheet: this.stateServiceSheets
      }))
    },
    async updateItemServiceSheetDetail(payload, offlinePayload = {} as offlinePayload) {
      const params = {
        ver: "v1",
      }
      const selectedGroup = this.groups.find((el) => {
        return el.isSelected;
      }) as Group;
      const body = {
        headerId: this.stateSelectedGroup?.headerId,
        workorder: this.generalForm.workOrder,
        id: this.stateSelectedGroup?.id,
        updateParams: payload,
        employee: {
          id: this.employee.id,
          name: this.employee.name,
        },
        localStatus: this.generalFormStore.stateGeneralForm.status
      };
      try {
        await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
        this.updateLocalServiceSheetByParam(payload)
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_post_item`, {
          errorMessage: error
        })
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        if (isNoNetwork) {
          this.updateServiceSheetTaskOnLocalDB(payload, offlinePayload.taskKey, offlinePayload.targetItem, false, offlinePayload.bindingKey)
        }
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
        console.log('error update item', error);
      }
    },
    // ------- adjustment CBM auto --------
    async getAdjusmentRating(task: Task, bindingKey = '') {
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
        // const defectHeaderResponse: AxiosResponse<SingleApiResponse<DefectList>> = await ApiService.post(`${GETDEFECTHEADERBYPARAMURL}?${new URLSearchParams(params).toString()}`, defectHeaderPayload as AxiosRequestConfig);
        // const defectHeader = defectHeaderResponse.data.result.content
        // update data defect by condition
        let newDefectVal = {} as any
        newDefectVal = {
          cbmImageKey: task.adjustment.key,
          cbmImageProp: "pictures",
          isCbmAdjusment: 'true',
          isActive: 'true',
          correctedValue: rating,
          correctedMeasurement: task.adjustment.measurement,
          correctedUom: task.adjustment.uom
        }
        const updateDefectHeaderPayload = {
          serviceSheetDetailId: this.selectedGroup!.id,
          workorder: this.generalForm.workOrder,
          taskKey: task.key,
          updateParams: [
            {
              keyValue: "",
              propertyParams: [
                {
                  propertyName: "cbmImageKey",
                  propertyValue: task.adjustment.key
                },
                {
                  propertyName: "cbmImageProp",
                  propertyValue: 'pictures'
                },
                {
                  propertyName: "isCbmAdjusment",
                  propertyValue: 'true'
                },
                {
                  propertyName: "isActive",
                  propertyValue: 'true'
                },
                {
                  propertyName: "correctedMeasurement",
                  propertyValue: task.adjustment.measurement
                },
                {
                  propertyName: "correctedValue",
                  propertyValue: rating
                },
                {
                  propertyName: "correctedUom",
                  propertyValue: task.adjustment.uom
                },
              ]
            }
          ],
          employee: this.employee
        }
        try {
          if (!isOfflineOrSlowInternetConnection()) {
            await ApiService.post(`${UPDATEDEFECTHEADERBYSERVICESHEETDETAILURL}?${new URLSearchParams(params).toString()}`, updateDefectHeaderPayload as AxiosRequestConfig)
          } else {
            await this.updateAdjustmentDefectOnLocalDB(task, newDefectVal, updateDefectHeaderPayload, true, bindingKey)
            // update to service sheet detail
          }
        } catch (error) {
          sendCustomEvent(`fe_event_error_service_form_update_adjustment_task`, {
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
            propertyValue: task.adjustment.measurement && task.adjustment.rating ? AESTCurrentDateTime() : ""
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
              propertyValue: AESTCurrentDateTime()
            }
          ]
        ]
      }
      const adjusmentUpdateParams = [
        propertyParams
      ]
      const adjustmentPayload = {
        headerId: this.selectedGroup?.headerId,
        workorder: this.stateWorkOrder,
        id: this.selectedGroup!.id,
        updateParams: adjusmentUpdateParams,
        "employee": this.employee,
        localStatus: this.generalFormStore.stateGeneralForm.status
      }
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          const res = await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, adjustmentPayload as AxiosRequestConfig);
          this.updateLocalServiceSheetByParam(adjusmentUpdateParams)
          if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
            this.stateFormAlreadySubmitted = true
          }
          this.getTaskProgress()
          this.updateGroupByParam(this.stateSelectedGroup!.groupName)
        } else {
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `adjustment-rating-${task.key}`)
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `reset-adjustment-${task.key}`)
          // update data to task
          await db.pendingTask.add({
            module: 'serviceForm',
            section: 'E-Form',
            type: 'Task',
            workorder: this.stateGeneralForm.workOrder,
            key: task.key,
            bindingKey: bindingKey,
            payload: JSON.stringify(adjustmentPayload),
            syncDate: AESTShortCurrentDateTime(),
            itemKey: `adjustment-rating-${task.key}`,
            syncStatus: 'Pending'
          })
          // update service sheet
          this.updateLocalServiceSheetByParam(adjusmentUpdateParams)
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_update_adjustment_task`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
      return rating
    },
    async updateAdjustmentDefectOnLocalDB(task, newDefectVal, updateDefectHeaderPayload, isAdjustment = false, bindingKey = '') {
      // get defect on local DB
      let defect
      if (isAdjustment) {
        defect = await db.serviceSheetDefect.where({
          workorder: this.stateGeneralForm.workOrder,
          taskId: task.key,
        }).last()
      } else {
        defect = await db.serviceSheetDefect.where({
          workorder: this.stateGeneralForm.workOrder,
          taskId: task.key,
        }).first()
      }
      // if any update its value
      if (defect) {
        await db.serviceSheetDefect.update(Number(defect.id!), newDefectVal)
      }
      // add update defect to task local DB
      await deleteByWOItemKey(this.stateGeneralForm.workOrder, `update-defect-adjustment-${task.key}`)
      await db.pendingTask.add({
        module: 'serviceForm',
        section: 'E-Form',
        type: 'UpdateDefect',
        workorder: this.stateGeneralForm.workOrder,
        key: task.key,
        bindingKey: bindingKey,
        payload: JSON.stringify(updateDefectHeaderPayload),
        syncDate: AESTShortCurrentDateTime(),
        itemKey: `update-defect-adjustment-${task.key}`,
        syncStatus: 'Pending'
      })
    },
    async updaterePlacementDefectOnLocalDB(task, newDefectVal, updateDefectHeaderPayload, isAdjustment = false) {
      // get defect on local DB
      let defect
      if (isAdjustment) {
        defect = await db.serviceSheetDefect.where({
          workorder: this.stateGeneralForm.workOrder,
          taskId: task.key,
        }).last()
      } else {
        defect = await db.serviceSheetDefect.where({
          workorder: this.stateGeneralForm.workOrder,
          taskId: task.key,
        }).first()
      }
      console.log(await db.serviceSheetDefect.where({
        workorder: this.stateGeneralForm.workOrder,
        taskId: task.key,
      }).toArray());
      console.log("defect", defect);
      // if any update its value
      if (defect) {
        await db.serviceSheetDefect.update(Number(defect.id!), newDefectVal)
      }
      // add update defect to task local DB
      await deleteByWOItemKey(this.stateGeneralForm.workOrder, `update-defect-replacement-${task.key}`)
      await db.pendingTask.add({
        module: 'serviceForm',
        section: 'E-Form',
        type: 'UpdateDefect',
        workorder: this.stateGeneralForm.workOrder,
        key: task.key,
        bindingKey: task.key,
        payload: JSON.stringify(updateDefectHeaderPayload),
        syncDate: AESTShortCurrentDateTime(),
        itemKey: `update-defect-replacement-${task.key}`,
        syncStatus: 'Pending'
      })
    },
    async deleteAdjusmentTask(task: Task, bindingKey = '') {
      const params = {
        ver: 'v1'
      }
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
      const newDefectVal = {
        taskValue: task.taskValue,
        cbmImageKey: imageKey,
        cbmImageProp: "value",
        cbmMeasurement: measurementVal,
        isCbmAdjusment: 'false',
        isActive: 'true',
        correctedValue: "",
        correctedMeasurement: "",
        correctedUom: ""
      }
      const revertDefectHeaderPayload = {
        serviceSheetDetailId: this.selectedGroup!.id,
        workorder: this.generalForm.workOrder,
        taskKey: task.key,
        updateParams: [
          {
            keyValue: "",
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
              {
                propertyName: "correctedValue",
                propertyValue: ''
              },
              {
                propertyName: "correctedMeasurement",
                propertyValue: ''
              },
              {
                propertyName: "correctedUom",
                propertyValue: ''
              },
            ]
          }
        ],
        employee: this.employee
      }
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          await ApiService.post(`${UPDATEDEFECTHEADERBYSERVICESHEETDETAILURL}?${new URLSearchParams(params).toString()}`, revertDefectHeaderPayload as AxiosRequestConfig)
        } else {
          await this.updateAdjustmentDefectOnLocalDB(task, newDefectVal, revertDefectHeaderPayload, false, bindingKey)
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_delete_adjusment_defect`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      const adjusmentUpdateParams = [
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
      ]
      const adjustmentPayload = {
        headerId: this.selectedGroup?.headerId,
        workorder: this.stateWorkOrder,
        id: this.selectedGroup!.id,
        updateParams: adjusmentUpdateParams,
        "employee": this.employee,
        localStatus: this.generalFormStore.stateGeneralForm.status
      }
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          const res = await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, adjustmentPayload as AxiosRequestConfig);
          if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
            this.stateFormAlreadySubmitted = true
          }
          this.updateLocalServiceSheetByParam(adjusmentUpdateParams)
          this.getTaskProgress()
          this.updateGroupByParam(this.stateSelectedGroup!.groupName)
        } else {
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `camera-adjustment-${task.key}`)
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `changeComment-${task.adjustment.key}`)
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `adjustment-rating-${task.key}`)
          // update data to task
          await db.pendingTask.add({
            module: 'serviceForm',
            section: 'E-Form',
            type: 'Task',
            workorder: this.stateGeneralForm.workOrder,
            key: task.key,
            bindingKey: bindingKey ?? task.key,
            payload: JSON.stringify(adjustmentPayload),
            syncDate: AESTShortCurrentDateTime(),
            itemKey: `reset-adjustment-${task.key}`,
            syncStatus: 'Pending'
          })
          // update service sheet
          this.updateLocalServiceSheetByParam(adjusmentUpdateParams)
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_delete_adjsutment_task`, {
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
            propertyValue: AESTCurrentDateTime()
          },
        ]
      }
      const adjusmentUpdateParams = [propertyParams]
      const adjustmentPayload = {
        headerId: this.selectedGroup?.headerId,
        workorder: this.stateWorkOrder,
        id: this.selectedGroup!.id,
        updateParams: adjusmentUpdateParams,
        "employee": this.employee,
        localStatus: this.generalFormStore.stateGeneralForm.status
      }
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          const res = await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, adjustmentPayload as AxiosRequestConfig);
          if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
            this.stateFormAlreadySubmitted = true
          }
          this.updateLocalServiceSheetByParam(adjusmentUpdateParams)
          this.getTaskProgress()
          this.updateGroupByParam(this.stateSelectedGroup!.groupName)
        } else {
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `camera-adjustment-${task.key}`)
          await db.pendingTask.add({
            module: 'serviceForm',
            section: 'E-Form',
            type: 'Task',
            workorder: this.stateGeneralForm.workOrder,
            key: task.key,
            bindingKey: task.key,
            payload: JSON.stringify(adjustmentPayload),
            syncDate: AESTShortCurrentDateTime(),
            itemKey: `camera-adjustment-${task.key}`,
            syncStatus: 'Pending'
          })
          // update service sheet
          this.updateLocalServiceSheetByParam(adjusmentUpdateParams)
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_post_adjustment_image`, {
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
      // jika uom masih tetep gadapet, kemungkinan piston type
      // karena typenya CBM bukan BIRANNA / oil cooled
      if (uom == "" && value) {
        for (const formula of taskFormulas) {
          if (formula.cbmType == CBMTypeEnum.CBM_BRAKE_PACK_PERCENTAGE) {
            uom = formula.uom;
            break;
          }
        }
      }
      // return uomnya??
      return uom
    },
    async updateToolUom(task: Task, dropdownItem: Item, bindingKey = '') {
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
                propertyValue: AESTCurrentDateTime()
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
            propertyValue: AESTCurrentDateTime()
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
        employee: this.employee,
        localStatus: this.generalFormStore.stateGeneralForm.status
      }
      // send data to be
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
          this.updateLocalServiceSheetByParam(taskPayload)
        } else {
          await this.updateServiceSheetTaskOnLocalDB(taskPayload, task.key, dropdownItem.key, false, bindingKey)
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_tool_uom_task`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      // reset cbm value and defect (if any)
      await this.resetCBMMeasurementValueAndDefect(task, bindingKey)
    },
    async resetCBMMeasurementValueAndDefect(task: Task, bindingKey = '') {
      const params = {
        ver: "v1",
      }
      let measurementValParam = {} as UpdateParam
      let ratingValParam = {} as UpdateParam
      let cameraValParam = {} as UpdateParam
      let pistonAParam = {} as UpdateParam
      let pistonBParam = {} as UpdateParam
      let pistonResultParam = {} as UpdateParam
      let pistonRatingParam = {} as UpdateParam
      // last value param
      let prevPistonAParam = {} as UpdateParam
      let prevPistonBParam = {} as UpdateParam
      let prevPistonResultParam = {} as UpdateParam
      let prevUomParam = {} as UpdateParam
      let prevPistonRatingParam = {} as UpdateParam
      let prevPistonPercentageParam = {} as UpdateParam
      let itemKey = ""
      task.items.forEach(async (item) => {
        // reset measurement
        if (item.categoryItemType == "paramRatingDynamic") {
          item.value = ""
          itemKey = item.key
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
            // delete defect
            const newDefectVal = {
              isActive: "false"
            }
            const updateDefectHeaderPayload = {
              serviceSheetDetailId: this.selectedGroup!.id,
              workorder: this.generalForm.workOrder,
              taskKey: task.key,
              updateParams: [
                {
                  keyValue: "",
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
              if (!isOfflineOrSlowInternetConnection()) {
                await ApiService.post(`${UPDATEDEFECTHEADERBYSERVICESHEETDETAILURL}?${new URLSearchParams(params).toString()}`, updateDefectHeaderPayload as AxiosRequestConfig)
              } else {
                await this.updateAdjustmentDefectOnLocalDB(task, newDefectVal, updateDefectHeaderPayload, false, bindingKey)
              }
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
        if (item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_A) {
          item.value = ""
          itemKey = item.key
          pistonAParam = {
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
        if (item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_B) {
          item.value = ""
          itemKey = item.key
          pistonBParam = {
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
        if (item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_RESULT) {
          item.value = ""
          itemKey = item.key
          pistonResultParam = {
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
        if (item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_RATING) {
          item.value = ""
          itemKey = item.key
          pistonRatingParam = {
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
        // prev value
        if (item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_A) {
          item.value = "-"
          itemKey = item.key
          prevPistonAParam = {
            keyValue: item.key,
            propertyParams: [
              {
                propertyName: 'value',
                propertyValue: "-"
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
        if (item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_B) {
          item.value = "-"
          itemKey = item.key
          prevPistonBParam = {
            keyValue: item.key,
            propertyParams: [
              {
                propertyName: 'value',
                propertyValue: "-"
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
        if (item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RESULT) {
          item.value = "-"
          itemKey = item.key
          prevPistonResultParam = {
            keyValue: item.key,
            propertyParams: [
              {
                propertyName: 'value',
                propertyValue: "-"
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
        if (item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_UOM) {
          item.value = "-"
          itemKey = item.key
          prevUomParam = {
            keyValue: item.key,
            propertyParams: [
              {
                propertyName: 'value',
                propertyValue: "-"
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
        if (item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING) {
          item.value = "-"
          itemKey = item.key
          prevPistonRatingParam = {
            keyValue: item.key,
            propertyParams: [
              {
                propertyName: 'value',
                propertyValue: "-"
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
        if (item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_PERCENTAGE) {
          item.value = "-"
          itemKey = item.key
          prevPistonPercentageParam = {
            keyValue: item.key,
            propertyParams: [
              {
                propertyName: 'value',
                propertyValue: "-"
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
      let taskPayload: UpdateParam[] = [
        taskValParam,
        measurementValParam,
        ratingValParam,
        cameraValParam,
        pistonAParam,
        pistonBParam,
        pistonResultParam,
        pistonRatingParam,
        prevPistonAParam,
        prevPistonBParam,
        prevPistonResultParam,
        prevUomParam,
        prevPistonRatingParam,
        prevPistonPercentageParam,
      ]
      taskPayload = taskPayload.filter((payload) => {
        return !isEmpty(payload);
      })
      this.cameraStore.clearImageById(cameraValParam.keyValue)
      // payload to be sent to BE
      const body = {
        headerId: this.stateSelectedGroup!.headerId,
        workorder: this.stateSelectedGroup!.workOrder,
        id: this.stateSelectedGroup!.id,
        updateParams: taskPayload,
        employee: this.employee,
        localStatus: this.generalFormStore.stateGeneralForm.status
      }
      // send data to be
      if (!isOfflineOrSlowInternetConnection()) {
        try {
          await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
          this.updateLocalServiceSheetByParam(taskPayload)
        } catch (error) {
          sendCustomEvent(`fe_event_error_service_reset_cbm_task`, {
            errorMessage: error
          })
          updateLoggedInStatusFromAPIResponse(error)
          sendErrorEvent('IRONS', error);
          console.log(error)
        }
        await this.getTaskProgress()
        await this.updateGroupByParam(this.stateSelectedGroup!.groupName)
      } else {
        await this.updateServiceSheetTaskOnLocalDB(taskPayload, task.key, itemKey, false, bindingKey)
      }
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
        sendCustomEvent(`fe_event_error_service_form_delete_defect`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async deleteDefectOnLocal(task: Task, item = {} as Item) {
      // delete on local
      if (item?.ratingType) {
        const taskDefects = await db.serviceSheetDefect.where({
          workorder: this.stateGeneralForm.workOrder,
          taskId: task.key,
          isActive: "true"
        }).toArray()
        const itemRating = `- ${item.ratingType}`
        const taskDefect = taskDefects.find((defect) => {
          return defect.taskDesc.includes(itemRating)
        })
        await setDefectIsActiveById(this.stateGeneralForm.workOrder, taskDefect?.id, "false")
      } else {
        await setAllDefectIsActiveByTaskId(this.stateGeneralForm.workOrder, task.key, "false")
      }
    },
    async updateItemFromTask(updateParam, taskKey = '') {
      const params = {
        ver: "v1"
      }
      const body = {
        headerId: this.stateSelectedGroup!.headerId,
        workorder: this.stateSelectedGroup!.workOrder,
        id: this.stateSelectedGroup!.id,
        updateParams: updateParam,
        employee: this.employee,
        localStatus: this.generalFormStore.stateGeneralForm.status
      }
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
          this.updateLocalServiceSheetByParam(updateParam)
        } else {
          await db.pendingTask.add({
            module: 'serviceForm',
            section: 'E-Form',
            type: 'Task',
            workorder: this.stateGeneralForm.workOrder,
            key: taskKey,
            bindingKey: taskKey,
            payload: JSON.stringify(body),
            syncDate: AESTShortCurrentDateTime(),
            syncStatus: 'Pending'
          })
          this.updateLocalServiceSheetByParam(updateParam)
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_post_item`, {
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
      if (item.value != "") {
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
      }

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
              propertyValue: item.value != "" ? JSON.stringify(this.employee) : ""
            },
            {
              propertyName: 'updatedDate',
              propertyValue: item.value != "" ? AESTCurrentDateTime() : ""
            },
          ]
        },
        // item
        {
          keyValue: targetItem!.key,
          propertyParams: [
            {
              propertyName: 'value',
              propertyValue: item.value != "" && rating ? rating : ""
            },
            {
              propertyName: 'updatedBy',
              propertyValue: item.value != "" && rating ? JSON.stringify(this.employee) : ""
            },
            {
              propertyName: 'updatedDate',
              propertyValue: item.value != "" && rating ? AESTCurrentDateTime() : ""
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
              propertyValue: item.value != "" ? JSON.stringify(this.employee) : ""
            },
            {
              propertyName: 'updatedDate',
              propertyValue: item.value != "" ? AESTCurrentDateTime() : ""
            },
          ]
        },
      ]
      if (!isOfflineOrSlowInternetConnection()) {
        const offlinePaylod = {
          taskKey: task.key,
          targetItem: targetItem!.key,
          bindingKey: task.groupTaskId
        }
        await this.updateItemServiceSheetDetail(itemParam, offlinePaylod)
        await this.updateGroupByParam(this.stateSelectedGroup!.groupName)
      } else {
        await this.updateServiceSheetTaskOnLocalDB(itemParam, task.key, targetItem!.key, false, task.groupTaskId)
      }
      // update data to stored suspension cylinder
      this.stateStoredSuspensionCylinderValue.forEach((item) => {
        if (targetItem!.key == item.key) {
          item.value = rating
        }
      })
      console.log("this.stateStoredSuspensionCylinderValue", this.stateStoredSuspensionCylinderValue);
      const checkSpecValue = this.stateStoredSuspensionCylinderValue.filter((item) => {
        return item.value == "Out of spec" || item.value == "Out Spec"
      })

      if (checkSpecValue.length == 1) {
        if (rating == "Out of spec" || rating == "Out Spec") {
          this.stateShowSCConfirmToSPC = true
        }
      }
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
              propertyValue: item.value != "" ? JSON.stringify(this.employee) : ''
            },
            {
              propertyName: 'updatedDate',
              propertyValue: item.value != "" ? AESTCurrentDateTime() : ''
            },
          ]
        },
        // item
        {
          keyValue: targetItem!.key,
          propertyParams: [
            {
              propertyName: 'value',
              propertyValue: item.value != "" && rating ? rating : ''
            },
            {
              propertyName: 'updatedBy',
              propertyValue: item.value != "" && rating ? JSON.stringify(this.employee) : ''
            },
            {
              propertyName: 'updatedDate',
              propertyValue: item.value != "" && rating ? AESTCurrentDateTime() : ''
            },
          ]
        },
      ]
      if (!isOfflineOrSlowInternetConnection()) {
        await this.updateItemServiceSheetDetail(itemParam)
      } else {
        await this.updateServiceSheetTaskOnLocalDB(itemParam, task.key, targetItem!.key, false, task.groupTaskId)
      }

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
    async updateDefectCalibrationDropdown(task: Task, item: Item, bindingKey = '') {
      // update defect
      const authStore = useAuthenticationStore();
      console.log(task.description);
      const params = {
        ver: "v1",
      };
      const defectHeaderId = uuidv4()
      const defectDetailId = uuidv4()
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
                propertyValue: AESTCurrentDateTime(),
              },
            ],
          },
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
                propertyValue: AESTCurrentDateTime()
              },
            ]
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
          isActive: "true",
          defectHeaderId: defectHeaderId,
          defectDetailId: defectDetailId
        },
        defectDetail: {
          type: task.rating,
          title: task.description.split(";;")[1],
          assetNumber: this.generalForm.equipment,
          raisedBy: this.employee.name,
          date: AESTCurrentDateTime()
        }
      };
      try {
        let defectUpdateStatus = false
        const defectOfflinePayload = {
          task: task,
          targetItem: item
        } as offlineDefectPayload
        if (!isOfflineOrSlowInternetConnection()) {
          defectUpdateStatus = await this.updateDefectOnServer(params, defectPayload, defectOfflinePayload)
        } else {
          defectUpdateStatus = await this.updateDefectOnLocalDB(defectPayload, task, item, bindingKey)
        }
        if (!defectUpdateStatus) {
          return defectUpdateStatus
        }
        this.stateMeasurementValue = '';
        this.stateUOM = '';
        this.stateImageKey = '';

        // post task
        // update ke stateStoredAdjustmentOptionValue
        const selectedGroup = this.groups.find((el) => {
          return el.isSelected;
        }) as Group
        if (!isOfflineOrSlowInternetConnection()) {
          this.getTaskProgress()
          this.updateGroupByParam(this.stateSelectedGroup!.groupName)
        }
        this.updateStoredAdjustmentOptionValue(item.value as string)
        return true
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
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
        await db.preServiceReason.clear()
        reasonData.forEach(async (reason) => {
          await db.preServiceReason.add(cloneDeep({
            reason: reason
          }))
        })
        reasonData.push("Other")
        this.stateSkipPreServiceReasonOptions = reasonData
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_get_skip_pre_service_reason`, {
          errorMessage: error
        })
        sendErrorEvent('IRONS', error);
      }
    },
    // -------------------- OFFLINE MODE --------------------
    async updateSkipPreServiceReasonOptionsFromLocalDB() {
      const reasonData: string[] = []
      const reasonLocalDB = await db.preServiceReason.toArray()
      reasonLocalDB.forEach((data) => {
        reasonData.push(data.reason)
      })
      reasonData.push("Other")
      this.stateSkipPreServiceReasonOptions = reasonData
    },
    getFieldValueByKey(key, field) {
      let res = ''
      this.stateServiceSheets.forEach((subGroup) => {
        subGroup.subGroup.forEach((subGroup) => {
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
              if (!isUndefined(task.adjustment)) {
                if (task.adjustment.key == key) {
                  for (const taskAdjustmentKey in task.adjustment) {
                    if (taskAdjustmentKey == field) {
                      res = task.adjustment[taskAdjustmentKey]
                      return res
                    }
                  }
                  return
                }
              }
              if (!isUndefined(task.replacement)) {
                if (task.replacement.key == key) {
                  for (const taskAdjustmentKey in task.replacement) {
                    if (taskAdjustmentKey == field) {
                      res = task.replacement[taskAdjustmentKey]
                      return res
                    }
                  }
                  return
                }
              }
              if (!isUndefined(task.cleaned)) {
                if (task.cleaned.key == key) {
                  for (const taskAdjustmentKey in task.cleaned) {
                    if (taskAdjustmentKey == field) {
                      res = task.cleaned[taskAdjustmentKey]
                      return res
                    }
                  }
                  return
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
      })
      return res
    },
    updateFieldValueByKey(key, field, value) {
      this.stateSelectedSubGroups.forEach((subGroup) => {
        if (subGroup.key == key) {
          for (const subGroupKey in subGroup) {
            if (subGroupKey == field) {
              subGroup[subGroupKey] = value
              this.updateServiceDetailToLocalDB()
              return
            }
          }
        }
        subGroup.taskGroup.forEach((taskGroup) => {
          if (taskGroup.key == key) {
            for (const taskGroupKey in taskGroup) {
              if (taskGroupKey == field) {
                taskGroup[taskGroupKey] = value
                this.updateServiceDetailToLocalDB()
                return
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
                        currItem[itemKey] = value
                        this.updateServiceDetailToLocalDB()
                        return
                      }
                    }
                  }
                }
              }
            }
            if (task.key == key) {
              for (const taskKey in task) {
                if (taskKey == field) {
                  task[taskKey] = value
                  this.updateServiceDetailToLocalDB()
                  return
                }
              }
              task[field] = value
              this.updateServiceDetailToLocalDB()
              return
            }
            if (!isUndefined(task.adjustment)) {
              if (task.adjustment.key == key) {
                for (const taskAdjustmentKey in task.adjustment) {
                  if (taskAdjustmentKey == field) {
                    task.adjustment[taskAdjustmentKey] = value
                    this.updateServiceDetailToLocalDB()
                  }
                }
                return
              }
            }
            if (!isUndefined(task.replacement)) {
              if (task.replacement.key == key) {
                for (const taskReplacementKey in task.replacement) {
                  if (taskReplacementKey == field) {
                    task.replacement[taskReplacementKey] = value
                    this.updateServiceDetailToLocalDB()
                  }
                }
                return
              }
            }
            if (!isUndefined(task.cleaned)) {
              if (task.cleaned.key == key) {
                for (const taskReplacementKey in task.cleaned) {
                  if (taskReplacementKey == field) {
                    task.cleaned[taskReplacementKey] = value
                    this.updateServiceDetailToLocalDB()
                  }
                }
                return
              }
            }
            task.items.forEach((item) => {
              if (item.key == key) {
                for (const itemKey in item) {
                  if (itemKey == field) {
                    item[itemKey] = value
                    this.updateSelectedSubGroupToServiceSheetsArr()
                    return
                  }
                }
              }
            })
          })
        })
      })
      return
    },
    updateSelectedSubGroupToServiceSheetsArr() {
      this.stateServiceSheets.forEach((group) => {
        if (group.groupName == this.stateSelectedGroup?.groupName) {
          group.subGroup = this.stateSelectedSubGroups
        }
      })
      this.getGroups()
    },
    async updateServiceSheetTaskOnLocalDB(payload: UpdateParam[], key, item, needTaskKey = false, bindingKey = '') {
      let updateStatus = false
      const body = {
        headerId: this.stateSelectedGroup!.headerId,
        workorder: this.stateSelectedGroup!.workOrder,
        id: this.stateSelectedGroup!.id,
        updateParams: payload,
        employee: {
          id: this.employee.id,
          name: this.employee.name,
        },
        localStatus: this.generalFormStore.stateGeneralForm.status
      } as any
      if (needTaskKey) {
        body.taskKey = key
      }
      this.stateTaskUpdated = false

      await deleteByWOItemKey(this.stateGeneralForm.workOrder, item)
      // update task
      await db.pendingTask.add({
        module: 'serviceForm',
        section: 'E-Form',
        type: 'Task',
        key: key,
        bindingKey: bindingKey ?? key,
        workorder: this.stateGeneralForm.workOrder,
        payload: JSON.stringify(body),
        syncDate: AESTShortCurrentDateTime(),
        itemKey: item,
        syncStatus: 'Pending'
      })
      // update to DB
      this.updateLocalServiceSheetByParam(payload)
      await this.updateServiceDetailToLocalDB()
      this.updateTaskProgressOnLocalDB2()
      // update task progress
      updateStatus = true
      this.setTaskUpdated()
      this.stateTaskUpdated = true;
      // get value of prev. brake pack when offline
      await this.getPreviousBrakePackValue()
      return updateStatus
    },
    async updateTaskProgressOnLocalDB2() {
      let taskDone = 0
      // get selected subgroup
      const taskWithGroupId: Task[] = []
      const groupTaskIdArr: string[] = []
      const taskWithoutGroupId: Task[] = []

      this.stateSelectedSubGroups.filter((subGroup) => {
        return subGroup.taskGroup.some((taskGroup) => {
          return taskGroup.task.some((task: Task) => {
            if (!isUndefined(task.taskValue)) {
              if (task.groupTaskId) {
                if (!groupTaskIdArr.includes(task.groupTaskId)) {
                  groupTaskIdArr.push(task.groupTaskId)
                }
                taskWithGroupId.push(task)
              } else {
                taskWithoutGroupId.push(task)
              }
            }
          })
        });
      })

      let GroupWithIdDoneTaskCounter = 0
      groupTaskIdArr.forEach((id) => {
        const sameGroupIdTasks = taskWithGroupId.filter((task) => {
          return task.groupTaskId == id
        })

        const allTaskValue: string[] = []
        let taskWithNA = 0
        let taskNaLastIndex = false
        let taskType = ""
        // --- brake type ---
        let brakeTypeTask = false
        let disableOtherTask = false

        sameGroupIdTasks.forEach((task, index) => {
          if (task?.parentGroupTaskId) {
            brakeTypeTask = true
          }
          allTaskValue.push(task.taskValue)
          if (task.category == "NORMAL" || (task.category == "CBM" && task.rating == "NORMAL") || task.category == "CRACK") {
            taskType = task.category
            taskWithNA++
            if ((index + 1) == sameGroupIdTasks.length) {
              taskNaLastIndex = true
            }
          }

          task.items.forEach((item) => {
            if (item?.disabledByItemKey) {
              disableOtherTask = true
            }
          })
        })

        if (brakeTypeTask) {
          const parentIdArr: string[] = []
          let allTaskInOneGroupId = 0
          let doneTaskInOneGroupId = 0

          // kumpulin parent child yg punya id sama
          // cari total task yg harus diisi
          sameGroupIdTasks.forEach((task, index) => {
            if (task?.parentGroupTaskId) {
              if (!parentIdArr.includes(task?.parentGroupTaskId)) {
                parentIdArr.push(task?.parentGroupTaskId)
                allTaskInOneGroupId++
              }
            } else if (task?.childGroupTaskId) {
              if (!parentIdArr.includes(task?.childGroupTaskId)) {
                parentIdArr.push(task?.childGroupTaskId)
                allTaskInOneGroupId++
              }
            } else {
              allTaskInOneGroupId++
              if (task.taskValue) {
                doneTaskInOneGroupId++
              }
            }
          })

          // check task with parent child
          parentIdArr.forEach((parentId) => {
            const brakeTypeTaskArr = sameGroupIdTasks.filter((task) => {
              const sameParentId = task?.parentGroupTaskId == parentId
              const sameChildId = task?.childGroupTaskId == parentId
              return sameParentId || sameChildId
            })

            const childTaskArr: Task[] = []
            brakeTypeTaskArr.forEach((btTask) => {
              if (btTask?.parentGroupTaskId) {
                if (btTask.taskValue) {
                  doneTaskInOneGroupId++
                  return
                }
              } else {
                childTaskArr.push(btTask)
              }
            })

            if (childTaskArr.length > 0) {
              let totalChild = 0
              let answeredChild = 0
              childTaskArr.forEach((cTask) => {
                totalChild++
                if (cTask.taskValue) {
                  answeredChild++
                }
              })

              if (totalChild == answeredChild) {
                doneTaskInOneGroupId++
              }
            }
          })

          if (doneTaskInOneGroupId == allTaskInOneGroupId) {
            GroupWithIdDoneTaskCounter++
          }
        } else {
          // cek task with group id biasa (biasanya dalam table task CBM auto manual)
          if (!allTaskValue.includes("")) {
            GroupWithIdDoneTaskCounter++
          // cek task yang punya NA, karena task NA mengdisable task bawahnya
          } else if (taskWithNA > 0) {
            // jika task NA nya 1 kemungkinan dia mendisable task bawahnya
            if (taskWithNA == 1) {
              // jika task NA ada di paling bawah, dia tidak disable task lain, jadi cek semua input
              if (taskNaLastIndex) {
                if (!allTaskValue.includes("")) {
                  GroupWithIdDoneTaskCounter++
                }
              } else {
                // kemungkinan NA mendisable task bawahnya, itung 1
                if (taskType == "NORMAL" || taskType == "CBM") {
                  if (allTaskValue.includes("3") && disableOtherTask) {
                    GroupWithIdDoneTaskCounter++
                  }
                } else if (taskType == "CRACK") {
                  if (allTaskValue.includes("4") && disableOtherTask) {
                    GroupWithIdDoneTaskCounter++
                  }
                }
              }
            // task NA lebih dari 1, kemungkinan harus isi semua
            } else {
              if (!allTaskValue.includes("")) {
                GroupWithIdDoneTaskCounter++
              }
            }
          }
        }
      })

      let GroupWithoutIdDoneTaskCounter = 0
      taskWithoutGroupId.forEach((task) => {
        if (task.taskValue) {
          GroupWithoutIdDoneTaskCounter++
        }
      })
      taskDone = GroupWithIdDoneTaskCounter + GroupWithoutIdDoneTaskCounter

      this.stateTaskProgress.forEach((group) => {
        if (group.group == this.selectedGroup?.groupName) {
          group.doneTask = taskDone
        }
      })
      this.stateGroups.forEach((group) => {
        if (group.groupName == this.stateSelectedGroup!.groupName) {
          group.doneTask = taskDone
        }
      })
      this.stateServiceSheets.forEach((group) => {
        if (group.groupName == this.stateSelectedGroup!.groupName) {
          group.doneTask = taskDone
        }
      })
      // update defect identified
      const defectIdentifiedGroup = this.stateServiceSheets.find((group) => {
        return group.groupName == 'DEFECT_IDENTIFIED_SERVICE'
      })
      if (defectIdentifiedGroup) {
        let totalDefect = 0
        const defectsOnWO = await db.serviceSheetDefect.where({
          workorder: this.stateGeneralForm.workOrder,
          isActive: "true"
        }).toArray()
        if (defectsOnWO) {
          totalDefect = defectsOnWO.length
        }
        defectIdentifiedGroup.totalTask = totalDefect
        defectIdentifiedGroup.doneTask = totalDefect
      }
      this.updateServiceDetailToLocalDB()
    },
    async updateServiceDetailToLocalDB() {
      this.updateSelectedSubGroupToServiceSheetsArr()
      let serviceSheets = cloneDeep(this.stateServiceSheets)
      const general = cloneDeep(this.stateGeneralForm)
      serviceSheets = serviceSheets.filter((group) => {
        return group.groupName != "General"
      })
      await db.serviceSheetDetail.update(this.generalForm.workOrder, cloneDeep({
        id: this.generalForm.workOrder,
        general: general,
        serviceSheet: serviceSheets
      }))
    },
    updateSelectedSubGroupFromServiceSheets() {
      this.stateServiceSheets.forEach((item) => {
        if (item.groupName == this.stateSelectedGroup?.groupName) {
          this.stateSelectedSubGroups = item.subGroup
        }
      })
    },
    updateLocalServiceSheetByParam(updateParams: UpdateParam[]) {
      updateParams.forEach((updateParam) => {
        updateParam.propertyParams.forEach((propertyParam) => {
          let val = propertyParam.propertyValue as any
          if (val && isNaN(val)) {
            if (val.includes("[") || (val).includes("]")) {
              try {
                val = JSON.parse(val) as string[]
              } catch (error) {
                val = propertyParam.propertyValue as any
              }
            }
            if (propertyParam.propertyName == "updatedBy" && propertyParam.propertyValue != "") {
              val = JSON.parse(val)
            }
          }
          this.updateFieldValueByKey(updateParam.keyValue, propertyParam.propertyName, val)
        })
      })
    },
    async updateDefectHeaderWithTaskKey(
      key,
      payload: UpdateParam[],
      itemKey,
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
          serviceSheetDetailId: this.stateSelectedGroup!.id,
          workorder: this.generalForm.workOrder,
          taskKey: key,
          updateParams: payload,
          employee: {
            id: this.employee.id,
            name: this.employee.name,
          },
          localStatus: this.generalFormStore.stateGeneralForm.status
        };
        if (cbmRatingType != "") {
          body["cbmRatingType"] = cbmRatingType
        }
        this.stateTaskUpdated = false;
        if (!isOfflineOrSlowInternetConnection()) {
          await ApiService.post(
            `${UPDATEDEFECTHEADERBYSERVICESHEETDETAILURL}?${new URLSearchParams(
              params,
            ).toString()}`,
              body as AxiosRequestConfig,
          );
        } else {
          await db.pendingTask.add({
            module: 'serviceForm',
            section: 'E-Form',
            type: 'UpdateDefect',
            workorder: this.stateGeneralForm.workOrder,
            key: key,
            bindingKey: key,
            payload: JSON.stringify(body),
            syncDate: AESTShortCurrentDateTime(),
            itemKey: itemKey,
            syncStatus: 'Pending'
          })
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_update_defect_with_task_key`, {
          errorMessage: error
        })
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        this.globalConnectionStore.setSubmitConnectionError(isNoNetwork)
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
      }
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
    async resetCBMAutomation(task, bindingKey = '') {
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
      if (!isOfflineOrSlowInternetConnection()) {
        await this.updateServiceSheetTaskValue(payload, "", "")
      } else {
        await this.updateServiceSheetTaskOnLocalDB(payload, task.key, `resetCBM-${task.key}`, false, bindingKey)
      }
      await deleteDefectByTaskId(this.generalForm.workOrder, task.key)
      console.log("end reset task");
    },
    // -------------------- OFFLINE MODE --------------------
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
          const previousCracks = cloneDeep(response.data.result.content)
          const previousCracksSameWO = db.previousCrack.where({
            workOrder: this.stateWorkOrder
          })
          if (previousCracksSameWO) {
            previousCracksSameWO.delete()
          }
          previousCracks.forEach(async (element) => {
            await db.previousCrack.add({
              taskId: element.taskId,
              workOrder: this.stateWorkOrder,
              previousCrack: element.previousCrack
            })
          });
        } catch (error) {
          sendErrorEvent('IRONS', error);
          console.log("error get previous each wo");
        }
      }
    },
    async handleGetAndUpdatePreviousTandem(serviceSheetJSON: GenerateServiceSheet) {
      let isFormHasTaskPrevious = false
      let isFormHasTaskPreviousGroup = false
      let isPreviousTandemHasFilled = false
      let isPreviousTandemGroupHasFilled = false
      let mechanicalSubGroup = [] as SubGroup[]
      serviceSheetJSON.serviceSheet.forEach((group) => {
        this.statePreviousTandemTasks = []
        mechanicalSubGroup = group.subGroup
        group.subGroup.forEach((subGroup) => {
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
              } else if (task.rating == "AUTOMATIC_PREVIOUS_GROUP") {
                isFormHasTaskPreviousGroup = true
                const prevTask = {} as DisabledItem
                isFormHasTaskPreviousGroup = true
                prevTask.key = task.key
                this.statePreviousTandemTasks.push(task.key)
                task.items.forEach((item) => {
                  if (item.categoryItemType == "previousParamRating") {
                    if (item.value != "" && item.value != "-") {
                      isPreviousTandemGroupHasFilled = true
                    }
                    prevTask.value = item.value
                  }
                })
                this.stateNewPreviousTandemTasks.push(prevTask)
              }
            })
          })
        })
      })
      if ((isFormHasTaskPrevious && !isPreviousTandemHasFilled) || (isFormHasTaskPreviousGroup && !isPreviousTandemGroupHasFilled)) {
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
              equipmentNumber: serviceSheetJSON.general.equipment,
              modelId: serviceSheetJSON.general.modelId,
            } as AxiosRequestConfig,
          );
          let previousTandemArr = [] as any[]
          previousTandemArr = res.data.result.content ? res.data.result.content : []
          await db.serviceFormPreviousTandem.put({
            id: serviceSheetJSON.general.workOrder,
            previousTandem: cloneDeep(previousTandemArr)
          })
        } catch (e) {
          sendErrorEvent('IRONS', e);
          console.log("error get tandem", e);
        }
      }
    },
    async handleGetAndUpdatePreviousReplacement(serviceSheetJSON: GenerateServiceSheet) {
      const needToUpdates = [] as Task[]
      serviceSheetJSON.serviceSheet.forEach((group) => {
        if (group?.key == "ELECTRICAL_SERVICE") {
          const taskReplacement = useTaskReplacement(group)
          const replacementTasks = taskReplacement.getTaskReplacementInSubGroup(group.subGroup)
          const groupTaskIds = this.getReplacementMappingGroupTaskId(replacementTasks)
          for (const groupTaskId of groupTaskIds) {
            const tasks = this.getReplacementPerGroupTask(replacementTasks, groupTaskId)
            const isNeedToUpdate = !this.checkIfAnyRatingValueSet(tasks)
            if (isNeedToUpdate) needToUpdates.push(...tasks)
          }
        }
      })
      if (needToUpdates.length > 0) {
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
              equipmentNumber: serviceSheetJSON.general.equipment,
              modelId: serviceSheetJSON.general.modelId,
            } as AxiosRequestConfig,
          );
          let previousTandemArr = [] as any[]
          previousTandemArr = res.data.result.content ? res.data.result.content : []
          console.log("previousTandemArr", previousTandemArr);
          await db.serviceFormPreviousReplacement.put({
            id: serviceSheetJSON.general.workOrder,
            previousTandem: cloneDeep(previousTandemArr)
          })
        } catch (e) {
          sendErrorEvent('IRONS', e);
          console.log("error get prev replacement", e);
        }
      }
    },
    setSerialNumberGeneral(serialNumber: string) {
      this.stateGeneralForm.serialNumber = serialNumber
    },
    // =================== replacement ====================
    checkIfAnyPreviousValueNotSet(tasks: Task[]): boolean {
      let result = false
      for (const task of tasks) {
        const item = task.items.find((i) => {
          return i.categoryItemType === "previousParamRating"
        })
        if (!item) continue
        result = !item.value || item.value == "-"
        if (result) break
      }
      return result
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
      if (!isOfflineOrSlowInternetConnection()) {
        const params = {
          ver: "v1",
        };
        const res: AxiosResponse<SingleApiResponse<PreviousReplacement[]>> = await ApiService.post(
          `${GET_PREVIOUS_REPLACEMENT}?${new URLSearchParams(
            params,
          ).toString()}`,
          {
            equipmentNumber: this.generalForm.equipment,
            modelId: this.generalForm.modelId
          } as AxiosRequestConfig,
        )
        await db.serviceFormPreviousReplacement.put({
          id: this.stateGeneralForm.workOrder,
          previousTandem: cloneDeep(res.data.result.content)
        })
        this.statePreviousReplacement = res.data.result.content
      } else {
        const previousReplacementListLocal = await db.serviceFormPreviousReplacement.where({
          id: `${this.generalForm.workOrder}`
        }).first()
        if (previousReplacementListLocal) {
          this.statePreviousReplacement = previousReplacementListLocal.previousTandem
        }
      }
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
          if (!isOfflineOrSlowInternetConnection()) {
            await this.updateItemServiceSheetDetail(payload)
          } else {
            await this.updateServiceSheetTaskOnLocalDB(payload, task.key, item.key)
          }
          item.value = checkPrevValFirstHandler(prev)
        } catch (e) {
          console.log(`error when update previous value replacement to server with key ${item.key}`, e);
        }
      }
      await this.updateGroupByParam('ELECTRICAL_SERVICE')
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
      task.replacement.rating = task.replacement.measurement ? rating : ''
      const isValueValid = task.replacement.measurement && task.replacement.rating
      if (isValueValid) {
        // update data defect by condition
        let newDefectVal = {} as any
        newDefectVal = {
          isCbmAdjusment: 'true',
          isActive: 'true',
          correctedValue: rating,
          correctedMeasurement: task.replacement.measurement,
          correctedUom: task.replacement.uom
        }
        const updateDefectHeaderPayload = {
          serviceSheetDetailId: this.selectedGroup?.id,
          workorder: this.generalForm.workOrder,
          taskKey: task.key,
          updateParams: [
            {
              keyValue: "",
              propertyParams: [
                {
                  propertyName: "isCbmAdjusment",
                  propertyValue: 'true'
                },
                {
                  propertyName: "isActive",
                  propertyValue: 'true'
                },
                {
                  propertyName: "correctedMeasurement",
                  propertyValue: task.replacement.measurement
                },
                {
                  propertyName: "correctedValue",
                  propertyValue: rating
                },
                {
                  propertyName: "correctedUom",
                  propertyValue: task.replacement.uom
                },
              ]
            }
          ],
          employee: this.employee
        }
        try {
          if (!isOfflineOrSlowInternetConnection()) {
            await ApiService.post(`${UPDATEDEFECTHEADERBYSERVICESHEETDETAILURL}?${new URLSearchParams(params).toString()}`, updateDefectHeaderPayload as AxiosRequestConfig)
          } else {
            await this.updaterePlacementDefectOnLocalDB(task, newDefectVal, updateDefectHeaderPayload, true)
          }
        } catch (error) {
          updateLoggedInStatusFromAPIResponse(error)
          sendErrorEvent('IRONS', error);
          console.log(error)
        }
      }
      const propertyParams = {
        keyValue: task.replacement.key, // this will be adjustment key
        propertyParams: [
          {
            propertyName: "measurement",
            propertyValue: isValueValid ? task.replacement.measurement : ''
          },
          {
            propertyName: "rating",
            propertyValue: isValueValid ? task.replacement.rating : ''
          },
          {
            propertyName: "updatedBy",
            propertyValue: isValueValid ? JSON.stringify(this.employee) : ''
          },
          {
            propertyName: "updatedDate",
            propertyValue: isValueValid ? AESTCurrentDateTime() : ''
          },
        ]
      }
      if (task.replacement.createdDate == '') {
        propertyParams.propertyParams = [
          ...propertyParams.propertyParams,
          ...[
            {
              propertyName: "createdBy",
              propertyValue: isValueValid ? JSON.stringify(this.employee) : ''
            },
            {
              propertyName: "createdDate",
              propertyValue: isValueValid ? AESTCurrentDateTime() : ''
            }
          ]
        ]
      }
      const adjusmentUpdateParams = [
        propertyParams
      ]
      const adjustmentPayload = {
        headerId: this.stateSelectedGroup?.headerId,
        workorder: this.stateWorkOrder,
        id: this.stateSelectedGroup?.id,
        updateParams: adjusmentUpdateParams,
        "employee": this.employee
      }
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          const res = await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, adjustmentPayload as AxiosRequestConfig);
          if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
            this.stateFormAlreadySubmitted = true
          }
          if (res.data.result.message == ServiceSheetErrorMessages.CLOSE) {
            this.stateFormAlreadyClose = true
          }
          this.getTaskProgress()
          this.updateGroupByParam(this.stateSelectedGroup!.groupName)
        } else {
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `replacement-rating-${task.key}`)
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `reset-replacement-${task.key}`)
          // update data to task
          await db.pendingTask.add({
            module: 'serviceForm',
            section: 'E-Form',
            type: 'Task',
            workorder: this.stateGeneralForm.workOrder,
            key: task.key,
            bindingKey: task.key,
            payload: JSON.stringify(adjustmentPayload),
            syncDate: AESTShortCurrentDateTime(),
            itemKey: `replacement-rating-${task.key}`,
            syncStatus: 'Pending'
          })
          // update service sheet
          this.updateLocalServiceSheetByParam(adjusmentUpdateParams)
        }
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
      const newDefectVal = {
        taskValue: task.taskValue,
        cbmMeasurement: measurementVal,
        isCbmAdjusment: 'false',
        isActive: 'true',
        correctedValue: "",
        correctedMeasurement: "",
        correctedUom: ""
      }
      const revertDefectHeaderPayload = {
        serviceSheetDetailId: this.selectedGroup!.id,
        workorder: this.generalForm.workOrder,
        taskKey: task.key,
        updateParams: [
          {
            keyValue: "",
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
              {
                propertyName: "correctedValue",
                propertyValue: ''
              },
              {
                propertyName: "correctedMeasurement",
                propertyValue: ''
              },
              {
                propertyName: "correctedUom",
                propertyValue: ''
              },
            ]
          }
        ],
        employee: this.employee
      }
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          await ApiService.post(`${UPDATEDEFECTHEADERBYSERVICESHEETDETAILURL}?${new URLSearchParams(params).toString()}`, revertDefectHeaderPayload as AxiosRequestConfig)
        } else {
          await this.updaterePlacementDefectOnLocalDB(task, newDefectVal, revertDefectHeaderPayload)
        }
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      const adjusmentUpdateParams = [
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
      ]
      const adjustmentPayload = {
        headerId: this.stateSelectedGroup?.headerId,
        workorder: this.stateWorkOrder,
        id: this.stateSelectedGroup!.id,
        updateParams: adjusmentUpdateParams,
        "employee": this.employee,
        localStatus: this.generalFormStore.stateGeneralForm.status
      }
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          const res = await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, adjustmentPayload as AxiosRequestConfig);
          if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
            this.stateFormAlreadySubmitted = true
          }
          if (res.data.result.message == ServiceSheetErrorMessages.CLOSE) {
            this.stateFormAlreadyClose = true
          }
          this.updateLocalServiceSheetByParam(adjusmentUpdateParams)
          this.getTaskProgress()
          this.updateGroupByParam(this.stateSelectedGroup!.groupName)
        } else {
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `camera-replacement-${task.key}`)
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `changeComment-${task.replacement.key}`)
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `replacement-rating-${task.key}`)
          // update data to task
          await db.pendingTask.add({
            module: 'serviceForm',
            section: 'E-Form',
            type: 'Task',
            workorder: this.stateGeneralForm.workOrder,
            key: task.key,
            bindingKey: task.key,
            payload: JSON.stringify(adjustmentPayload),
            syncDate: AESTShortCurrentDateTime(),
            itemKey: `reset-replacement-${task.key}`,
            syncStatus: 'Pending'
          })
          // update service sheet
          this.updateLocalServiceSheetByParam(adjusmentUpdateParams)
        }
      } catch (error) {
        sendCustomEvent("fe_event_error_post_service_sheet_task", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    getCameraItem(activeGroupTaskId: string) {
      const taskCamera = this.getTaskReplacement(activeGroupTaskId).find((task) => {
        return task.rating === "CAB_SIDE"
      })
      return taskCamera
    },
    getTaskReplacement(activeGroupTaskId: string) {
      const taskReplacementArray: Task[] = []
      this.stateSelectedSubGroups[0].taskGroup.forEach((taskGroupItem) => {
        const filteredArray = taskGroupItem.task.filter((taskItem) => {
          return taskItem.groupTaskId === activeGroupTaskId
        })
        taskReplacementArray.push(...filteredArray)
      });
      return taskReplacementArray
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
    async getReplacementDefault(replacementDefaultPayload: ReplacementDefaultPayloadType): Promise<string> {
      try {
        let defaultValue = {} as ReplacementDefaultResponseType
        const localDefaultValues = await db.serviceFormReplacementDefaultValue.where({
          id: this.generalForm.workOrder,
        }).first()
        if (localDefaultValues) {
          console.log("localDefaultValues", localDefaultValues);
          localDefaultValues.defaultValues.every((value) => {
            console.log("loop", value);
            if (value.taskId === replacementDefaultPayload.taskId) {
              defaultValue = value
              return false
            } else {
              return true
            }
          })
        }
        if (isEmpty(defaultValue)) {
          if (!isOfflineOrSlowInternetConnection()) {
            const params = new URLSearchParams({ ver: "v1" }).toString()
            const response: AxiosResponse<SingleApiResponse<ReplacementDefaultResponseType>> = await ApiService.post(`${CBM_REPLACEMENT_DEFAULT_URL}?${params}`, replacementDefaultPayload as AxiosRequestConfig)
            defaultValue = response.data.result.content
          }
        }
        this.stateReplacementValue = defaultValue.defaultValue
        return this.stateReplacementValue
      } catch (error) {
        sendErrorEvent('IRONS', error);
        return error as string
      } finally {
        this.toggleIsReplaceValue(true)
      }
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
      const targetItem = task.items.find((taskItem: Item) => {
        return taskItem.categoryItemType == "targetRating";
      });
      if (rating == "C" || rating == "X") {
        const authStore = useAuthenticationStore();
        const params = {
          ver: "v1",
        };
        const taskNo = `${task.description.split(';')[0]};${task.description.split(';')[1]}`;
        const defectHeaderId = uuidv4()
        const defectDetailId = uuidv4()
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
                  propertyValue: AESTCurrentDateTime(),
                },
              ],
            },
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
                  propertyValue: AESTCurrentDateTime()
                },
              ]
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
            defectStatus: "Submited",
            isActive: "true",
            defectHeaderId: defectHeaderId,
            defectDetailId: defectDetailId
          },
        };
        let defectUpdateStatus = false
        if (!isOfflineOrSlowInternetConnection()) {
          defectUpdateStatus = await this.updateDefectOnServer(params, defectPayload)
        } else {
          let isTaskValue = false
          if (!isUndefined(targetItem!.isTaskValue) && targetItem!.isTaskValue) {
            isTaskValue = true
          }
          defectUpdateStatus = await this.updateDefectOnLocalDB(defectPayload, task, targetItem)
        }
        if (!defectUpdateStatus) {
          return {
            value: '',
            status: defectUpdateStatus
          }
        }
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
                propertyValue: AESTCurrentDateTime(),
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
                propertyValue: AESTCurrentDateTime(),
              },
            ],
          },
        ];
        if (!isOfflineOrSlowInternetConnection()) {
          await this.updateServiceSheetTaskValue(
            payload,
            this.employee.id.toString(),
            this.employee.name,
            false
          );
          setDefectIsActiveByTaskId(this.stateGeneralForm.workOrder, task.key, "false")
        } else {
          let isTaskValue = false
          if (!isUndefined(targetItem!.isTaskValue) && targetItem!.isTaskValue) {
            isTaskValue = true
          }
          this.updateServiceSheetTaskOnLocalDB(payload, task.key, targetItem?.key)
          setDefectIsActiveByTaskId(this.stateGeneralForm.workOrder, task.key, "false")
        }
        return {
          value: rating,
          status: true
        }
      }
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
      if (!isOfflineOrSlowInternetConnection()) {
        await this.updateServiceSheetTaskValue(
          payload,
          this.employee.id.toString(),
          this.employee.name,
          false
        )
      } else {
        await this.updateServiceSheetTaskOnLocalDB(payload, taskKey, itemKey, true)
      }
    },
    createCBMDefect(task: Task, rating: string): Promise<AxiosResponse<any>> | any {
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
    getCBMFormula(taskKey: string) {
      return this.stateCBMFormulas.filter((formula) => {
        return formula.taskKey == taskKey
      })
    },
    async getReplacementDefaultBulk(replacementDefaultPayload: ReplacementDefaultBulkPayloadType, workOrder: string): Promise<void> {
      try {
        const params = new URLSearchParams({ ver: "v1" }).toString()
        const formattedPayload: IntervantionReplacementDefaultBulkPayloadType = {
          ...replacementDefaultPayload,
          type: "serviceSheet"
        }
        const response: AxiosResponse<SingleApiResponse<ReplacementDefaultResponseType[]>> = await ApiService.post(`${CBM_REPLACEMENT_DEFAULT_BULK_URL}?${params}`, formattedPayload as AxiosRequestConfig)
        const defaultValueArr = response.data.result.content ?? []
        console.log("defaultValueArr", defaultValueArr)
        await db.serviceFormReplacementDefaultValue.put({
          id: workOrder,
          defaultValues: cloneDeep(defaultValueArr)
        })
        // this.stateReplacementValue = response.data.result.content?.defaultValue
        // return this.stateReplacementValue
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log("error get bulk default values", error)
      }
    },
    // =================== replacement ====================
    async resetAdjustmentCalibration() {
      const authStore = useAuthenticationStore();
      const payload: UpdateParam[] = []
      let taskId = ""
      let groupTaskId = ""
      // const bindingKey = bindingKeyGeneratorServiceSheet(props.task as Task)
      for (const subGroup of this.stateSelectedSubGroups) {
        for (const taskGroup of subGroup.taskGroup) {
          if (taskGroup.key == "MECHANICAL_SERVICE_SUSPENSION") {
            for (const task of taskGroup.task) {
              if (task.showParameter && task.showParameter == "cylinderHeightNeedAdjustment") {
                if (task.groupTaskId) {
                  groupTaskId = task.groupTaskId
                  taskId = task.groupTaskId
                }
                if (task.updatedDate) {
                  const itemPaylaod = {
                    keyValue: task.key,
                    propertyParams: [
                      {
                        propertyName: 'updatedBy',
                        propertyValue: ""
                      },
                      {
                        propertyName: 'updatedDate',
                        propertyValue: ""
                      },
                    ]
                  }
                  payload.push(itemPaylaod)
                }
                for (const item of task.items) {
                  const isCalbrationAdjusmentMeasurementValueInput = item.categoryItemType && item.categoryItemType == "adjustmentSuspensionRating"
                  const isCalibrationAdjustmentComment = item.valueItemType && item.valueItemType == "comment"
                  const isCalbrationAdjusmentMeasurementValueRating = item.categoryItemType && item.categoryItemType == "adjustmentSuspensionTargetRating"
                  if (isCalbrationAdjusmentMeasurementValueInput || isCalibrationAdjustmentComment || isCalbrationAdjusmentMeasurementValueRating) {
                    if (item.value) {
                      const itemPaylaod = {
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
                            propertyValue: ""
                          },
                        ]
                      }
                      payload.push(itemPaylaod)
                    }
                  }
                }
              }
            }
          }
        }
      }
      for (const adjItem of this.stateStoredAdjustedSuspensionCylinderValue) {
        adjItem.value = ""
      }
      if (payload.length > 0) {
        if (!isOfflineOrSlowInternetConnection()) {
          await this.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name)
        } else {
          await this.updateServiceSheetTaskOnLocalDB(payload, taskId, `resetAdjustment-${groupTaskId}`, false, groupTaskId)
        }
      }
    },
    // =================== cleaned ========================
    async getCleanedRating(task: Task, bindingKey = '') {
      const params = {
        ver: 'v1'
      }
      // get defect header
      // update data defect by condition
      let newDefectVal = {} as any
      newDefectVal = {
        cbmImageKey: task.cleaned.key,
        cbmImageProp: "pictures",
        isCbmAdjusment: 'true',
        isActive: 'true',
        correctedValue: task.cleaned.rating
      }
      const updateDefectHeaderPayload = {
        serviceSheetDetailId: this.selectedGroup!.id,
        workorder: this.generalForm.workOrder,
        taskKey: task.key,
        updateParams: [
          {
            keyValue: "",
            propertyParams: [
              {
                propertyName: "cbmImageKey",
                propertyValue: task.cleaned.key
              },
              {
                propertyName: "cbmImageProp",
                propertyValue: 'pictures'
              },
              {
                propertyName: "isCbmAdjusment",
                propertyValue: 'true'
              },
              {
                propertyName: "isActive",
                propertyValue: 'true'
              },
              {
                propertyName: "correctedValue",
                propertyValue: task.cleaned.rating
              },
            ]
          }
        ],
        employee: this.employee
      }
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          await ApiService.post(`${UPDATEDEFECTHEADERBYSERVICESHEETDETAILURL}?${new URLSearchParams(params).toString()}`, updateDefectHeaderPayload as AxiosRequestConfig)
        } else {
          await this.updateAdjustmentDefectOnLocalDB(task, newDefectVal, updateDefectHeaderPayload, true, bindingKey)
          // update to service sheet detail
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_update_adjustment_task`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
      }
      const propertyParams = {
        keyValue: task.cleaned.key, // this will be adjustment key
        propertyParams: [
          {
            propertyName: "rating",
            propertyValue: task.cleaned.rating
          },
          {
            propertyName: "updatedBy",
            propertyValue: JSON.stringify(this.employee)
          },
          {
            propertyName: "updatedDate",
            propertyValue: AESTCurrentDateTime()
          },
        ]
      }
      if (task.cleaned.createdDate == '') {
        propertyParams.propertyParams = [
          ...propertyParams.propertyParams,
          ...[
            {
              propertyName: "createdBy",
              propertyValue: JSON.stringify(this.employee)
            },
            {
              propertyName: "createdDate",
              propertyValue: AESTCurrentDateTime()
            }
          ]
        ]
      }
      const adjusmentUpdateParams = [
        propertyParams
      ]
      const adjustmentPayload = {
        headerId: this.selectedGroup?.headerId,
        workorder: this.stateWorkOrder,
        id: this.selectedGroup!.id,
        updateParams: adjusmentUpdateParams,
        "employee": this.employee,
        localStatus: this.generalFormStore.stateGeneralForm.status
      }
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          const res = await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, adjustmentPayload as AxiosRequestConfig);
          this.updateLocalServiceSheetByParam(adjusmentUpdateParams)
          if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
            this.stateFormAlreadySubmitted = true
          }
          this.getTaskProgress()
          this.updateGroupByParam(this.stateSelectedGroup!.groupName)
        } else {
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `cleaned-rating-${task.key}`)
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `reset-cleaned-${task.key}`)
          // update data to task
          await db.pendingTask.add({
            module: 'serviceForm',
            section: 'E-Form',
            type: 'Task',
            workorder: this.stateGeneralForm.workOrder,
            key: task.key,
            bindingKey: bindingKey,
            payload: JSON.stringify(adjustmentPayload),
            syncDate: AESTShortCurrentDateTime(),
            itemKey: `cleaned-rating-${task.key}`,
            syncStatus: 'Pending'
          })
          // update service sheet
          this.updateLocalServiceSheetByParam(adjusmentUpdateParams)
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_update_cleaned_task`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
      }
      return task.cleaned.rating
    },
    async addCBMCleanedPictures(task: Task) {
      const params = {
        ver: 'v1'
      }
      const propertyParams = {
        keyValue: task.cleaned.key, // this will be cleaned key
        propertyParams: [
          {
            propertyName: "pictures",
            propertyValue: JSON.stringify(task.cleaned.pictures)
          },
          {
            propertyName: "updatedBy",
            propertyValue: JSON.stringify(this.employee)
          },
          {
            propertyName: "updatedDate",
            propertyValue: AESTCurrentDateTime()
          },
        ]
      }
      const adjusmentUpdateParams = [propertyParams]
      const cleanedPayload = {
        headerId: this.selectedGroup?.headerId,
        workorder: this.stateWorkOrder,
        id: this.selectedGroup!.id,
        updateParams: adjusmentUpdateParams,
        "employee": this.employee,
        localStatus: this.generalFormStore.stateGeneralForm.status
      }
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          const res = await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, cleanedPayload as AxiosRequestConfig);
          if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
            this.stateFormAlreadySubmitted = true
          }
          this.updateLocalServiceSheetByParam(adjusmentUpdateParams)
          this.getTaskProgress()
          this.updateGroupByParam(this.stateSelectedGroup!.groupName)
        } else {
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `camera-cleaned-${task.key}`)
          await db.pendingTask.add({
            module: 'serviceForm',
            section: 'E-Form',
            type: 'Task',
            workorder: this.stateGeneralForm.workOrder,
            key: task.key,
            bindingKey: task.key,
            payload: JSON.stringify(cleanedPayload),
            syncDate: AESTShortCurrentDateTime(),
            itemKey: `camera-cleaned-${task.key}`,
            syncStatus: 'Pending'
          })
          // update service sheet
          this.updateLocalServiceSheetByParam(adjusmentUpdateParams)
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_post_cleaned_image`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
      }
    },
    async deleteCleanedTask(task: Task, bindingKey = '') {
      const params = {
        ver: 'v1'
      }
      // revert taskValue to initial value and change isdeleted to be false
      let imageKey = ''
      task.items.forEach((item) => {
        if (item.itemType == 'smallCamera') {
          imageKey = item.key
        }
      })
      const newDefectVal = {
        taskValue: task.taskValue,
        cbmImageKey: imageKey,
        cbmImageProp: "value",
        isCbmAdjusment: 'false',
        isActive: 'true',
        correctedValue: "",
        correctedUom: ""
      }
      const revertDefectHeaderPayload = {
        serviceSheetDetailId: this.selectedGroup!.id,
        workorder: this.generalForm.workOrder,
        taskKey: task.key,
        updateParams: [
          {
            keyValue: "",
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
                propertyName: "isCbmAdjusment",
                propertyValue: 'false'
              },
              {
                propertyName: "isActive",
                propertyValue: 'true'
              },
              {
                propertyName: "correctedValue",
                propertyValue: ''
              },
              {
                propertyName: "correctedUom",
                propertyValue: ''
              },
            ]
          }
        ],
        employee: this.employee
      }
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          await ApiService.post(`${UPDATEDEFECTHEADERBYSERVICESHEETDETAILURL}?${new URLSearchParams(params).toString()}`, revertDefectHeaderPayload as AxiosRequestConfig)
        } else {
          await this.updateAdjustmentDefectOnLocalDB(task, newDefectVal, revertDefectHeaderPayload, false, bindingKey)
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_delete_adjusment_defect`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
      }
      const adjusmentUpdateParams = [
        {
          keyValue: task.cleaned.key, // this will be adjustment key
          propertyParams: [
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
      ]
      const adjustmentPayload = {
        headerId: this.selectedGroup?.headerId,
        workorder: this.stateWorkOrder,
        id: this.selectedGroup!.id,
        updateParams: adjusmentUpdateParams,
        "employee": this.employee,
        localStatus: this.generalFormStore.stateGeneralForm.status
      }
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          const res = await ApiService.post(`${PUT_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, adjustmentPayload as AxiosRequestConfig);
          if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
            this.stateFormAlreadySubmitted = true
          }
          this.updateLocalServiceSheetByParam(adjusmentUpdateParams)
          this.getTaskProgress()
          this.updateGroupByParam(this.stateSelectedGroup!.groupName)
        } else {
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `cleaned-rating-${task.key}`)
          await deleteByWOItemKey(this.stateGeneralForm.workOrder, `reset-cleaned-${task.key}`)
          // update data to task
          await db.pendingTask.add({
            module: 'serviceForm',
            section: 'E-Form',
            type: 'Task',
            workorder: this.stateGeneralForm.workOrder,
            key: task.key,
            bindingKey: bindingKey ?? task.key,
            payload: JSON.stringify(adjustmentPayload),
            syncDate: AESTShortCurrentDateTime(),
            itemKey: `reset-cleaned-${task.key}`,
            syncStatus: 'Pending'
          })
          // update service sheet
          this.updateLocalServiceSheetByParam(adjusmentUpdateParams)
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_delete_adjsutment_task`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
      }
    },
    async checkApprovedLocalDefectOnTask(checkApprovedLocalDefectOnTaskPayload: CheckApprovedLocalDefectOnTaskPayload): Promise<CheckApprovedLocalDefectOnTaskResponse> {
      const localDefects = await db.serviceSheetDefect.where({
        workorder: this.stateGeneralForm.workOrder,
        taskId: checkApprovedLocalDefectOnTaskPayload.taskKey,
      }).toArray();
      let isAnyDefectAlreadyHandledBySPV = false;
      let isTaskDefectAlreadyHandledBySPV = false;
      for (const localDefect of localDefects) {
        const defectisApproved = localDefect.approvedBy && localDefect.approvedBy;
        const defectisDeclined = localDefect.declineDate
        if (defectisApproved || defectisDeclined) {
          isAnyDefectAlreadyHandledBySPV = true;
          break;
        }
      }
      if (isAnyDefectAlreadyHandledBySPV) {
        this.stateTaskErrorDialog = true;
        this.stateErrorMessageTaskErrorDialog = ServiceSheetErrorMessages.MODIFY_DEFECT_AFTER_SUPERVISOR_APPROVAL;
        isTaskDefectAlreadyHandledBySPV = true
      }
      return {
        isAlreadyHandledBySPV: isTaskDefectAlreadyHandledBySPV
      } as CheckApprovedLocalDefectOnTaskResponse;
    },
    getPistonMovementRatingPercentage(argument: GetPistonMovementRatingPercentageArgument): string {
      const task = argument.task;
      const item = argument.item;
      let rating = "";

      const taskFormulas = this.stateCBMFormulas.filter((formula) => {
        const isTaskValueSame = formula.taskKey == task.key;
        const isCBMTypeBrakePackPercentage = CBMTypeEnum.CBM_BRAKE_PACK_PERCENTAGE == formula.cbmType;
        return isTaskValueSame && isCBMTypeBrakePackPercentage
      });

      taskFormulas.every((formula, index) => {
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
      return rating;
    },
    async postFinalDataPistonMovementInput(argument: PostFinalDataPistonMovementInputArgument): Promise<void> {
      let pistonItemRating = {} as Item
      let targetItem = {} as Item
      const task = argument.task;
      let rating = "";
      let updateParams = argument.updateParams

      pistonItemRating = task.items.find((item) => {
        return item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_RATING
      }) as Item

      targetItem = task.items.find((item) => {
        return item.categoryItemType == CategoryItemTypeEnum.TARGET_RATING
      }) as Item

      // get target rating
      const taskFormulas = this.stateCBMFormulas.filter((formula) => {
        const isTaskValueSame = formula.taskKey == task.key;
        const isCBMTypeBrakePackPercentage = CBMTypeEnum.CBM == formula.cbmType;
        return isTaskValueSame && isCBMTypeBrakePackPercentage
      });

      // need to format to make range 1 - 100 from 0.01 - 1
      const formatedPistonRating = clone(Number(pistonItemRating.value as string) * 100);

      taskFormulas.every((formula) => {
        // check 1st param
        const checkMin = checkMinValue(formula, formatedPistonRating);
        // check 2nd param
        const checkMax = checkMaxValue(formula, formatedPistonRating);
        rating = checkRating(checkMin, checkMax, formula);
        console.log("formatedPistonRating", formatedPistonRating, "checkMin", checkMin, "checkMax", checkMax, "formula", formula);
        if (rating) {
          return false;
        } else {
          return true;
        }
      });

      targetItem.value = rating;

      const targetItemPayload = [
        {
          keyValue: task.key,
          propertyParams: [
            {
              propertyName: "taskValue",
              propertyValue: targetItem.value,
            },
            {
              propertyName: "updatedBy",
              propertyValue: JSON.stringify(this.employee),
            },
            {
              propertyName: "updatedDate",
              propertyValue: AESTCurrentDateTime(),
            },
          ],
        },
        {
          keyValue: targetItem!.key,
          propertyParams: [
            {
              propertyName: 'value',
              propertyValue: targetItem.value
            },
            {
              propertyName: 'updatedBy',
              propertyValue: JSON.stringify(this.employee)
            },
            {
              propertyName: 'updatedDate',
              propertyValue: AESTCurrentDateTime()
            },
          ]
        },
      ] as UpdateParam[]

      for (const item of task.items) {
        const isPrevPistonAItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_A
        const isPrevPistonBItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_B
        const isPrevPistonResultItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RESULT
        const isPrevUomItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_UOM
        const isPrevPistonRatingItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING
        const isPrevPistonPercentageItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_PERCENTAGE
        const isOilCooledPistonItemsType = isPrevPistonAItem || isPrevPistonBItem || isPrevPistonResultItem || isPrevUomItem || isPrevPistonRatingItem || isPrevPistonPercentageItem

        if (isOilCooledPistonItemsType) {
          const isItemNotUpdated = !item.updatedDate || item.updatedDate == "";
          const isItemValNotEmpty = item.value && item.value != "";
          if (isItemNotUpdated && isItemValNotEmpty) {
            updateParams.push({
              keyValue: item.key,
              propertyParams: [
                {
                  propertyName: JSONFieldEnum.VALUE,
                  propertyValue: item.value as string,
                },
                {
                  propertyName: JSONFieldEnum.UPDATED_BY,
                  propertyValue: JSON.stringify(this.employee),
                },
                {
                  propertyName: JSONFieldEnum.UPDATED_DATE,
                  propertyValue: AESTCurrentDateTime(),
                },
              ],
            });
          }
        }
      }

      updateParams = [
        ...updateParams,
        ...targetItemPayload
      ]

      // check if defect or not
      const isDefect = rating == CBMRatingEnum.C || rating == CBMRatingEnum.X
      if (isDefect) {
        await this.postPistonDefectData({
          task: task,
          targetItem: targetItem,
          updateParams: updateParams,
          pistonItemRating: pistonItemRating.value as string
        })
      } else {
        if (!isOfflineOrSlowInternetConnection()) {
          await this.updateServiceSheetTaskValue(updateParams, this.useAuthenticationStore.user.EmployeeId, this.useAuthenticationStore.user.Name, true, task.key);
        } else {
          const bindingKey = bindingKeyGeneratorServiceSheet(task)
          await this.updateServiceSheetTaskOnLocalDB(updateParams, task.key, targetItem.key, true, bindingKey)
          setDefectIsActiveByTaskId(this.stateGeneralForm.workOrder, task.key, "false")
        }
      }
    },
    async postPistonDefectData(argument: postPistonDefectDataArgument): Promise<void> {
      const task = argument.task;
      const targetItem = argument.targetItem;
      const updateParams = argument.updateParams;
      const pistonItemRating = argument.pistonItemRating;
      let uom = "";
      let imageKey = "";
      let pistonAVal = "";
      let pistonBVal = "";
      let pistonResVal = "";
      let pistonToolVal = "";

      for (const item of task.items) {
        if (item.categoryItemType == CategoryItemTypeEnum.TERGET_TOOL) {
          uom = item.value as string
        } else if (item.itemType == ItemTypeEnum.SMALL_CAMERA) {
          imageKey = item.key
        } else if (item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_A) {
          pistonAVal = item.value as string;
        } else if (item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_B) {
          pistonBVal = item.value as string;
        } else if (item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_RESULT) {
          pistonResVal = item.value as string;
        } else if (item.categoryItemType == CategoryItemTypeEnum.DROPDOWN_TOOL) {
          let options = [] as Option[]
          if (item.caption && item.itemValue) {
            const itemValArr = item.caption.replace("[", "").replace("]", "").split("; ")
            const valArr = item.itemValue.replace("[", "").replace("]", "").split(", ")
            options = itemValArr.map((el, index) => {
              return {
                label: el.replaceAll("'", ''),
                value: valArr[index].replaceAll("'", '')
              }
            });
            options.forEach((opt) => {
              if (opt.value == item.value) {
                pistonToolVal = opt.label;
              }
            })
          }
        }
      }

      const authStore = useAuthenticationStore();
      const params = {
        ver: "v1",
      };
      const taskNo = `${task.description.split(';')[0]};${task.description.split(';')[1]}`;
      const defectHeaderId = uuidv4()
      const defectDetailId = uuidv4()
      const defectPayload = {
        updateParams: updateParams,
        headerId: (this.selectedGroup as Group).headerId,
        workOrder: (this.selectedGroup as Group).workOrder,
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
          cbmMeasurement: pistonItemRating,
          cbmUom: uom,
          cbmImageKey: imageKey,
          cbmImageProp: 'value',
          isCbmAdjusment: 'false',
          taskValue: targetItem.value,
          repairedStatus: "Not-Repaired",
          cbmNAStatus: "Not-Confirm",
          supervisor: {
            id: authStore.user.EmployeeId,
            name: authStore.user.Name,
          },
          status: "Submit",
          defectStatus: "Submited",
          isActive: "true",
          defectHeaderId: defectHeaderId,
          defectDetailId: defectDetailId,
          cbmPistonA: pistonAVal,
          cbmPistonB: pistonBVal,
          cbmPistonResult: pistonResVal,
          cbmPistonTool: pistonToolVal,
        },
      };
      const defectOfflinePayload = {
        task: task,
        targetItem: targetItem
      } as offlineDefectPayload
      if (!isOfflineOrSlowInternetConnection()) {
        await this.updateDefectOnServer(params, defectPayload, defectOfflinePayload)
      } else {
        const bindingKey = bindingKeyGeneratorServiceSheet(task)
        setDefectIsActiveByTaskId(this.stateGeneralForm.workOrder, task.key, "false")
        await this.updateDefectOnLocalDB(defectPayload, task, targetItem, bindingKey)
      }
    },
    async handleGetAndUpdatePreviousBrakePack(serviceSheetJSON: GenerateServiceSheet):Promise<void> {
      let isPrevTaskAlreadyFilled = true;
      for (const group of serviceSheetJSON.serviceSheet) {
        // for now brake pack is in mechanical n pre service
        const isGroupHasPrevBrakePackVal = group?.key == GroupKeyEnum.MECHANICAL_SERVICE || group?.key == GroupKeyEnum.PRE_SERVICE_OPERATIONAL_CHECK
        if (isGroupHasPrevBrakePackVal) {
          isPrevTaskAlreadyFilled = this.checkPreviousBrakePackValueAlreadyFilled(group.subGroup[0]);
          if (!isPrevTaskAlreadyFilled) break;
        }
      }
      if (!isPrevTaskAlreadyFilled) {
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
              equipmentNumber: serviceSheetJSON.general.equipment,
              modelId: serviceSheetJSON.general.modelId,
            } as AxiosRequestConfig,
          );
          console.log("response", res.data.result.content)
          let previousTandemArr = [] as any[]
          previousTandemArr = res.data.result.content ? res.data.result.content : []
          await db.serviceFormPreviousReplacement.put({
            id: serviceSheetJSON.general.workOrder,
            previousTandem: cloneDeep(previousTandemArr)
          })
        } catch (e) {
          sendErrorEvent('IRONS', e);
          console.log("error get prev replacement", e);
        }
      }
    },
    checkPreviousBrakePackValueAlreadyFilled(argument: SubGroup): boolean {
      let isFilled = true;
      for (const taskGroup of argument.taskGroup) {
        for (const task of taskGroup.task) {
          const taskObj = task as Task;
          const isCBMTask = taskObj.category == TaskCategoryEnum.CBM;
          // oil task rating task
          const isOilCooledRatingTask = taskObj.rating == TaskRatingEnum.OIL_COOLED;
          const isOilCooledCBMTask = isCBMTask && isOilCooledRatingTask;
          // is auto prev group task
          const isAutomaticPrevGroupRatingTask = taskObj.rating == TaskRatingEnum.CALIPER;
          const isAutoPrevGroupCBMTask = isAutomaticPrevGroupRatingTask && isCBMTask;

          if (isOilCooledCBMTask || isAutoPrevGroupCBMTask) {
            for (const item of taskObj.items) {
              // oil cooled piston task
              const isPrevPistonAItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_A
              const isPrevPistonBItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_B
              const isPrevPistonResultItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RESULT
              const isPrevUomItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_UOM
              const isPrevPistonRatingItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING
              const isPrevPistonPercentageItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_PERCENTAGE
              const isOilCooledPistonItemsType = isPrevPistonAItem || isPrevPistonBItem || isPrevPistonResultItem || isPrevUomItem || isPrevPistonRatingItem || isPrevPistonPercentageItem
              // automatic prev group task
              const isPrevParamRating = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_PARAM_RATING;
              const isPrevTargetRating = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_TARGET_RATING
              const isAutoPrevGroupItemsType = isPrevParamRating || isPrevTargetRating || isPrevUomItem

              if (isOilCooledPistonItemsType || isAutoPrevGroupItemsType) {
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
    async getPreviousBrakePackValue() {
      // cek apakah perlu ambil prev. brake pack pake function ini
      // checkPreviousBrakePackValueAlreadyFilled
      let isPrevTaskAlreadyFilled = true;
      // for now brake pack is in mechanical n pre service
      const isGroupHasPrevBrakePackVal = this.stateSelectedSubGroups[0].key == SubGroupKeyEnum.MECHANICAL_SERVICE || this.stateSelectedSubGroups[0].key == SubGroupKeyEnum.PRE_SERVICE_OPERATIONAL_CHECK
      // if current subGroup is not met prev condition, end function
      if (!isGroupHasPrevBrakePackVal) return;

      isPrevTaskAlreadyFilled = this.checkPreviousBrakePackValueAlreadyFilled(this.stateSelectedSubGroups[0])
      // isPrevTaskAlreadyFilled = false;
      // kalau iya ambil dari local atau dari server
      let prevBrakePackData = [] as PreviousReplacement[]

      if (isPrevTaskAlreadyFilled) return;

      prevBrakePackData = await this.getPreviousBrakePackData();
      // loop task

      const getPrevValueBasedOnCategoryType = (argument: GetPrevValueBasedOnCategoryTypeArgument): string => {
        // case 1 - 6 oil cooled piston task items
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
          case CategoryItemTypeEnum.PREVIOUS_PARAM_RATING:
            value = argument.previousData.lastValue ?? ""
            break;
          case CategoryItemTypeEnum.PREVIOUS_TARGET_RATING:
            value = argument.previousData.lastRating ?? ""
            break;
          default:
            break;
        }
        return value;
      }

      const updateParams = [] as UpdateParam[]
      // kebutuhan post data offline
      let itemKey = "";
      let taskKey = "";
      for (const taskGroup of this.stateSelectedSubGroups[0].taskGroup) {
        for (const task of taskGroup.task) {
          if (!taskKey) taskKey = task.key;
          const taskObj = task as Task;
          // oil task rating task
          const isCBMTask = taskObj.category == TaskCategoryEnum.CBM;
          const isOilCooledRatingTask = taskObj.rating == TaskRatingEnum.OIL_COOLED;
          const isOilCooledCBMTask = isCBMTask && isOilCooledRatingTask;
          // is auto prev group task
          const isAutomaticPrevGroupRatingTask = taskObj.rating == TaskRatingEnum.CALIPER;
          const isAutoPrevGroupCBMTask = isAutomaticPrevGroupRatingTask && isCBMTask;

          if (isOilCooledCBMTask || isAutoPrevGroupCBMTask) {
            for (const prevTask of prevBrakePackData) {
              if (prevTask.key == taskObj.key) {
                for (const item of taskObj.items) {
                  if (!itemKey) itemKey = item.key;
                  // oil cooled piston task prev. items
                  const isPrevPistonAItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_A;
                  const isPrevPistonBItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_B;
                  const isPrevPistonResultItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RESULT;
                  const isPrevUomItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_UOM;
                  const isPrevPistonRatingItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING;
                  const isPrevPistonPercentageItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_PERCENTAGE;
                  const isPrevPistonItems = isPrevPistonAItem || isPrevPistonBItem || isPrevPistonResultItem || isPrevUomItem || isPrevPistonRatingItem || isPrevPistonPercentageItem
                  // auto prev group task prev. items
                  const isLastParamRatingItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_PARAM_RATING;
                  const isLastTargetRatingItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_TARGET_RATING;
                  const isPrevGroupItems = isLastParamRatingItem || isLastTargetRatingItem;
                  // TODO: need to add this condition
                  const isValueEmpty = item.value == "" || item.value == "-";
                  if ((isPrevPistonItems || isPrevGroupItems) && isValueEmpty) {
                    const newVal = getPrevValueBasedOnCategoryType({
                      categoryItemType: item.categoryItemType,
                      previousData: prevTask
                    });
                    // jika newVal kosong gausa update ke BE
                    if (newVal && newVal != "-" && !item.updatedDate) {
                      item.value = newVal;
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (updateParams.length < 1) return;
      // update data to server or local
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          await this.updateItemServiceSheetDetail(updateParams)
        } else {
          await this.updateServiceSheetTaskOnLocalDB(updateParams, taskKey, itemKey, false, taskKey)
        }
      } catch (e) {
        console.log("serror updatedata setelah tandem drive");
      }
    },
    async getPreviousBrakePackData(): Promise<PreviousReplacement[]> {
      try {
        const params = {
          ver: "v1",
        };
        let previousTandemArr = [] as PreviousReplacement[]
        if (!isOfflineOrSlowInternetConnection()) {
          const res = await ApiService.post(
            `${GET_PREVIOUS_REPLACEMENT}?${new URLSearchParams(
              params,
            ).toString()}`,
            {
              equipmentNumber: this.generalForm.equipment,
              modelId: this.generalForm.modelId,
            } as AxiosRequestConfig,
          );
          previousTandemArr = res.data.result.content ? res.data.result.content : []
          await db.serviceFormPreviousReplacement.put({
            id: this.generalForm.workOrder,
            previousTandem: cloneDeep(previousTandemArr)
          })
          return previousTandemArr
        } else {
          const prevTandemLocal = await db.serviceFormPreviousReplacement.where({
            id: `${this.generalForm.workOrder}`
          }).first()
          if (prevTandemLocal) {
            previousTandemArr = prevTandemLocal.previousTandem
          }
        }
        return previousTandemArr;
      } catch (e) {
        sendCustomEvent(`fe_event_error_get_service_form_previous_tandem_data`, {
          errorMessage: e
        })
        console.log("error get tandem", e);
        sendErrorEvent('IRONS', e);
        return [] as PreviousReplacement[];
      }
    },
    // use other type argument because it has same necessary field
    async updateBrakeTypeDropdownValueAndResetOtherType(argument: GetPistonMovementRatingPercentageArgument): Promise<void> {
      const task = argument.task;
      const item = argument.item;
      const updateParams = [] as UpdateParam[];

      // item payload
      updateParams.push({
        keyValue: item.key,
        propertyParams: [
          {
            propertyName: JSONFieldEnum.VALUE,
            propertyValue: item.value as string
          },
          {
            propertyName: JSONFieldEnum.UPDATED_BY,
            propertyValue: JSON.stringify(this.employee)
          },
          {
            propertyName: JSONFieldEnum.UPDATED_DATE,
            propertyValue: AESTCurrentDateTime()
          },
        ]
      })
      // jika input caliper, reset oil cooled value
      // jika input oil cooled, reset caliper value
      // cari categoryTaskType negasi input
      let negationcategoryTaskType = "";
      if (item.value == BrakePackTypeDropdownValueEnum.OIL_COOLED) {
        negationcategoryTaskType = ShowParametereEnum.BRAKE_TYPE_CALIPER
      } else {
        negationcategoryTaskType = ShowParametereEnum.BRAKE_TYPE_OIL_COOLED
      }

      // cari task yang sesuai
      // cek jika task punya taskValue
      // hapus timestamp dan taskValue
      // loop ke item, cari input, camera dan dropdown, untuk input exclude previousValue
      for (const taskGroup of this.selectedSubGroups[0].taskGroup) {
        for (const task of taskGroup.task) {
          const taskObj = task as Task;
          if (taskObj.showParameter && taskObj.showParameter == negationcategoryTaskType) {
            if (taskObj.taskValue) {
              updateParams.push({
                keyValue: taskObj.key,
                propertyParams: [
                  {
                    propertyName: JSONFieldEnum.TASK_VALUE,
                    propertyValue: ""
                  },
                  {
                    propertyName: JSONFieldEnum.UPDATED_BY,
                    propertyValue: ""
                  },
                  {
                    propertyName: JSONFieldEnum.UPDATED_DATE,
                    propertyValue: ""
                  },
                ]
              })
            }
            if (isOfflineOrSlowInternetConnection()) {
              // get di local PendingTask
              // kalau case oil cooled dan caliper karena binding key pake task
              // hapusin yang binding key == task yang sync nya Pending
              const localPendingTasks = await db.pendingTask.where({
                workorder: this.stateWorkOrder,
                module: PendingTaskModuleEnum.SERVICE_FORM,
                bindingKey: taskObj.groupTaskId,
                syncStatus: PendingTaskSyncStatusEnum.PENDING
              });
              if (localPendingTasks) localPendingTasks.delete();
            }
            for (const item of taskObj.items) {
              const isItemDropdown = item.itemType == ItemTypeEnum.DROPDOWN;
              const isItemInput = item.itemType == ItemTypeEnum.INPUT;
              const isItemSmallCamera = item.itemType == ItemTypeEnum.SMALL_CAMERA;
              const isItemNotPrevValue = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING || item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_TARGET_RATING;
              const isInputAndFillableInput = isItemInput && !isItemNotPrevValue
              const isFillableItem = isItemDropdown || isItemSmallCamera || isInputAndFillableInput
              // prev value
              const isPrevPistonAItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_A
              const isPrevPistonBItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_B
              const isPrevPistonResultItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RESULT
              const isPrevUomItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_UOM
              const isPrevPistonRatingItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING
              const isPrevPistonPercentageItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_PERCENTAGE
              const isPrevParamRating = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_PARAM_RATING;
              const isPrevTargetRating = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_TARGET_RATING

              const lastItemVal = isPrevPistonAItem || isPrevPistonBItem || isPrevPistonResultItem || isPrevUomItem || isPrevPistonRatingItem || isPrevPistonPercentageItem || isPrevParamRating
              const isFillableAndLastItem = isFillableItem || lastItemVal
              isPrevTargetRating
              const isItemHasValue = item.value != ""
              if (isFillableAndLastItem && isItemHasValue) {
                updateParams.push({
                  keyValue: item.key,
                  propertyParams: [
                    {
                      propertyName: JSONFieldEnum.VALUE,
                      propertyValue: lastItemVal ? "-" : ""
                    },
                    {
                      propertyName: JSONFieldEnum.UPDATED_BY,
                      propertyValue: ""
                    },
                    {
                      propertyName: JSONFieldEnum.UPDATED_DATE,
                      propertyValue: ""
                    },
                  ]
                })
                if (isItemSmallCamera) {
                  this.cameraStore.clearImageById(item.key);
                }
              }
            }
          }
        }
      }

      // post data
      if (!isOfflineOrSlowInternetConnection()) {
        await this.updateServiceSheetTaskValue(updateParams, this.useAuthenticationStore.user.EmployeeId, this.useAuthenticationStore.user.Name)
      } else {
        const bindingKey = bindingKeyGeneratorServiceSheet(task as Task)
        await this.updateServiceSheetTaskOnLocalDB(updateParams, task.key, `${item.value}-${item.key}`, false, bindingKey)
      }
    }
  },
});
