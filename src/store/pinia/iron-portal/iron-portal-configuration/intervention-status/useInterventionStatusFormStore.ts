import {
  INSERT_API_URL,
  UPDATE_API_URL,
  LOOKUP_UOM_TRANSACTION
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/intervention-status/UpsertItem";
import {
  LookupUom
} from "@/core/types/entities/iron-portal/iron-portal-configuration/intervention-status/LookupItem";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/intervention-status/ListItem";
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
  mapOption
} from "@/core/helpers/mapOption";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialForm = {
  interventionStatusId: 0,
  interventionStatus: "",
  interventionStatusDesc: "",
  followUpPriority: "",
  followUpPriorityUom: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useInterventionStatusFormStore = defineStore({
  id: "interventionStatusForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateFollowUpPriorityUomOption: [] as Option[],
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
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
    followUpPriorityUomOption: (state) => {
      return state.stateFollowUpPriorityUomOption;
    },
  },
  actions: {
    setIsEdit(state: boolean) {
      this.stateIsEdit = state
    },
    async getLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const responseFollowUpPriorityUomLookup: AxiosResponse<SingleApiResponse<LookupUom>> = await ApiService.get(LOOKUP_UOM_TRANSACTION, "", new URLSearchParams(params).toString());
        this.stateFollowUpPriorityUomOption = mapOption(responseFollowUpPriorityUomLookup.data.result.content.uom);
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
          interventionStatusId: 0,
          interventionStatus: this.stateFormData.interventionStatus,
          interventionStatusDesc: this.stateFormData.interventionStatusDesc,
          followUpPriority: this.stateFormData.followUpPriority,
          followUpPriorityUom: this.stateFormData.followUpPriorityUom,
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
          interventionStatusId: this.stateFormData.interventionStatusId,
          interventionStatus: this.stateFormData.interventionStatus,
          interventionStatusDesc: this.stateFormData.interventionStatusDesc,
          followUpPriority: this.stateFormData.followUpPriority,
          followUpPriorityUom: this.stateFormData.followUpPriorityUom,
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
    setFormData(data: UpsertItem) {
      this.stateFormData.interventionStatusId = data.interventionStatusId
      this.stateFormData.interventionStatus = data.interventionStatus
      this.stateFormData.interventionStatusDesc = data.interventionStatusDesc
      this.stateFormData.followUpPriority = data.followUpPriority
      this.stateFormData.followUpPriorityUom = data.followUpPriorityUom
      this.stateFormData.startDate = data.startDate
      this.stateFormData.endDate = data.endDate
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
