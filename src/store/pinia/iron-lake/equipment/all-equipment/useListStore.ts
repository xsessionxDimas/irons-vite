import PaginationType from "@/core/types/misc/Pagination";
import ApiService from "@/core/services/ApiService";
import { EQP_CRUD_API_URL, IRONLAKE_ASSET } from "./urls";
import { defineStore } from "pinia";
import { useBulkStore } from "./useBulkStore";
import { useFormStore } from "./useFormStore";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponseIronlake } from "@/core/types/misc/ApiResponse";
import {
  ContentAllEqp,
  CompListByEqp,
  ListItem,
} from "@entities/iron-lake/equipment/all-equipment/ListItem";
import {
  reqFilterBody
} from "@entities/iron-lake/equipment/all-equipment/FilterData";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { UserInfo } from "@/database/schema/UserInfo";

const formStore = useFormStore();
const bulkStore = useBulkStore();

class InitialFilterForm {
  siteId: null | string;
  ownershipId: null | number;
  equipmentNoId: null | number;
  equipmentGroupId: null | number;
  brandId: null | number;
  equipmentModelId: null | number;
  engineHourMeter: null | number;
  engineHourMeterOffset: null | number;
  component: string;
  status: null | boolean;
  onlyEquipment: boolean;
  page: number;
  pageSize: number;

  constructor(userDetail: UserInfo) {
    this.siteId =
      userDetail && userDetail.isHO === 1 ? null : userDetail.SiteId;
    this.ownershipId = null;
    this.equipmentNoId = null;
    this.equipmentGroupId = null;
    this.brandId = null;
    this.equipmentModelId = null;
    this.engineHourMeter = null;
    this.engineHourMeterOffset = null;
    this.component = "";
    this.status = null;
    this.onlyEquipment = true;
    this.page = 1;
    this.pageSize = 20;
  }
}

export const useListStore = defineStore({
  id: "allEquipmentList",
  state: () => {
    return {
      stateFilterForm: new InitialFilterForm(
        useAuthenticationStore().user,
      ) as reqFilterBody,
      stateList: [] as ListItem[],
      stateOnlyEquipment: true,

      statePageName: "all-equipment",
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      stateCompListLoading: false as boolean,
      statePaginationLoading: false as boolean,
    };
  },
  getters: {
    pageName: (state) => {
      return state.statePageName;
    },
    pagination: (state) => {
      return state.statePagination;
    },
    isEqpMode: (state) => {
      return state.stateOnlyEquipment;
    },
    siteOption: () => {
      return formStore.siteOption;
    },
    eqpNoOption: () => {
      return formStore.eqpNoOption;
    },
    eqpGroupOption: () => {
      return formStore.eqpGroupFilterOption;
    },
    eqpBrandOption: () => {
      return formStore.eqpBrandFilterOption;
    },
    eqpModelOption: () => {
      return formStore.eqpModelFilterOption;
    },
    ownershipOption: () => {
      return formStore.ownershipFilterOption;
    },
    list: (state) => {
      return state.stateList;
    },
    loading: (state) => {
      return state.stateLoading;
    },
    paginationLoading: (state) => {
      return state.statePaginationLoading;
    },
  },
  actions: {
    setTotalPage(totalPage: number) {
      this.pagination.totalPage = totalPage;
      this.pagination.getPaginationStartIndex();
      this.pagination.getPaginationLastIndex();
    },
    setOnlyEqpLocal(value: boolean) {
      localStorage.setItem("isNotHMO", JSON.stringify(value));
      const isNotHmoValue = localStorage.getItem("isNotHMO");
      if (isNotHmoValue !== null) {
        this.stateOnlyEquipment = JSON.parse(isNotHmoValue);
      }
    },
    checkEmptyString(property) {
      return property === "" ? null : property
    },
    async getList() {
      this.stateLoading = true;
      const params = {
        ver: "v1",
      };
      const body: reqFilterBody = this.stateFilterForm;
      const storageIsOnlyEqp = localStorage.getItem("isNotHMO");
      if (storageIsOnlyEqp !== null) {
        this.stateOnlyEquipment = JSON.parse(storageIsOnlyEqp);
      }
      // if user delete previous value. It will return a string if empty. So change it to null
      body.siteId = this.checkEmptyString(body.siteId);
      body.ownershipId = this.checkEmptyString(body.ownershipId);
      body.equipmentNoId = this.checkEmptyString(body.equipmentNoId);
      body.equipmentGroupId = this.checkEmptyString(body.equipmentGroupId);
      body.brandId = this.checkEmptyString(body.brandId);
      body.equipmentModelId = this.checkEmptyString(body.equipmentModelId);
      body.engineHourMeter = this.checkEmptyString(body.engineHourMeter);
      body.engineHourMeterOffset = this.checkEmptyString(body.engineHourMeterOffset);
      body.onlyEquipment = this.stateOnlyEquipment;
      body.status = this.checkEmptyString(body.status);
      try {
        const response: AxiosResponse<ApiResponseIronlake<ContentAllEqp>> =
          await ApiService.post(
            `${EQP_CRUD_API_URL}?${new URLSearchParams(params).toString()}`,
            body as AxiosRequestConfig,
          );
        const content = response.data.result.content;
        this.stateList = content.equipmentList;
        if (content.equipmentDraftList) {
          bulkStore.stateDraftData = content.equipmentDraftList;
        }
        this.setTotalPage(content.totalData);
      } catch (error) {
        console.log(error);
      }
      this.stateLoading = false;
    },
    async setPage(newPage: number) {
      this.statePaginationLoading = true;
      this.statePagination.totalPageSize = this.stateFilterForm.pageSize;
      this.statePagination.handleCurrentPageChange(newPage);
      this.stateFilterForm.page = this.statePagination.currentPage;
      await this.getList();
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200);
    },
    async setAppliedFilter(filter: reqFilterBody) {
      this.stateFilterForm = filter;
      await this.setPage(1);
    },
    async getComponentByEqp(eqpNo: number) {
      const params = {
        ver: "v1",
      };
      const url = `${IRONLAKE_ASSET}/api/ironlake/component_by_equipment?${new URLSearchParams(
        params,
      ).toString()}`;
      const filterForm = this.stateFilterForm;
      let payload;
      if (!formStore.stateIsNewForm) {
        payload = {
          equipmentNoId:
            filterForm.equipmentNoId === null
              ? eqpNo
              : filterForm.equipmentNoId,
          siteId: filterForm.siteId,
        };
      } else {
        payload = {
          equipmentNoId:
            filterForm.equipmentNoId === null
              ? eqpNo
              : filterForm.equipmentNoId,
          siteId: filterForm.siteId,
          component: filterForm.component,
        };
      }
      try {
        this.stateCompListLoading = true;
        const response: AxiosResponse<ApiResponseIronlake<CompListByEqp>> =
          await ApiService.post(url, payload as AxiosRequestConfig);
        this.stateCompListLoading = false;
        if (!response.data.result.isError) {
          const indexToUpdate = this.stateList.findIndex((obj) => {
            return obj.equipmentNoId === eqpNo;
          });
          this.stateList[indexToUpdate].component =
            response.data.result.content.componentList;
        }
      } catch (error) {
        this.stateCompListLoading = false;
        return error;
      }
    },
    resetListComp(eqpNoId: number) {
      const indexToUpdate = this.stateList.findIndex((obj) => {
        return obj.equipmentNoId === eqpNoId;
      });
      this.stateList[indexToUpdate].component = []
    },

    async export() {
      const params = new URLSearchParams({ ver: "v1" }).toString();
      const {
        siteId,
        ownershipId,
        equipmentNoId,
        equipmentGroupId,
        brandId,
        equipmentModelId,
        engineHourMeter,
        engineHourMeterOffset,
        component,
        status,
      } = this.stateFilterForm;
      const downloadListPayload = {
        siteId,
        ownershipId,
        equipmentNoId,
        equipmentGroupId,
        brandId,
        equipmentModelId,
        engineHourMeter,
        engineHourMeterOffset,
        component,
        status,
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.postBlob(
          `${EQP_CRUD_API_URL}/export/false/false?${params}`,
          downloadListPayload as AxiosRequestConfig,
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },

    resetFilter() {
      this.stateFilterForm = new InitialFilterForm(
        useAuthenticationStore().user,
      ) as reqFilterBody;
    },
  },
});
