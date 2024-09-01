<template>
    <div class="row border-bottom avoid" :class="props.header? 'p-2 table-header-background-color': ''">
      <div class="col-3 py-1 text-center">{{ data[0] }}</div>
      <div class="col-3 py-1 text-center" :class="props.header?'':'border-left'">{{ data[1] }}</div>
      <div class="col-3 py-1 text-center" :class="props.header?'':'border-left'">{{ data[2] }}</div>
      <div class="col-3 py-1 text-center" :class="props.header?'':'border-left'">{{ data[3] }}</div>
    </div>
  </template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  PropType,
} from "vue";

const props = defineProps({
  data: {
    required: true,
    type: Array as PropType<string[]>,
  },
  header: {
    required: false,
    default: false,
    type: Boolean
  }
});

const data = computed(() => {
  return props.data
})
</script>
<style lang="scss" scoped>
  .border-left {
    border-left: 1px solid #919eab3d;
  }
</style>
