import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/mapping-sos-bi/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/mapping-sos-bi/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/mapping-sos-bi/LookupItem";
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
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialFilter = {
  equipmentModel: "",
  equipmentModelTo: "",
  component: "",
  componentTo: "",
  registerNumber: "",
  registerNumberTo: "",
  registerNumberDesc: "",
  registerNumberDescTo: "",
  element: "",
  elementTo: "",
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

export const useMappingSosBiListStore = defineStore({
  id: "MappingSosBiList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "sosMappingForBi",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateEquipmentModelOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateRegisterNumberOption: [] as Option[],
      stateRegisterNumberDescOption: [] as Option[],
      stateElementOption: [] as Option[],
      stateRatingDescOption: [] as Option[],
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
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    registerNumberOption: (state) => {
      return state.stateRegisterNumberOption;
    },
    registerNumberDescOption: (state) => {
      return state.stateRatingDescOption;
    },
    elementOption: (state) => {
      return state.stateElementOption;
    },
    ratingDescOption: (state) => {
      return state.stateRatingDescOption;
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
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        equipmentModel: this.stateFilterData.equipmentModel,
        equipmentModelTo: this.stateFilterData.equipmentModelTo,
        component: this.stateFilterData.component,
        componentTo: this.stateFilterData.componentTo,
        element: this.stateFilterData.element,
        elementTo: this.stateFilterData.elementTo,
        rating: this.stateFilterData.rating,
        ratingTo: this.stateFilterData.ratingTo,
        operatorMin: this.stateFilterData.operatorMin,
        operatorMinTo: this.stateFilterData.operatorMinTo,
        valueMin: this.stateFilterData.valueMin,
        valueMinTo: this.stateFilterData.valueMinTo,
        operatorMax: this.stateFilterData.operatorMax,
        operatorMaxTo: this.stateFilterData.operatorMaxTo,
        valueMax: this.stateFilterData.valueMax,
        valueMaxTo: this.stateFilterData.valueMaxTo,
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
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, "sos_mapping_for_bi", new URLSearchParams(params).toString());
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
        this.stateEquipmentModelOption = mapOptionWithThreeLabelFromLookupApi(response.data.result.content.equipmentModel, "equipmentModel", "brand", "equipmentModelDescription");
        this.stateComponentOption = mapOptionFromLookupApi(response.data.result.content.component, "component", "componentDescription");
        this.stateElementOption = mapOption(response.data.result.content.element);
        this.stateRatingDescOption = mapOptionFromLookupApi(response.data.result.content.rating, "rating", "ratingDescription");
        this.stateOperatorMinOption = mapOptionFromLookupApi(response.data.result.content.operatorMin, "operator", "operatorDescription");
        this.stateOperatorMaxOption = mapOptionFromLookupApi(response.data.result.content.operatorMax, "operator", "operatorDescription");
        this.stateValueMinOption = mapOption(response.data.result.content.valueMin);
        this.stateValueMaxOption = mapOption(response.data.result.content.valueMax);
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
    setElement(value: string) {
      this.stateFilterData.element = value;
    },
    setElementTo(value: string) {
      this.stateFilterData.elementTo = value;
    },
    setRatingDesc(value: string) {
      this.stateFilterData.rating = value;
    },
    setRatingDescTo(value: string) {
      this.stateFilterData.ratingTo = value;
    },
    setOperatorMin(value: string) {
      this.stateFilterData.operatorMin = value;
    },
    setOperatorMinTo(value: string) {
      this.stateFilterData.operatorMinTo = value;
    },
    setValueMin(value: string) {
      this.stateFilterData.valueMin = value;
    },
    setValueMinTo(value: string) {
      this.stateFilterData.valueMin = value;
    },
    setOperatorMax(value: string) {
      this.stateFilterData.operatorMax = value;
    },
    setOperatorMaxTo(value: string) {
      this.stateFilterData.operatorMaxTo = value;
    },
    setValueMax(value: string) {
      this.stateFilterData.valueMax = value;
    },
    setValueMaxTo(value: string) {
      this.stateFilterData.valueMaxTo = value;
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
      this.stateFilterData.equipmentModel = "";
      this.stateFilterData.equipmentModelTo = "";
      this.stateFilterData.component = "";
      this.stateFilterData.componentTo = "";
      this.stateFilterData.element = "";
      this.stateFilterData.elementTo = "";
      this.stateFilterData.rating = "";
      this.stateFilterData.ratingTo = "";
      this.stateFilterData.operatorMin = "";
      this.stateFilterData.operatorMinTo = "";
      this.stateFilterData.valueMin = "";
      this.stateFilterData.valueMinTo = "";
      this.stateFilterData.operatorMax = "";
      this.stateFilterData.operatorMaxTo = "";
      this.stateFilterData.valueMax = "";
      this.stateFilterData.valueMaxTo = "";
      this.stateFilterData.startDate = "";
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.endDateTo = "";
      const checkEquipmentModel = this.stateLastUsedFilterData.equipmentModel !== ""
      const checkEquipmentModelTo = this.stateLastUsedFilterData.equipmentModelTo !== ""
      const checkComponent = this.stateLastUsedFilterData.component !== ""
      const checkComponentTo = this.stateLastUsedFilterData.componentTo !== ""
      const checkElement = this.stateLastUsedFilterData.element !== ""
      const checkElementTo = this.stateLastUsedFilterData.elementTo !== ""
      const checkRatingDesc = this.stateLastUsedFilterData.rating !== ""
      const checkRatingDescTo = this.stateLastUsedFilterData.ratingTo !== ""
      const checkOperatorMin = this.stateLastUsedFilterData.operatorMin !== ""
      const checkOperatorMinTo = this.stateLastUsedFilterData.operatorMinTo !== ""
      const checkValueMin = this.stateLastUsedFilterData.valueMin !== ""
      const checkValueMinTo = this.stateLastUsedFilterData.valueMinTo !== ""
      const checkOperatorMax = this.stateLastUsedFilterData.operatorMax !== ""
      const checkOperatorMaxTo = this.stateLastUsedFilterData.operatorMaxTo !== ""
      const checkValueMax = this.stateLastUsedFilterData.valueMax !== ""
      const checkValueMaxTo = this.stateLastUsedFilterData.valueMaxTo !== ""
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== "";
      if (checkEquipmentModel || checkEquipmentModelTo || checkComponent || checkComponentTo || checkElement || checkElementTo || checkRatingDesc ||
        checkRatingDescTo || checkOperatorMin || checkOperatorMinTo || checkValueMin || checkValueMinTo ||
        checkOperatorMax || checkOperatorMaxTo || checkValueMax ||
        checkValueMaxTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
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
