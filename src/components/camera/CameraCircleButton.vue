<template>
  <div
  class="d-flex flex-column align-items-center gap-4"
  @click.prevent="handleClick">
  <div class="button-ring">
    <section
      class="rounded-circle d-flex justify-content-center align-items-center tools-camera"
      style="
        width: 100%;
        height: 100%;
      "
      :style="`
        background-color: ${bgColor};
      `"
      >
      <slot />
    </section>
  </div>
</div>
</template>

<script setup lang="ts">

defineProps<{
  bgColor?: string;
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: "buttonClick"): void;
}>();

const handleClick = () => {
  emit("buttonClick");
};

</script>

<style lang="scss" scoped>
  @import "@/assets/sass/pages/camera.scss";
</style>
