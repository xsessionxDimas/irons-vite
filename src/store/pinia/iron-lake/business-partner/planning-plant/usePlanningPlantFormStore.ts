import { apiUrls } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/business-partner/planning-plant/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/business-partner/planning-plant/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";

const initialForm = {
  PlanningPlantKeyId: 0,
  PlanningPlantId: "",
  PlanningPlantCode: "",
  PlanningPlantDescription: "",
  StartDate: normalizeDate(new Date()),
  EndDate: normalizeDate(new Date("12/31/9999")),
};

export const usePlanningPlantFormStore = defineStore({
  id: "planningPlantForm",
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
          PlanningPlantId: this.stateFormData.PlanningPlantId,
          PlanningPlantCode: this.stateFormData.PlanningPlantCode,
          PlanningPlantDescription: this.stateFormData.PlanningPlantDescription,
          StartDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.StartDate))),
          EndDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.EndDate))),
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${apiUrls.insertItem}?${new URLSearchParams(params).toString()}`, formData as AxiosRequestConfig)
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
          PlanningPlantKeyId: this.stateFormData.PlanningPlantKeyId,
          PlanningPlantId: this.stateFormData.PlanningPlantId,
          PlanningPlantCode: this.stateFormData.PlanningPlantCode,
          PlanningPlantDescription: this.stateFormData.PlanningPlantDescription,
          StartDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.StartDate))),
          EndDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.EndDate))),
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${apiUrls.updateItem}?${new URLSearchParams(params).toString()}`, formData as AxiosRequestConfig)
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
      this.stateFormData.PlanningPlantKeyId = data.planningPlantKeyId || 0;
      this.stateFormData.PlanningPlantId = data.planningPlantId || "";
      this.stateFormData.PlanningPlantCode = data.planningPlantCode || "";
      this.stateFormData.PlanningPlantDescription = data.planningPlantDescription || "";
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
