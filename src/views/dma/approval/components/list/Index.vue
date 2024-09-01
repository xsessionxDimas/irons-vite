<template>
  <ListItem />
</template>
<script lang="ts" setup>
import {
  useApprovalListStore
} from '@/store/pinia/dma/approval/useApprovalListStore';
import { ElLoading } from 'element-plus';
import { onBeforeMount, onUnmounted } from 'vue';
import ListItem from './ListItem.vue';

const listStore = useApprovalListStore()

onBeforeMount(async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading Approval List',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await listStore.getList()
  loading.close()
})

onUnmounted(() => {
  listStore.resetList()
})
</script>
