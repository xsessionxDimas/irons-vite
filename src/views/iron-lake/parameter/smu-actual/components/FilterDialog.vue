<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.Model"
        :value-to="filterData.ModelTo"
        label="Model"
        name="Model"
        :options="listStore.modelOption"
        @handle-change-from="onModelSelected"
        @handle-change-to="onModelToSelected"
     />
      <AutoComplete
        :value-from="filterData.PsType"
        :value-to="filterData.PsTypeTo"
        label="Ps Type"
        name="PsType"
        :options="listStore.psTypeOption"
        @handle-change-from="onPsTypeSelected"
        @handle-change-to="onPsTypeToSelected"
     />
      <AutoComplete
        :value-from="filterData.SmuActual"
        :value-to="filterData.SmuActualTo"
        label="SMU Actual"
        name="SmuActual"
        :options="listStore.smuActualOption"
        @handle-change-from="onSmuActualSelected"
        @handle-change-to="onSmuActualToSelected"
     />
      <AutoComplete
        :value-from="filterData.Uom"
        :value-to="filterData.UomTo"
        label="Smu Due"
        name="Uom"
        :options="listStore.uomOption"
        @handle-change-from="onUomSelected"
        @handle-change-to="onUomToSelected"
     />
      <DatePickerInput
        :value-from="filterData.StartDate ? filterData.StartDate.toString() : ''"
        :value-to="filterData.StartDateTo ? filterData.StartDateTo.toString() : ''"
        label="Start Date"
        name="StartDate"
        placeholder="Pick a date"
        @handle-change-from="onStartDateSelected"
        @handle-change-to="onStartDateToSelected"
     />
      <DatePickerInput
        :value-from="filterData.EndDate ? filterData.EndDate.toString() : ''"
        :value-to="filterData.EndDateTo ? filterData.EndDateTo.toString() : ''"
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
} from "vue";
import {
  useSmuActualListStore
} from "@/store/pinia/iron-lake/parameter/smu-actual/useSmuActualListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/smu-actual/FilterData";

/* stores */
const listStore = useSmuActualListStore();
const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["handle-close"]);

/* refs*/
const isVisible = toRef(props, "visibility");
const filterData: ComputedRef<FilterData> = computed(() => {
  return listStore.filterData;
});

/* handlers */
const handleReset = () => {
  handleCloseModal();
  listStore.resetFilter();
};
const handleCloseModal = () => {
  emits("handle-close", false);
};
const onModelSelected = (value: string) => {
  listStore.setModel(value);
};
const onModelToSelected = (value: string) => {
  listStore.setModelTo(value);
};
const onSmuActualSelected = (value: string) => {
  listStore.setSmuActual(value);
};
const onSmuActualToSelected = (value: string) => {
  listStore.setSmuActualTo(value);
};
const onUomSelected = (value: string) => {
  listStore.setUom(value);
};
const onUomToSelected = (value: string) => {
  listStore.setUomTo(value);
};
const onPsTypeSelected = (value: string) => {
  listStore.setPsType(value);
};
const onPsTypeToSelected = (value: string) => {
  listStore.setPsTypeTo(value);
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
  const checkUom =
    listStore.lastUsedFilterData.Uom !==
    listStore.filterData.Uom;
  const checkUomTo =
    listStore.lastUsedFilterData.UomTo !==
    listStore.filterData.UomTo;
  const checkPsType =
    listStore.lastUsedFilterData.PsType !==
    listStore.filterData.PsType;
  const checkPsTypeTo =
    listStore.lastUsedFilterData.PsTypeTo !==
    listStore.filterData.PsTypeTo;
  const checkModel =
    listStore.lastUsedFilterData.Model !==
    listStore.filterData.Model;
  const checkModelTo =
    listStore.lastUsedFilterData.ModelTo !==
    listStore.filterData.ModelTo;
  const checkSmuActual =
    listStore.lastUsedFilterData.SmuActual !==
    listStore.filterData.SmuActual;
  const checkSmuActualTo =
    listStore.lastUsedFilterData.SmuActualTo !==
    listStore.filterData.SmuActualTo;
  const checkStartDate =
    listStore.lastUsedFilterData.StartDate !==
    listStore.filterData.StartDate;
  const checkStartDateTo =
    listStore.lastUsedFilterData.StartDateTo !==
    listStore.filterData.StartDateTo;
  const checkEndDate =
    listStore.lastUsedFilterData.EndDate !==
    listStore.filterData.EndDate;
  const checkEndDateTo =
    listStore.lastUsedFilterData.EndDateTo !==
    listStore.filterData.EndDateTo;
  const status = checkUom || checkUomTo || checkPsType || checkPsTypeTo || checkModel || checkModelTo || checkSmuActual || checkSmuActualTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo;
  emits("handle-close", status);
};
</script>
