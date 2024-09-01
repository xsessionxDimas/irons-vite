import { CRUD_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/administration/organization-unit/employee-v1/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/administration/organization-unit/employee-v1/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";

export const useEmployeeFormStore = defineStore({
  id: "employeeFormV1",
  state: () => {
    return {
      stateFormData: {
        EmployeeId: "",
        IsActive: true,
        EndDate: normalizeDate(new Date("12/31/9999")),
        StartDate: normalizeDate(new Date())
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
    },
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
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${CRUD_API_URL}?${new URLSearchParams(params).toString()}`, this.stateFormData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        this.stateError = error.response.data.result.message as string;
        this.stateErrors.push(error && error.response.data.result.message);
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
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL}?${new URLSearchParams(params).toString()}`, this.stateFormData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        // this.stateError = error as string;
        this.stateErrors.push(error && error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: ListItem) {
      this.stateFormData.EmployeeId = data.EmployeeId || "0";
      this.stateFormData.Name = data.Name || "";
      this.stateFormData.Company = data.Company || "";
      this.stateFormData.AdAccount = data.AdAccount || "";
      this.stateFormData.Email = data.Email || "";
      this.stateFormData.Phone = data.Phone || "";
      this.stateFormData.Gender = data.Gender || "";
      this.stateFormData.Position = data.Position || "";
      this.stateFormData.Location = data.Location || "";
      this.stateFormData.StartDate = data.StartDate || "";
      this.stateFormData.EndDate = data.EndDate || "";
      this.stateFormData.IsActive = data.IsActive || false;
    },
    resetState() {
      this.stateFormData = {
        EmployeeId: "",
        IsActive: true,
        EndDate: normalizeDate(new Date("12/31/9999")),
        StartDate: normalizeDate(new Date())
      } as UpsertItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    }
  }
});
