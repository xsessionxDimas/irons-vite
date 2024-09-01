import { EQP_CRUD_API_URL, EQP_HMO_CRUD_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  ValidatedDraftItem,
  IronlakeContentBulkUpload,
} from "@/core/types/entities/iron-lake/equipment/all-equipment/ValidatedItem";
import PaginationType from "@/core/types/misc/Pagination";
import { ApiResponseIronlake } from "@/core/types/misc/ApiResponse";

export const useBulkStore = defineStore({
  id: "allEquipmentBulk",
  state: () => {
    return {
      statePagination: new PaginationType(),
      stateUploadLoading: false,
      stateUploadProgress: null as number | null,
      stateTotalUploaded: 0,
      stateDraftData: [] as ValidatedDraftItem[],
      stateAlert: {
        show: false,
        variant: "",
        desc: "",
      },
      stateIsNewForm: false,
      stateIsError: false,
      stateError: "",
      stateLoading: false,
      stateLoadingMsg: "",
    };
  },
  getters: {
    progressPercentage: (state) => {
      if (state.stateUploadProgress !== null) {
        return `${state.stateUploadProgress}%`;
      }
      return "";
    },
    alertVariant: (state) => {
      return state.stateAlert.variant;
    },
    alertDesc: (state) => {
      return state.stateAlert.desc;
    },
    pagination: (state) => {
      return state.statePagination;
    },
    error: (state) => {
      return state.stateError;
    },
    isError: (state) => {
      return state.stateIsError;
    },
    loading: (state) => {
      return state.stateLoading;
    },
    loadingMessage: (state) => {
      return state.stateLoadingMsg;
    },
    uploadLoading: (state) => {
      return state.stateUploadLoading;
    },
  },
  actions: {
    // Template
    async downloadBulkTemplate(isHMOffsetTemplate: boolean) {
      const params = new URLSearchParams({ ver: "v1" }).toString();
      try {
        const response: AxiosResponse<Blob> = await ApiService.postBlob(
          `${EQP_CRUD_API_URL}/export/true/${isHMOffsetTemplate}?${params}`,
          {} as AxiosRequestConfig,
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },

    // Upload Bulk File
    setAlert(totalInvalid: number, totalUploaded: number, pluralRecord: string) {
      if (totalInvalid === 0 && totalUploaded === 0) {
        this.stateAlert = {
          show: true,
          variant: "info",
          desc: "No record has been submitted, please check your file",
        };
      } else if (totalInvalid === 0 && totalUploaded > 0) {
        this.stateAlert = {
          show: true,
          variant: "success",
          desc: `${totalUploaded} of
          ${totalUploaded} ${pluralRecord} submitted successfully`,
        };
      } else if (totalInvalid > 0 && totalUploaded > 0) {
        this.stateAlert = {
          show: true,
          variant: "warning",
          desc: `${totalInvalid} of
          ${totalUploaded} ${pluralRecord} failed to upload`,
        };
      }
    },
    async upload(uploadFile: File, isEqpFile: boolean) {
      this.stateUploadLoading = true;
      this.stateLoading = true;
      this.stateLoadingMsg = "Uploading Data";

      const params = new URLSearchParams({ ver: "v1" }).toString();
      const url = isEqpFile
        ? `${EQP_CRUD_API_URL}/bulk?${params}`
        : `${EQP_HMO_CRUD_URL}/bulk?${params}`;

      const uploadPayload = new FormData();
      uploadPayload.append("fileUpload", uploadFile);

      const handleProgress = (event: ProgressEvent) => {
        const progress = Math.round((event.loaded * 100) / event.total);
        this.stateUploadProgress = progress;
      };

      try {
        this.stateIsError = false;
        this.stateError = "";
        const response: AxiosResponse<
          ApiResponseIronlake<IronlakeContentBulkUpload>
        > = await ApiService.postWithProgress(
          url,
          uploadPayload as AxiosRequestConfig,
          handleProgress as AxiosRequestConfig["onUploadProgress"],
        );
        if (response.data.statusCode == 200) {
          if (!response.data.result.isError) {
            const content = response.data.result.content;

            this.stateTotalUploaded = content.totalData;
            const totalInvalid = content.equipmentList.filter((item) => {
              return item.isValid === false;
            }).length;
            const pluralRecord = content.totalData > 1 ? "records" : "record";
            this.setAlert(totalInvalid, content.totalData, pluralRecord);
            this.stateLoading = false;
          } else {
            this.stateIsError = true;
            this.stateError = response.data.result.message;
            this.stateLoading = false;
          }
        } else {
          this.stateAlert = {
            show: true,
            variant: "warning",
            desc: response.data.result.message,
          };
          this.stateIsError = response.data.result.isError;
          this.stateError = response.data.result.message;
          this.stateLoading = false;
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        this.stateIsError = true;
        this.stateError = error.response.data.result.message;
      } finally {
        this.stateUploadProgress = null;
        this.stateLoading = false;
      }
      this.stateUploadLoading = false;
      this.stateLoading = false;
      this.stateLoadingMsg = "";
    },

    // callback to remove draft item locally
    removeDraftItemById(draftId?: number | null) {
      // Delete current stateDraftData by index, then load list again from list store
      const indexToRemove = this.stateDraftData.findIndex((obj) => {
        return obj.equipmentNoDraftId === draftId;
      });
      this.stateDraftData.splice(indexToRemove, 1);
      const totalDraftData = this.stateDraftData.length;

      if (totalDraftData === 0) {
        this.stateAlert.show = false;
      } else {
        // Handle alert numbers if user didn't close the alert
        const pluralRecord = this.stateTotalUploaded > 1 ? "records" : "record";
        this.stateTotalUploaded--;
        const totalUploaded = this.stateTotalUploaded;
        this.stateAlert.desc = `${totalDraftData} of ${totalUploaded} ${pluralRecord} failed to submit`;
      }
    },
    // Delete Single Draft Item
    async deleteDraft(draftId: number) {
      const params = {
        ver: "v1",
      };
      const deletePayload = [
        {
          equipmentDraftId: draftId,
        },
      ];
      this.stateLoading = true;
      this.stateLoadingMsg = "Removing Data";
      try {
        const response: AxiosResponse<SingleApiResponse<undefined>> =
          await ApiService.post(
            `${EQP_CRUD_API_URL}/delete_draft?${new URLSearchParams(
              params,
            ).toString()}`,
            deletePayload as AxiosRequestConfig,
          );

        this.stateAlert.show = false;
        this.removeDraftItemById(draftId);

        return response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.stateLoading = false;
        this.stateLoadingMsg = "";
      }
    },
    // Delete Bulk Draft Item
    async deleteBulkDraft(bulkArray: { equipmentDraftId: number }[]) {
      const params = new URLSearchParams({ ver: "v1" }).toString();
      this.stateLoading = true;
      this.stateLoadingMsg = "Removing Data";

      try {
        const response: AxiosResponse<SingleApiResponse<undefined>> =
          await ApiService.post(
            `${EQP_CRUD_API_URL}/delete_draft?${params}`,
            bulkArray as AxiosRequestConfig,
          );

        this.stateAlert.show = false;

        return response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.stateLoading = false;
        this.stateLoadingMsg = "";
      }
    },
  },
});
