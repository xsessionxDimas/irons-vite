<template>
    <template v-if="listStore.loading">
        <div v-loading="listStore.loading" style="height: 100px"></div>
    </template>
    <template v-else>
      <el-table v-loading="listStore.loading"
      :data="props.listData"
      style="width: 100%"
      @sort-change="handleSort"
      :empty-text="'No Data'">
          <el-table-column label="No" width="90" align="center">
              <template #default="scope">
                  <span>{{ startIndex + scope.$index }}</span>
              </template>
          </el-table-column>
          <el-table-column prop="EmployeeId" label="Employee Id" sortable :sort-method="(a, b) => customSort(a, b, 'EmployeeId')" />
          <el-table-column prop="EmployeeName" label="Name" sortable :sort-method="(a, b) => customSort(a, b, 'EmployeeName')"/>
          <el-table-column prop="Section" label="Section" sortable :sort-method="(a, b) => customSort(a, b, 'Section')" />
          <el-table-column prop="LoginDate" label="Login Date" sortable :sort-method="(a, b) => customSort(a, b, 'LoginDate')">
              <template #default="scope">
                  <span>{{ formatDateAU(scope.row.LoginDate) }}</span>
              </template>
          </el-table-column>
      </el-table>
    </template>
</template>

<script lang="ts" setup>
/* import componenets here */
import { ElTable, ElTableColumn } from "element-plus";
import { formatDateAU } from "@/core/helpers/date-format";
import {
  useUserLoginListStore
} from "@/store/pinia/administration/user-management/user-login/useUserLoginListStore";
import {
  ListItem
} from "@/core/types/entities/administration/user-management/user-login/ListItem";
import { PropType, defineProps, ref } from "vue";
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
const listStore = useUserLoginListStore();
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
</script>
