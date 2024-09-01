import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { EXPORT_API_URL, IRONLAKE_CRUD_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/business-partner/site/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/site/FilterData";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { formatDateForPostData } from "@/core/helpers/date-format";
import {
  SiteContent
} from "@/core/types/entities/iron-lake/business-partner/site/SiteContent";
import {
  ListDraft
} from "@/core/types/entities/iron-lake/business-partner/site/ListDraft";

const initialFilter = {
  site: "",
  status: "true",
  page: 1,
  pageSize: 20,
}

export const useSiteListStore = defineStore({
  id: "siteList",
  state: () => {
    return {
      stateFilterData: {
        site: "",
        status: "",
        page: 1,
        pageSize: 20,
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "site",
      stateDisplayData: [] as ListItem[],
      stateDraftData: [] as ListDraft[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateSiteOption: [] as Option[],
      stateSearchValue: "" as string,
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
      if (state.stateSearchValue) {
        return state.stateDisplayData.filter((item) => {
          return item.siteId?.toLowerCase().includes(state.stateSearchValue.toLocaleLowerCase()) ||
          item.siteName?.toLowerCase().includes(state.stateSearchValue.toLocaleLowerCase()) ||
          item.siteCode?.toLowerCase().includes(state.stateSearchValue.toLocaleLowerCase()) ||
          item.modifiedBy?.toLowerCase().includes(state.stateSearchValue.toLocaleLowerCase())
        });
      }
      return state.stateDisplayData;
    },
    draftData: (state) => {
      return state.stateDraftData;
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
    siteOption: (state) => {
      return state.stateSiteOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      this.stateLoading = true;
      this.stateLastUsedFilterData = {
        ...this.stateFilterData
      } as FilterData
      const params = {
        ver: "v1"
      };
      const payload = {
        site: this.stateFilterData.site,
        status: this.stateFilterData.status === "" ? null : this.stateFilterData.status === "true" ? true : false,
        page: this.stateFilterData.page,
        pageSize: this.stateFilterData.pageSize,
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<SingleApiResponse<SiteContent>> = await ApiService.post(`${IRONLAKE_CRUD_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
        this.stateDisplayData = response.data.result.content.siteList;
        this.stateDraftData = response.data.result.content.siteDraftList;
        this.setTotalPage(response.data.result.content.totalData);
      } catch (error) {
        console.log(error);
      }
      this.stateLoading = false;
    },
    async template() {
      try {
        const payload = {};
        const response: AxiosResponse<Blob> = await ApiService.postBlob(`${IRONLAKE_CRUD_API_URL}/export/true?ver=v1`, payload as AxiosRequestConfig);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async export() {
      const payload = {
        site: this.stateFilterData.site,
        status: this.stateFilterData.status === "" ? null : this.stateFilterData.status === "true" ? true : false,
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.postBlob(`${IRONLAKE_CRUD_API_URL}/export/false?ver=v1`, payload as AxiosRequestConfig);
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
    async setPageSize(size: number) {
      this.statePaginationLoading = true;
      this.stateFilterData.pageSize = size;
      this.statePagination.totalPageSize = this.stateFilterData.pageSize;
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData(true);
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200)
    },
    async setPage(newPage: number) {
      this.statePaginationLoading = true;
      this.statePagination.handleCurrentPageChange(newPage);
      this.statePagination.totalPageSize = this.stateFilterData.pageSize;
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData(false);
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200)
    },
    async setFilterData(filter: FilterData) {
      this.stateLoading = true;
      this.stateFilterData = filter;
      await this.getData(false);
    },
    setLastActiveFilter(filter: FilterData) {
      this.stateFilterData = filter
    },
    async resetFilter() {
      this.stateFilterData = initialFilter
      this.stateFilterData.page = 1
      this.stateFilterData.pageSize = 20
      const checkPage = this.stateLastUsedFilterData.page !== 0
      const checkPageSize = this.stateLastUsedFilterData.pageSize !== 0
      if (checkPage || checkPageSize) {
        await this.getData()
      }
    },
    setSearchValue(value: string) {
      this.stateSearchValue = value;
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
