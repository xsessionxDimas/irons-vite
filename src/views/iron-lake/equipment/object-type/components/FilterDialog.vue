<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.ObjectType"
            label="Object Type"
            name="ObjectType"
            :options="listStore.objectTypeOption"
            @handle-change="onObjectTypeSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.ObjectTypeDescription"
            label="Object Type Description"
            name="ObjectTypeDescription"
            :options="listStore.objectTypeDescOption"
            @handle-change="onObjectTypeDescSelected" />
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
  useObjectTypeListStore
} from "@/store/pinia/iron-lake/equipment/object-type/useObjectTypeListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/equipment/object-type/FilterData";


/* stores */
const listStore = useObjectTypeListStore();
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
const onObjectTypeSelected = (value: string) => {
  listStore.setObjectType(value);
}
const onObjectTypeDescSelected = (value: string) => {
  listStore.setObjectTypeDescription(value);
}
const handleFilterClick = () => {
  const checkObjectType = listStore.lastUsedFilterData.ObjectType !== listStore.filterData.ObjectType
  const checkObjectTypeDesc = listStore.lastUsedFilterData.ObjectTypeDescription !== listStore.filterData.ObjectTypeDescription
  const status = (checkObjectType || checkObjectTypeDesc)
  emits("handle-close", status);
}
</script>
