import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  CRUD_API_URL,
  LOOKUP_API_URL,
  EXPORT_API_URL
} from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/parameter/smu-actual/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/smu-actual/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/parameter/smu-actual/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  mapOption,
} from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

const initialFilter = {
  Model: "",
  ModelTo: "",
  PsType: "",
  PsTypeTo: "",
  SmuActual: "",
  SmuActualTo: "",
  Uom: "",
  UomTo: "",
  StartDate: "",
  StartDateTo: "",
  EndDate: "",
  EndDateTo: "",
  ver: "v1",
  Page: 1,
  PageSize: 10,
  Order: ""
};

export const useSmuActualListStore = defineStore({
  id: "smuactual",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "smuactual",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      // Lookup
      stateModelOption: [] as Option[],
      statePsTypeOption: [] as Option[],
      stateUomOption: [] as Option[],
      stateSmuActualOption: [] as Option[],
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
    modelOption: (state) => {
      return state.stateModelOption;
    },
    psTypeOption: (state) => {
      return state.statePsTypeOption;
    },
    uomOption: (state) => {
      return state.stateUomOption;
    },
    smuActualOption: (state) => {
      return state.stateSmuActualOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        Model: this.stateFilterData.Model,
        ModelTo: this.stateFilterData.ModelTo,
        PsType: this.stateFilterData.PsType,
        PsTypeTo: this.stateFilterData.PsTypeTo,
        SmuActual: this.stateFilterData.SmuActual,
        SmuActualTo: this.stateFilterData.SmuActualTo,
        Uom: this.stateFilterData.Uom,
        UomTo: this.stateFilterData.UomTo,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate) : "",
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(this.stateFilterData.StartDateTo) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate) : "",
        EndDateTo: this.stateFilterData.EndDateTo ? formatDateForPostData(this.stateFilterData.EndDateTo) : "",
        Page: this.stateFilterData.Page.toString(),
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
        ver: this.stateFilterData.ver
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(CRUD_API_URL, "", new URLSearchParams(params).toString());
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
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.get(LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateModelOption = mapOption(response.data.result.content.model);
        this.statePsTypeOption = mapOption(response.data.result.content.psType);
        this.stateUomOption = mapOption(response.data.result.content.uom)
        this.stateSmuActualOption = mapOption(response.data.result.content.smuActual)
      } catch (error) {
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
    setModel(value: string) {
      this.stateFilterData.Model = value;
    },
    setModelTo(value: string) {
      this.stateFilterData.ModelTo = value;
    },
    setPsType(value: string) {
      this.stateFilterData.PsType = value;
    },
    setPsTypeTo(value: string) {
      this.stateFilterData.PsTypeTo = value;
    },
    setUom(value: string) {
      this.stateFilterData.Uom = value;
    },
    setUomTo(value: string) {
      this.stateFilterData.UomTo = value;
    },
    setSmuActual(value: string) {
      this.stateFilterData.SmuActual = value;
    },
    setSmuActualTo(value: string) {
      this.stateFilterData.SmuActualTo = value;
    },
    setStartDate(value: string) {
      this.stateFilterData.StartDate = value;
    },
    setStartDateTo(value: string) {
      this.stateFilterData.StartDateTo = value;
    },
    setEndDate(value: string) {
      this.stateFilterData.EndDate = value;
    },
    setEndDateTo(value: string) {
      this.stateFilterData.EndDateTo = value;
    },
    async resetFilter() {
      this.stateFilterData.Model = "";
      this.stateFilterData.ModelTo = "";
      this.stateFilterData.PsType = "";
      this.stateFilterData.PsTypeTo = "";
      this.stateFilterData.Uom = "";
      this.stateFilterData.UomTo = "";
      this.stateFilterData.SmuActual = "";
      this.stateFilterData.SmuActualTo = "";
      this.stateFilterData.StartDate = "";
      this.stateFilterData.StartDateTo = "";
      this.stateFilterData.EndDate = "";
      this.stateFilterData.EndDateTo = "";
      const checkModel = this.stateLastUsedFilterData.Model !== "";
      const checkModelTo = this.stateLastUsedFilterData.ModelTo !== "";
      const checkPsType = this.stateLastUsedFilterData.PsType !== "";
      const checkPsTypeTo = this.stateLastUsedFilterData.PsTypeTo !== "";
      const checkUom = this.stateLastUsedFilterData.Uom !== "";
      const checkUomTo = this.stateLastUsedFilterData.UomTo !== "";
      const checkSmuActual = this.stateLastUsedFilterData.SmuActual !== "";
      const checkSmuActualTo = this.stateLastUsedFilterData.SmuActualTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.StartDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.EndDateTo !== "";
      if (checkPsType || checkPsTypeTo || checkModel || checkModelTo || checkUom || checkUomTo || checkSmuActual || checkSmuActualTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo) {
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
