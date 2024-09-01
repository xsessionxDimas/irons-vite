import { CRUD_API_URL, UPDATE_API_URL } from "./urls";
import {
  LOOKUP_API_URL as COMPANY_LOOKUP_API_URL
} from "../company/urls";
import {
  LookupItem as CompanyLookupItem
} from "@/core/types/entities/iron-lake/business-partner/company/LookupItem";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/business-partner/owner/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/business-partner/owner/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import { Option } from "@/core/types/misc/Option";
import { mapOptionFromLookupApi } from "@/core/helpers/mapOption";

const initialForm = {
  OwnerId: 0,
  Owner: "",
  StartDate: normalizeDate(new Date()),
  EndDate: normalizeDate(new Date("12/31/9999")),
};

export const useOwnerFormStore = defineStore({
  id: "ownerForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateCompanyOption: [] as Option[],
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
    },
    companyOption: (state) => {
      return state.stateCompanyOption;
    },
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
          OwnerId: this.stateFormData.OwnerId,
          Owner: this.stateFormData.Owner,
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
        const formData = {
          OwnerId: this.stateFormData.OwnerId,
          Owner: this.stateFormData.Owner,
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
        this.stateError = error as string;
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    async getCompanyLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<CompanyLookupItem>> = await ApiService.get(COMPANY_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateCompanyOption = mapOptionFromLookupApi(response.data.result.content, "company", "companyDescription");
      } catch (error) {
        console.log(error)
      }
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: ListItem) {
      this.stateFormData.OwnerId = data.ownerId || 0;
      this.stateFormData.Owner = data.owner || "";
      this.stateFormData.StartDate = data.startDate || "";
      this.stateFormData.EndDate = data.endDate || "";
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
