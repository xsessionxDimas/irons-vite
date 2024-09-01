import {
  INSERT_API_URL_SPECIFIC,
  UPDATE_API_URL_GENERAL,
  UPDATE_API_URL_SPECIFIC
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem,
  UpsertItemSpecific,
  UpdateSpecific
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-status/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-status/ListItem";
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
// Look ups
import {
  LOOKUP_TRANSACTION_API_URL as PARAMETER_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/type/urls";
import {
  LookupItem as ParameterLookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/type/LookupItem";
import {
  LOOKUP_TRANSACTION_API_URL as COMPONENT_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/equipment/component/urls";
import {
  LookupItem as ComponentLookupItem
} from "@/core/types/entities/iron-lake/equipment/component/LookupItem";

import {
  LOOKUP_TRANSACTION_API_URL as CBM_GROUP_LOOKUP_TRANSACTION_API_URL
} from "@/store/pinia/iron-lake/parameter/cbm-group/urls";

import {
  LookupItem as CbmGroupLookupItem
} from "@/core/types/entities/iron-lake/parameter/cbm-group/LookupItem";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialForm = {
  cbmStatusId: 0,
  cluster: "",
  sampleCount: "",
  sampleWeight: "",
  cautionLimit: "",
  criticalLimit: "",
  summaryWeight: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};
const initialFormSpecific = {
  cbmStatusId: 0,
  cbmGroup: "",
  component: "",
  parameter: "",
  clusterData: [],
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};
const initialFormUpdateSpecific = {
  cbmStatusId: 0,
  cbmGroup: "",
  component: "",
  parameter: "",
  cluster: "",
  sampleCount: "",
  sampleWeight: "",
  cautionLimit: "",
  criticalLimit: "",
  summaryWeight: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useCbmStatusFormStore = defineStore({
  id: "CbmStatusForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateFormDataSpecific: {
        ...initialFormSpecific
      } as UpsertItemSpecific,
      stateUpdateSpecific: {
        ...initialFormUpdateSpecific
      } as UpdateSpecific,
      stateIsError: false,
      stateError: "",
      stateIsErrorEdit: false,
      stateErrorEdit: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateCbmGroupOption: [] as Option[],
      stateParameterOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateIsEdit: false,
      stateActiveTab: "General",
      stateIsDuplicate: false
    }
  },
  getters: {
    activeTab: (state) => {
      return state.stateActiveTab
    },
    formData: (state) => {
      return state.stateFormData;
    },
    formDataSpecific: (state) => {
      return state.stateFormDataSpecific;
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
    cbmGroupOption: (state) => {
      return state.stateCbmGroupOption;
    },
    parameterOption: (state) => {
      return state.stateParameterOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    isEdit: (state) => {
      return state.stateIsEdit;
    },
    isDuplicate: (state) => {
      return state.stateIsDuplicate;
    },
  },
  actions: {
    setActiveTab(tab: string) {
      this.stateActiveTab = tab;
    },
    async getLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const responseParameterLookup: AxiosResponse<SingleApiResponse<ParameterLookupItem>> = await ApiService.get(PARAMETER_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseComponentOption: AxiosResponse<SingleApiResponse<ComponentLookupItem>> = await ApiService.get(COMPONENT_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseCbmGroupOption: AxiosResponse<SingleApiResponse<CbmGroupLookupItem>> = await ApiService.get(CBM_GROUP_LOOKUP_TRANSACTION_API_URL, "", new URLSearchParams(params).toString());
        this.stateCbmGroupOption = mapOption(responseCbmGroupOption.data.result.content.cbmGroup);
        this.stateParameterOption = mapOption(responseParameterLookup.data.result.content.parameter);
        this.stateComponentOption = mapOptionFromLookupApi(responseComponentOption.data.result.content, "component", "componentDescription");
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
        const formData = this.stateFormDataSpecific.clusterData.map(((item) => {
          return {
            cbmStatusId: 0,
            cbmGroup: this.stateFormDataSpecific.cbmGroup,
            component: this.stateFormDataSpecific.component,
            // parameter: this.stateFormDataSpecific.parameter,
            cluster: item.cluster,
            sampleCount: item.sampleCount,
            sampleWeight: item.sampleWeight,
            cautionLimit: item.cautionLimit,
            criticalLimit: item.criticalLimit,
            // summaryWeight: item.summaryWeight,
            startDate: formatDateForPostData(normalizeDate(new Date(this.stateFormDataSpecific.startDate))),
            endDate: formatDateForPostData(normalizeDate(new Date(this.stateFormDataSpecific.endDate))),
          }
        }))
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${INSERT_API_URL_SPECIFIC}?${new URLSearchParams(params).toString()}`, formData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
        this.setActiveTab('Specific')
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
    async updateData(updateBy: string) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: updateBy,
          ver: "v1"
        };
        const formData = {
          cbmStatusId: this.stateFormData.cbmStatusId,
          cluster: this.stateFormData.cluster,
          sampleCount: this.stateFormData.sampleCount,
          sampleWeight: this.stateFormData.sampleWeight,
          cautionLimit: this.stateFormData.cautionLimit,
          criticalLimit: this.stateFormData.criticalLimit,
          // summaryWeight: this.stateFormData.summaryWeight,
          startDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate))),
          endDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate))),
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL_GENERAL}?${new URLSearchParams(params).toString()}`, formData as AxiosRequestConfig)
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
    async updateDataSpecific(updateBy: string) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: updateBy,
          ver: "v1"
        };
        const formData = {
          cbmStatusId: this.stateUpdateSpecific.cbmStatusId,
          cbmGroup: this.stateUpdateSpecific.cbmGroup,
          component: this.stateUpdateSpecific.component,
          // parameter: this.stateUpdateSpecific.parameter,
          cluster: this.stateUpdateSpecific.cluster,
          sampleCount: this.stateUpdateSpecific.sampleCount,
          sampleWeight: this.stateUpdateSpecific.sampleWeight,
          cautionLimit: this.stateUpdateSpecific.cautionLimit,
          criticalLimit: this.stateUpdateSpecific.criticalLimit,
          // summaryWeight: this.stateUpdateSpecific.summaryWeight,
          startDate: formatDateForPostData(normalizeDate(new Date(this.stateUpdateSpecific.startDate))),
          endDate: formatDateForPostData(normalizeDate(new Date(this.stateUpdateSpecific.endDate))),
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL_SPECIFIC}?${new URLSearchParams(params).toString()}`, formData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
        this.setActiveTab('Specific');
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
      this.stateFormData.cbmStatusId = data.cbmStatusId
      this.stateFormData.cluster = data.cluster
      this.stateFormData.sampleCount = data.sampleCount
      this.stateFormData.sampleWeight = data.sampleWeight
      this.stateFormData.cautionLimit = data.cautionLimit
      this.stateFormData.criticalLimit = data.criticalLimit
      // this.stateFormData.summaryWeight = data.summaryWeight
      this.stateFormData.startDate = data.startDate;
      this.stateFormData.endDate = data.endDate;
    },
    setFormDataUpdateSpecific(data: UpdateSpecific) {
      this.stateUpdateSpecific.cbmStatusId = data.cbmStatusId
      this.stateUpdateSpecific.cbmGroup = data.cbmGroup
      this.stateUpdateSpecific.component = data.component
      // this.stateUpdateSpecific.parameter = data.parameter
      this.stateUpdateSpecific.cluster = data.cluster
      this.stateUpdateSpecific.sampleCount = data.sampleCount
      this.stateUpdateSpecific.sampleWeight = data.sampleWeight
      this.stateUpdateSpecific.cautionLimit = data.cautionLimit
      this.stateUpdateSpecific.criticalLimit = data.criticalLimit
      // this.stateUpdateSpecific.summaryWeight = data.summaryWeight
      this.stateUpdateSpecific.startDate = data.startDate;
      this.stateUpdateSpecific.endDate = data.endDate;
    },
    setFormDataSpecific(data: UpsertItemSpecific) {
      this.stateFormDataSpecific.cbmStatusId = data.cbmStatusId
      this.stateFormDataSpecific.cbmGroup = data.cbmGroup
      this.stateFormDataSpecific.component = data.component
      // this.stateFormDataSpecific.parameter = data.parameter
      this.stateFormDataSpecific.clusterData = [
        ...this.stateFormDataSpecific.clusterData,
        ...data.clusterData
      ]
      this.stateFormDataSpecific.startDate = data.startDate;
      this.stateFormDataSpecific.endDate = data.endDate;
    },
    setFormDataDuplicate(data: UpsertItemSpecific) {
      this.stateFormDataSpecific.cbmStatusId = data.cbmStatusId
      this.stateFormDataSpecific.cbmGroup = data.cbmGroup
      this.stateFormDataSpecific.component = data.component
      this.stateFormDataSpecific.parameter = data.parameter
      switch (data.cluster) {
        case 'First Cluster':
          this.stateFormDataSpecific.clusterData[0] = {
            index: 0,
            cluster: data.cluster,
            sampleCount: data.sampleCount,
            sampleWeight: data?.sampleWeight,
            cautionLimit: data.cautionLimit,
            criticalLimit: data.criticalLimit,
            summaryWeight: data.summaryWeight,
          }
          break;
        case 'Second Cluster':
          this.stateFormDataSpecific.clusterData[1] = {
            index: 1,
            cluster: data.cluster,
            sampleCount: data.sampleCount,
            sampleWeight: data?.sampleWeight,
            cautionLimit: data.cautionLimit,
            criticalLimit: data.criticalLimit,
            summaryWeight: data.summaryWeight,
          }
          break;
        case 'Third Cluster':
          this.stateFormDataSpecific.clusterData[2] = {
            index: 2,
            cluster: data.cluster,
            sampleCount: data.sampleCount,
            sampleWeight: data?.sampleWeight,
            cautionLimit: data.cautionLimit,
            criticalLimit: data.criticalLimit,
            summaryWeight: data.summaryWeight,
          }
          break;
        case 'Fourth Cluster':
          this.stateFormDataSpecific.clusterData[3] = {
            index: 3,
            cluster: data.cluster,
            sampleCount: data.sampleCount,
            sampleWeight: data?.sampleWeight,
            cautionLimit: data.cautionLimit,
            criticalLimit: data.criticalLimit,
            summaryWeight: data.summaryWeight,
          }
          break;
      }
      // this.stateFormDataSpecific.clusterData = [
      //   ...this.stateFormDataSpecific.clusterData,
      //   ...data.clusterData
      // ]
      this.stateFormDataSpecific.startDate = data.startDate;
      this.stateFormDataSpecific.endDate = data.endDate;
      this.stateIsDuplicate = true
    },
    resetState() {
      this.stateFormData = {
        ...initialForm
      } as UpsertItem;
      this.stateFormDataSpecific = {
        ...initialFormSpecific,
        clusterData: []
      } as UpsertItemSpecific;
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
