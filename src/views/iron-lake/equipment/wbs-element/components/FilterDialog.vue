<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.WbsElement"
            label="WBS Element"
            name="WbsElement"
            :options="listStore.wbsElementOption"
            @handle-change="onWbsElementSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.WbsElementDescription"
            label="WBS Element Description"
            name="WbsElementDescription"
            :options="listStore.wbsElementDescOption"
            @handle-change="onWbsElementDescSelected" />
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
  useWbsElementListStore
} from "@/store/pinia/iron-lake/equipment/wbs-element/useWbsElementListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/wbs-element/FilterData";


/* stores */
const listStore = useWbsElementListStore();
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
const onWbsElementSelected = (value: string) => {
  listStore.setWbsElement(value);
}
const onWbsElementDescSelected = (value: string) => {
  listStore.setWbsElementDescription(value);
}
const handleFilterClick = () => {
  const checkWbsElement = listStore.lastUsedFilterData.WbsElement !== listStore.filterData.WbsElement
  const checkWbsElementDesc = listStore.lastUsedFilterData.WbsElementDescription !== listStore.filterData.WbsElementDescription
  const status = (checkWbsElement || checkWbsElementDesc)
  emits("handle-close", status);
}
</script>
