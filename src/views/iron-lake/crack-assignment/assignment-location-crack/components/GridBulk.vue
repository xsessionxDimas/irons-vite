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
        <el-table-column prop="model" label="Model" width="150" sortable />
        <el-table-column prop="psType" label="PS Type" width="150" sortable/>
        <el-table-column prop="locationIdParent" label="Location Id Parent" width="200" sortable />
        <el-table-column prop="taskNumberDetailParent" label="Task Number Detail Parent" width="220" sortable />
        <el-table-column prop="locationIdChild" label="Location Id Child" width="200" sortable />
        <el-table-column prop="taskNumberDetailChild" label="Task Number Detail Child" width="220" sortable />
        <el-table-column prop="startDate" label="Start Date" width="120" sortable>
          <template #default="scope">
              <span>{{ formatDateOnlyAU(scope.row.startDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endDate" label="End Date" width="100" sortable>
          <template #default="scope">
              <span>{{ formatDateOnlyAU(scope.row.endDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="validationReason" label="Remark" width="200" sortable />
        <el-table-column prop="isValid" label="Status" min-width="100" align="center" sortable>
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
} from "@/core/types/entities/iron-lake/crack-assignment/assignment-location-crack/ValidatedItem";
import {
  useAssignmentLocationCrackBulkStore
} from "@/store/pinia/iron-lake/crack-assignment/assignment-location-crack/useAssignmentLocationCrackBulkStore";
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
const bulkStore = useAssignmentLocationCrackBulkStore();

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
