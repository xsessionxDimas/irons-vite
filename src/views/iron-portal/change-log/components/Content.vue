<template>
  <div class="version-wrapper overflow-auto">
    <!-- pdf embed -->
  </div>
</template>

<script lang="ts" setup>
import { AxiosResponse } from 'axios'
import {
  defineProps,
  ref,
  onMounted,
  watch,
  toRef
} from 'vue'
import ApiService from '@/core/services/ApiService';

const props = defineProps({
  blobUrl: {
    type: String,
    required: true
  }
})

const pdfUrl = ref<string>('')
const isLoading = ref(true)
const blobUrl = toRef(props, "blobUrl")
const errorMessage = ref('')
const isError = ref(false)

const handleOnClick = (event) => {
  event.preventDefault()
}

const getPDF = async () => {
  pdfUrl.value = ""
  isLoading.value = true
  isError.value = false
  if (blobUrl.value) {
    const params = `ver=v1&fileUrl=${blobUrl.value}`
    try {
      const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_UTILITY}/api/master_attachment/download_by_url?${params}`
      const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL)
      const buffer = response.data;
      const blob = new Blob([buffer]);
      const urlCreator = window.URL || window.webkitURL
      pdfUrl.value = urlCreator.createObjectURL(blob)
    } catch (error) {
      console.log('error show pdf', error);
      isError.value = true
      if (blobUrl.value.includes('#')) {
        errorMessage.value = 'PDF not yet attached'
      } else {
        errorMessage.value = `${error}`
      }
    }
  }
  isLoading.value = false
}

onMounted(async () => {
  await getPDF()
})

watch([blobUrl.value], (newVal) => {
  if (newVal) {
    getPDF()
  }
})
watch(() => {
  return props.blobUrl
}, () => {
  getPDF()
});
</script>

<style scoped>
.log-title {
  font-size: 2.07143em;
  letter-spacing: -0.01em;
  line-height: 1.10345;
  font-weight: normal;
  margin-top: 0px;
  color: rgb(23, 43, 77);
}
.log-sub-title-panel {
  border-radius: 3px;
  padding: 8px;
  min-width: 48px;
  display: flex;
  position: relative;
  -webkit-box-align: baseline;
  align-items: baseline;
  word-break: break-word;
  background-color: var(--ds-background-accent-blue-subtlest, #DEEBFF);
  color: inherit;
}
.panel-icon {
  flex-shrink: 0;
  height: 24px;
  width: 24px;
  box-sizing: content-box;
  padding-right: 8px;
  text-align: center;
  user-select: none;
  color: var(--ds-icon-information, #0052CC);
}
.panel-content {
  margin: 1px 0px;
  flex: 1 0 0px;
  min-width: 0px;
}
.version-wrapper {
  width: 100%;
}
</style>

