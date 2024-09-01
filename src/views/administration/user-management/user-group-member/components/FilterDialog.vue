<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-4 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.userGroupName"
            placeholder="Select User Group Name | User Group Description"
            label="User Group Name"
            name="userGroupName"
            :options="listStore.userGroupIdOption"
            @handle-change="onuserGroupIdSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.employeeName"
            placeholder="Select Employee ID | Employee Name"
            label="Employee Name"
            name="employeeName"
            :options="listStore.employeeIDOption"
            @handle-change="onEmployeeIdSelected" />
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
  useUserGroupMemberListStore
} from "@/store/pinia/administration/user-management/user-group-member/useUserGroupMemberListStore";
import {
  FilterData
} from "@/core/types/entities/administration/user-management/user-group-member/FilterData";

/* stores */
const listStore = useUserGroupMemberListStore();
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
const onuserGroupIdSelected = (value: string) => {
  listStore.setUserGroupId(value);
}
const onEmployeeIdSelected = (value: string) => {
  listStore.setEmployeeID(value);
}
const handleFilterClick = () => {
  const checkuserGroupId = listStore.lastUsedFilterData.userGroupName !== listStore.filterData.userGroupName
  const checkEmployeeId = listStore.lastUsedFilterData.employeeName !== listStore.filterData.employeeName
  const status = (checkuserGroupId || checkEmployeeId)
  emits("handle-close", status);
}
</script>
