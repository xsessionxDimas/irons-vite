import PaginationType from '@/core/types/misc/Pagination'
import { Option } from '@/core/types/misc/Option'
import ApiService from '@/core/services/ApiService'
import {
  GETALL_API_URL,
  LOOKUP_API_URL,
  EXPORT_API_URL,
  LOOKUP_DMA_API_URL
} from './urls'
import { defineStore } from 'pinia'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiResponse } from '@/core/types/misc/ApiResponse'
import {
  ListItem
} from '@/core/types/entities/administration/organization-unit/position/ListItem'
import {
  FilterData
} from '@/core/types/entities/administration/organization-unit/position/FilterData'
import {
  LookupItem
} from '@/core/types/entities/administration/organization-unit/position/LookupItem'
import { SingleApiResponse } from '@/core/types/misc/SingleApiResponse'
import { mapOption } from '@/core/helpers/mapOption'
import { formatDateForPostData } from '@/core/helpers/date-format'
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import {
  updateLoggedInStatusFromAPIResponse
} from '@/core/helpers/authentication-handler'
import { Position } from '@/core/types/entities/dma/masters/Position'
import { db } from '@/database/schema/DexieSchema'


export const usePositionListStore = defineStore({
  id: "positionList",
  state: () => {
    return {
      stateFilterData: {
        Position: "",
        PositionDescription: "",
        StartDate: "",
        EndDate: "",
        IsDma: null,
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: "",
      } as FilterData,
      stateLastUsedFilterData: {
        Position: "",
        PositionDescription: "",
        StartDate: "",
        EndDate: "",
        IsDma: null,
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: "",
      } as FilterData,
      statePageName: "position",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      statePositionOption: [] as Option[],
      statePositionDescOption: [] as Option[]
    }
  },
  getters: {
    pageName: (state) => {
      return state.statePageName
    },
    pagination: (state) => {
      return state.statePagination
    },
    displayData: (state) => {
      return state.stateDisplayData
    },
    filterData: (state) => {
      return state.stateFilterData
    },
    lastUsedFilterData: (state) => {
      return state.stateLastUsedFilterData
    },
    loading: (state) => {
      return state.stateLoading
    },
    paginationLoading: (state) => {
      return state.statePaginationLoading
    },
    positionOption: (state) => {
      return state.statePositionOption
    },
    positionDescOption: (state) => {
      return state.statePositionDescOption
    }
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        Position: this.stateFilterData.Position,
        PositionDescription: this.stateFilterData.PositionDescription,
        Page: this.stateFilterData.Page.toString(),
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate) : "",
        IsDma: this.stateFilterData.IsDma,
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
        ver: this.stateFilterData.ver
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.post(`${GETALL_API_URL}?ver=v1`, params as AxiosRequestConfig);
        this.stateDisplayData = response.data.result.content;
        this.setTotalPage(response.data.result.total);
        this.stateLastUsedFilterData = {
          ...this.stateFilterData
        } as FilterData
      } catch (error) {
        console.log(error);
      }
      this.stateLoading = false;
    },
    async getLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.post(`${LOOKUP_API_URL}?${new URLSearchParams(params).toString()}`, {});
        this.statePositionOption = mapOption(response.data.result.content.position);
        this.statePositionDescOption = mapOption(response.data.result.content.positionDescription);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore()
          authStore.setLoggedIn(false)
        }
      }
    },
    async getPositionDMA() {
      const params = {
        Position: "",
        PositionDescription: ""
      };
      try {
        const response: AxiosResponse<SingleApiResponse<Position>> = await ApiService.post(`${LOOKUP_DMA_API_URL}?ver=v1`, params as AxiosRequestConfig);
        const data = (response.data.result.content.position).map((p) => {
          return {
            value: p,
            label: p
          }
        })
        await db.position.clear()
        await db.position.bulkAdd(data)
        this.statePositionOption = data
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
      }
    },
    async setPositionDMALocal() {
      this.statePositionOption = await db.position.toArray()
    },
    async export() {
      const params = {
        Gmt: new Date().toTimeString().slice(12, 17),
        Position: this.stateFilterData.Position,
        PositionDescription: this.stateFilterData.PositionDescription,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate) : "",
        IsDma: this.stateFilterData.IsDma,
        Order: this.stateFilterData.Order,
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.postBlob(`${EXPORT_API_URL}?ver=v1`, params as AxiosRequestConfig);
        return response.data;
      } catch (error) {
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
      this.stateFilterData.Page = this.statePagination.currentPage;
      await this.getData(false);
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200)
    },
    async setSort({ prop, order }) {
      if (!prop && !order) {
        this.stateFilterData.Order = "";
      } else {
        const formatedOrder = order == "ascending" ? "asc" : "desc";
        this.stateFilterData.Order = `${prop}_${formatedOrder}`;
      }
      this.statePagination.handleCurrentPageChange(1);
      this.stateFilterData.Page = this.statePagination.currentPage;
      await this.getData(false);
    },
    setPosition(value: string) {
      this.stateFilterData.Position = value;
    },
    setPositionDescription(value: string) {
      this.stateFilterData.PositionDescription = value;
    },
    setStartDate(value: string | null) {
      this.stateFilterData.StartDate = value;
    },
    setEndDate(value: string | null) {
      this.stateFilterData.EndDate = value;
    },
    setIsDma(value: boolean | null) {
      this.stateFilterData.IsDma = value;
    },
    async resetFilter() {
      this.stateFilterData.Position = "";
      this.stateFilterData.PositionDescription = "";
      this.stateFilterData.StartDate = null;
      this.stateFilterData.EndDate = null;
      this.stateFilterData.IsDma = null;
      const checkPosition = this.stateLastUsedFilterData.Position !== "";
      const checkPositionDesc = this.stateLastUsedFilterData.PositionDescription !== "";
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== null;
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== null;
      const checkIsDma = this.stateLastUsedFilterData.IsDma !== null;
      if (checkPosition || checkPositionDesc || checkStartDate || checkEndDate || checkIsDma) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        Position: "",
        PositionDescription: "",
        StartDate: null,
        EndDate: null,
        IsDma: null,
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData;
      this.stateDisplayData = [] as ListItem[];
      this.statePagination = new PaginationType();
      this.stateLoading = false;
      this.statePaginationLoading = false;
    }
  }
});
