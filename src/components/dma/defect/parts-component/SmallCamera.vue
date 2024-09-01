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
  <template v-if="modalVisibility">
    <ImagePreview
    :type="'task'"
    :re-render="rerender"
    :images="imageValues"
    :show-delete-button="showDeleteButtonCondition"
    :is-mandatory="false"
    :visibility="modalVisibility"
    :is-monitoring="!showDeleteButtonCondition"
    :show-mandatory-caption="false"
    @on-close="handleHideModal"
    @on-delete="deleteImage"
    />
  </template>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  toRef,
  PropType,
  defineEmits,
  watch,
  ref
} from 'vue';
import {
  isUndefined,
  cloneDeep
} from 'lodash';
import ImagePreview from '@/components/camera/ImagePreview.vue'
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter';
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo';
import { useCameraStore } from '@/store/pinia/application/useCameraStore';

const modalVisibility = ref<boolean>(false);
const camStore = useCameraStore()

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
  }
})

const emits = defineEmits(['handleChangeImage'])
const rerender = ref(false)
const itemRef = toRef(props, 'itemValue')

const imageValues = computed(() => {
  if (!itemRef.value) return [] as ImageInfo[]
  return stringToImageInfoConvert(itemRef.value)
})

const imageObject = computed(() => {
  return cloneDeep(camStore.ImageObjects.find((i) => {
    return i.Id === `${props.index}-parts`;
  }));
})

const handleClickCamera = () => {
  camStore.toggleIsVisible(true, `${props.index}-parts`)
  camStore.setShowCloseButton(true)
}

const cameraColor = () => {
  // belum ada yang take pic
  let camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
  if (imageValues.value.length > 0) {
    camera = "/media/svg/dma/camera/e-form/png/cam-user.png"
  }
  return camera
}


watch(imageObject, async (newVal, oldVal) => {
  if (newVal && newVal.ImageInfos.length > 0) {
    if (newVal.ImageInfos.length != oldVal?.ImageInfos.length) {
      emits('handleChangeImage', {
        index: props.index,
        value: [
          ...stringToImageInfoConvert(itemRef.value),
          ...newVal.ImageInfos
        ]
      })
      rerender.value = !rerender.value
      camStore.setCurrent(`${props.index}-parts`)
      camStore.clearCurrent()
    }
  }
}, { deep: true })

const showDeleteButtonCondition = computed(() => {
  return !readOnly.value
})

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

const deleteImage = async (filename: string) => {
  const arr = cloneDeep(itemRef.value).filter((img) => {
    return img.filename != filename
  })
  emits('handleChangeImage', {
    index: props.index,
    value: arr
  })
  rerender.value = !rerender.value
  camStore.setCurrent(`${props.index}-parts`)
  if (itemRef.value.length == 0) handleHideModal()
  camStore.clearCurrent()
}
</script>
