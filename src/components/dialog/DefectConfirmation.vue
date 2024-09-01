<template>
    <!-- Vertically centered modal -->
    <el-dialog v-model="dialogVisible" class="col-lg-3 col-md-4" center top="30vh"
    :custom-class="'confirmation'"
    :destroy-on-close="true"
    @opened="onFormOpened"
    @closed="onFormClosed">
    <span class="caption">{{ caption }}</span>
    <template #footer>
      <span class="dialog-footer" style="display:block; text-align:right">
        <el-button @click="noConfirm" style="box-shadow: 0px 24px 48px rgba(145, 158, 171, 0.2)">No</el-button>
        <el-button type="success" @click.prevent="yesConfirm" style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Yes</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore";
import {
  defineProps,
  defineEmits,
  toRef,
  ref
} from "vue";

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  caption: {
    required: true,
    type: String
  }
});

const emits = defineEmits(["onNoConfirm", "onYesConfirm", "onCancel"]);
const dialogVisible = toRef(props, "visibility");
const isCancelled = ref(true);

/* store */
const store = useDefectsFormStore();

/* methods */
const noConfirm = () => {
  isCancelled.value = false;
  emits("onNoConfirm");
}
const yesConfirm = () => {
  isCancelled.value = false;
  emits("onYesConfirm");
}
/* event handlers */
const onFormClosed = (() => {
  if (isCancelled.value === true) {
    store.setCancelledState(true);
    emits("onCancel");
  }
});
const onFormOpened = () => {
  isCancelled.value = true;
}
</script>

<style lang="scss">
  .confirmation {
    width: 390px !important;
    padding: 10px 0px 0px;
    gap: 8px;

    .el-dialog__header {
      display: block;
      border-bottom: none !important;
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
  }
</style>
