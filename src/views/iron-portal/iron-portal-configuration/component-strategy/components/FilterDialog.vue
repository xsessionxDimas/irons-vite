<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.componentCode"
        :value-to="filterData.componentCodeTo"
        label="Component Code"
        name="ComponentCode"
        :options="listStore.componentCodeOption"
        @handle-change-from="onComponentCodeSelected"
        @handle-change-to="onComponentCodeToSelected"
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
        :value-from="filterData.modifierCode"
        :value-to="filterData.modifierCodeTo"
        label="Modifier Code"
        name="ModifierCode"
        :options="listStore.modifierCodeOption"
        @handle-change-from="onModifierCodeSelected"
        @handle-change-to="onModifierCodeToSelected"
      />
      <AutoComplete
        :value-from="filterData.taskType"
        :value-to="filterData.taskTypeTo"
        label="Task Type"
        name="TaskType"
        :options="listStore.taskTypeOption"
        @handle-change-from="onTaskTypeSelected"
        @handle-change-to="onTaskTypeToSelected"
      />
      <AutoComplete
        :value-from="filterData.strategyTaskDesc"
        :value-to="filterData.strategyTaskDescTo"
        label="Strategy Task Description"
        name="StrategyTaskDesc"
        :options="listStore.strategyTaskDescriptionOption"
        @handle-change-from="onStrategyTaskDescriptionSelected"
        @handle-change-to="onStrategyTaskDescriptionToSelected"
      />
      <AutoComplete
        :value-from="filterData.oemInterval"
        :value-to="filterData.oemIntervalTo"
        label="OEM Interval"
        name="OemInterval"
        :options="listStore.oemIntervalOption"
        @handle-change-from="onOemIntervalSelected"
        @handle-change-to="onOemIntervalToSelected"
      />
      <AutoComplete
        :value-from="filterData.percentageOfOem"
        :value-to="filterData.percentageOfOemTo"
        label="% Of Oem"
        name="PercentageOfOem"
        :options="listStore.percentOfOemOption"
        @handle-change-from="onPercentOfOemSelected"
        @handle-change-to="onPercentOfOemToSelected"
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
import AutoComplete from "@/components/inputs/range-inputs/AutoComplete.vue";
import DatePickerInput from "@/components/inputs/range-inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useComponentStrategyListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-strategy/useComponentStrategyListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-strategy/FilterData";


/* stores */
const listStore = useComponentStrategyListStore();
const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* refs*/
const isVisible = toRef(props, "visibility");
const filterData: ComputedRef<FilterData> = computed(() => {
  return listStore.filterData;
});

/* handlers */
const handleReset = () => {
  handleCloseModal()
  listStore.resetFilter()
};
const handleCloseModal = () => {
  emits("handle-close", false);
};
const onComponentCodeSelected = (value: string) => {
  listStore.setComponentCode(value);
};
const onComponentCodeToSelected = (value: string) => {
  listStore.setComponentCodeTo(value);
};
const onEquipmentModelSelected = (value: string) => {
  listStore.setEquipmentModel(value);
};
const onEquipmentModelToSelected = (value: string) => {
  listStore.setEquipmentModelTo(value);
};
const onModifierCodeSelected = (value: string) => {
  listStore.setModifierCode(value);
};
const onModifierCodeToSelected = (value: string) => {
  listStore.setModifierCodeTo(value);
};
const onTaskTypeSelected = (value: string) => {
  listStore.setTaskType(value);
};
const onTaskTypeToSelected = (value: string) => {
  listStore.setTaskTypeTo(value);
};
const onStrategyTaskDescriptionSelected = (value: string) => {
  listStore.setStrategyTaskDescription(value);
};
const onStrategyTaskDescriptionToSelected = (value: string) => {
  listStore.setStrategyTaskDescriptionTo(value);
};
const onOemIntervalSelected = (value: string) => {
  listStore.setOemInterval(value);
};
const onOemIntervalToSelected = (value: string) => {
  listStore.setOemIntervalTo(value);
};
const onPercentOfOemSelected = (value: string) => {
  listStore.setPercentOfOem(value);
};
const onPercentOfOemToSelected = (value: string) => {
  listStore.setPercentOfOemTo(value);
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
  const checkComponentCode = listStore.lastUsedFilterData.componentCode !== listStore.filterData.componentCode
  const checkComponentCodeTo = listStore.lastUsedFilterData.componentCodeTo !== listStore.filterData.componentCodeTo
  const checkEquipmentModel = listStore.lastUsedFilterData.equipmentModel !== listStore.filterData.equipmentModel
  const checkEquipmentModelTo = listStore.lastUsedFilterData.equipmentModelTo !== listStore.filterData.equipmentModelTo
  const checkModifierCode = listStore.lastUsedFilterData.modifierCode !== listStore.filterData.modifierCode
  const checkModifierCodeTo = listStore.lastUsedFilterData.modifierCodeTo !== listStore.filterData.modifierCodeTo
  const checkTaskType = listStore.lastUsedFilterData.taskType !== listStore.filterData.taskType
  const checkTaskTypeTo = listStore.lastUsedFilterData.taskTypeTo !== listStore.filterData.taskTypeTo
  const checkStrategyTaskDescription = listStore.lastUsedFilterData.strategyTaskDesc !== listStore.filterData.strategyTaskDesc
  const checkStrategyTaskDescriptionTo = listStore.lastUsedFilterData.strategyTaskDescTo !== listStore.filterData.strategyTaskDescTo
  const checkOemInterval = listStore.lastUsedFilterData.oemInterval !== listStore.filterData.oemInterval
  const checkOemIntervalTo = listStore.lastUsedFilterData.oemIntervalTo !== listStore.filterData.oemIntervalTo
  const checkPercentOfOem = listStore.lastUsedFilterData.percentageOfOem !== listStore.filterData.percentageOfOem
  const checkPercentOfOemTo = listStore.lastUsedFilterData.percentageOfOemTo !== listStore.filterData.percentageOfOemTo
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (
    checkComponentCode ||
    checkComponentCodeTo ||
    checkEquipmentModel ||
    checkEquipmentModelTo ||
    checkModifierCode ||
    checkModifierCodeTo ||
    checkTaskType ||
    checkTaskTypeTo ||
    checkStrategyTaskDescription ||
    checkStrategyTaskDescriptionTo ||
    checkOemInterval ||
    checkOemIntervalTo ||
    checkPercentOfOem ||
    checkPercentOfOemTo ||
    checkStartDate ||
    checkStartDateTo ||
    checkEndDate ||
    checkEndDateTo
  )
  emits("handle-close", status);
}
</script>
