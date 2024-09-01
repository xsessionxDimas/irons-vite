import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-risk-rating/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-risk-rating/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-risk-rating/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  mapOption,
  mapOptionFromLookupApi,
  mapOptionWithThreeLabelFromLookupApi
} from "@/core/helpers/mapOption";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialFilter = {
  equipmentModel: "",
  equipmentModelTo: "",
  component: "",
  componentTo: "",
  componentType: "",
  componentTypeTo: "",
  maxRiskRank: "",
  maxRiskRankTo: "",
  revisedRank: "",
  revisedRankTo: "",
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
  site: "",
  siteTo: "",
  oemInterval: "",
  oemIntervalTo: "",
  bumaAuTarget: "",
  bumaAuTargetTo: "",
  componentWeight: "",
  componentWeightTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useComponentRiskRatingListStore = defineStore({
  id: "componentRiskRatingList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "componentRiskRating",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateEquipmentModelOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateComponentTypeOption: [] as Option[],
      stateMaxRiskRankOption: [] as Option[],
      stateRevisedRankOption: [] as Option[],
      stateOverallRiskOption: [] as Option[],
      stateFailureTimingOption: [] as Option[],
      stateSystemImpactOption: [] as Option[],
      stateOpsImpactOption: [] as Option[],
      stateSupplyRiskOption: [] as Option[],
      stateFailureCostOption: [] as Option[],
      stateCommentsOption: [] as Option[],
      stateSiteOption: [] as Option[],
      stateOemIntervalOption: [] as Option[],
      stateBumaAuTargetOption: [] as Option[],
      stateComponentWeightOption: [] as Option[],
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
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    componentTypeOption: (state) => {
      return state.stateComponentTypeOption;
    },
    maxRiskRankOption: (state) => {
      return state.stateMaxRiskRankOption;
    },
    revisedRankOption: (state) => {
      return state.stateRevisedRankOption;
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
    siteOption: (state) => {
      return state.stateSiteOption;
    },
    oemIntervalOption: (state) => {
      return state.stateOemIntervalOption;
    },
    bumaAuTargettOption: (state) => {
      return state.stateBumaAuTargetOption;
    },
    componentWeightOption: (state) => {
      return state.stateComponentWeightOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        site: this.stateFilterData.site,
        siteTo: this.stateFilterData.siteTo,
        equipmentModel: this.stateFilterData.equipmentModel,
        equipmentModelTo: this.stateFilterData.equipmentModelTo,
        component: this.stateFilterData.component,
        componentTo: this.stateFilterData.componentTo,
        componentType: this.stateFilterData.componentType,
        componentTypeTo: this.stateFilterData.componentTypeTo,
        oemInterval: this.stateFilterData.oemInterval,
        oemIntervalTo: this.stateFilterData.oemIntervalTo,
        bumaAuTarget: this.stateFilterData.bumaAuTarget,
        bumaAuTargetTo: this.stateFilterData.bumaAuTargetTo,
        maxRiskRank: this.stateFilterData.maxRiskRank,
        maxRiskRankTo: this.stateFilterData.maxRiskRankTo,
        revisedRank: this.stateFilterData.revisedRank,
        revisedRankTo: this.stateFilterData.revisedRankTo,
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
        componentWeight: this.stateFilterData.componentWeight,
        componentWeightTo: this.stateFilterData.componentWeightTo,
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
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, "", new URLSearchParams(params).toString());
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
      } finally {
        this.stateLoading = false;
      }
    },
    async getLookup() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.get(LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentModelOption = mapOptionFromLookupApi(response.data.result.content.equipmentModel, "equipmentModel", "equipmentModelDescription");
        this.stateComponentOption = mapOptionFromLookupApi(response.data.result.content.component, "component", "componentDescription");
        this.stateComponentTypeOption = mapOptionFromLookupApi(response.data.result.content.componentType, "componentType", "componentTypeDescription");
        this.stateMaxRiskRankOption = mapOption(response.data.result.content.maxRiskRank);
        this.stateRevisedRankOption = mapOption(response.data.result.content.revisedRank);
        this.stateOverallRiskOption = mapOption(response.data.result.content.overallRisk);
        this.stateFailureTimingOption = mapOption(response.data.result.content.failureTiming);
        this.stateSystemImpactOption = mapOption(response.data.result.content.systemImpact);
        this.stateOpsImpactOption = mapOption(response.data.result.content.opsImpact);
        this.stateSupplyRiskOption = mapOption(response.data.result.content.supplyRisk);
        this.stateFailureCostOption = mapOption(response.data.result.content.failureCost);
        this.stateCommentsOption = mapOption(response.data.result.content.comments);
        this.stateSiteOption = mapOptionWithThreeLabelFromLookupApi(response.data.result.content.site, "siteId", "siteCode", "siteDescription");
        this.stateOemIntervalOption = mapOption(response.data.result.content.oemInterval);
        this.stateBumaAuTargetOption = mapOption(response.data.result.content.bumaAuTarget);
        this.stateComponentWeightOption = mapOption(response.data.result.content.componentWeight);
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
        site: this.stateFilterData.site,
        siteTo: this.stateFilterData.siteTo,
        equipmentModel: this.stateFilterData.equipmentModel,
        equipmentModelTo: this.stateFilterData.equipmentModelTo,
        component: this.stateFilterData.component,
        componentTo: this.stateFilterData.componentTo,
        componentType: this.stateFilterData.componentType,
        componentTypeTo: this.stateFilterData.componentTypeTo,
        oemInterval: this.stateFilterData.oemInterval,
        oemIntervalTo: this.stateFilterData.oemIntervalTo,
        bumaAuTarget: this.stateFilterData.bumaAuTarget,
        bumaAuTargetTo: this.stateFilterData.bumaAuTargetTo,
        maxRiskRank: this.stateFilterData.maxRiskRank,
        maxRiskRankTo: this.stateFilterData.maxRiskRankTo,
        revisedRank: this.stateFilterData.revisedRank,
        revisedRankTo: this.stateFilterData.revisedRankTo,
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
        componentWeight: this.stateFilterData.componentWeight,
        componentWeightTo: this.stateFilterData.componentWeightTo,
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
    setEquipmentModel(value:string) {
      this.stateFilterData.equipmentModel = value;
    },
    setEquipmentModelTo(value:string) {
      this.stateFilterData.equipmentModelTo = value;
    },
    setComponent(value:string) {
      this.stateFilterData.component = value;
    },
    setComponentTo(value:string) {
      this.stateFilterData.componentTo = value;
    },
    setComponentType(value:string) {
      this.stateFilterData.componentType = value;
    },
    setComponentTypeTo(value:string) {
      this.stateFilterData.componentTypeTo = value;
    },
    setMaxRiskRank(value:string) {
      this.stateFilterData.maxRiskRank = value;
    },
    setMaxRiskRankTo(value:string) {
      this.stateFilterData.maxRiskRankTo = value;
    },
    setRevisedRank(value:string) {
      this.stateFilterData.revisedRank = value;
    },
    setRevisedRankTo(value:string) {
      this.stateFilterData.revisedRankTo = value;
    },
    setOverallRisk(value:string) {
      this.stateFilterData.overallRisk = value;
    },
    setOverallRiskTo(value:string) {
      this.stateFilterData.overallRiskTo = value;
    },
    setFailureTiming(value:string) {
      this.stateFilterData.failureTiming = value;
    },
    setFailureTimingTo(value:string) {
      this.stateFilterData.failureTimingTo = value;
    },
    setSystemImpact(value:string) {
      this.stateFilterData.systemImpact = value;
    },
    setSystemImpactTo(value:string) {
      this.stateFilterData.systemImpactTo = value;
    },
    setOpsImpact(value:string) {
      this.stateFilterData.opsImpact = value;
    },
    setOpsImpactTo(value:string) {
      this.stateFilterData.opsImpactTo = value;
    },
    setSupplyRisk(value:string) {
      this.stateFilterData.supplyRisk = value;
    },
    setSupplyRiskTo(value:string) {
      this.stateFilterData.supplyRiskTo = value;
    },
    setFailureCost(value:string) {
      this.stateFilterData.failureCost = value;
    },
    setFailureCostTo(value:string) {
      this.stateFilterData.failureCostTo = value;
    },
    setComments(value:string) {
      this.stateFilterData.comments = value;
    },
    setCommentsTo(value:string) {
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
    setSite(value: string) {
      this.stateFilterData.site = value;
    },
    setSiteTo(value: string) {
      this.stateFilterData.siteTo = value;
    },
    setOemInterval(value: string) {
      this.stateFilterData.oemInterval = value;
    },
    setOemIntervalTo(value: string) {
      this.stateFilterData.oemIntervalTo = value;
    },
    setBumaAuTarget(value: string) {
      this.stateFilterData.bumaAuTarget = value;
    },
    setBumaAuTargetTo(value: string) {
      this.stateFilterData.bumaAuTargetTo = value;
    },
    setComponentWeight(value: string) {
      this.stateFilterData.componentWeight = value;
    },
    setComponentWeightTo(value: string) {
      this.stateFilterData.componentWeightTo = value;
    },
    async resetFilter() {
      this.stateFilterData.equipmentModel = "";
      this.stateFilterData.equipmentModelTo = "";
      this.stateFilterData.component = "";
      this.stateFilterData.componentTo = "";
      this.stateFilterData.componentType = "";
      this.stateFilterData.componentTypeTo = "";
      this.stateFilterData.maxRiskRank = "";
      this.stateFilterData.maxRiskRankTo = "";
      this.stateFilterData.revisedRank = "";
      this.stateFilterData.revisedRankTo = "";
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
      this.stateFilterData.site = "";
      this.stateFilterData.siteTo = "";
      this.stateFilterData.oemInterval = "";
      this.stateFilterData.oemIntervalTo = "";
      this.stateFilterData.bumaAuTarget = "";
      this.stateFilterData.bumaAuTargetTo = "";
      this.stateFilterData.componentWeight = "";
      this.stateFilterData.componentWeightTo = "";
      const checkEquipmentModel = this.stateLastUsedFilterData.equipmentModel !== "";
      const checkEquipmentModelTo = this.stateLastUsedFilterData.equipmentModelTo !== "";
      const checkComponent = this.stateLastUsedFilterData.component !== "";
      const checkComponentTo = this.stateLastUsedFilterData.componentTo !== "";
      const checkComponentType = this.stateLastUsedFilterData.componentType !== "";
      const checkComponentTypeTo = this.stateLastUsedFilterData.componentTypeTo !== "";
      const checkMaxRiskRank = this.stateLastUsedFilterData.maxRiskRank !== "";
      const checkMaxRiskRankTo = this.stateLastUsedFilterData.maxRiskRankTo !== "";
      const checkRevisedRank = this.stateLastUsedFilterData.revisedRank !== "";
      const checkRevisedRankTo = this.stateLastUsedFilterData.revisedRankTo !== "";
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
      const checkSite = this.stateLastUsedFilterData.site !== "";
      const checkSiteTo = this.stateLastUsedFilterData.siteTo !== "";
      const checkOemInterval = this.stateLastUsedFilterData.oemInterval !== "";
      const checkOemIntervalTo = this.stateLastUsedFilterData.oemIntervalTo !== "";
      const checkBumaAuTarget = this.stateLastUsedFilterData.bumaAuTarget !== "";
      const checkBumaAuTargetTo = this.stateLastUsedFilterData.bumaAuTargetTo !== "";
      const checkComponentWeight = this.stateLastUsedFilterData.componentWeight !== "";
      const checkComponentWeightTo = this.stateLastUsedFilterData.componentWeightTo !== "";

      if (
        checkEquipmentModel ||
        checkEquipmentModelTo ||
        checkComponent ||
        checkComponentTo ||
        checkComponentType ||
        checkComponentTypeTo ||
        checkMaxRiskRank ||
        checkMaxRiskRankTo ||
        checkRevisedRank ||
        checkRevisedRankTo ||
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
        checkEndDateTo ||
        checkSite ||
        checkSiteTo ||
        checkOemInterval ||
        checkOemIntervalTo ||
        checkBumaAuTarget ||
        checkBumaAuTargetTo ||
        checkComponentWeight ||
        checkComponentWeightTo
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
