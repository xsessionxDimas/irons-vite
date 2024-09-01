<template>
    <template v-if="listStore.loading">
        <div v-loading="listStore.loading" style="height: 100px"></div>
    </template>
    <template v-else>
      <el-table v-loading="listStore.loading"
      :data="props.listData"
      style="width: 100%"
      @sort-change="handleSort"
      :empty-text="'No Data'">
          <el-table-column label="No" width="90" align="center">
              <template #default="scope">
                  <span>{{ startIndex + scope.$index }}</span>
              </template>
          </el-table-column>
          <el-table-column prop="unitNumber" label="Unit Number" width="200" sortable :sort-method="(a, b) => customSort(a, b, 'unitNumber')" />
          <el-table-column prop="smuDue" label="SMU Due" width="200" sortable :sort-method="(a, b) => customSort(a, b, 'smuDue')" />
          <el-table-column prop="workOrder" label="Work Order" width="200" sortable :sort-method="(a, b) => customSort(a, b, 'workOrder')" />
          <el-table-column prop="psType" label="PS Type" width="200" sortable :sort-method="() => defaultSort()" />
          <el-table-column prop="dateService" label="Date Service" align="center" width="170" sortable>
              <template #default="scope">
                  <span>{{ formatDateOnlyAU(scope.row.dateService) }}</span>
              </template>
          </el-table-column>
          <el-table-column prop="model" label="Model" width="200" sortable :sort-method="(a, b) => customSort(a, b, 'model')" />
          <el-table-column prop="lastWorkOrder" label="Last Work Order" width="200" sortable :sort-method="(a, b) => customSort(a, b, 'lastWorkOrder')" />
          <el-table-column prop="lastPsType" label="Last PS Type" width="200" sortable :sort-method="(a, b) => customSort(a, b, 'lastPsType')" />
          <el-table-column prop="lastDateService" label="Last Date Service" align="center" width="170" sortable>
              <template #default="scope">
                  <span>{{ formatDateOnlyAU(scope.row.lastDateService) }}</span>
              </template>
          </el-table-column>
          <el-table-column prop="locationId" label="Location ID" width="200" sortable :sort-method="(a, b) => customSort(a, b, 'locationId')" />
          <el-table-column prop="taskNumberDetail" label="Task Number Detail" width="200" sortable :sort-method="(a, b) => customSort(a, b, 'taskNumberDetail')" />
          <el-table-column prop="lastLocationId" label="Last Location ID" width="200" sortable :sort-method="(a, b) => customSort(a, b, 'lastLocationId')" />
          <el-table-column prop="lastTaskNumberDetail" label="Last Task Number Detail" width="300" sortable :sort-method="(a, b) => customSort(a, b, 'lastTaskNumberDetail')" />
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
          <el-table-column prop="isActive" label="Is Active" width="100" sortable>
              <template #default="scope">
                  <template v-if="scope.row.isActive">
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
          <el-table-column prop="changedOn" label="Changed on" align="center" width="150" sortable>
              <template #default="scope">
                  <span>{{ formatDateAU(scope.row.changedOn) }}</span>
              </template>
          </el-table-column>
          <el-table-column prop="changedBy" label="Changed by" sortable width="300" :sort-method="(a, b) => customSort(a, b, 'changedBy')" />
      </el-table>
    </template>
</template>

<script lang="ts" setup>
/* import componenets here */
import { ElTable, ElTableColumn } from "element-plus";
import { formatDateAU, formatDateOnlyAU } from "@/core/helpers/date-format";
import {
  useHistoryCrackListStore
} from "@/store/pinia/iron-lake/task/history-crack/useHistoryCrackListStore";
import {
  ListItem
} from "@/core/types/entities/iron-lake/task/history-crack/ListItem";
import {
  PropType,
  defineProps,
  defineEmits,
  ref
} from "vue";
import { computed } from "@vue/reactivity";
import {
  dynamicSortCaseInsensitive,
  defaultSorting
} from "@/core/helpers/table-sort";

const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<ListItem[]>,
  },
  page: {
    required: true,
    type: Number,
    default: 1
  }
});
const listStore = useHistoryCrackListStore();
const emits = defineEmits(["show-dialog"]);
const startIndex = computed(() => {
  return ((props.page - 1) * 10) + 1
});
const columnOrder = ref("");
const handleSort = (sort) => {
  columnOrder.value = sort.order
  const payload = {
    prop: sort.prop,
    order: sort.order,
  };
  listStore.setSort(payload);
}
const defaultSort = () => {
  return defaultSorting(columnOrder.value);
}
const customSort = (objA, objB, field) => {
  return dynamicSortCaseInsensitive(objA[field], objB[field], columnOrder.value);
}
</script>
