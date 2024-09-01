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
    <el-table-column prop="site" label="Site" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'site')" />
    <el-table-column prop="equipmentModel" label="Model" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'equipmentModel')" />
    <el-table-column prop="equipmentNumber" label="Equipment" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'equipmentNumber')" />
    <el-table-column prop="component" label="Component" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'component')" />
    <el-table-column prop="smu" label="SMU" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'smu')" />
    <el-table-column prop="counterReading" label="Component Life" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'counterReading')" />
    <el-table-column prop="validationReason" label="Remark" min-width="300" sortable />
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
import { ElTable, ElTableColumn } from "element-plus";
import {
  ValidatedItem
} from "@/core/types/entities/iron-portal/iron-portal-transactional/counter-reading/ValidatedItem";
import {
  useCounterReadingBulkStore
} from "@/store/pinia/iron-portal/iron-portal-transactional/counter-reading/useCounterReadingBulkStore";
import {
  PropType,
  defineProps,
  computed,
  ref,
} from "vue";
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

const columnOrder = ref("");

/* stores */
const bulkStore = useCounterReadingBulkStore();

const startIndex = computed(() => {
  return ((props.page - 1) * 10) + 1
})

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
