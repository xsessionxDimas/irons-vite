<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <div class="w-100 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value-from="filterData.ComponentType"
          :value-to="filterData.ComponentTypeTo"
          label="Component Type"
          name="ComponentType"
          :options="listStore.componentTypeOption"
          @handle-change-from="onComponentTypeSelected"
          @handle-change-to="onComponentTypeToSelected"
       />
      </div>
      <div class="w-100 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value-from="filterData.Component"
          :value-to="filterData.ComponentTo"
          label="Component"
          name="Component"
          :options="listStore.componentOption"
          @handle-change-from="onComponentSelected"
          @handle-change-to="onComponentToSelected"
       />
      </div>
      <div class="w-100 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value-from="filterData.Equipment"
          :value-to="filterData.EquipmentTo"
          label="Equipment"
          name="Equipment"
          :options="listStore.equipmentOption"
          @handle-change-from="onEquipmentSelected"
          @handle-change-to="onEquipmentToSelected"
       />
      </div>
      <div class="w-100 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value-from="filterData.ObjectType"
          :value-to="filterData.ObjectTypeTo"
          label="ObjectType"
          name="ObjectType"
          :options="listStore.objectTypeOption"
          @handle-change-from="onObjectTypeSelected"
          @handle-change-to="onObjectTypeToSelected"
       />
      </div>
      <div class="w-100 fv-row fv-plugins-icon-container">
        <DatePicker
            :value-from="filterData.StartDate"
            :value-to="filterData.StartDateTo"
            placeholder="Add Start Date"
            label="Start Date"
            name="StartDate"
            @handle-change-from="onStartDateSelected"
            @handle-change-to="onStartDateToSelected"
       />
      </div>
      <div class="w-100 fv-row fv-plugins-icon-container">
        <DatePicker
            :value-from="filterData.EndDate"
            :value-to="filterData.EndDateTo"
            placeholder="Add End Date"
            label="End Date"
            name="EndDate"
            @handle-change-from="onEndDateSelected"
            @handle-change-to="onEndDateToSelected"
       />
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
import AutoComplete from "@/components/inputs/range-inputs/AutoComplete.vue";
import DatePicker from "@/components/inputs/range-inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from "vue";
import {
  useComponentAssignmentListStore
} from "@/store/pinia/iron-lake/equipment/component-assignment/useComponentAssignmentListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/component-assignment/FilterData";

/* stores */
const listStore = useComponentAssignmentListStore();
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
const onComponentSelected = (value: string) => {
  listStore.setComponent(value);
};
const onComponentTypeSelected = (value: string) => {
  listStore.setComponentType(value);
};
const onEquipmentSelected = (value: string) => {
  listStore.setEquipment(value);
};
const onObjectTypeSelected = (value: string) => {
  listStore.setObjectType(value);
};
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value);
};
const onEndDateSelected = (value: string) => {
  listStore.setEndDate(value);
};
const onComponentToSelected = (value: string) => {
  listStore.setComponentTo(value);
};
const onComponentTypeToSelected = (value: string) => {
  listStore.setComponentTypeTo(value);
};
const onEquipmentToSelected = (value: string) => {
  listStore.setEquipmentTo(value);
};
const onObjectTypeToSelected = (value: string) => {
  listStore.setObjectTypeTo(value);
};
const onStartDateToSelected = (value: string) => {
  listStore.setStartDateTo(value);
};
const onEndDateToSelected = (value: string) => {
  listStore.setEndDateTo(value);
};
const handleFilterClick = () => {
  const checkComponentType = listStore.lastUsedFilterData.ComponentType !== listStore.filterData.ComponentType
  const checkComponent = listStore.lastUsedFilterData.Component !== listStore.filterData.Component
  const checkEquipment = listStore.lastUsedFilterData.Equipment !== listStore.filterData.Equipment
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const checkObjectType = listStore.lastUsedFilterData.ObjectType !== listStore.filterData.ObjectType
  const checkComponentTypeTo = listStore.lastUsedFilterData.ComponentTypeTo !== listStore.filterData.ComponentTypeTo
  const checkComponentTo = listStore.lastUsedFilterData.ComponentTo !== listStore.filterData.ComponentTo
  const checkEquipmentTo = listStore.lastUsedFilterData.EquipmentTo !== listStore.filterData.EquipmentTo
  const checkStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const checkEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const checkObjectTypeTo = listStore.lastUsedFilterData.ObjectTypeTo !== listStore.filterData.ObjectTypeTo
  const status = checkComponentType || checkComponent || checkEquipment || checkStartDate || checkEndDate || checkObjectType || checkComponentTypeTo || checkComponentTo || checkEquipmentTo || checkStartDateTo || checkEndDateTo || checkObjectTypeTo;
  emits("handle-close", status);
};
</script>
