import { INSERT_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-category/UpsertItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { Option } from "@/core/types/misc/Option";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";
// LOOKUPS
import {
  TYPE_CATEGORY_LOOKUP_API_URL
} from "./urls";
import {
  LOOKUP_API_URL as UOM_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/parameter/uom/urls";
import {
  LookupItem as UomLookupItem
} from "@/core/types/entities/iron-lake/parameter/uom/LookupItem";
import {
  LOOKUP_API_URL as OPERATOR_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/operator/urls";
import {
  LookupItem as OperatorLookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/operator/LookupItem";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialForm = {
  compCategoryId: 0,
  type: "",
  sequential: 0,
  operator: "",
  valueMin: 0,
  valueMax: 0,
  uom: "",
  uomId: 0,
  category: "",
  categoryDesc: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useComponentCategoryFormStore = defineStore({
  id: "componentCategoryForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateTypeOption: [] as Option[],
      stateOperatorOption: [] as Option[],
      stateUomOption: [] as Option[],
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateIsEdit: false as boolean,
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
    isEdit: (state) => {
      return state.stateIsEdit;
    },
    typeOption: (state) => {
      return state.stateTypeOption;
    },
    operatorOption: (state) => {
      return state.stateOperatorOption;
    },
    uomOption: (state) => {
      return state.stateUomOption;
    },
  },
  actions: {
    async getLookupType() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(TYPE_CATEGORY_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateTypeOption = mapOption(response.data.result.content.typeCategory);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupUom() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<UomLookupItem>> = await ApiService.get(UOM_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateUomOption = mapOption(response.data.result.content.uom);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupOperator() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<OperatorLookupItem>> = await ApiService.get(OPERATOR_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateOperatorOption = mapOptionFromLookupApi(response.data.result.content, "operator", "operatorDescription");
      } catch (error) {
        sendErrorEvent('IRONS', error);
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
          compCategoryId: 0,
          type: this.stateFormData.type,
          sequential: this.stateFormData.sequential,
          valueMin: this.stateFormData.valueMin,
          valueMax: this.stateFormData.valueMax,
          uom: this.stateFormData.uom,
          category: this.stateFormData.category,
          startDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate))),
          endDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate))),
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${INSERT_API_URL}?${new URLSearchParams(params).toString()}`, formData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        this.stateError = error as string;
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
        sendErrorEvent('IRONS', error);
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
          compCategoryId: this.stateFormData.compCategoryId,
          type: this.stateFormData.type,
          sequential: this.stateFormData.sequential,
          valueMin: this.stateFormData.valueMin,
          valueMax: this.stateFormData.valueMax,
          uom: this.stateFormData.uom,
          category: this.stateFormData.category,
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
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        this.stateError = error as string;
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
        sendErrorEvent('IRONS', error);
      }
      this.stateLoading = false;
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: UpsertItem) {
      this.stateFormData.compCategoryId = data.compCategoryId;
      this.stateFormData.type = data.type;
      this.stateFormData.sequential = data.sequential;
      this.stateFormData.valueMin = data.valueMin;
      this.stateFormData.valueMax = data.valueMax;
      this.stateFormData.uom = data.uom;
      this.stateFormData.category = data.category;
      this.stateFormData.startDate = data.startDate;
      this.stateFormData.endDate = data.endDate;
    },
    setIsEdit(state) {
      this.stateIsEdit = state;
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
