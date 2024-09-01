<template>
    <el-dialog v-model="dialogVisible"
    :custom-class="'crackform dialog-header-noborder e-form-font-family'"
    width="90%" center
    @closed="onFormClosed"
    @opened="onFormOpened"
    :destroy-on-close="true">
      <template #title>
        <span class="el-dialog__title" style="text-align: start"></span>
      </template>
      <div>
        <div class="ps-3" v-loading="isLoading">
            <h3>Detailed Information</h3>
            <div class="d-flex flex-row justify-content-between">
              <!--v-if-->
              <div class="col-1 text-center px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-left: 1px solid rgba(145, 158, 171, 0.24);">
                <label style="">No</label>
              </div>
              <div class="col text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
                <label style="">Measurement Location</label>
              </div>
              <div class="col-2 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
                <label style="">Measurement Value</label>
              </div>
              <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
                <label style="">UoM</label>
              </div>
              <div class="col-2 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-right: 1px solid rgba(145, 158, 171, 0.24);">
                <label style="">Rating</label>
              </div>
            </div>
            <div class="d-flex flex-row justify-content-between">
              <div class="col-1 text-center px-2 py-2" style="background-color: rgb(249, 250, 251); border-bottom: 1px solid rgba(145, 158, 171, 0.24); border-left: 1px solid rgba(145, 158, 171, 0.24);">
                <label style="">{{ taskNo }}</label>
              </div>
              <div class="col text-start px-2 py-2" style="border-bottom: 1px solid rgba(145, 158, 171, 0.24);">
                <label style="" v-html="data.taskDesc.split(';').length > 3 ? data.taskDesc?.split(';')[2] : data.taskDesc"></label>
              </div>
              <div class="col-2 text-start px-2 py-2" style="border-bottom: 1px solid rgba(145, 158, 171, 0.24);">
                <el-input class="dark-text-primary" size="small" v-model="data.cbmMeasurement" :disabled="true" />
              </div>
              <div class="col-1 text-start px-2 py-2" style="border-bottom: 1px solid rgba(145, 158, 171, 0.24);">
                <label style="">{{ ratingFormula[0]?.uom ||  data?.cbmUom }}</label>
              </div>
              <div class="col-2 text-start px-2 py-2" style="border-bottom: 1px solid rgba(145, 158, 171, 0.24); border-right: 1px solid rgba(145, 158, 171, 0.24);">
                <el-input size="small" class="dark-text-primary" v-model="data.taskValue" :class="data.taskValue === 'C' ? 'c' : 'x'" :disabled="true" />
              </div>
            </div>

            <h3 class="mt-3">Detail Spec</h3>
            <table class="table table-bordered" style="width:500px">
              <thead>
                <tr style="background:#70AD47">
                  <th scope="col" class="table-header" style="border-right:1px solid white">Rating</th>
                  <th scope="col" class="table-header" style="border-right:1px solid white">Value Min</th>
                  <th scope="col" class="table-header" style="border-right:1px solid white">Value Max</th>
                  <th scope="col" class="table-header">UoM</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in detailSpec" :key="index">
                  <tr :class="(index % 2 == 0) ? 'even' : 'odd'">
                    <th scope="row" style="border-right:1px solid white; padding-left:10px">{{ item.cbmRating }}</th>
                    <th scope="row" style="border-right:1px solid white">{{ item.minValue }}</th>
                    <th scope="row" style="border-right:1px solid white">{{ item.maxValue }}</th>
                    <th scope="row">{{ item.uom }}</th>
                  </tr>
                </template>
              </tbody>
            </table>

            <h3 class="mt-3" v-if="detailSpecGap.length > 0">Detail Spec Gap</h3>
            <table v-if="detailSpecGap.length > 0" class="table table-bordered" style="width:500px">
              <thead>
                <tr style="background:#70AD47">
                  <th scope="col" class="table-header" style="border-right:1px solid white">Rating</th>
                  <th scope="col" class="table-header" style="border-right:1px solid white">Value Min</th>
                  <th scope="col" class="table-header" style="border-right:1px solid white">Value Max</th>
                  <th scope="col" class="table-header">UoM</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in detailSpecGap" :key="index">
                  <tr :class="(index % 2 == 0) ? 'even' : 'odd'">
                    <th scope="row" style="border-right:1px solid white; padding-left:10px">{{ item.cbmRating }}</th>
                    <th scope="row" style="border-right:1px solid white">{{ item.minValue }}</th>
                    <th scope="row" style="border-right:1px solid white">{{ item.maxValue }}</th>
                    <th scope="row">{{ item.uom }}</th>
                  </tr>
                </template>
              </tbody>
            </table>

            <h3 class="mt-3">Detailed picture</h3>
            <div class="row my-4">
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
        </div>
      </div>
    </el-dialog>
    <FullScreenDialog
      :images="imageArray"
      :visibility="showFullImage"
      :image="selectedFullscreenImage"
      @handle-close="closeFullScreenImage"
    />
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  toRef,
  PropType,
  ref,
  computed
} from 'vue'
import { Header } from '@/core/types/entities/dma/defects/Header'
import {
  useComponentInterventionDefectsStore
} from '@/store/pinia/dma/component-intervention/defects/useComponentInterventionDefectsStore'
import { AxiosResponse } from 'axios'
import ApiService from '@/core/services/ApiService'
import { orderBy } from 'lodash'
import { db } from '@/database/schema/DexieSchema'
import FullScreenDialog from '@/components/camera/FullScreenDialog.vue'
import { KeyValue } from '@/core/types/misc/KeyValue'
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo'
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter'

import { Image } from '@/core/types/intervention/Image'
import { ImageLoadParam } from '@/core/types/intervention/ImageLoadParam'
import { ImageFull } from "@/core/types/entities/dma/ImageInfo"

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean,
  },
  cbmData: {
    required: true,
    type: Object as PropType<Header>,
  },
  equipmentModel: {
    required: true,
    default: ''
  },
  psType: {
    required: true,
    default: ''
  }
})

const emits = defineEmits(["closeForm"])

const defectStore = useComponentInterventionDefectsStore()

/* refs */
const dialogVisible = toRef(props, "visibility")
const data = toRef(props, "cbmData")
const ratingFormula = ref<any[]>([])
const isLoading = ref(false)
const images = ref<ImageInfo[]>([])
const imageArray = ref<ImageFull[]>([]);
const imageArrayCopied = ref();
const loader = ref<boolean[]>([])

// Fullscreen Image
const selectedFullscreenImage = ref<string>("")
const showFullImage = ref(false)
const keyValues = ref<KeyValue[]>([])

/* methods */
const getUrl = async () => {
  if (images.value.length < 1) return

  for (const [index, info] of images.value.entries()) {
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
const onFormClosed = () => {
  emits("closeForm")
};

const taskNo = computed(() => {
  if (!data.value?.taskNo) return ''
  if ((data.value.taskNo.replace(/[^a-z]/gi, "").length > 1)) {
    return data.value.taskNo.replace(';', '').replace(/\D/g, '')
  } else {
    return data.value.taskNo.replace(';', '')
  }
})

const detailSpec = computed(() => {
  if (!ratingFormula.value) return []

  const tempDetailSpec = ratingFormula.value.filter((e) => {
    return e.cbmType != "CBM_GAP"
  })
  return orderBy(tempDetailSpec, ['uom', 'cbmRating', 'minValue'])
})

const detailSpecGap = computed(() => {
  if (!ratingFormula.value) return []

  const tempDetailSpecGap = ratingFormula.value.filter((e) => {
    return e.cbmType == "CBM_GAP"
  })
  return orderBy(tempDetailSpecGap, ['uom', 'cbmRating', 'minValue'])
})

const onFormOpened = async () => {
  isLoading.value = true

  const mappings = await db.cbmMapping.where({
    model: props.equipmentModel,
    psType: props.psType
  }).first()
  const formulas = mappings?.detail.filter((k) => {
    return k.taskKey == data.value.taskId
  })
  if (formulas) {
    ratingFormula.value = formulas
  }

  images.value = [];
  const tempImages = await defectStore.getDefectImages(data.value.interventionId as string, data.value.taskId as string, data.value.cbmImageProp)
  images.value = stringToImageInfoConvert(tempImages)

  keyValues.value = []
  loader.value = Array.apply(null, Array(images.value.length)).map(function () {
    return true
  })

  imageArray.value = stringToImageInfoConvert(images.value)
  const count = images.value.length
  for (let i = 0; i < count; i++) {
    const imageName = imageArray.value[i].filename
    await getImageFromBlobServer(imageName, i)
  }

  await getUrl();
  isLoading.value = false;
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
    image.type = "cbm"
    const param = {} as ImageLoadParam
    param.image = image
    param.index = index,
    param.length = images.value.length
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

const handleShowFullScreen = (fileName: string) => {
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

  selectedFullscreenImage.value = imageInfo.url
  showFullImage.value = true
}

const closeFullScreenImage = () => {
  selectedFullscreenImage.value = ""
  showFullImage.value = false
}
</script>

<style lang="scss" scoped>
  .table-header {
    text-align: center;
    color: #FFFFFF !important;
    font-weight: 500 !important;
  }
  .odd {
    background: #D5E3CF
  }
  .even {
    background: #EAF1E9;
  }
</style>
<style lang="scss">
.c {
  .el-input__inner {
    border: 1px solid #FFC107 !important;
    color: #FFC107 !important;
    background-color: rgba(255, 193, 7, 0.08) !important;
  }
}
.x {
  .el-input__inner {
    border: 1px solid rgba(255, 72, 66, 0.48) !important;
    color: #FF4842 !important;
    background-color: rgba(255, 72, 66, 0.08) !important;
  }
}
.e-form-font-family {
    font-family: 'Public sans' !important;
}
</style>
