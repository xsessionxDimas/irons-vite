<template>
<div class="ps-0 mt-5">
  <div class="card">
    <template v-for="taskGroup in taskGroups" :key="taskGroup.key">
      <TaskGroup :task-group="taskGroup" :is-monitoring="isMonitoring" />
    </template>
  </div>
</div>
</template>

<script lang="ts" setup>
import {
  SubGroup
} from '@/core/types/entities/dma/e-form/subGroup';
import { computed, defineProps, PropType } from 'vue'
import TaskGroup from './task-group/TaskGroup.vue';
import IronformConfig from "@/core/config/IronformConfig";

const props = defineProps({
  subGroup: {
    type: Object as PropType<SubGroup>,
    required: true
  },
  isMonitoring: {
    type: Boolean,
    required: true,
    default: false
  }
});

/**
 * Computed property that returns the task groups.
 *
 * @returns {Array} The task groups.
 * @need to add filter for skip preservice taskgroup key (the standard is all key must be the same amongs all models and ps types)
 * filter for now is Skip_Preservice
 */
const taskGroups = computed(() => {
  let taskGroup = props.subGroup.taskGroup;
  console.log(taskGroup)
  if (!IronformConfig.enableSkipPreservice) {
    taskGroup = taskGroup.filter((f) => {
      return f.key != "Skip_Preservice"
    })
  }
  return taskGroup
})
</script>
