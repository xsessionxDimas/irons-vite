<template>
    <div class="d-flex justify-content-between">
        <template v-for="(group, index) in groups" :key="group.key">
        <div class="d-flex flex-column m-1 mb-3 stepper-button" :class="completedTask(group)" style="flex: 1;">
            <div class="box-menu text-center p-2 d-flex justify-content-center align-items-center stepper-title"
                :class="[classGenerator(group.key)]"
                @click="handleChangeSelectedGroup(group)">
                <span>{{ group.group == "Identified Defects" && isApproval ? "Approval" : group.group }}</span>
            </div>
            <div
            @click="handleGoToUnfilledTask(group)"
            class="text-center box-pill rounded-pill mt-2 mb-4 stepper-button-info w-100 py-2 clickable"
            :class="[index == 0 ? 'invisible': '', classGenerator(group.key), isMonitoring ? 'normal-cursor' : '']" v-if="infoVisible">
              <p v-if="group.group == 'Identified Defects'" class="mb-0">Found: {{ countIdentifiedDefect }} item(s)</p>
              <p v-else class="mb-0">Done {{ groupTaskProgress(group.key).taskDone }}/{{ groupTaskProgress(group.key).taskTotal }}</p>
            </div>
        </div>
        </template>
        <div>
        <button class="border-0 mt-10 align-items-center" @click="toggleInfoVisibility"
        style="background:transparent">
            <em class="fa" :class="chevronClass"></em>
        </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { InterventionGroup } from '@/core/types/intervention/InterventionGroup'
import {
  defineProps,
  defineEmits,
  ref,
  PropType,
  nextTick
} from 'vue'
import {
  InterventionTaskProgress
} from '@/core/types/intervention/InterventionTaskProgress'

/* props */
const props = defineProps({
  groups: {
    required: true,
    type: Object as PropType<InterventionGroup[]>
  },
  selectedGroup: {
    required: true,
    type: Object as PropType<InterventionGroup>
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  },
  taskProgress: {
    required: true,
    type: Object as PropType<InterventionTaskProgress[]>
  },
  isMonitoring: {
    type: Boolean,
    default: false
  },
  countIdentifiedDefect: {
    type: Number,
    default: 0,
    required: false
  },
  isApproval: {
    type: Boolean,
    default: false,
    required: false
  }
})
/* emits */
const emits = defineEmits(['groupChange', 'onGoToOpenRequiredTask'])

/* refs */
const chevronClass = ref('fa-chevron-up')
const infoVisible = ref(true)

/* methods and handlers */
const classGenerator = (grupId: string): string => {
  let className = ""
  className = grupId == props.selectedGroup.key ? 'active' : ''
  if (props.isMonitoring) return className
  return className
}
const toggleInfoVisibility = () => {
  infoVisible.value = !infoVisible.value;
  chevronClass.value = infoVisible.value ? "fa-chevron-up" : "fa-chevron-down";
}
const handleChangeSelectedGroup = (group: InterventionGroup) => {
  emits('groupChange', group)
}
const completedTask = (group: InterventionGroup) => {
  let className = ''
  const groupProgress = groupTaskProgress(group.key)
  if (groupProgress.taskTotal > 0) {
    const notGeneralNDefectIdentifedGroup = group.group != "General"
    const isTaskDone = groupProgress.taskTotal == groupProgress.taskDone
    const isSelectedGroup = group.key == props.selectedGroup.key
    if (notGeneralNDefectIdentifedGroup && isTaskDone) className = 'done-task'
    if (notGeneralNDefectIdentifedGroup && isTaskDone && isSelectedGroup) className = 'done-task-selected'
  }
  return className
}
const handleGoToUnfilledTask = (group: InterventionGroup) => {
  const isDisabled = props.generalSubmitted === false
  if (isDisabled) return
  if (group.group == 'Identified Defects') return
  if (group.key != props.selectedGroup.key) {
    emits('groupChange', group)
    nextTick(() => {
      emits('onGoToOpenRequiredTask', null)
    })
    return
  }
  emits('onGoToOpenRequiredTask', null)
}
const groupTaskProgress = (key: string) => {
  const groupProgress = props.taskProgress.find((task) => {
    return task.key == key
  })
  if (groupProgress) {
    return groupProgress
  } else {
    return {
      taskDone: 0,
      taskTotal: 0
    }
  }
}
</script>

<style lang="scss" scoped>
  .clickable {
    cursor: pointer;
  }
  .box-menu {
    min-height: 80px;
    background: #DFE3E8;
    border-radius: 12px;
    cursor: pointer;
    font-size: 12px;
    height: 100%;
    word-break: initial;
  }
  .box-pill {
    background: #DFE3E8;
    font-size: 12px;
  }
  .active {
    background: #01A3FF;
    color: white;
  }
  .disabled {
    border: 1px solid #999999;
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
  }

  .done-task-selected, .done-task {
    .stepper-title {
      color: white;
      border: none;
    }
  }
  .normal-cursor {
    cursor: default !important;
  }
</style>
