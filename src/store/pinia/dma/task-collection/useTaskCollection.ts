import PaginationType from "@/core/types/misc/Pagination";
import {
  FilterData
} from "@/core/types/entities/dma/task-collection/FilterData";
import {
  FilterResponse
} from "@/core/types/entities/dma/task-collection/FilterResponse";
import { ListItem } from "@/core/types/entities/dma/task-collection/ListItem";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import {
  exportTaskCollection,
  getTaskCollection,
  lookupFilterTaskCollection
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { swalAlertErrorTitle } from "@/core/helpers/sweet-alert";
import {
  ApiResponseIronForms
} from "@/core/types/misc/ApiResponse";
import {
  ResponseResultTotal
} from "@/core/types/misc/ResponseResult";
import {
  FilterRequest
} from "@/core/types/entities/dma/task-collection/FilterRequest";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialFilter = {
  modelId: "",
  psTypeId: "",
  version: "",
  releaseDate: "",
  category: "",
  description: "",
  subTask: "",
  status: "Active",
  page: 1,
  pageSize: 20,
};
export const useTaskCollection = defineStore({
  id: "taskCollection",
  state: () => {
    return {
      stateLoading: false as boolean,
      stateLoadingFilter: false as boolean,
      stateLoadingExport: false as boolean,
      stateFilterData: {
        modelId: "",
        psTypeId: "",
        version: "",
        releaseDate: "",
        category: "",
        description: "",
        subTask: "",
        status: "Active",
        page: 1,
        pageSize: 20,
      } as FilterData,
      stateDisplayData: [] as ListItem[],
      stateFilterLookupParams: {
        modelId: "",
        psTypeId: "",
        category: "",
        version: "",
        releaseDate: "",
        description: "",
        subTask: "",
        status: "",
      } as FilterRequest,
      stateFilterLookupData: {} as FilterResponse,
      statePaginationLoading: false as boolean,
      statePagination: new PaginationType(),
      stateFilterVisibility: false,
      stateLastUsedFilterData: {
        ...initialFilter,
      } as FilterData,
      stateSearchValue: "",
    };
  },
  getters: {
    loading: (state) => {
      return state.stateLoading;
    },
    pagination: (state) => {
      return state.statePagination;
    },
    displayData: (state) => {
      return state.stateDisplayData;
    },
    paginationLoading: (state) => {
      return state.statePaginationLoading;
    },
    filterVisibility: (state) => {
      return state.stateFilterVisibility;
    },
    loadingFilter: (state) => {
      return state.stateLoadingFilter;
    },
    loadingExport: (state) => {
      return state.stateLoadingExport;
    }
  },
  actions: {
    async getData() {
      this.stateLoading = true;
      this.stateLastUsedFilterData = {
        ...this.stateFilterData,
      } as FilterData;
      const params = {
        ver: "v1",
        modelId: this.stateFilterData.modelId,
        psTypeId: this.stateFilterData.psTypeId,
        version: this.stateFilterData.version,
        releaseDate: this.stateFilterData.releaseDate,
        category: this.stateFilterData.category,
        description: this.stateFilterData.description,
        subTask: this.stateFilterData.subTask,
        status: this.stateFilterData.status,
        page: this.stateFilterData.page.toString(),
        pageSize: this.stateFilterData.pageSize.toString(),
      };
      try {
        const response: AxiosResponse<
          ApiResponseIronForms<ResponseResultTotal<ListItem[]>>
        > = await ApiService.get(
          `${getTaskCollection}?${new URLSearchParams(params).toString()}`,
        );
        if (response.data.title === "Error") {
          swalAlertErrorTitle(
            "Failed to Fetch Data",
            response.data.result.message,
            "Ok",
          );
        } else {
          this.stateDisplayData = response.data.result.content;
          this.setTotalPage(parseInt(response.data.result.total.toString()));
        }
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
      this.stateLoading = false;
    },
    async setPage(newPage: number) {
      this.statePaginationLoading = true;
      this.statePagination.handleCurrentPageChange(newPage);
      this.statePagination.totalPageSize = this.stateFilterData.pageSize;
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData();
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200);
    },
    async getLookupFilter() {
      this.stateLoadingFilter = true;
      this.stateLastUsedFilterData = {
        ...this.stateFilterData,
      } as FilterData;
      const params = {
        ver: "v1",
        modelId: this.stateFilterLookupParams.modelId,
        psTypeId: this.stateFilterLookupParams.psTypeId,
        version: this.stateFilterLookupParams.version,
        releaseDate: this.stateFilterLookupParams.releaseDate,
        category: this.stateFilterLookupParams.category,
        description: this.stateFilterLookupParams.description,
        subTask: this.stateFilterLookupParams.subTask,
        status: this.stateFilterLookupParams.status,
      };
      try {
        const response: AxiosResponse<
          SingleApiResponse<FilterResponse>
        > = await ApiService.get(
          `${lookupFilterTaskCollection}?${new URLSearchParams(params).toString()}`,
        );
        this.stateFilterLookupData = response.data.result.content;
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
      this.stateLoadingFilter = false;
    },
    async export() {
      const params = {
        ver: "v1",
        modelId: this.stateFilterData.modelId,
        psTypeId: this.stateFilterData.psTypeId,
        version: this.stateFilterData.version,
        releaseDate: this.stateFilterData.releaseDate,
        category: this.stateFilterData.category,
        description: this.stateFilterData.description,
        subTask: this.stateFilterData.subTask,
        status: this.stateFilterData.status,
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.getBlob(`${exportTaskCollection}?${new URLSearchParams(params).toString()}`);
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
    setFilterVisibility(visibility: boolean) {
      this.stateFilterVisibility = visibility;
    },
    async setPageSize(size: number) {
      this.statePaginationLoading = true;
      this.stateFilterData.pageSize = size;
      this.statePagination.totalPageSize = this.stateFilterData.pageSize;
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData();
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200);
    },
    resetState() {
      this.stateFilterData = {
        ...initialFilter,
      } as FilterData;
      this.stateDisplayData = [] as ListItem[];
      this.statePagination = new PaginationType();
      this.stateLoading = false;
      this.statePaginationLoading = false;
    },
    async setFilterData(filter: FilterData) {
      this.stateLoading = true;
      this.stateFilterData = filter;
      await this.getData();
    },
    setLastActiveFilter(filter: FilterData) {
      this.stateLastUsedFilterData = filter
    }
  },
});
