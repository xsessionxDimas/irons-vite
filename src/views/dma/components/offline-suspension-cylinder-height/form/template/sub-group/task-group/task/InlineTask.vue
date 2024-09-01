<template>
<div class="row w-100" :style="[generalStyle, taskCustomStyle]">
  <template v-for="item in props.task.items" :key="item.key">
    <Image v-if="item.itemType === 'image'" :item="item" :task="task"/>
    <Label v-if="item.itemType === 'label'" :item="item" :task="task"/>
    <Dropdown v-if="item.itemType === 'dropDown'" :item="item" :task="task" @setLoading="setLoading"/>
    <Input v-if="item.itemType === 'input'" :item="item" :task="task" />
    <SmallCamera v-if="item.itemType === 'smallCamera'" :item="item" :task="task"/>
    <CheckBox v-if="item.itemType === 'checkbox'" :item="item" :task="task"/>
    <Html v-if="item.itemType === 'html'" :item="item" :task="task"/>
    <InteractiveButton v-if="item.itemType === 'button'" :item="item" :task="task"/>
    <StatusInfo v-if="item.itemType === 'statusInfo'" :item="item" :task="task" />
    <RadioButtonWithStatus v-if="item.itemType === 'radioButtonWithStatus'" :item="item" :task="task"/>
    <TextAreaInput v-if="item.itemType === 'textAreaInput'" :item="item" :task="task"/>
    <InputWithPlaceholder v-if="item.itemType === 'inputWithPlaceholder'" :item="item" :task="task"/>
  </template>
</div>
<div v-if="task.updatedBy!.name" class="row w-100 position-absolute pe-3" :style="`top: ${timeStampTop}px;`">
  <div class="d-flex justify-content-end pb-1 my-0 timestamp-task" :style="[style, borderBottomStyle]" :class="updatedByContainerPlacementClass">
    <!-- {{ task.updatedBy!.name }}, {{ task.updatedDate! }} -->
  </div>
</div>
<template v-if="task.updatedBy!.name">
  <div class="row w-100" style="height: 25px">
    <template v-if="!isDropDownOutsideTable">
      <div :style="style" :class="updatedByContainerPlacementClass"></div>
    </template>
    <template v-else>
      <div class="col-1"></div>
      <div class="col-1" :style="`border-left: ${leftBorderRef}`"></div>
      <div :class="`col-md-${rightBorderMDBreakpoint} col-lg-${rightBorderLGBreakpoint}`" :style="`border-right: ${rightBorderRef}`"></div>
    </template>
  </div>
</template>
<!-- task.category == 'CBM' && task.rating == 'AUTOMATIC' && task.taskValue == 'C' || task.taskValue == 'X' -->
<template v-if="task.isShowAdjustmentRow">
  <TaskAdjustment :task="task" />
</template>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  PropType,
  ref
} from 'vue'
import Image from './item/Image.vue'
import Label from './item/Label.vue'
import Dropdown from './item/Dropdown.vue';
import Input from './item/Input.vue';
import { Task } from '@/core/types/entities/dma/e-form/Task';
import { last, isUndefined } from "lodash"
import SmallCamera from './item/small-camera/SmallCamera.vue';
import CheckBox from './item/CheckBox.vue';
import Html from "@/components/e-form/OfflineHTML.vue";
import InteractiveButton from './item/InteractiveButton.vue';
import TaskAdjustment from './TaskAdjustment.vue'
import StatusInfo from "@/components/e-form/statusInfo.vue"
import RadioButtonWithStatus from "./item/RadioButtonWithStatus.vue"
import TextAreaInput from './item/TextAreaInput.vue';
import InputWithPlaceholder from './item/InputWithPlaceholder.vue';

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  },
  taskIndex: {
    type: Number,
    required: true
  },
  taskGroup: {
    type: Array as PropType<Task[]>,
    required: true
  }
});

const updatedByContainerPlacementClass = computed(() => {
  // get remaining column
  let col = 12
  // get total offset
  let offset = 0
  props.task.items.every((item) => {
    if (!isUndefined(item.style) && item.style.visibility == 'hidden') {
      col = Number(col) - Number(item.style.breakPoint)
      offset = Number(offset) + Number(item.style.breakPoint)
      return true
    } else {
      return false
    }
  })
  return `col-${col} offset-${offset}`
})

const leftBorderRef = ref('')
const rightBorderRef = ref('')

const rightBorderMDBreakpoint = computed(() => {
  let rightBorderMDBreakpoint = 0
  props.task.items.forEach((item, index) => {
    if ((index + 1) == props.task.items.length) {
      if (item.itemType == "dropDown") {
        const itemBeforeLastItem = props.task.items[index - 1]
        if (!isUndefined(itemBeforeLastItem!.style) && !isUndefined(itemBeforeLastItem!.style.border) && itemBeforeLastItem!.style.border.right != 'none') {
          if (props.task.items.length == 3) {
            rightBorderMDBreakpoint = Number(itemBeforeLastItem.style.breakPoint) - 1
          } else {
            props.task.items.forEach((itemBp, indexBp) => {
              if (indexBp > 1 && indexBp <= index - 1) {
                let currentItemBp = 0
                if (!isUndefined(itemBp.style.potraitBreakPoint)) {
                  currentItemBp = itemBp.style.potraitBreakPoint
                } else {
                  let usedBreakpoints = 0
                  if (itemBp.style.breakPoint == 'none') {
                    props.task.items.forEach((itemCountBr, indexCountBr) => {
                      if (itemCountBr.style.breakPoint != 'none') {
                        usedBreakpoints += Number(itemCountBr.style.breakPoint)
                      }
                    })
                    currentItemBp = 12 - usedBreakpoints
                  } else {
                    currentItemBp = (itemBp.style.breakPoint - usedBreakpoints)
                  }
                }
                rightBorderMDBreakpoint += Number(currentItemBp)
              }
            })
          }
        }
      }
    }
  })
  return rightBorderMDBreakpoint
})

const rightBorderLGBreakpoint = computed(() => {
  let rightBorderLGBreakpoint = 0
  props.task.items.forEach((item, index) => {
    if ((index + 1) == props.task.items.length) {
      if (item.itemType == "dropDown") {
        const itemBeforeLastItem = props.task.items[index - 1]
        if (!isUndefined(itemBeforeLastItem!.style) && !isUndefined(itemBeforeLastItem!.style.border) && itemBeforeLastItem!.style.border.right != 'none') {
          if (props.task.items.length == 3) {
            rightBorderLGBreakpoint = Number(itemBeforeLastItem.style.breakPoint) - 1
          } else {
            props.task.items.forEach((itemBp, indexBp) => {
              if (indexBp > 1 && indexBp <= index - 1) {
                let currentItemBp = 0
                let usedBreakpoints = 0
                if (itemBp.style.breakPoint == 'none') {
                  props.task.items.forEach((itemCountBr, indexCountBr) => {
                    if (itemCountBr.style.breakPoint != 'none') {
                      usedBreakpoints += Number(itemCountBr.style.breakPoint)
                    }
                  })
                  currentItemBp = 12 - usedBreakpoints
                } else {
                  currentItemBp = (itemBp.style.breakPoint - usedBreakpoints)
                }
                rightBorderLGBreakpoint += Number(currentItemBp)
              }
            })
          }
        }
      }
    }
  })
  return rightBorderLGBreakpoint
})

const isDropDownOutsideTable = computed(() => {
  // let status = false
  let leftBorder = false
  let rightBorder = false
  let bottomBorder = false
  props.task.items.forEach((item, index) => {
    if (index == 1) {
      if (!isUndefined(item!.style) && !isUndefined(item!.style.border) && item!.style.border.left != 'none') {
        leftBorder = true
        leftBorderRef.value = item!.style.border.left
        if (!isUndefined(item!.style) && !isUndefined(item!.style.border) && item!.style.border.bottom != 'none') {
          bottomBorder = true
        }
      }
    }
    if ((index + 1) == props.task.items.length) {
      if (item.itemType == "dropDown") {
        const itemBeforeLastItem = props.task.items[index - 1]
        if (!isUndefined(itemBeforeLastItem!.style) && !isUndefined(itemBeforeLastItem!.style.border) && itemBeforeLastItem!.style.border.right != 'none') {
          rightBorder = true
          rightBorderRef.value = itemBeforeLastItem!.style.border.right
        }
      }
    }
  })
  return leftBorder && rightBorder && !bottomBorder
})

const isTaskLoading = ref(false)

const setLoading = (status) => {
  isTaskLoading.value = status
}

const timeStampTop = computed(() => {
  let number = 40
  if (isTaskLoading.value) number = 60
  return number
})

const style = computed(() => {
  // get first item
  const firstItem = props.task.items.find((item) => {
    return item.style.visibility != 'hidden'
  })
  // get last item
  const lastItem = last(props.task.items)
  const borderRight = !isUndefined(lastItem!.style) && !isUndefined(lastItem!.style.border) && lastItem!.style.border.right != 'none' ? `border-right: ${lastItem!.style.border.right}; ` : ""
  const borderLeft = !isUndefined(firstItem!.style) && !isUndefined(firstItem!.style.border) && firstItem!.style.border.left != 'none' ? `border-left: ${firstItem!.style.border.left}; ` : ""
  const marginBottomTable = props.task.updatedBy!.name && !isUndefined(lastItem!.style) && !isUndefined(lastItem!.style.border) && lastItem!.style.border.bottom != 'none' ? `margin-bottom: 1rem; ` : ""
  if (borderRight) {
    return `${borderRight}${borderLeft}${marginBottomTable}`
  } else {
    return `${marginBottomTable}`
  }
})

const borderBottomStyle = computed(() => {
  let borderBottom = ''
  const lastItem = last(props.task.items)
  if (!isUndefined(props.task?.isShowAdjustmentRow) && props.task?.isShowAdjustmentRow) {
    borderBottom = ''
  } else {
    borderBottom = props.task.updatedBy!.name && !isUndefined(lastItem!.style) && !isUndefined(lastItem!.style.border) && lastItem!.style.border.bottom != 'none' ? `border-bottom: ${lastItem!.style.border.bottom}; ` : ""
  }
  return borderBottom
})

const generalStyle = computed(() => {
  let style = ''
  if (!isUndefined(props.task.generalStyle)) style = props.task.generalStyle
  return style
})

const taskCustomStyle = computed(() => {
  let style = ''
  const customStyle = props.task.customStyle
  if (!isUndefined(customStyle)) {
    const customStyleArr = customStyle.split(' | ')
    customStyleArr.forEach((custStyle) => {
      if (custStyle.includes('noteStyle')) {
        if (!isUndefined(props.taskGroup[props.taskIndex - 1].updatedBy!.name) && props.taskGroup[props.taskIndex - 1].updatedBy!.name) {
          style = `${style} ${custStyle.split(' = ')[1]}`
        }
      }
    })
  }
  return style
})
</script>
