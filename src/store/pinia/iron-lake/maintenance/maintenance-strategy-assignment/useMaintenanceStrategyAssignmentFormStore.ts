import { CRUD_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/maintenance/maintenance-strategy-assignment/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/maintenance/maintenance-strategy-assignment/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";

export const useMaintenanceStrategyAssignmentFormStore = defineStore({
  id: "maintenanceStrategyAssignmentForm",
  state: () => {
    return {
      stateFormData: {
        MainStrategyAssignmentId: 0,
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
        const payloadFormData = {
          MainStrategyAssignmentId: 0,
          MaintenanceStrategyParId: this.stateFormData.MaintenanceStrategyParId,
          MaintenanceStrategyChdId: this.stateFormData.MaintenanceStrategyChdId,
          startDate: this.stateFormData.StartDate,
          endDate: this.stateFormData.EndDate,
          isActive: true
        }
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${CRUD_API_URL}?${new URLSearchParams(params).toString()}`, payloadFormData as AxiosRequestConfig)
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
      this.stateFormData.StartDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.StartDate)))
      this.stateFormData.EndDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.EndDate)))
      try {
        this.stateLoading = true;
        const params = {
          userAccount: updateBy,
          ver: "v1"
        };
        const payloadFormData = {
          MainStrategyAssignmentId: this.stateFormData.MainStrategyAssignmentId,
          MaintenanceStrategyParId: this.stateFormData.MaintenanceStrategyParId,
          MaintenanceStrategyChdId: this.stateFormData.MaintenanceStrategyChdId,
          startDate: this.stateFormData.StartDate,
          endDate: this.stateFormData.EndDate,
        }
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL}?${new URLSearchParams(params).toString()}`, payloadFormData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        this.stateErrors.push(error.response.data.result.message);
        this.stateError = error as string;
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: ListItem) {
      this.stateFormData.MainStrategyAssignmentId = data.mainStrategyAssignmentId || 0;
      this.stateFormData.MaintenanceStrategyParId = data.maintenanceStrategyParId || "";
      this.stateFormData.MaintenanceStrategyChdId = data.maintenanceStrategyChdId || "";
      this.stateFormData.StartDate = data.startDate || "";
      this.stateFormData.EndDate = data.endDate || "";
    },
    resetState() {
      this.stateFormData = {
        MainStrategyAssignmentId: 0,
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
