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
    <el-table-column prop="cbmType" label="CMB Type" min-width="170" sortable/>
    <el-table-column prop="equipmentModel" label="Equipment Model" min-width="170" sortable/>
    <el-table-column prop="component" label="Component" min-width="170" sortable/>
    <el-table-column prop="parameterFrom" label="Parameter From" min-width="170" sortable/>
    <el-table-column prop="parameterTo" label="Parameter To" min-width="170" sortable/>
    <el-table-column prop="registerNumber" label="Register Number" min-width="170" sortable/>
    <el-table-column prop="severityLevel" label="Severity Level" min-width="170" sortable/>
    <el-table-column prop="uomFrom" label="Uom From" min-width="170" sortable/>
    <el-table-column prop="uomTo" label="Uom To" min-width="170" sortable/>
    <el-table-column prop="uomConvertRatio" label="Uom Convert Ratio" min-width="170" sortable/>
    <el-table-column prop="rating" label="Rating" min-width="170" sortable/>
    <el-table-column prop="operatorMin" label="Operator Min" min-width="170" sortable/>
    <el-table-column prop="valueMin" label="Value Min" min-width="170" sortable/>
    <el-table-column prop="operatorMax" label="Operator Max" min-width="170" sortable/>
    <el-table-column prop="valueMax" label="Value Max" min-width="170" sortable/>
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
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-threshold/ValidatedItem";
import {
  useCbmThresholdBulkStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-threshold/useCbmThresholdBulkStore";
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
const bulkStore = useCbmThresholdBulkStore();

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
