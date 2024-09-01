<template>
    <!-- Vertically centered modal -->
    <el-dialog v-model="dialogVisible" center top="30vh"
    :close-on-click-modal="false"
    :show-close="false"
    :custom-class="'dma-toast py-7'"
    append-to-body>
    <span class="caption text-center">{{ caption }}</span>
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
});

const emits = defineEmits(["onNoConfirm", "onYesConfirm"])
const dialogVisible = computed(() => {
  return props.visibility;
});
</script>

<style lang="scss">
  .dma-toast {
    width: 360px !important;
    padding: 10px 0px 0px;
    gap: 8px;

    .el-dialog__body {
      text-align: center;
    }

    .el-dialog__header {
      display: none;
      padding: 0 !important;
      border-bottom: none;
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
