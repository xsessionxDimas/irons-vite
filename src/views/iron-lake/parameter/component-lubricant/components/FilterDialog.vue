<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.Component"
        :value-to="filterData.ComponentTo"
        label="Component"
        name="Component"
        :options="formStore.componentFormOption"
        @handle-change-from="onComponentSelected"
        @handle-change-to="onComponentToSelected"
     />
      <AutoComplete
        :value-from="filterData.RecommendedLubricant"
        :value-to="filterData.RecommendedLubricantTo"
        label="Recommended Lubricant"
        name="RecommendedLubricant"
        :options="listStore.recommendedLubricantOption"
        @handle-change-from="onRecommendedLubricantSelected"
        @handle-change-to="onRecommendedLubricantToSelected"
     />
      <AutoComplete
        :value-from="filterData.Value"
        :value-to="filterData.ValueTo"
        label="Value"
        name="Value"
        :options="listStore.valueOption"
        @handle-change-from="onValueSelected"
        @handle-change-to="onValueToSelected"
     />
      <AutoComplete
        :value-from="filterData.Uom"
        :value-to="filterData.UomTo"
        label="Uom"
        name="Uom"
        :options="listStore.uomOption"
        @handle-change-from="onUomSelected"
        @handle-change-to="onUomToSelected"
     />
      <DatePickerInput
        :value-from="filterData.StartDate ? filterData.StartDate.toString() : ''"
        :value-to="filterData.StartDateTo ? filterData.StartDateTo.toString() : ''"
        label="Start Date"
        name="StartDate"
        placeholder="Pick a date"
        @handle-change-from="onStartDateSelected"
        @handle-change-to="onStartDateToSelected" />
      <DatePickerInput
        :value-from="filterData.EndDate ? filterData.EndDate.toString() : ''"
        :value-to="filterData.EndDateTo ? filterData.EndDateTo.toString() : ''"
        label="End Date"
        name="EndDate"
        placeholder="Pick a date"
        @handle-change-from="onEndDateSelected"
        @handle-change-to="onEndDateToSelected" />
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
  useComponentLubricantListStore
} from "@/store/pinia/iron-lake/parameter/component-lubricant/useComponentLubricantListStore";
import {
  useComponentLubricantFormStore
} from "@/store/pinia/iron-lake/parameter/component-lubricant/useComponentLubricantFormStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/component-lubricant/FilterData";

/* stores */
const listStore = useComponentLubricantListStore();
const formStore = useComponentLubricantFormStore();
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
const onComponentSelected = (value: string) => {
  listStore.setComponent(value);
};
const onComponentToSelected = (value: string) => {
  listStore.setComponentTo(value);
};
const onRecommendedLubricantSelected = (value: string) => {
  listStore.setRecommendedLubricant(value);
};
const onRecommendedLubricantToSelected = (value: string) => {
  listStore.setRecommendedLubricantTo(value);
};
const onValueSelected = (value: string) => {
  listStore.setValue(value);
};
const onValueToSelected = (value: string) => {
  listStore.setValueTo(value);
};
const onUomSelected = (value: string) => {
  listStore.setUom(value);
};
const onUomToSelected = (value: string) => {
  listStore.setUomTo(value);
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
  const checkComponent =
    listStore.lastUsedFilterData.Component !==
    listStore.filterData.Component;
  const checkComponentTo =
    listStore.lastUsedFilterData.ComponentTo !==
    listStore.filterData.ComponentTo;
  const checkRecommendedLubricant =
    listStore.lastUsedFilterData.RecommendedLubricant !==
    listStore.filterData.RecommendedLubricant;
  const checkRecommendedLubricantTo =
    listStore.lastUsedFilterData.RecommendedLubricantTo !==
    listStore.filterData.RecommendedLubricantTo;
  const checkValue =
    listStore.lastUsedFilterData.Value !==
    listStore.filterData.Value;
  const checkValueTo =
    listStore.lastUsedFilterData.ValueTo !==
    listStore.filterData.ValueTo;
  const checkUom =
    listStore.lastUsedFilterData.Uom !==
    listStore.filterData.Uom;
  const checkUomTo =
    listStore.lastUsedFilterData.UomTo !==
    listStore.filterData.UomTo;
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
  const status = checkComponent || checkComponentTo || checkRecommendedLubricant || checkRecommendedLubricantTo || checkValue || checkValueTo || checkUom || checkUomTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo;
  emits("handle-close", status);
};
</script>
