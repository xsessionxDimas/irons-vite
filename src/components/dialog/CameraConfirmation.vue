<template>
    <!-- Vertically centered modal -->
    <el-dialog v-model="dialogVisible" center top="30vh"
    :close-on-click-modal="false"
    :show-close="false"
    :custom-class="'confirmation'"
    append-to-body>
    <span class="caption" :class="[isReplacement ? 'text-normal' : '']" v-html="caption"></span>
    <template #footer>
      <span class="dialog-footer" style="display:block; text-align:right">
        <el-button @click="noConfirm" v-show="props.showCancelButton" style="box-shadow: 0px 24px 48px rgba(145, 158, 171, 0.2);" :style="[btColorNo]">{{ noLabel }}</el-button>
        <el-button @click.prevent="yesConfirm" style="box-shadow: 0px 24px 48px rgba(145, 158, 171, 0.2)" :style="[btColorYes]">{{ yesLabel }}</el-button>
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
  yesLabel: {
    default: 'Yes',
  },
  noLabel: {
    default: 'No'
  },
  yesButtonBackroundColor: {
    default: '#18AF4A'
  },
  showCancelButton: {
    default: true
  },
  isReplacement: {
    default: false
  },
  btnColorNo: {
    required: false,
    default: ""
  },
  btnColorYes: {
    required: false,
    default: ""
  },
});

const emits = defineEmits(["onNoConfirm", "onYesConfirm"])
const dialogVisible = computed(() => {
  return props.visibility;
});

const btColorNo = computed(() => {
  if (props.btnColorNo) {
    return props.btnColorNo
  } else {
    return "background-color: #18AF4A; color: white;";
  }
})

const btColorYes = computed(() => {
  if (props.btnColorYes) {
    return props.btnColorYes
  } else {
    return "";
  }
})

/* methods */
const noConfirm = () => {
  emits("onNoConfirm");
}
const yesConfirm = () => {
  emits("onYesConfirm");
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

      &.text-normal {
        font-weight: normal;
      }
    }

    .is-disabled {
      &.is-disabled {
        opacity: 0.6;
      }
    }
  }
</style>
