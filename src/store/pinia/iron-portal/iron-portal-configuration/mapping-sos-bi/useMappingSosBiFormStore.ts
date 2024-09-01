import { INSERT_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/mapping-sos-bi/UpsertItem";
import {
  rating as RatingLookUp
} from "@/core/types/entities/iron-portal/iron-portal-configuration/mapping-sos-bi/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  mapOptionFromLookupApi,
  mapOptionWithThreeLabelFromLookupApi,
  mapOption
} from "@/core/helpers/mapOption";
import { Option } from "@/core/types/misc/Option";
// Look ups
import {
  LOOKUP_TRANSACTION_API_URL as EQUIPMENT_MODEL_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/equipment/equipment-model/urls";
import {
  LookupItem as EquipmentModelLookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-model/LookupItem";
import {
  LookupItem as ComponentLookupItem
} from "@/core/types/entities/iron-lake/equipment/component/LookupItem";
import {
  LOOKUP_TRANSACTION_API_URL as COMPONENT_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/equipment/component/urls";
import {
  LOOKUP_TRANS_API_URL as RATING_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/rating/urls";
import {
  LOOKUP_OIL_TRANSACTION_API_URL as ELEMENT_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/type/urls";
import {
  LookupItemOilTransaction as ElementLookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/type/LookupItem";
import {
  LOOKUP_API_URL as OPERATOR_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/operator/urls";
import {
  LookupItem as OperatorLookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/operator/LookupItem";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialForm = {
  sosMappingForBiId: 0,
  equipmentModel: "",
  component: "",
  element: "",
  rating: "",
  operatorMin: "",
  valueMin: "",
  operatorMax: "",
  valueMax: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useMappingSosBiFormStore = defineStore({
  id: "MappingSosBiForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateEquipmentModelOption: [] as Option[],
      stateEquipmentTypeOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateElementOption: [] as Option[],
      stateRatingDescOption: [] as Option[],
      stateOperatorOption: [] as Option[],
      stateIsEdit: false
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
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    elementOption: (state) => {
      return state.stateElementOption;
    },
    ratingDescOption: (state) => {
      return state.stateRatingDescOption;
    },
    operatorOption: (state) => {
      return state.stateOperatorOption;
    },
    isEdit: (state) => {
      return state.stateIsEdit;
    }
  },
  actions: {
    async getLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const responseEquipmentModelLookup: AxiosResponse<SingleApiResponse<EquipmentModelLookupItem>> = await ApiService.get(EQUIPMENT_MODEL_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseComponentOption: AxiosResponse<SingleApiResponse<ComponentLookupItem>> = await ApiService.get(COMPONENT_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseRating: AxiosResponse<SingleApiResponse<RatingLookUp>> = await ApiService.get(RATING_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseElementOption: AxiosResponse<SingleApiResponse<ElementLookupItem>> = await ApiService.get(ELEMENT_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseOperatorOption: AxiosResponse<SingleApiResponse<OperatorLookupItem>> = await ApiService.get(OPERATOR_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateComponentOption = mapOptionFromLookupApi(responseComponentOption.data.result.content, "component", "componentDescription");
        this.stateEquipmentModelOption = mapOptionWithThreeLabelFromLookupApi(responseEquipmentModelLookup.data.result.content, "equipmentModel", "brand", "equipmentModelDescription");
        this.stateRatingDescOption = mapOption(responseRating.data.result.content.ratingDescription);
        this.stateElementOption = mapOption(responseElementOption.data.result.content.parameter);
        this.stateOperatorOption = mapOptionFromLookupApi(responseOperatorOption.data.result.content, "operator", "operatorDescription");
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
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
          sosMappingForBiId: this.stateFormData.sosMappingForBiId,
          equipmentModel: this.stateFormData.equipmentModel,
          component: this.stateFormData.component,
          element: this.stateFormData.element,
          rating: this.stateFormData.rating,
          operatorMin: this.stateFormData.operatorMin,
          valueMin: this.stateFormData.valueMin,
          operatorMax: this.stateFormData.operatorMax,
          valueMax: this.stateFormData.valueMax,
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
          sosMappingForBiId: this.stateFormData.sosMappingForBiId,
          equipmentModel: this.stateFormData.equipmentModel,
          component: this.stateFormData.component,
          element: this.stateFormData.element,
          rating: this.stateFormData.rating,
          operatorMin: this.stateFormData.operatorMin,
          valueMin: this.stateFormData.valueMin,
          operatorMax: this.stateFormData.operatorMax,
          valueMax: this.stateFormData.valueMax,
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
      this.stateFormData.sosMappingForBiId = data.sosMappingForBiId;
      this.stateFormData.equipmentModel = data.equipmentModel;
      this.stateFormData.component = data.component;
      this.stateFormData.element = data.element;
      this.stateFormData.rating = data.rating;
      this.stateFormData.operatorMin = data.operatorMin;
      this.stateFormData.valueMin = data.valueMin;
      this.stateFormData.operatorMax = data.operatorMax;
      this.stateFormData.valueMax = data.valueMax;
      this.stateFormData.startDate = data.startDate;
      this.stateFormData.endDate = data.endDate;
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
    setIsEdit(state: boolean) {
      this.stateIsEdit = state
    }
  }
});
