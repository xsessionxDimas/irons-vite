<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.EquipmentGroup"
            label="Equipment Group"
            name="EquipmentGroup"
            :options="listStore.equipmentGroupOption"
            @handle-change="onEquipmentGroupSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.EquipmentGroupDescription"
            label="Equipment Group Description"
            name="EquipmentGroupDescription"
            :options="listStore.equipmentGroupDescOption"
            @handle-change="onEquipmentGroupDescSelected" />
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
  useEquipmentGroupListStore
} from "@/store/pinia/iron-lake/equipment/equipment-group/useEquipmentGroupListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/equipment-group/FilterData";


/* stores */
const listStore = useEquipmentGroupListStore();
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
const onEquipmentGroupSelected = (value: string) => {
  listStore.setEquipmentGroup(value);
}
const onEquipmentGroupDescSelected = (value: string) => {
  listStore.setEquipmentGroupDescription(value);
}
const handleFilterClick = () => {
  const checkEquipmentGroup = listStore.lastUsedFilterData.EquipmentGroup !== listStore.filterData.EquipmentGroup
  const checkEquipmentGroupDesc = listStore.lastUsedFilterData.EquipmentGroupDescription !== listStore.filterData.EquipmentGroupDescription
  const status = (checkEquipmentGroup || checkEquipmentGroupDesc)
  emits("handle-close", status);
}
</script>
