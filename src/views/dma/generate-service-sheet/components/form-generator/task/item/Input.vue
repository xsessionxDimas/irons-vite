<template>
  <div :class="[widthStyle, potraitWidthStyle, paddingBottomCondition]" class="px-2 pt-2 input-eform-status" :style="style">
    <el-input
      ref="cbmInput"
      :class="[dropDownColor, inputSuffix != '' ? 'service-sheet-input' : '']"
      v-model="inputValue"
      size="small"
      :placeholder="placeholderLabel"
      :readonly="readOnly"
      @keypress="onlyNumber"
      @change="onlyNumber"
      :inputmode="inputMode"
      :disabled="disabledCondition">
    <template v-if="inputSuffix != ''" #append>{{ inputSuffix }}</template>
   </el-input>
  </div>
</template>

<script lang="ts" setup>
import {
  Item,
  CategoryItemTypeEnum
} from '@/core/types/generate-service-sheet/Item';
import { Task } from '@/core/types/generate-service-sheet/Task';
import {
  computed,
  defineProps,
  onUnmounted,
  PropType,
  ref,
  toRef,
  watch
} from 'vue'
import {
  isUndefined,
  isEqual,
  last
} from "lodash"

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
  },
  itemLoading: {
    type: Boolean,
    default: false
  }
});

const itemRef = toRef(props, 'item')
const taskPropsItem = toRef(props, 'task')
const isDisabledByKeyDropdownToolGroup = ref(false)

const inputSuffix = computed(() => {
  let suffix = ''
  if (!isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.suffix)) {
    suffix = itemRef.value.style.suffix
  }
  return suffix
})

const placeholderLabel = computed(() => {
  let placeholderLabel = 'Please Input'
  if (itemRef.value.categoryItemType == 'targetRating') {
    placeholderLabel = ''
  } else if (itemRef.value.categoryItemType == 'resultParamRating') {
    placeholderLabel = ''
  }
  if (!isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.placeholder)) placeholderLabel = itemRef.value.style.placeholder
  return placeholderLabel
})

const widthStyle = computed(() => {
  if (props.generalStyle) {
    return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col"
  }
  return ''
})

const potraitWidthStyle = computed(() => {
  let customClass = ''
  if (props.generalStyle) {
    const hasStyle = !isUndefined(itemRef.value.style)
    if (hasStyle) {
      customClass = `col-md-${itemRef.value.style.potraitBreakPoint}`
      customClass = `${customClass} col-lg-${itemRef.value.style.breakPoint}`
    }
  }
  return customClass
})

const disabledCondition = computed(() => {
  let cond = false
  const categoryItemType = itemRef.value.categoryItemType
  if (categoryItemType == 'targetRating' || categoryItemType == 'resultParamRating') cond = true

  // dynamic param rating
  let dynamicParamRatingUomNotSelected = false
  if (itemRef.value.categoryItemType == "paramRatingDynamic") {
    taskPropsItem.value!.items.forEach((item) => {
      if (item.itemType == "dropDown" && (item.categoryItemType == "dropdownTool" || item.categoryItemType == "dropdownToolDisc")) {
        if (item.value == "") {
          dynamicParamRatingUomNotSelected = true
        }
      }
    })
  }
  let scHeightInputNDropdownYes = false
  return cond || dynamicParamRatingUomNotSelected || disabledByOtherItem.value || scHeightInputNDropdownYes || isDisabledByKeyDropdownToolGroup.value
})

const disabledByOtherItem = ref(false)

const inputMode = computed(() => {
  let value = 'text'
  if (integerItemValueType.value || percentageValidation.value || cbmAuto.value) {
    value = "numeric"
  }
  return value
})

// --------------------- item client validation -----------------------------
const integerItemValueType = computed(() => {
  return itemRef.value.valueType == 'int'
})
const percentageValidation = computed(() => {
  return itemRef.value.customValidation?.toLowerCase().includes('percentage')
})
const cbmAuto = computed(() => {
  return itemRef.value.categoryItemType == 'paramRating' || itemRef.value.categoryItemType == 'paramRatingDynamic'
})

const inputValue = computed({
  get: () => {
    return itemRef.value.value
  },
  set: (value) => {
    itemRef.value.value = value
  }
})

const dropDownColor = computed(() => {
  const val = itemRef.value.value.toString().replaceAll("'", '');
  let color: string | undefined
  const isPrevTargetRating = itemRef.value.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING;
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
    borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
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

const readOnly = computed(() => {
  return false
})

const cbmInput = ref<HTMLInputElement>()
const onlyNumber = ($event) => {
  if (integerItemValueType.value || percentageValidation.value || cbmAuto.value) {
    let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
    if (percentageValidation.value) {
      if ($event.target.value > 100) {
        $event.preventDefault()
      }
      // cek if input has .
      if ($event.target.value.includes(".")) {
        if ($event.target.value.split(".")[1].length >= 2) {
          $event.preventDefault()
        }
      } else {
        if ($event.target.value.length >= 3) {
          $event.preventDefault()
        }
      }
    }
    if (keyCode == 13) { // Allow 13 (Enter) to calculate
      cbmInput.value!.blur()
      return
    }
    if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
      $event.preventDefault();
    }
  }
}

onUnmounted(() => {
  itemRef.value = {} as Item
})

watch(props.item, (newVal) => {
  itemRef.value = newVal
}, { deep: true })

const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2"
  return paddingBottom
})
</script>

<style lang="scss">
.service-sheet-input {
  .el-input__inner {
    border-right: 0px;
  }
  .el-input-group__append {
    background-color: transparent;
    border-left: 0px;
  }
}

.e-form-container {
  .el-input {
    .el-input__inner::placeholder {
      font-size: 0.69rem;
    }
  }
  @media (max-width:900px) {
    .eform-table-row {
      .el-input {
        .el-input__inner::placeholder{
          font-size: 0.72rem;
        }
      }
    }
  }
}
</style>
