<template>
  <div :class="[paddingBottomCondition]" class="pt-2">
    <div
      class="row"
      :class="!isUndefined(imageRef) && imageRef.length > 0 ? 'd-flex' : ''"
    >
      <button
        class="btn btn-sm btn-icon btn-bg-light me-5"
        @click="handleClickCamera()"
        :disabled="readOnly"
      >
        <img :src="cameraColor()" style="height: 12px; width: 14px" alt="camera" />
      </button>
      <template v-if="imageValues && imageValues.length > 0">
        <button
          class="btn btn-sm btn-icon btn-bg-success"
          @click="handleShowModal"
          style="background-color: #18af4a"
        >
          <label class="text-white">+{{ imageValues.length }}</label>
        </button>
      </template>
    </div>
    <template v-if="modalVisibility">
      <ImagePreviewCabSide
        v-if="isReplacement"
        ref="preview"
        :images="(imageValues as ImageInfo[])"
        :visibility="modalVisibility"
        :view-only="false"
        @on-close="handleHideModal"
        @on-delete="deleteImage"
      />
      <ImageListModal
        v-else
        :images="(imageValues as ImageInfo[])"
        :visibility="modalVisibility"
        :showDeleteButton="showDeleteButtonCondition"
        @handle-close="handleHideModal"
        @handle-delete="deleteImage"
        :showRemainingPhotosMessage="isMandatory"
      />
    </template>
    <TakeReplacementPhoto
      :show="showReplacementConfirmation"
      :item="props.item"
      :tool="replacementTool"
      side="off cab side"
      @close="onConfirmTakeAnotherPhoto"  />
    <Confirmation
      :visibility="showTakeAnotherPicture"
      caption="The photo successfully taken, would you like to take another photo?"
      @on-no-confirm="onConfirmTakePhotoCancel"
      @on-yes-confirm="onConfirmTakeAnotherPhoto"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import { isUndefined, cloneDeep } from "lodash";
import {
  defineProps,
  PropType,
  toRef,
  ref,
  watch,
  defineEmits
} from "vue";
import ImagePreviewCabSide from '@/components/camera/ImagePreviewCabSide.vue';
import ImageListModal from '@/components/pbi/modals/overwrite-cbm/item/ImageListModal.vue';
import { useCameraStore } from "@/store/pinia/application/useCameraStore";
import Confirmation from "@/components/dialog/CameraConfirmation.vue";
import TakeReplacementPhoto from "@/components/dialog/TakeReplacementPhoto.vue";
import { Audit } from "@/core/types/intervention/Audit";
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo";
import { Item } from '@/core/types/entities/dma/e-form/Item';
import { DeleteImageParam } from "@/core/types/misc/DeleteImageParam";

const props = defineProps({
  itemkey: {
    default: "modifiedCBM",
  },
  images: {
    type: Object as PropType<string[] | string>,
    required: true,
  },
  isMandatory: {
    type: Boolean,
    required: false,
    default: false
  },
  isReplacement: {
    type: Boolean,
    required: false,
    default: false
  },
  item: {
    type: Object as PropType<Item>,
    required: false
  },
  sectionData: {
    type: String
  },
});

const emits = defineEmits(["onHandleImages"]);
const showReplacementConfirmation = ref(false)

const imageRef = toRef(props, "images");
const modalVisibility = ref<boolean>(false);
const camStore = useCameraStore();

const imageValues = computed(() => {
  if (!imageRef.value) return [] as ImageInfo[];
  return imageRef.value;
});

const handleClickCamera = (isFromActionDelete = false) => {
  camStore.setIsReplacementCamera(props.isReplacement);
  camStore.toggleIsVisible(true, props.itemkey);
  camStore.setIsActionFromDelete(isFromActionDelete);
  if (props.isReplacement) {
    camStore.setShowCloseButton(!props.isMandatory);
  } else {
    camStore.setShowCloseButton(props.isMandatory ? imageRef.value.length > 0 : !props.isMandatory);
  }
  showReplacementConfirmation.value = false;
};

const imageObject = computed(() => {
  return cloneDeep(
    camStore.ImageObjects.find((i) => {
      return i.Id === props.itemkey;
    })
  );
});

const replacementTool = computed(() => {
  let toolType = ''
  switch (props.sectionData) {
    case "HV Alternator":
      toolType = "alternator"
      break;
    case "Retarder Grid Box 1":
    case "Retarder Grid Box 2":
      toolType = "blower motor"
      break;
  }
  return toolType
})

const cameraColor = () => {
  // belum ada yang take pic
  let camera = "/media/svg/dma/camera/e-form/png/cam-active.png";
  // user yang take pic
  if (imageValues.value.length > 0) {
    camera = "/media/svg/dma/camera/e-form/png/cam-user.png";
  }
  return camera;
};

const showDeleteButtonCondition = computed(() => {
  if (props.isMandatory && imageValues.value.length > 1) {
    return true;
  } else if (!props.isMandatory) {
    return true;
  } else {
    return false;
  }
});

const handleShowModal = () => {
  modalVisibility.value = true;
};

const handleHideModal = () => {
  modalVisibility.value = false;
};

const deleteImage = async (param: DeleteImageParam) => {
  const arr = imageRef.value;
  const paramPhoto = param.filename ? param.filename : param;
  const filteredArr = arr.filter((img) => {
    return img.filename != paramPhoto;
  })
  camStore.setCurrent(props.itemkey);
  emits("onHandleImages", filteredArr);
  camStore.clearCurrent()
  if (props.isReplacement) {
    camStore.setIsReplacementCamera(props.isReplacement)
    if (filteredArr.length < 2) {
      camStore.setReplacementPosition(param.type)
      onConfirmTakeAnotherPhoto()
    }
  }
  if (filteredArr.length == 0) handleHideModal();
};

const showTakeAnotherPicture = ref(false);

const onConfirmTakePhotoCancel = () => {
  showTakeAnotherPicture.value = false;
};
const onConfirmTakeAnotherPhoto = () => {
  showTakeAnotherPicture.value = false;
  handleClickCamera();
};

const handlePostData = async () => {
  showReplacementConfirmation.value = false

  const images = camStore.ImageObjects.find((i) => {
    return i.Id === props.itemkey;
  });
  const finalImages = images ? [...imageRef.value, ...images.ImageInfos] : [];
  camStore.clearCurrent();
  emits("onHandleImages", finalImages);
  if (props.isReplacement && finalImages.length <= 1) {
    showReplacementConfirmation.value = true;
    camStore.setReplacementPhotoLength(finalImages.length)
    camStore.setIsActionFromDelete(false)
  }
};

const readOnly = computed(() => {
  let isReplacementPhotoFulfilled = false
  if (props.isReplacement && imageValues.value.length === 2) {
    isReplacementPhotoFulfilled = true
  }
  return isReplacementPhotoFulfilled;
});

watch(
  imageObject,
  async (newVal, oldVal) => {
    if (newVal && newVal.ImageInfos.length > 0) {
      if (newVal.ImageInfos.length != oldVal?.ImageInfos.length) {
        await handlePostData();
        handleHideModal();
      }
    }
  },
  { deep: true }
);

const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2";
  if (props.task?.updatedBy && (props.task.updatedBy as Audit).name) paddingBottom = "";
  return paddingBottom;
});
</script>
