<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.UnitNumber"
        :value-to="filterData.UnitNumberTo"
        label="Unit Number"
        name="UnitNumber"
        :options="listStore.unitNumberOption"
        @handle-change-from="onUnitNumberSelected"
        @handle-change-to="onUnitNumberToSelected"
     />
      <AutoComplete
        :value-from="filterData.SmuDue"
        :value-to="filterData.SmuDueTo"
        label="SMU Due"
        name="SmuDue"
        :options="listStore.smuDueOption"
        @handle-change-from="onSmuDueSelected"
        @handle-change-to="onSmuDueToSelected"
     />
      <AutoComplete
        :value-from="filterData.WorkOrder"
        :value-to="filterData.WorkOrderTo"
        label="Work Order"
        name="WorkOrder"
        :options="listStore.workOrderOption"
        @handle-change-from="onWorkOrderSelected"
        @handle-change-to="onWorkOrderToSelected"
     />
      <AutoComplete
        :value-from="filterData.PsType"
        :value-to="filterData.PsTypeTo"
        label="PS Type"
        name="PsType"
        :options="listStore.psTypeOption"
        @handle-change-from="onPsTypeSelected"
        @handle-change-to="onPsTypeToSelected"
     />
      <DatePickerInput
        :value-from="filterData.DateService ? filterData.DateService.toString() : ''"
        :value-to="filterData.DateServiceTo ? filterData.DateServiceTo.toString() : ''"
        label="Date Service"
        name="DateService"
        placeholder="Pick a date"
        @handle-change-from="onDateServiceSelected"
        @handle-change-to="onDateServiceToSelected"
     />
      <AutoComplete
        :value-from="filterData.Model"
        :value-to="filterData.ModelTo"
        label="Model"
        name="Model"
        :options="listStore.modelOption"
        @handle-change-from="onModelSelected"
        @handle-change-to="onModelToSelected"
     />
      <AutoComplete
        :value-from="filterData.LastPsType"
        :value-to="filterData.LastPsTypeTo"
        label="Last PS Type"
        name="LastPsType"
        :options="listStore.lastPsTypeOption"
        @handle-change-from="onLastPsTypeSelected"
        @handle-change-to="onLastPsTypeToSelected"
     />
      <DatePickerInput
        :value-from="filterData.LastDateService ? filterData.LastDateService.toString() : ''"
        :value-to="filterData.LastDateServiceTo ? filterData.LastDateServiceTo.toString() : ''"
        label="Last DateService"
        name="LastDateService"
        placeholder="Pick a date"
        @handle-change-from="onLastDateServiceSelected"
        @handle-change-to="onLastDateServiceToSelected"
     />
      <AutoComplete
        :value-from="filterData.LastWorkOrder"
        :value-to="filterData.LastWorkOrderTo"
        label="Last Work Order"
        name="LastWorkOrder"
        :options="listStore.lastWorkOrderOption"
        @handle-change-from="onLastWorkOrderSelected"
        @handle-change-to="onLastWorkOrderToSelected"
     />
      <AutoComplete
        :value-from="filterData.TaskNumberDetail"
        :value-to="filterData.TaskNumberDetailTo"
        label="Task Number Detail"
        name="TaskNumberDetail"
        :options="listStore.taskNumberDetailOption"
        @handle-change-from="onTaskNumberDetailSelected"
        @handle-change-to="onTaskNumberDetailToSelected"
     />
      <AutoComplete
        :value-from="filterData.LocationId"
        :value-to="filterData.LocationIdTo"
        label="Location ID"
        name="LocationId"
        :options="listStore.locationIdOption"
        @handle-change-from="onLocationIdSelected"
        @handle-change-to="onLocationIdToSelected"
     />
      <AutoComplete
        :value-from="filterData.LastTaskNumberDetail"
        :value-to="filterData.LastTaskNumberDetailTo"
        label="Last Task Number Detail"
        name="LastTaskNumberDetail"
        :options="listStore.lastTaskNumberDetailOption"
        @handle-change-from="onLastTaskNumberDetailSelected"
        @handle-change-to="onLastTaskNumberDetailToSelected"
     />
      <AutoComplete
        :value-from="filterData.LastLocationId"
        :value-to="filterData.LastLocationIdTo"
        label="Last Location ID"
        name="LastLocationId"
        :options="listStore.lastLocationIdOption"
        @handle-change-from="onLastLocationIdSelected"
        @handle-change-to="onLastLocationIdToSelected"
     />
      <DatePickerInput
        :value-from="filterData.StartDate ? filterData.StartDate.toString() : ''"
        :value-to="filterData.StartDateTo ? filterData.StartDateTo.toString() : ''"
        label="Start Date"
        name="StartDate"
        placeholder="Pick a date"
        @handle-change-from="onStartDateSelected"
        @handle-change-to="onStartDateToSelected"
     />
      <DatePickerInput
        :value-from="filterData.EndDate ? filterData.EndDate.toString() : ''"
        :value-to="filterData.EndDateTo ? filterData.EndDateTo.toString() : ''"
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
import AutoComplete from "@/components/inputs/range-inputs/AutoComplete.vue";
import DatePickerInput from "@/components/inputs/range-inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from "vue";
import {
  useHistoryCrackListStore
} from "@/store/pinia/iron-lake/task/history-crack/useHistoryCrackListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/task/history-crack/FilterData";

/* stores */
const listStore = useHistoryCrackListStore();
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
const onUnitNumberSelected = (value: string) => {
  listStore.setUnitNumber(value);
};
const onUnitNumberToSelected = (value: string) => {
  listStore.setUnitNumberTo(value);
};
const onSmuDueSelected = (value: string) => {
  listStore.setSmuDue(value);
};
const onSmuDueToSelected = (value: string) => {
  listStore.setSmuDueTo(value);
};
const onWorkOrderSelected = (value: string) => {
  listStore.setWorkOrder(value);
};
const onWorkOrderToSelected = (value: string) => {
  listStore.setWorkOrderTo(value);
};
const onPsTypeSelected = (value: string) => {
  listStore.setPsType(value);
};
const onPsTypeToSelected = (value: string) => {
  listStore.setPsTypeTo(value);
};
const onDateServiceSelected = (value: string) => {
  listStore.setDateService(value);
};
const onDateServiceToSelected = (value: string) => {
  listStore.setDateServiceTo(value);
};
const onModelSelected = (value: string) => {
  listStore.setModel(value);
};
const onModelToSelected = (value: string) => {
  listStore.setModelTo(value);
};
const onLastPsTypeSelected = (value: string) => {
  listStore.setLastPsType(value);
};
const onLastPsTypeToSelected = (value: string) => {
  listStore.setLastPsTypeTo(value);
};
const onLastDateServiceSelected = (value: string) => {
  listStore.setLastDateService(value);
};
const onLastDateServiceToSelected = (value: string) => {
  listStore.setLastDateServiceTo(value);
};
const onLastWorkOrderSelected = (value: string) => {
  listStore.setLastWorkOrder(value);
};
const onLastWorkOrderToSelected = (value: string) => {
  listStore.setLastWorkOrderTo(value);
};
const onTaskNumberDetailSelected = (value: string) => {
  listStore.setTaskNumberDetail(value);
};
const onTaskNumberDetailToSelected = (value: string) => {
  listStore.setTaskNumberDetailTo(value);
};
const onLocationIdSelected = (value: string) => {
  listStore.setLocationId(value);
};
const onLocationIdToSelected = (value: string) => {
  listStore.setLocationIdTo(value);
};
const onLastTaskNumberDetailSelected = (value: string) => {
  listStore.setLastTaskNumberDetail(value);
};
const onLastTaskNumberDetailToSelected = (value: string) => {
  listStore.setLastTaskNumberDetailTo(value);
};
const onLastLocationIdSelected = (value: string) => {
  listStore.setLastLocationId(value);
};
const onLastLocationIdToSelected = (value: string) => {
  listStore.setLastLocationIdTo(value);
};
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value);
};
const onStartDateToSelected = (value: string) => {
  listStore.setStartDateTo(value);
};
const onEndDateSelected = (value: string) => {
  listStore.setEndDate(value);
};
const onEndDateToSelected = (value: string) => {
  listStore.setEndDateTo(value);
};
const handleFilterClick = () => {
  const checkUnitNumber =
    listStore.lastUsedFilterData.UnitNumber !==
    listStore.filterData.UnitNumber;
  const checkUnitNumberTo =
    listStore.lastUsedFilterData.UnitNumberTo !==
    listStore.filterData.UnitNumberTo;
  const checkSmuDue =
    listStore.lastUsedFilterData.SmuDue !==
    listStore.filterData.SmuDue;
  const checkSmuDueTo =
    listStore.lastUsedFilterData.SmuDueTo !==
    listStore.filterData.SmuDueTo;
  const checkWorkOrder =
    listStore.lastUsedFilterData.WorkOrder !==
    listStore.filterData.WorkOrder;
  const checkWorkOrderTo =
    listStore.lastUsedFilterData.WorkOrderTo !==
    listStore.filterData.WorkOrderTo;
  const checkPsType =
    listStore.lastUsedFilterData.PsType !==
    listStore.filterData.PsType;
  const checkPsTypeTo =
    listStore.lastUsedFilterData.PsTypeTo !==
    listStore.filterData.PsTypeTo;
  const checkDateService =
    listStore.lastUsedFilterData.DateService !==
    listStore.filterData.DateService;
  const checkDateServiceTo =
    listStore.lastUsedFilterData.DateServiceTo !==
    listStore.filterData.DateServiceTo;
  const checkModel =
    listStore.lastUsedFilterData.Model !==
    listStore.filterData.Model;
  const checkModelTo =
    listStore.lastUsedFilterData.ModelTo !==
    listStore.filterData.ModelTo;
  const checkLastPsType =
    listStore.lastUsedFilterData.LastPsType !==
    listStore.filterData.LastPsType;
  const checkLastPsTypeTo =
    listStore.lastUsedFilterData.LastPsTypeTo !==
    listStore.filterData.LastPsTypeTo;
  const checkLastDateService =
    listStore.lastUsedFilterData.LastDateService !==
    listStore.filterData.LastDateService;
  const checkLastDateServiceTo =
    listStore.lastUsedFilterData.LastDateServiceTo !==
    listStore.filterData.LastDateServiceTo;
  const checkLastWorkOrder =
    listStore.lastUsedFilterData.LastWorkOrder !==
    listStore.filterData.LastWorkOrder;
  const checkLastWorkOrderTo =
    listStore.lastUsedFilterData.LastWorkOrderTo !==
    listStore.filterData.LastWorkOrderTo;
  const checkTaskNumberDetail =
    listStore.lastUsedFilterData.TaskNumberDetail !==
    listStore.filterData.TaskNumberDetail;
  const checkTaskNumberDetailTo =
    listStore.lastUsedFilterData.TaskNumberDetailTo !==
    listStore.filterData.TaskNumberDetailTo;
  const checkLocationId =
    listStore.lastUsedFilterData.LocationId !==
    listStore.filterData.LocationId;
  const checkLocationIdTo =
    listStore.lastUsedFilterData.LocationIdTo !==
    listStore.filterData.LocationIdTo;
  const checkLastTaskNumberDetail =
    listStore.lastUsedFilterData.LastTaskNumberDetail !==
    listStore.filterData.LastTaskNumberDetail;
  const checkLastTaskNumberDetailTo =
    listStore.lastUsedFilterData.LastTaskNumberDetailTo !==
    listStore.filterData.LastTaskNumberDetailTo;
  const checkLastLocationId =
    listStore.lastUsedFilterData.LastLocationId !==
    listStore.filterData.LastLocationId;
  const checkLastLocationIdTo =
    listStore.lastUsedFilterData.LastLocationIdTo !==
    listStore.filterData.LastLocationIdTo;
  const checkStartDate =
    listStore.lastUsedFilterData.StartDate !==
    listStore.filterData.StartDate;
  const checkStartDateTo =
    listStore.lastUsedFilterData.StartDateTo !==
    listStore.filterData.StartDateTo;
  const checkEndDate =
    listStore.lastUsedFilterData.EndDate !==
    listStore.filterData.EndDate;
  const checkEndDateTo =
    listStore.lastUsedFilterData.EndDateTo !==
    listStore.filterData.EndDateTo;
  const status = checkUnitNumber || checkUnitNumberTo || checkSmuDue || checkSmuDueTo || checkWorkOrder || checkWorkOrderTo || checkPsType || checkPsTypeTo || checkDateService || checkDateServiceTo || checkModel || checkModelTo || checkLastPsType || checkLastPsTypeTo || checkLastDateService || checkLastDateServiceTo || checkLastWorkOrder || checkLastWorkOrderTo || checkTaskNumberDetail || checkTaskNumberDetailTo || checkLocationId || checkLocationIdTo || checkLastTaskNumberDetail || checkLastTaskNumberDetailTo || checkLastLocationId || checkLastLocationIdTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo;
  emits("handle-close", status);
};
</script>
