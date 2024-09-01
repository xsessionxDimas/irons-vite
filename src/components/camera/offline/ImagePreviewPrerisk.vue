<template>
  <el-dialog
    v-model='isVisible'
    title='Detailed picture of Pre-Task Risk Assessment Form'
    :width="dialogWidth"
    @opened="openFirst"
    @close='closeImagePreview'>
    <template #title>
      <span class="el-dialog__title" style="word-break: break-word !important; font-size: 18px !important;">Detailed picture of Pre-Task Risk Assessment Form</span>
    </template>
    <div class="row d-flex flex-column">
      <template v-if="frontPage">
        <div class="photo-wrapper">
          <span class="sub-title"><strong>Front Page</strong></span>
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
                    <img :src="getImageUrl((frontPage.image as ImageInfo).filename)"
                    style="height: auto; max-width: 700px; max-height: 300px;"
                    alt="images"
                    @click="showFullScreen((frontPage.image as ImageInfo).filename)"
                    class="front"
                    v-if="getImageUrl((frontPage.image as ImageInfo).filename) != undefined" />
                  </div>
                </div>
                <div class="timestampp">{{  getTimestamp(frontPage) }}</div>
              </div>
            </template>
          </el-skeleton>
        </div>
      </template>
      <div class="my-2"></div>
      <template v-if="backPage">
        <div class="photo-wrapper">
        <span class="sub-title"><strong>Back Page</strong></span>
        <!-- always show the front first -->
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
                  <img :src="getImageUrl((backPage.image as ImageInfo).filename)"
                  style="height: auto; max-width: 700px; max-height: 300px;"
                  alt="images"
                  class="back"
                  @click="showFullScreen((backPage.image as ImageInfo).filename)"
                  v-if="getImageUrl((backPage.image as ImageInfo).filename) != undefined" />
                </div>
              </div>
              <div class="timestampp">{{  getTimestamp(backPage) }}</div>
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
  <FullScreenDialog
    :images="imageFull"
    :visibility="showFullImage"
    :new-version="true"
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
import { ImageFull, ImageInfo } from '@/core/types/entities/dma/ImageInfo'
import {
  RiskAssesmentValue
} from '@/core/types/entities/dma/RiskAssesmentValue'
import FullScreenDialog from '@/components/camera/FullScreenDialog.vue'
import { useMediaQuery, useOnline } from '@vueuse/core'
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter'
import {
  getImageFromAPI,
  getImageUrlFromLocalDB,
  handleReplaceImageToLocalDB
} from '@/core/helpers/ironforms/offline/image-file'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"

const props = defineProps({
  visibility: {
    type: Boolean,
    required: false,
  },
  images: {
    type: Array as PropType<RiskAssesmentValue[]>,
    required: true
  },
  viewOnly: {
    type: Boolean,
    default: true
  },
  workOrder: {
    type: String,
    default: ""
  },
  employeeId: {
    type: String,
    default: ""
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
const selectedImage = ref<RiskAssesmentValue>()
const frontPage = ref<RiskAssesmentValue>()
const backPage = ref<RiskAssesmentValue>()
const imageFull = ref<ImageFull[]>([])

const online = useOnline()

const dialogWidth = computed(() => {
  return isLargeScreen.value ? "70%" : "90%"
})

const loadFrontPage = async () => {
  frontPage.value = props.images.find((x) => {
    return x.imageType == 'front'
  })
  if (!frontPage.value) {
    frontPage.value = props.images.find((x) => {
      return !x.imageType
    })
  }
  if (frontPage.value) {
    await downloadFrontPage(typeof frontPage.value.image == 'string' ? frontPage.value.image : frontPage.value.image.filename)
  }
}

const loadBackPage = async () => {
  backPage.value = props.images.find((x) => {
    return x.imageType == 'back'
  })
  if (!backPage.value && props.images.length > 0) {
    backPage.value = props.images.find((x) => {
      return (x.image as ImageInfo).filename != (frontPage.value?.image as ImageInfo).filename
    })
  }
  if (backPage.value) {
    await downloadBackPage(typeof backPage.value.image == 'string' ? backPage.value.image : backPage.value.image.filename)
  }
}
const getTimestamp = (risk: RiskAssesmentValue) => {
  return `${risk.updatedBy.name}, ${risk.updatedDate}`
}
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
  const raw = props.images.map((p) => {
    return p.image
  })
  imageFull.value = stringToImageInfoConvert(raw as any[]).map((img) => {
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
    const urlCreator = window.URL || window.webkitURL
    let url = ""
    if (!isOfflineOrSlowInternetConnection()) {
      const blob = await getImageFromAPI(filaname)
      url = urlCreator.createObjectURL(blob)
      // dump image
      handleReplaceImageToLocalDB(
        filaname,
        props.workOrder,
        blob,
        "PreRisk",
        'task',
        props.employeeId
      )
    } else {
      url = await getImageUrlFromLocalDB(filaname)
    }
    keyValues.value.push({
      key: filaname,
      value: url
    })
    imageFull.value.forEach((img) => {
      if (img.imgBlob == filaname) {
        img.url = url
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
  selectedFullscreenImage.value = imageInfo.url;
  showFullImage.value = true
}
const closeFullScreen = () => {
  selectedFullscreenImage.value = ''
  showFullImage.value = false
}
const onDeleteImage = (data: RiskAssesmentValue) => {
  isConfirmVisible.value = true
  selectedImage.value = data
}
const cancelDelete = () => {
  isConfirmVisible.value = false
}
const confirmDelete = () => {
  if (!selectedImage.value) return
  emits('onDelete', typeof selectedImage.value.image == 'string' ? selectedImage.value.image : selectedImage.value.image.filename)
  if (selectedImage.value.imageType == 'front') {
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
