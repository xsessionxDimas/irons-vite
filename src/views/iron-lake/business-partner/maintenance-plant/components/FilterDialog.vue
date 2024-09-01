<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value-from="filterData.MaintenancePlant"
            :value-to="filterData.MaintenancePlantTo"
            label="Maintenance Plant"
            :options="listStore.maintenancePlantOption"
            @handle-change-from="onMaintenancePlantSelected"
            @handle-change-to="onMaintenancePlantToSelected" />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <Datepicker
              :value-from="filterData.StartDate"
              :value-to="filterData.StartDateTo"
              label="Start Date"
              @handle-change-from="onStartDateSelected"
              @handle-change-to="onStartDateToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <Datepicker
              :value-from="filterData.EndDate"
              :value-to="filterData.EndDateTo"
              label="End Date"
              @handle-change-from="onEndDateSelected"
              @handle-change-to="onuserEndDateToSelected"
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
import Datepicker from "@/components/inputs/range-inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useMaintenancePlantListStore
} from "@/store/pinia/iron-lake/business-partner/maintenance-plant/useMaintenancePlantListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/maintenance-plant/FilterData";

/* stores */
const listStore = useMaintenancePlantListStore();
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
const onMaintenancePlantSelected = (value: string) => {
  listStore.setMaintenancePlant(value);
}
const onMaintenancePlantToSelected = (value: string) => {
  listStore.setMaintenancePlantTo(value);
}
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value);
}
const onStartDateToSelected = (value: string) => {
  listStore.setStartDateTo(value);
}
const onEndDateSelected = (value: string) => {
  listStore.setEndDate(value);
}
const onuserEndDateToSelected = (value: string) => {
  listStore.setEndDateTo(value);
}
const handleFilterClick = () => {
  const checkMaintenancePlant = listStore.lastUsedFilterData.MaintenancePlant !== listStore.filterData.MaintenancePlant
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const checkMaintenancePlantTo = listStore.lastUsedFilterData.MaintenancePlantTo !== listStore.filterData.MaintenancePlantTo
  const checkStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const checkEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const status = (checkMaintenancePlant || checkStartDate || checkEndDate || checkMaintenancePlantTo || checkStartDateTo || checkEndDateTo)
  emits("handle-close", status);
}
</script>
