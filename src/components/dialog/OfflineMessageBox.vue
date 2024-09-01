<template>
    <el-dialog
      v-model="showDialog"
      width="45%"
      :show-close="false"
      custom-class="message-box-custom oil-not-in-range__header p-0 success-box"
      top="30vh" :center="true"
      :close-on-click-modal="false"
      :close-on-press-escape = "false">
      <div class="row text-center pb-5 pt-5 text-dark processing-time-container">
        <div class="icon mb-4">
          <img :src="icon" />
        </div>
        <h3 class="mb-2">{{ message }}</h3>
      </div>
      <div class="row text-center pt-5" :class="showLeftButton ? 'justify-content-evenly' : ''">
        <el-button v-if="showLeftButton" :style="styleObjectLeftButton" class="col-5" @click="handleLeftButton">{{ leftButtonLabel }}</el-button>
        <el-button :style="styleObjectRightButton" :class="showLeftButton ? 'col-5': 'col'" @click="handleClose">Close</el-button>
      </div>
    </el-dialog>
  </template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  toRef,
  ref
} from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    default: 'Data successfully submitted'
  },
  icon: {
    type: String,
    default: '/media/svg/dma/green-checklist.png'
  },
  showLeftButton: {
    type: Boolean,
    required: false,
    default: false
  },
  leftButtonLabel: {
    type: String,
    default: ''
  },
  backgroundLeftButton: {
    type: String,
    default: "#FFF"
  },
  colorLeftButton: {
    type: String,
    default: "#18AF4A"
  },
  borderColorLeftButton: {
    type: String,
    default: "#18AF4A"
  },
  backgroundRightButton: {
    type: String,
    default: "#18AF4A"
  },
  colorRightButton: {
    type: String,
    default: "#FFF"
  },
  borderColorRightButton: {
    type: String,
    default: "#18AF4A"
  },
});
const emits = defineEmits(["close", "leftButtonAction"]);
const handleClose = () => {
  emits("close")
}

const handleLeftButton = () => {
  emits('leftButtonAction')
}

const showDialog = toRef(props, "show");

const styleObjectLeftButton = ref({
  color: `${props.colorLeftButton}`,
  border: `1px solid ${props.borderColorLeftButton}`,
  "background-color": `${props.backgroundLeftButton}`,
})

const styleObjectRightButton = ref({
  color: `${props.colorRightButton}`,
  border: `1px solid ${props.borderColorRightButton}`,
  "background-color": `${props.backgroundRightButton}`,
})
</script>

<style lang="scss">
.message-box-custom {
  min-width: 440px;
}

.success-box {
  z-index: 9999 !important;
}
</style>
