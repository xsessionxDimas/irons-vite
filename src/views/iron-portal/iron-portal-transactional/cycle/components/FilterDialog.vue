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
        name="site"
        :options="listStore.siteOption"
        @handle-change-from="onSiteSelected"
        @handle-change-to="onSiteToSelected"
      />
      <AutoComplete
        :value-from="filterData.equipmentModel"
        :value-to="filterData.equipmentModelTo"
        label="Model"
        name="equipmentModel"
        :options="listStore.modelOption"
        @handle-change-from="onEquipmentModelSelected"
        @handle-change-to="onEquipmentModelToSelected"
      />
      <AutoComplete
        :value-from="filterData.equipmentNumber"
        :value-to="filterData.equipmentNumberTo"
        label="Equipment"
        name="Equipment"
        :options="listStore.equipmentOption"
        @handle-change-from="onEquipmentSelected"
        @handle-change-to="onEquipmentToSelected"
      />
      <AutoComplete
        :value-from="filterData.component"
        :value-to="filterData.componentTo"
        label="Component"
        name="component"
        :options="listStore.componentOption"
        @handle-change-from="onComponentSelected"
        @handle-change-to="onComponentToSelected"
      />
      <AutoComplete
        :value-from="filterData.hoCycleTarget"
        :value-to="filterData.hoCycleTargetTo"
        label="Ho Cycle Target"
        name="hoCycleTarget"
        :options="listStore.hoCycleTargetOption"
        @handle-change-from="onHoCycleTargetSelected"
        @handle-change-to="onHoCycleTargetToSelected"
      />
      <AutoComplete
        :value-from="filterData.siteCycleTarget"
        :value-to="filterData.siteCycleTargetTo"
        label="Site Cycle Target"
        name="siteCycleTarget"
        :options="listStore.siteCycleTargetOption"
        @handle-change-from="onSiteCycleTargetSelected"
        @handle-change-to="onSiteCycleTargetToSelected"
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
  useCycleListStore
} from "@/store/pinia/iron-portal/iron-portal-transactional/cycle/useCycleListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-transactional/cycle/FilterData";


/* stores */
const listStore = useCycleListStore();
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
const onEquipmentSelected = (value: string) => {
  listStore.setEquipment(value);
};
const onEquipmentToSelected = (value: string) => {
  listStore.setEquipmentTo(value);
};
const onHoCycleTargetSelected = (value: string) => {
  listStore.setHoCycleTarget(value);
};
const onHoCycleTargetToSelected = (value: string) => {
  listStore.setHoCycleTargetTo(value);
};
const onComponentSelected = (value: string) => {
  listStore.setComponent(value);
};
const onComponentToSelected = (value: string) => {
  listStore.setComponentTo(value);
};
const onSiteCycleTargetSelected = (value: string) => {
  listStore.setSiteCycleTarget(value);
};
const onSiteCycleTargetToSelected = (value: string) => {
  listStore.setSiteCycleTargetTo(value);
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
  const checkEquipment = listStore.lastUsedFilterData.equipmentNumber !== listStore.filterData.equipmentNumber
  const checkEquipmentTo = listStore.lastUsedFilterData.equipmentNumberTo !== listStore.filterData.equipmentNumberTo
  const checkComponent = listStore.lastUsedFilterData.component !== listStore.filterData.component
  const checkComponentTo = listStore.lastUsedFilterData.componentTo !== listStore.filterData.componentTo
  const checkHoCycleTarget = listStore.lastUsedFilterData.hoCycleTarget !== listStore.filterData.hoCycleTarget
  const checkHoCycleTargetTo = listStore.lastUsedFilterData.hoCycleTargetTo !== listStore.filterData.hoCycleTargetTo
  const checkSiteCycleTarget = listStore.lastUsedFilterData.siteCycleTarget !== listStore.filterData.siteCycleTarget
  const checkSiteCycleTargetTo = listStore.lastUsedFilterData.siteCycleTargetTo !== listStore.filterData.siteCycleTargetTo
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (checkSite || checkSiteTo || checkEquipmentModel || checkEquipmentModelTo ||
        checkEquipment || checkEquipmentTo || checkComponent || checkComponentTo ||
        checkHoCycleTarget || checkHoCycleTargetTo || checkSiteCycleTarget || checkSiteCycleTargetTo ||
        checkStartDate ||
        checkStartDateTo ||
        checkEndDate || checkEndDateTo)
  emits("handle-close", status);
}
</script>
