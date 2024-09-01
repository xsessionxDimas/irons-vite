<template>
  <template v-if="listStore.loading">
    <div v-loading="listStore.loading" style="height: 100px"></div>
  </template>
  <template v-else>
      <el-table
      v-loading="listStore.loading"
      :data="props.listData"
      style="width: 100%;"
      :empty-text="'No Data'"
      header-cell-class-name="ironlake-table-cell-header"
      cell-class-name="ironlake-table-cell"
      @sortChange="handleSortChange"
    >
      <el-table-column label="Model" prop="modelId" min-width="100" sortable :sort-orders="['ascending', 'descending']" :sort-method="(a, b) => sortNew(a.modelId, b.modelId)"/>
      <el-table-column label="Service Size" prop="psTypeId" min-width="100" sortable :sort-orders="['ascending', 'descending']" :sort-method="(a, b) => sortNew(a.psTypeId, b.psTypeId)"/>
      <el-table-column label="Version" prop="version" sortable min-width="100" :sort-orders="['ascending', 'descending']" :sort-method="(a, b) => sortNew(a.version, b.version)"/>
        <el-table-column label="Release Date" prop="releaseDate" sortable min-width="100" :sort-orders="['ascending', 'descending']" :sort-method="(a, b) => sortNew(a.releaseDate, b.releaseDate)"/>
      <el-table-column label="Task Category" prop="category" min-width="125" sortable :sort-orders="['ascending', 'descending']" :sort-method="(a, b) => sortNew(a.category, b.category)"/>
      <el-table-column label="Task Description" prop="description" min-width="150" sortable :sort-orders="['ascending', 'descending']" :sort-method="(a, b) => sortNew(a.description, b.description)">
        <template #default="scope">
          <div v-html="scope.row.description"></div>
        </template>
      </el-table-column>
      <el-table-column label="Sub Task" prop="subTask" min-width="80" sortable :sort-orders="['ascending', 'descending']" :sort-method="(a, b) => sortNew(a.subTask, b.subTask)"/>
      <el-table-column label="Task Rating" prop="rating" min-width="125" sortable :sort-orders="['ascending', 'descending']" :sort-method="(a, b) => sortNew(a.rating, b.rating)"/>
      <el-table-column label="Status" prop="status" sortable min-width="80" :sort-orders="['ascending', 'descending']" :sort-method="(a, b) => sortNew(a.status, b.status)" fixed="right">
        <template #default="scope">
          <el-tag class="fw-bolder" :type="scope.row.status.toLocaleLowerCase() === 'active' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </template>
</template>
<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  PropType,
  ref
} from "vue";
import { ListItem } from "@/core/types/entities/dma/task-collection/ListItem";
import {
  useTaskCollection
} from "@/store/pinia/dma/task-collection/useTaskCollection"

// props
const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<ListItem[]>,
  },
});

// stores
const listStore = useTaskCollection();

// emits
const emits = defineEmits(["show-errors", "delete-draft", "show-dialog"]);

const columnOrder = ref("");
const handleSortChange = (sortParam: { column; prop; order }) => {
  columnOrder.value = sortParam.order;
};

const sortNew = (a, b) => {
  const valueA = a.toLocaleLowerCase();
  const valueB = b.toLocaleLowerCase();
  if (valueA === null) return 1;
  if (valueB === null) return -1;
  if (valueA === null && valueB === null) return 0;
  return valueA.localeCompare(valueB);
}

const sortServiceSize = (a, b) => {
  const numA = parseInt(a.serviceSize);
  const numB = parseInt(b.serviceSize);
  return numA - numB;
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/core/components/mixins/_typography.scss";

:deep(.el-table__fixed-right) {
  height: 100% !important;
  .el-table__fixed-body-wrapper {
    height: 100% !important;
  }
}

:deep(.ironlake-table-cell) {
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid #ddd;
  // border-bottom: none;
  .cell {
    padding: 0;
    @include paragraph-sm();
  }
  &:first-child {
    padding-left: 1rem;
  }
  &:last-child {
    padding-right: 1rem;
  }
}

:deep(.ironlake-table-cell-header) {
  padding: 1rem 0.5rem;
  color: #000;
  .cell {
    padding: 0;
    @include paragraph-md();
    font-weight: 600;
  }
  &:first-child {
    padding-left: 1rem !important;
  }
  &:last-child {
    padding-right: 1rem;
  }
}

</style>
