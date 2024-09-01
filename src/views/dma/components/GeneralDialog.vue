<template>
  <el-dialog
    v-model="showDialog"
    width="40%"
    :show-close="false"
    custom-class="oil-not-in-range__header"
    top="30vh" :center="true"
    :close-on-click-modal="modalClose"
    :close-on-press-escape="modalClose"
  >
    <div class="row text-center pt-3 pb-3 text-dark" :class="textWrapper">
      <h3 :class="textBody">{{ modalMessage }}</h3>
    </div>
    <div class="row text-center pt-5">
      <el-button type="success" class="ok-button" @click="handleClose">{{ buttonText }}</el-button>
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
  modalType: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: false,
    default: "SMU"
  },
  message: {
    type: String,
    required: false
  },
  wordBreaker: {
    type: Boolean,
    required: false,
    default: false
  }
});
const emits = defineEmits(["close"]);

const showDialog = computed(() => {
  return props.show
})

const messageDialog = computed(() => {
  return props.message || 'Form is not available yet'
})

const handleClose = () => {
  emits("close")
}

const modalMessage = computed(() => {
  switch (props.modalType) {
    case 'alreadyClose':
      return 'Failed to update data, service sheet status is Close';
    case 'alreadySubmitted':
      return 'Sorry, form is already submitted by other fitter';
    case 'notReady':
      return messageDialog.value;
    case 'alreadyFilled':
      return `${props.type} has already been filled by other Service Labour Personnel`;
    case 'notMapped':
      return 'SMU Tolerance has not been mapped yet, please insert mapping on Iron Lake web first';
    case 'alreadyUpdated':
      return 'Task already updated by other service person or fitter';
    case 'taskError':
      return props.message;
    case 'errorSync':
      return props.message
    default:
      return '';
  }
})

const modalClose = computed(() => {
  if (props.modalType == 'notReady') {
    return false
  }
});

const buttonText = computed(() => {
  if (props.modalType == 'notReady') {
    return 'Go To Home'
  }
  return 'Ok'
});

const textWrapper = computed(() => {
  if (['notMapped', 'alreadyUpdated', 'taskError'].includes(props.modalType)) {
    return 'modal-title'
  }
});

const textBody = computed(() => {
  if (props.modalType == 'notReady') {
    return 'text-message'
  }
  if (props.wordBreaker) {
    return 'word-breaker'
  }
});
</script>

<style lang="scss">
  .oil-not-in-range__header {
    .el-dialog__header {
      border-bottom: none !important;
    }

    .modal-title {
      word-break: keep-all;

      h3 {
        line-height: 1.6
      }
    }
  }

  .ok-button {
    background-color: #18AF4A;
  }

  .text-message {
    word-break: normal;
  }
  .word-breaker {
    word-break: break-word;
  }
</style>
