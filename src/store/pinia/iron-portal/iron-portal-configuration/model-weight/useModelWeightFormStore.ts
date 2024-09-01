import { INSERT_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/model-weight/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/model-weight/ListItem";
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
  LOOKUP_API_URL as SITE_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/business-partner/site/urls";
import {
  LookupItem as SiteLookupItem
} from "@/core/types/entities/iron-lake/business-partner/site/LookupItem";
import {
  LOOKUP_TRANSACTION_API_URL as EQUIPMENT_MODEL_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/equipment/equipment-model/urls";
import {
  LookupItem as EquipmentModelLookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-model/LookupItem";
import {
  LOOKUP_API_URL as EQUIPMENT_TYPE_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/equipment/equipment-type/urls";
import {
  LookupItem as EquipmentTypeLookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-type/LookupItem";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialForm = {
  modelWeightId: 0,
  site: "",
  equipmentModel: "",
  weight: "",
  whPerday: "",
  fuelBurn: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useModelWeightFormStore = defineStore({
  id: "modelWeightForm",
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
      stateEquipmentModelOption: [] as Option[],
      stateEquipmentTypeOption: [] as Option[],
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
    siteOption: (state) => {
      return state.stateSiteOption;
    },
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
    equipmentTypeOption: (state) => {
      return state.stateEquipmentTypeOption;
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
        const responseSiteLookup: AxiosResponse<SingleApiResponse<SiteLookupItem>> = await ApiService.get(SITE_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseEquipmentModelLookup: AxiosResponse<SingleApiResponse<EquipmentModelLookupItem>> = await ApiService.get(EQUIPMENT_MODEL_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        // const responseEquipmentTypeLookup: AxiosResponse<SingleApiResponse<EquipmentTypeLookupItem>> = await ApiService.get(EQUIPMENT_TYPE_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateSiteOption = mapOptionWithThreeLabelFromLookupApi(responseSiteLookup.data.result.content, "siteId", "siteCode", "siteDescription");
        this.stateEquipmentModelOption = mapOptionWithThreeLabelFromLookupApi(responseEquipmentModelLookup.data.result.content, "equipmentModel", "brand", "equipmentModelDescription");
        // this.stateEquipmentTypeOption = mapOptionFromLookupApi(responseEquipmentTypeLookup.data.result.content, "whPerday", "equipmentTypeDescription");
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
          modelWeightId: 0,
          site: this.stateFormData.site,
          equipmentModel: this.stateFormData.equipmentModel,
          weight: this.stateFormData.weight,
          whPerday: this.stateFormData.whPerday,
          fuelBurn: this.stateFormData.fuelBurn,
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
          modelWeightId: this.stateFormData.modelWeightId,
          site: this.stateFormData.site,
          equipmentModel: this.stateFormData.equipmentModel,
          weight: this.stateFormData.weight,
          whPerday: this.stateFormData.whPerday,
          fuelBurn: this.stateFormData.fuelBurn,
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
      this.stateFormData.modelWeightId = data.modelWeightId;
      this.stateFormData.site = data.site;
      this.stateFormData.equipmentModel = data.equipmentModel;
      this.stateFormData.weight = data.weight;
      this.stateFormData.whPerday = data.whPerday;
      this.stateFormData.fuelBurn = data.fuelBurn;
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
