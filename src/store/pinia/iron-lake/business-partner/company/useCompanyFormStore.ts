import { CRUD_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/business-partner/company/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/business-partner/company/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";

const initialForm = {
  CompanyId: 0,
  Company: "",
  CompanyDescription: "",
  StartDate: normalizeDate(new Date()),
  EndDate: normalizeDate(new Date("12/31/9999")),
};

export const useCompanyFormStore = defineStore({
  id: "companyForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
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
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const formData = {
          CompanyId: this.stateFormData.CompanyId,
          Company: this.stateFormData.Company,
          CompanyDescription: this.stateFormData.CompanyDescription,
          StartDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.StartDate))),
          EndDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.EndDate))),
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${CRUD_API_URL}?${new URLSearchParams(params).toString()}`, formData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    async updateData(updateBy: string) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: updateBy,
          ver: "v1"
        };
        const formData = {
          CompanyId: this.stateFormData.CompanyId,
          Company: this.stateFormData.Company,
          CompanyDescription: this.stateFormData.CompanyDescription,
          StartDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.StartDate))),
          EndDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.EndDate))),
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL}?${new URLSearchParams(params).toString()}`, formData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
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
      this.stateFormData.CompanyId = data.CompanyId || 0;
      this.stateFormData.Company = data.Company || "";
      this.stateFormData.CompanyDescription = data.CompanyDescription || "";
      this.stateFormData.StartDate = data.StartDate || "";
      this.stateFormData.EndDate = data.EndDate || "";
    },
    resetState() {
      this.stateFormData = {
        ...initialForm
      } as UpsertItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    }
  }
});
