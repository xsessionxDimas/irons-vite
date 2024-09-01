<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.cbmType"
        :value-to="filterData.cbmTypeTo"
        label="CBM Type"
        name="cbmType"
        :options="listStore.cbmTypeOption"
        @handle-change-from="onCbmTypeSelected"
        @handle-change-to="onCbmTypeToSelected"
     />
      <AutoComplete
        :value-from="filterData.equipmentModel "
        :value-to="filterData.equipmentModelTo"
        label="Model"
        name="equipmentModel "
        :options="listStore.modelUnitOption"
        @handle-change-from="onModelUnitSelected"
        @handle-change-to="onModelUnitToSelected"
     />
      <AutoComplete
        :value-from="filterData.component"
        :value-to="filterData.componentTo"
        label="Component"
        name="component"
        :options="listStore.componentOption"
        @handle-change-from="onComponentSelected"
        @handle-change-to="onComponentToSelected"
     />
      <AutoComplete
        :value-from="filterData.valueThreshold"
        :value-to="filterData.valueThresholdTo"
        label="Value Threshold"
        name="valueThreshold"
        :options="listStore.valueThresholdOption"
        @handle-change-from="onValueThresholdSelected"
        @handle-change-to="onValueThresholdToSelected"
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
import AutoComplete from "@/components/inputs/range-inputs/v2/AutoComplete.vue";
import DatePickerInput from "@/components/inputs/range-inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useCbmGapThresholdListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-gap-threshold/useCbmGapThresholdListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-gap-threshold/FilterData";


/* stores */
const listStore = useCbmGapThresholdListStore();
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
const onCbmTypeSelected = (value: string) => {
  listStore.setCbmType(value);
};
const onCbmTypeToSelected = (value: string) => {
  listStore.setCbmTypeTo(value);
};
const onModelUnitSelected = (value: string) => {
  listStore.setModelUnit(value);
};
const onModelUnitToSelected = (value: string) => {
  listStore.setModelUnitTo(value);
};
const onComponentSelected = (value: string) => {
  listStore.setComponent(value);
};
const onComponentToSelected = (value: string) => {
  listStore.setComponentTo(value);
};
const onValueThresholdSelected = (value: string) => {
  listStore.setValueThreshold(value);
};
const onValueThresholdToSelected = (value: string) => {
  listStore.setValueThresholdTo(value);
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
  const checkCbmType = listStore.lastUsedFilterData.cbmType !== listStore.filterData.cbmType;
  const checkCbmTypeTo = listStore.lastUsedFilterData.cbmTypeTo !== listStore.filterData.cbmTypeTo;
  const checkModelUnit = listStore.lastUsedFilterData.equipmentModel !== listStore.filterData.equipmentModel;
  const checkModelUnitTo = listStore.lastUsedFilterData.equipmentModelTo !== listStore.filterData.equipmentModelTo;
  const checkComponent = listStore.lastUsedFilterData.component !== listStore.filterData.component;
  const checkComponentTo = listStore.lastUsedFilterData.componentTo !== listStore.filterData.componentTo;
  const checkValueThreshold = listStore.lastUsedFilterData.valueThreshold !== listStore.filterData.valueThreshold;
  const checkValueThresholdTo = listStore.lastUsedFilterData.valueThresholdTo !== listStore.filterData.valueThresholdTo;
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate;
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo;
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate;
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo;
  const status = (checkCbmType || checkCbmTypeTo || checkModelUnit ||
        checkModelUnitTo || checkComponent || checkComponentTo || checkValueThreshold ||
        checkValueThresholdTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo)
  emits("handle-close", status);
}
</script>
