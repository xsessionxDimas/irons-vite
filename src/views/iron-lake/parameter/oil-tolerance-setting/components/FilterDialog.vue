<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-4 my-4">
          <div class="w-100 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value-from="filterData.Value"
              :value-to="filterData.ValueTo"
              :options="listStore.stateValueOption"
              label="Value"
              @handle-change-from="handleValueChange"
              @handle-change-to="handleValueToChange"
             />
            </div>
            <div class="w-100 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value-from="filterData.ValueMin"
              :value-to="filterData.ValueMinTo"
              :options="listStore.stateValueMinOption"
              label="Value Min"
              @handle-change-from="handleValueMinChange"
              @handle-change-to="handleValueMinToChange"
             />
            </div>
            <div class="w-100 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value-from="filterData.ValueMax"
              :value-to="filterData.ValueMaxTo"
              :options="listStore.stateValueMaxOption"
              label="Value Max"
              @handle-change-from="handleValueMaxChange"
              @handle-change-to="handleValueMaxToChange"
             />
            </div>
            <div class="w-100 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value-from="filterData.Uom"
              :value-to="filterData.UomTo"
              :options="listStore.stateUomOption"
              label="UOM"
              name="Uom"
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
  useOilToleranceSettingListStore
} from "@/store/pinia/iron-lake/parameter/oil-tolerance-setting/useOilToleranceSettingListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/oil-tolerance-setting/FilterData";

/* stores */
const listStore = useOilToleranceSettingListStore();
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
const handleValueChange = (value: string) => {
  listStore.setValue(value)
}
const handleValueToChange = (value: string) => {
  listStore.setValueTo(value)
}
const handleValueMinChange = (value: string) => {
  listStore.setValueMin(value)
}
const handleValueMinToChange = (value: string) => {
  listStore.setValueMinTo(value)
}
const handleValueMaxChange = (value: string) => {
  listStore.setValueMax(value)
}
const handleValueMaxToChange = (value: string) => {
  listStore.setValueMaxTo(value)
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
const handleStartDateToChange = (value: string) => {
  listStore.setStartDateTo(value)
}
const handleEndDateChange = (value: string) => {
  listStore.setEndDate(value)
}
const handleEndDateToChange = (value: string) => {
  listStore.setEndDateTo(value)
}
const handleFilterClick = () => {
  const checkValue = listStore.lastUsedFilterData.Value !== listStore.filterData.Value
  const checkValueTo = listStore.lastUsedFilterData.ValueTo !== listStore.filterData.ValueTo
  const checkValueMin = listStore.lastUsedFilterData.ValueMin !== listStore.filterData.ValueMin
  const checkValueMinTo = listStore.lastUsedFilterData.ValueMinTo !== listStore.filterData.ValueMinTo
  const checkValueMax = listStore.lastUsedFilterData.ValueMax !== listStore.filterData.ValueMax
  const checkValueMaxTo = listStore.lastUsedFilterData.ValueMaxTo !== listStore.filterData.ValueMaxTo
  const checkUom = listStore.lastUsedFilterData.Uom !== listStore.filterData.Uom
  const checkUomTo = listStore.lastUsedFilterData.UomTo !== listStore.filterData.UomTo
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const checkStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const checkEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const status = (checkValue || checkValueTo || checkValueMin || checkValueMinTo || checkValueMax || checkValueMaxTo || checkUom || checkUomTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo)
  emits("handle-close", status);
}
</script>
