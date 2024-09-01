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
import { db } from "@/database/schema/DexieSchema";
import { addRecord } from "@/database/schema/DatabaseWrapper";
import { TaskImages } from "@/database/schema/TaskImages";
import { AESTShortCurrentDateTime } from "@/core/helpers/date-format";
import { QueueFileTask } from "@/database/schema/QueueFileTask";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useAttachmentStore = defineStore({
  id: "offlineAttachment",
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
    async uploadAttachment(payload: FormData, email: string, task: QueueFileTask) {
      const params = {
        ver: "v1",
        userAccount: email
      };
      let syncStatus = 'Not Sync'
      try {
        const response: AxiosResponse<SingleApiResponse<string>> = await ApiService.post(`${UPLOAD_URL}?${new URLSearchParams(params).toString()}`,
        payload as AxiosRequestConfig);
        syncStatus = 'Sync'
        return response.data.result.content;
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        syncStatus = 'Failed'
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        sendErrorEvent('IRONS', error);
        // jika koneksi gagal, return true agar bisa lanjut ke kode bawahnya
        if (isNoNetwork) {
          return true
        } else {
          return false
        }
      } finally {
        task.syncStatus = syncStatus
        task.syncDate = AESTShortCurrentDateTime()
        await addRecord(db, 'pendingTaskFile', task)
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
    async getImageFromLocal(fileName: string) {
      const image = await db.pendingTaskFile.where({
        filename: fileName
      }).first()
      if (image) {
        return image.blob
      } else {
        return undefined
      }
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
  }
});
