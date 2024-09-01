<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.Model"
        :value-to="filterData.ModelTo"
        label="Model"
        name="Model"
        :options="listStore.modelOption"
        @handle-change-from="onModelSelected"
        @handle-change-to="onModelToSelected"
     />
      <AutoComplete
        :value-from="filterData.PsType"
        :value-to="filterData.PsTypeTo"
        label="PS Type"
        name="PsType"
        :options="listStore.psTypeOption"
        @handle-change-from="onPsTypeSelected"
        @handle-change-to="onPsTypeToSelected"
     />
      <AutoComplete
        :value-from="filterData.LocationIdParent"
        :value-to="filterData.LocationIdParentTo"
        label="Location Id Parent"
        name="LocationIdParent"
        :options="listStore.locationIdParentOption"
        @handle-change-from="onLocationIdParentSelected"
        @handle-change-to="onLocationIdParentToSelected"
     />
      <AutoComplete
        :value-from="filterData.TaskNumberDetailParent"
        :value-to="filterData.TaskNumberDetailParentTo"
        label="Task Number Detail Parent"
        name="TaskNumberDetailParent"
        :options="listStore.taskNumberDetailParentOption"
        @handle-change-from="onTaskNumberDetailParentSelected"
        @handle-change-to="onTaskNumberDetailParentToSelected"
     />
      <AutoComplete
        :value-from="filterData.LocationIdChild"
        :value-to="filterData.LocationIdChildTo"
        label="Location Id Child"
        name="LocationIdChild"
        :options="listStore.locationIdChildOption"
        @handle-change-from="onLocationIdChildSelected"
        @handle-change-to="onLocationIdChildToSelected"
     />
      <AutoComplete
        :value-from="filterData.TaskNumberDetailChild"
        :value-to="filterData.TaskNumberDetailChildTo"
        label="Task Number Detail Child"
        name="TaskNumberDetailChild"
        :options="listStore.taskNumberDetailChildOption"
        @handle-change-from="onTaskNumberDetailChildSelected"
        @handle-change-to="onTaskNumberDetailChildToSelected"
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
} from "vue";
import {
  useAssignmentLocationCrackListStore
} from "@/store/pinia/iron-lake/crack-assignment/assignment-location-crack/useAssignmentLocationCrackListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/crack-assignment/assignment-location-crack/FilterData";

/* stores */
const listStore = useAssignmentLocationCrackListStore();
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
const onModelSelected = (value: string) => {
  listStore.setModel(value);
};
const onModelToSelected = (value: string) => {
  listStore.setModelTo(value);
};
const onPsTypeSelected = (value: string) => {
  listStore.setPsType(value);
};
const onPsTypeToSelected = (value: string) => {
  listStore.setPsTypeTo(value);
};
const onLocationIdParentSelected = (value: string) => {
  listStore.setLocationIdParent(value);
};
const onLocationIdParentToSelected = (value: string) => {
  listStore.setLocationIdParentTo(value);
};
const onTaskNumberDetailParentSelected = (value: string) => {
  listStore.setTaskNumberDetailParent(value);
};
const onTaskNumberDetailParentToSelected = (value: string) => {
  listStore.setTaskNumberDetailParentTo(value);
};
const onLocationIdChildSelected = (value: string) => {
  listStore.setLocationIdChild(value);
};
const onLocationIdChildToSelected = (value: string) => {
  listStore.setLocationIdChildTo(value);
};
const onTaskNumberDetailChildSelected = (value: string) => {
  listStore.setTaskNumberDetailChild(value);
};
const onTaskNumberDetailChildToSelected = (value: string) => {
  listStore.setTaskNumberDetailChildTo(value);
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
  const checkModel =
    listStore.lastUsedFilterData.Model !==
    listStore.filterData.Model;
  const checkModelTo =
    listStore.lastUsedFilterData.ModelTo !==
    listStore.filterData.ModelTo;
  const checkPsType =
    listStore.lastUsedFilterData.PsType !==
    listStore.filterData.PsType;
  const checkPsTypeTo =
    listStore.lastUsedFilterData.PsTypeTo !==
    listStore.filterData.PsTypeTo;
  const checkLocationIdParent =
    listStore.lastUsedFilterData.LocationIdParent !==
    listStore.filterData.LocationIdParent;
  const checkLocationIdParentTo =
    listStore.lastUsedFilterData.LocationIdParentTo !==
    listStore.filterData.LocationIdParentTo;
  const checkTaskNumberDetailParent =
    listStore.lastUsedFilterData.TaskNumberDetailParent !==
    listStore.filterData.TaskNumberDetailParent;
  const checkTaskNumberDetailParentTo =
    listStore.lastUsedFilterData.TaskNumberDetailParentTo !==
    listStore.filterData.TaskNumberDetailParentTo;
  const checkLocationIdChild =
    listStore.lastUsedFilterData.LocationIdChild !==
    listStore.filterData.LocationIdChild;
  const checkLocationIdChildTo =
    listStore.lastUsedFilterData.LocationIdChildTo !==
    listStore.filterData.LocationIdChildTo;
  const checkTaskNumberDetailChild =
    listStore.lastUsedFilterData.TaskNumberDetailChild !==
    listStore.filterData.TaskNumberDetailChild;
  const checkTaskNumberDetailChildTo =
    listStore.lastUsedFilterData.TaskNumberDetailChildTo !==
    listStore.filterData.TaskNumberDetailChildTo;
  const checkStartDate =
    listStore.lastUsedFilterData.StartDate !==
    listStore.filterData.StartDate;
  const checkStartDateTo =
    listStore.lastUsedFilterData.StartDateTo !==
    listStore.filterData.StartDateTo;
  const checkEndDate =
    listStore.lastUsedFilterData.EndDate !==
    listStore.filterData.EndDate;
  const checkEndDateTo =
    listStore.lastUsedFilterData.EndDateTo !==
    listStore.filterData.EndDateTo;
  const status = checkModel || checkModelTo || checkPsType || checkPsTypeTo || checkLocationIdParent || checkLocationIdParentTo || checkTaskNumberDetailParent || checkTaskNumberDetailParentTo || checkLocationIdChild || checkLocationIdChildTo || checkTaskNumberDetailChild || checkTaskNumberDetailChildTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo;
  emits("handle-close", status);
};
</script>
