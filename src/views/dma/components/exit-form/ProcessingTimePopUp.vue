<template>
  <el-dialog
    v-model="showDialog"
    width="45%"
    :show-close="false"
    custom-class="oil-not-in-range__header p-0"
    top="30vh" :center="true"
    :close-on-click-modal="false"
    :close-on-press-escape = "false"
  >
    <div class="row text-center pb-5 pt-5 text-dark processing-time-container">
      <div class="icon mb-4">
        <img src="/media/svg/dma/green-checklist.png" />
      </div>
      <h3 class="mb-2">Thank You</h3>
    </div>
    <div class="row text-center pt-5">
      <el-button type="success" class="ok-button" @click="handleClose">Go To Homepage</el-button>
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
  time: {
    type: String,
    default: "00:00"
  }
});
const emits = defineEmits(["close"]);

const showDialog = computed(() => {
  return props.show
})

const handleClose = () => {
  emits("close")
}
</script>

<style lang="scss">
  .oil-not-in-range__header {
    .el-dialog__header {
      border-bottom: none !important;
      padding: 0 !important;
    }
  }

  .ok-button {
    background-color: #18AF4A;
  }

  .processing-time-container {
    span {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      color: #212B36
    }
  }
</style>
