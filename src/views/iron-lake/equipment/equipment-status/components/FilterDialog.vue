<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.Equipment"
        :value-to="filterData.EquipmentTo"
        label="Equipment"
        name="Equipment"
        :options="listStore.equipmentOption"
        @handle-change-from="onEquipmentSelected"
        @handle-change-to="onEquipmentToSelected"
     />
      <AutoComplete
        :value-from="filterData.SystemStatus"
        :value-to="filterData.SystemStatusTo"
        label="System Status"
        name="SystemStatus"
        :options="listStore.systemStatusOption"
        @handle-change-from="onSystemStatusSelected"
        @handle-change-to="onSystemStatusToSelected"
     />
      <AutoComplete
        :value-from="filterData.Status"
        :value-to="filterData.StatusTo"
        label="Status"
        name="Status"
        :options="listStore.statusOption"
        @handle-change-from="onStatusSelected"
        @handle-change-to="onStatusToSelected"
     />
      <AutoComplete
        :value-from="filterData.SubStatus"
        :value-to="filterData.SubStatusTo"
        label="Sub Status"
        name="SubStatus"
        :options="listStore.subStatusOption"
        @handle-change-from="onSubStatusSelected"
        @handle-change-to="onSubStatusToSelected"
     />
      <DatePickerInput
        :value-from="filterData.StartDate ? filterData.StartDate.toString() : ''"
        :value-to="filterData.StartDateTo ? filterData.StartDateTo.toString() : ''"
        label="Start Date"
        name="StartDate"
        placeholder="Pick a date"
        @handle-change-from="onStartDateSelected"
        @handle-change-to="onStartDateToSelected"
     />
      <DatePickerInput
        :value-from="filterData.EndDate ? filterData.EndDate.toString() : ''"
        :value-to="filterData.EndDateTo ? filterData.EndDateTo.toString() : ''"
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
  useEquipmentStatusListStore
} from "@/store/pinia/iron-lake/equipment/equipment-status/useEquipmentStatusListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/equipment-status/FilterData";


/* stores */
const listStore = useEquipmentStatusListStore();
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
const onEquipmentSelected = (value: string) => {
  listStore.setEquipment(value);
}
const onEquipmentToSelected = (value: string) => {
  listStore.setEquipmentTo(value);
}
const onSystemStatusSelected = (value: string) => {
  listStore.setSystemStatus(value);
}
const onSystemStatusToSelected = (value: string) => {
  listStore.setSystemStatusTo(value);
}
const onStatusSelected = (value: string) => {
  listStore.setStatus(value);
}
const onStatusToSelected = (value: string) => {
  listStore.setStatusTo(value);
}
const onSubStatusSelected = (value: string) => {
  listStore.setSubStatus(value);
}
const onSubStatusToSelected = (value: string) => {
  listStore.setSubStatusTo(value);
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
const onEndDateToSelected = (value: string) => {
  listStore.setEndDateTo(value);
}
const handleFilterClick = () => {
  const checkEquipment = listStore.lastUsedFilterData.Equipment !== listStore.filterData.Equipment
  const checkEquipmentTo = listStore.lastUsedFilterData.EquipmentTo !== listStore.filterData.EquipmentTo
  const checkSystemStatus = listStore.lastUsedFilterData.SystemStatus !== listStore.filterData.SystemStatus
  const checkSystemStatusTo = listStore.lastUsedFilterData.SystemStatusTo !== listStore.filterData.SystemStatusTo
  const checkStatus = listStore.lastUsedFilterData.Status !== listStore.filterData.Status
  const checkStatusTo = listStore.lastUsedFilterData.StatusTo !== listStore.filterData.StatusTo
  const checkSubStatus = listStore.lastUsedFilterData.SubStatus !== listStore.filterData.SubStatus
  const checkSubStatusTo = listStore.lastUsedFilterData.SubStatusTo !== listStore.filterData.SubStatusTo
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const checkStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const checkEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const status = (checkEquipment || checkEquipmentTo || checkSystemStatus || checkSystemStatusTo || checkStatus || checkStatusTo || checkSubStatus || checkSubStatusTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo)
  emits("handle-close", status);
}
</script>
