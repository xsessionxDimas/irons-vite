<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-4 my-4">
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value-from="filterData.UnitNumber"
            :value-to="filterData.UnitNumberTo"
            label="Unit Number"
            name="UnitNumber"
            :options="listStore.unitNumberOption"
            @handle-change-from="onUnitNumberSelected"
            @handle-change-to="onUnitNumberToSelected"
            />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value-from="filterData.SmuDue"
            :value-to="filterData.SmuDueTo"
            label="SMU Due (Hours)"
            name="SmuDue"
            :options="listStore.smuDueOption"
            @handle-change-from="onSmuDueSelected"
            @handle-change-to="onSmuDueToSelected"
            />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value-from="filterData.WorkOrder"
            :value-to="filterData.WorkOrderTo"
            label="Work Order"
            name="WorkOrder"
            :options="listStore.workOrderOption"
            @handle-change-from="onWorkOrderSelected"
            @handle-change-to="onWorkOrderToSelected"
            />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value-from="filterData.PsType"
            :value-to="filterData.PsTypeTo"
            label="Service Size"
            name="PsType"
            :options="listStore.psTypeOption"
            @handle-change-from="onPsTypeSelected"
            @handle-change-to="onPsTypeToSelected"
            />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value-from="filterData.Shift"
            :value-to="filterData.ShiftTo"
            label="Shift"
            name="Shift"
            :options="listStore.shiftOption"
            @handle-change-from="onShiftSelected"
            @handle-change-to="onShiftToSelected"
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
                @handle-change-to="onStartDateToSelected" />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <DatePickerInput
                :value-from="filterData.EndDate ? filterData.EndDate.toString() : ''"
                :value-to="filterData.EndDateTo ? filterData.EndDateTo.toString() : ''"
                placeholder="Add End Date"
                label="End Date"
                name="EndDate"
                @handle-change-from="onEndDateSelected"
                @handle-change-to="onEndDateToSelected" />
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
  useDailyScheduleListStore
} from "@/store/pinia/iron-lake/task/daily-schedule-v1/useDailyScheduleListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/task/daily-schedule-v1/FilterData";
import {
  substractDynamicDateHelper,
  addDynamicDateHelper
} from "@/core/helpers/date-format"

const disabledDate = {
  from: substractDynamicDateHelper(new Date(), "DD-MM-YYYY", 1, 'days').toString(),
  to: addDynamicDateHelper(new Date(), "DD-MM-YYYY", 14, 'days').toString()
}
/* stores */
const listStore = useDailyScheduleListStore();
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
const onUnitNumberSelected = (value: string) => {
  listStore.setUnitNumber(value);
}
const onSmuDueSelected = (value: string) => {
  listStore.setSmuDue(value);
}
const onWorkOrderSelected = (value: string) => {
  listStore.setWorkOrder(value);
}
const onPsTypeSelected = (value: string) => {
  listStore.setPsType(value);
}
const onShiftSelected = (value: string) => {
  listStore.setShift(value);
}
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value);
}
const onDateServiceSelected = (value: string) => {
  listStore.setDateService(value);
}
const onEndDateSelected = (value: string) => {
  listStore.setEndDate(value);
}
const onUnitNumberToSelected = (value: string) => {
  listStore.setUnitNumberTo(value);
}
const onSmuDueToSelected = (value: string) => {
  listStore.setSmuDueTo(value);
}
const onWorkOrderToSelected = (value: string) => {
  listStore.setWorkOrderTo(value);
}
const onPsTypeToSelected = (value: string) => {
  listStore.setPsTypeTo(value);
}
const onShiftToSelected = (value: string) => {
  listStore.setShiftTo(value);
}
const onStartDateToSelected = (value: string) => {
  listStore.setStartDateTo(value);
}
const onDateServiceToSelected = (value: string) => {
  listStore.setDateServiceTo(value);
}
const onEndDateToSelected = (value: string) => {
  listStore.setEndDateTo(value);
}
const handleFilterClick = () => {
  const checkUnitNumber = listStore.lastUsedFilterData.UnitNumber !== listStore.filterData.UnitNumber
  const checkSmuDue = listStore.lastUsedFilterData.SmuDue !== listStore.filterData.SmuDue
  const checkWorkOrder = listStore.lastUsedFilterData.WorkOrder !== listStore.filterData.WorkOrder
  const checkPsType = listStore.lastUsedFilterData.PsType !== listStore.filterData.PsType
  const checkShift = listStore.lastUsedFilterData.Shift !== listStore.filterData.Shift
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const checkUnitNumberTo = listStore.lastUsedFilterData.UnitNumberTo !== listStore.filterData.UnitNumberTo
  const checkSmuDueTo = listStore.lastUsedFilterData.SmuDueTo !== listStore.filterData.SmuDueTo
  const checkWorkOrderTo = listStore.lastUsedFilterData.WorkOrderTo !== listStore.filterData.WorkOrderTo
  const checkPsTypeTo = listStore.lastUsedFilterData.PsTypeTo !== listStore.filterData.PsTypeTo
  const checkShiftTo = listStore.lastUsedFilterData.ShiftTo !== listStore.filterData.ShiftTo
  const checkStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const checkEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const status = (checkUnitNumber || checkSmuDue || checkWorkOrder || checkShift || checkStartDate || checkEndDate || checkPsType || checkUnitNumberTo || checkSmuDueTo || checkWorkOrderTo || checkPsTypeTo || checkShiftTo || checkStartDateTo || checkEndDateTo)
  emits("handle-close", status);
}
</script>
