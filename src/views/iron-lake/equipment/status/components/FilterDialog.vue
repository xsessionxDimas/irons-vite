<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.systemStatus"
              :value-to="filterData.systemStatusTo"
              label="System Status"
              :options="listStore.systemStatusOption"
              @handle-change-from="onSystemStatusSelected"
              @handle-change-to="onSystemStatusSelectedTo"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.status"
              :value-to="filterData.statusTo"
              label="Status"
              :options="listStore.statusOption"
              @handle-change-from="onStatusSelected"
              @handle-change-to="onStatusSelectedTo"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.subStatus"
              :value-to="filterData.subStatusTo"
              label="Sub Status"
              :options="listStore.subStatusOption"
              @handle-change-from="onSubStatusSelected"
              @handle-change-to="onSubStatusSelectedTo"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <Datepicker
              :value-from="filterData.startDate"
              :value-to="filterData.startDateTo"
              label="Start Date"
              @handle-change-from="onStartDateSelected"
              @handle-change-to="onStartDateToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <Datepicker
              :value-from="filterData.endDate"
              :value-to="filterData.endDateTo"
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
  useStatusListStore
} from "@/store/pinia/iron-lake/equipment/status/useStatusListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/status/FilterData";


/* stores */
const listStore = useStatusListStore();
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
const onSystemStatusSelected = (value: string) => {
  listStore.setsystemStatus(value);
}
const onSystemStatusSelectedTo = (value: string) => {
  listStore.setsystemStatusTo(value);
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
const onStatusSelected = (value: string) => {
  listStore.setStatus(value)
}
const onStatusSelectedTo = (value: string) => {
  listStore.setStatusTo(value)
}
const onSubStatusSelected = (value: string) => {
  listStore.setsubStatus(value)
}
const onSubStatusSelectedTo = (value: string) => {
  listStore.setsubStatusTo(value)
}
const handleFilterClick = () => {
  const ChecksystemStatus = listStore.lastUsedFilterData.systemStatus !== listStore.filterData.systemStatus
  const CheckStatus = listStore.lastUsedFilterData.status !== listStore.filterData.status
  const ChecksubStatus = listStore.lastUsedFilterData.subStatus !== listStore.filterData.subStatus
  const CheckStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const CheckEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const ChecksystemStatusTo = listStore.lastUsedFilterData.systemStatusTo !== listStore.filterData.systemStatusTo
  const CheckStatusTo = listStore.lastUsedFilterData.statusTo !== listStore.filterData.statusTo
  const ChecksubStatusTo = listStore.lastUsedFilterData.subStatusTo !== listStore.filterData.subStatusTo
  const CheckStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const CheckEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (ChecksystemStatus || CheckStartDate || CheckEndDate || ChecksystemStatusTo || CheckStartDateTo || CheckEndDateTo || CheckStatus || ChecksubStatus || CheckStatusTo || ChecksubStatusTo)
  emits("handle-close", status);
}
</script>
