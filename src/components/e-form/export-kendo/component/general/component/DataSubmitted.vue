<!-- Submitted.vue -->
<template>
  <div
    class="input mb-3"
    :class="{
      'rounded-left': roundedLeft,
      'rounded-right': roundedRight,
    }"
  >
    <div class="input_label">{{ label }}</div>
    <div class="input_values">
      <div class="input_value">{{ name }}</div>
      <div class="input_value">{{ value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";

const props = defineProps({
  label: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  value: {
    required: true,
    type: String,
  },
  roundedLeft: Boolean,
  roundedRight: Boolean,
});

const label = computed(() => {
  return props.label;
});

const name = computed(() => {
  return props.name;
});

const value = computed(() => {
  return props.value;
});
</script>

<style scoped lang="scss">
.input {
  background-color: #d1efdb;
  opacity: 1;
  position: relative;
  border: 1px solid #e4e6ef;
  height: calc(7.5rem + 2px);
  padding: 1.625rem 1rem 0.625rem;
}

.input_label {
  font-weight: bold;
  color: #202124;
  font-size: 1rem;
  position: absolute;
  top: 0;
  left: 0;
  padding: 1.5rem 1.5rem;
}

.input_values {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 3rem;
  left: 0;
  padding: 0 1.5rem;
}

.input_value {
  font-weight: 400;
  color: #202124;
  font-size: 1rem;
  line-height: 1.5;
}

.rounded-left {
  border-top-left-radius: 0.475rem;
  border-bottom-left-radius: 0.475rem;
}

.rounded-right {
  border-top-right-radius: 0.475rem;
  border-bottom-right-radius: 0.475rem;
}
</style>
