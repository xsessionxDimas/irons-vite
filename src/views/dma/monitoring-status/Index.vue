<template>
  <div class="wrapper d-flex flex-column flex-fill">
    <div class="d-flex justify-content-between align-items-center">
        <p class="page-title">Monitoring Status</p>
        <div>
          <online-status></online-status>
        </div>
    </div>
    <div class="d-flex flex-column">
      <h1 class="my-6"></h1>
      <MonitoringList
      :fromApprovalPageType="formType"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MonitoringList from './components/list/Index.vue'
import OnlineStatus from '@/components/sensors/OnlineStatus.vue'
import { onUnmounted, computed } from "vue";
import {
  useMonitoringListStore
} from "@/store/pinia/dma/status-monitoring/useMonitoringListStore";

const monitoringStore = useMonitoringListStore();

const formType = computed(() => {
  return monitoringStore.defaultFormTypeOpenFromApprovalPlanner
})

onUnmounted(() => {
  monitoringStore.setDefaultFormTypeOpenFromApprovalPlanner("")
})

</script>

<style lang="scss" scoped>
  @import "@/assets/sass/pages/defect-review.scss";
</style>
