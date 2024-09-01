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
        <el-table-column prop="EmployeeId" label="Employee ID" width="130" sortable />
        <el-table-column prop="Name" label="Name" width="130" sortable />
        <el-table-column prop="EmployeeIdDirect" label="Employee ID Direct" width="170" sortable/>
        <el-table-column prop="EmployeeDirectName" label="Employee Direct Name" width="190" sortable/>
        <el-table-column prop="StartDate" label="Start Date" align="center" width="110" sortable />
        <el-table-column prop="EndDate" label="End Date" align="center" width="110" sortable />
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
} from "@/core/types/entities/administration/organization-unit/user-direct/ValidatedItem";
import {
  useUserDirectBulkStore
} from "@/store/pinia/administration/organization-unit/user-direct/useUserDirectBulkStore";
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
const bulkStore = useUserDirectBulkStore();

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
