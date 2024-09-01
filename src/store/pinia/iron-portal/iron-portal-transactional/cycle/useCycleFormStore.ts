/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  INSERT_API_URL,
  UPDATE_API_URL,
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-transactional/cycle/UpsertItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  mapOption,
  mapOptionFromLookupApi,
  mapOptionWithThreeLabelFromLookupApi
} from "@/core/helpers/mapOption";
import { Option } from "@/core/types/misc/Option";
import {
  LOOKUP_TRANSACTION_API_URL as COMPONENT_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/equipment/component/urls";
import {
  LookupItem as ComponentLookupItem
} from "@/core/types/entities/iron-lake/equipment/component/LookupItem";
import {
  LOOKUP_TRANSACTION_API_URL as EQUIPMENT_MODEL_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/equipment/equipment-model/urls";
import {
  LookupItem as EquipmentModelLookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-model/LookupItem";
import {
  LOOKUP_API_URL as SITE_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/business-partner/site/urls";
import {
  LookupItem as SiteLookupItem
} from "@/core/types/entities/iron-lake/business-partner/site/LookupItem";
import {
  LOOKUP_API_URL as EQUIPMENT_NUMBER_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/equipment/equipment-number/urls";
import {
  LookupItem as EquipmentNumberLookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-number/LookupItem";
import {
  sendErrorEvent
} from "@/core/helpers/analytics";

const initialForm = {
  cycleId: 0,
  site: "",
  equipmentModel: "",
  equipmentNumber: "",
  component: "",
  hoCycleTarget: "",
  siteCycleTarget: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useCycleFormStore = defineStore({
  id: "cycleForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateSiteOption: [] as Option[],
      stateModelOption: [] as Option[],
      stateEquipmentOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateIsEdit: false,
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
    siteOption: (state) => {
      return state.stateSiteOption;
    },
    modelOption: (state) => {
      return state.stateModelOption;
    },
    equipmentOption: (state) => {
      return state.stateEquipmentOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    isEdit: (state) => {
      return state.stateIsEdit;
    }
  },
  actions: {
    setIsEdit(state: boolean) {
      this.stateIsEdit = state
    },
    async getLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const responseEquipmentModelLookup: AxiosResponse<SingleApiResponse<EquipmentModelLookupItem>> = await ApiService.get(EQUIPMENT_MODEL_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseComponentOption: AxiosResponse<SingleApiResponse<ComponentLookupItem>> = await ApiService.get(COMPONENT_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseSite: AxiosResponse<SingleApiResponse<SiteLookupItem>> = await ApiService.get(SITE_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseEquipmentNumber: AxiosResponse<SingleApiResponse<EquipmentNumberLookupItem>> = await ApiService.get(EQUIPMENT_NUMBER_LOOKUP_API_URL, "", new URLSearchParams(params).toString());

        this.stateSiteOption = mapOptionWithThreeLabelFromLookupApi(responseSite.data.result.content, "siteId", "siteCode", "siteDescription");
        this.stateComponentOption = mapOptionFromLookupApi(responseComponentOption.data.result.content, "component", "componentDescription");
        this.stateModelOption = mapOptionWithThreeLabelFromLookupApi(responseEquipmentModelLookup.data.result.content, "equipmentModel", "brand", "equipmentModelDescription");
        this.stateEquipmentOption = mapOptionFromLookupApi(responseEquipmentNumber.data.result.content, "equipmentNumber", "equipmentNumberDescription");
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
          cycleId: 0,
          site: this.stateFormData.site,
          equipmentModel: this.stateFormData.equipmentModel,
          equipmentNumber: this.stateFormData.equipmentNumber,
          component: this.stateFormData.component,
          hoCycleTarget: this.stateFormData.hoCycleTarget,
          siteCycleTarget: this.stateFormData.siteCycleTarget,
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
        sendErrorEvent('IRONS', error);
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
          cycleId: this.stateFormData.cycleId,
          site: this.stateFormData.site,
          equipmentModel: this.stateFormData.equipmentModel,
          equipmentNumber: this.stateFormData.equipmentNumber,
          component: this.stateFormData.component,
          hoCycleTarget: this.stateFormData.hoCycleTarget,
          siteCycleTarget: this.stateFormData.siteCycleTarget,
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
      this.stateFormData.cycleId = data.cycleId;
      this.stateFormData.site = data.site,
      this.stateFormData.equipmentModel = data.equipmentModel,
      this.stateFormData.equipmentNumber = data.equipmentNumber,
      this.stateFormData.component = data.component,
      this.stateFormData.hoCycleTarget = data.hoCycleTarget,
      this.stateFormData.siteCycleTarget = data.siteCycleTarget,
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
    }
  }
});
