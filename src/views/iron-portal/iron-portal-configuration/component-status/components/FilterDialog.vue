<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
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
        :value-from="filterData.sensorData"
        :value-to="filterData.sensorDataTo"
        label="Sensor Data"
        name="SensorData"
        :options="listStore.sensorDataOption"
        @handle-change-from="onSensorDataSelected"
        @handle-change-to="onSensorDataToSelected"
      />
      <AutoComplete
        :value-from="filterData.oilDataS1"
        :value-to="filterData.oilDataS1To"
        label="Oil Data S1"
        name="OilDataS1"
        :options="listStore.oilDataS1Option"
        @handle-change-from="onOilDataS1Selected"
        @handle-change-to="onOilDataS1ToSelected"
      />
      <AutoComplete
        :value-from="filterData.oilDataS2"
        :value-to="filterData.oilDataS2To"
        label="Oil Data S2"
        name="OilDataS2"
        :options="listStore.oilDataS2Option"
        @handle-change-from="onOilDataS2Selected"
        @handle-change-to="onOilDataS2ToSelected"
      />
      <AutoComplete
        :value-from="filterData.filterCutS1"
        :value-to="filterData.filterCutS1To"
        label="Filter Cut S1"
        name="FilterCutS1"
        :options="listStore.filterCutS1Option"
        @handle-change-from="onFilterCutS1Selected"
        @handle-change-to="onFilterCutS1ToSelected"
      />
      <AutoComplete
        :value-from="filterData.filterCutS2"
        :value-to="filterData.filterCutS2To"
        label="Filter Cut S2"
        name="FilterCutS2"
        :options="listStore.filterCutS2Option"
        @handle-change-from="onFilterCutS2Selected"
        @handle-change-to="onFilterCutS2ToSelected"
      />
      <AutoComplete
        :value-from="filterData.magPlug"
        :value-to="filterData.magPlugTo"
        label="Mag Plug"
        name="MagPlug"
        :options="listStore.magPlugOption"
        @handle-change-from="onMagPlugSelected"
        @handle-change-to="onMagPlugToSelected"
      />
      <AutoComplete
        :value-from="filterData.ironFormsCbm"
        :value-to="filterData.ironFormsCbmTo"
        label="Iron Forms CBM"
        name="IronFormsCbm"
        :options="listStore.ironFormsCbmOption"
        @handle-change-from="onIronFormsCbmSelected"
        @handle-change-to="onIronFormsCbmToSelected"
      />
      <AutoComplete
        :value-from="filterData.componentStatus"
        :value-to="filterData.componentStatusTo"
        label="Component Status"
        name="ComponentStatus"
        :options="listStore.componentStatusOption"
        @handle-change-from="onComponentStatusSelected"
        @handle-change-to="onComponentStatusToSelected"
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
  useComponentStatusListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-status/useComponentStatusListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status/FilterData";


/* stores */
const listStore = useComponentStatusListStore();
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
const onComponentSelected = (value: string) => {
  listStore.setComponent(value)
};
const onComponentToSelected = (value: string) => {
  listStore.setComponentTo(value)
};
const onSensorDataSelected = (value: string) => {
  listStore.setSensorData(value)
};
const onSensorDataToSelected = (value: string) => {
  listStore.setSensorDataTo(value)
};
const onOilDataS1Selected = (value: string) => {
  listStore.setOilDataS1(value)
};
const onOilDataS1ToSelected = (value: string) => {
  listStore.setOilDataS1To(value)
};
const onOilDataS2Selected = (value: string) => {
  listStore.setOilDataS2(value)
};
const onOilDataS2ToSelected = (value: string) => {
  listStore.setOilDataS2To(value)
};
const onFilterCutS1Selected = (value: string) => {
  listStore.setFilterCutS1(value)
};
const onFilterCutS1ToSelected = (value: string) => {
  listStore.setFilterCutS1To(value)
};
const onFilterCutS2Selected = (value: string) => {
  listStore.setFilterCutS2(value)
};
const onFilterCutS2ToSelected = (value: string) => {
  listStore.setFilterCutS2To(value)
};
const onMagPlugSelected = (value: string) => {
  listStore.setMagPlug(value)
};
const onMagPlugToSelected = (value: string) => {
  listStore.setMagPlugTo(value)
};
const onIronFormsCbmSelected = (value: string) => {
  listStore.setIronFormsCbm(value)
};
const onIronFormsCbmToSelected = (value: string) => {
  listStore.setIronFormsCbmTo(value)
};
const onComponentStatusSelected = (value: string) => {
  listStore.setComponentStatus(value);
};
const onComponentStatusToSelected = (value: string) => {
  listStore.setComponentStatusTo(value);
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
  const checkComponent = listStore.lastUsedFilterData.component !== listStore.filterData.component
  const checkComponentTo = listStore.lastUsedFilterData.componentTo !== listStore.filterData.componentTo
  const checkSensorData = listStore.lastUsedFilterData.sensorData !== listStore.filterData.sensorData
  const checkSensorDataTo = listStore.lastUsedFilterData.sensorDataTo !== listStore.filterData.sensorDataTo
  const checkOilDataS1 = listStore.lastUsedFilterData.oilDataS1 !== listStore.filterData.oilDataS1
  const checkOilDataS1To = listStore.lastUsedFilterData.oilDataS1To !== listStore.filterData.oilDataS1To
  const checkOilDataS2 = listStore.lastUsedFilterData.oilDataS2 !== listStore.filterData.oilDataS2
  const checkOilDataS2To = listStore.lastUsedFilterData.oilDataS2To !== listStore.filterData.oilDataS2To
  const checkFilterCutS1 = listStore.lastUsedFilterData.filterCutS1 !== listStore.filterData.filterCutS1
  const checkFilterCutS1To = listStore.lastUsedFilterData.filterCutS1To !== listStore.filterData.filterCutS1To
  const checkFilterCutS2 = listStore.lastUsedFilterData.filterCutS2 !== listStore.filterData.filterCutS2
  const checkFilterCutS2To = listStore.lastUsedFilterData.filterCutS2To !== listStore.filterData.filterCutS2To
  const checkMagPlug = listStore.lastUsedFilterData.magPlug !== listStore.filterData.magPlug
  const checkMagPlugTo = listStore.lastUsedFilterData.magPlugTo !== listStore.filterData.magPlugTo
  const checkIronFormsCbm = listStore.lastUsedFilterData.ironFormsCbm !== listStore.filterData.ironFormsCbm
  const checkIronFormsCbmTo = listStore.lastUsedFilterData.ironFormsCbmTo !== listStore.filterData.ironFormsCbmTo
  const checkComponentStatus = listStore.lastUsedFilterData.componentStatus !== listStore.filterData.componentStatus
  const checkComponentStatusTo = listStore.lastUsedFilterData.componentStatusTo !== listStore.filterData.componentStatusTo
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (
    checkComponent ||
    checkComponentTo ||
    checkSensorData ||
    checkSensorDataTo ||
    checkOilDataS1 ||
    checkOilDataS1To ||
    checkOilDataS2 ||
    checkOilDataS2To ||
    checkFilterCutS1 ||
    checkFilterCutS1To ||
    checkFilterCutS2 ||
    checkFilterCutS2To ||
    checkMagPlug ||
    checkMagPlugTo ||
    checkIronFormsCbm ||
    checkIronFormsCbmTo ||
    checkComponentStatus ||
    checkComponentStatusTo ||
    checkStartDate ||
    checkStartDateTo ||
    checkEndDate ||
    checkEndDateTo
  )
  emits("handle-close", status);
}
</script>
