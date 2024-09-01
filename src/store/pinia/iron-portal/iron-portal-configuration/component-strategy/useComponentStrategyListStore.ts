import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-strategy/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-strategy/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-strategy/LookupItem";
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
  componentCode: "",
  componentCodeTo: "",
  equipmentModel: "",
  equipmentModelTo: "",
  modifierCode: "",
  modifierCodeTo: "",
  taskType: "",
  taskTypeTo: "",
  strategyTaskDesc: "",
  strategyTaskDescTo: "",
  oemInterval: "",
  oemIntervalTo: "",
  percentageOfOem: "",
  percentageOfOemTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useComponentStrategyListStore = defineStore({
  id: "componentStrategyList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "componentStrategy",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateComponentCodeOption: [] as Option[],
      stateEquipmentModelOption: [] as Option[],
      stateModifierCodeOption: [] as Option[],
      stateTaskTypeOption: [] as Option[],
      stateStrategyTaskDescriptionOption: [] as Option[],
      stateOemIntervalOption: [] as Option[],
      statePercentOfOemOption: [] as Option[],
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
    componentCodeOption: (state) => {
      return state.stateComponentCodeOption;
    },
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
    modifierCodeOption: (state) => {
      return state.stateModifierCodeOption;
    },
    taskTypeOption: (state) => {
      return state.stateTaskTypeOption;
    },
    strategyTaskDescriptionOption: (state) => {
      return state.stateStrategyTaskDescriptionOption;
    },
    oemIntervalOption: (state) => {
      return state.stateOemIntervalOption;
    },
    percentOfOemOption: (state) => {
      return state.statePercentOfOemOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        componentCode: this.stateFilterData.componentCode,
        componentCodeTo: this.stateFilterData.componentCodeTo,
        equipmentModel: this.stateFilterData.equipmentModel,
        equipmentModelTo: this.stateFilterData.equipmentModelTo,
        modifierCode: this.stateFilterData.modifierCode,
        modifierCodeTo: this.stateFilterData.modifierCodeTo,
        taskType: this.stateFilterData.taskType,
        taskTypeTo: this.stateFilterData.taskTypeTo,
        strategyTaskDesc: this.stateFilterData.strategyTaskDesc,
        strategyTaskDescTo: this.stateFilterData.strategyTaskDescTo,
        oemInterval: this.stateFilterData.oemInterval,
        oemIntervalTo: this.stateFilterData.oemIntervalTo,
        percentageOfOem: this.stateFilterData.percentageOfOem,
        percentageOfOemTo: this.stateFilterData.percentageOfOemTo,
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
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, "component_strategy", new URLSearchParams(params).toString());
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
        this.stateComponentCodeOption = mapOption(response.data.result.content.componentCode);
        this.stateEquipmentModelOption = mapOption(response.data.result.content.equipmentModel);
        this.stateModifierCodeOption = mapOption(response.data.result.content.modifierCode);
        this.stateTaskTypeOption = mapOption(response.data.result.content.taskType);
        this.stateStrategyTaskDescriptionOption = mapOption(response.data.result.content.strategyTaskDesc);
        this.stateOemIntervalOption = mapOption(response.data.result.content.oemInterval);
        this.statePercentOfOemOption = mapOption(response.data.result.content.percentageOfOem);
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
    setComponentCode(value: string) {
      this.stateFilterData.componentCode = value;
    },
    setComponentCodeTo(value: string) {
      this.stateFilterData.componentCodeTo = value;
    },
    setEquipmentModel(value: string) {
      this.stateFilterData.equipmentModel = value;
    },
    setEquipmentModelTo(value: string) {
      this.stateFilterData.equipmentModelTo = value;
    },
    setModifierCode(value: string) {
      this.stateFilterData.modifierCode = value;
    },
    setModifierCodeTo(value: string) {
      this.stateFilterData.modifierCodeTo = value;
    },
    setTaskType(value: string) {
      this.stateFilterData.taskType = value;
    },
    setTaskTypeTo(value: string) {
      this.stateFilterData.taskTypeTo = value;
    },
    setStrategyTaskDescription(value: string) {
      this.stateFilterData.strategyTaskDesc = value;
    },
    setStrategyTaskDescriptionTo(value: string) {
      this.stateFilterData.strategyTaskDescTo = value;
    },
    setOemInterval(value: string) {
      this.stateFilterData.oemInterval = value;
    },
    setOemIntervalTo(value: string) {
      this.stateFilterData.oemIntervalTo = value;
    },
    setPercentOfOem(value: string) {
      this.stateFilterData.percentageOfOem = value;
    },
    setPercentOfOemTo(value: string) {
      this.stateFilterData.percentageOfOemTo = value;
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
      this.stateFilterData.componentCode = "";
      this.stateFilterData.componentCodeTo = "";
      this.stateFilterData.equipmentModel = "";
      this.stateFilterData.equipmentModelTo = "";
      this.stateFilterData.modifierCode = "";
      this.stateFilterData.modifierCodeTo = "";
      this.stateFilterData.taskType = "";
      this.stateFilterData.taskTypeTo = "";
      this.stateFilterData.strategyTaskDesc = "";
      this.stateFilterData.strategyTaskDescTo = "";
      this.stateFilterData.oemInterval = "";
      this.stateFilterData.oemIntervalTo = "";
      this.stateFilterData.percentageOfOem = "";
      this.stateFilterData.percentageOfOemTo = "";
      this.stateFilterData.startDate = "";
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.endDateTo = "";
      const checkComponentCode = this.stateLastUsedFilterData.componentCode !== "";
      const checkComponentCodeTo = this.stateLastUsedFilterData.componentCodeTo !== "";
      const checkEquipmentModel = this.stateLastUsedFilterData.equipmentModel !== "";
      const checkEquipmentModelTo = this.stateLastUsedFilterData.equipmentModelTo !== "";
      const checkModifierCode = this.stateLastUsedFilterData.modifierCode !== "";
      const checkModifierCodeTo = this.stateLastUsedFilterData.modifierCodeTo !== "";
      const checkTaskType = this.stateLastUsedFilterData.taskType !== "";
      const checkTaskTypeTo = this.stateLastUsedFilterData.taskTypeTo !== "";
      const checkStrategyTaskDescription = this.stateLastUsedFilterData.strategyTaskDesc !== "";
      const checkStrategyTaskDescriptionTo = this.stateLastUsedFilterData.strategyTaskDescTo !== "";
      const checkOemInterval = this.stateLastUsedFilterData.oemInterval !== "";
      const checkOemIntervalTo = this.stateLastUsedFilterData.oemIntervalTo !== "";
      const checkPercentageOfOem = this.stateLastUsedFilterData.percentageOfOem !== "";
      const checkPercentageOfOemTo = this.stateLastUsedFilterData.percentageOfOemTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== "";
      if (
        checkComponentCode ||
        checkComponentCodeTo ||
        checkEquipmentModel ||
        checkEquipmentModelTo ||
        checkModifierCode ||
        checkModifierCodeTo ||
        checkTaskType ||
        checkTaskTypeTo ||
        checkStrategyTaskDescription ||
        checkStrategyTaskDescriptionTo ||
        checkOemInterval ||
        checkOemIntervalTo ||
        checkPercentageOfOem ||
        checkPercentageOfOemTo ||
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
