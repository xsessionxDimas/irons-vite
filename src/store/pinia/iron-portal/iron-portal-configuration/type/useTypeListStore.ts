import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/type/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/type/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/type/LookupItem";
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
  typeDescription: "",
  typeDescriptionTo: "",
  parameter: "",
  parameterTo: "",
  parameterDescription: "",
  parameterDescriptionTo: "",
  parameterGroup: "",
  parameterGroupTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useTypeListStore = defineStore({
  id: "typeList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "type",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateTypeOption: [] as Option[],
      stateTypeDescriptionOption: [] as Option[],
      stateParameterOption: [] as Option[],
      stateParameterDescriptionOption: [] as Option[],
      stateParameterGroupOption: [] as Option[],
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
    typeDescriptionOption: (state) => {
      return state.stateTypeDescriptionOption;
    },
    parameterOption: (state) => {
      return state.stateParameterOption;
    },
    parameterDescriptionOption: (state) => {
      return state.stateParameterDescriptionOption;
    },
    parameterGroupOption: (state) => {
      return state.stateParameterGroupOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        type: this.stateFilterData.type,
        typeTo: this.stateFilterData.typeTo,
        typeDescription: this.stateFilterData.typeDescription,
        typeDescriptionTo: this.stateFilterData.typeDescriptionTo,
        parameter: this.stateFilterData.parameter,
        parameterTo: this.stateFilterData.parameterTo,
        parameterDescription: this.stateFilterData.parameterDescription,
        parameterDescriptionTo: this.stateFilterData.parameterDescriptionTo,
        parameterGroup: this.stateFilterData.parameterGroup,
        parameterGroupTo: this.stateFilterData.parameterGroupTo,
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
        this.stateTypeDescriptionOption = mapOption(response.data.result.content.typeDescription);
        this.stateParameterOption = mapOption(response.data.result.content.parameter);
        this.stateParameterDescriptionOption = mapOption(response.data.result.content.parameterDescription);
        this.stateParameterGroupOption = mapOption(response.data.result.content.parameterGroup);
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
        typeDescription: this.stateFilterData.typeDescription,
        typeDescriptionTo: this.stateFilterData.typeDescriptionTo,
        parameter: this.stateFilterData.parameter,
        parameterTo: this.stateFilterData.parameterTo,
        parameterDescription: this.stateFilterData.parameterDescription,
        parameterDescriptionTo: this.stateFilterData.parameterDescriptionTo,
        parameterGroup: this.stateFilterData.parameterGroup,
        parameterGroupTo: this.stateFilterData.parameterGroupTo,
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
    setTypeDescription(value: string) {
      this.stateFilterData.typeDescription = value;
    },
    setTypeDescriptionTo(value: string) {
      this.stateFilterData.typeDescriptionTo = value;
    },
    setParameter(value: string) {
      this.stateFilterData.parameter = value;
    },
    setParameterTo(value: string) {
      this.stateFilterData.parameterTo = value;
    },
    setParameterDescription(value: string) {
      this.stateFilterData.parameterDescription = value;
    },
    setParameterDescriptionTo(value: string) {
      this.stateFilterData.parameterDescriptionTo = value;
    },
    setParameterGroup(value: string) {
      this.stateFilterData.parameterGroup = value;
    },
    setParameterGroupTo(value: string) {
      this.stateFilterData.parameterGroupTo = value;
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
      this.stateFilterData.typeDescription = "";
      this.stateFilterData.typeDescriptionTo = "";
      this.stateFilterData.parameter = "";
      this.stateFilterData.parameterTo = "";
      this.stateFilterData.parameterDescription = "";
      this.stateFilterData.parameterDescriptionTo = "";
      this.stateFilterData.parameterGroup = "";
      this.stateFilterData.parameterGroupTo = "";
      this.stateFilterData.startDate = "";
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.endDateTo = "";
      const checkType = this.stateLastUsedFilterData.type !== "";
      const checkTypeTo = this.stateLastUsedFilterData.typeTo !== "";
      const checkTypeDescription = this.stateLastUsedFilterData.typeDescription !== "";
      const checkTypeDescriptionTo = this.stateLastUsedFilterData.typeDescriptionTo !== "";
      const checkParameter = this.stateLastUsedFilterData.parameter !== "";
      const checkParameterTo = this.stateLastUsedFilterData.parameterTo !== "";
      const checkParameterDescription = this.stateLastUsedFilterData.parameterDescription !== "";
      const checkParameterDescriptionTo = this.stateLastUsedFilterData.parameterDescriptionTo !== "";
      const checkParameterGroup = this.stateLastUsedFilterData.parameterGroup !== "";
      const checkParameterGroupTo = this.stateLastUsedFilterData.parameterGroupTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== "";
      if (
        checkType ||
        checkTypeTo ||
        checkTypeDescription ||
        checkTypeDescriptionTo ||
        checkParameter ||
        checkParameterTo ||
        checkParameterDescription ||
        checkParameterDescriptionTo ||
        checkParameterGroup ||
        checkParameterGroupTo ||
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
