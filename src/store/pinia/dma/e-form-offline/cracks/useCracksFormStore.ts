import ApiService from "@/core/services/ApiService"
import {
  CrackPayload
} from "@/core/types/entities/dma/e-form/cracks/CrackPayload"
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import { defineStore } from "pinia"
import {
  UPDATE_TASK_WITH_DEFECT,
  UPDATE_PREVIOUS_CRACK,
  GET_DEFECT_DETAIL
} from "./urls"
import { Task } from '@/core/types/entities/dma/e-form/Task'
import {
  useEFormStore
} from "@/store/pinia/dma/e-form-offline/useEFormStore"
import { Group } from "@/core/types/entities/dma/e-form/group"
import {
  UpdatedParam
} from "@/core/types/entities/dma/e-form/cracks/UpdatedParam"
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore"
import {
  useOfflineCameraStore
} from "@/store/pinia/application/useOfflineCameraStore"
import { ImageObject } from "@/core/types/entities/dma/ImageObject"
import { ApiResponse } from "@/core/types/misc/ApiResponse"
import {
  PreviousCrack
} from "@/core/types/entities/dma/e-form/cracks/CrackPreviousCrack"
import CrackYesClass from "@/core/classes/CrackYesClass"
import { Part } from "@/core/types/entities/dma/e-form/defects/Part"
import { Labour } from "@/core/types/entities/dma/e-form/defects/Labour"
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import {
  useGlobalConnectionStore
} from "@/store/pinia/application/useGlobalConnectionStore"
import { clone } from "lodash"
import { db } from "@/database/schema/DexieSchema"
import {
  AESTCurrentDateTime,
  AESTShortCurrentDateTime
} from "@/core/helpers/date-format"
import { ServiceSheetDefect } from "@/database/schema/ServiceSheetDefect"
import {
  DefectDetailNo
} from "@/core/types/entities/dma/e-form/defects/DefectDetailNo"
import {
  setDefectIsActiveByTaskId
} from "@/core/helpers/ironforms/offline/defect-form"
import { v4 as uuidv4 } from 'uuid'
import { useOnline } from "@vueuse/core"
import {
  getImageFromAPI,
  getReferenceUrlFromLocalDB,
  handleReplaceImageToLocalDB
} from "@/core/helpers/ironforms/offline/reference-file"
import { useDefectsFormStore } from "../defects/useDefectsFormStore"
import { getTitle } from "../../e-form/helpers"
import { sendCustomEvent } from "@/core/helpers/azure-app-insight"
import {
  MultiplePreviousCrack
} from "@/core/types/entities/dma/e-form/cracks/MultiplePreviousCrack"
import { deleteByWOItemKey } from "@/core/helpers/ironforms/offline/task"
import { ServiceSheetErrorMessages } from "@/store/enums/ErrorMessagesEnum";
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import {
  assignCrackDetail,
  downloadImageAttachments
} from "../defects/methods"
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useCracksFormStore = defineStore({
  id: "offlineCrack",
  state: () => {
    return {
      stateLoading: false,
      stateCancelled: false,
      stateIsYes: undefined as boolean | undefined,
      stateCrackYesVisible: false,
      stateViewYesVisible: false,
      statePredefinedPriority: "",
      stateIsValid: true,
      stateItemKey: "",
      stateTask: {} as Task,
      stateCrackInfo: {} as CrackYesClass,
      statePayload: {
        updateParams: [] as UpdatedParam[]
      } as CrackPayload,
      stateReferencePhoto: {
        title: "",
        blob: "",
        id: "",
      },
      statePreviousCrack: [] as any[]
    }
  },
  getters: {
    Loading: (state) => {
      return state.stateLoading
    },
    Cancelled: (state) => {
      return state.stateCancelled
    },
    CrackYesVisible: (state) => {
      return state.stateCrackYesVisible
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
    IsYes: (state) => {
      return state.stateIsYes
    },
    crackInfo: (state) => {
      return state.stateCrackInfo
    },
    selectedGroup: () => {
      const eFormStore = useEFormStore()
      return eFormStore.selectedGroup as Group
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
        return p.Id === "crack"
      }) as ImageObject;
    },
    globalConnectionStore: () => {
      return useGlobalConnectionStore()
    },
    eformStore: () => {
      return useEFormStore()
    },
    referencePhoto: (state) => {
      return state.stateReferencePhoto;
    },
    onlineStatus: () => {
      return useOnline()
    },
    Ownership: () => {
      const defectFormStore = useDefectsFormStore()
      return defectFormStore.Ownership
    },
    SerialNumber: () => {
      const defectFormStore = useDefectsFormStore()
      return defectFormStore.SerialNumber
    },
    PredefinedPriority: (state) => {
      return state.statePredefinedPriority
    }
  },
  actions: {
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
      this.stateCrackInfo = new CrackYesClass()
      this.stateIsYes = isYes
      this.stateCrackInfo.setType(isYes ? "YES" : "NO")
    },
    setDefectRequirment(requirement: string) {
      if (this.stateCrackInfo instanceof CrackYesClass) {
        this.stateCrackInfo.setDefectRequirement(requirement)
      }
    },
    setTask(task: Task) {
      this.stateTask = task
    },
    toggleYesVisible(value:boolean) {
      this.stateCrackYesVisible = value
      this.stateCancelled = false
    },
    toggleViewYesVisible(value:boolean) {
      this.stateViewYesVisible = value
    },
    createCrackF55Payload(title: string) {
      const yesClass = this.stateCrackInfo as CrackYesClass
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
      const formattedCrackLength = yesClass.CrackLength.map((item) => {
        const currentCrack = item.currentCrack ? String(parseFloat(item.currentCrack)) : item.currentCrack

        return {
          ...item,
          currentCrack
        }
      })
      this.statePayload.defectDetail = {
        type: yesClass.Type,
        title: title,
        assetNumber: yesClass.AssetNumber,
        description: yesClass.Description.value,
        raisedBy: this.selectedFitter.name,
        date: AESTCurrentDateTime(),
        plannedDuration: yesClass.PlannedDuration.value,
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
        previousCracks: JSON.stringify(formattedCrackLength),
        referencePhoto: this.stateReferencePhoto.id,
        referenceSection: this.stateReferencePhoto.title,
        requirement: yesClass.DefectRequirement,
        isComplete: yesClass.IsComplete
      }
    },
    createPayloadCrack() {
      const form = useEFormStore()
      this.statePayload.id = this.selectedGroup.id
      this.statePayload.workorder = this.selectedGroup.workOrder
      this.statePayload.headerId = this.selectedGroup.headerId
      this.statePayload.updateParams = []
      this.statePayload.updateParams.push({
        keyValue: this.stateTask.key,
        propertyParams: [
          {
            propertyName: "taskValue",
            propertyValue: this.stateIsYes ? "3" : "2"
          },
          {
            propertyName: 'updatedBy',
            propertyValue: JSON.stringify(this.selectedFitter)
          },
          {
            propertyName: 'updatedDate',
            propertyValue: AESTCurrentDateTime()
          },
          {
            propertyName: 'reason',
            propertyValue: form.reasonNA
          }
        ]
      })
      this.statePayload.updateParams.push({
        keyValue: this.stateItemKey,
        propertyParams: [
          {
            propertyName: "value",
            propertyValue: this.stateIsYes ? "3" : "2",
          },
          {
            propertyName: 'updatedBy',
            propertyValue: JSON.stringify(this.eformStore.employee)
          },
          {
            propertyName: 'updatedDate',
            propertyValue: AESTCurrentDateTime()
          }
        ],
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
        crackWorkorder: "",
        formCrack: "BA-PL-F55",
        crackType: this.stateIsYes ? "YES" : "NO",
        taskValue: this.stateIsYes ? "3" : "2",
        repairedStatus: "Not-Repaired",
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
      this.createCrackF55Payload(title)
    },
    async createCrack() {
      this.stateLoading = true
      const params = {
        ver: "v1"
      }
      try {
        const formStore = useEFormStore()
        await this.updateDefectToLocalDB(false)
        if (formStore.reasonNA != "") {
          formStore.setReasonNA("")
        }
        const res = await ApiService.post(`${UPDATE_TASK_WITH_DEFECT}?${new URLSearchParams(params).toString()}`,
        this.statePayload as AxiosRequestConfig)
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
        return true
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_post_crack`, {
          errorMessage: error
        })
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        // this.globalConnectionStore.setSubmitConnectionError(isNoNetwork)
        this.stateLoading = false
        sendErrorEvent('IRONS', error);
        if (isNoNetwork) {
          this.eformStore.updateLocalServiceSheetByParam(this.statePayload.updateParams)
          this.eformStore.updateTaskProgressOnLocalDB2()
          return true
        }
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        return false
      }
    },
    async updateDefectToLocalDB(isUpdateToTask = true) {
      this.stateLoading = true
      this.createPayloadCrack()
      const clonedHeader = clone(this.statePayload.defectHeader) as any
      delete clonedHeader.supervisor
      delete clonedHeader.defectStatus
      // delete previous defect if any
      await setDefectIsActiveByTaskId(this.eformStore.stateGeneralForm.workOrder, this.stateTask.key, "false")
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
        await db.serviceSheetDefect.add(defect)
        // save task to db
        if (isUpdateToTask) {
          await deleteByWOItemKey(this.eformStore.stateGeneralForm.workOrder, this.stateItemKey)
          await db.pendingTask.add({
            module: 'serviceForm',
            section: 'E-Form',
            type: 'Defect',
            workorder: this.eformStore.generalForm.workOrder,
            key: this.stateTask.key,
            bindingKey: this.stateTask.key,
            payload: JSON.stringify(this.statePayload),
            syncDate: AESTShortCurrentDateTime(),
            itemKey: this.ItemKey,
            syncStatus: 'Pending'
          })
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
    getPreviousCrackFromState(taskId: string) {
      const data = [] as PreviousCrack[]
      const currentCrack = this.eformStore.statePreviousCrackArr.find((crack: MultiplePreviousCrack) => {
        return crack.taskId == taskId
      }) as MultiplePreviousCrack
      if (currentCrack) {
        currentCrack.previousCrack.forEach((previousCrack) => {
          const crack = {
            currentCrack: previousCrack.currentCrack,
            locationDesc: previousCrack.locationDesc,
            locationId: previousCrack.locationId,
            previousCrack: previousCrack.previousCrack,
            isValid: true,
            message: '',
          } as PreviousCrack
          data.push(crack)
        })
        console.log(this.stateCrackInfo)
        this.stateCrackInfo.importPreviousCrack(...data)
      }
    },
    async getReferencePhoto(id) {
      let url = ''
      try {
        const urlCreator = window.URL || window.webkitURL
        if (!isOfflineOrSlowInternetConnection()) {
          const blob = await getImageFromAPI(id)
          url = urlCreator.createObjectURL(blob)
          handleReplaceImageToLocalDB(id, this.eformStore.stateGeneralForm.workOrder, blob)
        } else {
          url = await getReferenceUrlFromLocalDB(id)
        }
        return url
      } catch (error) {
        console.log(error)
        return ""
      }
    },
    async setReferencePhoto(title: string, photoId) {
      this.stateReferencePhoto.title = title;
      this.stateReferencePhoto.blob = await this.getReferencePhoto(photoId)
      this.stateReferencePhoto.id = photoId;
    },
    async getCrackDetail(sheetId: string, taskId: string) {
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
        this.updateCrackData(detail)
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_get_crack_detail`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      this.stateLoading = false
    },
    async getCrackFromLocalDB(taskId) {
      const defectData = await db.serviceSheetDefect.where({
        taskId: taskId,
        workorder: this.eformStore.stateGeneralForm.workOrder,
        isActive: "true"
      }).first()
      let detail
      if (defectData) {
        if (typeof defectData.defectData == "string") {
          detail = JSON.parse(defectData.defectData as string)
        } else {
          detail = defectData.defectData as DefectDetailNo
        }
      }
      try {
        this.updateCrackData(detail)
        this.stateLoading = false
      } catch (error) {
        console.log("OFFLINE - error when showing Defect detail", error)
      }
    },
    async getCrackHeaderIdLocally(taskId: string, workOrder: string | undefined = undefined): Promise<string> {
      const defectData = await db.serviceSheetDefect.where({
        taskId: taskId,
        workorder: workOrder ?? this.eformStore.stateGeneralForm.workOrder,
        isActive: "true"
      }).first()
      return defectData?.defectHeaderId ?? ""
    },
    async updateCrackData(detail) {
      const camStore = useOfflineCameraStore()
      camStore.clearCurrent()
      camStore.setCurrent("crack")
      const [result, type] = assignCrackDetail(detail)
      this.stateCrackInfo = result
      this.stateCrackInfo.setType(type ? "YES" : "NO")
      await this.setReferencePhoto(detail.referenceSection, detail.referencePhoto)
      this.stateIsYes = type
      const imageObject = await downloadImageAttachments(detail.images, undefined)
      this.toggleViewYesVisible(true)
      this.images.ImageInfos = imageObject.ImageInfos
      this.images.ImageBlobs = imageObject.ImageBlobs
    },
    async getPreviousCrackFromLocalDB(workOrder, taskKey) {
      const previousCrack = await db.previousCrack.where({
        workOrder: workOrder,
        taskId: taskKey
      }).first()
      const data = [] as PreviousCrack[]
      if (previousCrack) {
        previousCrack.previousCrack.forEach((prevCrack) => {
          const crack = {
            currentCrack: prevCrack.currentCrack,
            locationDesc: prevCrack.locationDesc,
            locationId: prevCrack.locationId,
            previousCrack: prevCrack.previousCrack,
            isValid: true,
            message: '',
          } as PreviousCrack
          data.push(crack)
        })
        this.stateCrackInfo.importPreviousCrack(...data)
      }
    },
    resetInstance() {
      this.stateLoading = false
      this.stateCrackInfo = {} as CrackYesClass
      this.stateCrackYesVisible = false
      this.stateViewYesVisible = false
      this.statePredefinedPriority = ""
      this.stateIsValid = true
      this.stateItemKey = ""
      this.stateTask = {} as Task
      this.stateIsYes = undefined
      this.stateReferencePhoto = {
        title: "",
        blob: "",
        id: "",
      };
      this.statePayload = {
        updateParams: [] as UpdatedParam[]
      } as CrackPayload
    }
  }
})
