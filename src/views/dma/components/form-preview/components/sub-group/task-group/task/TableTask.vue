<template>
<div class="row w-100 mx-0 mb-5">
  <template v-if="!isUndefined(task.style) && task.style.category == 'taskTable'">
    <div class="col-1 px-2"></div>
  </template>
  <div class="task-table" style="font-size: 12px !important" :class="!isUndefined(task.style) && task.style.category == 'taskTable' ? 'col-11 px-0' : 'col-12 pe-0'">
    <label>{{ task.description }}</label>
    <div class="row text-center task-table__header py-2 w-100">
      <div v-for="header in headers" class="col font-weight-normal task-table__header__item" :key="header">
        {{ header }}
      </div>
    </div>
    <div v-for="(row, index) in task.items" :key="row.key" class="row w-100 task-table__body d-flex align-items-start" :class="taskRowBorder(index)">
      <TableRow :item="row" :task="task" />
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType } from 'vue'
import TableRow from './item/TableRow.vue'
import { Task } from '@/core/types/entities/dma/e-form/Task';
import { isUndefined } from "lodash"

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  }
});

const headers = computed(() => {
  return props.task.header.replaceAll("'", '').replace('[', '').replace(']', '').split(", ")
})

const taskRowBorder = (index: number) => {
  let className = ''
  if (!isUndefined(props.task.style) && !isUndefined(props.task.style.borderBottom) && props.task.style.borderBottom == "none") {
    className = ""
  } else {
    className = "border-bottom-table"
  }
  if ((index + 1) == props.task.items.length) className = "border-bottom-table"
  return className
}
</script>

<style lang="scss" scoped>
  .task-table {
    .task-table__header {
      background-color: #F9FAFB;
      border: 1px solid #919eab3d ;
    }
    .task-table__body {
      border-left: 1px solid #919eab3d ;
      border-right: 1px solid #919eab3d ;
      border-bottom: 1px solid #919eab3d ;
    }
  }
</style>
