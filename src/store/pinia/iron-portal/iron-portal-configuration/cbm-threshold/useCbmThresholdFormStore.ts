import {
  INSERT_API_URL,
  UPDATE_API_URL,
  LOOKUP_UOM_TRANSACTION,
  INSERT_API_URL_SPECIFIC,
  UPDATE_API_URL_SPECIFIC,
  GET_REGISTER_NUMBER_API_URL,
  GET_LOOKUP_API_URL
} from "./urls";
import {
  LOOKUP_ADD_API_URL as COUNTER_READING_LOOKUP_URL
} from "@/store/pinia/iron-portal/iron-portal-transactional/counter-reading/urls"
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem,
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-threshold/UpsertItem";
import {
  LookupRating,
  LookupUom
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-threshold/LookupItem";
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
  mapOption
} from "@/core/helpers/mapOption";
import { Option } from "@/core/types/misc/Option";
import {
  LOOKUP_API_URL as SITE_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/business-partner/site/urls";
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
  LookupItem as SiteLookupItem
} from "@/core/types/entities/iron-lake/business-partner/site/LookupItem";
import {
  LookupItem as EquipmentModelLookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-model/LookupItem";
import {
  LOOKUP_TRANS_API_URL as RATING_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/rating/urls";
import {
  LOOKUP_API_URL as OPERATOR_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/operator/urls";
import {
  LookupItem as OperatorLookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/operator/LookupItem";
import {
  LOOKUP_TRANSACTION_API_URL as PARAMETER_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/type/urls";
import {
  LookupItem as ParameterLookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/type/LookupItem";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialForm = {
  cbmThresholdId: 0,
  cbmType: "",
  site: "",
  equipmentModel: "",
  component: "",
  parameterFrom: "",
  parameterTo: "",
  registerNumber: "",
  severityLevel: "",
  uomFrom: "",
  uomTo: "",
  uomConvertRatio: "",
  isRequiredThreshold: false,
  thresholdList: [],
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useCbmThresholdFormStore = defineStore({
  id: "cbmThresholdForm",
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
      stateComponentOption: [] as Option[],
      stateEquipmentModelOption: [] as Option[],
      stateCbmTypeOption: [] as Option[],
      stateUomOption: [] as Option[],
      stateUomConvertRatioOption: [] as Option[],
      stateRatingOption: [] as Option[],
      stateOperatorOption: [] as Option[],
      stateParameterToOption: [] as Option[],
      stateParameterFromOption: [] as Option[],
      stateIsEdit: false
    }
  },
  getters: {
    isEdit: (state) => {
      return state.stateIsEdit;
    },
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
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
    cbmTypeOption: (state) => {
      return state.stateCbmTypeOption;
    },
    uomOption: (state) => {
      return state.stateUomOption;
    },
    uomConvertRatioOption: (state) => {
      return state.stateUomConvertRatioOption;
    },
    ratingOption: (state) => {
      return state.stateRatingOption;
    },
    operatorOption: (state) => {
      return state.stateOperatorOption;
    },
    parameterToOption: (state) => {
      return state.stateParameterToOption;
    },
    parameterFromOption: (state) => {
      return state.stateParameterFromOption;
    },
  },
  actions: {
    setIsEdit(state: boolean) {
      this.stateIsEdit = state
    },
    async getLookup(isSpecific = false) {
      const params = {
        ver: "v1"
      };
      try {
        const responseEquipmentModelLookup: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(GET_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseComponentOption: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(GET_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseRating: AxiosResponse<SingleApiResponse<LookupRating>> = await ApiService.get(RATING_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseOperatorOption: AxiosResponse<SingleApiResponse<OperatorLookupItem>> = await ApiService.get(OPERATOR_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseUomLookup: AxiosResponse<SingleApiResponse<LookupUom>> = await ApiService.get(LOOKUP_UOM_TRANSACTION, "", new URLSearchParams(params).toString());
        const responseParameterLookup: AxiosResponse<SingleApiResponse<ParameterLookupItem>> = await ApiService.get(PARAMETER_LOOKUP_API_URL, "", new URLSearchParams(params).toString());

        this.stateEquipmentModelOption = mapOptionWithThreeLabelFromLookupApi(responseEquipmentModelLookup.data.result.content.equipmentModel, "equipmentModel", "brand", "equipmentModelDescription");
        this.stateComponentOption = mapOptionFromLookupApi(responseComponentOption.data.result.content.component, "component", "componentDescription");
        this.stateRatingOption = mapOptionFromLookupApi(responseRating.data.result.content, "rating", "ratingDescription");
        this.stateOperatorOption = mapOptionFromLookupApi(responseOperatorOption.data.result.content, "operator", "operatorDescription");
        this.stateUomOption = mapOption(responseUomLookup.data.result.content.uom);
        this.stateParameterToOption = mapOption(responseParameterLookup.data.result.content.parameter);
        this.stateParameterFromOption = mapOption(responseParameterLookup.data.result.content.parameter);
        this.stateCbmTypeOption = mapOption(responseParameterLookup.data.result.content.type);

        if (isSpecific) {
          const responseSiteLookup: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(GET_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
          this.stateSiteOption = mapOptionWithThreeLabelFromLookupApi(responseSiteLookup.data.result.content.site, "siteDescription", "siteId", "siteCode");
        }
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        console.log(error)
      }
    },
    async getLookupEquipmentModelForSpecific() {
      const selectedSite = this.stateSiteOption.find((e) => {
        return e.value == this.stateFormData.site
      })
      const params = {
        ver: "v1",
        siteId: selectedSite?.label.split(" | ")[1] || ""
      };
      try {
        const responseEquipmentModelLookup: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(GET_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentModelOption = mapOptionWithThreeLabelFromLookupApi(responseEquipmentModelLookup.data.result.content.equipmentModel, "equipmentModel", "brand", "equipmentModelDescription");
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        console.log(error)
      }
    },
    async getLookupComponent() {
      const selectedSite = this.stateSiteOption.find((e) => {
        return e.value == this.stateFormData.site
      })
      const params = {
        ver: "v1",
        siteId: selectedSite?.label.split(" | ")[1] || "",
        equipmentModel: this.stateFormData.equipmentModel || ""
      };
      try {
        const responseComponentOption: AxiosResponse<SingleApiResponse<ComponentLookupItem>> = await ApiService.get(GET_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateComponentOption = mapOptionFromLookupApi(responseComponentOption.data.result.content.component, "component", "componentDescription");
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        console.log(error)
      }
    },
    async getLookupParameterTo(cbmType: string) {
      const params = {
        type: cbmType,
        typeTo: cbmType,
        ver: "v1"
      };
      try {
        const responseParameterLookup: AxiosResponse<SingleApiResponse<ParameterLookupItem>> = await ApiService.get(PARAMETER_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateParameterToOption = mapOption(responseParameterLookup.data.result.content.parameter);
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        console.log(error)
      }
    },
    async getRegisterNumber(cbmType: string, parameterTo: string) {
      const params = {
        CbmType: cbmType,
        ParameterTo: parameterTo,
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(GET_REGISTER_NUMBER_API_URL, "", new URLSearchParams(params).toString());
        this.stateFormData.registerNumber = response.data.result.content[0].registerNumber;
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        console.log(error)
      }
    },
    async insertData(createBy: string, isSpecific = false) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const formData: any = {
          cbmThresholdId: 0,
          cbmType: this.stateFormData.cbmType,
          equipmentModel: this.stateFormData.equipmentModel,
          component: this.stateFormData.component,
          parameterFrom: this.stateFormData.parameterFrom,
          parameterTo: this.stateFormData.parameterTo,
          registerNumber: this.stateFormData.registerNumber,
          startDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate))),
          endDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate))),
        };
        if (isSpecific) {
          formData.site = this.stateFormData.site!
        }
        const type2 = [
          "Filter Cut",
          "Mag Plug",
          "Iron Forms CBM"
        ]
        if (!type2.includes(this.stateFormData.cbmType)) {
          formData.severityLevel = this.stateFormData.severityLevel
          formData.uomFrom = this.stateFormData.uomFrom
          formData.uomTo = this.stateFormData.uomTo
          formData.uomConvertRatio = this.stateFormData.uomConvertRatio
          formData.isRequiredThreshold = this.stateFormData.isRequiredThreshold
          formData.thresholdList = this.stateFormData.thresholdList
        }

        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${isSpecific ? INSERT_API_URL_SPECIFIC : INSERT_API_URL}?${new URLSearchParams(params).toString()}`, formData as AxiosRequestConfig)
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
      } finally {
        this.stateLoading = false;
      }
    },
    async updateData(updateBy: string, isSpecific = false) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: updateBy,
          ver: "v1"
        };
        const formData = {
          cbmThresholdId: this.stateFormData.cbmThresholdId,
          site: "",
          cbmType: this.stateFormData.cbmType,
          equipmentModel: this.stateFormData.equipmentModel,
          component: this.stateFormData.component,
          parameterFrom: this.stateFormData.parameterFrom,
          parameterTo: this.stateFormData.parameterTo,
          registerNumber: this.stateFormData.registerNumber,
          severityLevel: this.stateFormData.severityLevel,
          uomFrom: this.stateFormData.uomFrom,
          uomTo: this.stateFormData.uomTo,
          uomConvertRatio: this.stateFormData.uomConvertRatio,
          isRequiredThreshold: this.stateFormData.isRequiredThreshold,
          thresholdList: this.stateFormData.thresholdList,
          startDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate))),
          endDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate))),
        };
        if (isSpecific) {
          formData.site = this.stateFormData.site!
        }
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${isSpecific ? UPDATE_API_URL_SPECIFIC : UPDATE_API_URL}?${new URLSearchParams(params).toString()}`, formData as AxiosRequestConfig)
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
      } finally {
        this.stateLoading = false;
      }
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: UpsertItem) {
      this.stateFormData.cbmThresholdId = data.cbmThresholdId
      this.stateFormData.cbmType = data.cbmType
      this.stateFormData.equipmentModel = data.equipmentModel
      this.stateFormData.component = data.component
      this.stateFormData.parameterFrom = data.parameterFrom
      this.stateFormData.parameterTo = data.parameterTo
      this.stateFormData.registerNumber = data.registerNumber
      this.stateFormData.severityLevel = data.severityLevel
      this.stateFormData.uomFrom = data.uomFrom
      this.stateFormData.uomTo = data.uomTo
      this.stateFormData.uomConvertRatio = data.uomConvertRatio
      this.stateFormData.isRequiredThreshold = data.isRequiredThreshold
      this.stateFormData.thresholdList = data.thresholdList
      this.stateFormData.startDate = data.startDate
      this.stateFormData.endDate = data.endDate
      if (data.site) {
        this.stateFormData.site = data.site
      }
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
