<template>
<el-collapse v-model="taskCollapse" class="task-group e-form-only py-1 px-5 mb-3" @click="handleCollapseExpand">
    <el-collapse-item :title="taskGroup.name" :name="taskGroup.key">
    <div v-for="(task, index) in props.taskGroup.task" :key="task.key" class="ps-3 position-relative">
        <template v-if="task.taskType == 'inline'">
          <InlineTask :task="task" :taskGroupName="taskGroup.name" :task-index="index" :task-group="taskGroup.task"
          :general-submitted="generalSubmitted" />
        </template>
        <TableTask v-if="task.taskType === 'table'" :task="task" :general-submitted="generalSubmitted"/>
        <template v-if="task.taskType == 'collapsibleTable'">
          <CollapsibleTable :task="task" :general-submitted="generalSubmitted"/>
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
import {
  defineProps,
  onMounted,
  PropType,
  ref,
  watch
} from 'vue';
import InlineTask from './task/InlineTask.vue';
import TableTask from './task/TableTask.vue';
import CollapsibleTable from './task/CollapsibleTableTask.vue'
import { Task } from '@/core/types/entities/dma/e-form/Task';
import {
  useEFormStore
} from '@/store/pinia/dma/e-form-offline/useEFormStore';
import { DisabledItem } from '@/core/types/entities/dma/disabledItem';
import { isEmpty, isUndefined } from 'lodash';
import {
  useGeneralFormStore
} from "@/store/pinia/dma/e-form-offline/useGeneralFormStore";

const props = defineProps({
  taskGroup: {
    type: Object as PropType<TaskGroup>,
    required: true
  }
});

const eformStore = useEFormStore()
const generalFormStore = useGeneralFormStore()
const taskCollapse = ref('')

const updateTaskCollapse = () => {
  taskCollapse.value = props.taskGroup.key
  eformStore.decreaseCollapse()
}

const generalSubmitted = computed(() => {
  return generalFormStore.generalUpdated;
});

const taskGroupComp = computed(() => {
  return props.taskGroup
})

const toggleTaskCollapse = computed(() => {
  return eformStore.stateToggleExpandTaskGroup
})

watch(toggleTaskCollapse, (newVal) => {
  if (newVal) {
    updateTaskCollapse()
  }
})

onMounted(() => {
  updateTaskCollapse()
  handleUpdateDataSuspensionCylinder()
})

const handleCollapseExpand = () => {
  if (isEmpty(taskCollapse.value)) {
    eformStore.increaseeCollapse()
  } else {
    eformStore.decreaseCollapse()
  }
}

const handleUpdateDataSuspensionCylinder = () => {
  eformStore.stateSelectedSubGroups.forEach((subGroup) => {
    subGroup.taskGroup.forEach((taskGroup) => {
      if (taskGroup.key == "MECHANICAL_SERVICE_SUSPENSION") {
        let suspensionArr = [] as DisabledItem[]
        let adjustedSuspensionArr = [] as DisabledItem[]
        taskGroup.task.forEach((task: Task) => {
          task.items.forEach((item) => {
            if (item.categoryItemType == "suspensionTargetRating") {
              suspensionArr.push({
                key: item.key,
                value: item.value as string
              })
            }

            if (item.categoryItemType == "adjustmentSuspensionTargetRating") {
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
  })
}

watch(taskGroupComp, () => {
  updateTaskCollapse()
  handleUpdateDataSuspensionCylinder()
}, { deep: true })

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
