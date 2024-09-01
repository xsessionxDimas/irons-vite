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
import {
  getReferenceDataFromLocalDB
} from '@/core/helpers/ironforms/offline/reference-file';
import ApiService from '@/core/services/ApiService';
import { db } from '@/database/schema/DexieSchema';
import { TaskReference } from '@/database/schema/TaskReferences';
import { useOnline } from '@vueuse/core';
import { AxiosResponse } from 'axios';
import { isEmpty } from 'lodash';
import {
  defineProps,
  defineEmits,
  onMounted,
  toRef,
  ref,
  watch
} from 'vue'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"

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
const online = useOnline()

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
    const urlCreator = window.URL || window.webkitURL
    try {
      isLoading.value = true
      const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_UTILITY}/api/master_attachment/download_by_url?${params}`
      if (!isOfflineOrSlowInternetConnection()) {
        let getNewImage = true
        const localAsset = await getReferenceDataFromLocalDB(props.blobUrl) as TaskReference
        if (!isEmpty(localAsset)) {
          if (localAsset.createdDate) {
            const currentDate = new Date()
            const createdDate = localAsset.createdDate
            const timeDiff = currentDate.getTime() - createdDate.getTime()
            const dayDiff = timeDiff / (1000 * 60 * 60 * 24)
            if (dayDiff < 1) {
              getNewImage = false
            }
          }
        }
        if (getNewImage) {
          const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL)
          const buffer = response.data;
          const blob = new Blob([buffer]);
          pdfUrl.value = urlCreator.createObjectURL(blob)
          // dump data to local DB
          const localImage = await db.taskReference.where({
            filename: props.blobUrl
          })
          if (localImage) {
            localImage.delete()
          }
          await db.taskReference.add({
            workorder: localAsset.workorder,
            filename: props.blobUrl,
            file: blob,
            fileType: "pdf",
            createdDate: new Date()
          })
        } else {
          await getPDFFromLocal(urlCreator)
        }
      } else {
        await getPDFFromLocal(urlCreator)
      }
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

const getPDFFromLocal = async (urlCreator) => {
  const localImage = await db.taskReference.where({
    filename: props.blobUrl
  }).first()
  if (localImage) {
    pdfUrl.value = urlCreator.createObjectURL(localImage.file)
  } else {
    isError.value = true
    errorMessage.value = 'Error Getting PDF on offline mode'
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

