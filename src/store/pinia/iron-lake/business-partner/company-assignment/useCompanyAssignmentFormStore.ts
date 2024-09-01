import { CRUD_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/business-partner/company-assignment/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/business-partner/company-assignment/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  LookupItem as CompanyLookupItem
} from "@/core/types/entities/iron-lake/business-partner/company/LookupItem";
import {
  LOOKUP_API_URL as COMPANY_LOOKUP_API_URL
} from "../company/urls";
import { Option } from "@/core/types/misc/Option";
import {
  LookupItem as SiteLookupItem
} from "@/core/types/entities/iron-lake/business-partner/site/LookupItem";
import {
  LOOKUP_API_URL as SITE_LOOKUP_API_URL
} from "../site/urls";
import { mapOption } from "@/core/helpers/mapOption";

export const useCompanyAssignmentFormStore = defineStore({
  id: "companyAssignmentForm",
  state: () => {
    return {
      stateFormData: {
        CompanyAssignmentId: 0,
        IsActive: true
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateCompanyOption: [] as Option[],
      stateSiteOption: [] as Option[],
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
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${CRUD_API_URL}?${new URLSearchParams(params).toString()}`, this.stateFormData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        this.stateError = error as string;
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
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL}?${new URLSearchParams(params).toString()}`, this.stateFormData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        this.stateError = error as string;
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
      this.stateFormData.CompanyAssignmentId = data.CompanyAssignmentId || 0;
      this.stateFormData.Company = data.Company || "";
      this.stateFormData.Site = data.Site || "";
      this.stateFormData.IsActive = data.IsActive || false;
    },
    resetState() {
      this.stateFormData = {
        CompanyAssignmentId: 0,
        IsActive: true
      } as UpsertItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    },
    async getCompanyLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<CompanyLookupItem>> = await ApiService.get(COMPANY_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateCompanyOption = response.data.result.content.company.map((s) => {
          return {
            label: s,
            value: s
          }
        });
      } catch (error) {
        console.log(error)
      }
    },
    async getSiteLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<SiteLookupItem>> = await ApiService.get(SITE_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateSiteOption = mapOption(response.data.result.content.siteId);
      } catch (error) {
        console.log(error)
      }
    },
  }
});
