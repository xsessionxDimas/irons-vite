import { CRUD_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/maintenance/maintenance-strategy/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/maintenance/maintenance-strategy/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import { Option } from "@/core/types/misc/Option";

export const useMaintenanceStrategyFormStore = defineStore({
  id: "maintenanceStrategyForm",
  state: () => {
    return {
      stateFormData: {
        MdMaintenanceStrategyId: 0,
        EndDate: normalizeDate(new Date("12/31/9999")),
        StartDate: normalizeDate(new Date())
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateStrategyCategoryOption: [] as Option[],
      stateStrategyPackageOption: [] as Option[],
      stateBudgetLifeOption: [] as Option[],
      stateUomOption: [] as Option[],
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
    strategyCategoryCodeOption: (state) => {
      return state.stateStrategyCategoryOption;
    },
    strategyPackageOption: (state) => {
      return state.stateStrategyPackageOption;
    },
    budgetLifeOption: (state) => {
      return state.stateBudgetLifeOption;
    },
    uomOption: (state) => {
      return state.stateUomOption;
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
          mdmaintenanceStrategyId: 0,
          maintenanceStrategyId: this.stateFormData.MaintenanceStrategyId,
          strategyCategory: this.stateFormData.StrategyCategory,
          strategyPackage: this.stateFormData.StrategyPackage,
          budgetLife: this.stateFormData.BudgetLife,
          uom: this.stateFormData.Uom,
          startDate: this.stateFormData.StartDate,
          endDate: this.stateFormData.EndDate,
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
          mdMaintenanceStrategyId: this.stateFormData.MdMaintenanceStrategyId,
          maintenanceStrategyId: this.stateFormData.MaintenanceStrategyId,
          strategyCategory: this.stateFormData.StrategyCategory,
          strategyPackage: this.stateFormData.StrategyPackage,
          budgetLife: this.stateFormData.BudgetLife,
          uom: this.stateFormData.Uom,
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
      this.stateFormData.MaintenanceStrategyId = data.maintenanceStrategyId || "";
      this.stateFormData.MdMaintenanceStrategyId = data.mdMaintenanceStrategyId || 0;
      this.stateFormData.StrategyCategory = data.strategyCategory || "";
      this.stateFormData.StrategyPackage = data.strategyPackage || "";
      this.stateFormData.BudgetLife = data.budgetLife || "";
      this.stateFormData.Uom = data.uom || "";
      this.stateFormData.StartDate = data.startDate || "";
      this.stateFormData.EndDate = data.endDate || "";
    },
    resetState() {
      this.stateFormData = {
        MdMaintenanceStrategyId: 0,
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
