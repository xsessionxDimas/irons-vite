<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.idOemInterval"
        :value-to="filterData.idOemIntervalTo"
        label="ID OEM Interval"
        name="IdOemInterval"
        :options="listStore.idOemIntervalOption"
        @handle-change-from="onIdOemIntervalSelected"
        @handle-change-to="onIdOemIntervalToSelected"
     />
      <AutoComplete
        :value-from="filterData.interval"
        :value-to="filterData.intervalTo"
        label="Interval"
        name="Interval"
        :options="listStore.intervalOption"
        @handle-change-from="onIntervalSelected"
        @handle-change-to="onIntervalToSelected"
     />
      <AutoComplete
        :value-from="filterData.value"
        :value-to="filterData.valueTo"
        label="Value"
        name="Value"
        :options="listStore.valueOption"
        @handle-change-from="onValueSelected"
        @handle-change-to="onValueToSelected"
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
  useOemIntervalListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/oem-interval/useOemIntervalListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/oem-interval/FilterData";


/* stores */
const listStore = useOemIntervalListStore();
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
const onIdOemIntervalSelected = (value: string) => {
  listStore.setIdOemInterval(value);
};
const onIdOemIntervalToSelected = (value: string) => {
  listStore.setIdOemIntervalTo(value);
};
const onIntervalSelected = (value: string) => {
  listStore.setInterval(value);
};
const onIntervalToSelected = (value: string) => {
  listStore.setIntervalTo(value);
};
const onValueSelected = (value: string) => {
  listStore.setValue(value);
};
const onValueToSelected = (value: string) => {
  listStore.setValueTo(value);
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
  const checkIdOemInterval = listStore.lastUsedFilterData.idOemInterval !== listStore.filterData.idOemInterval
  const checkIdOemIntervalTo = listStore.lastUsedFilterData.idOemIntervalTo !== listStore.filterData.idOemIntervalTo
  const checkInterval = listStore.lastUsedFilterData.interval !== listStore.filterData.interval
  const checkIntervalTo = listStore.lastUsedFilterData.intervalTo !== listStore.filterData.intervalTo
  const checkValue = listStore.lastUsedFilterData.value !== listStore.filterData.value
  const checkValueTo = listStore.lastUsedFilterData.valueTo !== listStore.filterData.valueTo
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (
    checkIdOemInterval ||
    checkIdOemIntervalTo ||
    checkInterval ||
    checkIntervalTo ||
    checkValue ||
    checkValueTo ||
    checkStartDate ||
    checkStartDateTo ||
    checkEndDate ||
    checkEndDateTo
  )
  emits("handle-close", status);
}
</script>
