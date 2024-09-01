/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  INSERT_API_URL,
  UPDATE_API_URL,
  RATING_LOOKUP_API_URL,
  LOOKUP_ADD_API_URL
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-risk-rating/UpsertItem";
import {
  LookupAddItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-risk-rating/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { Option } from "@/core/types/misc/Option";
import {
  mapOption,
  mapOptionFromLookupApi,
  mapOptionWithThreeLabelFromLookupApi
} from "@/core/helpers/mapOption";
// LOOKUPS
import {
  LookupItem as EquipmentModelLookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-model/LookupItem";
import {
  LOOKUP_API_URL as LOOKUP_EQUIPMENT_MODEL_API_URL
} from "@/store/pinia/iron-lake/equipment/equipment-model/urls";
import {
  LookupItem as ComponentLookupItem
} from "@/core/types/entities/iron-lake/equipment/component/LookupItem";
import {
  LOOKUP_API_URL as LOOKUP_COMPONENT_API_URL
} from "@/store/pinia/iron-lake/equipment/component/urls";
import {
  LookupItem as ComponentTypeLookupItem
} from "@/core/types/entities/iron-lake/equipment/component-type/LookupItem";
import {
  LOOKUP_API_URL as LOOKUP_COMPONENT_TYPE_API_URL
} from "@/store/pinia/iron-lake/equipment/component-type/urls";
import {
  RatingLookup
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-risk-rating/LookupItem";
import {
  LOOKUP_API_URL as SITE_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/business-partner/site/urls";
import {
  LookupItem as SiteLookupItem
} from "@/core/types/entities/iron-lake/business-partner/site/LookupItem";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialForm = {
  componentRiskRatingId: 0,
  equipmentModel: "",
  component: "",
  componentType: "",
  maxRiskRank: "",
  revisedRank: "",
  overallRisk: "",
  failureTiming: "",
  systemImpact: "",
  opsImpact: "",
  supplyRisk: "",
  failureCost: "",
  comments: "",
  site: "",
  oemInterval: "",
  bumaAuTarget: "",
  componentWeight: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

const initialFormLoading = {
  site: false,
  equipmentModel: false,
  component: false,
};

export const useComponentRiskRatingFormStore = defineStore({
  id: "componentRiskRatingForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateIsEdit: false as boolean,
      stateLoading: false,
      stateEquipmentModelOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateComponentTypeOption: [] as Option[],
      stateOverallRiskOption: [] as Option[],
      stateFailureTimingOption: [] as Option[],
      stateSystemImpactOption: [] as Option[],
      stateOpsImpactOption: [] as Option[],
      stateSupplyRiskOption: [] as Option[],
      stateFailureCostOption: [] as Option[],
      stateCommentsOption: [] as Option[],
      stateMaxRiskRankOption: [] as Option[],
      stateRevisedRankOption: [] as Option[],
      stateSiteOption: [] as Option[],
      stateFormLoading: {
        ...initialFormLoading
      },
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
    isEdit: (state) => {
      return state.stateIsEdit;
    },
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption
    },
    componentOption: (state) => {
      return state.stateComponentOption
    },
    componentTypeOption: (state) => {
      return state.stateComponentTypeOption
    },
    overallRiskOption: (state) => {
      return state.stateOverallRiskOption
    },
    failureTimingOption: (state) => {
      return state.stateFailureTimingOption
    },
    systemImpactOption: (state) => {
      return state.stateSystemImpactOption
    },
    opsImpactOption: (state) => {
      return state.stateOpsImpactOption
    },
    supplyRiskOption: (state) => {
      return state.stateSupplyRiskOption
    },
    failureCostOption: (state) => {
      return state.stateFailureCostOption
    },
    commentsOption: (state) => {
      return state.stateCommentsOption
    },
    siteOption: (state) => {
      return state.stateSiteOption
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
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateFormLoading.site = false;
      }
    },
    async getLookupEquipmentModel() {
      this.stateFormLoading.equipmentModel = true;
      const params = {
        site: this.formData.site,
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupAddItem>> = await ApiService.get(LOOKUP_ADD_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentModelOption = mapOptionFromLookupApi(response.data.result.content.equipmentModel, "equipmentModel", "equipmentModelDescription");
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateFormLoading.equipmentModel = false;
      }
    },
    async getLookupComponent() {
      this.stateFormLoading.component = true;
      const params = {
        site: this.formData.site,
        equipmentModel: this.formData.equipmentModel,
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupAddItem>> = await ApiService.get(LOOKUP_ADD_API_URL, "", new URLSearchParams(params).toString());
        this.stateComponentOption = mapOptionFromLookupApi(response.data.result.content.component, "component", "componentDescription");
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateFormLoading.component = false;
      }
    },
    async getLookupComponentType() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<ComponentTypeLookupItem>> = await ApiService.get(LOOKUP_COMPONENT_TYPE_API_URL, "", new URLSearchParams(params).toString());
        this.stateComponentTypeOption = mapOptionFromLookupApi(response.data.result.content, "componentType", "componentTypeDescription");
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async getLookupOverallRisk() {
      const params = {
        ratingParameter: "OVERALL RISK RATING",
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<RatingLookup>> = await ApiService.get(RATING_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateOverallRiskOption = mapOption(response.data.result.content.ratingCode);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupFailureTiming() {
      const params = {
        ratingParameter: "FAILURE TIMING RISK",
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<RatingLookup>> = await ApiService.get(RATING_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateFailureTimingOption = mapOption(response.data.result.content.ratingCode);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupSystemImpact() {
      const params = {
        ratingParameter: "SYSTEM IMPACT RISK",
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<RatingLookup>> = await ApiService.get(RATING_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateSystemImpactOption = mapOption(response.data.result.content.ratingCode);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupOpsImpact() {
      const params = {
        ratingParameter: "OPS IMPACT RISK",
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<RatingLookup>> = await ApiService.get(RATING_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateOpsImpactOption = mapOption(response.data.result.content.ratingCode)
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupSupplyRisk() {
      const params = {
        ratingParameter: "SUPPLY RISK",
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<RatingLookup>> = await ApiService.get(RATING_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateSupplyRiskOption = mapOption(response.data.result.content.ratingCode);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupFailureCost() {
      const params = {
        ratingParameter: "FAILURE COST RISK",
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<RatingLookup>> = await ApiService.get(RATING_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateFailureCostOption = mapOption(response.data.result.content.ratingCode);
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
          componentRiskRatingId: 0,
          equipmentModel: this.stateFormData.equipmentModel,
          component: this.stateFormData.component,
          componentType: this.stateFormData.componentType,
          maxRiskRank: this.stateFormData.maxRiskRank,
          revisedRank: this.stateFormData.revisedRank,
          overallRisk: this.stateFormData.overallRisk,
          failureTiming: this.stateFormData.failureTiming,
          systemImpact: this.stateFormData.systemImpact,
          opsImpact: this.stateFormData.opsImpact,
          supplyRisk: this.stateFormData.supplyRisk,
          failureCost: this.stateFormData.failureCost,
          comments: this.stateFormData.comments,
          site: this.stateFormData.site,
          oemInterval: this.stateFormData.oemInterval,
          bumaAuTarget: this.stateFormData.bumaAuTarget,
          componentWeight: this.stateFormData.componentWeight,
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
      } finally {
        this.stateLoading = false;
      }
    },
    async updateData(updateBy: string) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: updateBy,
          ver: "v1"
        };
        const formData = {
          componentRiskRatingId: this.stateFormData.componentRiskRatingId,
          equipmentModel: this.stateFormData.equipmentModel,
          component: this.stateFormData.component,
          componentType: this.stateFormData.componentType,
          maxRiskRank: this.stateFormData.maxRiskRank,
          revisedRank: this.stateFormData.revisedRank,
          overallRisk: this.stateFormData.overallRisk,
          failureTiming: this.stateFormData.failureTiming,
          systemImpact: this.stateFormData.systemImpact,
          opsImpact: this.stateFormData.opsImpact,
          supplyRisk: this.stateFormData.supplyRisk,
          failureCost: this.stateFormData.failureCost,
          comments: this.stateFormData.comments,
          site: this.stateFormData.site,
          oemInterval: this.stateFormData.oemInterval,
          bumaAuTarget: this.stateFormData.bumaAuTarget,
          componentWeight: this.stateFormData.componentWeight,
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
      } finally {
        this.stateLoading = false;
      }
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: UpsertItem) {
      this.stateFormData.componentRiskRatingId = data.componentRiskRatingId;
      this.stateFormData.equipmentModel = data.equipmentModel;
      this.stateFormData.component = data.component;
      this.stateFormData.componentType = data.componentType;
      this.stateFormData.maxRiskRank = data.maxRiskRank;
      this.stateFormData.revisedRank = data.revisedRank;
      this.stateFormData.overallRisk = data.overallRisk;
      this.stateFormData.failureTiming = data.failureTiming;
      this.stateFormData.systemImpact = data.systemImpact;
      this.stateFormData.opsImpact = data.opsImpact;
      this.stateFormData.supplyRisk = data.supplyRisk;
      this.stateFormData.failureCost = data.failureCost;
      this.stateFormData.comments = data.comments;
      this.stateFormData.site = data.site,
      this.stateFormData.oemInterval = data.oemInterval,
      this.stateFormData.bumaAuTarget = data.bumaAuTarget,
      this.stateFormData.componentWeight = data.componentWeight,
      this.stateFormData.startDate = data.startDate;
      this.stateFormData.endDate = data.endDate;
    },
    setIsEdit(state) {
      this.stateIsEdit = state;
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
