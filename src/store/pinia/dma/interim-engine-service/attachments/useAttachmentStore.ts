import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import ApiService from "@/core/services/ApiService";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { DOWNLOAD_URL, UPLOAD_URL } from "./urls";
import {
  useGlobalConnectionStore
} from "@/store/pinia/application/useGlobalConnectionStore"
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useAttachmentStore = defineStore({
  id: "InterimAttachment",
  state: () => {
    return {
      stateLoading: false
    }
  },
  getters: {
    globalConnectionStore: () => {
      return useGlobalConnectionStore()
    },
  },
  actions: {
    async uploadAttachment(payload: FormData, email: string) {
      const params = {
        ver: "v1",
        userAccount: email
      };
      try {
        const response: AxiosResponse<SingleApiResponse<string>> = await ApiService.post(`${UPLOAD_URL}?${new URLSearchParams(params).toString()}`,
        payload as AxiosRequestConfig);
        return response.data.result.content;
        return true
      } catch (error) {
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        this.globalConnectionStore.setSubmitConnectionError(isNoNetwork)
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
        sendErrorEvent('IRONS', error);
        return false
      }
    },
    async downloadAttachment(fileName: string) {
      const params = {
        ver: "v1",
        fileUrl: fileName
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.get(DOWNLOAD_URL, "", new URLSearchParams(params).toString());
        return response.data;
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
      return "";
    },
  }
});
