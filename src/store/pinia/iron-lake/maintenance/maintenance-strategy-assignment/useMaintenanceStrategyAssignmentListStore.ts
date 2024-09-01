import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { CRUD_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/maintenance/maintenance-strategy-assignment/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/maintenance/maintenance-strategy-assignment/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/maintenance/maintenance-strategy/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption } from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";
import {
  LOOKUP_API_URL as LOOKUP_MAINTENANCE_STRATEGY_API_URL
} from "./../maintenance-strategy/urls";

export const useMaintenanceStrategyAssignmentListStore = defineStore({
  id: "MaintenanceStrategyAssignmentList",
  state: () => {
    return {
      stateFilterData: {
        MaintenanceStrategyParId: "",
        MaintenanceStrategyChdId: "",
        StartDate: "",
        EndDate: "",
        MaintenanceStrategyParIdTo: "",
        MaintenanceStrategyChdIdTo: "",
        StartDateTo: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1"
      } as FilterData,
      stateLastUsedFilterData: {
        MaintenanceStrategyParId: "",
        MaintenanceStrategyChdId: "",
        StartDate: "",
        EndDate: "",
        MaintenanceStrategyParIdTo: "",
        MaintenanceStrategyChdIdTo: "",
        StartDateTo: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1"
      } as FilterData,
      statePageName: "maintenancestrategyassignment",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateMaintenanceStrategyIDOption: [] as Option[],
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
    maintenanceStrategyIDOption: (state) => {
      return state.stateMaintenanceStrategyIDOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        MaintenanceStrategyParId: this.stateFilterData.MaintenanceStrategyParId,
        MaintenanceStrategyChdId: this.stateFilterData.MaintenanceStrategyChdId,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate.toLocaleString()) : "",
        MaintenanceStrategyParIdTo: this.stateFilterData.MaintenanceStrategyParIdTo,
        MaintenanceStrategyChdIdTo: this.stateFilterData.MaintenanceStrategyChdIdTo,
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
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.get(LOOKUP_MAINTENANCE_STRATEGY_API_URL, "", new URLSearchParams(params).toString());
        this.stateMaintenanceStrategyIDOption = mapOption(response.data.result.content.maintenanceStrategyId)
      } catch (error) {
        console.log(error)
      }
    },
    async export() {
      const params = {
        MaintenanceStrategyParId: this.stateFilterData.MaintenanceStrategyParId,
        MaintenanceStrategyChdId: this.stateFilterData.MaintenanceStrategyChdId,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate.toLocaleString()) : "",
        MaintenanceStrategyParIdTo: this.stateFilterData.MaintenanceStrategyParIdTo,
        MaintenanceStrategyChdIdTo: this.stateFilterData.MaintenanceStrategyChdIdTo,
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(this.stateFilterData.StartDateTo.toLocaleString()) : "",
        EndDateTo: this.stateFilterData.EndDateTo ? formatDateForPostData(this.stateFilterData.EndDateTo.toLocaleString()) : "",
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
    setMaintenanceStrategyParId(value: string) {
      this.stateFilterData.MaintenanceStrategyParId = value;
    },
    setMaintenanceStrategyChdId(value: string) {
      this.stateFilterData.MaintenanceStrategyChdId = value;
    },
    setStartDate(value: string) {
      this.stateFilterData.StartDate = value;
    },
    setEndDate(value: string) {
      this.stateFilterData.EndDate = value;
    },
    setMaintenanceStrategyParIdTo(value: string) {
      this.stateFilterData.MaintenanceStrategyParIdTo = value;
    },
    setMaintenanceStrategyChdIdTo(value: string) {
      this.stateFilterData.MaintenanceStrategyChdIdTo = value;
    },
    setStartDateTo(value: string) {
      this.stateFilterData.StartDateTo = value;
    },
    setEndDateTo(value: string) {
      this.stateFilterData.EndDateTo = value;
    },
    async resetFilter() {
      this.stateFilterData.MaintenanceStrategyChdId = ""
      this.stateFilterData.MaintenanceStrategyParId = ""
      this.stateFilterData.StartDate = ""
      this.stateFilterData.EndDate = ""
      this.stateFilterData.MaintenanceStrategyChdIdTo = ""
      this.stateFilterData.MaintenanceStrategyParIdTo = ""
      this.stateFilterData.StartDateTo = ""
      this.stateFilterData.EndDateTo = ""
      const checkMaintenanceStrategyChild = this.stateLastUsedFilterData.MaintenanceStrategyChdId !== ""
      const checkMaintenanceStrategyParent = this.stateLastUsedFilterData.MaintenanceStrategyParId !== ""
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== ""
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== ""
      const checkMaintenanceStrategyChildTo = this.stateLastUsedFilterData.MaintenanceStrategyChdIdTo !== ""
      const checkMaintenanceStrategyParentTo = this.stateLastUsedFilterData.MaintenanceStrategyParIdTo !== ""
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== ""
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== ""
      if (checkMaintenanceStrategyChild || checkMaintenanceStrategyParent || checkStartDate || checkEndDate || checkMaintenanceStrategyChildTo || checkMaintenanceStrategyParentTo || checkStartDateTo || checkEndDateTo) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        MaintenanceStrategyParId: "",
        MaintenanceStrategyChdId: "",
        StartDate: "",
        EndDate: "",
        MaintenanceStrategyParIdTo: "",
        MaintenanceStrategyChdIdTo: "",
        StartDateTo: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1"
      } as FilterData;
      this.stateDisplayData = [] as ListItem[];
      this.statePagination = new PaginationType();
      this.stateLoading = false;
      this.statePaginationLoading = false;
    }
  }
});
