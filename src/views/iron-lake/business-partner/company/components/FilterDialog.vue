<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <AutoComplete
            :value-from="filterData.Company"
            :value-to="filterData.CompanyTo"
            label="Company"
            name="Company"
            :options="listStore.companyOption"
            @handle-change-from="onCompanySelected"
            @handle-change-to="onCompanyToSelected"
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
  useCompanyListStore
} from "@/store/pinia/iron-lake/business-partner/company/useCompanyListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/company/FilterData";

/* stores */
const listStore = useCompanyListStore();
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
};
const handleCloseModal = () => {
  emits("handle-close", false);
};
const onCompanySelected = (value: string) => {
  listStore.setCompany(value);
};
const onCompanyToSelected = (value: string) => {
  listStore.setCompanyTo(value);
};
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value);
};
const onStartDateToSelected = (value: string) => {
  listStore.setStartDateTo(value);
};
const onEndDateSelected = (value: string) => {
  listStore.setEndDate(value);
};
const onEndDateToSelected = (value: string) => {
  listStore.setEndDateTo(value);
};
const handleFilterClick = () => {
  const checkCompany = listStore.lastUsedFilterData.Company !== listStore.filterData.Company
  const checkCompanyTo = listStore.lastUsedFilterData.CompanyTo !== listStore.filterData.CompanyTo
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const checkStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const checkEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const status = (checkCompany || checkCompanyTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo)
  emits("handle-close", status);
}
</script>
