import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  CRUD_API_URL,
  EXPORT_API_URL,
  LOOKUP_API_URL,
} from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/task/daily-schedule-v1/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/task/daily-schedule-v1/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/task/daily-schedule-v1/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption } from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

export const useDailyScheduleListStore = defineStore({
  id: "dailyscheduleListV1",
  state: () => {
    return {
      stateFilterData: {
        UnitNumber: "",
        SmuDue: "",
        WorkOrder: "",
        PsType: "",
        DateService: "",
        Shift: "",
        StartDate: "",
        EndDate: "",
        UnitNumberTo: "",
        SmuDueTo: "",
        WorkOrderTo: "",
        PsTypeTo: "",
        DateServiceTo: "",
        ShiftTo: "",
        StartDateTo: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "dateService_asc",
        ver: "v1",
      } as FilterData,
      stateLastUsedFilterData: {
        UnitNumber: "",
        SmuDue: "",
        WorkOrder: "",
        PsType: "",
        DateService: "",
        Shift: "",
        StartDate: "",
        EndDate: "",
        UnitNumberTo: "",
        SmuDueTo: "",
        WorkOrderTo: "",
        PsTypeTo: "",
        DateServiceTo: "",
        ShiftTo: "",
        StartDateTo: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "dateService_asc",
        ver: "v1",
      } as FilterData,
      statePageName: "dailyschedule",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      statePsTypeOption: [] as Option[],
      stateShiftOption: [] as Option[],
      stateSmuDueOption: [] as Option[],
      stateUnitNumberOption: [] as Option[],
      stateWorkOrderOption: [] as Option[],
    };
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
      return state.stateLastUsedFilterData;
    },
    loading: (state) => {
      return state.stateLoading;
    },
    paginationLoading: (state) => {
      return state.statePaginationLoading;
    },
    psTypeOption: (state) => {
      return state.statePsTypeOption;
    },
    shiftOption: (state) => {
      return state.stateShiftOption;
    },
    smuDueOption: (state) => {
      return state.stateSmuDueOption;
    },
    unitNumberOption: (state) => {
      return state.stateUnitNumberOption;
    },
    workOrderOption: (state) => {
      return state.stateWorkOrderOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        UnitNumber: this.stateFilterData.UnitNumber,
        SmuDue: this.stateFilterData.SmuDue,
        PsType: this.stateFilterData.PsType,
        WorkOrder: this.stateFilterData.WorkOrder,
        DateService: this.stateFilterData.DateService
          ? formatDateForPostData(this.stateFilterData.DateService)
          : "",
        Shift: this.stateFilterData.Shift,
        StartDate: this.stateFilterData.StartDate
          ? formatDateForPostData(this.stateFilterData.StartDate)
          : "",
        EndDate: this.stateFilterData.EndDate
          ? formatDateForPostData(this.stateFilterData.EndDate)
          : "",
        UnitNumberTo: this.stateFilterData.UnitNumberTo,
        SmuDueTo: this.stateFilterData.SmuDueTo,
        WorkOrderTo: this.stateFilterData.WorkOrderTo,
        PsTypeTo: this.stateFilterData.PsTypeTo,
        DateServiceTo: this.stateFilterData.DateServiceTo
          ? formatDateForPostData(this.stateFilterData.DateServiceTo)
          : "",
        ShiftTo: this.stateFilterData.ShiftTo,
        StartDateTo: this.stateFilterData.StartDateTo
          ? formatDateForPostData(this.stateFilterData.StartDateTo)
          : "",
        EndDateTo: this.stateFilterData.EndDateTo
          ? formatDateForPostData(this.stateFilterData.EndDateTo)
          : "",
        Page: this.stateFilterData.Page.toString(),
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
        ver: this.stateFilterData.ver,
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]];
        const response: AxiosResponse<ApiResponse<ListItem>> =
          await ApiService.get(
            CRUD_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateDisplayData = response.data.result.content;
        this.setTotalPage(response.data.result.total);
        this.stateLastUsedFilterData = {
          ...this.stateFilterData,
        } as FilterData;
      } catch (error) {
        console.log(error);
      }
      this.stateLoading = false;
    },
    async getLookup() {
      const params = {
        ver: this.stateFilterData.ver,
        DateService: this.stateFilterData.DateService
          ? formatDateForPostData(this.stateFilterData.DateService)
          : "",
        DateServiceTo: this.stateFilterData.DateServiceTo
          ? formatDateForPostData(this.stateFilterData.DateServiceTo)
          : "",
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> =
          await ApiService.get(
            LOOKUP_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateUnitNumberOption = mapOption(response.data.result.content.unitNumber)
        this.statePsTypeOption = mapOption(response.data.result.content.psType)
        this.stateShiftOption = mapOption(response.data.result.content.shift)
        this.stateSmuDueOption = mapOption(response.data.result.content.smuDue)
        this.stateWorkOrderOption = mapOption(response.data.result.content.workOrder)
      } catch (error) {
        console.log(error);
      }
    },
    async export() {
      const params = {
        UnitNumber: this.stateFilterData.UnitNumber,
        SmuDue: this.stateFilterData.SmuDue,
        PsType: this.stateFilterData.PsType,
        WorkOrder: this.stateFilterData.WorkOrder,
        DateService: this.stateFilterData.DateService
          ? formatDateForPostData(this.stateFilterData.DateService)
          : "",
        Shift: this.stateFilterData.Shift,
        StartDate: this.stateFilterData.StartDate
          ? formatDateForPostData(this.stateFilterData.StartDate)
          : "",
        EndDate: this.stateFilterData.EndDate
          ? formatDateForPostData(this.stateFilterData.EndDate)
          : "",
        UnitNumberTo: this.stateFilterData.UnitNumberTo,
        SmuDueTo: this.stateFilterData.SmuDueTo,
        PsTypeTo: this.stateFilterData.PsTypeTo,
        WorkOrderTo: this.stateFilterData.WorkOrderTo,
        DateServiceTo: this.stateFilterData.DateServiceTo
          ? formatDateForPostData(this.stateFilterData.DateServiceTo)
          : "",
        ShiftTo: this.stateFilterData.ShiftTo,
        StartDateTo: this.stateFilterData.StartDateTo
          ? formatDateForPostData(this.stateFilterData.StartDateTo)
          : "",
        EndDateTo: this.stateFilterData.EndDateTo
          ? formatDateForPostData(this.stateFilterData.EndDateTo)
          : "",
        Page: this.stateFilterData.Page.toString(),
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
        ver: this.stateFilterData.ver,
        Gmt: new Date().toTimeString().slice(12, 17),
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.getBlob(
          EXPORT_API_URL,
          "",
          new URLSearchParams(params).toString(),
        );
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
      }, 200);
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
    setSmuDue(value: string) {
      this.stateFilterData.SmuDue = value;
    },
    setWorkOrder(value: string) {
      this.stateFilterData.WorkOrder = value;
    },
    setPsType(value: string) {
      this.stateFilterData.PsType = value;
    },
    setDateService(value: string) {
      this.stateFilterData.DateService = value;
    },
    setShift(value: string) {
      this.stateFilterData.Shift = value;
    },
    setStartDate(value: string) {
      this.stateFilterData.StartDate = value;
    },
    setEndDate(value: string) {
      this.stateFilterData.EndDate = value;
    },
    setUnitNumberTo(value: string) {
      this.stateFilterData.UnitNumberTo = value;
    },
    setSmuDueTo(value: string) {
      this.stateFilterData.SmuDueTo = value;
    },
    setWorkOrderTo(value: string) {
      this.stateFilterData.WorkOrderTo = value;
    },
    setPsTypeTo(value: string) {
      this.stateFilterData.PsTypeTo = value;
    },
    setDateServiceTo(value: string) {
      this.stateFilterData.DateServiceTo = value;
    },
    setShiftTo(value: string) {
      this.stateFilterData.ShiftTo = value;
    },
    setStartDateTo(value: string) {
      this.stateFilterData.StartDateTo = value;
    },
    setEndDateTo(value: string) {
      this.stateFilterData.EndDateTo = value;
    },
    async resetFilter() {
      this.stateFilterData.UnitNumber = "";
      this.stateFilterData.SmuDue = "";
      this.stateFilterData.WorkOrder = "";
      this.stateFilterData.PsType = "";
      this.stateFilterData.Shift = "";
      this.stateFilterData.DateService = "";
      this.stateFilterData.StartDate = "";
      this.stateFilterData.EndDate = "";
      this.stateFilterData.UnitNumberTo = "";
      this.stateFilterData.SmuDueTo = "";
      this.stateFilterData.WorkOrderTo = "";
      this.stateFilterData.PsTypeTo = "";
      this.stateFilterData.ShiftTo = "";
      this.stateFilterData.DateServiceTo = "";
      this.stateFilterData.StartDateTo = "";
      this.stateFilterData.EndDateTo = "";
      const checkUnitNumber = this.stateLastUsedFilterData.UnitNumber !== "";
      const checkSmuDue = this.stateLastUsedFilterData.SmuDue !== "";
      const checkWorkOrder = this.stateLastUsedFilterData.WorkOrder !== "";
      const checkPsType = this.stateLastUsedFilterData.PsType !== "";
      const checkDateService = this.stateLastUsedFilterData.DateService !== "";
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== "";
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== "";
      const checkUnitNumberTo = this.stateLastUsedFilterData.UnitNumberTo !== "";
      const checkSmuDueTo = this.stateLastUsedFilterData.SmuDueTo !== "";
      const checkWorkOrderTo = this.stateLastUsedFilterData.WorkOrderTo !== "";
      const checkPsTypeTo = this.stateLastUsedFilterData.PsTypeTo !== "";
      const checkShift = this.stateLastUsedFilterData.Shift !== "";
      const checkShiftTo = this.stateLastUsedFilterData.ShiftTo !== "";
      const checkDateServiceTo = this.stateLastUsedFilterData.DateServiceTo !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== "";
      if (
        checkUnitNumber ||
        checkSmuDue ||
        checkWorkOrder ||
        checkPsType ||
        checkStartDate ||
        checkEndDate ||
        checkUnitNumberTo ||
        checkSmuDueTo ||
        checkWorkOrderTo ||
        checkPsTypeTo ||
        checkStartDateTo ||
        checkEndDateTo ||
        checkShift ||
        checkShiftTo ||
        checkDateService ||
        checkDateServiceTo
      ) {
        await this.getData();
      }
    },
    resetState() {
      this.stateFilterData = {
        UnitNumber: "",
        SmuDue: "",
        WorkOrder: "",
        PsType: "",
        DateService: "",
        Shift: "",
        StartDate: "",
        EndDate: "",
        UnitNumberTo: "",
        SmuDueTo: "",
        WorkOrderTo: "",
        PsTypeTo: "",
        DateServiceTo: "",
        ShiftTo: "",
        StartDateTo: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "dateService_asc",
        ver: "v1",
      } as FilterData;
      this.stateDisplayData = [] as ListItem[];
      this.statePagination = new PaginationType();
      this.stateLoading = false;
      this.statePaginationLoading = false;
    },
  },
});
