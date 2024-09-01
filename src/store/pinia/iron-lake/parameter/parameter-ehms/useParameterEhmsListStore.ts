import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  GET_URL,
  LOOKUP_API_URL,
  EXPORT_API_URL,
  LOOKUP_UOM_URL,
  LOOKUP_AREA_CBM_URL,
  LOOKUP_STATUS_CONVERTER_URL,
  LOOKUP_CBM_PARAMETER_URL,
  LOOKUP_CBM_GROUP_URL,
  LOOKUP_PARAMETER_API_URL
} from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/parameter/parameter-ehms/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/parameter-ehms/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-lake/parameter/parameter-ehms/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";
import {
  LOOKUP_API_URL as COMPONENT_LOOKUP_API_URL
} from "../../equipment/component/urls"
import {
  LOOKUP_API_URL as MODEL_LOOKUP_API_URL
} from "../../equipment/equipment-model/urls"
import {
  LOOKUP_PS_TYPE_API_URL
} from "../../task/daily-schedule/urls"

export const useParameterEhmsListStore = defineStore({
  id: "ParameterEhmsList",
  state: () => {
    return {
      stateFilterData: {
        ComponentId: "",
        CbmGroup: "",
        CbmArea: "",
        CbmParameterId: "",
        ModelId: "",
        PsTypeId: "",
        TaskNumber: "",
        DetailNumber: "",
        CbmParameter: "",
        Parameter: "",
        TypeParameterId: "",
        MinValue: "",
        MaxValue: "",
        Uom: "",
        StatusConverter: "",
        StatusDescriptionConverter: "",
        Status: "",
        StatusDescription: "",
        StartDate: "",
        EndDate: "",
        ComponentIdTo: "",
        CbmGroupTo: "",
        CbmAreaTo: "",
        CbmParameterIdTo: "",
        ModelIdTo: "",
        PsTypeIdTo: "",
        TaskNumberTo: "",
        DetailNumberTo: "",
        CbmParameterTo: "",
        ParameterTo: "",
        TypeParameterIdTo: "",
        MinValueTo: "",
        MaxValueTo: "",
        UomTo: "",
        StatusConverterTo: "",
        StatusDescriptionConverterTo: "",
        StatusTo: "",
        StatusDescriptionTo: "",
        StartDateTo: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1"
      } as FilterData,
      stateLastUsedFilterData: {
        ComponentId: "",
        CbmGroup: "",
        CbmArea: "",
        CbmParameterId: "",
        ModelId: "",
        PsTypeId: "",
        TaskNumber: "",
        DetailNumber: "",
        CbmParameter: "",
        Parameter: "",
        TypeParameterId: "",
        MinValue: "",
        MaxValue: "",
        Uom: "",
        StatusConverter: "",
        StatusDescriptionConverter: "",
        Status: "",
        StatusDescription: "",
        StartDate: "",
        EndDate: "",
        ComponentIdTo: "",
        CbmGroupTo: "",
        CbmAreaTo: "",
        CbmParameterIdTo: "",
        ModelIdTo: "",
        PsTypeIdTo: "",
        TaskNumberTo: "",
        DetailNumberTo: "",
        CbmParameterTo: "",
        ParameterTo: "",
        TypeParameterIdTo: "",
        MinValueTo: "",
        MaxValueTo: "",
        UomTo: "",
        StatusConverterTo: "",
        StatusDescriptionConverterTo: "",
        StatusTo: "",
        StatusDescriptionTo: "",
        StartDateTo: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1"
      } as FilterData,
      statePageName: "parameterEhms",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateUomOption: [] as Option[],
      stateAreaCbmOption: [] as Option[],
      stateStatusConverterOption: [] as Option[],
      stateStatusConverterDescriptionOption: [] as Option[],
      stateCbmParameterOption: [] as Option[],
      stateCbmParameterIDOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateModelOption: [] as Option[],
      statePsTypeOption: [] as Option[],
      stateCbmGroupOption: [] as Option[],
      stateDetailNumberOption: [] as Option[],
      stateMaxValueOption: [] as Option[],
      stateMinValueOption: [] as Option[],
      stateParameterOption: [] as Option[],
      stateTypeParameterOption: [] as Option[],
      stateStatusOption: [] as Option[],
      stateStatusDescriptionOption: [] as Option[],
      stateTaskNumberOption: [] as Option[],
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
    UomOption: (state) => {
      return state.stateUomOption
    },
    AreaCbmOption: (state) => {
      return state.stateAreaCbmOption
    },
    StatusConverterOption: (state) => {
      return state.stateStatusConverterOption
    },
    StatusConverterDescriptionOption: (state) => {
      return state.stateStatusConverterDescriptionOption
    },
    CbmParameterOption: (state) => {
      return state.stateCbmParameterOption
    },
    CbmParameterIDOption: (state) => {
      return state.stateCbmParameterIDOption
    },
    ComponentOption: (state) => {
      return state.stateComponentOption
    },
    ModelOption: (state) => {
      return state.stateModelOption
    },
    PsTypeOption: (state) => {
      return state.statePsTypeOption
    },
    CbmGroupOption: (state) => {
      return state.stateCbmGroupOption
    },
    DetailNumberOption: (state) => {
      return state.stateDetailNumberOption
    },
    MaxValueOption: (state) => {
      return state.stateMaxValueOption
    },
    MinValueOption: (state) => {
      return state.stateMinValueOption
    },
    ParameterOption: (state) => {
      return state.stateParameterOption
    },
    ParameterTypeOption: (state) => {
      return state.stateTypeParameterOption
    },
    StatusOption: (state) => {
      return state.stateStatusOption
    },
    StatusDescriptionOption: (state) => {
      return state.stateStatusDescriptionOption
    },
    TaskNumberOption: (state) => {
      return state.stateTaskNumberOption
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const payload = {
        ComponentId: this.stateFilterData.ComponentId,
        CbmGroup: this.stateFilterData.CbmGroup,
        CbmArea: this.stateFilterData.CbmArea,
        CbmParameterId: this.stateFilterData.CbmParameterId,
        ModelId: this.stateFilterData.ModelId,
        PsTypeId: this.stateFilterData.PsTypeId,
        TaskNumber: this.stateFilterData.TaskNumber,
        DetailNumber: this.stateFilterData.DetailNumber,
        CbmParameter: this.stateFilterData.CbmParameter,
        Parameter: this.stateFilterData.Parameter,
        MinValue: this.stateFilterData.MinValue,
        MaxValue: this.stateFilterData.MaxValue,
        Uom: this.stateFilterData.Uom,
        StatusConverter: this.stateFilterData.StatusConverter,
        StatusDescriptionConverter: this.stateFilterData.StatusDescriptionConverter,
        Status: this.stateFilterData.Status,
        StatusDescription: this.stateFilterData.StatusDescription,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate.toLocaleString()) : "",
        ComponentIdTo: this.stateFilterData.ComponentIdTo,
        CbmGroupTo: this.stateFilterData.CbmGroupTo,
        CbmAreaTo: this.stateFilterData.CbmAreaTo,
        CbmParameterIdTo: this.stateFilterData.CbmParameterIdTo,
        ModelIdTo: this.stateFilterData.ModelIdTo,
        PsTypeIdTo: this.stateFilterData.PsTypeIdTo,
        TaskNumberTo: this.stateFilterData.TaskNumberTo,
        DetailNumberTo: this.stateFilterData.DetailNumberTo,
        CbmParameterTo: this.stateFilterData.CbmParameterTo,
        ParameterTo: this.stateFilterData.ParameterTo,
        MinValueTo: this.stateFilterData.MinValueTo,
        MaxValueTo: this.stateFilterData.MaxValueTo,
        UomTo: this.stateFilterData.UomTo,
        StatusConverterTo: this.stateFilterData.StatusConverterTo,
        StatusDescriptionConverterTo: this.stateFilterData.StatusDescriptionConverterTo,
        StatusTo: this.stateFilterData.StatusTo,
        StatusDescriptionTo: this.stateFilterData.StatusDescriptionTo,
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(this.stateFilterData.StartDateTo.toLocaleString()) : "",
        EndDateTo: this.stateFilterData.EndDateTo ? formatDateForPostData(this.stateFilterData.EndDateTo.toLocaleString()) : "",
        TypeParameterId: this.getNameTypeParameter(this.stateFilterData.TypeParameterId),
        TypeParameterIdTo: this.getNameTypeParameter(this.stateFilterData.TypeParameterIdTo),
        Page: this.stateFilterData.Page.toString(),
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
        ver: this.stateFilterData.ver
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_URL, "", new URLSearchParams(payload).toString());
        this.stateDisplayData = response.data.result.content;
        this.setTotalPage(response.data.result.total || response.data.result["totalData"]);
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
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.get(`${LOOKUP_API_URL}?${new URLSearchParams(params).toString()}`);
        this.stateDetailNumberOption = mapOption(response.data.result.content.detailNumber)
        this.stateMaxValueOption = mapOption(response.data.result.content.maxValue)
        this.stateMinValueOption = mapOption(response.data.result.content.minValue)
        this.stateStatusOption = mapOption(response.data.result.content.status)
        this.stateStatusDescriptionOption = mapOption(response.data.result.content.statusDescription)
        this.stateTaskNumberOption = mapOption(response.data.result.content.taskNumber)
        this.stateCbmParameterIDOption = mapOption(response.data.result.content.cbmParameterId)
        this.stateParameterOption = mapOption(response.data.result.content.parameter)
      } catch (error) {
        console.log(error);
      }
    },
    async getParameterLookUp() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_PARAMETER_API_URL}?${new URLSearchParams(params).toString()}`);
        this.stateTypeParameterOption = mapOptionFromLookupApi(response.data.result.content, "listIdParameter", "listParameter")
      } catch (error) {
        console.log(error)
      }
    },
    async getComponentLookUp() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${COMPONENT_LOOKUP_API_URL}?${new URLSearchParams(params).toString()}`);
        this.stateComponentOption = mapOptionFromLookupApi(response.data.result.content, "component", "componentDescription")
      } catch (error) {
        console.log(error)
      }
    },
    async getModelLookUp() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${MODEL_LOOKUP_API_URL}?${new URLSearchParams(params).toString()}`);
        this.stateModelOption = mapOptionFromLookupApi(response.data.result.content, "equipmentModel", "equipmentModelDescription")
      } catch (error) {
        console.log(error)
      }
    },
    async getPsTypeLookUp() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_PS_TYPE_API_URL}?${new URLSearchParams(params).toString()}`);
        this.statePsTypeOption = mapOption(response.data.result.content.psType)
      } catch (error) {
        console.log(error)
      }
    },
    async getUomLookUp() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_UOM_URL}?${new URLSearchParams(params).toString()}`);
        this.stateUomOption = mapOption(response.data.result.content.uom)
      } catch (error) {
        console.log(error)
      }
    },
    async getAreaCbmLookUp() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_AREA_CBM_URL}?${new URLSearchParams(params).toString()}`);
        this.stateAreaCbmOption = mapOption(response.data.result.content.areaCbm)
      } catch (error) {
        console.log(error)
      }
    },
    async getStatusConverterLookUp() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_STATUS_CONVERTER_URL}?${new URLSearchParams(params).toString()}`);
        this.stateStatusConverterOption = mapOption(response.data.result.content.statusConverter)
        this.stateStatusConverterDescriptionOption = mapOption(response.data.result.content.statusConverterDescription)
      } catch (error) {
        console.log(error)
      }
    },
    async getCbmParameterLookUp() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_CBM_PARAMETER_URL}?${new URLSearchParams(params).toString()}`);
        this.stateCbmParameterOption = mapOption(response.data.result.content.cbmParameter)
      } catch (error) {
        console.log(error)
      }
    },
    async getCbmGroupLookUp() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_CBM_GROUP_URL}?${new URLSearchParams(params).toString()}`);
        this.stateCbmGroupOption = mapOption(response.data.result.content.cbmGroup)
      } catch (error) {
        console.log(error)
      }
    },
    getNameTypeParameter(typeParameter) {
      const findObject = this.ParameterTypeOption.find((val) => {
        return val["value"] == typeParameter
      })
      if (findObject) {
        return findObject.label.split("|")[1].trim()
      }
      return ""
    },
    async export() {
      const params = {
        ComponentId: this.stateFilterData.ComponentId,
        CbmGroup: this.stateFilterData.CbmGroup,
        CbmArea: this.stateFilterData.CbmArea,
        CbmParameterId: this.stateFilterData.CbmParameterId,
        ModelId: this.stateFilterData.ModelId,
        PsTypeId: this.stateFilterData.PsTypeId,
        TaskNumber: this.stateFilterData.TaskNumber,
        DetailNumber: this.stateFilterData.DetailNumber,
        CbmParameter: this.stateFilterData.CbmParameter,
        Parameter: this.stateFilterData.Parameter,
        MinValue: this.stateFilterData.MinValue,
        MaxValue: this.stateFilterData.MaxValue,
        Uom: this.stateFilterData.Uom,
        StatusConverter: this.stateFilterData.StatusConverter,
        StatusDescriptionConverter: this.stateFilterData.StatusDescriptionConverter,
        Status: this.stateFilterData.Status,
        StatusDescription: this.stateFilterData.StatusDescription,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate.toLocaleString()) : "",
        ComponentIdTo: this.stateFilterData.ComponentIdTo,
        CbmGroupTo: this.stateFilterData.CbmGroupTo,
        CbmAreaTo: this.stateFilterData.CbmAreaTo,
        CbmParameterIdTo: this.stateFilterData.CbmParameterIdTo,
        ModelIdTo: this.stateFilterData.ModelIdTo,
        PsTypeIdTo: this.stateFilterData.PsTypeIdTo,
        TaskNumberTo: this.stateFilterData.TaskNumberTo,
        DetailNumberTo: this.stateFilterData.DetailNumberTo,
        CbmParameterTo: this.stateFilterData.CbmParameterTo,
        ParameterTo: this.stateFilterData.ParameterTo,
        MinValueTo: this.stateFilterData.MinValueTo,
        MaxValueTo: this.stateFilterData.MaxValueTo,
        UomTo: this.stateFilterData.UomTo,
        StatusConverterTo: this.stateFilterData.StatusConverterTo,
        StatusDescriptionConverterTo: this.stateFilterData.StatusDescriptionConverterTo,
        StatusTo: this.stateFilterData.StatusTo,
        StatusDescriptionTo: this.stateFilterData.StatusDescriptionTo,
        StartDateTo: this.stateFilterData.StartDateTo ? formatDateForPostData(this.stateFilterData.StartDateTo.toLocaleString()) : "",
        EndDateTo: this.stateFilterData.EndDateTo ? formatDateForPostData(this.stateFilterData.EndDateTo.toLocaleString()) : "",
        TypeParameterId: this.getNameTypeParameter(this.stateFilterData.TypeParameterId),
        TypeParameterIdTo: this.getNameTypeParameter(this.stateFilterData.TypeParameterIdTo),
        Gmt: new Date().toTimeString().slice(12, 17),
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.getBlob(`${EXPORT_API_URL}?${new URLSearchParams(params).toString()}`);
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
    setComponentId(value: string) {
      this.stateFilterData.ComponentId = value
    },
    setCbmGroup(value: string) {
      this.stateFilterData.CbmGroup = value
    },
    setCbmArea(value: string) {
      this.stateFilterData.CbmArea = value
    },
    setCbmParameterId(value: string) {
      this.stateFilterData.CbmParameterId = value
    },
    setModelId(value: string) {
      this.stateFilterData.ModelId = value
    },
    setPsTypeId(value: string) {
      this.stateFilterData.PsTypeId = value
    },
    setTaskNumber(value: string) {
      this.stateFilterData.TaskNumber = value
    },
    setDetailNumber(value: string) {
      this.stateFilterData.DetailNumber = value
    },
    setCbmParameter(value: string) {
      this.stateFilterData.CbmParameter = value
    },
    setParameter(value: string) {
      this.stateFilterData.Parameter = value
    },
    setTypeParameter(value: string) {
      this.stateFilterData.TypeParameterId = value
    },
    setMinValue(value: string) {
      this.stateFilterData.MinValue = value
    },
    setMaxValue(value: string) {
      this.stateFilterData.MaxValue = value
    },
    setUom(value: string) {
      this.stateFilterData.Uom = value
    },
    setStatusConverter(value: string) {
      this.stateFilterData.StatusConverter = value
    },
    setStatusDescriptionConverter(value: string) {
      this.stateFilterData.StatusDescriptionConverter = value
    },
    setStatus(value: string) {
      this.stateFilterData.Status = value
    },
    setStatusDescription(value: string) {
      this.stateFilterData.StatusDescription = value
    },
    setStartDate(value: string) {
      this.stateFilterData.StartDate = value
    },
    setEndDate(value: string) {
      this.stateFilterData.EndDate = value
    },
    setComponentIdTo(value: string) {
      this.stateFilterData.ComponentIdTo = value
    },
    setCbmGroupTo(value: string) {
      this.stateFilterData.CbmGroupTo = value
    },
    setCbmAreaTo(value: string) {
      this.stateFilterData.CbmAreaTo = value
    },
    setCbmParameterIdTo(value: string) {
      this.stateFilterData.CbmParameterIdTo = value
    },
    setModelIdTo(value: string) {
      this.stateFilterData.ModelIdTo = value
    },
    setPsTypeIdTo(value: string) {
      this.stateFilterData.PsTypeIdTo = value
    },
    setTaskNumberTo(value: string) {
      this.stateFilterData.TaskNumberTo = value
    },
    setDetailNumberTo(value: string) {
      this.stateFilterData.DetailNumberTo = value
    },
    setCbmParameterTo(value: string) {
      this.stateFilterData.CbmParameterTo = value
    },
    setParameterTo(value: string) {
      this.stateFilterData.ParameterTo = value
    },
    setTypeParameterTo(value: string) {
      this.stateFilterData.TypeParameterIdTo = value
    },
    setMinValueTo(value: string) {
      this.stateFilterData.MinValueTo = value
    },
    setMaxValueTo(value: string) {
      this.stateFilterData.MaxValueTo = value
    },
    setUomTo(value: string) {
      this.stateFilterData.UomTo = value
    },
    setStatusConverterTo(value: string) {
      this.stateFilterData.StatusConverterTo = value
    },
    setStatusDescriptionConverterTo(value: string) {
      this.stateFilterData.StatusDescriptionConverterTo = value
    },
    setStatusTo(value: string) {
      this.stateFilterData.StatusTo = value
    },
    setStatusDescriptionTo(value: string) {
      this.stateFilterData.StatusDescriptionTo = value
    },
    setStartDateTo(value: string) {
      this.stateFilterData.StartDateTo = value
    },
    setEndDateTo(value: string) {
      this.stateFilterData.EndDateTo = value
    },
    async resetFilter() {
      this.stateFilterData.ComponentId = ""
      this.stateFilterData.CbmGroup = ""
      this.stateFilterData.CbmArea = ""
      this.stateFilterData.CbmParameterId = ""
      this.stateFilterData.ModelId = ""
      this.stateFilterData.PsTypeId = ""
      this.stateFilterData.TaskNumber = ""
      this.stateFilterData.DetailNumber = ""
      this.stateFilterData.CbmParameter = ""
      this.stateFilterData.Parameter = ""
      this.stateFilterData.MinValue = ""
      this.stateFilterData.MaxValue = ""
      this.stateFilterData.Uom = ""
      this.stateFilterData.StatusConverter = ""
      this.stateFilterData.StatusDescriptionConverter = ""
      this.stateFilterData.Status = ""
      this.stateFilterData.StatusDescription = ""
      this.stateFilterData.StartDate = ""
      this.stateFilterData.EndDate = ""
      this.stateFilterData.TypeParameterId = ""

      this.stateFilterData.ComponentIdTo = ""
      this.stateFilterData.CbmGroupTo = ""
      this.stateFilterData.CbmAreaTo = ""
      this.stateFilterData.CbmParameterIdTo = ""
      this.stateFilterData.ModelIdTo = ""
      this.stateFilterData.PsTypeIdTo = ""
      this.stateFilterData.TaskNumberTo = ""
      this.stateFilterData.DetailNumberTo = ""
      this.stateFilterData.CbmParameterTo = ""
      this.stateFilterData.ParameterTo = ""
      this.stateFilterData.MinValueTo = ""
      this.stateFilterData.MaxValueTo = ""
      this.stateFilterData.UomTo = ""
      this.stateFilterData.StatusConverterTo = ""
      this.stateFilterData.StatusDescriptionConverterTo = ""
      this.stateFilterData.StatusTo = ""
      this.stateFilterData.StatusDescriptionTo = ""
      this.stateFilterData.StartDateTo = ""
      this.stateFilterData.EndDateTo = ""
      this.stateFilterData.TypeParameterIdTo = ""

      const CheckComponentId = this.stateLastUsedFilterData.ComponentId !== ""
      const CheckCbmGroup = this.stateLastUsedFilterData.CbmGroup !== ""
      const CheckCbmArea = this.stateLastUsedFilterData.CbmArea !== ""
      const CheckCbmParameterId = this.stateLastUsedFilterData.CbmParameterId !== ""
      const CheckModelId = this.stateLastUsedFilterData.ModelId !== ""
      const CheckPsTypeId = this.stateLastUsedFilterData.PsTypeId !== ""
      const CheckTaskNumber = this.stateLastUsedFilterData.TaskNumber !== ""
      const CheckDetailNumber = this.stateLastUsedFilterData.DetailNumber !== ""
      const CheckCbmParameter = this.stateLastUsedFilterData.CbmParameter !== ""
      const CheckParameter = this.stateLastUsedFilterData.Parameter !== ""
      const CheckParameterType = this.stateLastUsedFilterData.TypeParameterId !== ""
      const CheckMinValue = this.stateLastUsedFilterData.MinValue !== ""
      const CheckMaxValue = this.stateLastUsedFilterData.MaxValue !== ""
      const CheckUom = this.stateLastUsedFilterData.Uom !== ""
      const CheckStatusConverter = this.stateLastUsedFilterData.StatusConverter !== ""
      const CheckStatusDescriptionConverter = this.stateLastUsedFilterData.StatusDescriptionConverter !== ""
      const CheckStatus = this.stateLastUsedFilterData.Status !== ""
      const CheckStatusDescription = this.stateLastUsedFilterData.StatusDescription !== ""
      const CheckStartDate = this.stateLastUsedFilterData.StartDate !== ""
      const CheckEndDate = this.stateLastUsedFilterData.EndDate !== ""

      const CheckComponentIdTo = this.stateLastUsedFilterData.ComponentIdTo !== ""
      const CheckCbmGroupTo = this.stateLastUsedFilterData.CbmGroupTo !== ""
      const CheckCbmAreaTo = this.stateLastUsedFilterData.CbmAreaTo !== ""
      const CheckCbmParameterIdTo = this.stateLastUsedFilterData.CbmParameterIdTo !== ""
      const CheckModelIdTo = this.stateLastUsedFilterData.ModelIdTo !== ""
      const CheckPsTypeIdTo = this.stateLastUsedFilterData.PsTypeIdTo !== ""
      const CheckTaskNumberTo = this.stateLastUsedFilterData.TaskNumberTo !== ""
      const CheckDetailNumberTo = this.stateLastUsedFilterData.DetailNumberTo !== ""
      const CheckCbmParameterTo = this.stateLastUsedFilterData.CbmParameterTo !== ""
      const CheckParameterTo = this.stateLastUsedFilterData.ParameterTo !== ""
      const CheckParameterTypeTo = this.stateLastUsedFilterData.TypeParameterIdTo !== ""
      const CheckMinValueTo = this.stateLastUsedFilterData.MinValueTo !== ""
      const CheckMaxValueTo = this.stateLastUsedFilterData.MaxValueTo !== ""
      const CheckUomTo = this.stateLastUsedFilterData.UomTo !== ""
      const CheckStatusConverterTo = this.stateLastUsedFilterData.StatusConverterTo !== ""
      const CheckStatusDescriptionConverterTo = this.stateLastUsedFilterData.StatusDescriptionConverterTo !== ""
      const CheckStatusTo = this.stateLastUsedFilterData.StatusTo !== ""
      const CheckStatusDescriptionTo = this.stateLastUsedFilterData.StatusDescriptionTo !== ""
      const CheckStartDateTo = this.stateLastUsedFilterData.StartDateTo !== ""
      const CheckEndDateTo = this.stateLastUsedFilterData.EndDateTo !== ""

      if (CheckComponentId || CheckCbmGroup || CheckCbmArea || CheckCbmParameterId || CheckModelId || CheckPsTypeId || CheckTaskNumber || CheckDetailNumber || CheckCbmParameter || CheckParameter || CheckMinValue || CheckMaxValue || CheckUom || CheckStatusConverter || CheckStatusDescriptionConverter || CheckStatus || CheckStatusDescription || CheckStartDate || CheckEndDate || CheckParameterType || CheckComponentIdTo || CheckCbmGroupTo || CheckCbmAreaTo || CheckCbmParameterIdTo || CheckModelIdTo || CheckPsTypeIdTo || CheckTaskNumberTo || CheckDetailNumberTo || CheckCbmParameterTo || CheckParameterTo || CheckParameterTypeTo || CheckMinValueTo || CheckMaxValueTo || CheckUomTo || CheckStatusConverterTo || CheckStatusDescriptionConverterTo || CheckStatusTo || CheckStatusDescriptionTo || CheckStartDateTo || CheckEndDateTo) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        ComponentId: "",
        CbmGroup: "",
        CbmArea: "",
        CbmParameterId: "",
        ModelId: "",
        PsTypeId: "",
        TaskNumber: "",
        DetailNumber: "",
        CbmParameter: "",
        Parameter: "",
        TypeParameterId: "",
        MinValue: "",
        MaxValue: "",
        Uom: "",
        StatusConverter: "",
        StatusDescriptionConverter: "",
        Status: "",
        StatusDescription: "",
        StartDate: "",
        EndDate: "",
        ComponentIdTo: "",
        CbmGroupTo: "",
        CbmAreaTo: "",
        CbmParameterIdTo: "",
        ModelIdTo: "",
        PsTypeIdTo: "",
        TaskNumberTo: "",
        DetailNumberTo: "",
        CbmParameterTo: "",
        ParameterTo: "",
        TypeParameterIdTo: "",
        MinValueTo: "",
        MaxValueTo: "",
        UomTo: "",
        StatusConverterTo: "",
        StatusDescriptionConverterTo: "",
        StatusTo: "",
        StatusDescriptionTo: "",
        StartDateTo: "",
        EndDateTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1"
      } as FilterData;
      this.stateDisplayData = [] as ListItem[];
      this.statePagination = new PaginationType();
      this.stateLoading = false;
      this.statePaginationLoading = false;
    }
  }
});
