import DefectYesClass from "@/core/classes/DefectYesClass"
import ApiService from "@/core/services/ApiService"
import {
  DefectPayload
} from "@/core/types/entities/dma/e-form/defects/DefectPayload"
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import { defineStore } from "pinia"
import {
  GET_DEFECT_DETAIL,
  UPDATE_TASK_WITH_DEFECT
} from "./urls"
import { Task } from '@/core/types/entities/dma/e-form/Task'
import { useEFormStore } from "@/store/pinia/dma/e-form-offline/useEFormStore"
import { Group } from "@/core/types/entities/dma/e-form/group"
import {
  UpdatedParam
} from "@/core/types/entities/dma/e-form/defects/UpdatedParam"
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore"
import {
  useOfflineCameraStore
} from "@/store/pinia/application/useOfflineCameraStore"
import { ImageObject } from "@/core/types/entities/dma/ImageObject"
import { Part } from "@/core/types/entities/dma/e-form/defects/Part"
import { Labour } from "@/core/types/entities/dma/e-form/defects/Labour"
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import {
  useGlobalConnectionStore
} from "@/store/pinia/application/useGlobalConnectionStore";
import { Item } from "@/core/types/entities/dma/e-form/Item"
import { clone } from "lodash"
import {
  AESTCurrentDateTime,
  AESTShortCurrentDateTime
} from "@/core/helpers/date-format"
import { ServiceSheetDefect } from "@/database/schema/ServiceSheetDefect"
import { db } from "@/database/schema/DexieSchema"
import {
  DefectDetailNo
} from "@/core/types/entities/dma/e-form/defects/DefectDetailNo"
import {
  GET_DATA_MULTIPLE_DEFECT_LIST,
  LOOKUP_OWNERSHIP_API_URL,
  POST_DATA_GENERIC_DEFECT,
  POST_DATA_MULTIPLE_DEFECT_LIST,
  GET_DEFECTS_HEADER,
  PART_REFERENCE_API
} from "../../e-form/defects/urls"
import { ApiResponse } from "@/core/types/misc/ApiResponse"
import { MultipleDefectList } from "@/database/schema/MultipleDefectList"
import { v4 as uuidv4 } from 'uuid';
import { useOnline } from "@vueuse/core"
import {
  ListItem as ListEquipmentNumber
} from "@/core/types/entities/iron-lake/equipment/equipment-number/ListItem"
import {
  convertErrorMessage,
  findIndexAndObject,
  getTitle
} from "../../e-form/helpers"
import { sendCustomEvent } from "@/core/helpers/azure-app-insight"
import {
  ApprovalData
} from "@/core/types/entities/dma/e-form/defects/ApprovalData"
import { Header } from "@/core/types/entities/dma/defects/Header"
import {
  useGeneralFormStore
} from "../useGeneralFormStore";
import { ServiceSheetErrorMessages } from "@/store/enums/ErrorMessagesEnum";
import {
  useOfflineDailyScheduleStore
} from "../../daily-schedule/useOfflineDailyScheduleStore"
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import { MachineSMUEnum } from "@/store/enums/MachineSMUEnum"
import {
  GeneralData,
  passingParameterCreateSMU
} from "@/core/types/entities/dma/defects/DefectSMU"
import { deleteByWOItemKey } from "@/core/helpers/ironforms/offline/task"
import { assignDefectDetail, downloadImageAttachments } from "./methods"
import {
  PartReference
} from "@/core/types/entities/dma/e-form/defects/PartReference"
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useDefectsFormStore = defineStore({
  id: "offlineDefectsForm",
  state: () => {
    return {
      stateIsYes: undefined as boolean | undefined,
      stateLoading: false,
      stateCancelled: false,
      stateDefectYesVisible: false,
      stateDefectGenericVisible: false,
      stateViewYesVisible: false,
      stateIsValid: true,
      stateItemKey: "",
      stateTask: {} as Task,
      stateDefectInfo: {} as DefectYesClass,
      statePayload: {
        updateParams: [] as UpdatedParam[]
      } as DefectPayload,
      stateItem: {} as Item,
      stateUpdateTaskDefect: "" as string,
      stateOpenDialogConfirmSubmitDefect: false as boolean,
      stateDefectUpdate: undefined as boolean | undefined,
      stateOwnership: '' as string,
      stateSerialNumber: '' as string,
      stateIsNeed30Minutes: false,
      stateApprovalDefectList: [] as ApprovalData[],
      stateSelectedApprovalDefect: {} as ApprovalData,
      stateErrorMessage: '',
      statePredefinedPriority: '',
      statePartReference: {} as PartReference
    }
  },
  getters: {
    Loading: (state) => {
      return state.stateLoading
    },
    Cancelled: (state) => {
      return state.stateCancelled
    },
    DefectGenericVisible: (state) => {
      return state.stateDefectGenericVisible
    },
    DefectYesVisible: (state) => {
      return state.stateDefectYesVisible
    },
    ViewYesVisible: (state) => {
      return state.stateViewYesVisible
    },
    ItemKey: (state) => {
      return state.stateItemKey
    },
    isValid: (state) => {
      return state.stateIsValid
    },
    isYes: (state) => {
      return state.stateIsYes
    },
    defectInfo: (state) => {
      return state.stateDefectInfo
    },
    selectedGroup: () => {
      const eFormStore = useEFormStore()
      return eFormStore.selectedGroup as Group
    },
    eformStore: () => {
      return useEFormStore()
    },
    selectedFitter: () => {
      const eFormStore = useEFormStore()
      return eFormStore.employee
    },
    supervisor: () => {
      const authStore = useAuthenticationStore()
      return {
        id: authStore.user.EmployeeId,
        name: authStore.user.Name
      }
    },
    images: () => {
      const cameraStore = useOfflineCameraStore()
      return cameraStore.ImageObjects.find((p) => {
        return p.Id === "defect"
      }) as ImageObject;
    },
    globalConnectionStore: () => {
      return useGlobalConnectionStore()
    },
    UpdateTaskDefect: (state) => {
      return state.stateUpdateTaskDefect
    },
    OpenDialogConfirmSubmitDefect: (state) => {
      return state.stateOpenDialogConfirmSubmitDefect
    },
    OnlineStatus: () => {
      return useOnline()
    },
    DefectUpdate: (state) => {
      return state.stateDefectUpdate
    },
    Ownership: (state) => {
      return state.stateOwnership
    },
    SerialNumber: (state) => {
      return state.stateSerialNumber
    },
    ApprovalDefect: (state) => {
      return state.stateSelectedApprovalDefect
    },
    dailyScheduleStore: () => {
      return useOfflineDailyScheduleStore()
    },
    PredefinedPriority: (state) => {
      return state.statePredefinedPriority
    }
  },
  actions: {
    toggleIsNeed30Minutes(status) {
      this.stateIsNeed30Minutes = status
    },
    setItem(item: Item) {
      this.stateItem = item
    },
    setPredefinedPriority(priority: string) {
      this.statePredefinedPriority = priority
    },
    setItemKey(key: string) {
      this.stateItemKey = key
    },
    setCancelledState(state: boolean) {
      this.stateCancelled = state
    },
    cretateInstance(isYes = true) {
      this.stateDefectInfo = new DefectYesClass()
      this.stateIsYes = isYes
      this.stateDefectInfo.setType(isYes ? "YES" : "NO")
    },
    setDefectRequirment(requirement: string) {
      this.stateDefectInfo.setDefectRequirement(requirement)
    },
    setTask(task: Task) {
      this.stateTask = task
    },
    toggleGenericVisible(value:boolean) {
      this.stateDefectGenericVisible = value
      this.stateCancelled = false
    },
    toggleYesVisible(value:boolean) {
      this.stateDefectYesVisible = value
      this.stateCancelled = false
    },
    toggleViewYesVisible(value:boolean) {
      this.stateViewYesVisible = value
    },
    createF55Payload(title: string) {
      const yesClass = this.stateDefectInfo as DefectYesClass
      const images = this.images?.ImageInfos ?? []
      const resources = yesClass.Resources.filter((r) => {
        return r.value !== ""
      })
      const formattedPartsDataList = yesClass.Parts.map((item) => {
        const qty = item.qty ? String(parseFloat(item.qty)) : item.qty

        return {
          ...item,
          qty,
        }
      })
      const formattedLabourDataList = yesClass.Labours.map((item) => {
        const qty = item.qty ? String(parseFloat(item.qty)) : item.qty
        const hireEach = item.hireEach ? String(parseFloat(item.hireEach)) : item.hireEach

        return {
          ...item,
          qty,
          hireEach
        }
      })
      this.statePayload.defectDetail = {
        isNeed30Minutes: yesClass.IsNeed30Minutes,
        type: yesClass.Type,
        title: title,
        assetNumber: yesClass.AssetNumber,
        description: yesClass.Description.value,
        raisedBy: this.selectedFitter.name,
        date: AESTCurrentDateTime(),
        plannedDuration: String(parseFloat(yesClass.PlannedDuration.value)),
        instruction: yesClass.Instruction.value,
        priority: yesClass.Priority,
        parts: JSON.stringify(formattedPartsDataList as Part[]),
        labours: JSON.stringify(formattedLabourDataList as Labour[]),
        resources: JSON.stringify(resources.map((r) => {
          return r.value
        })),
        symptoms: JSON.stringify(yesClass.Symptoms.map((s) => {
          return s.value
        })),
        causes: JSON.stringify(yesClass.Causes.map((c) => {
          return c.value
        })),
        images: JSON.stringify(images),
        requirement: yesClass.DefectRequirement,
        isComplete: yesClass.IsComplete
      }
    },
    createPayload(deleteDefectNA = false, defaultRepaired = true, needDetail = true) {
      const form = useEFormStore()
      this.statePayload.id = this.selectedGroup.id
      this.statePayload.headerId = this.selectedGroup.headerId
      this.statePayload.workorder = this.selectedGroup.workOrder
      this.statePayload.updateParams = []
      const dropdownItem = this.stateTask.items.find((item) => {
        return item.itemType == 'dropDown' && item.isTaskValue == true
      })
      const taskValuePayload = {
        keyValue: this.stateTask.key,
        propertyParams: [
          {
            propertyName: "taskValue",
            propertyValue: dropdownItem ? dropdownItem.value ? String(dropdownItem.value) : '2' : '2'
          },
          {
            propertyName: 'updatedBy',
            propertyValue: JSON.stringify(this.selectedFitter)
          },
          {
            propertyName: 'updatedDate',
            propertyValue: AESTCurrentDateTime()
          },
        ]
      }
      if (deleteDefectNA) {
        taskValuePayload.propertyParams.push({
          propertyName: 'reason',
          propertyValue: form.reasonNA
        })
      }
      this.statePayload.updateParams.push(taskValuePayload)
      this.statePayload.updateParams.push({
        keyValue: this.ItemKey,
        propertyParams: [
          {
            propertyName: "value",
            propertyValue: dropdownItem ? dropdownItem.value ? String(dropdownItem.value) : '2' : '2'
          },
          {
            propertyName: 'updatedBy',
            propertyValue: JSON.stringify(this.eformStore.employee)
          },
          {
            propertyName: 'updatedDate',
            propertyValue: AESTCurrentDateTime()
          }
        ]
      })
      this.statePayload.employee = this.selectedFitter
      const defectHeaderId = uuidv4()
      const defectDetailId = uuidv4()
      this.statePayload.defectHeader = {
        workorder: form.generalForm.workOrder,
        form: this.selectedGroup.modelId,
        serviceSheetDetailId: this.selectedGroup.id,
        category: this.stateTask.category,
        taskId: this.stateTask.key,
        taskNo: this.stateTask.description != "" ? this.stateTask.description.split(';')[0] : this.stateTask.items[0].value as string,
        taskDesc: this.stateTask.description != "" ? this.stateTask.description : this.stateTask.items[1].value as string,
        defectWorkorder: "",
        formDefect: "BA-PL-F55",
        defectType: this.stateIsYes ? "YES" : "NO",
        cbmMeasurement: '',
        cbmUom: '',
        cbmImageKey: '',
        cbmImageProp: '',
        isCbmAdjusment: '',
        cbmRatingType: this.stateTask.rating ?? '',
        taskValue: dropdownItem ? dropdownItem.value ? String(dropdownItem.value) : '2' : '2',
        repairedStatus: defaultRepaired ? "Repaired" : "Not-Repaired",
        cbmNAStatus: "Not-Confirm",
        supervisor: this.supervisor,
        status: "Submited",
        defectStatus: "Submited",
        isActive: "true",
        defectHeaderId: defectHeaderId,
        defectDetailId: defectDetailId,
        pic: this.selectedFitter.name,
        role: 'Fitter',
        declineReason: '',
        approveReason: '',
        action: 'Submitted'
      }
      const title = getTitle(this.stateTask)
      if (needDetail) {
        this.createF55Payload(title)
      }
    },
    createPayloadGeneric(additionalData) {
      const defectHeaderId = uuidv4()
      const defectDetailId = uuidv4()
      this.statePayload.employee = this.selectedFitter
      this.statePayload.defectHeader = {
        workorder: additionalData.workorder,
        form: additionalData.form,
        serviceSheetDetailId: "",
        category: "NORMAL",
        taskId: "",
        taskNo: "",
        taskDesc: additionalData.taskDesc,
        defectWorkorder: "",
        formDefect: "BA-PL-F55",
        defectType: "Generic",
        cbmMeasurement: '',
        cbmUom: '',
        cbmImageKey: '',
        cbmImageProp: '',
        isCbmAdjusment: '',
        taskValue: "",
        repairedStatus: "Not-Repaired",
        cbmNAStatus: "Not-Confirm",
        supervisor: this.supervisor,
        status: "Submited",
        defectStatus: "Submited",
        isActive: "true",
        defectHeaderId: defectHeaderId,
        defectDetailId: defectDetailId
      }
      this.createF55Payload(additionalData.taskDesc)
    },
    async setOpenDialogConfirmSubmitDefect(status: boolean) {
      this.stateOpenDialogConfirmSubmitDefect = status
    },
    async setUpdateTaskDefect(taskKey) {
      this.stateUpdateTaskDefect = taskKey
    },
    async createDefect(deleteDefectNA = false) {
      this.stateLoading = true
      const params = {
        ver: "v1"
      }
      try {
        const formStore = useEFormStore()
        await this.updateDefectToLocalDB(deleteDefectNA, false)
        if (formStore.reasonNA != "") {
          formStore.setReasonNA("")
        }
        const res = await ApiService.post(`${POST_DATA_MULTIPLE_DEFECT_LIST}?${new URLSearchParams(params).toString()}`,
        this.statePayload as AxiosRequestConfig)
        this.stateUpdateTaskDefect = this.statePayload.updateParams[0].keyValue
        this.setUpdateTaskDefect(this.statePayload.updateParams[0].keyValue)
        this.eformStore.updateLocalServiceSheetByParam(this.statePayload.updateParams)
        this.stateLoading = false
        switch (res.data.result.message) {
          case ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER:
            formStore.toggleTaskAlreadyUpdatedStatus(true)
            return false
          case ServiceSheetErrorMessages.SUBMITTED:
            formStore.toggleFormAlreadySubmitted(true)
            return false
          case ServiceSheetErrorMessages.CLOSE:
            formStore.toggleFormAlreadyClose(true)
            return false
          default:
            if (res.data.statusCode == 400) {
              formStore.toogleTaskErrorDialog(true)
              formStore.stateErrorMessageTaskErrorDialog = res.data.result.message
              return false
            }
            break;
        }
        // await deleteDefectByTaskId(this.eformStore.stateGeneralForm.workOrder, this.stateTask.key)
        return true
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_post_defect`, {
          errorMessage: error
        })
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        // this.globalConnectionStore.setSubmitConnectionError(isNoNetwork)
        this.stateLoading = false
        sendErrorEvent('IRONS', error);
        if (isNoNetwork) {
          this.stateUpdateTaskDefect = this.statePayload.updateParams[0].keyValue
          this.setUpdateTaskDefect(this.statePayload.updateParams[0].keyValue)
          this.eformStore.updateLocalServiceSheetByParam(this.statePayload.updateParams)
          this.eformStore.updateTaskProgressOnLocalDB2()
          return true
        }
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        return false
      }
    },
    async createSingleDefect(deleteDefectNA = false, isCleanRepair = false) {
      this.stateLoading = true
      const params = {
        ver: "v1"
      }
      try {
        const formStore = useEFormStore()
        await this.updateDefectToLocalDB(deleteDefectNA, false, false, isCleanRepair)
        if (formStore.reasonNA != "") {
          formStore.setReasonNA("")
        }
        const res = await ApiService.post(`${UPDATE_TASK_WITH_DEFECT}?${new URLSearchParams(params).toString()}`,
        this.statePayload as AxiosRequestConfig)
        this.stateUpdateTaskDefect = this.statePayload.updateParams[0].keyValue
        this.setUpdateTaskDefect(this.statePayload.updateParams[0].keyValue)
        this.eformStore.updateLocalServiceSheetByParam(this.statePayload.updateParams)
        this.stateLoading = false
        switch (res.data.result.message) {
          case ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER:
            formStore.toggleTaskAlreadyUpdatedStatus(true)
            return false
          case ServiceSheetErrorMessages.SUBMITTED:
            formStore.toggleFormAlreadySubmitted(true)
            return false
          case ServiceSheetErrorMessages.CLOSE:
            formStore.toggleFormAlreadyClose(true)
            return false
          default:
            if (res.data.statusCode == 400) {
              formStore.toogleTaskErrorDialog(true)
              formStore.stateErrorMessageTaskErrorDialog = res.data.result.message
              return false
            }
            break;
        }
        // await deleteDefectByTaskId(this.eformStore.stateGeneralForm.workOrder, this.stateTask.key)
        return true
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_post_defect`, {
          errorMessage: error
        })
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        // this.globalConnectionStore.setSubmitConnectionError(isNoNetwork)
        sendErrorEvent('IRONS', error);
        this.stateLoading = false
        if (isNoNetwork) {
          this.stateUpdateTaskDefect = this.statePayload.updateParams[0].keyValue
          this.setUpdateTaskDefect(this.statePayload.updateParams[0].keyValue)
          this.eformStore.updateLocalServiceSheetByParam(this.statePayload.updateParams)
          this.eformStore.updateTaskProgressOnLocalDB2()
          return true
        }
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        return false
      }
    },
    async updateDefectToLocalDB(deleteDefectNA = false, isUpdateToTask = true, isMultiDefect = true, isCleanRepair = false) {
      this.stateLoading = true
      const needDetail = !isCleanRepair
      const autoRepair = isCleanRepair
      this.createPayload(deleteDefectNA, autoRepair, needDetail)
      const clonedHeader = clone(this.statePayload.defectHeader) as any
      delete clonedHeader.supervisor
      delete clonedHeader.defectStatus
      // delete previous defect if any
      // await deleteDefectByTaskId(this.eformStore.stateGeneralForm.workOrder, this.stateTask.key)
      // save defect to db
      const defect = {
        ...clone(clonedHeader),
        defectData: JSON.stringify(this.statePayload.defectDetail),
        statusSync: !isOfflineOrSlowInternetConnection() ? "Sync" : "",
        key: "",
        assetNumber: "",
        imageAvailable: true,
        createdBy: clone(this.selectedFitter),
        createdDate: AESTCurrentDateTime(),
        updatedBy: clone(this.selectedFitter),
        updatedDate: AESTCurrentDateTime(),
      } as ServiceSheetDefect
      try {
        const existingDefect = db.serviceSheetDefect.where({
          cbmRatingType: "SERVICE_CLEANED_AND_REPLACED",
          workorder: this.eformStore.generalForm.workOrder,
          taskId: this.stateTask.key,
        });
        if (existingDefect) {
          await existingDefect.delete()
        }
        await db.serviceSheetDefect.add(defect)
        // save task to db
        if (isUpdateToTask) {
          const prevInput = db.pendingTask.where({
            workorder: this.eformStore.stateGeneralForm.workOrder,
            itemKey: this.ItemKey,
          });
          if (prevInput) {
            let isPreviousTaskNotDefect = false;
            // eslint-disable-next-line no-unexpected-multiline
            (await prevInput.toArray()).forEach((task) => {
              if (task.type != "MultipleDefect") {
                isPreviousTaskNotDefect = true
              }
            })
            if (isPreviousTaskNotDefect) {
              await prevInput.delete();
            }
          }
          if (!isMultiDefect) {
            // search delete
            await deleteByWOItemKey(this.eformStore.stateGeneralForm.workOrder, this.stateItemKey)
          }
          await db.pendingTask.add({
            module: 'serviceForm',
            section: 'E-Form',
            type: isMultiDefect ? 'MultipleDefect' : 'Defect',
            workorder: this.eformStore.generalForm.workOrder,
            key: this.stateTask.key,
            bindingKey: this.stateTask.key,
            payload: JSON.stringify(this.statePayload),
            syncDate: AESTShortCurrentDateTime(),
            itemKey: this.ItemKey,
            syncStatus: 'Pending'
          })
          this.setUpdateTaskDefect(this.statePayload.updateParams[0].keyValue)
          this.eformStore.updateLocalServiceSheetByParam(this.statePayload.updateParams)
          this.eformStore.updateTaskProgressOnLocalDB2()
          this.stateLoading = false
        }
        return true
      } catch (error) {
        console.log("error update defect to local", error);
        this.stateLoading = false
        return false
      }
    },
    async updateDefectSMUToLocalDB(updatedDetail : {
      val: string,
      hmOffset: string,
      range: {
        MinRange: number,
        MaxRange: number,
      },
      smuDate: string,
      isInRange: boolean
    }) {
      const { val, hmOffset, range, smuDate, isInRange } = updatedDetail
      let status = MachineSMUEnum.STATUS_NOT_IN_RANGE
      if (isInRange) {
        status = MachineSMUEnum.STATUS_IN_RANGE
      }
      this.stateLoading = true;
      const generalFormStore = useGeneralFormStore();
      const header = {
        headerId: generalFormStore.generalForm.id,
        defectHeaderId: generalFormStore.generalForm.id,
        workorder: generalFormStore.generalForm.workOrder,
        form: generalFormStore.generalForm.form,
        category: "GENERAL",
        taskId: "",
        formDefect: "",
        defectType: "machineSMU",
        taskDesc: MachineSMUEnum.TITLE(status),
        supervisor: this.supervisor,
        employee: clone(this.selectedFitter),
        status: "Submited",
        defectStatus: "Submited",
        isActive: "true"
      } as any;
      const detail = {
        title: MachineSMUEnum.TITLE(status),
        machineSMU: val,
        minRange: range.MinRange,
        maxRange: range.MaxRange,
        smuDue: generalFormStore.generalForm.psTypeId,
        assetNumber: generalFormStore.generalForm.equipment,
        serialNumber: generalFormStore.generalForm.serialNumber,
        type: 'machineSMU',
        images: JSON.stringify(generalFormStore.generalForm.imageEquipment ?? [])
      }
      const updateParams = [
        {
          keyValue: 'GENERAL',
          propertyParams: [
            {
              propertyName: 'smu',
              propertyValue: val
            },
            {
              propertyName: "smuBy",
              propertyValue: val !== '' ? JSON.stringify(this.selectedFitter) : ""
            },
            {
              propertyName: "smuDate",
              propertyValue: val !== '' ? smuDate : ""
            },
            {
              propertyName: "updatedBy",
              propertyValue: val !== '' ? JSON.stringify(this.selectedFitter) : ""
            },
            {
              propertyName: "updatedDate",
              propertyValue: val !== '' ? smuDate : ""
            }
          ]
        }
      ]
      if (hmOffset != "") {
        updateParams[0].propertyParams.push({
          propertyName: 'hmOffset',
          propertyValue: hmOffset
        })
        detail['hmOffset'] = hmOffset
      }
      const taskPayload = {
        id: generalFormStore.generalForm.id,
        updateParams: updateParams,
        headerId: generalFormStore.generalForm.id,
        workorder: generalFormStore.generalForm.workOrder,
        employee: this.selectedFitter,
        defectHeader: header,
        defectDetail: detail
      }
      const defect = {
        ...header,
        defectData: JSON.stringify({
          ...detail,
          createdBy: clone(this.selectedFitter),
          createdDate: AESTCurrentDateTime(),
          updatedBy: clone(this.selectedFitter),
          updatedDate: AESTCurrentDateTime(),
        }),
        statusSync: !isOfflineOrSlowInternetConnection() ? "Sync" : "",
        key: "",
        assetNumber: "",
        imageAvailable: true,
        createdBy: clone(this.selectedFitter),
        createdDate: AESTCurrentDateTime(),
        updatedBy: clone(this.selectedFitter),
        updatedDate: AESTCurrentDateTime(),
      } as ServiceSheetDefect
      try {
        const existingDefect = db.serviceSheetDefect.where({
          workorder: this.eformStore.stateGeneralForm.workOrder,
          defectType: "machineSMU",
        });
        if (existingDefect) {
          await existingDefect.delete()
        }
        await db.serviceSheetDefect.add(defect)
        const existingTask = db.pendingTask.where({
          module: 'serviceForm',
          workorder: this.eformStore.stateGeneralForm.workOrder,
          itemKey: `${this.eformStore.stateGeneralForm.workOrder}-SMU-defect`,
          syncStatus: 'Pending'
        });
        if (existingTask) {
          await existingTask.delete()
        }
        const addSMUTask = await db.pendingTask.add({
          module: 'serviceForm',
          section: 'E-Form',
          type: 'Defect',
          workorder: this.eformStore.generalForm.workOrder,
          key: this.eformStore.generalForm.key,
          bindingKey: this.eformStore.generalForm.key,
          payload: JSON.stringify(taskPayload),
          syncDate: AESTShortCurrentDateTime(),
          itemKey: `${this.eformStore.stateGeneralForm.workOrder}-SMU-defect`,
          syncStatus: 'Pending'
        })
        console.log(addSMUTask)
        this.eformStore.updateLocalServiceSheetByParam(updateParams)
        this.eformStore.updateTaskProgressOnLocalDB2()
        this.stateLoading = false
        return true
      } catch (error) {
        console.log("error update defect to local", error);
        this.stateLoading = false
        return false
      }
    },
    async createSMUDefect(updatedDetail : passingParameterCreateSMU) {
      const { val, hmOffset, range, smuDate, isInRange } = updatedDetail
      const generalFormStore = useGeneralFormStore();
      let generalData = {
        id: generalFormStore.generalForm.id,
        workOrder: generalFormStore.generalForm.workOrder,
        form: generalFormStore.generalForm.form,
        smuDue: this.dailyScheduleStore.stateSelectedDailySchedule.smuDue,
        equipment: generalFormStore.generalForm.equipment,
        serialNumber: generalFormStore.generalForm.serialNumber,
        imageEquipment: generalFormStore.generalForm.imageEquipment,
      } as GeneralData

      if (updatedDetail.generalData) {
        generalData = updatedDetail.generalData
      }
      let status = MachineSMUEnum.STATUS_NOT_IN_RANGE
      if (isInRange) {
        status = MachineSMUEnum.STATUS_IN_RANGE
      }
      let employee = this.selectedFitter
      if (updatedDetail.employee) {
        employee = updatedDetail.employee
      }
      const payload = {
        id: generalData.id,
        updateParams: [
          {
            keyValue: 'GENERAL',
            propertyParams: [
              {
                propertyName: 'smu',
                propertyValue: val
              },
              {
                propertyName: "smuBy",
                propertyValue: val !== '' ? JSON.stringify(employee) : ""
              },
              {
                propertyName: "smuDate",
                propertyValue: val !== '' ? smuDate : ""
              },
              {
                propertyName: "updatedBy",
                propertyValue: val !== '' ? JSON.stringify(employee) : ""
              },
              {
                propertyName: "updatedDate",
                propertyValue: val !== '' ? smuDate : ""
              }
            ]
          }
        ],
        headerId: generalData.id,
        workorder: generalData.workOrder,
        employee: employee,
        defectHeader: {
          workorder: generalData.workOrder,
          form: generalData.form,
          category: "GENERAL",
          taskId: "",
          formDefect: "",
          defectType: "machineSMU",
          taskDesc: MachineSMUEnum.TITLE(status),
          supervisor: this.supervisor,
          status: "Submited",
          defectStatus: "Submited"
        },
        defectDetail: {
          title: MachineSMUEnum.TITLE(status),
          machineSMU: val,
          minRange: range.MinRange,
          maxRange: range.MaxRange,
          smuDue: generalData.smuDue,
          assetNumber: generalData.equipment,
          serialNumber: generalData.serialNumber,
          images: JSON.stringify(generalData.imageEquipment ?? [])
        }
      }
      if (hmOffset != "") {
        payload.updateParams[0].propertyParams.push({
          propertyName: 'hmOffset',
          propertyValue: hmOffset
        })
        payload.defectDetail['hmOffset'] = hmOffset
      }
      const params = {
        ver: 'v1'
      }
      try {
        const response = await ApiService.post(`${UPDATE_TASK_WITH_DEFECT}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
        if (response.data.statusCode == 400) {
          this.stateErrorMessage = response.data?.result?.message
        }
      } catch (error: any) {
        sendCustomEvent("fe_event_error_post_defect_smu_data", {
          errorMessage: error
        })
        console.log('update defect smu/hmoffset value', error);
        this.stateErrorMessage = convertErrorMessage(error?.response?.data?.result?.message ?? `${error}`)
        sendErrorEvent('IRONS', error);
        throw error
      }
    },
    async createGenericDefectOffline(isUpdateToTask = true) {
      const clonedHeader = clone(this.statePayload.defectHeader) as any
      delete clonedHeader.supervisor
      delete clonedHeader.defectStatus
      // delete previous defect if any
      // await deleteDefectByTaskId(this.eformStore.stateGeneralForm.workOrder, this.stateTask.key)
      // save defect to db
      const defect = {
        ...clone(clonedHeader),
        defectData: JSON.stringify(this.statePayload.defectDetail),
        statusSync: !isOfflineOrSlowInternetConnection() ? "Sync" : "",
        key: "",
        assetNumber: "",
        imageAvailable: true,
        createdBy: clone(this.selectedFitter),
        createdDate: AESTCurrentDateTime(),
        updatedBy: clone(this.selectedFitter),
        updatedDate: AESTCurrentDateTime(),
      } as ServiceSheetDefect
      await db.serviceSheetDefect.add(defect)
      if (isUpdateToTask) {
        await db.pendingTask.add({
          module: 'serviceForm',
          section: 'E-Form',
          type: 'GenericDefect',
          workorder: this.eformStore.generalForm.workOrder,
          key: this.statePayload.defectHeader.defectHeaderId as string,
          bindingKey: this.statePayload.defectHeader.defectHeaderId as string,
          payload: JSON.stringify(this.statePayload),
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        })
      }
    },
    async createDefectGeneric(additionalData) {
      this.stateLoading = true
      const params = {
        ver: "v1"
      }
      try {
        this.createPayloadGeneric(additionalData)
        if (!isOfflineOrSlowInternetConnection()) {
          await this.createGenericDefectOffline(false)
          await ApiService.post(`${POST_DATA_GENERIC_DEFECT}?${new URLSearchParams(params).toString()}`,
          this.statePayload as AxiosRequestConfig)
        } else {
          await this.createGenericDefectOffline(true)
        }
        this.stateLoading = false
      } catch (error) {
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        this.globalConnectionStore.setSubmitConnectionError(isNoNetwork)
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateLoading = false
        sendErrorEvent('IRONS', error);
      }
    },
    async getDefectDetail(sheetId: string, taskId: string) {
      this.stateLoading = true
      const params = {
        ver: "v1"
      }
      const payload = {
        servicesheetDetailId: sheetId,
        taskId: taskId
      }
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(`${GET_DEFECT_DETAIL}?${new URLSearchParams(params).toString()}`,
        payload as AxiosRequestConfig)
        const detail = response.data.result.content.detail
        this.setDefectDetail(detail)
        this.stateLoading = false
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_get_defect_detail`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateLoading = false
        sendErrorEvent('IRONS', error);
      }
    },
    async setDefectDetail(detail) {
      try {
        const camStore = useOfflineCameraStore()
        camStore.setCurrent("defect")
        camStore.clearCurrent()
        const [result, type] = assignDefectDetail(detail)
        this.stateDefectInfo = result
        this.stateIsYes = type
        const imageObject = await downloadImageAttachments(detail.images, () => {
          this.toggleViewYesVisible(true)
        })
        this.images.ImageInfos = imageObject.ImageInfos
        this.images.ImageBlobs = imageObject.ImageBlobs
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
      }
    },
    async getDefectFromLocalDB(taskId) {
      const defectData = await db.serviceSheetDefect.where({
        workorder: this.eformStore.stateGeneralForm.workOrder,
        taskId: taskId,
        isActive: "true"
      }).first()
      let detail
      if (typeof defectData?.defectData == "string") {
        detail = JSON.parse(defectData!.defectData as string)
      } else {
        detail = defectData!.defectData as DefectDetailNo
      }
      try {
        this.setDefectDetail(detail)
        this.stateLoading = false
      } catch (error) {
        console.log("OFFLINE - error when showing Defect detail", error)
      }
    },
    async getMultipleDefectList(workorder: string, taskId: string, groupId: string) {
      this.stateLoading = true
      const params = {
        ver: "v1"
      }
      const payload = {
        workorder: workorder,
        taskId: taskId,
        serviceSheetDetailId: groupId
      }
      try {
        const isOfflineTaskPending = await this.eformStore.checkCurrentWoPendingOfflineTask()
        if (!isOfflineOrSlowInternetConnection() && !isOfflineTaskPending) {
          const response: AxiosResponse<ApiResponse<MultipleDefectList>> = await ApiService.post(`${GET_DATA_MULTIPLE_DEFECT_LIST}?${new URLSearchParams(params).toString()}`,
          payload as AxiosRequestConfig)
          this.stateLoading = false
          return response.data.result.content || [] as MultipleDefectList[]
        } else {
          const defects = await db.serviceSheetDefect.where({
            workorder: workorder,
            taskId: taskId,
            isActive: "true"
          }).toArray() as any[]
          defects.forEach((defect) => {
            let formattedData = defect.defectData
            if (typeof formattedData == "string") {
              formattedData = JSON.parse(formattedData)
            }
            defect.detail = formattedData
          })
          return defects || [] as MultipleDefectList[]
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_get_multiple_defect_list`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateLoading = false
        sendErrorEvent('IRONS', error);
        return []
      }
    },
    async getOwnershipDefectForm(equipmentNumber: string) {
      this.stateLoading = true
      const params = {
        ver: "v1",
        EquipmentNumber: equipmentNumber,
        Page: "1",
        PageSize: "1",
      }
      try {
        const res: AxiosResponse<ApiResponse<ListEquipmentNumber>> = await ApiService.get(LOOKUP_OWNERSHIP_API_URL, "", new URLSearchParams(params).toString())
        if (res.data.result.content.length == 0) this.stateOwnership = ''
        else if (res.data.result.content.length > 0) {
          this.stateOwnership = res.data.result.content[0].ownership || "" as string
          this.stateSerialNumber = res.data.result.content[0].serialNumber || "" as string
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_get_ownership_defect`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        sendErrorEvent('IRONS', error);
        this.stateLoading = false
      }
    },
    async getOwnershipDefectFormFromLocalDB(equipmentNumber: string) {
      const data = await db.ownership.where({
        equipmentNumber: equipmentNumber
      }).first()
      if (data) {
        this.stateOwnership = data.ownership
        this.stateSerialNumber = data.serialNumber
      }
    },
    resetTaskUpdated() {
      this.stateDefectUpdate = undefined;
    },
    SetTaskUpdated() {
      this.stateDefectUpdate = true;
    },
    async getApprovalDefect(params: {workorder?: string, defectHeaderId?: string, taskId?: string}): Promise<ApprovalData | null> {
      // check list first
      const { defectHeaderId, taskId } = params
      let foundObject :{ index: number, object: ApprovalData } | null = null
      if (this.stateApprovalDefectList.length != 0) {
        foundObject = findIndexAndObject(this.stateApprovalDefectList, (obj) => {
          // only with multidefect search with defect header id
          if (defectHeaderId) {
            return obj.defectHeaderId == defectHeaderId
          }
          // for crack data
          if (taskId) {
            return obj.taskKey == taskId
          }
          return false
        })
        // if found return object and have been acknowledge/decline cbmNAStatus confirmed/decline (approvalDate n approvalBy can be empty)
        if (foundObject && (foundObject.object.status == 'Acknowledge' || foundObject.object.status == 'Decline' || foundObject.object.cbmNAStatus == 'Confirmed' || foundObject.object.cbmNAStatus == 'Decline')) {
          return foundObject.object
        }
      }
      // if not in list/empty data, get data from defect list
      let result = {} as Header | null
      if (isOfflineOrSlowInternetConnection()) {
        result = await db.serviceSheetDefect.where(
          {
            ...params,
            isActive: "true"
          }).first() as Header
      } else {
        const finalParam = {
          id: params.defectHeaderId,
          workorder: params.workorder,
          taskId: params.taskId,
        }
        result = await this.getDefectsDataHeaderPerDefect(finalParam)
      }
      if (result) {
        if (params.defectHeaderId) {
          result.id = params.defectHeaderId as string
        }
        const newDataApproval = {
          defectHeaderId: result.id,
          taskKey: result.taskId,
          approvedBy: result.approvedBy,
          approvedDate: result.approvedDate,
          status: result.status,
          cbmNAStatus: result.cbmNAStatus,
          declineReason: result.declineReason,
          declineBy: result.declineBy,
          declineDate: result.declineDate,
        }
        if (!foundObject) {
          // not found
          this.stateApprovalDefectList.push(newDataApproval)
        } else if (foundObject.index >= 0) {
          // found but no data approval
          this.stateApprovalDefectList[foundObject.index] = newDataApproval
        }
        return newDataApproval
      }
      return null
    },
    async getDefectsDataHeaderPerDefect(params) {
      const body = params
      try {
        const response: AxiosResponse<ApiResponse<Header>> = await ApiService.post(`${GET_DEFECTS_HEADER}`, body as AxiosRequestConfig)
        if (response.data.result.content && response.data.result.content[0]) {
          return response.data.result.content[0]
        }
        return null
      } catch (error) {
        sendCustomEvent("fe_event_error_get_defect_header", {
          errorMessage: error
        })
        sendErrorEvent('IRONS', error);
        return null
      }
    },
    async setApprovalData(data: ApprovalData) {
      this.stateSelectedApprovalDefect = data
    },
    resetList() {
      this.stateApprovalDefectList = []
      this.stateSelectedApprovalDefect = {} as ApprovalData
    },
    resetInstance() {
      this.stateLoading = false
      this.stateIsYes = undefined as boolean | undefined
      this.stateDefectYesVisible = false
      this.stateDefectGenericVisible = false
      this.stateViewYesVisible = false
      this.stateIsValid = true
      this.stateItemKey = ""
      this.setUpdateTaskDefect("")
      this.stateTask = {} as Task
      this.stateDefectInfo = {} as DefectYesClass
      this.statePayload = {
        updateParams: [] as UpdatedParam[]
      } as DefectPayload
    },
    resetErrorStatus() {
      this.stateErrorMessage = ""
    },
    async getPartReference(unitNumber: string) {
      const params = {
        ver: "v1",
        unitNumber: unitNumber,
      }
      try {
        const res: AxiosResponse<SingleApiResponse<PartReference>> = await ApiService.get(PART_REFERENCE_API, "", new URLSearchParams(params).toString())
        console.log("res.data.result.content", res.data.result.content);
        this.statePartReference = res.data.result.content
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
        this.stateLoading = false
      }
    }
  }
})
