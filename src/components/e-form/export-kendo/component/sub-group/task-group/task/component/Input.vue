<template>
  <div :class="widthStyle" class="px-2 pt-2 input-historical" :style="style">
    <div class="input-historical-content" :style="fontSize" :class="dropDownColor" v-if="content">{{  content }}</div>
    <div class="input-historical-content disabled" style="min-height: 32px" v-else></div>
  </div>
</template>

<script lang="ts" setup>
import {
  Item,
  CategoryItemTypeEnum
} from '@/core/types/entities/dma/e-form/Item';
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

const fontSize = computed(() => {
  if (!props.item.categoryItemType) return ""
  const itemsCondition = itemRef.value.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING || itemRef.value.categoryItemType == CategoryItemTypeEnum.PREVIOUS_TARGET_RATING;
  if (itemsCondition) {
    return "font-size: 10px;"
  } else {
    return ""
  }
})

const content = computed(() => {
  if (itemRef.value.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_RATING && itemRef.value.value != "") {
    return `${(Number(itemRef.value.value as string) * 100)}%`
  }
  return addSpanOnHyphen(props.item.value)
})

const dropDownColor = computed(() => {
  const val = itemRef.value.value.toString().replaceAll("'", '');
  let color
  const isPrevTargetRating = itemRef.value.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING || itemRef.value.categoryItemType == CategoryItemTypeEnum.PREVIOUS_TARGET_RATING;
  if (itemRef.value.categoryItemType == "targetRating" || isPrevTargetRating) {
    if (val == 'A') {
      color = 'a'
    } else if (val == 'B') {
      color = 'b'
    } else if (val == 'C') {
      color = 'c'
    } else if (val == 'X') {
      color = 'x'
    }
  }
  return color
})

const style = computed(() => {
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; ` : ""
  const fontColor = !isUndefined(itemRef.value.style) && itemRef.value.style.fontColor != 'none' ? `color: ${itemRef.value.style.fontColor}; ` : ""
  const borderTop = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.top != 'none' ? `border-top: ${itemRef.value.style.border.top}; ` : ""
  const borderRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.right != 'none' ? `border-right: ${itemRef.value.style.border.right}; ` : ""
  let borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
  // check for condition CBM auto has additional row, jadi harus cek apakah menampilkan border dari item atau dari additional row
  const isReplacement = (!isUndefined(props.task?.replacement) && props.task?.replacement.measurement)
  const isAdjustment = (!isUndefined(props.task?.adjustment) && (props.task?.adjustment.measurement || props.task.adjustment.commentValue))
  const isCleaned = (!isUndefined(props.task?.cleaned) && props.task?.cleaned.rating)
  const isRepJust = isReplacement || isAdjustment || isCleaned
  if (isRepJust) {
    borderBottom = ''
  } else {
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
    if (props.task?.showParameter == "suspensionCylinder") {
      console.log("totalCol", totalCol);
    }
    if (totalCol == 12) {
      borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
    }
  }
  const borderLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.left != 'none' ? `border-left: ${itemRef.value.style.border.left}; ` : ""

  const borderRadiusTopRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topRight != 'none' ? `border-top-right-radius: ${itemRef.value.style.borderRadius.topRight}; ` : ""
  const borderRadiusBottomRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomRight != 'none' ? `border-bottom-right-radius: ${itemRef.value.style.borderRadius.bottomRight}; ` : ""
  const borderRadiusTopLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topLeft != 'none' ? `border-top-left-radius: ${itemRef.value.style.borderRadius.topLeft}; ` : ""
  const borderRadiusBottomLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomLeft != 'none' ? `border-bottom-left-radius: ${itemRef.value.style.borderRadius.bottomLeft}; ` : ""

  // kondisi kalau dia row terakhir table (border bottom at last index)
  let paddingBottom = ''
  if (borderBottom) {
    paddingBottom = 'padding-bottom: 25px; '
  }

  return `${paddingBottom}${backGroundColor}${fontColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
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
}
</style>
