<template>
  <div :class="[paddingBottomCondition]" class="pt-2">
    <div class="d-flex justify-content-center">
      <div class="d-flex justify-content-center">
        <button class="btn btn-sm btn-icon btn-bg-light" :disabled="readOnly">
          <img :src="cameraColor()" style="height: 12px; width: 14px;" alt="camera">
        </button>
      </div>
      <template v-if="imageValues && imageValues.length > 0">
        <div class="d-flex justify-content-center ms-3">
          <button class="btn btn-sm btn-icon btn-bg-success" @click="handleShowModal" style="background-color: #18AF4A;">
            <label class="text-white">+{{ imageValues.length }}</label>
          </button>
        </div>
      </template>
    </div>
    <template v-if="modalVisibility">
      <ImagePreview
      :type="'task'"
      :re-render="false"
      :images="imageValues"
      :show-delete-button="showDeleteButtonCondition"
      :is-mandatory="false"
      :visibility="modalVisibility"
      :is-monitoring="!showDeleteButtonCondition"
      :show-mandatory-caption="false"
      @on-close="handleHideModal" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Item } from '@/core/types/entities/dma/e-form/Item';
import { computed } from '@vue/reactivity';
import {
  defineProps,
  PropType,
  toRef,
  ref,
} from 'vue'
import ImagePreview from '@/components/camera/ImagePreview.vue';
import { Audit } from '@/core/types/intervention/Audit';
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter';
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo';
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore';

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  },
  generalStyle: {
    type: Boolean,
    default: true
  },
  history: {
    type: Object as any,
    required: true
  },
});

const itemRef = toRef(props, 'item')
const modalVisibility = ref<boolean>(false);
const authStore = useAuthenticationStore()

const imageValues = computed(() => {
  if (!itemRef.value.value) return [] as ImageInfo[]
  return stringToImageInfoConvert(itemRef.value.value)
})

const cameraColor = () => {
  // belum ada yang take pic
  let camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
  if (props.history?.updatedBy) {
    if (props.history.updatedBy.id == authStore.user.EmployeeId && imageValues.value.length > 0) {
      // user yang take pic
      camera = "/media/svg/dma/camera/e-form/png/cam-user.png"
    } else if (props.history.updatedBy.id == authStore.user.EmployeeId && imageValues.value.length == 0) {
      camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
    } else if (props.history.updatedBy.id != authStore.user.EmployeeId && imageValues.value.length > 0) {
      // user selain yang take pic
      camera = "/media/svg/dma/camera/e-form/png/cam-read.png"
    } else {
      camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
    }
  }
  return camera
}

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
  return true
})

const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2"
  if (props.history?.updatedBy && (props.history?.updatedBy as Audit).name) paddingBottom = ''
  return paddingBottom
})
</script>
