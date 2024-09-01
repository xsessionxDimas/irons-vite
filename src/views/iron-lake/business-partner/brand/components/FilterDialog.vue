<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-4 my-4">
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.brand"
              :value-to="filterData.brandTo"
              label="Brand"
              :options="listStore.stateBrandNameOption"
              @handle-change-from="onBrandNameSelected"
              @handle-change-to="onBrandNameToSelected"
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
  useBrandListStore
} from "@/store/pinia/iron-lake/business-partner/brand/useBrandListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/brand/FilterData";

/* stores */
const listStore = useBrandListStore();
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
const onBrandNameSelected = (value: string) => {
  listStore.setBrandName(value);
}
const onBrandNameToSelected = (value: string) => {
  listStore.setBrandNameTo(value);
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
const handleFilterClick = () => {
  const checkBrand = listStore.lastUsedFilterData.brand !== listStore.filterData.brand
  const checkBrandTo = listStore.lastUsedFilterData.brandTo !== listStore.filterData.brandTo
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (checkBrand || checkBrandTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo)
  emits("handle-close", status);
}
</script>
