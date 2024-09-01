<template>
  <div class="text-center d-flex align-items-center justify-content-center light-green color-dark-green rounded ps-1 pe-3 me-2">
    <img class="mx-2" src="/media/svg/dma/ic_check.png" alt="">
      {{ message }}
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps({
  message: {
    type: String,
  },
})
</script>
<style lang="scss" scoped>
    @import "@/assets/sass/pages/defect.panel.scss";
</style>
