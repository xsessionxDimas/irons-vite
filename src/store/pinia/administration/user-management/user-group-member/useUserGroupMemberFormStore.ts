import { INSERT_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/administration/user-management/user-group-member/UpsertItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { Option } from "@/core/types/misc/Option";
import {
  ListItem
} from "@/core/types/entities/administration/user-management/user-group-member/ListItem";

export const useUserGroupMemberFormStore = defineStore({
  id: "userGroupMemberForm",
  state: () => {
    return {
      stateFormData: {
        mdId: 0,
        isDeleted: false
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateStrategyCategoryOption: [] as Option[],
      stateStrategyPackageOption: [] as Option[],
      stateBudgetLifeOption: [] as Option[],
      stateUomOption: [] as Option[],
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
    strategyCategoryCodeOption: (state) => {
      return state.stateStrategyCategoryOption;
    },
    strategyPackageOption: (state) => {
      return state.stateStrategyPackageOption;
    },
    budgetLifeOption: (state) => {
      return state.stateBudgetLifeOption;
    },
    uomOption: (state) => {
      return state.stateUomOption;
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
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${INSERT_API_URL}?${new URLSearchParams(params).toString()}`, this.stateFormData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        // this.stateError = error.response.data.result.message as string;
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
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL}?${new URLSearchParams(params).toString()}`, this.stateFormData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        // this.stateError = error as string;
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    resetState() {
      this.stateFormData = {
        mdId: 0,
        isDeleted: false
      } as UpsertItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    },
    setFormData(data: ListItem) {
      this.stateFormData.mdId = data.UserGroupMemberId || 0;
      this.stateFormData.employeeId = data.EmployeeId || "";
      this.stateFormData.userGroupName = data.UserGroupName || "";
    },
  }
});
