<template>
<HeaderList />
<ListItem
:fromApprovalPageType="expandingFormType"
/>
</template>
<script lang="ts" setup>
import {
  useMonitoringListStore
} from '@/store/pinia/dma/status-monitoring/useMonitoringListStore';
import { ElLoading } from 'element-plus';
import {
  onBeforeMount,
  onUnmounted,
  ref,
  watch
} from 'vue';
import HeaderList from './HeaderList.vue';
import ListItem from './ListItem.vue';
import { defineProps } from "vue";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";

const props = defineProps(['fromApprovalPageType'])
const listStore = useMonitoringListStore()
const authStore = useAuthenticationStore()
const expandingFormType = ref("")
const loading = ref()

onBeforeMount(async () => {
  loading.value = ElLoading.service({
    lock: true,
    text: 'Loading Monitoring Status List',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (authStore.user.SiteId) {
    try {
      let lastTabMonitoring = localStorage.getItem("monitoring-status-tab")
      if (!lastTabMonitoring) {
        lastTabMonitoring = "Yet To Start"
      }
      await listStore.setHeaderChange(props.fromApprovalPageType ? "Closed" : lastTabMonitoring)
    } catch (error) {
      console.log(error)
    } finally {
      loading.value.close()
    }
  }
  expandingFormType.value = props.fromApprovalPageType
})

watch(() => {
  return listStore.stateSelectedHeader
}, () => {
  expandingFormType.value = ""
})

watch(() => {
  return authStore.user.SiteId
}, async (newVal) => {
  if (newVal) {
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading Monitoring Status List',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    try {
      let lastTabMonitoring = localStorage.getItem("monitoring-status-tab")
      if (!lastTabMonitoring) {
        lastTabMonitoring = "Yet To Start"
      }
      await listStore.setHeaderChange(props.fromApprovalPageType ? "Closed" : lastTabMonitoring)
    } catch (e) {
      console.log(e)
    } finally {
      loading.close()
    }
  }
})

onUnmounted(() => {
  listStore.resetList()
  if (loading.value) {
    loading.value.close()
  }
})
</script>
