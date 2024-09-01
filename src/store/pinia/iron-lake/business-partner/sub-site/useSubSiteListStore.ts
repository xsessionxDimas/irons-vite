import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { apiUrls } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/business-partner/sub-site/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/sub-site/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/business-partner/sub-site/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption } from "@/core/helpers/mapOption";

export const useSubSiteListStore = defineStore({
  id: "subSiteList",
  state: () => {
    return {
      stateFilterData: {
        SubSite: "",
        SubSiteDescription: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      stateLastUsedFilterData: {
        SubSite: "",
        SubSiteDescription: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      statePageName: "subSite",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateSubSiteOption: [] as Option[],
      stateSubSiteDescOption: [] as Option[]
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
    subSiteOption: (state) => {
      return state.stateSubSiteOption;
    },
    subSiteDescOption: (state) => {
      return state.stateSubSiteDescOption;
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        SubSite: this.stateFilterData.SubSite,
        SubSiteDescription: this.stateFilterData.SubSiteDescription,
        Page: this.stateFilterData.Page.toString(),
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
        ver: this.stateFilterData.ver
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(apiUrls.getList, "", new URLSearchParams(params).toString());
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
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.get(apiUrls.getLookup, "", new URLSearchParams(params).toString());
        this.stateSubSiteOption = mapOption(response.data.result.content.subSite);
        this.stateSubSiteDescOption = mapOption(response.data.result.content.subSiteDescription);
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
        const response: AxiosResponse<Blob> = await ApiService.getBlob(apiUrls.exportData, "", new URLSearchParams(params).toString());
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
    setSubsite(value: string) {
      this.stateFilterData.SubSite = value;
    },
    setSubsiteDescription(value: string) {
      this.stateFilterData.SubSiteDescription = value;
    },
    async resetFilter() {
      this.stateFilterData.SubSite = ""
      this.stateFilterData.SubSiteDescription = ""
      const checkSubSite = this.stateLastUsedFilterData.SubSite !== ""
      const checkSubSiteDesc = this.stateLastUsedFilterData.SubSiteDescription !== ""
      if (checkSubSite || checkSubSiteDesc) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        SubSite: "",
        SubSiteDescription: "",
        ver: "v1",
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
