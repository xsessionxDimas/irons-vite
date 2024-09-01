<template>
  <el-dialog
    v-model='isVisible'
    title='Detailed picture'
    width='80%'
    @open="openFirst"
    @close='closeImagePreview'
    :custom-class="'e-form-font-family'"
  >
    <div class='row my-4'>
      <div v-for='(img, index) in imageArray' :key='img.filename' class='col-md-3 fv-row fv-plugins-icon-container p-2 rounded position-relative'>
        <el-skeleton :loading="loader[index]" animated>
          <template #template>
            <el-skeleton-item variant="image" class='w-100 rounded' style="height: 200px; object-fit: fill" />
          </template>
          <template #default>
            <div class="bg-secondary">
              <img
                :src="img.url"
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
    <template v-if="showMandatoryCaption">
      <div class="row mt-7 mb-0">
        <h5 style="font-size: 15px; font-weight: 900" class="font-weight-bold text-dark">Mandatory to keep at least one photo as an evidence.</h5>
      </div>
    </template>
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
  watch,
} from 'vue'
import { KeyValue } from '@/core/types/misc/KeyValue'
import { AxiosResponse } from 'axios'
import ApiService from '@/core/services/ApiService'
import { Image } from '@/core/types/intervention/Image'
import { ImageLoadParam } from '@/core/types/intervention/ImageLoadParam'
import { ImageFull } from "@/core/types/entities/dma/ImageInfo"

import FullScreenDialog from '@/components/camera/FullScreenDialog.vue'

import { clone } from 'lodash'
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter'

const props = defineProps({
  visibility: {
    type: Boolean,
    required: false,
  },
  images: {
    type: Array as PropType<any[]>,
    required: true
  },
  type: {
    type: String,
    required: false,
    default: 'cbm'
  },
  reRender: {
    type: Boolean,
    default: false
  },
  showMandatoryCaption: {
    type: Boolean,
    default: false
  },
})

const emits = defineEmits(['onClose', 'onDelete', 'onDownloaded'])

const keyValues = ref<KeyValue[]>([])
const isVisible = toRef(props, 'visibility')
const loader = ref<boolean[]>([])
const lastCount = ref(0)
const imageArray = ref<ImageFull[]>([]);
const imageArrayCopied = ref();

// Fullscreen Image
const selectedFullscreenImage = ref<string>("")
const showFullImage = ref(false)

/* methods */
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

      imageArray.value[index] = {
        ...imageArray.value[index],
        imgBlob: response.blob,
        url: getImageUrl(imageArray.value[index].filename)
      };

      loader.value[index] = false
    } catch (error) {
      console.log('image', error)
    }
  }
}

const closeImagePreview = () => {
  isVisible.value = false
  emits('onClose', null)
}

watch(() => {
  return props.reRender
}, async () => {
  await openFirst()
})

const openFirst = async () => {
  if (!props.images) return
  loader.value = Array.apply(null, Array(props.images.length)).map(function () {
    return true
  })
  lastCount.value = 0
  keyValues.value = []
  const images = clone(props.images)
  imageArray.value = stringToImageInfoConvert(props.images)
  const count = images.length
  for (let i = lastCount.value; i < count; i++) {
    const imageName = imageArray.value[i].filename
    await getImageFromBlobServer(imageName, i)
  }
  await getUrl();
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
const getImageUrl = (filename: string) => {
  const found = keyValues.value.find((k) => {
    return k.key == filename
  })
  return found?.value ?? ''
}
const handleShowFullScreen = (fileName) => {
  const index = imageArray.value.findIndex((item) => {
    return item.filename == fileName
  })

  const imageInfo = imageArray.value[index]
  if (index > 0) {
    const front = imageArray.value.slice(index)
    const back = imageArray.value.slice(0, index)
    imageArrayCopied.value = [...front, ...back]
  } else {
    imageArrayCopied.value = imageArray.value;
  }

  selectedFullscreenImage.value = imageInfo.url;
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
  .e-form-font-family {
    font-family: 'Public sans' !important;
}
</style>
