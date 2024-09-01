/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  GET_MAPPING_API_URL,
  GET_API_URL,
  POST_API_URL,
  GET_LOOKUP_HMOFFSET_API_URL,
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/component-replacement/UpsertItem";
import {
  HmOffsetOption
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/HmOffsetOption";
import { Option } from "@/core/types/misc/Option";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  sendErrorEvent
} from "@/core/helpers/analytics";

const initialParam = {
  site: "",
  model: "",
  equipment: "",
  component: "",
  Page: 1,
  PageSize: 1,
  ver: "v1",
}

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
  transactionCount: 0,
};

type Mapping = {
  site: string
  model: string
  equipment: string
  component: string
}

export const useComponentReplacementStore = defineStore({
  id: "componentReplacement",
  state: () => {
    return {
      stateGetParam: initialParam,
      stateComponentReplacementList: [] as UpsertItem[],
      stateFormEdit: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateLoadingMapping: false,
      stateHmoffsetDefault: 0,
      stateHmOffsetOption: [] as Option[],
    }
  },
  getters: {
    componentReplacementList: (state) => {
      return state.stateComponentReplacementList;
    },
    formEdit: (state) => {
      return state.stateFormEdit;
    },
    loading: (state) => {
      return state.stateLoading;
    },
    loadingMapping: (state) => {
      return state.stateLoadingMapping;
    },
    hmoffsetDefault: (state) => {
      return state.stateHmoffsetDefault;
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
  },
  actions: {
    async getAndSetComponentReplacementMapping(equipment, component) {
      const params = {
        equipment: equipment,
        component: component,
        ver: "v1"
      };
      try {
        this.stateLoadingMapping = true;
        this.stateLoading = true;
        const response: AxiosResponse<any> = await ApiService.get(GET_MAPPING_API_URL, "", new URLSearchParams(params).toString());
        this.setParam(response.data.result.content);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateLoadingMapping = false;
        this.stateLoading = false;
      }
    },
    async getComponentReplacementList() {
      const params = {
        site: this.stateGetParam.site || "",
        model: this.stateGetParam.model || "",
        equipment: this.stateGetParam.equipment || "",
        component: this.stateGetParam.component || "",
        Page: this.stateGetParam.Page.toString(),
        PageSize: this.stateGetParam.PageSize.toString(),
        ver: "v1"
      };
      try {
        this.stateLoading = true;
        const response: AxiosResponse<ApiResponse<UpsertItem>> = await ApiService.get(GET_API_URL, "", new URLSearchParams(params).toString());
        this.stateComponentReplacementList = response.data.result.content;
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateLoading = false;
      }
    },
    async getHmOffset(equipmentValue: string, isEdit: boolean) {
      const params = {
        equipment: equipmentValue,
        ver: "v1"
      };
      try {
        this.stateLoading = true;
        const response: AxiosResponse<SingleApiResponse<HmOffsetOption>> = await ApiService.get(GET_LOOKUP_HMOFFSET_API_URL, "", new URLSearchParams(params).toString());
        this.stateHmoffsetDefault = response.data.result.content.hmoffset || 0;
        if (!isEdit) this.stateFormEdit.frameHours = this.stateHmoffsetDefault;
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateLoading = false;
      }
    },
    async updateData(createBy: string) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const form = {
          componentReplacementId: this.stateFormEdit.componentReplacementId,
          site: this.stateFormEdit.site,
          model: this.stateFormEdit.model,
          equipment: this.stateFormEdit.equipment,
          component: this.stateFormEdit.component,
          componentAssignmentId: this.stateFormEdit.componentAssignmentId,
          replacementDate: formatDateForPostData(normalizeDate(new Date(this.stateFormEdit.replacementDate))),
          replacementSmu: this.stateFormEdit.replacementSmu,
          hmoffset: this.stateFormEdit.hmoffset,
          frameHours: this.stateFormEdit.frameHours,
          transactionCount: this.stateFormEdit.transactionCount,
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
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setParam(param: Mapping) {
      this.stateGetParam.site = param.site;
      this.stateGetParam.model = param.model;
      this.stateGetParam.equipment = param.equipment;
      this.stateGetParam.component = param.component;
    },
    setFormEditFromGetParam() {
      this.stateFormEdit.site = this.stateGetParam.site;
      this.stateFormEdit.model = this.stateGetParam.model;
      this.stateFormEdit.equipment = this.stateGetParam.equipment;
      this.stateFormEdit.component = this.stateGetParam.component;
    },
    setFormEditFromRow(data) {
      this.stateFormEdit.componentReplacementId = data.componentReplacementId;
      this.stateFormEdit.site = data.site;
      this.stateFormEdit.model = data.model;
      this.stateFormEdit.equipment = data.equipment;
      this.stateFormEdit.component = data.component;
      this.stateFormEdit.componentAssignmentId = data.componentAssignmentId;
      this.stateFormEdit.replacementDate = data.replacementDate;
      this.stateFormEdit.replacementSmu = data.replacementSmu;
      this.stateFormEdit.hmoffset = data.hmoffset;
      this.stateFormEdit.frameHours = data.frameHours;
      this.stateFormEdit.transactionCount = data.transactionCount;
    },
    resetParam() {
      this.stateGetParam = {
        ...initialParam
      };
    },
    resetFormEdit() {
      this.stateFormEdit = {
        ...initialForm
      };
    },
    resetList() {
      this.stateComponentReplacementList = [] as UpsertItem[];
    },
    resetErrors() {
      this.stateErrors = [] as string[];
      this.stateIsError = false;
    },
  },
});
