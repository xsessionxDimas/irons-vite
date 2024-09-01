<template>
  <el-dialog
    v-model="showReplacementPhotoDialog"
    :width="480"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="replacement-dialog">
    <p class="m-0 p-0" style="font-weight: normal;">
      Please take a photo of the <b>{{ tool }}</b> from the <b>{{ side }}</b> with the cover
      removed
    </p>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="replacement-button"
          @click="closeReplacementPhotoDialog">
          Take a Photo
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  defineEmits,
  PropType
} from "vue";
import { Item } from '@/core/types/entities/dma/e-form/Item';

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object as PropType<Item>,
    required: true
  },
  tool: {
    type: String,
    required: true
  },
  side: {
    type: String,
    required: true
  }
});
const showReplacementPhotoDialog = computed({
  get() {
    return props.show;
  },
  set(newValue) {
    return newValue;
  },
});

const emits = defineEmits(["close"]);
const closeReplacementPhotoDialog = () => {
  emits("close");
};
</script>

<style lang="scss">
.replacement-dialog {
  padding: 24px;
  &.el-dialog {
    .el-dialog__header {
      padding: 0;
      border: none;
    }
    .el-dialog__body {
      padding: 0;
      word-break: break-word;
      font-family: "Public Sans", sans-serif;
      font-weight: 700;
      font-size: 18px;
      line-height: 28px;
      color: rgba(33, 43, 54, 1);
    }
    .el-dialog__footer {
      padding: 32px 0 0;
    }
  }
}
.replacement-button {
  &.el-button {
    background: rgba(24, 175, 74, 1);
    padding: 8px 16px;
    color: white;
    font-family: "Public Sans", sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }
}
</style>
