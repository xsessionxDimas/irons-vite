import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GETALL_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/administration/user-management/language/ListItem";
import {
  FilterData
} from "@/core/types/entities/administration/user-management/language/FilterData";
import {
  LookupItem
} from "@/core/types/entities/administration/user-management/language/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { formatDateForPostData } from "@/core/helpers/date-format";
import { mapOption } from "@/core/helpers/mapOption";

export const useLanguageListStore = defineStore({
  id: "languageList",
  state: () => {
    return {
      stateFilterData: {
        Code: "",
        ValueId: "",
        ValueEn: "",
        StartDate: "",
        EndDate: "",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      stateLastUsedFilterData: {
        Code: "",
        ValueId: "",
        ValueEn: "",
        StartDate: "",
        EndDate: "",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      statePageName: "position",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateCodeOption: [] as Option[],
      stateValueIdOption: [] as Option[],
      stateValueEnOption: [] as Option[]
    }
  },
  getters: {
    pageName: (state) => {
      return state.statePageName;
    },
    pagination: (state) => {
      return state.statePagination;
    },
    displayData: (state) => {
      return state.stateDisplayData;
    },
    filterData: (state) => {
      return state.stateFilterData;
    },
    lastUsedFilterData: (state) => {
      return state.stateLastUsedFilterData
    },
    loading: (state) => {
      return state.stateLoading;
    },
    paginationLoading: (state) => {
      return state.statePaginationLoading;
    },
    codeOption: (state) => {
      return state.stateCodeOption;
    },
    valueIdOption: (state) => {
      return state.stateValueIdOption;
    },
    valueEnOption: (state) => {
      return state.stateValueEnOption;
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        Code: this.stateFilterData.Code,
        ValueId: this.stateFilterData.ValueId,
        ValueEn: this.stateFilterData.ValueEn,
        Page: this.stateFilterData.Page.toString(),
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate) : "",
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.post(`${GETALL_API_URL}?ver=v1`, params as AxiosRequestConfig);
        this.stateDisplayData = response.data.result.content;
        this.setTotalPage(response.data.result.total);
        this.stateLastUsedFilterData = {
          ...this.stateFilterData
        } as FilterData
      } catch (error) {
        console.log(error);
      }
      this.stateLoading = false;
    },
    async getLookup() {
      const params = {
        ver: "v1",
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.post(`${LOOKUP_API_URL}?${new URLSearchParams(params).toString()}`, {});
        this.stateCodeOption = mapOption(response.data.result.content.code);
        this.stateValueIdOption = mapOption(response.data.result.content.valueId);
        this.stateValueEnOption = mapOption(response.data.result.content.valueEn);
      } catch (error) {
        console.log(error)
      }
    },
    async export() {
      const params = {
        Gmt: new Date().toTimeString().slice(12, 17),
        Code: this.stateFilterData.Code,
        ValueId: this.stateFilterData.ValueId,
        ValueEn: this.stateFilterData.ValueEn,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate) : "",
        Order: this.stateFilterData.Order
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.postBlob(`${EXPORT_API_URL}?ver=v1`, params as AxiosRequestConfig);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    setTotalPage(totalPage: number) {
      this.pagination.totalPage = totalPage;
      this.pagination.getPaginationStartIndex();
      this.pagination.getPaginationLastIndex();
    },
    async setPage(newPage: number) {
      this.statePaginationLoading = true;
      this.statePagination.handleCurrentPageChange(newPage);
      this.stateFilterData.Page = this.statePagination.currentPage;
      await this.getData(false);
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200)
    },
    async setSort({ prop, order }) {
      if (!prop && !order) {
        this.stateFilterData.Order = "";
      } else {
        const formatedOrder = order == "ascending" ? "asc" : "desc";
        this.stateFilterData.Order = `${prop}_${formatedOrder}`;
      }
      this.statePagination.handleCurrentPageChange(1);
      this.stateFilterData.Page = this.statePagination.currentPage;
      await this.getData(false);
    },
    setCode(value: string) {
      this.stateFilterData.Code = value;
    },
    setValueId(value: string) {
      this.stateFilterData.ValueId = value;
    },
    setValueEn(value: string) {
      this.stateFilterData.ValueEn = value;
    },
    setStartDate(value: string) {
      this.stateFilterData.StartDate = value;
    },
    setEndDate(value: string) {
      this.stateFilterData.EndDate = value;
    },
    async resetFilter() {
      this.stateFilterData.Code = "";
      this.stateFilterData.ValueId = "";
      this.stateFilterData.ValueEn = "";
      this.stateFilterData.StartDate = "";
      this.stateFilterData.EndDate = "";
      const checkCode = this.stateLastUsedFilterData.Code !== "";
      const checkValueId = this.stateLastUsedFilterData.ValueId !== "";
      const checkValueEn = this.stateLastUsedFilterData.ValueEn !== "";
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== null;
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== null;
      if (checkCode || checkValueId || checkValueEn || checkStartDate || checkEndDate) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        Code: "",
        ValueId: "",
        ValueEn: "",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData;
      this.stateDisplayData = [] as ListItem[];
      this.statePagination = new PaginationType();
      this.stateLoading = false;
      this.statePaginationLoading = false;
    }
  }
});
