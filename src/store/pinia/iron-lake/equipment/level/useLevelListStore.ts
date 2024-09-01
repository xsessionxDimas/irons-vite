import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { CRUD_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/level/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/level/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/equipment/level/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption } from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

export const useLevelListStore = defineStore({
  id: "levelList",
  state: () => {
    return {
      stateFilterData: {
        Level: "",
        Parent: "",
        StartDate: "",
        EndDate: "",
        LevelTo: "",
        ParentTo: "",
        StartDateTo: "",
        EndDateTo: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      stateLastUsedFilterData: {
        Level: "",
        Parent: "",
        StartDate: "",
        EndDate: "",
        LevelTo: "",
        ParentTo: "",
        StartDateTo: "",
        EndDateTo: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      statePageName: "level",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateLevelOption: [] as Option[],
      stateParentOption: [] as Option[]
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
    levelOption: (state) => {
      return state.stateLevelOption;
    },
    parentOption: (state) => {
      return state.stateParentOption;
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        Level: this.stateFilterData.Level,
        Parent: this.stateFilterData.Parent,
        LevelTo: this.stateFilterData.LevelTo,
        ParentTo: this.stateFilterData.ParentTo,
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
        this.stateLevelOption = mapOption(response.data.result.content.level)
        this.stateParentOption = mapOption(response.data.result.content.parent)
      } catch (error) {
        console.log(error)
      }
    },
    async export() {
      const params = {
        Level: this.stateFilterData.Level,
        Parent: this.stateFilterData.Parent,
        LevelTo: this.stateFilterData.LevelTo,
        ParentTo: this.stateFilterData.ParentTo,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate.toLocaleString()) : "",
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
    setLevel(value: string) {
      this.stateFilterData.Level = value;
    },
    setParent(value: string) {
      this.stateFilterData.Parent = value;
    },
    setLevelTo(value: string) {
      this.stateFilterData.LevelTo = value;
    },
    setParentTo(value: string) {
      this.stateFilterData.ParentTo = value;
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
      this.stateFilterData.Level = ""
      this.stateFilterData.Parent = ""
      this.stateFilterData.StartDate = "";
      this.stateFilterData.EndDate = "";
      this.stateFilterData.LevelTo = ""
      this.stateFilterData.ParentTo = ""
      this.stateFilterData.StartDateTo = "";
      this.stateFilterData.EndDateTo = "";
      const checkLevel = this.stateLastUsedFilterData.Level !== ""
      const checkParent = this.stateLastUsedFilterData.Parent !== ""
      const checkLevelTo = this.stateLastUsedFilterData.LevelTo !== ""
      const checkLParentTo = this.stateLastUsedFilterData.Parent !== ""
      const StartDate = this.stateLastUsedFilterData.StartDate !== ""
      const EndDate = this.stateLastUsedFilterData.EndDate !== ""
      const StartDateTo = this.stateLastUsedFilterData.StartDateTo !== ""
      const EndDateTo = this.stateLastUsedFilterData.EndDateTo !== ""
      if (checkLevel || checkParent || checkLevelTo || checkLParentTo || StartDate || EndDate || StartDateTo || EndDateTo) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        Level: "",
        Parent: "",
        StartDate: "",
        EndDate: "",
        LevelTo: "",
        ParentTo: "",
        StartDateTo: "",
        EndDateTo: "",
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
