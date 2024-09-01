<!-- eslint-disable no-undef -->
<template>
    <el-dialog
    v-model="isVisible"
    title="Preview"
    width="80%"
    custom-class="show-pdf"
    :close-on-click-modal="false"
    :close-on-press-escape = "false"
    @close="handleCloseModal()">
      <template v-if="isLoading">
        <div v-loading="isLoading" style="height: 100px"></div>
      </template>
      <template v-else>
        <template v-if="isError">
          <div class="row text-center my-10">
            <span class="text-danger">{{ errorMessage }}</span>
          </div>
        </template>
        <template v-else>
          <!-- button -->
          <div class="row justify-content-end pt-4 pe-10">
            <div class="div page-controller" style="margin-left: auto;">
              <button type="button" :disabled="page <= 1" @click="page--" class="btn btn-success btn-sm ok-button">❮</button>
                {{ page }} / {{ pageCount }}
              <button type="button" :disabled="page >= pageCount" @click="page++" class="btn btn-success btn-sm ok-button">❯</button>
            </div>
          </div>
          <!-- pdf embed -->

        </template>
      </template>
    </el-dialog>
  </template>

<script lang="ts" setup>
import ApiService from '@/core/services/ApiService';
import { AxiosResponse } from 'axios';
import {
  defineProps,
  defineEmits,
  onMounted,
  toRef,
  ref,
  watch
} from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  blobUrl: {
    type: String,
    required: true
  }
});
const emits = defineEmits(["handleCloseModal"]);
const pdfUrl = ref<string>('')
const page = ref(1)
const pageCount = ref(1)
const isLoading = ref(true)
const pdfRef = ref(null) as any
const errorMessage = ref('')
const isError = ref(false)

const isVisible = toRef(props, "show")

const handleDocumentRender = () => {
  isLoading.value = false
  pageCount.value = pdfRef.value.pageCount
}

const handleOnClick = (event) => {
  event.preventDefault()
}

const getPDF = async () => {
  isError.value = false
  pdfUrl.value = ''
  page.value = 1
  pageCount.value = 1
  if (props.blobUrl != '') {
    const params = `ver=v1&fileUrl=${props.blobUrl}`
    try {
      isLoading.value = true
      const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_UTILITY}/api/master_attachment/download_by_url?${params}`
      const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL)
      const buffer = response.data;
      const blob = new Blob([buffer]);
      const urlCreator = window.URL || window.webkitURL
      pdfUrl.value = urlCreator.createObjectURL(blob)
    } catch (error) {
      console.log('error show pdf', error);
      isError.value = true
      if (props.blobUrl.includes('#')) {
        errorMessage.value = 'PDF not yet attached'
      } else {
        errorMessage.value = `${error}`
      }
    } finally {
      isLoading.value = false
    }
  }
}

onMounted(async () => {
  await getPDF()
})

watch(isVisible, (newVal) => {
  if (newVal) {
    getPDF()
  }
}, { deep: true })

const handleCloseModal = () => {
  emits("handleCloseModal")
}
</script>

  <style lang="scss">
    .ok-button {
      background-color: #18AF4A;
    }
    .page-controller {
      width: -moz-max-content; /* Firefox */
      width: -webkit-max-content; /* Chrome */
      width: max-content;
    }

    .el-dialog {
      &.show-pdf {
        .el-dialog__title {
          color: white!important;;
        }
      }
    }
  </style>

