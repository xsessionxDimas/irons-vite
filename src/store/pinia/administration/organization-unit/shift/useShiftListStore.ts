import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { CRUD_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/administration/organization-unit/shift/ListItem";
import {
  FilterData
} from "@/core/types/entities/administration/organization-unit/shift/FilterData";
import {
  LookupItem
} from "@/core/types/entities/administration/organization-unit/shift/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { ampm } from "./utils";
import { mapOption } from "@/core/helpers/mapOption";

export const useShiftListStore = defineStore({
  id: "shiftList",
  state: () => {
    return {
      stateFilterData: {
        Shift: "",
        StartHour: "",
        StartHourType: "",
        EndHour: "",
        EndHourType: "",
        StartDate: "",
        EndDate: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      stateLastUsedFilterData: {
        Shift: "",
        StartHour: "",
        StartHourType: "",
        EndHour: "",
        EndHourType: "",
        StartDate: "",
        EndDate: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      statePageName: "shift",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateShiftOption: [] as Option[],
      stateStartHourOption: [] as Option[],
      stateStartHourTypeOption: [] as Option[],
      stateEndHourOption: [] as Option[],
      stateEndHourTypeOption: [] as Option[],
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
    shiftOption: (state) => {
      return state.stateShiftOption;
    },
    startHourOption: (state) => {
      return state.stateStartHourOption;
    },
    startHourTypeOption: (state) => {
      return state.stateStartHourTypeOption;
    },
    endHourOption: (state) => {
      return state.stateEndHourOption;
    },
    endHourTypeOption: (state) => {
      return state.stateEndHourTypeOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        Shift: this.stateFilterData.Shift,
        StartHour: this.stateFilterData.StartHour,
        StartHourType: this.stateFilterData.StartHourType,
        EndHour: this.stateFilterData.EndHour,
        EndHourType: this.stateFilterData.EndHourType,
        StartDate: this.stateFilterData.StartDate ? this.stateFilterData.StartDate.toLocaleString() : "",
        EndDate: this.stateFilterData.EndDate ? this.stateFilterData.EndDate.toLocaleString() : "",
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
        this.stateShiftOption = mapOption(response.data.result.content.shift);
        this.stateStartHourOption = mapOption(response.data.result.content.startHour);
        this.stateEndHourOption = mapOption(response.data.result.content.endHour);
      } catch (error) {
        console.log(error)
      }
      this.stateStartHourTypeOption = ampm
      this.stateEndHourTypeOption = ampm
    },
    async export() {
      const params = {
        ver: this.stateFilterData.ver,
        Gmt: new Date().toTimeString().slice(12, 17),
        Shift: this.stateFilterData.Shift,
        StartHour: this.stateFilterData.StartHour,
        StartHourType: this.stateFilterData.StartHourType,
        EndHour: this.stateFilterData.EndHour,
        EndHourType: this.stateFilterData.EndHourType,
        StartDate: this.stateFilterData.StartDate ? this.stateFilterData.StartDate.toLocaleString() : "",
        EndDate: this.stateFilterData.EndDate ? this.stateFilterData.EndDate.toLocaleString() : "",
        Order: this.stateFilterData.Order,
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
    setShift(value: string) {
      this.stateFilterData.Shift = value;
    },
    setStartHour(value: string) {
      this.stateFilterData.StartHour = value;
    },
    setStartHourType(value: string) {
      this.stateFilterData.StartHourType = value;
    },
    setEndHour(value: string) {
      this.stateFilterData.EndHour = value;
    },
    setEndHourType(value: string) {
      this.stateFilterData.EndHourType = value;
    },
    setStartDate(value: string) {
      this.stateFilterData.StartDate = value;
    },
    setEndDate(value: string) {
      this.stateFilterData.EndDate = value;
    },
    async resetFilter() {
      this.stateFilterData.Shift = ""
      this.stateFilterData.StartHour = ""
      this.stateFilterData.StartHourType = ""
      this.stateFilterData.EndHour = ""
      this.stateFilterData.EndHourType = ""
      this.stateFilterData.StartDate = ""
      this.stateFilterData.EndDate = ""
      const checkShift = this.stateLastUsedFilterData.Shift !== ""
      const checkStartHour = this.stateLastUsedFilterData.StartHour !== ""
      const checkStartHourType = this.stateLastUsedFilterData.StartHourType !== ""
      const checkEndHour = this.stateLastUsedFilterData.EndHour !== ""
      const checkEndHourType = this.stateLastUsedFilterData.EndHourType !== ""
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== ""
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== ""
      if (checkShift || checkStartHour || checkStartHourType || checkEndHour || checkEndHourType || checkStartDate || checkEndDate) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        Shift: "",
        StartHour: "",
        StartHourType: "",
        EndHour: "",
        EndHourType: "",
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
