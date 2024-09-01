<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
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
            <DatePickerInput
                :value-from="filterData.StartDate ? filterData.StartDate.toString() : ''"
                :value-to="filterData.StartDateTo ? filterData.StartDateTo.toString() : ''"
                placeholder="Add Start Date"
                label="Start Date"
                name="StartDate"
                @handle-change-from="onStartDateSelected"
                @handle-change-to="onStartDateToSelected"
            />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <DatePickerInput
                :value-from="filterData.EndDate ? filterData.EndDate.toString() : ''"
                :value-to="filterData.EndDateTo ? filterData.EndDateTo.toString() : ''"
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
import DatePickerInput from "@/components/inputs/range-inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useComponentTypeListStore
} from "@/store/pinia/iron-lake/equipment/component-type/useComponentTypeListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/component-type/FilterData";

/* stores */
const listStore = useComponentTypeListStore();
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
}
const handleCloseModal = () => {
  emits("handle-close", false);
}
const onComponentTypeSelected = (value: string) => {
  listStore.setComponentType(value);
}
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value);
}
const onEndDateSelected = (value: string) => {
  listStore.setEndDate(value);
}
const onComponentTypeToSelected = (value: string) => {
  listStore.setComponentTypeTo(value);
}
const onStartDateToSelected = (value: string) => {
  listStore.setStartDateTo(value);
}
const onEndDateToSelected = (value: string) => {
  listStore.setEndDateTo(value);
}
const handleFilterClick = () => {
  const checkComponentType = listStore.lastUsedFilterData.ComponentType !== listStore.filterData.ComponentType
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const checkComponentTypeTo = listStore.lastUsedFilterData.ComponentTypeTo !== listStore.filterData.ComponentTypeTo
  const checkStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const checkEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const status = (checkComponentType || checkStartDate || checkEndDate || checkComponentTypeTo || checkStartDateTo || checkEndDateTo)
  emits("handle-close", status);
}
</script>
