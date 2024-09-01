<template>
  <div class="dma--textarea-wrapper disabled form-control avoid prevent-split">
    <label class="dma--textarea-label">{{label}}</label>
    <div class="dma--textarea-input" style="
      padding: 2px;
      margin-bottom: 13px;
      word-break: break-word;
      white-space: break-spaces;
    ">{{ value }}</div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

defineProps({
  label: {
    required: false,
    type: String,
  },
  value: {
    required: true,
    type: String,
  },
})
</script>
