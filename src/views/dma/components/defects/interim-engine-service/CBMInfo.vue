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
          <GreenBadgeInfo :message="`${cbmData.appPlannerDate} - ${cbmData.appPlannerBy.name}`"
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
            style="background-color: rgb(249, 250, 251); border-bottom: 1px solid rgba(145, 158, 171, 0.24); border-left: 1px solid rgba(145, 158, 171, 0.24);">
            <label>{{ taskNo }}</label>
          </div>
          <div class="col text-start px-2 py-2" style="border-bottom: 1px solid rgba(145, 158, 171, 0.24);">
            <label>{{ data.taskDesc }}</label>
          </div>
          <div class="col-2 text-start px-2 py-2" style="border-bottom: 1px solid rgba(145, 158, 171, 0.24);">
            <el-input size="small" class="dark-text-primary" v-model="data.cbmMeasurement" :disabled="true" />
          </div>
          <div class="col-1 text-start px-2 py-2" style="border-bottom: 1px solid rgba(145, 158, 171, 0.24);">
            <label>{{ data.cbmUom }}</label>
          </div>
          <div class="col-2 text-start px-2 py-2"
            style="border-bottom: 1px solid rgba(145, 158, 171, 0.24); border-right: 1px solid rgba(145, 158, 171, 0.24);">
            <el-input size="small" v-model="data.taskValue" :class="data.taskValue === 'C' ? 'c' : 'x'"
              :disabled="true" />
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
              <template v-for="(item, index) in ratingFormula" :key="index">
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
        <h3 class="mt-3">Detailed picture</h3>
        <div class="row my-4">
          <div v-for="(img, index) in images"
            class="col-md-3 fv-row fv-plugins-icon-container p-2 rounded position-relative" :key="img.filename">
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
        <template v-if="!cbmIsConfirmed && !viewOnly">
          <div class="mt-1 py-2" style="word-break: break-word !important;">
            <div class="desc-label">Approval Comment</div>
            <div class="d-flex flex-column">
              <Textarea :value="approveReason ?? ''" :disable-floating="true" name="approveReason" :max="255"
                :is-valid="approveReasonIsValid" :error-message="approveReasonRequiredMessage"
                @handleChange="onApproveReasonChange"></Textarea>
            </div>
            <button class="mt-2 btn btn-success w-100" @click.prevent="onApproveCBM"
              style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Approve</button>
          </div>
        </template>
      </div>
    </div>
  </el-dialog>
  <template v-if="showFullImage">
    <FullScreenDialog :images="imagesFull" :visibility="showFullImage" :image="fullImageShowed"
      @handle-close="closeFullScreenImage" />
  </template>
  <ToastWithIcon :show="successMessageBoxVisible" :message="completeMessage" />
  <MessageBox :show="errorMessageBoxVisible" @close="onOk" :message="errorMessage" icon="/media/svg/dma/alert.svg" />
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
  useInterimEngineStore
} from '@/store/pinia/dma/interim-engine-service/useInterimEngineStore'
import {
  useInterimDefectsStore
} from '@/store/pinia/dma/interim-engine-service/defects/useInterimDefectsStore'
import { AxiosResponse } from 'axios'
import ApiService from '@/core/services/ApiService'
import { orderBy } from 'lodash'
import FullScreenDialog from '@/components/camera/FullScreenDialog.vue';
import { ImageFull, ImageInfo } from '@/core/types/entities/dma/ImageInfo'
import { KeyValue } from '@/core/types/misc/KeyValue'
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter'
import GreenBadgeInfo from "@/views/dma/components/defects/GreenBadgeInfo.vue"
import Textarea from "@/components/inputs/dma/Textarea.vue"
import {
  DefectConfirmationParams
} from '@/core/types/misc/DefectConfirmationParams'
import ToastWithIcon from "@/components/dialog/ToastWithIcon.vue";
import MessageBox from '@/components/dialog/MessageBox.vue';
import { ElLoading } from 'element-plus'
import { NoNetworkMessages } from '@/store/enums/ErrorMessagesEnum';
import IronformConfig from "@/core/config/IronformConfig";

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean,
  },
  cbmIsConfirmed: {
    required: false,
    type: Boolean,
    default: true
  },
  cbmData: {
    required: true,
    type: Object as PropType<Header>,
  },
  viewOnly: {
    required: false,
    type: Boolean,
    default: false
  }
});

// eslint-disable-next-line func-call-spacing
const emits = defineEmits<{
  (event: 'closeForm'): void
  (event: 'onApproveCbm', params: DefectConfirmationParams): void
}>()

const store = useInterimEngineStore()
const defectStore = useInterimDefectsStore()
const showFullImage = ref(false)
const keyValues = ref<KeyValue[]>([])
const loader = ref<boolean[]>([])
const images = ref<ImageInfo[]>([])
const imagesFull = ref<ImageFull[]>([])
const fullImageShowed = ref("")
const approveReason = ref('')
const approveReasonRequiredMessage = ref('')
const approveReasonIsValid = ref(true)
const successMessageBoxVisible = ref(false)
const errorMessageBoxVisible = ref(false)
const errorMessage = ref("")
const completeMessage = "CBM Successfully Confirmed"

const handleShowFullScreen = (image) => {
  const index = imagesFull.value.findIndex((item) => {
    return item.imgBlob == image
  })
  const imageInfo = imagesFull.value[index]
  if (index > 0) {
    const front = imagesFull.value.slice(index)
    const back = imagesFull.value.slice(0, index)
    imagesFull.value = [...front, ...back]
  }
  fullImageShowed.value = imageInfo.url
  showFullImage.value = true
}

const closeFullScreenImage = () => {
  fullImageShowed.value = ""
  showFullImage.value = false
}
/* refs */
const dialogVisible = toRef(props, "visibility")
const data = toRef(props, "cbmData")
const ratingFormula = ref<any[]>([])
const isLoading = ref(false)
const imageUrls = ref([] as string[])

/* methods */
const getImageUrl = (filename: string) => {
  const found = keyValues.value.find((k) => {
    return k.key == filename
  })
  return found?.value ?? ''
}
const getUrl = async () => {
  imageUrls.value = []
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
      imagesFull.value.forEach((img) => {
        if (img.imgBlob == info.filename) {
          img.url = url
        }
      })
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
  if ((data.value.taskNo.replace(/[^a-z]/gi, "").length > 1)) {
    return data.value.taskNo.replace(';', '').replace(/\D/g, '')
  } else {
    return data.value.taskNo.replace(';', '')
  }
})

const onFormOpened = async () => {
  isLoading.value = true
  approveReason.value = ''
  approveReasonIsValid.value = true
  approveReasonRequiredMessage.value = ''
  const formula = store.stateCBMFormulas.filter((x) => {
    return x.taskKey === data.value.taskId
  });
  ratingFormula.value = orderBy(formula, ['uom', 'cbmRating', 'minValue'])
  const raw = await defectStore.getDefectImages(data.value.serviceSheetDetailId, data.value.cbmImageKey, data.value.cbmImageProp);
  images.value = stringToImageInfoConvert(raw)
  loader.value = Array.apply(null, Array(images.value.length)).map(function () {
    return true
  })
  imagesFull.value = images.value.map((img) => {
    return {
      imgBlob: img.filename,
      url: '',
      description: img.description
    }
  })
  await getUrl();
  isLoading.value = false;
}

const onApproveReasonChange = (param: {
  value: string
}) => {
  approveReason.value = param.value
  approveReasonRequiredMessage.value = ''
  approveReasonIsValid.value = true
}

const onApproveCBM = () => {
  if (IronformConfig.isSPVPlannerMandatoryInputCommentOnApproveCBM) {
    if (!approveReason.value) {
      approveReasonRequiredMessage.value = 'Approval Comment is required'
      approveReasonIsValid.value = false
      return
    }
  }
  const loader = ElLoading.service({
    lock: true,
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  emits('onApproveCbm', {
    headerId: props.cbmData.id,
    reason: approveReason.value,
    callback: (IsError: boolean, errorText: string) => {
      loader.close()
      if (IsError) {
        errorMessage.value = errorText
        errorMessageBoxVisible.value = true
      } else {
        autoCloseSuccessMessageBox();
      }
    }
  })
}

const onOk = () => {
  errorMessageBoxVisible.value = false
  if (errorMessage.value != NoNetworkMessages.NO_NETWORK_VIEW) {
    onFormClosed()
  }
}

const autoCloseSuccessMessageBox = () => {
  successMessageBoxVisible.value = true
  setTimeout(() => {
    successMessageBoxVisible.value = false
    onOk()
  }, 1000);
}
</script>

<style lang="scss" scoped>
.table-header {
  text-align: center;
  color: #FFFFFF !important;
  font-weight: 500 !important;
}

.desc-label {
  font-size: 13px;
  font-weight: 600;
  border: none;
  min-height: -moz-min-content;
  min-height: min-content;
  line-height: 1.4;
  color: black;
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
</style>
