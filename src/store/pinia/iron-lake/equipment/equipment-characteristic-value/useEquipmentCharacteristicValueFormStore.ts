import {
  CRUD_API_URL,
  UPDATE_API_URL,
} from "./urls";
import {
  LOOKUP_API_URL as CHARACTERISTIC_TYPE_VALUE_LOOKUP_API_URL
} from "../characteristic-type-value/urls";
import {
  LOOKUP_API_URL as EQUIPMENT_ASSIGNMENT_LOOKUP_API_URL
} from "../equipment-assignment/urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/equipment/equipment-characteristic-value/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/equipment-characteristic-value/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  mapOption,
  mapOptionFromLookupApi
} from "@/core/helpers/mapOption";
import { Option } from "@/core/types/misc/Option";

const initialForm = {
  mdEquipmentCharacteristicValueId: 0,
  equipment: "",
  characteristicType: "",
  characteristicValue: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useEquipmentCharacteristicValueFormStore = defineStore({
  id: "equipmentCharacteristicValueForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateCharacteristicValueOptionLoading: false,
      stateEquipmentOption: [] as Option[],
      stateCharacteristicTypeOption: [] as Option[],
      stateCharacteristicValueOption: [] as Option[],
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
    characteristicTypeOption: (state) => {
      return state.stateCharacteristicTypeOption;
    },
    characteristicValueOption: (state) => {
      return state.stateCharacteristicValueOption;
    },
    characteristicValueOptionLoading: (state) => {
      return state.stateCharacteristicValueOptionLoading;
    },
  },
  actions: {
    async getEquipmentLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(EQUIPMENT_ASSIGNMENT_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentOption = mapOption(response.data.result.content.equipment);
      } catch (error) {
        console.log(error)
      }
    },
    async getCharacteristicTypeLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(CHARACTERISTIC_TYPE_VALUE_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateCharacteristicTypeOption = mapOptionFromLookupApi(response.data.result.content, "characteristicType", "characteristicTypeDescription");
      } catch (error) {
        console.log(error)
      }
    },
    async getCharacteristicValueLookup() {
      this.stateCharacteristicValueOptionLoading = true;
      const params = {
        ver: "v1",
        characteristicType: this.stateFormData.characteristicType || "",
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(CHARACTERISTIC_TYPE_VALUE_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateCharacteristicValueOption = mapOptionFromLookupApi(response.data.result.content, "characteristicValue", "characteristicValueDescription");
      } catch (error) {
        console.log(error)
      }
      this.stateCharacteristicValueOptionLoading = false;
    },
    async insertData(createBy: string) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const formData = {
          mdEquipmentCharacteristicValueId: this.stateFormData.mdEquipmentCharacteristicValueId,
          equipment: this.stateFormData.equipment,
          characteristicType: this.stateFormData.characteristicType,
          characteristicValue: this.stateFormData.characteristicValue,
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
          mdEquipmentCharacteristicValueId: this.stateFormData.mdEquipmentCharacteristicValueId,
          equipment: this.stateFormData.equipment,
          characteristicType: this.stateFormData.characteristicType,
          characteristicValue: this.stateFormData.characteristicValue,
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
      this.stateFormData.mdEquipmentCharacteristicValueId = data.mdEquipmentCharacteristicValueId || 0;
      this.stateFormData.equipment = data.equipment || "";
      this.stateFormData.characteristicType = data.characteristicType || "";
      this.stateFormData.characteristicValue = data.characteristicValue || "";
      this.stateFormData.startDate = data.startDate || "";
      this.stateFormData.endDate = data.endDate || "";
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
