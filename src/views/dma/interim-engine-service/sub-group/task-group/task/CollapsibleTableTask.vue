<template>
  <div class="row w-100 mt-3 mb-3">
    <template v-if="!isUndefined(task.style) && task.style.collapseCategory == 'taskTable'">
      <div class="col-1 px-2"></div>
    </template>
    <div class="task-table collapsible-table-container" :class="!isUndefined(task.style) && task.style.collapseCategory == 'taskTable' ? 'col-11 px-0' : 'col-12 pe-0'">
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="open">
        <el-collapse-item :name="taskCollapse">
          <template #title>
            <span class="small-hyperlink-text-style">{{ task.triggerCaption }}</span>
          </template>
          <TableTask :task="task" :general-submitted="generalSubmitted"/>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Task } from '@/core/types/entities/dma/e-form/Task';
import {
  PropType,
  defineProps,
  ref,
  computed
} from 'vue';
import TableTask from './TableTask.vue'
import { isUndefined } from "lodash"

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  }
})

const open = ref("open")

const taskCollapse = computed(() => {
  let collapse = ""
  if (!isUndefined(props.task.style) && !isUndefined(props.task.style.defaultCollapse)) {
    collapse = props.task.style.defaultCollapse
  }
  return collapse
})

</script>
