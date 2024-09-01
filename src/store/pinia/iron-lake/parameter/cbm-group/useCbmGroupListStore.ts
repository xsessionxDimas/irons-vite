import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  CRUD_API_URL,
  LOOKUP_API_URL,
  EXPORT_API_URL
} from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/parameter/cbm-group/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/cbm-group/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/parameter/cbm-group/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  mapOption,
} from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

const initialFilter = {
  CbmGroup: "",
  CbmGroupTo: "",
  StartDateFrom: "",
  StartDateTo: "",
  EndDateFrom: "",
  EndDateTo: "",
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: ""
};

export const useCbmGroupListStore = defineStore({
  id: "cbmgroup",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "cbmgroup",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      // Lookup
      stateStartDateOption: [] as Option[],
      stateEndDateOption: [] as Option[],
      stateCbmGroupOption: [] as Option[],
      // Options in form
      stateCbmGroupFormOption: [] as Option[],
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
    startDateOption: (state) => {
      return state.stateStartDateOption;
    },
    endDateOption: (state) => {
      return state.stateEndDateOption;
    },
    CbmGroupOption: (state) => {
      return state.stateCbmGroupOption;
    },
    CbmGroupFormOption: (state) => {
      return state.stateCbmGroupFormOption;
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        CbmGroup: this.stateFilterData.CbmGroup,
        CbmGroupTo: this.stateFilterData.CbmGroupTo,
        StartDateFrom: this.stateFilterData.StartDateFrom ? formatDateForPostData(this.stateFilterData.StartDateFrom) : "",
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(this.stateFilterData.StartDateTo) : "",
        EndDateFrom: this.stateFilterData.EndDateFrom ? formatDateForPostData(this.stateFilterData.EndDateFrom) : "",
        EndDateTo: this.stateFilterData.EndDateTo ? formatDateForPostData(this.stateFilterData.EndDateTo) : "",
        Page: this.stateFilterData.Page.toString(),
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
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
        this.stateCbmGroupOption = mapOption(response.data.result.content.cbmGroup);
        this.stateStartDateOption = mapOption(response.data.result.content.startDate);
        this.stateEndDateOption = mapOption(response.data.result.content.endDate);
      } catch (error) {
        console.log(error)
      }
    },
    async export() {
      const params = {
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
    setCbmGroup(value: string) {
      this.stateFilterData.CbmGroup = value;
    },
    setCbmGroupTo(value: string) {
      this.stateFilterData.CbmGroupTo = value;
    },
    setStartDateFrom(value: string) {
      this.stateFilterData.StartDateFrom = value;
    },
    setStartDateTo(value: string) {
      this.stateFilterData.StartDateTo = value;
    },
    setEndDateFrom(value: string) {
      this.stateFilterData.EndDateFrom = value;
    },
    setEndDateTo(value: string) {
      this.stateFilterData.EndDateTo = value;
    },
    async resetFilter() {
      this.stateFilterData.CbmGroup = ""
      this.stateFilterData.CbmGroupTo = ""
      this.stateFilterData.StartDateFrom = ""
      this.stateFilterData.StartDateTo = ""
      this.stateFilterData.EndDateFrom = ""
      this.stateFilterData.EndDateTo = ""
      const checkCbmGroup = this.stateLastUsedFilterData.CbmGroup !== ""
      const checkCbmGroupTo = this.stateLastUsedFilterData.CbmGroupTo !== ""
      const checkStartDate = this.stateLastUsedFilterData.StartDateFrom !== ""
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== ""
      const checkEndDate = this.stateLastUsedFilterData.EndDateFrom !== ""
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== ""
      if (checkCbmGroup || checkCbmGroupTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
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
