<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-4 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.MaintenanceStrategyId"
            label="ID Maintenance Strategy"
            name="MaintenanceStrategyId"
            :options="listStore.maintenanceStrategyIdOption"
            @handle-change="onMaintenanceStrategyIdSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.StrategyCategory"
            label="Strategy Category"
            name="StrategyCategory"
            :options="listStore.strategyCategoryCodeOption"
            @handle-change="onStrategyCategorySelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.StrategyPackage"
            label="Strategy Package"
            name="StrategyPackage"
            :options="listStore.strategyPackageOption"
            @handle-change="onStrategyPackageSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.BudgetLife"
            label="Budget Life/Cycle"
            name="BudgetLife"
            :options="listStore.budgetLifeOption"
            @handle-change="onBudgetLifeSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.Uom"
            label="Uom"
            name="Uom"
            :options="listStore.uomOption"
            @handle-change="onUomSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <DatePickerInput
                :value="filterData.StartDate ? filterData.StartDate.toString() : ''"
                placeholder="Add Start Date"
                label="Start Date"
                name="StartDate"
                @handleChange="onStartDateSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <DatePickerInput
                :value="filterData.EndDate ? filterData.EndDate.toString() : ''"
                placeholder="Add End Date"
                label="End Date"
                name="EndDate"
                @handleChange="onEndDateSelected" />
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
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useMaintenanceStrategyListStore
} from "@/store/pinia/iron-lake/maintenance/maintenance-strategy/useMaintenanceStrategyListStore";
import {
  FilterData
} from "@/core/types/entities/maintenance/maintenance-strategy/FilterData";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";


/* stores */
const listStore = useMaintenanceStrategyListStore();
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
const onMaintenanceStrategyIdSelected = (value: string) => {
  listStore.setMaintenanceStrategyId(value);
}
const onStrategyCategorySelected = (value: string) => {
  listStore.setStrategyCategory(value);
}
const onStrategyPackageSelected = (value: string) => {
  listStore.setStrategyPackage(value);
}
const onBudgetLifeSelected = (value: string) => {
  listStore.setBudgetLife(value);
}
const onUomSelected = (value: string) => {
  listStore.setUom(value);
}
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value);
}
const onEndDateSelected = (value: string) => {
  listStore.setEndDate(value);
}
const handleFilterClick = () => {
  const checkMaintenanceStrategyId = listStore.lastUsedFilterData.MaintenanceStrategyId !== listStore.filterData.MaintenanceStrategyId
  const checkStrategyCategory = listStore.lastUsedFilterData.StrategyCategory !== listStore.filterData.StrategyCategory
  const checkStrategyPackage = listStore.lastUsedFilterData.StrategyPackage !== listStore.filterData.StrategyPackage
  const checkBudgetLife = listStore.lastUsedFilterData.BudgetLife !== listStore.filterData.BudgetLife
  const checkUom = listStore.lastUsedFilterData.Uom !== listStore.filterData.Uom
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const status = (checkMaintenanceStrategyId || checkStrategyCategory || checkStrategyPackage || checkBudgetLife || checkUom || checkStartDate || checkEndDate)
  emits("handle-close", status);
}
</script>
