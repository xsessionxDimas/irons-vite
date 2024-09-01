import PaginationType from "@/core/types/misc/Pagination";
import {
  DraftItem
} from '@/core/types/entities/iron-lake/maintenance/cbm-parameter/DraftItem';
import {
  ListItem
} from '@/core/types/entities/iron-lake/maintenance/cbm-parameter/ListItem';
import { defineStore } from "pinia";
import {
  FilterData
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/FilterData";
import {
  AxiosRequestConfig,
  AxiosResponse
} from "axios";
import {
  SingleApiResponse
} from "@/core/types/misc/SingleApiResponse";
import {
  CbmContent
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/CbmContent";
import ApiService from "@/core/services/ApiService";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";
import {
  IRONLAKE_CRUD_API_URL,
  IRONLAKE_LOOKUP_COMPONENT,
  IRONLAKE_LOOKUP_MODEL,
  IRONLAKE_LOOKUP_SERVICE_SIZE,
  IRONLAKE_LOOKUP_SERVICE_SIZE_URL,
  IRONLAKE_EXPORT_API_URL,
  IRONLAKE_LOOKUP_RATING,
} from "./urls";
import {
  SyncItem
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/SyncItem";
import { Option } from "@/core/types/misc/Option";
import { swalAlertErrorTitle } from "@/core/helpers/sweet-alert";
import {
  ExportFilterData
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/ExportFilterData";

const initialFilter = {
  description: "",
  equipmentModelId: null,
  serviceSize: "",
  typeParameterId: null,
  componentId: null,
  cbmGroupId: null,
  rating: "",
  page: 1,
  pageSize: 20,
}

export const useCbmParameterListStore = defineStore({
  id: "cbmParameterList",
  state: () => {
    return {
      stateFilterData: {
        description: "",
        equipmentModelId: null,
        serviceSize: "",
        typeParameterId: null,
        componentId: null,
        cbmGroupId: null,
        rating: "",
        isSync: false,
        page: 1,
        pageSize: 20,
      } as FilterData,
      stateLastUsedFilterData: {
        description: "",
        equipmentModelId: null,
        serviceSize: "",
        typeParameterId: null,
        componentId: null,
        cbmGroupId: null,
        rating: "",
        isSync: false,
        page: 1,
        pageSize: 20,
      } as FilterData,
      stateExportFilter: {
        description: "",
        equipmentModelId: null,
        serviceSize: "",
        typeParameterId: null,
        componentId: null,
        cbmGroupId: null,
        rating: "",
        isSync: false,
      } as ExportFilterData,
      stateLastSyncDate: '',
      statePageName: "cbm parameter",
      stateDisplayData: [] as ListItem[],
      stateFilterVisibility: false,
      stateDraftData: [] as DraftItem[],
      statePagination: new PaginationType(),
      stateSyncData: [] as SyncItem[],
      stateCbmGroupOption: [] as Option[],
      stateTypeParameterOption: [] as Option[],
      stateEquipmentModelOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateRatingOption: [] as Option[],
      stateServiceSizeOption: [] as Option[],
      stateStatusConverter: [] as Option[],
      stateLoading: false as boolean,
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
    loading: (state) => {
      return state.stateLoading;
    },
    draftData: (state) => {
      return state.stateDraftData;
    },
    displayData: (state) => {
      return state.stateDisplayData
    },
    syncData: (state) => {
      return state.stateSyncData
    },
    lastUsedFilterData: (state) => {
      return state.stateLastUsedFilterData
    },
    paginationLoading: (state) => {
      return state.statePaginationLoading;
    },
    filterVisibility: (state) => {
      return state.stateFilterVisibility;
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      this.stateLoading = true;
      this.stateLastUsedFilterData = {
        ...this.stateFilterData
      } as FilterData;
      const params = {
        ver: "v1",
      }
      const payload = {
        description: this.stateFilterData.description,
        equipmentModelId: this.stateFilterData.equipmentModelId === "" ? null : this.stateFilterData.equipmentModelId,
        serviceSize: this.stateFilterData.serviceSize,
        typeParameterId: this.stateFilterData.typeParameterId === "" ? null : this.stateFilterData.typeParameterId,
        componentId: this.stateFilterData.componentId === "" ? null : this.stateFilterData.componentId,
        cbmGroupId: this.stateFilterData.cbmGroupId === "" ? null : this.stateFilterData.cbmGroupId,
        rating: this.stateFilterData.rating,
        isSync: this.stateFilterData.isSync,
        page: this.stateFilterData.page,
        pageSize: this.stateFilterData.pageSize,
      }
      try {
        if (isPageRefresh) {
          this.stateLoading = true;
        } else {
          this.stateDisplayData = [...[]];
        }
        const response: AxiosResponse<SingleApiResponse<CbmContent>> = await ApiService.post(`${IRONLAKE_CRUD_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
        if (response.data.title === 'Error') {
          swalAlertErrorTitle("Failed to Fetch Data", response.data.result.message, "Ok");
        } else {
          this.stateDisplayData = response.data.result.content.cbmParameterList;
          this.stateDraftData = response.data.result.content.cbmParameterDraftList;
          this.setTotalPage(response.data.result.content.totalData);
        }
      } catch (error) {
        console.log(error);
      }
      this.stateLoading = false;
    },
    async getSyncData(isPageRefresh = true) {
      this.stateLoading = true;
      const params = {
        ver: "v1",
      }
      try {
        if (isPageRefresh) {
          this.stateLoading = true;
        } else {
          this.stateSyncData = [...[]];
        }
        const response: AxiosResponse<SingleApiResponse<SyncItem[]>> = await ApiService.get(`${IRONLAKE_CRUD_API_URL}/sync_history?${new URLSearchParams(params).toString()}`);
        this.stateSyncData = response.data.result.content;
        this.stateLastSyncDate = response.data.result.content[0].syncDate;
      } catch (error) {
        console.log(error);
      }
      this.stateLoading = false;
    },
    async getLookupCbmGroup() {
      const params = {
        ver: "v1"
      }
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${IRONLAKE_CRUD_API_URL}/lookup_cbm_group`, "", new URLSearchParams(params).toString());
        const responseData = response.data.result.content;
        this.stateCbmGroupOption = [];
        responseData.forEach((el) => {
          const single = {
            value: el.cbmGroupId,
            label: el.cbmGroup,
          }
          this.stateCbmGroupOption.push(single);
        })
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupTypeParameter() {
      const params = {
        ver: "v1"
      }
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${IRONLAKE_CRUD_API_URL}/lookup_type_parameter`, "", new URLSearchParams(params).toString());
        const responseData = response.data.result.content;
        this.stateTypeParameterOption = [];
        responseData.forEach((el) => {
          const single = {
            value: el.typeParameterId,
            label: el.typeParameter,
          }
          this.stateTypeParameterOption.push(single);
        })
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupStatus() {
      const params = {
        ver: "v1"
      }
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${IRONLAKE_CRUD_API_URL}/lookup_status_converter`, "", new URLSearchParams(params).toString());
        const responseData = response.data.result.content;
        this.stateStatusConverter = []
        responseData.forEach((el) => {
          const single = {
            value: el,
            label: el,
          }
          this.stateStatusConverter.push(single);
        })
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupServiceSize() {
      const params = {
        ver: "v1",
      }
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${IRONLAKE_LOOKUP_SERVICE_SIZE_URL}?${new URLSearchParams(params).toString()}`);
        const responseData = response.data.result.content.psType;
        this.stateServiceSizeOption = []
        responseData.forEach((el) => {
          const single = {
            value: `${el}`,
            label: `${el}`,
          }
          this.stateServiceSizeOption.push(single);
        })
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupEquipmentModel() {
      const params = {
        ver: "v1"
      }
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${IRONLAKE_LOOKUP_MODEL}?${new URLSearchParams(params).toString()}`);
        const responseData = response.data.result.content;
        this.stateEquipmentModelOption = []
        responseData.forEach((el) => {
          const single = {
            value: el.equipmentModelId,
            label: el.equipmentModel,
          }
          this.stateEquipmentModelOption.push(single);
        })
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupComponent() {
      const params = {
        ver: "v1"
      }
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${IRONLAKE_LOOKUP_COMPONENT}?${new URLSearchParams(params).toString()}`);
        const responseData = response.data.result.content;
        this.stateComponentOption = []
        responseData.forEach((el) => {
          const single = {
            value: el.componentId,
            label: el.componentCode !== '' ? `${el.componentCode} | ${el.componentName}` : "",
          }
          this.stateComponentOption.push(single);
        })
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupRating() {
      const params = {
        ver: "v1"
      }
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${IRONLAKE_LOOKUP_RATING}?${new URLSearchParams(params).toString()}`);
        const responseData = response.data.result.content;
        this.stateRatingOption = []
        responseData.forEach((el) => {
          const single = {
            value: el,
            label: el,
          }
          this.stateRatingOption.push(single);
        })
      } catch (error) {
        console.log(error);
      }
    },
    async export() {
      const qParams = {
        ver: 'v1',
      };
      this.stateExportFilter.description = this.stateFilterData.description;
      this.stateExportFilter.equipmentModelId = this.stateFilterData.equipmentModelId === "" ? null : this.stateFilterData.equipmentModelId;
      this.stateExportFilter.serviceSize = this.stateFilterData.serviceSize;
      this.stateExportFilter.typeParameterId = this.stateFilterData.typeParameterId === "" ? null : this.stateFilterData.typeParameterId;
      this.stateExportFilter.componentId = this.stateFilterData.componentId === "" ? null : this.stateFilterData.componentId;
      this.stateExportFilter.cbmGroupId = this.stateFilterData.cbmGroupId === "" ? null : this.stateFilterData.cbmGroupId;
      this.stateExportFilter.rating = this.stateFilterData.rating;
      this.stateExportFilter.isSync = this.stateFilterData.isSync;
      try {
        const response: AxiosResponse<Blob> = await ApiService.postBlob(`${IRONLAKE_EXPORT_API_URL}/false?${new URLSearchParams(qParams).toString()}`, this.stateExportFilter as AxiosRequestConfig);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    setTotalPage(totalPage: number) {
      this.pagination.totalPage = totalPage;
      this.pagination.getPaginationLastIndex();
      this.pagination.getPaginationLastIndex();
    },
    async setPage(newPage: number) {
      this.statePaginationLoading = true;
      this.statePagination.handleCurrentPageChange(newPage);
      this.statePagination.totalPageSize = this.stateFilterData.pageSize;
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData(false);
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200)
    },
    async setPageSize(size: number) {
      this.statePaginationLoading = true;
      this.stateFilterData.pageSize = size;
      this.statePagination.totalPageSize = this.stateFilterData.pageSize;
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData(true);
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200)
    },
    async setFilterData(filter: FilterData) {
      this.stateLoading = true;
      this.stateFilterData = filter;
      await this.getData(false);
    },
    setLastActiveFilter(filter: FilterData) {
      this.stateFilterData = filter
    },
    setFilterVisibility(visible: boolean) {
      this.stateFilterVisibility = visible
    },
    resetState() {
      this.stateFilterData = {
        ...initialFilter
      } as FilterData;
      this.stateDisplayData = [] as ListItem[];
      this.statePagination = new PaginationType();
      this.stateSyncData = [] as SyncItem[];
      this.stateDraftData = [] as DraftItem[];
      this.stateLoading = false;
      this.statePaginationLoading = false;
    }
  },
});
