<template>
  <div
    v-bind="getRootProps()"
    :class="isLoadingSubmitSuccess ? 'dropzone-upload-excel-success' : ''"
    class="dropzone-upload dropzone-upload-excel mb-3">
    <input
      v-bind="getInputProps()"
      :disabled="isLoadingSubmitSuccess || disableUpload ? true : false" />
    <div
      v-if="isLoadingSubmitSuccess"
      class="dropzone-upload-area-text text-color-dark excel-upload-success">
      <span
        class="svg-icon svg-icon-2x excel-upload-success-close-icon"
        @click="handleClose()">
        <inline-svg src="/media/icons/duotune/general/gen040.svg" />
      </span>
      <div class="excel-upload-success-content">
        <p :class="loadingUpload ? 'text-gray-600' : ''">
          {{ uploadedFileSize }}
        </p>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="uploadedFileName"
          placement="top">
          <p
            :class="loadingUpload ? 'text-gray-600' : ''"
            class="excel-upload-success-content-file-name">
            {{ uploadedFileName }}
          </p>
        </el-tooltip>
      </div>
      <el-progress
        v-if="loadingUpload"
        :indeterminate="true"
        :percentage="loadingUploadPercentage"
        :stroke-width="14"
        class="loading-upload-bar"
     />
    </div>
    <div
      v-if="loadingUploadPercentage > 0"
      :class="loadingUploadPercentage > 0 ? 'dropzone-upload-disable' : ''"
      class="dropzone-upload-area"
    ></div>
    <div v-else class="dropzone-upload-area">
      <div class="dropzone-upload-area-icon">
        <span class="svg-icon svg-icon-3x svg-icon-primary">
          <inline-svg src="/media/icons/duotune/files/fil010.svg" />
        </span>
      </div>
      <div class="dropzone-upload-area-text text-color-dark">
        <p>Drop files here or click to upload</p>
        <span>Max upload 1 file{{ skipSizeValidation ? ''  : ' and Max size is 2 MB'}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { swalAlertErrorBulk } from "@/core/helpers/sweet-alert"
import {
  defineProps,
  defineEmits,
  computed,
  onUnmounted,
  ref,
  defineExpose
} from "vue"
import { useDropzone } from 'vue3-dropzone'

const props = defineProps({
  isSubmissionUploadSuccess: {
    type: Boolean,
  },
  accept: {
    default: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
  },
  errorMessage: {
    required: false,
    type: String,
  },
  skipSizeValidation: {
    required: false,
    type: Boolean,
    default: false
  }
})
const emits = defineEmits([
  "handleUpload",
  "handleCloseUploadedFile",
  "handleSetIsExcelFileUploaded"
])

const loadingUpload = ref<boolean>(false)
const disableUpload = ref<boolean>(false)
const uploadedFileName = ref<string>("")
const uploadedFileSize = ref<string>("")
const loadingUploadPercentage = ref(0)

const isLoadingSubmitSuccess = computed(() => {
  return (
    loadingUploadPercentage.value > 0 && props.isSubmissionUploadSuccess
  )
})


const onDrop = async (acceptFiles, rejectReasons) => {
  emits("handleSetIsExcelFileUploaded", false)
  if (acceptFiles.length < 1) {
    const checkToManyFileOnDrop = rejectReasons[0]?.errors?.some((e) => {
      return e.code === 'too-many-files'
    }) // check if file excel on drop is more 1 file
    if (checkToManyFileOnDrop) {
      const error = props.errorMessage || "Only accept one excel file"
      swalAlertErrorBulk(error);
    } else {
      const error = props.errorMessage || "Only accept excel file"
      swalAlertErrorBulk(error);
    }
    return
  }

  const fileSize = Math.floor((acceptFiles[0].size / 1000000) * 100) / 100;
  const isImage = acceptFiles[0].type.includes("image");

  if (props.skipSizeValidation) {
  // Skip size validation for images (media library)
    if (!isImage && fileSize > 5) {
      swalAlertErrorBulk("Max file size: 5 MB");
      return;
    }
  } else {
  // Validate size for all files, 2MB limit (default)
    if (fileSize > 2) {
      swalAlertErrorBulk("File size is too big");
      return;
    }
  }

  const payloadExcel = new FormData()
  payloadExcel.append("fileUpload", acceptFiles[0])
  await emits("handleUpload", payloadExcel)
  uploadedFileName.value = acceptFiles[0].name
  uploadedFileSize.value = `${
    Math.floor((acceptFiles[0].size / 1000000) * 100) / 100
  } Mb`

  if (props.isSubmissionUploadSuccess) {
    disableUpload.value = true
    loadingUploadPercentage.value =
      (loadingUploadPercentage.value % 100) + 50
  } else {
    loadingUploadPercentage.value = 0
    loadingUpload.value = false
  }

  if (loadingUploadPercentage.value === 50) {
    setTimeout(() => {
      loadingUpload.value = false
    }, 2000)
  }
}

const resetInput = () => {
  uploadedFileName.value = ''
  uploadedFileSize.value = ''
}

const handleClose = () => {
  emits("handleCloseUploadedFile")
  disableUpload.value = false
  setTimeout(() => {
    loadingUploadPercentage.value = 0
  }, 500)
}

const { getRootProps, getInputProps } = useDropzone({
  onDrop,
  maxFiles: 1,
  multiple: false,
  accept: props.accept,
})

onUnmounted(() => {
  handleClose()
})

defineExpose({
  resetInput
})
</script>

<style lang="scss">
.dropzone-upload {
  &-excel {
    position: relative;

    &-success {
      height: 146px;
    }
  }

  &-disable:hover {
    cursor: not-allowed;
  }

  .el-progress__text {
    display: none;
  }
}

.excel-upload-success {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  background-color: #fafafa;
  padding: 1rem;
  display: flex;
  align-items: center;
  position: absolute;
  top: 1rem;
  left: 0;
  right: 0;

  &:hover {
    cursor: initial;
  }

  &-content {
    &-file-name {
      white-space: nowrap;
      width: 94px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    p {
      text-align: center;
    }
  }

  .loading-upload-bar {
    width: 80%;
    margin: 0 auto;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &-close-icon {
    position: absolute;
    top: -11px;
    right: -11px;

    &:hover {
      cursor: pointer;
    }
  }
}

.dropzone {
  width: 100%;
  background: #e3f2fd;
  border: 1px dashed #009ef7;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 15px;
  flex: 1;
  display: flex;
  margin-bottom: 24px;
}
</style>
