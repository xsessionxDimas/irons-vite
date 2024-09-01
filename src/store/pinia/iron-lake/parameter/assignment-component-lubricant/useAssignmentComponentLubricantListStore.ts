import PaginationType from "@/core/types/misc/Pagination";
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
} from "@/core/types/entities/iron-lake/parameter/assignment-component-lubricant/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/assignment-component-lubricant/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/parameter/assignment-component-lubricant/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  mapOption,
} from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

const initialFilter = {
  EquipmentModel: "",
  EquipmentModelTo: "",
  PsType: "",
  PsTypeTo: "",
  Component: "",
  ComponentTo: "",
  RecomLubricant: "",
  RecomLubricantTo: "",
  Value: "",
  ValueTo: "",
  Uom: "",
  UomTo: "",
  TaskNo: "",
  TaskNoTo: "",
  StartDate: "",
  StartDateTo: "",
  EndDate: "",
  EndDateTo: "",
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: ""
};

export const useAssignmentComponentLubricantListStore = defineStore({
  id: "AssignmentcomponentLubricant",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "assignmentcomponentLubricant",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      // Lookup
      stateEquipmentModelOption: [] as any[],
      statePsTypeOption: [] as any[],
      stateComponentOption: [] as any[],
      stateRecomLubricantOption: [] as any[],
      stateValueOption: [] as any[],
      stateUomOption: [] as any[],
      stateTaskNoOption: [] as any[],
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
      return state.stateEquipmentModelOption
    },
    psTypeOption: (state) => {
      return state.statePsTypeOption
    },
    componentOption: (state) => {
      return state.stateComponentOption
    },
    recomLubricantOption: (state) => {
      return state.stateRecomLubricantOption
    },
    valueOption: (state) => {
      return state.stateValueOption
    },
    uomOption: (state) => {
      return state.stateUomOption
    },
    taskNoOption: (state) => {
      return state.stateTaskNoOption
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        EquipmentModel: this.stateFilterData.EquipmentModel,
        EquipmentModelTo: this.stateFilterData.EquipmentModelTo,
        PsType: this.stateFilterData.PsType,
        PsTypeTo: this.stateFilterData.PsTypeTo,
        Component: this.stateFilterData.Component,
        ComponentTo: this.stateFilterData.ComponentTo,
        RecomLubricant: this.stateFilterData.RecomLubricant,
        RecomLubricantTo: this.stateFilterData.RecomLubricantTo,
        Value: this.stateFilterData.Value,
        ValueTo: this.stateFilterData.ValueTo,
        Uom: this.stateFilterData.Uom,
        UomTo: this.stateFilterData.UomTo,
        TaskNo: this.stateFilterData.TaskNo,
        TaskNoTo: this.stateFilterData.TaskNoTo,
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
        this.stateEquipmentModelOption = mapOption(response.data.result.content.equipmentModel)
        this.statePsTypeOption = mapOption(response.data.result.content.psType)
        this.stateComponentOption = mapOption(response.data.result.content.component)
        this.stateRecomLubricantOption = mapOption(response.data.result.content.recomendedLubricant)
        this.stateValueOption = mapOption(response.data.result.content.value)
        this.stateUomOption = mapOption(response.data.result.content.uom)
        this.stateTaskNoOption = mapOption(response.data.result.content.taskNo)
      } catch (error) {
        console.log(error)
      }
    },
    async export() {
      const params = {
        EquipmentModel: this.stateFilterData.EquipmentModel,
        EquipmentModelTo: this.stateFilterData.EquipmentModelTo,
        PsType: this.stateFilterData.PsType,
        PsTypeTo: this.stateFilterData.PsTypeTo,
        Component: this.stateFilterData.Component,
        ComponentTo: this.stateFilterData.ComponentTo,
        RecomLubricant: this.stateFilterData.RecomLubricant,
        RecomLubricantTo: this.stateFilterData.RecomLubricantTo,
        Value: this.stateFilterData.Value,
        ValueTo: this.stateFilterData.ValueTo,
        Uom: this.stateFilterData.Uom,
        UomTo: this.stateFilterData.UomTo,
        TaskNo: this.stateFilterData.TaskNo,
        TaskNoTo: this.stateFilterData.TaskNoTo,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate) : "",
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(this.stateFilterData.StartDateTo) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate) : "",
        EndDateTo: this.stateFilterData.EndDateTo ? formatDateForPostData(this.stateFilterData.EndDateTo) : "",
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
      this.stateFilterData.EquipmentModel = value
    },
    setEquipmentModelTo(value: string) {
      this.stateFilterData.EquipmentModelTo = value
    },
    setPsType(value: string) {
      this.stateFilterData.PsType = value
    },
    setPsTypeTo(value: string) {
      this.stateFilterData.PsTypeTo = value
    },
    setComponent(value: string) {
      this.stateFilterData.Component = value
    },
    setComponentTo(value: string) {
      this.stateFilterData.ComponentTo = value
    },
    setRecomLubricant(value: string) {
      this.stateFilterData.RecomLubricant = value
    },
    setRecomLubricantTo(value: string) {
      this.stateFilterData.RecomLubricantTo = value
    },
    setValue(value: string) {
      this.stateFilterData.Value = value
    },
    setValueTo(value: string) {
      this.stateFilterData.ValueTo = value
    },
    setUom(value: string) {
      this.stateFilterData.Uom = value
    },
    setUomTo(value: string) {
      this.stateFilterData.UomTo = value
    },
    setTaskNo(value: string) {
      this.stateFilterData.TaskNo = value
    },
    setTaskNoTo(value: string) {
      this.stateFilterData.TaskNoTo = value
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
      this.stateFilterData.PsType = ""
      this.stateFilterData.PsTypeTo = ""
      this.stateFilterData.Component = ""
      this.stateFilterData.ComponentTo = ""
      this.stateFilterData.RecomLubricant = ""
      this.stateFilterData.RecomLubricantTo = ""
      this.stateFilterData.Value = ""
      this.stateFilterData.ValueTo = ""
      this.stateFilterData.Uom = ""
      this.stateFilterData.UomTo = ""
      this.stateFilterData.TaskNo = ""
      this.stateFilterData.TaskNoTo = ""
      this.stateFilterData.Component = ""
      this.stateFilterData.ComponentTo = ""
      this.stateFilterData.StartDate = ""
      this.stateFilterData.StartDateTo = ""
      this.stateFilterData.EndDate = ""
      this.stateFilterData.EndDateTo = ""
      const checkEquipmentModel = this.stateLastUsedFilterData.EquipmentModel !== ""
      const checkEquipmentModelTo = this.stateLastUsedFilterData.EquipmentModelTo !== ""
      const checkPsType = this.stateLastUsedFilterData.PsType !== ""
      const checkPsTypeTo = this.stateLastUsedFilterData.PsTypeTo !== ""
      const checkComponent = this.stateLastUsedFilterData.Component !== ""
      const checkComponentTo = this.stateLastUsedFilterData.ComponentTo !== ""
      const checkRecomLubricant = this.stateLastUsedFilterData.RecomLubricant !== ""
      const checkRecomLubricantTo = this.stateLastUsedFilterData.RecomLubricantTo !== ""
      const checkValue = this.stateLastUsedFilterData.Value !== ""
      const checkValueTo = this.stateLastUsedFilterData.ValueTo !== ""
      const checkUom = this.stateLastUsedFilterData.Uom !== ""
      const checkUomTo = this.stateLastUsedFilterData.UomTo !== ""
      const checkTaskNo = this.stateLastUsedFilterData.TaskNo !== ""
      const checkTaskNoTo = this.stateLastUsedFilterData.TaskNoTo !== ""
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== ""
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== ""
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== ""
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== ""
      if (checkEquipmentModel || checkEquipmentModelTo || checkPsType || checkPsTypeTo || checkComponent || checkComponentTo || checkRecomLubricant || checkRecomLubricantTo || checkValue || checkValueTo || checkUom || checkUomTo || checkTaskNo || checkTaskNoTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
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
