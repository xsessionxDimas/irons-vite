<template>
  <div :class="[potraitWidthStyle, widthStyle, paddingBottomCondition]" class="pt-2 px-2 d-flex align-items-center d-flex justify-content-center" :style="style">
    <div class="p-2">
      <div class="form-check checkbox-success item-checkbox">
        <input class="form-check-input" type="checkbox" v-model="inputValue" :disabled="btnDisabledCondition" >
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Item } from '@/core/types/generate-service-sheet/Item';
import { Task } from '@/core/types/generate-service-sheet/Task';
import { isUndefined, isEqual, last } from 'lodash';
import {
  computed,
  defineProps,
  PropType,
  toRef,
  ref,
  onMounted
} from 'vue'

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  },
  task: {
    type: Object as PropType<Task>
  },
  generalStyle: {
    type: Boolean,
    default: true
  },
});

const itemRef = toRef(props, 'item')

const inputValue = computed({
  get: () => {
    return JSON.parse(props.item.value)
  },
  set: (val) => {
    itemRef.value.value = val
  },
})

const widthStyle = computed(() => {
  return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col"
});

const btnDisabledCondition = computed(() => {
  return props.item.value == "true"
})

const potraitWidthStyle = computed(() => {
  let customClass = ''
  if (props.generalStyle) {
    customClass = `col-md-${itemRef.value.style.potraitBreakPoint}`
    customClass = `${customClass} col-lg-${itemRef.value.style.breakPoint}`
  }
  return customClass
})

const style = computed(() => {
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; ` : ""
  const fontColor = !isUndefined(itemRef.value.style) && itemRef.value.style.fontColor != 'none' ? `color: ${itemRef.value.style.fontColor}; ` : ""
  const borderTop = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.top != 'none' ? `border-top: ${itemRef.value.style.border.top}; ` : ""
  const borderRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.right != 'none' ? `border-right: ${itemRef.value.style.border.right}; ` : ""
  let borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
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
    borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem; ` : ""
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

const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2"
  return paddingBottom
})

onMounted(() => {
  let value = false
  if (props.item.value == "true") value = true
})
</script>
<style lang="scss">
  .item-checkbox {
    .form-check-input:checked {
      background-color: #18AF4A;
      border-color: #18AF4A;
    }
  }
</style>
