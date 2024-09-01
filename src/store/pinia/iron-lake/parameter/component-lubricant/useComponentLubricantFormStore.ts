import { CRUD_API_URL, UPDATE_API_URL } from "./urls";
import {
  LOOKUP_API_URL as LOOKUP_UOM_API_URL
} from "../uom/urls";
import {
  LOOKUP_API_URL as LOOKUP_COMPONENT_API_URL
} from "../../equipment/component/urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/parameter/component-lubricant/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/parameter/component-lubricant/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";

const initialForm = {
  componentLubricantId: 0,
  component: "",
  recomLubri: "",
  value: 0,
  uom: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999"))
};

export const useComponentLubricantFormStore = defineStore({
  id: "componentLubricantForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateComponentFormOption: [] as any[],
      stateUomFormOption: [] as any[],
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
    componentFormOption: (state) => {
      return state.stateComponentFormOption;
    },
    uomFormOption: (state) => {
      return state.stateUomFormOption;
    },
  },
  actions: {
    async getFormOptions(masterDataName: string) {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(masterDataName == "component" ? LOOKUP_COMPONENT_API_URL : LOOKUP_UOM_API_URL, "", new URLSearchParams(params).toString());
        if (masterDataName == "component") {
          this.stateComponentFormOption = mapOptionFromLookupApi(response.data.result.content, "component", "componentDescription");
        } else {
          this.stateUomFormOption = mapOption(response.data.result.content.uom);
        }
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
          componentLubricantId: this.stateFormData.componentLubricantId,
          component: this.stateFormData.component,
          recomLubri: this.stateFormData.recomLubri,
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
          componentLubricantId: this.stateFormData.componentLubricantId,
          component: this.stateFormData.component,
          recomLubri: this.stateFormData.recomLubri,
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
      this.stateFormData.componentLubricantId = data.componentLubricantId || 0;
      this.stateFormData.component = data.component || "";
      this.stateFormData.recomLubri = data.recommendedLubricant || "";
      this.stateFormData.value = data.value || 0;
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
