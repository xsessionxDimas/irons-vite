import ApiService from "@/core/services/ApiService";
import { EXPORT_API_BY_ID_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import {
  ListItem
} from "@/core/types/entities/iron-lake/media-library/ListItem";
import {
  convertToMimeType,
  saveWithDelay
} from "@/store/pinia/iron-lake/media-library/helper";

export const useMediaLibraryBulkStore = defineStore({
  id: "mediaLibraryBulk",
  state: () => {
    return {
      stateIsBulkDownload: false as boolean,
      stateListBulkDownload: [] as ListItem[],
      stateLoading: false,
      stateLoadingMessage: "",
    };
  },
  getters: {
    isBulkDownload: (state) => {
      return state.stateIsBulkDownload
    },
    loading: (state) => {
      return state.stateLoading;
    },
    loadingMessage: (state) => {
      return state.stateLoadingMessage;
    },
  },
  actions: {
    setIsBulkDownload(value: boolean) {
      this.stateIsBulkDownload = value
    },
    setLoading(value: boolean) {
      this.stateLoading = value
    },
    setItemListBulkDownload(itemAttachment: ListItem[]) {
      this.stateListBulkDownload = itemAttachment
    },
    async downloadAttachmentBlob(itemAttachment: ListItem) {
      const params = {
        ver: "v1",
        id: itemAttachment.AttachmentId
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.getBlob(EXPORT_API_BY_ID_URL, "", new URLSearchParams(params).toString());
        return response.data
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async downloadAttachmentList() {
      this.stateLoading = true
      this.stateLoadingMessage = "Downloading Attachment"
      const promises = [] as Promise<any>[]
      this.stateListBulkDownload.forEach((item) => {
        promises.push(new Promise((resolve, reject) => {
          this.downloadAttachmentBlob(item).then((res) => {
            resolve(res)
          }).catch((error) => {
            reject(error); // Reject the promise if an error occurs
          });
        }))
      })
      await Promise.allSettled(promises).then(async (res:any[]) => {
        for (const [index, result] of res.entries()) {
          if (result.status == 'rejected') {
            continue;
          }
          const type = convertToMimeType(this.stateListBulkDownload[index].FileType, true);
          const fileName = `${this.stateListBulkDownload[index].Code}.${this.stateListBulkDownload[index].FileType}`;
          if (result.value) {
            await saveWithDelay(result.value, type, fileName);
          }
        }
        this.stateLoading = false
        this.resetBulkList()
      })
    },
    resetBulkList() {
      this.stateIsBulkDownload = false
      this.stateListBulkDownload = [];
    },
  },
});
