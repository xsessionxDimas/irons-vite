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
        <el-table-column prop="equipmentModel" label="Equipment Model" width="200" sortable />
        <el-table-column prop="psType" label="PS Type" width="200" sortable />
        <el-table-column prop="component" label="ID Component" width="200" sortable />
        <el-table-column prop="recomendedLubricant" label="Recommended Lubricants" width="250" sortable />
        <el-table-column prop="value" label="Value" width="150" sortable />
        <el-table-column prop="uom" label="UOM" width="150" sortable />
        <el-table-column prop="taskNo" label="Task No" width="150" sortable />
        <el-table-column prop="startDate" label="Start Date" width="120" sortable />
        <el-table-column prop="endDate" label="End Date" width="100" sortable />
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
} from "@/core/types/entities/iron-lake/parameter/assignment-component-lubricant/ValidatedItem";
import {
  useAssignmentComponentLubricantBulkStore
} from "@/store/pinia/iron-lake/parameter/assignment-component-lubricant/useAssignmentComponentLubricantBulkStore";
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
const bulkStore = useAssignmentComponentLubricantBulkStore();

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
