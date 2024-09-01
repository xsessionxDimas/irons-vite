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
          <el-table-column prop="MenuName" label="Menu Name" width="170" sortable />
          <el-table-column prop="PageName" label="Page Name" width="170" sortable />
          <el-table-column prop="MenuType" label="Menu Type" width="170" sortable />
          <el-table-column prop="Level" label="Level" width="170" sortable />
          <el-table-column prop="Sequence" label="Sequence" width="170" sortable />
          <el-table-column prop="IsChild" label="Is Child" width="170" sortable />
          <el-table-column prop="ParentId" label="Parent Id" width="170" sortable />
          <el-table-column prop="IsMenu" label="Is Menu" width="170" sortable />
          <el-table-column prop="Section" label="Section" width="170" sortable />
          <el-table-column prop="ValidationReason" label="Remark" min-width="100" sortable />
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
} from "@/core/types/entities/administration/user-management/menu/ValidatedItem";
import {
  useMaintenanceStrategyBulkStore
} from "@/store/pinia/iron-lake/maintenance/maintenance-strategy/useMaintenanceStrategyBulkStore";
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
const bulkStore = useMaintenanceStrategyBulkStore();

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
