<template>
  <template v-if="listStore.loading">
    <div v-loading="listStore.loading" style="height: 100px"></div>
  </template>
  <template v-else>
    <el-table v-loading="listStore.loading"
      :data="props.listData"
      style="width: 100%"
      @sort-change="handleSort"
      :empty-text="'No Data'"
    >
      <el-table-column label="No" width="90" align="center">
        <template #default="scope">
          <span>{{ startIndex + scope.$index }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="model" label="Model" width="120" sortable :sort-method="(a, b) => customSort(a, b, 'model')" />
      <el-table-column prop="version" label="Version" width="100" sortable :sort-method="(a, b) => customSort(a, b, 'version')" />
      <el-table-column prop="groupName" label="Group Name" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'groupName')" />
      <el-table-column prop="subGroupName" label="Sub Group Name" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'subGroupName')" />
      <el-table-column prop="taskGroupName" label="Task Group Name" width="160" sortable :sort-method="(a, b) => customSort(a, b, 'taskGroupName')" />
      <el-table-column prop="taskDescription" label="Task Description" min-width="250" sortable :sort-method="(a, b) => customSort(a, b, 'taskDescription')" />
      <el-table-column prop="taskKey" label="Task Key" min-width="170" sortable :sort-method="(a, b) => customSort(a, b, 'taskKey')" />
      <el-table-column prop="psType" label="PS Type" width="120" sortable :sort-method="(a, b) => customSort(a, b, 'psType')" />
      <el-table-column class-name="py-0 full-bg-cell" prop="Check" label="Check" align="center" width="150" sortable>
        <template #default="scope">
          <div class="h-100 d-flex justify-content-center align-items-center" :class="scope.row.check == 'true' ? 'bg-row-green' : 'bg-row-red'">
            <div class="text-white text-uppercase">{{ scope.row.check }}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </template>
</template>

<script lang="ts" setup>
/* import componenets here */
import { ElTable, ElTableColumn } from "element-plus";
import {
  useTaskKeyMonitoringListStore
} from "@/store/pinia/iron-lake/report/task-key-monitoring/useTaskKeyMonitoringListStore";
import {
  ListItem
} from "@/core/types/entities/iron-lake/report/task-key-monitoring/ListItem";
import {
  PropType,
  defineProps,
  defineEmits,
  ref
} from "vue";
import { computed } from "@vue/reactivity";
import {
  camelCaseToSnakeCaseConverter,
  dynamicSortCaseInsensitive
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
const listStore = useTaskKeyMonitoringListStore();
const emits = defineEmits(["show-dialog"]);
const startIndex = computed(() => {
  return ((props.page - 1) * 10) + 1
});
const columnOrder = ref("");
const handleSort = (sort) => {
  columnOrder.value = sort.order
  let sentProp = sort.prop
  if (sort.prop) {
    sentProp = camelCaseToSnakeCaseConverter(sort.prop)
  }
  const payload = {
    prop: sentProp,
    order: sort.order,
  };
  listStore.setSort(payload);
}
const customSort = (objA, objB, field) => {
  return dynamicSortCaseInsensitive(objA[field], objB[field], columnOrder.value);
}
</script>

<style lang="scss">
.full-bg-cell {
  position: relative;
  .cell {
    padding: 0px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

.bg-row-red {
  background-color: red;
}

.bg-row-green {
  background-color: #18af4a;
}
</style>
