<template>
  <!-- Vertically centered modal -->
  <el-dialog v-model="dialogVisible" center top="30vh" :close-on-click-modal="false" :show-close="showClose" :width="widthDialog ? `${widthDialog}% !important` : ''"
    :custom-class="'confirmation'" append-to-body @closed="onCloseConfirmation">
    <span class="caption" v-html="caption"></span>
    <template #footer>
      <span class="dialog-footer" style="display:block; text-align:right" v-if="footerTemplate == 'default'">
        <el-button :disabled="disableNo" v-if="!hideNo" @click="noConfirm"
          style="box-shadow: 0px 24px 48px rgba(145, 158, 171, 0.2)">{{ noLabel }}</el-button>
        <el-button :disabled="disableYes" class="button-OK-confirmation" v-if="!hideYes" type="success"
          @click.prevent="yesConfirm"
          :style="`background:${yesButtonBackroundColor}; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white`">{{
            yesLabel }}</el-button>
      </span>
      <span class="dialog-footer" style="display: flex; justify-content: space-around;" v-else-if="footerTemplate == '50-50'">
        <el-button :disabled="disableNo" v-if="!hideNo" @click="noConfirm"
          style="width: 50%; box-shadow: 0px 24px 48px rgba(145, 158, 171, 0.2)">{{ noLabel }}</el-button>
        <el-button :disabled="disableYes" class="button-OK-confirmation" v-if="!hideYes" type="success"
          @click.prevent="yesConfirm"
          :style="`background:${yesButtonBackroundColor}; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white; width: 50%;`">{{
            yesLabel }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  caption: {
    required: true,
    type: String
  },
  showClose: {
    default: false,
  },
  yesLabel: {
    default: 'Yes',
  },
  noLabel: {
    default: 'No'
  },
  hideNo: {
    default: false
  },
  hideYes: {
    default: false
  },
  disableYes: {
    default: false
  },
  disableNo: {
    default: false
  },
  yesButtonBackroundColor: {
    default: '#18AF4A'
  },
  widthDialog: {
    default: 0
  },
  footerTemplate: {
    default: "default"
  }
});

const emits = defineEmits([
  "onNoConfirm",
  "onYesConfirm",
  "onClose"
])
const dialogVisible = computed(() => {
  return props.visibility;
});

/* methods */
const noConfirm = () => {
  emits("onNoConfirm");
}
const yesConfirm = () => {
  emits("onYesConfirm");
}
const onCloseConfirmation = () => {
  emits("onClose")
}
</script>

<style lang="scss">
.confirmation {
  width: 360px !important;
  padding: 10px 0px 0px;
  gap: 8px;

  .confirmation .el-dialog__header {
    display: none;
    padding: 0 !important;
  }

  .caption {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #212B36;
    flex: none;
    order: 0;
    flex-grow: 0;
    word-break: break-word;
  }

  .is-disabled {
    &.is-disabled {
      opacity: 0.6;
    }
  }
}
</style>
