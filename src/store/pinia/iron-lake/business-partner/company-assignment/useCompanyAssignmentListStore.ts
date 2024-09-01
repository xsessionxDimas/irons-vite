import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { CRUD_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/business-partner/company-assignment/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/company-assignment/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/business-partner/company-assignment/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption } from "@/core/helpers/mapOption";

const initialFilter = {
  Company: "",
  Site: "",
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: ""
}

export const useCompanyAssignmentListStore = defineStore({
  id: "companyAssignmentList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "company assignment",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateCompanyOption: [] as Option[],
      stateSiteOption: [] as Option[]
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
    siteOption: (state) => {
      return state.stateSiteOption;
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        Company: this.stateFilterData.Company,
        Site: this.stateFilterData.Site,
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
        this.stateCompanyOption = mapOption(response.data.result.content.company);
        this.stateSiteOption = mapOption(response.data.result.content.site);
      } catch (error) {
        console.log(error)
      }
    },
    async export() {
      const params = {
        company: this.stateFilterData.Company,
        site: this.stateFilterData.Site,
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
    setCompanySite(value: string) {
      this.stateFilterData.Site = value;
    },
    async resetFilter() {
      this.stateFilterData.Company = ""
      this.stateFilterData.Site = ""
      const checkCompany = this.stateLastUsedFilterData.Company !== ""
      const checkSite = this.stateLastUsedFilterData.Site !== ""
      if (checkCompany || checkSite) {
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
      this.stateCompanyOption = [] as Option[];
      this.stateSiteOption = [] as Option[];
    }
  }
});
