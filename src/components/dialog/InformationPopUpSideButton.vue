<template>
  <el-dialog
    v-model="showDialog"
    width="60%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    custom-class="oil-not-in-range__header"
    top="30vh" :center="true"
  >
    <div class="row pt-3 pb-3 text-dark modal-title" style="word-break: break-word">
      <h3>{{ titlePopUp }}</h3>
    </div>
    <div class="row pt-5 justify-content-end">
      <div class="col-md-3 col-2">
        <div class="row px-0 justify-content-end">
          <el-button type="success" class="ok-button" @click="handleClose">{{ confirmLabel }}</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  titlePopUp: {
    type: String,
    default: ''
  },
  confirmLabel: {
    type: String,
    default: "OK"
  }
});
const emits = defineEmits(["close"]);
const showDialog = computed(() => {
  return props.show
});
const handleClose = () => {
  emits("close", false)
}
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
