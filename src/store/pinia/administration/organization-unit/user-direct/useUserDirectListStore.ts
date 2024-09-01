import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/administration/organization-unit/user-direct/ListItem";
import {
  FilterData
} from "@/core/types/entities/administration/organization-unit/user-direct/FilterData";
import {
  LookupItem
} from "@/core/types/entities/administration/organization-unit/user-direct/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { formatDateForPostData } from "@/core/helpers/date-format";
import { mapOption } from "@/core/helpers/mapOption";

export const useUserDirectListStore = defineStore({
  id: "userDirectList",
  state: () => {
    return {
      stateFilterData: {
        EmployeeId: "",
        EmployeeIdDirect: "",
        StartDate: "",
        EndDate: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      stateLastUsedFilterData: {
        EmployeeId: "",
        EmployeeIdDirect: "",
        StartDate: "",
        EndDate: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      statePageName: "userDirect",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateEmployeeIdOption: [] as Option[],
      stateEmployeeIdDirectOption: [] as Option[],
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
    employeeIdOption: (state) => {
      return state.stateEmployeeIdOption;
    },
    employeeIdDirectOption: (state) => {
      return state.stateEmployeeIdDirectOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        EmployeeId: this.stateFilterData.EmployeeId,
        EmployeeDirectId: this.stateFilterData.EmployeeIdDirect,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate) : "",
        Page: this.stateFilterData.Page.toString(),
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
        ver: this.stateFilterData.ver
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, "", new URLSearchParams(params).toString());
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
        this.stateEmployeeIdOption = mapOption(response.data.result.content.employeeId);
        this.stateEmployeeIdDirectOption = mapOption(response.data.result.content.employeeDirectId);
      } catch (error) {
        console.log(error);
      }
    },
    async export() {
      const params = {
        ver: this.stateFilterData.ver,
        Gmt: new Date().toTimeString().slice(12, 17),
        EmployeeId: this.stateFilterData.EmployeeId,
        EmployeeDirectId: this.stateFilterData.EmployeeIdDirect,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate) : "",
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
    setEmployeeId(value: string) {
      this.stateFilterData.EmployeeId = value;
    },
    setEmployeeIdDirect(value: string) {
      this.stateFilterData.EmployeeIdDirect = value;
    },
    setStartDate(value: string) {
      this.stateFilterData.StartDate = value;
    },
    setEndDate(value: string) {
      this.stateFilterData.EndDate = value;
    },
    async resetFilter() {
      this.stateFilterData.EmployeeId = "";
      this.stateFilterData.EmployeeIdDirect = "";
      this.stateFilterData.StartDate = "";
      this.stateFilterData.EndDate = "";
      const checkEmployeeId = this.stateLastUsedFilterData.EmployeeId !== "";
      const checkEmployeeIdDirect = this.stateLastUsedFilterData.EmployeeIdDirect !== "";
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== "";
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== "";
      if (checkEmployeeId || checkEmployeeIdDirect || checkStartDate || checkEndDate) {
        await this.getData();
      }
    },
    resetState() {
      this.stateFilterData = {
        EmployeeId: "",
        EmployeeIdDirect: "",
        StartDate: "",
        EndDate: "",
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
