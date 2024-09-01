import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { CRUD_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/status/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/status/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/equipment/status/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption } from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

const initialFilter = {
  systemStatus: "",
  status: "",
  subStatus: "",
  startDate: "",
  endDate: "",
  systemStatusTo: "",
  statusTo: "",
  subStatusTo: "",
  startDateTo: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
}

export const useStatusListStore = defineStore({
  id: "statusList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "status",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateSystemStatusOption: [] as Option[],
      stateStatusOption: [] as Option[],
      stateSubStatusOption: [] as Option[],
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
    systemStatusOption: (state) => {
      return state.stateSystemStatusOption;
    },
    statusOption: (state) => {
      return state.stateStatusOption;
    },
    subStatusOption: (state) => {
      return state.stateSubStatusOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        systemStatus: this.stateFilterData.systemStatus,
        status: this.stateFilterData.status,
        subStatus: this.stateFilterData.subStatus,
        StartDate: this.stateFilterData.startDate ? formatDateForPostData(this.stateFilterData.startDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.endDate ? formatDateForPostData(this.stateFilterData.endDate.toLocaleString()) : "",
        systemStatusTo: this.stateFilterData.systemStatusTo,
        StatusTo: this.stateFilterData.statusTo,
        subStatusTo: this.stateFilterData.subStatusTo,
        StartDateTo: this.stateFilterData.startDateTo ? formatDateForPostData(this.stateFilterData.startDateTo.toLocaleString()) : "",
        EndDateTo: this.stateFilterData.endDateTo ? formatDateForPostData(this.stateFilterData.endDateTo.toLocaleString()) : "",
        Page: this.stateFilterData.page.toString(),
        PageSize: this.stateFilterData.pageSize.toString(),
        Order: this.stateFilterData.order,
        ver: this.stateFilterData.ver
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(CRUD_API_URL, "", new URLSearchParams(params).toString());
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
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.get(LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateSystemStatusOption = mapOption(response.data.result.content.systemStatus)
        this.stateStatusOption = mapOption(response.data.result.content.status)
        this.stateSubStatusOption = mapOption(response.data.result.content.subStatus)
      } catch (error) {
        console.log(error)
      }
    },
    async export() {
      const params = {
        systemStatus: this.stateFilterData.systemStatus,
        status: this.stateFilterData.status,
        subStatus: this.stateFilterData.subStatus,
        StartDate: this.stateFilterData.startDate ? formatDateForPostData(this.stateFilterData.startDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.endDate ? formatDateForPostData(this.stateFilterData.endDate.toLocaleString()) : "",
        systemStatusTo: this.stateFilterData.systemStatusTo,
        StatusTo: this.stateFilterData.statusTo,
        subStatusTo: this.stateFilterData.subStatusTo,
        StartDateTo: this.stateFilterData.startDateTo ? formatDateForPostData(this.stateFilterData.startDateTo.toLocaleString()) : "",
        EndDateTo: this.stateFilterData.endDateTo ? formatDateForPostData(this.stateFilterData.endDateTo.toLocaleString()) : "",
        ver: this.stateFilterData.ver,
        Gmt: new Date().toTimeString().slice(12, 17)
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.getBlob(EXPORT_API_URL, "", new URLSearchParams(params).toString());
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
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData(false);
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200)
    },
    async setSort({ prop, order }) {
      if (!prop && !order) {
        this.stateFilterData.order = "";
      } else {
        const formatedOrder = order == "ascending" ? "asc" : "desc";
        this.stateFilterData.order = `${prop}_${formatedOrder}`;
      }
      this.statePagination.handleCurrentPageChange(1);
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData(false);
    },
    setsystemStatus(value: string) {
      this.stateFilterData.systemStatus = value;
    },
    setsubStatus(value: string) {
      this.stateFilterData.subStatus = value;
    },
    setStatus(value: string) {
      this.stateFilterData.status = value;
    },
    setStartDate(value: string) {
      this.stateFilterData.startDate = value;
    },
    setEndDate(value: string) {
      this.stateFilterData.endDate = value;
    },
    setsystemStatusTo(value: string) {
      this.stateFilterData.systemStatusTo = value;
    },
    setsubStatusTo(value: string) {
      this.stateFilterData.subStatusTo = value;
    },
    setStatusTo(value: string) {
      this.stateFilterData.statusTo = value;
    },
    setStartDateTo(value: string) {
      this.stateFilterData.startDateTo = value;
    },
    setEndDateTo(value: string) {
      this.stateFilterData.endDateTo = value;
    },
    async resetFilter() {
      this.stateFilterData.systemStatus = ""
      this.stateFilterData.status = ""
      this.stateFilterData.subStatus = ""
      this.stateFilterData.startDate = ""
      this.stateFilterData.endDate = ""
      this.stateFilterData.systemStatusTo = ""
      this.stateFilterData.statusTo = ""
      this.stateFilterData.subStatusTo = ""
      this.stateFilterData.startDateTo = ""
      this.stateFilterData.endDateTo = ""
      const checksystemStatus = this.stateLastUsedFilterData.systemStatus !== ""
      const checksubStatus = this.stateLastUsedFilterData.subStatus !== ""
      const checkStatus = this.stateLastUsedFilterData.status !== ""
      const checkStartDateDesc = this.stateLastUsedFilterData.startDate !== ""
      const checkEndDateDesc = this.stateLastUsedFilterData.endDate !== ""
      const checksystemStatusTo = this.stateLastUsedFilterData.systemStatusTo !== ""
      const checksubStatusTo = this.stateLastUsedFilterData.subStatusTo !== ""
      const checkStatusTo = this.stateLastUsedFilterData.statusTo !== ""
      const checkStartDateDescTo = this.stateLastUsedFilterData.startDateTo !== ""
      const checkEndDateDescTo = this.stateLastUsedFilterData.endDateTo !== ""
      if (checksystemStatus || checkStartDateDesc || checkEndDateDesc || checksystemStatusTo || checkStartDateDescTo || checkEndDateDescTo || checksubStatus || checkStatus || checksubStatusTo || checkStatusTo) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        ...initialFilter
      } as FilterData;
      this.stateDisplayData = [] as ListItem[];
      this.statePagination = new PaginationType();
      this.stateLoading = false;
      this.statePaginationLoading = false;
    }
  }
});
