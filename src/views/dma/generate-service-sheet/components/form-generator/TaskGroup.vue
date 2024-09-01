<style scoped>
.clickable-task {
  background-color: transparent;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.clickable-task:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>

<template>
  <el-collapse v-model="taskGroups" class="task-group e-form-only py-1 px-5 mb-3">
    <el-collapse-item :title="taskGroup.name" :name="taskGroup.key">
      <div
        v-for="(task, taskIdx) in props.taskGroup.task"
        :key="task.key"
        class="ps-3 position-relative"
        :class="{ 'clickable-task': hasTaskClickedListener }"
        @click="taskClicked({ task, taskIdx })"
      >
        <!-- INLINE TASK -->
        <template v-if="task.taskType == 'inline'">
          <InlineTask
            :task="task"
            :taskGroupName="taskGroup.name"
            :task-index="taskIdx"
            :task-group="taskGroup.task"
          />
        </template>

        <!-- TABLE TASK -->
        <TableTask v-if="task.taskType == 'table'" :task="task" />

        <!-- COLLASIBLE TABLE -->
        <template v-if="task.taskType == 'collapsibleTable'">
          <CollapsibleTable :task="task" />
        </template>

        <slot name="row-after-task" :task="task" :index="taskIdx" />
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  getCurrentInstance,
  PropType,
  ref
} from "vue";
import InlineTask from "./InlineTask.vue";
import TableTask from "./TableTask.vue";
import CollapsibleTable from "./CollapsibleTableTask.vue";
import { TaskGroup } from "@/core/types/generate-service-sheet/TaskGroup";
import { Task } from "@/core/types/generate-service-sheet/Task";

const thisInstance = getCurrentInstance();

const props = defineProps({
  taskGroup: {
    type: Object as PropType<TaskGroup>,
    required: true,
  },
});

const taskGroups = ref(props.taskGroup.key);

const emit = defineEmits<{
  taskClicked:(data: { task: Task; taskIdx: number }) => void;
}>();

const hasTaskClickedListener = computed(() => {
  if (!thisInstance) return null;

  return thisInstance.attrs?.onTaskClicked;
});

function taskClicked(data: { task: Task; taskIdx: number }) {
  emit("taskClicked", data);
}
</script>

<style lang="scss">
.task-group {
  border-radius: 8px;
  border: 1px solid rgba(145, 158, 171, 0.24);

  .el-collapse-item__header {
    font-size: 16px;
    font-weight: 600;
    border: none;
    min-height: min-content;
    line-height: 1.4;
  }

  .el-collapse-item__wrap {
    border: none !important;
  }

  .el-collapse-item__arrow {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);

    &.is-active {
      -webkit-transform: rotate(270deg);
      transform: rotate(270deg);
    }
  }
}
</style>
