<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.PlanningPlantId"
        :value-to="filterData.PlanningPlantIdTo"
        label="PlanningPlant ID"
        name="PlanningPlantId"
        :options="listStore.planningPlantIdOption"
        @handle-change-from="onPlanningPlantIdSelected"
        @handle-change-to="onPlanningPlantIdToSelected"
     />
      <DatePickerInput
        :value-from="filterData.StartDate"
        :value-to="filterData.StartDateTo"
        label="Start Date"
        name="StartDate"
        placeholder="Pick a date"
        @handle-change-from="onStartDateSelected"
        @handle-change-to="onStartDateToSelected"
     />
      <DatePickerInput
        :value-from="filterData.EndDate"
        :value-to="filterData.EndDateTo"
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
  usePlanningPlantListStore
} from "@/store/pinia/iron-lake/business-partner/planning-plant/usePlanningPlantListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/planning-plant/FilterData";


/* stores */
const listStore = usePlanningPlantListStore();
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
const onPlanningPlantIdSelected = (value: string) => {
  listStore.setPlanningPlantId(value);
}
const onPlanningPlantIdToSelected = (value: string) => {
  listStore.setPlanningPlantIdTo(value);
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
  const checkPlanningPlantId = listStore.lastUsedFilterData.PlanningPlantId !== listStore.filterData.PlanningPlantId
  const checkPlanningPlantIdTo = listStore.lastUsedFilterData.PlanningPlantIdTo !== listStore.filterData.PlanningPlantIdTo
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const checkStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const checkEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const status = (checkPlanningPlantId || checkPlanningPlantIdTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo)
  emits("handle-close", status);
};
</script>
