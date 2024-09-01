import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { apiUrls } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/business-partner/planning-plant/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/planning-plant/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/business-partner/planning-plant/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  mapOptionWithThreeLabelFromLookupApi
} from "@/core/helpers/mapOption";

const initialFilter = {
  PlanningPlantId: "",
  PlanningPlantIdTo: "",
  StartDate: "",
  StartDateTo: "",
  EndDate: "",
  EndDateTo: "",
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: ""
};

export const usePlanningPlantListStore = defineStore({
  id: "planningPlantList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "planningPlant",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false,
      statePaginationLoading: false,
      statePlanningPlantIdOption: [] as Option[],
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
    planningPlantIdOption: (state) => {
      return state.statePlanningPlantIdOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        PlanningPlantId: this.stateFilterData.PlanningPlantId,
        PlanningPlantIdTo: this.stateFilterData.PlanningPlantIdTo,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.StartDate))) : "",
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.StartDateTo))) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.EndDate))) : "",
        EndDateTo: this.stateFilterData.EndDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.EndDateTo))) : "",
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
        this.statePlanningPlantIdOption = mapOptionWithThreeLabelFromLookupApi(response.data.result.content, "planningPlantId", "planningPlantCode", "planningPlantDescription")
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
    setPlanningPlantId(value: string) {
      this.stateFilterData.PlanningPlantId = value;
    },
    setPlanningPlantIdTo(value: string) {
      this.stateFilterData.PlanningPlantIdTo = value;
    },
    setStartDate(value: string) {
      this.stateFilterData.StartDate = value;
    },
    setStartDateTo(value: string) {
      this.stateFilterData.StartDateTo = value;
    },
    setEndDate(value: string) {
      this.stateFilterData.EndDate = value;
    },
    setEndDateTo(value: string) {
      this.stateFilterData.EndDateTo = value;
    },
    async resetFilter() {
      this.stateFilterData.PlanningPlantId = "";
      this.stateFilterData.PlanningPlantIdTo = "";
      this.stateFilterData.StartDate = "";
      this.stateFilterData.StartDateTo = "";
      this.stateFilterData.EndDate = "";
      this.stateFilterData.EndDateTo = "";
      const checkPlanningPlantId = this.stateLastUsedFilterData.PlanningPlantId !== "";
      const checkPlanningPlantIdTo = this.stateLastUsedFilterData.PlanningPlantIdTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== "";
      if (checkPlanningPlantId || checkPlanningPlantIdTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
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
