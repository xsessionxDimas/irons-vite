<template>
  <div class="row monitoring-status-footer mt-3" :class="showPrevButton && showNextButton ? 'justify-content-between' : showNextButton ? 'justify-content-end' : 'justify-content-start'">
    <template v-if="showPrevButton">
      <div class="col-1 button">
        <div class="row justify-content-start">
          <el-button type="success" @click="handleShowPrevPage" style="background-color: #18AF4A;">Previous</el-button>
        </div>
      </div>
    </template>
    <!-- <div class="col-10"></div> -->
    <template v-if="showNextButton">
      <div class="col-1 button">
        <div class="row justify-content-end">
          <el-button type="success" @click="handleShowNextPage" style="background-color: #18AF4A;">Next</el-button>
        </div>
      </div>
    </template>
  </div>
  </template>

<script lang="ts" setup>
import {
  usePreviewFormStore
} from '@/store/pinia/dma/preview-form/usePreviewFormStore';
import { ElLoading } from 'element-plus';
import { computed } from 'vue';

const previewStore = usePreviewFormStore()

const handleShowNextPage = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading the page',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await previewStore.setShowNextPage()
  window.scrollTo({ top: 0, behavior: 'smooth' })
  loading.close()
}

const handleShowPrevPage = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading the page',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await previewStore.setShowPrevPage()
  window.scrollTo({ top: 0, behavior: 'smooth' })
  loading.close()
}

const showNextButton = computed(() => {
  const currentGroup = previewStore.stateGroups.findIndex((group) => {
    return group.groupName == previewStore.stateSelectedGroup?.groupName
  })
  if ((currentGroup + 1) >= previewStore.groups.length) {
    return false
  }
  return true
})

const showPrevButton = computed(() => {
  const currentGroup = previewStore.stateGroups.findIndex((group) => {
    return group.groupName == previewStore.stateSelectedGroup?.groupName
  })
  if (currentGroup == 0) return false
  return true
})
</script>

  <style lang="scss">
  .monitoring-status-footer {
    .button {
      min-width: 75.7px;
    }
  }
  </style>

