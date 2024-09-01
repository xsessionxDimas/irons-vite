import DefectNoClass from "@/core/classes/DefectNoClass"
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
import {
  useInterimEngineStore
} from "@/store/pinia/dma/interim-engine-service/useInterimEngineStore"
import { Group } from "@/core/types/entities/dma/e-form/group"
import {
  UpdatedParam
} from "@/core/types/entities/dma/e-form/defects/UpdatedParam"
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore"
import { useCameraStore } from "@/store/pinia/application/useCameraStore"
import { ImageObject } from "@/core/types/entities/dma/ImageObject"
import { useAttachmentStore } from "../attachments/useAttachmentStore"
import { Part } from "@/core/types/entities/dma/e-form/defects/Part"
import { Labour } from "@/core/types/entities/dma/e-form/defects/Labour"
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import {
  useGlobalConnectionStore
} from "@/store/pinia/application/useGlobalConnectionStore";
import { Item } from "@/core/types/entities/dma/e-form/Item"
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo"
import { convertErrorMessage, getTitle } from "../../e-form/helpers"
import { useInterimGeneralFormStore } from "../useInterimGeneralFormStore";
import { ServiceSheetErrorMessages } from "@/store/enums/ErrorMessagesEnum";
import {
  useDailyScheduleStore
} from "../../daily-schedule/useDailyScheduleStore"
import { MachineSMUEnum } from "@/store/enums/MachineSMUEnum"
import {
  passingParameterCreateSMU
} from "@/core/types/entities/dma/defects/DefectSMU"
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useInterimDefectsFormStore = defineStore({
  id: "InterimdefectsForm",
  state: () => {
    return {
      stateIsYes: undefined as boolean | undefined,
      stateLoading: false,
      stateCancelled: false,
      stateDefectYesVisible: false,
      stateDefectNoVisible: false,
      stateViewYesVisible: false,
      stateViewtNoVisible: false,
      stateIsValid: true,
      stateItemKey: "",
      stateTask: {} as Task,
      stateDefectInfo: {} as DefectYesClass | DefectNoClass,
      statePayload: {
        updateParams: [] as UpdatedParam[]
      } as DefectPayload,
      stateItem: {} as Item,
      stateErrorMessage: '',
    }
  },
  getters: {
    Loading: (state) => {
      return state.stateLoading
    },
    Cancelled: (state) => {
      return state.stateCancelled
    },
    DefectYesVisible: (state) => {
      return state.stateDefectYesVisible
    },
    DefectNoVisible: (state) => {
      return state.stateDefectNoVisible
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
    isYes: (state) => {
      return state.stateIsYes
    },
    defectInfo: (state) => {
      return state.stateDefectInfo
    },
    selectedGroup: () => {
      const eFormStore = useInterimEngineStore()
      return eFormStore.selectedGroup as Group
    },
    selectedFitter: () => {
      const eFormStore = useInterimEngineStore()
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
        return p.Id === "defect"
      }) as ImageObject;
    },
    globalConnectionStore: () => {
      return useGlobalConnectionStore()
    },
    dailyScheduleStore: () => {
      return useDailyScheduleStore()
    }
  },
  actions: {
    setItem(item: Item) {
      this.stateItem = item
    },
    setItemKey(key: string) {
      this.stateItemKey = key
    },
    setCancelledState(state: boolean) {
      this.stateCancelled = state
    },
    cretateInstance(isYes = true) {
      this.stateDefectInfo = isYes ? new DefectYesClass() : new DefectNoClass()
      this.stateIsYes = isYes
    },
    setTask(task: Task) {
      this.stateTask = task
    },
    toggleYesVisible(value:boolean) {
      this.stateDefectYesVisible = value
      this.stateDefectNoVisible = false
      this.stateCancelled = false
    },
    toggleNoVisible(value:boolean) {
      this.stateDefectNoVisible = value
      this.stateDefectYesVisible = false
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
    createYesPayload(title: string) {
      const yesClass = this.stateDefectInfo as DefectYesClass
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
        images: JSON.stringify(images)
      }
    },
    createNoPayload(title: string) {
      const noClass = this.stateDefectInfo as DefectNoClass
      const images = this.images?.ImageInfos ?? []
      this.statePayload.defectDetail = {
        type: "NO",
        title: title,
        assetNumber: noClass.AssetNumber,
        description: noClass.Description.value,
        raisedBy: this.selectedFitter.name,
        date: "<<ServerDateTime>>",
        actions: JSON.stringify(noClass.Actions.map((a) => {
          return a.value
        })),
        images: JSON.stringify(images)
      }
    },
    createPayload() {
      const form = useInterimEngineStore()
      this.statePayload.id = this.selectedGroup.id
      this.statePayload.headerId = this.selectedGroup.headerId
      this.statePayload.workorder = this.selectedGroup.workOrder
      this.statePayload.updateParams = []
      this.statePayload.updateParams.push({
        keyValue: this.stateTask.key,
        propertyParams: [
          {
            propertyName: "taskValue",
            propertyValue: "2"
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
        defectWorkorder: "",
        formDefect: "BA-PL-F55",
        defectType: this.stateIsYes ? "YES" : "NO",
        cbmMeasurement: '',
        cbmUom: '',
        cbmImageKey: '',
        cbmImageProp: '',
        isCbmAdjusment: '',
        taskValue: "2",
        repairedStatus: "Not-Repaired",
        cbmNAStatus: "Not-Confirm",
        supervisor: this.supervisor,
        status: "Submited",
        defectStatus: "Submited"
      }
      const title = getTitle(this.stateTask)
      if (this.stateIsYes) {
        this.createYesPayload(title)
      } else {
        this.createNoPayload(title)
      }
    },
    async createDefect() {
      this.stateLoading = true
      const params = {
        ver: "v1"
      }
      try {
        this.createPayload()
        const res = await ApiService.post(`${UPDATE_TASK_WITH_DEFECT}?${new URLSearchParams(params).toString()}`,
        this.statePayload as AxiosRequestConfig)
        this.stateLoading = false
        if (res.data.result.message == ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER) {
          const formStore = useInterimEngineStore()
          formStore.toggleTaskAlreadyUpdatedStatus(true)
          return false
        }
        if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
          const eformStore = useInterimEngineStore()
          eformStore.toggleFormAlreadySubmitted(true)
          return false
        }
        if (res.data.result.message == ServiceSheetErrorMessages.CLOSE) {
          const eformStore = useInterimEngineStore()
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
    async createSMUDefect(updatedDetail : passingParameterCreateSMU) {
      const { val, hmOffset, range, smuDate, isInRange } = updatedDetail
      let status = MachineSMUEnum.STATUS_NOT_IN_RANGE
      if (isInRange) {
        status = MachineSMUEnum.STATUS_IN_RANGE
      }
      const generalFormStore = useInterimGeneralFormStore();
      const payload = {
        id: generalFormStore.generalForm.id,
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
        ],
        headerId: generalFormStore.generalForm.id,
        workorder: generalFormStore.generalForm.workOrder,
        employee: this.selectedFitter,
        defectHeader: {
          workorder: generalFormStore.generalForm.workOrder,
          form: generalFormStore.generalForm.form,
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
          smuDue: this.dailyScheduleStore.stateSelectedDailyScheduleInterim.smuDue,
          assetNumber: generalFormStore.generalForm.equipment,
          serialNumber: generalFormStore.generalForm.serialNumber,
          images: JSON.stringify(generalFormStore.generalForm.imageEquipment ?? [])
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
        console.log('update defect smu/hmoffset value', error);
        this.stateErrorMessage = convertErrorMessage(error?.response?.data?.result?.message ?? `${error}`)
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
        const camStore = useCameraStore()
        const attachmentStore = useAttachmentStore()
        camStore.setCurrent("defect")
        camStore.clearCurrent()
        if (detail.type === "YES") {
          this.stateIsYes = true
          /* set details in defect info */
          this.stateDefectInfo = new DefectYesClass()
          this.stateDefectInfo.setAssetNumber(detail.assetNumber)
          this.stateDefectInfo.setDescription(detail.description)
          this.stateDefectInfo.setPriority(detail.priority)
          this.stateDefectInfo.setRaisedBy(detail.raisedBy)
          this.stateDefectInfo.setDate(detail.date)
          this.stateDefectInfo.setPlannedDuration(detail.plannedDuration)
          this.stateDefectInfo.setInstruction(detail.instruction)
          this.stateDefectInfo.setTitle(detail.title)
          this.stateDefectInfo.importParts(...JSON.parse(detail.parts))
          this.stateDefectInfo.importLabours(...JSON.parse(detail.labours))
          this.stateDefectInfo.importResources(...JSON.parse(detail.resources))
          this.stateDefectInfo.importSymptoms(...JSON.parse(detail.symptoms))
          this.stateDefectInfo.importCauses(...JSON.parse(detail.causes))
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
            this.toggleViewYesVisible(true)
          })
        } else {
          this.stateIsYes = false
          this.stateDefectInfo = new DefectNoClass()
          this.stateDefectInfo.setAssetNumber(detail.assetNumber)
          this.stateDefectInfo.setDescription(detail.description)
          this.stateDefectInfo.setRaisedBy(detail.raisedBy)
          this.stateDefectInfo.setDate(detail.date)
          this.stateDefectInfo.setTitle(detail.title)
          this.stateDefectInfo.importActions(...JSON.parse(detail.actions))
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
        this.stateLoading = false
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateLoading = false
        sendErrorEvent('IRONS', error);
      }
    },
    resetInstance() {
      this.stateLoading = false
      this.stateIsYes = undefined as boolean | undefined
      this.stateDefectYesVisible = false
      this.stateDefectNoVisible = false
      this.stateViewYesVisible = false
      this.stateViewtNoVisible = false
      this.stateIsValid = true
      this.stateItemKey = ""
      this.stateTask = {} as Task
      this.stateDefectInfo = {} as DefectYesClass | DefectNoClass
      this.statePayload = {
        updateParams: [] as UpdatedParam[]
      } as DefectPayload
    },
    resetErrorStatus() {
      this.stateErrorMessage = ""
    },
  }
})
