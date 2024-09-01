<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.MaintenanceWorkCenter"
            label="Maintenance Work Center"
            name="MaintenanceWorkCenter"
            :options="listStore.maintenanceWorkCenterOption"
            @handle-change="onMaintenanceWorkCenterSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.MaintenanceWorkCenterDescription"
            label="Maintenance Work Center Description"
            name="MaintenanceWorkCenterDescription"
            :options="listStore.maintenanceWorkCenterDescOption"
            @handle-change="onMaintenanceWorkCenterDescSelected" />
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
  useMaintenanceWorkCenterListStore
} from "@/store/pinia/iron-lake/equipment/maintenance-work-center/useMaintenanceWorkCenterListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/maintenance-work-center/FilterData";


/* stores */
const listStore = useMaintenanceWorkCenterListStore();
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
const onMaintenanceWorkCenterSelected = (value: string) => {
  listStore.setMaintenanceWorkCenter(value);
}
const onMaintenanceWorkCenterDescSelected = (value: string) => {
  listStore.setMaintenanceWorkCenterDescription(value);
}
const handleFilterClick = () => {
  const checkMaintenanceWorkCenter = listStore.lastUsedFilterData.MaintenanceWorkCenter !== listStore.filterData.MaintenanceWorkCenter
  const checkMaintenanceWorkCenterDesc = listStore.lastUsedFilterData.MaintenanceWorkCenterDescription !== listStore.filterData.MaintenanceWorkCenterDescription
  const status = (checkMaintenanceWorkCenter || checkMaintenanceWorkCenterDesc)
  emits("handle-close", status);
}
</script>
