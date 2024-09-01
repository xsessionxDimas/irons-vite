<template>
    <div lass="px-2 pt-2 d-flex flex-column">
      <div class="px-0 py-0 mx-0 my-0 d-flex justify-content-start align-items-center">
        <div class="little-box d-flex p-3 justify-content-center align-items-center" :class="[squareColor]"></div>
        <p class="legend-label mx-3 my-0">{{ value }}</p>
      </div>
    </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  computed
} from 'vue'

const props = defineProps({
  value: {
    type: String,
    required: true
  }
})

const squareColor = computed(() => {
  let color = ""
  switch (props.value) {
    case "Out Spec":
      color = "red"
      break;
    case "Out of spec":
      color = "red"
      break;
    case "In spec":
      color = "green"
      break;
    default:
      break;
  }
  return color
})
</script>

<style lang="scss" scoped>
    @import "@/assets/sass/pages/defect.panel.scss";
</style>
