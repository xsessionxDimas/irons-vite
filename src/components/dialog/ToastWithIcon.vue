<template>
  <el-dialog
    v-model="showDialog"
    width="45%"
    :show-close="false"
    custom-class="message-box-custom oil-not-in-range__header p-0 success-box"
    top="30vh"
    :center="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <div class="row text-center pb-5 pt-5 text-dark processing-time-container">
      <div class="icon mb-4">
        <img :src="icon" alt="icon"/>
      </div>
      <h3 class="mb-2 text-break">{{ message }}</h3>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, toRef } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    default: "Data successfully submitted",
  },
  icon: {
    type: String,
    default: "/media/svg/dma/green-checklist.png",
  },
});
const showDialog = toRef(props, "show");
</script>

<style lang="scss">
.message-box-custom {
  min-width: 440px;
}
</style>
