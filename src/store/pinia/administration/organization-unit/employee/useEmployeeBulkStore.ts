import { BULK_API_URL, IRONLAKE_BULK_API_URL, UPLOAD_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  BulkItem
} from "@/core/types/entities/administration/organization-unit/employee/BulkItem";
import {
  ValidatedItem
} from "@/core/types/entities/administration/organization-unit/employee/ValidatedItem";
import PaginationType from "@/core/types/misc/Pagination";
import { some } from "lodash";
import { dynamicSort } from "@/core/helpers/table-sort";
import { SortParam } from "@/core/types/misc/SortParam";
import {
  BulkRequest
} from "@/core/types/entities/administration/organization-unit/employee/BulkRequest";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { ResponseResult } from "@/core/types/misc/ResponseResult";
import {
  BulkResponse,
  EmployeeItem,
} from "@/core/types/entities/administration/organization-unit/employee/BulkResponse";

export const useEmployeeBulkStore = defineStore({
  id: "employeeBulk",
  state: () => {
    return {
      stateBulkPayload: {} as BulkRequest,
      stateBulkErrors: {
        totalItem: 0,
        employeeList: [] as EmployeeItem[],
      },
      stateAlert: {
        show: false,
        variant: "",
        desc: "",
      },
      stateBulkPerformed: false,
      statePagination: new PaginationType(),
      stateValidatedData: [] as ValidatedItem[],
      stateDisplayData: [] as ValidatedItem[],
      stateBulkData: [] as BulkItem[],
      stateIsError: false,
      stateError: "",
      stateLoading: false,
      stateUploadLoading: true,
      stateIsUploaded: false,
      stateIsSort: false,
      stateSortBy: null as string | null,
      stateSortOrder: null as string | null,
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
    alertVariant: (state) => {
      return state.stateAlert.variant;
    },
    alertDesc: (state) => {
      return state.stateAlert.desc;
    },
    loading: (state) => {
      return state.stateLoading;
    },
    uploadLoading: (state) => {
      return state.stateUploadLoading;
    },
    isUploaded: (state) => {
      return state.stateIsUploaded;
    },
    bulkErrors: (state) => {
      return state.stateBulkErrors;
    },
    testLoading: (state) => {
      return state.stateUploadLoading;
    }
  },
  actions: {
    async bulkUpload() {
      this.stateLoading = true;
      const uploadDataPayload = new FormData();
      uploadDataPayload.append('fileUpload', this.stateBulkPayload.fileUpload);
      try {
        const response: AxiosResponse<SingleApiResponse<BulkResponse>> = await ApiService.post(`${IRONLAKE_BULK_API_URL}`, uploadDataPayload as AxiosRequestConfig)
        if (response.data.statusCode == 200) {
          if (!response.data.result.isError) {
            const content = response.data.result.content;
            const totalUploaded = content.totalData;
            const invalidRecord = content.employeeList.filter((item) => {
              return item.isValid === false;
            });
            const totalInvalid = invalidRecord.length;
            const pluralRecord = totalUploaded > 1 ? "records" : "record";
            if (totalInvalid === 0 && totalUploaded === 0) {
              this.stateAlert = {
                show: true,
                variant: "info",
                desc: "No record has been submitted, please check your file",
              }
            } else if (totalInvalid === 0 && totalUploaded > 0) {
              this.stateAlert = {
                show: true,
                variant: "success",
                desc: `${totalUploaded} of ${totalUploaded} ${pluralRecord} submitted successfully`,
              }
            } else if (totalInvalid > 0 && totalUploaded > 0) {
              this.stateAlert = {
                show: true,
                variant: "warning",
                desc: `${totalInvalid} of ${totalUploaded} ${pluralRecord} failed to submit`,
              }
            }
          } else {
            this.stateIsError = true;
            this.stateError = response.data.result.message;
          }
        } else {
          this.stateAlert = {
            show: true,
            variant: "warning",
            desc: response.data.result.message,
          };
          this.stateIsError = response.data.result.isError;
          this.stateError = response.data.result.message;
        }
        this.stateLoading = false;
      } catch (error: any) {
        console.log(error)
        this.stateLoading = false;
        this.stateError = error;
        this.stateIsError = true;
      }
    },
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
        console.log(error);
        this.stateError = error && error.response.data.result.message;
        this.stateIsError = true;
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
          if (response.data.result.content) {
            this.setIsUploadedState(true);
            this.stateValidatedData = response.data.result.content;
            this.setTotalPage(this.stateValidatedData.length);
            this.stateIsError = some(this.stateValidatedData, {
              'isValid': false
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
        this.stateIsError = true;
        this.stateError = error && error.response.data.result.message;
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
      this.stateBulkPayload = {} as BulkRequest;
      this.stateValidatedData = [] as ValidatedItem[];
      this.stateDisplayData = [] as ValidatedItem[];
      this.stateBulkData = [] as BulkItem[];
      this.statePagination = new PaginationType();
      this.stateBulkPerformed = false;
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
