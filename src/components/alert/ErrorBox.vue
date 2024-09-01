<template>
    <!-- Vertically centered modal -->
    <el-dialog v-model="dialogVisible" center top="30vh"
    :close-on-click-modal="false"
    :show-close="false"
    :custom-class="'confirmation'"
    append-to-body>
        <div class="icon mb-4" style="text-align: center;">
        </div>
        <span class="caption" style="text-align: center !important;">{{ caption }}</span>
        <template #footer>
        <span class="dialog-footer" style="display:block; text-align:right">
          <template v-if="isCloseButtonShow">
            <el-button @click.prevent="onClose" style="box-shadow: 0px 24px 48px rgba(145, 158, 171, 0.2); background-color: #18AF4A; color: white;">Close</el-button>
          </template>
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
  isCloseButtonShow: {
    default: true,
    type: Boolean
  }
})

const emits = defineEmits(["onClose"])
const dialogVisible = computed(() => {
  return props.visibility;
});

/* methods */
const onClose = () => {
  emits("onClose");
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
      display: block;
      word-break: break-word;
    }

    .is-disabled {
      &.is-disabled {
        opacity: 0.6;
      }
    }
  }
</style>
