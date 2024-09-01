import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  GET_API_URL,
  LOOKUP_API_URL_SPECIFIC,
  EXPORT_API_URL_GENERAL,
  EXPORT_API_URL_SPECIFIC
} from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem,
  ListItemSpecific
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-status/ListItem";
import {
  FilterDataSpecific,
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-status/FilterData";
import {
  LookupItemSpecific
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-status/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  mapOption,
  mapOptionFromLookupApi
} from "@/core/helpers/mapOption";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialFilterSpecific = {
  cbmGroup: "",
  cbmGroupTo: "",
  component: "",
  componentTo: "",
  parameter: "",
  parameterTo: "",
  cluster: "",
  clusterTo: "",
  sampleCount: "",
  sampleCountTo: "",
  sampleWeight: "",
  sampleWeightTo: "",
  cautionLimit: "",
  cautionLimitTo: "",
  criticalLimit: "",
  criticalLimitTo: "",
  summaryWeight: "",
  summaryWeightTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};
const initialFilter = {
  cluster: "",
  clusterTo: "",
  sampleCount: "",
  sampleCountTo: "",
  sampleWeight: "",
  sampleWeightTo: "",
  cautionLimit: "",
  cautionLimitTo: "",
  criticalLimit: "",
  criticalLimitTo: "",
  summaryWeight: "",
  summaryWeightTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useCbmStatusListStore = defineStore({
  id: "CbmStatusList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      stateFilterDataSpecific: {
        ...initialFilterSpecific
      } as FilterDataSpecific,
      stateLastUsedFilterDataSpecific: {
        ...initialFilterSpecific
      } as FilterDataSpecific,
      statePageName: "cbmStatus",
      stateDisplayData: [] as ListItem[],
      stateDisplayDataSpecific: [] as ListItemSpecific[],
      statePagination: new PaginationType(),
      statePaginationSpecific: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateCbmGroupOption: [] as Option[],
      stateParameterOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateClusterOption: [] as Option[],
      stateSampleCountOption: [] as Option[],
      stateSampleWeightOption: [] as Option[],
      stateCautionLimitOption: [] as Option[],
      stateCriticalLimitOption: [] as Option[],
      stateSummaryWeightOption: [] as Option[],
    }
  },
  getters: {
    pageName: (state) => {
      return state.statePageName;
    },
    pagination: (state) => {
      return state.statePagination;
    },
    paginationSpecific: (state) => {
      return state.statePaginationSpecific;
    },
    displayData: (state) => {
      return state.stateDisplayData;
    },
    displayDataSpecific: (state) => {
      return state.stateDisplayDataSpecific;
    },
    filterData: (state) => {
      return state.stateFilterData;
    },
    lastUsedFilterData: (state) => {
      return state.stateLastUsedFilterData
    },
    filterDataSpecific: (state) => {
      return state.stateFilterDataSpecific;
    },
    lastUsedFilterDataSpecific: (state) => {
      return state.stateLastUsedFilterDataSpecific
    },
    loading: (state) => {
      return state.stateLoading;
    },
    paginationLoading: (state) => {
      return state.statePaginationLoading;
    },
    cbmGroupOption: (state) => {
      return state.stateCbmGroupOption;
    },
    parameterOption: (state) => {
      return state.stateParameterOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    clusterOption: (state) => {
      return state.stateClusterOption;
    },
    sampleCountOption: (state) => {
      return state.stateSampleCountOption;
    },
    sampleWeightOption: (state) => {
      return state.stateSampleWeightOption;
    },
    cautionLimitOption: (state) => {
      return state.stateCautionLimitOption;
    },
    criticalLimitOption: (state) => {
      return state.stateCriticalLimitOption;
    },
    summaryWeightOption: (state) => {
      return state.stateSummaryWeightOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        cluster: this.stateFilterData.cluster,
        clusterTo: this.stateFilterData.clusterTo,
        sampleCount: this.stateFilterData.sampleCount,
        sampleCountTo: this.stateFilterData.sampleCountTo,
        sampleWeight: this.stateFilterData.sampleWeight,
        sampleWeightTo: this.stateFilterData.sampleWeightTo,
        cautionLimit: this.stateFilterData.cautionLimit,
        cautionLimitTo: this.stateFilterData.cautionLimitTo,
        criticalLimit: this.stateFilterData.criticalLimit,
        criticalLimitTo: this.stateFilterData.criticalLimitTo,
        // summaryWeight: this.stateFilterData.summaryWeight,
        // summaryWeightTo: this.stateFilterData.summaryWeightTo,
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
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, "cbm_status_general", new URLSearchParams(params).toString());
        this.stateDisplayData = response.data.result.content;
        this.setTotalPage(response.data.result.total);
        this.stateLastUsedFilterData = {
          ...this.stateFilterData
        } as FilterData
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        if (!error.response.data && (error as string)?.includes("Request failed with status code 401")) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        console.log(error);
      } finally {
        this.stateLoading = false;
      }
    },
    async getDataSpecific(isPageRefresh = true) {
      const params = {
        cbmGroup: this.stateFilterDataSpecific.cbmGroup,
        cbmGroupTo: this.stateFilterDataSpecific.cbmGroupTo,
        component: this.stateFilterDataSpecific.component,
        componentTo: this.stateFilterDataSpecific.componentTo,
        // parameter: this.stateFilterDataSpecific.parameter,
        // parameterTo: this.stateFilterDataSpecific.parameterTo,
        cluster: this.stateFilterDataSpecific.cluster,
        clusterTo: this.stateFilterDataSpecific.clusterTo,
        sampleCount: this.stateFilterDataSpecific.sampleCount,
        sampleCountTo: this.stateFilterDataSpecific.sampleCountTo,
        sampleWeight: this.stateFilterDataSpecific.sampleWeight,
        sampleWeightTo: this.stateFilterDataSpecific.sampleWeightTo,
        cautionLimit: this.stateFilterDataSpecific.cautionLimit,
        cautionLimitTo: this.stateFilterDataSpecific.cautionLimitTo,
        criticalLimit: this.stateFilterDataSpecific.criticalLimit,
        criticalLimitTo: this.stateFilterDataSpecific.criticalLimitTo,
        // summaryWeight: this.stateFilterDataSpecific.summaryWeight,
        // summaryWeightTo: this.stateFilterDataSpecific.summaryWeightTo,
        startDate: this.stateFilterDataSpecific.startDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterDataSpecific.startDate))) : "",
        startDateTo: this.stateFilterDataSpecific.startDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterDataSpecific.startDateTo))) : "",
        endDate: this.stateFilterDataSpecific.endDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterDataSpecific.endDate))) : "",
        endDateTo: this.stateFilterDataSpecific.endDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterDataSpecific.endDateTo))) : "",
        page: this.stateFilterDataSpecific.page.toString(),
        pageSize: this.stateFilterDataSpecific.pageSize.toString(),
        order: this.stateFilterDataSpecific.order,
        ver: this.stateFilterDataSpecific.ver
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayDataSpecific = [...[]]
        const response: AxiosResponse<ApiResponse<ListItemSpecific>> = await ApiService.get(GET_API_URL, "cbm_status_specific", new URLSearchParams(params).toString());
        this.stateDisplayDataSpecific = response.data.result.content;
        this.setTotalPageSpecific(response.data.result.total);
        this.stateLastUsedFilterDataSpecific = {
          ...this.stateFilterData
        } as FilterDataSpecific
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        if (!error.response.data && (error as string)?.includes("Request failed with status code 401")) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
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
        const response: AxiosResponse<SingleApiResponse<LookupItemSpecific>> = await ApiService.get(LOOKUP_API_URL_SPECIFIC, "", new URLSearchParams(params).toString());
        this.stateCbmGroupOption = mapOption(response.data.result.content.cbmGroup);
        this.stateComponentOption = mapOptionFromLookupApi(response.data.result.content.component, "component", "componentDescription");
        this.stateParameterOption = mapOption(response.data.result.content.parameter);
        this.stateClusterOption = mapOption(response.data.result.content.cluster);
        this.stateSampleCountOption = mapOption(response.data.result.content.sampleCount);
        this.stateSampleWeightOption = mapOption(response.data.result.content.sampleWeight);
        this.stateCautionLimitOption = mapOption(response.data.result.content.cautionLimit);
        this.stateCriticalLimitOption = mapOption(response.data.result.content.criticalLimit);
        // this.stateSummaryWeightOption = mapOption(response.data.result.content.summaryWeight);
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        console.log(error)
      }
    },
    async export(flag: string) {
      const paramsGeneral = {
        order: this.stateFilterData.order,
        ver: this.stateFilterData.ver,
        Gmt: new Date().toTimeString().slice(12, 17)
      };
      const paramsSpecific = {
        cbmGroup: this.stateFilterDataSpecific.cbmGroup,
        cbmGroupTo: this.stateFilterDataSpecific.cbmGroupTo,
        component: this.stateFilterDataSpecific.component,
        componentTo: this.stateFilterDataSpecific.componentTo,
        // parameter: this.stateFilterDataSpecific.parameter,
        // parameterTo: this.stateFilterDataSpecific.parameterTo,
        cluster: this.stateFilterDataSpecific.cluster,
        clusterTo: this.stateFilterDataSpecific.clusterTo,
        sampleCount: this.stateFilterDataSpecific.sampleCount,
        sampleCountTo: this.stateFilterDataSpecific.sampleCountTo,
        sampleWeight: this.stateFilterDataSpecific.sampleWeight,
        sampleWeightTo: this.stateFilterDataSpecific.sampleWeightTo,
        cautionLimit: this.stateFilterDataSpecific.cautionLimit,
        cautionLimitTo: this.stateFilterDataSpecific.cautionLimitTo,
        criticalLimit: this.stateFilterDataSpecific.criticalLimit,
        criticalLimitTo: this.stateFilterDataSpecific.criticalLimitTo,
        // summaryWeight: this.stateFilterDataSpecific.summaryWeight,
        // summaryWeightTo: this.stateFilterDataSpecific.summaryWeightTo,
        startDate: this.stateFilterDataSpecific.startDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterDataSpecific.startDate))) : "",
        startDateTo: this.stateFilterDataSpecific.startDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterDataSpecific.startDateTo))) : "",
        endDate: this.stateFilterDataSpecific.endDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterDataSpecific.endDate))) : "",
        endDateTo: this.stateFilterDataSpecific.endDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterDataSpecific.endDateTo))) : "",
        order: this.stateFilterDataSpecific.order,
        ver: this.stateFilterDataSpecific.ver,
        Gmt: new Date().toTimeString().slice(12, 17)
      };
      try {
        const ExportUrl = flag === 'General' ? EXPORT_API_URL_GENERAL : EXPORT_API_URL_SPECIFIC
        const params = flag === 'General' ? paramsGeneral : paramsSpecific
        const response: AxiosResponse<Blob> = await ApiService.getBlob(ExportUrl, "", new URLSearchParams(params).toString());
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
    setTotalPageSpecific(totalPage: number) {
      this.paginationSpecific.totalPage = totalPage;
      this.paginationSpecific.getPaginationStartIndex();
      this.paginationSpecific.getPaginationLastIndex();
    },
    async setPage(newPage: number) {
      this.statePaginationLoading = true;
      this.statePagination.handleCurrentPageChange(newPage);
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData();
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200)
    },
    async setPageSpecific(newPage: number) {
      this.statePaginationLoading = true;
      this.statePaginationSpecific.handleCurrentPageChange(newPage);
      this.stateFilterDataSpecific.page = this.statePaginationSpecific.currentPage;
      await this.getDataSpecific(false);
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200)
    },
    async setSort({ prop, order }, flag) {
      if (flag === 'Specific') {
        if (!prop && !order) {
          this.stateFilterDataSpecific.order = "";
        } else {
          const formatedOrder = order == "ascending" ? "asc" : "desc";
          this.stateFilterDataSpecific.order = `${prop}_${formatedOrder}`;
        }
        this.statePaginationSpecific.handleCurrentPageChange(1);
        this.stateFilterDataSpecific.page = this.statePaginationSpecific.currentPage;
        await this.getDataSpecific(false);
      } else {
        if (!prop && !order) {
          this.stateFilterData.order = "";
        } else {
          const formatedOrder = order == "ascending" ? "asc" : "desc";
          this.stateFilterData.order = `${prop}_${formatedOrder}`;
        }
        this.statePagination.handleCurrentPageChange(1);
        this.stateFilterData.page = this.statePagination.currentPage;
        await this.getData(false);
      }
    },
    setCbmGroup(value: string) {
      this.stateFilterDataSpecific.cbmGroup = value;
    },
    setCbmGroupTo(value: string) {
      this.stateFilterDataSpecific.cbmGroupTo = value;
    },
    setComponent(value: string) {
      this.stateFilterDataSpecific.component = value;
    },
    setComponentTo(value: string) {
      this.stateFilterDataSpecific.componentTo = value;
    },
    setParameter(value: string) {
      this.stateFilterDataSpecific.parameter = value;
    },
    setParameterTo(value: string) {
      this.stateFilterDataSpecific.parameterTo = value;
    },
    setCluster(value: string) {
      this.stateFilterDataSpecific.cluster = value;
    },
    setClusterTo(value: string) {
      this.stateFilterDataSpecific.clusterTo = value;
    },
    setSampleCount(value: string) {
      this.stateFilterDataSpecific.sampleCount = value;
    },
    setSampleCountTo(value: string) {
      this.stateFilterDataSpecific.sampleCountTo = value;
    },
    setSampleWeight(value: string) {
      this.stateFilterDataSpecific.sampleWeight = value;
    },
    setSampleWeightTo(value: string) {
      this.stateFilterDataSpecific.sampleWeightTo = value;
    },
    setCautionLimit(value: string) {
      this.stateFilterDataSpecific.cautionLimit = value;
    },
    setCautionLimitTo(value: string) {
      this.stateFilterDataSpecific.cautionLimitTo = value;
    },
    setCriticalLimit(value: string) {
      this.stateFilterDataSpecific.criticalLimit = value;
    },
    setCriticalLimitTo(value: string) {
      this.stateFilterDataSpecific.criticalLimitTo = value;
    },
    setSummaryWeight(value: string) {
      this.stateFilterDataSpecific.summaryWeight = value;
    },
    setSummaryWeightTo(value: string) {
      this.stateFilterDataSpecific.summaryWeightTo = value;
    },
    setStartDate(value: string) {
      this.stateFilterDataSpecific.startDate = value;
    },
    setStartDateTo(value: string) {
      this.stateFilterDataSpecific.startDateTo = value;
    },
    setEndDate(value: string) {
      this.stateFilterDataSpecific.endDate = value;
    },
    setEndDateTo(value: string) {
      this.stateFilterDataSpecific.endDateTo = value;
    },
    async resetFilter() {
      this.stateFilterDataSpecific.cbmGroup = "",
      this.stateFilterDataSpecific.cbmGroupTo = "",
      this.stateFilterDataSpecific.component = "",
      this.stateFilterDataSpecific.componentTo = "",
      this.stateFilterDataSpecific.parameter = "",
      this.stateFilterDataSpecific.parameterTo = "",
      this.stateFilterDataSpecific.cluster = "",
      this.stateFilterDataSpecific.clusterTo = "",
      this.stateFilterDataSpecific.sampleCount = "",
      this.stateFilterDataSpecific.sampleCountTo = "",
      this.stateFilterDataSpecific.sampleWeight = "",
      this.stateFilterDataSpecific.sampleWeightTo = "",
      this.stateFilterDataSpecific.cautionLimit = "",
      this.stateFilterDataSpecific.cautionLimitTo = "",
      this.stateFilterDataSpecific.criticalLimit = "",
      this.stateFilterDataSpecific.criticalLimitTo = "",
      this.stateFilterDataSpecific.summaryWeight = "",
      this.stateFilterDataSpecific.summaryWeightTo = "",
      this.stateFilterDataSpecific.startDate = "";
      this.stateFilterDataSpecific.startDateTo = "";
      this.stateFilterDataSpecific.endDate = "";
      this.stateFilterDataSpecific.endDateTo = "";
      const checkCbmGroup = this.stateLastUsedFilterDataSpecific.cbmGroup !== "";
      const checkCbmGroupTo = this.stateLastUsedFilterDataSpecific.cbmGroupTo !== "";
      const checkComponent = this.stateLastUsedFilterDataSpecific.component !== "";
      const checkComponentTo = this.stateLastUsedFilterDataSpecific.componentTo !== "";
      const checkParameter = this.stateLastUsedFilterDataSpecific.parameter !== "";
      const checkParameterTo = this.stateLastUsedFilterDataSpecific.parameterTo !== "";
      const checkCluster = this.stateLastUsedFilterDataSpecific.cluster !== "";
      const checkClusterTo = this.stateLastUsedFilterDataSpecific.clusterTo !== "";
      const checkSampleCount = this.stateLastUsedFilterDataSpecific.sampleCount !== "";
      const checkSampleCountTo = this.stateLastUsedFilterDataSpecific.sampleCountTo !== "";
      const checkSampleWeight = this.stateLastUsedFilterDataSpecific.sampleWeight !== "";
      const checkSampleWeightTo = this.stateLastUsedFilterDataSpecific.sampleWeightTo !== "";
      const checkCautionLimit = this.stateLastUsedFilterDataSpecific.cautionLimit !== "";
      const checkCautionLimitTo = this.stateLastUsedFilterDataSpecific.cautionLimitTo !== "";
      const checkCriticalLimit = this.stateLastUsedFilterDataSpecific.criticalLimit !== "";
      const checkCriticalLimitTo = this.stateLastUsedFilterDataSpecific.criticalLimitTo !== "";
      const checkSummaryWeight = this.stateLastUsedFilterDataSpecific.summaryWeight !== "";
      const checkSummaryWeightTo = this.stateLastUsedFilterDataSpecific.summaryWeightTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== "";
      if (checkCbmGroup || checkCbmGroupTo || checkComponent || checkComponentTo || checkParameter ||
        checkParameterTo || checkCluster || checkClusterTo || checkSampleCount ||
        checkSampleCountTo || checkSampleWeight || checkSampleWeightTo || checkCautionLimit ||
        checkCautionLimitTo || checkCriticalLimit || checkCriticalLimitTo || checkSummaryWeight || checkSummaryWeightTo ||
        checkStartDate || checkStartDateTo || checkEndDate ||
        checkEndDateTo) {
        await this.getDataSpecific();
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
