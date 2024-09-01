<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.CostCenter"
            label="Cost Center"
            name="CostCenter"
            :options="listStore.costCenterOption"
            @handle-change="onCostCenterSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.CostCenterDescription"
            label="Cost Center Description"
            name="CostCenterDescription"
            :options="listStore.costCenterDescOption"
            @handle-change="onCostCenterDescSelected" />
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
  useCostCenterListStore
} from "@/store/pinia/iron-lake/equipment/cost-center/useCostCenterListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/cost-center/FilterData";


/* stores */
const listStore = useCostCenterListStore();
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
const onCostCenterSelected = (value: string) => {
  listStore.setCostCenter(value);
}
const onCostCenterDescSelected = (value: string) => {
  listStore.setCostCenterDescription(value);
}
const handleFilterClick = () => {
  const checkCostCenter = listStore.lastUsedFilterData.CostCenter !== listStore.filterData.CostCenter
  const checkCostCenterDesc = listStore.lastUsedFilterData.CostCenterDescription !== listStore.filterData.CostCenterDescription
  const status = (checkCostCenter || checkCostCenterDesc)
  emits("handle-close", status);
}
</script>
