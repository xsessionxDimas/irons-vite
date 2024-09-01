<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.UserGroup"
        :value-to="filterData.UserGroupTo"
        label="User Group"
        name="UserGroup"
        :options="listStore.UserGroupOption"
        @handle-change-from="onUserGroupSelected"
        @handle-change-to="onUserGroupToSelected"
     />
      <AutoComplete
        :value-from="filterData.Site"
        :value-to="filterData.SiteTo"
        label="Site"
        name="Site"
        :options="listStore.siteOption"
        @handle-change-from="onSiteSelected"
        @handle-change-to="onSiteToSelected"
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
  useUserGroupListStore
} from "@/store/pinia/administration/user-management/user-group/useUserGroupListStore";
import {
  FilterData
} from "@/core/types/entities/administration/user-management/user-group/FilterData";

/* stores */
const listStore = useUserGroupListStore();
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
const onUserGroupSelected = (value: string) => {
  listStore.setUserGroup(value);
};
const onUserGroupToSelected = (value: string) => {
  listStore.setUserGroupTo(value);
};
const onSiteSelected = (value: string) => {
  listStore.setSite(value);
};
const onSiteToSelected = (value: string) => {
  listStore.setSiteTo(value);
};
const handleFilterClick = () => {
  const checkUserGroup =
    listStore.lastUsedFilterData.UserGroup !==
    listStore.filterData.UserGroup;
  const checkUserGroupTo =
    listStore.lastUsedFilterData.UserGroupTo !==
    listStore.filterData.UserGroupTo;
  const checkSite =
    listStore.lastUsedFilterData.Site !==
    listStore.filterData.SiteTo;
  const checkSiteTo =
    listStore.lastUsedFilterData.SiteTo !==
    listStore.filterData.SiteTo;
  const status = checkUserGroup || checkUserGroupTo || checkSite || checkSiteTo;
  emits("handle-close", status);
};
</script>
