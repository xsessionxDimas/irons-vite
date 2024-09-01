<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-4 my-4">
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value-from="filterData.CbmParameter"
            :value-to="filterData.CbmParameterTo"
            :options="listStore.stateCbmParameterOption"
            label="CBM Parameter"
            name="CbmParameter"
            @handle-change-from="handleCbmParameterChange"
            @handle-change-to="handleCbmParameterToChange"
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
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useCbmParameterListStore
} from "@/store/pinia/iron-lake/parameter/cbm-parameter/useCbmParameterListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/cbm-parameter/FilterData";
import AutoComplete from "@/components/inputs/range-inputs/AutoComplete.vue";
import DatePickerInput from "@/components/inputs/range-inputs/DatePickerInput.vue";

/* stores */
const listStore = useCbmParameterListStore();
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
const handleCbmParameterChange = (value: string) => {
  listStore.setCbmParameter(value)
}
const handleStartDateChange = (value: string) => {
  listStore.setStartDate(value)
}
const handleEndDateChange = (value: string) => {
  listStore.setEndDate(value)
}
const handleCbmParameterToChange = (value: string) => {
  listStore.setCbmParameterTo(value)
}
const handleStartDateToChange = (value: string) => {
  listStore.setStartDateTo(value)
}
const handleEndDateToChange = (value: string) => {
  listStore.setEndDateTo(value)
}
const handleFilterClick = () => {
  const CheckCbmParameter = listStore.lastUsedFilterData.CbmParameter !== listStore.filterData.CbmParameter
  const CheckStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const CheckEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const CheckCbmParameterTo = listStore.lastUsedFilterData.CbmParameterTo !== listStore.filterData.CbmParameterTo
  const CheckStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const CheckEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const status = (CheckCbmParameter || CheckStartDate || CheckEndDate || CheckCbmParameterTo || CheckStartDateTo || CheckEndDateTo)
  emits("handle-close", status);
}
</script>
