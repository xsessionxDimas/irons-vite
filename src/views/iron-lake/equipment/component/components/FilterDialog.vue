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
          :value="filterData.Component"
          label="Component"
          name="Component"
          :options="listStore.componentOption"
          @handle-change="onComponentSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.ComponentDescription"
          label="Component Description"
          name="ComponentDescription"
          :options="listStore.componentDescOption"
          @handle-change="onComponentDescSelected"
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
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.Level"
          label="Level"
          name="Level"
          :options="listStore.componentLevelOption"
          @handle-change="onLevelSelected"
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
  useComponentListStore
} from "@/store/pinia/iron-lake/equipment/component/useComponentListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/component/FilterData";

/* stores */
const listStore = useComponentListStore();
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
const onComponentSelected = (value: string) => {
  listStore.setComponent(value);
};
const onComponentDescSelected = (value: string) => {
  listStore.setComponentDescription(value);
};
const onLevelSelected = (value: string) => {
  listStore.setLevel(value);
};
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value);
};
const onEndDateSelected = (value: string) => {
  listStore.setEndDate(value);
};
const handleFilterClick = () => {
  const checkComponent =
    listStore.lastUsedFilterData.Component !==
    listStore.filterData.Component;
  const checkComponentDesc =
    listStore.lastUsedFilterData.ComponentDescription !==
    listStore.filterData.ComponentDescription;
  const checkLevel =
    listStore.lastUsedFilterData.Level !==
    listStore.filterData.Level;
  const checkStartDate =
    listStore.lastUsedFilterData.StartDate !==
    listStore.filterData.StartDate;
  const checkEndDate =
    listStore.lastUsedFilterData.EndDate !==
    listStore.filterData.EndDate;
  const status = checkComponent || checkComponentDesc || checkLevel || checkStartDate || checkEndDate;
  emits("handle-close", status);
};
</script>
