<template>
  <div class="row avoid" id="headerTask" :class="props.class">
    <div class="col-6">
      <h4 class="title">{{ title }}</h4>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
} from "vue"

const props = defineProps({
  title: {
    required: true,
    type: String,
  },
  class: {
    required: false,
    type: String,
    default: ""
  }
});

const title = computed(() => {
  return props.title
})
</script>

<style lang="scss" scoped>
  .title {
    font-size: 20px;
    line-height: 30px;
    font-family: 'Public sans', sans-serif !important;
  }
</style>
