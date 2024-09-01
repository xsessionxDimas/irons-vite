/* eslint-disable @typescript-eslint/no-explicit-any */
import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL, LOOKUP_API_URL, EXPORT_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/recommended-action/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/recommended-action/FilterData";
import {
  LookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/recommended-action/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  mapOptionWithThreeLabelFromLookupApi,
  mapOption,
  mapOptionFromLookupApi,
} from "@/core/helpers/mapOption";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialFilter = {
  equipmentModel: "",
  equipmentModelTo: "",
  component: "",
  componentTo: "",
  parameterTo: "",
  parameterToTo: "",
  interventionCode: "",
  interventionCodeTo: "",
  recAction: "",
  recActionTo: "",
  sampleStatus: "",
  sampleStatusTo: "",
  sequence: "",
  sequenceTo: "",
  subTask: "",
  subTaskTo: "",
  isUom: "",
  isUomTo: "",
  referenceDocument: "",
  referenceDocumentTo: "",
  isAutoFill: "",
  isAutoFillTo: "",
  psType: "",
  psTypeTo: "",
  taskGroupKey: "",
  taskGroupKeyTo: "",
  taskKey: "",
  taskKeyTo: "",
  typeTask: "",
  typeTaskTo: "",
  uom: "",
  uomTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  ver: "v1",
  page: 1,
  pageSize: 10,
  order: ""
};

export const useRecommendedActionListStore = defineStore({
  id: "recommendedActionList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "recommendedAction",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateInterventionCodeOption: [] as Option[],
      stateEquipmentModelOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateInterventionReasonOption: [] as Option[],
      stateReActionOption: [] as Option[],
      stateSampleStatusOption: [] as Option[],
      stateSequenceOption: [] as Option[],
      stateSubtaskOption: [] as Option[],
      stateIsUomOption: [] as Option[],
      stateUomOption: [] as Option[],
      stateReferenceDocumentOption: [] as Option[],
      stateTypeTaskOption: [] as Option[],
      stateAutoFillOption: [] as Option[],
      statePsTypeOption: [] as Option[],
      stateTaskGroupKeyOption: [] as Option[],
      stateTaskKeyOption: [] as Option[],
      stateParameterToOption: [] as Option[],
      stateOptionTrueFalse: [{
        value: "",
        label: "All",
      },
      {
        value: "true",
        label: "True",
      },
      {
        value: "false",
        label: "False",
      }]
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
    interventionCodeOption: (state) => {
      return state.stateInterventionCodeOption;
    },
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    interventionReasonOption: (state) => {
      return state.stateInterventionReasonOption;
    },
    reActionOption: (state) => {
      return state.stateReActionOption;
    },
    sampleStatusOption: (state) => {
      return state.stateSampleStatusOption;
    },
    sequenceOption: (state) => {
      return state.stateSequenceOption;
    },
    subtaskOption: (state) => {
      return state.stateSubtaskOption;
    },
    isUomOption: (state) => {
      return state.stateIsUomOption;
    },
    uomOption: (state) => {
      return state.stateUomOption;
    },
    referenceDocumentOption: (state) => {
      return state.stateReferenceDocumentOption;
    },
    typeTaskOption: (state) => {
      return state.stateTypeTaskOption;
    },
    autoFillOption: (state) => {
      return state.stateAutoFillOption;
    },
    psTypeOption: (state) => {
      return state.statePsTypeOption;
    },
    taskGroupKeyOption: (state) => {
      return state.stateTaskGroupKeyOption;
    },
    taskKeyOption: (state) => {
      return state.stateTaskKeyOption;
    },
    parameterToOption: (state) => {
      return state.stateParameterToOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        interventionCode: this.stateFilterData.interventionCode,
        interventionCodeTo: this.stateFilterData.interventionCodeTo,
        equipmentModel: this.stateFilterData.equipmentModel,
        equipmentModelTo: this.stateFilterData.equipmentModelTo,
        component: this.stateFilterData.component,
        componentTo: this.stateFilterData.componentTo,
        recAction: this.stateFilterData.recAction,
        recActionTo: this.stateFilterData.recActionTo,
        sampleStatus: this.stateFilterData.sampleStatus,
        sampleStatusTo: this.stateFilterData.sampleStatusTo,
        sequence: this.stateFilterData.sequence,
        sequenceTo: this.stateFilterData.sequenceTo,
        subTask: this.stateFilterData.subTask,
        subTaskTo: this.stateFilterData.subTaskTo,
        isUom: this.stateFilterData.isUom,
        isAutoFill: this.stateFilterData.isAutoFill,
        uom: this.stateFilterData.uom,
        uomTo: this.stateFilterData.uomTo,
        referenceDocument: this.stateFilterData.referenceDocument,
        referenceDocumentTo: this.stateFilterData.referenceDocumentTo,
        typeTask: this.stateFilterData.typeTask,
        typeTaskTo: this.stateFilterData.typeTaskTo,
        psType: this.stateFilterData.psType,
        psTypeTo: this.stateFilterData.psTypeTo,
        taskGroupKey: this.stateFilterData.taskGroupKey,
        taskGroupKeyTo: this.stateFilterData.taskGroupKeyTo,
        taskKey: this.stateFilterData.taskKey,
        taskKeyTo: this.stateFilterData.taskKeyTo,
        parameterTo: this.stateFilterData.parameterTo,
        parameterToTo: this.stateFilterData.parameterToTo,
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
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_API_URL, "recommended_action", new URLSearchParams(params).toString());
        this.stateDisplayData = response.data.result.content;
        this.setTotalPage(response.data.result.total);
        this.stateLastUsedFilterData = {
          ...this.stateFilterData
        } as FilterData
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
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
        this.stateEquipmentModelOption = mapOptionWithThreeLabelFromLookupApi(response.data.result.content.equipmentModel, "equipmentModel", "brand", "equipmentModelDescription");
        this.stateInterventionCodeOption = mapOption(response.data.result.content.interventionCode);
        this.stateComponentOption = mapOptionFromLookupApi(response.data.result.content.component, "component", "componentDescription");
        this.stateReActionOption = mapOption(response.data.result.content.recAction);
        this.stateSampleStatusOption = mapOptionFromLookupApi(response.data.result.content.sampleStatus, "ratingDescription", [
          "rating",
          "ratingDescription"
        ], false);
        this.stateSequenceOption = mapOption(response.data.result.content.sequence);
        this.stateSubtaskOption = mapOption(response.data.result.content.subTask);
        this.stateTypeTaskOption = mapOption(response.data.result.content.typeTask);
        this.stateIsUomOption = this.stateOptionTrueFalse;
        this.stateAutoFillOption = this.stateOptionTrueFalse;
        this.statePsTypeOption = mapOption(response.data.result.content.psType);
        this.stateTaskGroupKeyOption = mapOption(response.data.result.content.taskGroupKey);
        this.stateTaskKeyOption = mapOption(response.data.result.content.taskKey);
        this.stateParameterToOption = mapOption(response.data.result.content.parameterTo);
        this.stateUomOption = mapOption(response.data.result.content.uom);
        this.stateReferenceDocumentOption = mapOption(response.data.result.content.referenceDocument);
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
        interventionCode: this.stateFilterData.interventionCode,
        interventionCodeTo: this.stateFilterData.interventionCodeTo,
        equipmentModel: this.stateFilterData.equipmentModel,
        equipmentModelTo: this.stateFilterData.equipmentModelTo,
        component: this.stateFilterData.component,
        componentTo: this.stateFilterData.componentTo,
        recAction: this.stateFilterData.recAction,
        recActionTo: this.stateFilterData.recActionTo,
        sampleStatus: this.stateFilterData.sampleStatus,
        sampleStatusTo: this.stateFilterData.sampleStatusTo,
        sequence: this.stateFilterData.sequence,
        sequenceTo: this.stateFilterData.sequenceTo,
        subTask: this.stateFilterData.subTask,
        subTaskTo: this.stateFilterData.subTaskTo,
        isUom: this.stateFilterData.isUom,
        isAutoFill: this.stateFilterData.isAutoFill,
        uom: this.stateFilterData.uom,
        uomTo: this.stateFilterData.uomTo,
        referenceDocument: this.stateFilterData.referenceDocument,
        referenceDocumentTo: this.stateFilterData.referenceDocumentTo,
        typeTask: this.stateFilterData.typeTask,
        typeTaskTo: this.stateFilterData.typeTaskTo,
        psType: this.stateFilterData.psType,
        psTypeTo: this.stateFilterData.psTypeTo,
        taskGroupKey: this.stateFilterData.taskGroupKey,
        taskGroupKeyTo: this.stateFilterData.taskGroupKeyTo,
        taskKey: this.stateFilterData.taskKey,
        taskKeyTo: this.stateFilterData.taskKeyTo,
        parameterTo: this.stateFilterData.parameterTo,
        parameterToTo: this.stateFilterData.parameterToTo,
        startDate: this.stateFilterData.startDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDate))) : "",
        startDateTo: this.stateFilterData.startDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDateTo))) : "",
        endDate: this.stateFilterData.endDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDate))) : "",
        endDateTo: this.stateFilterData.endDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDateTo))) : "",
        order: this.stateFilterData.order,
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
      await this.getData(false);
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
    setInterventionCode(value: string) {
      this.stateFilterData.interventionCode = value;
    },
    setInterventionCodeTo(value: string) {
      this.stateFilterData.interventionCodeTo = value;
    },
    setEquipmentModel(value: string) {
      this.stateFilterData.equipmentModel = value;
    },
    setEquipmentModelTo(value: string) {
      this.stateFilterData.equipmentModelTo = value;
    },
    setComponent(value: string) {
      this.stateFilterData.component = value;
    },
    setComponentTo(value: string) {
      this.stateFilterData.componentTo = value;
    },
    setReAction(value: string) {
      this.stateFilterData.recAction = value;
    },
    setReActionTo(value: string) {
      this.stateFilterData.recActionTo = value;
    },
    setSampleStatus(value: string) {
      this.stateFilterData.sampleStatus = value;
    },
    setSampleStatusTo(value: string) {
      this.stateFilterData.sampleStatusTo = value;
    },
    setSequence(value: string) {
      this.stateFilterData.sequence = value;
    },
    setSequenceTo(value: string) {
      this.stateFilterData.sequenceTo = value;
    },
    setSubtask(value: string) {
      this.stateFilterData.subTask = value;
    },
    setSubtaskTo(value: string) {
      this.stateFilterData.subTaskTo = value;
    },
    setUom(value: any) {
      this.stateFilterData.uom = value;
    },
    setUomTo(value: any) {
      this.stateFilterData.uomTo = value;
    },
    setReferenceDocument(value: any) {
      this.stateFilterData.referenceDocument = value;
    },
    setReferenceDocumentTo(value: any) {
      this.stateFilterData.referenceDocumentTo = value;
    },
    setIsUom(value: any) {
      this.stateFilterData.isUom = value;
    },
    setAutoFill(value: any) {
      this.stateFilterData.isAutoFill = value;
    },
    setTypeTask(value: string) {
      this.stateFilterData.typeTask = value;
    },
    setTypeTaskTo(value: string) {
      this.stateFilterData.typeTaskTo = value;
    },
    setPsType(value: string) {
      this.stateFilterData.psType = value;
    },
    setPsTypeTo(value: string) {
      this.stateFilterData.psTypeTo = value;
    },
    setTaskGroupKey(value: string) {
      this.stateFilterData.taskGroupKey = value;
    },
    setTaskGroupKeyTo(value: string) {
      this.stateFilterData.taskGroupKeyTo = value;
    },
    setTaskKey(value: string) {
      this.stateFilterData.taskKey = value;
    },
    setTaskKeyTo(value: string) {
      this.stateFilterData.taskKeyTo = value;
    },
    setParameterTo(value: string) {
      this.stateFilterData.parameterTo = value;
    },
    setParameterToTo(value: string) {
      this.stateFilterData.parameterToTo = value;
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
      this.stateFilterData.interventionCode = "";
      this.stateFilterData.interventionCodeTo = "";
      this.stateFilterData.equipmentModel = "";
      this.stateFilterData.equipmentModelTo = "";
      this.stateFilterData.component = "";
      this.stateFilterData.componentTo = "";
      this.stateFilterData.recAction = "";
      this.stateFilterData.recActionTo = "";
      this.stateFilterData.sampleStatus = "";
      this.stateFilterData.sampleStatusTo = "";
      this.stateFilterData.sequence = "";
      this.stateFilterData.sequenceTo = "";
      this.stateFilterData.subTask = "";
      this.stateFilterData.subTaskTo = "";
      this.stateFilterData.isUom = "";
      this.stateFilterData.isAutoFill = "";
      this.stateFilterData.typeTask = "";
      this.stateFilterData.typeTaskTo = "";
      this.stateFilterData.psType = "",
      this.stateFilterData.psTypeTo = "",
      this.stateFilterData.taskGroupKey = "",
      this.stateFilterData.taskGroupKeyTo = "",
      this.stateFilterData.taskKey = "",
      this.stateFilterData.taskKeyTo = "",
      this.stateFilterData.uom = "",
      this.stateFilterData.uomTo = "",
      this.stateFilterData.parameterTo = "",
      this.stateFilterData.parameterToTo = "",
      this.stateFilterData.startDate = "";
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.endDateTo = "";
      const checkInterventionCode = this.stateLastUsedFilterData.interventionCode !== "";
      const checkInterventionCodeTo = this.stateLastUsedFilterData.interventionCodeTo !== "";
      const checkEquipmentModel = this.stateLastUsedFilterData.equipmentModel !== "";
      const checkEquipmentModelTo = this.stateLastUsedFilterData.equipmentModelTo !== "";
      const checkComponent = this.stateLastUsedFilterData.component !== "";
      const checkComponentTo = this.stateLastUsedFilterData.componentTo !== "";
      const checkReAction = this.stateLastUsedFilterData.recAction !== "";
      const checkReActionTo = this.stateLastUsedFilterData.recActionTo !== "";
      const checkSampleStatus = this.stateLastUsedFilterData.sampleStatus !== "";
      const checkSampleStatusTo = this.stateLastUsedFilterData.sampleStatusTo !== "";
      const checkSequence = this.stateLastUsedFilterData.sequence !== "";
      const checkSequenceTo = this.stateLastUsedFilterData.sequenceTo !== "";
      const checkSubtask = this.stateLastUsedFilterData.subTask !== "";
      const checkSubtaskTo = this.stateLastUsedFilterData.subTaskTo !== "";
      const checkIsUom = this.stateLastUsedFilterData.isUom !== "";
      const checkTypeTask = this.stateLastUsedFilterData.typeTask !== "";
      const checkTypeTaskTo = this.stateLastUsedFilterData.typeTaskTo !== "";
      const checkPsType = this.stateLastUsedFilterData.psType !== "";
      const checkPsTypeTo = this.stateLastUsedFilterData.psTypeTo !== "";
      const checkTaskGroupKey = this.stateLastUsedFilterData.taskGroupKey !== "";
      const checkTaskGroupKeyTo = this.stateLastUsedFilterData.taskGroupKeyTo !== "";
      const checkTaskKey = this.stateLastUsedFilterData.taskKey !== "";
      const checkTaskKeyTo = this.stateLastUsedFilterData.taskKeyTo !== "";
      const checkParameterTo = this.stateLastUsedFilterData.parameterTo !== "";
      const checkParameterToTo = this.stateLastUsedFilterData.parameterToTo !== "";
      const checkUom = this.stateLastUsedFilterData.uom !== "";
      const checkUomToTo = this.stateLastUsedFilterData.uomTo !== "";
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDateTo !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDateTo !== "";
      const checkAutoFill = this.stateLastUsedFilterData.isAutoFill !== "";
      if (checkInterventionCode || checkInterventionCodeTo || checkEquipmentModel || checkEquipmentModelTo
          || checkComponent || checkComponentTo || checkReAction ||
          checkPsType || checkPsTypeTo || checkTaskGroupKey || checkUom || checkUomToTo ||
          checkTaskGroupKeyTo || checkTaskKey || checkTaskKeyTo || checkParameterTo || checkParameterToTo
          || checkReActionTo || checkSampleStatus || checkSampleStatusTo || checkSequence || checkSequenceTo || checkSubtask
          || checkSubtaskTo || checkIsUom || checkTypeTask || checkTypeTaskTo || checkStartDate
          || checkStartDateTo || checkEndDate || checkEndDateTo || checkAutoFill) {
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
