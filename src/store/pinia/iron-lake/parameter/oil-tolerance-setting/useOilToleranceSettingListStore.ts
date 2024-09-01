import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  CRUD_URL,
  LOOKUP_API_URL,
  EXPORT_API_URL,
  LOOKUP_UOM_URL
} from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/parameter/oil-tolerance-setting/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/oil-tolerance-setting/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/parameter/oil-tolerance-setting/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

export const useOilToleranceSettingListStore = defineStore({
  id: "OilToleranceSettingList",
  state: () => {
    return {
      stateFilterData: {
        Value: "",
        ValueTo: "",
        ValueMin: "",
        ValueMinTo: "",
        ValueMax: "",
        ValueMaxTo: "",
        Uom: "",
        UomTo: "",
        StartDate: "",
        StartDateTo: "",
        EndDate: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1",
      } as FilterData,
      stateLastUsedFilterData: {
        Value: "",
        ValueTo: "",
        ValueMin: "",
        ValueMinTo: "",
        ValueMax: "",
        ValueMaxTo: "",
        Uom: "",
        UomTo: "",
        StartDate: "",
        StartDateTo: "",
        EndDate: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1",
      } as FilterData,
      statePageName: "oilToleranceSetting",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateUomOption: [] as Option[],
      stateValueOption: [] as Option[],
      stateValueMinOption: [] as Option[],
      stateValueMaxOption: [] as Option[],
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
    uomOption: (state) => {
      return state.stateUomOption;
    },
    valueOption: (state) => {
      return state.stateValueOption
    },
    valueMinOption: (state) => {
      return state.stateValueMinOption
    },
    valueMaxOption: (state) => {
      return state.stateValueMaxOption
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const payload = {
        Value: this.stateFilterData.Value,
        ValueTo: this.stateFilterData.ValueTo,
        ValueMin: this.stateFilterData.ValueMin,
        ValueMinTo: this.stateFilterData.ValueMinTo,
        ValueMax: this.stateFilterData.ValueMax,
        ValueMaxTo: this.stateFilterData.ValueMaxTo,
        Uom: this.stateFilterData.Uom,
        UomTo: this.stateFilterData.UomTo,
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
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(CRUD_URL, "", new URLSearchParams(payload).toString());
        this.stateDisplayData = response.data.result.content;
        this.setTotalPage(response.data.result.total || response.data.result["totalData"]);
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
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.get(`${LOOKUP_API_URL}?${new URLSearchParams(params).toString()}`);
        this.stateValueOption = mapOption(response.data.result.content.value)
        this.stateValueMaxOption = mapOption(response.data.result.content.valueMax)
        this.stateValueMinOption = mapOption(response.data.result.content.valueMin)
      } catch (error) {
        console.log(error);
      }
    },
    async getUomLookUp() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_UOM_URL}?${new URLSearchParams(params).toString()}`);
        this.stateUomOption = mapOption(response.data.result.content.uom)
      } catch (error) {
        console.log(error)
      }
    },
    async export() {
      const params = {
        Value: this.stateFilterData.Value,
        ValueTo: this.stateFilterData.ValueTo,
        ValueMin: this.stateFilterData.ValueMin,
        ValueMinTo: this.stateFilterData.ValueMinTo,
        ValueMax: this.stateFilterData.ValueMax,
        ValueMaxTo: this.stateFilterData.ValueMaxTo,
        Uom: this.stateFilterData.Uom,
        UomTo: this.stateFilterData.UomTo,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate.toLocaleString()) : "",
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(this.stateFilterData.StartDateTo.toLocaleString()) : "",
        EndDateTo: this.stateFilterData.EndDateTo ? formatDateForPostData(this.stateFilterData.EndDateTo.toLocaleString()) : "",
        Page: this.stateFilterData.Page.toString(),
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
        Gmt: new Date().toTimeString().slice(12, 17),
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.getBlob(`${EXPORT_API_URL}?${new URLSearchParams(params).toString()}`);
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
    setValue(value: string) {
      this.filterData.Value = value
    },
    setValueTo(value: string) {
      this.filterData.ValueTo = value
    },
    setValueMin(value: string) {
      this.filterData.ValueMin = value
    },
    setValueMinTo(value: string) {
      this.filterData.ValueMinTo = value
    },
    setValueMax(value: string) {
      this.filterData.ValueMax = value
    },
    setValueMaxTo(value: string) {
      this.filterData.ValueMaxTo = value
    },
    setUom(value: string) {
      this.filterData.Uom = value
    },
    setUomTo(value: string) {
      this.filterData.UomTo = value
    },
    setStartDate(value: string) {
      this.filterData.StartDate = value
    },
    setStartDateTo(value: string) {
      this.filterData.StartDateTo = value
    },
    setEndDate(value: string) {
      this.filterData.EndDate = value
    },
    setEndDateTo(value: string) {
      this.filterData.EndDateTo = value
    },
    async resetFilter() {
      this.stateFilterData.Value = ""
      this.stateFilterData.ValueTo = ""
      this.stateFilterData.ValueMin = ""
      this.stateFilterData.ValueMinTo = ""
      this.stateFilterData.ValueMax = ""
      this.stateFilterData.ValueMaxTo = ""
      this.stateFilterData.Uom = ""
      this.stateFilterData.UomTo = ""
      this.stateFilterData.StartDate = ""
      this.stateFilterData.StartDateTo = ""
      this.stateFilterData.EndDate = ""
      this.stateFilterData.EndDateTo = ""
      const checkValue = this.stateLastUsedFilterData.Value !== ""
      const checkValueTo = this.stateLastUsedFilterData.ValueTo !== ""
      const checkValueMin = this.stateLastUsedFilterData.ValueMin !== ""
      const checkValueMinTo = this.stateLastUsedFilterData.ValueMinTo !== ""
      const checkValueMax = this.stateLastUsedFilterData.ValueMax !== ""
      const checkValueMaxTo = this.stateLastUsedFilterData.ValueMaxTo !== ""
      const checkUom = this.stateLastUsedFilterData.Uom !== ""
      const checkUomTo = this.stateLastUsedFilterData.UomTo !== ""
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== ""
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== ""
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== ""
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== ""
      if (checkValue || checkValueTo || checkValueMin || checkValueMinTo || checkValueMax || checkValueMaxTo || checkUom || checkUomTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        Value: "",
        ValueTo: "",
        ValueMin: "",
        ValueMinTo: "",
        ValueMax: "",
        ValueMaxTo: "",
        Uom: "",
        UomTo: "",
        StartDate: "",
        StartDateTo: "",
        EndDate: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1",
      } as FilterData;
      this.stateDisplayData = [] as ListItem[];
      this.statePagination = new PaginationType();
      this.stateLoading = false;
      this.statePaginationLoading = false;
    }
  }
});
