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
          <el-table-column prop="model" label="Model" min-width="200" sortable :sort-method="(a, b) => customSort(a, b, 'model')" />
          <el-table-column prop="psType" label="PS Type" min-width="200" sortable :sort-method="() => defaultSort()" />
          <el-table-column prop="smuActual" label="SMU Actual" min-width="200" sortable :sort-method="(a, b) => customSort(a, b, 'smuActual')" />
          <el-table-column prop="uom" label="UOM" width="75" sortable :sort-method="(a, b) => customSort(a, b, 'uom')" />
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
  useSmuActualListStore
} from "@/store/pinia/iron-lake/parameter/smu-actual/useSmuActualListStore";
import {
  ListItem
} from "@/core/types/entities/iron-lake/parameter/smu-actual/ListItem";
import { PropType, defineProps, ref } from "vue";
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
const listStore = useSmuActualListStore();
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
