<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.userGroupName"
        :value-to="filterData.userGroupNameTo"
        label="User Group Name"
        name="userGroupName"
        :options="listStore.userGroupOption"
        @handle-change-from="onGroupSelected"
        @handle-change-to="onGroupToSelected"
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
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from "vue";
import {
  useUserGroupMenuListStore
} from "@/store/pinia/administration/user-management/user-group-menu/useUserGroupMenuListStore";
import {
  FilterData
} from "@/core/types/entities/administration/user-management/user-group-menu/FilterData";

/* stores */
const listStore = useUserGroupMenuListStore();
const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["handle-close"]);

/* refs*/
const isVisible = toRef(props, "visibility");
const filterData: ComputedRef<FilterData> = computed(() => {
  return listStore.filterData;
});

/* handlers */
const handleReset = () => {
  handleCloseModal();
  listStore.resetFilter();
};
const handleCloseModal = () => {
  emits("handle-close", false);
};
const onGroupSelected = (value: string) => {
  listStore.setUserGroupName(value);
};
const onGroupToSelected = (value: string) => {
  listStore.setUserGroupNameTo(value);
};
const handleFilterClick = () => {
  const checkUserGroupName =
    listStore.lastUsedFilterData.userGroupName !==
    listStore.filterData.userGroupName;
  const checkUserGroupNameTo =
    listStore.lastUsedFilterData.userGroupNameTo !==
    listStore.filterData.userGroupNameTo;
  const status = checkUserGroupName || checkUserGroupNameTo;
  emits("handle-close", status);
};
</script>
