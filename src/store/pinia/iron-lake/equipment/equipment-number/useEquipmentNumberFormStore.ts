import { CRUD_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/equipment/equipment-number/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/equipment-number/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/equipment/level/LookupItem";
import { Option } from "@/core/types/misc/Option";
import { LOOKUP_API_URL } from "../level/urls";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import { mapOption } from "@/core/helpers/mapOption";

const initialForm = {
  EquipmentNumberId: 0,
  EquipmentNumber: "",
  EquipmentNumberDescription: "",
  SerialNumber: "",
  Level: "",
  StartDate: normalizeDate(new Date()),
  EndDate: normalizeDate(new Date("12/31/9999"))
}

export const useEquipmentNumberFormStore = defineStore({
  id: "equipmentNumberForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateLevelDescOption: [] as Option[],
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
    levelDescOption: (state) => {
      return state.stateLevelDescOption;
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
      this.stateFormData.EquipmentNumberId = data.equipmentNumberId || 0;
      this.stateFormData.EquipmentNumber = data.equipmentNumber || "";
      this.stateFormData.EquipmentNumberDescription = data.equipmentNumberDescription || "";
      this.stateFormData.SerialNumber = data.serialNumber || "";
      this.stateFormData.Level = data.level || "";
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
    },
    async getLevelLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.get(LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateLevelDescOption = mapOption(response.data.result.content.level);
      } catch (error) {
        console.log(error)
      }
    },
  }
});
