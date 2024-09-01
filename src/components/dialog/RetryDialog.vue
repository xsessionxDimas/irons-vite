<template>
    <el-dialog v-model="dialogVisible"
    width="90%" center
    @closed="onFormClosed"
    :destroy-on-close="true"
    custom-class="retry-dialog">
        <template #title>
            <span class="el-dialog__title">Retry Sync Data</span>
        </template>
        <div class="d-flex justify-content-center">
        <!-- need to add loader here -->
            <div v-if="inProcess">
                <NwImg src="/media/gifs/sync.gif" alt="sync" style="width:200px; height: 200px;" />
            </div>
        </div>
        <div>
            <el-table style="width: 100%" :data="data">
                <el-table-column prop="no" label="No" width="60" />
                <el-table-column prop="key" label="Key" />
                <el-table-column prop="type" label="Type" />
                <el-table-column prop="result" label="Result" />
            </el-table>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import {
  defineEmits,
  defineProps,
  computed,
  toRef,
  PropType
} from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'
import { SyncResult } from '@/core/types/intervention/SyncResult'
import { orderBy } from 'lodash'

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  result: {
    required: true,
    type: Array as PropType<SyncResult[]>
  },
  inProcess: {
    required: true,
    type: Boolean
  }
})
const emits = defineEmits(['onClosed'])

/* refs */
const dialogVisible = toRef(props, "visibility")

/* computeds */
const data = computed(() => {
  return orderBy(props.result ?? [], ['no'], ['asc'])
})

const onFormClosed = () => {
  emits('onClosed', null)
}
</script>

<style lang="scss">
  .retry-dialog {
    .el-dialog__body {
        padding-top: 0
    }
  }
</style>
