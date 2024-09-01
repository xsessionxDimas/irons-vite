import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  CRUD_API_URL,
  EXPORT_API_URL,
} from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/equipment-assignment/ListItem";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/equipment-assignment/FilterData";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  LOOKUP_API_URL as LOOKUP_EQUIPMENT_NUMBER_API_URL
} from "@/store/pinia/iron-lake/equipment/equipment-number/urls";
import {
  LOOKUP_API_URL as LOOKUP_OBJECT_TYPE_API_URL
} from "@/store/pinia/iron-lake/equipment/object-type/urls";
import {
  LOOKUP_API_URL as LOOKUP_PLANNER_GROUP_API_URL
} from "@/store/pinia/iron-lake/equipment/planner-group/urls";
import {
  LOOKUP_API_URL as LOOKUP_COST_CENTER_API_URL
} from "@/store/pinia/iron-lake/equipment/cost-center/urls";
import {
  LOOKUP_API_URL as LOOKUP_WBS_ELEMENT_API_URL
} from "@/store/pinia/iron-lake/equipment/wbs-element/urls";
import {
  LOOKUP_API_URL as LOOKUP_LEVEL_API_URL
} from "@/store/pinia/iron-lake/equipment/level/urls";
import {
  LOOKUP_API_URL as LOOKUP_EQUIPMENT_TYPE_API_URL
} from "@/store/pinia/iron-lake/equipment/equipment-type/urls";
import {
  LOOKUP_API_URL as LOOKUP_EQUIPMENT_GROUP_API_URL
} from "@/store/pinia/iron-lake/equipment/equipment-group/urls";
import {
  LookupItem as EquipmentModelLookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-model/LookupItem";
import {
  LOOKUP_API_URL as LOOKUP_EQUIPMENT_MODEL_API_URL
} from "@/store/pinia/iron-lake/equipment/equipment-model/urls";
import {
  LOOKUP_API_URL as LOOKUP_EQUIPMENT_STATUS_API_URL
} from "@/store/pinia/iron-lake/equipment/equipment-status/urls";
import {
  LOOKUP_API_URL as LOOKUP_SITE_API_URL
} from "@/store/pinia/iron-lake/business-partner/site/urls";
import {
  apiUrls as planningPlantURL
} from "@/store/pinia/iron-lake/business-partner/planning-plant/urls";
import {
  apiUrls as maintenancePlantURL
} from "@/store/pinia/iron-lake/business-partner/maintenance-plant/urls";
import {
  LOOKUP_API_URL as LOOKUP_MAINTENANCE_WORK_CENTER_URL
} from "@/store/pinia/iron-lake/equipment/maintenance-work-center/urls";
import {
  mapOption,
  mapOptionFromLookupApi,
  mapOptionWithThreeLabelFromLookupApi
} from "@/core/helpers/mapOption";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";

const initialFilter = {
  equipment: "",
  equipmentTo: "",
  objectType: "",
  objectTypeTo: "",
  plannerGroup: "",
  plannerGroupTo: "",
  maintenanceWorkCenter: "",
  maintenanceWorkCenterTo: "",
  costCenter: "",
  costCenterTo: "",
  wbsElement: "",
  wbsElementTo: "",
  level: "",
  levelTo: "",
  equipmentType: "",
  equipmentTypeTo: "",
  equipmentGroup: "",
  equipmentGroupTo: "",
  equipmentModel: "",
  equipmentModelTo: "",
  equipmentStatus: "",
  equipmentStatusTo: "",
  site: "",
  siteTo: "",
  planningPlant: "",
  planningPlantTo: "",
  maintenancePlant: "",
  maintenancePlantTo: "",
  startDate: "",
  startDateTo: "",
  endDate: "",
  endDateTo: "",
  page: 1,
  pageSize: 10,
  order: "",
  ver: "v1",
}

export const useEquipmentAssignmentListStore = defineStore({
  id: "equipmentAssignmentList",
  state: () => {
    return {
      stateFilterData: {
        ...initialFilter
      } as FilterData,
      stateLastUsedFilterData: {
        ...initialFilter
      } as FilterData,
      statePageName: "equipmentAssignment",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateEquipmentOption: [] as Option[],
      stateObjectTypeOption: [] as Option[],
      statePlannerGroupOption: [] as Option[],
      stateCostCenterOption: [] as Option[],
      stateWbsElementOption: [] as Option[],
      stateLevelOption: [] as Option[],
      stateEquipmentTypeOption: [] as Option[],
      stateEquipmentGroupOption: [] as Option[],
      stateEquipmentModelOption: [] as Option[],
      stateEquipmentStatusOption: [] as Option[],
      stateSiteOption: [] as Option[],
      statePlanningPlantOption: [] as Option[],
      stateMaintenancePlantOption: [] as Option[],
      stateMaintenanceWorkCenterOption: [] as Option[],
    };
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
      return state.stateLastUsedFilterData;
    },
    loading: (state) => {
      return state.stateLoading;
    },
    paginationLoading: (state) => {
      return state.statePaginationLoading;
    },
    equipmentOption: (state) => {
      return state.stateEquipmentOption;
    },
    objectTypeOption: (state) => {
      return state.stateObjectTypeOption;
    },
    plannerGroupOption: (state) => {
      return state.statePlannerGroupOption;
    },
    costCenterOption: (state) => {
      return state.stateCostCenterOption;
    },
    wbsElementOption: (state) => {
      return state.stateWbsElementOption;
    },
    levelOption: (state) => {
      return state.stateLevelOption;
    },
    equipmentTypeOption: (state) => {
      return state.stateEquipmentTypeOption;
    },
    equipmentGroupOption: (state) => {
      return state.stateEquipmentGroupOption;
    },
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
    equipmentStatusOption: (state) => {
      return state.stateEquipmentStatusOption;
    },
    siteOption: (state) => {
      return state.stateSiteOption;
    },
    planningPlantOption: (state) => {
      return state.statePlanningPlantOption;
    },
    maintenancePlantOption: (state) => {
      return state.stateMaintenancePlantOption;
    },
    maintenanceWorkCenterOption: (state) => {
      return state.stateMaintenanceWorkCenterOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        Equipment: this.stateFilterData.equipment,
        EquipmentTo: this.stateFilterData.equipmentTo,
        ObjectType: this.stateFilterData.objectType,
        ObjectTypeTo: this.stateFilterData.objectTypeTo,
        PlannerGroup: this.stateFilterData.plannerGroup,
        PlannerGroupTo: this.stateFilterData.plannerGroupTo,
        CostCenter: this.stateFilterData.costCenter,
        CostCenterTo: this.stateFilterData.costCenterTo,
        WbsElement: this.stateFilterData.wbsElement,
        WbsElementTo: this.stateFilterData.wbsElementTo,
        Level: this.stateFilterData.level,
        LevelTo: this.stateFilterData.levelTo,
        EquipmentType: this.stateFilterData.equipmentType,
        EquipmentTypeTo: this.stateFilterData.equipmentTypeTo,
        EquipmentGroup: this.stateFilterData.equipmentGroup,
        EquipmentGroupTo: this.stateFilterData.equipmentGroupTo,
        EquipmentModel: this.stateFilterData.equipmentModel,
        EquipmentModelTo: this.stateFilterData.equipmentModelTo,
        EquipmentStatus: this.stateFilterData.equipmentStatus,
        EquipmentStatusTo: this.stateFilterData.equipmentStatusTo,
        Site: this.stateFilterData.site,
        SiteTo: this.stateFilterData.siteTo,
        PlanningPlant: this.stateFilterData.planningPlant,
        PlanningPlantTo: this.stateFilterData.planningPlantTo,
        MaintenancePlant: this.stateFilterData.maintenancePlant,
        MaintenancePlantTo: this.stateFilterData.maintenancePlantTo,
        MaintenanceWorkCenter: this.stateFilterData.maintenanceWorkCenter,
        MaintenanceWorkCenterTo: this.stateFilterData.maintenanceWorkCenterTo,
        StartDate: this.stateFilterData.startDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDate))) : "",
        StartDateTo: this.stateFilterData.startDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDateTo))) : "",
        EndDate: this.stateFilterData.endDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDate))) : "",
        EndDateTo: this.stateFilterData.endDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDateTo))) : "",
        Page: this.stateFilterData.page.toString(),
        PageSize: this.stateFilterData.pageSize.toString(),
        Order: this.stateFilterData.order,
        ver: this.stateFilterData.ver,
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]];
        const response: AxiosResponse<ApiResponse<ListItem>> =
          await ApiService.get(
            CRUD_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateDisplayData = response.data.result.content;
        this.setTotalPage(response.data.result.total);
        this.stateLastUsedFilterData = {
          ...this.stateFilterData,
        } as FilterData;
      } catch (error) {
        console.log(error);
      }
      this.stateLoading = false;
    },
    async getLookupEquipment() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_EQUIPMENT_NUMBER_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateEquipmentOption = mapOptionFromLookupApi(response.data.result.content, "equipmentNumber", "equipmentNumberDescription")
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupMaintenanceWorkCenter() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_MAINTENANCE_WORK_CENTER_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateMaintenanceWorkCenterOption = mapOptionFromLookupApi(response.data.result.content, "maintenanceWorkCenter", "maintenanceWorkCenterDescription")
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupObjectType() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_OBJECT_TYPE_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateObjectTypeOption = mapOptionFromLookupApi(response.data.result.content, "objectType", "objectTypeDescription")
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupPlannerGroup() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_PLANNER_GROUP_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.statePlannerGroupOption = mapOptionFromLookupApi(response.data.result.content, "plannerGroup", "plannerGroupDescription")
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupCostCenter() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_COST_CENTER_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateCostCenterOption = mapOptionFromLookupApi(response.data.result.content, "costCenter", "costCenterDescription")
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupWbsElement() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_WBS_ELEMENT_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateWbsElementOption = mapOptionFromLookupApi(response.data.result.content, "wbsElement", "wbsElementDescription")
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupLevel() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_LEVEL_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateLevelOption = mapOption(response.data.result.content.level)
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupEquipmentType() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_EQUIPMENT_TYPE_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateEquipmentTypeOption = mapOptionFromLookupApi(response.data.result.content, "equipmentType", "equipmentTypeDescription")
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupEquipmentGroup() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_EQUIPMENT_GROUP_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateEquipmentGroupOption = mapOptionFromLookupApi(response.data.result.content, "equipmentGroup", "equipmentGroupDescription")
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupEquipmentModel() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<EquipmentModelLookupItem>> =
          await ApiService.get(
            LOOKUP_EQUIPMENT_MODEL_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateEquipmentModelOption = mapOptionFromLookupApi(response.data.result.content, "equipmentModel", "equipmentModelDescription")
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupEquipmentStatus() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_EQUIPMENT_STATUS_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateEquipmentStatusOption = mapOption(response.data.result.content.status)
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupSite() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_SITE_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateSiteOption = mapOptionWithThreeLabelFromLookupApi(response.data.result.content, "siteId", "siteCode", "siteDescription");
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupPlanningPlant() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            planningPlantURL.getLookup,
            "",
            new URLSearchParams(params).toString(),
          );
        this.statePlanningPlantOption = mapOptionWithThreeLabelFromLookupApi(response.data.result.content, "planningPlantId", "planningPlantCode", "planningPlantDescription")
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupMaintenancePlant() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            maintenancePlantURL.getLookup,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateMaintenancePlantOption = mapOptionFromLookupApi(response.data.result.content, "maintenancePlant", "maintenancePlantDescription")
      } catch (error) {
        console.log(error);
      }
    },
    async export() {
      const params = {
        Equipment: this.stateFilterData.equipment,
        EquipmentTo: this.stateFilterData.equipmentTo,
        ObjectType: this.stateFilterData.objectType,
        ObjectTypeTo: this.stateFilterData.objectTypeTo,
        PlannerGroup: this.stateFilterData.plannerGroup,
        PlannerGroupTo: this.stateFilterData.plannerGroupTo,
        CostCenter: this.stateFilterData.costCenter,
        CostCenterTo: this.stateFilterData.costCenterTo,
        WbsElement: this.stateFilterData.wbsElement,
        WbsElementTo: this.stateFilterData.wbsElementTo,
        Level: this.stateFilterData.level,
        LevelTo: this.stateFilterData.levelTo,
        EquipmentType: this.stateFilterData.equipmentType,
        EquipmentTypeTo: this.stateFilterData.equipmentTypeTo,
        EquipmentGroup: this.stateFilterData.equipmentGroup,
        EquipmentGroupTo: this.stateFilterData.equipmentGroupTo,
        EquipmentModel: this.stateFilterData.equipmentModel,
        EquipmentModelTo: this.stateFilterData.equipmentModelTo,
        EquipmentStatus: this.stateFilterData.equipmentStatus,
        EquipmentStatusTo: this.stateFilterData.equipmentStatusTo,
        Site: this.stateFilterData.site,
        SiteTo: this.stateFilterData.siteTo,
        PlanningPlant: this.stateFilterData.planningPlant,
        PlanningPlantTo: this.stateFilterData.planningPlantTo,
        MaintenancePlant: this.stateFilterData.maintenancePlant,
        MaintenancePlantTo: this.stateFilterData.maintenancePlantTo,
        MaintenanceWorkCenterOption: this.stateFilterData.maintenanceWorkCenter,
        MaintenanceWorkCenterOptionTo: this.stateFilterData.maintenanceWorkCenterTo,
        StartDate: this.stateFilterData.startDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDate))) : "",
        StartDateTo: this.stateFilterData.startDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.startDateTo))) : "",
        EndDate: this.stateFilterData.endDate ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDate))) : "",
        EndDateTo: this.stateFilterData.endDateTo ? formatDateForPostData(normalizeDate(new Date(this.stateFilterData.endDateTo))) : "",
        ver: this.stateFilterData.ver,
        Gmt: new Date().toTimeString().slice(12, 17),
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.getBlob(
          EXPORT_API_URL,
          "",
          new URLSearchParams(params).toString(),
        );
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
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData(false);
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200);
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
    setEquipment(value: string) {
      this.stateFilterData.equipment = value;
    },
    setEquipmentTo(value: string) {
      this.stateFilterData.equipmentTo = value;
    },
    setMaintenanceWorkCenter(value: string) {
      this.stateFilterData.maintenanceWorkCenter = value;
    },
    setMaintenanceWorkCenterTo(value: string) {
      this.stateFilterData.maintenanceWorkCenterTo = value;
    },
    setObjectType(value: string) {
      this.stateFilterData.objectType = value;
    },
    setObjectTypeTo(value: string) {
      this.stateFilterData.objectTypeTo = value;
    },
    setPlannerGroup(value: string) {
      this.stateFilterData.plannerGroup = value;
    },
    setPlannerGroupTo(value: string) {
      this.stateFilterData.plannerGroupTo = value;
    },
    setCostCenter(value: string) {
      this.stateFilterData.costCenter = value;
    },
    setCostCenterTo(value: string) {
      this.stateFilterData.costCenterTo = value;
    },
    setWbsElement(value: string) {
      this.stateFilterData.wbsElement = value;
    },
    setWbsElementTo(value: string) {
      this.stateFilterData.wbsElementTo = value;
    },
    setLevel(value: string) {
      this.stateFilterData.level = value;
    },
    setLevelTo(value: string) {
      this.stateFilterData.levelTo = value;
    },
    setEquipmentType(value: string) {
      this.stateFilterData.equipmentType = value;
    },
    setEquipmentTypeTo(value: string) {
      this.stateFilterData.equipmentTypeTo = value;
    },
    setEquipmentGroup(value: string) {
      this.stateFilterData.equipmentGroup = value;
    },
    setEquipmentGroupTo(value: string) {
      this.stateFilterData.equipmentGroupTo = value;
    },
    setEquipmentModel(value: string) {
      this.stateFilterData.equipmentModel = value;
    },
    setEquipmentModelTo(value: string) {
      this.stateFilterData.equipmentModelTo = value;
    },
    setEquipmentStatus(value: string) {
      this.stateFilterData.equipmentStatus = value;
    },
    setEquipmentStatusTo(value: string) {
      this.stateFilterData.equipmentStatusTo = value;
    },
    setSite(value: string) {
      this.stateFilterData.site = value;
    },
    setSiteTo(value: string) {
      this.stateFilterData.siteTo = value;
    },
    setPlanningPlant(value: string) {
      this.stateFilterData.planningPlant = value;
    },
    setPlanningPlantTo(value: string) {
      this.stateFilterData.planningPlantTo = value;
    },
    setMaintenancePlant(value: string) {
      this.stateFilterData.maintenancePlant = value;
    },
    setMaintenancePlantTo(value: string) {
      this.stateFilterData.maintenancePlantTo = value;
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
      this.stateFilterData.equipment = "";
      this.stateFilterData.equipmentTo = "";
      this.stateFilterData.objectType = "";
      this.stateFilterData.objectTypeTo = "";
      this.stateFilterData.plannerGroup = "";
      this.stateFilterData.plannerGroupTo = "";
      this.stateFilterData.costCenter = "";
      this.stateFilterData.costCenterTo = "";
      this.stateFilterData.wbsElement = "";
      this.stateFilterData.wbsElementTo = "";
      this.stateFilterData.level = "";
      this.stateFilterData.levelTo = "";
      this.stateFilterData.equipmentType = "";
      this.stateFilterData.equipmentTypeTo = "";
      this.stateFilterData.equipmentGroup = "";
      this.stateFilterData.equipmentGroupTo = "";
      this.stateFilterData.equipmentModel = "";
      this.stateFilterData.equipmentModelTo = "";
      this.stateFilterData.equipmentStatus = "";
      this.stateFilterData.equipmentStatusTo = "";
      this.stateFilterData.site = "";
      this.stateFilterData.siteTo = "";
      this.stateFilterData.planningPlant = "";
      this.stateFilterData.planningPlantTo = "";
      this.stateFilterData.maintenancePlant = "";
      this.stateFilterData.maintenancePlantTo = "";
      this.stateFilterData.startDate = "";
      this.stateFilterData.startDateTo = "";
      this.stateFilterData.endDate = "";
      this.stateFilterData.endDateTo = "";
      const checkEquipment = this.stateLastUsedFilterData.equipment !== "";
      const checkEquipmentTo = this.stateLastUsedFilterData.equipment !== "";
      const checkObjectType = this.stateLastUsedFilterData.objectType !== "";
      const checkObjectTypeTo = this.stateLastUsedFilterData.objectType !== "";
      const checkPlannerGroup = this.stateLastUsedFilterData.plannerGroup !== "";
      const checkPlannerGroupTo = this.stateLastUsedFilterData.plannerGroup !== "";
      const checkCostCenter = this.stateLastUsedFilterData.costCenter !== "";
      const checkCostCenterTo = this.stateLastUsedFilterData.costCenter !== "";
      const checkWbsElement = this.stateLastUsedFilterData.wbsElement !== "";
      const checkWbsElementTo = this.stateLastUsedFilterData.wbsElement !== "";
      const checkLevel = this.stateLastUsedFilterData.level !== "";
      const checkLevelTo = this.stateLastUsedFilterData.level !== "";
      const checkEquipmentType = this.stateLastUsedFilterData.equipmentType !== "";
      const checkEquipmentTypeTo = this.stateLastUsedFilterData.equipmentType !== "";
      const checkEquipmentGroup = this.stateLastUsedFilterData.equipmentGroup !== "";
      const checkEquipmentGroupTo = this.stateLastUsedFilterData.equipmentGroup !== "";
      const checkEquipmentModel = this.stateLastUsedFilterData.equipmentModel !== "";
      const checkEquipmentModelTo = this.stateLastUsedFilterData.equipmentModel !== "";
      const checkEquipmentStatus = this.stateLastUsedFilterData.equipmentStatus !== "";
      const checkEquipmentStatusTo = this.stateLastUsedFilterData.equipmentStatus !== "";
      const checkSite = this.stateLastUsedFilterData.site !== "";
      const checkSiteTo = this.stateLastUsedFilterData.site !== "";
      const checkPlanningPlant = this.stateLastUsedFilterData.planningPlant !== "";
      const checkPlanningPlantTo = this.stateLastUsedFilterData.planningPlant !== "";
      const checkMaintenancePlant = this.stateLastUsedFilterData.maintenancePlant !== "";
      const checkMaintenancePlantTo = this.stateLastUsedFilterData.maintenancePlant !== "";
      const checkStartDate = this.stateLastUsedFilterData.startDate !== "";
      const checkStartDateTo = this.stateLastUsedFilterData.startDate !== "";
      const checkEndDate = this.stateLastUsedFilterData.endDate !== "";
      const checkEndDateTo = this.stateLastUsedFilterData.endDate !== "";
      if (
        checkEquipment ||
        checkEquipmentTo ||
        checkObjectType ||
        checkObjectTypeTo ||
        checkPlannerGroup ||
        checkPlannerGroupTo ||
        checkCostCenter ||
        checkCostCenterTo ||
        checkWbsElement ||
        checkWbsElementTo ||
        checkLevel ||
        checkLevelTo ||
        checkEquipmentType ||
        checkEquipmentTypeTo ||
        checkEquipmentGroup ||
        checkEquipmentGroupTo ||
        checkEquipmentModel ||
        checkEquipmentModelTo ||
        checkEquipmentStatus ||
        checkEquipmentStatusTo ||
        checkSite ||
        checkSiteTo ||
        checkPlanningPlant ||
        checkPlanningPlantTo ||
        checkMaintenancePlant ||
        checkMaintenancePlantTo ||
        checkStartDate ||
        checkStartDateTo ||
        checkEndDate ||
        checkEndDateTo
      ) {
        await this.getData();
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
    },
  },
});
