<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-4 my-4">
      <AutoComplete
        :value-from="filterData.equipment"
        :value-to="filterData.equipmentTo"
        label="Equipment"
        name="Equipment"
        :options="listStore.equipmentOption"
        @handle-change-from="onEquipmentSelected"
        @handle-change-to="onEquipmentToSelected"
     />
      <AutoComplete
        :value-from="filterData.objectType"
        :value-to="filterData.objectTypeTo"
        label="Object Type"
        name="ObjectType"
        :options="listStore.objectTypeOption"
        @handle-change-from="onObjectTypeSelected"
        @handle-change-to="onObjectTypeToSelected"
     />
      <AutoComplete
        :value-from="filterData.plannerGroup"
        :value-to="filterData.plannerGroupTo"
        label="Planner Group"
        name="PlannerGroup"
        :options="listStore.plannerGroupOption"
        @handle-change-from="onPlannerGroupSelected"
        @handle-change-to="onPlannerGroupToSelected"
     />
      <AutoComplete
        :value-from="filterData.maintenanceWorkCenter"
        :value-to="filterData.maintenanceWorkCenterTo"
        label="Maintenance Work Center"
        name="MaintenanceWorkCenter"
        :options="listStore.maintenanceWorkCenterOption"
        @handle-change-from="onMaintenanceWorkCenterSelected"
        @handle-change-to="onMaintenanceWorkCenterToSelected"
     />
      <AutoComplete
        :value-from="filterData.costCenter"
        :value-to="filterData.costCenterTo"
        label="Cost Center"
        name="CostCenter"
        :options="listStore.costCenterOption"
        @handle-change-from="onCostCenterSelected"
        @handle-change-to="onCostCenterToSelected"
     />
      <AutoComplete
        :value-from="filterData.wbsElement"
        :value-to="filterData.wbsElementTo"
        label="WBS Element"
        name="WbsElement"
        :options="listStore.wbsElementOption"
        @handle-change-from="onWbsElementSelected"
        @handle-change-to="onWbsElementToSelected"
     />
      <AutoComplete
        :value-from="filterData.level"
        :value-to="filterData.levelTo"
        label="Level"
        name="Level"
        :options="listStore.levelOption"
        @handle-change-from="onLevelSelected"
        @handle-change-to="onLevelToSelected"
     />
      <AutoComplete
        :value-from="filterData.equipmentType"
        :value-to="filterData.equipmentTypeTo"
        label="Equipment Type"
        name="EquipmentType"
        :options="listStore.equipmentTypeOption"
        @handle-change-from="onEquipmentTypeSelected"
        @handle-change-to="onEquipmentTypeToSelected"
     />
      <AutoComplete
        :value-from="filterData.equipmentGroup"
        :value-to="filterData.equipmentGroupTo"
        label="Equipment Group"
        name="EquipmentGroup"
        :options="listStore.equipmentGroupOption"
        @handle-change-from="onEquipmentGroupSelected"
        @handle-change-to="onEquipmentGroupToSelected"
     />
      <AutoComplete
        :value-from="filterData.equipmentModel"
        :value-to="filterData.equipmentModelTo"
        label="Equipment Model"
        name="EquipmentModel"
        :options="listStore.equipmentModelOption"
        @handle-change-from="onEquipmentModelSelected"
        @handle-change-to="onEquipmentModelToSelected"
     />
      <AutoComplete
        :value-from="filterData.equipmentStatus"
        :value-to="filterData.equipmentStatusTo"
        label="Equipment Status"
        name="EquipmentStatus"
        :options="listStore.equipmentStatusOption"
        @handle-change-from="onEquipmentStatusSelected"
        @handle-change-to="onEquipmentStatusToSelected"
     />
      <AutoComplete
        :value-from="filterData.site"
        :value-to="filterData.siteTo"
        label="Site"
        name="Site"
        :options="listStore.siteOption"
        @handle-change-from="onSiteSelected"
        @handle-change-to="onSiteToSelected"
     />
      <AutoComplete
        :value-from="filterData.planningPlant"
        :value-to="filterData.planningPlantTo"
        label="PlanningPlant"
        name="PlanningPlant"
        :options="listStore.planningPlantOption"
        @handle-change-from="onPlanningPlantSelected"
        @handle-change-to="onPlanningPlantToSelected"
     />
      <AutoComplete
        :value-from="filterData.maintenancePlant"
        :value-to="filterData.maintenancePlantTo"
        label="MaintenancePlant"
        name="MaintenancePlant"
        :options="listStore.maintenancePlantOption"
        @handle-change-from="onMaintenancePlantSelected"
        @handle-change-to="onMaintenancePlantToSelected"
     />
      <DatePickerInput
        :value-from="filterData.startDate ? filterData.startDate.toString() : ''"
        :value-to="filterData.startDateTo ? filterData.startDateTo.toString() : ''"
        label="Start Date"
        name="StartDate"
        placeholder="Pick a date"
        @handle-change-from="onStartDateSelected"
        @handle-change-to="onStartDateToSelected"
     />
      <DatePickerInput
        :value-from="filterData.endDate ? filterData.endDate.toString() : ''"
        :value-to="filterData.endDateTo ? filterData.endDateTo.toString() : ''"
        label="End Date"
        name="EndDate"
        placeholder="Pick a date"
        @handle-change-from="onEndDateSelected"
        @handle-change-to="onEndDateToSelected"
     />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="secondary" @click="handleReset">Reset</el-button>
        <el-button type="primary" @click="handleFilterClick">Filter</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from "vue";
import {
  useEquipmentAssignmentListStore
} from "@/store/pinia/iron-lake/equipment/equipment-assignment/useEquipmentAssignmentListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/equipment-assignment/FilterData";
import AutoComplete from "@/components/inputs/range-inputs/AutoComplete.vue";
import DatePickerInput from "@/components/inputs/range-inputs/DatePickerInput.vue";

/* stores */
const listStore = useEquipmentAssignmentListStore();
const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["handle-close"]);

/* refs*/
const isVisible = toRef(props, "visibility");
const filterData: ComputedRef<FilterData> = computed(() => {
  return listStore.filterData;
});

/* handlers */
const handleReset = () => {
  handleCloseModal();
  listStore.resetFilter();
};
const handleCloseModal = () => {
  emits("handle-close", false);
};
const onEquipmentSelected = (value: string) => {
  listStore.setEquipment(value);
};
const onEquipmentToSelected = (value: string) => {
  listStore.setEquipmentTo(value);
};
const onObjectTypeSelected = (value: string) => {
  listStore.setObjectType(value);
};
const onObjectTypeToSelected = (value: string) => {
  listStore.setObjectTypeTo(value);
};
const onPlannerGroupSelected = (value: string) => {
  listStore.setPlannerGroup(value);
};
const onPlannerGroupToSelected = (value: string) => {
  listStore.setPlannerGroupTo(value);
};
const onCostCenterSelected = (value: string) => {
  listStore.setCostCenter(value);
};
const onCostCenterToSelected = (value: string) => {
  listStore.setCostCenterTo(value);
};
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value);
};
const onStartDateToSelected = (value: string) => {
  listStore.setStartDateTo(value);
};
const onMaintenanceWorkCenterSelected = (value: string) => {
  listStore.setMaintenanceWorkCenter(value);
};
const onMaintenanceWorkCenterToSelected = (value: string) => {
  listStore.setMaintenanceWorkCenterTo(value);
};
const onWbsElementSelected = (value: string) => {
  listStore.setWbsElement(value);
};
const onWbsElementToSelected = (value: string) => {
  listStore.setWbsElementTo(value);
};
const onLevelSelected = (value: string) => {
  listStore.setLevel(value);
};
const onLevelToSelected = (value: string) => {
  listStore.setLevelTo(value);
};
const onEquipmentTypeSelected = (value: string) => {
  listStore.setEquipmentType(value);
};
const onEquipmentTypeToSelected = (value: string) => {
  listStore.setEquipmentTypeTo(value);
};
const onEquipmentGroupSelected = (value: string) => {
  listStore.setEquipmentGroup(value);
};
const onEquipmentGroupToSelected = (value: string) => {
  listStore.setEquipmentGroupTo(value);
};
const onEquipmentModelSelected = (value: string) => {
  listStore.setEquipmentModel(value);
};
const onEquipmentModelToSelected = (value: string) => {
  listStore.setEquipmentModelTo(value);
};
const onEquipmentStatusSelected = (value: string) => {
  listStore.setEquipmentStatus(value);
};
const onEquipmentStatusToSelected = (value: string) => {
  listStore.setEquipmentStatusTo(value);
};
const onSiteSelected = (value: string) => {
  listStore.setSite(value);
};
const onSiteToSelected = (value: string) => {
  listStore.setSiteTo(value);
};
const onPlanningPlantSelected = (value: string) => {
  listStore.setPlanningPlant(value);
};
const onPlanningPlantToSelected = (value: string) => {
  listStore.setPlanningPlantTo(value);
};
const onMaintenancePlantSelected = (value: string) => {
  listStore.setMaintenancePlant(value);
};
const onMaintenancePlantToSelected = (value: string) => {
  listStore.setMaintenancePlantTo(value);
};
const onEndDateSelected = (value: string) => {
  listStore.setEndDate(value);
};
const onEndDateToSelected = (value: string) => {
  listStore.setEndDateTo(value);
};
const handleFilterClick = () => {
  const checkEquipment =
    listStore.lastUsedFilterData.equipment !==
    listStore.filterData.equipment;
  const checkEquipmentTo =
    listStore.lastUsedFilterData.equipmentTo !==
    listStore.filterData.equipmentTo;
  const checkMaintenanceWorkCenter =
    listStore.lastUsedFilterData.maintenanceWorkCenter !==
    listStore.filterData.maintenanceWorkCenter;
  const checkMaintenanceWorkCenterTo =
    listStore.lastUsedFilterData.maintenanceWorkCenterTo !==
    listStore.filterData.maintenanceWorkCenterTo;
  const checkObjectType =
    listStore.lastUsedFilterData.objectType !== listStore.filterData.objectType;
  const checkObjectTypeTo =
    listStore.lastUsedFilterData.objectTypeTo !== listStore.filterData.objectTypeTo;
  const checkPlannerGroup =
    listStore.lastUsedFilterData.plannerGroup !==
    listStore.filterData.plannerGroup;
  const checkPlannerGroupTo =
    listStore.lastUsedFilterData.plannerGroupTo !==
    listStore.filterData.plannerGroupTo;
  const checkCostCenter =
    listStore.lastUsedFilterData.costCenter !== listStore.filterData.costCenter;
  const checkCostCenterTo =
    listStore.lastUsedFilterData.costCenterTo !== listStore.filterData.costCenterTo;
  const checkWbsElement =
    listStore.lastUsedFilterData.wbsElement !== listStore.filterData.wbsElement;
  const checkWbsElementTo =
    listStore.lastUsedFilterData.wbsElementTo !== listStore.filterData.wbsElementTo;
  const checkLevel =
    listStore.lastUsedFilterData.level !== listStore.filterData.level;
  const checkLevelTo =
    listStore.lastUsedFilterData.levelTo !== listStore.filterData.levelTo;
  const checkEquipmentType =
    listStore.lastUsedFilterData.equipmentType !==
    listStore.filterData.equipmentType;
  const checkEquipmentTypeTo =
    listStore.lastUsedFilterData.equipmentTypeTo !==
    listStore.filterData.equipmentTypeTo;
  const checkEquipmentGroup =
    listStore.lastUsedFilterData.equipmentGroup !==
    listStore.filterData.equipmentGroup;
  const checkEquipmentGroupTo =
    listStore.lastUsedFilterData.equipmentGroupTo !==
    listStore.filterData.equipmentGroupTo;
  const checkEquipmentModel =
    listStore.lastUsedFilterData.equipmentModel !==
    listStore.filterData.equipmentModel;
  const checkEquipmentModelTo =
    listStore.lastUsedFilterData.equipmentModelTo !==
    listStore.filterData.equipmentModelTo;
  const checkEquipmentStatus =
    listStore.lastUsedFilterData.equipmentStatus !==
    listStore.filterData.equipmentStatus;
  const checkEquipmentStatusTo =
    listStore.lastUsedFilterData.equipmentStatusTo !==
    listStore.filterData.equipmentStatusTo;
  const checkSite =
    listStore.lastUsedFilterData.site !== listStore.filterData.site;
  const checkSiteTo =
    listStore.lastUsedFilterData.siteTo !== listStore.filterData.siteTo;
  const checkPlanningPlant =
    listStore.lastUsedFilterData.planningPlant !==
    listStore.filterData.planningPlant;
  const checkPlanningPlantTo =
    listStore.lastUsedFilterData.planningPlantTo !==
    listStore.filterData.planningPlantTo;
  const checkMaintenancePlant =
    listStore.lastUsedFilterData.maintenancePlant !==
    listStore.filterData.maintenancePlant;
  const checkMaintenancePlantTo =
    listStore.lastUsedFilterData.maintenancePlantTo !==
    listStore.filterData.maintenancePlantTo;
  const checkStartDate =
    listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate;
  const checkStartDateTo =
    listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo;
  const checkEndDate =
    listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate;
  const checkEndDateTo =
    listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo;
  const status =
    checkEquipment ||
    checkEquipmentTo ||
    checkMaintenanceWorkCenter ||
    checkMaintenanceWorkCenterTo ||
    checkObjectType ||
    checkObjectTypeTo ||
    checkPlannerGroup ||
    checkPlannerGroupTo ||
    checkCostCenter ||
    checkCostCenterTo ||
    checkStartDate ||
    checkStartDateTo ||
    checkEndDate ||
    checkEndDateTo ||
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
    checkMaintenancePlantTo;
  emits("handle-close", status);
};
</script>
