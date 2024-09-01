import { INSERT_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-weight/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-weight/ListItem";
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
} from "@/core/helpers/mapOption";
import { Option } from "@/core/types/misc/Option";
// Look ups
import {
  LOOKUP_API_URL as COMPONENT_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/equipment/component/urls";
import {
  LookupItem as ComponentLookupItem
} from "@/core/types/entities/iron-lake/equipment/component/LookupItem";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialForm = {
  componentWeightId: 0,
  objectType: "",
  weight: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useComponentWeightFormStore = defineStore({
  id: "componentWeightForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateObjectTypeOption: [] as Option[],
      stateEquipmentModelOption: [] as Option[],
      stateEquipmentTypeOption: [] as Option[],
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
    objectTypeOption: (state) => {
      return state.stateObjectTypeOption;
    },
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
    equipmentTypeOption: (state) => {
      return state.stateEquipmentTypeOption;
    },
  },
  actions: {
    async getLookupObjectType() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<ComponentLookupItem>> = await ApiService.get(COMPONENT_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateObjectTypeOption = mapOptionFromLookupApi(response.data.result.content, "component", "componentDescription");
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
          componentWeightId: this.stateFormData.componentWeightId,
          objectType: this.stateFormData.objectType,
          weight: this.stateFormData.weight,
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
          componentWeightId: this.stateFormData.componentWeightId,
          objectType: this.stateFormData.objectType,
          weight: this.stateFormData.weight,
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
    setFormData(data: ListItem) {
      this.stateFormData.componentWeightId = data.componentWeightId;
      this.stateFormData.objectType = data.objectType;
      this.stateFormData.weight = data.weight;
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
