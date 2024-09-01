import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  CRUD_URL,
  LOOKUP_API_URL,
  EXPORT_API_URL,
} from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/parameter/uom/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/uom/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/parameter/uom/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption } from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

export const useUomListStore = defineStore({
  id: "UomList",
  state: () => {
    return {
      stateFilterData: {
        Uom: "",
        StartDate: "",
        EndDate: "",
        UomTo: "",
        StartDateTo: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1",
      } as FilterData,
      stateLastUsedFilterData: {
        Uom: "",
        StartDate: "",
        EndDate: "",
        UomTo: "",
        StartDateTo: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1",
      } as FilterData,
      statePageName: "uom",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateUomOption: [] as Option[],
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
    uomOption: (state) => {
      return state.stateUomOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const payload = {
        Uom: this.stateFilterData.Uom,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate.toLocaleString()) : "",
        UomTo: this.stateFilterData.UomTo,
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(this.stateFilterData.StartDateTo.toLocaleString()) : "",
        EndDateTo: this.stateFilterData.EndDateTo ? formatDateForPostData(this.stateFilterData.EndDateTo.toLocaleString()) : "",
        Page: this.stateFilterData.Page.toString(),
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
        ver: this.stateFilterData.ver
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(CRUD_URL, "", new URLSearchParams(payload).toString());
        this.stateDisplayData = response.data.result.content;
        this.setTotalPage(response.data.result.total || response.data.result["totalData"]);
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
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.get(`${LOOKUP_API_URL}?${new URLSearchParams(params).toString()}`);
        this.stateUomOption = mapOption(response.data.result.content.uom)
      } catch (error) {
        console.log(error);
      }
    },
    async export() {
      const params = {
        Uom: this.stateFilterData.Uom,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate.toLocaleString()) : "",
        UomTo: this.stateFilterData.UomTo,
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(this.stateFilterData.StartDateTo.toLocaleString()) : "",
        EndDateTo: this.stateFilterData.EndDateTo ? formatDateForPostData(this.stateFilterData.EndDateTo.toLocaleString()) : "",
        Page: this.stateFilterData.Page.toString(),
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
        Gmt: new Date().toTimeString().slice(12, 17),
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.getBlob(`${EXPORT_API_URL}?${new URLSearchParams(params).toString()}`);
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
    setUom(value: string) {
      this.stateFilterData.Uom = value
    },
    setStartDate(value: string) {
      this.stateFilterData.StartDate = value
    },
    setEndDate(value: string) {
      this.stateFilterData.EndDate = value
    },
    setUomTo(value: string) {
      this.stateFilterData.UomTo = value
    },
    setStartDateTo(value: string) {
      this.stateFilterData.StartDateTo = value
    },
    setEndDateTo(value: string) {
      this.stateFilterData.EndDateTo = value
    },
    async resetFilter() {
      this.stateFilterData.Uom = "";
      this.stateFilterData.StartDate = "";
      this.stateFilterData.EndDate = "";
      this.stateFilterData.UomTo = "";
      this.stateFilterData.StartDateTo = "";
      this.stateFilterData.EndDateTo = "";
      const CheckUom = this.stateLastUsedFilterData.Uom !== ""
      const CheckStartDate = this.stateLastUsedFilterData.StartDate !== ""
      const CheckEndDate = this.stateLastUsedFilterData.EndDate !== ""
      const CheckUomTo = this.stateLastUsedFilterData.UomTo !== ""
      const CheckStartDateTo = this.stateLastUsedFilterData.StartDateTo !== ""
      const CheckEndDateTo = this.stateLastUsedFilterData.EndDateTo !== ""
      if (CheckUomTo || CheckStartDateTo || CheckEndDateTo || CheckUom || CheckStartDate || CheckEndDate) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        Uom: "",
        StartDate: "",
        EndDate: "",
        UomTo: "",
        StartDateTo: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1",
      } as FilterData;
      this.stateDisplayData = [] as ListItem[];
      this.statePagination = new PaginationType();
      this.stateLoading = false;
      this.statePaginationLoading = false;
    }
  }
});
