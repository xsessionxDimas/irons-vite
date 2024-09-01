<template>
  <div class="py-2">
    <div class="row mb-1">
      <div class="col">
        <div class="form-floating approved-text-box">
            <div
              data-testid='time-stamp-label'
              class="form-control"
              style="white-space:break-spaces;">{{ message }}</div>
            <label
              class="text-bold"
              data-testid='placeholder-label'
            >{{ placeholderMessage }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string,
  placeholderMessage: string
}>()
</script>

<style lang="scss" scoped>
@import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
</style>
