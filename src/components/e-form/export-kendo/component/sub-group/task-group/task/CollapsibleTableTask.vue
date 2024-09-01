<template>
  <div class="row w-100 mt-3 mb-3">
    <template v-if="!isUndefined(task.style) && task.style.collapseCategory == 'taskTable'">
      <div class="col-1 px-2"></div>
    </template>
    <div class="task-table collapsible-table-container prevent-split" :class="!isUndefined(task.style) && task.style.collapseCategory == 'taskTable' ? 'col-11 px-0' : 'col-12 pe-0'">
      <div class="report py-1 px-5">
        <span class="small-hyperlink-text-style avoid">{{ task.triggerCaption }}</span>
        <TableTask :task="task"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Task } from '@/core/types/entities/dma/e-form/Task';
import { PropType, defineProps } from 'vue';
import TableTask from './TableTask.vue'
import { isUndefined } from "lodash"

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  }
})

</script>
