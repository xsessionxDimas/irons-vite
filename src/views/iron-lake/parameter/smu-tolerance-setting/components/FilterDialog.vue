<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.Parameter"
          label="Parameter From"
          name=""
          :options="listStore.parameterOption"
          @handle-change="onParameterSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.ParameterTo"
          label="Parameter To"
          name="ParameterTo"
          :options="listStore.parameterOption"
          @handle-change="onParameterToSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.ValueMin"
          label="Value Min From"
          name="ValueMin"
          :options="listStore.valueMinOption"
          @handle-change="onValueMinSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.ValueMinTo"
          label="Value Min To"
          name="ValueMinTo"
          :options="listStore.valueMinOption"
          @handle-change="onValueMinToSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.ValueMax"
          label="Value Max From"
          name="ValueMax"
          :options="listStore.valueMaxOption"
          @handle-change="onValueMaxSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.ValueMaxTo"
          label="Value Max To"
          name="ValueMaxTo"
          :options="listStore.valueMaxOption"
          @handle-change="onValueMaxToSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.Uom"
          label="Uom From"
          name="Uom"
          :options="listStore.uomOption"
          @handle-change="onUomSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.UomTo"
          label="Uom To"
          name="UomTo"
          :options="listStore.uomOption"
          @handle-change="onUomToSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
          :value="filterData.StartDate"
          label="Start Date From"
          name="StartDateFrom"
          placeholder="Pick a date"
          @handleChange="onStartDateSelected" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
          :value="filterData.StartDateTo"
          label="Start Date To"
          name="StartDateFrom"
          placeholder="Pick a date"
          @handleChange="onStartDateToSelected" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
          :value="filterData.EndDate"
          label="End Date"
          name="EndDate"
          placeholder="Pick a date"
          @handleChange="onEndDateSelected" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
          :value="filterData.EndDateTo"
          label="End Date To"
          name="EndDateTo"
          placeholder="Pick a date"
          @handleChange="onEndDateToSelected" />
      </div>
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
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from "vue";
import {
  useSmuToleranceSettingListStore
} from "@/store/pinia/iron-lake/parameter/smu-tolerance-setting/useSmuToleranceSettingListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/smu-tolerance-setting/FilterData";

/* stores */
const listStore = useSmuToleranceSettingListStore();
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
const onParameterSelected = (value: string) => {
  listStore.setParameter(value);
};
const onParameterToSelected = (value: string) => {
  listStore.setParameterTo(value);
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
  const checkParameter =
    listStore.lastUsedFilterData.Parameter !==
    listStore.filterData.Parameter;
  const checkParameterTo =
    listStore.lastUsedFilterData.ParameterTo !==
    listStore.filterData.ParameterTo;
  const checkValueMin =
    listStore.lastUsedFilterData.ValueMin !==
    listStore.filterData.ValueMin;
  const checkValueMinTo =
    listStore.lastUsedFilterData.ValueMinTo !==
    listStore.filterData.ValueMinTo;
  const checkValueMax =
    listStore.lastUsedFilterData.ValueMax !==
    listStore.filterData.ValueMax;
  const checkValueMaxTo =
    listStore.lastUsedFilterData.ValueMaxTo !==
    listStore.filterData.ValueMaxTo;
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
  const status = checkParameter || checkParameterTo || checkValueMin || checkValueMinTo || checkValueMax || checkValueMaxTo || checkUom || checkUomTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo;
  emits("handle-close", status);
};
</script>
