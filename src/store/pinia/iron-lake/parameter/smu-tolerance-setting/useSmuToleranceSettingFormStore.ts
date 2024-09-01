import { CRUD_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/parameter/smu-tolerance-setting/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/parameter/smu-tolerance-setting/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";

const initialForm = {
  mdSMUToleranceSettingId: 0,
  parameter: "",
  valueMin: "",
  ValueMax: "",
  Uom: "",
  uomId: 0,
  isActive: true,
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999"))
};

export const useSmuToleranceSettingFormStore = defineStore({
  id: "smuToleranceSettingForm",
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
          mdSMUToleranceSettingId: this.stateFormData.mdSMUToleranceSettingId,
          parameter: parseInt(this.stateFormData.parameter),
          valueMin: parseInt(this.stateFormData.valueMin),
          ValueMax: parseInt(this.stateFormData.ValueMax),
          Uom: this.stateFormData.Uom,
          uomId: this.stateFormData.uomId,
          isActive: this.stateFormData.isActive,
          startDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate))),
          endDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate))),
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
          mdSMUToleranceSettingId: this.stateFormData.mdSMUToleranceSettingId,
          parameter: parseInt(this.stateFormData.parameter),
          valueMin: parseInt(this.stateFormData.valueMin),
          ValueMax: parseInt(this.stateFormData.ValueMax),
          Uom: this.stateFormData.Uom,
          uomId: this.stateFormData.uomId,
          isActive: this.stateFormData.isActive,
          startDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate))),
          endDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate))),
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
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: ListItem) {
      this.stateFormData.mdSMUToleranceSettingId = data.mdSmuToleranceSettingId || 0;
      this.stateFormData.parameter = data.parameter || "";
      this.stateFormData.valueMin = data.valueMin || "";
      this.stateFormData.ValueMax = data.valueMax || "";
      this.stateFormData.Uom = data.uom || "";
      this.stateFormData.uomId = data.uomId || 0;
      this.stateFormData.startDate = data.startDate || "";
      this.stateFormData.endDate = data.endDate || "";
      this.stateFormData.isActive = data.isActive || false;
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
