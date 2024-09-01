<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.site"
        :value-to="filterData.siteTo"
        label="Site"
        name="Site"
        :options="listStore.siteOption"
        @handle-change-from="onSiteSelected"
        @handle-change-to="onSiteToSelected"
     />
      <AutoComplete
        :value-from="filterData.equipmentModel"
        :value-to="filterData.equipmentModelTo"
        label="Equipment Model"
        name="Equipment Model"
        :options="listStore.equipmentModelOption"
        @handle-change-from="onEquipmentModelSelected"
        @handle-change-to="onEquipmentModelToSelected"
     />
      <AutoComplete
        :value-from="filterData.weight"
        :value-to="filterData.weightTo"
        label="Weight"
        name="Weight"
        :options="listStore.weightOption"
        @handle-change-from="onWeightSelected"
        @handle-change-to="onWeightToSelected"
     />
      <AutoComplete
        :value-from="filterData.whPerday"
        :value-to="filterData.whPerdayTo"
        label="Wh Perday"
        name="WhPerday"
        :options="listStore.whPerdayOption"
        @handle-change-from="onWhPerdaySelected"
        @handle-change-to="onWhPerdayToSelected"
     />
      <AutoComplete
        :value-from="filterData.fuelBurn"
        :value-to="filterData.fuelBurnTo"
        label="Fuel Burn"
        name="FuelBurn"
        :options="listStore.fuelBurnOption"
        @handle-change-from="onFuelBurnSelected"
        @handle-change-to="onFuelBurnToSelected"
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
import AutoComplete from "@/components/inputs/range-inputs/v2/AutoComplete.vue";
import DatePickerInput from "@/components/inputs/range-inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useModelWeightListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/model-weight/useModelWeightListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/model-weight/FilterData";


/* stores */
const listStore = useModelWeightListStore();
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
const onSiteSelected = (value: string) => {
  listStore.setSite(value);
};
const onSiteToSelected = (value: string) => {
  listStore.setSiteTo(value);
};
const onEquipmentModelSelected = (value: string) => {
  listStore.setEquipmentModel(value);
};
const onEquipmentModelToSelected = (value: string) => {
  listStore.setEquipmentModelTo(value);
};
const onWeightSelected = (value: string) => {
  listStore.setWeight(value);
};
const onWeightToSelected = (value: string) => {
  listStore.setWeightTo(value);
};
const onWhPerdaySelected = (value: string) => {
  listStore.setWhPerday(value);
};
const onWhPerdayToSelected = (value: string) => {
  listStore.setWhPerdayTo(value);
};
const onFuelBurnSelected = (value: string) => {
  listStore.setFuelBurn(value);
};
const onFuelBurnToSelected = (value: string) => {
  listStore.setFuelBurnTo(value);
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
  const checkSite = listStore.lastUsedFilterData.site !== listStore.filterData.site
  const checkSiteTo = listStore.lastUsedFilterData.siteTo !== listStore.filterData.siteTo
  const checkEquipmentModel = listStore.lastUsedFilterData.equipmentModel !== listStore.filterData.equipmentModel
  const checkEquipmentModelTo = listStore.lastUsedFilterData.equipmentModelTo !== listStore.filterData.equipmentModelTo
  const checkWeight = listStore.lastUsedFilterData.weight !== listStore.filterData.weight
  const checkWeightTo = listStore.lastUsedFilterData.weightTo !== listStore.filterData.weightTo
  const checkWhPerday = listStore.lastUsedFilterData.whPerday !== listStore.filterData.whPerday
  const checkWhPerdayTo = listStore.lastUsedFilterData.whPerdayTo !== listStore.filterData.whPerdayTo
  const checkFuelBurn = listStore.lastUsedFilterData.fuelBurn !== listStore.filterData.fuelBurn
  const checkFuelBurnTo = listStore.lastUsedFilterData.fuelBurnTo !== listStore.filterData.fuelBurnTo
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (checkSite || checkSiteTo || checkEquipmentModel || checkEquipmentModelTo || checkWeight || checkWeightTo || checkWhPerday || checkWhPerdayTo || checkFuelBurn || checkFuelBurnTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo)
  emits("handle-close", status);
}
</script>
