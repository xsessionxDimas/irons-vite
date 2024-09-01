import {
  DOS_CRUD_API_URL,
  DOS_EXPORT_API_URL,
  DOS_UPSERT_API_URL,
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  ValidatedItem,
  ValidatedDraftItem,
  IronlakeContentBulkUpload,
} from "@/core/types/entities/iron-lake/task/daily-schedule/ValidatedItem";
import PaginationType from "@/core/types/misc/Pagination";
import { ApiResponseIronlake } from "@/core/types/misc/ApiResponse";
import { formatDateOnlyAU } from "@/core/helpers/date-format";

export const useDailyScheduleBulkStore = defineStore({
  id: "dailyScheduleBulk",
  state: () => {
    return {
      statePagination: new PaginationType(),
      stateUploadLoading: false,
      stateUploadProgress: null as number | null,
      stateTotalInvalid: 0,
      stateTotalUploaded: 0,
      stateGatewayData: [] as ValidatedItem[],
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
    async downloadBulkTemplate() {
      const params = {
        ver: "v1",
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.postBlob(
          `${DOS_EXPORT_API_URL}/true?${new URLSearchParams(
            params,
          ).toString()}`,
          {} as AxiosRequestConfig,
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },

    setUploadAlert(
      totalInvalid: number,
      totalUploaded: number,
      pluralRecord: string,
    ) {
      if (
        totalInvalid === 0 &&
        totalUploaded === 0 &&
        this.stateGatewayData.length === 0
      ) {
        this.stateAlert = {
          show: true,
          variant: "info",
          desc: "No record has been submitted, please check your file",
        };
      } else if (
        totalInvalid === 0 &&
        totalUploaded > 0 &&
        this.stateGatewayData.length === 0
      ) {
        this.stateAlert = {
          show: true,
          variant: "success",
          desc: `${totalUploaded} of
          ${totalUploaded} ${pluralRecord} submitted successfully`,
        };
      }
    },
    // Upload Bulk File
    async upload(uploadFile: File) {
      this.stateUploadLoading = true;
      this.stateLoading = true;
      this.stateLoadingMsg = "Uploading Data";

      const params = {
        ver: "v1",
      };

      const url = `${DOS_CRUD_API_URL}/bulk?${new URLSearchParams(
        params,
      ).toString()}`;

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
            this.stateGatewayData = [...content.dailyOutstandingServiceList];

            const invalidRecord = content.dailyOutstandingServiceList.filter(
              (item) => {
                return item.isValid === false && item.isWarning === false;
              },
            );
            this.stateTotalInvalid = invalidRecord.length;
            this.stateTotalUploaded = content.totalData;
            const pluralRecord = content.totalData > 1 ? "records" : "record";
            this.setUploadAlert(
              this.stateTotalInvalid,
              this.stateTotalUploaded,
              pluralRecord,
            );
          } else {
            this.stateIsError = true;
            this.stateError = response.data.result.message;
          }
        } else {
          this.stateAlert = {
            show: true,
            variant: "warning",
            desc: response.data.result.message,
          };
          this.stateIsError = response.data.result.isError;
          this.stateError = response.data.result.message;
        }
      } catch (error: any) {
        this.stateIsError = true;
        this.stateError = error.response.data.result.message;
      } finally {
        this.stateUploadProgress = null;
        this.stateUploadLoading = false;
        this.stateLoading = false;
        this.stateLoadingMsg = "";
      }
    },

    // insert gateway module
    setGatewayAlert(
      totalInvalid: number,
      totalUploaded: number,
      pluralRecord: string,
    ) {
      if (totalInvalid > 0 && totalUploaded > 0) {
        this.stateAlert = {
          show: true,
          variant: "warning",
          desc: `${totalInvalid} of
          ${totalUploaded} ${pluralRecord} failed to upload`,
        };
      } else if (
        totalInvalid === 0 &&
        totalUploaded === 0 &&
        this.stateGatewayData.length > 0
      ) {
        this.stateAlert = {
          show: true,
          variant: "info",
          desc: "No record has been submitted, please check your file",
        };
      } else if (
        totalInvalid === 0 &&
        totalUploaded > 0 &&
        this.stateGatewayData.length > 0
      ) {
        this.stateAlert = {
          show: true,
          variant: "success",
          desc: `${totalUploaded} of
          ${totalUploaded} ${pluralRecord} submitted successfully`,
        };
      }
    },
    async insertGateway() {
      try {
        this.stateLoading = true;
        this.stateLoadingMsg = "Uploading Data";
        const params = {
          ver: "v1",
        };

        const url = `${DOS_UPSERT_API_URL}?${new URLSearchParams(
          params,
        ).toString()}`;

        const filterInvalidData = this.stateGatewayData.filter((obj) => {
          return !obj.isWarning;
        });
        const payload = filterInvalidData.map((element) => {
          return {
            dailyScheduleId: 0,
            unitNumber: element.unitNumber,
            smuDue: element.smuDue,
            workOrder: element.workOrder,
            psType: element.psType,
            dateService: formatDateOnlyAU(element.dateService),
            shift: element.shift,
            startDate: formatDateOnlyAU(element.startDate),
            endDate: formatDateOnlyAU(element.endDate),
            isActive: element.isActive,
            isAttention: !element.isWarning,
          };
        });

        const response: AxiosResponse<
          SingleApiResponse<IronlakeContentBulkUpload>
        > = await ApiService.post(url, payload as AxiosRequestConfig);

        const pluralRecord = this.stateTotalUploaded > 1 ? "records" : "record";
        this.setGatewayAlert(
          this.stateTotalInvalid,
          this.stateTotalUploaded,
          pluralRecord,
        );
        return response;
      } catch (error: any) {
        this.stateError = error.response.data.result.message;
        this.stateIsError = true;
        return error;
      } finally {
        this.stateLoading = false;
        this.stateGatewayData = []
      }
    },

    // callback to remove draft item locally
    removeDraftItemById(draftId: number | null) {
      // Delete current stateDraftData by index
      const indexToRemove = this.stateDraftData.findIndex((obj) => {
        return obj.dailyOutstandingServiceDraftId === draftId;
      });
      this.stateDraftData.splice(indexToRemove, 1);
      this.stateAlert.show = false;
    },
    // Delete Draft Item
    async deleteDraft(draftId: number) {
      const params = {
        ver: "v1",
      };
      const deletePayload = [
        {
          dailyScheduleDraftId: draftId,
        },
      ];
      this.stateLoading = true;
      this.stateLoadingMsg = "Removing Data";
      try {
        const response: AxiosResponse<SingleApiResponse<undefined>> =
          await ApiService.post(
            `${DOS_CRUD_API_URL}/delete_draft?${new URLSearchParams(
              params,
            ).toString()}`,
            deletePayload as AxiosRequestConfig,
          );

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
    async deleteBulkDraft(bulkArray: { dailyScheduleDraftId: number }[]) {
      const params = new URLSearchParams({ ver: "v1" }).toString();
      this.stateLoading = true;
      this.stateLoadingMsg = "Removing Data";

      try {
        const response: AxiosResponse<SingleApiResponse<undefined>> =
          await ApiService.post(
            `${DOS_CRUD_API_URL}/delete_draft?${params}`,
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
