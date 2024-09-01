<template>
    <div class="py-2 ps-0 pe-2 w-100">
        <div class="d-flex align-items-center">
            <div class="d-flex w-100 align-items-center camera-wrapper py-2" :class="disabledClass">
                <div class="flex-fill large-camera-container">
                    <span :class="mandatoryLabelClass">{{ `Please take a photo of the ${props.id} identified` }}</span>
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
    <template v-if="modalVisibility">
        <ImageListModal
            :images="imageValues"
            :visibility="modalVisibility"
            :showDeleteButton="props.allowDelete"
            @handle-close="handleHideModal"
            @handle-delete="handleDelete"   />
    </template>
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
import ImageListModal from '@/views/dma/e-form-offline/sub-group/task-group/task/item/small-camera/ImageListModal.vue';
import {
  useOfflineCameraStore
} from '@/store/pinia/application/useOfflineCameraStore';
import Confirmation from '@/components/dialog/CameraConfirmation.vue';
import { ImageObject } from '@/core/types/entities/dma/ImageObject';

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
  isMandatory: {
    type: Boolean,
    default: false
  },
  hasSubmitted: {
    type: Boolean,
    default: false
  }
});

/* stores */
const camStore = useOfflineCameraStore();

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
  return imageObject.value?.ImageInfos ?? [] as string[]
});

const cameraColor = () => {
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
const mandatoryLabelClass = computed(() => {
  const countImg = imageCount.value ?? 0;
  if (!props.isMandatory) {
    return 'mandatory-label';
  }

  const isValid = countImg > 0 || !props.hasSubmitted;
  return isValid ? 'mandatory-label' : 'mandatory-label error';
});

/* handlers */
const handleClickCamera = (isFromActionDelete = false) => {
  if (props.disabled) return;
  camStore.setIsActionFromDelete(isFromActionDelete)
  camStore.toggleIsVisible(true, props.id);
  if (props.isMandatory && imageValues.value.length == 0) {
    camStore.setShowCloseButton(false)
  } else {
    camStore.setShowCloseButton(true)
  }
}
const handleShowModal = () => {
  modalVisibility.value = true;
}
const handleHideModal = () => {
  modalVisibility.value = false;
}
const handleDelete = async (image) => {
  if (props.isMandatory && imageValues.value.length == 1) {
    modalVisibility.value = false;
    handleClickCamera(true)
  } else {
    const index = imageObject.value?.ImageInfos.findIndex((i) => {
      return i === image
    }) as number;
    if (index != -1) {
      imageObject.value?.ImageInfos.splice(index, 1);
      imageObject.value?.ImageBlobs.splice(index, 1);
    }
  }
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
.mandatory-label {
  color: #212B36;
  &.error {
    color: #FF4842;
  }
}
</style>

