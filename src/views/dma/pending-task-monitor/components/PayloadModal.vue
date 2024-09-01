<template>
  <!-- Vertically centered modal -->
  <el-dialog
    v-model="dialogVisible"
    :show-close="true"
    @close="handleClose"
    :custom-class="'dma-toast-offline py-7'"
    append-to-body
    width="70%"
  >
    <pre>{{ JSON.stringify(JSON.parse(caption), null, 2) }}</pre>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean,
  },
  caption: {
    required: true,
    type: String,
  },
});

const emits = defineEmits(["closeModal"]);
const dialogVisible = computed(() => {
  return props.visibility;
});

const handleClose = () => {
  emits("closeModal");
};
</script>

<style lang="scss">
.dma-toast-offline {
  padding: 10px 0px 0px;
  gap: 8px;
  .el-dialog__body {
    text-align: left;
  }
  .caption {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #212b36;
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
