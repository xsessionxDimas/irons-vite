import { defineStore } from "pinia"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import { ApiResponse } from "@/core/types/misc/ApiResponse"
import ApiService from "@/core/services/ApiService"
import {
  DEFECT_SHEET_API_URL,
  APPROVE_DEFECT_SHEET_API_URL
} from "./urls"
import {
  DefectSheet
} from "@/core/types/entities/dma/defects/DefectSheet"
import {
  useAuthenticationStore
} from "../../application/useAuthenticationStore"
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler"
import { isUndefined } from "lodash"
import { Option } from "@/core/types/misc/Option"
import { convertErrorMessage } from "../e-form/helpers"
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useInterimDefectSheetStore = defineStore({
  id: "useInterimDefectSheetStore",
  state: () => {
    return {
      stateDefectSheets: [] as DefectSheet[],
      stateSelectedDefectSheet: {} as DefectSheet,
      stateSelectedWorkOrder: "",
      stateIsError: false,
      stateError: {} as any,
      stateOption: [] as Option[],
      stateErrorMessage: '',
      stateSheetAlreadyApproved: false,
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
        const response: AxiosResponse<ApiResponse<DefectSheet>> = await ApiService.get(`${DEFECT_SHEET_API_URL}?${new URLSearchParams(params).toString()}`)
        this.stateDefectSheets = response.data.result.content
        this.stateOption = this.stateDefectSheets.map((val) => {
          return {
            label: `${val.unitNumber} - ${val.brand} ${val.equipmentModel} - ${val.psType} Hour Service - ${val.workOrder}`,
            value: `${val.unitNumber} - ${val.equipmentModel} - ${val.psType} Hour Service - ${val.workOrder}`
          }
        })
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        this.stateIsError = true
        this.stateError = error
        sendErrorEvent('IRONS', error);
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
        const response: AxiosResponse<ApiResponse<DefectSheet>> = await ApiService.get(`${DEFECT_SHEET_API_URL}?${new URLSearchParams(params).toString()}`)
        this.stateDefectSheets = response.data.result.content
        this.stateOption = this.stateDefectSheets.map((val) => {
          return {
            label: `${val.unitNumber} - ${val.brand} ${val.equipmentModel} - ${val.psType} Hour Service - ${val.workOrder}`,
            value: `${val.unitNumber} - ${val.equipmentModel} - ${val.psType} Hour Service - ${val.workOrder}`
          }
        })
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        this.stateError = error
        sendErrorEvent('IRONS', error);
      }
    },
    setSelectedDefect(id: string) {
      const defectSheet = this.DefectSheets.find((d) => {
        return d.dailyScheduleId === id
      })
      if (defectSheet) {
        this.stateSelectedDefectSheet = defectSheet
        console.log("this.stateSelectedDefectSheet", this.stateSelectedDefectSheet);
        this.stateSelectedWorkOrder = defectSheet.workOrder
      }
    },
    async approveDefectSheetBySupervisor() {
      const authStore = useAuthenticationStore()
      const payload = {
        id: this.SelectedDefectSheet.eFormId,
        updateParams: [{
          keyValue: "GENERAL",
          propertyParams: [{
            propertyName: "status",
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
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        },
        localStatus: this.SelectedDefectSheet.eFormStatus
      }
      try {
        this.stateIsError = false
        this.stateError = {}
        const res = await ApiService.post(`${APPROVE_DEFECT_SHEET_API_URL}`, payload as AxiosRequestConfig)
        if (res.data.result.message == 'You cannot approve this digital service sheet because another user already approved.') {
          this.stateSheetAlreadyApproved = true
          return false
        } else {
          if (res.data.result.isError) {
            this.stateIsError = true
            this.stateErrorMessage = convertErrorMessage(res.data.result.message)
          }
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
        id: this.SelectedDefectSheet.eFormId,
        updateParams: [{
          keyValue: "GENERAL",
          propertyParams: [{
            propertyName: "defectStatus",
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
        },
        localStatus: this.SelectedDefectSheet.eFormStatus
      }
      try {
        this.stateIsError = false
        this.stateError = {}
        const res = await ApiService.post(`${APPROVE_DEFECT_SHEET_API_URL}`, payload as AxiosRequestConfig)
        if (res.data.result.message == 'You cannot approve this digital service sheet because another user already approved.') {
          this.stateSheetAlreadyApproved = true
          return false
        } else {
          if (res.data.result.isError) {
            this.stateIsError = true
            this.stateErrorMessage = convertErrorMessage(res.data.result.message)
          }
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
    },
    updateSelectedWO(wo, modelId, equipment, psTypeId) {
      try {
        this.stateSelectedWorkOrder = wo
        this.stateSelectedDefectSheet.workOrder = wo
        this.stateSelectedDefectSheet.unitNumber = equipment
        this.stateSelectedDefectSheet.psType = psTypeId
        this.stateSelectedDefectSheet.brand = modelId.split(" ")[0]
        this.stateSelectedDefectSheet.equipmentModel = `${modelId.split(" ")[1]}${!isUndefined(modelId.split(" ")[2]) ? (" " + modelId.split(" ")[2]) : ""}`
      } catch (e) {
        console.log("error render", e);
      }
    }
  }
})
