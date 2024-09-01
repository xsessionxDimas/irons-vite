<template>
  <el-dialog
    v-model='show'
    width='50%'
    center
    custom-class="outer-dialog"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape = "false"
    @open="onFormOpen"
    destroy-on-close>
    <template #title>
      <span class="el-dialog__title" style="word-break: break-word !important;">Are you sure want to add description on this photo?</span>
    </template>
    <div>
      <div class="mt-1 py-2" style="word-break: break-word !important;">
        <div class="d-flex flex-column">
          <Textarea
            :value="imageDescription"
            label="Description"
            name="Description"
            @handleChange="onDescriptionChange"
          ></Textarea>
        </div>
      </div>
      <div class="row pt-5 justify-content-end">
      <div class="col-md-2 col-2">
        <div class="row px-0 justify-content-end px-1">
          <el-button style="background-color: white; color: black; border: 1px solid gainsboro;" @click="cancelAddDescription">No</el-button>
        </div>
      </div>
      <div class="col-md-3 col-lg-2 col-3">
        <div class="row px-0 justify-content-end px-1">
          <el-button :disabled="imageDescription == ''" type="success" class="ok-button" @click="submitDescription">Submit</el-button>
        </div>
      </div>
    </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import Textarea from '@/components/inputs/dma/Textarea.vue'
import { TextareaParam } from '@/core/types/misc/TextareaParam'
import {
  defineProps,
  defineEmits,
  computed,
  ref
} from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

const emits = defineEmits(['onClose', 'onSaveDesc'])
const imageDescription = ref('')
const show = computed(() => {
  return props.isVisible
})
const onDescriptionChange = (param : TextareaParam) => {
  imageDescription.value = param.value
}
const submitDescription = () => {
  emits('onSaveDesc', imageDescription.value)
}
const cancelAddDescription = () => {
  emits('onClose')
}
const onFormOpen = () => {
  console.log(props.description)
  imageDescription.value = props.description
}
</script>
<style>
  .el-dialog__title {
    text-align: start;
  }
</style>
