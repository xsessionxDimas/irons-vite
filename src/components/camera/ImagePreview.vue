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
              <template v-if="deleteButtonVisibility">
                <NwImg  @click='onDeleteImage(img.filename)' class='delete-image-button' src='/media/svg/dma/image-close-button-red.png' />
              </template>
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
  <Confirmation :visibility='isConfirmVisible' caption='Are you sure want to delete this image?'
    @on-no-confirm='cancelDelete'
    @on-yes-confirm='confirmDelete' />
  <FullScreenDialog
    :images="imageFull"
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
  computed
} from 'vue'
import { db } from '@/database/schema/DexieSchema'
import { KeyValue } from '@/core/types/misc/KeyValue'
import Confirmation from '@/components/dialog/Confirmation.vue'
import { AxiosResponse } from 'axios'
import ApiService from '@/core/services/ApiService'
import { Image } from '@/core/types/intervention/Image'
import { ImageLoadParam } from '@/core/types/intervention/ImageLoadParam'
import { cloneDeep } from 'lodash'
import FullScreenDialog from '@/components/camera/FullScreenDialog.vue'
import { ImageFull, ImageInfo } from '@/core/types/entities/dma/ImageInfo'
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter'

const props = defineProps({
  visibility: {
    type: Boolean,
    required: false,
  },
  index: {
    required: false,
    type: Number,
    default: -1
  },
  images: {
    type: Array as PropType<string[]|ImageInfo[]>,
    required: true
  },
  showDeleteButton: {
    type: Boolean,
    required: true,
    default: true
  },
  type: {
    type: String,
    required: true
  },
  reRender: {
    type: Boolean,
    default: false
  },
  showMandatoryCaption: {
    type: Boolean,
    default: false
  },
  isMonitoring: {
    type: Boolean,
    default: false
  },
  isMandatory: {
    required: false,
    type: Boolean,
    default: true
  },
  oldVersion: {
    required: false,
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['onClose', 'onDelete', 'onDownloaded'])

const keyValues = ref<KeyValue[]>([])
const isVisible = toRef(props, 'visibility')
const isConfirmVisible = ref(false)
const selectedImage = ref('')
const lastCount = ref(0)
const loader = ref<boolean[]>([])
const imageInfos = ref<ImageInfo[]>([])
const imageFull = ref<ImageFull[]>([])

const selectedFullscreenImage = ref<string>("")
const showFullImage = ref(false)

const deleteButtonVisibility = computed(() => {
  let isVisible = false
  if (props.showDeleteButton) {
    isVisible = true
  }
  if (props.isMonitoring) {
    isVisible = false
  }
  return isVisible
})

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

watch(() => {
  return props.reRender
}, async () => {
  await openFirst()
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
    const image = await db.pendingTaskFile.where({
      filename: imageName
    }).first()
    try {
      if (!image) {
        await getImageFromBlobServer(imageName, i)
      } else {
        const clone = cloneDeep(image)
        let URL = window.URL || window.webkitURL
        keyValues.value.push({
          key: imageName,
          value: URL.createObjectURL(clone.blob)
        })
        loader.value[i] = false
        imageFull.value.forEach((img) => {
          if (img.imgBlob == imageName) {
            img.url = URL.createObjectURL(clone.blob)
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}

const imagesObject = (() => {
  const imgsProps = stringToImageInfoConvert(props.images)
  imageFull.value = imgsProps?.map((img) => {
    return {
      imgBlob: img.filename,
      url: '',
      description: img.description
    }
  })
})

const getImageFromBlobServer = async (filaname: string, index: number) => {
  const params = {
    fileUrl: filaname,
    ver: 'v1',
  }
  try {
    const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/attachment/download_by_url?${new URLSearchParams(params).toString()}`
    const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL)
    if (props.isMonitoring) {
      const blob = new Blob([response.data])
      let URL = window.URL || window.webkitURL
      keyValues.value.push({
        key: filaname,
        value: URL.createObjectURL(blob)
      })
      imageFull.value.forEach((img) => {
        if (img.imgBlob == filaname) {
          img.url = URL.createObjectURL(blob)
        }
      })
      loader.value[index] = false
    } else {
      const buffer = response.data
      const blob = new Blob([buffer])
      const image = {} as Image
      image.filename = filaname
      image.blob = blob
      image.type = props.type
      const param = {} as ImageLoadParam
      param.image = image
      param.index = index
      param.length = props.images.length
      emits('onDownloaded', param)
      window.setTimeout(async () => {
        let URL = window.URL || window.webkitURL
        keyValues.value.push({
          key: filaname,
          value: URL.createObjectURL(blob)
        })
        imageFull.value.forEach((img) => {
          if (img.imgBlob == filaname) {
            img.url = URL.createObjectURL(blob)
          }
        })
        loader.value[index] = false
      }, 1000)
    }
  } catch (error) {
    console.log('image', error)
  }
}
const handleShowFullScreen = (image: string) => {
  const index = imageFull.value.findIndex((item) => {
    return item.imgBlob == image
  })
  const imageInfo = imageFull.value[index]
  if (index > 0) {
    const front = imageFull.value.slice(index)
    const back = imageFull.value.slice(0, index)
    imageFull.value = [...front, ...back]
  }
  selectedFullscreenImage.value = imageInfo.url;
  showFullImage.value = true
}
const closeFullScreenImage = () => {
  selectedFullscreenImage.value = ""
  showFullImage.value = false
}
const onDeleteImage = (filename: string) => {
  isConfirmVisible.value = true
  selectedImage.value = filename
}
const cancelDelete = () => {
  isConfirmVisible.value = false
}
const confirmDelete = () => {
  isConfirmVisible.value = false
  keyValues.value = keyValues.value.filter((kv) => {
    return kv.key != selectedImage.value
  })
  imageInfos.value = imageInfos.value.filter((v) => {
    return v.filename != selectedImage.value
  })
  if (props.index >= 0) {
    emits('onDelete', {
      index: props.index,
      filename: selectedImage.value
    })
  } else {
    emits('onDelete', selectedImage.value)
  }
  selectedImage.value = ''
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
