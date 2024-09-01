import {
  LOOKUP_ADD_API_URL
} from "./urls";
import {
  GET_LOOKUP_HMOFFSET_API_URL,
  POST_API_URL
} from "@/store/pinia/iron-portal/dashboard/pbi-equipment/component-replacement/urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/component-replacement/UpsertItem";
import {
  LookupAddItem,
} from "@/core/types/entities/iron-portal/iron-portal-transactional/counter-reading/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  HmOffsetOption
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/HmOffsetOption";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  mapOptionFromLookupApi,
  mapOptionWithThreeLabelFromLookupApi,
} from "@/core/helpers/mapOption";
import { Option } from "@/core/types/misc/Option";
import {
  sendErrorEvent
} from "@/core/helpers/analytics";

const initialForm = {
  componentReplacementId: 0,
  site: "",
  model: "",
  equipment: "",
  component: "",
  componentAssignmentId: 0,
  replacementDate: "",
  replacementSmu: 0,
  hmoffset: 0,
  frameHours: 0,
};

const initialFormLoading = {
  site: false,
  model: false,
  equipment: false,
  component: false,
};

export const useComponentReplacementFormStore = defineStore({
  id: "componentReplacementForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateFormLoading: {
        ...initialFormLoading
      },
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateSiteOption: [] as Option[],
      stateModelOption: [] as Option[],
      stateEquipmentOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateHmoffsetDefault: 0,
      stateIsEdit: false,
    }
  },
  getters: {
    formData: (state) => {
      return state.stateFormData;
    },
    isEdit: (state) => {
      return state.stateIsEdit;
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
    formLoading: (state) => {
      return state.stateFormLoading;
    },
    hmoffsetDefault: (state) => {
      return state.stateHmoffsetDefault;
    },
  },
  actions: {
    async getHmOffset(equipmentValue: string, isEdit: boolean) {
      const params = {
        equipment: equipmentValue,
        ver: "v1"
      };
      try {
        this.stateLoading = true;
        const response: AxiosResponse<SingleApiResponse<HmOffsetOption>> = await ApiService.get(GET_LOOKUP_HMOFFSET_API_URL, "", new URLSearchParams(params).toString());
        this.stateHmoffsetDefault = response.data.result.content.hmoffset || 0;
        if (!isEdit) this.stateFormData.frameHours = this.stateHmoffsetDefault;
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateLoading = false;
      }
    },
    async getLookupSite() {
      this.stateFormLoading.site = true;
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupAddItem>> = await ApiService.get(LOOKUP_ADD_API_URL, "", new URLSearchParams(params).toString());
        this.stateSiteOption = mapOptionWithThreeLabelFromLookupApi(response.data.result.content.site, "siteId", "siteCode", "siteDescription");
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      this.stateFormLoading.site = false;
    },
    async getLookupModel() {
      this.stateFormLoading.model = true;
      const params = {
        siteId: this.formData.site,
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupAddItem>> = await ApiService.get(LOOKUP_ADD_API_URL, "", new URLSearchParams(params).toString());
        this.stateModelOption = mapOptionFromLookupApi(response.data.result.content.equipmentModel, "equipmentModel", "equipmentModelDescription");
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      this.stateFormLoading.model = false;
    },
    async getLookupEquipment() {
      this.stateFormLoading.equipment = true;
      const params = {
        siteId: this.formData.site,
        equipmentModel: this.formData.model,
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupAddItem>> = await ApiService.get(LOOKUP_ADD_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentOption = mapOptionFromLookupApi(response.data.result.content.equipmentNumber, "equipmentNumber", "equipmentNumberDescription");
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      this.stateFormLoading.equipment = false;
    },
    async getLookupComponent() {
      this.stateFormLoading.component = true;
      const params = {
        siteId: this.formData.site,
        equipmentModel: this.formData.model,
        equipmentNumber: this.formData.equipment,
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupAddItem>> = await ApiService.get(LOOKUP_ADD_API_URL, "", new URLSearchParams(params).toString());
        this.stateComponentOption = mapOptionFromLookupApi(response.data.result.content.component, "componentDescription", "component");
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      this.stateFormLoading.component = false;
    },
    async insertData(createBy: string) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const form = {
          componentReplacementId: this.stateFormData.componentReplacementId,
          site: this.stateFormData.site,
          model: this.stateFormData.model,
          equipment: this.stateFormData.equipment,
          component: this.stateFormData.component,
          componentAssignmentId: this.stateFormData.componentAssignmentId,
          replacementDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.replacementDate))),
          replacementSmu: this.stateFormData.replacementSmu,
          hmoffset: this.stateFormData.hmoffset,
          frameHours: this.stateFormData.frameHours,
          transactionCount: this.stateFormData.transactionCount,
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${POST_API_URL}?${new URLSearchParams(params).toString()}`, form as AxiosRequestConfig)
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
        sendErrorEvent('IRONS', error);
        console.log(error)
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      } finally {
        this.stateLoading = false;
      }
    },
    setIsEdit(value: boolean) {
      this.stateIsEdit = value;
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: UpsertItem, isCopy = false) {
      this.stateFormData.componentReplacementId = isCopy ? 0 : data.componentReplacementId;
      this.stateFormData.site = data.site;
      this.stateFormData.model = data.model;
      this.stateFormData.equipment = data.equipment;
      this.stateFormData.component = data.component;
      this.stateFormData.componentAssignmentId = data.componentAssignmentId;
      this.stateFormData.replacementDate = data.replacementDate;
      this.stateFormData.replacementSmu = data.replacementSmu;
      this.stateFormData.hmoffset = data.hmoffset;
      this.stateFormData.frameHours = data.frameHours;
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
