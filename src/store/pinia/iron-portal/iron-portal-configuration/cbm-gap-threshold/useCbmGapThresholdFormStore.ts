import { INSERT_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-gap-threshold/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-gap-threshold/ListItem";
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
  mapOptionWithThreeLabelFromLookupApi
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
  LOOKUP_TRANSACTION_API_URL as COMPONENT_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/equipment/component/urls";
import {
  LookupItem as ComponentLookupItem
} from "@/core/types/entities/iron-lake/equipment/component/LookupItem";

import {
  LOOKUP_TRANSACTION_API_URL as CBM_LOOKUP_API_URL
} from '@/store/pinia/iron-portal/iron-portal-configuration/type/urls'

import {
  LookupItem as CbmLookupItem
} from '@/core/types/entities/iron-portal/iron-portal-configuration/type/LookupItem'
import {
  sendErrorEvent
} from "@/core/helpers/analytics";

const initialForm = {
  cbmComplianceGapThresholdId: 0,
  cbmType: "",
  equipmentModel: "",
  component: "",
  valueThreshold: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useCbmGapThresholdFormStore = defineStore({
  id: "CbmGapThresholdForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateIsErrorEdit: false,
      stateErrorEdit: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateCbmTypeOption: [] as Option[],
      stateEquipmentModelOption: [] as Option[],
      stateComponentOption: [] as Option[],
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
    cbmTypeOption: (state) => {
      return state.stateCbmTypeOption;
    },
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
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
        const responseCbmTypeOption: AxiosResponse<SingleApiResponse<CbmLookupItem>> = await ApiService.get(CBM_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentModelOption = mapOptionWithThreeLabelFromLookupApi(responseEquipmentModelLookup.data.result.content, "equipmentModel", "brand", "equipmentModelDescription");
        this.stateComponentOption = mapOptionFromLookupApi(responseComponentOption.data.result.content, "component", "componentDescription");
        this.stateCbmTypeOption = mapOptionFromLookupApi(responseCbmTypeOption.data.result.content, "type", "typeDescription");
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
          cbmComplianceGapThresholdId: this.stateFormData.cbmComplianceGapThresholdId,
          cbmType: this.stateFormData.cbmType,
          equipmentModel: this.stateFormData.equipmentModel,
          component: this.stateFormData.component,
          valueThreshold: this.stateFormData.valueThreshold,
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
          cbmComplianceGapThresholdId: this.stateFormData.cbmComplianceGapThresholdId,
          cbmType: this.stateFormData.cbmType,
          equipmentModel: this.stateFormData.equipmentModel,
          component: this.stateFormData.component,
          valueThreshold: this.stateFormData.valueThreshold,
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
        sendErrorEvent('IRONS', error);
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
    setFormData(data: UpsertItem) {
      this.stateFormData.cbmComplianceGapThresholdId = data.cbmComplianceGapThresholdId,
      this.stateFormData.cbmType = data.cbmType,
      this.stateFormData.equipmentModel = data.equipmentModel,
      this.stateFormData.component = data.component,
      this.stateFormData.valueThreshold = data.valueThreshold,
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
