<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.ratingParameter"
        :value-to="filterData.ratingParameterTo"
        label="Rating Parameter"
        name="RatingParameter"
        :options="listStore.ratingParameterOption"
        @handle-change-from="onRatingParameterSelected"
        @handle-change-to="onRatingParameterToSelected"
     />
      <AutoComplete
        :value-from="filterData.ratingCode"
        :value-to="filterData.ratingCodeTo"
        label="Rating Code"
        name="RatingCode"
        :options="listStore.ratingCodeOption"
        @handle-change-from="onRatingCodeSelected"
        @handle-change-to="onRatingCodeToSelected"
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
  useRiskManagementRatingListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/risk-management-rating/useRiskManagementRatingListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/risk-management-rating/FilterData";


/* stores */
const listStore = useRiskManagementRatingListStore();
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
const onRatingParameterSelected = (value: string) => {
  listStore.setRatingParameter(value);
};
const onRatingParameterToSelected = (value: string) => {
  listStore.setRatingParameterTo(value);
};
const onRatingCodeSelected = (value: string) => {
  listStore.setRatingCode(value);
};
const onRatingCodeToSelected = (value: string) => {
  listStore.setRatingCodeTo(value);
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
  const checkRatingParameter = listStore.lastUsedFilterData.ratingParameter !== listStore.filterData.ratingParameter;
  const checkRatingParameterTo = listStore.lastUsedFilterData.ratingParameterTo !== listStore.filterData.ratingParameterTo;
  const checkRatingCode = listStore.lastUsedFilterData.ratingCode !== listStore.filterData.ratingCode;
  const checkRatingCodeTo = listStore.lastUsedFilterData.ratingCodeTo !== listStore.filterData.ratingCodeTo;
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate;
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo;
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate;
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo;
  const status = (
    checkRatingParameter ||
    checkRatingParameterTo ||
    checkRatingCode ||
    checkRatingCodeTo ||
    checkStartDate ||
    checkStartDateTo ||
    checkEndDate ||
    checkEndDateTo
  )
  emits("handle-close", status);
}
</script>
