<template>
  <div class="d-flex jusitfy-content-between gap-2 timer-option-container">
    <template v-for="item in timerOption" :key="item">
      <CameraCircleButton @click="handleChangeTimerVal(item)" :bgColor="item != 0 && selectedTimer == item ? selectedColor : ''">
        <svg v-if="item == 0" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-4 -2 30 30" fill="none">
          <path fill="white" d="M24 12c0 6.627-5.373 12-12 12s-12-5.373-12-12h2c0 5.514 4.486 10 10 10s10-4.486 10-10-4.486-10-10-10c-2.777 0-5.287 1.141-7.099 2.977l2.061 2.061-6.962 1.354 1.305-7.013 2.179 2.18c2.172-2.196 5.182-3.559 8.516-3.559 6.627 0 12 5.373 12 12zm-13-6v8h7v-2h-5v-6h-2z"/>
        </svg>
        <div v-else class="text-white timer-label">
          {{ item }}
        </div>
      </CameraCircleButton>
    </template>
  </div>
</template>

<script lang="ts" setup>
import CameraCircleButton from "./CameraCircleButton.vue"
import { selectedColor } from "./camera-timer-helper.ts"

defineProps<{
  timerOption?: number[];
  selectedTimer: number
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: "selectTimer"): void;
}>();

const handleChangeTimerVal = (val) => {
  emit("selectTimer", val)
}
</script>

<style lang="scss" scoped>
  @import "@/assets/sass/pages/camera.scss";
</style>

