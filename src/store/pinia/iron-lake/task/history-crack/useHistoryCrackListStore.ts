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
} from "@/core/types/entities/iron-lake/task/history-crack/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/task/history-crack/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/task/history-crack/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  mapOption,
} from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

const initialFilter = {
  UnitNumber: "",
  UnitNumberTo: "",
  SmuDue: "",
  SmuDueTo: "",
  WorkOrder: "",
  WorkOrderTo: "",
  PsType: "",
  PsTypeTo: "",
  DateService: "",
  DateServiceTo: "",
  Model: "",
  ModelTo: "",
  LastPsType: "",
  LastPsTypeTo: "",
  LastDateService: "",
  LastDateServiceTo: "",
  LastWorkOrder: "",
  LastWorkOrderTo: "",
  TaskNumberDetail: "",
  TaskNumberDetailTo: "",
  LocationId: "",
  LocationIdTo: "",
  LastTaskNumberDetail: "",
  LastTaskNumberDetailTo: "",
  LastLocationId: "",
  LastLocationIdTo: "",
  StartDate: "",
  StartDateTo: "",
  EndDate: "",
  EndDateTo: "",
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: ""
};

export const useHistoryCrackListStore = defineStore({
  id: "historycrack",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "historycrack",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      // Lookup
      stateUnitNumberOption: [] as Option[],
      stateSmuDueOption: [] as Option[],
      stateWorkOrderOption: [] as Option[],
      statePsTypeOption: [] as Option[],
      stateModelOption: [] as Option[],
      stateLastPsTypeOption: [] as Option[],
      stateLastWorkOrderOption: [] as Option[],
      stateTaskNumberDetailOption: [] as Option[],
      stateLocationIdOption: [] as Option[],
      stateLastTaskNumberDetailOption: [] as Option[],
      stateLastLocationIdOption: [] as Option[],
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
    unitNumberOption: (state) => {
      return state.stateUnitNumberOption;
    },
    smuDueOption: (state) => {
      return state.stateSmuDueOption;
    },
    workOrderOption: (state) => {
      return state.stateWorkOrderOption;
    },
    psTypeOption: (state) => {
      return state.statePsTypeOption;
    },
    modelOption: (state) => {
      return state.stateModelOption;
    },
    lastPsTypeOption: (state) => {
      return state.stateLastPsTypeOption;
    },
    lastWorkOrderOption: (state) => {
      return state.stateLastWorkOrderOption;
    },
    taskNumberDetailOption: (state) => {
      return state.stateTaskNumberDetailOption;
    },
    locationIdOption: (state) => {
      return state.stateLocationIdOption;
    },
    lastTaskNumberDetailOption: (state) => {
      return state.stateLastTaskNumberDetailOption;
    },
    lastLocationIdOption: (state) => {
      return state.stateLastLocationIdOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        UnitNumber: this.stateFilterData.UnitNumber,
        UnitNumberTo: this.stateFilterData.UnitNumberTo,
        SmuDue: this.stateFilterData.SmuDue,
        SmuDueTo: this.stateFilterData.SmuDueTo,
        WorkOrder: this.stateFilterData.WorkOrder,
        WorkOrderTo: this.stateFilterData.WorkOrderTo,
        PsType: this.stateFilterData.PsType,
        PsTypeTo: this.stateFilterData.PsTypeTo,
        DateService: this.stateFilterData.DateService,
        DateServiceTo: this.stateFilterData.DateServiceTo,
        Model: this.stateFilterData.Model,
        ModelTo: this.stateFilterData.ModelTo,
        LastPsType: this.stateFilterData.LastPsType,
        LastPsTypeTo: this.stateFilterData.LastPsTypeTo,
        LastDateService: this.stateFilterData.LastDateService,
        LastDateServiceTo: this.stateFilterData.LastDateServiceTo,
        LastWorkOrder: this.stateFilterData.LastWorkOrder,
        LastWorkOrderTo: this.stateFilterData.LastWorkOrderTo,
        TaskNumberDetail: this.stateFilterData.TaskNumberDetail,
        TaskNumberDetailTo: this.stateFilterData.TaskNumberDetailTo,
        LocationId: this.stateFilterData.LocationId,
        LocationIdTo: this.stateFilterData.LocationIdTo,
        LastTaskNumberDetail: this.stateFilterData.LastTaskNumberDetail,
        LastTaskNumberDetailTo: this.stateFilterData.LastTaskNumberDetailTo,
        LastLocationId: this.stateFilterData.LastLocationId,
        LastLocationIdTo: this.stateFilterData.LastLocationIdTo,
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
        this.stateUnitNumberOption = mapOption(response.data.result.content.unitNumber);
        this.stateSmuDueOption = mapOption(response.data.result.content.smuDue);
        this.stateWorkOrderOption = mapOption(response.data.result.content.workOrder);
        this.statePsTypeOption = mapOption(response.data.result.content.psType);
        this.stateModelOption = mapOption(response.data.result.content.model);
        this.stateLastPsTypeOption = mapOption(response.data.result.content.lastPsType);
        this.stateLastWorkOrderOption = mapOption(response.data.result.content.lastWorkOrder);
        this.stateTaskNumberDetailOption = mapOption(response.data.result.content.taskNumberDetail);
        this.stateLocationIdOption = mapOption(response.data.result.content.locationId);
        this.stateLastTaskNumberDetailOption = mapOption(response.data.result.content.lastTaskNumberDetail);
        this.stateLastLocationIdOption = mapOption(response.data.result.content.lastLocationId);
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
    setUnitNumber(value: string) {
      this.stateFilterData.UnitNumber = value;
    },
    setUnitNumberTo(value: string) {
      this.stateFilterData.UnitNumberTo = value;
    },
    setSmuDue(value: string) {
      this.stateFilterData.SmuDue = value;
    },
    setSmuDueTo(value: string) {
      this.stateFilterData.SmuDueTo = value;
    },
    setWorkOrder(value: string) {
      this.stateFilterData.WorkOrder = value;
    },
    setWorkOrderTo(value: string) {
      this.stateFilterData.WorkOrderTo = value;
    },
    setPsType(value: string) {
      this.stateFilterData.PsType = value;
    },
    setPsTypeTo(value: string) {
      this.stateFilterData.PsTypeTo = value;
    },
    setDateService(value: string) {
      this.stateFilterData.DateService = value;
    },
    setDateServiceTo(value: string) {
      this.stateFilterData.DateServiceTo = value;
    },
    setModel(value: string) {
      this.stateFilterData.Model = value;
    },
    setModelTo(value: string) {
      this.stateFilterData.ModelTo = value;
    },
    setLastPsType(value: string) {
      this.stateFilterData.LastPsType = value;
    },
    setLastPsTypeTo(value: string) {
      this.stateFilterData.LastPsTypeTo = value;
    },
    setLastDateService(value: string) {
      this.stateFilterData.LastDateService = value;
    },
    setLastDateServiceTo(value: string) {
      this.stateFilterData.LastDateServiceTo = value;
    },
    setLastWorkOrder(value: string) {
      this.stateFilterData.LastWorkOrder = value;
    },
    setLastWorkOrderTo(value: string) {
      this.stateFilterData.LastWorkOrderTo = value;
    },
    setTaskNumberDetail(value: string) {
      this.stateFilterData.TaskNumberDetail = value;
    },
    setTaskNumberDetailTo(value: string) {
      this.stateFilterData.TaskNumberDetailTo = value;
    },
    setLocationId(value: string) {
      this.stateFilterData.LocationId = value;
    },
    setLocationIdTo(value: string) {
      this.stateFilterData.LocationIdTo = value;
    },
    setLastTaskNumberDetail(value: string) {
      this.stateFilterData.LastTaskNumberDetail = value;
    },
    setLastTaskNumberDetailTo(value: string) {
      this.stateFilterData.LastTaskNumberDetailTo = value;
    },
    setLastLocationId(value: string) {
      this.stateFilterData.LastLocationId = value;
    },
    setLastLocationIdTo(value: string) {
      this.stateFilterData.LastLocationIdTo = value;
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
      this.stateFilterData.UnitNumber = "";
      this.stateFilterData.UnitNumberTo = "";
      this.stateFilterData.SmuDue = "";
      this.stateFilterData.SmuDueTo = "";
      this.stateFilterData.WorkOrder = "";
      this.stateFilterData.WorkOrderTo = "";
      this.stateFilterData.PsType = "";
      this.stateFilterData.PsTypeTo = "";
      this.stateFilterData.DateService = "";
      this.stateFilterData.DateServiceTo = "";
      this.stateFilterData.Model = "";
      this.stateFilterData.ModelTo = "";
      this.stateFilterData.LastPsType = "";
      this.stateFilterData.LastPsTypeTo = "";
      this.stateFilterData.LastDateService = "";
      this.stateFilterData.LastDateServiceTo = "";
      this.stateFilterData.LastWorkOrder = "";
      this.stateFilterData.LastWorkOrderTo = "";
      this.stateFilterData.TaskNumberDetail = "";
      this.stateFilterData.TaskNumberDetailTo = "";
      this.stateFilterData.LocationId = "";
      this.stateFilterData.LocationIdTo = "";
      this.stateFilterData.LastTaskNumberDetail = "";
      this.stateFilterData.LastTaskNumberDetailTo = "";
      this.stateFilterData.LastLocationId = "";
      this.stateFilterData.LastLocationIdTo = "";
      this.stateFilterData.StartDate = "";
      this.stateFilterData.StartDateTo = "";
      this.stateFilterData.EndDate = "";
      this.stateFilterData.EndDateTo = "";
      const checkUnitNumber = this.stateLastUsedFilterData.UnitNumber !== "";
      const checkUnitNumberTo = this.stateLastUsedFilterData.UnitNumberTo !== "";
      const checkSmuDue = this.stateLastUsedFilterData.SmuDue !== "";
      const checkSmuDueTo = this.stateLastUsedFilterData.SmuDueTo !== "";
      const checkWorkOrder = this.stateLastUsedFilterData.WorkOrder !== "";
      const checkWorkOrderTo = this.stateLastUsedFilterData.WorkOrderTo !== "";
      const checkPsType = this.stateLastUsedFilterData.PsType !== "";
      const checkPsTypeTo = this.stateLastUsedFilterData.PsTypeTo !== "";
      const checkDateService = this.stateLastUsedFilterData.DateService !== "";
      const checkDateServiceTo = this.stateLastUsedFilterData.DateServiceTo !== "";
      const checkModel = this.stateLastUsedFilterData.Model !== "";
      const checkModelTo = this.stateLastUsedFilterData.ModelTo !== "";
      const checkLastPsType = this.stateLastUsedFilterData.LastPsType !== "";
      const checkLastPsTypeTo = this.stateLastUsedFilterData.LastPsTypeTo !== "";
      const checkLastDateService = this.stateLastUsedFilterData.LastDateService !== "";
      const checkLastDateServiceTo = this.stateLastUsedFilterData.LastDateServiceTo !== "";
      const checkLastWorkOrder = this.stateLastUsedFilterData.LastWorkOrder !== "";
      const checkLastWorkOrderTo = this.stateLastUsedFilterData.LastWorkOrderTo !== "";
      const checkTaskNumberDetail = this.stateLastUsedFilterData.TaskNumberDetail !== "";
      const checkTaskNumberDetailTo = this.stateLastUsedFilterData.TaskNumberDetailTo !== "";
      const checkLocationId = this.stateLastUsedFilterData.LocationId !== "";
      const checkLocationIdTo = this.stateLastUsedFilterData.LocationIdTo !== "";
      const checkLastTaskNumberDetail = this.stateLastUsedFilterData.LastTaskNumberDetail !== "";
      const checkLastTaskNumberDetailTo = this.stateLastUsedFilterData.LastTaskNumberDetailTo !== "";
      const checkLastLocationId = this.stateLastUsedFilterData.LastLocationId !== "";
      const checkLastLocationIdTo = this.stateLastUsedFilterData.LastLocationIdTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== "";
      if (checkUnitNumber || checkUnitNumberTo || checkSmuDue || checkSmuDueTo || checkWorkOrder || checkWorkOrderTo || checkPsType || checkPsTypeTo || checkDateService || checkDateServiceTo || checkModel || checkModelTo || checkLastPsType || checkLastPsTypeTo || checkLastDateService || checkLastDateServiceTo || checkLastWorkOrder || checkLastWorkOrderTo || checkTaskNumberDetail || checkTaskNumberDetailTo || checkLocationId || checkLocationIdTo || checkLastTaskNumberDetail || checkLastTaskNumberDetailTo || checkLastLocationId || checkLastLocationIdTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
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
