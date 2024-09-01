<template>
    <div class="mt-5 ps-0">
      <div class="row vcp mx-0 py-4 d-flex justify-content-between me-3 risk-assessment-title">
        <div class="col title ps-6">Take photo of completed Pre-Task Risk Assessment Form <span class="text-danger">(required)</span>.</div>
        <div class="col-2 col-md-1">
          <div class="row justify-content-center">
            <div class="px-0 col-6">
              <button class="btn btn-sm btn-icon btn-bg-light" style="cursor:default" :disabled="isCameraDisabled">
                <template v-if="riskPhotos?.length == 1">
                  <NwImg src="/media/svg/dma/camera/e-form/png/cam-user.png" style="height: 12px; width: 14px;" alt="camera" />
                </template>
                <template v-else-if="riskPhotos?.length == 2">
                  <NwImg src="/media/svg/dma/camera/e-form/png/cam-read.png" style="height: 12px; width: 14px;" alt="camera" />
                </template>
                <template v-else>
                  <NwImg src="/media/svg/dma/camera/e-form/png/cam-active.png" style="height: 12px; width: 14px;" alt="camera" />
                </template>
              </button>
            </div>
            <template v-if="riskPhotos && riskPhotos.length > 0">
              <div class="col-6 ps-0 pe-1">
                <button class="btn btn-sm btn-icon btn-bg-success" style="background-color: #18AF4A;" @click="onPreviewClicked">
                  <label class="text-white">+{{ riskPhotos.length }}</label>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <template v-if="isMonitoring">
      <ImagePreviewWithTimestamp
      :images="riskPhotos"
      :visibility="showImages"
      @on-close="onPreviewClose" />
    </template>
    <template v-else>
      <ImagePreviewPreriskIntervention
      ref="preview"
      :images="riskPhotos"
      :visibility="showImages"
      :view-only="false"
      @on-close="onPreviewClose"
      @on-delete="onImageDeleted" />
    </template>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  defineExpose,
  PropType,
  ref,
  computed
} from 'vue'
import { Intervention } from '@/core/types/intervention/Intervention'
import { Audit } from '@/core/types/intervention/Audit'
import { CameraParam } from '@/core/types/intervention/CameraParam'
import { ImageLoadParam } from '@/core/types/intervention/ImageLoadParam'
import ImagePreviewWithTimestamp from '@/components/camera/ImagePreviewWithTimestampIntervention.vue'
import {
  RiskAssesmentValue
} from '@/core/types/intervention/RiskAssesmentValue'
import ImagePreviewPreriskIntervention from '@/components/camera/ImagePreviewPreriskIntervention.vue'


const props = defineProps({
  intervention: {
    required: true,
    type: Object as PropType<Intervention>
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  },
  fitter: {
    required: true,
    type: Object as PropType<Audit|undefined>
  },
  fitterPhotos: {
    required: true,
    type: Array as PropType<RiskAssesmentValue[]>
  },
  reRender: {
    type: Boolean,
    default: false
  },
  isMonitoring: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits([
  'onCameraClicked',
  'onPreviewClicked',
  'onImageDownloaded',
  'onImageDeleted'
])
const showImages = ref(false)
const preview = ref()

const isCameraDisabled = computed(() => {
  return props.generalSubmitted || !props.fitter
})
const riskPhotos = computed(() => {
  if (props.isMonitoring) {
    return props.fitterPhotos
  } else {
    return props.fitterPhotos.filter((x) => {
      return x.updatedBy.id == props.fitter?.id
    })
  }
})
/* methods and handlers */
const onCameraClicked = () => {
  if (isCameraDisabled.value || riskPhotos.value?.length > 1) return
  const param = {} as CameraParam
  param.type = 'value'
  param.key = props.intervention.riskAssesment[0].key
  emits('onCameraClicked', param)
}
const onPreviewClicked = () => {
  emits('onPreviewClicked', props.fitterPhotos.length)
  showImages.value = true
}
const onPreviewClose = () => {
  showImages.value = false
}
const onImageDownloaded = (image: ImageLoadParam) => {
  emits('onImageDownloaded', image)
}
const onImageDeleted = (filename: string) => {
  emits('onImageDeleted', filename)
}
const reRender = () => {
  setTimeout(() => {
    preview.value?.openFirstReRender()
  }, 2000);
}
defineExpose({
  reRender
})
</script>

<style scoped>
    .form-control,.form-select {
        color: #919EAB;
    }
    .vcp {
        background: white;
        border: 1px solid rgba(145, 158, 171, 0.24);
        border-radius: 12px;
    }
    .h-120px {
        height: 120px !important;
    }
    .title {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
    }
    .small-label {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 18px;
      color: #637381;
    }
</style>
