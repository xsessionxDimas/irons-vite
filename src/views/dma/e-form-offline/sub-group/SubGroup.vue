<template>
<div class="ps-0 mt-5">
  <div class="card">
    <template v-for="taskGroup in taskGroups" :key="taskGroup.key">
      <TaskGroup :task-group="taskGroup"/>
    </template>
  </div>
</div>
</template>

<script lang="ts" setup>
import {
  SubGroup
} from '@/core/types/entities/dma/e-form/subGroup';
import {
  defineProps,
  PropType,
  computed,
  onMounted
} from 'vue'
import TaskGroup from './task-group/TaskGroup.vue';
import IronformConfig from "@/core/config/IronformConfig";
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import { useEFormStore } from "@/store/pinia/dma/e-form-offline/useEFormStore";

const props = defineProps({
  subGroup: {
    type: Object as PropType<SubGroup>,
    required: true
  }
});

const store = useEFormStore();

/**
 * Computed property that returns the task groups.
 *
 * @returns {Array} The task groups.
 * @need to add filter for skip preservice taskgroup key (the standard is all key must be the same amongs all models and ps types)
 * filter for now is Skip_Preservice
 */
const taskGroups = computed(() => {
  let taskGroup = props.subGroup.taskGroup;
  if (!IronformConfig.enableSkipPreservice) {
    taskGroup = taskGroup.filter((f) => {
      return f.key != "Skip_Preservice"
    })
  }
  return taskGroup
})

onMounted(async () => {
  const isOfflineTaskPending = await store.checkCurrentWoPendingOfflineTask()
  if (isOfflineOrSlowInternetConnection() || !isOfflineTaskPending) {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 0);
  }
})
</script>
