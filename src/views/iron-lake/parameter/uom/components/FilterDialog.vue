<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-4 my-4">
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
  useUomListStore
} from "@/store/pinia/iron-lake/parameter/uom/useUomListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/uom/FilterData";
import AutoComplete from "@/components/inputs/range-inputs/AutoComplete.vue";
import DatePickerInput from "@/components/inputs/range-inputs/DatePickerInput.vue";

/* stores */
const listStore = useUomListStore();
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
const handleUomChange = (value: string) => {
  listStore.setUom(value)
}
const handleStartDateChange = (value: string) => {
  listStore.setStartDate(value)
}
const handleEndDateChange = (value: string) => {
  listStore.setEndDate(value)
}
const handleUomToChange = (value: string) => {
  listStore.setUomTo(value)
}
const handleStartDateToChange = (value: string) => {
  listStore.setStartDateTo(value)
}
const handleEndDateToChange = (value: string) => {
  listStore.setEndDateTo(value)
}
const handleFilterClick = () => {
  const CheckUom = listStore.lastUsedFilterData.Uom !== listStore.filterData.Uom
  const CheckStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const CheckEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const CheckUomTo = listStore.lastUsedFilterData.UomTo !== listStore.filterData.UomTo
  const CheckStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const CheckEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const status = (CheckUom || CheckStartDate || CheckEndDate || CheckUomTo || CheckStartDateTo || CheckEndDateTo)
  emits("handle-close", status);
}
</script>
