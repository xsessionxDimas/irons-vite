import { INSERT_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-area-mapping/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-area-mapping/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  mapAllOptionsAsOneLabelAndValue,
  mapOption,
} from "@/core/helpers/mapOption";
import { Option } from "@/core/types/misc/Option";
// Look ups
import {
  LOOKUP_TRANSACTION_API_URL as CBM_MAPPING_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-mapping/urls";
import {
  LookupItem as CbmMappingLookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-mapping/LookupItem";
import {
  LOOKUP_API_URL as AREA_LOOKUP_TRANSACTION_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/area/urls";
import {
  LookupItem as AreaLookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/area/LookupItem";
import {
  sendErrorEvent
} from "@/core/helpers/analytics";

const initialForm = {
  cbmAreaMappingId: 0,
  cbmMapping: "",
  equipmentModel: "",
  objectType: "",
  cbmGroup: "",
  area: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useCbmAreaMappingFormStore = defineStore({
  id: "cbmAreaMappingForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateCbmMappingOption: [] as Option[],
      stateAreaOption: [] as Option[],
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
    cbmMappingOption: (state) => {
      return state.stateCbmMappingOption;
    },
    areaOption: (state) => {
      return state.stateAreaOption;
    },
  },
  actions: {
    async getLookupCbmMapping() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<CbmMappingLookupItem>> = await ApiService.get(CBM_MAPPING_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateCbmMappingOption = mapAllOptionsAsOneLabelAndValue(response.data.result.content);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupArea() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<AreaLookupItem>> = await ApiService.get(AREA_LOOKUP_TRANSACTION_API_URL, "", new URLSearchParams(params).toString());
        this.stateAreaOption = mapOption(response.data.result.content.area);
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
          cbmAreaMappingId: 0,
          equipmentModel: this.stateFormData.equipmentModel,
          objectType: this.stateFormData.objectType,
          cbmGroup: this.stateFormData.cbmGroup,
          area: this.stateFormData.area,
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
          cbmAreaMappingId: this.stateFormData.cbmAreaMappingId,
          equipmentModel: this.stateFormData.equipmentModel,
          objectType: this.stateFormData.objectType,
          cbmGroup: this.stateFormData.cbmGroup,
          area: this.stateFormData.area,
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
    setFormData(data: ListItem) {
      this.stateFormData.cbmAreaMappingId = data.CbmAreaMappingId;
      this.stateFormData.cbmMapping = `${data.EquipmentModel} | ${data.ObjectType} | ${data.CbmGroup}`;
      this.stateFormData.equipmentModel = data.EquipmentModel;
      this.stateFormData.objectType = data.ObjectType;
      this.stateFormData.cbmGroup = data.CbmGroup;
      this.stateFormData.area = data.Area;
      this.stateFormData.startDate = data.StartDate;
      this.stateFormData.endDate = data.EndDate;
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
