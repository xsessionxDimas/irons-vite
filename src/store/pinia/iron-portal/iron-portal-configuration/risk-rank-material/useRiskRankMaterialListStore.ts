import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/risk-rank-material/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/risk-rank-material/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/risk-rank-material/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialFilter = {
  maxRiskRank: "",
  maxRiskRankTo: "",
  revisedRisk: "",
  revisedRiskTo: "",
  overallRisk: "",
  overallRiskTo: "",
  failureTiming: "",
  failureTimingTo: "",
  systemImpact: "",
  systemImpactTo: "",
  opsImpact: "",
  opsImpactTo: "",
  supplyRisk: "",
  supplyRiskTo: "",
  failureCost: "",
  failureCostTo: "",
  comments: "",
  commentsTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useRiskRankMaterialListStore = defineStore({
  id: "riskRankMaterialList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "riskRankMaterial",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateMaxRiskRankOption: [] as Option[],
      stateRevisedRiskOption: [] as Option[],
      stateOverallRiskOption: [] as Option[],
      stateFailureTimingOption: [] as Option[],
      stateSystemImpactOption: [] as Option[],
      stateOpsImpactOption: [] as Option[],
      stateSupplyRiskOption: [] as Option[],
      stateFailureCostOption: [] as Option[],
      stateCommentsOption: [] as Option[],
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
    maxRiskRankOption: (state) => {
      return state.stateMaxRiskRankOption;
    },
    revisedRiskOption: (state) => {
      return state.stateRevisedRiskOption;
    },
    overallRiskOption: (state) => {
      return state.stateOverallRiskOption;
    },
    failureTimingOption: (state) => {
      return state.stateFailureTimingOption;
    },
    systemImpactOption: (state) => {
      return state.stateSystemImpactOption;
    },
    opsImpactOption: (state) => {
      return state.stateOpsImpactOption;
    },
    supplyRiskOption: (state) => {
      return state.stateSupplyRiskOption;
    },
    failureCostOption: (state) => {
      return state.stateFailureCostOption;
    },
    commentsOption: (state) => {
      return state.stateCommentsOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        maxRiskRank: this.stateFilterData.maxRiskRank,
        maxRiskRankTo: this.stateFilterData.maxRiskRankTo,
        revisedRisk: this.stateFilterData.revisedRisk,
        revisedRiskTo: this.stateFilterData.revisedRiskTo,
        overallRisk: this.stateFilterData.overallRisk,
        overallRiskTo: this.stateFilterData.overallRiskTo,
        failureTiming: this.stateFilterData.failureTiming,
        failureTimingTo: this.stateFilterData.failureTimingTo,
        systemImpact: this.stateFilterData.systemImpact,
        systemImpactTo: this.stateFilterData.systemImpactTo,
        opsImpact: this.stateFilterData.opsImpact,
        opsImpactTo: this.stateFilterData.opsImpactTo,
        supplyRisk: this.stateFilterData.supplyRisk,
        supplyRiskTo: this.stateFilterData.supplyRiskTo,
        failureCost: this.stateFilterData.failureCost,
        failureCostTo: this.stateFilterData.failureCostTo,
        comments: this.stateFilterData.comments,
        commentsTo: this.stateFilterData.commentsTo,
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
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, "risk_rank_interval", new URLSearchParams(params).toString());
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
        this.stateMaxRiskRankOption = mapOption(response.data.result.content.maxRiskRank)
        this.stateRevisedRiskOption = mapOption(response.data.result.content.revisedRisk)
        this.stateOverallRiskOption = mapOption(response.data.result.content.overallRisk)
        this.stateFailureTimingOption = mapOption(response.data.result.content.failureTiming)
        this.stateSystemImpactOption = mapOption(response.data.result.content.systemImpact)
        this.stateOpsImpactOption = mapOption(response.data.result.content.opsImpact)
        this.stateSupplyRiskOption = mapOption(response.data.result.content.supplyRisk)
        this.stateFailureCostOption = mapOption(response.data.result.content.failureCost)
        this.stateCommentsOption = mapOption(response.data.result.content.comments)
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
    setMaxRiskRank(value: string) {
      this.stateFilterData.maxRiskRank = value;
    },
    setMaxRiskRankTo(value: string) {
      this.stateFilterData.maxRiskRankTo = value;
    },
    setRevisedRisk(value: string) {
      this.stateFilterData.revisedRisk = value;
    },
    setRevisedRiskTo(value: string) {
      this.stateFilterData.revisedRiskTo = value;
    },
    setOverallRisk(value: string) {
      this.stateFilterData.overallRisk = value;
    },
    setOverallRiskTo(value: string) {
      this.stateFilterData.overallRiskTo = value;
    },
    setFailureTiming(value: string) {
      this.stateFilterData.failureTiming = value;
    },
    setFailureTimingTo(value: string) {
      this.stateFilterData.failureTimingTo = value;
    },
    setSystemImpact(value: string) {
      this.stateFilterData.systemImpact = value;
    },
    setSystemImpactTo(value: string) {
      this.stateFilterData.systemImpactTo = value;
    },
    setOpsImpact(value: string) {
      this.stateFilterData.opsImpact = value;
    },
    setOpsImpactTo(value: string) {
      this.stateFilterData.opsImpactTo = value;
    },
    setSupplyRisk(value: string) {
      this.stateFilterData.supplyRisk = value;
    },
    setSupplyRiskTo(value: string) {
      this.stateFilterData.supplyRiskTo = value;
    },
    setFailureCost(value: string) {
      this.stateFilterData.failureCost = value;
    },
    setFailureCostTo(value: string) {
      this.stateFilterData.failureCostTo = value;
    },
    setComments(value: string) {
      this.stateFilterData.comments = value;
    },
    setCommentsTo(value: string) {
      this.stateFilterData.commentsTo = value;
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
      this.stateFilterData.maxRiskRank = "";
      this.stateFilterData.maxRiskRankTo = "";
      this.stateFilterData.revisedRisk = "";
      this.stateFilterData.revisedRiskTo = "";
      this.stateFilterData.overallRisk = "";
      this.stateFilterData.overallRiskTo = "";
      this.stateFilterData.failureTiming = "";
      this.stateFilterData.failureTimingTo = "";
      this.stateFilterData.systemImpact = "";
      this.stateFilterData.systemImpactTo = "";
      this.stateFilterData.opsImpact = "";
      this.stateFilterData.opsImpactTo = "";
      this.stateFilterData.supplyRisk = "";
      this.stateFilterData.supplyRiskTo = "";
      this.stateFilterData.failureCost = "";
      this.stateFilterData.failureCostTo = "";
      this.stateFilterData.comments = "";
      this.stateFilterData.commentsTo = "";
      this.stateFilterData.startDate = "";
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.endDateTo = "";
      const checkMaxRiskRank = this.stateLastUsedFilterData.maxRiskRank !== "";
      const checkMaxRiskRankTo = this.stateLastUsedFilterData.maxRiskRankTo !== "";
      const checkRevisedRisk = this.stateLastUsedFilterData.revisedRisk !== "";
      const checkRevisedRiskTo = this.stateLastUsedFilterData.revisedRiskTo !== "";
      const checkOverallRisk = this.stateLastUsedFilterData.overallRisk !== "";
      const checkOverallRiskTo = this.stateLastUsedFilterData.overallRiskTo !== "";
      const checkFailureTiming = this.stateLastUsedFilterData.failureTiming !== "";
      const checkFailureTimingTo = this.stateLastUsedFilterData.failureTimingTo !== "";
      const checkSystemImpact = this.stateLastUsedFilterData.systemImpact !== "";
      const checkSystemImpactTo = this.stateLastUsedFilterData.systemImpactTo !== "";
      const checkOpsImpact = this.stateLastUsedFilterData.opsImpact !== "";
      const checkOpsImpactTo = this.stateLastUsedFilterData.opsImpactTo !== "";
      const checkSupplyRisk = this.stateLastUsedFilterData.supplyRisk !== "";
      const checkSupplyRiskTo = this.stateLastUsedFilterData.supplyRiskTo !== "";
      const checkFailureCost = this.stateLastUsedFilterData.failureCost !== "";
      const checkFailureCostTo = this.stateLastUsedFilterData.failureCostTo !== "";
      const checkComments = this.stateLastUsedFilterData.comments !== "";
      const checkCommentsTo = this.stateLastUsedFilterData.commentsTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== "";
      if (
        checkMaxRiskRank ||
        checkMaxRiskRankTo ||
        checkRevisedRisk ||
        checkRevisedRiskTo ||
        checkOverallRisk ||
        checkOverallRiskTo ||
        checkFailureTiming ||
        checkFailureTimingTo ||
        checkSystemImpact ||
        checkSystemImpactTo ||
        checkOpsImpact ||
        checkOpsImpactTo ||
        checkSupplyRisk ||
        checkSupplyRiskTo ||
        checkFailureCost ||
        checkFailureCostTo ||
        checkComments ||
        checkCommentsTo ||
        checkStartDate ||
        checkStartDateTo ||
        checkEndDate ||
        checkEndDateTo
      ) {
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
