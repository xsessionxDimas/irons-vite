import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  CRUD_API_URL,
  EXPORT_API_URL,
  LOOKUP_API_URL
} from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/business-partner/customer-assignment/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/customer-assignment/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/business-partner/customer-assignment/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption } from "@/core/helpers/mapOption";

const initialFilter = {
  MaintenancePlant: "",
  MaintenancePlantDescription: "",
  Customer: "",
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: ""
}

export const useCustomerAssignmentListStore = defineStore({
  id: "customerAssignmentList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "customerAssignment",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateMaintenancePlantOption: [] as Option[],
      stateMaintenancePlantDescOption: [] as Option[],
      stateCustomerOption: [] as Option[]
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
    maintenancePlantOption: (state) => {
      return state.stateMaintenancePlantOption;
    },
    maintenancePlantDescOption: (state) => {
      return state.stateMaintenancePlantDescOption;
    },
    customerOption: (state) => {
      return state.stateCustomerOption
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        MaintenancePlant: this.stateFilterData.MaintenancePlant,
        MaintenancePlantDescription: this.stateFilterData.MaintenancePlantDescription,
        Customer: this.stateFilterData.Customer,
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
        this.stateMaintenancePlantOption = mapOption(response.data.result.content.maintenancePlant);
        this.stateMaintenancePlantDescOption = mapOption(response.data.result.content.maintenancePlantDescription);
        this.stateCustomerOption = mapOption(response.data.result.content.customer);
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
    setMaintenancePlant(value: string) {
      this.stateFilterData.MaintenancePlant = value;
    },
    setMaintenancePlantDescription(value: string) {
      this.stateFilterData.MaintenancePlantDescription = value;
    },
    setCustomer(value: string) {
      this.stateFilterData.Customer = value;
    },
    async resetFilter() {
      this.stateFilterData.MaintenancePlant = ""
      this.stateFilterData.MaintenancePlantDescription = ""
      this.stateFilterData.Customer = ""
      const checkMaintenancePlant = this.stateLastUsedFilterData.MaintenancePlant !== ""
      const checkMaintenancePlantDesc = this.stateLastUsedFilterData.MaintenancePlantDescription !== ""
      const checkCustomer = this.stateLastUsedFilterData.Customer !== ""
      if (checkMaintenancePlant || checkMaintenancePlantDesc || checkCustomer) {
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
