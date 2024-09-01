import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/component-replacement/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/component-replacement/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/component-replacement/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  mapOption,
  mapOptionFromLookupApi,
  mapOptionWithThreeLabelFromLookupApi
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

const initialFilter = {
  site: "",
  siteTo: "",
  model: "",
  modelTo: "",
  equipment: "",
  equipmentTo: "",
  component: "",
  componentTo: "",
  replacementDate: "",
  replacementDateTo: "",
  replacementSmu: "",
  replacementSmuTo: "",
  hmoffset: "",
  hmoffsetTo: "",
  frameHours: "",
  frameHoursTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useComponentReplacementListStore = defineStore({
  id: "componentReplacementList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "ComponentReplacement",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateSiteOption: [] as Option[],
      stateModelOption: [] as Option[],
      stateEquipmentOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateReplacementDateOption: [] as Option[],
      stateReplacementSmuOption: [] as Option[],
      stateFrameHoursOption: [] as Option[],
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
    modelOption: (state) => {
      return state.stateModelOption;
    },
    equipmentOption: (state) => {
      return state.stateEquipmentOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    replacementDateOption: (state) => {
      return state.stateReplacementDateOption;
    },
    replacementSmuOption: (state) => {
      return state.stateReplacementSmuOption;
    },
    frameHoursOption: (state) => {
      return state.stateFrameHoursOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        site: this.stateFilterData.site,
        siteTo: this.stateFilterData.siteTo,
        model: this.stateFilterData.model,
        modelTo: this.stateFilterData.modelTo,
        equipment: this.stateFilterData.equipment,
        equipmentTo: this.stateFilterData.equipmentTo,
        component: this.stateFilterData.component,
        componentTo: this.stateFilterData.componentTo,
        replacementDate: this.stateFilterData.replacementDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.replacementDate))) : "",
        replacementDateTo: this.stateFilterData.replacementDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.replacementDateTo))) : "",
        replacementSmu: this.stateFilterData.replacementSmu,
        replacementSmuTo: this.stateFilterData.replacementSmuTo,
        frameHours: this.stateFilterData.frameHours,
        frameHoursTo: this.stateFilterData.frameHoursTo,
        page: this.stateFilterData.page.toString(),
        pageSize: this.stateFilterData.pageSize.toString(),
        order: this.stateFilterData.order,
        ver: this.stateFilterData.ver
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, "component_replacement_paging", new URLSearchParams(params).toString());
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
        this.stateModelOption = mapOptionFromLookupApi(response.data.result.content.equipmentModel, "equipmentModel", "equipmentModelDescription")
        this.stateEquipmentOption = mapOptionFromLookupApi(response.data.result.content.equipmentNumber, "equipmentNumber", "equipmentNumberDescription")
        this.stateComponentOption = mapOptionFromLookupApi(response.data.result.content.component, "componentDescription", "component")
        this.stateReplacementSmuOption = mapOption(response.data.result.content.replacementSmu)
        this.stateFrameHoursOption = mapOption(response.data.result.content.frameHours)
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
        model: this.stateFilterData.model,
        modelTo: this.stateFilterData.modelTo,
        equipment: this.stateFilterData.equipment,
        equipmentTo: this.stateFilterData.equipmentTo,
        component: this.stateFilterData.component,
        componentTo: this.stateFilterData.componentTo,
        replacementDate: this.stateFilterData.replacementDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.replacementDate))) : "",
        replacementDateTo: this.stateFilterData.replacementDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.replacementDateTo))) : "",
        replacementSmu: this.stateFilterData.replacementSmu,
        replacementSmuTo: this.stateFilterData.replacementSmuTo,
        frameHours: this.stateFilterData.frameHours,
        frameHoursTo: this.stateFilterData.frameHoursTo,
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
    setModel(value: string) {
      this.stateFilterData.model = value;
    },
    setModelTo(value: string) {
      this.stateFilterData.modelTo = value;
    },
    setEquipment(value: string) {
      this.stateFilterData.equipment = value;
    },
    setEquipmentTo(value: string) {
      this.stateFilterData.equipmentTo = value;
    },
    setComponent(value: string) {
      this.stateFilterData.component = value;
    },
    setComponentTo(value: string) {
      this.stateFilterData.componentTo = value;
    },
    setReplacementDate(value: string) {
      this.stateFilterData.replacementDate = value;
    },
    setReplacementDateTo(value: string) {
      this.stateFilterData.replacementDateTo = value;
    },
    setReplacementSmu(value: string) {
      this.stateFilterData.replacementSmu = value;
    },
    setReplacementSmuTo(value: string) {
      this.stateFilterData.replacementSmuTo = value;
    },
    setFrameHours(value: string) {
      this.stateFilterData.frameHours = value;
    },
    setFrameHoursTo(value: string) {
      this.stateFilterData.frameHoursTo = value;
    },
    async resetFilter() {
      this.stateFilterData.site = "";
      this.stateFilterData.siteTo = "";
      this.stateFilterData.model = "";
      this.stateFilterData.modelTo = "";
      this.stateFilterData.equipment = "";
      this.stateFilterData.equipmentTo = "";
      this.stateFilterData.component = "";
      this.stateFilterData.componentTo = "";
      this.stateFilterData.replacementDate = "";
      this.stateFilterData.replacementDateTo = "";
      this.stateFilterData.replacementSmu = "";
      this.stateFilterData.replacementSmuTo = "";
      this.stateFilterData.frameHours = "";
      this.stateFilterData.frameHoursTo = "";
      const checkSite = this.stateLastUsedFilterData.site !== "";
      const checkSiteTo = this.stateLastUsedFilterData.siteTo !== "";
      const model = this.stateLastUsedFilterData.model !== "";
      const modelTo = this.stateLastUsedFilterData.modelTo !== "";
      const checkEquipment = this.stateLastUsedFilterData.equipment !== "";
      const checkEquipmentTo = this.stateLastUsedFilterData.equipmentTo !== "";
      const checkComponent = this.stateLastUsedFilterData.component !== "";
      const checkComponentTo = this.stateLastUsedFilterData.componentTo !== "";
      const checkReplacementDate = this.stateLastUsedFilterData.replacementDate !== "";
      const checkReplacementDateTo = this.stateLastUsedFilterData.replacementDateTo !== "";
      const checkReplacementSmu = this.stateLastUsedFilterData.replacementSmu !== "";
      const checkReplacementSmuTo = this.stateLastUsedFilterData.replacementSmuTo !== "";
      const checkFrameHours = this.stateLastUsedFilterData.frameHours !== "";
      const checkFrameHoursTo = this.stateLastUsedFilterData.frameHoursTo !== "";
      if (
        checkSite ||
        checkSiteTo ||
        model ||
        modelTo ||
        checkEquipment ||
        checkEquipmentTo ||
        checkComponent ||
        checkComponentTo ||
        checkReplacementDate ||
        checkReplacementDateTo ||
        checkReplacementSmu ||
        checkReplacementSmuTo ||
        checkFrameHours ||
        checkFrameHoursTo
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
