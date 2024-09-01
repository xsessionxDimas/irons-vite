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
  GET_DATA_MULTIPLE_DEFECT_LIST,
  GET_DEFECT_DETAIL,
  POST_DATA_MULTIPLE_DEFECT_LIST,
  LOOKUP_OWNERSHIP_API_URL,
  POST_DATA_GENERIC_DEFECT,
  GET_DEFECTS_HEADER,
  UPDATE_TASK_WITH_DEFECT,
  PART_REFERENCE_API
} from "./urls"
import { Task } from '@/core/types/entities/dma/e-form/Task'
import { useEFormStore } from "@/store/pinia/dma/e-form/useEFormStore"
import { Group } from "@/core/types/entities/dma/e-form/group"
import {
  ListItem as ListEquipmentNumber
} from "@/core/types/entities/iron-lake/equipment/equipment-number/ListItem"
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
import { MultipleDefectList } from "@/database/schema/MultipleDefectList"
import { ApiResponse } from "@/core/types/misc/ApiResponse"
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo"
import { findIndexAndObject, getTitle } from "../helpers"
import { sendCustomEvent } from "@/core/helpers/azure-app-insight"
import { Header } from "@/core/types/entities/dma/defects/Header"
import {
  ApprovalData
} from "@/core/types/entities/dma/e-form/defects/ApprovalData"
import { useGeneralFormStore } from "../useGeneralFormStore"
import { ServiceSheetErrorMessages } from "@/store/enums/ErrorMessagesEnum";
import {
  PartReference
} from "@/core/types/entities/dma/e-form/defects/PartReference"
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useDefectsFormStore = defineStore({
  id: "defectsForm",
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
      stateMultipleDefectList: [] as MultipleDefectList[],
      stateUpdateTaskDefect: "" as string,
      stateOpenDialogConfirmSubmitDefect: false as boolean,
      stateDefectUpdate: undefined as boolean | undefined,
      stateOwnership: '' as string,
      stateSerialNumber: '' as string,
      stateIsNeed30Minutes: false,
      stateApprovalDefectList: [] as ApprovalData[],
      stateSelectedApprovalDefect: {} as ApprovalData,
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
    }
  },
  actions: {
    toggleIsNeed30Minutes(status) {
      this.stateIsNeed30Minutes = status
    },
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
        type: "YES",
        title: title,
        assetNumber: yesClass.AssetNumber,
        description: yesClass.Description.value,
        raisedBy: this.selectedFitter.name,
        date: "<<ServerDateTime>>",
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
    createPayload(deleteDefectNA = false) {
      const form = useEFormStore()
      this.statePayload.id = this.selectedGroup.id
      this.statePayload.headerId = this.selectedGroup.headerId
      this.statePayload.workorder = this.selectedGroup.workOrder
      this.statePayload.updateParams = []
      const taskValuePayload = {
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
          }
        ]
      }
      if (deleteDefectNA) {
        taskValuePayload.propertyParams.push({
          propertyName: 'reason',
          propertyValue: form.reasonNA
        })
      }
      this.statePayload.updateParams.push(taskValuePayload)
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
    createPayloadGeneric(additionalData) {
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
        defectStatus: "Submited"
      }
      if (this.stateIsYes) {
        this.createYesPayload(additionalData.taskDesc)
      } else {
        this.createNoPayload(additionalData.taskDesc)
      }
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
        this.createPayload(deleteDefectNA)
        if (formStore.reasonNA != "") {
          formStore.setReasonNA("")
        }
        const res = await ApiService.post(`${POST_DATA_MULTIPLE_DEFECT_LIST}?${new URLSearchParams(params).toString()}`,
        this.statePayload as AxiosRequestConfig)
        this.setUpdateTaskDefect(this.statePayload.updateParams[0].keyValue)
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
        sendCustomEvent("fe_event_error_post_multiple_defect", {
          errorMessage: error
        })
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        this.globalConnectionStore.setSubmitConnectionError(isNoNetwork)
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateLoading = false
        sendErrorEvent('IRONS', error);
        return false
      }
    },
    async createDefectGeneric(additionalData) {
      this.stateLoading = true
      const params = {
        ver: "v1"
      }
      try {
        this.createPayloadGeneric(additionalData)
        await ApiService.post(`${POST_DATA_GENERIC_DEFECT}?${new URLSearchParams(params).toString()}`,
        this.statePayload as AxiosRequestConfig)
        this.stateLoading = false
      } catch (error) {
        sendCustomEvent("fe_event_error_post_generic_defect", {
          errorMessage: error
        })
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        this.globalConnectionStore.setSubmitConnectionError(isNoNetwork)
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateLoading = false
        sendErrorEvent('IRONS', error);
      }
    },
    async createSMUDefect(val, hmOffset = "", range) {
      const generalFormStore = useGeneralFormStore();
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
                propertyName: "updatedBy",
                propertyValue: JSON.stringify(this.selectedFitter)
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>"
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
          defectType: "",
          taskDesc: "Machine SMU - Not in range",
          supervisor: this.supervisor,
          status: "Submited",
          defectStatus: "Submited"
        },
        defectDetail: {
          title: "Machine SMU - Not in range",
          machineSMU: val,
          machineSMURange: range,
          smuDue: generalFormStore.generalForm.psTypeId,
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
        await ApiService.post(`${UPDATE_TASK_WITH_DEFECT}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
      } catch (error) {
        sendCustomEvent("fe_event_error_post_defect_smu_data", {
          errorMessage: error
        })
        sendErrorEvent('IRONS', error);
        console.log('update defect smu/hmoffset value', error);
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
        sendCustomEvent("fe_event_error_get_defect_detail", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateLoading = false
        sendErrorEvent('IRONS', error);
      }
    },
    async setDefectDetail(defectDetail) {
      try {
        const detail = defectDetail
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
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
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
        const response: AxiosResponse<ApiResponse<MultipleDefectList>> = await ApiService.post(`${GET_DATA_MULTIPLE_DEFECT_LIST}?${new URLSearchParams(params).toString()}`,
        payload as AxiosRequestConfig)
        this.stateLoading = false
        return response.data.result.content || [] as MultipleDefectList[]
      } catch (error) {
        sendCustomEvent("fe_event_error_get_multiple_defect_list", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateLoading = false
        sendErrorEvent('IRONS', error);
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
        sendCustomEvent("fe_event_error_get_ownership_defect", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateLoading = false
        sendErrorEvent('IRONS', error);
      }
    },
    resetTaskUpdated() {
      this.stateDefectUpdate = undefined;
    },
    SetTaskUpdated() {
      this.stateDefectUpdate = true;
    },
    async getApprovalDefect(params: {workorder?: string, id?: string, taskId?: string}): Promise<ApprovalData | null> {
      // check list first
      const { id, taskId } = params
      let foundObject :{ index: number, object: ApprovalData } | null = null
      if (this.stateApprovalDefectList.length != 0) {
        foundObject = findIndexAndObject(this.stateApprovalDefectList, (obj) => {
          // only with multidefect search with defect header id
          if (id) {
            return obj.defectHeaderId == id
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
      // if not in list/empty data, get from server
      const result = await this.getDefectsDataHeaderPerDefect(params)
      if (result) {
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
      this.stateDefectNoVisible = false
      this.stateViewYesVisible = false
      this.stateViewtNoVisible = false
      this.stateIsValid = true
      this.stateItemKey = ""
      this.stateTask = {} as Task
      this.setUpdateTaskDefect("")
      this.stateDefectInfo = {} as DefectYesClass | DefectNoClass
      this.statePayload = {
        updateParams: [] as UpdatedParam[]
      } as DefectPayload
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
        console.log(error)
        this.stateLoading = false
        sendErrorEvent('IRONS', error);
      }
    }
  }
})
