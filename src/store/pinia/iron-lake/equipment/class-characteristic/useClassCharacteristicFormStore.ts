import {
  CRUD_API_URL,
  UPDATE_API_URL,
  CLASS_LOOKUP_API_URL,
  CHARACTERISTIC_TYPE_LOOKUP_API_URL
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/equipment/class-characteristic/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/class-characteristic/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import { mapOptionFromLookupApi } from "@/core/helpers/mapOption";
import { Option } from "@/core/types/misc/Option";

const initialForm = {
  classCharacteristicId: 0,
  class: "",
  characteristicType: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useClassCharacteristicFormStore = defineStore({
  id: "classCharacteristicForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateClassOption: [] as Option[],
      stateCharacteristicTypeOption: [] as Option[],
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
    classOption: (state) => {
      return state.stateClassOption;
    },
    characteristicTypeOption: (state) => {
      return state.stateCharacteristicTypeOption;
    },
  },
  actions: {
    async getClassLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(CLASS_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateClassOption = mapOptionFromLookupApi(response.data.result.content, "class", "classDescription");
      } catch (error) {
        console.log(error)
      }
    },
    async getCharacteristicTypeLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(CHARACTERISTIC_TYPE_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateCharacteristicTypeOption = mapOptionFromLookupApi(response.data.result.content, "characteristicType", "characteristicTypeDescription");
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
          classCharacteristicId: this.stateFormData.classCharacteristicId,
          class: this.stateFormData.class,
          characteristicType: this.stateFormData.characteristicType,
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
          classCharacteristicId: this.stateFormData.classCharacteristicId,
          class: this.stateFormData.class,
          characteristicType: this.stateFormData.characteristicType,
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
      this.stateFormData.classCharacteristicId = data.classCharacteristicId || 0;
      this.stateFormData.class = data.class || "";
      this.stateFormData.characteristicType = data.characteristicType || "";
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
