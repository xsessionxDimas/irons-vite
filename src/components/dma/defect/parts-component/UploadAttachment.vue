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
      @on-change-attachment="setAttachment"
    />
    <dropzone-uploader
      ref="singlePDFUploader"
      :is-multiple="false"
      :accepted-file="'application/pdf'"
      @on-file-dropped="onDrop"
      @on-file-cancelled="onFileDialogCancel"
    />
    <UploadImageFailureDialog
      :show="showErrorDialog"
      @close="closeShowErrorDialog"
      :imageList="errorFileNameArr"
      fileType="PDF"
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
  cloneDeep,
  isUndefined,
} from 'lodash';
import {
  ref,
} from 'vue'
import {
  generateString
} from '@/store/pinia/dma/e-form/helpers';
import DropzoneUploader from "@/components/camera/DropzoneUploader.vue";
import AttachmentPreview from "./AttachmentPreview.vue";
import UploadImageFailureDialog from "@/components/camera/UploadImageFailureDialog.vue";
import { ElLoading } from 'element-plus';
import {
  useAttachmentStore
} from "@/store/pinia/dma/e-form/attachments/useAttachmentStore"
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { FileInfo } from "@/core/types/entities/dma/FileInfo";

// stores
const attachmentStore = useAttachmentStore();
const authStore = useAuthenticationStore();

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
  }
})

const emits = defineEmits(['handleChangeAttachment'])


const singlePDFUploader = ref<null | { openUploadDialog(): void }>(null);
const showErrorDialog = ref(false);
const errorFileNameArr = ref<string[]>([]);
const modalVisibility = ref<boolean>(false);

const handleClickAttactment = () => {
  if (singlePDFUploader.value) {
    singlePDFUploader.value.openUploadDialog();
  }
}

const closeShowErrorDialog = () => {
  showErrorDialog.value = false;
};

const onFileDialogCancel = () => {
  // do nothing
};

const onDrop = async (acceptFiles) => {
  errorFileNameArr.value = [];
  const loading = ElLoading.service({
    lock: true,
    text: "Uploading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  let isFilePassValidation = true;
  // check if all files is not more than 1mb
  const validFileTypes = ["application/pdf"];
  if (
    acceptFiles[0].size > 2097152 ||
    !validFileTypes.includes(acceptFiles[0].type)
  ) {
    isFilePassValidation = false;
    errorFileNameArr.value.push(acceptFiles[0].name);
  }
  if (!isFilePassValidation) {
    if (errorFileNameArr.value.length > 0) showErrorDialog.value = true;
  } else {
    // upload to uploadAttactment
    const blob = new Blob([acceptFiles[0]], {
      type: "application/pdf"
    });
    let fileName = generateString(15);
    const payload = new FormData();
    payload.append("files", blob, encodeURI(`${fileName}.pdf`));
    payload.append("userAccount", authStore.user.Email);
    const promise = await attachmentStore.uploadAttachment(
      payload,
      authStore.user.Email,
    );
    Promise.all([promise]).then((res) => {
      if (typeof res[0] == "string") {
        const newVal = cloneDeep(props.itemValue)
        newVal.push({
          filename: acceptFiles[0].name,
          url: fileName,
        })
        setAttachment(newVal)
      }
    });
  }
  loading.close();
};

const setAttachment = (value) => {
  emits('handleChangeAttachment', {
    index: props.index,
    value: value
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
