<template>
  <el-dialog
    v-model='isVisible'
    title='Detailed picture of Cab Side & Off Cab Side'
    :width="dialogWidth"
    @opened="openFirst"
    @close='closeImagePreview'>
    <template #title>
      <span class="el-dialog__title" style="word-break: break-word !important; font-size: 18px !important;">Detailed picture of Cab Side & Off Cab Side</span>
    </template>
    <div class="row d-flex flex-column">
      <template v-if="frontPage">
        <div class="photo-wrapper">
          <span class="sub-title"><strong>Cab Side</strong></span>
          <!-- always show the front first -->
          <el-skeleton :loading="loaderFront" animated>
            <template #template>
              <el-skeleton-item variant="image" class='w-100 rounded' style="height: 450px; width: auto" />
            </template>
            <template #default>
              <div class="my-2"
                style="object-fit: contain; cursor: pointer; text-align: center;">
                <div class="d-flex justify-content-center">
                  <div style="position: relative;width: fit-content;">
                    <template v-if="!viewOnly">
                      <NwImg  @click='onDeleteImage(frontPage)' class='delete-image-button' src='/media/svg/dma/image-close-button-red.png' />
                    </template>
                    <img :src="getImageUrl(frontPage.filename)"
                    style="height: auto; max-width: 700px; max-height: 300px;"
                    alt="images"
                    @click="showFullScreen(frontPage.filename)"
                    class="front"
                    v-if="getImageUrl(frontPage.filename) != undefined" />
                  </div>
                </div>
              </div>
            </template>
          </el-skeleton>
        </div>
      </template>
      <div class="my-2"></div>
      <template v-if="backPage">
        <div class="photo-wrapper">
        <span class="sub-title"><strong>Off Cab Side</strong></span>
        <el-skeleton :loading="loaderBack" animated>
          <template #template>
            <el-skeleton-item variant="image" class='w-100 rounded' style="height: 450px; width: auto;" />
          </template>
          <template #default>
            <div class="my-2"
              style="object-fit: contain; cursor: pointer; text-align: center; position: relative">
              <div class="d-flex justify-content-center">
                <div style="position: relative;width: fit-content;">
                  <template v-if="!viewOnly">
                    <NwImg  @click='onDeleteImage(backPage)' class='delete-image-button' src='/media/svg/dma/image-close-button-red.png' />
                  </template>
                  <img :src="getImageUrl(backPage.filename)"
                  style="height: auto; max-width: 700px; max-height: 300px;"
                  alt="images"
                  class="back"
                  @click="showFullScreen(backPage.filename)"
                  v-if="getImageUrl(backPage.filename) != undefined" />
                </div>
              </div>
            </div>
          </template>
        </el-skeleton>
      </div>
      </template>
    </div>
  </el-dialog>
  <Confirmation :visibility='isConfirmVisible' caption='Are you sure want to delete this image?'
    @on-no-confirm='cancelDelete'
    @on-yes-confirm='confirmDelete' />
  <FullScreenDialog :images="imageFull"
    :visibility="showFullImage"
    :image="selectedFullscreenImage"
    @handle-close="closeFullScreen"/>
</template>

<script lang='ts' setup>
import {
  toRef,
  defineProps,
  defineEmits,
  defineExpose,
  PropType,
  ref,
  computed
} from 'vue'
import { KeyValue } from '@/core/types/misc/KeyValue'
import Confirmation from '@/components/dialog/Confirmation.vue'
import { AxiosResponse } from 'axios'
import ApiService from '@/core/services/ApiService'
import { ImageFull, ImageInfo } from '@/core/types/entities/dma/ImageInfo'
import FullScreenDialog from '@/components/camera/FullScreenDialog.vue'
import { useMediaQuery } from '@vueuse/core'
import { db } from '@/database/schema/DexieSchema'
import { isUndefined } from 'lodash'
import {
  useOfflineCameraStore
} from '@/store/pinia/application/useOfflineCameraStore'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import { AESTShortCurrentDateTime } from '@/core/helpers/date-format'
import { addRecord } from '@/database/schema/DatabaseWrapper'

const props = defineProps({
  visibility: {
    type: Boolean,
    required: false,
  },
  images: {
    type: Array as PropType<ImageInfo[]>,
    required: true
  },
  viewOnly: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['onClose', 'onDelete'])

const keyValues = ref<KeyValue[]>([])
const isVisible = toRef(props, 'visibility')
const lastCount = ref(0)
const loaderFront = ref(false)
const loaderBack = ref(false)
const isLargeScreen = useMediaQuery('(min-width: 1000px)')
const showFullImage = ref(false)
const selectedFullscreenImage = ref<string>('')
const isConfirmVisible = ref(false)
const selectedImage = ref<ImageInfo>()
const frontPage = ref<ImageInfo>()
const backPage = ref<ImageInfo>()
const imageFull = ref<ImageFull[]>([])
const camStore = useOfflineCameraStore()


const dialogWidth = computed(() => {
  return isLargeScreen.value ? "70%" : "90%"
})

const loadFrontPage = async () => {
  frontPage.value = props.images.find((x) => {
    return x.type == 'cab side'
  })
  if (!frontPage.value) {
    frontPage.value = props.images.find((x) => {
      return !x.type
    })
  }
  if (frontPage.value) {
    await downloadFrontPage(frontPage.value.filename)
  }
}

const loadBackPage = async () => {
  backPage.value = props.images.find((x) => {
    return x.type == 'off cab side'
  })
  if (!backPage.value && props.images.length > 0) {
    backPage.value = props.images.find((x) => {
      return x.filename != frontPage.value?.filename
    })
  }
  if (backPage.value) {
    await downloadBackPage(backPage.value.filename)
  }
}
const getImageUrl = (filename: string) => {
  if (keyValues.value.length < 1) return undefined
  let value: string | undefined = undefined
  value = keyValues.value.find((k) => {
    return k.key == filename
  })?.value
  return value
}
const closeImagePreview = () => {
  isVisible.value = false
  emits('onClose', null)
}

const imagesObject = (() => {
  imageFull.value = props.images.map((img) => {
    return {
      imgBlob: img.filename,
      url: '',
      description: img.description
    }
  })
})

const openFirst = () => {
  imagesObject()
  lastCount.value = 0
  keyValues.value = []
  if (!props.images) return
  loadFrontPage()
  loadBackPage()
}
const downloadFrontPage = async (filename: string) => {
  loaderFront.value = true
  await getImageFromBlobServer(filename)
  loaderFront.value = false
}
const downloadBackPage = async (filename: string) => {
  loaderBack.value = true
  await getImageFromBlobServer(filename)
  loaderBack.value = false
}
const getImageFromBlobServer = async (filaname: string) => {
  const params = {
    fileUrl: filaname,
    ver: 'v1',
  }
  try {
    let fileUrl = ''
    const image = await db.pendingTaskFile.where({
      filename: filaname
    }).first()
    const urlCreator = window.URL || window.webkitURL
    if (!image && !isOfflineOrSlowInternetConnection()) {
      const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/attachment/download_by_url?${new URLSearchParams(params).toString()}`
      const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL)
      const blob = new Blob([response.data])
      fileUrl = URL.createObjectURL(blob)
      await addRecord(db, 'pendingTaskFile', {
        key: camStore.stateDumpToLocalInfo.taskKey,
        module: 'serviceForm',
        workorder: camStore.stateDumpToLocalInfo.workOrder,
        type: camStore.stateDumpToLocalInfo.type,
        createdBy: camStore.stateDumpToLocalInfo.updatedBy,
        email: camStore.stateDumpToLocalInfo.email,
        filename: filaname,
        blob: blob,
        status: 'Sync',
        syncDate: AESTShortCurrentDateTime()
      })
    } else if (isUndefined(image)) {
      fileUrl = ""
    } else {
      fileUrl = urlCreator.createObjectURL(image.blob)
    }
    keyValues.value.push({
      key: filaname,
      value: fileUrl
    })
    imageFull.value.forEach((img) => {
      if (img.imgBlob == filaname) {
        img.url = fileUrl
      }
    })
  } catch (error) {
    console.log('image', error)
  }
}
const showFullScreen = (image: string) => {
  const index = imageFull.value.findIndex((item) => {
    return item.imgBlob == image
  })
  const imageInfo = imageFull.value[index]
  if (index > 0) {
    const front = imageFull.value.slice(index)
    const back = imageFull.value.slice(0, index)
    imageFull.value = [...front, ...back]
  }
  selectedFullscreenImage.value = imageInfo.url
  showFullImage.value = true
}
const closeFullScreen = () => {
  selectedFullscreenImage.value = ''
  showFullImage.value = false
}
const onDeleteImage = (data: ImageInfo) => {
  isConfirmVisible.value = true
  selectedImage.value = data
}
const cancelDelete = () => {
  isConfirmVisible.value = false
}
const confirmDelete = () => {
  if (!selectedImage.value) return
  const param = {
    filename: selectedImage.value.filename,
    type: selectedImage.value.type
  }
  emits('onDelete', param)
  if (selectedImage.value.type == 'front') {
    frontPage.value = undefined
  } else {
    backPage.value = undefined
  }
  selectedImage.value = undefined
  isConfirmVisible.value = false
}

const openFirstReRender = () => {
  openFirst()
}

defineExpose({
  openFirstReRender
})
</script>

<style scoped>
.sub-title {
  color: black;
  font-size: 13px;
}
.timestampp {
  text-align: right;
  margin-top: 5px;
}
.delete-image-button {
  position: absolute;
  top: 4%;
  right: 4%;
  height: 24px;
  width: 24px;
  :hover {
    cursor: pointer;
  }
}
</style>
