<template>
    <div>
      <div class="row w-100 m-0" :class="[requiredTaskClass, isTaskValue]">
        <template v-for="item in items" :key="item.key">
          <LabelItem v-if="item.itemType === 'label'" :item="item" :task="task" />
          <InputItem v-if="item.itemType === 'input'"
          :item="item"
          :task="task"
          :is-read-only="isReadOnly"
          :current-fitter="currentFitter"
          :validation="validation"
          :loading-indicator="itemLoadingIndicator(item.key)"
          :loading-comment-indicator="false"
          :item-trigger-disabled-value="props.itemTriggerDisabledValue"
          :is-disabled="isShowAdjustmentRow"
          :currInputTyped="currInputTyped"
          :general-submitted="generalSubmitted"
          @on-input-changed="onTaskChanged" />
          <DropdownItem v-if="item.itemType === 'dropDown'"
          :item="item"
          :task="task"
          :is-read-only="isReadOnly"
          :current-fitter="currentFitter"
          :validation="''"
          :loading-indicator="itemLoadingIndicator(item.key)"
          :loading-comment-indicator="false"
          :item-trigger-disabled-value="props.itemTriggerDisabledValue"
          :general-submitted="generalSubmitted"
          @on-task-changed="onTaskChanged"
          @on-defect-view="onDefectView" />
          <CameraItem v-if="item.itemType === 'smallCamera'"
          :general-submitted="generalSubmitted"
          :intervention="intervention"
          :is-read-only="isReadOnly"
          :re-render="reRender"
          :item="item"
          :task="task"
          :current-fitter="currentFitter"
          @on-camera-clicked="onSmallCameraClicked"
          @on-image-delete="onImageDeleted"
          @on-downloaded="onImageDownloaded"
          />
          <AdjustmentButton v-if="item.itemType === 'button'"
          :item="item"
          :is-read-only="isReadOnly"
          :task="task"
          :isShowAdjustmentRow="isShowAdjustmentRow"
          :current-fitter="currentFitter"
          @on-show-adjustment="onShowAdjustmentTask"
          />
          <HTML v-if="item.itemType === 'html'" :item="item" :task="task" />
        </template>
      </div>
      <div v-if="task.updatedBy != '' && (task.updatedBy as Audit).name" class="row w-100 position-absolute pe-3" :style="`top: ${timeStampTop};`">
        <div class="d-flex justify-content-end pb-1 my-0 timestamp-task" :class="updatedByContainerPlacementClass">
          {{ (task.updatedBy as Audit).name }}, {{ task.updatedDate }}
        </div>
      </div>
      <template v-if="task.updatedBy != ''">
        <div class="row w-100">
          <div :style="style" :class="updatedByContainerPlacementClass" style="height: 25px"></div>
        </div>
      </template>
      <template v-if="isShowAdjustmentRow && task.adjustment">
        <TaskAdjustment
        :re-render="reRender"
        :is-read-only="isReadOnly"
        :task="task"
        :current-fitter="currentFitter"
        :loading-indicator="itemLoadingIndicator(task.adjustment.key)"
        @on-hide-adjustment="onDeleteAdjustmentTask"
        @on-task-changed="onTaskChanged"
        @on-camera-clicked="onSmallCameraClicked"
        @on-image-delete="onImageDeleted"
        @on-downloaded="onImageDownloaded" />
      </template>
      <template v-if="task.reference">
        <CollapsibleTableItem :reference="task.reference" v-if="task.reference.taskType == 'collapsibleTable'" />
        <ReferenceInline
        :reference="task.reference"
        :items="(task.reference.items as ReferenceItemDetail[])"
        v-if="task.reference.taskType == 'inline'" />
      </template>
    </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  defineEmits,
  PropType,
  ref,
  onMounted
} from 'vue'
import { DetailTaskItem } from '@/core/types/intervention/DetailTaskItem'
import { IDetailTask } from '@/core/types/intervention/IDetailTask'
import { Audit } from '@/core/types/intervention/Audit'
import LabelItem from '@/views/dma/component-intervention-forms/components/refactor/LabelItem.vue'
import InputItem from '@/views/dma/component-intervention-forms/components/refactor/InputItem.vue'
import DropdownItem from '@/views/dma/component-intervention-forms/components/refactor/DropdownItem.vue'
import CameraItem from '@/views/dma/component-intervention-forms/components/refactor/CameraItem.vue'
import { isUndefined, last } from 'lodash'
import { TaskUpdateObject } from '@/core/types/intervention/TaskUpdateObject'
import { KeyValue } from '@/core/types/misc/KeyValue'
import { FileDeleteParam } from '@/core/types/intervention/FileDeleteParam'
import { Image } from '@/core/types/intervention/Image'
import TaskAdjustment from '@/views/dma/component-intervention-forms/components/refactor/TaskAdjustment.vue'
import AdjustmentButton from '@/views/dma/component-intervention-forms/components/refactor/AdjustmentButton.vue'
import HTML from '@/views/dma/component-intervention-forms/components/refactor/HTML.vue'
import { Intervention } from '@/core/types/intervention/Intervention'
import CollapsibleTableItem from './CollapsibleTableItem.vue'
import ReferenceInline from './ReferenceInline.vue'
import {
  ReferenceItemDetail
} from '@/core/types/intervention/ReferenceItemDetail'

const props = defineProps({
  intervention: {
    required: true,
    type: Object as PropType<Intervention>
  },
  items: {
    required: true,
    type: Object as PropType<DetailTaskItem[]>,
  },
  task: {
    required: true,
    type: Object as PropType<IDetailTask>
  },
  defectImages: {
    type: Object,
    required: true
  },
  currentFitter: {
    required: true,
    type: Object as PropType<Audit>
  },
  loadingIndicator: {
    required: true,
    type: Object
  },
  itemTriggerDisabledValue: {
    required: true,
    type: Object
  },
  reRender: {
    type: Boolean,
    default: false
  },
  isReadOnly: {
    type: Boolean,
    default: false
  },
  validation: {
    type: String,
    default: ""
  },
  currInputTyped: {
    type: String,
    default: ""
  },
  formStatus: {
    type: String,
    required: false
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  },
})

/* emits */
const emits = defineEmits([
  'onTaskChanged',
  'onNACreated',
  'onDefectView',
  'onInitLoadingIndicator',
  'onSmallCameraClicked',
  'onImageDeleted',
  'onImageDownloaded'
])

const isTaskLoading = ref(false)
const isShowAdjustmentRowManual = ref(false)

const timeStampTop = computed(() => {
  let number = 40
  if (isTaskLoading.value) number = 60
  return number
})

const requiredTaskClass = computed(() => {
  let className = ''
  if (props.task.taskValue != undefined) {
    if (props.task.taskValue == '') {
      className = 'task-required'
    }
  }
  return className
})

const isShowAdjustmentRow = computed(() => {
  return isShowAdjustmentRowManual.value || Boolean(props.task.adjustment && props.task.adjustment.measurement)
})

const style = computed(() => {
  // get first item
  const firstItem = props.task.items[0]
  // get last item
  const lastItem = last(props.items) as DetailTaskItem
  const isUpdated = props.task.updatedBy != ''
  const borderRight = !isUndefined(lastItem.style) && !isUndefined(lastItem.style.border) && lastItem.style.border.right != 'none' ? `border-right: ${lastItem.style.border.right}; ` : ""
  const borderBottom = isUpdated && (!isUndefined(lastItem.style) && !isUndefined(lastItem.style.border) && lastItem.style.border.bottom != 'none') ? `border-bottom: ${lastItem.style.border.bottom}; ` : ""
  const borderLeft = !isUndefined(firstItem.style) && !isUndefined(firstItem.style.border) && firstItem.style.border.left != 'none' ? `border-left: ${firstItem.style.border.left}; ` : ""
  const marginBottomTable = isUpdated && !isUndefined(lastItem.style) && !isUndefined(lastItem.style.border) && lastItem.style.border.bottom != 'none' ? `margin-bottom: 4px ` : ""
  return `${borderRight}${borderLeft}${borderBottom}${marginBottomTable}`
})

const updatedByContainerPlacementClass = computed(() => {
  // get remaining column
  let col = 12
  // get total offset
  let offset = 0
  return `col-${col} offset-${offset}`
})

const isTaskValue = computed(() => {
  let className = ""
  if (props.formStatus && props.formStatus == 'Open') return className
  if (!props.isReadOnly) return className
  if (Object.hasOwn(props.task, 'taskValue') && !props.task.taskValue) {
    className = 'task-required-highlight'
  } else {
    className = ""
  }
  return className
})

const onShowAdjustmentTask = () => {
  isShowAdjustmentRowManual.value = true
}
const onDeleteAdjustmentTask = () => {
  isShowAdjustmentRowManual.value = false
}
const onTaskChanged = (data: TaskUpdateObject, asyncfunction, helper) => {
  emits('onTaskChanged', {
    data: data,
    asyncfunction: asyncfunction,
    helper
  })
}
const onDefectView = (data: KeyValue) => {
  emits('onDefectView', data)
}
const onImageDownloaded = (params: {image: Image, setImage}): void => {
  emits('onImageDownloaded', params)
}
const onSmallCameraClicked = (param: TaskUpdateObject) => {
  emits('onSmallCameraClicked', param)
}
const onImageDeleted = (param: FileDeleteParam) => {
  emits('onImageDeleted', param)
}
const itemLoadingIndicator = (key: string) => {
  const isExists = key in props.loadingIndicator
  if (!isExists) {
    emits('onInitLoadingIndicator', key)
    return false
  }
  return props.loadingIndicator[key]
}

onMounted(() => {
  isShowAdjustmentRowManual.value = Boolean(props.task.adjustment && props.task.adjustment.measurement)
})
</script>

<style scoped>
  .task-wrapper {
    position:relative
  }
</style>

<style lang="scss" scoped>
  .task-required-highlight {
    background-color: #ecc9c9;
  }
</style>
