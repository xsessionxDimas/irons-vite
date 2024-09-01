import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { CRUD_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/wbs-element/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/wbs-element/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/equipment/wbs-element/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption } from "@/core/helpers/mapOption";

export const useWbsElementListStore = defineStore({
  id: "wbsElementList",
  state: () => {
    return {
      stateFilterData: {
        WbsElement: "",
        WbsElementDescription: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      stateLastUsedFilterData: {
        WbsElement: "",
        WbsElementDescription: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      statePageName: "wbsElement",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateWbsElementOption: [] as Option[],
      stateWbsElementDescOption: [] as Option[]
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
    wbsElementOption: (state) => {
      return state.stateWbsElementOption;
    },
    wbsElementDescOption: (state) => {
      return state.stateWbsElementDescOption;
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        WbsElement: this.stateFilterData.WbsElement,
        WbsElementDescription: this.stateFilterData.WbsElementDescription,
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
        this.stateWbsElementOption = mapOption(response.data.result.content.wbsElement);
        this.stateWbsElementDescOption = mapOption(response.data.result.content.wbsElementDescription);
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
    setWbsElement(value: string) {
      this.stateFilterData.WbsElement = value;
    },
    setWbsElementDescription(value: string) {
      this.stateFilterData.WbsElementDescription = value;
    },
    async resetFilter() {
      this.stateFilterData.WbsElement = ""
      this.stateFilterData.WbsElementDescription = ""
      const checkWbsElement = this.stateLastUsedFilterData.WbsElement !== ""
      const checkWbsElementDesc = this.stateLastUsedFilterData.WbsElementDescription !== ""
      if (checkWbsElement || checkWbsElementDesc) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        WbsElement: "",
        WbsElementDescription: "",
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
