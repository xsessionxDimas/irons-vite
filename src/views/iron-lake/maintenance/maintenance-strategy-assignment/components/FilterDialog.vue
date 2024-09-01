<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-4 my-4">
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.MaintenanceStrategyParId"
              :value-to="filterData.MaintenanceStrategyParIdTo"
              label="ID Maintenance Strategy Parent"
              :options="listStore.maintenanceStrategyIDOption"
              @handle-change-from="onMaintenanceStrategyParIdSelected"
              @handle-change-to="onMaintenanceStrategyParIdToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.MaintenanceStrategyChdId"
              :value-to="filterData.MaintenanceStrategyChdIdTo"
              label="ID Maintenance Strategy Child"
              :options="listStore.maintenanceStrategyIDOption"
              @handle-change-from="onMaintenanceStrategyChdIdSelected"
              @handle-change-to="onMaintenanceStrategyChdIdToSelected"
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
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useMaintenanceStrategyAssignmentListStore
} from "@/store/pinia/iron-lake/maintenance/maintenance-strategy-assignment/useMaintenanceStrategyAssignmentListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/maintenance/maintenance-strategy-assignment/FilterData";
import DatePickerInput from "@/components/inputs/range-inputs/DatePickerInput.vue";


/* stores */
const listStore = useMaintenanceStrategyAssignmentListStore();
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

const onMaintenanceStrategyParIdSelected = (value: string) => {
  listStore.setMaintenanceStrategyParId(value)
}
const onMaintenanceStrategyChdIdSelected = (value: string) => {
  listStore.setMaintenanceStrategyChdId(value)
}
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value)
}
const onEndDateSelected = (value: string) => {
  listStore.setEndDate(value)
}
const onMaintenanceStrategyParIdToSelected = (value: string) => {
  listStore.setMaintenanceStrategyParIdTo(value)
}
const onMaintenanceStrategyChdIdToSelected = (value: string) => {
  listStore.setMaintenanceStrategyChdIdTo(value)
}
const onStartDateToSelected = (value: string) => {
  listStore.setStartDateTo(value)
}
const onEndDateToSelected = (value: string) => {
  listStore.setEndDateTo(value)
}
const handleFilterClick = () => {
  const CheckMaintenanceStrategyParId = listStore.lastUsedFilterData.MaintenanceStrategyParId !== listStore.filterData.MaintenanceStrategyParId
  const CheckMaintenanceStrategyChdId = listStore.lastUsedFilterData.MaintenanceStrategyChdId !== listStore.filterData.MaintenanceStrategyChdId
  const CheckStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const CheckEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const CheckMaintenanceStrategyParIdTo = listStore.lastUsedFilterData.MaintenanceStrategyParIdTo !== listStore.filterData.MaintenanceStrategyParIdTo
  const CheckMaintenanceStrategyChdIdTo = listStore.lastUsedFilterData.MaintenanceStrategyChdIdTo !== listStore.filterData.MaintenanceStrategyChdIdTo
  const CheckStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const CheckEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const status = (CheckMaintenanceStrategyParId || CheckMaintenanceStrategyChdId || CheckStartDate || CheckEndDate || CheckMaintenanceStrategyParIdTo || CheckMaintenanceStrategyChdIdTo || CheckStartDateTo || CheckEndDateTo)
  emits("handle-close", status);
}
</script>
