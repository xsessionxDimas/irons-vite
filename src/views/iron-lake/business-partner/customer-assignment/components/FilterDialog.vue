<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.MaintenancePlant"
            label="Maintenance Plant"
            name="MaintenancePlant"
            :options="listStore.maintenancePlantOption"
            @handle-change="onMaintenancePlantSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.MaintenancePlantDescription"
            label="Maintenance Plant Description"
            name="MaintenancePlantDescription"
            :options="listStore.maintenancePlantDescOption"
            @handle-change="onMaintenancePlantDescSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.Customer"
            label="Customer"
            name="Customer"
            :options="listStore.customerOption"
            @handle-change="onCustomerSelected" />
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
  useCustomerAssignmentListStore
} from "@/store/pinia/iron-lake/business-partner/customer-assignment/useCustomerAssignmentListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/customer-assignment/FilterData";


/* stores */
const listStore = useCustomerAssignmentListStore();
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
const onMaintenancePlantSelected = (value: string) => {
  listStore.setMaintenancePlant(value);
}
const onMaintenancePlantDescSelected = (value: string) => {
  listStore.setMaintenancePlantDescription(value);
}
const onCustomerSelected = (value: string) => {
  listStore.setCustomer(value);
}
const handleFilterClick = () => {
  const checkMaintenancePlant = listStore.lastUsedFilterData.MaintenancePlant !== listStore.filterData.MaintenancePlant
  const checkMaintenancePlantDesc = listStore.lastUsedFilterData.MaintenancePlantDescription !== listStore.filterData.MaintenancePlantDescription
  const checkCustomer = listStore.lastUsedFilterData.Customer !== listStore.filterData.Customer
  const status = (checkMaintenancePlant || checkMaintenancePlantDesc || checkCustomer)
  emits("handle-close", status);
}
</script>
