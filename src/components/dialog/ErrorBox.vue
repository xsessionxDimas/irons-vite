<template>
    <el-dialog
      v-model="showDialog"
      width="45%"
      :show-close="false"
      custom-class="message-box-custom oil-not-in-range__header p-0"
      top="30vh" :center="true"
      :close-on-click-modal="false"
      :close-on-press-escape = "false">
      <div class="row text-center pb-5 pt-5 text-dark processing-time-container">
        <div class="icon mb-4">
          <NwImg src="/static/red-error.jpg" width="84" height="84" />
        </div>
        <h3 class="mb-2">{{ message }}</h3>
      </div>
      <div class="row text-center pt-5">
        <el-button type="success" style="background-color:#18AF4A" @click="handleClose">Close</el-button>
      </div>
    </el-dialog>
  </template>

<script lang="ts" setup>
import { defineProps, defineEmits, toRef } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    default: 'Failed caused by lost internet connection'
  }
});
const emits = defineEmits(["close"]);
const handleClose = () => {
  emits("close")
}
const showDialog = toRef(props, "show");
</script>

<style lang="scss">
.message-box-custom {
  min-width: 440px;
}
</style>
