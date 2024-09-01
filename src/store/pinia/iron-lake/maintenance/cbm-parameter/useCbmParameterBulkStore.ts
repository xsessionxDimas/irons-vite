import { defineStore } from "pinia";
import {
  ListItem
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/ListItem";
import {
  BulkRequest
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/BulkRequest";
import {
  ValidatedItem
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/ValidatedItem";
import {
  AxiosRequestConfig,
  AxiosResponse
} from "axios";
import {
  SingleApiResponse
} from "@/core/types/misc/SingleApiResponse";
import {
  BulkResponse
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/BulkResponse";
import ApiService from "@/core/services/ApiService";
import {
  IRONLAKE_BULK_API_URL,
  IRONLAKE_CRUD_API_URL
} from "./urls";

export const useCbmParameterBulkStore = defineStore({
  id: "cbmParameterBulk",
  state: () => {
    return {
      stateBulkPayload: {} as BulkRequest,
      stateBulkErrors: {
        totalItem: 0,
        employeeList: [] as ListItem[],
      },
      stateAlert: {
        show: false,
        variant: "",
        desc: "",
      },
      stateBulkPerformed: false,
      stateLoading: false,
      stateLoadingMsg: "",
      stateUploadLoading: false,
      stateValidatedData: [] as ValidatedItem[],
      stateDisplayData: [] as ValidatedItem[],
      stateIsError: false,
      stateError: "",
      stateIsUploaded: false,
      stateIsSort: false,
      stateSortBy: null as string | null,
      stateSortOrder: null as string | null,
    };
  },
  getters: {
    validatedData: (state) => {
      return state.stateValidatedData;
    },
    displayData: (state) => {
      return state.stateDisplayData;
    },
    error: (state) => {
      return state.stateError;
    },
    isError: (state) => {
      return state.stateIsError;
    },
    alertVariant: (state) => {
      return state.stateAlert.variant;
    },
    alertDesc: (state) => {
      return state.stateAlert.desc;
    },
    loading: (state) => {
      return state.stateLoading;
    },
    loadingMessage: (state) => {
      return state.stateLoadingMsg
    },
    uploadLoading: (state) => {
      return state.stateUploadLoading;
    },
    isUploaded: (state) => {
      return state.stateIsUploaded;
    },
    bulkErrors: (state) => {
      return state.stateBulkErrors;
    },
    testLoading: (state) => {
      return state.stateUploadLoading;
    }
  },
  actions: {
    async bulkUpload() {
      this.stateLoading = true
      const uploadDataPayload = new FormData();
      uploadDataPayload.append('fileUpload', this.stateBulkPayload.fileUpload)
      try {
        const response: AxiosResponse<SingleApiResponse<BulkResponse>> = await ApiService.post(`${IRONLAKE_BULK_API_URL}`, uploadDataPayload as AxiosRequestConfig)
        if (response.data.statusCode == 200) {
          if (!response.data.result.isError) {
            const content = response.data.result.content;
            const totalUploaded = content.totalData;
            const invalidRecord = content.cbmParameterList.filter((item) => {
              return item.validationReason !== "";
            });
            const totalInvalid = invalidRecord.length;
            const pluralRecord = totalUploaded > 1 ? "records" : "record";
            if (totalInvalid === 0 && totalUploaded === 0) {
              this.stateAlert = {
                show: true,
                variant: "info",
                desc: "No record has been submitted, please check your file",
              }
            } else if (totalInvalid === 0 && totalUploaded > 0) {
              this.stateAlert = {
                show: true,
                variant: "success",
                desc: `${totalUploaded} of ${totalUploaded} ${pluralRecord} submitted successfully`,
              }
            } else if (totalInvalid > 0 && totalUploaded > 0) {
              this.stateAlert = {
                show: true,
                variant: "warning",
                desc: `${totalInvalid} of ${totalUploaded} ${pluralRecord} failed to submit`,
              }
            }
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
        this.stateLoading = false;
      } catch (error: any) {
        console.log(error)
        this.stateLoading = false;
        this.stateError = error;
        this.stateIsError = true;
      }
    },
    async deleteBulkDraft(bulkArray: { dailyScheduleDraftId: number }[]) {
      const params = new URLSearchParams({ ver: "v1" }).toString();
      this.stateLoading = true;
      this.stateLoadingMsg = "Removing Data";

      try {
        const response: AxiosResponse<SingleApiResponse<undefined>> =
          await ApiService.post(
            `${IRONLAKE_CRUD_API_URL}/delete_draft?${params}`,
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
    setIsUploadedState(state: boolean): void {
      this.stateIsUploaded = state
    },
    resetState() {
      this.stateBulkPayload = {} as BulkRequest;
      this.stateValidatedData = [] as ValidatedItem[];
      this.stateDisplayData = [] as ValidatedItem[];
      this.stateBulkPerformed = false;
      this.stateIsError = false;
      this.stateError = "";
      this.stateLoading = false;
      this.stateUploadLoading = false;
      this.stateIsSort = false;
      this.stateSortBy = null as string | null;
      this.stateSortOrder = null as string | null;
    }
  }
});
