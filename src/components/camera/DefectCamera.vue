<template>
    <div class="py-2 ps-0 pe-2 w-100">
        <div class="d-flex align-items-center">
            <div class="d-flex w-100 align-items-center camera-wrapper py-2" :class="disabledClass">
                <div class="flex-fill large-camera-container">
                  <span :class="mandatoryLabelClass">{{ `Please take a photo of the ${type} identified` }}</span>
                </div>
                <div class="ms-2">
                    <div class="p-2 justify-items-center rounded" :class="notAllowedClass" style="background: #F4F6F8;" @click="handleClickCamera">
                        <template v-if="imageCount > 0 && notAllowedClass != 'not-allowed'">
                          <NwImg src="/media/svg/dma/camera/e-form/png/cam-user.png" style="height: 20px; width: 24px;" :class="notAllowedClass" alt="camera" />
                        </template>
                        <template v-else-if="notAllowedClass == 'not-allowed'">
                          <NwImg src="/media/svg/dma/camera/e-form/png/cam-read.png" style="height: 20px; width: 24px;" :class="notAllowedClass" alt="camera" />
                        </template>
                        <template v-else>
                          <NwImg src="/media/svg/dma/camera/e-form/png/cam-active.png" style="height: 20px; width: 24px;" :class="notAllowedClass" alt="camera" />
                        </template>
                    </div>
                </div>
                <template v-if="imageCount && imageCount > 0">
                <div class="d-flex justify-content-center ms-2">
                    <button class="btn btn-sm btn-icon btn-bg-success lg-btn-icon" @click="handleShowModal" style="background-color: #18AF4A;">
                    <label class="text-white">+{{ imageCount }}</label>
                    </button>
                </div>
                </template>
            </div>
        </div>
    </div>
    <ImagePreview
      :is-monitoring="isMonitoring"
      :images="imageValues"
      :re-render="reRender"
      :visibility="modalVisibility"
      :showDeleteButton="allowDelete"
      :type="'defect'"
      :is-mandatory="false"
      @on-close="handleHideModal"
      @on-delete="handleDelete"
      @on-downloaded="handleImageDownloaded" />
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import {
  defineProps,
  defineEmits,
  defineExpose,
  ref,
  PropType
} from 'vue'
import ImagePreview from './ImagePreview.vue'
import { CameraParam } from '@/core/types/intervention/CameraParam'
import { IDetailTask } from '@/core/types/intervention/IDetailTask'
import { ImageLoadParam } from '@/core/types/intervention/ImageLoadParam'

const props = defineProps({
  task: {
    type: Object as PropType<IDetailTask>,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  allowDelete: {
    type: Boolean,
    required: true,
    default: false
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false
  },
  defectImages: {
    type: Array as PropType<string[]>,
    required: true
  },
  reRender: {
    type: Boolean,
    default: false
  },
  isMonitoring: {
    type: Boolean,
    default: false
  },
  generatedID: {
    required: false,
    type: String,
    default: ""
  },
  hasSubmitted: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits([
  'onCameraClicked',
  'onImageDownloaded',
  'onImageDelete'
])

/* refs */
const modalVisibility = ref<boolean>(false)

/* computes */
const imageCount = computed(() => {
  return props.defectImages.length
})
const imageValues = computed(() => {
  return props.defectImages ?? []
})

/* functions */
const disabledClass = computed(() => {
  return props.disabled ? 'disabled' : ''
})
const notAllowedClass = computed(() => {
  return props.disabled ? 'not-allowed' : 'allowed'
})
const mandatoryLabelClass = computed(() => {
  const countImg = imageCount.value ?? 0;
  if (countImg > 0 || !props.hasSubmitted) {
    return 'mandatory-label';
  }
  return 'mandatory-label error';
});


/* handlers */
const handleClickCamera = () => {
  if (props.disabled) return
  const param = {} as CameraParam
  param.type = 'defect'
  param.key = props.generatedID != "" ? props.generatedID : props.task.key
  emits('onCameraClicked', param)
}
const handleShowModal = () => {
  modalVisibility.value = true
}
const handleHideModal = () => {
  modalVisibility.value = false
}
const handleDelete = async (filename: string) => {
  emits('onImageDelete', filename)
}
const handleImageDownloaded = (image: ImageLoadParam) => {
  emits('onImageDownloaded', image)
}

defineExpose({
  handleClickCamera,
  handleHideModal
});

</script>

<style scoped lang="scss">
.camera-wrapper {
  padding: 5px 20px;
  border: 1px solid #E4E6EF;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.475rem;
}
.not-allowed {
  cursor:default !important;
}
.allowed {
  cursor:pointer !important;
}
.lg-btn-icon {
  height: 34px !important;
  width: 34px !important;

  label {
    font-size: 1rem !important;
  }
}
.mandatory-label {
  color: #212B36;
  &.error {
    color: #FF4842;
  }
}
</style>

