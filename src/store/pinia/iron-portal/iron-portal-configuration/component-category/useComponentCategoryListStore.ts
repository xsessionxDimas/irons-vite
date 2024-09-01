import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-category/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-category/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-category/LookupItem";
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
  type: "",
  typeTo: "",
  sequential: "",
  sequentialTo: "",
  operator: "",
  operatorTo: "",
  valueMin: "",
  valueMinTo: "",
  valueMax: "",
  valueMaxTo: "",
  uom: "",
  uomTo: "",
  category: "",
  categoryTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useComponentCategoryListStore = defineStore({
  id: "componentCategoryList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "componentCategory",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateTypeOption: [] as Option[],
      stateSequentialOption: [] as Option[],
      stateOperatorOption: [] as Option[],
      stateValueMinOption: [] as Option[],
      stateValueMaxOption: [] as Option[],
      stateUomOption: [] as Option[],
      stateCategoryOption: [] as Option[],
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
    typeOption: (state) => {
      return state.stateTypeOption;
    },
    sequentialOption: (state) => {
      return state.stateSequentialOption;
    },
    operatorOption: (state) => {
      return state.stateOperatorOption;
    },
    valueMinOption: (state) => {
      return state.stateValueMinOption;
    },
    valueMaxOption: (state) => {
      return state.stateValueMaxOption;
    },
    uomOption: (state) => {
      return state.stateUomOption;
    },
    categoryOption: (state) => {
      return state.stateCategoryOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        type: this.stateFilterData.type,
        typeTo: this.stateFilterData.typeTo,
        sequential: this.stateFilterData.sequential,
        sequentialTo: this.stateFilterData.sequentialTo,
        valueMin: this.stateFilterData.valueMin,
        valueMinTo: this.stateFilterData.valueMinTo,
        valueMax: this.stateFilterData.valueMax,
        valueMaxTo: this.stateFilterData.valueMaxTo,
        uom: this.stateFilterData.uom,
        uomTo: this.stateFilterData.uomTo,
        category: this.stateFilterData.category,
        categoryTo: this.stateFilterData.categoryTo,
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
      }
      this.stateLoading = false;
    },
    async getLookup() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.get(LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateTypeOption = mapOption(response.data.result.content.type);
        this.stateSequentialOption = mapOption(response.data.result.content.sequential);
        this.stateOperatorOption = mapOption(response.data.result.content.operator);
        this.stateValueMinOption = mapOption(response.data.result.content.valueMin);
        this.stateValueMaxOption = mapOption(response.data.result.content.valueMax);
        this.stateUomOption = mapOption(response.data.result.content.uom);
        this.stateCategoryOption = mapOptionFromLookupApi(response.data.result.content, "category", "categoryDesc");
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
        type: this.stateFilterData.type,
        typeTo: this.stateFilterData.typeTo,
        sequential: this.stateFilterData.sequential,
        sequentialTo: this.stateFilterData.sequentialTo,
        valueMin: this.stateFilterData.valueMin,
        valueMinTo: this.stateFilterData.valueMinTo,
        valueMax: this.stateFilterData.valueMax,
        valueMaxTo: this.stateFilterData.valueMaxTo,
        uom: this.stateFilterData.uom,
        uomTo: this.stateFilterData.uomTo,
        category: this.stateFilterData.category,
        categoryTo: this.stateFilterData.categoryTo,
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
    setType(value: string) {
      this.stateFilterData.type = value;
    },
    setTypeTo(value: string) {
      this.stateFilterData.typeTo = value;
    },
    setSequential(value: string) {
      this.stateFilterData.sequential = value;
    },
    setSequentialTo(value: string) {
      this.stateFilterData.sequentialTo = value;
    },
    setOperator(value: string) {
      this.stateFilterData.operator = value;
    },
    setOperatorTo(value: string) {
      this.stateFilterData.operatorTo = value;
    },
    setValueMin(value: string) {
      this.stateFilterData.valueMin = value;
    },
    setValueMinTo(value: string) {
      this.stateFilterData.valueMinTo = value;
    },
    setValueMax(value: string) {
      this.stateFilterData.valueMax = value;
    },
    setValueMaxTo(value: string) {
      this.stateFilterData.valueMaxTo = value;
    },
    setUom(value: string) {
      this.stateFilterData.uom = value;
    },
    setUomTo(value: string) {
      this.stateFilterData.uomTo = value;
    },
    setCategory(value: string) {
      this.stateFilterData.category = value;
    },
    setCategoryTo(value: string) {
      this.stateFilterData.categoryTo = value;
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
      this.stateFilterData.type = "";
      this.stateFilterData.typeTo = "";
      this.stateFilterData.sequential = "";
      this.stateFilterData.sequentialTo = "";
      this.stateFilterData.operator = "";
      this.stateFilterData.operatorTo = "";
      this.stateFilterData.valueMin = "";
      this.stateFilterData.valueMinTo = "";
      this.stateFilterData.valueMax = "";
      this.stateFilterData.valueMaxTo = "";
      this.stateFilterData.uom = "";
      this.stateFilterData.uomTo = "";
      this.stateFilterData.category = "";
      this.stateFilterData.categoryTo = "";
      this.stateFilterData.startDate = "";
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.endDateTo = "";
      const checkType = this.stateLastUsedFilterData.type !== "";
      const checkTypeTo = this.stateLastUsedFilterData.typeTo !== "";
      const checkSequential = this.stateLastUsedFilterData.sequential !== "";
      const checkSequentialTo = this.stateLastUsedFilterData.sequentialTo !== "";
      const checkOperator = this.stateLastUsedFilterData.operator !== "";
      const checkOperatorTo = this.stateLastUsedFilterData.operatorTo !== "";
      const checkValueMin = this.stateLastUsedFilterData.valueMin !== "";
      const checkValueMinTo = this.stateLastUsedFilterData.valueMinTo !== "";
      const checkValueMax = this.stateLastUsedFilterData.valueMax !== "";
      const checkValueMaxTo = this.stateLastUsedFilterData.valueMaxTo !== "";
      const checkUom = this.stateLastUsedFilterData.uom !== "";
      const checkUomTo = this.stateLastUsedFilterData.uomTo !== "";
      const checkCategory = this.stateLastUsedFilterData.category !== "";
      const checkCategoryTo = this.stateLastUsedFilterData.categoryTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== "";
      if (
        checkType ||
        checkTypeTo ||
        checkSequential ||
        checkSequentialTo ||
        checkOperator ||
        checkOperatorTo ||
        checkValueMin ||
        checkValueMinTo ||
        checkValueMax ||
        checkValueMaxTo ||
        checkUom ||
        checkUomTo ||
        checkCategory ||
        checkCategoryTo ||
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
