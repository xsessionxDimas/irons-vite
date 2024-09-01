<template>
  <div :class="[widthStyle, textAlign, potraitWidthStyle, paddingBottomCondition]" class="px-2 pt-2" :style="style">
    <template v-if="!isUndefined(item.style) && item.style.visibility != 'hidden'">
      <label style="width: 100%" :style="[labelStyle, fontSize]" v-html="content"></label>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { addSpanOnHyphen } from '@/core/helpers/manipulate-html-string';
import {
  Item,
  CategoryItemTypeEnum
} from '@/core/types/entities/dma/e-form/Item';
import { Task } from '@/core/types/entities/dma/e-form/Task';
import { Audit } from '@/core/types/intervention/Audit';
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
  isShowAdjustment: {
    type: Boolean
  }
});
const itemRef = toRef(props, 'item')

const content = computed(() => {
  if (props.item.categoryItemType == "previousParamRating" && !props.item.value) {
    return "-"
  }
  let isPercentageWornPrevValItem = props.item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_PERCENTAGE;
  let isItemHasValue = props.item.value && props.item.value != "-"
  if (isPercentageWornPrevValItem && isItemHasValue) {
    return `${Number(props.item.value as string) * 100}%`
  }
  return addSpanOnHyphen(props.item.value)
})

const fontSize = computed(() => {
  if (!props.item.categoryItemType) return ""
  const isPrevPistonAItem = props.item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_A
  const isPrevPistonBItem = props.item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_B
  const isPrevPistonResultItem = props.item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RESULT
  const isPrevUomItem = props.item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_UOM
  const isPrevPistonPercentageItem = props.item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_PERCENTAGE
  const isPrevParamRating = props.item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_PARAM_RATING;

  const itemsCondition = isPrevPistonAItem || isPrevPistonBItem || isPrevPistonResultItem || isPrevUomItem || isPrevPistonPercentageItem || isPrevParamRating
  if (itemsCondition) {
    return "font-size: 10px;"
  } else {
    return ""
  }
})

const widthStyle = computed(() => {
  if (props.task?.taskType === "table" || props.task?.taskType === "collapsibleTable") return "col"
  if (props.generalStyle) {
    return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col";
  }
  return ''
})

const potraitWidthStyle = computed(() => {
  if (props.task?.taskType === "table" || props.task?.taskType === "collapsibleTable") return "col"
  let customClass = ''
  if (props.generalStyle) {
    const hasStyle = !isUndefined(itemRef.value.style)
    if (hasStyle) {
      const hasPotraitBreakPoint = !isUndefined(itemRef.value.style.potraitBreakPoint)
      if (hasPotraitBreakPoint && itemRef.value.style.breakPoint != 'none') {
        customClass = `col-md-${itemRef.value.style.potraitBreakPoint}`

        customClass = `${customClass} col-lg-${itemRef.value.style.breakPoint}`
      } else {
        customClass = `col-md-${itemRef.value.style.potraitBreakPoint}`

        customClass = `${customClass} col-lg-${itemRef.value.style.breakPoint}`
      }
    }
  }
  return customClass
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

const style = computed(() => {
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; ` : ""
  const fontColor = !isUndefined(itemRef.value.style) && itemRef.value.style.fontColor != 'none' ? `color: ${itemRef.value.style.fontColor}; ` : ""
  const borderTop = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.top != 'none' ? `border-top: ${itemRef.value.style.border.top}; ` : ""
  const borderRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.right != 'none' ? `border-right: ${itemRef.value.style.border.right}; ` : ""
  const paddingRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.padding) && itemRef.value.style.padding.right != 'none' ? `padding-right: ${itemRef.value.style.padding.right} !important; ` : ""
  let borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
  // check for condition CBM auto has additional row, jadi harus cek apakah menampilkan border dari item atau dari additional row
  const isReplacement = (!isUndefined(props.task?.isShowReplacementRow) && props.task?.isShowReplacementRow)
  const isAdjustment = (!isUndefined(props.task?.isShowAdjustmentRow) && props.task?.isShowAdjustmentRow)
  const isCleaned = (!isUndefined(props.task?.isShowCleanedRow) && props.task?.isShowCleanedRow)
  const isRepJust = isReplacement || isAdjustment || isCleaned || props.isShowAdjustment
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

  return `${paddingBottom}${backGroundColor}${fontColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}${paddingRight}`
})

const labelStyle = computed(() => {
  const fontWeight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.fontWeight) && itemRef.value.style.fontWeight != 'normal' ? `font-weight: ${itemRef.value.style.fontWeight}; ` : ""
  return `${fontWeight}`
})

const paddingBottomCondition = computed(() => {
  const audit: Audit | undefined | string = props.task?.updatedBy
  if (audit && (audit as Audit).name) {
    return ""
  }
  return "pb-2"
})
</script>

<style lang="scss">
.letter-space-hypen {
  letter-spacing: 1.5px;
}
</style>
