<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.CbmGroup"
        :value-to="filterData.CbmGroupTo"
        label="CBM Group"
        name="CbmGroup"
        :options="listStore.CbmGroupOption"
        @handle-change-from="onCbmGroupSelected"
        @handle-change-to="onCbmGroupToSelected"
     />
      <DatePickerInput
        :value-from="filterData.StartDateFrom ? filterData.StartDateFrom.toString() : ''"
        :value-to="filterData.StartDateTo ? filterData.StartDateTo.toString() : ''"
        label="Start Date"
        name="StartDate"
        placeholder="Pick a date"
        @handle-change-from="onStartDateFromSelected"
        @handle-change-to="onStartDateToSelected" />
      <DatePickerInput
        :value-from="filterData.EndDateFrom ? filterData.EndDateFrom.toString() : ''"
        :value-to="filterData.EndDateTo ? filterData.EndDateTo.toString() : ''"
        label="End Date"
        name="EndDate"
        placeholder="Pick a date"
        @handle-change-from="onEndDateFromSelected"
        @handle-change-to="onEndDateToSelected" />
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
  useCbmGroupListStore
} from "@/store/pinia/iron-lake/parameter/cbm-group/useCbmGroupListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/cbm-group/FilterData";

/* stores */
const listStore = useCbmGroupListStore();
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
const onCbmGroupSelected = (value: string) => {
  listStore.setCbmGroup(value);
};
const onCbmGroupToSelected = (value: string) => {
  listStore.setCbmGroupTo(value);
};
const onStartDateFromSelected = (value: string) => {
  listStore.setStartDateFrom(value);
};
const onStartDateToSelected = (value: string) => {
  listStore.setStartDateTo(value);
};
const onEndDateFromSelected = (value: string) => {
  listStore.setEndDateFrom(value);
};
const onEndDateToSelected = (value: string) => {
  listStore.setEndDateTo(value);
};
const handleFilterClick = () => {
  const checkCbmGroup =
    listStore.lastUsedFilterData.CbmGroup !==
    listStore.filterData.CbmGroup;
  const checkCbmGroupTo =
    listStore.lastUsedFilterData.CbmGroupTo !==
    listStore.filterData.CbmGroupTo;
  const checkStartDateFrom =
    listStore.lastUsedFilterData.StartDateFrom !==
    listStore.filterData.StartDateFrom;
  const checkStartDateTo =
    listStore.lastUsedFilterData.StartDateTo !==
    listStore.filterData.StartDateTo;
  const checkEndDateFrom =
    listStore.lastUsedFilterData.EndDateFrom !==
    listStore.filterData.EndDateFrom;
  const checkEndDateTo =
    listStore.lastUsedFilterData.EndDateTo !==
    listStore.filterData.EndDateTo;
  const status = checkCbmGroup || checkCbmGroupTo || checkStartDateFrom || checkStartDateTo || checkEndDateFrom || checkEndDateTo;
  emits("handle-close", status);
};
</script>
