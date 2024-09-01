import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  GET_API_URL,
  LOOKUP_API_URL,
  EXPORT_API_URL,
  LOOKUP_USER_GROUP_URL,
  LOOKUP_EMPLOYEE_URL
} from "./urls";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/administration/user-management/user-group-member/ListItem";
import {
  FilterData
} from "@/core/types/entities/administration/user-management/user-group-member/FilterData";
import {
  LookupItem
} from "@/core/types/entities/administration/user-management/user-group-member/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";

export const useUserGroupMemberListStore = defineStore({
  id: "userGroupMemberList",
  state: () => {
    return {
      stateFilterData: {
        userGroupName: "",
        employeeName: "",
        page: 1,
        pageSize: 10,
        order: "",
        ver: "v1"
      } as FilterData,
      stateLastUsedFilterData: {
        userGroupName: "",
        employeeName: "",
        page: 1,
        pageSize: 10,
        order: "",
        ver: "v1"
      } as FilterData,
      statePageName: "usergroupmember",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateUserGroupIdOption: [] as Option[],
      stateEmployeeIDOption: [] as Option[],
      stateEmployeeIDFormOption: [] as Option[],
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
    userGroupIdOption: (state) => {
      return state.stateUserGroupIdOption;
    },
    employeeIDOption: (state) => {
      return state.stateEmployeeIDOption;
    },
    userGroupOption: (state) => {
      return state.stateUserGroupOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const payload = {
        userGroupName: this.stateFilterData.userGroupName,
        employeeName: this.stateFilterData.employeeName,
        Page: this.stateFilterData.page.toString(),
        PageSize: this.stateFilterData.pageSize.toString(),
        Order: this.stateFilterData.order,
      };
      const params = {
        ver: this.stateFilterData.ver
      }
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.post(`${GET_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
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
    async getUserGroupLookup() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_USER_GROUP_URL}?${new URLSearchParams(params).toString()}`);
        if (response.data.result.content.groupDescription && response.data.result.content.groupName) {
          this.stateUserGroupIdOption = response.data.result.content.groupName.map((s, idx) => {
            return {
              label: `${s} | ${response.data.result.content.groupDescription[idx]}`,
              value: s
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getEmployeeLookup() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_EMPLOYEE_URL}?${new URLSearchParams(params).toString()}`);
        if (response.data.result.content.emmployeeId && response.data.result.content.employeeName) {
          this.stateEmployeeIDOption = response.data.result.content.emmployeeId.map((s, idx) => {
            return {
              label: `${s} | ${response.data.result.content.employeeName[idx]}`,
              value: response.data.result.content.employeeName[idx]
            }
          });
          this.stateEmployeeIDFormOption = response.data.result.content.emmployeeId.map((s, idx) => {
            return {
              label: `${s} | ${response.data.result.content.employeeName[idx]}`,
              value: `${s}`
            }
          })
        }
      } catch (error) {
        console.log(error);
      }
    },
    async export() {
      const params = {
        userGroupName: this.stateFilterData.userGroupName,
        employeeName: this.stateFilterData.employeeName,
        ver: this.stateFilterData.ver,
        Gmt: new Date().toTimeString().slice(12, 17)
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.postBlob(`${EXPORT_API_URL}?${new URLSearchParams(params).toString()}`, {} as AxiosRequestConfig);
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
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData(false);
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200)
    },
    async setSort({ prop, order }) {
      if (!prop && !order) {
        this.stateFilterData.order = "";
      } else {
        const formatedOrder = order == "ascending" ? "asc" : "desc";
        this.stateFilterData.order = `${prop}_${formatedOrder}`;
      }
      this.statePagination.handleCurrentPageChange(1);
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData(false);
    },
    setUserGroupId(value: string) {
      this.stateFilterData.userGroupName = value;
    },
    setEmployeeID(value: string) {
      this.stateFilterData.employeeName = value;
    },
    async resetFilter() {
      this.stateFilterData.userGroupName = ""
      this.stateFilterData.employeeName = ""
      const checkUserGroupId = this.stateLastUsedFilterData.userGroupName !== ""
      const checkEmployeeID = this.stateLastUsedFilterData.employeeName !== ""
      if (checkUserGroupId || checkEmployeeID) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        userGroupName: "",
        employeeName: "",
        page: 1,
        pageSize: 10,
        order: "",
        ver: "v1"
      } as FilterData;
      this.stateDisplayData = [] as ListItem[];
      this.statePagination = new PaginationType();
      this.stateLoading = false;
      this.statePaginationLoading = false;
    }
  }
});
