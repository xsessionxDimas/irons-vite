import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { CRUD_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/equipment-number/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/equipment-number/FilterData";
import {
  LookupItem,
} from "@/core/types/entities/iron-lake/equipment/equipment-number/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOptionFromLookupApi } from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

export const useEquipmentNumberListStore = defineStore({
  id: "equipmentNumberList",
  state: () => {
    return {
      stateFilterData: {
        EquipmentNumber: "",
        Level: "",
        SerialNumber: "",
        EquipmentNumberTo: "",
        LevelTo: "",
        SerialNumberTo: "",
        StartDate: "",
        EndDate: "",
        StartDateTo: "",
        EndDateTo: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      stateLastUsedFilterData: {
        EquipmentNumber: "",
        Level: "",
        SerialNumber: "",
        EquipmentNumberTo: "",
        LevelTo: "",
        SerialNumberTo: "",
        StartDate: "",
        EndDate: "",
        StartDateTo: "",
        EndDateTo: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      statePageName: "equipmentNumber",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateEquipmentNumberOption: [] as Option[],
      stateEquipmentNumberDescOption: [] as Option[],
      stateSerialNumberOption: [] as Option[],
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
    equipmentNumberOption: (state) => {
      return state.stateEquipmentNumberOption;
    },
    equipmentNumberDescOption: (state) => {
      return state.stateEquipmentNumberDescOption;
    },
    SerialNumberOption: (state) => {
      return state.stateSerialNumberOption
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        EquipmentNumber: this.stateFilterData.EquipmentNumber,
        Level: this.stateFilterData.Level,
        SerialNumber: this.stateFilterData.SerialNumber,
        EquipmentNumberTo: this.stateFilterData.EquipmentNumberTo,
        LevelTo: this.stateFilterData.LevelTo,
        SerialNumberTo: this.stateFilterData.SerialNumberTo,
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
        this.stateEquipmentNumberOption = mapOptionFromLookupApi(response.data.result.content, "equipmentNumber", "equipmentNumberDescription");
      } catch (error) {
        console.log(error)
      }
    },
    async export() {
      const params = {
        EquipmentNumber: this.stateFilterData.EquipmentNumber,
        Level: this.stateFilterData.Level,
        SerialNumber: this.stateFilterData.SerialNumber,
        EquipmentNumberTo: this.stateFilterData.EquipmentNumberTo,
        LevelTo: this.stateFilterData.LevelTo,
        SerialNumberTo: this.stateFilterData.SerialNumberTo,
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
    setEquipmentNumber(value: string) {
      this.stateFilterData.EquipmentNumber = value;
    },
    setLevel(value: string) {
      this.stateFilterData.Level = value;
    },
    setSerialNumber(value: string) {
      this.stateFilterData.SerialNumber = value;
    },
    setEquipmentNumberTo(value: string) {
      this.stateFilterData.EquipmentNumberTo = value;
    },
    setLevelTo(value: string) {
      this.stateFilterData.LevelTo = value;
    },
    setSerialNumberTo(value: string) {
      this.stateFilterData.SerialNumberTo = value;
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
      this.stateFilterData.EquipmentNumber = ""
      this.stateFilterData.Level = ""
      this.stateFilterData.SerialNumber = ""
      this.stateFilterData.EquipmentNumberTo = ""
      this.stateFilterData.LevelTo = ""
      this.stateFilterData.SerialNumberTo = ""
      this.stateFilterData.StartDate = ""
      this.stateFilterData.EndDate = ""
      this.stateFilterData.StartDateTo = ""
      this.stateFilterData.EndDateTo = ""
      const checkEquipmentNumber = this.stateLastUsedFilterData.EquipmentNumber !== ""
      const checkLevel = this.stateLastUsedFilterData.Level !== ""
      const checkSerialNumber = this.stateLastUsedFilterData.SerialNumber !== ""
      const checkEquipmentNumberTo = this.stateLastUsedFilterData.EquipmentNumberTo !== ""
      const checkLevelTo = this.stateLastUsedFilterData.LevelTo !== ""
      const checkSerialNumberTo = this.stateLastUsedFilterData.SerialNumberTo !== ""
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== ""
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== ""
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== ""
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== ""
      if (checkEquipmentNumber || checkLevel || checkSerialNumber || checkEquipmentNumberTo || checkLevelTo || checkSerialNumberTo || checkStartDate || checkEndDate || checkStartDateTo || checkEndDateTo) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        EquipmentNumber: "",
        Level: "",
        SerialNumber: "",
        EquipmentNumberTo: "",
        LevelTo: "",
        SerialNumberTo: "",
        StartDate: "",
        EndDate: "",
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
