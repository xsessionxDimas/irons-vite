<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.equipmentModel"
        :value-to="filterData.equipmentModelTo"
        label="Equipment Model"
        name="Equipment Model"
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
        :value-from="filterData.element"
        :value-to="filterData.elementTo"
        label="Element"
        name="Element"
        :options="listStore.elementOption"
        @handle-change-from="onElementSelected"
        @handle-change-to="onElementToSelected"
     />
      <AutoComplete
        :value-from="filterData.rating"
        :value-to="filterData.ratingTo"
        label="Rating Description"
        name="rating"
        :options="listStore.ratingDescOption"
        @handle-change-from="onRatingDescSelected"
        @handle-change-to="onRatingDescToSelected"
     />
      <AutoComplete
        :value-from="filterData.operatorMin"
        :value-to="filterData.operatorMinTo"
        label="Operator Min"
        name="operatorMin"
        :options="listStore.operatorMinOption"
        @handle-change-from="onOperatorMinSelected"
        @handle-change-to="onOperatorMinToSelected"
     />
      <AutoComplete
        :value-from="filterData.valueMin"
        :value-to="filterData.valueMinTo"
        label="Value Min"
        name="valueMin"
        :options="listStore.valueMinOption"
        @handle-change-from="onValueMinSelected"
        @handle-change-to="onValueMinToSelected"
     />
      <AutoComplete
        :value-from="filterData.operatorMax"
        :value-to="filterData.operatorMaxTo"
        label="Operator Max"
        name="operatorMax"
        :options="listStore.operatorMaxOption"
        @handle-change-from="onOperatorMaxSelected"
        @handle-change-to="onOperatorMaxToSelected"
     />
      <AutoComplete
        :value-from="filterData.valueMax"
        :value-to="filterData.valueMaxTo"
        label="Value Max"
        name="valueMax"
        :options="listStore.valueMaxOption"
        @handle-change-from="onValueMaxSelected"
        @handle-change-to="onValueMaxToSelected"
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
import DatePickerInput from "@/components/inputs/range-inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useMappingSosBiListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/mapping-sos-bi/useMappingSosBiListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/mapping-sos-bi/FilterData";


/* stores */
const listStore = useMappingSosBiListStore();
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
const onElementSelected = (value: string) => {
  listStore.setElement(value);
};
const onElementToSelected = (value: string) => {
  listStore.setElementTo(value);
};
const onRatingDescSelected = (value: string) => {
  listStore.setRatingDesc(value);
};
const onRatingDescToSelected = (value: string) => {
  listStore.setRatingDescTo(value);
};
const onOperatorMinSelected = (value: string) => {
  listStore.setOperatorMin(value);
};
const onOperatorMinToSelected = (value: string) => {
  listStore.setOperatorMinTo(value);
};
const onValueMinSelected = (value: string) => {
  listStore.setValueMin(value);
};
const onValueMinToSelected = (value: string) => {
  listStore.setValueMinTo(value);
};
const onOperatorMaxSelected = (value: string) => {
  listStore.setOperatorMax(value);
};
const onOperatorMaxToSelected = (value: string) => {
  listStore.setOperatorMaxTo(value);
};
const onValueMaxSelected = (value: string) => {
  listStore.setValueMax(value);
};
const onValueMaxToSelected = (value: string) => {
  listStore.setValueMaxTo(value);
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
  const checkEquipmentModel = listStore.lastUsedFilterData.equipmentModel !== listStore.filterData.equipmentModel
  const checkEquipmentModelTo = listStore.lastUsedFilterData.equipmentModelTo !== listStore.filterData.equipmentModelTo
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkComponent = listStore.lastUsedFilterData.component !== listStore.filterData.component
  const checkComponentTo = listStore.lastUsedFilterData.componentTo !== listStore.filterData.componentTo
  const checkElement = listStore.lastUsedFilterData.element !== listStore.filterData.element
  const checkElementTo = listStore.lastUsedFilterData.elementTo !== listStore.filterData.elementTo
  const checkRatingDesc = listStore.lastUsedFilterData.rating !== listStore.filterData.rating
  const checkRatingDescTo = listStore.lastUsedFilterData.ratingTo !== listStore.filterData.ratingTo
  const checkOperatorMin = listStore.lastUsedFilterData.operatorMin !== listStore.filterData.operatorMin
  const checkOperatorMinTo = listStore.lastUsedFilterData.operatorMinTo !== listStore.filterData.operatorMinTo
  const checkValueMin = listStore.lastUsedFilterData.valueMin !== listStore.filterData.valueMin
  const checkValueMinTo = listStore.lastUsedFilterData.valueMinTo !== listStore.filterData.valueMinTo
  const checkOperatorMax = listStore.lastUsedFilterData.operatorMax !== listStore.filterData.operatorMax
  const checkOperatorMaxTo = listStore.lastUsedFilterData.operatorMaxTo !== listStore.filterData.operatorMaxTo
  const checkValueMax = listStore.lastUsedFilterData.valueMax !== listStore.filterData.valueMax
  const checkValueMaxTo = listStore.lastUsedFilterData.valueMaxTo !== listStore.filterData.valueMaxTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (checkEquipmentModel || checkEquipmentModelTo || checkComponent || checkComponentTo || checkElement || checkElementTo || checkRatingDesc ||
        checkRatingDescTo || checkOperatorMin || checkOperatorMinTo || checkValueMin || checkValueMinTo ||
        checkOperatorMax || checkOperatorMaxTo || checkValueMax ||
        checkValueMaxTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo)
  emits("handle-close", status);
}
</script>
