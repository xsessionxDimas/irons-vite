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
    <el-table-column prop="EquipmentModel" label="Equipment Model" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'EquipmentModel')" />
    <el-table-column prop="ObjectType" label="Object Type" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'ObjectType')" />
    <el-table-column prop="CbmGroup" label="CBM Group" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'CbmGroup')" />
    <el-table-column prop="Area" label="Area" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'Area')" />
    <el-table-column prop="StartDate" label="Start Date" align="center" width="170" sortable>
      <template #default="scope">
        <span>{{ formatDateOnlyAU(scope.row.StartDate) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="EndDate" label="end Date" align="center" width="170" sortable>
      <template #default="scope">
        <span>{{ formatDateOnlyAU(scope.row.EndDate) }}</span>
      </template>
      </el-table-column>
    <el-table-column prop="ValidationReason" label="Remark" min-width="300" sortable />
    <el-table-column prop="IsValid" label="Status" width="100" sortable>
      <template #default="scope">
        <div class="icon">
          <inline-svg :src="scope.row.IsValid ? '/media/svg/tables/rows/valid-true.svg' : '/media/svg/tables/rows/valid-false.svg'" />
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
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-area-mapping/ValidatedItem";
import {
  useCbmAreaMappingBulkStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-area-mapping/useCbmAreaMappingBulkStore";
import {
  PropType,
  defineProps,
  computed,
  ref,
} from "vue";
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

const columnOrder = ref("");

/* stores */
const bulkStore = useCbmAreaMappingBulkStore();

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
const customSort = (objA, objB, field) => {
  return dynamicSortCaseInsensitive(objA[field], objB[field], columnOrder.value);
}
</script>
