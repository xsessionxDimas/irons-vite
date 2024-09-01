<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.PlannerGroup"
            label="Planner Group"
            name="PlannerGroup"
            :options="listStore.plannerGroupOption"
            @handle-change="onPlannerGroupSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.PlannerGroupDescription"
            label="Planner Group Description"
            name="PlannerGroupDescription"
            :options="listStore.plannerGroupDescOption"
            @handle-change="onPlannerGroupDescSelected" />
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
  usePlannerGroupListStore
} from "@/store/pinia/iron-lake/equipment/planner-group/usePlannerGroupListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/planner-group/FilterData";


/* stores */
const listStore = usePlannerGroupListStore();
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
const onPlannerGroupSelected = (value: string) => {
  listStore.setPlannerGroup(value);
}
const onPlannerGroupDescSelected = (value: string) => {
  listStore.setPlannerGroupDescription(value);
}
const handleFilterClick = () => {
  const checkPlannerGroup = listStore.lastUsedFilterData.PlannerGroup !== listStore.filterData.PlannerGroup
  const checkPlannerGroupDesc = listStore.lastUsedFilterData.PlannerGroupDescription !== listStore.filterData.PlannerGroupDescription
  const status = (checkPlannerGroup || checkPlannerGroupDesc)
  emits("handle-close", status);
}
</script>
