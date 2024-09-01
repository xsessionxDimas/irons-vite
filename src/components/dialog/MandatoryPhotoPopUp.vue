<template>
  <el-dialog
    v-model="showDialog"
    width="40%"
    :show-close="false"
    custom-class="mandatory_photo_pop_up"
    top="30vh" :center="true"
    :close-on-click-modal="false"
    :close-on-press-escape = "false">
    <div class="row text-center pt-3 pb-3 text-dark modal-title">
      <h3>Please take a photo</h3>
    </div>
    <div class="row text-center pt-5">
      <el-button type="success" style="background-color: #18AF4A" @click="onOkClicked">OK</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visibility: {
    type: Boolean,
    required: true
  }
})
const emits = defineEmits(["onOk"])

const showDialog = computed(() => {
  return props.visibility
})

const onOkClicked = () => {
  emits("onOk", null)
}
</script>

<style lang="scss">
.mandatory_photo_pop_up {
    .el-dialog__header {
    border-bottom: none !important;
    }
}
</style>
