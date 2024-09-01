<template>
  <div class="pt-2">
    <div class="d-flex justify-content-center">
      <div class="d-flex justify-content-center">
        <button class="btn btn-sm btn-icon btn-bg-light" disabled>
          <img :src="cameraColor()" id="icon-camera" style="height: 12px; width: 14px;" alt="camera">
        </button>
      </div>
      <template v-if="imageValues && imageValues.length > 0">
        <div id="image-count" class="d-flex justify-content-center ms-3">
          <button class="btn btn-sm btn-icon btn-bg-success text-white" @click="handleShowModal" style="background-color: #18AF4A;">
            +{{ imageValues.length }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  PropType,
  toRef,
  computed
} from 'vue'
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter';
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo';

const props = defineProps({
  item: {
    type: Object as PropType<ImageInfo[]>,
    required: true
  },
  isUpdatedByCurrentUser: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(['showPreviewImages'])

const itemRef = toRef(props, 'item');

const imageValues = computed(() => {
  if (!itemRef.value) return [];
  return stringToImageInfoConvert(itemRef.value);
})

const cameraColor = () => {
  // belum ada yang take pic
  let camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
  if (props.isUpdatedByCurrentUser && imageValues.value.length > 0) {
    // user yang take pic
    camera = "/media/svg/dma/camera/e-form/png/cam-user.png"
  } else if (props.isUpdatedByCurrentUser && imageValues.value.length == 0) {
    camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
  } else if (!props.isUpdatedByCurrentUser && imageValues.value.length > 0) {
    // user selain yang take pic
    camera = "/media/svg/dma/camera/e-form/png/cam-read.png"
  } else {
    camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
  }
  return camera
}

const handleShowModal = () => {
  emit('showPreviewImages', imageValues.value);
}
</script>
