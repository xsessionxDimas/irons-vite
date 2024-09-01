import {
  INSERT_API_URL,
  UPDATE_API_URL,
  DELETE_API_URL,
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status/UpsertItem";
import {
  DeleteItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status/DeleteItem";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status/ListItem";
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
} from "@/core/helpers/mapOption";
import { Option } from "@/core/types/misc/Option";
// Look ups
import {
  LOOKUP_API_URL as RATING_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/rating/urls";
import {
  LookupItem as StatusLookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/rating/LookupItem";
import {
  LOOKUP_API_URL as COMPONENT_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/equipment/component/urls";
import {
  LookupItem as ComponentLookupItem
} from "@/core/types/entities/iron-lake/equipment/component/LookupItem";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialForm = {
  componentStatusId: 0,
  component: "",
  sensorData: "",
  oilDataS1: "",
  oilDataS2: "",
  filterCutS1: "",
  filterCutS2: "",
  magPlug: "",
  ironFormsCbm: "",
  componentStatus: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

const initialFormDelete = {
  component: "",
  componentStatus: "",
};

export const useComponentStatusFormStore = defineStore({
  id: "componentStatusForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateFormDeleteData: {
        ...initialFormDelete
      } as DeleteItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateComponentOption: [] as Option[],
      stateSensorDataOption: [] as Option[],
      stateOilDataS1Option: [] as Option[],
      stateOilDataS2Option: [] as Option[],
      stateFilterCutS1Option: [] as Option[],
      stateFilterCutS2Option: [] as Option[],
      stateMagPlugOption: [] as Option[],
      stateIronFormsCbmOption: [] as Option[],
      stateComponentStatusOption: [] as Option[],
    }
  },
  getters: {
    formData: (state) => {
      return state.stateFormData;
    },
    formDeleteData: (state) => {
      return state.stateFormDeleteData;
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
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    sensorDataOption: (state) => {
      return state.stateSensorDataOption;
    },
    oilDataS1Option: (state) => {
      return state.stateOilDataS1Option;
    },
    oilDataS2Option: (state) => {
      return state.stateOilDataS2Option;
    },
    filterCutS1Option: (state) => {
      return state.stateFilterCutS1Option;
    },
    filterCutS2Option: (state) => {
      return state.stateFilterCutS2Option;
    },
    magPlugOption: (state) => {
      return state.stateMagPlugOption;
    },
    ironFormsCbmOption: (state) => {
      return state.stateIronFormsCbmOption;
    },
    componentStatusOption: (state) => {
      return state.stateComponentStatusOption;
    },
  },
  actions: {
    async getLookupComponent() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<ComponentLookupItem>> = await ApiService.get(COMPONENT_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateComponentOption = mapOptionFromLookupApi(response.data.result.content, "component", "componentDescription");
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        console.log(error)
      }
    },
    async getLookupRating() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<StatusLookupItem>> = await ApiService.get(RATING_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateSensorDataOption = mapOption(response.data.result.content.rating);
        this.stateOilDataS1Option = mapOption(response.data.result.content.rating);
        this.stateOilDataS2Option = mapOption(response.data.result.content.rating);
        this.stateFilterCutS1Option = mapOption(response.data.result.content.rating);
        this.stateFilterCutS2Option = mapOption(response.data.result.content.rating);
        this.stateMagPlugOption = mapOption(response.data.result.content.rating);
        this.stateIronFormsCbmOption = mapOption(response.data.result.content.rating);
        this.stateComponentStatusOption = mapOption(response.data.result.content.ratingDescription);
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
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
          componentStatusId: this.stateFormData.componentStatusId,
          component: this.stateFormData.component,
          sensorData: this.stateFormData.sensorData,
          oilDataS1: this.stateFormData.oilDataS1,
          oilDataS2: this.stateFormData.oilDataS2,
          filterCutS1: this.stateFormData.filterCutS1,
          filterCutS2: this.stateFormData.filterCutS2,
          magPlug: this.stateFormData.magPlug,
          ironFormsCbm: this.stateFormData.ironFormsCbm,
          componentStatus: this.stateFormData.componentStatus,
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
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
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
          componentStatusId: this.stateFormData.componentStatusId,
          component: this.stateFormData.component,
          sensorData: this.stateFormData.sensorData,
          oilDataS1: this.stateFormData.oilDataS1,
          oilDataS2: this.stateFormData.oilDataS2,
          filterCutS1: this.stateFormData.filterCutS1,
          filterCutS2: this.stateFormData.filterCutS2,
          magPlug: this.stateFormData.magPlug,
          ironFormsCbm: this.stateFormData.ironFormsCbm,
          componentStatus: this.stateFormData.componentStatus,
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
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        this.stateError = error as string;
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    async deleteData(createBy: string) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const formData = {
          component: this.stateFormDeleteData.component,
          componentStatus: this.stateFormDeleteData.componentStatus,
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${DELETE_API_URL}?${new URLSearchParams(params).toString()}`, formData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
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
      this.stateFormData.componentStatusId = data.componentStatusId;
      this.stateFormData.component = data.component;
      this.stateFormData.sensorData = data.sensorData;
      this.stateFormData.oilDataS1 = data.oilDataS1;
      this.stateFormData.oilDataS2 = data.oilDataS2;
      this.stateFormData.filterCutS1 = data.filterCutS1;
      this.stateFormData.filterCutS2 = data.filterCutS2;
      this.stateFormData.magPlug = data.magPlug;
      this.stateFormData.ironFormsCbm = data.ironFormsCbm;
      this.stateFormData.componentStatus = data.componentStatus;
      this.stateFormData.startDate = data.startDate;
      this.stateFormData.endDate = data.endDate;
    },
    resetState() {
      this.stateFormData = {
        ...initialForm
      } as UpsertItem;
      this.stateFormDeleteData = {
        ...initialFormDelete
      } as DeleteItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    }
  }
});
