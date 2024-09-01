<template>
  <div class="report" :class="{'mb-4' : !props.lastItem}">
    <div class="report_section_header avoid">
      <h4 class="title ps-3">{{ data.name }}</h4>
    </div>
    <div class="report_body">
      <template v-for="task in data.tasks" :key="task.key">
        <InlineTask v-if="task.taskType == 'inline'" :task="task" />
      </template>
      <template v-if="data.tasks?.length < 2">
          <div class="row w-100 m-0">
            <p style="text-align: center;">No data recorded</p>
          </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  onMounted,
  PropType
} from "vue";
import {
  TaskGroup
} from '@/core/types/entities/dma/e-form/taskGroup';
import InlineTask from "./task/InlineTask.vue";
import { DisabledItem } from "@/core/types/entities/dma/disabledItem";
import {
  usePreviewFormStore
} from "@/store/pinia/dma/preview-form/usePreviewFormStore";
import { Task } from "@/core/types/entities/dma/e-form/Task";
import { isUndefined } from "lodash";

const props = defineProps({
  taskGroup: {
    type: Object as PropType<TaskGroup>,
    required: true
  },
  lastItem: {
    default: false
  }
});

const eformStore = usePreviewFormStore()

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

const data = computed(() => {
  return props.taskGroup;
});
</script>
