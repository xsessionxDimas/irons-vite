<template>
    <el-dialog
      v-model="showDialog"
      title='Will this defect be:'
      custom-class="defect-complete-dialog"
      :width="dialogSize"
      :show-close="false"
      top="30vh" :center="true"
      @close="handleClose">
      <div class="row pt-1 pb-1 text-dark modal-title">
        <div class="p-3 m-1 d-flex">
          <div class="form-check">
            <input class="form-check-input" type="radio" v-model="type" value="true" />
          </div>
          <div>
            <span>Completed Now</span>
          </div>
        </div>
        <div class="p-3 m-1 d-flex">
          <div class="form-check">
              <input class="form-check-input" type="radio" v-model="type" value="false" />
          </div>
          <div>
            <span>Completed at a later date (parts or resources required)</span>
          </div>
        </div>
        <parts-warning v-if="partsWarning" />
      </div>
      <template #footer>
        <div class="d-flex justify-content-between">
          <!-- left side -->
          <div>
            <span class="dialog-footer" style="display:block; text-align:right" v-if="partsWarning">
              <el-button class="btn-add-parts" type="success" @click.prevent="handleAddParts">Add Parts or Resources</el-button>
            </span>
          </div>
          <!-- right side -->
          <div>
            <span class="dialog-footer" style="display:block; text-align:right">
              <el-button @click="handleClose" style="box-shadow: 0px 24px 48px rgba(145, 158, 171, 0.2)">Cancel</el-button>
              <el-button class="button-OK-confirmation" type="success" :disabled="type == ''" @click.prevent="handleSubmit" style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Submit</el-button>
            </span>
          </div>
        </div>
      </template>
    </el-dialog>
  </template>

<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import PartsWarning from '@/views/dma/e-form-offline/sub-group/task-group/task/item/dialog/PartsWarning.vue';
import { defineProps, defineEmits } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import {
  CompleteEmitParam
} from '@/views/dma/e-form-offline/types/CompleteEmitParam';

const props = defineProps({
  show: {
    required: true,
    type: Boolean
  },
  partsWarning: {
    required: true,
    type: Boolean,
    default: false
  },
});

// eslint-disable-next-line func-call-spacing
const emits = defineEmits<{
    (event: 'close'): void
    (event: 'submit', params: CompleteEmitParam): void
    (event: 'add-parts'): void
  }>()

const type = ref("")

const isLargeScreen = useMediaQuery('(min-width: 1100px)')
const isSmallScreen = useMediaQuery('(min-width: 767px) and (max-width: 900px)')

const dialogSize = computed(() => {
  return isSmallScreen.value ? "70%" : isLargeScreen.value ? "50%" : "65%";
});

const showDialog = computed(() => {
  return props.show
});

const handleSubmit = () => {
  emits('submit', {
    isComplete: type.value == "true",
    callback: undefined
  })
}

const handleAddParts = () => {
  emits('add-parts')
}

const handleClose = () => {
  type.value = ""
  emits("close")
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/pages/defect.form.scss";
</style>
<style lang="scss">
.defect-complete-dialog {
  span {
        font-size: 1.2rem;
    }
    .el-dialog__title {
        font-size: 18px  !important;
        font-weight: 800  !important;
    }
    .el-dialog__body {
      padding-top: 10px
    }
    .btn-add-parts {
      border-color: rgb(24, 175, 74) !important;
      background: white !important;
      color: rgb(24, 175, 74) !important;
    }
    .btn-add-parts:hover {
      background: rgb(24, 175, 74) !important;
      color: white !important;
    }
}
</style>
