import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  CRUD_URL,
  LOOKUP_API_URL,
  EXPORT_API_URL,
} from "./urls";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/business-partner/brand/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/brand/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/business-partner/brand/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOptionFromLookupApi } from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

const initialFilter = {
  brand: "",
  startDate: "",
  endDate: "",
  brandTo: "",
  startDateTo: "",
  endDateTo: "",
  page: 1,
  pageSize: 10,
  order: "",
  ver: "v1"
}

export const useBrandListStore = defineStore({
  id: "brandList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "brand",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateBrandNameOption: [] as Option[],
      stateBrandDescriptionOption: [] as Option[],
      stateUserGroupOption: [] as Option[],
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
    BrandNameOption: (state) => {
      return state.stateBrandNameOption;
    },
    BrandDescriptionOption: (state) => {
      return state.stateBrandDescriptionOption;
    },
    userGroupOption: (state) => {
      return state.stateUserGroupOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const payload = {
        Brand: this.stateFilterData.brand,
        StartDate: this.stateFilterData.startDate ? formatDateForPostData(this.stateFilterData.startDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.endDate ? formatDateForPostData(this.stateFilterData.endDate.toLocaleString()) : "",
        BrandTo: this.stateFilterData.brandTo,
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
        this.stateBrandNameOption = mapOptionFromLookupApi(response.data.result.content, "brand", "brandDescription")
      } catch (error) {
        console.log(error);
      }
    },
    async export() {
      const params = {
        Brand: this.stateFilterData.brand,
        StartDate: this.stateFilterData.startDate ? formatDateForPostData(this.stateFilterData.startDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.endDate ? formatDateForPostData(this.stateFilterData.endDate.toLocaleString()) : "",
        BrandTo: this.stateFilterData.brandTo,
        StartDateTo: this.stateFilterData.startDateTo ? formatDateForPostData(this.stateFilterData.startDateTo.toLocaleString()) : "",
        EndDateTo: this.stateFilterData.endDateTo ? formatDateForPostData(this.stateFilterData.endDateTo.toLocaleString()) : "",
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
    setBrandName(value: string) {
      this.stateFilterData.brand = value;
    },
    setBrandNameTo(value: string) {
      this.stateFilterData.brandTo = value;
    },
    setStartDate(value: string) {
      this.stateFilterData.startDate = value;
    },
    setStartDateTo(value: string) {
      this.stateFilterData.startDateTo = value;
    },
    setEndDate(value: string) {
      this.stateFilterData.endDate = value;
    },
    setEndDateTo(value: string) {
      this.stateFilterData.endDateTo = value;
    },
    async resetFilter() {
      this.stateFilterData.brand = ""
      this.stateFilterData.startDate = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.brandTo = ""
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDateTo = "";
      const checkBrand = this.stateLastUsedFilterData.brand !== ""
      const checkBrandTo = this.stateLastUsedFilterData.brandTo !== ""
      const checkStartDate = this.stateLastUsedFilterData.startDate !== ""
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== ""
      const checkEndDate = this.stateLastUsedFilterData.endDate !== ""
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== ""
      if (checkBrand || checkBrandTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
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
