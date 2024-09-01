<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value-from="filterData.CharacteristicType"
            :value-to="filterData.CharacteristicTypeTo"
            label="Characteristic Type"
            name="CharacteristicType"
            :options="listStore.CharacteristicTypeOption"
            @handle-change-from="onCharacteristicTypeSelected"
            @handle-change-to="onCharacteristicTypeToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value-from="filterData.CharacteristicValue"
            :value-to="filterData.CharacteristicValueTo"
            label="Characteristic Type"
            name="CharacteristicValue"
            :options="listStore.CharacteristicValueOption"
            @handle-change-from="onCharacteristicValueSelected"
            @handle-change-to="onCharacteristicValueToSelected"
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
  useCharacteristicTypeValueListStore
} from "@/store/pinia/iron-lake/equipment/characteristic-type-value/useCharacteristicTypeValueListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/characteristic-type-value/FilterData";


/* stores */
const listStore = useCharacteristicTypeValueListStore();
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
const onCharacteristicTypeSelected = (value: string) => {
  listStore.setCharacteristicType(value);
}
const onCharacteristicValueSelected = (value: string) => {
  listStore.setCharacteristicValue(value);
}
const onCharacteristicTypeToSelected = (value: string) => {
  listStore.setCharacteristicTypeTo(value);
}
const onCharacteristicValueToSelected = (value: string) => {
  listStore.setCharacteristicValueTo(value);
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
  const checkCharacteristicType = listStore.lastUsedFilterData.CharacteristicType !== listStore.filterData.CharacteristicType
  const checkCharacteristicValue = listStore.lastUsedFilterData.CharacteristicValue !== listStore.filterData.CharacteristicValue
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const status = (checkCharacteristicType || checkCharacteristicValue || checkStartDate || checkEndDate)
  emits("handle-close", status);
}
</script>
