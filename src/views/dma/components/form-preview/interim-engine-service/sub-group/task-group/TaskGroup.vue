<template>
<el-collapse v-model="activeTaskGroup" class="task-group e-form-only py-1 px-5 mb-3">
    <el-collapse-item :title="taskGroup.name" :name="taskGroup.key">
      <div v-for="(task, index) in props.taskGroup.task" :key="task.key" class="ps-3 position-relative">
        <template v-if="task.taskType == 'inline'">
          <InlineTask :task="task" :task-index="index" :task-group="taskGroup.task"/>
        </template>
        <TableTask v-if="task.taskType === 'table'" :task="task"/>
        <template v-if="task.taskType == 'collapsibleTable'">
          <CollapsibleTable :task="task"/>
        </template>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts" setup>
import {
  TaskGroup
} from '@/core/types/entities/dma/e-form/taskGroup';
import { computed } from '@vue/reactivity';
import { defineProps, PropType, onMounted } from 'vue';
import InlineTask from './task/InlineTask.vue';
import TableTask from './task/TableTask.vue';
import CollapsibleTable from './task/CollapsibleTableTask.vue'
import { DisabledItem } from '@/core/types/entities/dma/disabledItem';
import { isUndefined } from 'lodash';
import {
  useInterimPreviewFormStore
} from '@/store/pinia/dma/preview-form-interim/useInterimPreviewFormStore';
import { Task } from '@/core/types/entities/dma/e-form/Task';

const props = defineProps({
  taskGroup: {
    type: Object as PropType<TaskGroup>,
    required: true
  }
});

const activeTaskGroup = computed(() => {
  return props.taskGroup.key;
})

const eformStore = useInterimPreviewFormStore()

onMounted(() => {
  if (props.taskGroup.key == "MECHANICAL_SERVICE_SUSPENSION") {
    let suspensionArr = [] as DisabledItem[]
    let adjustedSuspensionArr = [] as DisabledItem[]
    eformStore.pushDataToSuspensionCylinderStoredValue([])
    eformStore.updateStoredAdjustmentOptionValue("")
    eformStore.pushDataToAdjustedSuspensionCylinderStoredValue([])
    props.taskGroup.task.forEach((task: Task) => {
      task.items.forEach((item) => {
        if (item.categoryItemType == "suspensionTargetRating") {
          suspensionArr.push({
            key: item.key,
            value: item.value as string
          })
        }

        if (item.categoryItemType == "adjustmentSuspensionRating") {
          adjustedSuspensionArr.push({
            key: item.key,
            value: item.value as string
          })
        }
      })
      if (!isUndefined(task.showParameter)) {
        if (task.showParameter == "suspensionCylinder") {
          eformStore.updateStoredAdjustmentOptionValue(task.taskValue)
        }
      }
    })
    eformStore.pushDataToAdjustedSuspensionCylinderStoredValue(adjustedSuspensionArr)
    eformStore.pushDataToSuspensionCylinderStoredValue(suspensionArr)
  }
})
</script>

<style lang="scss">
  .task-group {
    border-radius: 8px;
    border: 1px solid rgba(145, 158, 171, 0.24);

    .el-collapse-item__header {
      font-size: 16px;
      font-weight: 600;
      border: none;
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
