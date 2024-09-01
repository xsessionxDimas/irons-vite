<template>
  <div class="dma-historical-eform" :id="serviceSheet.name + '-Intervention'" v-if="serviceSheet">
    <HeaderTask :title="serviceSheet.name" />
    <template v-for="(taskGroup, idx) in serviceSheet.tasks" :key="taskGroup.key">
      <TaskGroup :task-group="taskGroup" :lastItem="idx + 1 == serviceSheet.tasks.length" />
    </template>
    <AdditionalInformation property-name="Provide additional information if required" :property-value="additionalInformation" :is-disabled="true" />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType } from "vue";
import TaskGroup from "./task-group/TaskGroup.vue";
import HeaderTask from "../HeaderTask.vue";
import AdditionalInformation from '@/views/dma/component-intervention-forms/components/refactor/AdditionalInformation.vue'

const props = defineProps({
  data: {
    required: true,
    type: Object as PropType<any>,
  },
  additionalInformation: {
    required: true,
    type: String,
  }
});

const serviceSheet = computed(() => {
  return props.data;
});
</script>
