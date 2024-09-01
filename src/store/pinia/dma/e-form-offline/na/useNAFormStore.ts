import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler"
import ApiService from "@/core/services/ApiService"
import {
  DefectPayload
} from "@/core/types/entities/dma/e-form/defects/DefectPayload"
import {
  UpdatedParam
} from "@/core/types/entities/dma/e-form/defects/UpdatedParam"
import { Group } from "@/core/types/entities/dma/e-form/group"
import { Task } from "@/core/types/entities/dma/e-form/Task"
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse"
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import { defineStore } from "pinia"
import { GET_DEFECT_DETAIL, UPDATE_TASK_WITH_DEFECT } from "../defects/urls"
import { useEFormStore } from "../useEFormStore"
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'
import {
  usePreviewNaFormStore
} from "../../preview-form/usePreviewNaFormStore"
import { Item } from "@/core/types/entities/dma/e-form/Item"
import { ServiceSheetDefect } from "@/database/schema/ServiceSheetDefect"
import {
  AESTCurrentDateTime,
  AESTShortCurrentDateTime
} from "@/core/helpers/date-format"
import { db } from "@/database/schema/DexieSchema"
import { clone, isUndefined } from "lodash"
import { v4 as uuidv4 } from 'uuid';
import { NADetails } from "@/core/types/entities/dma/defects/NADetail"
import { useOnline } from "@vueuse/core"
import { sendCustomEvent } from "@/core/helpers/azure-app-insight"
import { deleteByWOItemKey } from "@/core/helpers/ironforms/offline/task"
import { ServiceSheetErrorMessages } from "@/store/enums/ErrorMessagesEnum";
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useNAFormStore = defineStore({
  id: "offlineNa",
  state: () => {
    return {
      stateLoading: false,
      stateCancelled: false,
      stateVisible: false,
      stateViewVisible: false,
      stateIsValid: true,
      stateItemKey: "",
      stateReason: "",
      stateTitle: "",
      stateTask: {} as Task,
      statePayload: {
        updateParams: [] as UpdatedParam[]
      } as DefectPayload,
      stateItem: {} as Item,
      stateSuccessUpdateItemKey: '',
      stateUpdateSuccessFromNetworkError: false,
    }
  },
  getters: {
    Loading: (state) => {
      return state.stateLoading
    },
    Cancelled: (state) => {
      return state.stateCancelled
    },
    Reason: (state) => {
      return state.stateReason
    },
    Visible: (state) => {
      return state.stateVisible
    },
    ViewVisible: (state) => {
      return state.stateViewVisible
    },
    ItemKey: (state) => {
      return state.stateItemKey
    },
    isValid: (state) => {
      return state.stateIsValid
    },
    selectedGroup: () => {
      const eFormStore = useEFormStore()
      return eFormStore.selectedGroup as Group
    },
    selectedFitter: () => {
      const eFormStore = useEFormStore()
      return eFormStore.employee
    },
    onlineStatus: () => {
      return useOnline()
    },
    supervisor: () => {
      const authStore = useAuthenticationStore()
      return {
        id: authStore.user.EmployeeId,
        name: authStore.user.Name
      }
    },
    globalConnectionStore: () => {
      return useGlobalConnectionStore()
    },
    eformStore: () => {
      return useEFormStore()
    }
  },
  actions: {
    setItem(item: Item) {
      this.stateItem = item
    },
    setReason(reason: string) {
      this.stateReason = reason
    },
    setCancelledState(state: boolean) {
      this.stateCancelled = state
    },
    setItemKey(key: string) {
      this.stateItemKey = key
      this.stateSuccessUpdateItemKey = ""
    },
    setTask(task: Task) {
      this.stateTask = task
    },
    toggleIsVisible(value:boolean) {
      this.stateVisible = value
      this.stateCancelled = false
    },
    toggleIsViewVisible(value: boolean) {
      this.stateViewVisible = value
    },
    createPayload() {
      const form = useEFormStore()
      this.statePayload.id = this.selectedGroup.id
      this.statePayload.workorder = this.selectedGroup.workOrder
      this.statePayload.headerId = this.selectedGroup.headerId
      this.statePayload.updateParams = []
      const defectHeaderId = uuidv4()
      const defectDetailId = uuidv4()
      this.statePayload.updateParams.push({
        keyValue: this.stateTask.key,
        propertyParams: [
          {
            propertyName: "taskValue",
            propertyValue: this.stateTask.category === 'NORMAL' || this.stateTask.category === "CBM" ? "3" : "4"
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
            propertyName: "reason",
            propertyValue: ""
          },
        ]
      })
      this.statePayload.updateParams.push({
        keyValue: this.ItemKey,
        propertyParams: [
          {
            propertyName: "value",
            propertyValue: this.stateTask.category === "NORMAL" || this.stateTask.category === "CBM" ? "3" : "4"
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
      this.statePayload.defectHeader = {
        workorder: form.generalForm.workOrder,
        form: this.selectedGroup.modelId,
        serviceSheetDetailId: this.selectedGroup.id,
        category: this.stateTask.category,
        taskId: this.stateTask.key,
        taskNo: this.stateTask.description != "" ? this.stateTask.description.split(';')[0] : this.stateTask.items[0].value as string,
        taskDesc: this.stateTask.description != "" ? this.stateTask.description : this.stateTask.items[1].value as string,
        defectWorkorder: '',
        formDefect: "DM-PL-F55",
        defectType: '',
        cbmMeasurement: '',
        cbmUom: '',
        cbmImageKey: '',
        cbmImageProp: '',
        isCbmAdjusment: '',
        taskValue: this.stateTask.category === 'NORMAL' || this.stateTask.category === "CBM" ? "3" : "4",
        repairedStatus: "Not-Repaired",
        cbmNAStatus: "Not-Confirm",
        supervisor: this.supervisor,
        status: "Submited",
        defectStatus: "Submited",
        isActive: "true",
        defectHeaderId: defectHeaderId,
        defectDetailId: defectDetailId
      }
      this.statePayload.defectDetail = {
        type: "N/A",
        reason: this.Reason,
        title: this.stateTask.description != "" ? this.stateTask.description : this.stateTask.items[1].value as string,
      }
    },
    async createNA() {
      this.stateLoading = true
      const params = {
        ver: "v1"
      }
      try {
        this.createPayload()
        await this.updateNAToLocalDB(false)
        const res = await ApiService.post(`${UPDATE_TASK_WITH_DEFECT}?${new URLSearchParams(params).toString()}`,
        this.statePayload as AxiosRequestConfig)
        this.eformStore.updateLocalServiceSheetByParam(this.statePayload.updateParams)
        this.stateLoading = false
        const formStore = useEFormStore()

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
        sendCustomEvent(`fe_event_error_service_form_post_na`, {
          errorMessage: error
        })
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        // this.globalConnectionStore.setSubmitConnectionError(isNoNetwork)
        if (isNoNetwork) {
          this.eformStore.updateLocalServiceSheetByParam(this.statePayload.updateParams)
          this.eformStore.updateTaskProgressOnLocalDB2()
          this.stateUpdateSuccessFromNetworkError = true
          return true
        }
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    toggleUpdateSuccessFromNetworkError(status: boolean): void {
      this.stateUpdateSuccessFromNetworkError = status
    },
    async updateNAToLocalDB(isUpdateToTask = true) {
      this.stateLoading = true
      this.createPayload()
      const clonedHeader = clone(this.statePayload.defectHeader) as any
      delete clonedHeader.supervisor
      delete clonedHeader.defectStatus
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
          await deleteByWOItemKey(this.eformStore.stateGeneralForm.workOrder, this.ItemKey)
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
          return true
        }
      } catch (error) {
        console.log("😣😣 error update na to local", error);
        this.stateLoading = false
        return false
      }
    },
    async getNADetailValue(sheetId: string, taskId: string) {
      this.stateLoading = true
      const params = {
        ver: "v1"
      }
      const payload = {
        servicesheetDetailId: sheetId,
        taskId: taskId
      }
      try {
        let res
        if (!isOfflineOrSlowInternetConnection()) {
          const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(`${GET_DEFECT_DETAIL}?${new URLSearchParams(params).toString()}`,
          payload as AxiosRequestConfig)
          res = response.data.result.content.detail
        } else {
          const response = await db.serviceSheetDefect.where({
            serviceSheetDetailId: sheetId,
            taskId: taskId,
            isActive: "true"
          }).first()
          if (response) {
            if (typeof response.defectData == "string") {
              res = JSON.parse(response.defectData as string)
            } else {
              res = response.defectData
            }
          }
        }
        return res
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_get_na_detail`, {
          errorMessage: error
        })
        const message = (error as any).message as string;
        if (message.includes('Network Error')) {
          const globalError = useGlobalConnectionStore()
          globalError.setSubmitConnectionError(true)
        }
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      this.stateLoading = false
    },
    async getNADetail(sheetId: string, taskId: string) {
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
        const prevStore = usePreviewNaFormStore()
        prevStore.setNAInfo(detail)
        this.setReason(detail.reason)
        this.stateTitle = detail.title
        this.stateLoading = false
        this.toggleIsViewVisible(true)
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_get_na_detail`, {
          errorMessage: error
        })
        const message = (error as any).message as string;
        if (message.includes('Network Error')) {
          const globalError = useGlobalConnectionStore()
          globalError.setSubmitConnectionError(true)
        }
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      this.stateLoading = false
    },
    async getNAFromLocalDB(taskId) {
      try {
        const defectData = await db.serviceSheetDefect.where({
          taskId: taskId,
          workorder: this.eformStore.stateGeneralForm.workOrder,
          isActive: "true"
        }).first()
        let detail
        if (typeof defectData?.defectData == "string") {
          detail = JSON.parse(defectData!.defectData as string)
        } else {
          detail = defectData!.defectData as NADetails
        }
        console.log("detail", detail);
        const prevStore = usePreviewNaFormStore()
        prevStore.setNAInfo(detail)
        this.setReason(detail.reason)
        this.stateTitle = detail.title
        this.stateLoading = false
        this.toggleIsViewVisible(true)
      } catch (error) {
        console.log("OFFLINE - error when showing NA detail", error)
      }
    },
    setSuccesItem(val) {
      this.stateSuccessUpdateItemKey = val
    },
    resetInstance() {
      this.stateLoading = false
      this.stateReason = ""
      this.stateVisible = false
      this.stateViewVisible = false
      this.stateIsValid = true
      this.stateTask = {} as Task,
      this.statePayload = {
        updateParams: [] as UpdatedParam[]
      } as DefectPayload
    }
  }
})
