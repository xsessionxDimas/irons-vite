<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-4 my-4">
            <div class="w-100 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value-from="filterData.EquipmentModel"
              :value-to="filterData.EquipmentModelTo"
              :options="listStore.EquipmentModelOption"
              label="Equipment Model"
              @handle-change-from="handleEquipmentModelChange"
              @handle-change-to="handleEquipmentModelToChange"
             />
            </div>
            <div class="w-100 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value-from="filterData.PsType"
              :value-to="filterData.PsTypeTo"
              :options="listStore.PsTypeOption"
              label="PS Type"
              @handle-change-from="handlePsTypeChange"
              @handle-change-to="handlePsTypeToChange"
             />
            </div>
            <div class="w-100 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value-from="filterData.TaskNo"
              :value-to="filterData.TaskNoTo"
              :options="listStore.TaskNoOption"
              label="Task No"
              @handle-change-from="handleTaskNoChange"
              @handle-change-to="handleTaskNoToChange"
             />
            </div>
            <div class="w-100 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value-from="filterData.TaskCrackCode"
              :value-to="filterData.TaskCrackCodeTo"
              :options="listStore.TaskCrackCodeOption"
              label="Task Crack Code"
              @handle-change-from="handleTaskCrackCodeChange"
              @handle-change-to="handleTaskCrackCodeToChange"
             />
            </div>
            <div class="w-100 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value-from="filterData.LocationId"
              :value-to="filterData.LocationIdTo"
              :options="listStore.LocationIdOption"
              label="Location ID"
              @handle-change-from="handleLocationIdChange"
              @handle-change-to="handleLocationIdToChange"
             />
            </div>
            <div class="w-100 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value-from="filterData.Uom"
              :value-to="filterData.UomTo"
              :options="listStore.UomOption"
              label="UOM"
              @handle-change-from="handleUomChange"
              @handle-change-to="handleUomToChange"
             />
            </div>
            <div class="w-100 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value-from="filterData.StartDate ? filterData.StartDate.toString() : ''"
                :value-to="filterData.StartDateTo ? filterData.StartDateTo.toString() : ''"
                label="Start Date"
                placeholder="Add Start Date"
                name="StartDate"
                @handle-change-from="handleStartDateChange"
                @handle-change-to="handleStartDateToChange"
               />
            </div>
            <div class="w-100 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value-from="filterData.EndDate ? filterData.EndDate.toString() : ''"
                :value-to="filterData.EndDateTo ? filterData.EndDateTo.toString() : ''"
                label="End Date"
                placeholder="Add End Date"
                name="EndDate"
                @handle-change-from="handleEndDateChange"
                @handle-change-to="handleEndDateToChange"
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
  useTaskCrackListStore
} from "@/store/pinia/iron-lake/crack-assignment/task-crack/useTaskCrackListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/crack-assignment/task-crack/FilterData";

/* stores */
const listStore = useTaskCrackListStore();
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
const handleEquipmentModelChange = (value: string) => {
  listStore.setEquipmentModel(value)
}
const handlePsTypeChange = (value: string) => {
  listStore.setPsType(value)
}
const handleTaskNoChange = (value: string) => {
  listStore.setTaskNo(value)
}
const handleTaskCrackCodeChange = (value: string) => {
  listStore.setTaskCrackCode(value)
}
const handleLocationIdChange = (value: string) => {
  listStore.setLocationId(value)
}
const handleUomChange = (value: string) => {
  listStore.setUom(value)
}
const handleUomToChange = (value: string) => {
  listStore.setUomTo(value)
}
const handleStartDateChange = (value: string) => {
  listStore.setStartDate(value)
}
const handleEndDateChange = (value: string) => {
  listStore.setEndDate(value)
}
const handleEquipmentModelToChange = (value: string) => {
  listStore.setEquipmentModelTo(value)
}
const handlePsTypeToChange = (value: string) => {
  listStore.setPsTypeTo(value)
}
const handleTaskNoToChange = (value: string) => {
  listStore.setTaskNoTo(value)
}
const handleTaskCrackCodeToChange = (value: string) => {
  listStore.setTaskCrackCodeTo(value)
}
const handleLocationIdToChange = (value: string) => {
  listStore.setLocationIdTo(value)
}
const handleStartDateToChange = (value: string) => {
  listStore.setStartDateTo(value)
}
const handleEndDateToChange = (value: string) => {
  listStore.setEndDateTo(value)
}
const handleFilterClick = () => {
  const CheckEquipmentModel = listStore.stateLastUsedFilterData.EquipmentModel !== listStore.filterData.EquipmentModel
  const CheckUom = listStore.stateLastUsedFilterData.Uom !== listStore.filterData.Uom
  const CheckUomTo = listStore.stateLastUsedFilterData.UomTo !== listStore.filterData.UomTo
  const CheckPsType = listStore.stateLastUsedFilterData.PsType !== listStore.filterData.PsType
  const CheckTaskNo = listStore.stateLastUsedFilterData.TaskNo !== listStore.filterData.TaskNo
  const CheckTaskCrackCode = listStore.stateLastUsedFilterData.TaskCrackCode !== listStore.filterData.TaskCrackCode
  const CheckLocationId = listStore.stateLastUsedFilterData.LocationId !== listStore.filterData.LocationId
  const CheckStartDate = listStore.stateLastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const CheckEndDate = listStore.stateLastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const CheckEquipmentModelTo = listStore.stateLastUsedFilterData.EquipmentModelTo !== listStore.filterData.EquipmentModelTo
  const CheckPsTypeTo = listStore.stateLastUsedFilterData.PsTypeTo !== listStore.filterData.PsTypeTo
  const CheckTaskNoTo = listStore.stateLastUsedFilterData.TaskNoTo !== listStore.filterData.TaskNoTo
  const CheckTaskCrackCodeTo = listStore.stateLastUsedFilterData.TaskCrackCodeTo !== listStore.filterData.TaskCrackCodeTo
  const CheckLocationIdTo = listStore.stateLastUsedFilterData.LocationIdTo !== listStore.filterData.LocationIdTo
  const CheckStartDateTo = listStore.stateLastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const CheckEndDateTo = listStore.stateLastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const status = (CheckEquipmentModel || CheckPsType || CheckTaskNo || CheckTaskCrackCode || CheckLocationId || CheckStartDate || CheckEndDate || CheckEquipmentModelTo || CheckPsTypeTo || CheckTaskNoTo || CheckTaskCrackCodeTo || CheckLocationIdTo || CheckStartDateTo || CheckEndDateTo || CheckUom || CheckUomTo)
  emits("handle-close", status);
}
</script>
