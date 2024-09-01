import PaginationType from "@/core/types/misc/Pagination";
import ApiService from "@/core/services/ApiService";
import { DOS_CRUD_API_URL, DOS_EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { useDailyScheduleFormStore } from "./useDailyScheduleFormStore";
import { useDailyScheduleBulkStore } from "./useDailyScheduleBulkStore";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponseIronlake } from "@/core/types/misc/ApiResponse";
import {
  IronlakeContentDOS,
  ListItem,
} from "@entities/iron-lake/task/daily-schedule/ListItem";
import {
  reqBody
} from "@entities/iron-lake/task/daily-schedule/FilterData";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { UserInfo } from "@/database/schema/UserInfo";

const formStore = useDailyScheduleFormStore();
const bulkStore = useDailyScheduleBulkStore();
const authStore = useAuthenticationStore();
// sonarqube fixing
type ElInputType = null | number | string;

class InitialFilterForm {
  siteId: string;
  equipmentNoId: ElInputType;
  smuDue?: ElInputType;
  workOrder?: ElInputType;
  serviceSize: string;
  dateFrom: null | string;
  dateTo: null | string;
  statusId: ElInputType;
  page: number;
  pageSize: number;

  constructor(userDetail: UserInfo) {
    this.siteId = userDetail.isHO === 1 ? "" : userDetail.SiteId;
    this.equipmentNoId = null;
    this.smuDue = undefined;
    this.workOrder = undefined;
    this.serviceSize = "";
    this.dateFrom = null;
    this.dateTo = null;
    this.statusId = null;
    this.page = 1;
    this.pageSize = 20;
  }
}

export const useDailyScheduleListStore = defineStore({
  id: "dailyscheduleList",
  state: () => {
    return {
      stateFilterForm: new InitialFilterForm(authStore.user) as reqBody,
      stateList: [] as ListItem[],
      statePageName: "dailyschedule",
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
    };
  },
  getters: {
    pageName: (state) => {
      return state.statePageName;
    },
    pagination: (state) => {
      return state.statePagination;
    },
    list: (state) => {
      return state.stateList;
    },
    unitNumberOption: () => {
      return formStore.unitNumberOption;
    },
    filterServiceSizeOpt: () => {
      return formStore.filterServiceSizeOpt;
    },
    psTypeOption: () => {
      return formStore.psTypeOption;
    },
    statusOption: () => {
      return formStore.statusOption;
    },
    loading: (state) => {
      return state.stateLoading;
    },
    paginationLoading: (state) => {
      return state.statePaginationLoading;
    },
  },
  actions: {
    setTotalPage(totalPage: number) {
      this.pagination.totalPage = totalPage;
      this.pagination.getPaginationStartIndex();
      this.pagination.getPaginationLastIndex();
    },
    async getList() {
      this.stateLoading = true;
      const params = {
        ver: "v1",
      };
      const body: reqBody = this.stateFilterForm;
      body.siteId = body.siteId === "" ? "" : body.siteId;
      body.equipmentNoId = body.equipmentNoId === "" ? null : body.equipmentNoId;
      body.statusId = body.statusId === "" ? null : body.statusId;

      try {
        const response: AxiosResponse<ApiResponseIronlake<IronlakeContentDOS>> =
          await ApiService.post(
            `${DOS_CRUD_API_URL}?${new URLSearchParams(params).toString()}`,
            body as AxiosRequestConfig,
          );
        const content = response.data.result.content;
        this.stateList = content.dailyOutstandingServiceList;
        if (content.dailyOutstandingServiceDraftList) {
          bulkStore.stateDraftData = content.dailyOutstandingServiceDraftList;
        }
        this.setTotalPage(content.totalData);
      } catch (error) {
        console.log(error);
      }
      this.stateLoading = false;
    },
    async setPage(newPage: number) {
      this.statePaginationLoading = true;
      this.statePagination.totalPageSize = this.stateFilterForm.pageSize;
      this.statePagination.handleCurrentPageChange(newPage);
      this.stateFilterForm.page = this.statePagination.currentPage;
      await this.getList();
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200);
    },
    async setAppliedFilter(filter: reqBody) {
      this.stateFilterForm = filter;
      await this.setPage(1);
    },

    async export() {
      const params = {
        ver: "v1",
      };
      const {
        equipmentNoId,
        smuDue,
        workOrder,
        serviceSize,
        statusId,
        siteId,
        dateFrom,
        dateTo,
      } = this.stateFilterForm;
      const downloadListPayload = {
        equipmentNoId,
        smuDue,
        workOrder,
        serviceSize,
        statusId,
        siteId,
        dateFrom,
        dateTo,
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.postBlob(
          `${DOS_EXPORT_API_URL}/false?${new URLSearchParams(
            params,
          ).toString()}`,
          downloadListPayload as AxiosRequestConfig,
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },

    resetFilter() {
      this.stateFilterForm = new InitialFilterForm(authStore.user) as reqBody;
    },
  },
});
