<template>
  <div class="full-page d-flex overflow-hidden vh-100">
    <div style="width:300px; border-right:1px solid #ECECEC;">
      <div class="logo-wrapper d-flex align-items-center ms-1" @click="redirectToDashboard">
        <img style="cursor:pointer" src="/media/logos/logo-whitebg.png" alt="" class="h-40px logo" />
      </div>
      <Menu :data-menu="dataMenu"></Menu>
    </div>
    <div class="d-flex flex-fill p-10">
      <Content :blob-url="blobUrl"></Content>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Menu from './components/Menu.vue'
import Content from './components/Content.vue'
import navigator from '@/core/mixins/navigator'
import {
  computed,
  onBeforeMount,
  onUnmounted
} from 'vue'
import { ElLoading } from 'element-plus'
import {
  useVersionHistory
} from "@/store/pinia/iron-portal/version-history/useVersionHistory"

const { redirectByName } = navigator()
const store = useVersionHistory()

const dataMenu = computed(() => {
  return store.stateTreeData
})

const blobUrl = computed(() => {
  return store.selectedMenu.fileUrl
})

const redirectToDashboard = () => {
  redirectByName('ironportal')
}

onBeforeMount(async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading the page',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await store.getMenuVersionHistory()
  loading.close()
})

onUnmounted(() => {
  store.resetInstance()
})
</script>

<style scoped>
.button-wrapper-left {
  position: fixed;
  left: 0;
  bottom: 10px;
  width: 300px
}
</style>
