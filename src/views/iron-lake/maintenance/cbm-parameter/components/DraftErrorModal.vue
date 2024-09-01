<template>
  <el-dialog
    v-model="isVisible"
    :title="'Errors'"
    width="500px"
    @close="handleCloseModal()"
    align-center
  >
    <ul v-if="errorParsed">
      <li v-for="(data, i) in errorParsed" :key="i">
        <p class="m-0" style="word-break: normal;">{{ data }}</p>
      </li>
    </ul>
    <p v-else>Undefined</p>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  toRef,
  defineProps,
  defineEmits,
  computed
} from "vue";
const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
  errorData: {
    type: Object,
    default: null,
  },
});
const errorParsed = computed(() => {
  const errors = props.errorData?.errors?.split(", ");
  return errors;
});
const isVisible = toRef(props, "visibility");
const emits = defineEmits(["handle-close"]);
const handleCloseModal = (isReload = false) => {
  emits("handle-close", isReload);
};
/* computed */
</script>
<style lang="scss" scoped>
.el-dialog__body {
  padding-bottom: 0 !important;
}
</style>
