<template>
  <el-button
    :disabled="props.loadingMapping"
    type="primary"
    class="mb-5"
    size="small"
    @click="handleAddNewRow"
  >
    Add New
  </el-button>
  <el-table
    :data="props.data"
    class="table_dark-row table-dark"
    header-row-class-name="table_dark-header"
    row-class-name="table_dark-row text-white"
    v-loading="props.loading"
    element-loading-background="#2d2b39b3"
  >
    <el-table-column prop="model" label="Model" />
    <el-table-column prop="replacementSmu" label="SMU" />
    <el-table-column prop="replacementDate" label="Replacement Date">
      <template #default="scope">
        <span>{{ formatSlashDate(scope.row.replacementDate) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="" width="80">
      <template #default="scope">
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="isEditable(scope.row.transactionCount) ? `Edit` : `Data has been edited twice`"
          placement="top"
        >
          <div class="row justify-content-center">
            <button
              class="btn btn-sm btn-icon btn-bg-light"
              @click="handleEditRow(scope.row)"
              :disabled="!isEditable(scope.row.transactionCount)"
            >
              <inline-svg src="/media/svg/tables/rows/pencil-edit-blue.svg" width="12" height="12" />
            </button>
          </div>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
import { formatSlashDate } from '@/core/helpers/date-format'
import {
  defineProps,
  defineEmits,
} from 'vue'

const props = defineProps(["data", "loading", "loadingMapping"])

const emits = defineEmits(["showFormEdit"])

// Only the newest data can be edited.
// From BE, data is automatically sorted and the newest will always be the first.
// Therefore, only index 0 of data from page 1.
const isEditable = (transactionCount) => {
  return transactionCount < 2;
}

const handleEditRow = (row) => {
  console.log(row)
  emits("showFormEdit", row)
}
const handleAddNewRow = () => {
  emits("showFormEdit", null)
}
</script>
