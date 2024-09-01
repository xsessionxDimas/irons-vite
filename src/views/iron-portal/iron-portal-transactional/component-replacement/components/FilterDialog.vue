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
        :value-from="filterData.model"
        :value-to="filterData.modelTo"
        label="Equipment Model"
        name="EquipmentModel"
        :options="listStore.modelOption"
        @handle-change-from="onEquipmentModelSelected"
        @handle-change-to="onEquipmentModelToSelected"
      />
      <AutoComplete
        :value-from="filterData.equipment"
        :value-to="filterData.equipmentTo"
        label="Equipment Number"
        name="EquipmentNumber"
        :options="listStore.equipmentOption"
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
      <DatePickerInput
        :value-from="filterData.replacementDate ? filterData.replacementDate.toString() : ''"
        :value-to="filterData.replacementDateTo ? filterData.replacementDateTo.toString() : ''"
        label="Replacement Date"
        name="ReplacementDate"
        placeholder="Pick a date"
        @handle-change-from="onReplacementDateSelected"
        @handle-change-to="onReplacementDateToSelected"
      />
      <AutoComplete
        :value-from="filterData.replacementSmu"
        :value-to="filterData.replacementSmuTo"
        label="Replacement Smu"
        name="ReplacementSmu"
        :options="listStore.replacementSmuOption"
        @handle-change-from="onReplacementSmuSelected"
        @handle-change-to="onReplacementSmuToSelected"
      />
      <AutoComplete
        :value-from="filterData.frameHours"
        :value-to="filterData.frameHoursTo"
        label="Frame Hours"
        name="FrameHours"
        :options="listStore.frameHoursOption"
        @handle-change-from="onFrameHoursSelected"
        @handle-change-to="onFrameHoursToSelected"
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
  useComponentReplacementListStore
} from "@/store/pinia/iron-portal/iron-portal-transactional/component-replacement/useComponentReplacementListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/component-replacement/FilterData";


/* stores */
const listStore = useComponentReplacementListStore();
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
  listStore.setModel(value);
};
const onEquipmentModelToSelected = (value: string) => {
  listStore.setModelTo(value);
};
const onEquipmentNumberSelected = (value: string) => {
  listStore.setEquipment(value);
};
const onEquipmentNumberToSelected = (value: string) => {
  listStore.setEquipmentTo(value);
};
const onComponentSelected = (value: string) => {
  listStore.setComponent(value);
};
const onComponentToSelected = (value: string) => {
  listStore.setComponentTo(value);
};
const onReplacementDateSelected = (value: string) => {
  listStore.setReplacementDate(value);
}
const onReplacementDateToSelected = (value: string) => {
  listStore.setReplacementDateTo(value);
}
const onReplacementSmuSelected = (value: string) => {
  listStore.setReplacementSmu(value);
}
const onReplacementSmuToSelected = (value: string) => {
  listStore.setReplacementSmuTo(value);
}
const onFrameHoursSelected = (value: string) => {
  listStore.setFrameHours(value);
}
const onFrameHoursToSelected = (value: string) => {
  listStore.setFrameHoursTo(value);
}
const handleFilterClick = () => {
  const checkSite = listStore.lastUsedFilterData.site !== listStore.filterData.site
  const checkSiteTo = listStore.lastUsedFilterData.siteTo !== listStore.filterData.siteTo
  const checkModel = listStore.lastUsedFilterData.model !== listStore.filterData.model
  const checkModelTo = listStore.lastUsedFilterData.modelTo !== listStore.filterData.modelTo
  const checkEquipment = listStore.lastUsedFilterData.equipment !== listStore.filterData.equipment
  const checkEquipmentTo = listStore.lastUsedFilterData.equipmentTo !== listStore.filterData.equipmentTo
  const checkComponent = listStore.lastUsedFilterData.component !== listStore.filterData.component
  const checkComponentTo = listStore.lastUsedFilterData.componentTo !== listStore.filterData.componentTo
  const checkReplacementDate = listStore.lastUsedFilterData.replacementDate !== listStore.filterData.replacementDate
  const checkReplacementDateTo = listStore.lastUsedFilterData.replacementDateTo !== listStore.filterData.replacementDateTo
  const checkReplacementSmu = listStore.lastUsedFilterData.replacementSmu !== listStore.filterData.replacementSmu
  const checkReplacementSmuTo = listStore.lastUsedFilterData.replacementSmuTo !== listStore.filterData.replacementSmuTo
  const checkFrameHours = listStore.lastUsedFilterData.frameHours !== listStore.filterData.frameHours
  const checkFrameHoursTo = listStore.lastUsedFilterData.frameHoursTo !== listStore.filterData.frameHoursTo
  const status = (
    checkSite ||
    checkSiteTo ||
    checkModel ||
    checkModelTo ||
    checkEquipment ||
    checkEquipmentTo ||
    checkComponent ||
    checkComponentTo ||
    checkReplacementDate ||
    checkReplacementDateTo ||
    checkReplacementSmu ||
    checkReplacementSmuTo ||
    checkFrameHours ||
    checkFrameHoursTo
  )
  emits("handle-close", status);
}
</script>
