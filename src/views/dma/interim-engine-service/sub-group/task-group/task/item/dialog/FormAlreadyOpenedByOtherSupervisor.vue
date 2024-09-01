<template>
  <el-dialog
    v-model="showDialog"
    width="40%"
    :show-close="false"
    custom-class="oil-not-in-range__header"
    top="30vh" :center="true"
  >
    <div class="row text-center pt-3 pb-3 text-dark modal-title text-break">
      <h3>Cannot Access this form With Different Supervisor</h3>
    </div>
    <div class="row text-center pt-5">
      <el-button type="success" class="ok-button" @click="handleClose">Ok</el-button>
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
  }
});
const emits = defineEmits(["close"]);
const showDialog = computed(() => {
  return props.show
});
const handleClose = () => {
  emits("close")
}
</script>

<style lang="scss">
  .oil-not-in-range__header {
    .el-dialog__header {
      border-bottom: none !important;
    }
  }
  .ok-button {
    background-color: #18AF4A;
  }
</style>
