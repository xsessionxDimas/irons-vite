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
    <el-table-column prop="component" label="Component" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'component')" />
    <el-table-column prop="sensorData" label="Sensor Data" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'sensorData')" />
    <el-table-column prop="oilDataS1" label="Oil Data S1" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'oilDataS1')" />
    <el-table-column prop="oilDataS2" label="Oil Data S2" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'oilDataS2')" />
    <el-table-column prop="filterCutS1" label="Filter Cut S1" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'filterCutS1')" />
    <el-table-column prop="filterCutS2" label="Filter Cut S2" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'filterCutS2')" />
    <el-table-column prop="magPlug" label="Mag Plug" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'magPlug')" />
    <el-table-column prop="ironFormsCbm" label="Iron Forms CBM" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'ironFormsCbm')" />
    <el-table-column prop="componentStatus" label="Component Status" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'componentStatus')" />
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
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status/ValidatedItem";
import {
  useComponentStatusBulkStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-status/useComponentStatusBulkStore";
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
const bulkStore = useComponentStatusBulkStore();

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
