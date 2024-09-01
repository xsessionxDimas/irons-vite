<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.EmployeeId"
          label="Employee ID"
          name="EmployeeId"
          :options="formStore.employeeOptions"
          @handle-change="onEmployeeIdSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.EmployeeIdDirect"
          label="Employee ID Direct"
          name="EmployeeId"
          :options="listStore.employeeIdDirectOption"
          @handle-change="onEmployeeIdDirectDescSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
            :value="filterData.StartDate"
            placeholder="Add Start Date"
            label="Start Date"
            name="StartDate"
            @handleChange="onStartDateSelected" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
            :value="filterData.EndDate"
            placeholder="Add End Date"
            label="End Date"
            name="EndDate"
            @handleChange="onEndDateSelected" />
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
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from "vue";
import {
  useUserDirectListStore
} from "@/store/pinia/administration/organization-unit/user-direct/useUserDirectListStore";
import {
  useUserDirectFormStore
} from "@/store/pinia/administration/organization-unit/user-direct/useUserDirectFormStore";
import {
  FilterData
} from "@/core/types/entities/administration/organization-unit/user-direct/FilterData";

/* stores */
const listStore = useUserDirectListStore();
const formStore = useUserDirectFormStore();
const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["handle-close"]);

/* refs*/
const isVisible = toRef(props, "visibility");
const filterData: ComputedRef<FilterData> = computed(() => {
  return listStore.filterData;
});

/* handlers */
const handleReset = () => {
  handleCloseModal();
  listStore.resetFilter();
};
const handleCloseModal = () => {
  emits("handle-close", false);
};
const onEmployeeIdSelected = (value: string) => {
  listStore.setEmployeeId(value);
};
const onEmployeeIdDirectDescSelected = (value: string) => {
  listStore.setEmployeeIdDirect(value);
};
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value);
};
const onEndDateSelected = (value: string) => {
  listStore.setEndDate(value);
};
const handleFilterClick = () => {
  const checkEmployeeId =
    listStore.lastUsedFilterData.EmployeeId !==
    listStore.filterData.EmployeeId;
  const checkEmployeeIdDirect =
    listStore.lastUsedFilterData.EmployeeIdDirect !==
    listStore.filterData.EmployeeIdDirect;
  const checkStartDate =
    listStore.lastUsedFilterData.StartDate !==
    listStore.filterData.StartDate;
  const checkEndDate =
    listStore.lastUsedFilterData.EndDate !==
    listStore.filterData.EndDate;
  const status = checkEmployeeId || checkEmployeeIdDirect || checkStartDate || checkEndDate;
  emits("handle-close", status);
};
</script>
