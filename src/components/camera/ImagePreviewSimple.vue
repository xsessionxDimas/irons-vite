<template>
  <el-dialog
    v-model='isVisible'
    title='Detailed picture'
    width='80%'
    @opened="openFirst"
    @open="openFirst"
    @close='closeImagePreview'>
    <div class='row my-4'>
      <div v-for='(img, index) in imageInfos' :key='img.filename' class='col-md-3 fv-row fv-plugins-icon-container p-2 rounded position-relative'>
        <el-skeleton :loading="loader[index]" animated>
          <template #template>
            <el-skeleton-item variant="image" class='w-100 rounded' style="height: 200px; object-fit: fill" />
          </template>
          <template #default>
            <div class="bg-secondary">
              <img :src="getImageUrl(img.filename)"
              class='w-100 rounded'
              style="height: 200px; object-fit: contain; cursor: pointer"
              alt="images"
              v-if="getImageUrl(img.filename) != undefined"
              @click="handleShowFullScreen(img.filename)" />
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>
  </el-dialog>
  <FullScreenDialog
    :images="imageFull"
    :visibility="showFullImage"
    :new-version="true"
    :image="selectedFullscreenImage"
    @handle-close="closeFullScreenImage"/>
</template>

<script lang='ts' setup>
import {
  toRef,
  defineProps,
  defineEmits,
  PropType,
  ref
} from 'vue'
import { KeyValue } from '@/core/types/misc/KeyValue'
import { AxiosResponse } from 'axios'
import ApiService from '@/core/services/ApiService'
import FullScreenDialog from '@/components/camera/FullScreenDialog.vue'
import { ImageInfo, ImageFull } from '@/core/types/entities/dma/ImageInfo'
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter'

const props = defineProps({
  visibility: {
    type: Boolean,
    required: false,
  },
  images: {
    type: Array as PropType<string[]|ImageInfo[]>,
    required: true
  }
})

const emits = defineEmits(['onClose', 'onDelete', 'onDownloaded'])

const keyValues = ref<KeyValue[]>([])
const isVisible = toRef(props, 'visibility')
const lastCount = ref(0)
const loader = ref<boolean[]>([])
const imageInfos = ref<ImageInfo[]>([])
const imageFull = ref<ImageFull[]>([])

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

const imagesObject = (() => {
  if (!props.images) return
  imageFull.value = stringToImageInfoConvert(props.images).map((img) => {
    return {
      imgBlob: img.filename,
      url: '',
      description: img.description
    }
  })
})

const openFirst = async () => {
  imagesObject()
  lastCount.value = 0
  keyValues.value = []
  if (!props.images) return
  imageInfos.value = stringToImageInfoConvert(props.images)
  loader.value = Array.apply(null, Array(props.images.length)).map(function () {
    return true
  })
  const count = imageInfos.value.length
  for (let i = lastCount.value; i < count; i++) {
    const imageName = imageInfos.value[i].filename
    await getImageFromBlobServer(imageName, i)
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
    const blob = new Blob([response.data])
    let URL = window.URL || window.webkitURL
    keyValues.value.push({
      key: filename,
      value: URL.createObjectURL(blob)
    })
    imageFull.value.forEach((img) => {
      if (img.imgBlob == filename) {
        img.url = URL.createObjectURL(blob)
      }
    })
    loader.value[index] = false
  } catch (error) {
    console.log('image', error)
  }
}
const handleShowFullScreen = (image: string) => {
  const index = imageFull.value.findIndex((item) => {
    return item.imgBlob == image
  })
  if (index > 0) {
    const front = imageFull.value.slice(index)
    const back = imageFull.value.slice(0, index)
    imageFull.value = [...front, ...back]
  }
  selectedFullscreenImage.value = image;
  showFullImage.value = true
}
const closeFullScreenImage = () => {
  selectedFullscreenImage.value = ""
  showFullImage.value = false
}
</script>
