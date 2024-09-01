<template>
  <template v-if="listStore.loading">
    <div v-loading="listStore.loading" style="height: 100px"></div>
  </template>
  <template v-else>
    <el-table
      v-loading="listStore.loading"
      :data="props.listData"
      style="width: 100%"
      :max-height="500"
      :empty-text="'No Data'"
      header-cell-class-name="ironlake-table-cell-header"
      cell-class-name="ironlake-table-cell"
    >
      <el-table-column label="Sync Date" prop="syncDate" min-width="200">
        <template #default="scope">
          {{ formatDateAU(scope.row.syncDate) }}
        </template>
      </el-table-column>
      <el-table-column label="Status" prop="status" min-width="200" >
        <template #default="scope">
          <span
            class="badge btech-badge"
            :class="checkStatusBadge(scope.row.status)"
          >
            {{ scope.row.status ? 'SUCCESS' : 'FAILED' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </template>
</template>
<script lang="ts" setup>
import {
  formatDateOnlyAU,
  formatDateAU,
  simpleFormatDateShortAU,
} from "@/core/helpers/date-format";
import {
  useCbmParameterListStore
} from "@/store/pinia/iron-lake/maintenance/cbm-parameter/useCbmParameterListStore";
import { PropType } from "vue";
import {
  SyncItem
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/SyncItem";

// props
const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<SyncItem[]>,
  },
});

// stores
const listStore = useCbmParameterListStore();

// emits
const emits = defineEmits(["show-errors", "delete-draft", "show-dialog"]);

const checkStatusBadge = (status: boolean) => {
  if (status) {
    return "badge-light-success text-btech-success-500";
  } else {
    return "badge-light-danger";
  }
};
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
.text-name {
  font-size: 1rem;
  font-weight: 600;
}
.rounded-badge-success {
  background-color: green;
}
.rounded-badge-error {
  background-color: red;
}
.text-black i {
  color: rgb(55, 71, 79);
}
.text-sitename {
  white-space: nowrap;
  overflow-x: auto;
}
</style>
