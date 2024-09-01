<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <el-dialog
    v-model='isVisible'
    title='Detailed picture'
    width='80%'
    @open="openFirst"
    @close='closeImagePreview'
  >
    <div class='row my-4'>
      <el-empty v-if="!images || images.length === 0">
      <template #image>
        <inline-svg src="/media/icons/bootstrap-icon/card-image.svg" width="30" height="30" />
      </template>
      <template #description>
        <span>No Picture.</span>
      </template>
      </el-empty>
      <div v-else v-for='(img, index) in imageArray' :key='img.filename' class='col-md-3 fv-row fv-plugins-icon-container p-2 rounded position-relative'>
        <el-skeleton :loading="loader[index]" animated>
          <template #template>
            <el-skeleton-item variant="image" class='w-100 rounded' style="height: 200px; object-fit: fill" />
          </template>
          <template #default>
            <div class="bg-secondary">
              <img
                :src="getImageUrl(img.filename)"
                class='w-100 rounded'
                style='height: 200px; object-fit: contain'
                @click="handleShowFullScreen(img.filename)"
                alt="images"
              />
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>
  </el-dialog>
  <FullScreenDialog
    :images="imageArray"
    :visibility="showFullImage"
    :image="selectedFullscreenImage"
    @handle-close="closeFullScreenImage"/>
</template>

<script lang='ts' setup>
import {
  toRef,
  defineProps,
  defineEmits,
  PropType,
  ref,
} from 'vue'
import { KeyValue } from '@/core/types/misc/KeyValue'
import { AxiosResponse } from 'axios'
import ApiService from '@/core/services/ApiService'
import { Image } from '@/core/types/intervention/Image'
import { ImageLoadParam } from '@/core/types/intervention/ImageLoadParam'
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo'
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter'
import FullScreenDialog from '@/components/camera/FullScreenDialog.vue'

const props = defineProps({
  visibility: {
    type: Boolean,
    required: false,
  },
  images: {
    type: Array as PropType<string[]>,
    required: true
  },
  type: {
    type: String,
    required: true,
    default: 'cbm'
  },
  loadingData: {
    type: Boolean,
    default: true
  },
})

const emits = defineEmits(['onClose', 'onDelete', 'onDownloaded'])

const keyValues = ref<KeyValue[]>([])
const isVisible = toRef(props, 'visibility')
const loader = ref<boolean[]>([])
const lastCount = ref(0)
const imageArray = ref<ImageInfo[]>([])

// Fullscreen Image
const selectedFullscreenImage = ref<string>("")
const showFullImage = ref(false)

const getImageUrl = (filename: string) => {
  if (keyValues.value.length < 1) return undefined
  let value: string | undefined = undefined
  do {
    value = keyValues.value.find((k) => {
      return k.key == filename
    })?.value
  } while (!value)
  return value
}

const closeImagePreview = () => {
  isVisible.value = false
  emits('onClose', null)
}

const openFirst = async () => {
  if (!props.images) return
  loader.value = Array.apply(null, Array(props.images.length)).map(function () {
    return true
  })
  lastCount.value = 0
  keyValues.value = []
  const images = JSON.parse(props.images)
  imageArray.value = stringToImageInfoConvert(images)
  const count = images.length
  for (let i = lastCount.value; i < count; i++) {
    const imageName = imageArray.value[i].filename
    await getImageFromBlobServer(imageName, i)
  }
  await getUrl();
}

const getUrl = async () => {
  if (imageArray.value.length < 1) return
  for (const [index, info] of imageArray.value.entries()) {
    const params = {
      fileUrl: `${info.filename}`,
      ver: 'v1',
    }
    try {
      const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/attachment/download_by_url?${new URLSearchParams(params).toString()}`
      const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL)
      const buffer = response.data
      const blob = new Blob([buffer])
      const urlCreator = window.URL || window.webkitURL
      const url = urlCreator.createObjectURL(blob)
      keyValues.value.push({
        key: info.filename,
        value: url
      })
      loader.value[index] = false
    } catch (error) {
      console.log('image', error)
    }
  }
}

const getImageFromBlobServer = async (filename: string, index: number) => {
  const params = {
    fileUrl: filename,
    ver: 'v1',
  }
  try {
    const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/attachment/download_by_url?${new URLSearchParams(params).toString()}`
    const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL)
    const buffer = response.data
    const blob = new Blob([buffer])
    const image = {} as Image
    image.filename = filename
    image.blob = blob
    image.type = props.type
    const param = {} as ImageLoadParam
    param.image = image
    param.index = index,
    param.length = props.images.length
    emits('onDownloaded', param)
    window.setTimeout(async () => {
      let URL = window.URL || window.webkitURL
      keyValues.value.push({
        key: filename,
        value: URL.createObjectURL(blob)
      })
      loader.value[index] = false
    }, 1000)
  } catch (error) {
    console.log('image', error)
  }
}
const handleShowFullScreen = (image) => {
  selectedFullscreenImage.value = image;
  showFullImage.value = true
}
const closeFullScreenImage = () => {
  selectedFullscreenImage.value = ""
  showFullImage.value = false
}
</script>

<style lang='scss'>
  .delete-image-button {
    position: absolute;
    height: 24px;
    width: 24px;
    top: 5%;
    right: 5%;

    :hover {
      cursor: pointer;
    }
  }
</style>
