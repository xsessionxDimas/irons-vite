import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { LOOKUP_API_URL, EXPORT_API_URL, GET_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/administration/user-management/user-login/ListItem";
import {
  FilterData
} from "@/core/types/entities/administration/user-management/user-login/FilterData";
import {
  LookupItem
} from "@/core/types/entities/administration/user-management/user-login/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { formatDateForPostData } from "@/core/helpers/date-format";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";

export const useUserLoginListStore = defineStore({
  id: "userLoginList",
  state: () => {
    return {
      stateFilterData: {
        EmployeeId: "",
        Section: "",
        LogOnDate: "",
        EmployeeIdTo: "",
        SectionTo: "",
        LogOnDateTo: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      stateLastUsedFilterData: {
        EmployeeId: "",
        Section: "",
        LogOnDate: "",
        EmployeeIdTo: "",
        SectionTo: "",
        LogOnDateTo: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      statePageName: "userLogin",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateEmployeeIdOption: [] as Option[],
      stateSectionOption: [] as Option[]
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
    sectionOption: (state) => {
      return state.stateSectionOption;
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const payload = {
        EmployeeId: this.stateFilterData.EmployeeId,
        Section: this.stateFilterData.Section,
        LogOnDate: this.stateFilterData.LogOnDate ? formatDateForPostData(this.stateFilterData.LogOnDate) : "",
        EmployeeIdTo: this.stateFilterData.EmployeeIdTo,
        SectionTo: this.stateFilterData.SectionTo,
        LogOnDateTo: this.stateFilterData.LogOnDateTo ? formatDateForPostData(this.stateFilterData.LogOnDateTo) : "",
        Page: this.stateFilterData.Page.toString(),
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
        ver: this.stateFilterData.ver
      };
      try {
        if (isPageRefresh) {
          this.stateLoading = true;
        } else {
          this.stateDisplayData = [...[]];
        }
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, "", new URLSearchParams(payload).toString());
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
        this.stateEmployeeIdOption = mapOptionFromLookupApi(response.data.result.content, "employeeId", "employeeName")
        this.stateSectionOption = mapOption(response.data.result.content.section)
      } catch (error) {
        console.log(error)
      }
    },
    async export() {
      const params = {
        EmployeeId: this.stateFilterData.EmployeeId,
        Section: this.stateFilterData.Section,
        LogOnDate: this.stateFilterData.LogOnDate ? formatDateForPostData(this.stateFilterData.LogOnDate) : "",
        EmployeeIdTo: this.stateFilterData.EmployeeIdTo,
        SectionTo: this.stateFilterData.SectionTo,
        LogOnDateTo: this.stateFilterData.LogOnDateTo ? formatDateForPostData(this.stateFilterData.LogOnDateTo) : "",
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
    setEmployeeId(value: string) {
      this.stateFilterData.EmployeeId = value;
    },
    setSection(value: string) {
      this.stateFilterData.Section = value;
    },
    setLogOnDate(value: string) {
      this.stateFilterData.LogOnDate = value;
    },
    setEmployeeIdTo(value: string) {
      this.stateFilterData.EmployeeIdTo = value;
    },
    setSectionTo(value: string) {
      this.stateFilterData.SectionTo = value;
    },
    setLogOnDateTo(value: string) {
      this.stateFilterData.LogOnDateTo = value;
    },
    async resetFilter() {
      this.stateFilterData.EmployeeId = "";
      this.stateFilterData.Section = "";
      this.stateFilterData.LogOnDate = "";
      this.stateFilterData.EmployeeIdTo = "";
      this.stateFilterData.SectionTo = "";
      this.stateFilterData.LogOnDateTo = "";
      const checkEmployeeId = this.stateLastUsedFilterData.EmployeeId !== "";
      const checkSection = this.stateLastUsedFilterData.Section !== "";
      const checkLogOnDate = this.stateLastUsedFilterData.LogOnDate !== "";
      const checkEmployeeIdTo = this.stateLastUsedFilterData.EmployeeIdTo !== "";
      const checkSectionTo = this.stateLastUsedFilterData.SectionTo !== "";
      const checkLogOnDateTo = this.stateLastUsedFilterData.LogOnDateTo !== "";
      if (checkEmployeeId || checkSection || checkLogOnDate || checkEmployeeIdTo || checkSectionTo || checkLogOnDateTo) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        EmployeeId: "",
        Section: "",
        LogOnDate: "",
        EmployeeIdTo: "",
        SectionTo: "",
        LogOnDateTo: "",
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
