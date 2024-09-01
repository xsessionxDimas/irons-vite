<template>
  <div :class="[widthStyle, textAlign, potraitWidthStyle]" class="px-2 pt-2 html-component-print" :style="(!isUndefined(props.task?.adjustment) && (props.task?.adjustment.measurement || props.task.adjustment.commentValue))? `${style}border-bottom:0px;margin-bottom:0px;` : style">
    <template v-if="!isUndefined(item.style) && item.style.visibility != 'hidden'">
      <span ref="html" v-html="content" :style="labelStyle"></span>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Item } from '@/core/types/entities/dma/e-form/Item';
import { Task } from '@/core/types/entities/dma/e-form/Task';
import { isUndefined, isEqual, last } from 'lodash';
import {
  defineProps,
  PropType,
  toRef,
  computed,
  ref
} from 'vue'
import {
  formatHtml
} from '@/core/helpers/manipulate-html-string';

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
const html = ref(null) as any

const widthStyle = computed(() => {
  if (props.generalStyle) {
    return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col";
  }
  return ''
})

const content = computed(() => {
  if (props.item.value) {
    let finalString = formatHtml(props.item.value as string).replaceAll('{BLOB_URL}', import.meta.env.VITE_APP_BASE_URL_VERSIONING_DIGITAL);
    return finalString
  }
  return ''
})

const textAlign = computed(() => {
  if (!isUndefined(itemRef.value.style)) {
    if (itemRef.value.style.textAlign == 'left') {
      return 'text-left';
    } else if (itemRef.value.style.textAlign == 'right') {
      return 'text-right'
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

const labelStyle = computed(() => {
  const fontWeight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.fontWeight) && itemRef.value.style.fontWeight != 'normal' ? `font-weight: ${itemRef.value.style.fontWeight}; ` : ""
  return `${fontWeight}`
})

const potraitWidthStyle = computed(() => {
  let customClass = ''
  if (props.generalStyle) {
    const hasStyle = !isUndefined(itemRef.value.style)
    if (hasStyle) {
      const hasPotraitBreakPoint = !isUndefined(itemRef.value.style.potraitBreakPoint)
      if (hasPotraitBreakPoint && itemRef.value.style.breakPoint != 'none') {
        customClass = `col-md-${itemRef.value.style.potraitBreakPoint}`

        customClass = `${customClass} col-lg-${itemRef.value.style.breakPoint}`
      }
    }
  }
  return customClass
})
</script>

<style lang="scss">
.html-component-print {
  #left-measurement-border {
    left: 12px !important;
  }
  #right-measurement-border {
    right: 12px !important;
  }
}
</style>
