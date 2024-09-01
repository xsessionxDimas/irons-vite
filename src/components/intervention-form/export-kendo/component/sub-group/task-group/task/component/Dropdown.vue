<template>
  <div :class="[widthStyle]" class="px-2 py-2" :style="props.task && props.task.isShowAdjustmentRow? `${style}border-bottom:0px;margin-bottom:0px;` : style">
    <div v-if="inputValue" class="content" :style="styleBorderFont">
      <div v-html="addHyphenSpan(options.find((val) => {
        return val.value == inputValue
      })?.label || '')"></div>
    </div>
    <div v-else class="content no-answer" style="min-height: 32px"></div>
  </div>
</template>

<script lang="ts" setup>
import { Item } from '@/core/types/entities/dma/e-form/Item';
import {
  computed,
  defineProps,
  PropType,
  toRef,
  ref
} from 'vue'
import { isUndefined, isEqual, last } from 'lodash';
import { Task } from '@/core/types/entities/dma/e-form/Task';

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object as PropType<Task>
  },
  generalStyle: {
    type: Boolean,
    default: true
  }
});

const itemRef = toRef(props, 'item')
const taskPropsItem = toRef(props, 'task')

const widthStyle = computed(() => {
  if (props.generalStyle) {
    return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col"
  }
  return ''
})

const inputValue = ref(props.item.value.toString().replaceAll("'", ''))

const options = computed(() => {
  const itemValArr = props.item.caption!.replace("[", "").replace("]", "").split("; ")
  const valArr = props.item.itemValue!.replace("[", "").replace("]", "").split(", ")
  const options = itemValArr.map((el, index) => {
    return {
      label: el.replaceAll("'", ''),
      value: valArr[index].replaceAll("'", '')
    }
  });
  return options
})

const style = computed(() => {
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; ` : ""
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

  return `${backGroundColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
});

const styleBorderFont = computed(() => {
  const val = itemRef.value.value.toString().replaceAll("'", '');
  if (val == '1' || val == '2') {
    return "border: 1px solid #18AF4A;color: #18AF4A;"
  } else if (val == '3') {
    return "border: 1px solid #FF4842;color: #FF4842;"
  } else if (val == '4') {
    return "border: 1px solid #FFC107;color: #FFC107;"
  } else if (val == 'A') {
    return "border: 1px solid #18AF4A;color: #18AF4A;background-color: rgba(24, 175, 74, 0.08);"
  } else if (val == 'B') {
    return "border: 1px solid rgba(51, 102, 255, 0.48);color: #01A3FF;background-color: rgba(51, 102, 255, 0.08);"
  } else if (val == 'C') {
    return "border: 1px solid #FFC107;color: #FFC107;background-color: rgba(255, 193, 7, 0.08);"
  } else if (val == 'X') {
    return "border: 1px solid rgba(255, 72, 66, 0.48);color: #FF4842;background-color: rgba(255, 72, 66, 0.08);"
  } else {
    return "border: 1px solid rgb(0,0,0);color: rgb(0,0,0);"
  }
})

const addHyphenSpan = ((string) => {
  return string.replaceAll(" - ", "<span class='letter-space-hypen'> - </span>").replaceAll(" – ", "<span class='letter-space-hypen'> – </span>")
})

</script>

<style lang="scss" scoped>

.content {
  line-height: 32px;
  border-radius: 4px;
  // height: 32px;
  width: 100%;
  padding: 0;
  padding-left: 7px;
  // overflow: clip;
}
.no-answer {
  border: 1px solid rgb(228, 231, 237);
  color: rgb(192, 196, 204);
}
</style>
