import CrackNoClass from "@/core/classes/CrackNoClass"
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
import { useEFormStore } from "@/store/pinia/dma/e-form/useEFormStore"
import { Group } from "@/core/types/entities/dma/e-form/group"
import {
  UpdatedParam
} from "@/core/types/entities/dma/e-form/cracks/UpdatedParam"
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore"
import { useCameraStore } from "@/store/pinia/application/useCameraStore"
import { ImageObject } from "@/core/types/entities/dma/ImageObject"
import { ApiResponse } from "@/core/types/misc/ApiResponse"
import {
  PreviousCrack
} from "@/core/types/entities/dma/e-form/cracks/CrackPreviousCrack"
import { useAttachmentStore } from "../attachments/useAttachmentStore"
import CrackYesClass from "@/core/classes/CrackYesClass"
import { Part } from "@/core/types/entities/dma/e-form/defects/Part"
import { Labour } from "@/core/types/entities/dma/e-form/defects/Labour"
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import {
  useGlobalConnectionStore
} from "@/store/pinia/application/useGlobalConnectionStore"
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo"
import { ServiceSheetErrorMessages } from "@/store/enums/ErrorMessagesEnum";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useInterimCracksFormStore = defineStore({
  id: "Interimcrack",
  state: () => {
    return {
      stateLoading: false,
      stateCancelled: false,
      stateIsYes: undefined as boolean | undefined,
      stateCrackYesVisible: false,
      stateCrackNoVisible: false,
      stateViewYesVisible: false,
      stateViewtNoVisible: false,
      stateIsValid: true,
      stateItemKey: "",
      stateTask: {} as Task,
      stateCrackInfo: {} as CrackYesClass | CrackNoClass,
      statePayload: {
        updateParams: [] as UpdatedParam[]
      } as CrackPayload,
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
    CrackNoVisible: (state) => {
      return state.stateCrackNoVisible
    },
    ViewYesVisible: (state) => {
      return state.stateViewYesVisible
    },
    ViewNoVisible: (state) => {
      return state.stateViewtNoVisible
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
      const cameraStore = useCameraStore()
      return cameraStore.ImageObjects.find((p) => {
        return p.Id === "crack"
      }) as ImageObject;
    },
    globalConnectionStore: () => {
      return useGlobalConnectionStore()
    },
  },
  actions: {
    setItemKey(key: string) {
      this.stateItemKey = key
    },
    setCancelledState(state: boolean) {
      this.stateCancelled = state
    },
    cretateInstance(isYes = true) {
      this.stateCrackInfo = isYes ? new CrackYesClass() : new CrackNoClass()
      this.stateIsYes = isYes
    },
    setTask(task: Task) {
      this.stateTask = task
    },
    toggleYesVisible(value:boolean) {
      this.stateCrackYesVisible = value
      this.stateCrackNoVisible = false
      this.stateCancelled = false
    },
    toggleNoVisible(value:boolean) {
      this.stateCrackNoVisible = value
      this.stateCrackYesVisible = false
      this.stateCancelled = false
    },
    toggleViewNoVisible(value:boolean) {
      this.stateViewtNoVisible = value
      this.stateViewYesVisible = false
    },
    toggleViewYesVisible(value:boolean) {
      this.stateViewYesVisible = value
      this.stateViewtNoVisible = false
    },
    createCrackYesPayload(title: string) {
      const yesClass = this.stateCrackInfo as CrackYesClass
      const images = this.images?.ImageInfos ?? []
      const resources = yesClass.Resources.filter((r) => {
        return r.value !== ""
      })
      this.statePayload.defectDetail = {
        type: "YES",
        title: title,
        assetNumber: yesClass.AssetNumber,
        description: yesClass.Description.value,
        raisedBy: this.selectedFitter.name,
        date: "<<ServerDateTime>>",
        plannedDuration: yesClass.PlannedDuration.value,
        instruction: yesClass.Instruction.value,
        priority: yesClass.Priority,
        parts: JSON.stringify(yesClass.Parts as Part[]),
        labours: JSON.stringify(yesClass.Labours as Labour[]),
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
        previousCracks: JSON.stringify(yesClass.CrackLength),
      }
    },
    createCrackNoPayload(title: string) {
      const yesClass = this.stateCrackInfo as CrackNoClass
      const images = this.images?.ImageInfos ?? []
      this.statePayload.defectDetail = {
        type: "NO",
        title: title,
        assetNumber: this.crackInfo.AssetNumber,
        description: this.crackInfo.Description.value,
        raisedBy: this.selectedFitter.name,
        instruction: yesClass.Instruction.value,
        date: "<<ServerDateTime>>",
        images: JSON.stringify(images),
        previousCracks: JSON.stringify(yesClass.CrackLength),
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
            propertyValue: '<<ServerDateTime>>'
          },
        ]
      })
      this.statePayload.employee = this.selectedFitter
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
        defectStatus: "Submited"
      }
      let title = ""
      if (this.stateTask.description != "" && this.stateTask.description.includes(';')) {
        const captions = [] as string[]
        this.stateTask.description.split('|').forEach((c) => {
          captions.push(c.split(';')[2])
        })
        title = captions.join(', ')
      } else {
        title = this.stateTask.items.length < 4 ? this.stateTask.items[1].value as string : this.stateTask.items[2].value as string
      }
      if (this.stateIsYes) {
        this.createCrackYesPayload(title)
      } else {
        this.createCrackNoPayload(title)
      }
    },
    async createCrack() {
      this.stateLoading = true
      const params = {
        ver: "v1"
      }
      try {
        this.createPayloadCrack()
        const res = await ApiService.post(`${UPDATE_TASK_WITH_DEFECT}?${new URLSearchParams(params).toString()}`,
        this.statePayload as AxiosRequestConfig)
        this.stateLoading = false
        if (res.data.result.message == ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER) {
          const formStore = useEFormStore()
          formStore.toggleTaskAlreadyUpdatedStatus(true)
          return false
        }
        if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
          const eformStore = useEFormStore()
          eformStore.toggleFormAlreadySubmitted(true)
          return false
        }
        if (res.data.result.message == ServiceSheetErrorMessages.CLOSE) {
          const eformStore = useEFormStore()
          eformStore.toggleFormAlreadyClose(true)
          return false
        }
        return true
      } catch (error) {
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        this.globalConnectionStore.setSubmitConnectionError(isNoNetwork)
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateLoading = false
        sendErrorEvent('IRONS', error);
        return false
      }
    },
    async getPreviousCrack(workorder: string, model: string, psType: string, taskId: string) {
      this.stateLoading = true
      const params = {
        ver: 'v1'
      }
      const payload = {
        workorder: workorder,
        modelId: model,
        psTypeId: psType,
        taskId: taskId
      }
      try {
        const response: AxiosResponse<ApiResponse<any>> = await ApiService.post(`${UPDATE_PREVIOUS_CRACK}?${new URLSearchParams(params).toString()}`,
        payload as AxiosRequestConfig)
        const data = [] as PreviousCrack[]
        response.data.result.content.forEach((previousCrack) => {
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
        this.stateCrackInfo.importPreviousCrack(...data)
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      this.stateLoading = false
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
        const camStore = useCameraStore()
        const attachmentStore = useAttachmentStore()
        camStore.setCurrent("crack")
        camStore.clearCurrent()
        if (detail.type === "YES") {
          this.stateIsYes = true
          /* set details in defect info */
          const copy = new CrackYesClass()
          copy.setAssetNumber(detail.assetNumber)
          copy.setDescription(detail.description)
          copy.setPriority(detail.priority)
          copy.setRaisedBy(detail.raisedBy)
          copy.setDate(detail.date)
          copy.setPlannedDuration(detail.plannedDuration)
          copy.setInstruction(detail.instruction)
          copy.setTitle(detail.title)
          copy.importParts(...JSON.parse(detail.parts))
          copy.importLabours(...JSON.parse(detail.labours))
          copy.importResources(...JSON.parse(detail.resources))
          copy.importSymptoms(...JSON.parse(detail.symptoms))
          copy.importCauses(...JSON.parse(detail.causes))
          copy.importPreviousCrack(...JSON.parse(detail.previousCracks))
          this.images.ImageInfos.push(...JSON.parse(detail.images))
          const promises = [] as Promise<Blob>[]
          this.images.ImageInfos.forEach((f: string | ImageInfo) => {
            let filename = ''
            if (typeof f == 'string') {
              filename = f
            } else {
              filename = f.filename
            }
            promises.push(attachmentStore.downloadAttachment(filename) as Promise<Blob>)
          })
          Promise.all(promises).then((blobs) => {
            blobs.forEach((b) => {
              const blob = new Blob([b], { type: 'image/png' })
              this.images.ImageBlobs.push(blob)
            })
            this.stateCrackInfo = copy
            this.toggleViewYesVisible(true)
          })
        } else {
          this.stateIsYes = false
          this.stateCrackInfo = new CrackNoClass()
          this.stateCrackInfo.setAssetNumber(detail.assetNumber)
          this.stateCrackInfo.setDescription(detail.description)
          this.stateCrackInfo.setRaisedBy(detail.raisedBy)
          this.stateCrackInfo.setDate(detail.date)
          this.stateCrackInfo.setInstruction(detail.instruction)
          this.stateCrackInfo.setTitle(detail.title)
          this.stateCrackInfo.importPreviousCrack(...JSON.parse(detail.previousCracks))
          this.images.ImageInfos.push(...JSON.parse(detail.images))
          const promises = [] as Promise<Blob>[]
          this.images.ImageInfos.forEach((f: string | ImageInfo) => {
            let filename = ''
            if (typeof f == 'string') {
              filename = f
            } else {
              filename = f.filename
            }
            promises.push(attachmentStore.downloadAttachment(filename) as Promise<Blob>)
          })
          Promise.all(promises).then((blobs) => {
            blobs.forEach((b) => {
              const blob = new Blob([b], { type: 'image/png' })
              this.images.ImageBlobs.push(blob)
            })
            this.toggleViewNoVisible(true)
          })
        }
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      this.stateLoading = false
    },
    resetInstance() {
      this.stateLoading = false
      this.stateCrackInfo = {} as CrackYesClass | CrackNoClass
      this.stateCrackNoVisible = false
      this.stateCrackYesVisible = false
      this.stateViewYesVisible = false
      this.stateViewtNoVisible = false
      this.stateIsValid = true
      this.stateItemKey = ""
      this.stateTask = {} as Task
      this.stateIsYes = undefined
      this.statePayload = {
        updateParams: [] as UpdatedParam[]
      } as CrackPayload
    }
  }
})
