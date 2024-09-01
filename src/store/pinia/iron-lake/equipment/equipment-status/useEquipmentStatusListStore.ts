import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { CRUD_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/equipment-status/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/equipment-status/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-status/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption } from "@/core/helpers/mapOption";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";

const initialFilter = {
  Equipment: "",
  EquipmentTo: "",
  SystemStatus: "",
  SystemStatusTo: "",
  Status: "",
  StatusTo: "",
  SubStatus: "",
  SubStatusTo: "",
  StartDate: "",
  StartDateTo: "",
  EndDate: "",
  EndDateTo: "",
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: ""
}

export const useEquipmentStatusListStore = defineStore({
  id: "equipmentStatusList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "equipmentStatus",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateEquipmentOption: [] as Option[],
      stateSystemStatusOption: [] as Option[],
      stateStatusOption: [] as Option[],
      stateSubStatusOption: [] as Option[],
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
    equipmentOption: (state) => {
      return state.stateEquipmentOption;
    },
    systemStatusOption: (state) => {
      return state.stateSystemStatusOption;
    },
    statusOption: (state) => {
      return state.stateStatusOption;
    },
    subStatusOption: (state) => {
      return state.stateSubStatusOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        Equipment: this.stateFilterData.Equipment,
        EquipmentTo: this.stateFilterData.EquipmentTo,
        SystemStatus: this.stateFilterData.SystemStatus,
        SystemStatusTo: this.stateFilterData.SystemStatusTo,
        Status: this.stateFilterData.Status,
        StatusTo: this.stateFilterData.StatusTo,
        SubStatus: this.stateFilterData.SubStatus,
        SubStatusTo: this.stateFilterData.SubStatusTo,
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
        this.stateEquipmentOption = mapOption(response.data.result.content.equipment);
        this.stateSystemStatusOption = mapOption(response.data.result.content.systemStatus);
        this.stateStatusOption = mapOption(response.data.result.content.status);
        this.stateSubStatusOption = mapOption(response.data.result.content.subStatus);
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
    setEquipment(value: string) {
      this.stateFilterData.Equipment = value;
    },
    setEquipmentTo(value: string) {
      this.stateFilterData.EquipmentTo = value;
    },
    setSystemStatus(value: string) {
      this.stateFilterData.SystemStatus = value;
    },
    setSystemStatusTo(value: string) {
      this.stateFilterData.SystemStatusTo = value;
    },
    setStatus(value: string) {
      this.stateFilterData.Status = value;
    },
    setStatusTo(value: string) {
      this.stateFilterData.StatusTo = value;
    },
    setSubStatus(value: string) {
      this.stateFilterData.SubStatus = value;
    },
    setSubStatusTo(value: string) {
      this.stateFilterData.SubStatusTo = value;
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
      this.stateFilterData.Equipment = ""
      this.stateFilterData.EquipmentTo = ""
      this.stateFilterData.SystemStatus = ""
      this.stateFilterData.SystemStatusTo = ""
      this.stateFilterData.Status = ""
      this.stateFilterData.StatusTo = ""
      this.stateFilterData.SubStatus = ""
      this.stateFilterData.SubStatusTo = ""
      this.stateFilterData.StartDate = ""
      this.stateFilterData.StartDateTo = ""
      this.stateFilterData.EndDate = ""
      this.stateFilterData.EndDateTo = ""
      const checkEquipment = this.stateLastUsedFilterData.Equipment !== ""
      const checkEquipmentTo = this.stateLastUsedFilterData.EquipmentTo !== ""
      const checkSystemStatus = this.stateLastUsedFilterData.SystemStatus !== ""
      const checkSystemStatusTo = this.stateLastUsedFilterData.SystemStatusTo !== ""
      const checkStatus = this.stateLastUsedFilterData.Status !== ""
      const checkStatusTo = this.stateLastUsedFilterData.StatusTo !== ""
      const checkSubStatus = this.stateLastUsedFilterData.SubStatus !== ""
      const checkSubStatusTo = this.stateLastUsedFilterData.SubStatusTo !== ""
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== ""
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== ""
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== ""
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== ""
      if (checkEquipment || checkEquipmentTo || checkSystemStatus || checkSystemStatusTo || checkStatus || checkStatusTo || checkSubStatus || checkSubStatusTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
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
