import { DEFAULT_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/administration/user-management/menu/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/administration/user-management/menu/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";

export const useMenuFormStore = defineStore({
  id: "menuForm",
  state: () => {
    return {
      stateFormData: {
        mdMenuId: 0,
        isActive: true,
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
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
  },
  actions: {
    async insertData(createBy: string) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const payloadFormData = {
          mdMenuId: 0,
          menuName: this.stateFormData.menuName,
          pageName: this.stateFormData.pageName,
          // icon: this.stateFormData.icon,
          menuType: this.stateFormData.menuType,
          level: this.stateFormData.level,
          sequence: this.stateFormData.sequence,
          isChild: this.stateFormData.isChild,
          parentId: this.stateFormData.parentId,
          isMenu: this.stateFormData.isMenu,
          section: this.stateFormData.section,
          isActive: true
        }
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${DEFAULT_API_URL}?${new URLSearchParams(params).toString()}`, payloadFormData as AxiosRequestConfig)
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
    async updateData(updateBy: string) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: updateBy,
          ver: "v1"
        };
        const payloadFormData = {
          mdMenuId: this.stateFormData.mdMenuId,
          menuName: this.stateFormData.menuName,
          pageName: this.stateFormData.pageName,
          // icon: this.stateFormData.icon,
          menuType: this.stateFormData.menuType,
          level: this.stateFormData.level,
          sequence: this.stateFormData.sequence,
          isChild: this.stateFormData.isChild,
          parentId: this.stateFormData.parentId,
          isMenu: this.stateFormData.isMenu,
          section: this.stateFormData.section,
          isActive: this.stateFormData.isActive
        }
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL}?${new URLSearchParams(params).toString()}`, payloadFormData as AxiosRequestConfig)
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
    setFormData(data: ListItem) {
      this.stateFormData.mdMenuId = data.MdId || 0;
      this.stateFormData.menuName = data.MenuName || "";
      this.stateFormData.pageName = data.PageName || "";
      // this.stateFormData.icon = data.Icon || "";
      this.stateFormData.menuType = data.MenuType || "";
      this.stateFormData.level = data.Level || 0;
      this.stateFormData.sequence = data.Sequence || 0;
      this.stateFormData.isChild = data.IsChild || false;
      this.stateFormData.parentId = data.ParentId || "";
      this.stateFormData.isMenu = data.IsMenu || false;
      this.stateFormData.section = data.Section || "";
      this.stateFormData.isActive = data.IsActive
    },
    resetState() {
      this.stateFormData = {
        mdMenuId: 0,
        isActive: true,
      } as UpsertItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    }
  }
});
