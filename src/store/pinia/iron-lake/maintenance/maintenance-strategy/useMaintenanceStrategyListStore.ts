import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  CRUD_API_URL,
  LOOKUP_API_URL,
  EXPORT_API_URL,
} from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/maintenance/maintenance-strategy/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/maintenance/maintenance-strategy/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/maintenance/maintenance-strategy/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption } from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";
import {
  LOOKUP_API_URL as LOOKUP_UOM_API_URL
} from "../../parameter/uom/urls";

export const useMaintenanceStrategyListStore = defineStore({
  id: "MaintenanceStrategyList",
  state: () => {
    return {
      stateFilterData: {
        MaintenanceStrategyId: "",
        StrategyCategory: "",
        StrategyPackage: "",
        BudgetLife: "",
        Uom: "",
        StartDate: "",
        EndDate: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1"
      } as FilterData,
      stateLastUsedFilterData: {
        MaintenanceStrategyId: "",
        StrategyCategory: "",
        StrategyPackage: "",
        BudgetLife: "",
        Uom: "",
        StartDate: "",
        EndDate: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1"
      } as FilterData,
      statePageName: "maintenancestrategy",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateStrategyCategoryOption: [] as Option[],
      stateStrategyPackageOption: [] as Option[],
      stateBudgetLifeOption: [] as Option[],
      stateUomOption: [] as Option[],
      stateMaintenanceStrategyIdOption: [] as Option[]
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
    strategyCategoryCodeOption: (state) => {
      return state.stateStrategyCategoryOption;
    },
    strategyPackageOption: (state) => {
      return state.stateStrategyPackageOption;
    },
    budgetLifeOption: (state) => {
      return state.stateBudgetLifeOption;
    },
    uomOption: (state) => {
      return state.stateUomOption;
    },
    maintenanceStrategyIdOption: (state) => {
      return state.stateMaintenanceStrategyIdOption
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        MaintenanceStrategyId: this.stateFilterData.MaintenanceStrategyId,
        StrategyCategory: this.stateFilterData.StrategyCategory,
        StrategyPackage: this.stateFilterData.StrategyPackage,
        BudgetLife: this.stateFilterData.BudgetLife,
        Uom: this.stateFilterData.Uom,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate.toLocaleString()) : "",
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
    async getUomLookup() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_UOM_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateUomOption = mapOption(response.data.result.content.uom)
      } catch (error) {
        console.log(error);
      }
    },
    async getLookup() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.get(LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateStrategyCategoryOption = mapOption(response.data.result.content.strategyCategory)
        this.stateStrategyPackageOption = mapOption(response.data.result.content.strategyPackage)
        this.stateBudgetLifeOption = mapOption(response.data.result.content.budgetLife)
        this.stateMaintenanceStrategyIdOption = mapOption(response.data.result.content.maintenanceStrategyId)
        // this.stateUomOption = mapOption(response.data.result.content.uom)
      } catch (error) {
        console.log(error)
      }
    },
    async export() {
      const params = {
        MaintenanceStrategyId: this.stateFilterData.MaintenanceStrategyId,
        StrategyCategory: this.stateFilterData.StrategyCategory,
        StrategyPackage: this.stateFilterData.StrategyPackage,
        BudgetLife: this.stateFilterData.BudgetLife,
        Uom: this.stateFilterData.Uom,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate.toLocaleString()) : "",
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
    setStrategyCategory(value: string) {
      this.stateFilterData.StrategyCategory = value;
    },
    setMaintenanceStrategyId(value: string) {
      this.stateFilterData.MaintenanceStrategyId = value;
    },
    setStrategyPackage(value: string) {
      this.stateFilterData.StrategyPackage = value;
    },
    setBudgetLife(value: string) {
      this.stateFilterData.BudgetLife = value;
    },
    setUom(value: string) {
      this.stateFilterData.Uom = value;
    },
    setStartDate(value: string) {
      this.stateFilterData.StartDate = value;
    },
    setEndDate(value: string) {
      this.stateFilterData.EndDate = value;
    },
    async resetFilter() {
      this.stateFilterData.MaintenanceStrategyId = ""
      this.stateFilterData.StrategyCategory = ""
      this.stateFilterData.StrategyPackage = ""
      this.stateFilterData.BudgetLife = ""
      this.stateFilterData.Uom = ""
      this.stateFilterData.StartDate = ""
      this.stateFilterData.EndDate = ""
      const checkMaintenanceStrategyId = this.stateLastUsedFilterData.MaintenanceStrategyId !== ""
      const checkStrategyCategory = this.stateLastUsedFilterData.StrategyCategory !== ""
      const checkStrategyPackage = this.stateLastUsedFilterData.StrategyPackage !== ""
      const checkBudgetLife = this.stateLastUsedFilterData.BudgetLife !== ""
      const checkUom = this.stateLastUsedFilterData.Uom !== ""
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== ""
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== ""
      if (checkMaintenanceStrategyId || checkStrategyCategory || checkStrategyPackage || checkBudgetLife || checkUom || checkStartDate || checkEndDate) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        MaintenanceStrategyId: "",
        StrategyCategory: "",
        StrategyPackage: "",
        BudgetLife: "",
        Uom: "",
        StartDate: "",
        EndDate: "",
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
