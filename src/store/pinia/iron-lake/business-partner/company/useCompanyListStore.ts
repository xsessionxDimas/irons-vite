import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { CRUD_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/business-partner/company/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/company/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/business-partner/company/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOptionFromLookupApi } from "@/core/helpers/mapOption";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";

const initialFilter = {
  Company: "",
  CompanyTo: "",
  StartDate: "",
  StartDateTo: "",
  EndDate: "",
  EndDateTo: "",
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: ""
};

export const useCompanyListStore = defineStore({
  id: "companyList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "company",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateCompanyOption: [] as Option[],
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
    companyOption: (state) => {
      return state.stateCompanyOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        Company: this.stateFilterData.Company,
        CompanyTo: this.stateFilterData.CompanyTo,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.StartDate))) : "",
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.StartDateTo))) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.EndDate))) : "",
        EndDateTo: this.stateFilterData.EndDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.EndDateTo))) : "",
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
        this.stateCompanyOption = mapOptionFromLookupApi(response.data.result.content, "company", "companyDescription");
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
    setCompany(value: string) {
      this.stateFilterData.Company = value;
    },
    setCompanyTo(value: string) {
      this.stateFilterData.CompanyTo = value;
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
      this.stateFilterData.Company = "";
      this.stateFilterData.CompanyTo = "";
      this.stateFilterData.StartDate = "";
      this.stateFilterData.StartDateTo = "";
      this.stateFilterData.EndDate = "";
      this.stateFilterData.EndDateTo = "";
      const checkCompany = this.stateLastUsedFilterData.Company !== "";
      const checkCompanyTo = this.stateLastUsedFilterData.CompanyTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== "";
      if (checkCompany || checkCompanyTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
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
