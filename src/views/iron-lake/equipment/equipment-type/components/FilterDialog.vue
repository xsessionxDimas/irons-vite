<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.EquipmentType"
            label="Equipment Type"
            name="EquipmentType"
            :options="listStore.equipmentTypeOption"
            @handle-change="onEquipmentTypeSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.EquipmentTypeDescription"
            label="Equipment Type Description"
            name="EquipmentTypeDescription"
            :options="listStore.equipmentTypeDescOption"
            @handle-change="onEquipmentTypeDescSelected" />
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
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useEquipmentTypeListStore
} from "@/store/pinia/iron-lake/equipment/equipment-type/useEquipmentTypeListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/equipment-type/FilterData";

/* stores */
const listStore = useEquipmentTypeListStore();
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
}
const handleCloseModal = () => {
  emits("handle-close", false);
}
const onEquipmentTypeSelected = (value: string) => {
  listStore.setEquipmentType(value);
}
const onEquipmentTypeDescSelected = (value: string) => {
  listStore.setEquipmentTypeDescription(value);
}
const handleFilterClick = () => {
  const checkEquipmentType = listStore.lastUsedFilterData.EquipmentType !== listStore.filterData.EquipmentType
  const checkEquipmentTypeDesc = listStore.lastUsedFilterData.EquipmentTypeDescription !== listStore.filterData.EquipmentTypeDescription
  const status = (checkEquipmentType || checkEquipmentTypeDesc)
  emits("handle-close", status);
}
</script>
