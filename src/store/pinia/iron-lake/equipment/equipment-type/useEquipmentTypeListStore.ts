import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { CRUD_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/equipment-type/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/equipment-type/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-type/LookupItem";
import { mapOption } from "@/core/helpers/mapOption";

export const useEquipmentTypeListStore = defineStore({
  id: "equipmentTypeList",
  state: () => {
    return {
      stateFilterData: {
        EquipmentType: "",
        EquipmentTypeDescription: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      stateLastUsedFilterData: {
        EquipmentType: "",
        EquipmentTypeDescription: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      statePageName: "equipmentType",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateEquipmentTypeOption: [] as Option[],
      stateEquipmentTypeDescOption: [] as Option[]
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
    equipmentTypeOption: (state) => {
      return state.stateEquipmentTypeOption;
    },
    equipmentTypeDescOption: (state) => {
      return state.stateEquipmentTypeDescOption;
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        EquipmentType: this.stateFilterData.EquipmentType,
        EquipmentTypeDescription: this.stateFilterData.EquipmentTypeDescription,
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
        this.stateEquipmentTypeOption = mapOption(response.data.result.content.equipmentType);
        this.stateEquipmentTypeDescOption = mapOption(response.data.result.content.equipmentTypeDescription);
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
    setEquipmentType(value: string) {
      this.stateFilterData.EquipmentType = value;
    },
    setEquipmentTypeDescription(value: string) {
      this.stateFilterData.EquipmentTypeDescription = value;
    },
    async resetFilter() {
      this.stateFilterData.EquipmentType = ""
      this.stateFilterData.EquipmentTypeDescription = ""
      const checkEquipmentType = this.stateLastUsedFilterData.EquipmentType !== ""
      const checkEquipmentTypeDesc = this.stateLastUsedFilterData.EquipmentTypeDescription !== ""
      if (checkEquipmentType || checkEquipmentTypeDesc) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        EquipmentType: "",
        EquipmentTypeDescription: "",
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
