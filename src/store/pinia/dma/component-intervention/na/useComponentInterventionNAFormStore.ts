import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler"
import ApiService from "@/core/services/ApiService"
import {
  DefectPayload
} from "@/core/types/entities/dma/component-intervention/defect/DefectPayload"
import {
  UpdatedParam
} from "@/core/types/entities/dma/e-form/defects/UpdatedParam"
import {
  ComponentInterventionGroup
} from "@/core/types/entities/dma/component-intervention/ComponentInterventionGroup"
import { Task } from "@/core/types/entities/dma/e-form/Task"
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse"
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import { defineStore } from "pinia"
import { GET_DEFECT_DETAIL, UPDATE_TASK_WITH_DEFECT } from "../defects/urls"
import {
  useComponentInterventionEformStore
} from "../useComponentInterventionEformStore"
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'
import {
  usePreviewNaFormStore
} from "../../preview-form/usePreviewNaFormStore"
import { Item } from "@/core/types/entities/dma/e-form/Item"
import { ServiceSheetErrorMessages } from "@/store/enums/ErrorMessagesEnum";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useComponentInterventionNAFormStore = defineStore({
  id: "ComponentInterventionNAForm",
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
      stateSuccessUpdateItemKey: ''
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
      const eFormStore = useComponentInterventionEformStore()
      return eFormStore.selectedGroup as ComponentInterventionGroup
    },
    selectedFitter: () => {
      const eFormStore = useComponentInterventionEformStore()
      return eFormStore.employee
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
      const form = useComponentInterventionEformStore()
      this.statePayload.id = form.generalForm.id
      this.statePayload.workorder = form.generalForm.sapWorkOrder
      this.statePayload.headerId = form.generalForm.id
      this.statePayload.updateParams = []
      this.statePayload.updateParams.push({
        keyValue: this.stateTask.key,
        propertyParams: [
          {
            propertyName: "taskValue",
            // propertyValue: this.stateTask.category === 'NORMAL' || this.stateTask.category === "CBM" ? "3" : "4"
            propertyValue: "4"
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
        workorder: form.generalForm.sapWorkOrder,
        form: form.generalForm.equipmentDesc,
        serviceSheetDetailId: "",
        interventionId: form.generalForm.id,
        interventionHeaderId: form.generalForm.trInterventionHeaderId,
        category: this.stateTask.category,
        taskId: this.stateTask.key,
        taskNo: this.stateTask.description != "" ? this.stateTask.description.split('')[0] : this.stateTask.items[0].value as string,
        taskDesc: this.stateTask.description != "" ? this.stateTask.description : this.stateTask.items[1].value as string,
        defectWorkorder: '',
        formDefect: "DM-PL-F55",
        defectType: '',
        cbmMeasurement: '',
        cbmUom: '',
        cbmImageKey: '',
        cbmImageProp: '',
        isCbmAdjusment: '',
        // taskValue: this.stateTask.category === 'NORMAL' || this.stateTask.category === "CBM" ? "3" : "4",
        taskValue: "4",
        repairedStatus: "Not-Repaired",
        cbmNAStatus: "Not-Confirm",
        supervisor: this.supervisor,
        status: "Submited",
        defectStatus: "Submited"
      }
      this.statePayload.defectDetail = {
        type: "N/A",
        reason: this.Reason,
        title: this.stateTask.description != "" ? this.stateTask.description : this.stateTask.items[1].value as string,
        interventionId: form.generalForm.id
      }
    },
    async createNA() {
      this.stateLoading = true
      const params = {
        ver: "v1"
      }
      try {
        this.createPayload()
        const res = await ApiService.post(`${UPDATE_TASK_WITH_DEFECT}?${new URLSearchParams(params).toString()}`,
        this.statePayload as AxiosRequestConfig)
        this.stateLoading = false
        const formStore = useComponentInterventionEformStore()
        if (res.data.result.message == ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER) {
          formStore.toggleTaskAlreadyUpdatedStatus(true)
          return false
        } else if (res.data.result.message == ServiceSheetErrorMessages.SUBMITTED) {
          formStore.toggleFormAlreadySubmitted(true)
          return false
        } else {
          formStore.toggleFormUpdated(true)
          return true
        }
      } catch (error) {
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        this.globalConnectionStore.setSubmitConnectionError(isNoNetwork)
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getNADetail(sheetId: string, taskId: string) {
      this.stateLoading = true
      const params = {
        ver: "v1"
      }
      const payload = {
        interventionHeaderId: sheetId,
        taskId: taskId,
        isActive: "true",
        isDeleted: "false"
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
    resetInstance() {
      this.stateSuccessUpdateItemKey = this.stateItemKey
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
