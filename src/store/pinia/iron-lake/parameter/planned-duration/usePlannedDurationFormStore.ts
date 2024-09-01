import { CRUD_API_URL, UPDATE_API_URL } from "./urls";
import {
  LOOKUP_API_URL as LOOKUP_UOM_API_URL
} from "../uom/urls";
import {
  LOOKUP_PS_TYPE_API_URL
} from "../../task/daily-schedule/urls";
import {
  LOOKUP_API_URL as LOOKUP_MODEL_API_URL
} from "../../equipment/characteristic-value/urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/parameter/planned-duration/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/parameter/planned-duration/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";

const initialForm = {
  plannedDurationId: 0,
  model: "",
  psType: "",
  value: "",
  uom: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999"))
};

export const usePlannedDurationFormStore = defineStore({
  id: "PlannedDurationForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateModelOption: [] as any[],
      statePsTypeOption: [] as any[],
      stateUomOption: [] as any[],
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
    uomOption: (state) => {
      return state.stateUomOption
    },
    psTypeOption: (state) => {
      return state.statePsTypeOption
    },
    modelOption: (state) => {
      return state.stateModelOption
    }
  },
  actions: {
    async getPsTypeLookUp() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(LOOKUP_PS_TYPE_API_URL, "", new URLSearchParams(params).toString());
        this.statePsTypeOption = mapOption(response.data.result.content.psType)
      } catch (error) {
        console.log(error)
      }
    },
    async getModelLookUp() {
      const params = {
        ver: "v1",
        isEquipmentModel: "true"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(LOOKUP_MODEL_API_URL, "", new URLSearchParams(params).toString());
        this.stateModelOption = mapOptionFromLookupApi(response.data.result.content, "characteristicValue", "characteristicValueDescription")
      } catch (error) {
        console.log(error)
      }
    },
    async getUomLookUp() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(LOOKUP_UOM_API_URL, "", new URLSearchParams(params).toString());
        this.stateUomOption = mapOption(response.data.result.content.uom)
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
          plannedDurationId: 0,
          model: this.stateFormData.model,
          psType: this.stateFormData.psType,
          value: this.stateFormData.value,
          uom: this.stateFormData.uom,
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
          plannedDurationId: this.stateFormData.plannedDurationId,
          model: this.stateFormData.model,
          psType: this.stateFormData.psType,
          value: this.stateFormData.value,
          uom: this.stateFormData.uom,
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
      this.stateFormData.plannedDurationId = data.plannedDurationId || 0;
      this.stateFormData.model = data.model || "";
      this.stateFormData.psType = data.psType || "";
      this.stateFormData.value = data.value || "";
      this.stateFormData.uom = data.uom || "";
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
