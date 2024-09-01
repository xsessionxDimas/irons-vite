<template>
  <el-dialog
    v-model="showDialog"
    width="40%"
    :show-close="false"
    custom-class="oil-not-in-range__header"
    top="30vh" :center="true"
    :close-on-click-modal="false"
    :close-on-press-escape = "false">
    <div class="row pt-3 pb-3 text-dark modal-title">
      <h3>Cannot Upload these following files, make sure the uploaded file is {{ articleRule }} {{ file }} file</h3>
      <h4 class="pt-2" v-for="imgName in imageList" :key="imgName">&#9679; {{ imgName }}</h4>
    </div>
    <div class="row text-center pt-5">
      <el-button type="success" class="ok-button" @click="handleClose">Ok</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { isVowel } from '@/store/pinia/dma/e-form/helpers';
import { computed } from '@vue/reactivity';
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  imageList: {
    default: () => {
      return [] as string[]
    }
  },
  fileType: {
    default: "image",
    type: String
  }
});
const emits = defineEmits(["close"]);
const showDialog = computed(() => {
  return props.show
});
const file = computed(() => {
  if (!props.fileType) {
    return "image"
  }
  return props.fileType
})
const handleClose = () => {
  emits("close")
}
const articleRule = computed(() => {
  if (isVowel(file.value)) {
    return "an"
  }
  return "a"
})
</script>

<style lang="scss">
  .oil-not-in-range__header {
    .el-dialog__header {
      border-bottom: none !important;
    }
  }
  .ok-button {
    background-color: #18AF4A;
  }
</style>
