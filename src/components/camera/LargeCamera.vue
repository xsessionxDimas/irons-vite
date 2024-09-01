<template>
    <div class="py-2 ps-0 pe-2 w-100">
        <div class="d-flex align-items-center">
            <div class="d-flex w-100 align-items-center camera-wrapper py-2" :class="disabledClass">
                <div class="flex-fill large-camera-container">
                    <span>{{ `Please take a photo of the ${props.id} identified` }}</span>
                </div>
                <div class="ms-2">
                    <div class="p-2 justify-items-center rounded" :class="notAllowedClass" style="background: #F4F6F8;" @click="handleClickCamera()">
                        <img :src="cameraColor()" style="height: 20px; width: 24px;" :class="notAllowedClass" alt="camera" />
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
      :type="id"
      :re-render="false"
      :images="imageValues"
      :show-delete-button="allowDelete"
      :is-mandatory="isMandatory"
      :visibility="modalVisibility"
      :is-monitoring="isMonitoring"
      :show-mandatory-caption="isMandatory"
      @on-close="handleHideModal"
      @on-delete="handleDelete" />
    <Confirmation :visibility="showTakeAnotherPicture"
        caption="The photo successfully taken, would you like to take another photo?"
        @on-no-confirm="onConfirmTakePhotoCancel"
        @on-yes-confirm="onConfirmTakeAnotherPhoto" />
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import {
  defineProps,
  ref
} from 'vue'
import ImagePreview from '@/components/camera/ImagePreview.vue'
import { useCameraStore } from '@/store/pinia/application/useCameraStore'
import Confirmation from '@/components/dialog/CameraConfirmation.vue'
import { ImageObject } from '@/core/types/entities/dma/ImageObject'
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo'
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter'
import { useRoute } from 'vue-router';

const props = defineProps({
  id: {
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
  isMonitoring: {
    type: Boolean,
    default: false
  },
  isMandatory: {
    type: Boolean,
    default: false
  }
});

/* stores */
const camStore = useCameraStore();
const route = useRoute();

/* refs */
const modalVisibility = ref<boolean>(false);
const showTakeAnotherPicture = ref(false);

/* computes */
const imageObject = computed(() => {
  return camStore.ImageObjects.find((i) => {
    return i.Id === props.id;
  }) as ImageObject | undefined;
});
const imageCount = computed(() => {
  return imageObject.value?.ImageInfos.length;
});
const imageValues = computed(() => {
  if (!imageObject.value) return [] as ImageInfo[]
  return stringToImageInfoConvert(imageObject.value.ImageInfos)
})

const cameraColor = () => {
  // if monitoring
  if (route.path == '/ironforms/monitoring-status/preview') {
    let camera;
    if (imageValues.value.length > 0) {
      camera = "/media/svg/dma/camera/e-form/png/cam-read.png"
    } else {
      camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
    }
    return camera
  }
  // belum ada yang take pic
  let camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
  // user yang take pic
  if (imageCount.value! > 0) camera = "/media/svg/dma/camera/e-form/png/cam-user.png"
  if (notAllowedClass.value == "not-allowed") camera = "/media/svg/dma/camera/e-form/png/cam-read.png"
  return camera
}

/* functions */
const disabledClass = computed(() => {
  return props.disabled ? 'disabled' : '';
});
const notAllowedClass = computed(() => {
  return props.disabled ? 'not-allowed' : 'allowed';
});

/* handlers */
const handleClickCamera = (isFromActionDelete = false) => {
  if (props.disabled) return;
  camStore.setIsActionFromDelete(isFromActionDelete)
  if (props.isMandatory && imageValues.value.length == 0) {
    camStore.setShowCloseButton(false)
  } else {
    camStore.setShowCloseButton(true)
  }
  camStore.toggleIsVisible(true, props.id);
}
const handleDelete = async (image: string) => {
  if (props.isMandatory && imageValues.value.length == 1) {
    modalVisibility.value = false;
    handleClickCamera(true)
  } else {
    if (!imageObject.value) return
    imageObject.value.ImageInfos = stringToImageInfoConvert(imageObject.value.ImageInfos)
    const index = imageObject.value.ImageInfos.findIndex((i) => {
      return i.filename == image
    })
    if (index != -1) {
      imageObject.value.ImageInfos.splice(index, 1);
      imageObject.value.ImageBlobs.splice(index, 1);
      if (imageObject.value.ImageInfos.length < 1) modalVisibility.value = false
    }
  }
}
const handleShowModal = () => {
  modalVisibility.value = true;
}
const handleHideModal = () => {
  modalVisibility.value = false;
}
const onConfirmTakePhotoCancel = () => {
  showTakeAnotherPicture.value = false;
}
const onConfirmTakeAnotherPhoto = () => {
  showTakeAnotherPicture.value = false;
  handleClickCamera();
}
</script>

<style scoped lang="scss">
.camera-wrapper {
    padding: 5px 20px;
    // height:80px;
    border: 1px solid #E4E6EF;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 0.475rem;
}
.not-allowed {
    cursor: default;
}
.allowed {
    cursor: pointer;
}
.lg-btn-icon {
  height: 34px !important;
  width: 34px !important;

  label {
    font-size: 1rem !important;
  }
}
</style>

