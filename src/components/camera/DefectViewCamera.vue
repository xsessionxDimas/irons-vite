<template>
    <div class="py-2 ps-0 pe-2 w-100">
        <div class="d-flex align-items-center">
            <div class="d-flex w-100 align-items-center camera-wrapper py-2" :class="disabledClass">
                <div class="flex-fill large-camera-container">
                  <span>Please take a photo of the defect identified</span>
                </div>
                <div class="ms-2">
                    <div class="p-2 justify-items-center rounded" :class="notAllowedClass" style="background: #F4F6F8;">
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
      :is-monitoring="true"
      :images="imageValues"
      :visibility="modalVisibility"
      :showDeleteButton="false"
      :type="'defect'"
      :is-mandatory="false"
      @on-close="handleHideModal"
      @on-downloaded="handleImageDownloaded" />
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import {
  defineProps,
  defineEmits,
  ref,
  PropType
} from 'vue'
import ImagePreview from './ImagePreview.vue'
import { ImageLoadParam } from '@/core/types/intervention/ImageLoadParam'

const props = defineProps({
  defectImages: {
    type: Array as PropType<string[]>,
    required: true
  },
})

const emits = defineEmits([
  'onImageDownloaded'
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
  return 'disabled'
})
const notAllowedClass = computed(() => {
  return 'not-allowed'
})

/* handlers */
const handleShowModal = () => {
  modalVisibility.value = true
}
const handleHideModal = () => {
  modalVisibility.value = false
}
const handleImageDownloaded = (image: ImageLoadParam) => {
  emits('onImageDownloaded', image)
}
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
</style>

