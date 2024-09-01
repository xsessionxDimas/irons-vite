<template>
    <span v-html="value"></span>
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
