<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.class"
        :value-to="filterData.classTo"
        label="Class"
        name="Class"
        :options="listStore.classOption"
        @handle-change-from="onClassSelected"
        @handle-change-to="onClassToSelected"
     />
      <AutoComplete
        :value-from="filterData.characteristicType"
        :value-to="filterData.characteristicTypeTo"
        label="Characteristic Type"
        name="CharacteristicType"
        :options="listStore.characteristicTypeOption"
        @handle-change-from="onCharacteristicTypeSelected"
        @handle-change-to="onCharacteristicTypeToSelected"
     />
      <DatePickerInput
        :value-from="filterData.startDate ? filterData.startDate.toString() : ''"
        :value-to="filterData.startDateTo ? filterData.startDateTo.toString() : ''"
        label="Start Date"
        name="StartDate"
        placeholder="Pick a date"
        @handle-change-from="onStartDateSelected"
        @handle-change-to="onStartDateToSelected"
     />
      <DatePickerInput
        :value-from="filterData.endDate ? filterData.endDate.toString() : ''"
        :value-to="filterData.endDateTo ? filterData.endDateTo.toString() : ''"
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
  useClassCharacteristicListStore
} from "@/store/pinia/iron-lake/equipment/class-characteristic/useClassCharacteristicListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/class-characteristic/FilterData";


/* stores */
const listStore = useClassCharacteristicListStore();
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
const onClassSelected = (value: string) => {
  listStore.setClass(value);
};
const onClassToSelected = (value: string) => {
  listStore.setClassTo(value);
};
const onCharacteristicTypeSelected = (value: string) => {
  listStore.setCharacteristicType(value);
};
const onCharacteristicTypeToSelected = (value: string) => {
  listStore.setCharacteristicTypeTo(value);
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
  const checkClass = listStore.lastUsedFilterData.class !== listStore.filterData.class
  const checkClassTo = listStore.lastUsedFilterData.classTo !== listStore.filterData.classTo
  const checkCharacteristicType = listStore.lastUsedFilterData.characteristicType !== listStore.filterData.characteristicType
  const checkCharacteristicTypeTo = listStore.lastUsedFilterData.characteristicTypeTo !== listStore.filterData.characteristicTypeTo
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (checkClass || checkClassTo || checkCharacteristicType || checkCharacteristicTypeTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo)
  emits("handle-close", status);
}
</script>
