/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  INSERT_API_URL,
  UPDATE_API_URL,
  LOOKUP_PARAMETER_GROUP_API_URL
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/type/UpsertItem";
import {
  LookupParameterGroup
} from "@/core/types/entities/iron-portal/iron-portal-configuration/type/LookupItem";
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
} from "@/core/helpers/mapOption";
import { Option } from "@/core/types/misc/Option";
import { sortBy } from "lodash";
import { sendErrorEvent } from "@/core/helpers/analytics";


const initialForm = {
  typeId: 0,
  type: "",
  typeDescription: "",
  parameter: "",
  parameterDescription: "",
  parameterGroup: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
  typeParameterGroupId: ""
};

export const useTypeFormStore = defineStore({
  id: "typeForm",
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
      stateParameterGroupOption: [] as Option[],
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
    parameterGroupOption: (state) => {
      return state.stateParameterGroupOption
    }
  },
  actions: {
    async getLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const responseSiteLookup: AxiosResponse<SingleApiResponse<LookupParameterGroup>> = await ApiService.get(LOOKUP_PARAMETER_GROUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateParameterGroupOption = sortBy(mapOption(responseSiteLookup.data.result.content.parameterGroup), [
          (param) => {
            return param.label === 'Others'
          }, // Prioritaskan elemen dengan nama "Others" pada posisi terakhir
          (param) => {
            return param.label.toLowerCase()
          } // Urutan ascending berdasarkan nama
        ])
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
          typeId: 0,
          type: this.stateFormData.type,
          typeDescription: this.stateFormData.typeDescription,
          parameter: this.stateFormData.parameter,
          parameterDescription: this.stateFormData.parameterDescription,
          parameterGroup: this.stateFormData.parameterGroup,
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
          typeId: this.stateFormData.typeId,
          type: this.stateFormData.type,
          typeDescription: this.stateFormData.typeDescription,
          parameter: this.stateFormData.parameter,
          parameterDescription: this.stateFormData.parameterDescription,
          parameterGroup: this.stateFormData.parameterGroup,
          startDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate))),
          endDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate))),
          typeParameterGroupId: this.stateFormData.typeParameterGroupId
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
    setFormData(data: UpsertItem) {
      this.stateFormData.typeId = data.typeId;
      this.stateFormData.type = data.type;
      this.stateFormData.typeDescription = data.typeDescription;
      this.stateFormData.parameter = data.parameter;
      this.stateFormData.parameterDescription = data.parameterDescription;
      this.stateFormData.parameterGroup = data.parameterGroup;
      this.stateFormData.startDate = data.startDate;
      this.stateFormData.endDate = data.endDate;
      this.stateFormData.typeParameterGroupId = data.typeParameterGroupId;
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
