<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.interventionStatus"
        :value-to="filterData.interventionStatusTo"
        label="Intervention Status"
        name="InterventionStatus"
        :options="listStore.interventionStatusOption"
        @handle-change-from="onInterventionStatusSelected"
        @handle-change-to="onInterventionStatusToSelected"
     />
      <AutoComplete
        :value-from="filterData.interventionStatusDesc"
        :value-to="filterData.interventionStatusDescTo"
        label="Intervention Status Description"
        name="interventionStatusDesc"
        :options="listStore.interventionStatusDescOption"
        @handle-change-from="onInterventionStatusDescSelected"
        @handle-change-to="onInterventionStatusDescToSelected"
     />
      <AutoComplete
        :value-from="filterData.followUpPriority"
        :value-to="filterData.followUpPriorityTo"
        label="Follow Up Priority"
        name="FollowUpPriority"
        :options="listStore.followUpPriorityOption"
        @handle-change-from="onFollowUpPrioritySelected"
        @handle-change-to="onFollowUpPriorityToSelected"
     />
      <AutoComplete
        :value-from="filterData.followUpPriorityUom"
        :value-to="filterData.followUpPriorityUomTo"
        label="Follow Up Priority Uom"
        name="FollowUpPriorityUom"
        :options="listStore.followUpPriorityUomOption"
        @handle-change-from="onFollowUpPriorityUomSelected"
        @handle-change-to="onFollowUpPriorityUomToSelected"
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
  useInterventionStatusListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/intervention-status/useInterventionStatusListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/intervention-status/FilterData";


/* stores */
const listStore = useInterventionStatusListStore();
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
const onInterventionStatusSelected = (value: string) => {
  listStore.setInterventionStatus(value);
};
const onInterventionStatusToSelected = (value: string) => {
  listStore.setInterventionStatusTo(value);
};
const onInterventionStatusDescSelected = (value: string) => {
  listStore.setInterventionStatusDesc(value);
};
const onInterventionStatusDescToSelected = (value: string) => {
  listStore.setInterventionStatusDescTo(value);
};
const onFollowUpPrioritySelected = (value: string) => {
  listStore.setFollowUpPriority(value);
};
const onFollowUpPriorityToSelected = (value: string) => {
  listStore.setFollowUpPriorityTo(value);
};
const onFollowUpPriorityUomSelected = (value: string) => {
  listStore.setFollowUpPriorityUom(value);
};
const onFollowUpPriorityUomToSelected = (value: string) => {
  listStore.setFollowUpPriorityUomTo(value);
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
  const checkInterventionStatus = listStore.lastUsedFilterData.interventionStatus !== listStore.filterData.interventionStatus;
  const checkInterventionStatusTo = listStore.lastUsedFilterData.interventionStatusTo !== listStore.filterData.interventionStatusTo;
  const checkinterventionStatusDesc = listStore.lastUsedFilterData.interventionStatusDesc !== listStore.filterData.interventionStatusDesc;
  const checkinterventionStatusDescTo = listStore.lastUsedFilterData.interventionStatusDescTo !== listStore.filterData.interventionStatusDescTo;
  const checkFollowUpPriority = listStore.lastUsedFilterData.followUpPriority !== listStore.filterData.followUpPriority;
  const checkFollowUpPriorityTo = listStore.lastUsedFilterData.followUpPriorityTo !== listStore.filterData.followUpPriorityTo;
  const checkFollowUpPriorityUom = listStore.lastUsedFilterData.followUpPriorityUom !== listStore.filterData.followUpPriorityUom;
  const checkFollowUpPriorityUomTo = listStore.lastUsedFilterData.followUpPriorityUomTo !== listStore.filterData.followUpPriorityUomTo;
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (checkInterventionStatus || checkInterventionStatusTo || checkinterventionStatusDesc || checkinterventionStatusDescTo
  || checkFollowUpPriority || checkFollowUpPriorityTo || checkFollowUpPriorityUom || checkFollowUpPriorityUomTo
  || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo)
  emits("handle-close", status);
}
</script>
