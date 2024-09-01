import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  GET_API_URL,
  LOOKUP_API_URL,
  EXPORT_ALL_API_URL,
  EXPORT_ROW_API_URL,
} from "./urls";
import { defineStore } from "pinia";
import {
  AxiosRequestConfig,
  AxiosResponse
} from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-historical/component-health-data/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-historical/component-health-data/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/iron-portal-historical/component-health-data/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  mapOption,
} from "@/core/helpers/mapOption";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  sendErrorEvent
} from "@/core/helpers/analytics";

const getInitialStartDate = (date) => {
  date.setMonth(date.getMonth() - 1);
  date.setDate(1);
  return date;
};

const initialFilter = {
  site: "Blackwater",
  group: "Rear Dump Truck",
  model: "930E-4 HPI",
  equipment: [
    "DT0700"
  ] as string[],
  component: [
    "Engine"
  ] as string[],
  startDate: normalizeDate(getInitialStartDate(new Date())),
  endDate: normalizeDate(new Date()),
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};
const initialFilterLoading = {
  site: false,
  group: false,
  model: false,
  equipment: false,
  component: false,
}

export const useComponentHealthDataListStore = defineStore({
  id: "componentHealthDataList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      stateFilterLoading: {
        ...initialFilterLoading
      },
      statePageName: "componentHealthData",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateSiteOption: [] as Option[],
      stateGroupOption: [] as Option[],
      stateModelOption: [] as Option[],
      stateEquipmentOption: [] as Option[],
      stateComponentOption: [] as Option[],
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
    groupOption: (state) => {
      return state.stateGroupOption;
    },
    modelOption: (state) => {
      return state.stateModelOption;
    },
    equipmentOption: (state) => {
      return state.stateEquipmentOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    filterLoading: (state) => {
      return state.stateFilterLoading;
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        ver: "v1"
      };
      const body = {
        site: this.stateFilterData.site,
        group: this.stateFilterData.group,
        model: this.stateFilterData.model,
        equipment: this.stateFilterData.equipment,
        component: this.stateFilterData.component,
        startDate: this.stateFilterData.startDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDate))) : "",
        endDate: this.stateFilterData.endDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDate))) : "",
        page: this.stateFilterData.page,
        pageSize: this.stateFilterData.pageSize,
        order: this.stateFilterData.order,
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.post(`${GET_API_URL}/data?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
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
    async getLookupSite() {
      this.stateFilterLoading.site = true;
      const params = {
        ver: "v1"
      };
      const body = {
        site: null,
        group: null,
        model: null,
        equipment: [],
        component: [],
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.post(`${LOOKUP_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
        this.stateSiteOption = mapOption(response.data.result.content.site);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      this.stateFilterLoading.site = false;
    },
    setDefaultFilter(site) {
      this.stateFilterData.site = site;
    },
    async getLookupGroup() {
      this.stateFilterLoading.group = true;
      const params = {
        ver: "v1"
      };
      const body = {
        site: this.stateFilterData.site,
        group: null,
        model: null,
        equipment: [],
        component: [],
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.post(`${LOOKUP_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
        this.stateGroupOption = mapOption(response.data.result.content.group);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      this.stateFilterLoading.group = false;
    },
    async getLookupModel() {
      this.stateFilterLoading.model = true;
      const params = {
        ver: "v1"
      };
      const body = {
        site: this.stateFilterData.site,
        group: this.stateFilterData.group,
        model: null,
        equipment: [],
        component: [],
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.post(`${LOOKUP_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
        this.stateModelOption = mapOption(response.data.result.content.model);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      this.stateFilterLoading.model = false;
    },
    async getLookupEquipment() {
      this.stateFilterLoading.equipment = true;
      const params = {
        ver: "v1"
      };
      const body = {
        site: this.stateFilterData.site,
        group: this.stateFilterData.group,
        model: this.stateFilterData.model,
        equipment: [],
        component: [],
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.post(`${LOOKUP_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
        this.stateEquipmentOption = mapOption(response.data.result.content.equipment);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      this.stateFilterLoading.equipment = false;
    },
    async getLookupComponent() {
      this.stateFilterLoading.component = true;
      const params = {
        ver: "v1"
      };
      const body = {
        site: this.stateFilterData.site,
        group: this.stateFilterData.group,
        model: this.stateFilterData.model,
        equipment: this.stateFilterData.equipment,
        component: [],
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.post(`${LOOKUP_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
        this.stateComponentOption = mapOption(response.data.result.content.component);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
      this.stateFilterLoading.component = false;
    },
    async exportAll() {
      const params = {
        ver: "v1"
      };
      const body = {
        site: this.stateFilterData.site,
        group: this.stateFilterData.group,
        model: this.stateFilterData.model,
        equipment: this.stateFilterData.equipment,
        component: this.stateFilterData.component,
        startDate: this.stateFilterData.startDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDate))) : "",
        endDate: this.stateFilterData.endDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDate))) : "",
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.postBlob(`${EXPORT_ALL_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
        return response.data;
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async exportRow({
      site,
      group,
      model,
      equipment,
      component,
      sourceType,
    }) {
      const params = {
        ver: "v1"
      };
      const body = {
        site: site,
        group: group,
        model: model,
        equipment: equipment,
        component: component,
        sourceType: sourceType,
        startDate: this.stateFilterData.startDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDate))) : "",
        endDate: this.stateFilterData.endDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDate))) : "",
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.getBlob(EXPORT_ROW_API_URL, "", new URLSearchParams(body).toString());
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
    setSite(value: string) {
      this.stateFilterData.site = value;
    },
    setGroup(value: string) {
      this.stateFilterData.group = value;
    },
    setModel(value: string) {
      this.stateFilterData.model = value;
    },
    setEquipment(value: string[]) {
      if (value.length != 0) {
        this.stateFilterData.equipment = [
          ...value
        ];
      } else {
        this.stateFilterData.equipment = [];
      }
    },
    setComponent(value: string[]) {
      if (value.length != 0) {
        this.stateFilterData.component = [
          ...value
        ];
      } else {
        this.stateFilterData.component = [];
      }
    },
    setStartDate(value: string) {
      this.stateFilterData.startDate = value;
    },
    setEndDate(value: string) {
      this.stateFilterData.endDate = value;
    },
    async resetFilter() {
      this.stateFilterData.site = "";
      this.stateFilterData.group = "";
      this.stateFilterData.model = "";
      this.stateFilterData.equipment = [];
      this.stateFilterData.component = [];
      this.stateFilterData.startDate = "";
      this.stateFilterData.endDate = "";
      const checkSite = this.stateLastUsedFilterData.site !== "";
      const checkGroup = this.stateLastUsedFilterData.group !== "";
      const checkModel = this.stateLastUsedFilterData.model !== "";
      const checkEquipment = this.stateLastUsedFilterData.equipment.length !== 0;
      const checkComponent = this.stateLastUsedFilterData.component.length !== 0;
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      if (
        checkSite ||
        checkGroup ||
        checkModel ||
        checkEquipment ||
        checkComponent ||
        checkStartDate ||
        checkEndDate
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
