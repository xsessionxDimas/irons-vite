<template>
    <!-- Vertically centered modal -->
    <el-dialog v-model="dialogVisible" center top="30vh"
    :close-on-click-modal="false"
    :show-close="false"
    :custom-class="'confirmation'"
    append-to-body>
        <div class="icon mb-4" style="text-align: center;">
          <NwImg src="/media/icons/bumaau/danger.png" width="64" height="64" alt="warning" />
        </div>
        <span class="caption" style="text-align: center !important;">
          <span style="text-align: center !important;" v-html="caption"></span>
        </span>
        <template #footer>
        <span class="dialog-footer" style="display:block; text-align:right">
            <el-button @click="noConfirm" style="box-shadow: 0px 24px 48px rgba(145, 158, 171, 0.2)">{{ noLabel }}</el-button>
            <el-button @click.prevent="yesConfirm" style="box-shadow: 0px 24px 48px rgba(145, 158, 171, 0.2); background-color: #18AF4A; color: white;">{{ yesLabel }}</el-button>
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
    default: 'RETRY',
  },
  noLabel: {
    default: 'CANCEL'
  },
  yesButtonBackroundColor: {
    default: '#18AF4A'
  }
})

const emits = defineEmits(["onNoConfirm", "onYesConfirm"])
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
    .confirmation .el-dialog--center {
      text-align: center;
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
    .yellow {
      color: #CC9A06;
    }
    .red {
      color: #FF4842;
    }
  }
</style>
