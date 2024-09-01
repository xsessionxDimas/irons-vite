<template>
<div class="ps-0 mt-5">
  <div class="card">
    <template v-for="taskGroup in  props.subGroup.taskGroup" :key="taskGroup.key">
      <TaskGroup :task-group="taskGroup"/>
    </template>
  </div>
</div>
</template>

<script lang="ts" setup>
import {
  SubGroup
} from '@/core/types/entities/dma/e-form/subGroup';
import { defineProps, PropType } from 'vue'
import TaskGroup from './task-group/TaskGroup.vue';

const props = defineProps({
  subGroup: {
    type: Object as PropType<SubGroup>,
    required: true
  }
});
</script>
