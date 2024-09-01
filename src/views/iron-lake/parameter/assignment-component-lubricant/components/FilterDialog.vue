<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.EquipmentModel"
        :value-to="filterData.EquipmentModelTo"
        label="Equipment Model"
        :options="listStore.equipmentModelOption"
        @handle-change-from="onEquipmentModelSelected"
        @handle-change-to="onEquipmentModelToSelected"
      />
      <AutoComplete
        :value-from="filterData.PsType"
        :value-to="filterData.PsTypeTo"
        label="PS Type"
        :options="listStore.psTypeOption"
        @handle-change-from="onPsTypeSelected"
        @handle-change-to="onPsTypeToSelected"
      />
      <AutoComplete
        :value-from="filterData.Component"
        :value-to="filterData.ComponentTo"
        label="ID Component"
        :options="listStore.componentOption"
        @handle-change-from="onComponentSelected"
        @handle-change-to="onComponentToSelected"
      />
      <AutoComplete
        :value-from="filterData.RecomLubricant"
        :value-to="filterData.RecomLubricantTo"
        label="Recommended Lubricants"
        name="RecommendedLubricant"
        :options="listStore.recomLubricantOption"
        @handle-change-from="onRecomLubricantSelected"
        @handle-change-to="onRecomLubricantToSelected"
      />
      <AutoComplete
        :value-from="filterData.Value"
        :value-to="filterData.ValueTo"
        label="Value"
        name="Value"
        :options="listStore.valueOption"
        @handle-change-from="onValueSelected"
        @handle-change-to="onValueToSelected"
      />
      <AutoComplete
        :value-from="filterData.Uom"
        :value-to="filterData.UomTo"
        label="UOM"
        name="Uom"
        :options="listStore.uomOption"
        @handle-change-from="onUomSelected"
        @handle-change-to="onUomToSelected"
      />
     <AutoComplete
        :value-from="filterData.TaskNo"
        :value-to="filterData.TaskNoTo"
        label="Task No"
        name="TaskNo"
        :options="listStore.taskNoOption"
        @handle-change-from="onTaskNoSelected"
        @handle-change-to="onTaskNoToSelected"
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
  useAssignmentComponentLubricantListStore
} from "@/store/pinia/iron-lake/parameter/assignment-component-lubricant/useAssignmentComponentLubricantListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/assignment-component-lubricant/FilterData";

/* stores */
const listStore = useAssignmentComponentLubricantListStore();
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
const onEquipmentModelSelected = (value: string) => {
  listStore.setEquipmentModel(value)
}
const onEquipmentModelToSelected = (value: string) => {
  listStore.setEquipmentModelTo(value)
}
const onPsTypeSelected = (value: string) => {
  listStore.setPsType(value)
}
const onPsTypeToSelected = (value: string) => {
  listStore.setPsTypeTo(value)
}
const onComponentSelected = (value: string) => {
  listStore.setComponent(value)
}
const onComponentToSelected = (value: string) => {
  listStore.setComponentTo(value)
}
const onRecomLubricantSelected = (value: string) => {
  listStore.setRecomLubricant(value)
}
const onRecomLubricantToSelected = (value: string) => {
  listStore.setRecomLubricantTo(value)
}
const onValueSelected = (value: string) => {
  listStore.setValue(value)
}
const onValueToSelected = (value: string) => {
  listStore.setValueTo(value)
}
const onUomSelected = (value: string) => {
  listStore.setUom(value)
}
const onUomToSelected = (value: string) => {
  listStore.setUomTo(value)
}
const onTaskNoSelected = (value: string) => {
  listStore.setTaskNo(value)
}
const onTaskNoToSelected = (value: string) => {
  listStore.setTaskNoTo(value)
}
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value)
}
const onStartDateToSelected = (value: string) => {
  listStore.setStartDateTo(value)
}
const onEndDateSelected = (value: string) => {
  listStore.setEndDate(value)
}
const onEndDateToSelected = (value: string) => {
  listStore.setEndDateTo(value)
}
const handleFilterClick = () => {
  const checkEquipmentModel = listStore.lastUsedFilterData.EquipmentModel !== listStore.filterData.EquipmentModel
  const checkEquipmentModelTo = listStore.lastUsedFilterData.EquipmentModelTo !== listStore.filterData.EquipmentModelTo
  const checkPsType = listStore.lastUsedFilterData.PsType !== listStore.filterData.PsType
  const checkPsTypeTo = listStore.lastUsedFilterData.PsTypeTo !== listStore.filterData.PsTypeTo
  const checkComponent = listStore.lastUsedFilterData.Component !== listStore.filterData.Component
  const checkComponentTo = listStore.lastUsedFilterData.ComponentTo !== listStore.filterData.ComponentTo
  const checkRecomLubricant = listStore.lastUsedFilterData.RecomLubricant !== listStore.filterData.RecomLubricant
  const checkRecomLubricantTo = listStore.lastUsedFilterData.RecomLubricantTo !== listStore.filterData.RecomLubricantTo
  const checkValue = listStore.lastUsedFilterData.Value !== listStore.filterData.Value
  const checkValueTo = listStore.lastUsedFilterData.ValueTo !== listStore.filterData.ValueTo
  const checkUom = listStore.lastUsedFilterData.Uom !== listStore.filterData.Uom
  const checkUomTo = listStore.lastUsedFilterData.UomTo !== listStore.filterData.UomTo
  const checkTaskNo = listStore.lastUsedFilterData.TaskNo !== listStore.filterData.TaskNo
  const checkTaskNoTo = listStore.lastUsedFilterData.TaskNoTo !== listStore.filterData.TaskNoTo
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const checkStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const checkEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const status = checkEquipmentModel || checkEquipmentModelTo || checkPsType || checkPsTypeTo || checkComponent || checkComponentTo || checkRecomLubricant || checkRecomLubricantTo || checkValue || checkValueTo || checkUom || checkUomTo || checkTaskNo || checkTaskNoTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo;
  emits("handle-close", status);
};
</script>
