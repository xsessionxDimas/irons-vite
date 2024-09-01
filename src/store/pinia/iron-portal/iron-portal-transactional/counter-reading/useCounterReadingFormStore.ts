import {
  INSERT_API_URL,
  UPDATE_API_URL,
  LOOKUP_ADD_API_URL
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-transactional/counter-reading/UpsertItem";
import {
  LookupAddItem,
} from "@/core/types/entities/iron-portal/iron-portal-transactional/counter-reading/LookupItem";
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
} from "@/core/helpers/mapOption";
import { Option } from "@/core/types/misc/Option";
import {
  sendErrorEvent
} from "@/core/helpers/analytics";

const initialForm = {
  counterReadingId: 0,
  site: "",
  equipmentModel: "",
  equipmentNumber: "",
  component: "",
  smu: "",
  counterReading: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

const initialFormLoading = {
  site: false,
  equipmentModel: false,
  equipmentNumber: false,
  component: false,
};

export const useCounterReadingFormStore = defineStore({
  id: "counterReadingForm",
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
      stateEquipmentModelOption: [] as Option[],
      stateEquipmentNumberOption: [] as Option[],
      stateComponentOption: [] as Option[],
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
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
    equipmentNumberOption: (state) => {
      return state.stateEquipmentNumberOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    formLoading: (state) => {
      return state.stateFormLoading;
    },
  },
  actions: {
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
    async getLookupEquipmentModel() {
      this.stateFormLoading.equipmentModel = true;
      const params = {
        siteId: this.formData.site,
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupAddItem>> = await ApiService.get(LOOKUP_ADD_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentModelOption = mapOptionFromLookupApi(response.data.result.content.equipmentModel, "equipmentModel", "equipmentModelDescription");
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      this.stateFormLoading.equipmentModel = false;
    },
    async getLookupEquipmentNumber() {
      this.stateFormLoading.equipmentNumber = true;
      const params = {
        siteId: this.formData.site,
        equipmentModel: this.formData.equipmentModel,
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupAddItem>> = await ApiService.get(LOOKUP_ADD_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentNumberOption = mapOptionFromLookupApi(response.data.result.content.equipmentNumber, "equipmentNumber", "equipmentNumberDescription");
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      this.stateFormLoading.equipmentNumber = false;
    },
    async getLookupComponent() {
      this.stateFormLoading.component = true;
      const params = {
        siteId: this.formData.site,
        equipmentModel: this.formData.equipmentModel,
        equipmentNumber: this.formData.equipmentNumber,
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupAddItem>> = await ApiService.get(LOOKUP_ADD_API_URL, "", new URLSearchParams(params).toString());
        this.stateComponentOption = mapOptionFromLookupApi(response.data.result.content.component, "component", "componentDescription");
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
        const formData = {
          counterReadingId: 0,
          site: this.stateFormData.site,
          equipmentModel: this.stateFormData.equipmentModel,
          equipmentNumber: this.stateFormData.equipmentNumber,
          component: this.stateFormData.component,
          smu: this.stateFormData.smu,
          counterReading: this.stateFormData.counterReading,
          startDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate))),
          endDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate))),
          // timeCounterReading: this.stateFormData.timeCounterReading.substring(0, this.stateFormData.timeCounterReading.length - 2) + "00",
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
          counterReadingId: this.stateFormData.counterReadingId,
          site: this.stateFormData.site,
          equipmentModel: this.stateFormData.equipmentModel,
          equipmentNumber: this.stateFormData.equipmentNumber,
          component: this.stateFormData.component,
          smu: this.stateFormData.smu,
          counterReading: this.stateFormData.counterReading,
          startDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate))),
          endDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate))),
          // timeCounterReading: this.stateFormData.timeCounterReading.substring(0, this.stateFormData.timeCounterReading.length - 2) + "00",
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
    setIsEdit(value: boolean) {
      this.stateIsEdit = value;
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: UpsertItem) {
      this.stateFormData.counterReadingId = data.counterReadingId;
      this.stateFormData.site = data.site;
      this.stateFormData.equipmentModel = data.equipmentModel;
      this.stateFormData.equipmentNumber = data.equipmentNumber;
      this.stateFormData.component = data.component;
      this.stateFormData.smu = data.smu;
      this.stateFormData.counterReading = data.counterReading;
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
