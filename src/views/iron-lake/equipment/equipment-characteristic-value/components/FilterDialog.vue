<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.equipment"
        :value-to="filterData.equipmentTo"
        label="Equipment"
        name="Equipment"
        :options="listStore.equipmentOption"
        @handle-change-from="onEquipmentSelected"
        @handle-change-to="onEquipmentToSelected"
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
      <AutoComplete
        :value-from="filterData.characteristicValue"
        :value-to="filterData.characteristicValueTo"
        label="Characteristic Value"
        name="CharacteristicValue"
        :options="listStore.characteristicValueOption"
        @handle-change-from="onCharacteristicValueSelected"
        @handle-change-to="onCharacteristicValueToSelected"
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
  useEquipmentCharacteristicValueListStore
} from "@/store/pinia/iron-lake/equipment/equipment-characteristic-value/useEquipmentCharacteristicValueListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/equipment-characteristic-value/FilterData";


/* stores */
const listStore = useEquipmentCharacteristicValueListStore();
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
const onEquipmentSelected = (value: string) => {
  listStore.setEquipment(value);
};
const onEquipmentToSelected = (value: string) => {
  listStore.setEquipmentTo(value);
};
const onCharacteristicTypeSelected = (value: string) => {
  listStore.setCharacteristicType(value);
};
const onCharacteristicTypeToSelected = (value: string) => {
  listStore.setCharacteristicTypeTo(value);
};
const onCharacteristicValueSelected = (value: string) => {
  listStore.setCharacteristicValue(value);
};
const onCharacteristicValueToSelected = (value: string) => {
  listStore.setCharacteristicValueTo(value);
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
  const checkEquipment = listStore.lastUsedFilterData.equipment !== listStore.filterData.equipment
  const checkEquipmentTo = listStore.lastUsedFilterData.equipmentTo !== listStore.filterData.equipmentTo
  const checkCharacteristicType = listStore.lastUsedFilterData.characteristicType !== listStore.filterData.characteristicType
  const checkCharacteristicTypeTo = listStore.lastUsedFilterData.characteristicTypeTo !== listStore.filterData.characteristicTypeTo
  const checkCharacteristicValue = listStore.lastUsedFilterData.characteristicValue !== listStore.filterData.characteristicValue
  const checkCharacteristicValueTo = listStore.lastUsedFilterData.characteristicValueTo !== listStore.filterData.characteristicValueTo
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (checkEquipment || checkEquipmentTo || checkCharacteristicType || checkCharacteristicTypeTo || checkCharacteristicValue || checkCharacteristicValueTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo)
  emits("handle-close", status);
}
</script>
