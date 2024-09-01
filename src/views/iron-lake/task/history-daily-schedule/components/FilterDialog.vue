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
              :options="listStore.unitNumberOption"
              @handle-change-from="onUnitNumberSelected"
              @handle-change-to="onUnitNumberToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.SmuDue"
              :value-to="filterData.SmuDueTo"
              label="SMU Due"
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
              :options="listStore.workOrderOption"
              @handle-change-from="onWorkOrderSelected"
              @handle-change-to="onWorkOrderToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.PsType"
              :value-to="filterData.PsTypeTo"
              label="Ps Type"
              :options="listStore.psTypeOption"
              @handle-change-from="onPsTypeSelected"
              @handle-change-to="onPsTypeToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <DatePickerInput
            :value-from="filterData.DateService ? filterData.DateService.toString() : ''"
              :value-to="filterData.DateServiceTo ? filterData.DateServiceTo.toString() : ''"
              placeholder="Add Service Date"
              label="Service Date"
              @handle-change-from="onDateServiceSelected"
              @handle-change-to="onDateServiceToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <DatePickerInput
                :value-from="filterData.StartDate ? filterData.StartDate.toString() : ''"
                :value-to="filterData.StartDateTo ? filterData.StartDateTo.toString() : ''"
                placeholder="Add Start Date"
                label="Start Date"
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
                @handle-change-from="onEndDateSelected"
                @handle-change-to="onEndDateToSelected"
             />
          </div>
          <div class="col-12 col-md-6 px-0">
            <div class="row p-0 m-0">
              <label class="`form-label fs-6 fw-bolder 'text-dark'`">Status</label>
              <el-select
                v-model="filterData.Status"
                placeholder="Type any.."
                clearable
                filterable
                remote
                @change="onStatusSelected"
              >
                <el-option
                  v-for="item in listStore.statusOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
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
  useHistoryDailyScheduleListStore
} from "@/store/pinia/iron-lake/task/history-daily-schedule/useHistoryDailyScheduleListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/task/history-daily-schedule/FilterData";

/* stores */
const listStore = useHistoryDailyScheduleListStore();
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
const onDateServiceSelected = (value: string) => {
  listStore.setDateService(value);
}

const onStatusSelected = (value: string) => {
  listStore.setStatus(value);
}

const onLastWorkOrderSelected = (value: string) => {
  listStore.setLastWorkOrder(value);
}
const onLastPsTypeSelected = (value: string) => {
  listStore.setLastPsType(value);
}
const onLastDateServiceSelected = (value: string) => {
  listStore.setLastDateService(value);
}
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value);
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
const onDateServiceToSelected = (value: string) => {
  listStore.setDateServiceTo(value);
}
const onLastWorkOrderToSelected = (value: string) => {
  listStore.setLastWorkOrderTo(value);
}
const onLastPsTypeToSelected = (value: string) => {
  listStore.setLastPsTypeTo(value);
}
const onLastDateServiceToSelected = (value: string) => {
  listStore.setLastDateServiceTo(value);
}
const onStartDateToSelected = (value: string) => {
  listStore.setStartDateTo(value);
}
const onEndDateToSelected = (value: string) => {
  listStore.setEndDateTo(value);
}
const handleFilterClick = () => {
  const checkUnitNumber = listStore.lastUsedFilterData.UnitNumber !== listStore.filterData.UnitNumber
  const checkSmuDue = listStore.lastUsedFilterData.SmuDue !== listStore.filterData.SmuDue
  const checkWorkOrder = listStore.lastUsedFilterData.WorkOrder !== listStore.filterData.WorkOrder
  const checkDateService = listStore.lastUsedFilterData.DateService !== listStore.filterData.DateService
  const checkPsType = listStore.lastUsedFilterData.PsType !== listStore.filterData.PsType
  const checkLastWorkOrder = listStore.lastUsedFilterData.LastWorkOrder !== listStore.filterData.LastWorkOrder
  const checkLastDateService = listStore.lastUsedFilterData.LastDateService !== listStore.filterData.LastDateService
  const checkLastPsType = listStore.lastUsedFilterData.LastPsType !== listStore.filterData.LastPsType
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate

  const checkUnitNumberTo = listStore.lastUsedFilterData.UnitNumberTo !== listStore.filterData.UnitNumberTo
  const checkSmuDueTo = listStore.lastUsedFilterData.SmuDueTo !== listStore.filterData.SmuDueTo
  const checkWorkOrderTo = listStore.lastUsedFilterData.WorkOrderTo !== listStore.filterData.WorkOrderTo
  const checkDateServiceTo = listStore.lastUsedFilterData.DateServiceTo !== listStore.filterData.DateServiceTo
  const checkPsTypeTo = listStore.lastUsedFilterData.PsTypeTo !== listStore.filterData.PsTypeTo
  const checkLastWorkOrderTo = listStore.lastUsedFilterData.LastWorkOrderTo !== listStore.filterData.LastWorkOrderTo
  const checkLastDateServiceTo = listStore.lastUsedFilterData.LastDateServiceTo !== listStore.filterData.LastDateServiceTo
  const checkLastPsTypeTo = listStore.lastUsedFilterData.LastPsTypeTo !== listStore.filterData.LastPsTypeTo
  const checkStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const checkEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const checkStatus = listStore.lastUsedFilterData.Status !== listStore.filterData.Status

  const status = (checkUnitNumber || checkDateService || checkSmuDue || checkWorkOrder || checkStartDate || checkEndDate || checkPsType || checkLastWorkOrder || checkLastDateService || checkLastPsType || checkUnitNumberTo || checkSmuDueTo || checkWorkOrderTo || checkDateServiceTo || checkPsTypeTo || checkLastWorkOrderTo || checkLastDateServiceTo || checkLastPsTypeTo || checkStartDateTo || checkEndDateTo || checkStatus)
  emits("handle-close", status);
}
</script>
