import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  CRUD_API_URL,
  GET_COMPONENT_TYPE_API_URL,
  GET_COMPONENT_API_URL,
  GET_EQUIPMENT_NUMBER_API_URL,
  EXPORT_API_URL,
} from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/component-assignment/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/component-assignment/FilterData";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { formatDateForPostData } from "@/core/helpers/date-format";
import {
  mapOptionFromLookupApi
} from "@/core/helpers/mapOption";
import {
  LOOKUP_API_URL as GET_OBJECT_TYPE__API_URL
} from "@/store/pinia/iron-lake/equipment/object-type/urls"

export const useComponentAssignmentListStore = defineStore({
  id: "componentAssignmentList",
  state: () => {
    return {
      stateFilterData: {
        ComponentType: "",
        Component: "",
        Equipment: "",
        StartDate: "",
        EndDate: "",
        ObjectType: "",
        ComponentTypeTo: "",
        ComponentTo: "",
        EquipmentTo: "",
        StartDateTo: "",
        EndDateTo: "",
        ObjectTypeTo: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      stateLastUsedFilterData: {
        ComponentType: "",
        Component: "",
        Equipment: "",
        StartDate: "",
        EndDate: "",
        ObjectType: "",
        ComponentTypeTo: "",
        ComponentTo: "",
        EquipmentTo: "",
        StartDateTo: "",
        EndDateTo: "",
        ObjectTypeTo: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      statePageName: "componentAssignment",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateComponentTypeOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateEquipmentOption: [] as Option[],
      stateObjectTypeOption: [] as Option[]
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
    componentTypeOption: (state) => {
      return state.stateComponentTypeOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    equipmentOption: (state) => {
      return state.stateEquipmentOption;
    },
    objectTypeOption: (state) => {
      return state.stateObjectTypeOption;
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        ComponentType: this.stateFilterData.ComponentType,
        Component: this.stateFilterData.Component,
        Equipment: this.stateFilterData.Equipment,
        ObjectType: this.stateFilterData.ObjectType,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate) : "",
        ComponentTypeTo: this.stateFilterData.ComponentTypeTo,
        ComponentTo: this.stateFilterData.ComponentTo,
        EquipmentTo: this.stateFilterData.EquipmentTo,
        ObjectTypeTo: this.stateFilterData.ObjectTypeTo,
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(this.stateFilterData.StartDateTo) : "",
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
      await this.getComponentTypeOptions();
      await this.getComponentOptions();
      await this.getEquipmentOptions();
      await this.getObjectTypeOptions();
    },
    async getObjectTypeOptions() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(GET_OBJECT_TYPE__API_URL, "", new URLSearchParams(params).toString());
        this.stateObjectTypeOption = mapOptionFromLookupApi(
          response.data.result.content, // Array
          "objectType", // Value key
          "objectTypeDescription" // Label key
        );
      } catch (error) {
        console.log(error);
      }
    },
    async getComponentTypeOptions() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(GET_COMPONENT_TYPE_API_URL, "", new URLSearchParams(params).toString());
        this.stateComponentTypeOption = mapOptionFromLookupApi(
          response.data.result.content, // Array
          "componentType", // Value key
          "componentTypeDescription" // Label key
        );
      } catch (error) {
        console.log(error);
      }
    },
    async getComponentOptions() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(GET_COMPONENT_API_URL, "", new URLSearchParams(params).toString());
        this.stateComponentOption = mapOptionFromLookupApi(
          response.data.result.content, // Array
          "component", // Value key
          "componentDescription" // Label key
        );
      } catch (error) {
        console.log(error);
      }
    },
    async getEquipmentOptions() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(GET_EQUIPMENT_NUMBER_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentOption = mapOptionFromLookupApi(
          response.data.result.content, // Array
          "equipmentNumber", // Value key
          "equipmentNumberDescription" // Label key
        );
      } catch (error) {
        console.log(error);
      }
    },
    async export() {
      const params = {
        ver: this.stateFilterData.ver,
        Gmt: new Date().toTimeString().slice(12, 17),
        ComponentType: this.stateFilterData.ComponentType,
        Component: this.stateFilterData.Component,
        Equipment: this.stateFilterData.Equipment,
        ObjectType: this.stateFilterData.ObjectType,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate) : "",
        ComponentTypeTo: this.stateFilterData.ComponentTypeTo,
        ComponentTo: this.stateFilterData.ComponentTo,
        EquipmentTo: this.stateFilterData.EquipmentTo,
        ObjectTypeTo: this.stateFilterData.ObjectTypeTo,
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(this.stateFilterData.StartDateTo) : "",
        EndDateTo: this.stateFilterData.EndDateTo ? formatDateForPostData(this.stateFilterData.EndDateTo) : "",
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
    setComponent(value: string) {
      this.stateFilterData.Component = value;
    },
    setComponentType(value: string) {
      this.stateFilterData.ComponentType = value;
    },
    setEquipment(value: string) {
      this.stateFilterData.Equipment = value;
    },
    setObjectType(value: string) {
      this.stateFilterData.ObjectType = value;
    },
    setStartDate(value: string) {
      this.stateFilterData.StartDate = value;
    },
    setEndDate(value: string) {
      this.stateFilterData.EndDate = value;
    },
    setComponentTo(value: string) {
      this.stateFilterData.ComponentTo = value;
    },
    setComponentTypeTo(value: string) {
      this.stateFilterData.ComponentTypeTo = value;
    },
    setEquipmentTo(value: string) {
      this.stateFilterData.EquipmentTo = value;
    },
    setObjectTypeTo(value: string) {
      this.stateFilterData.ObjectTypeTo = value;
    },
    setStartDateTo(value: string) {
      this.stateFilterData.StartDateTo = value;
    },
    setEndDateTo(value: string) {
      this.stateFilterData.EndDateTo = value;
    },
    async resetFilter() {
      this.stateFilterData.ComponentType = "";
      this.stateFilterData.Component = "";
      this.stateFilterData.Equipment = "";
      this.stateFilterData.ObjectType = "";
      this.stateFilterData.StartDate = "";
      this.stateFilterData.EndDate = "";
      this.stateFilterData.ComponentTypeTo = "";
      this.stateFilterData.ComponentTo = "";
      this.stateFilterData.EquipmentTo = "";
      this.stateFilterData.ObjectTypeTo = "";
      this.stateFilterData.StartDateTo = "";
      this.stateFilterData.EndDateTo = "";
      const checkComponent = this.stateLastUsedFilterData.Component !== "";
      const checkComponentType = this.stateLastUsedFilterData.ComponentType !== "";
      const checkEquipment = this.stateLastUsedFilterData.Equipment !== "";
      const checkObjectType = this.lastUsedFilterData.ObjectType !== "";
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== "";
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== "";
      const checkComponentTypeTo = this.lastUsedFilterData.ComponentTypeTo !== "";
      const checkComponentTo = this.lastUsedFilterData.ComponentTo !== "";
      const checkEquipmentTo = this.lastUsedFilterData.EquipmentTo !== "";
      const checkObjectTypeTo = this.lastUsedFilterData.ObjectTypeTo !== "";
      const checkStartDateTo = this.lastUsedFilterData.StartDateTo !== "";
      const checkEndDateTo = this.lastUsedFilterData.EndDateTo !== "";
      if (checkComponent || checkComponentType || checkEquipment || checkObjectType || checkStartDate || checkEndDate || checkComponentTypeTo || checkComponentTo || checkEquipmentTo || checkObjectTypeTo || checkStartDateTo || checkEndDateTo) {
        await this.getData();
      }
    },
    resetState() {
      this.stateFilterData = {
        ComponentType: "",
        Component: "",
        Equipment: "",
        ObjectType: "",
        ComponentTypeTo: "",
        ComponentTo: "",
        EquipmentTo: "",
        StartDateTo: "",
        EndDateTo: "",
        ObjectTypeTo: "",
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
