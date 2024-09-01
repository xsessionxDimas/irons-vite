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
        :value-from="filterData.typeDescription"
        :value-to="filterData.typeDescriptionTo"
        label="Type Description"
        name="TypeDescription"
        :options="listStore.typeDescriptionOption"
        @handle-change-from="onTypeDescriptionSelected"
        @handle-change-to="onTypeDescriptionToSelected"
     />
      <AutoComplete
        :value-from="filterData.parameter"
        :value-to="filterData.parameterTo"
        label="Parameter"
        name="Parameter"
        :options="listStore.parameterOption"
        @handle-change-from="onParameterSelected"
        @handle-change-to="onParameterToSelected"
     />
      <AutoComplete
        :value-from="filterData.parameterDescription"
        :value-to="filterData.parameterDescriptionTo"
        label="Parameter Description"
        name="ParameterDescription"
        :options="listStore.parameterDescriptionOption"
        @handle-change-from="onParameterDescriptionSelected"
        @handle-change-to="onParameterDescriptionToSelected"
     />
      <AutoComplete
        :value-from="filterData.parameterGroup"
        :value-to="filterData.parameterGroupTo"
        label="Parameter Group"
        name="ParameterGroup"
        :options="listStore.parameterGroupOption"
        @handle-change-from="onParameterGroupSelected"
        @handle-change-to="onParameterGroupToSelected"
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
  useTypeListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/type/useTypeListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/type/FilterData";


/* stores */
const listStore = useTypeListStore();
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
const onTypeDescriptionSelected = (value: string) => {
  listStore.setTypeDescription(value);
};
const onTypeDescriptionToSelected = (value: string) => {
  listStore.setTypeDescriptionTo(value);
};
const onParameterSelected = (value: string) => {
  listStore.setParameter(value);
};
const onParameterToSelected = (value: string) => {
  listStore.setParameterTo(value);
};
const onParameterDescriptionSelected = (value: string) => {
  listStore.setParameterDescription(value);
};
const onParameterDescriptionToSelected = (value: string) => {
  listStore.setParameterDescriptionTo(value);
};
const onParameterGroupSelected = (value: string) => {
  listStore.setParameterGroup(value);
};
const onParameterGroupToSelected = (value: string) => {
  listStore.setParameterGroupTo(value);
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
  const checkType = listStore.lastUsedFilterData.type !== listStore.filterData.type
  const checkTypeTo = listStore.lastUsedFilterData.typeTo !== listStore.filterData.typeTo
  const checkTypeDescription = listStore.lastUsedFilterData.typeDescription !== listStore.filterData.typeDescription
  const checkTypeDescriptionTo = listStore.lastUsedFilterData.typeDescriptionTo !== listStore.filterData.typeDescriptionTo
  const checkParameter = listStore.lastUsedFilterData.parameter !== listStore.filterData.parameter
  const checkParameterTo = listStore.lastUsedFilterData.parameterTo !== listStore.filterData.parameterTo
  const checkParameterDescription = listStore.lastUsedFilterData.parameterDescription !== listStore.filterData.parameterDescription
  const checkParameterDescriptionTo = listStore.lastUsedFilterData.parameterDescriptionTo !== listStore.filterData.parameterDescriptionTo
  const checkParameterGroup = listStore.lastUsedFilterData.parameterGroup !== listStore.filterData.parameterGroup
  const checkParameterGroupTo = listStore.lastUsedFilterData.parameterGroupTo !== listStore.filterData.parameterGroupTo
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (
    checkType ||
    checkTypeTo ||
    checkTypeDescription ||
    checkTypeDescriptionTo ||
    checkParameter ||
    checkParameterTo ||
    checkParameterDescription ||
    checkParameterDescriptionTo ||
    checkParameterGroup ||
    checkParameterGroupTo ||
    checkStartDate ||
    checkStartDateTo ||
    checkEndDate ||
    checkEndDateTo
  )
  emits("handle-close", status);
}
</script>
