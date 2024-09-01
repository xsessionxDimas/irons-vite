<template>
  <div class="row service-labour" :class="borderBottomClass">
    <div class="col-3 py-1 text-center">{{ mechanic.mechanic.name }}</div>
    <div class="col-3 py-1 text-center border-left">{{ mechanic.shift }}</div>
    <div class="col-3 py-1 text-center border-left">{{ mechanic.serviceStart }}</div>
    <div class="col-3 py-1 text-center border-left">{{ mechanic.serviceEnd }}</div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { defineProps } from 'vue'
import { isEqual, last } from 'lodash'

const props = defineProps(['mechanic', 'mechanics'])

const borderBottomClass = computed(() => {
  const lastIndex = last(props.mechanics)
  if (isEqual(props.mechanic, lastIndex)) {
    return ''
  }
  return 'table-body'
})
</script>
