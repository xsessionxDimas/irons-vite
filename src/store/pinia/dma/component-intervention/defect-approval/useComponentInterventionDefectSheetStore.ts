import { defineStore } from "pinia"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import { ApiResponse } from "@/core/types/misc/ApiResponse"
import ApiService from "@/core/services/ApiService"
import {
  DEFECT_SHEET_API_URL,
} from "./urls"
import {
  GENERAL_SERVICE_SHEET_API_URL
} from "../urls"
import {
  DefectList
} from "@/core/types/entities/dma/component-intervention/defect/DefectList"
import {
  useAuthenticationStore
} from "../../../application/useAuthenticationStore"
import {
  useComponentInterventionEformStore
} from "../useComponentInterventionEformStore"
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler"
import { cloneDeep } from "lodash"
import { Option } from "@/core/types/misc/Option"
import { convertErrorMessage } from "../../e-form/helpers"
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useComponentInterventionDefectSheetStore = defineStore({
  id: "useComponentInterventionDefectSheetStore",
  state: () => {
    return {
      stateDefectSheets: [] as DefectList[],
      stateSelectedDefectSheet: {} as DefectList,
      stateSelectedWorkOrder: "",
      stateIsError: false,
      stateError: {} as any,
      stateErrorMessage: '',
      stateOption: [] as Option[],
      stateDefectTitle: ""
    }
  },
  getters: {
    DefectSheets: (state) => {
      return state.stateDefectSheets
    },
    SelectedDefectSheet: (state) => {
      return state.stateSelectedDefectSheet
    },
    SelectedWorkOrder: (state) => {
      return state.stateSelectedWorkOrder
    },
    DefectOptions: (state) => {
      return state.stateOption
    },
    IsError: (state) => {
      return state.stateIsError
    },
    Error: (state) => {
      return state.stateErrorMessage
    },
    authStore: () => {
      return useAuthenticationStore()
    },
    DefectTitle: (state) => {
      return state.stateDefectTitle
    }
  },
  actions: {
    async getDefectLists(supervisor: string) {
      const params = {
        ver: "v1",
        supervisor: supervisor,
        userGroup: 'supervisor'
      }
      try {
        this.stateIsError = false
        const response: AxiosResponse<ApiResponse<DefectList>> = await ApiService.get(`${DEFECT_SHEET_API_URL}?${new URLSearchParams(params).toString()}`)
        this.stateDefectSheets = response.data.result.content
        this.stateOption = this.stateDefectSheets.map((val) => {
          return {
            labelPlain: `${val.equipment} - ${val.equipmentDesc} - ${val.sampleStatus} Intervention - ${val.componentDescription} - ${val.sapWorkOrder}`,
            value: val.sapWorkOrder,
            label: `${val.equipment} - ${val.equipmentDesc} - <span class="${val.sampleStatus?.toLowerCase() == 'caution' ? 'yellow' : val.sampleStatus?.toLowerCase() == 'normal' ? 'green' : 'red'}">${val.sampleStatus} Intervention</span> - ${val.componentSystem} - ${val.sapWorkOrder}`
          }
        })
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        this.stateIsError = true
        this.stateError = error
      }
    },
    async getDefectListsPlanner() {
      const params = {
        ver: "v1",
        supervisor: this.authStore.user.EmployeeId,
        userGroup: 'planner'
      }
      try {
        this.stateIsError = false
        const response: AxiosResponse<ApiResponse<DefectList>> = await ApiService.get(`${DEFECT_SHEET_API_URL}?${new URLSearchParams(params).toString()}`)
        this.stateDefectSheets = response.data.result.content
        this.stateOption = this.stateDefectSheets.map((val) => {
          return {
            value: `${val.equipment} - ${val.equipmentDesc} - ${val.sampleStatus} Intervention - ${val.componentDescription} - ${val.sapWorkOrder}`,
            label: `${val.equipment} - ${val.equipmentDesc} - <span class="${val.sampleStatus?.toLowerCase() == 'caution' ? 'yellow' : val.sampleStatus?.toLowerCase() == 'normal' ? 'green' : 'red'}">${val.sampleStatus} Intervention</span> - ${val.componentSystem} - ${val.sapWorkOrder}`,
          }
        })
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        sendErrorEvent('IRONS', error);
        this.stateIsError = true
        this.stateError = error
      }
    },
    setDefectTitle(title: string) {
      this.stateDefectTitle = title
    },
    setSelectedDefect(id: string) {
      const defectSheet = this.DefectSheets.find((d) => {
        return d.interventionId === id
      })
      if (defectSheet) {
        this.stateSelectedDefectSheet = defectSheet
      }
    },
    async approveDefectSheetBySupervisor() {
      const authStore = useAuthenticationStore()
      const eFormStore = useComponentInterventionEformStore()
      const statusHistoryClone = eFormStore.generalForm.statusHistory ? cloneDeep(eFormStore.generalForm.statusHistory) : []
      statusHistoryClone.push({
        status: "Close",
        updatedBy: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        },
        updatedDate: "<<ServerDateTime>>",
        tsUpdatedDate: "<<ServerTimeStamp>>"
      })
      const payload = {
        id: this.stateSelectedDefectSheet.interventionId,
        localInterventionStatus: "Submited",
        updateParams: [{
          keyValue: this.stateSelectedDefectSheet.interventionKey,
          propertyParams: [{
            propertyName: "interventionExecution",
            propertyValue: "Close"
          },
          {
            propertyName: "defectStatus",
            propertyValue: "Approved (SPV)"
          },
          {
            propertyName: "updatedBy",
            propertyValue: JSON.stringify({
              id: authStore.user.EmployeeId,
              name: authStore.user.Name
            })
          },
          {
            propertyName: "updatedDate",
            propertyValue: "<<ServerDateTime>>"
          },
          {
            propertyName: "statusHistory",
            propertyValue: JSON.stringify(statusHistoryClone)
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      const params = {
        ver: 'v1'
      }
      try {
        this.stateIsError = false
        this.stateError = {}
        const response = await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig)
        if (response.data.result.isError) {
          this.stateIsError = true
          this.stateErrorMessage = convertErrorMessage(response.data.result.message)
        }
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error)
        this.stateIsError = true
        this.stateErrorMessage = convertErrorMessage(error?.response?.data?.result?.message ?? `${error}`)
        sendErrorEvent('IRONS', error);
      }
    },
    async approveDefectSheetByPlanner() {
      const authStore = useAuthenticationStore()
      const payload = {
        id: this.stateSelectedDefectSheet.interventionId,
        localInterventionStatus: "Close",
        updateParams: [{
          keyValue: this.stateSelectedDefectSheet.interventionKey,
          propertyParams: [{
            propertyName: "defectStatus",
            // asumsi defect approve by planner langsung completed
            // propertyValue: !eFormStore.generalForm.defectStatus ? "Approved (PLN)" : "Completed"
            propertyValue: "Completed"
          },
          {
            propertyName: "updatedBy",
            propertyValue: JSON.stringify({
              id: authStore.user.EmployeeId,
              name: authStore.user.Name
            })
          },
          {
            propertyName: "updatedDate",
            propertyValue: "<<ServerDateTime>>"
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      const params = {
        ver: 'v1'
      }
      try {
        this.stateIsError = false
        this.stateError = {}
        const response = await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig)
        if (response.data.result.isError) {
          this.stateIsError = true
          this.stateErrorMessage = convertErrorMessage(response.data.result.message)
        }
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error)
        this.stateIsError = true
        this.stateErrorMessage = convertErrorMessage(error?.response?.data?.result?.message ?? `${error}`)
        sendErrorEvent('IRONS', error);
      }
    },
    reset() {
      this.stateIsError = false
      this.stateError = {}
      this.stateErrorMessage = ''
    }
  }
})
