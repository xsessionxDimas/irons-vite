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
} from "@/core/types/entities/iron-lake/crack-assignment/assignment-location-crack/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/crack-assignment/assignment-location-crack/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/crack-assignment/assignment-location-crack/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  mapOption,
} from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

const initialFilter = {
  Model: "",
  ModelTo: "",
  PsType: "",
  PsTypeTo: "",
  TaskNumberDetailParent: "",
  TaskNumberDetailParentTo: "",
  LocationIdParent: "",
  LocationIdParentTo: "",
  TaskNumberDetailChild: "",
  TaskNumberDetailChildTo: "",
  LocationIdChild: "",
  LocationIdChildTo: "",
  StartDate: "",
  StartDateTo: "",
  EndDate: "",
  EndDateTo: "",
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: ""
};

export const useAssignmentLocationCrackListStore = defineStore({
  id: "assignmentLocationCrack",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "assignmentLocationCrack",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      // Lookup
      stateModelOption: [] as Option[],
      statePsTypeOption: [] as Option[],
      stateTaskNumberDetailParentOption: [] as Option[],
      stateLocationIdParentOption: [] as Option[],
      stateTaskNumberDetailChildOption: [] as Option[],
      stateLocationIdChildOption: [] as Option[],
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
    modelOption: (state) => {
      return state.stateModelOption;
    },
    psTypeOption: (state) => {
      return state.statePsTypeOption;
    },
    taskNumberDetailParentOption: (state) => {
      return state.stateTaskNumberDetailParentOption;
    },
    locationIdParentOption: (state) => {
      return state.stateLocationIdParentOption;
    },
    taskNumberDetailChildOption: (state) => {
      return state.stateTaskNumberDetailChildOption;
    },
    locationIdChildOption: (state) => {
      return state.stateLocationIdChildOption;
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        Model: this.stateFilterData.Model,
        ModelTo: this.stateFilterData.ModelTo,
        PsType: this.stateFilterData.PsType,
        PsTypeTo: this.stateFilterData.PsTypeTo,
        TaskNumberDetailParent: this.stateFilterData.TaskNumberDetailParent,
        TaskNumberDetailParentTo: this.stateFilterData.TaskNumberDetailParentTo,
        LocationIdParent: this.stateFilterData.LocationIdParent,
        LocationIdParentTo: this.stateFilterData.LocationIdParentTo,
        TaskNumberDetailChild: this.stateFilterData.TaskNumberDetailChild,
        TaskNumberDetailChildTo: this.stateFilterData.TaskNumberDetailChildTo,
        LocationIdChild: this.stateFilterData.LocationIdChild,
        LocationIdChildTo: this.stateFilterData.LocationIdChildTo,
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
        this.stateModelOption = mapOption(response.data.result.content.model);
        this.statePsTypeOption = mapOption(response.data.result.content.psType);
        this.stateTaskNumberDetailParentOption = mapOption(response.data.result.content.taskNumberDetailParent);
        this.stateLocationIdParentOption = mapOption(response.data.result.content.locationIdParent);
        this.stateTaskNumberDetailChildOption = mapOption(response.data.result.content.taskNumberDetailChild);
        this.stateLocationIdChildOption = mapOption(response.data.result.content.locationIdChild);
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
    setModel(value: string) {
      this.stateFilterData.Model = value;
    },
    setModelTo(value: string) {
      this.stateFilterData.ModelTo = value;
    },
    setPsType(value: string) {
      this.stateFilterData.PsType = value;
    },
    setPsTypeTo(value: string) {
      this.stateFilterData.PsTypeTo = value;
    },
    setTaskNumberDetailParent(value: string) {
      this.stateFilterData.TaskNumberDetailParent = value;
    },
    setTaskNumberDetailParentTo(value: string) {
      this.stateFilterData.TaskNumberDetailParentTo = value;
    },
    setLocationIdParent(value: string) {
      this.stateFilterData.LocationIdParent = value;
    },
    setLocationIdParentTo(value: string) {
      this.stateFilterData.LocationIdParentTo = value;
    },
    setTaskNumberDetailChild(value: string) {
      this.stateFilterData.TaskNumberDetailChild = value;
    },
    setTaskNumberDetailChildTo(value: string) {
      this.stateFilterData.TaskNumberDetailChildTo = value;
    },
    setLocationIdChild(value: string) {
      this.stateFilterData.LocationIdChild = value;
    },
    setLocationIdChildTo(value: string) {
      this.stateFilterData.LocationIdChildTo = value;
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
      this.stateFilterData.Model = "";
      this.stateFilterData.ModelTo = "";
      this.stateFilterData.PsType = "";
      this.stateFilterData.PsTypeTo = "";
      this.stateFilterData.TaskNumberDetailParent = "";
      this.stateFilterData.TaskNumberDetailParentTo = "";
      this.stateFilterData.LocationIdParent = "";
      this.stateFilterData.LocationIdParentTo = "";
      this.stateFilterData.TaskNumberDetailChild = "";
      this.stateFilterData.TaskNumberDetailChildTo = "";
      this.stateFilterData.LocationIdChild = "";
      this.stateFilterData.LocationIdChildTo = "";
      this.stateFilterData.StartDate = "";
      this.stateFilterData.StartDateTo = "";
      this.stateFilterData.EndDate = "";
      this.stateFilterData.EndDateTo = "";
      const checkModel = this.stateLastUsedFilterData.Model !== "";
      const checkModelTo = this.stateLastUsedFilterData.ModelTo !== "";
      const checkPsType = this.stateLastUsedFilterData.PsType !== "";
      const checkPsTypeTo = this.stateLastUsedFilterData.PsTypeTo !== "";
      const checkTaskNumberDetailParent = this.stateLastUsedFilterData.TaskNumberDetailParent !== "";
      const checkTaskNumberDetailParentTo = this.stateLastUsedFilterData.TaskNumberDetailParentTo !== "";
      const checkLocationIdParent = this.stateLastUsedFilterData.LocationIdParent !== "";
      const checkLocationIdParentTo = this.stateLastUsedFilterData.LocationIdParentTo !== "";
      const checkTaskNumberDetailChild = this.stateLastUsedFilterData.TaskNumberDetailChild !== "";
      const checkTaskNumberDetailChildTo = this.stateLastUsedFilterData.TaskNumberDetailChildTo !== "";
      const checkLocationIdChild = this.stateLastUsedFilterData.LocationIdChild !== "";
      const checkLocationIdChildTo = this.stateLastUsedFilterData.LocationIdChildTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== "";
      if (checkModel || checkModelTo || checkPsType || checkPsTypeTo || checkTaskNumberDetailParent || checkTaskNumberDetailParentTo || checkLocationIdParent || checkLocationIdParentTo || checkTaskNumberDetailChild || checkTaskNumberDetailChildTo || checkLocationIdChild || checkLocationIdChildTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
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
