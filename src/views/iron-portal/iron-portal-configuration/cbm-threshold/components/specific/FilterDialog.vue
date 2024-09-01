<template>
  <el-dialog
    v-model="isVisible"
    title="Filter Data"
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
        @handle-change-from="onOmsTypeSelected"
        @handle-change-to="onOmsTypeToSelected"
      />
      <AutoComplete
        :value-from="filterData.site"
        :value-to="filterData.siteTo"
        label="Site"
        name="Site"
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
        :value-from="filterData.parameterFrom"
        :value-to="filterData.parameterFromTo"
        label="Parameter From"
        name="parameterFrom"
        :options="listStore.parameterFromOption"
        @handle-change-from="onParameterFromSelected"
        @handle-change-to="onParameterFromToSelected"
      />
      <AutoComplete
        :value-from="filterData.parameterTo"
        :value-to="filterData.parameterToTo"
        label="Parameter To"
        name="parameterTo"
        :options="listStore.parameterToOption"
        @handle-change-from="onParameterToSelected"
        @handle-change-to="onParameterToToSelected"
      />
     <AutoComplete
        :value-from="filterData.registerNumber"
        :value-to="filterData.registerNumberTo"
        label="Register Number"
        name="registerNumber"
        :options="listStore.registerNumberOption"
        @handle-change-from="onRegisterNumberSelected"
        @handle-change-to="onRegisterNumberToSelected"
      />
      <AutoComplete
        :value-from="filterData.severityLevel"
        :value-to="filterData.severityLevelTo"
        label="Severity Level"
        name="severityLevel"
        :options="listStore.severityLevelOption"
        @handle-change-from="onSeverityLevelSelected"
        @handle-change-to="onSeverityLevelToSelected"
      />
      <AutoComplete
        :value-from="filterData.uomFrom"
        :value-to="filterData.uomFromTo"
        label="Uom From"
        name="uomFrom"
        :options="listStore.uomFromOption"
        @handle-change-from="onUomFromSelected"
        @handle-change-to="onUomFromToSelected"
      />
      <AutoComplete
        :value-from="filterData.uomTo"
        :value-to="filterData.uomToTo"
        label="Uom To"
        name="uomTo"
        :options="listStore.uomToOption"
        @handle-change-from="onUomToSelected"
        @handle-change-to="onUomToToSelected"
      />
      <AutoComplete
        :value-from="filterData.uomConvertRatio"
        :value-to="filterData.uomConvertRatioTo"
        label="Uom Convert Ratio"
        name="uomConvertRatio"
        :options="listStore.uomConvertRatioOption"
        @handle-change-from="onUomConvertRatioSelected"
        @handle-change-to="onUomConvertRatioToSelected"
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
import SelectInput from "@/components/inputs/SelectInput.vue";
import DatePickerInput from "@/components/inputs/range-inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useCbmThresholdListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-threshold/useCbmThresholdListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-threshold/FilterData";


/* stores */
const listStore = useCbmThresholdListStore();
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
const onSiteSelected = (value: string) => {
  listStore.setSite(value);
};
const onSiteToSelected = (value: string) => {
  listStore.setSiteTo(value);
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
const onOmsTypeSelected = (value: string) => {
  listStore.setCbmType(value);
};
const onOmsTypeToSelected = (value: string) => {
  listStore.setCbmTypeTo(value);
};
const onRegisterNumberSelected = (value: string) => {
  listStore.setRegisterNumber(value);
};
const onRegisterNumberToSelected = (value: string) => {
  listStore.setRegisterNumberTo(value);
};
const onParameterFromSelected = (value: string) => {
  listStore.setParameterFrom(value);
};
const onParameterFromToSelected = (value: string) => {
  listStore.setParameterFromTo(value);
};
const onParameterToSelected = (value: string) => {
  listStore.setParameterTo(value);
};
const onParameterToToSelected = (value: string) => {
  listStore.setParameterToTo(value);
};
const onSeverityLevelSelected = (value: string) => {
  listStore.setSeverityLevel(value);
};
const onSeverityLevelToSelected = (value: string) => {
  listStore.setSeverityLevelTo(value);
};
const onUomFromSelected = (value: string) => {
  listStore.setUomFrom(value);
};
const onUomFromToSelected = (value: string) => {
  listStore.setUomFromTo(value);
};
const onUomToSelected = (value: string) => {
  listStore.setUomTo(value);
};
const onUomToToSelected = (value: string) => {
  listStore.setUomToTo(value);
};
const onUomConvertRatioSelected = (value: string) => {
  listStore.setUomConvertRatio(value);
};
const onUomConvertRatioToSelected = (value: string) => {
  listStore.setUomConvertRatioTo(value);
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
  const checkSite = listStore.lastUsedFilterData.site !== listStore.filterData.site;
  const checkSiteTo = listStore.lastUsedFilterData.siteTo !== listStore.filterData.siteTo;
  const checkEquipmentModel = listStore.lastUsedFilterData.equipmentModel !== listStore.filterData.equipmentModel;
  const checkEquipmentModelTo = listStore.lastUsedFilterData.equipmentModelTo !== listStore.filterData.equipmentModelTo;
  const checkComponent = listStore.lastUsedFilterData.component !== listStore.filterData.component;
  const checkComponentTo = listStore.lastUsedFilterData.componentTo !== listStore.filterData.componentTo;
  const checkOmsType = listStore.lastUsedFilterData.cbmType !== listStore.filterData.cbmType;
  const checkOmsTypeTo = listStore.lastUsedFilterData.cbmTypeTo !== listStore.filterData.cbmTypeTo;
  const checkRegisterNumber = listStore.lastUsedFilterData.registerNumber !== listStore.filterData.registerNumber;
  const checkRegisterNumberTo = listStore.lastUsedFilterData.registerNumberTo !== listStore.filterData.registerNumberTo;
  const checkParameterFrom = listStore.lastUsedFilterData.parameterFrom !== listStore.filterData.parameterFrom;
  const checkParameterFromTo = listStore.lastUsedFilterData.parameterFromTo !== listStore.filterData.parameterFromTo;
  const checkParameterTo = listStore.lastUsedFilterData.parameterTo !== listStore.filterData.parameterTo;
  const checkParameterToTo = listStore.lastUsedFilterData.parameterToTo !== listStore.filterData.parameterToTo;
  const checkSeverityLevel = listStore.lastUsedFilterData.severityLevel !== listStore.filterData.severityLevel;
  const checkSeverityLevelTo = listStore.lastUsedFilterData.severityLevelTo !== listStore.filterData.severityLevelTo;
  const checkUomFrom = listStore.lastUsedFilterData.uomFrom !== listStore.filterData.uomFrom;
  const checkUomFromTo = listStore.lastUsedFilterData.uomFromTo !== listStore.filterData.uomFromTo;
  const checkUomTo = listStore.lastUsedFilterData.uomTo !== listStore.filterData.uomTo;
  const checkUomToTo = listStore.lastUsedFilterData.uomToTo !== listStore.filterData.uomToTo;
  const checkUomConvertRatio = listStore.lastUsedFilterData.uomConvertRatio !== listStore.filterData.uomConvertRatio;
  const checkUomConvertRatioTo = listStore.lastUsedFilterData.uomConvertRatioTo !== listStore.filterData.uomConvertRatioTo;
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (checkSite || checkSiteTo || checkComponent || checkComponentTo || checkOmsType || checkEquipmentModel || checkEquipmentModelTo
        || checkOmsTypeTo || checkRegisterNumber || checkRegisterNumberTo || checkParameterFrom || checkParameterTo || checkParameterToTo
        || checkParameterFromTo || checkSeverityLevel
        || checkSeverityLevelTo || checkUomFrom || checkUomFromTo || checkUomTo || checkUomToTo
        || checkUomConvertRatio || checkUomConvertRatioTo
        || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo)
  emits("handle-close", status);
}
</script>
