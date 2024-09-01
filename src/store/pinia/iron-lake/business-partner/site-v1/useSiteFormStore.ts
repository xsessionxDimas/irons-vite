import { CRUD_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/business-partner/site-v1/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/business-partner/site-v1/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";

export const useSiteFormStore = defineStore({
  id: "siteFormV1",
  state: () => {
    return {
      stateFormData: {
        SiteKeyId: 0,
        StartDate: normalizeDate(new Date()),
        EndDate: normalizeDate(new Date("12/31/9999"))
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
    }
  },
  getters: {
    formData: (state) => {
      return state.stateFormData;
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
    async insertData(createBy: string) {
      this.stateFormData.StartDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.StartDate)))
      this.stateFormData.EndDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.EndDate)))
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const payload = {
          siteKeyId: this.stateFormData.SiteKeyId,
          siteId: this.stateFormData.SiteId,
          siteDescription: this.stateFormData.SiteDescription,
          siteCode: this.stateFormData.SiteCode,
          startDate: this.stateFormData.StartDate,
          endDate: this.stateFormData.EndDate
        }
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${CRUD_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        // this.stateError = error as string;
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    async updateData(updateBy: string) {
      this.stateFormData.StartDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.StartDate)))
      this.stateFormData.EndDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.EndDate)))
      try {
        this.stateLoading = true;
        const params = {
          userAccount: updateBy,
          ver: "v1"
        };
        const payload = {
          siteKeyId: this.stateFormData.SiteKeyId,
          siteId: this.stateFormData.SiteId,
          siteDescription: this.stateFormData.SiteDescription,
          siteCode: this.stateFormData.SiteCode || "",
          startDate: this.stateFormData.StartDate,
          endDate: this.stateFormData.EndDate
        }
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        // this.stateError = error as string;
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: ListItem) {
      this.stateFormData.SiteId = data.SiteId || "";
      this.stateFormData.SiteKeyId = data.SiteKeyId || 0;
      this.stateFormData.SiteDescription = data.SiteDescription || "";
      this.stateFormData.SiteCode = data.SiteCode || "";
      this.stateFormData.StartDate = data.StartDate || "";
      this.stateFormData.EndDate = data.EndDate || "";
    },
    resetState() {
      this.stateFormData = {
        SiteKeyId: 0,
        StartDate: normalizeDate(new Date()),
        EndDate: normalizeDate(new Date("12/31/9999"))
      } as UpsertItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    }
  }
});
