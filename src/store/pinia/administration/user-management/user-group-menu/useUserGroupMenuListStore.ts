import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  GET_GROUP_API_URL,
  LOOKUP_API_URL,
  EXPORT_API_URL
} from "./urls";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/administration/user-management/user-group-menu/ListItem";
import {
  FilterData
} from "@/core/types/entities/administration/user-management/user-group-menu/FilterData";
import {
  LookupItem
} from "@/core/types/entities/administration/user-management/user-group-menu/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOptionFromLookupApi } from "@/core/helpers/mapOption";

const initialFilter = {
  userGroupName: "",
  userGroupNameTo: "",
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: ""
};

export const useUserGroupMenuListStore = defineStore({
  id: "UserGroupMenuList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "usergroupmenu",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateUserGroupOption: [] as Option[],
    }
  },
  getters: {
    pageName: (state) => {
      return state.statePageName;
    },
    pagination: (state) => {
      return state.statePagination;
    },
    paginationLoading: (state) => {
      return state.statePaginationLoading;
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
    userGroupOption: (state) => {
      return state.stateUserGroupOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        userGroupName: this.stateFilterData.userGroupName.toString(),
        userGroupNameTo: this.stateFilterData.userGroupNameTo.toString(),
        Page: this.stateFilterData.Page.toString(),
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
        ver: this.stateFilterData.ver
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_GROUP_API_URL, "", new URLSearchParams(params).toString());
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
      const body = {
        userGroupId: "",
        menuId: "",
        order: ""
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.post(`${LOOKUP_API_URL}?ver=v1`, body as AxiosRequestConfig);
        this.stateUserGroupOption = mapOptionFromLookupApi(response.data.result.content, "userGroupName", "userGroupDesc");
      } catch (error) {
        console.log(error);
      }
    },
    async export() {
      const params = {
        userGroupName: this.stateFilterData.userGroupName.toString(),
        userGroupNameTo: this.stateFilterData.userGroupNameTo.toString(),
        Gmt: new Date().toTimeString().slice(12, 17),
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.postBlob(`${EXPORT_API_URL}?ver=v1`, params as AxiosRequestConfig);
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
    setUserGroupName(value: string) {
      this.stateFilterData.userGroupName = value;
    },
    setUserGroupNameTo(value: string) {
      this.stateFilterData.userGroupNameTo = value;
    },
    async resetFilter() {
      this.stateFilterData.userGroupName = "";
      this.stateFilterData.userGroupNameTo = "";
      const checkUserGroupName = this.stateLastUsedFilterData.userGroupName !== "";
      const checkUserGroupNameTo = this.stateLastUsedFilterData.userGroupNameTo !== "";
      if (checkUserGroupName || checkUserGroupNameTo) {
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
