import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-area-mapping/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-area-mapping/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-area-mapping/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption } from "@/core/helpers/mapOption";
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
  equipmentModel: "",
  equipmentModelTo: "",
  objectType: "",
  objectTypeTo: "",
  cbmGroup: "",
  cbmGroupTo: "",
  area: "",
  areaTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useCbmAreaMappingListStore = defineStore({
  id: "cbmAreaMappingList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "cbmAreaMapping",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateCbmGroupOption: [] as Option[],
      stateAreaOption: [] as Option[],
      stateEquipmentModelOption: [] as Option[],
      stateObjectTypeOption: [] as Option[],
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
    objectTypeOption: (state) => {
      return state.stateObjectTypeOption;
    },
    cbmGroupOption: (state) => {
      return state.stateCbmGroupOption;
    },
    areaOption: (state) => {
      return state.stateAreaOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        equipmentModel: this.stateFilterData.equipmentModel,
        equipmentModelTo: this.stateFilterData.equipmentModelTo,
        objectType: this.stateFilterData.objectType,
        objectTypeTo: this.stateFilterData.objectTypeTo,
        cbmGroup: this.stateFilterData.cbmGroup,
        cbmGroupTo: this.stateFilterData.cbmGroupTo,
        area: this.stateFilterData.area,
        areaTo: this.stateFilterData.areaTo,
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
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, "cbm_area_mapping", new URLSearchParams(params).toString());
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
        this.stateEquipmentModelOption = mapOption(response.data.result.content.equipmentModel);
        this.stateObjectTypeOption = mapOption(response.data.result.content.objectType);
        this.stateCbmGroupOption = mapOption(response.data.result.content.cbmGroup);
        this.stateAreaOption = mapOption(response.data.result.content.area);
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
    setObjectType(value: string) {
      this.stateFilterData.objectType = value;
    },
    setObjectTypeTo(value: string) {
      this.stateFilterData.objectTypeTo = value;
    },
    setCbmGroup(value: string) {
      this.stateFilterData.cbmGroup = value;
    },
    setCbmGroupTo(value: string) {
      this.stateFilterData.cbmGroupTo = value;
    },
    setArea(value: string) {
      this.stateFilterData.area = value;
    },
    setAreaTo(value: string) {
      this.stateFilterData.areaTo = value;
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
      this.stateFilterData.objectType = "";
      this.stateFilterData.objectTypeTo = "";
      this.stateFilterData.cbmGroup = "";
      this.stateFilterData.cbmGroupTo = "";
      this.stateFilterData.area = "";
      this.stateFilterData.areaTo = "";
      this.stateFilterData.startDate = "";
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.endDateTo = "";
      const checkEquipmentModel = this.stateLastUsedFilterData.equipmentModel !== "";
      const checkEquipmentModelTo = this.stateLastUsedFilterData.equipmentModelTo !== "";
      const checkObjectType = this.stateLastUsedFilterData.objectType !== "";
      const checkObjectTypeTo = this.stateLastUsedFilterData.objectTypeTo !== "";
      const checkCbmGroup = this.stateLastUsedFilterData.cbmGroup !== "";
      const checkCbmGroupTo = this.stateLastUsedFilterData.cbmGroupTo !== "";
      const checkarea = this.stateLastUsedFilterData.area !== "";
      const checkareaTo = this.stateLastUsedFilterData.areaTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== "";
      if (
        checkEquipmentModel ||
        checkEquipmentModelTo ||
        checkObjectType ||
        checkObjectTypeTo ||
        checkCbmGroup ||
        checkCbmGroupTo ||
        checkarea ||
        checkareaTo ||
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
