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
    <el-table-column prop="cbmType" label="CBM Type" width="170" sortable />
    <el-table-column prop="equipmentModel" label="Equipment Model" width="170" sortable />
    <el-table-column prop="component" label="Component" width="170" sortable />
    <el-table-column prop="parameterTo" label="Parameter To" width="170" sortable />
    <el-table-column prop="interventionCode" label="Intervention Code" width="170" sortable />
    <el-table-column prop="sampleStatus" label="Sample Status" width="170" sortable />
    <el-table-column prop="sequence" label="Sequence" width="170" sortable />
    <el-table-column prop="subTask" label="Sub Task" width="170" sortable />
    <el-table-column prop="recAction" label="Rec Action" width="170" sortable />
    <el-table-column prop="isAutoFill" label="Auto Fill" width="100" sortable />
    <el-table-column prop="isUom" label="Is Uom" width="100" sortable />
    <el-table-column prop="uom" label="Uom" width="170" sortable />
    <el-table-column prop="referenceDocument" label="Reference Document" width="170" sortable />
    <el-table-column prop="psType" label="Ps Type" width="170" sortable />
    <el-table-column prop="taskGroupKey" label="Task Group Key" width="170" sortable />
    <el-table-column prop="taskKey" label="Task Key" width="170" sortable />
    <el-table-column prop="typeTask" label="Type Task" width="170" sortable />
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
} from "@/core/types/entities/iron-portal/iron-portal-configuration/recommended-action/ValidatedItem";
import {
  useRecommendedActionBulkStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/recommended-action/useRecommendedActionBulkStore";
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
const bulkStore = useRecommendedActionBulkStore();

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
