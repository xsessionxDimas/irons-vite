import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/intervention-status/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/intervention-status/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/intervention-status/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption } from "@/core/helpers/mapOption";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialFilter = {
  interventionStatus: "",
  interventionStatusTo: "",
  interventionStatusDesc: "",
  interventionStatusDescTo: "",
  followUpPriority: "",
  followUpPriorityTo: "",
  followUpPriorityUom: "",
  followUpPriorityUomTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useInterventionStatusListStore = defineStore({
  id: "interventionStatusList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "interventionStatus",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateInterventionStatusOption: [] as Option[],
      stateInterventionStatusDescOption: [] as Option[],
      stateFollowUpPriorityOption: [] as Option[],
      stateFollowUpPriorityUomOption: [] as Option[],
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
    interventionStatusOption: (state) => {
      return state.stateInterventionStatusOption;
    },
    interventionStatusDescOption: (state) => {
      return state.stateInterventionStatusDescOption;
    },
    followUpPriorityOption: (state) => {
      return state.stateFollowUpPriorityOption;
    },
    followUpPriorityUomOption: (state) => {
      return state.stateFollowUpPriorityUomOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        interventionStatus: this.stateFilterData.interventionStatus,
        interventionStatusTo: this.stateFilterData.interventionStatusTo,
        interventionStatusDesc: this.stateFilterData.interventionStatusDesc,
        interventionStatusDescTo: this.stateFilterData.interventionStatusDescTo,
        followUpPriority: this.stateFilterData.followUpPriority,
        followUpPriorityTo: this.stateFilterData.followUpPriorityTo,
        followUpPriorityUom: this.stateFilterData.followUpPriorityUom,
        followUpPriorityUomTo: this.stateFilterData.followUpPriorityUomTo,
        startDate: this.stateFilterData.startDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDate))) : "",
        startDateTo: this.stateFilterData.startDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDateTo))) : "",
        endDate: this.stateFilterData.endDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDate))) : "",
        endDateTo: this.stateFilterData.endDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDateTo))) : "",
        page: this.stateFilterData.page.toString(),
        pageSize: this.stateFilterData.pageSize.toString(),
        order: this.stateFilterData.order,
        ver: this.stateFilterData.ver
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, "intervention_status", new URLSearchParams(params).toString());
        this.stateDisplayData = response.data.result.content;
        this.setTotalPage(response.data.result.total);
        this.stateLastUsedFilterData = {
          ...this.stateFilterData
        } as FilterData
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
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
        this.stateInterventionStatusOption = mapOption(response.data.result.content.interventionStatus);
        this.stateInterventionStatusDescOption = mapOption(response.data.result.content.interventionStatusDesc);
        this.stateFollowUpPriorityOption = mapOption(response.data.result.content.followUpPriority);
        this.stateFollowUpPriorityUomOption = mapOption(response.data.result.content.followUpPriorityUom);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async export() {
      const params = {
        interventionStatus: this.stateFilterData.interventionStatus,
        interventionStatusTo: this.stateFilterData.interventionStatusTo,
        interventionStatusDesc: this.stateFilterData.interventionStatusDesc,
        interventionStatusDescTo: this.stateFilterData.interventionStatusDescTo,
        followUpPriority: this.stateFilterData.followUpPriority,
        followUpPriorityTo: this.stateFilterData.followUpPriorityTo,
        followUpPriorityUom: this.stateFilterData.followUpPriorityUom,
        followUpPriorityUomTo: this.stateFilterData.followUpPriorityUomTo,
        startDate: this.stateFilterData.startDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDate))) : "",
        startDateTo: this.stateFilterData.startDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDateTo))) : "",
        endDate: this.stateFilterData.endDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDate))) : "",
        endDateTo: this.stateFilterData.endDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDateTo))) : "",
        order: this.stateFilterData.order,
        ver: this.stateFilterData.ver,
        Gmt: new Date().toTimeString().slice(12, 17)
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.getBlob(EXPORT_API_URL, "", new URLSearchParams(params).toString());
        return response.data;
      } catch (error) {
        sendErrorEvent('IRONS', error);
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
    setInterventionStatus(value: string) {
      this.stateFilterData.interventionStatus = value;
    },
    setInterventionStatusTo(value: string) {
      this.stateFilterData.interventionStatusTo = value;
    },
    setInterventionStatusDesc(value: string) {
      this.stateFilterData.interventionStatusDesc = value;
    },
    setInterventionStatusDescTo(value: string) {
      this.stateFilterData.interventionStatusDescTo = value;
    },
    setFollowUpPriority(value: string) {
      this.stateFilterData.followUpPriority = value;
    },
    setFollowUpPriorityTo(value: string) {
      this.stateFilterData.followUpPriorityTo = value;
    },
    setFollowUpPriorityUom(value: string) {
      this.stateFilterData.followUpPriorityUom = value;
    },
    setFollowUpPriorityUomTo(value: string) {
      this.stateFilterData.followUpPriorityUomTo = value;
    },
    setStartDate(value: string) {
      this.stateFilterData.startDate = value;
    },
    setStartDateTo(value: string) {
      this.stateFilterData.startDateTo = value;
    },
    setEndDate(value: string) {
      this.stateFilterData.endDate = value;
    },
    setEndDateTo(value: string) {
      this.stateFilterData.endDateTo = value;
    },
    async resetFilter() {
      this.stateFilterData.interventionStatus = ""
      this.stateFilterData.interventionStatusTo = ""
      this.stateFilterData.interventionStatusDesc = ""
      this.stateFilterData.interventionStatusDescTo = ""
      this.stateFilterData.followUpPriority = ""
      this.stateFilterData.followUpPriorityTo = ""
      this.stateFilterData.followUpPriorityUom = ""
      this.stateFilterData.followUpPriorityUomTo = ""
      this.stateFilterData.startDate = "";
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.endDateTo = "";
      const checkInterventionStatus = this.stateLastUsedFilterData.interventionStatus !== "";
      const checkInterventionStatusTo = this.stateLastUsedFilterData.interventionStatusTo !== "";
      const checkinterventionStatusDesc = this.stateLastUsedFilterData.interventionStatusDesc !== "";
      const checkinterventionStatusDescTo = this.stateLastUsedFilterData.interventionStatusDescTo !== "";
      const checkFollowUpPriority = this.stateLastUsedFilterData.followUpPriority !== "";
      const checkFollowUpPriorityTo = this.stateLastUsedFilterData.followUpPriorityTo !== "";
      const checkFollowUpPriorityUom = this.stateLastUsedFilterData.followUpPriorityUom !== "";
      const checkFollowUpPriorityUomTo = this.stateLastUsedFilterData.followUpPriorityUomTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== "";
      if (checkInterventionStatus || checkInterventionStatusTo || checkinterventionStatusDesc
        || checkinterventionStatusDescTo || checkFollowUpPriority || checkFollowUpPriorityTo || checkFollowUpPriorityUom
        || checkFollowUpPriorityUomTo || checkStartDate || checkStartDateTo || checkEndDate
        || checkEndDateTo) {
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
