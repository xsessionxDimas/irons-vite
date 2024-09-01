import { INSERT_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status-mapping/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status-mapping/ListItem";
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
  mapOptionWithFourLabelFromLookupApi,
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
  LOOKUP_TRANSACTION_API_URL as EQUIPMENT_MODEL_LOOKUP_TRANSACTION_API_URL
} from "@/store/pinia/iron-lake/equipment/equipment-model/urls";
import {
  LookupItem as EquipmentModelLookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-model/LookupItem";
import {
  TRANSACTION_LOOKUP_API_URL as COMPONENT_STATUS_TRANSACTION_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-status/urls";
import {
  LookupItem as ComponentStatusLookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status/LookupItem";
import {
  LOOKUP_TRANSACTION_API_URL as CBM_GROUP_LOOKUP_TRANSACTION_API_URL
} from "@/store/pinia/iron-lake/parameter/cbm-group/urls";
import {
  LookupItem as CbmGroupLookupItem
} from "@/core/types/entities/iron-lake/parameter/cbm-group/LookupItem";
import {
  LOOKUP_API_URL as RATING_LOOKUP_TRANSACTION_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/rating/urls";
import {
  LookupItem as RatingLookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/rating/LookupItem";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialForm = {
  componentStatusMappingId: 0,
  site: "",
  equipmentModel: "",
  componentStatusId: "",
  cbmGroup: "",
  rating: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useComponentStatusMappingFormStore = defineStore({
  id: "componentStatusMappingForm",
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
      stateComponentStatusIdOption: [] as Option[],
      stateCbmGroupOption: [] as Option[],
      stateRatingOption: [] as Option[],
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
    componentStatusIdOption: (state) => {
      return state.stateComponentStatusIdOption;
    },
    cbmGroupOption: (state) => {
      return state.stateCbmGroupOption;
    },
    ratingOption: (state) => {
      return state.stateRatingOption;
    },
  },
  actions: {
    async getLookupComponentStatus() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<ComponentStatusLookupItem>> = await ApiService.get(COMPONENT_STATUS_TRANSACTION_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateComponentStatusIdOption = mapOptionWithFourLabelFromLookupApi(response.data.result.content, "componentStatusId", "objectType", "rating", "group");
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupEquipmentModel() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<EquipmentModelLookupItem>> = await ApiService.get(EQUIPMENT_MODEL_LOOKUP_TRANSACTION_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentModelOption = mapOptionFromLookupApi(response.data.result.content, "equipmentModel", "equipmentModelDescription");
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupSite() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<SiteLookupItem>> = await ApiService.get(SITE_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateSiteOption = mapOptionWithThreeLabelFromLookupApi(response.data.result.content, "siteId", "siteCode", "siteDescription");
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupCbmGroup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<CbmGroupLookupItem>> = await ApiService.get(CBM_GROUP_LOOKUP_TRANSACTION_API_URL, "", new URLSearchParams(params).toString());
        this.stateCbmGroupOption = mapOption(response.data.result.content.cbmGroup);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupRating() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<RatingLookupItem>> = await ApiService.get(RATING_LOOKUP_TRANSACTION_API_URL, "", new URLSearchParams(params).toString());
        this.stateRatingOption = mapOptionFromLookupApi(response.data.result.content, "rating", "ratingDescription");
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
          componentStatusMappingId: this.formData.componentStatusMappingId,
          site: this.formData.site,
          equipmentModel: this.formData.equipmentModel,
          componentStatusId: this.formData.componentStatusId,
          cbmGroup: this.formData.cbmGroup,
          objectType: this.formData.objectType,
          group: this.formData.group,
          rating: this.formData.rating,
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
          componentStatusMappingId: this.formData.componentStatusMappingId,
          site: this.formData.site,
          equipmentModel: this.formData.equipmentModel,
          componentStatusId: this.formData.componentStatusId,
          cbmGroup: this.formData.cbmGroup,
          objectType: this.formData.objectType,
          group: this.formData.group,
          rating: this.formData.rating,
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
      this.stateFormData.componentStatusMappingId = data.componentStatusMappingId;
      this.stateFormData.site = data.site;
      this.stateFormData.equipmentModel = data.equipmentModel;
      this.stateFormData.componentStatusId = data.componentStatusId.toString();
      this.stateFormData.cbmGroup = data.cbmGroup;
      this.stateFormData.objectType = data.objectType;
      this.stateFormData.group = data.group;
      this.stateFormData.rating = data.rating;
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
