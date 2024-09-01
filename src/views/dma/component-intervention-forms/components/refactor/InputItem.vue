<template>
  <div :class="[potraitWidthStyle, widthStyle, paddingBottomCondition]" class="px-2 pt-2 input-eform-status"
    :style="style">
    <el-input ref="cbmInput" :class="[inputColor]" v-model="clone.value" size="small" :placeholder="placeholderLabel"
      :readonly="readOnly" @keypress="onlyNumber" @focusout="onInputChanged" @focusin="onInputSelect" :inputmode="inputMode"
      :disabled="disabledCondition">
    </el-input>
    <template v-if="isValidationShow">
      <label class="text-danger ps-2 font-weight-bold">{{ validationMsg }}</label>
    </template>
    <template v-if="loadingIndicator">
      <div class="d-flex align-items-center">
        <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        <span>{{ loadingCaption }}</span>
      </div>
    </template>
    <template v-if="loadingCommentIndicator">
      <div class="d-flex align-items-center">
        <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        <span>Loading...</span>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  PropType,
  computed,
  ref,
  watch,
  toRef,
  onMounted
} from 'vue'
import { Border } from '@/core/types/intervention/Border'
import { BorderRadius } from '@/core/types/intervention/BorderRadius'
import { DetailTaskItem } from '@/core/types/intervention/DetailTaskItem'
import { IDetailTask } from '@/core/types/intervention/IDetailTask'
import { Style } from '@/core/types/intervention/Style'
import { debounce, isEqual, last } from 'lodash';
import { Audit } from '@/core/types/intervention/Audit'
import { TaskUpdateObject } from '@/core/types/intervention/TaskUpdateObject'
import { AESTCurrentDateTime } from '@/core/helpers/date-format'

/* props */
const props = defineProps({
  item: {
    type: Object as PropType<DetailTaskItem>,
    required: true
  },
  task: {
    type: Object as PropType<IDetailTask>,
    required: true
  },
  currentFitter: {
    type: Object as PropType<Audit>,
    required: true
  },
  validation: {
    type: String,
    required: true
  },
  loadingIndicator: {
    type: Boolean,
    required: true
  },
  loadingCommentIndicator: {
    type: Boolean,
    required: true
  },
  itemTriggerDisabledValue: {
    required: true,
    type: Object
  },
  isDisabled: {
    required: true,
    type: Boolean
  },
  isReadOnly: {
    type: Boolean,
    default: false
  },
  currInputTyped: {
    type: String,
    default: ""
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  },
})

/* emits */
const emits = defineEmits(['onInputChanged'])

/* refs */
const clone = toRef(props, 'item')
const oldValue = ref("")
const loadingCaption = ref(props.task.category == "CBM-NORMAL" ? 'Updating...' : 'Calculating...')
let isInputSelected = false

/* constant */
const integerItemValueType = props.item.valueType == 'int'
const percentageValidation = props.item.customValidation?.toLowerCase().includes('percentage')
const cbmAuto = props.item.categoryItemType == 'paramRating' || props.item.categoryItemType == 'paramRatingDynamic'

/* computeds */
const hasStyle = computed(() => {
  return props.item.style != undefined
})
const itemStyle = computed(() => {
  return props.item.style as Style
})
const hasBorder = computed(() => {
  return hasStyle.value && itemStyle.value.border != undefined
})
const itemStyleBorder = computed(() => {
  return itemStyle.value.border as Border
})
const hasBorderRadius = computed(() => {
  return hasStyle.value && itemStyle.value.borderRadius != undefined
})
const itemStyleBorderRadius = computed(() => {
  return itemStyle.value.borderRadius as BorderRadius
})
const isTaskUpdated = computed(() => {
  return props.task.updatedBy != ""
})
const widthStyle = computed(() => {
  return hasStyle.value && itemStyle.value.breakPoint != 'none' ? `col-${itemStyle.value.breakPoint}` : "col"
})
const potraitWidthStyle = computed(() => {
  let customClass = ''
  if (hasStyle.value) {
    const hasPotraitBreakPoint = itemStyle.value.potraitBreakPoint
    if (hasPotraitBreakPoint && itemStyle.value.breakPoint != 'none') {
      customClass = `col-md-${itemStyle.value.potraitBreakPoint}`
    }
    customClass = `${customClass} col-lg-${itemStyle.value.breakPoint}`
  }
  return customClass
})
const paddingBottomCondition = computed(() => {
  return isTaskUpdated.value ? '' : 'pb-2'
})
const style = computed(() => {
  const backGroundColor = hasStyle.value && itemStyle.value.bgColor != 'none' ? `background-color: ${itemStyle.value.bgColor}; ` : ""
  const fontColor = hasStyle.value && itemStyle.value.fontColor != 'none' ? `color: ${itemStyle.value.fontColor}; ` : ""
  const borderTop = hasBorder.value && itemStyleBorder.value.top != 'none' ? `border-top: ${itemStyleBorder.value.top}; ` : ""
  const borderRight = hasBorder.value && itemStyleBorder.value.right != 'none' ? `border-right: ${itemStyleBorder.value.right}; ` : ""
  let borderBottom = hasBorder.value && itemStyleBorder.value?.bottom != 'none' ? `border-bottom: ${itemStyleBorder.value?.bottom}; margin-bottom: 4px;` : ""
  let totalCol = 0
  props.task.items.forEach((item) => {
    if (hasBorder.value) {
      if ((itemStyleBorder.value.right == 'none') || (isEqual(item, last(props.task.items)))) {
        totalCol = totalCol + Number(itemStyle.value.breakPoint)
      }
    } else {
      totalCol = totalCol + Number(itemStyle.value.breakPoint)
    }
  })
  if (totalCol == 12) {
    borderBottom = isTaskUpdated.value && hasStyle.value && !hasBorder.value && itemStyleBorder.value?.bottom != 'none' ? `border-bottom: ${itemStyleBorder.value?.bottom}; margin-bottom: 4px; ` : ""
  }
  const borderLeft = hasBorder.value && itemStyleBorder.value.left != 'none' ? `border-left: ${itemStyleBorder.value.left}; ` : ""
  const borderRadiusTopRight = hasBorderRadius.value && itemStyleBorderRadius.value.topRight != 'none' ? `border-top-right-radius: ${itemStyleBorderRadius.value.topRight}; ` : ""
  const borderRadiusBottomRight = hasBorderRadius.value && itemStyleBorderRadius.value.bottomRight != 'none' ? `border-bottom-right-radius: ${itemStyleBorderRadius.value.bottomRight}; ` : ""
  const borderRadiusTopLeft = hasBorderRadius.value && itemStyleBorderRadius.value.topLeft != 'none' ? `border-top-left-radius: ${itemStyleBorderRadius.value.topLeft}; ` : ""
  const borderRadiusBottomLeft = hasBorderRadius.value && itemStyleBorderRadius.value.bottomLeft != 'none' ? `border-bottom-left-radius: ${itemStyleBorderRadius.value.bottomLeft}; ` : ""
  return `${backGroundColor}${fontColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
})
const placeholderLabel = computed(() => {
  let placeholderLabel = 'Please Input Value'
  if (hasStyle.value && itemStyle.value.placeholder != undefined) {
    placeholderLabel = itemStyle.value.placeholder
  }
  return placeholderLabel
})
const readOnly = computed(() => {
  if (props.isReadOnly) return true
  if (!props.generalSubmitted) return true
  const targetRating = props.item.categoryItemType == 'targetRating'
  let sameFitter = true
  if (props.currentFitter) {
    if (props.task.taskValue != '' && (props.task.updatedBy as Audit).id != props.currentFitter.id) {
      sameFitter = false
    }

    if (props.item.categoryItemType == "paramRating") {
      sameFitter = true
    }
  }
  return targetRating || !sameFitter
})

const isValidationShow = ref(false)
const validationMsg = ref("")

const validationComp = computed(() => {
  return props.validation
})

watch(validationComp, (val) => {
  if (validationMsg.value) {
    return
  }
  const sameInput = clone.value.key == props.currInputTyped as string
  if (val && sameInput) {
    validationMsg.value = val
    isValidationShow.value = true
  }
})

const disabledCondition = computed(() => {
  if (props.isReadOnly) return true
  if (!props.generalSubmitted) return true
  let cond = false
  const categoryItemType = props.item.categoryItemType
  if (categoryItemType == 'targetRating' || categoryItemType == 'resultParamRating') cond = true
  let dynamicParamRatingUomNotSelected = false
  if (categoryItemType == "paramRatingDynamic") {
    props.task.items.forEach((item) => {
      if (item.itemType == "dropDown" && item.categoryItemType == "dropdownTool") {
        if (item.value == "") {
          dynamicParamRatingUomNotSelected = true
        }
      }
    })
  }
  let disabledByItemKey = false
  if (props.item.disabledByItemKey) {
    if (props.itemTriggerDisabledValue && props.itemTriggerDisabledValue[props.item.disabledByItemKey] == "4") {
      disabledByItemKey = true
    }
  }
  // --------- case task replacement ----------
  let replacementMeasurementDisabled = false
  const isTaskReplacement = props.task.rating == "AUTOMATIC_REPLACEMENT" || props.task.rating == "AUTOMATIC_REPLACEMENT_GAP"
  const isTaskNormValueComplete = props.task.taskNormalValue == "1" || props.task.taskNormalValue == "2"
  const isInputMeasurement = props.item.categoryItemType == "paramRating"
  // jika taskNormalValue kosong maka disable (taskNormalValue nyimpen value 1/NA)
  if (isTaskReplacement && !isTaskNormValueComplete && isInputMeasurement) {
    replacementMeasurementDisabled = true
  }
  // --------- case task replacement ----------
  return cond || dynamicParamRatingUomNotSelected || disabledByItemKey || props.isDisabled || replacementMeasurementDisabled
})
const inputColor = computed(() => {
  if (props.task.category == 'NORMAL' && props.task.rating == 'NO') {
    return ''
  }
  const val = props.item.value.replaceAll("'", '')
  let color: string | undefined
  if (val == 'A' || val == 'In spec') {
    color = 'a'
  } else if (val == 'B') {
    color = 'b'
  } else if (val == 'C') {
    color = 'c'
  } else if (val == 'X' || val == 'Out of spec') {
    color = 'x'
  }
  return color
})
const inputMode = computed(() => {
  let value = 'text'
  if (integerItemValueType || percentageValidation) {
    value = 'numeric'
  }
  return value
})
/* methods and handlers*/
const cbmInput = ref<HTMLInputElement>()
const onlyNumber = ($event) => {
  if (integerItemValueType || percentageValidation || cbmAuto) {
    const keyCode = $event.which ? $event.which : $event.keyCode;

    // only allow number and one dot
    if (
      (keyCode < 48 || keyCode > 57)
      && (keyCode !== 46 || $event.target.value.indexOf('.') !== -1)
    ) {
      // 46 is dot
      $event.preventDefault();
    }

    if ($event.target.value.includes(".")) {
      if ($event.target.value.split(".")[0].length >= 5 && $event.target.value.split(".")[1].length >= 2) {
        $event.preventDefault();
      }
    } else {
      if ($event.target.value.length >= 5) { // restrict after 5 digit must be dot
        if (keyCode !== 46) { // 46 is dot
          $event.preventDefault();
        }
      }
    }
    if (keyCode == 13) { // Allow 13 (Enter) to calculate
      cbmInput.value!.blur()
      return
    }
  }
}
const onInputChanged = (event) => {
  if (!event.target.value) {
    if (oldValue.value == event.target.value) {
      return
    }
  }
  if (isInputSelected) {
    validationMsg.value = ""
    isValidationShow.value = false
  }
  isInputSelected = false
  if (readOnly.value) return
  const value = typeof event == 'string' ? event : event.target.value
  let validValue = value.indexOf('.') >= 0 ? value.substr(0, value.indexOf('.')) + value.substr(value.indexOf('.'), 3) : value;
  if (value) {
    const data = {} as TaskUpdateObject
    data.employee = props.currentFitter
    data.taskKey = props.task.key
    data.taskCategory = props.task.category
    data.itemKey = props.item.key
    data.type = props.item.valueItemType as string
    if (integerItemValueType || percentageValidation || cbmAuto) {
      data.value = String(parseFloat(validValue))
    } else {
      data.value = validValue
    }
    data.timeStamp = AESTCurrentDateTime()
    data.task = props.task
    emits('onInputChanged', data, () => {
      oldValue.value = data.value
    }, () => {
      clone.value.value = oldValue.value
    })
  } else {
    clone.value.value = oldValue.value
  }
}

const onInputSelect = () => {
  isInputSelected = true
}

onMounted(() => {
  oldValue.value = clone.value.value
})
watch(clone, debounce((val) => {
  const isReplacementTask = props.task.rating == "AUTOMATIC_REPLACEMENT" || props.task.rating == "AUTOMATIC_REPLACEMENT_GAP"
  const isMeasurementInput = props.item.categoryItemType == "paramRating"
  const isOldValDiffWitCurrVal = oldValue.value != val.value
  if (clone.value.key != localStorage.getItem('itemKey') as string) {
    let returnVal = true
    // diperlukan ketika update default value replacement
    // ngebaca perubahan value dari watch
    if (isReplacementTask && isMeasurementInput && isOldValDiffWitCurrVal && !isInputSelected) {
      returnVal = false
    }
    if (returnVal) {
      return
    }
  }
  const data = {} as TaskUpdateObject
  data.employee = props.currentFitter
  data.taskKey = props.task.key
  data.taskCategory = props.task.category
  data.itemKey = props.item.key
  data.type = props.item.valueItemType as string
  data.value = val.value
  data.timeStamp = AESTCurrentDateTime()
  data.task = props.task
  const cbmMeasurementItem = props.task.items.find((item) => {
    return item.valueItemType == 'inputUom'
  })
  if (cbmMeasurementItem) {
    data.cbmMeasurement = cbmMeasurementItem.value
  } else {
    // Use a safer approach for accessing the third item
    const thirdItem = props.task.items[2];
    data.cbmMeasurement = thirdItem ? thirdItem.value : ''; // Handle the case where props.task.items[2] might be undefined
  }
  if (isReplacementTask && isMeasurementInput && isOldValDiffWitCurrVal) {
    emits('onInputChanged', data, () => {
      oldValue.value = val.value
    }, () => {
      clone.value.value = oldValue.value
    })
  } else {
    emits('onInputChanged', data)
  }
  localStorage.removeItem('itemKey')
}, 500), { deep: true })
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
        .el-input__inner::placeholder {
          font-size: 0.72rem;
        }
      }
    }
  }
}
</style>
