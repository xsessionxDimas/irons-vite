import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import ApiService from "@/core/services/ApiService";
import { List } from "@/core/types/entities/dma/approval/List";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { getApprovalListUrl } from './urls'
import { Option } from "@/core/types/misc/Option";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useApprovalListStore = defineStore({
  id: "DmaApprovalList",
  state: () => {
    return {
      stateSelectedHeader: 'Open',
      stateList: [] as List[],
      stateListLoading: true,
      stateOptions: [] as Option[]
    }
  },
  getters: {
    list: (state) => {
      return state.stateList
    },
    listLoading: (state) => {
      return state.stateListLoading
    },
    options: (state) => {
      return state.stateOptions
    }
  },
  actions: {
    async getList() {
      const params = {
        ver: 'v1'
      }
      try {
        const response: AxiosResponse<ApiResponse<any>> = await ApiService.get(getApprovalListUrl, "", new URLSearchParams(params).toString())
        this.stateList = response.data.result.content

        this.stateOptions = this.stateList.map((e) => {
          return {
            label: `${e.unitNumber} - ${e.brand} ${e.equipmentModel} - ${e.psType} Hour Service - ${e.workOrder}`,
            // value: e.workOrder
            value: `${e.unitNumber} - ${e.equipmentModel} - ${e.psType} Hour Service - ${e.workOrder}`
          }
        })
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateListLoading = false
      }
    },
    resetList() {
      this.stateList = []
    }
  }
})
