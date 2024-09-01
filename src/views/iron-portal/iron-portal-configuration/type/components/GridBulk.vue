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
    <el-table-column prop="type" label="Type" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'type')" />
    <el-table-column prop="typeDescription" label="Type Description" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'typeDescription')" />
    <el-table-column prop="parameter" label="Parameter" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'parameter')" />
    <el-table-column prop="parameterDescription" label="Parameter Description" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'parameterDescription')" />
    <el-table-column prop="parameterGroup" label="Parameter Group" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'parameterGroup')" />
    <el-table-column prop="startDate" label="Start Date" align="center" width="170" sortable>
      <template #default="scope">
        <span>{{ formatDateOnlyAU(scope.row.startDate) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="endDate" label="End Date" align="center" width="170" sortable>
      <template #default="scope">
        <span>{{ formatDateOnlyAU(scope.row.endDate) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="validationReason" label="Remark" min-width="300" sortable :sort-method="(a, b) => customSort(a, b, 'validationReason')" />
    <el-table-column prop="isValid" label="Status" width="100" sortable>
      <template #default="scope">
        <div class="icon">
          <inline-svg :src="scope.row.isValid ? '/media/svg/tables/rows/valid-true.svg' : '/media/svg/tables/rows/valid-false.svg'" />
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
} from "@/core/types/entities/iron-portal/iron-portal-configuration/type/ValidatedItem";
import {
  useTypeBulkStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/type/useTypeBulkStore";
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
const bulkStore = useTypeBulkStore();

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
