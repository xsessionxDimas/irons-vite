import { CRUD_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/parameter/oil-tolerance-setting/UpsertItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/parameter/oil-tolerance-setting/ListItem";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";

export const useOilToleranceSettingFormStore = defineStore({
  id: "OilToleranceSettingForm",
  state: () => {
    return {
      stateFormData: {
        oilToleranceSettingId: 0,
        startDate: normalizeDate(new Date()),
        endDate: normalizeDate(new Date("12/31/9999")),
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
      this.stateFormData.startDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate)))
      this.stateFormData.endDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate)))
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${CRUD_URL}?${new URLSearchParams(params).toString()}`, this.stateFormData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        // this.stateError = error.response.data.result.message as string;
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    async updateData(updateBy: string) {
      this.stateFormData.startDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate)))
      this.stateFormData.endDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate)))
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
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    resetState() {
      this.stateFormData = {
        oilToleranceSettingId: 0,
        startDate: normalizeDate(new Date()),
        endDate: normalizeDate(new Date("12/31/9999"))
      } as UpsertItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    },
    setFormData(data: ListItem) {
      this.stateFormData.oilToleranceSettingId = data.oilToleranceSettingId || 0;
      this.stateFormData.value = data.value || "";
      this.stateFormData.valueMin = data.valueMin || "";
      this.stateFormData.valueMax = data.valueMax || "";
      this.stateFormData.uom = data.uom || "";
      this.stateFormData.startDate = data.startDate || "";
      this.stateFormData.endDate = data.endDate || "";
    },
  }
});
