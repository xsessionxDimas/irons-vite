<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.cbmGroup"
        :value-to="filterData.cbmGroupTo"
        label="CBM Group"
        name="cbmGroup"
        :options="listStore.cbmGroupOption"
        @handle-change-from="onCbmGroupSelected"
        @handle-change-to="onCbmGroupToSelected"
     />
      <!-- <AutoComplete
        :value-from="filterData.parameter"
        :value-to="filterData.parameterTo"
        label="Parameter"
        name="parameter "
        :options="listStore.parameterOption"
        @handle-change-from="onParameterSelected"
        @handle-change-to="onParameterToSelected"
     /> -->
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
        :value-from="filterData.cluster"
        :value-to="filterData.clusterTo"
        label="Cluster"
        name="cluster"
        :options="listStore.clusterOption"
        @handle-change-from="onClusterSelected"
        @handle-change-to="onClusterToSelected"
     />
      <AutoComplete
        :value-from="filterData.sampleCount"
        :value-to="filterData.sampleCountTo"
        label="Sample Count"
        name="sampleCount"
        :options="listStore.sampleCountOption"
        @handle-change-from="onSampleCountSelected"
        @handle-change-to="onSampleCountToSelected"
     />
      <AutoComplete
        :value-from="filterData.sampleWeight"
        :value-to="filterData.sampleWeightTo"
        label="Weight"
        name="sampleWeight"
        :options="listStore.sampleWeightOption"
        @handle-change-from="onSampleWeightSelected"
        @handle-change-to="onSampleWeightToSelected"
     />
      <AutoComplete
        :value-from="filterData.cautionLimit"
        :value-to="filterData.cautionLimitTo"
        label="Caution Limit"
        name="cautionLimit"
        :options="listStore.cautionLimitOption"
        @handle-change-from="onCautionLimitSelected"
        @handle-change-to="onCautionLimitToSelected"
     />
      <AutoComplete
        :value-from="filterData.criticalLimit"
        :value-to="filterData.criticalLimitTo"
        label="Critical Limit"
        name="criticalLimit"
        :options="listStore.criticalLimitOption"
        @handle-change-from="onCriticalLimitSelected"
        @handle-change-to="onCriticalLimitToSelected"
     />
      <!-- <AutoComplete
        :value-from="filterData.summaryWeight"
        :value-to="filterData.summaryWeightTo"
        label="Summary Weight"
        name="summaryWeight"
        :options="listStore.summaryWeightOption"
        @handle-change-from="onSummaryWeightSelected"
        @handle-change-to="onSummaryWeightToSelected"
     /> -->
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
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  useCbmStatusListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-status/useCbmStatusListStore";
import {
  FilterDataSpecific
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-status/FilterData";


/* stores */
const listStore = useCbmStatusListStore();
const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* refs*/
const isVisible = toRef(props, "visibility");
const filterData: ComputedRef<FilterDataSpecific> = computed(() => {
  return listStore.filterDataSpecific;
});

/* handlers */
const handleReset = () => {
  handleCloseModal()
  listStore.resetFilter()
};
const handleCloseModal = () => {
  emits("handle-close", false);
};
const onCbmGroupSelected = (value: string) => {
  listStore.setCbmGroup(value);
};
const onCbmGroupToSelected = (value: string) => {
  listStore.setCbmGroupTo(value);
};
const onParameterSelected = (value: string) => {
  listStore.setParameter(value);
};
const onParameterToSelected = (value: string) => {
  listStore.setParameterTo(value);
};
const onComponentSelected = (value: string) => {
  listStore.setComponent(value);
};
const onComponentToSelected = (value: string) => {
  listStore.setComponentTo(value);
};
const onClusterSelected = (value: string) => {
  listStore.setCluster(value);
};
const onClusterToSelected = (value: string) => {
  listStore.setClusterTo(value);
};
const onSampleCountSelected = (value: string) => {
  listStore.setSampleCount(value);
};
const onSampleCountToSelected = (value: string) => {
  listStore.setSampleCountTo(value);
};
const onSampleWeightSelected = (value: string) => {
  listStore.setSampleWeight(value);
};
const onSampleWeightToSelected = (value: string) => {
  listStore.setSampleWeightTo(value);
};
const onCautionLimitSelected = (value: string) => {
  listStore.setCautionLimit(value);
};
const onCautionLimitToSelected = (value: string) => {
  listStore.setCautionLimitTo(value);
};
const onCriticalLimitSelected = (value: string) => {
  listStore.setCriticalLimit(value);
};
const onCriticalLimitToSelected = (value: string) => {
  listStore.setCriticalLimitTo(value);
};
const onSummaryWeightSelected = (value: string) => {
  listStore.setSummaryWeight(value);
};
const onSummaryWeightToSelected = (value: string) => {
  listStore.setSummaryWeightTo(value);
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
  const checkCbmGroup = listStore.lastUsedFilterDataSpecific.cbmGroup !== listStore.filterDataSpecific.cbmGroup;
  const checkCbmGroupTo = listStore.lastUsedFilterDataSpecific.cbmGroupTo !== listStore.filterDataSpecific.cbmGroupTo;
  const checkComponent = listStore.lastUsedFilterDataSpecific.component !== listStore.filterDataSpecific.component;
  const checkComponentTo = listStore.lastUsedFilterDataSpecific.componentTo !== listStore.filterDataSpecific.componentTo;
  const checkParameter = listStore.lastUsedFilterDataSpecific.parameter !== listStore.filterDataSpecific.parameter;
  const checkParameterTo = listStore.lastUsedFilterDataSpecific.parameterTo !== listStore.filterDataSpecific.parameterTo;
  const checkCluster = listStore.lastUsedFilterDataSpecific.cluster !== listStore.filterDataSpecific.cluster;
  const checkClusterTo = listStore.lastUsedFilterDataSpecific.clusterTo !== listStore.filterDataSpecific.clusterTo;
  const checkSampleCount = listStore.lastUsedFilterDataSpecific.sampleCount !== listStore.filterDataSpecific.sampleCount;
  const checkSampleCountTo = listStore.lastUsedFilterDataSpecific.sampleCountTo !== listStore.filterDataSpecific.sampleCountTo;
  const checkSampleWeight = listStore.lastUsedFilterDataSpecific.sampleWeight !== listStore.filterDataSpecific.sampleWeight;
  const checkSampleWeightTo = listStore.lastUsedFilterDataSpecific.sampleWeightTo !== listStore.filterDataSpecific.sampleWeightTo;
  const checkCautionLimit = listStore.lastUsedFilterDataSpecific.cautionLimit !== listStore.filterDataSpecific.cautionLimit;
  const checkCautionLimitTo = listStore.lastUsedFilterDataSpecific.cautionLimitTo !== listStore.filterDataSpecific.cautionLimitTo;
  const checkCriticalLimit = listStore.lastUsedFilterDataSpecific.criticalLimit !== listStore.filterDataSpecific.criticalLimit;
  const checkCriticalLimitTo = listStore.lastUsedFilterDataSpecific.criticalLimitTo !== listStore.filterDataSpecific.criticalLimitTo;
  const checkSummaryWeight = listStore.lastUsedFilterDataSpecific.summaryWeight !== listStore.filterDataSpecific.summaryWeight;
  const checkSummaryWeightTo = listStore.lastUsedFilterDataSpecific.summaryWeightTo !== listStore.filterDataSpecific.summaryWeightTo;
  const checkStartDate = listStore.lastUsedFilterDataSpecific.startDate !== listStore.filterDataSpecific.startDate;
  const checkStartDateTo = listStore.lastUsedFilterDataSpecific.startDateTo !== listStore.filterDataSpecific.startDateTo;
  const checkEndDate = listStore.lastUsedFilterDataSpecific.endDate !== listStore.filterDataSpecific.endDate;
  const checkEndDateTo = listStore.lastUsedFilterDataSpecific.endDateTo !== listStore.filterDataSpecific.endDateTo;
  const status = (checkCbmGroup || checkCbmGroupTo || checkComponent || checkComponentTo || checkParameter ||
        checkParameterTo || checkCluster || checkClusterTo || checkSampleCount ||
        checkSampleCountTo || checkSampleWeight || checkSampleWeightTo || checkCautionLimit ||
        checkCautionLimitTo || checkCriticalLimit || checkCriticalLimitTo || checkSummaryWeight || checkSummaryWeightTo ||
        checkStartDate || checkStartDateTo || checkEndDate ||
        checkEndDateTo)
  emits("handle-close", status);
}
</script>
