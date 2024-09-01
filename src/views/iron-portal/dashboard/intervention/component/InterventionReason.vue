<template>
  <div class="fv-row custom-text-input">
    <!--begin::Label-->
    <label :class="`form-label fs-6 fw-bolder text-white`">Intervention Reason</label>
    <!--end::Label-->
    <p ref="paragraphRef" class="disabled-textarea" v-html="formattedParagraph" :style="{ overflow: 'auto' }"></p>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  toRef,
  computed,
  onMounted,
  ref,
} from 'vue'

const props = defineProps({
  paragraph: {
    required: true,
    default: ""
  }
})

const paragraphValue = toRef(props, "paragraph")
const paragraphRef = ref(null)


const formattedParagraph = computed(() => {
  return paragraphValue.value.replace(/CRITICAL/gi, '<span class="text-critical">CRITICAL</span>').replace(/CAUTION/gi, '<span class="text-caution">CAUTION</span>').replace(/NORMAL/gi, '<span class="text-normal-inv">NORMAL</span>');
})
const shouldOverflow = ref(true)

onMounted(() => {
  if (paragraphRef.value) {
    shouldOverflow.value = paragraphRef.value.scrollHeight > paragraphRef.value.clientHeight
  }
})
</script>

<style scoped>
  .critical {
    color: red;
  }
  .disabled-textarea {
    display: inline-block;
    width: 100%;
    height: 200px;
    padding: 10px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #bec2d3;
    /* color: #909399; */
    font-size: 14px;
    line-height: 1.5;
    resize: none;
    cursor: not-allowed;
    opacity: 0.99;
    overflow: hidden; /* Tambahkan overflow: hidden untuk menghindari tampilan scroll saat tidak diperlukan */
    }
</style>

