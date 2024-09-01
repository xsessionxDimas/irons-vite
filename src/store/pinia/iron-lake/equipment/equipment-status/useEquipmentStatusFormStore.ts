import {
  CRUD_API_URL,
  STATUS_LOOKUP_API_URL,
  UPDATE_API_URL
} from "./urls";
import {
  LOOKUP_API_URL as EQUIPMENT_NUMBER_LOOKUP_API_URL
} from "../equipment-number/urls";
import {
  LookupItem as EquipmentNumberLookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-number/LookupItem";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/equipment/equipment-status/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/equipment-status/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import { Option } from "@/core/types/misc/Option";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";

const initialForm = {
  MdEquipmentStatusId: 0,
  Equipment: "",
  SystemStatus: "",
  Status: "",
  SubStatus: "",
  StartDate: normalizeDate(new Date()),
  EndDate: normalizeDate(new Date("12/31/9999")),
}

export const useEquipmentStatusFormStore = defineStore({
  id: "equipmentStatusForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateEquipmentOption: [] as Option[],
      stateSystemStatusOption: [] as Option[],
      stateStatusOption: [] as Option[],
      stateSubStatusOption: [] as Option[],
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
    equipmentOption: (state) => {
      return state.stateEquipmentOption;
    },
    systemStatusOption: (state) => {
      return state.stateSystemStatusOption;
    },
    statusOption: (state) => {
      return state.stateStatusOption;
    },
    subStatusOption: (state) => {
      return state.stateSubStatusOption;
    },
  },
  actions: {
    async getLookupEquipment() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<EquipmentNumberLookupItem>> = await ApiService.get(EQUIPMENT_NUMBER_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentOption = mapOptionFromLookupApi(response.data.result.content, "equipmentNumber", "equipmentNumberDescription");
      } catch (error) {
        console.log(error)
      }
    },
    async getLookupStatus() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(STATUS_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateSystemStatusOption = mapOption(response.data.result.content.systemStatus);
        this.stateStatusOption = mapOption(response.data.result.content.status);
        this.stateSubStatusOption = mapOption(response.data.result.content.subStatus);
      } catch (error) {
        console.log(error)
      }
    },
    async insertData(createBy: string) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const formData = {
          MdEquipmentStatusId: this.stateFormData.MdEquipmentStatusId,
          Equipment: this.stateFormData.Equipment,
          SystemStatus: this.stateFormData.SystemStatus,
          Status: this.stateFormData.Status,
          SubStatus: this.stateFormData.SubStatus,
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
          MdEquipmentStatusId: this.stateFormData.MdEquipmentStatusId,
          Equipment: this.stateFormData.Equipment,
          SystemStatus: this.stateFormData.SystemStatus,
          Status: this.stateFormData.Status,
          SubStatus: this.stateFormData.SubStatus,
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
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: ListItem) {
      this.stateFormData.MdEquipmentStatusId = data.equipmentStatusId || 0;
      this.stateFormData.Equipment = data.equipment || "";
      this.stateFormData.SystemStatus = data.systemStatus || "";
      this.stateFormData.Status = data.status || "";
      this.stateFormData.SubStatus = data.subStatus || "";
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
