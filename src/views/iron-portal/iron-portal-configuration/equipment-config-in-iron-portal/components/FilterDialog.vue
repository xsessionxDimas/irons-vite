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
        :value-from="filterData.objectType"
        :value-to="filterData.objectTypeTo"
        label="Object Type"
        name="ObjectType"
        :options="listStore.objectTypeOption"
        @handle-change-from="onObjectTypeSelected"
        @handle-change-to="onObjectTypeToSelected"
      />
      <AutoComplete
        :value-from="filterData.codeGroup"
        :value-to="filterData.codeGroupTo"
        label="Code Group"
        name="CodeGroup"
        :options="listStore.codeGroupOption"
        @handle-change-from="onCodeGroupSelected"
        @handle-change-to="onCodeGroupToSelected"
      />
      <AutoComplete
        :value-from="filterData.damageCategory"
        :value-to="filterData.damageCategoryTo"
        label="Damage Category"
        name="DamageCategory"
        :options="listStore.damageCategoryOption"
        @handle-change-from="onDamageCategorySelected"
        @handle-change-to="onDamageCategoryToSelected"
      />
      <AutoComplete
        :value-from="filterData.damage"
        :value-to="filterData.damageTo"
        label="Damage"
        name="Damage"
        :options="listStore.damageOption"
        @handle-change-from="onDamageSelected"
        @handle-change-to="onDamageToSelected"
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
  useEquipmentConfigInIronPortalListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/equipment-config-in-iron-portal/useEquipmentConfigInIronPortalListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/equipment-config-in-iron-portal/FilterData";


/* stores */
const listStore = useEquipmentConfigInIronPortalListStore();
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
const onObjectTypeSelected = (value: string) => {
  listStore.setObjectType(value);
};
const onObjectTypeToSelected = (value: string) => {
  listStore.setObjectTypeTo(value);
};
const onCodeGroupSelected = (value: string) => {
  listStore.setCodeGroup(value);
};
const onCodeGroupToSelected = (value: string) => {
  listStore.setCodeGroupTo(value);
};
const onDamageSelected = (value: string) => {
  listStore.setDamage(value);
};
const onDamageToSelected = (value: string) => {
  listStore.setDamageTo(value);
};
const onDamageCategorySelected = (value: string) => {
  listStore.setDamageCategory(value);
};
const onDamageCategoryToSelected = (value: string) => {
  listStore.setDamageCategoryTo(value);
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
  const checkObjectType = listStore.lastUsedFilterData.objectType !== listStore.filterData.objectType
  const checkObjectTypeTo = listStore.lastUsedFilterData.objectTypeTo !== listStore.filterData.objectTypeTo
  const checkCodeGroup = listStore.lastUsedFilterData.codeGroup !== listStore.filterData.codeGroup
  const checkCodeGroupTo = listStore.lastUsedFilterData.codeGroupTo !== listStore.filterData.codeGroupTo
  const checkDamage = listStore.lastUsedFilterData.damage !== listStore.filterData.damage
  const checkDamageTo = listStore.lastUsedFilterData.damageTo !== listStore.filterData.damageTo
  const checkDamageCategory = listStore.lastUsedFilterData.damageCategory !== listStore.filterData.damageCategory
  const checkDamageCategoryTo = listStore.lastUsedFilterData.damageCategoryTo !== listStore.filterData.damageCategoryTo
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (
    checkSite ||
    checkSiteTo ||
    checkEquipmentModel ||
    checkEquipmentModelTo ||
    checkObjectType ||
    checkObjectTypeTo ||
    checkCodeGroup ||
    checkCodeGroupTo ||
    checkDamage ||
    checkDamageTo ||
    checkDamageCategory ||
    checkDamageCategoryTo ||
    checkStartDate ||
    checkStartDateTo ||
    checkEndDate ||
    checkEndDateTo
  )
  emits("handle-close", status);
}
</script>
