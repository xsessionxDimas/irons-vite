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
} from "@/core/types/entities/iron-lake/parameter/smu-tolerance-setting/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/smu-tolerance-setting/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/parameter/smu-tolerance-setting/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  mapOption,
  mapOptionFromApi,
} from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

const initialFilter = {
  Parameter: "",
  ParameterTo: "",
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
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: ""
};

export const useSmuToleranceSettingListStore = defineStore({
  id: "smutolerancesetting",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "smuToleranceSetting",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      // Lookup
      stateParameterOption: [] as Option[],
      stateValueMinOption: [] as Option[],
      stateValueMaxOption: [] as Option[],
      stateUomOption: [] as Option[],
      // Options in form
      stateUomFormOption: [] as Option[],
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
    valueMinOption: (state) => {
      return state.stateValueMinOption;
    },
    valueMaxOption: (state) => {
      return state.stateValueMaxOption;
    },
    uomOption: (state) => {
      return state.stateUomOption;
    },
    UomFormOption: (state) => {
      return state.stateUomFormOption;
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        Parameter: this.stateFilterData.Parameter,
        ParameterTo: this.stateFilterData.ParameterTo,
        ValueMin: this.stateFilterData.ValueMin,
        ValueMinTo: this.stateFilterData.ValueMinTo,
        ValueMax: this.stateFilterData.ValueMax,
        ValueMaxTo: this.stateFilterData.ValueMaxTo,
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
        this.stateParameterOption = mapOption(response.data.result.content.parameter);
        this.stateValueMinOption = mapOption(response.data.result.content.valueMin);
        this.stateValueMaxOption = mapOption(response.data.result.content.valueMax);
        this.stateUomOption = mapOptionFromApi(response.data.result.content.uom, "uomId", "uom");
        this.stateUomFormOption = response.data.result.content.masterUomList.map((e) => {
          return {
            label: e.uomDescription,
            value: e
          }
        });
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
    setValueMin(value: string) {
      this.stateFilterData.ValueMin = value;
    },
    setValueMinTo(value: string) {
      this.stateFilterData.ValueMinTo = value;
    },
    setValueMax(value: string) {
      this.stateFilterData.ValueMax = value;
    },
    setValueMaxTo(value: string) {
      this.stateFilterData.ValueMaxTo = value;
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
      this.stateFilterData.Parameter = ""
      this.stateFilterData.ParameterTo = ""
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
      const checkParameter = this.stateLastUsedFilterData.Parameter !== ""
      const checkParameterTo = this.stateLastUsedFilterData.ParameterTo !== ""
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
      if (checkParameter || checkParameterTo || checkValueMin || checkValueMinTo || checkValueMax || checkValueMaxTo || checkUom || checkUomTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
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
