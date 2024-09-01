import { BULK_API_URL, UPLOAD_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  BulkItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/parameter-object/BulkItem";
import {
  ValidatedItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/parameter-object/ValidatedItem";
import PaginationType from "@/core/types/misc/Pagination";
import { some } from "lodash";
import { dynamicSort } from "@/core/helpers/table-sort";
import { SortParam } from "@/core/types/misc/SortParam";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useParameterObjectBulkStore = defineStore({
  id: "parameterObjectBulk",
  state: () => {
    return {
      statePagination: new PaginationType(),
      stateValidatedData: [] as ValidatedItem[],
      stateDisplayData: [] as ValidatedItem[],
      stateBulkData: [] as BulkItem[],
      stateIsError: false,
      stateError: "",
      stateLoading: false,
      stateUploadLoading: false,
      stateIsUploaded: false,
      stateIsSort: false,
      stateSortBy: null as string | null,
      stateSortOrder: null as string | null
    }
  },
  getters: {
    validatedData: (state) => {
      return state.stateValidatedData;
    },
    displayData: (state) => {
      return state.stateDisplayData;
    },
    pagination: (state) => {
      return state.statePagination;
    },
    bulkData: (state) => {
      return state.stateBulkData;
    },
    error: (state) => {
      return state.stateError;
    },
    isError: (state) => {
      return state.stateIsError;
    },
    loading: (state) => {
      return state.stateLoading;
    },
    uploadLoading: (state) => {
      return state.stateUploadLoading;
    },
    isUploaded: (state) => {
      return state.stateIsUploaded;
    }
  },
  actions: {
    async bulkInsert(userAccount: string) {
      const params = {
        userAccount: userAccount,
        ver: "v1"
      }
      try {
        this.stateLoading = true;
        const response: AxiosResponse<ApiResponse<BulkItem>> = await ApiService.post(`${BULK_API_URL}?${new URLSearchParams(params).toString()}`, this.stateBulkData as AxiosRequestConfig);
        this.stateError = response.data.result.isError ? response.data.result.message : "";
        this.stateIsError = response.data.result.isError;
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
      this.stateLoading = false;
    },
    async upload({ userAccount, excelFile }): Promise<void> {
      const params = {
        userAccount: userAccount,
        ver: "v1"
      }
      const url = `${UPLOAD_API_URL}?${new URLSearchParams(params).toString()}`;
      try {
        this.stateIsError = false;
        this.stateError = "";
        this.stateValidatedData = [];
        this.stateDisplayData = [];
        this.stateUploadLoading = true;
        const response: AxiosResponse<ApiResponse<ValidatedItem>> = await ApiService.postImages(url, excelFile);
        if (response.data.statusCode == 200) {
          if (!response.data.result.isError) {
            this.setIsUploadedState(true);
            this.stateValidatedData = response.data.result.content;
            this.setTotalPage(this.stateValidatedData.length);
            this.stateIsError = some(this.stateValidatedData, {
              'IsValid': false
            });
            this.setPage(1);
          } else {
            this.stateIsError = true;
            this.stateError = response.data.result.message;
          }
        } else {
          this.stateIsError = response.data.result.isError;
          this.stateError = response.data.result.message;
        }
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        console.log(error);
        this.stateIsError = true;
        this.stateError = error.response.data.result.message;
        sendErrorEvent('IRONS', error);
      }
      this.stateUploadLoading = false;
    },
    setTotalPage(totalPage: number) {
      this.pagination.totalPage = totalPage;
    },
    setDisplayData() {
      let duplicate = [...this.stateValidatedData];
      if (this.stateIsSort) duplicate = duplicate.sort(dynamicSort(this.stateSortBy, this.stateSortOrder));
      this.stateDisplayData = duplicate.slice(
        this.statePagination.startPaginationIndex, this.statePagination.endPaginationIndex);
    },
    setPage(newPage: number) {
      this.statePagination.handleCurrentPageChange(newPage);
      this.setDisplayData();
    },
    setSort(param: SortParam) {
      this.stateIsSort = param.prop !== null;
      this.stateSortBy = param.prop;
      this.stateSortOrder = param.order;
      this.setPage(1);
    },
    setBulkData(data: BulkItem[]) {
      this.stateBulkData = data;
    },
    setIsUploadedState(state: boolean): void {
      this.stateIsUploaded = state
    },
    resetState() {
      this.stateValidatedData = [] as ValidatedItem[];
      this.stateDisplayData = [] as ValidatedItem[];
      this.stateBulkData = [] as BulkItem[];
      this.statePagination = new PaginationType();
      this.stateIsError = false;
      this.stateError = "";
      this.stateLoading = false;
      this.stateUploadLoading = false;
      this.stateIsSort = false;
      this.stateSortBy = null as string | null;
      this.stateSortOrder = null as string | null;
    }
  }
});
