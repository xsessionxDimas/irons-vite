import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { CRUD_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/administration/user-management/user-group/ListItem";
import {
  FilterData
} from "@/core/types/entities/administration/user-management/user-group/FilterData";
import {
  LookupItem
} from "@/core/types/entities/administration/user-management/user-group/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";

const initialFilter = {
  UserGroup: "",
  UserGroupTo: "",
  Site: "",
  SiteTo: "",
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: ""
};

export const useUserGroupListStore = defineStore({
  id: "UserGroupList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "userGroup",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateMdIdOption: [] as Option[],
      stateUserGroupOption: [] as Option[],
      stateSiteOption: [] as Option[],
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
    UserGroupOption: (state) => {
      return state.stateUserGroupOption;
    },
    siteOption: (state) => {
      return state.stateSiteOption;
    },
    groupMdIdOption: (state) => {
      return state.stateMdIdOption;
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        UserGroup: this.stateFilterData.UserGroup,
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
        this.stateUserGroupOption = mapOptionFromLookupApi(response.data.result.content, "groupName", "groupDescription");
        this.stateSiteOption = mapOption(response.data.result.content.site);
      } catch (error) {
        console.log(error);
      }
    },
    async export() {
      const params = {
        UserGroup: this.stateFilterData.UserGroup,
        Site: this.stateFilterData.Site,
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
    setUserGroup(value: string) {
      this.stateFilterData.UserGroup = value;
    },
    setUserGroupTo(value: string) {
      this.stateFilterData.UserGroupTo = value;
    },
    setSite(value: string) {
      this.stateFilterData.Site = value;
    },
    setSiteTo(value: string) {
      this.stateFilterData.SiteTo = value;
    },
    async resetFilter() {
      this.stateFilterData.UserGroup = ""
      this.stateFilterData.Site = ""
      const checkGroup = this.stateLastUsedFilterData.UserGroup !== ""
      const checkSite = this.stateLastUsedFilterData.Site !== ""
      if (checkGroup || checkSite) {
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
