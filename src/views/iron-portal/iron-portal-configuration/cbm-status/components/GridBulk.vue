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
    <el-table-column prop="cbmGroup" label="CBM Group" width="170" sortable />
    <!-- <el-table-column prop="parameter" label="Parameter" width="170" sortable /> -->
    <el-table-column prop="component" label="Component" width="170" sortable />
    <el-table-column prop="cluster" label="Cluster" width="170" sortable />
    <el-table-column prop="sampleCount" label="Sample Count" width="170" sortable />
    <el-table-column prop="sampleWeight" label="Weight" width="170" sortable />
    <el-table-column prop="cautionLimit" label="Caution Limit" width="170" sortable />
    <el-table-column prop="criticalLimit" label="Critical Limit" width="170" sortable />
    <!-- <el-table-column prop="summaryWeight" label="Summary Weight" width="170" sortable /> -->
    <el-table-column prop="startDate" label="Start Date" align="center" width="170" sortable>
      <template #default="scope">
        <span>{{ formatDateOnlyAU(scope.row.startDate) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="EndDate" label="end Date" align="center" width="170" sortable>
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
  ValidatedItemSpecific
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-status/ValidatedItem";
import {
  useCbmStatusBulkStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-status/useCbmStatusBulkStore";
import {
  PropType,
  defineProps,
  ref,
  computed
} from "vue";
import { formatDateOnlyAU } from "@/core/helpers/date-format";

const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<ValidatedItemSpecific[]>,
  },
  page: {
    required: true,
    type: Number,
    default: 1
  }
});

const columnOrder = ref("");

/* stores */
const bulkStore = useCbmStatusBulkStore();

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
</script>
