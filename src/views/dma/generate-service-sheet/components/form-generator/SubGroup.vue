<template>
  <div class="ps-0 mt-5">
    <div class="card">
      <!-- TASK GROUP -->
      <template
        v-for="(taskGroup, taskGroupId) in props.subGroup.taskGroup"
        :key="`taskgroup-${taskGroupId}`"
      >
        <TaskGroup
          :task-group="taskGroup"
          @taskClicked="(args) => taskClicked({ ...args, taskGroupId })"
        >
          <template #row-after-task="props" v-if="is_slot_row_after_task_filled">
            <slot
              name="row-after-task"
              :taskGroupIndex="taskGroupId"
              :taskIdx="props.index"
              :task="props.task"
              :taskGroup="taskGroup"
            />
          </template>
        </TaskGroup>

        <slot
          name="row-after-taskgroup"
          :taskGroup="taskGroup"
          :taskGroupIndex="taskGroupId"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  PropType,
  useSlots
} from "vue";
import { SubGroup } from "@/core/types/generate-service-sheet/SubGroup";
import TaskGroup from "./TaskGroup.vue";
import { Task } from "@/core/types/generate-service-sheet/Task";

const slots = useSlots();

const emit = defineEmits<{
  taskClicked:(options: { subGroup: SubGroup; task: Task; taskIdx: number }) => void;
}>();

const props = defineProps({
  subGroup: {
    type: Object as PropType<SubGroup>,
    required: true,
  },
});

function taskClicked(data: { task: Task; taskIdx: number; taskGroupId: number }) {
  emit("taskClicked", { subGroup: props.subGroup, ...data });
}

const is_slot_row_after_task_filled = computed(() => {
  return slots["row-after-task"];
});
</script>
