import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/equipment-config-in-iron-portal/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/equipment-config-in-iron-portal/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/equipment-config-in-iron-portal/LookupItem";
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
  objectType: "",
  objectTypeTo: "",
  codeGroup: "",
  codeGroupTo: "",
  damageCategory: "",
  damageCategoryTo: "",
  damage: "",
  damageTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useEquipmentConfigInIronPortalListStore = defineStore({
  id: "equipmentConfigInIronPortalList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "equipmentConfigInIronPortal",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateSiteOption: [] as Option[],
      stateEquipmentModelOption: [] as Option[],
      stateObjectTypeOption: [] as Option[],
      stateCodeGroupOption: [] as Option[],
      stateDamageCategoryOption: [] as Option[],
      stateDamageOption: [] as Option[],
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
      return state.stateSiteOption
    },
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption
    },
    objectTypeOption: (state) => {
      return state.stateObjectTypeOption
    },
    codeGroupOption: (state) => {
      return state.stateCodeGroupOption
    },
    damageCategoryOption: (state) => {
      return state.stateDamageCategoryOption
    },
    damageOption: (state) => {
      return state.stateDamageOption
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        site: this.stateFilterData.site,
        siteTo: this.stateFilterData.siteTo,
        equipmentModel: this.stateFilterData.equipmentModel,
        equipmentModelTo: this.stateFilterData.equipmentModelTo,
        objectType: this.stateFilterData.objectType,
        objectTypeTo: this.stateFilterData.objectTypeTo,
        codeGroup: this.stateFilterData.codeGroup,
        codeGroupTo: this.stateFilterData.codeGroupTo,
        damageCategory: this.stateFilterData.damageCategory,
        damageCategoryTo: this.stateFilterData.damageCategoryTo,
        damage: this.stateFilterData.damage,
        damageTo: this.stateFilterData.damageTo,
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
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, "exclude_unit_by_equipment", new URLSearchParams(params).toString());
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
        this.stateObjectTypeOption = mapOption(response.data.result.content.objectType);
        this.stateCodeGroupOption = mapOption(response.data.result.content.codeGroup);
        this.stateDamageCategoryOption = mapOption(response.data.result.content.damageCategory);
        this.stateDamageOption = mapOption(response.data.result.content.damage);
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
    setCodeGroup(value: string) {
      this.stateFilterData.codeGroup = value;
    },
    setCodeGroupTo(value: string) {
      this.stateFilterData.codeGroupTo = value;
    },
    setDamage(value: string) {
      this.stateFilterData.damage = value;
    },
    setDamageTo(value: string) {
      this.stateFilterData.damageTo = value;
    },
    setDamageCategory(value: string) {
      this.stateFilterData.damageCategory = value;
    },
    setDamageCategoryTo(value: string) {
      this.stateFilterData.damageCategoryTo = value;
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
      this.stateFilterData.objectType = "";
      this.stateFilterData.objectTypeTo = "";
      this.stateFilterData.codeGroup = "";
      this.stateFilterData.codeGroupTo = "";
      this.stateFilterData.damageCategory = "";
      this.stateFilterData.damageCategoryTo = "";
      this.stateFilterData.damage = "";
      this.stateFilterData.damageTo = "";
      this.stateFilterData.startDate = "";
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.endDateTo = "";
      const checkSite = this.stateLastUsedFilterData.site !== "";
      const checkSiteTo = this.stateLastUsedFilterData.siteTo !== "";
      const checkEquipmentModel = this.stateLastUsedFilterData.equipmentModel !== "";
      const checkEquipmentModelTo = this.stateLastUsedFilterData.equipmentModelTo !== "";
      const checkObjectType = this.stateLastUsedFilterData.objectType !== "";
      const checkObjectTypeTo = this.stateLastUsedFilterData.objectTypeTo !== "";
      const checkCodeGroup = this.stateLastUsedFilterData.codeGroup !== "";
      const checkCodeGroupTo = this.stateLastUsedFilterData.codeGroupTo !== "";
      const checkDamageCategory = this.stateLastUsedFilterData.damageCategory !== "";
      const checkDamageCategoryTo = this.stateLastUsedFilterData.damageCategoryTo !== "";
      const checkDamage = this.stateLastUsedFilterData.damage !== "";
      const checkDamageTo = this.stateLastUsedFilterData.damageTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== "";
      if (
        checkSite ||
        checkSiteTo ||
        checkEquipmentModel ||
        checkEquipmentModelTo ||
        checkObjectType ||
        checkObjectTypeTo ||
        checkCodeGroup ||
        checkCodeGroupTo ||
        checkDamageCategory ||
        checkDamageCategoryTo ||
        checkDamage ||
        checkDamageTo ||
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
