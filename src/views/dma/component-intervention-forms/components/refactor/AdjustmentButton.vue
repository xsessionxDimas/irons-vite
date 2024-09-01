<template>
  <div :class="[widthStyle, textAlign, potraitWidthStyle, paddingBottomCondition]" class="px-2 pt-2" :style="style">
    <template v-if="!isUndefined(item.style)">
      <el-button :style="[fontColor, backGroundColor, paleColor]" size="small" type="success" @click="handleClick" class="item-button w-100" :disabled="buttonDisabled" >{{ item.value }}</el-button>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Audit } from '@/core/types/intervention/Audit';
import { DetailTaskItem } from '@/core/types/intervention/DetailTaskItem';
import { IDetailTask } from '@/core/types/intervention/IDetailTask';
import { isUndefined, isEqual, last } from 'lodash';
import {
  defineProps,
  PropType,
  toRef,
  computed,
  defineEmits
} from 'vue'

const props = defineProps({
  item: {
    type: Object as PropType<DetailTaskItem>,
    required: true
  },
  task: {
    type: Object as PropType<IDetailTask>,
    required: true
  },
  isShowAdjustmentRow: {
    required: true,
    type: Boolean
  },
  currentFitter: {
    type: Object as PropType<Audit>,
    required: true
  },
  isReadOnly: {
    type: Boolean,
    default: false
  }
});
const itemRef = toRef(props, 'item')
const taskRef = toRef(props, 'task')

const emits = defineEmits(["onShowAdjustment"])

const widthStyle = computed(() => {
  return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col";
})

const fontColor = computed(() => {
  const fontColor = !isUndefined(itemRef.value.style) && itemRef.value.style.fontColor != 'none' ? `color: ${itemRef.value.style.fontColor}; ` : ""
  return fontColor
})

const backGroundColor = computed(() => {
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; border-color: ${itemRef.value.style.bgColor};` : ""
  return backGroundColor
})

const paleColor = computed(() => {
  let paleColor = ''
  if (props.isShowAdjustmentRow) paleColor = 'opacity: 50%;'
  if (buttonDisabled.value) paleColor = 'opacity: 50%;'
  return paleColor
})

const buttonDisabled = computed(() => {
  if (props.isReadOnly) return true
  // kalau nilainya kosong
  const istaskNotFilled = taskRef.value.taskValue == ''
  // kalau nilainya A/B
  const isTaskDefect = taskRef.value.taskValue == 'A' || taskRef.value.taskValue == 'B'
  // dan kalau row adjustment lagi muncul
  // dan kalau yg login bukan yang update defectnya
  let sameFitter = true
  const taskUpdateFitter = props.task.updatedBy as Audit || {}
  if (!isUndefined(taskUpdateFitter) && !isUndefined(taskUpdateFitter.id)) {
    if (props.currentFitter && props.currentFitter.id == taskUpdateFitter.id) {
      sameFitter = true
    } else {
      sameFitter = false
    }
  }
  return (istaskNotFilled || isTaskDefect || !sameFitter) || props.isShowAdjustmentRow
})

const potraitWidthStyle = computed(() => {
  let customClass = ''
  if (!isUndefined(itemRef.value.style)) {
    const hasPotraitBreakPoint = !isUndefined(itemRef.value.style.potraitBreakPoint)
    if (hasPotraitBreakPoint && itemRef.value.style.breakPoint != 'none') {
      customClass = `col-md-${itemRef.value.style.potraitBreakPoint}`

      customClass = `${customClass} col-lg-${itemRef.value.style.breakPoint}`
    } else {
      customClass = `col-md-${itemRef.value.style.potraitBreakPoint}`

      customClass = `${customClass} col-lg-${itemRef.value.style.breakPoint}`
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
  let borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
  // check for condition CBM auto has additional row, jadi harus cek apakah menampilkan border dari item atau dari additional row
  if (!isUndefined(props.isShowAdjustmentRow) && props.isShowAdjustmentRow) {
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
    if (totalCol == 12) {
      const taskUpdateFitter = props.task.updatedBy as Audit || {} as Audit
      borderBottom = !taskUpdateFitter.name && !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem; ` : ""
    }
  }
  const borderLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.left != 'none' ? `border-left: ${itemRef.value.style.border.left}; ` : ""

  const borderRadiusTopRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topRight != 'none' ? `border-top-right-radius: ${itemRef.value.style.borderRadius.topRight}; ` : ""
  const borderRadiusBottomRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomRight != 'none' ? `border-bottom-right-radius: ${itemRef.value.style.borderRadius.bottomRight}; ` : ""
  const borderRadiusTopLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topLeft != 'none' ? `border-top-left-radius: ${itemRef.value.style.borderRadius.topLeft}; ` : ""
  const borderRadiusBottomLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomLeft != 'none' ? `border-bottom-left-radius: ${itemRef.value.style.borderRadius.bottomLeft}; ` : ""

  return `${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
})

const handleClick = () => {
  if (itemRef.value.value == 'Adjustment') {
    emits("onShowAdjustment")
  }
}

const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2"
  const taskUpdateFitter = props.task.updatedBy as Audit || {}
  if (!isUndefined(taskUpdateFitter.name) && Boolean(taskUpdateFitter.name)) paddingBottom = ''
  return paddingBottom
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
