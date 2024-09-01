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
    <el-table-column prop="equipmentModel" label="Equipment Model" width="170" sortable/>
    <el-table-column prop="component" label="Component" width="170" sortable/>
    <el-table-column prop="element" label="Element" width="170" sortable/>
    <el-table-column prop="rating" label="Rating Description" width="170" sortable/>
    <el-table-column prop="operatorMin" label="Operator Min" width="170" sortable/>
    <el-table-column prop="valueMin" label="Value Min" width="170" sortable/>
    <el-table-column prop="operatorMax" label="Operator Max" width="170" sortable/>
    <el-table-column prop="valueMax" label="Value Max" width="170" sortable/>
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
  ValidatedItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/mapping-sos-bi/ValidatedItem";
import {
  useMappingSosBiBulkStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/mapping-sos-bi/useMappingSosBiBulkStore";
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
const bulkStore = useMappingSosBiBulkStore();

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
