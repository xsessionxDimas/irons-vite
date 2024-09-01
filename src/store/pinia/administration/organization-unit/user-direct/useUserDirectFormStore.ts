import {
  POST_API_URL,
  UPDATE_API_URL,
  GET_EMPLOYEE_LOOKUP_API_URL
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/administration/organization-unit/user-direct/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/administration/organization-unit/user-direct/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import { mapOptionFromLookupApi } from "@/core/helpers/mapOption";

export const useUserDirectFormStore = defineStore({
  id: "userDirectForm",
  state: () => {
    return {
      stateFormData: {
        mdEmployeeDirectId: 0,
        employeeId: "",
        employeeIdDirect: "",
        startDate: normalizeDate(new Date()),
        endDate: normalizeDate(new Date("12/31/9999")),
        isActive: true
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      employeeOptions: [] as any[],
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
        this.stateFormData.startDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate)))
        this.stateFormData.endDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate)))
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${POST_API_URL}?${new URLSearchParams(params).toString()}`, this.stateFormData as AxiosRequestConfig)
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
        this.stateFormData.startDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate)))
        this.stateFormData.endDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate)))
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
    async getLookupEmployee() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(GET_EMPLOYEE_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.employeeOptions = mapOptionFromLookupApi(response.data.result.content, "emmployeeId", "employeeName");
      } catch (error) {
        console.log(error);
      }
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: ListItem) {
      this.stateFormData.mdEmployeeDirectId = data.MdEmployeeDirectId || 0;
      this.stateFormData.employeeId = data.EmployeeId || "";
      this.stateFormData.employeeIdDirect = data.EmployeeDirect || "";
      this.stateFormData.startDate = data.StartDate || "";
      this.stateFormData.endDate = data.EndDate || "";
      this.stateFormData.isActive = data.IsActive;
    },
    resetState() {
      this.stateFormData = {
        mdEmployeeDirectId: 0,
        employeeId: "",
        employeeIdDirect: "",
        startDate: normalizeDate(new Date()),
        endDate: normalizeDate(new Date("12/31/9999")),
        isActive: true
      } as UpsertItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    }
  }
});
