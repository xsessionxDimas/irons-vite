import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status-mapping/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status-mapping/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status-mapping/LookupItem";
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
  site: "",
  siteTo: "",
  equipmentModel: "",
  equipmentModelTo: "",
  cbmGroup: "",
  cbmGroupTo: "",
  componentStatusId: "",
  componentStatusIdTo: "",
  objectType: "",
  objectTypeTo: "",
  group: "",
  groupTo: "",
  rating: "",
  ratingTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useComponentStatusMappingListStore = defineStore({
  id: "componentStatusMappingList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "componentStatusMapping",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateSiteOption: [] as Option[],
      stateEquipmentModelOption: [] as Option[],
      stateComponentStatusIdOption: [] as Option[],
      stateCbmGroupOption: [] as Option[],
      stateRatingOption: [] as Option[],
      stateObjectTypeOption: [] as Option[],
      stateGroupOption: [] as Option[],
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
    componentStatusIdOption: (state) => {
      return state.stateComponentStatusIdOption;
    },
    cbmGroupOption: (state) => {
      return state.stateCbmGroupOption;
    },
    objectTypeOption: (state) => {
      return state.stateObjectTypeOption;
    },
    groupOption: (state) => {
      return state.stateGroupOption;
    },
    ratingOption: (state) => {
      return state.stateRatingOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        site: this.stateFilterData.site,
        siteTo: this.stateFilterData.siteTo,
        equipmentModel: this.stateFilterData.equipmentModel,
        equipmentModelTo: this.stateFilterData.equipmentModelTo,
        cbmGroup: this.stateFilterData.cbmGroup,
        cbmGroupTo: this.stateFilterData.cbmGroupTo,
        componentStatusId: this.stateFilterData.componentStatusId,
        componentStatusIdTo: this.stateFilterData.componentStatusIdTo,
        objectType: this.stateFilterData.objectType,
        objectTypeTo: this.stateFilterData.objectTypeTo,
        group: this.stateFilterData.group,
        groupTo: this.stateFilterData.groupTo,
        rating: this.stateFilterData.rating,
        ratingTo: this.stateFilterData.ratingTo,
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
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, "component_status_mapping", new URLSearchParams(params).toString());
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
        this.stateSiteOption = mapOption(response.data.result.content.site);
        this.stateEquipmentModelOption = mapOption(response.data.result.content.equipmentModel);
        this.stateComponentStatusIdOption = mapOption(response.data.result.content.componentStatusId);
        this.stateCbmGroupOption = mapOption(response.data.result.content.cbmGroup);
        this.stateRatingOption = mapOption(response.data.result.content.rating);
        this.stateObjectTypeOption = mapOption(response.data.result.content.objectType);
        this.stateGroupOption = mapOption(response.data.result.content.group);
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
    setSite(value: string) {
      this.stateFilterData.site = value;
    },
    setSiteTo(value: string) {
      this.stateFilterData.siteTo = value;
    },
    setComponentStatusId(value: string) {
      this.stateFilterData.componentStatusId = value;
    },
    setComponentStatusIdTo(value: string) {
      this.stateFilterData.componentStatusIdTo = value;
    },
    setRating(value: string) {
      this.stateFilterData.rating = value;
    },
    setRatingTo(value: string) {
      this.stateFilterData.ratingTo = value;
    },
    setEquipmentModel(value: string) {
      this.stateFilterData.equipmentModel = value;
    },
    setEquipmentModelTo(value: string) {
      this.stateFilterData.equipmentModelTo = value;
    },
    setCbmGroup(value: string) {
      this.stateFilterData.cbmGroup = value;
    },
    setCbmGroupTo(value: string) {
      this.stateFilterData.cbmGroupTo = value;
    },
    setObjectType(value: string) {
      this.stateFilterData.objectType = value;
    },
    setObjectTypeTo(value: string) {
      this.stateFilterData.objectTypeTo = value;
    },
    setGroup(value: string) {
      this.stateFilterData.group = value;
    },
    setGroupTo(value: string) {
      this.stateFilterData.groupTo = value;
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
      this.stateFilterData.componentStatusId = "";
      this.stateFilterData.componentStatusIdTo = "";
      this.stateFilterData.cbmGroup = "";
      this.stateFilterData.cbmGroupTo = "";
      this.stateFilterData.rating = "";
      this.stateFilterData.ratingTo = "";
      this.stateFilterData.cbmGroup = "";
      this.stateFilterData.cbmGroupTo = "";
      this.stateFilterData.objectType = "";
      this.stateFilterData.objectTypeTo = "";
      this.stateFilterData.group = "";
      this.stateFilterData.groupTo = "";
      this.stateFilterData.startDate = "";
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.endDateTo = "";
      const checkSite = this.stateLastUsedFilterData.site !== "";
      const checkSiteTo = this.stateLastUsedFilterData.siteTo !== "";
      const checkEquipmentModel = this.stateLastUsedFilterData.equipmentModel !== "";
      const checkEquipmentModelTo = this.stateLastUsedFilterData.equipmentModelTo !== "";
      const checkComponentStatusId = this.stateLastUsedFilterData.componentStatusId !== "";
      const checkComponentStatusIdTo = this.stateLastUsedFilterData.componentStatusIdTo !== "";
      const checkCbmGroup = this.stateLastUsedFilterData.cbmGroup !== "";
      const checkCbmGroupTo = this.stateLastUsedFilterData.cbmGroupTo !== "";
      const checkRating = this.stateLastUsedFilterData.rating !== "";
      const checkRatingTo = this.stateLastUsedFilterData.ratingTo !== "";
      const checkObjectType = this.stateLastUsedFilterData.objectType !== "";
      const checkObjectTypeTo = this.stateLastUsedFilterData.objectTypeTo !== "";
      const checkGroup = this.stateLastUsedFilterData.group !== "";
      const checkGroupTo = this.stateLastUsedFilterData.groupTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== "";
      if (checkSite ||
        checkSiteTo ||
        checkEquipmentModel ||
        checkEquipmentModelTo ||
        checkComponentStatusId ||
        checkComponentStatusIdTo ||
        checkCbmGroup ||
        checkCbmGroupTo ||
        checkObjectType ||
        checkObjectTypeTo ||
        checkGroup ||
        checkGroupTo ||
        checkRating ||
        checkRatingTo ||
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
