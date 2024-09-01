import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status/LookupItem";
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
  component: "",
  componentTo: "",
  sensorData: "",
  sensorDataTo: "",
  oilDataS1: "",
  oilDataS1To: "",
  oilDataS2: "",
  oilDataS2To: "",
  filterCutS1: "",
  filterCutS1To: "",
  filterCutS2: "",
  filterCutS2To: "",
  magPlug: "",
  magPlugTo: "",
  ironFormsCbm: "",
  ironFormsCbmTo: "",
  componentStatus: "",
  componentStatusTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useComponentStatusListStore = defineStore({
  id: "componentStatusList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "componentStatus",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateComponentOption: [] as Option[],
      stateSensorDataOption: [] as Option[],
      stateOilDataS1Option: [] as Option[],
      stateOilDataS2Option: [] as Option[],
      stateFilterCutS1Option: [] as Option[],
      stateFilterCutS2Option: [] as Option[],
      stateMagPlugOption: [] as Option[],
      stateIronFormsCbmOption: [] as Option[],
      stateComponentStatusOption: [] as Option[],
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
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    sensorDataOption: (state) => {
      return state.stateSensorDataOption;
    },
    oilDataS1Option: (state) => {
      return state.stateOilDataS1Option;
    },
    oilDataS2Option: (state) => {
      return state.stateOilDataS2Option;
    },
    filterCutS1Option: (state) => {
      return state.stateFilterCutS1Option;
    },
    filterCutS2Option: (state) => {
      return state.stateFilterCutS2Option;
    },
    magPlugOption: (state) => {
      return state.stateMagPlugOption;
    },
    ironFormsCbmOption: (state) => {
      return state.stateIronFormsCbmOption;
    },
    componentStatusOption: (state) => {
      return state.stateComponentStatusOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        component: this.stateFilterData.component,
        componentTo: this.stateFilterData.componentTo,
        sensorData: this.stateFilterData.sensorData,
        sensorDataTo: this.stateFilterData.sensorDataTo,
        oilDataS1: this.stateFilterData.oilDataS1,
        oilDataS1To: this.stateFilterData.oilDataS1To,
        oilDataS2: this.stateFilterData.oilDataS2,
        oilDataS2To: this.stateFilterData.oilDataS2To,
        filterCutS1: this.stateFilterData.filterCutS1,
        filterCutS1To: this.stateFilterData.filterCutS1To,
        filterCutS2: this.stateFilterData.filterCutS2,
        filterCutS2To: this.stateFilterData.filterCutS2To,
        magPlug: this.stateFilterData.magPlug,
        magPlugTo: this.stateFilterData.magPlugTo,
        ironFormsCbm: this.stateFilterData.ironFormsCbm,
        ironFormsCbmTo: this.stateFilterData.ironFormsCbmTo,
        componentStatus: this.stateFilterData.componentStatus,
        componentStatusTo: this.stateFilterData.componentStatusTo,
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
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, "component_status", new URLSearchParams(params).toString());
        this.stateDisplayData = response.data.result.content;
        this.setTotalPage(response.data.result.total);
        this.stateLastUsedFilterData = {
          ...this.stateFilterData
        } as FilterData
      } catch (error: any) {
        if (!error.response.data && (error as string)?.includes("Request failed with status code 401")) {
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
        this.stateComponentOption = mapOption(response.data.result.content.component)
        this.stateSensorDataOption = mapOption(response.data.result.content.sensorData)
        this.stateOilDataS1Option = mapOption(response.data.result.content.oilDataS1)
        this.stateOilDataS2Option = mapOption(response.data.result.content.oilDataS2)
        this.stateFilterCutS1Option = mapOption(response.data.result.content.filterCutS1)
        this.stateFilterCutS2Option = mapOption(response.data.result.content.filterCutS2)
        this.stateMagPlugOption = mapOption(response.data.result.content.magPlug)
        this.stateIronFormsCbmOption = mapOption(response.data.result.content.ironFormsCbm)
        this.stateComponentStatusOption = mapOption(response.data.result.content.componentStatus);
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
      await this.getData();
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
    setComponent(value: string) {
      this.stateFilterData.component = value;
    },
    setComponentTo(value: string) {
      this.stateFilterData.componentTo = value;
    },
    setSensorData(value: string) {
      this.stateFilterData.sensorData = value;
    },
    setSensorDataTo(value: string) {
      this.stateFilterData.sensorDataTo = value;
    },
    setOilDataS1(value: string) {
      this.stateFilterData.oilDataS1 = value;
    },
    setOilDataS1To(value: string) {
      this.stateFilterData.oilDataS1To = value;
    },
    setOilDataS2(value: string) {
      this.stateFilterData.oilDataS2 = value;
    },
    setOilDataS2To(value: string) {
      this.stateFilterData.oilDataS2To = value;
    },
    setFilterCutS1(value: string) {
      this.stateFilterData.filterCutS1 = value;
    },
    setFilterCutS1To(value: string) {
      this.stateFilterData.filterCutS1To = value;
    },
    setFilterCutS2(value: string) {
      this.stateFilterData.filterCutS2 = value;
    },
    setFilterCutS2To(value: string) {
      this.stateFilterData.filterCutS2To = value;
    },
    setMagPlug(value: string) {
      this.stateFilterData.magPlug = value;
    },
    setMagPlugTo(value: string) {
      this.stateFilterData.magPlugTo = value;
    },
    setIronFormsCbm(value: string) {
      this.stateFilterData.ironFormsCbm = value;
    },
    setIronFormsCbmTo(value: string) {
      this.stateFilterData.ironFormsCbmTo = value;
    },
    setComponentStatus(value: string) {
      this.stateFilterData.componentStatus = value;
    },
    setComponentStatusTo(value: string) {
      this.stateFilterData.componentStatusTo = value;
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
      this.stateFilterData.component = "";
      this.stateFilterData.componentTo = "";
      this.stateFilterData.sensorData = "";
      this.stateFilterData.sensorDataTo = "";
      this.stateFilterData.oilDataS1 = "";
      this.stateFilterData.oilDataS1To = "";
      this.stateFilterData.oilDataS2 = "";
      this.stateFilterData.oilDataS2To = "";
      this.stateFilterData.filterCutS1 = "";
      this.stateFilterData.filterCutS1To = "";
      this.stateFilterData.filterCutS2 = "";
      this.stateFilterData.filterCutS2To = "";
      this.stateFilterData.magPlug = "";
      this.stateFilterData.magPlugTo = "";
      this.stateFilterData.ironFormsCbm = "";
      this.stateFilterData.ironFormsCbmTo = "";
      this.stateFilterData.componentStatus = "";
      this.stateFilterData.componentStatusTo = "";
      this.stateFilterData.startDate = "";
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.endDateTo = "";
      const checkComponent = this.stateLastUsedFilterData.component !== "";
      const checkComponentTo = this.stateLastUsedFilterData.component !== "";
      const checkSensorData = this.stateLastUsedFilterData.sensorData !== "";
      const checkSensorDataTo = this.stateLastUsedFilterData.sensorData !== "";
      const checkOilDataS1 = this.stateLastUsedFilterData.oilDataS1 !== "";
      const checkOilDataS1To = this.stateLastUsedFilterData.oilDataS1 !== "";
      const checkOilDataS2 = this.stateLastUsedFilterData.oilDataS2 !== "";
      const checkOilDataS2To = this.stateLastUsedFilterData.oilDataS2 !== "";
      const checkFilterCutS1 = this.stateLastUsedFilterData.filterCutS1 !== "";
      const checkFilterCutS1To = this.stateLastUsedFilterData.filterCutS1 !== "";
      const checkFilterCutS2 = this.stateLastUsedFilterData.filterCutS2 !== "";
      const checkFilterCutS2To = this.stateLastUsedFilterData.filterCutS2 !== "";
      const checkMagPlug = this.stateLastUsedFilterData.magPlug !== "";
      const checkMagPlugTo = this.stateLastUsedFilterData.magPlug !== "";
      const checkIronFormsCbm = this.stateLastUsedFilterData.ironFormsCbm !== "";
      const checkIronFormsCbmTo = this.stateLastUsedFilterData.ironFormsCbm !== "";
      const checkComponentStatus = this.stateLastUsedFilterData.componentStatus !== "";
      const checkComponentStatusTo = this.stateLastUsedFilterData.componentStatusTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== "";
      if (
        checkComponent ||
        checkComponentTo ||
        checkSensorData ||
        checkSensorDataTo ||
        checkOilDataS1 ||
        checkOilDataS1To ||
        checkOilDataS2 ||
        checkOilDataS2To ||
        checkFilterCutS1 ||
        checkFilterCutS1To ||
        checkFilterCutS2 ||
        checkFilterCutS2To ||
        checkMagPlug ||
        checkMagPlugTo ||
        checkIronFormsCbm ||
        checkIronFormsCbmTo ||
        checkComponentStatus ||
        checkComponentStatusTo ||
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
