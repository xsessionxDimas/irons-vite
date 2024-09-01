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
        <el-table-column prop="unitNumber" label="Unit Number" width="170" sortable />
        <el-table-column prop="isValid" label="Status" width="100" sortable>
          <template #default="scope">
            <div class="icon">
              <inline-svg :src="getIcon(scope) ? '/media/svg/tables/rows/valid-true.svg' : '/media/svg/tables/rows/valid-false.svg'" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="smuDue" label="SMU Due (Hours)" width="170" sortable />
        <el-table-column prop="workOrder" label="Work Order" width="170" sortable />
        <el-table-column prop="psType" label="Service Size" width="170" sortable />
        <el-table-column prop="dateService" label="Planned Service Date" align="center" width="180" sortable />
        <el-table-column prop="shift" label="Shift" width="170" sortable />
        <el-table-column prop="startDate" label="Start Date" align="center" width="170" sortable />
        <el-table-column prop="endDate" label="End Date" align="center" width="170" sortable />
        <el-table-column prop="validationReason" label="Remark" min-width="100" sortable />
    </el-table>
</template>


<script lang="ts" setup>
/* import componenets here */
import { ElTable, ElTableColumn } from "element-plus";
import {
  ValidatedItem
} from "@/core/types/entities/iron-lake/task/daily-schedule-v1/ValidatedItem";
import {
  useDailyScheduleBulkStore
} from "@/store/pinia/iron-lake/task/daily-schedule-v1/useDailyScheduleBulkStore";
import { PropType, defineProps, computed } from "vue";
import { SortParam } from "@/core/types/misc/SortParam";

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
const bulkStore = useDailyScheduleBulkStore();

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

const getIcon = (scope) => {
  if (scope.row.isProcess) {
    return true
  } else {
    return scope.row.isValid
  }
}
</script>
