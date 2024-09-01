<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.Position"
            label="Position"
            name="Position"
            :options="listStore.positionOption"
            @handle-change="onPositionSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.PositionDescription"
            label="Position Description"
            name="PositionDescription"
            :options="listStore.positionDescOption"
            @handle-change="onPositionDescSelected" />
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
           <SwitchInput
              :value="filterData.IsDma"
              label="Is DMA"
              name="IsDma"
              @handle-change="onIsDmaSelected" />
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
import SwitchInput from "@/components/inputs/SwitchInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  usePositionListStore
} from "@/store/pinia/administration/organization-unit/position/usePositionListStore";
import {
  FilterData
} from "@/core/types/entities/administration/organization-unit/position/FilterData";


/* stores */
const listStore = usePositionListStore();
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
const onPositionSelected = (value: string) => {
  listStore.setPosition(value);
}
const onPositionDescSelected = (value: string) => {
  listStore.setPositionDescription(value);
}
const onStartDateSelected = (value) => {
  listStore.setStartDate(value);
}
const onEndDateSelected = (value) => {
  listStore.setEndDate(value);
}
const onIsDmaSelected = (value) => {
  listStore.setIsDma(value)
}
const handleFilterClick = () => {
  const checkPosition = listStore.lastUsedFilterData.Position !== listStore.filterData.Position;
  const checkPositionDesc = listStore.lastUsedFilterData.PositionDescription !== listStore.filterData.PositionDescription;
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate;
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate;
  const checkIsDma = listStore.lastUsedFilterData.IsDma !== listStore.filterData.IsDma;
  const status = (checkPosition || checkPositionDesc || checkStartDate || checkEndDate || checkIsDma)
  emits("handle-close", status);
}
</script>
