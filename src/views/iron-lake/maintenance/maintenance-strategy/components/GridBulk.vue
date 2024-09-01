<template>
    <el-table
    :data="props.listData"
    style="width: 100%"
    @sort-change="handleSort"
    :empty-text="'No Data'">
          <el-table-column label="No" width="60" align="center">
              <template #default="scope">
                  <span>{{ startIndex + scope.$index }}</span>
              </template>
          </el-table-column>
          <el-table-column prop="maintenanceStrategyId" label="ID Maintenance Strategy" width="170" sortable />
          <el-table-column prop="strategyCategory" label="Strategy Category" width="170" sortable />
          <el-table-column prop="strategyPackage" label="Strategy Package" width="170" sortable />
          <el-table-column prop="budgetLife" label="Budget Life/Cycle" width="170" sortable />
          <el-table-column prop="uom" label="UOM" width="170" sortable />
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
        <el-table-column prop="validationReason" label="Remark" min-width="100" sortable />
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
} from "@/core/types/entities/iron-lake/maintenance/maintenance-strategy/ValidatedItem";
import {
  useMaintenanceStrategyBulkStore
} from "@/store/pinia/iron-lake/maintenance/maintenance-strategy/useMaintenanceStrategyBulkStore";
import { PropType, defineProps, computed } from "vue";
import { SortParam } from "@/core/types/misc/SortParam";
import { formatDateOnlyAU } from "@/core/helpers/date-format";

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
const bulkStore = useMaintenanceStrategyBulkStore();

const startIndex = computed(() => {
  return ((props.page - 1) * 10) + 1
})

/* handlers */
const handleSort = (sort: SortParam) => {
  const payload = {
    prop: sort.prop,
    order: sort.order,
  };
  bulkStore.setSort(payload);
}
</script>
