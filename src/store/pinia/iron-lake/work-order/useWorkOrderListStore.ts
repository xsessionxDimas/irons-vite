import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { CRUD_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/component/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/component/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/equipment/component/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { formatDateForPostData } from "@/core/helpers/date-format";
import { mapOption } from "@/core/helpers/mapOption";

export const useWorkOrderListStore = defineStore({
  id: "workOrder",
  state: () => {
    return {
      stateFilterData: {
        Component: "",
        ComponentDescription: "",
        Level: "",
        StartDate: "",
        EndDate: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      stateLastUsedFilterData: {
        Component: "",
        ComponentDescription: "",
        Level: "",
        StartDate: "",
        EndDate: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      statePageName: "component",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateComponentOption: [] as Option[],
      stateComponentDescOption: [] as Option[],
      stateLevelOption: [] as Option[]
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
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    componentDescOption: (state) => {
      return state.stateComponentDescOption;
    },
    componentLevelOption: (state) => {
      return state.stateLevelOption;
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        Component: this.stateFilterData.Component,
        ComponentDescription: this.stateFilterData.ComponentDescription,
        Level: this.stateFilterData.Level != "" ? this.stateFilterData.Level : "0",
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate) : "",
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
    setComponent(value: string) {
      this.stateFilterData.Component = value;
    },
    setComponentDescription(value: string) {
      this.stateFilterData.ComponentDescription = value;
    },
    setLevel(value: string) {
      this.stateFilterData.Level = value;
    },
    setStartDate(value: string) {
      this.stateFilterData.StartDate = value;
    },
    setEndDate(value: string) {
      this.stateFilterData.EndDate = value;
    },
    async resetFilter() {
      this.stateFilterData.Component = "";
      this.stateFilterData.ComponentDescription = "";
      this.stateFilterData.Level = "";
      this.stateFilterData.StartDate = "";
      this.stateFilterData.EndDate = "";
      const checkComponent = this.stateLastUsedFilterData.Component !== "";
      const checkComponentDesc = this.stateLastUsedFilterData.ComponentDescription !== "";
      const checkLevel = this.stateLastUsedFilterData.Level !== "";
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== "";
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== "";
      if (checkComponent || checkComponentDesc || checkLevel || checkStartDate || checkEndDate) {
        await this.getData();
      }
    },
    resetState() {
      this.stateFilterData = {
        Component: "",
        ComponentDescription: "",
        Level: "",
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
