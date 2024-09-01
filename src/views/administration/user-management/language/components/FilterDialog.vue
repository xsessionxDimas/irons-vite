<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.Code"
            label="Code"
            name="Code"
            :options="listStore.codeOption"
            @handle-change="onCodeSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.ValueId"
            label="Value ID"
            name="ValueId"
            :options="listStore.valueIdOption"
            @handle-change="onValueIdSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.ValueEn"
            label="Value EN"
            name="ValueEn"
            :options="listStore.valueEnOption"
            @handle-change="onValueEnSelected" />
          </div>
          <DatePickerInput
              :value="(filterData.StartDate as Date)"
              placeholder="Select Start Date"
              grid-class="col-md-6"
              label="Start Date"
              name="StartDate"
              @handle-change="onStartDateSelected"
           />
          <DatePickerInput
              :value="(filterData.EndDate as Date)"
              placeholder="Select End Date"
              grid-class="col-md-6"
              label="End Date"
              name="EndDate"
              @handleChange="onEndDateSelected"
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
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useLanguageListStore
} from "@/store/pinia/administration/user-management/language/useLanguageListStore";
import {
  FilterData
} from "@/core/types/entities/administration/user-management/language/FilterData";


/* stores */
const listStore = useLanguageListStore();
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
const onCodeSelected = (value: string) => {
  listStore.setCode(value);
}
const onValueIdSelected = (value: string) => {
  listStore.setValueId(value);
}
const onValueEnSelected = (value: string) => {
  listStore.setValueEn(value);
}
const onStartDateSelected = (value) => {
  listStore.setStartDate(value);
}
const onEndDateSelected = (value) => {
  listStore.setEndDate(value);
}
const handleFilterClick = () => {
  const checkCode = listStore.lastUsedFilterData.Code !== listStore.filterData.Code;
  const checkValueId = listStore.lastUsedFilterData.ValueId !== listStore.filterData.ValueId;
  const checkValueEn = listStore.lastUsedFilterData.ValueEn !== listStore.filterData.ValueEn;
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate;
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate;
  const status = (checkCode || checkValueId || checkValueEn || checkStartDate || checkEndDate)
  emits("handle-close", status);
}
</script>
