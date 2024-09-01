<template>
  <div class="dma-historical-eform prevent-split" :id="serviceSheet.key?.toLowerCase()">
    <HeaderTask :title="serviceSheet.name" />
    <template v-for="(taskGroup, idx) in taskGroups" :key="taskGroup.key">
      <TaskGroup :task-group="taskGroup" :lastItem="idx + 1 == taskGroups.length" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType } from "vue";
import {
  SubGroup
} from '@/core/types/entities/dma/e-form/subGroup';
import TaskGroup from "./task-group/TaskGroup.vue";
import HeaderTask from "../HeaderTask.vue";
import IronformConfig from "@/core/config/IronformConfig";

const props = defineProps({
  data: {
    required: true,
    type: Object as PropType<SubGroup>,
  },
});

const serviceSheet = computed(() => {
  return props.data;
});

const taskGroups = computed(() => {
  let taskGroup = serviceSheet.value.taskGroup;
  if (!IronformConfig.enableSkipPreservice) {
    taskGroup = taskGroup.filter((f) => {
      return f.key != "Skip_Preservice"
    })
  }
  return taskGroup
})
</script>
