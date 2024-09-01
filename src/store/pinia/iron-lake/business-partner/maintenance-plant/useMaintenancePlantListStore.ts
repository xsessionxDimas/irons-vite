import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { apiUrls } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/business-partner/maintenance-plant/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/maintenance-plant/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/business-partner/maintenance-plant/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOptionFromLookupApi } from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

const initialFilter = {
  MaintenancePlant: "",
  StartDate: "",
  EndDate: "",
  MaintenancePlantTo: "",
  StartDateTo: "",
  EndDateTo: "",
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: ""
}

export const useMaintenancePlantListStore = defineStore({
  id: "maintenancePlantList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "maintenancePlant",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateMaintenancePlantOption: [] as Option[],
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
    maintenancePlantOption: (state) => {
      return state.stateMaintenancePlantOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        MaintenancePlantId: this.stateFilterData.MaintenancePlant,
        MaintenancePlantIdTo: this.stateFilterData.MaintenancePlantTo,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate.toLocaleString()) : "",
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
        this.stateMaintenancePlantOption = mapOptionFromLookupApi(response.data.result.content, "maintenancePlant", [
          "maintenancePlantCode",
          "maintenancePlantDescription"
        ]);
      } catch (error) {
        console.log(error)
      }
    },
    async export() {
      const params = {
        MaintenancePlantId: this.stateFilterData.MaintenancePlant,
        MaintenancePlantIdTo: this.stateFilterData.MaintenancePlantTo,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate.toLocaleString()) : "",
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(this.stateFilterData.StartDateTo.toLocaleString()) : "",
        EndDateTo: this.stateFilterData.EndDateTo ? formatDateForPostData(this.stateFilterData.EndDateTo.toLocaleString()) : "",
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
    setMaintenancePlant(value: string) {
      this.stateFilterData.MaintenancePlant = value;
    },
    setStartDate(value: string) {
      this.stateFilterData.StartDate = value
    },
    setEndDate(value: string) {
      this.stateFilterData.EndDate = value
    },
    setMaintenancePlantTo(value: string) {
      this.stateFilterData.MaintenancePlantTo = value
    },
    setStartDateTo(value: string) {
      this.stateFilterData.StartDateTo = value
    },
    setEndDateTo(value: string) {
      this.stateFilterData.EndDateTo = value
    },
    async resetFilter() {
      this.stateFilterData.MaintenancePlant = ""
      this.stateFilterData.StartDate = ""
      this.stateFilterData.EndDate = ""
      this.stateFilterData.MaintenancePlantTo = ""
      this.stateFilterData.StartDateTo = ""
      this.stateFilterData.EndDateTo = ""
      const checkMaintenancePlant = this.stateLastUsedFilterData.MaintenancePlant !== ""
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== ""
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== ""
      const checkMaintenancePlantTo = this.stateLastUsedFilterData.MaintenancePlantTo !== ""
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== ""
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== ""
      if (checkMaintenancePlant || checkStartDate || checkEndDate || checkMaintenancePlantTo || checkStartDateTo || checkEndDateTo) {
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
      this.stateMaintenancePlantOption = [] as Option[];
    }
  }
});
