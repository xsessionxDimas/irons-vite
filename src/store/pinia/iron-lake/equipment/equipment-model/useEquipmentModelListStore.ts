import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  CRUD_API_URL,
  LOOKUP_API_URL,
  BRAND_LOOKUP_URL,
  EXPORT_API_URL
} from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/equipment-model/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/equipment-model/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-model/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  mapOption,
  mapOptionFromLookupApi
} from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

export const useEquipmentModelListStore = defineStore({
  id: "equipmentModelList",
  state: () => {
    return {
      stateFilterData: {
        EquipmentModel: "",
        EquipmentModelTo: "",
        EquipmentModelDescription: "",
        EquipmentModelDescriptionTo: "",
        Brand: "",
        BrandTo: "",
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
        EquipmentModel: "",
        EquipmentModelDescription: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      statePageName: "equipmentModel",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateEquipmentModelOption: [] as Option[],
      stateEquipmentModelDescOption: [] as Option[],
      stateBrandOption: [] as Option[],
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
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
    equipmentModelDescOption: (state) => {
      return state.stateEquipmentModelDescOption;
    },
    brandOption: (state) => {
      return state.stateBrandOption;
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        EquipmentModel: this.stateFilterData.EquipmentModel,
        EquipmentModelTo: this.stateFilterData.EquipmentModelTo,
        EquipmentModelDescription: this.stateFilterData.EquipmentModelDescription,
        EquipmentModelDescriptionTo: this.stateFilterData.EquipmentModelDescriptionTo,
        Brand: this.stateFilterData.Brand,
        BrandTo: this.stateFilterData.BrandTo,
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
        this.stateEquipmentModelOption = mapOption(response.data.result.content.equipmentModel);
        this.stateEquipmentModelDescOption = mapOption(response.data.result.content.equipmentModelDescription);
      } catch (error) {
        console.log(error)
      }
    },
    async getBrandOptions() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(BRAND_LOOKUP_URL, "", new URLSearchParams(params).toString());
        this.stateBrandOption = mapOptionFromLookupApi(response.data.result.content, "brand", "brandDescription");
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
    setEquipmentModel(value: string) {
      this.stateFilterData.EquipmentModel = value;
    },
    setEquipmentModelTo(value: string) {
      this.stateFilterData.EquipmentModelTo = value;
    },
    setEquipmentModelDescription(value: string) {
      this.stateFilterData.EquipmentModelDescription = value;
    },
    setEquipmentModelDescriptionTo(value: string) {
      this.stateFilterData.EquipmentModelDescriptionTo = value;
    },
    setBrand(value: string) {
      this.stateFilterData.Brand = value;
    },
    setBrandTo(value: string) {
      this.stateFilterData.BrandTo = value;
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
      this.stateFilterData.EquipmentModel = ""
      this.stateFilterData.EquipmentModelTo = ""
      this.stateFilterData.EquipmentModelDescription = ""
      this.stateFilterData.EquipmentModelDescriptionTo = ""
      this.stateFilterData.Brand = ""
      this.stateFilterData.BrandTo = ""
      this.stateFilterData.StartDate = ""
      this.stateFilterData.StartDateTo = ""
      this.stateFilterData.EndDate = ""
      this.stateFilterData.EndDateTo = ""
      const checkEquipmentModel = this.stateLastUsedFilterData.EquipmentModel !== ""
      const checkEquipmentModelTo = this.stateLastUsedFilterData.EquipmentModelTo !== ""
      const checkEquipmentModelDesc = this.stateLastUsedFilterData.EquipmentModelDescription !== ""
      const checkEquipmentModelDescTo = this.stateLastUsedFilterData.EquipmentModelDescriptionTo !== ""
      const checkBrand = this.stateLastUsedFilterData.Brand !== ""
      const checkBrandTo = this.stateLastUsedFilterData.BrandTo !== ""
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== ""
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== ""
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== ""
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== ""
      if (checkEquipmentModel || checkEquipmentModelTo || checkEquipmentModelDesc || checkEquipmentModelDescTo || checkBrand || checkBrandTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        EquipmentModel: "",
        EquipmentModelTo: "",
        EquipmentModelDescription: "",
        EquipmentModelDescriptionTo: "",
        Brand: "",
        BrandTo: "",
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
