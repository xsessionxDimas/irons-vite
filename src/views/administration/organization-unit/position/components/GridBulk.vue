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
        <el-table-column prop="Position" label="Position" sortable />
        <el-table-column prop="PositionDescription" label="Position Desc." sortable />
        <el-table-column prop="StartDate" label="Start Date" width="110" sortable>
            <template #default="scope">
                <span>{{ formatDateOnlyAU(scope.row.StartDate) }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="EndDate" label="End Date" width="110" sortable>
            <template #default="scope">
                <span>{{ formatDateOnlyAU(scope.row.EndDate) }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="IsDma" label="Is DMA" width="100" sortable>
            <template #default="scope">
              <template v-if="scope.row.IsDma">
                <div class="row justify-content-center">
                  <inline-svg src="/media/svg/tables/rows/check.svg" />
                </div>
              </template>
              <template v-else>
                <div class="row justify-content-center">
                  <inline-svg src="/media/svg/tables/rows/minus.svg" />
                </div>
              </template>
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
} from "@/core/types/entities/administration/organization-unit/position/ValidatedItem";
import {
  usePositionBulkStore
} from "@/store/pinia/administration/organization-unit/position/usePositionBulkStore";
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
const bulkStore = usePositionBulkStore();

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
