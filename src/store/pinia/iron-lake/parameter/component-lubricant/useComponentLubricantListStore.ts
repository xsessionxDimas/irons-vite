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
} from "@/core/types/entities/iron-lake/parameter/component-lubricant/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/component-lubricant/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/parameter/component-lubricant/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  mapOption,
} from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

const initialFilter = {
  Component: "",
  ComponentTo: "",
  RecommendedLubricant: "",
  RecommendedLubricantTo: "",
  Value: "",
  ValueTo: "",
  Uom: "",
  UomTo: "",
  StartDate: "",
  StartDateTo: "",
  EndDate: "",
  EndDateTo: "",
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: ""
};

export const useComponentLubricantListStore = defineStore({
  id: "componentLubricant",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "componentLubricant",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      // Lookup
      stateComponentOption: [] as Option[],
      stateRecommendedLubricantOption: [] as Option[],
      stateValueOption: [] as Option[],
      stateUomOption: [] as Option[],
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
    recommendedLubricantOption: (state) => {
      return state.stateRecommendedLubricantOption;
    },
    valueOption: (state) => {
      return state.stateValueOption;
    },
    uomOption: (state) => {
      return state.stateUomOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        Component: this.stateFilterData.Component,
        ComponentTo: this.stateFilterData.ComponentTo,
        RecommendedLubricant: this.stateFilterData.RecommendedLubricant,
        RecommendedLubricantTo: this.stateFilterData.RecommendedLubricantTo,
        Value: this.stateFilterData.Value,
        ValueTo: this.stateFilterData.ValueTo,
        Uom: this.stateFilterData.Uom,
        UomTo: this.stateFilterData.UomTo,
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
        this.stateComponentOption = mapOption(response.data.result.content.component);
        this.stateRecommendedLubricantOption = mapOption(response.data.result.content.recommendedLubricant);
        this.stateValueOption = mapOption(response.data.result.content.value);
        this.stateUomOption = mapOption(response.data.result.content.uom);
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
    setComponent(value: string) {
      this.stateFilterData.Component = value;
    },
    setComponentTo(value: string) {
      this.stateFilterData.ComponentTo = value;
    },
    setRecommendedLubricant(value: string) {
      this.stateFilterData.RecommendedLubricant = value;
    },
    setRecommendedLubricantTo(value: string) {
      this.stateFilterData.RecommendedLubricantTo = value;
    },
    setValue(value: string) {
      this.stateFilterData.Value = value;
    },
    setValueTo(value: string) {
      this.stateFilterData.ValueTo = value;
    },
    setUom(value: string) {
      this.stateFilterData.Uom = value;
    },
    setUomTo(value: string) {
      this.stateFilterData.UomTo = value;
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
      this.stateFilterData.Component = ""
      this.stateFilterData.ComponentTo = ""
      this.stateFilterData.RecommendedLubricant = ""
      this.stateFilterData.RecommendedLubricantTo = ""
      this.stateFilterData.Value = ""
      this.stateFilterData.ValueTo = ""
      this.stateFilterData.Uom = ""
      this.stateFilterData.UomTo = ""
      this.stateFilterData.StartDate = ""
      this.stateFilterData.StartDateTo = ""
      this.stateFilterData.EndDate = ""
      this.stateFilterData.EndDateTo = ""
      const checkComponent = this.stateLastUsedFilterData.Component !== ""
      const checkComponentTo = this.stateLastUsedFilterData.ComponentTo !== ""
      const checkRecommendedLubricant = this.stateLastUsedFilterData.RecommendedLubricant !== ""
      const checkRecommendedLubricantTo = this.stateLastUsedFilterData.RecommendedLubricantTo !== ""
      const checkValue = this.stateLastUsedFilterData.Value !== ""
      const checkValueTo = this.stateLastUsedFilterData.ValueTo !== ""
      const checkUom = this.stateLastUsedFilterData.Uom !== ""
      const checkUomTo = this.stateLastUsedFilterData.UomTo !== ""
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== ""
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== ""
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== ""
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== ""
      if (checkComponent || checkComponentTo || checkRecommendedLubricant || checkRecommendedLubricantTo || checkValue || checkValueTo || checkUom || checkUomTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
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
