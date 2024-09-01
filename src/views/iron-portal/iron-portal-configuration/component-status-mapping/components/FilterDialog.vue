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
        name="EquipmentModel"
        :options="listStore.equipmentModelOption"
        @handle-change-from="onEquipmentModelSelected"
        @handle-change-to="onEquipmentModelToSelected"
      />
      <AutoComplete
        :value-from="filterData.componentStatusId"
        :value-to="filterData.componentStatusIdTo"
        label="Component Status ID"
        name="ComponentStatusId"
        :options="listStore.componentStatusIdOption"
        @handle-change-from="onComponentStatusIdSelected"
        @handle-change-to="onComponentStatusIdToSelected"
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
        :value-from="filterData.rating"
        :value-to="filterData.ratingTo"
        label="Rating"
        name="Rating"
        :options="listStore.ratingOption"
        @handle-change-from="onRatingSelected"
        @handle-change-to="onRatingToSelected"
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
  useComponentStatusMappingListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-status-mapping/useComponentStatusMappingListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status-mapping/FilterData";


/* stores */
const listStore = useComponentStatusMappingListStore();
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
const onComponentStatusIdSelected = (value: string) => {
  listStore.setComponentStatusId(value);
};
const onComponentStatusIdToSelected = (value: string) => {
  listStore.setComponentStatusIdTo(value);
};
const onCbmGroupSelected = (value: string) => {
  listStore.setCbmGroup(value);
};
const onCbmGroupToSelected = (value: string) => {
  listStore.setCbmGroupTo(value);
};
const onRatingSelected = (value: string) => {
  listStore.setRating(value);
};
const onRatingToSelected = (value: string) => {
  listStore.setRatingTo(value);
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
  const checkComponentStatusId = listStore.lastUsedFilterData.componentStatusId !== listStore.filterData.componentStatusId
  const checkComponentStatusIdTo = listStore.lastUsedFilterData.componentStatusIdTo !== listStore.filterData.componentStatusIdTo
  const checkCbmGroup = listStore.lastUsedFilterData.cbmGroup !== listStore.filterData.cbmGroup
  const checkCbmGroupTo = listStore.lastUsedFilterData.cbmGroupTo !== listStore.filterData.cbmGroupTo
  const checkRating = listStore.lastUsedFilterData.rating !== listStore.filterData.rating
  const checkRatingTo = listStore.lastUsedFilterData.ratingTo !== listStore.filterData.ratingTo
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (
    checkSite ||
    checkSiteTo ||
    checkEquipmentModel ||
    checkEquipmentModelTo ||
    checkComponentStatusId ||
    checkComponentStatusIdTo ||
    checkCbmGroup ||
    checkCbmGroupTo ||
    checkRating ||
    checkRatingTo ||
    checkStartDate ||
    checkStartDateTo ||
    checkEndDate ||
    checkEndDateTo
  )
  emits("handle-close", status);
}
</script>
