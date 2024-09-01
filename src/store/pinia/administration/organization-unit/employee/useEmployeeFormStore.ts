import {
  IRONLAKE_CRUD_API_URL,
  IRONLAKE_UPLOAD_API_URL,
  UPDATE_API_URL
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/administration/organization-unit/employee/UpsertItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  UploadItem
} from "@/core/types/entities/administration/organization-unit/employee/UploadItem";
import { ResponseResult } from "@/core/types/misc/ResponseResult";
import {
  UploadResponse
} from "@/core/types/entities/administration/organization-unit/employee/UploadResponse";
import {
  UpsertDraft
} from "@/core/types/entities/administration/organization-unit/employee/UpsertDraft";
import {
  ListDraftItem
} from "@/core/types/entities/administration/organization-unit/employee/ListDraftItem";
import {
  BulkResponse
} from "@/core/types/entities/administration/organization-unit/employee/BulkResponse";

export const useEmployeeFormStore = defineStore({
  id: "employeeForm",
  state: () => {
    return {
      stateFormData: {
        employeeId: "",
        company: "BUMA AU",
        profileUrl: "",
        isActive: true
      } as UpsertItem,
      stateFormDraftData: {
        employeeCode: "",
        profileUrl: "",
        isActive: true,
      } as UpsertDraft,
      stateImageData: {
        request: new File([], ''),
      } as UploadItem,
      stateUploadedImageData: {} as UploadResponse,
      stateSelectedSites: [] as string[],
      stateDraftSelectedSites: [] as string[],
      stateUploadedUrl: '',
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateLoadingMessage: '',
    }
  },
  getters: {
    formData: (state) => {
      return state.stateFormData;
    },
    formDraftData: (state) => {
      return state.stateFormDraftData
    },
    formImageData: (state) => {
      return state.stateImageData;
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
    selectedSites: (state) => {
      return state.stateSelectedSites;
    }
  },
  actions: {
    async insertData(profileUrl: string) {
      try {
        this.stateLoading = true;
        this.stateFormData.profileUrl = profileUrl;
        const params = {
          ver: "v1"
        };
        const wrappedPayload = [
          this.stateFormData,
        ];
        const response: AxiosResponse<SingleApiResponse<BulkResponse>> = await ApiService.post(`${IRONLAKE_CRUD_API_URL}/upsert?${new URLSearchParams(params).toString()}`, wrappedPayload as AxiosRequestConfig)
        if (response.data.title !== "Error") {
          if (response.data.result.isError) {
            this.stateErrors.push(response.data.result.content?.employeeList[0]?.validationReason);
            this.stateIsError = true;
          } else {
            this.stateError = "";
            this.stateIsError = false;
          }
        } else {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        }
      } catch (error: any) {
        this.stateError = error.response.data.result.message as string;
        this.stateErrors.push(error && error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    async updateDraft(profileUrl: string) {
      try {
        this.stateLoading = true;
        this.stateFormDraftData.profileUrl = profileUrl;
        const payload = [
          this.stateFormDraftData,
        ];
        const response: AxiosResponse<SingleApiResponse<BulkResponse>> = await ApiService.post(`${IRONLAKE_CRUD_API_URL}/upsert?ver=v1`, payload as AxiosRequestConfig);
        if (response.data.title !== "Error") {
          if (response.data.result.isError) {
            this.stateErrors.push(response.data.result.content?.employeeList[0]?.validationReason);
            this.stateIsError = true;
          } else {
            this.stateError = "";
            this.stateIsError = false;
          }
        } else {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        }
      } catch (error: any) {
        this.stateErrors.push(error && error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    async deleteDraft(employeeDraftId: number) {
      try {
        this.stateLoading = true;
        const payload = [
          {
            employeeDraftId: employeeDraftId,
          }
        ];
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${IRONLAKE_CRUD_API_URL}/delete_draft?ver=v1`, payload as AxiosRequestConfig);
        if (response.data.title !== "Error") {
          if (response.data.result.isError) {
            this.stateErrors.push("Failed to delete draft");
            this.stateIsError = true;
          } else {
            this.stateError = "";
            this.stateIsError = false;
          }
        } else {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        }
      } catch (error: any) {
        this.stateErrors.push(error && error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    // Delete Bulk Draft Item
    async deleteBulkDraft(bulkArray: { employeeDraftId: number }[]) {
      const params = new URLSearchParams({ ver: "v1" }).toString();
      this.stateLoading = true;
      this.stateLoadingMessage = "Removing Data";

      try {
        const response: AxiosResponse<SingleApiResponse<undefined>> =
          await ApiService.post(
            `${IRONLAKE_CRUD_API_URL}/delete_draft?${params}`,
            bulkArray as AxiosRequestConfig,
          );

        return response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.stateLoading = false;
        this.stateLoadingMessage = "";
      }
    },
    async uploadImage() {
      this.stateLoading
      const formDataPayload = new FormData();
      formDataPayload.append('request', this.stateImageData.request);
      try {
        const response: AxiosResponse<SingleApiResponse<UploadResponse>> = await ApiService.post(`${IRONLAKE_UPLOAD_API_URL}?ver=v1&type=jpeg`, formDataPayload as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateUploadedImageData = response.data.result.content;
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        this.stateErrors.push(error && error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: UpsertItem) {
      this.stateFormData.employeeId = data.employeeId || "";
      this.stateFormData.name = data.name || "";
      this.stateFormData.position = data.position || "";
      this.stateFormData.vendor = data.vendor || "";
      this.stateFormData.supervisor = data.supervisor || "";
      this.stateFormData.company = data.company || "";
      this.stateFormData.email = data.email || "";
      this.stateFormData.isActive = data.isActive || false;
      this.stateFormData.siteName = data.siteName;
      this.stateFormData.employeeCode = data.employeeCode;
    },
    setFormDraft(data: ListDraftItem) {
      this.stateFormDraftData.employeeCode = data.employeeId;
      this.stateFormDraftData.name = data.name;
      this.stateFormDraftData.company = data.company;
      this.stateFormDraftData.email = data.email;
      this.stateFormDraftData.position = data.position;
      this.stateFormDraftData.siteName = data.siteName;
      this.stateFormDraftData.employeeDraftId = data.employeeDraftId;
      this.stateFormDraftData.supervisor = data.superiorName;
      this.stateFormDraftData.profileUrl = data.profileUrl;
    },
    resetState() {
      this.stateFormData = {
        company: "BUMA AU",
        employeeId: "",
        isActive: true
      } as UpsertItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    }
  }
});
