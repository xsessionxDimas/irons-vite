<template>
  <dropzone-uploader
    ref="singlePDFUploader"
    :is-multiple="false"
    :accepted-file="'application/pdf'"
    @on-file-dropped="onDrop"
    @on-file-cancelled="onFileDialogCancel"
  />
</template>

<script lang="ts" setup>
import {
  defineEmits,
  defineExpose,
  ref
} from 'vue';
import DropzoneUploader from "@/components/camera/DropzoneUploader.vue";

const emits = defineEmits(['onDropAttachment', 'onFileDialogCancel'])
const singlePDFUploader = ref<null | { openUploadDialog(): void }>(null);

const onFileDialogCancel = () => {
  emits("onFileDialogCancel")
};

const onDrop = async (acceptFiles) => {
  emits("onDropAttachment", acceptFiles)
};

const handleAttachmentClicked = () => {
  if (singlePDFUploader.value) {
    singlePDFUploader.value.openUploadDialog();
  }
}

defineExpose({
  handleAttachmentClicked
})
</script>
