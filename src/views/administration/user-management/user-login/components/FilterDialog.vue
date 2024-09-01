<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="50%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value-from="filterData.EmployeeId"
            :value-to="filterData.EmployeeIdTo"
            label="Employee Id"
            :options="listStore.employeeIdOption"
            @handle-change-from="onEmployeeIdSelected"
            @handle-change-to="onEmployeeIdToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value-from="filterData.Section"
            :value-to="filterData.SectionTo"
            label="Section"
            :options="listStore.sectionOption"
            @handle-change-from="onSectionSelected"
            @handle-change-to="onSectionToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <DatePickerInput
               :value-from="filterData.LogOnDate"
               :value-to="filterData.LogOnDateTo"
               placeholder="Select Login Date"
               label="Login Date To"
               @handle-change-from="onLogOnDateSelected"
               @handle-change-to="onLogOnDateToSelected"
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
  useUserLoginListStore
} from "@/store/pinia/administration/user-management/user-login/useUserLoginListStore";
import {
  FilterData
} from "@/core/types/entities/administration/user-management/user-login/FilterData";


/* stores */
const listStore = useUserLoginListStore();
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
const onEmployeeIdSelected = (value: string) => {
  listStore.setEmployeeId(value);
}
const onSectionSelected = (value: string) => {
  listStore.setSection(value);
}
const onLogOnDateSelected = (value: string) => {
  listStore.setLogOnDate(value);
}
const onEmployeeIdToSelected = (value: string) => {
  listStore.setEmployeeIdTo(value);
}
const onSectionToSelected = (value: string) => {
  listStore.setSectionTo(value);
}
const onLogOnDateToSelected = (value: string) => {
  listStore.setLogOnDateTo(value);
}
const handleFilterClick = () => {
  const checkEmployeeId = listStore.lastUsedFilterData.EmployeeId !== listStore.filterData.EmployeeId;
  const checkSection = listStore.lastUsedFilterData.Section !== listStore.filterData.Section;
  const checkLogOnDate = listStore.lastUsedFilterData.LogOnDate !== listStore.filterData.LogOnDate;
  const checkEmployeeIdTo = listStore.lastUsedFilterData.EmployeeIdTo !== listStore.filterData.EmployeeIdTo;
  const checkSectionTo = listStore.lastUsedFilterData.SectionTo !== listStore.filterData.SectionTo;
  const checkLogOnDateTo = listStore.lastUsedFilterData.LogOnDateTo !== listStore.filterData.LogOnDateTo;
  const status = (checkEmployeeId || checkSection || checkLogOnDate || checkEmployeeIdTo || checkSectionTo || checkLogOnDateTo)
  emits("handle-close", status);
}
</script>
