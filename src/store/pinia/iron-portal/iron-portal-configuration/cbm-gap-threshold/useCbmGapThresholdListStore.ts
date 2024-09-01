import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-gap-threshold/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-gap-threshold/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-gap-threshold/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  mapOption,
  mapOptionWithThreeLabelFromLookupApi,
  mapOptionFromLookupApi
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
  cbmType: "",
  cbmTypeTo: "",
  equipmentModel: "",
  equipmentModelTo: "",
  component: "",
  componentTo: "",
  valueThreshold: "",
  valueThresholdTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useCbmGapThresholdListStore = defineStore({
  id: "CbmGapThresholdList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "cbmGapThreshold",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateCbmTypeOption: [] as Option[],
      stateModelUnitOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateValueThresholdOption: [] as Option[],
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
    cbmTypeOption: (state) => {
      return state.stateCbmTypeOption;
    },
    modelUnitOption: (state) => {
      return state.stateModelUnitOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    valueThresholdOption: (state) => {
      return state.stateValueThresholdOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        cbmType: this.stateFilterData.cbmType,
        cbmTypeTo: this.stateFilterData.cbmTypeTo,
        equipmentModel: this.stateFilterData.equipmentModel,
        equipmentModelTo: this.stateFilterData.equipmentModelTo,
        component: this.stateFilterData.component,
        componentTo: this.stateFilterData.componentTo,
        valueThreshold: this.stateFilterData.valueThreshold,
        valueThresholdTo: this.stateFilterData.valueThresholdTo,
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
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, "cbm_compliance_gap_threshold", new URLSearchParams(params).toString());
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
        this.stateModelUnitOption = mapOptionWithThreeLabelFromLookupApi(response.data.result.content.equipmentModel, "equipmentModel", "brand", "equipmentModelDescription");
        this.stateCbmTypeOption = mapOption(response.data.result.content.cbmType);
        this.stateComponentOption = mapOptionFromLookupApi(response.data.result.content.component, "component", "componentDescription");
        this.stateValueThresholdOption = mapOption(response.data.result.content.valueThreshold);
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
    setCbmType(value: string) {
      this.stateFilterData.cbmType = value;
    },
    setCbmTypeTo(value: string) {
      this.stateFilterData.cbmTypeTo = value;
    },
    setModelUnit(value: string) {
      this.stateFilterData.equipmentModel = value;
    },
    setModelUnitTo(value: string) {
      this.stateFilterData.equipmentModelTo = value;
    },
    setComponent(value: string) {
      this.stateFilterData.component = value;
    },
    setComponentTo(value: string) {
      this.stateFilterData.componentTo = value;
    },
    setValueThreshold(value: string) {
      this.stateFilterData.valueThreshold = value;
    },
    setValueThresholdTo(value: string) {
      this.stateFilterData.valueThresholdTo = value;
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
      this.stateFilterData.cbmType = "";
      this.stateFilterData.cbmTypeTo = "";
      this.stateFilterData.equipmentModel = "";
      this.stateFilterData.equipmentModelTo = "";
      this.stateFilterData.component = "";
      this.stateFilterData.componentTo = "";
      this.stateFilterData.valueThreshold = "";
      this.stateFilterData.valueThresholdTo = "";
      this.stateFilterData.startDate = "";
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.endDateTo = "";
      const checkCbmType = this.stateLastUsedFilterData.cbmType !== "";
      const checkCbmTypeTo = this.stateLastUsedFilterData.cbmTypeTo !== "";
      const checkModelUnit = this.stateLastUsedFilterData.equipmentModel !== "";
      const checkModelUnitTo = this.stateLastUsedFilterData.equipmentModelTo !== "";
      const checkComponent = this.stateLastUsedFilterData.component !== "";
      const checkComponentTo = this.stateLastUsedFilterData.componentTo !== "";
      const checkValueThreshold = this.stateLastUsedFilterData.valueThreshold !== "";
      const checkValueThresholdTo = this.stateLastUsedFilterData.valueThresholdTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== "";
      if (checkCbmType || checkCbmTypeTo || checkModelUnit ||
        checkModelUnitTo || checkComponent || checkComponentTo || checkValueThreshold ||
        checkValueThresholdTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
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
