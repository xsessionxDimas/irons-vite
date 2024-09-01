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
        :value-from="filterData.equipmentNumber"
        :value-to="filterData.equipmentNumberTo"
        label="Equipment Number"
        name="EquipmentNumber"
        :options="listStore.equipmentNumberOption"
        @handle-change-from="onEquipmentNumberSelected"
        @handle-change-to="onEquipmentNumberToSelected"
      />
      <AutoComplete
        :value-from="filterData.component"
        :value-to="filterData.componentTo"
        label="Component"
        name="Component"
        :options="listStore.componentOption"
        @handle-change-from="onComponentSelected"
        @handle-change-to="onComponentToSelected"
      />
      <AutoComplete
        :value-from="filterData.smu"
        :value-to="filterData.smuTo"
        label="SMU"
        name="Smu"
        :options="listStore.smuOption"
        @handle-change-from="onSmuSelected"
        @handle-change-to="onSmuToSelected"
      />
      <AutoComplete
        :value-from="filterData.counterReading"
        :value-to="filterData.counterReadingTo"
        label="Component Life"
        name="CounterReading"
        :options="listStore.counterReadingOption"
        @handle-change-from="onCounterReadingSelected"
        @handle-change-to="onCounterReadingToSelected"
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
  useCounterReadingListStore
} from "@/store/pinia/iron-portal/iron-portal-transactional/counter-reading/useCounterReadingListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-transactional/counter-reading/FilterData";


/* stores */
const listStore = useCounterReadingListStore();
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
  listStore.resetFilter()
  handleCloseModal()
};
const handleCloseModal = () => {
  emits("handle-close", false);
};
const onSiteSelected = (value: string) => {
  console.log("site ", value)
  listStore.setSite(value);
};
const onSiteToSelected = (value: string) => {
  console.log("site to ", value)
  listStore.setSiteTo(value);
};
const onEquipmentModelSelected = (value: string) => {
  listStore.setEquipmentModel(value);
};
const onEquipmentModelToSelected = (value: string) => {
  listStore.setEquipmentModelTo(value);
};
const onEquipmentNumberSelected = (value: string) => {
  listStore.setEquipmentNumber(value);
};
const onEquipmentNumberToSelected = (value: string) => {
  listStore.setEquipmentNumberTo(value);
};
const onComponentSelected = (value: string) => {
  listStore.setComponent(value);
};
const onComponentToSelected = (value: string) => {
  listStore.setComponentTo(value);
};
const onSmuSelected = (value: string) => {
  listStore.setSmu(value);
};
const onSmuToSelected = (value: string) => {
  listStore.setSmuTo(value);
};
const onCounterReadingSelected = (value: string) => {
  listStore.setCounterReading(value);
};
const onCounterReadingToSelected = (value: string) => {
  listStore.setCounterReadingTo(value);
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
  const checkEquipmentNumber = listStore.lastUsedFilterData.equipmentNumber !== listStore.filterData.equipmentNumber
  const checkEquipmentNumberTo = listStore.lastUsedFilterData.equipmentNumberTo !== listStore.filterData.equipmentNumberTo
  const checkComponent = listStore.lastUsedFilterData.component !== listStore.filterData.component
  const checkComponentTo = listStore.lastUsedFilterData.componentTo !== listStore.filterData.componentTo
  const checkSmu = listStore.lastUsedFilterData.smu !== listStore.filterData.smu
  const checkSmuTo = listStore.lastUsedFilterData.smuTo !== listStore.filterData.smuTo
  const checkCounterReading = listStore.lastUsedFilterData.counterReading !== listStore.filterData.counterReading
  const checkCounterReadingTo = listStore.lastUsedFilterData.counterReadingTo !== listStore.filterData.counterReadingTo
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (
    checkSite ||
    checkSiteTo ||
    checkEquipmentModel ||
    checkEquipmentModelTo ||
    checkEquipmentNumber ||
    checkEquipmentNumberTo ||
    checkComponent ||
    checkComponentTo ||
    checkSmu ||
    checkSmuTo ||
    checkCounterReading ||
    checkCounterReadingTo ||
    checkStartDate ||
    checkStartDateTo ||
    checkEndDate ||
    checkEndDateTo
  )
  emits("handle-close", status);
}
</script>
