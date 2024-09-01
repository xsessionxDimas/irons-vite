<template>
  <div class="d-flex justify-content-start align-items-center flex-wrap">
    <div class="little-box" :style="style"></div>
    <p class="legend-label ms-2 mb-0">{{ text }}</p>
  </div>
</template>
<script lang="ts" setup>
import { computed, defineProps } from 'vue';

const props = defineProps(['color', 'text'])

const style = computed(() => {
  return `background-color: ${props.color};`;
})
</script>
<style lang="scss" scoped>
.little-box {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  margin-left: auto;
  margin-right: auto;
}

.legend-label {
  font-weight: 400;
  font-size: 14px;
}
</style>
