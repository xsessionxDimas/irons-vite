<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.type"
        :value-to="filterData.typeTo"
        label="Type"
        name="Type"
        :options="listStore.typeOption"
        @handle-change-from="onTypeSelected"
        @handle-change-to="onTypeToSelected"
     />
      <AutoComplete
        :value-from="filterData.sequential"
        :value-to="filterData.sequentialTo"
        label="Sequential"
        name="Sequential"
        :options="listStore.sequentialOption"
        @handle-change-from="onSequentialSelected"
        @handle-change-to="onSequentialToSelected"
     />
      <!-- <AutoComplete
        :value-from="filterData.operator"
        :value-to="filterData.operatorTo"
        label="Operator"
        name="Operator"
        :options="listStore.operatorOption"
        @handle-change-from="onOperatorSelected"
        @handle-change-to="onOperatorToSelected"
     /> -->
      <AutoComplete
        :value-from="filterData.valueMin"
        :value-to="filterData.valueMinTo"
        label="Value Min"
        name="ValueMin"
        :options="listStore.valueMinOption"
        @handle-change-from="onValueMinSelected"
        @handle-change-to="onValueMinToSelected"
     />
      <AutoComplete
        :value-from="filterData.valueMax"
        :value-to="filterData.valueMaxTo"
        label="Value Max"
        name="ValueMax"
        :options="listStore.valueMaxOption"
        @handle-change-from="onValueMaxSelected"
        @handle-change-to="onValueMaxToSelected"
     />
      <AutoComplete
        :value-from="filterData.uom"
        :value-to="filterData.uomTo"
        label="UOM"
        name="Uom"
        :options="listStore.uomOption"
        @handle-change-from="onUomSelected"
        @handle-change-to="onUomToSelected"
     />
      <AutoComplete
        :value-from="filterData.category"
        :value-to="filterData.categoryTo"
        label="Category"
        name="Category"
        :options="listStore.categoryOption"
        @handle-change-from="onCategorySelected"
        @handle-change-to="onCategoryToSelected"
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
  useComponentCategoryListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-category/useComponentCategoryListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-category/FilterData";


/* stores */
const listStore = useComponentCategoryListStore();
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
const onTypeSelected = (value: string) => {
  listStore.setType(value);
};
const onTypeToSelected = (value: string) => {
  listStore.setTypeTo(value);
};
const onSequentialSelected = (value: string) => {
  listStore.setSequential(value);
};
const onSequentialToSelected = (value: string) => {
  listStore.setSequentialTo(value);
};
const onOperatorSelected = (value: string) => {
  listStore.setOperator(value);
};
const onOperatorToSelected = (value: string) => {
  listStore.setOperatorTo(value);
};
const onValueMinSelected = (value: string) => {
  listStore.setValueMin(value);
};
const onValueMinToSelected = (value: string) => {
  listStore.setValueMinTo(value);
};
const onValueMaxSelected = (value: string) => {
  listStore.setValueMax(value);
};
const onValueMaxToSelected = (value: string) => {
  listStore.setValueMaxTo(value);
};
const onUomSelected = (value: string) => {
  listStore.setUom(value);
};
const onUomToSelected = (value: string) => {
  listStore.setUomTo(value);
};
const onCategorySelected = (value: string) => {
  listStore.setCategory(value);
};
const onCategoryToSelected = (value: string) => {
  listStore.setCategoryTo(value);
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
  const checkType = listStore.lastUsedFilterData.type !== listStore.filterData.type;
  const checkTypeTo = listStore.lastUsedFilterData.typeTo !== listStore.filterData.typeTo;
  const checkSequential = listStore.lastUsedFilterData.sequential !== listStore.filterData.sequential;
  const checkSequentialTo = listStore.lastUsedFilterData.sequentialTo !== listStore.filterData.sequentialTo;
  const checkOperator = listStore.lastUsedFilterData.operator !== listStore.filterData.operator;
  const checkOperatorTo = listStore.lastUsedFilterData.operatorTo !== listStore.filterData.operatorTo;
  const checkValueMin = listStore.lastUsedFilterData.valueMin !== listStore.filterData.valueMin;
  const checkValueMinTo = listStore.lastUsedFilterData.valueMinTo !== listStore.filterData.valueMinTo;
  const checkValueMax = listStore.lastUsedFilterData.valueMax !== listStore.filterData.valueMax;
  const checkValueMaxTo = listStore.lastUsedFilterData.valueMaxTo !== listStore.filterData.valueMaxTo;
  const checkUom = listStore.lastUsedFilterData.uom !== listStore.filterData.uom;
  const checkUomTo = listStore.lastUsedFilterData.uomTo !== listStore.filterData.uomTo;
  const checkCategory = listStore.lastUsedFilterData.category !== listStore.filterData.category;
  const checkCategoryTo = listStore.lastUsedFilterData.categoryTo !== listStore.filterData.categoryTo;
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate;
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo;
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate;
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo;
  const status = (
    checkType ||
    checkTypeTo ||
    checkSequential ||
    checkSequentialTo ||
    checkOperator ||
    checkOperatorTo ||
    checkValueMin ||
    checkValueMinTo ||
    checkValueMax ||
    checkValueMaxTo ||
    checkUom ||
    checkUomTo ||
    checkCategory ||
    checkCategoryTo ||
    checkStartDate ||
    checkStartDateTo ||
    checkEndDate ||
    checkEndDateTo
  )
  emits("handle-close", status);
}
</script>
