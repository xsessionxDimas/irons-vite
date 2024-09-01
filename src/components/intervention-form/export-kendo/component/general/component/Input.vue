<template>
    <div class="mb-3 input">
      <div class="input_label">{{ label }}</div>
      <div class="input_value">{{ value }}</div>
    </div>
  </template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
} from "vue";

const props = defineProps({
  label: {
    required: true,
    type: String,
  },
  value: {
    required: true,
    type: String,
  }
});

const label = computed(() => {
  return props.label
})

const value = computed(() => {
  return props.value
})
</script>

<style scoped lang="scss">
    .input {
        background-color: #EFF2F5;
        opacity: 1;
        position: relative;
        border: 1px solid #E4E6EF;
        border-radius: 0.475rem;
        height: calc(3.5rem + 2px);
        padding: 1.625rem 1rem 0.625rem;

        &_label {
            font-weight: 600;
            color:#202124;
            font-size: 12px;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            padding: 1rem 1rem;
            pointer-events: none;
            border: 1px solid transparent;
            transform-origin: 0 0;
            transition: opacity 0.1s ease-in-out, transform 0.1s ease-in-out;
            opacity: 0.65;
            transform: scale(0.85) translateY(-0.5rem) translateX(0.15rem);
        }

        &_value{
            color:#919EAB;
            font-size: 0.99rem;
            font-weight: 500;
            line-height: 1.5;
        }
    }
</style>
