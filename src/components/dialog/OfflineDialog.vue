<template>
    <el-dialog
      v-model="showDialog"
      width="400px"
      :show-close="false"
      custom-class="message-box-custom oil-not-in-range__header p-0"
      top="30vh" :center="true"
      :close-on-click-modal="false"
      :close-on-press-escape = "false">
      <div class="row text-center pb-5 pt-5 text-dark processing-time-container">
        <div class="icon mb-4">
          <NwImg src="/media/icons/bumaau/danger.png" width="64" height="64" alt="warning" />
        </div>
        <p class="text-bold mb-0" style="font-size: 16px; word-break: break-word;">
          No Network Available
        </p>
        <p class="text-bold mb-2" style="font-size: 16px; word-break: break-word;">
          Ironforms is now in Offline Mode
        </p>
        <p class="text-bold mb-2" style="font-size: 16px; word-break: break-word;">
          Please make sure to connect to "BUMA Corporate".
        </p>
        <p class="text-bold my-2" style="font-size: 16px; word-break: break-word;">
          Please do not turn off your device until the data has finished syncing.
        </p>
      </div>
      <p style="text-align: center;" v-if="!error"><span><strong>WO Number {{ workOrder }} saved in local device</strong></span></p>
      <div class="d-flex flex-row-reverse" v-if="error">
        <a href="#" @click.stop="() => {}">Retry</a>
      </div>
      <div class="row text-center">
        <el-button type="success" style="background-color:#18AF4A" @click="handleClose">Go To Homepage</el-button>
      </div>
    </el-dialog>
  </template>

<script lang="ts" setup>
import { defineProps, defineEmits, toRef } from 'vue';

const props = defineProps({
  visibility: {
    type: Boolean,
    required: true
  },
  error: {
    type: Boolean,
    required: true,
    default: false
  },
  workOrder: {
    type: String,
    required: true
  }
});
const emits = defineEmits(["close"]);
const handleClose = () => {
  emits("close")
}
const showDialog = toRef(props, "visibility");
</script>

<style lang="scss">
.message-box-custom {
  min-width: 440px;
}
i.el-alert__icon {
  color: #67c23a !important
}
.el-alert__title {
    font-size: var(--el-alert-title-font-size);
    line-height: 18px;
    font-weight: 700;
    color: gray;
}
.el-alert--success {
  --el-alert-background-color: #F5FFC9;
}
</style>
