/* eslint-disable @typescript-eslint/no-explicit-any */
import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  GET_API_URL,
  LOOKUP_API_URL,
  EXPORT_API_URL,
  GET_THRESHOLD_API_URL,
} from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem,
  ThresholdItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-threshold/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-threshold/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-threshold/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  mapOptionWithThreeLabelFromLookupApi,
  mapOption,
  mapOptionFromLookupApi,
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
  cbmType: "",
  cbmTypeTo: "",
  site: "",
  siteTo: "",
  equipmentModel: "",
  equipmentModelTo: "",
  component: "",
  componentTo: "",
  parameterFrom: "",
  parameterFromTo: "",
  parameterTo: "",
  parameterToTo: "",
  registerNumber: "",
  registerNumberTo: "",
  severityLevel: "",
  severityLevelTo: "",
  uomFrom: "",
  uomFromTo: "",
  uomTo: "",
  uomToTo: "",
  uomConvertRatio: "",
  uomConvertRatioTo: "",
  rating: "",
  ratingTo: "",
  operatorMin: "",
  operatorMinTo: "",
  valueMin: "",
  valueMinTo: "",
  operatorMax: "",
  operatorMaxTo: "",
  valueMax: "",
  valueMaxTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useCbmThresholdListStore = defineStore({
  id: "cbmThresholdList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "cbmThreshold",
      stateActiveTab: "General",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      stateLoadingTableThreshold: false as boolean,
      statePaginationLoading: false as boolean,
      stateSiteOption: [] as Option[],
      stateEquipmentModelOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateCbmTypeOption: [] as Option[],
      stateRegisterNumberOption: [] as Option[],
      stateParameterFromOption: [] as Option[],
      stateParameterToOption: [] as Option[],
      stateSeverityLevelOption: [] as Option[],
      stateUomFromOption: [] as Option[],
      stateUomToOption: [] as Option[],
      stateUomConvertRatioOption: [] as Option[],
      stateRatingOption: [] as Option[],
      stateOperatorMinOption: [] as Option[],
      stateValueMinOption: [] as Option[],
      stateOperatorMaxOption: [] as Option[],
      stateValueMaxOption: [] as Option[],
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
    siteOption: (state) => {
      return state.stateSiteOption;
    },
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    cbmTypeOption: (state) => {
      return state.stateCbmTypeOption;
    },
    registerNumberOption: (state) => {
      return state.stateRegisterNumberOption;
    },
    parameterFromOption: (state) => {
      return state.stateParameterFromOption;
    },
    parameterToOption: (state) => {
      return state.stateParameterToOption;
    },
    severityLevelOption: (state) => {
      return state.stateSeverityLevelOption;
    },
    uomFromOption: (state) => {
      return state.stateUomFromOption;
    },
    uomToOption: (state) => {
      return state.stateUomToOption;
    },
    uomConvertRatioOption: (state) => {
      return state.stateUomConvertRatioOption;
    },
    ratingOption: (state) => {
      return state.stateRatingOption;
    },
    operatorMinOption: (state) => {
      return state.stateOperatorMinOption;
    },
    valueMinOption: (state) => {
      return state.stateValueMinOption;
    },
    operatorMaxOption: (state) => {
      return state.stateOperatorMaxOption;
    },
    valueMaxOption: (state) => {
      return state.stateValueMaxOption;
    },
    activeTab: (state) => {
      return state.stateActiveTab;
    },
  },
  actions: {
    setActiveTab(tab: string) {
      this.stateActiveTab = tab;
    },
    setGeneralParam() {
      return {
        equipmentModel: this.stateFilterData.equipmentModel,
        equipmentModelTo: this.stateFilterData.equipmentModelTo,
        component: this.stateFilterData.component,
        componentTo: this.stateFilterData.componentTo,
        cbmType: this.stateFilterData.cbmType,
        cbmTypeTo: this.stateFilterData.cbmTypeTo,
        registerNumber: this.stateFilterData.registerNumber,
        registerNumberTo: this.stateFilterData.registerNumberTo,
        parameterFrom: this.stateFilterData.parameterFrom,
        parameterFromTo: this.stateFilterData.parameterFromTo,
        parameterTo: this.stateFilterData.parameterTo,
        parameterToTo: this.stateFilterData.parameterToTo,
        severityLevel: this.stateFilterData.severityLevel,
        severityLevelTo: this.stateFilterData.severityLevelTo,
        uomFrom: this.stateFilterData.uomFrom,
        uomFromTo: this.stateFilterData.uomFromTo,
        uomTo: this.stateFilterData.uomTo,
        uomToTo: this.stateFilterData.uomToTo,
        uomConvertRatio: this.stateFilterData.uomConvertRatio,
        uomConvertRatioTo: this.stateFilterData.uomConvertRatioTo,
        startDate: this.stateFilterData.startDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDate))) : "",
        startDateTo: this.stateFilterData.startDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDateTo))) : "",
        endDate: this.stateFilterData.endDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDate))) : "",
        endDateTo: this.stateFilterData.endDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDateTo))) : "",
        order: this.stateFilterData.order,
        ver: this.stateFilterData.ver
      }
    },
    async getData(isPageRefresh = true, isSpecific = false) {
      const generalParams = this.setGeneralParam()
      const params = isSpecific ? {
        ...generalParams,
        site: this.stateFilterData.site,
        siteTo: this.stateFilterData.siteTo,
        page: this.stateFilterData.page.toString(),
        pageSize: this.stateFilterData.pageSize.toString(),
      } : {
        ...generalParams,
        page: this.stateFilterData.page.toString(),
        pageSize: this.stateFilterData.pageSize.toString(),
      };

      try {
        if (isPageRefresh) {
          this.stateLoading = true;
        }
        this.statePaginationLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, `cbm_threshold${isSpecific ? '_specific' : ''}`, new URLSearchParams(params).toString());
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
        console.log(error);
        sendErrorEvent('IRONS', error);
      } finally {
        this.stateLoading = false;
        this.statePaginationLoading = false;
      }
    },
    async getCbmThresholdList(selectedCbmThresholdId) {
      const params = {
        cbmThresholdId: selectedCbmThresholdId,
        ver: "v1"
      }

      try {
        const indexOfDiplayData = this.stateDisplayData.findIndex((e) => {
          return e.cbmThresholdId == selectedCbmThresholdId
        })
        if (indexOfDiplayData != -1) {
          const response: AxiosResponse<ApiResponse<ThresholdItem>> = await ApiService.get(`${GET_THRESHOLD_API_URL}?${new URLSearchParams(params).toString()}`);
          this.stateDisplayData[indexOfDiplayData].thresholdList = response.data.result.content.map((threshold, index) => {
            return {
              id: threshold.id,
              idFe: index + 1,
              rating: threshold.rating,
              operatorMin: threshold.operatorMin,
              valueMin: threshold.valueMin,
              operatorMax: threshold.operatorMax,
              valueMax: threshold.valueMax,
              isActive: threshold.isActive,
            }
          });
        }
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async getLookup(isSpecific = false) {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.get(LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentModelOption = mapOptionWithThreeLabelFromLookupApi(response.data.result.content.equipmentModel, "equipmentModel", "brand", "equipmentModelDescription");
        this.stateComponentOption = mapOptionFromLookupApi(response.data.result.content.component, "component", "componentDescription");
        this.stateCbmTypeOption = mapOptionFromLookupApi(response.data.result.content.cbmType, "type", "type", false);
        this.stateRegisterNumberOption = mapOption(response.data.result.content.registerNumber);
        this.stateParameterFromOption = mapOption(response.data.result.content.parameterFrom);
        this.stateParameterToOption = mapOption(response.data.result.content.parameterTo);
        this.stateSeverityLevelOption = mapOption(response.data.result.content.severityLevel);
        this.stateUomFromOption = mapOption(response.data.result.content.uomFrom);
        this.stateUomToOption = mapOption(response.data.result.content.uomTo);
        this.stateUomConvertRatioOption = mapOption(response.data.result.content.uomConvertRatio);
        this.stateRatingOption = mapOptionFromLookupApi(response.data.result.content.rating, "rating", "ratingDescription");
        this.stateOperatorMinOption = mapOptionFromLookupApi(response.data.result.content.operatorMin, "operator", "operatorDescription");
        this.stateValueMinOption = mapOption(response.data.result.content.valueMin);
        this.stateOperatorMaxOption = mapOptionFromLookupApi(response.data.result.content.operatorMax, "operator", "operatorDescription");
        this.stateValueMaxOption = mapOption(response.data.result.content.valueMin);
        this.stateSiteOption = mapOptionWithThreeLabelFromLookupApi(response.data.result.content.site, "siteDescription", "siteId", "siteCode")
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async export(isSpecific = false) {
      const generalParams = this.setGeneralParam()
      const params = {
        ...generalParams,
        Gmt: new Date().toTimeString().slice(12, 17)
      };
      try {
        this.stateLoading = true
        const response: AxiosResponse<Blob> = await ApiService.getBlob(`${EXPORT_API_URL}${isSpecific ? '_specific' : ''}`, "", new URLSearchParams(params).toString());
        return response.data;
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateLoading = false
      }
    },
    setTotalPage(totalPage: number) {
      this.pagination.totalPage = totalPage;
      this.pagination.getPaginationStartIndex();
      this.pagination.getPaginationLastIndex();
    },
    async setPage(newPage: number) {
      this.setActiveTab("General")
      this.statePagination.handleCurrentPageChange(newPage);
      this.stateFilterData.page = this.statePagination.currentPage;
      this.getData(false, false);
    },
    async setPageSpecific(newPage: number) {
      this.setActiveTab("Specific")
      this.statePagination.handleCurrentPageChange(newPage);
      this.stateFilterData.page = this.statePagination.currentPage;
      this.getData(false, true);
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
    async setSortSpecific({ prop, order }) {
      if (!prop && !order) {
        this.stateFilterData.order = "";
      } else {
        const formatedOrder = order == "ascending" ? "asc" : "desc";
        this.stateFilterData.order = `${prop}_${formatedOrder}`;
      }
      this.statePagination.handleCurrentPageChange(1);
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData(false, true);
    },
    setSite(value: string) {
      this.stateFilterData.site = value;
    },
    setSiteTo(value: string) {
      this.stateFilterData.siteTo = value;
    },
    setEquipmentModel(value: string) {
      this.stateFilterData.equipmentModel = value;
    },
    setEquipmentModelTo(value: string) {
      this.stateFilterData.equipmentModelTo = value;
    },
    setComponent(value: string) {
      this.stateFilterData.component = value;
    },
    setComponentTo(value: string) {
      this.stateFilterData.componentTo = value;
    },
    setCbmType(value: string) {
      this.stateFilterData.cbmType = value;
    },
    setCbmTypeTo(value: string) {
      this.stateFilterData.cbmTypeTo = value;
    },
    setRegisterNumber(value: string) {
      this.stateFilterData.registerNumber = value;
    },
    setRegisterNumberTo(value: string) {
      this.stateFilterData.registerNumberTo = value;
    },
    setParameterFrom(value: string) {
      this.stateFilterData.parameterFrom = value;
    },
    setParameterFromTo(value: string) {
      this.stateFilterData.parameterFromTo = value;
    },
    setParameterTo(value: string) {
      this.stateFilterData.parameterTo = value;
    },
    setParameterToTo(value: string) {
      this.stateFilterData.parameterToTo = value;
    },
    setSeverityLevel(value: string) {
      this.stateFilterData.severityLevel = value;
    },
    setSeverityLevelTo(value: string) {
      this.stateFilterData.severityLevelTo = value;
    },
    setUomFrom(value: string) {
      this.stateFilterData.uomFrom = value;
    },
    setUomFromTo(value: string) {
      this.stateFilterData.uomFromTo = value;
    },
    setUomTo(value: string) {
      this.stateFilterData.uomTo = value;
    },
    setUomToTo(value: string) {
      this.stateFilterData.uomToTo = value;
    },
    setUomConvertRatio(value: string) {
      this.stateFilterData.uomConvertRatio = value;
    },
    setUomConvertRatioTo(value: string) {
      this.stateFilterData.uomConvertRatioTo = value;
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
      this.stateFilterData.site = "";
      this.stateFilterData.siteTo = "";
      this.stateFilterData.equipmentModel = "";
      this.stateFilterData.equipmentModelTo = "";
      this.stateFilterData.component = "";
      this.stateFilterData.componentTo = "";
      this.stateFilterData.cbmType = "";
      this.stateFilterData.cbmTypeTo = "";
      this.stateFilterData.registerNumber = "";
      this.stateFilterData.registerNumberTo = "";
      this.stateFilterData.parameterFrom = "";
      this.stateFilterData.parameterFromTo = "";
      this.stateFilterData.parameterTo = "";
      this.stateFilterData.parameterToTo = "";
      this.stateFilterData.severityLevel = "";
      this.stateFilterData.severityLevelTo = "";
      this.stateFilterData.uomFrom = "";
      this.stateFilterData.uomFromTo = "";
      this.stateFilterData.uomTo = "";
      this.stateFilterData.uomToTo = "";
      this.stateFilterData.uomConvertRatio = "";
      this.stateFilterData.uomConvertRatioTo = "";
      this.stateFilterData.startDate = "";
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.endDateTo = "";
      const checkSite = this.stateLastUsedFilterData.site !== "";
      const checkSiteTo = this.stateLastUsedFilterData.siteTo !== "";
      const checkEquipmentModel = this.stateLastUsedFilterData.equipmentModel !== "";
      const checkEquipmentModelTo = this.stateLastUsedFilterData.equipmentModelTo !== "";
      const checkComponent = this.stateLastUsedFilterData.component !== "";
      const checkComponentTo = this.stateLastUsedFilterData.componentTo !== "";
      const checkCbmType = this.stateLastUsedFilterData.cbmType !== "";
      const checkCbmTypeTo = this.stateLastUsedFilterData.cbmTypeTo !== "";
      const checkRegisterNumber = this.stateLastUsedFilterData.registerNumber !== "";
      const checkRegisterNumberTo = this.stateLastUsedFilterData.registerNumberTo !== "";
      const checkParameterFrom = this.stateLastUsedFilterData.parameterFrom !== "";
      const checkParameterFromTo = this.stateLastUsedFilterData.parameterFromTo !== "";
      const checkParameterTo = this.stateLastUsedFilterData.parameterTo !== "";
      const checkParameterToTo = this.stateLastUsedFilterData.parameterToTo !== "";
      const checkSeverityLevel = this.stateLastUsedFilterData.severityLevel !== "";
      const checkSeverityLevelTo = this.stateLastUsedFilterData.severityLevelTo !== "";
      const checkUomFrom = this.stateLastUsedFilterData.uomFrom !== "";
      const checkUomFromTo = this.stateLastUsedFilterData.uomFromTo !== "";
      const checkUomTo = this.stateLastUsedFilterData.uomTo !== "";
      const checkUomToTo = this.stateLastUsedFilterData.uomToTo !== "";
      const checkUomConvertRatio = this.stateLastUsedFilterData.uomConvertRatio !== "";
      const checkUomConvertRatioTo = this.stateLastUsedFilterData.uomConvertRatioTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== "";
      if (checkSite || checkSiteTo || checkComponent || checkComponentTo || checkCbmType || checkEquipmentModel || checkEquipmentModelTo
        || checkCbmTypeTo || checkRegisterNumber || checkRegisterNumberTo || checkParameterFrom
        || checkParameterFromTo || checkSeverityLevel || checkParameterTo || checkParameterToTo
        || checkSeverityLevelTo || checkUomFrom || checkUomFromTo || checkUomTo || checkUomToTo
        || checkUomConvertRatio || checkUomConvertRatioTo || checkStartDate || checkStartDateTo
        || checkEndDate || checkEndDateTo) {
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
