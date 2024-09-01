<template>
  <!-- <div class="col-12 py-1">
    <div class="flex-row px-3 d-flex justify-content-start">
      <div class="">
        <StatusLegend color="orange" text="Not Approved by Planner" />
      </div>
      <div class="ms-4">
        <StatusLegend color="#18AF4A" text="Approved by Planner" />
      </div>
    </div>
  </div> -->
  <div class="col-12 grouping-by-status">
    <el-menu
      :default-active="selectedHeader"
      class="el-menu-demo d-flex flex-wrap"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item v-for="header in headerList" :key="header" :index="header.label">
        <span style="font-size: 12px;">{{ header.label }} ({{ header.total }})</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import {
  useMonitoringListStore
} from '@/store/pinia/dma/status-monitoring/useMonitoringListStore'
// import StatusLegend from './StatusLegend.vue';
import { ElLoading } from 'element-plus';

const listStore = useMonitoringListStore()

const headerList = computed(() => {
  return listStore.headerList
})

const selectedHeader = computed(() => {
  return listStore.selectedHeader
})

const handleSelect = async (key: string) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading Monitoring Status List',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await listStore.setHeaderChange(key)
  loading.close()
}
</script>

<style lang="scss">
  .grouping-by-status {
    overflow: hidden;
    .el-menu{
      &.el-menu--horizontal {
        border-bottom: none;
      }
    }
    .el-menu-item {
      &.is-active {
        border-color: #18AF4A;
      }
    }
  }
</style>
