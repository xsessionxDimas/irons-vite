<template>
  <div class="row monitoring-status-footer mt-3" :class="showPrev && showNext ? 'justify-content-between' : showNext ? 'justify-content-end' : 'justify-content-start'">
    <template v-if="showPrev">
      <div class="col-1 button">
        <div class="row justify-content-start">
          <el-button type="success" @click="handleShowPrevPage" style="background-color: #18AF4A;">Previous</el-button>
        </div>
      </div>
    </template>
    <!-- <div class="col-10"></div> -->
    <template v-if="showNext">
      <div class="col-1 button">
        <div class="row justify-content-end">
          <el-button type="success" @click="handleShowNextPage" style="background-color: #18AF4A;">Next</el-button>
        </div>
      </div>
    </template>
  </div>
  </template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'

defineProps({
  showPrev: {
    required: true,
    type: Boolean
  },
  showNext: {
    required: true,
    type: Boolean
  },
})

const emits = defineEmits(['goPrev', 'goNext'])

const handleShowPrevPage = () => {
  emits('goPrev', null)
}
const handleShowNextPage = () => {
  emits('goNext', null)
}
</script>

<style lang="scss">
  .monitoring-status-footer {
    .button {
      min-width: 75.7px;
    }
  }
</style>
