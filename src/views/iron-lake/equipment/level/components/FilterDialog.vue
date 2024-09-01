<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.Level"
              :value-to="filterData.LevelTo"
              label="Level"
              name="Level"
              :options="listStore.levelOption"
              @handle-change-from="onLevelSelected"
              @handle-change-to="onLevelToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.Parent"
              :value-to="filterData.ParentTo"
              label="Parent"
              name="Parent"
              :options="listStore.parentOption"
              @handle-change-from="onParentSelected"
              @handle-change-to="onParentToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <DatePicker
              :value-from="filterData.StartDate"
              :value-to="filterData.StartDateTo"
              label="Start Date"
              @handle-change-from="onStartDateSelected"
              @handle-change-to="onStartDateToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <DatePicker
              :value-from="filterData.EndDate"
              :value-to="filterData.EndDateTo"
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
import DatePicker from "@/components/inputs/range-inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useLevelListStore
} from "@/store/pinia/iron-lake/equipment/level/useLevelListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/level/FilterData";

/* stores */
const listStore = useLevelListStore();
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
const onLevelSelected = (value: string) => {
  listStore.setLevel(value);
}
const onParentSelected = (value: string) => {
  listStore.setParent(value);
}
const onLevelToSelected = (value: string) => {
  listStore.setLevelTo(value);
}
const onParentToSelected = (value: string) => {
  listStore.setParentTo(value);
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
  const checkLevel = listStore.lastUsedFilterData.Level !== listStore.filterData.Level
  const checkParent = listStore.lastUsedFilterData.Parent !== listStore.filterData.Parent
  const checkLevelTo = listStore.lastUsedFilterData.LevelTo !== listStore.filterData.LevelTo
  const checkParentTo = listStore.lastUsedFilterData.ParentTo !== listStore.filterData.ParentTo
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const checkStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const checkEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const status = (checkLevel || checkParent || checkLevelTo || checkParentTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo)
  emits("handle-close", status);
}
</script>
