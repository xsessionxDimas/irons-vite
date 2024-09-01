<template>
  <div>
    <div class="row m-0" :class="!isUndefined(itemValue) && itemValue.length > 0 ? 'justify-content-around' : 'justify-content-center'">
      <div class="d-flex justify-content-center" :class="!isUndefined(itemValue) && itemValue.length > 0 ? 'col-6 pe-0 ps-1' : 'col-6 px-0'">
        <button class="btn btn-sm btn-icon btn-bg-light" :disabled="readOnly" @click="handleClickAttactment">
          <img :src="attachmentColor()" style="height: 12px; width: 14px;" alt="camera">
        </button>
      </div>
      <div class="col-6 ps-0 pe-1 d-flex justify-content-center" v-if="itemValue && itemValue.length > 0">
        <button class="btn btn-sm btn-icon btn-bg-success" @click="handleShowModal" style="background-color: #18AF4A;">
          <label class="text-white">+{{ itemValue.length }}</label>
        </button>
      </div>
    </div>
    <AttachmentPreview
      :visibility="modalVisibility"
      :files="itemValue"
      :is-monitoring="!showDeleteButtonCondition"
      :show-delete-button="showDeleteButtonCondition"
      @on-close="handleHideModal"
      @on-delete="handleDeleteAttachment"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  PropType,
  defineProps,
  defineEmits
} from 'vue';
import {
  isUndefined,
} from 'lodash';
import {
  ref,
} from 'vue'
import AttachmentPreview from "./AttachmentPreview.vue";
import { FileInfo } from "@/core/types/entities/dma/FileInfo";

const props = defineProps({
  itemValue: {
    required: true,
    type: Object as PropType<FileInfo[]>
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
  mode: {
    default: ''
  },
})

const emits = defineEmits(['onAttachmentClicked', 'onAttachmentDelete'])


const modalVisibility = ref<boolean>(false);

const handleClickAttactment = () => {
  emits("onAttachmentClicked", {
    key: `${props.index}-parts`,
    mode: props.mode
  })
}

const handleDeleteAttachment = (value) => {
  emits('onAttachmentDelete', {
    index: props.index,
    filename: value,
  })
}

const attachmentColor = () => {
  // belum ada yang take pic
  let camera = "/media/svg/dma/attachment/blue.png"
  if (props.itemValue.length > 0) {
    camera = "/media/svg/dma/attachment/green.png"
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
  if (props.isDisabled) {
    return props.isDisabled
  }
  return false
})
</script>
