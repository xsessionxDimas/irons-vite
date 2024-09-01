<template>
    <div :class="[textAlign, potraitWidthStyle, paddingBottomCondition]" :style="style" class="px-2 pt-2">
        <label v-html="content"></label>
    </div>
  </template>

<script lang="ts" setup>
import { addSpanOnHyphen } from '@/core/helpers/manipulate-html-string'
import { Border } from '@/core/types/intervention/Border'
import { BorderRadius } from '@/core/types/intervention/BorderRadius'
import { DetailTaskItem } from '@/core/types/intervention/DetailTaskItem'
import { IDetailTask } from '@/core/types/intervention/IDetailTask'
import { Style } from '@/core/types/intervention/Style'
import { isEqual, last } from 'lodash'
import {
  defineProps,
  PropType,
  computed
} from 'vue'

const props = defineProps({
  item: {
    type: Object as PropType<DetailTaskItem>,
    required: true
  },
  task: {
    type: Object as PropType<IDetailTask>,
    required: true
  }
})

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
  return props.task.updatedBy != ""
})
const content = computed(() => {
  return addSpanOnHyphen(props.item.value)
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
const textAlign = computed(() => {
  let align = ''
  if (props.item.style && props.item.style.textAlign) {
    switch (props.item.style.textAlign) {
      case 'left':
        align = 'text-start'
        break
      case 'right':
        align = 'text-end'
        break
      default:
        align = 'text-center'
    }
  }
  return align
})
const paddingBottomCondition = computed(() => {
  return isTaskUpdated.value ? '' : 'pb-2'
})
const style = computed(() => {
  const backGroundColor = hasStyle.value && itemStyle.value.bgColor != 'none' ? `background-color: ${itemStyle.value.bgColor}; ` : ""
  const fontColor = hasStyle.value && itemStyle.value.fontColor != 'none' ? `color: ${itemStyle.value.fontColor}; ` : ""
  const borderTop = hasBorder.value && itemStyleBorder.value.top != 'none' ? `border-top: ${itemStyleBorder.value.top}; ` : ""
  const borderRight = hasBorder.value && itemStyleBorder.value.right != 'none' ? `border-right: ${itemStyleBorder.value.right}; ` : ""
  let borderBottom = hasBorder.value && itemStyleBorder.value.bottom != 'none' ? `border-bottom: ${itemStyleBorder.value.bottom}; margin-bottom: 1rem;` : ""
  let totalCol = 0
  props.task.items.forEach((item) => {
    if (hasBorder.value) {
      if (itemStyleBorder.value.right == 'none') {
        totalCol = totalCol + Number(itemStyle.value.breakPoint)
      }
      if (isEqual(item, last(props.task.items))) {
        totalCol = totalCol + Number(itemStyle.value.breakPoint)
      }
    } else if (!hasBorder.value) {
      totalCol = totalCol + Number(itemStyle.value.breakPoint)
    }
  })
  if (totalCol == 12) {
    borderBottom = isTaskUpdated.value && hasStyle.value && !hasBorder.value && itemStyleBorder.value.bottom != 'none' ? `border-bottom: ${itemStyleBorder.value.bottom}; margin-bottom: 1rem; ` : ""
  }
  const borderLeft = hasBorder.value && itemStyleBorder.value.left != 'none' ? `border-left: ${itemStyleBorder.value.left}; ` : ""
  const borderRadiusTopRight = hasBorderRadius.value && itemStyleBorderRadius.value.topRight != 'none' ? `border-top-right-radius: ${itemStyleBorderRadius.value.topRight}; ` : ""
  const borderRadiusBottomRight = hasBorderRadius.value && itemStyleBorderRadius.value.bottomRight != 'none' ? `border-bottom-right-radius: ${itemStyleBorderRadius.value.bottomRight}; ` : ""
  const borderRadiusTopLeft = hasBorderRadius.value && itemStyleBorderRadius.value.topLeft != 'none' ? `border-top-left-radius: ${itemStyleBorderRadius.value.topLeft}; ` : ""
  const borderRadiusBottomLeft = hasBorderRadius.value && itemStyleBorderRadius.value.bottomLeft != 'none' ? `border-bottom-left-radius: ${itemStyleBorderRadius.value.bottomLeft}; ` : ""
  return `${backGroundColor}${fontColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
})
</script>

<style lang="scss">
  .letter-space-hypen {
    letter-spacing: 1.5px;
  }
</style>
