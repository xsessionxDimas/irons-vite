<template>
  <template v-if="listStore.loading">
    <div v-loading="listStore.loading" style="height: 100px"></div>
  </template>
  <template v-else>
    <el-table v-loading="listStore.loading"
      :data="props.listData"
      style="width: 100%"
      @sort-change="handleSort"
      :empty-text="'No Data'"
    >
      <el-table-column label="No" width="90" align="center">
        <template #default="scope">
          <span>{{ startIndex + scope.$index }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="UserGroupName" label="User Group Name" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'UserGroupName')"/>
      <el-table-column prop="UserGroupDesc" label="Group Description" min-width="170" sortable :sort-method="(a, b) => customSort(a, b, 'UserGroupDesc')"/>
      <el-table-column prop="ChangedOn" label="Changed on" align="center" width="150" sortable>
        <template #default="scope">
          <span>{{ formatDateAU(scope.row.ChangedOn) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ChangedBy" label="Changed by" sortable width="300" :sort-method="(a, b) => customSort(a, b, 'ChangedBy')"/>
      <el-table-column label="Menu Authorization" width="200">
        <template #default="scope">
          <div class="row justify-content-center">
            <el-tooltip class="box-item" effect="dark" content="Show Menu" placement="top">
              <button class="btn btn-sm btn-icon btn-bg-light me-1" @click="handleEditRow(scope.row)">
                <inline-svg src="/media/svg/tables/rows/pencil-edit-blue.svg" width="12" height="12" />
              </button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </template>
</template>

<script lang="ts" setup>
/* import components here */
import { ElTable, ElTableColumn } from "element-plus";
import { formatDateAU } from "@/core/helpers/date-format";
import {
  useUserGroupMenuListStore
} from "@/store/pinia/administration/user-management/user-group-menu/useUserGroupMenuListStore";
import {
  useUserGroupMenuFormStore
} from "@/store/pinia/administration/user-management/user-group-menu/useUserGroupMenuFormStore";
import {
  ListItem
} from "@/core/types/entities/administration/user-management/user-group-menu/ListItem";
import {
  PropType,
  defineProps,
  defineEmits,
  ref
} from "vue";
import { computed } from "@vue/reactivity";
import { dynamicSortCaseInsensitive } from "@/core/helpers/table-sort";

const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<ListItem[]>,
  },
  page: {
    required: true,
    type: Number,
    default: 1
  }
});
const listStore = useUserGroupMenuListStore();
const formStore = useUserGroupMenuFormStore();
const emits = defineEmits(["show-dialog"]);
const startIndex = computed(() => {
  return ((props.page - 1) * 10) + 1
});
const columnOrder = ref("");
const handleSort = (sort) => {
  columnOrder.value = sort.order
  const payload = {
    prop: sort.prop,
    order: sort.order,
  };
  listStore.setSort(payload);
}
const customSort = (objA, objB, field) => {
  return dynamicSortCaseInsensitive(objA[field], objB[field], columnOrder.value);
}
const handleEditRow = async (item: ListItem) => {
  emits("show-dialog", null);
  await formStore.setFormData(item);
}
</script>
