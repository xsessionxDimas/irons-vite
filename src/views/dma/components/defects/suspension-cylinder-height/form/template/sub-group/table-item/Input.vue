<template>
    <el-input class="px-2 pt-2 input-eform-status" disabled  :model-value="value" style="margin-bottom: 10px;"></el-input>
</template>

<script lang="ts" setup>
import {
  defineProps
} from 'vue'

defineProps({
  value: {
    type: String,
    required: true
  }
})
</script>
