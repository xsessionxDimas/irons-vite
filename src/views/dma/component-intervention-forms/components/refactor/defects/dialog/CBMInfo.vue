<template>
  <el-dialog v-model="dialogVisible" :custom-class="'crackform dialog-header-noborder'" width="90%" center
    @closed="onFormClosed" @opened="onFormOpened" :destroy-on-close="true">
    <template #title>
      <span class="el-dialog__title" style="text-align: start"></span>
    </template>
    <div>
      <div class="ps-3" v-loading="isLoading">
        <h3>Detailed Information</h3>
        <template v-if="cbmData.appSPVBy">
          <GreenBadgeInfo :message="`${cbmData.appSPVDate} - ${cbmData.appSPVBy.name}`"
            placeholder-message="Approved by Supervisor" />
          <GreenBadgeInfo :message="`${cbmData.approveReason}`" v-if="cbmData.approveReason"
            placeholder-message="Approval Comment" />
        </template>
        <template v-if="cbmData.appPlannerBy">
          <GreenBadgeInfo :message="`${cbmData.appSPVDate} - ${cbmData.appPlannerBy.name}`"
            placeholder-message="Approved by Planner" />
          <GreenBadgeInfo :message="`${cbmData.plannerApproveReason}`" v-if="cbmData.plannerApproveReason"
            placeholder-message="Approval Comment" />
        </template>
        <div class="d-flex flex-row justify-content-between">
          <!--v-if-->
          <div class="col-1 text-center px-2 py-2"
            style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-left: 1px solid rgba(145, 158, 171, 0.24);">
            <label>No</label>
          </div>
          <div class="col text-start px-2 py-2"
            style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
            <label>Measurement Location</label>
          </div>
          <div class="col-2 text-start px-2 py-2"
            style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
            <label>Measurement Value</label>
          </div>
          <div class="col-1 text-start px-2 py-2"
            style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
            <label>UoM</label>
          </div>
          <div class="col-2 text-start px-2 py-2"
            style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-right: 1px solid rgba(145, 158, 171, 0.24);">
            <label>Rating</label>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between">
          <div class="col-1 text-center px-2 py-2"
            :style="cbmData.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'"
            style="background-color: rgb(249, 250, 251); border-left: 1px solid rgba(145, 158, 171, 0.24);">
            <label>{{ cbmData.taskNo }}</label>
          </div>
          <div class="col text-start px-2 py-2"
            :style="cbmData.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
            <label
              v-html="cbmData.taskDesc.split(';').length > 3 ? cbmData.taskDesc.split(';')[2] : cbmData.taskDesc"></label>
          </div>
          <div class="col-2 text-start px-2 py-2"
            :style="cbmData.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
            <el-input class="dark-text-primary" size="small" :model-value="cbmData.cbmMeasurement" :disabled="true" />
          </div>
          <div class="col-1 text-start px-2 py-2"
            :style="cbmData.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
            <label>{{ ratingFormula[0]?.uom ?? cbmData.cbmUom }}</label>
          </div>
          <div class="col-2 text-start px-2 py-2"
            :style="cbmData.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'"
            style="border-right: 1px solid rgba(145, 158, 171, 0.24);">
            <el-input size="small" :model-value="cbmData.taskValue" :class="cbmData.taskValue === 'C' ? 'c' : 'x'"
              :disabled="true" />
          </div>
        </div>
        <!-- adjustment new rating -->
        <div class="d-flex flex-row justify-content-between" v-if="cbmData.correctedValue">
          <div class="col-1 text-center px-2 py-2"
            style="background-color: rgb(249, 250, 251);  border-left: 1px solid rgba(145, 158, 171, 0.24);">
            <label></label>
          </div>
          <div class="col text-start px-2 py-2" style="">
            <label>Adjustment</label>
          </div>
          <div class="col-2 text-start px-2 py-2" style="">
            <label></label>
          </div>
          <div class="col-2 text-start px-2 py-2" style="">
            <el-input size="small" class="dark-text-primary" :model-value="cbmData.correctedMeasurement"
              :disabled="true" />
          </div>
          <div class="col-1 text-start px-2 py-2" style="">
            <label>{{ cbmData.correctedUom }}</label>
          </div>
          <div class="col-2 text-start px-2 py-2" style=" border-right: 1px solid rgba(145, 158, 171, 0.24);">
            <el-input size="small" class="dark-text-primary" :model-value="cbmData.correctedValue" :disabled="true"
              :class="cbmData.correctedValue.toLowerCase()" />
          </div>
        </div>
        <!-- comment row -->
        <div class="d-flex flex-row justify-content-between" v-if="cbmData.correctedValue">
          <div class="col-1 text-center px-2 py-2"
            style="background-color: rgb(249, 250, 251); border-bottom: 1px solid rgba(145, 158, 171, 0.24); border-left: 1px solid rgba(145, 158, 171, 0.24);">
            <label></label>
          </div>
          <div class="col text-start px-2 py-2" style="border-bottom: 1px solid rgba(145, 158, 171, 0.24);">
            <label>Comment</label>
          </div>
          <div class="col-2 text-start px-2 py-2" style="border-bottom: 1px solid rgba(145, 158, 171, 0.24);">
            <label></label>
          </div>
          <div class="col-5 text-start px-2 py-2" style="border-bottom: 1px solid rgba(145, 158, 171, 0.24);">
            <el-input size="small" class="dark-text-primary" :model-value="cbmData.commentValue" :disabled="true" />
          </div>
        </div>
        <h3 class="mt-3">Detail Spec</h3>
        <div>
          <table class="table table-bordered" style="width:500px">
            <caption></caption>
            <thead>
              <tr style="background:#70AD47">
                <th scope="col" class="table-header" style="border-right:1px solid white">Rating</th>
                <th scope="col" class="table-header" style="border-right:1px solid white">Value Min</th>
                <th scope="col" class="table-header" style="border-right:1px solid white">Value Max</th>
                <th scope="col" class="table-header">UoM</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in ratingFormulaCBM" :key="index">
                <tr :class="(index % 2 == 0) ? 'even' : 'odd'">
                  <th scope="row" style="border-right:1px solid white; padding-left:10px">{{ item.cbmRating }}</th>
                  <th scope="row" style="border-right:1px solid white">{{ item.minValueComplete }}</th>
                  <th scope="row" style="border-right:1px solid white">{{ item.maxValueComplete }}</th>
                  <th scope="row">{{ item.uom }}</th>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <template v-if="ratingFormulaCBMGap.length > 0">
          <h3 class="mt-3">Detail Spec Gap</h3>
          <div>
            <table class="table table-bordered" style="width:500px">
              <caption></caption>
              <thead>
                <tr style="background:#70AD47">
                  <th scope="col" class="table-header" style="border-right:1px solid white">Rating</th>
                  <th scope="col" class="table-header" style="border-right:1px solid white">Value Min</th>
                  <th scope="col" class="table-header" style="border-right:1px solid white">Value Max</th>
                  <th scope="col" class="table-header">UoM</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in ratingFormulaCBMGap" :key="index">
                  <tr :class="(index % 2 == 0) ? 'even' : 'odd'">
                    <th scope="row" style="border-right:1px solid white; padding-left:10px">{{ item.cbmRating }}</th>
                    <th scope="row" style="border-right:1px solid white">{{ item.minValueComplete }}</th>
                    <th scope="row" style="border-right:1px solid white">{{ item.maxValueComplete }}</th>
                    <th scope="row">{{ item.uom }}</th>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </template>
        <h3 class="mt-3">Detailed picture</h3>
        <div class="row my-4">
          <div v-for="(img, index) in images" :key="img.filename"
            class="col-md-3 fv-row fv-plugins-icon-container p-2 rounded position-relative">
            <el-skeleton :loading="loader[index]" animated>
              <template #template>
                <el-skeleton-item variant="image" class='w-100 rounded' style="height: 200px; object-fit: fill" />
              </template>
              <template #default>
                <div class="bg-secondary">
                  <img :src="getImageUrl(img.filename)" class='w-100 rounded'
                    style="height: 200px; object-fit: contain; cursor: pointer" alt="images"
                    v-if="getImageUrl(img.filename) != undefined" @click="handleShowFullScreen(img.filename)" />
                </div>
              </template>
            </el-skeleton>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
  <FullScreenDialog :images="convertedImages" :visibility="showFullImage" :new-version="true"
    :image="selectedFullscreenImage" @handle-close="closeFullScreenImage" />
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  ref,
  computed,
  PropType
} from 'vue'
import { CBMMappingDetail } from '@/core/types/intervention/CBMMapping'
import { AxiosResponse } from 'axios'
import ApiService from '@/core/services/ApiService'
import { KeyValue } from '@/core/types/misc/KeyValue'
import { Defect } from '@/database/schema/Defect'
import { db } from '@/database/schema/DexieSchema'
import { Image } from '@/core/types/intervention/Image'
import { ImageLoadParam } from '@/core/types/intervention/ImageLoadParam'
import FullScreenDialog from '@/components/camera/FullScreenDialog.vue'
import { ImageFull, ImageInfo } from '@/core/types/entities/dma/ImageInfo'
import GreenBadgeInfo from "@/views/dma/components/defects/GreenBadgeInfo.vue"

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean,
  },
  cbmData: {
    required: true,
    type: Object as PropType<Defect>
  },
  images: {
    required: true,
    type: Array as PropType<ImageInfo[]>
  },
  ratingFormula: {
    required: true,
    type: Array as PropType<CBMMappingDetail[]>
  },
  isMonitoring: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(["onClose", "onDownloaded"])

/* refs */
const isLoading = ref(false)
const keyValues = ref<KeyValue[]>([])
const loader = ref<boolean[]>([])
// Fullscreen Image
const selectedFullscreenImage = ref<string>("")
const showFullImage = ref(false)

// computed
const dialogVisible = computed(() => {
  return props.visibility
})
const ratingFormulaCBM = computed(() => {
  const formulas = props.ratingFormula || []
  return formulas.filter((formula) => {
    return !formula.cbmType.includes("GAP")
  })
})
const ratingFormulaCBMGap = computed(() => {
  const formulas = props.ratingFormula || []
  return formulas.filter((formula) => {
    return formula.cbmType == "CBM_GAP"
  })
})
const closeFullScreenImage = () => {
  selectedFullscreenImage.value = ""
  showFullImage.value = false
}
const handleShowFullScreen = (image: string) => {
  selectedFullscreenImage.value = image
  showFullImage.value = true
}
const getImageUrl = (filename: string) => {
  const found = keyValues.value.find((k) => {
    return k.key == filename
  })
  return found?.value ?? ''
}
const convertedImages = computed(() => {
  return props.images.map((img) => {
    const url = getImageUrl(img.filename)
    return {
      imgBlob: url,
      url: url,
      description: img.description,
    }
  }) as ImageFull[]
})
const getImageFromBlobServer = async (filename: string, index: number) => {
  const params = {
    fileUrl: `${filename}`,
    ver: 'v1',
  }
  try {
    const GET_IMAGE_API_URL = `${process.env.VUE_APP_BASE_URL_DIGITAL}/${process.env.VUE_APP_API_AM_DMA}/api/attachment/download_by_url?${new URLSearchParams(params).toString()}`
    const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL)
    if (props.isMonitoring) {
      const blob = new Blob([response.data])
      let URL = window.URL || window.webkitURL
      keyValues.value.push({
        key: filename,
        value: URL.createObjectURL(blob)
      })
      loader.value[index] = false
    } else {
      const buffer = response.data
      const blob = new Blob([buffer])
      const image = {} as Image
      image.filename = filename
      image.blob = blob
      image.type = 'cbm'
      const param = {} as ImageLoadParam
      param.image = image
      param.index = index
      param.length = props.images.length
      emits('onDownloaded', param)
      window.setTimeout(async () => {
        const file = await db.pendingTaskFile.where({
          filename: image.filename
        }).first()
        if (file) {
          let URL = window.URL || window.webkitURL
          keyValues.value.push({
            key: image.filename,
            value: URL.createObjectURL(file.blob)
          })
          loader.value[index] = false
        }
      }, 1000)
    }
  } catch (error) {
    console.log('image', error)
  }
}
const openFirst = async () => {
  keyValues.value = []
  loader.value = Array.apply(null, Array(props.images.length)).map(function () {
    return true
  })
  const filenames = props.images.map((i) => {
    return i.filename
  })
  for (const [index, filename] of filenames.entries()) {
    const taskImage = await db.pendingTaskFile.get({
      filename: filename
    })
    if (!taskImage) {
      await getImageFromBlobServer(filename, index)
    } else {
      let URL = window.URL || window.webkitURL
      keyValues.value.push({
        key: filename,
        value: URL.createObjectURL(taskImage.blob)
      })
      loader.value[index] = false
    }
  }
}

const onFormOpened = async () => {
  isLoading.value = true
  await openFirst();
  isLoading.value = false
}

/* methods */
const onFormClosed = () => {
  emits("onClose")
};
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
.a {
  .el-input__inner {
    border: 1px solid #18AF4A !important;
    color: #18AF4A !important;
    background-color: rgba(24, 175, 74, .08) !important;
  }
}

.b {
  .el-input__inner {
    border: 1px solid rgba(51, 102, 255, 0.48) !important;
    color: #01a3ff !important;
    background: rgba(51, 102, 255, 0.08) !important;
  }
}

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
</style>
