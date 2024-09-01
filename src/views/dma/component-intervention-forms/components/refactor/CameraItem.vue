<template>
    <div :class="[widthStyle, potraitWidthStyle, paddingBottomCondition]" :style="style" class="pt-2">
      <div class="row" :class="!isUndefined(item.value) && item.value.length > 0 ? 'justify-content-around' : 'justify-content-center'">
        <div class="d-flex justify-content-center" :class="!isUndefined(item.value) && item.value.length > 0 ? 'col-6 pe-0 ps-1' : 'col-6 px-0'">
          <button class="btn btn-sm btn-icon btn-bg-light" @click="handleClickCamera" :disabled="readOnly">
            <template v-if="task.images && task.images.length > 0">
              <NwImg src="/media/svg/dma/camera/e-form/png/cam-user.png" style="height: 12px; width: 14px;" alt="camera" />
            </template>
            <template v-else>
              <NwImg src="/media/svg/dma/camera/e-form/png/cam-active.png" style="height: 12px; width: 14px;" alt="camera" />
            </template>
          </button>
        </div>
        <template v-if="imageValues && imageValues.length > 0">
          <div class="col-6 ps-0 pe-1 d-flex justify-content-center">
            <button class="btn btn-sm btn-icon btn-bg-success" @click="handleShowModal" style="background-color: #18AF4A;">
              <label class="text-white">+{{ imageValues.length }}</label>
            </button>
          </div>
        </template>
      </div>
      <ImagePreview
      :type="'cbm'"
      :re-render="reRender"
      :images="imageValues"
      :visibility="modalVisibility"
      :showDeleteButton="!readOnly"
      :show-mandatory-caption="true"
      :is-monitoring="isReadOnly"
      @on-close="handleHideModal"
      @on-delete="handleDelete"
      @on-downloaded="handleDownload" />
    </div>
  </template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  PropType,
  computed,
  ref,
  toRef
} from 'vue'
import { Border } from '@/core/types/intervention/Border'
import { BorderRadius } from '@/core/types/intervention/BorderRadius'
import { DetailTaskItem } from '@/core/types/intervention/DetailTaskItem'
import { IDetailTask } from '@/core/types/intervention/IDetailTask'
import { Style } from '@/core/types/intervention/Style'
import { Audit } from '@/core/types/intervention/Audit'
import {
  isUndefined,
  isEqual,
  last,
  isArray
} from 'lodash'
import ImagePreview from '@/components/camera/ImagePreview.vue'
import { TaskUpdateObject } from '@/core/types/intervention/TaskUpdateObject'
import { AESTCurrentDateTime } from '@/core/helpers/date-format'
import { FileDeleteParam } from '@/core/types/intervention/FileDeleteParam'
import { ImageLoadParam } from '@/core/types/intervention/ImageLoadParam'
import { Intervention } from '@/core/types/intervention/Intervention'

/* props */
const props = defineProps({
  intervention: {
    required: true,
    type: Object as PropType<Intervention>
  },
  item: {
    type: Object as PropType<DetailTaskItem>,
    required: true
  },
  task: {
    type: Object as PropType<IDetailTask>,
    required: true
  },
  currentFitter: {
    type: Object as PropType<Audit>,
    required: true
  },
  reRender: {
    type: Boolean,
    default: false
  },
  isReadOnly: {
    type: Boolean,
    default: false
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  },
})

/* emits */
const emits = defineEmits([
  'onTaskChanged',
  'onCameraClicked',
  'onImageDelete',
  'onDownloaded'
])

/* refs */
const modalVisibility = ref(false)
const selectedTask = toRef(props, 'task')

const hasStyle = computed(() => {
  return props.item.style != undefined
})
const itemStyle = computed(() => {
  return props.item.style as Style
})
const hasBorder = computed(() => {
  return hasStyle.value && itemStyle.value.border != undefined
})
const itemStyleBorder = computed(() => {
  return itemStyle.value.border as Border
})
const hasBorderRadius = computed(() => {
  return hasStyle.value && itemStyle.value.borderRadius != undefined
})
const itemStyleBorderRadius = computed(() => {
  return itemStyle.value.borderRadius as BorderRadius
})
const isTaskUpdated = computed(() => {
  return props.task.updatedBy != ''
})
const widthStyle = computed(() => {
  return hasStyle.value && itemStyle.value.breakPoint != 'none' ? `col-${itemStyle.value.breakPoint}` : 'col'
})
const potraitWidthStyle = computed(() => {
  let customClass = ''
  if (hasStyle.value) {
    const hasPotraitBreakPoint = itemStyle.value.potraitBreakPoint
    if (hasPotraitBreakPoint && itemStyle.value.breakPoint != 'none') {
      customClass = `col-md-${itemStyle.value.potraitBreakPoint}`
    }
    customClass = `${customClass} col-lg-${itemStyle.value.breakPoint}`
  }
  return customClass
})
const paddingBottomCondition = computed(() => {
  return isTaskUpdated.value ? '' : 'pb-2'
})
const style = computed(() => {
  const backGroundColor = hasStyle.value && itemStyle.value.bgColor != 'none' ? `background-color: ${itemStyle.value.bgColor}; ` : ''
  const fontColor = hasStyle.value && itemStyle.value.fontColor != 'none' ? `color: ${itemStyle.value.fontColor}; ` : ''
  const borderTop = hasBorder.value && itemStyleBorder.value.top != 'none' ? `border-top: ${itemStyleBorder.value.top}; ` : ''
  const borderRight = hasBorder.value && itemStyleBorder.value.right != 'none' ? `border-right: ${itemStyleBorder.value.right}; ` : ''
  let borderBottom = hasBorder.value && itemStyleBorder.value.bottom != 'none' ? `border-bottom: ${itemStyleBorder.value.bottom}; margin-bottom: 1rem;` : ''
  let totalCol = 0
  props.task.items.forEach((item) => {
    if (hasBorder.value) {
      if ((itemStyleBorder.value.right == 'none') || (isEqual(item, last(props.task.items)))) {
        totalCol = totalCol + Number(itemStyle.value.breakPoint)
      }
    } else {
      totalCol = totalCol + Number(itemStyle.value.breakPoint)
    }
  })
  if (totalCol == 12) {
    borderBottom = isTaskUpdated.value && hasStyle.value && !hasBorder.value && itemStyleBorder.value.bottom != 'none' ? `border-bottom: ${itemStyleBorder.value.bottom}; margin-bottom: 1rem; ` : ''
  }
  const borderLeft = hasBorder.value && itemStyleBorder.value.left != 'none' ? `border-left: ${itemStyleBorder.value.left}; ` : ''
  const borderRadiusTopRight = hasBorderRadius.value && itemStyleBorderRadius.value.topRight != 'none' ? `border-top-right-radius: ${itemStyleBorderRadius.value.topRight}; ` : ''
  const borderRadiusBottomRight = hasBorderRadius.value && itemStyleBorderRadius.value.bottomRight != 'none' ? `border-bottom-right-radius: ${itemStyleBorderRadius.value.bottomRight}; ` : ''
  const borderRadiusTopLeft = hasBorderRadius.value && itemStyleBorderRadius.value.topLeft != 'none' ? `border-top-left-radius: ${itemStyleBorderRadius.value.topLeft}; ` : ''
  const borderRadiusBottomLeft = hasBorderRadius.value && itemStyleBorderRadius.value.bottomLeft != 'none' ? `border-bottom-left-radius: ${itemStyleBorderRadius.value.bottomLeft}; ` : ''
  return `${backGroundColor}${fontColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
})
const readOnly = computed(() => {
  if (props.isReadOnly) return true
  if (!props.generalSubmitted) return true
  let sameFitter = true
  // --------- case task replacement ----------
  let replacementMeasurementDisabled = false
  const isTaskReplacement = props.task.rating == "AUTOMATIC_REPLACEMENT" || props.task.rating == "AUTOMATIC_REPLACEMENT_GAP"
  const isTaskNormValueComplete = props.task.taskNormalValue == "1" || props.task.taskNormalValue == "2"
  // jika taskNormalValue kosong maka disable (taskNormalValue nyimpen value 1/NA)
  if (isTaskReplacement && !isTaskNormValueComplete) {
    replacementMeasurementDisabled = true
  }
  // --------- case task replacement ----------
  return !sameFitter || replacementMeasurementDisabled
})
const taskUpdated = computed(() => {
  let updated = false
  if (props.currentFitter) {
    if (props.currentFitter && props.task.taskValue != '' && (props.task.updatedBy as Audit).id != props.currentFitter.id) {
      updated = true
    }
  }
  return updated
})
const imageValues = computed(() => {
  if (props.task.images && props.task.images != "") {
    if (isArray(props.task.images)) {
      return props.task.images
    } else {
      return JSON.parse(props.task.images)
    }
  } else {
    return []
  }
})

/* methods and event handlers */
const handleClickCamera = () => {
  console.log(readOnly.value)
  if (readOnly.value) return
  const data = {} as TaskUpdateObject
  data.employee = props.currentFitter
  data.taskKey = props.task.key
  data.taskCategory = props.task.category
  data.itemKey = props.item.key
  data.type = props.item.valueItemType as string
  data.value = ''
  data.timeStamp = AESTCurrentDateTime()
  data.task = selectedTask.value
  emits('onCameraClicked', data)
}
const handleDelete = async (filename: string) => {
  const task = {} as TaskUpdateObject
  task.employee = props.currentFitter
  task.taskKey = props.task.key
  task.taskCategory = props.task.category
  task.itemKey = props.item.key
  task.type = props.item.valueItemType as string
  task.value = ''
  task.timeStamp = AESTCurrentDateTime()
  task.task = selectedTask.value
  const data = {} as FileDeleteParam
  data.task = task
  data.filename = filename
  if (selectedTask.value.images!.length == 1) {
    handleHideModal()
  }
  emits('onImageDelete', data)
}
const handleDownload = (image: ImageLoadParam) => {
  emits('onDownloaded', image)
}
const handleShowModal = () => {
  modalVisibility.value = true
}
const handleHideModal = () => {
  modalVisibility.value = false
}
</script>
