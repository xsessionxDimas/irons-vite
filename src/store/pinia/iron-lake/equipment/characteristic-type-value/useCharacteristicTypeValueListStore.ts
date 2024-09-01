import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  CRUD_API_URL,
  EXPORT_API_URL,
  CHARACTERISTIC_TYPE_LOOKUP_API_URL
} from "./urls";
import {
  LOOKUP_API_URL as CHARACTERISTIC_VALUE_LOOKUP_API_URL
} from "../characteristic-value/urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/characteristic-type-value/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/characteristic-type-value/FilterData";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOptionFromLookupApi } from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

export const useCharacteristicTypeValueListStore = defineStore({
  id: "CharacteristicTypeValueList",
  state: () => {
    return {
      stateFilterData: {
        CharacteristicType: "",
        CharacteristicValue: "",
        CharacteristicTypeTo: "",
        CharacteristicValueTo: "",
        StartDate: "",
        StartDateTo: "",
        EndDate: "",
        EndDateTo: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      stateLastUsedFilterData: {
        CharacteristicType: "",
        CharacteristicValue: "",
        CharacteristicTypeTo: "",
        CharacteristicValueTo: "",
        StartDate: "",
        StartDateTo: "",
        EndDate: "",
        EndDateTo: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      statePageName: "CharacteristicType",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateCharacteristicTypeOption: [] as Option[],
      stateCharacteristicValueOption: [] as Option[],
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
    CharacteristicTypeOption: (state) => {
      return state.stateCharacteristicTypeOption;
    },
    CharacteristicValueOption: (state) => {
      return state.stateCharacteristicValueOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        CharacteristicType: this.stateFilterData.CharacteristicType,
        CharacteristicValue: this.stateFilterData.CharacteristicValue,
        CharacteristicTypeTo: this.stateFilterData.CharacteristicTypeTo,
        CharacteristicValueTo: this.stateFilterData.CharacteristicValueTo,
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(this.stateFilterData.StartDateTo.toLocaleString()) : "",
        EndDateTo: this.stateFilterData.EndDateTo ? formatDateForPostData(this.stateFilterData.EndDateTo.toLocaleString()) : "",
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
    async getLookupType() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(CHARACTERISTIC_TYPE_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateCharacteristicTypeOption = mapOptionFromLookupApi(response.data.result.content, "characteristicType", "characteristicTypeDesc");
      } catch (error) {
        console.log(error)
      }
    },
    async getLookupValue() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(CHARACTERISTIC_VALUE_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateCharacteristicValueOption = mapOptionFromLookupApi(response.data.result.content, "characteristicValue", "characteristicValueDescription");
      } catch (error) {
        console.log(error)
      }
    },
    async export() {
      const params = {
        CharacteristicType: this.stateFilterData.CharacteristicType,
        CharacteristicValue: this.stateFilterData.CharacteristicValue,
        CharacteristicTypeTo: this.stateFilterData.CharacteristicTypeTo,
        CharacteristicValueTo: this.stateFilterData.CharacteristicValueTo,
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(this.stateFilterData.StartDateTo.toLocaleString()) : "",
        EndDateTo: this.stateFilterData.EndDateTo ? formatDateForPostData(this.stateFilterData.EndDateTo.toLocaleString()) : "",
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
    setCharacteristicType(value: string) {
      this.stateFilterData.CharacteristicType = value;
    },
    setCharacteristicValue(value: string) {
      this.stateFilterData.CharacteristicValue = value;
    },
    setCharacteristicTypeTo(value: string) {
      this.stateFilterData.CharacteristicTypeTo = value;
    },
    setCharacteristicValueTo(value: string) {
      this.stateFilterData.CharacteristicValueTo = value;
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
      this.stateFilterData.CharacteristicType = ""
      this.stateFilterData.CharacteristicValue = ""
      this.stateFilterData.CharacteristicTypeTo = ""
      this.stateFilterData.CharacteristicValueTo = ""
      this.stateFilterData.StartDate = ""
      this.stateFilterData.StartDateTo = ""
      this.stateFilterData.EndDate = ""
      this.stateFilterData.EndDateTo = ""
      const checkCharacteristicTypeTo = this.stateLastUsedFilterData.CharacteristicTypeTo !== ""
      const checkCharacteristicValueTo = this.stateLastUsedFilterData.CharacteristicValueTo !== ""
      const checkCharacteristicType = this.stateLastUsedFilterData.CharacteristicType !== ""
      const checkCharacteristicValue = this.stateLastUsedFilterData.CharacteristicValue !== ""
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== ""
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== ""
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== ""
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== ""
      if (checkCharacteristicTypeTo || checkCharacteristicValueTo || checkCharacteristicType || checkCharacteristicValue || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        CharacteristicType: "",
        CharacteristicValue: "",
        CharacteristicTypeTo: "",
        CharacteristicValueTo: "",
        StartDate: "",
        StartDateTo: "",
        EndDate: "",
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
