import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-transactional/counter-reading/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-transactional/counter-reading/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/iron-portal-transactional/counter-reading/LookupItem";
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
import {
  sendErrorEvent
} from "@/core/helpers/analytics";

const initialFilter = {
  site: "",
  siteTo: "",
  equipmentModel: "",
  equipmentModelTo: "",
  equipmentNumber: "",
  equipmentNumberTo: "",
  component: "",
  componentTo: "",
  smu: "",
  smuTo: "",
  counterReading: "",
  counterReadingTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useCounterReadingListStore = defineStore({
  id: "counterReadingList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "counterReading",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateSiteOption: [] as Option[],
      stateEquipmentModelOption: [] as Option[],
      stateEquipmentNumberOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateSmuOption: [] as Option[],
      stateCounterReadingOption: [] as Option[],
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
    equipmentNumberOption: (state) => {
      return state.stateEquipmentNumberOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    smuOption: (state) => {
      return state.stateSmuOption;
    },
    counterReadingOption: (state) => {
      return state.stateCounterReadingOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        site: this.stateFilterData.site,
        siteTo: this.stateFilterData.siteTo,
        equipmentModel: this.stateFilterData.equipmentModel,
        equipmentModelTo: this.stateFilterData.equipmentModelTo,
        equipmentNumber: this.stateFilterData.equipmentNumber,
        equipmentNumberTo: this.stateFilterData.equipmentNumberTo,
        component: this.stateFilterData.component,
        componentTo: this.stateFilterData.componentTo,
        smu: this.stateFilterData.smu,
        smuTo: this.stateFilterData.smuTo,
        counterReading: this.stateFilterData.counterReading,
        counterReadingTo: this.stateFilterData.counterReadingTo,
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
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, "counter_reading", new URLSearchParams(params).toString());
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
        this.stateSiteOption = mapOptionWithThreeLabelFromLookupApi(response.data.result.content.site, "siteId", "siteCode", "siteDescription")
        this.stateEquipmentModelOption = mapOptionFromLookupApi(response.data.result.content.equipmentModel, "equipmentModel", "equipmentModelDescription")
        this.stateEquipmentNumberOption = mapOptionFromLookupApi(response.data.result.content.equipmentNumber, "equipmentNumber", "equipmentNumberDescription")
        this.stateComponentOption = mapOptionFromLookupApi(response.data.result.content.component, "component", "componentDescription")
        this.stateSmuOption = mapOption(response.data.result.content.smu);
        this.stateCounterReadingOption = mapOption(response.data.result.content.counterReading);
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
        equipmentNumber: this.stateFilterData.equipmentNumber,
        equipmentNumberTo: this.stateFilterData.equipmentNumberTo,
        component: this.stateFilterData.component,
        componentTo: this.stateFilterData.componentTo,
        smu: this.stateFilterData.smu,
        smuTo: this.stateFilterData.smuTo,
        counterReading: this.stateFilterData.counterReading,
        counterReadingTo: this.stateFilterData.counterReadingTo,
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
    setEquipmentNumber(value: string) {
      this.stateFilterData.equipmentNumber = value;
    },
    setEquipmentNumberTo(value: string) {
      this.stateFilterData.equipmentNumberTo = value;
    },
    setComponent(value: string) {
      this.stateFilterData.component = value;
    },
    setComponentTo(value: string) {
      this.stateFilterData.componentTo = value;
    },
    setSmu(value: string) {
      this.stateFilterData.smu = value;
    },
    setSmuTo(value: string) {
      this.stateFilterData.smuTo = value;
    },
    setCounterReading(value: string) {
      this.stateFilterData.counterReading = value;
    },
    setCounterReadingTo(value: string) {
      this.stateFilterData.counterReadingTo = value;
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
      this.stateFilterData.equipmentNumber = "";
      this.stateFilterData.equipmentNumberTo = "";
      this.stateFilterData.component = "";
      this.stateFilterData.componentTo = "";
      this.stateFilterData.smu = "";
      this.stateFilterData.smuTo = "";
      this.stateFilterData.counterReading = "";
      this.stateFilterData.counterReadingTo = "";
      this.stateFilterData.startDate = "";
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.endDateTo = "";
      const checkSite = this.stateLastUsedFilterData.site !== "";
      const checkSiteTo = this.stateLastUsedFilterData.siteTo !== "";
      const checkEquipmentModel = this.stateLastUsedFilterData.equipmentModel !== "";
      const checkEquipmentModelTo = this.stateLastUsedFilterData.equipmentModelTo !== "";
      const checkEquipmentNumber = this.stateLastUsedFilterData.equipmentNumber !== "";
      const checkEquipmentNumberTo = this.stateLastUsedFilterData.equipmentNumberTo !== "";
      const checkComponent = this.stateLastUsedFilterData.component !== "";
      const checkComponentTo = this.stateLastUsedFilterData.componentTo !== "";
      const checkSmu = this.stateLastUsedFilterData.smu !== "";
      const checkSmuTo = this.stateLastUsedFilterData.smuTo !== "";
      const checkCounterReading = this.stateLastUsedFilterData.counterReading !== "";
      const checkCounterReadingTo = this.stateLastUsedFilterData.counterReadingTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== "";
      if (
        checkSite ||
        checkSiteTo ||
        checkEquipmentModel ||
        checkEquipmentModelTo ||
        checkEquipmentNumber ||
        checkEquipmentNumberTo ||
        checkComponent ||
        checkComponentTo ||
        checkSmu ||
        checkSmuTo ||
        checkCounterReading ||
        checkCounterReadingTo ||
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
