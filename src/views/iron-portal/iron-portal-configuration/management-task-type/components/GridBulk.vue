<template>
  <el-table
    :data="props.listData"
    style="width: 100%"
    @sort-change="handleSort"
    :empty-text="'No Data'"
  >
    <el-table-column label="No" width="60" align="center">
      <template #default="scope">
        <span>{{ startIndex + scope.$index }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="TaskTypeCode" label="Task Type Code" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'TaskTypeCode')" />
    <el-table-column prop="TaskTypeDescription" label="Task Type Description" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'TaskTypeDescription')" />
    <el-table-column prop="StartDate" label="Start Date" align="center" width="170" sortable>
      <template #default="scope">
        <span>{{ formatDateOnlyAU(scope.row.StartDate) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="EndDate" label="End Date" align="center" width="170" sortable>
      <template #default="scope">
        <span>{{ formatDateOnlyAU(scope.row.EndDate) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="ValidationReason" label="Remark" min-width="300" sortable :sort-method="(a, b) => customSort(a, b, 'ValidationReason')" />
    <el-table-column prop="IsValid" label="Status" width="100" sortable>
      <template #default="scope">
        <div class="icon">
          <inline-svg :src="scope.row.IsValid ? '/media/svg/tables/rows/valid-true.svg' : '/media/svg/tables/rows/valid-false.svg'" />
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>


<script lang="ts" setup>
/* import componenets here */
import {
  PropType,
  defineProps,
  computed,
  ref
} from "vue";
import { ElTable, ElTableColumn } from "element-plus";
import {
  ValidatedItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/management-task-type/ValidatedItem";
import {
  useManagementTaskTypeBulkStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/management-task-type/useManagementTaskTypeBulkStore";
import { formatDateOnlyAU } from "@/core/helpers/date-format";
import { dynamicSortCaseInsensitive } from "@/core/helpers/table-sort";

const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<ValidatedItem[]>,
  },
  page: {
    required: true,
    type: Number,
    default: 1
  }
});

/* stores */
const bulkStore = useManagementTaskTypeBulkStore();

const startIndex = computed(() => {
  return ((props.page - 1) * 10) + 1
})
const columnOrder = ref("");

/* handlers */
const handleSort = (sort) => {
  columnOrder.value = sort.order
  const payload = {
    prop: sort.prop,
    order: sort.order,
  };
  bulkStore.setSort(payload);
}
const customSort = (objA, objB, field) => {
  return dynamicSortCaseInsensitive(objA[field], objB[field], columnOrder.value);
}
</script>
