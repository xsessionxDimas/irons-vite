import { INSERT_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/management-task-type/UpsertItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialForm = {
  riskManagementTaskTypeId: 0,
  taskTypeCode: "",
  taskTypeDescription: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useManagementTaskTypeFormStore = defineStore({
  id: "managementTaskTypeForm",
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
  },
  actions: {
    async insertData(createBy: string) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const formData = {
          riskManagementTaskTypeId: 0,
          taskTypeCode: this.stateFormData.taskTypeCode,
          taskTypeDescription: this.stateFormData.taskTypeDescription,
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
          riskManagementTaskTypeId: this.stateFormData.riskManagementTaskTypeId,
          taskTypeCode: this.stateFormData.taskTypeCode,
          taskTypeDescription: this.stateFormData.taskTypeDescription,
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
      this.stateFormData.riskManagementTaskTypeId = data.riskManagementTaskTypeId;
      this.stateFormData.taskTypeCode = data.taskTypeCode;
      this.stateFormData.taskTypeDescription = data.taskTypeDescription;
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
