import { CRUD_API_URL, IRONLAKE_CRUD_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/business-partner/site/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/business-partner/site/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  DraftItem
} from "@/core/types/entities/iron-lake/business-partner/site/DraftItem";
import {
  ListDraft
} from "@/core/types/entities/iron-lake/business-partner/site/ListDraft";
import {
  BulkResponse
} from "@/core/types/entities/iron-lake/business-partner/site/BulkResponse";

export const useSiteFormStore = defineStore({
  id: "siteForm",
  state: () => {
    return {
      stateFormData: {
        isActive: true,
      } as UpsertItem,
      stateFormDraft: {} as DraftItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateLoadingMessage: "",
    }
  },
  getters: {
    formData: (state) => {
      return state.stateFormData;
    },
    formDraftData: (state) => {
      return state.stateFormDraft;
    },
    error: (state) => {
      return state.stateError;
    },
    errors: (state) => {
      return state.stateErrors;
    },
    isError: (state) => {
      return state.stateIsError;
    },
    loading: (state) => {
      return state.stateLoading;
    }
  },
  actions: {
    async upsertData() {
      try {
        this.stateLoading = true;
        const params = {
          ver: "v1"
        };
        const payload = [
          this.stateFormData,
        ];
        const response: AxiosResponse<SingleApiResponse<BulkResponse>> = await ApiService.post(`${IRONLAKE_CRUD_API_URL}/upsert?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
        if (response.data.title !== "Error") {
          if (response.data.result.isError) {
            this.stateErrors.push(response.data.result.content?.siteList[0]?.validationReason);
            this.stateIsError = true;
          } else {
            this.stateError = "";
            this.stateIsError = false;
          }
        } else {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        }
      } catch (error: any) {
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      } finally {
        this.stateLoading = false;
      }
    },
    async updateDraft() {
      try {
        this.stateLoading = true;
        const params = {
          ver: "v1"
        };
        const payload = [
          this.stateFormDraft,
        ];
        const response: AxiosResponse<SingleApiResponse<BulkResponse>> = await ApiService.post(`${IRONLAKE_CRUD_API_URL}/upsert?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
        if (response.data.title !== "Error") {
          if (response.data.result.isError) {
            this.stateErrors.push(response.data.result.content?.siteList[0]?.validationReason);
            this.stateIsError = true;
          } else {
            this.stateError = "";
            this.stateIsError = false;
          }
        } else {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        }
      } catch (error: any) {
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      } finally {
        this.stateLoading = false;
      }
    },
    async deleteDraft(siteDraftId: string) {
      try {
        this.stateLoading = true;
        const payload = [
          {
            siteDraftId: siteDraftId,
          }
        ];
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${IRONLAKE_CRUD_API_URL}/delete_draft?ver=v1`, payload as AxiosRequestConfig);
        if (response.data.title !== "Error") {
          if (response.data.result.isError) {
            this.stateErrors.push("Failed to delete draft");
            this.stateIsError = true;
          } else {
            this.stateError = "";
            this.stateIsError = false;
          }
        } else {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        }
      } catch (error: any) {
        this.stateErrors.push(error && error.response.data.result.message);
        this.stateIsError = true;
        this.stateLoading = false;
      } finally {
        this.stateLoading = false;
      }
    },
    // Delete Bulk Draft Item
    async deleteBulkDraft(bulkArray: { siteDraftId: number }[]) {
      const params = new URLSearchParams({ ver: "v1" }).toString();
      this.stateLoading = true;
      this.stateLoadingMessage = "Removing Data";

      try {
        const response: AxiosResponse<SingleApiResponse<undefined>> =
          await ApiService.post(
            `${IRONLAKE_CRUD_API_URL}/delete_draft?${params}`,
            bulkArray as AxiosRequestConfig,
          );

        return response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.stateLoading = false;
        this.stateLoadingMessage = "";
      }
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: ListItem) {
      this.stateFormData.siteKeyId = data.siteKeyId || 0;
      this.stateFormData.siteId = data.siteId || "";
      this.stateFormData.siteCode = data.siteCode || "";
      this.stateFormData.siteName = data.siteName || "";
      this.stateFormData.isActive = data.isActive || false;
    },
    setFormDraftData(data: ListDraft) {
      this.stateFormDraft.siteDraftId = data.siteDraftId || 0;
      this.stateFormDraft.siteId = data.siteId || "";
      this.stateFormDraft.siteCode = data.siteCode || "";
      this.stateFormDraft.siteName = data.siteName || "";
      this.stateFormDraft.isActive = true;
    },
    resetState() {
      this.stateFormData = {
        isActive: true,
      } as UpsertItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    }
  }
});
