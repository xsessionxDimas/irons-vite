<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.EquipmentModel"
          label="Equipment Model From"
          name="EquipmentModel"
          :options="listStore.equipmentModelOption"
          @handle-change="onEquipmentModelSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.EquipmentModelTo"
          label="Equipment Model To"
          name="EquipmentModelTo"
          :options="listStore.equipmentModelOption"
          @handle-change="onEquipmentModelToSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.EquipmentModelDescription"
          label="Equipment Model Description From"
          name="EquipmentModelDescription"
          :options="listStore.equipmentModelDescOption"
          @handle-change="onEquipmentModelDescSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.EquipmentModelDescriptionTo"
          label="Equipment Model Description To"
          name="EquipmentModelDescriptionTo"
          :options="listStore.equipmentModelDescOption"
          @handle-change="onEquipmentModelDescToSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.Brand"
          label="Brand From"
          name="Brand"
          :options="listStore.brandOption"
          @handle-change="onBrandSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="filterData.BrandTo"
          label="Brand To"
          name="BrandTo"
          :options="listStore.brandOption"
          @handle-change="onBrandToSelected"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
          :value="filterData.StartDate"
          label="Start Date From"
          name="StartDateFrom"
          placeholder="Pick a date"
          @handleChange="onStartDateSelected" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
          :value="filterData.StartDateTo"
          label="Start Date To"
          name="StartDateFrom"
          placeholder="Pick a date"
          @handleChange="onStartDateToSelected" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
          :value="filterData.EndDate"
          label="End Date"
          name="EndDate"
          placeholder="Pick a date"
          @handleChange="onEndDateSelected" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
          :value="filterData.EndDateTo"
          label="End Date To"
          name="EndDateTo"
          placeholder="Pick a date"
          @handleChange="onEndDateToSelected" />
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
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from "vue";
import {
  useEquipmentModelListStore
} from "@/store/pinia/iron-lake/equipment/equipment-model/useEquipmentModelListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/equipment-model/FilterData";

/* stores */
const listStore = useEquipmentModelListStore();
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
  listStore.setEquipmentModel(value);
};
const onEquipmentModelToSelected = (value: string) => {
  listStore.setEquipmentModelTo(value);
};
const onEquipmentModelDescSelected = (value: string) => {
  listStore.setEquipmentModelDescription(value);
};
const onEquipmentModelDescToSelected = (value: string) => {
  listStore.setEquipmentModelDescriptionTo(value);
};
const onBrandSelected = (value: string) => {
  listStore.setBrand(value);
};
const onBrandToSelected = (value: string) => {
  listStore.setBrandTo(value);
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
  const checkEquipmentModel =
    listStore.lastUsedFilterData.EquipmentModel !==
    listStore.filterData.EquipmentModel;
  const checkEquipmentModelTo =
    listStore.lastUsedFilterData.EquipmentModel !==
    listStore.filterData.EquipmentModelTo;
  const checkEquipmentModelDesc =
    listStore.lastUsedFilterData.EquipmentModelDescription !==
    listStore.filterData.EquipmentModelDescription;
  const checkEquipmentModelDescTo =
    listStore.lastUsedFilterData.EquipmentModelDescription !==
    listStore.filterData.EquipmentModelDescriptionTo;
  const checkBrand =
    listStore.lastUsedFilterData.Brand !==
    listStore.filterData.Brand;
  const checkBrandTo =
    listStore.lastUsedFilterData.Brand !==
    listStore.filterData.BrandTo;
  const checkStartDate =
    listStore.lastUsedFilterData.StartDate !==
    listStore.filterData.StartDate;
  const checkStartDateTo =
    listStore.lastUsedFilterData.StartDate !==
    listStore.filterData.StartDateTo;
  const checkEndDate =
    listStore.lastUsedFilterData.EndDate !==
    listStore.filterData.EndDate;
  const checkEndDateTo =
    listStore.lastUsedFilterData.EndDate !==
    listStore.filterData.EndDateTo;
  const status = checkEquipmentModel || checkEquipmentModelTo || checkEquipmentModelDesc || checkEquipmentModelDescTo || checkBrand || checkBrandTo || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo;
  emits("handle-close", status);
};
</script>
