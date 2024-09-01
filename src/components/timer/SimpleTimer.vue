<template>
    <div class="btn btn-secondary mx-3">
      Service Duration Timer - {{ clock }}
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps({
  clock: {
    required: true,
    type: String
  }
});
</script>

<style scoped>
.btn-secondary {
    cursor: default;
}
.btn-secondary:hover {
    background-color: #E4E6EF;
}
</style>
