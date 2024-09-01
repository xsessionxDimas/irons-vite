<template>
    <div v-bind="getRootProps()">
      <input :class="randomClassName" v-bind="getInputProps()" :accept="acceptedFile" />
    </div>
</template>

<script lang="ts" setup>
import { generateString } from '@/store/pinia/dma/e-form/helpers'
import {
  defineProps,
  defineEmits,
  defineExpose,
  ref
} from 'vue'
import { useDropzone } from 'vue3-dropzone'

const props = defineProps({
  isMultiple: {
    type: Boolean,
    required: true,
    default: true
  },
  acceptedFile: {
    required: false,
    type: String,
    default: "*/*",
  }
})

const randomClassName = ref(generateString(15))

const emits = defineEmits([
  'onFileDropped',
  'onFileCancelled',
])

const onDrop = async (acceptFiles) => {
  emits('onFileDropped', acceptFiles)
  const input = document.getElementsByClassName(randomClassName.value)[0] as HTMLFormElement
  input.value = null
}
const onFileDialogCancel = () => {
  emits('onFileCancelled', null)
}
const { getRootProps, getInputProps } = useDropzone({
  onDrop,
  onFileDialogCancel,
  multiple: props.isMultiple
})

const openUploadDialog = () => {
  const input = document.getElementsByClassName(randomClassName.value)[0] as HTMLButtonElement
  input?.click()
}

defineExpose({
  openUploadDialog
})
</script>

