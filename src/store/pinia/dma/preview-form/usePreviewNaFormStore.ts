import {
  updateLoggedInStatusFromAPIResponse
} from '@/core/helpers/authentication-handler'
import ApiService from '@/core/services/ApiService'
import { NADetails } from '@/core/types/entities/dma/defects/NADetail'
import { SingleApiResponse } from '@/core/types/misc/SingleApiResponse'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { GET_DEFECT_DETAIL } from '../e-form/defects/urls'
import { sendErrorEvent } from '@/core/helpers/analytics';

export const usePreviewNaFormStore = defineStore({
  id: "NAPreview",
  state: () => {
    return {
      stateLoading: false,
      stateViewVisible: false,
      stateNAInfo: {} as NADetails
    }
  },
  getters: {
    ViewVisible: (state) => {
      return state.stateViewVisible
    },
    Details: (state) => {
      return state.stateNAInfo
    }
  },
  actions: {
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
        this.stateNAInfo = response.data.result.content.detail
        console.log(this.stateNAInfo)
        this.stateLoading = false
        this.toggleIsViewVisible(true)
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateLoading = false
        sendErrorEvent('IRONS', error);
      }
    },
    setNAInfo(detail: NADetails) {
      this.stateNAInfo = detail
    },
    toggleIsViewVisible(value: boolean) {
      this.stateViewVisible = value
    },
    resetInstance() {
      this.stateLoading = false
      this.stateNAInfo = {} as NADetails
      this.stateViewVisible = false
    }
  }
})
