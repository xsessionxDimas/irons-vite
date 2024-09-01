<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.maxRiskRank"
        :value-to="filterData.maxRiskRankTo"
        label="Max Risk Ranked Interval"
        name="MaxRiskRank"
        :options="listStore.maxRiskRankOption"
        @handle-change-from="onMaxRiskRankSelected"
        @handle-change-to="onMaxRiskRankToSelected"
     />
      <AutoComplete
        :value-from="filterData.revisedRisk"
        :value-to="filterData.revisedRiskTo"
        label="Revised Risk Rating"
        name="RevisedRiskRating"
        :options="listStore.revisedRiskOption"
        @handle-change-from="onRevisedRiskSelected"
        @handle-change-to="onRevisedRiskToSelected"
     />
      <AutoComplete
        :value-from="filterData.overallRisk"
        :value-to="filterData.overallRiskTo"
        label="Overall Risk Rating"
        name="OverallRiskRating"
        :options="listStore.overallRiskOption"
        @handle-change-from="onOverallRiskSelected"
        @handle-change-to="onOverallRiskToSelected"
     />
      <AutoComplete
        :value-from="filterData.failureTiming"
        :value-to="filterData.failureTimingTo"
        label="Failure Timing Risk"
        name="FailureTimingRisk"
        :options="listStore.failureTimingOption"
        @handle-change-from="onFailureTimingSelected"
        @handle-change-to="onFailureTimingToSelected"
     />
      <AutoComplete
        :value-from="filterData.systemImpact"
        :value-to="filterData.systemImpactTo"
        label="System Impact Risk"
        name="SystemImpactRisk"
        :options="listStore.systemImpactOption"
        @handle-change-from="onSystemImpactSelected"
        @handle-change-to="onSystemImpactToSelected"
     />
      <AutoComplete
        :value-from="filterData.opsImpact"
        :value-to="filterData.opsImpactTo"
        label="Ops Impact Risk"
        name="OpsImpactRisk"
        :options="listStore.opsImpactOption"
        @handle-change-from="onOpsImpactSelected"
        @handle-change-to="onOpsImpactToSelected"
     />
      <AutoComplete
        :value-from="filterData.supplyRisk"
        :value-to="filterData.supplyRiskTo"
        label="Supply Risk"
        name="SupplyRisk"
        :options="listStore.supplyRiskOption"
        @handle-change-from="onSupplyRiskSelected"
        @handle-change-to="onSupplyRiskToSelected"
     />
      <AutoComplete
        :value-from="filterData.failureCost"
        :value-to="filterData.failureCostTo"
        label="Failure Cost Risk"
        name="FailureCostRisk"
        :options="listStore.failureCostOption"
        @handle-change-from="onFailureCostSelected"
        @handle-change-to="onFailureCostToSelected"
     />
      <AutoComplete
        :value-from="filterData.comments"
        :value-to="filterData.commentsTo"
        label="Comments"
        name="Comments"
        :options="listStore.commentsOption"
        @handle-change-from="onCommentsSelected"
        @handle-change-to="onCommentsToSelected"
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
  useRiskRankMaterialListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/risk-rank-material/useRiskRankMaterialListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/risk-rank-material/FilterData";


/* stores */
const listStore = useRiskRankMaterialListStore();
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
const onMaxRiskRankSelected = (value: string) => {
  listStore.setMaxRiskRank(value);
};
const onMaxRiskRankToSelected = (value: string) => {
  listStore.setMaxRiskRankTo(value);
};
const onRevisedRiskSelected = (value: string) => {
  listStore.setRevisedRisk(value);
};
const onRevisedRiskToSelected = (value: string) => {
  listStore.setRevisedRiskTo(value);
};
const onOverallRiskSelected = (value: string) => {
  listStore.setOverallRisk(value);
};
const onOverallRiskToSelected = (value: string) => {
  listStore.setOverallRiskTo(value);
};
const onFailureTimingSelected = (value: string) => {
  listStore.setFailureTiming(value);
};
const onFailureTimingToSelected = (value: string) => {
  listStore.setFailureTimingTo(value);
};
const onSystemImpactSelected = (value: string) => {
  listStore.setSystemImpact(value);
};
const onSystemImpactToSelected = (value: string) => {
  listStore.setSystemImpactTo(value);
};
const onOpsImpactSelected = (value: string) => {
  listStore.setOpsImpact(value);
};
const onOpsImpactToSelected = (value: string) => {
  listStore.setOpsImpactTo(value);
};
const onSupplyRiskSelected = (value: string) => {
  listStore.setSupplyRisk(value);
};
const onSupplyRiskToSelected = (value: string) => {
  listStore.setSupplyRiskTo(value);
};
const onFailureCostSelected = (value: string) => {
  listStore.setFailureCost(value);
};
const onFailureCostToSelected = (value: string) => {
  listStore.setFailureCostTo(value);
};
const onCommentsSelected = (value: string) => {
  listStore.setComments(value);
};
const onCommentsToSelected = (value: string) => {
  listStore.setCommentsTo(value);
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
  const checkMaxRiskRank = listStore.lastUsedFilterData.maxRiskRank !== listStore.filterData.maxRiskRank
  const checkMaxRiskRankTo = listStore.lastUsedFilterData.maxRiskRankTo !== listStore.filterData.maxRiskRankTo
  const checkRevisedRisk = listStore.lastUsedFilterData.revisedRisk !== listStore.filterData.revisedRisk
  const checkRevisedRiskTo = listStore.lastUsedFilterData.revisedRiskTo !== listStore.filterData.revisedRiskTo
  const checkOverallRisk = listStore.lastUsedFilterData.overallRisk !== listStore.filterData.overallRisk
  const checkOverallRiskTo = listStore.lastUsedFilterData.overallRiskTo !== listStore.filterData.overallRiskTo
  const checkFailureTiming = listStore.lastUsedFilterData.failureTiming !== listStore.filterData.failureTiming
  const checkFailureTimingTo = listStore.lastUsedFilterData.failureTimingTo !== listStore.filterData.failureTimingTo
  const checkSystemImpact = listStore.lastUsedFilterData.systemImpact !== listStore.filterData.systemImpact
  const checkSystemImpactTo = listStore.lastUsedFilterData.systemImpactTo !== listStore.filterData.systemImpactTo
  const checkOpsImpact = listStore.lastUsedFilterData.opsImpact !== listStore.filterData.opsImpact
  const checkOpsImpactTo = listStore.lastUsedFilterData.opsImpactTo !== listStore.filterData.opsImpactTo
  const checkSupplyRisk = listStore.lastUsedFilterData.supplyRisk !== listStore.filterData.supplyRisk
  const checkSupplyRiskTo = listStore.lastUsedFilterData.supplyRiskTo !== listStore.filterData.supplyRiskTo
  const checkFailureCost = listStore.lastUsedFilterData.failureCost !== listStore.filterData.failureCost
  const checkFailureCostTo = listStore.lastUsedFilterData.failureCostTo !== listStore.filterData.failureCostTo
  const checkComments = listStore.lastUsedFilterData.comments !== listStore.filterData.comments
  const checkCommentsTo = listStore.lastUsedFilterData.commentsTo !== listStore.filterData.commentsTo
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (
    checkMaxRiskRank ||
    checkMaxRiskRankTo ||
    checkRevisedRisk ||
    checkRevisedRiskTo ||
    checkOverallRisk ||
    checkOverallRiskTo ||
    checkFailureTiming ||
    checkFailureTimingTo ||
    checkSystemImpact ||
    checkSystemImpactTo ||
    checkOpsImpact ||
    checkOpsImpactTo ||
    checkSupplyRisk ||
    checkSupplyRiskTo ||
    checkFailureCost ||
    checkFailureCostTo ||
    checkComments ||
    checkCommentsTo ||
    checkStartDate ||
    checkStartDateTo ||
    checkEndDate ||
    checkEndDateTo
  )
  emits("handle-close", status);
}
</script>
