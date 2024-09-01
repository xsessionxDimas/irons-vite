<template>
  <div :class="[widthStyle, textAlign, potraitWidthStyle]" class="px-2 py-2" :style="(!isUndefined(props.task?.adjustment) && (props.task?.adjustment.measurement || props.task.adjustment.commentValue))? `${style}border-bottom:0px;margin-bottom:0px;` : style">
    <template v-if="!isUndefined(item.style) && item.style.visibility != 'hidden'">
      <el-button :style="[fontColor, backGroundColor]" size="small" type="success" class="item-button w-100" :disabled="buttonDisabled" >{{ item.value }}</el-button>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Item } from '@/core/types/entities/dma/e-form/Item';
import { Task } from '@/core/types/entities/dma/e-form/Task';
import { useEFormStore } from '@/store/pinia/dma/e-form/useEFormStore';
import { isUndefined, isEqual, last } from 'lodash';
import {
  defineProps,
  PropType,
  toRef,
  computed,
  onMounted
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
const taskRef = toRef(props, 'task')

onMounted(() => {
  if (taskRef.value.adjustment) {
    taskRef.value!.isShowAdjustmentRow = true
  } else if (taskRef.value.replacement) {
    taskRef.value!.isShowReplacementRow = true
  }
})

const widthStyle = computed(() => {
  if (props.generalStyle) {
    return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col";
  }
  return ''
})

const fontColor = computed(() => {
  const fontColor = !isUndefined(itemRef.value.style) && itemRef.value.style.fontColor != 'none' ? `color: ${itemRef.value.style.fontColor}; ` : ""
  return fontColor
})

const backGroundColor = computed(() => {
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; border-color: ${itemRef.value.style.bgColor};` : ""
  return backGroundColor
})

const store = useEFormStore()

const buttonDisabled = computed(() => {
  // kalau nilainya kosong
  const istaskNotFilled = props.task!.taskValue == ''
  // kalau nilainya A/B
  const isTaskDefect = props.task!.taskValue == 'A' || props.task!.taskValue == 'B'
  // dan kalau row adjustment lagi muncul
  // dan kalau yg login bukan yang update defectnya
  let sameFitter = true
  if (!isUndefined(props.task!.updatedBy!) && !isUndefined(props.task!.updatedBy!.id)) {
    // console.log('store.employee.id', store.employee.id, 'props.task!.updatedBy!.id', props.task!.updatedBy!.id);
    if (store.employee.id == props.task!.updatedBy!.id) {
      sameFitter = true
    } else {
      sameFitter = false
    }
  }
  return istaskNotFilled || isTaskDefect || props.task!.isShowAdjustmentRow || props.task!.isShowReplacementRow || !sameFitter
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
  const borderTop = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.top != 'none' ? `border-top: ${itemRef.value.style.border.top}; ` : ""
  const borderRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.right != 'none' ? `border-right: ${itemRef.value.style.border.right}; ` : ""
  let borderBottom = ''
  if (props.task?.updatedBy?.id) {
    borderBottom = ""
  } else {
    borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
  }
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

  return `${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
})
</script>

<style lang="scss">
  .item-button {
    padding: 0;
    span {
      width: 100%;
      font-size: 10px;
    }
  }
</style>
