<template>
  <div class="d-flex flex-row align-items-center justify-content-between mb-3 mt-1">
    <NwImg src="/media/logos/bumaau/buma-logo.png" class="logo" />
    <div class="d-flex flex-column align-items-end pe-3">
      <p class="service-no">{{ compartment }}</p>
      <p class="service-title">{{ title }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  compartment: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.logo {
  width: 84px;
  height: 24px;
}
.service-title {
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  margin-bottom: 0;
}
.service-no {
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  margin-bottom: 0;
}
</style>
