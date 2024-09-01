<template>
  <div :class="[widthStyle, textAlign]" class="px-2 py-2" :style="props.task && props.task.isShowAdjustmentRow? `${style}border-bottom:0px;margin-bottom:0px;` : style">
    <template v-if="!isUndefined(item.style) && item.style.visibility != 'hidden'">
      <div class="px-0 py-0 mx-0 my-0 d-flex justify-content-start align-items-center">
        <div class="little-box d-flex p-3 justify-content-center align-items-center" :class="[squareColor]"></div>
        <p class="legend-label mx-3 my-0">{{ item.value }}</p>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { addSpanOnHyphen } from '@/core/helpers/manipulate-html-string';
import { Item } from '@/core/types/entities/dma/e-form/Item';
import { Task } from '@/core/types/entities/dma/e-form/Task';
import { isUndefined, isEqual, last } from 'lodash';
import {
  defineProps,
  PropType,
  toRef,
  computed
} from 'vue'


const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  },
  generalStyle: {
    type: Boolean,
    default: true
  },
  task: {
    type: Object as PropType<Task>
  },
});
const itemRef = toRef(props, 'item')

const widthStyle = computed(() => {
  if (props.generalStyle) {
    return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col";
  }
  return ''
})

const squareColor = computed(() => {
  let color = ""
  switch (props.item.value) {
    case "Out Spec":
      color = "red"
      break;
    case "Out of spec":
      color = "red"
      break;
    case "In spec":
      color = "green"
      break;
    default:
      break;
  }
  return color
})

const textAlign = computed(() => {
  if (!isUndefined(itemRef.value.style)) {
    if (itemRef.value.style.textAlign == 'left') {
      return 'text-start';
    } else if (itemRef.value.style.textAlign == 'right') {
      return 'text-end'
    } else {
      return 'text-center'
    }
  } else {
    return '';
  }
})

const content = computed(() => {
  return addSpanOnHyphen(props.item.value)
})

const style = computed(() => {
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; ` : ""
  const fontColor = !isUndefined(itemRef.value.style) && itemRef.value.style.fontColor != 'none' ? `color: ${itemRef.value.style.fontColor}; ` : ""
  const borderTop = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.top != 'none' ? `border-top: ${itemRef.value.style.border.top}; ` : ""
  const borderRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.right != 'none' ? `border-right: ${itemRef.value.style.border.right}; ` : ""
  let borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
  // get total col for border bottom (if 12 this means full table and the border bottom must be below timestamp)
  // otherwise border bottom must be below item
  let totalCol = 0
  props.task?.items.forEach((item) => {
    if (!isUndefined(item.style)) {
      if (!isUndefined(item.style.border)) {
        if (item.style.border.right == 'none' || isUndefined(item.style.border.right)) {
          totalCol = totalCol + Number(item.style.breakPoint)
        }
        if (isEqual(item, last(props.task?.items))) {
          totalCol = totalCol + Number(item.style.breakPoint)
        }
      } else if (isUndefined(item.style.border)) {
        totalCol = totalCol + Number(item.style.breakPoint)
      }
    }
  })
  if (totalCol == 12) {
    borderBottom = !props.task!.updatedBy?.name && !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem; ` : ""
  }
  const borderLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.left != 'none' ? `border-left: ${itemRef.value.style.border.left}; ` : ""

  const borderRadiusTopRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topRight != 'none' ? `border-top-right-radius: ${itemRef.value.style.borderRadius.topRight}; ` : ""
  const borderRadiusBottomRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomRight != 'none' ? `border-bottom-right-radius: ${itemRef.value.style.borderRadius.bottomRight}; ` : ""
  const borderRadiusTopLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topLeft != 'none' ? `border-top-left-radius: ${itemRef.value.style.borderRadius.topLeft}; ` : ""
  const borderRadiusBottomLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomLeft != 'none' ? `border-bottom-left-radius: ${itemRef.value.style.borderRadius.bottomLeft}; ` : ""

  return `${backGroundColor}${fontColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
})

const labelStyle = computed(() => {
  const fontWeight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.fontWeight) && itemRef.value.style.fontWeight != 'normal' ? `font-weight: ${itemRef.value.style.fontWeight}; ` : ""
  return `${fontWeight}`
})
</script>

<style lang="scss">
.letter-space-hypen {
  letter-spacing: 1.5px;
}
</style>

<style lang="scss" scoped>
    @import "@/assets/sass/pages/defect.panel.scss";
</style>
