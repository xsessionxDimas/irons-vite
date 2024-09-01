<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.EquipmentNumber"
              :value-to="filterData.EquipmentNumberTo"
              label="Equipment Number"
              name="EquipmentNumber"
              :options="listStore.equipmentNumberOption"
              @handle-change-from="onEquipmentNumberSelected"
              @handle-change-to="onEquipmentNumberToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.SerialNumber"
              :value-to="filterData.SerialNumberTo"
              label="Serial Number"
              name="SerialNumber"
              :options="listStore.SerialNumberOption"
              @handle-change-from="onLevelSelected"
              @handle-change-to="onLevelToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.Level"
              :value-to="filterData.LevelTo"
              label="Level"
              name="level"
              :options="formStore.levelDescOption"
              @handle-change-from="onLevelSelected"
              @handle-change-to="onLevelToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <DatePickerInput
              :value-from="filterData.StartDate"
              :value-to="filterData.StartDateTo"
              label="Start Date"
              @handle-change-from="onStartDateSelected"
              @handle-change-to="onStartDateToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <DatePickerInput
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
import DatePickerInput from "@/components/inputs/range-inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useEquipmentNumberListStore
} from "@/store/pinia/iron-lake/equipment/equipment-number/useEquipmentNumberListStore";
import {
  useEquipmentNumberFormStore
} from "@/store/pinia/iron-lake/equipment/equipment-number/useEquipmentNumberFormStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/equipment-number/FilterData";


/* stores */
const listStore = useEquipmentNumberListStore();
const formStore = useEquipmentNumberFormStore();
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
const onEquipmentNumberSelected = (value: string) => {
  listStore.setEquipmentNumber(value);
}
const onLevelSelected = (value: string) => {
  listStore.setLevel(value)
}
const onSerialNumberSelected = (value: string) => {
  listStore.setSerialNumber(value)
}
const onEquipmentNumberToSelected = (value: string) => {
  listStore.setEquipmentNumberTo(value);
}
const onLevelToSelected = (value: string) => {
  listStore.setLevelTo(value)
}
const onSerialNumberToSelected = (value: string) => {
  listStore.setSerialNumberTo(value)
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
  const checkEquipmentNumber = listStore.lastUsedFilterData.EquipmentNumber !== listStore.filterData.EquipmentNumber
  const checkLevel = listStore.lastUsedFilterData.Level !== listStore.filterData.Level
  const checkSerialNumber = listStore.lastUsedFilterData.SerialNumber !== listStore.filterData.SerialNumber
  const checkEquipmentNumberTo = listStore.lastUsedFilterData.EquipmentNumberTo !== listStore.filterData.EquipmentNumberTo
  const checkLevelTo = listStore.lastUsedFilterData.LevelTo !== listStore.filterData.LevelTo
  const checkSerialNumberTo = listStore.lastUsedFilterData.SerialNumberTo !== listStore.filterData.SerialNumberTo
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const checkStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const checkEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const status = (checkEquipmentNumber || checkLevel || checkSerialNumber || checkEquipmentNumberTo || checkLevelTo || checkSerialNumberTo || checkStartDate || checkEndDate || checkStartDateTo || checkEndDateTo)
  emits("handle-close", status);
}
</script>
