<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.equipmentModel"
        :value-to="filterData.equipmentModelTo"
        label="Equipment Model"
        name="EquipmentModel"
        :options="listStore.equipmentModelOption"
        @handle-change-from="onEquipmentModelSelected"
        @handle-change-to="onEquipmentModelToSelected"
      />
      <AutoComplete
        :value-from="filterData.objectType"
        :value-to="filterData.objectTypeTo"
        label="Object Type"
        name="ObjectType"
        :options="listStore.objectTypeOption"
        @handle-change-from="onObjectTypeSelected"
        @handle-change-to="onObjectTypeToSelected"
      />
      <AutoComplete
        :value-from="filterData.cbmGroup"
        :value-to="filterData.cbmGroupTo"
        label="CBM Group"
        name="CbmGroup"
        :options="listStore.cbmGroupOption"
        @handle-change-from="onCbmGroupSelected"
        @handle-change-to="onCbmGroupToSelected"
      />
      <AutoComplete
        :value-from="filterData.area"
        :value-to="filterData.areaTo"
        label="Area"
        name="Area"
        :options="listStore.areaOption"
        @handle-change-from="onAreaSelected"
        @handle-change-to="onAreaToSelected"
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
  useCbmAreaMappingListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-area-mapping/useCbmAreaMappingListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-area-mapping/FilterData";


/* stores */
const listStore = useCbmAreaMappingListStore();
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
const onEquipmentModelSelected = (value: string) => {
  listStore.setEquipmentModel(value);
};
const onEquipmentModelToSelected = (value: string) => {
  listStore.setEquipmentModelTo(value);
};
const onObjectTypeSelected = (value: string) => {
  listStore.setObjectType(value);
};
const onObjectTypeToSelected = (value: string) => {
  listStore.setObjectTypeTo(value);
};
const onCbmGroupSelected = (value: string) => {
  listStore.setCbmGroup(value);
};
const onCbmGroupToSelected = (value: string) => {
  listStore.setCbmGroupTo(value);
};
const onAreaSelected = (value: string) => {
  listStore.setArea(value);
};
const onAreaToSelected = (value: string) => {
  listStore.setAreaTo(value);
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
  const checkEquipmentModel = listStore.lastUsedFilterData.equipmentModel !== listStore.filterData.equipmentModel
  const checkEquipmentModelTo = listStore.lastUsedFilterData.equipmentModelTo !== listStore.filterData.equipmentModelTo
  const checkObjectType = listStore.lastUsedFilterData.objectType !== listStore.filterData.objectType
  const checkObjectTypeTo = listStore.lastUsedFilterData.objectTypeTo !== listStore.filterData.objectTypeTo
  const checkCbmGroup = listStore.lastUsedFilterData.cbmGroup !== listStore.filterData.cbmGroup
  const checkCbmGroupTo = listStore.lastUsedFilterData.cbmGroupTo !== listStore.filterData.cbmGroupTo
  const checkArea = listStore.lastUsedFilterData.area !== listStore.filterData.area
  const checkAreaTo = listStore.lastUsedFilterData.areaTo !== listStore.filterData.areaTo
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (
    checkEquipmentModel ||
    checkEquipmentModelTo ||
    checkObjectType ||
    checkObjectTypeTo ||
    checkCbmGroup ||
    checkCbmGroupTo ||
    checkArea ||
    checkAreaTo ||
    checkStartDate ||
    checkStartDateTo ||
    checkEndDate ||
    checkEndDateTo
  )
  emits("handle-close", status);
}
</script>
