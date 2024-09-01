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
        <el-table-column prop="cbmParameterId" label="ID CBM Parameter" width="170" sortable />
        <el-table-column prop="componentId" label="ID Component" width="170" sortable />
        <el-table-column prop="typeParameterId" label="ID Type Parameter" width="170" sortable />
        <el-table-column prop="cbmGroup" label="CBM Group" width="170" sortable />
        <el-table-column prop="cbmArea" label="AREA CBM" width="170" sortable />
        <el-table-column prop="model" label="Model" width="170" sortable />
        <el-table-column prop="psType" label="PS Type" width="170" sortable />
        <el-table-column prop="taskNumber" label="Task Number" width="170" sortable />
        <el-table-column prop="detailNumber" label="No detail" width="170" sortable />
        <el-table-column prop="cbmParameter" label="CBM Parameter" width="170" sortable />
        <el-table-column prop="parameter" label="Parameter" width="170" sortable />
        <el-table-column prop="valueMin" label="Value Min" width="170" sortable />
        <el-table-column prop="valueMax" label="Value Max" width="170" sortable />
        <el-table-column prop="uom" label="UOM" width="170" sortable />
        <el-table-column prop="statusConverter" label="Status Converter" width="170" sortable />
        <el-table-column prop="statusConverterDescription" label="Status Converter Description" width="170" sortable />
        <el-table-column prop="status" label="Status" width="170" sortable />
        <el-table-column prop="statusDescription" label="Status Description" width="170" sortable />
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
} from "@/core/types/entities/iron-lake/parameter/parameter-ehms/ValidatedItem";
import {
  useParameterEhmsBulkStore
} from "@/store/pinia/iron-lake/parameter/parameter-ehms/useParameterEhmsBulkStore";
import { PropType, defineProps, computed } from "vue";
import { SortParam } from "@/core/types/misc/SortParam";
import {
  formatDateOnlyAU
} from "@/core/helpers/date-format";

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
const bulkStore = useParameterEhmsBulkStore();

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
