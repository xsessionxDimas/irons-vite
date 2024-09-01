import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { CRUD_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/equipment-characteristic-value/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/equipment-characteristic-value/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-characteristic-value/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption } from "@/core/helpers/mapOption";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";

const initialFilter = {
  equipment: "",
  equipmentTo: "",
  characteristicType: "",
  characteristicTypeTo: "",
  characteristicValue: "",
  characteristicValueTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useEquipmentCharacteristicValueListStore = defineStore({
  id: "equipmentCharacteristicValueList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "equipmentCharacteristicValue",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateEquipmentOption: [] as Option[],
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
    equipmentOption: (state) => {
      return state.stateEquipmentOption;
    },
    characteristicTypeOption: (state) => {
      return state.stateCharacteristicTypeOption;
    },
    characteristicValueOption: (state) => {
      return state.stateCharacteristicValueOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        equipment: this.stateFilterData.equipment,
        equipmentTo: this.stateFilterData.equipmentTo,
        characteristicType: this.stateFilterData.characteristicType,
        characteristicTypeTo: this.stateFilterData.characteristicTypeTo,
        characteristicValue: this.stateFilterData.characteristicValue,
        characteristicValueTo: this.stateFilterData.characteristicValueTo,
        startDate: this.stateFilterData.startDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDate))) : "",
        startDateTo: this.stateFilterData.startDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDateTo))) : "",
        endDate: this.stateFilterData.endDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDate))) : "",
        endDateTo: this.stateFilterData.endDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDateTo))) : "",
        page: this.stateFilterData.page.toString(),
        pageSize: this.stateFilterData.pageSize.toString(),
        order: this.stateFilterData.order,
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
        this.stateCharacteristicTypeOption = mapOption(response.data.result.content.characteristicType);
        this.stateCharacteristicValueOption = mapOption(response.data.result.content.characteristicValue);
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
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData(false);
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200)
    },
    async setSort({ prop, order }) {
      if (!prop && !order) {
        this.stateFilterData.order = "";
      } else {
        const formatedOrder = order == "ascending" ? "asc" : "desc";
        this.stateFilterData.order = `${prop}_${formatedOrder}`;
      }
      this.statePagination.handleCurrentPageChange(1);
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData(false);
    },
    setEquipment(value: string) {
      this.stateFilterData.equipment = value;
    },
    setEquipmentTo(value: string) {
      this.stateFilterData.equipmentTo = value;
    },
    setCharacteristicType(value: string) {
      this.stateFilterData.characteristicType = value;
    },
    setCharacteristicTypeTo(value: string) {
      this.stateFilterData.characteristicTypeTo = value;
    },
    setCharacteristicValue(value: string) {
      this.stateFilterData.characteristicValue = value;
    },
    setCharacteristicValueTo(value: string) {
      this.stateFilterData.characteristicValueTo = value;
    },
    setStartDate(value: string) {
      this.stateFilterData.startDate = value;
    },
    setStartDateTo(value: string) {
      this.stateFilterData.startDateTo = value;
    },
    setEndDate(value: string) {
      this.stateFilterData.endDate = value;
    },
    setEndDateTo(value: string) {
      this.stateFilterData.endDateTo = value;
    },
    async resetFilter() {
      this.stateFilterData.equipment = "";
      this.stateFilterData.equipmentTo = "";
      this.stateFilterData.characteristicType = "";
      this.stateFilterData.characteristicTypeTo = "";
      this.stateFilterData.characteristicType = "";
      this.stateFilterData.characteristicTypeTo = "";
      this.stateFilterData.startDate = "";
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.endDateTo = "";
      const checkEquipment = this.stateLastUsedFilterData.equipment !== "";
      const checkEquipmentTo = this.stateLastUsedFilterData.equipmentTo !== "";
      const checkCharacteristicType = this.stateLastUsedFilterData.characteristicType !== "";
      const checkCharacteristicTypeTo = this.stateLastUsedFilterData.characteristicTypeTo !== "";
      const checkCharacteristicValue = this.stateLastUsedFilterData.characteristicValue !== "";
      const checkCharacteristicValueTo = this.stateLastUsedFilterData.characteristicValueTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== "";
      if (checkEquipment || checkEquipmentTo || checkCharacteristicType || checkCharacteristicTypeTo || checkCharacteristicValue || checkCharacteristicValueTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
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
