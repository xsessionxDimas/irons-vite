import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  CRUD_URL,
  LOOKUP_API_URL,
  EXPORT_API_URL,
} from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/crack-assignment/task-crack/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/crack-assignment/task-crack/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/crack-assignment/task-crack/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

export const useTaskCrackListStore = defineStore({
  id: "TaskCrackList",
  state: () => {
    return {
      stateFilterData: {
        EquipmentModel: "",
        PsType: "",
        TaskNo: "",
        TaskCrackCode: "",
        LocationId: "",
        StartDate: "",
        EndDate: "",
        EquipmentModelTo: "",
        PsTypeTo: "",
        Uom: "",
        UomTo: "",
        TaskNoTo: "",
        TaskCrackCodeTo: "",
        LocationIdTo: "",
        StartDateTo: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1",
      } as FilterData,
      stateLastUsedFilterData: {
        EquipmentModel: "",
        PsType: "",
        TaskNo: "",
        TaskCrackCode: "",
        LocationId: "",
        StartDate: "",
        EndDate: "",
        EquipmentModelTo: "",
        PsTypeTo: "",
        TaskNoTo: "",
        Uom: "",
        UomTo: "",
        TaskCrackCodeTo: "",
        LocationIdTo: "",
        StartDateTo: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1",
      } as FilterData,
      statePageName: "taskcrack",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateEquipmentModelOption: [] as Option[],
      statePsTypeOption: [] as Option[],
      stateTaskNoOption: [] as Option[],
      stateTaskCrackCodeOption: [] as Option[],
      stateLocationIdOption: [] as Option[],
      stateUomOption: [] as Option[]
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
    EquipmentModelOption: (state) => {
      return state.stateEquipmentModelOption
    },
    PsTypeOption: (state) => {
      return state.statePsTypeOption
    },
    TaskNoOption: (state) => {
      return state.stateTaskNoOption
    },
    TaskCrackCodeOption: (state) => {
      return state.stateTaskCrackCodeOption
    },
    LocationIdOption: (state) => {
      return state.stateLocationIdOption
    },
    UomOption: (state) => {
      return state.stateUomOption
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const payload = {
        EquipmentModel: this.stateFilterData.EquipmentModel,
        PsType: this.stateFilterData.PsType,
        TaskNo: this.stateFilterData.TaskNo,
        TaskCrackCode: this.stateFilterData.TaskCrackCode,
        LocationId: this.stateFilterData.LocationId,
        EquipmentModelTo: this.stateFilterData.EquipmentModelTo,
        PsTypeTo: this.stateFilterData.PsTypeTo,
        TaskNoTo: this.stateFilterData.TaskNoTo,
        TaskCrackCodeTo: this.stateFilterData.TaskCrackCodeTo,
        LocationIdTo: this.stateFilterData.LocationIdTo,
        Uom: this.stateFilterData.Uom,
        UomTo: this.stateFilterData.UomTo,
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
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(CRUD_URL, "", new URLSearchParams(payload).toString());
        this.stateDisplayData = response.data.result.content;
        this.setTotalPage(response.data.result.total || response.data.result["totalData"]);
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
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.get(`${LOOKUP_API_URL}?${new URLSearchParams(params).toString()}`);
        this.stateEquipmentModelOption = mapOption(response.data.result.content.equipmentModel)
        this.statePsTypeOption = mapOption(response.data.result.content.psType)
        this.stateTaskNoOption = mapOption(response.data.result.content.taskNo)
        this.stateTaskCrackCodeOption = mapOption(response.data.result.content.taskCrackCode)
        this.stateLocationIdOption = mapOption(response.data.result.content.locationId)
        this.stateUomOption = mapOption(response.data.result.content.uom)
      } catch (error) {
        console.log(error);
      }
    },
    async export() {
      const params = {
        EquipmentModel: this.stateFilterData.EquipmentModel,
        PsType: this.stateFilterData.PsType,
        TaskNo: this.stateFilterData.TaskNo,
        TaskCrackCode: this.stateFilterData.TaskCrackCode,
        LocationId: this.stateFilterData.LocationId,
        EquipmentModelTo: this.stateFilterData.EquipmentModelTo,
        PsTypeTo: this.stateFilterData.PsTypeTo,
        TaskNoTo: this.stateFilterData.TaskNoTo,
        TaskCrackCodeTo: this.stateFilterData.TaskCrackCodeTo,
        LocationIdTo: this.stateFilterData.LocationIdTo,
        Uom: this.stateFilterData.Uom,
        UomTo: this.stateFilterData.UomTo,
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
        const response: AxiosResponse<Blob> = await ApiService.getBlob(`${EXPORT_API_URL}?${new URLSearchParams(params).toString()}`);
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
    setPsType(value: string) {
      this.stateFilterData.PsType = value
    },
    setTaskNo(value: string) {
      this.stateFilterData.TaskNo = value
    },
    setTaskCrackCode(value: string) {
      this.stateFilterData.TaskCrackCode = value
    },
    setLocationId(value: string) {
      this.stateFilterData.LocationId = value
    },
    setUom(value: string) {
      this.stateFilterData.Uom = value
    },
    setUomTo(value: string) {
      this.stateFilterData.UomTo = value
    },
    setStartDate(value: string) {
      this.stateFilterData.StartDate = value
    },
    setEndDate(value: string) {
      this.stateFilterData.EndDate = value
    },
    setEquipmentModelTo(value: string) {
      this.stateFilterData.EquipmentModelTo = value
    },
    setPsTypeTo(value: string) {
      this.stateFilterData.PsTypeTo = value
    },
    setTaskNoTo(value: string) {
      this.stateFilterData.TaskNoTo = value
    },
    setTaskCrackCodeTo(value: string) {
      this.stateFilterData.TaskCrackCodeTo = value
    },
    setLocationIdTo(value: string) {
      this.stateFilterData.LocationIdTo = value
    },
    setStartDateTo(value: string) {
      this.stateFilterData.StartDateTo = value
    },
    setEndDateTo(value: string) {
      this.stateFilterData.EndDateTo = value
    },
    async resetFilter() {
      this.stateFilterData.EquipmentModel = ""
      this.stateFilterData.Uom = ""
      this.stateFilterData.PsType = ""
      this.stateFilterData.TaskNo = ""
      this.stateFilterData.TaskCrackCode = ""
      this.stateFilterData.LocationId = ""
      this.stateFilterData.StartDate = ""
      this.stateFilterData.EndDate = ""
      this.stateFilterData.EquipmentModelTo = ""
      this.stateFilterData.PsTypeTo = ""
      this.stateFilterData.TaskNoTo = ""
      this.stateFilterData.TaskCrackCodeTo = ""
      this.stateFilterData.LocationIdTo = ""
      this.stateFilterData.StartDateTo = ""
      this.stateFilterData.EndDateTo = ""
      this.stateFilterData.UomTo = ""
      const checkEquipmentModel = this.stateLastUsedFilterData.EquipmentModel !== ""
      const checkPsType = this.stateLastUsedFilterData.PsType !== ""
      const checkTaskNo = this.stateLastUsedFilterData.TaskNo !== ""
      const checkTaskCrackCode = this.stateLastUsedFilterData.TaskCrackCode !== ""
      const checkLocationId = this.stateLastUsedFilterData.LocationId !== ""
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== ""
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== ""
      const checkEquipmentModelTo = this.stateLastUsedFilterData.EquipmentModelTo !== ""
      const checkPsTypeTo = this.stateLastUsedFilterData.PsTypeTo !== ""
      const checkTaskNoTo = this.stateLastUsedFilterData.TaskNoTo !== ""
      const checkTaskCrackCodeTo = this.stateLastUsedFilterData.TaskCrackCodeTo !== ""
      const checkLocationIdTo = this.stateLastUsedFilterData.LocationIdTo !== ""
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== ""
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== ""
      const checkUom = this.stateLastUsedFilterData.Uom !== ""
      const checkUomTo = this.stateLastUsedFilterData.UomTo !== ""
      if (checkEquipmentModel || checkPsType || checkTaskNo || checkTaskCrackCode || checkLocationId || checkStartDate || checkEndDate || checkEquipmentModelTo || checkPsTypeTo || checkTaskNoTo || checkTaskCrackCodeTo || checkLocationIdTo || checkStartDateTo || checkEndDateTo || checkUom || checkUomTo) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        EquipmentModel: "",
        Uom: "",
        UomTo: "",
        PsType: "",
        TaskNo: "",
        TaskCrackCode: "",
        LocationId: "",
        StartDate: "",
        EndDate: "",
        EquipmentModelTo: "",
        PsTypeTo: "",
        TaskNoTo: "",
        TaskCrackCodeTo: "",
        LocationIdTo: "",
        StartDateTo: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1",
      } as FilterData;
      this.stateDisplayData = [] as ListItem[];
      this.statePagination = new PaginationType();
      this.stateLoading = false;
      this.statePaginationLoading = false;
    }
  }
});
