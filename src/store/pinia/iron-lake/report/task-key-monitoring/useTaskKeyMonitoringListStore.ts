import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { CRUD_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/report/task-key-monitoring/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/report/task-key-monitoring/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/report/task-key-monitoring/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption } from "@/core/helpers/mapOption";

const initialFilter = {
  Model: "",
  TaskDescription: "",
  TaskKey: "",
  PsType: "",
  Check: "",
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: "",
  GroupName: "",
  SubGroupName: "",
  TaskGroupName: "",
  Version: ""
};

export const useTaskKeyMonitoringListStore = defineStore({
  id: "taskKeyMonitoring",
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
      stateModelOption: [] as Option[],
      stateTaskDescriptionOption: [] as Option[],
      stateTaskKeyOption: [] as Option[],
      statePsTypeOption: [] as Option[],
      stateCheckOption: [] as Option[],
      stateGroupNameOption: [] as Option[],
      stateSubGroupNameOption: [] as Option[],
      stateTaskGroupNameOption: [] as Option[],
      stateVersionOption: [] as Option[],
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
    ModelOption: (state) => {
      return state.stateModelOption;
    },
    TaskDescriptionOption: (state) => {
      return state.stateTaskDescriptionOption;
    },
    TaskKeyOption: (state) => {
      return state.stateTaskKeyOption;
    },
    PsTypeOption: (state) => {
      return state.statePsTypeOption;
    },
    CheckOption: (state) => {
      return state.stateCheckOption;
    },
    GroupNameOption: (state) => {
      return state.stateGroupNameOption;
    },
    SubGroupNameOption: (state) => {
      return state.stateSubGroupNameOption;
    },
    TaskGroupNameOption: (state) => {
      return state.stateTaskGroupNameOption;
    },
    VersionOption: (state) => {
      return state.stateVersionOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        ver: this.stateFilterData.ver
      };
      const formData = {
        Model: this.stateFilterData.Model,
        TaskDescription: this.stateFilterData.TaskDescription,
        TaskKey: this.stateFilterData.TaskKey,
        PsType: this.stateFilterData.PsType,
        Check: this.stateFilterData.Check,
        GroupName: this.stateFilterData.GroupName,
        SubGroupName: this.stateFilterData.SubGroupName,
        TaskGroupName: this.stateFilterData.TaskGroupName,
        Version: this.stateFilterData.Version,
        Page: this.stateFilterData.Page.toString(),
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
      }
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.post(`${CRUD_API_URL}?${new URLSearchParams(params).toString()}`, formData as AxiosRequestConfig)
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
        this.stateModelOption = mapOption(response.data.result.content.model)
        this.stateTaskDescriptionOption = mapOption(response.data.result.content.taskDescription)
        this.stateTaskKeyOption = mapOption(response.data.result.content.taskKey)
        this.statePsTypeOption = mapOption(response.data.result.content.psType)
        this.stateCheckOption = mapOption(response.data.result.content.check)
        this.stateGroupNameOption = mapOption(response.data.result.content.groupName)
        this.stateSubGroupNameOption = mapOption(response.data.result.content.subGroupName)
        this.stateTaskGroupNameOption = mapOption(response.data.result.content.taskGroupName)
        this.stateVersionOption = mapOption(response.data.result.content.version)
      } catch (error) {
        console.log(error)
      }
    },
    async export() {
      const params = {
        ver: this.stateFilterData.ver
      };
      const payload = {
        Model: this.stateFilterData.Model,
        TaskDescription: this.stateFilterData.TaskDescription,
        TaskKey: this.stateFilterData.TaskKey,
        PsType: this.stateFilterData.PsType,
        Check: this.stateFilterData.Check,
        GroupName: this.stateFilterData.GroupName,
        SubGroupName: this.stateFilterData.SubGroupName,
        TaskGroupName: this.stateFilterData.TaskGroupName,
        Version: this.stateFilterData.Version,
        Order: this.stateFilterData.Order,
      }
      try {
        const response: AxiosResponse<Blob> = await ApiService.postBlob(`${EXPORT_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
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
    setTaskDescription(value: string) {
      this.stateFilterData.TaskDescription = value;
    },
    setTaskKey(value: string) {
      this.stateFilterData.TaskKey = value;
    },
    setPsType(value: string) {
      this.stateFilterData.PsType = value;
    },
    setCheck(value: string) {
      this.stateFilterData.Check = value;
    },
    setGroupName(value: string) {
      this.stateFilterData.GroupName = value;
    },
    setSubGroupName(value: string) {
      this.stateFilterData.SubGroupName = value;
    },
    setTaskGroupName(value: string) {
      this.stateFilterData.TaskGroupName = value;
    },
    setVersion(value: string) {
      this.stateFilterData.Version = value;
    },
    async resetFilter() {
      this.stateFilterData.Model = "";
      this.stateFilterData.TaskDescription = "";
      this.stateFilterData.TaskKey = "";
      this.stateFilterData.PsType = "";
      this.stateFilterData.Check = "";
      this.stateFilterData.GroupName = "";
      this.stateFilterData.SubGroupName = "";
      this.stateFilterData.TaskGroupName = "";
      this.stateFilterData.Version = "";
      const checkCompany = this.stateLastUsedFilterData.Model !== "";
      const checkCompanyTo = this.stateLastUsedFilterData.TaskDescription !== "";
      const checkStartDate = this.stateLastUsedFilterData.TaskKey !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.PsType !== "";
      const checkEndDate = this.stateLastUsedFilterData.Check !== "";
      const checkGroupName = this.stateLastUsedFilterData.GroupName !== "";
      const checkSubGroupName = this.stateLastUsedFilterData.SubGroupName !== "";
      const checkTaskGroupName = this.stateLastUsedFilterData.TaskGroupName !== "";
      const checkVersion = this.stateLastUsedFilterData.Version !== "";
      if (checkCompany || checkCompanyTo || checkStartDate || checkStartDateTo || checkEndDate || checkGroupName || checkSubGroupName || checkTaskGroupName || checkVersion) {
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
