import { CRUD_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/equipment/equipment-assignment/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/equipment-assignment/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";

export const useEquipmentAssignmentFormStore = defineStore({
  id: "equipmentAssignmentForm",
  state: () => {
    return {
      stateFormData: {
        equipmentAssignmentId: 0,
        endDate: normalizeDate(new Date("12/31/9999")),
        startDate: normalizeDate(new Date())
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
      this.stateFormData.equipmentAssignmentId = data.equipmentAssignmentId || 0;
      this.stateFormData.equipment = data.equipment || "";
      this.stateFormData.objectType = data.objectType || "";
      this.stateFormData.plannerGroup = data.plannerGroup || "";
      this.stateFormData.costCenter = data.costCenter || "";
      this.stateFormData.wbsElement = data.wbsElement || "";
      this.stateFormData.level = data.level || "";
      this.stateFormData.equipmentType = data.equipmentType || "";
      this.stateFormData.equipmentGroup = data.equipmentGroup || "";
      this.stateFormData.equipmentModel = data.equipmentModel || "";
      this.stateFormData.equipmentStatus = data.equipmentStatus || "";
      this.stateFormData.site = data.site || "";
      this.stateFormData.planningPlant = data.planningPlant || "";
      this.stateFormData.maintenancePlant = data.maintenancePlant || "";
      this.stateFormData.maintenanceWorkCenter = data.maintenanceWorkCenter || "";
      this.stateFormData.startDate = data.startDate || ""
      this.stateFormData.endDate = data.endDate || ""
    },
    resetState() {
      this.stateFormData = {
        equipmentAssignmentId: 0,
        endDate: normalizeDate(new Date("12/31/9999")),
        startDate: normalizeDate(new Date())
      } as UpsertItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    }
  }
});
