<template>
  <div class="row m-0 p-0" :class="!isUndefined(itemRef) && itemRef.length > 0 ? 'justify-content-around' : 'justify-content-center'">
    <div class="d-flex justify-content-center" :class="!isUndefined(itemRef) && itemRef.length > 0 ? 'col-6 pe-0 ps-1' : 'col-6 px-0'">
      <button class="btn btn-sm btn-icon btn-bg-light" :disabled="readOnly" @click="handleClickCamera">
        <img :src="cameraColor()" style="height: 12px; width: 14px;" alt="camera">
      </button>
    </div>
    <template v-if="imageValues && imageValues.length > 0">
      <div class="col-6 p-0 d-flex justify-content-center text-nowrap">
        <button class="btn btn-sm btn-icon btn-bg-success" @click="handleShowModal" style="background-color: #18AF4A;">
          <label class="text-white">+{{ imageValues.length }}</label>
        </button>
      </div>
    </template>
  </div>
  <ImagePreview
    :index="index"
    :is-monitoring="isMonitoring"
    :images="imageValues"
    :re-render="reRender"
    :visibility="modalVisibility"
    :showDeleteButton="!(isDisabled || isMonitoring)"
    :type="'parts'"
    :is-mandatory="false"
    @on-close="handleHideModal"
    @on-delete="handleDelete"
    @on-downloaded="handleImageDownloaded" />
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  toRef,
  PropType,
  defineEmits,
} from 'vue';
import {
  isUndefined,
} from 'lodash';
import {
  ref,
} from 'vue'
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter';
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo';
import ImagePreview from '@/components/camera/ImagePreview.vue'
import { ImageLoadParam } from '@/core/types/intervention/ImageLoadParam'

const modalVisibility = ref<boolean>(false);

const props = defineProps({
  itemValue: {
    required: true,
    type: Object as PropType<ImageInfo[]>
  },
  index: {
    requied: true,
    type: Number
  },
  isDisabled: {
    required: false,
    type: Boolean,
    defauly: false
  },
  isMonitoring: {
    type: Boolean,
    default: false
  },
  mode: {
    default: ''
  },
})

const emits = defineEmits([
  'onCameraClicked',
  'onImageDownloaded',
  'onImageDelete'
])

const itemRef = toRef(props, 'itemValue')
const reRender = ref(false)

const imageValues = computed(() => {
  if (!itemRef.value) return [] as ImageInfo[]
  return stringToImageInfoConvert(itemRef.value)
})

const handleClickCamera = () => {
  emits("onCameraClicked", {
    type: props.mode ? `parts-${props.mode}` : 'parts',
    key: `${props.index}-parts`
  })
}

const handleDelete = async (params) => {
  emits('onImageDelete', params)
  reRender.value = !reRender.value
}
const handleImageDownloaded = (image: ImageLoadParam) => {
  emits('onImageDownloaded', image)
}

const cameraColor = () => {
  // belum ada yang take pic
  let camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
  if (imageValues.value.length > 0) {
    camera = "/media/svg/dma/camera/e-form/png/cam-user.png"
  }
  return camera
}

const handleShowModal = () => {
  modalVisibility.value = true
}

const handleHideModal = () => {
  modalVisibility.value = false
}

const readOnly = computed(() => {
  if (props.isDisabled) {
    return props.isDisabled
  }
  return false
})
</script>
