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
} from "@/core/types/entities/iron-lake/parameter/type-parameter/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/type-parameter/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/parameter/type-parameter/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOptionFromLookupApi } from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

const initialFilter = {
  Parameter: "",
  ParameterTo: "",
  StartDate: "",
  StartDateTo: "",
  EndDate: "",
  EndDateTo: "",
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: ""
};

export const useTypeParameterListStore = defineStore({
  id: "typeParameter",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "typeParameter",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      // Lookup
      stateParameterOption: [] as Option[],
      stateStartDateOption: [] as Option[],
      stateEndDateOption: [] as Option[],
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
    parameterOption: (state) => {
      return state.stateParameterOption;
    },
    startDateOption: (state) => {
      return state.stateStartDateOption;
    },
    endDateOption: (state) => {
      return state.stateEndDateOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        Parameter: this.stateFilterData.Parameter,
        ParameterTo: this.stateFilterData.ParameterTo,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate) : "",
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(this.stateFilterData.StartDateTo) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate) : "",
        EndDateTo: this.stateFilterData.EndDateTo ? formatDateForPostData(this.stateFilterData.EndDateTo) : "",
        Page: this.stateFilterData.Page.toString(),
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
        ver: this.stateFilterData.ver
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(`${CRUD_API_URL}?${new URLSearchParams(params).toString()}`);
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
        this.stateParameterOption = mapOptionFromLookupApi(response.data.result.content, "listParameter", "listIdParameter");
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
    setParameter(value: string) {
      this.stateFilterData.Parameter = value;
    },
    setParameterTo(value: string) {
      this.stateFilterData.ParameterTo = value;
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
      this.stateFilterData.Parameter = ""
      this.stateFilterData.ParameterTo = ""
      this.stateFilterData.StartDate = ""
      this.stateFilterData.StartDateTo = ""
      this.stateFilterData.EndDate = ""
      this.stateFilterData.EndDateTo = ""
      const checkParameter = this.stateLastUsedFilterData.Parameter !== ""
      const checkParameterTo = this.stateLastUsedFilterData.ParameterTo !== ""
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== ""
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== ""
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== ""
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== ""
      if (checkParameter || checkParameterTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
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
