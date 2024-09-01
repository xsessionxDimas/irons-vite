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
    <el-table-column prop="site" label="Site" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'site')" />
    <el-table-column prop="equipmentModel" label="Equipment Model" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'equipmentModel')" />
    <el-table-column prop="component" label="Component" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'component')" />
    <el-table-column prop="componentType" label="Component Type" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'componentType')" />
    <el-table-column prop="componentWeight" label="Component Weight" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'componentWeight')" />
    <el-table-column prop="oemInterval" label="OEM Interval" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'oemInterval')" />
    <el-table-column prop="bumaAuTarget" label="BUMA AU Target" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'bumaAuTarget')" />
    <el-table-column prop="maxRiskRank" label="Max Risk Rank" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'maxRiskRank')" />
    <el-table-column prop="revisedRank" label="Revised Rank" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'revisedRank')" />
    <el-table-column prop="overallRisk" label="Overall Risk" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'overallRisk')" />
    <el-table-column prop="failureTiming" label="Failure Timing" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'failureTiming')" />
    <el-table-column prop="systemImpact" label="System Impact" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'systemImpact')" />
    <el-table-column prop="opsImpact" label="OPS Impact" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'opsImpact')" />
    <el-table-column prop="supplyRisk" label="Supply Risk" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'supplyRisk')" />
    <el-table-column prop="failureCost" label="Failure Cost" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'failureCost')" />
    <el-table-column prop="comments" label="Comments" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'comments')" />
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
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-risk-rating/ValidatedItem";
import {
  useComponentRiskRatingBulkStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-risk-rating/useComponentRiskRatingBulkStore";
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
const bulkStore = useComponentRiskRatingBulkStore();

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
