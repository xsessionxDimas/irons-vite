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
import { addRecord } from "@/database/schema/DatabaseWrapper";
import { db } from '@/database/schema/DexieSchema'
import { AESTShortCurrentDateTime } from "@/core/helpers/date-format";
import { TaskImages } from "@/database/schema/TaskImages";
import { QueueFileTask } from "@/database/schema/QueueFileTask";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useAttachmentStore = defineStore({
  id: "Attachment",
  state: () => {
    return {
      stateLoading: false,
      stateCurrentKey: '',
      stateMode: ''
    }
  },
  getters: {
    globalConnectionStore: () => {
      return useGlobalConnectionStore()
    },
    currentKey: (state) => {
      return state.stateCurrentKey
    },
    mode: (state) => {
      return state.stateMode
    }
  },
  actions: {
    async uploadAttachment(payload: FormData, email: string, task: QueueFileTask | undefined = undefined) {
      const params = {
        ver: "v1",
        userAccount: email
      };
      let syncStatus = ''
      let errorMessage: string | undefined = undefined
      try {
        const response: AxiosResponse<SingleApiResponse<string>> = await ApiService.post(`${UPLOAD_URL}?${new URLSearchParams(params).toString()}`,
        payload as AxiosRequestConfig);
        syncStatus = 'Sync'
        return response.data.result.content;
      } catch (error) {
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        this.globalConnectionStore.setSubmitConnectionError(isNoNetwork)
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
        syncStatus = 'Failed'
        errorMessage = typeof (error) == 'object' ? (error as Error).message : error as string
        sendErrorEvent('IRONS', error);
        return false
      } finally {
        if (task) {
          task.errorMessage = errorMessage
          task.syncStatus = syncStatus
          task.syncDate = AESTShortCurrentDateTime()
          await addRecord(db, 'pendingTaskFile', task)
        }
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
    async downloadAttachmentPDF(fileName: string) {
      const params = {
        ver: "v1",
        fileUrl: fileName
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.getBlob(DOWNLOAD_URL, "", new URLSearchParams(params).toString());
        return response.data;
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
      return "";
    },
    setCurrentKey(key: string) {
      this.stateCurrentKey = key
    },
    setMode(mode: string) {
      this.stateMode = mode
    }
  }
});
