<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.site"
        :value-to="filterData.siteTo"
        label="Site"
        name="site"
        :options="listStore.siteOption"
        @handle-change-from="onSiteSelected"
        @handle-change-to="onSiteToSelected"
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
        :value-from="filterData.component"
        :value-to="filterData.componentTo"
        label="Component"
        name="Component"
        :options="listStore.componentOption"
        @handle-change-from="onComponentSelected"
        @handle-change-to="onComponentToSelected"
     />
      <AutoComplete
        :value-from="filterData.componentType"
        :value-to="filterData.componentTypeTo"
        label="Component Type"
        name="ComponentType"
        :options="listStore.componentTypeOption"
        @handle-change-from="onComponentTypeSelected"
        @handle-change-to="onComponentTypeToSelected"
     />
     <AutoComplete
        :value-from="filterData.componentWeight"
        :value-to="filterData.componentWeightTo"
        label="Component Weight"
        name="componentWeight"
        :options="listStore.componentWeightOption"
        @handle-change-from="onComponentWeightSelected"
        @handle-change-to="onComponentWeightToSelected"
      />
     <AutoComplete
        :value-from="filterData.oemInterval"
        :value-to="filterData.oemIntervalTo"
        label="OEM Interval"
        name="oemInterval"
        :options="listStore.oemIntervalOption"
        @handle-change-from="onOemIntervalSelected"
        @handle-change-to="onOemIntervalToSelected"
      />
      <AutoComplete
        :value-from="filterData.bumaAuTarget"
        :value-to="filterData.bumaAuTargetTo"
        label="BUMA AU Target"
        name="bumaAuTarget"
        :options="listStore.bumaAuTargettOption"
        @handle-change-from="onBumaAuTargetSelected"
        @handle-change-to="onBumaAuTargetToSelected"
      />
      <AutoComplete
        :value-from="filterData.maxRiskRank"
        :value-to="filterData.maxRiskRankTo"
        label="Max Risk Rank"
        name="MaxRiskRank"
        :options="listStore.maxRiskRankOption"
        @handle-change-from="onMaxRiskRankSelected"
        @handle-change-to="onMaxRiskRankToSelected"
     />
      <AutoComplete
        :value-from="filterData.revisedRank"
        :value-to="filterData.revisedRankTo"
        label="Revised Rank"
        name="RevisedRank"
        :options="listStore.revisedRankOption"
        @handle-change-from="onRevisedRankSelected"
        @handle-change-to="onRevisedRankToSelected"
     />
      <AutoComplete
        :value-from="filterData.overallRisk"
        :value-to="filterData.overallRiskTo"
        label="Overall Risk"
        name="OverallRisk"
        :options="listStore.overallRiskOption"
        @handle-change-from="onOverallRiskSelected"
        @handle-change-to="onOverallRiskToSelected"
     />
      <AutoComplete
        :value-from="filterData.failureTiming"
        :value-to="filterData.failureTimingTo"
        label="Failure Timing"
        name="FailureTiming"
        :options="listStore.failureTimingOption"
        @handle-change-from="onFailureTimingSelected"
        @handle-change-to="onFailureTimingToSelected"
     />
      <AutoComplete
        :value-from="filterData.systemImpact"
        :value-to="filterData.systemImpactTo"
        label="System Impact"
        name="SystemImpact"
        :options="listStore.systemImpactOption"
        @handle-change-from="onSystemImpactSelected"
        @handle-change-to="onSystemImpactToSelected"
     />
      <AutoComplete
        :value-from="filterData.opsImpact"
        :value-to="filterData.opsImpactTo"
        label="OPS Impact"
        name="OpsImpact"
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
        label="Failure Cost"
        name="FailureCost"
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
  useComponentRiskRatingListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-risk-rating/useComponentRiskRatingListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-risk-rating/FilterData";


/* stores */
const listStore = useComponentRiskRatingListStore();
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
const onEquipmentModelSelected = (value: string) => {
  listStore.setEquipmentModel(value);
};
const onEquipmentModelToSelected = (value: string) => {
  listStore.setEquipmentModelTo(value);
};
const onComponentSelected = (value: string) => {
  listStore.setComponent(value);
};
const onComponentToSelected = (value: string) => {
  listStore.setComponentTo(value);
};
const onComponentTypeSelected = (value: string) => {
  listStore.setComponentType(value);
};
const onComponentTypeToSelected = (value: string) => {
  listStore.setComponentTypeTo(value);
};
const onMaxRiskRankSelected = (value: string) => {
  listStore.setMaxRiskRank(value);
};
const onMaxRiskRankToSelected = (value: string) => {
  listStore.setMaxRiskRankTo(value);
};
const onRevisedRankSelected = (value: string) => {
  listStore.setRevisedRank(value);
};
const onRevisedRankToSelected = (value: string) => {
  listStore.setRevisedRankTo(value);
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
const onSiteSelected = (value: string) => {
  listStore.setSite(value);
};
const onSiteToSelected = (value: string) => {
  listStore.setSiteTo(value);
};
const onOemIntervalSelected = (value: string) => {
  listStore.setOemInterval(value);
};
const onOemIntervalToSelected = (value: string) => {
  listStore.setOemIntervalTo(value);
};
const onBumaAuTargetSelected = (value: string) => {
  listStore.setBumaAuTarget(value);
};
const onBumaAuTargetToSelected = (value: string) => {
  listStore.setBumaAuTargetTo(value);
};
const onComponentWeightSelected = (value: string) => {
  listStore.setComponentWeight(value);
};
const onComponentWeightToSelected = (value: string) => {
  listStore.setComponentWeightTo(value);
}
const handleFilterClick = () => {
  const checkEquipmentModel = listStore.lastUsedFilterData.equipmentModel !== listStore.filterData.equipmentModel;
  const checkEquipmentModelTo = listStore.lastUsedFilterData.equipmentModelTo !== listStore.filterData.equipmentModelTo;
  const checkComponent = listStore.lastUsedFilterData.component !== listStore.filterData.component;
  const checkComponentTo = listStore.lastUsedFilterData.componentTo !== listStore.filterData.componentTo;
  const checkComponentType = listStore.lastUsedFilterData.componentType !== listStore.filterData.componentType;
  const checkComponentTypeTo = listStore.lastUsedFilterData.componentTypeTo !== listStore.filterData.componentTypeTo;
  const checkMaxRiskRank = listStore.lastUsedFilterData.maxRiskRank !== listStore.filterData.maxRiskRank;
  const checkMaxRiskRankTo = listStore.lastUsedFilterData.maxRiskRankTo !== listStore.filterData.maxRiskRankTo;
  const checkRevisedRank = listStore.lastUsedFilterData.revisedRank !== listStore.filterData.revisedRank;
  const checkRevisedRankTo = listStore.lastUsedFilterData.revisedRankTo !== listStore.filterData.revisedRankTo;
  const checkOverallRisk = listStore.lastUsedFilterData.overallRisk !== listStore.filterData.overallRisk;
  const checkOverallRiskTo = listStore.lastUsedFilterData.overallRiskTo !== listStore.filterData.overallRiskTo;
  const checkFailureTiming = listStore.lastUsedFilterData.failureTiming !== listStore.filterData.failureTiming;
  const checkFailureTimingTo = listStore.lastUsedFilterData.failureTimingTo !== listStore.filterData.failureTimingTo;
  const checkSystemImpact = listStore.lastUsedFilterData.systemImpact !== listStore.filterData.systemImpact;
  const checkSystemImpactTo = listStore.lastUsedFilterData.systemImpactTo !== listStore.filterData.systemImpactTo;
  const checkOpsImpact = listStore.lastUsedFilterData.opsImpact !== listStore.filterData.opsImpact;
  const checkOpsImpactTo = listStore.lastUsedFilterData.opsImpactTo !== listStore.filterData.opsImpactTo;
  const checkSupplyRisk = listStore.lastUsedFilterData.supplyRisk !== listStore.filterData.supplyRisk;
  const checkSupplyRiskTo = listStore.lastUsedFilterData.supplyRiskTo !== listStore.filterData.supplyRiskTo;
  const checkFailureCost = listStore.lastUsedFilterData.failureCost !== listStore.filterData.failureCost;
  const checkFailureCostTo = listStore.lastUsedFilterData.failureCostTo !== listStore.filterData.failureCostTo;
  const checkComments = listStore.lastUsedFilterData.comments !== listStore.filterData.comments;
  const checkCommentsTo = listStore.lastUsedFilterData.commentsTo !== listStore.filterData.commentsTo;
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate;
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo;
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate;
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo;
  const checkSite = listStore.lastUsedFilterData.site !== listStore.filterData.site
  const checkSiteTo = listStore.lastUsedFilterData.siteTo !== listStore.filterData.siteTo
  const checkOemInterval = listStore.lastUsedFilterData.oemInterval !== listStore.filterData.oemInterval
  const checkOemIntervalTo = listStore.lastUsedFilterData.oemIntervalTo !== listStore.filterData.oemIntervalTo
  const checkBumaAuTarget = listStore.lastUsedFilterData.bumaAuTarget !== listStore.filterData.bumaAuTarget
  const checkBumaAuTargetTo = listStore.lastUsedFilterData.bumaAuTargetTo !== listStore.filterData.bumaAuTargetTo
  const checkComponentWeight = listStore.lastUsedFilterData.componentWeight !== listStore.filterData.componentWeight
  const checkComponentWeightTo = listStore.lastUsedFilterData.componentWeightTo !== listStore.filterData.componentWeightTo

  const status = (
    checkEquipmentModel ||
    checkEquipmentModelTo ||
    checkComponent ||
    checkComponentTo ||
    checkComponentType ||
    checkComponentTypeTo ||
    checkMaxRiskRank ||
    checkMaxRiskRankTo ||
    checkRevisedRank ||
    checkRevisedRankTo ||
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
    checkEndDateTo ||
    checkSite ||
    checkSiteTo ||
    checkOemInterval ||
    checkOemIntervalTo ||
    checkBumaAuTarget ||
    checkBumaAuTargetTo ||
    checkComponentWeight ||
    checkComponentWeightTo
  )
  emits("handle-close", status);
}
</script>
