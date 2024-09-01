<template>
  <div :class="widthStyle" class="px-2 py-2 input-historical" :style="props.task && props.task.isShowAdjustmentRow? `${style}border-bottom:0px;margin-bottom:0px;` : style">
    <div style="border: 1px solid rgb(220, 223, 230); padding: 0 15px; line-height: 32px; border-radius: 4px; min-height: 32px" v-if="props.item.value">{{ props.item.value }}</div>
    <div style="border: 1px solid rgb(220, 223, 230); padding: 0 15px; line-height: 32px; border-radius: 4px; color:#c0c4cc; min-height: 32px" v-else>{{ props.item.value }}</div>
  </div>
</template>

<script lang="ts" setup>
import { Item } from '@/core/types/entities/dma/e-form/Item';
import {
  computed,
  defineProps,
  PropType,
  toRef,
} from 'vue'
import { isUndefined, isEqual, last } from "lodash"
import { Task } from '@/core/types/entities/dma/e-form/Task';
import { addSpanOnHyphen } from '@/core/helpers/manipulate-html-string';

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
    return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col"
  }
  return ''
})

const content = computed(() => {
  return addSpanOnHyphen(props.item.value)
})

const dropDownColor = computed(() => {
  const val = itemRef.value.value.toString().replaceAll("'", '');
  let color = "normal"
  if (val == 'A') {
    color = 'a'
  } else if (val == 'B') {
    color = 'b'
  } else if (val == 'C') {
    color = 'c'
  } else if (val == 'X') {
    color = 'x'
  }
  return color
})

const style = computed(() => {
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; ` : ""
  const fontColor = !isUndefined(itemRef.value.style) && itemRef.value.style.fontColor != 'none' ? `color: ${itemRef.value.style.fontColor}; ` : ""
  const borderTop = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.top != 'none' ? `border-top: ${itemRef.value.style.border.top}; ` : ""
  const borderRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.right != 'none' ? `border-right: ${itemRef.value.style.border.right}; ` : ""
  let borderBottom = ''
  if (props.task?.updatedBy?.id) {
    borderBottom = ""
  } else {
    borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
  }
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
    if (props.task?.updatedBy?.id) {
      borderBottom = ""
    } else {
      borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
    }
  }
  const borderLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.left != 'none' ? `border-left: ${itemRef.value.style.border.left}; ` : ""

  const borderRadiusTopRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topRight != 'none' ? `border-top-right-radius: ${itemRef.value.style.borderRadius.topRight}; ` : ""
  const borderRadiusBottomRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomRight != 'none' ? `border-bottom-right-radius: ${itemRef.value.style.borderRadius.bottomRight}; ` : ""
  const borderRadiusTopLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topLeft != 'none' ? `border-top-left-radius: ${itemRef.value.style.borderRadius.topLeft}; ` : ""
  const borderRadiusBottomLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomLeft != 'none' ? `border-bottom-left-radius: ${itemRef.value.style.borderRadius.bottomLeft}; ` : ""

  return `${backGroundColor}${fontColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
})
</script>

<style lang="scss">
.input-historical {
  line-height: 32px;
  &-content {
    border: 1px solid rgb(220, 223, 230);
    padding: 0 15px;
    border-radius: 4px;
    height: 32px;
    overflow: hidden;
    font-size: 12px;

    &.disabled {
      color:#c0c4cc;
    }
  }
  .a {
    border: 1px solid rgba(24, 175, 74, 0.48);
    color: #18AF4A;
    background-color: rgba(24, 175, 74, 0.08);
  }
  .b {
    border: 1px solid rgba(51, 102, 255, 0.48);
    color: #01A3FF;
    background-color: rgba(51, 102, 255, 0.08);
  }
  .c {
    border: 1px solid #FFC107;
    color: #FFC107;
    background-color: rgba(255, 193, 7, 0.08);
  }
  .x {
    border: 1px solid rgba(255, 72, 66, 0.48);
    color: #FF4842;
    background-color: rgba(255, 72, 66, 0.08);
  }

  .normal {
    border: 1px solid rgb(220, 223, 230);
  }
}
</style>
