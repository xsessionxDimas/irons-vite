import { CRUD_API_URL, UPDATE_API_URL } from "./urls";
import {
  LOOKUP_API_URL as SITE_LOOKUP_API_URL
} from "../../../iron-lake/business-partner/site/urls"
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/administration/user-management/user-group/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/administration/user-management/user-group/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { Option } from "@/core/types/misc/Option";
import { mapOptionFromLookupApi } from "@/core/helpers/mapOption";

const initialForm = {
  userGroupId: 0,
  groupName: "",
  groupDescription: "",
  site: "",
  isDeleted: false,
};

export const useUserGroupFormStore = defineStore({
  id: "userGroupForm",
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
    }
  },
  actions: {
    async getSiteLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(SITE_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateSiteOption = mapOptionFromLookupApi(response.data.result.content, "siteId", "siteDescription");
      } catch (error) {
        console.log(error);
      }
    },
    async insertData(createBy: string) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${CRUD_API_URL}?${new URLSearchParams(params).toString()}`, this.stateFormData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    async updateData(updateBy: string, isDelete = false) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: updateBy,
          ver: "v1"
        };
        if (isDelete) {
          this.stateFormData.isDeleted = true;
        }
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL}?${new URLSearchParams(params).toString()}`, this.stateFormData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
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
      this.stateFormData.userGroupId = data.UserGroupId || 0;
      this.stateFormData.groupName = data.GroupName || "";
      this.stateFormData.groupDescription = data.GroupDescription || "";
      this.stateFormData.site = data.Site || "";
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
