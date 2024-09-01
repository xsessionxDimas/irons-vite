<template>
  <div :class="[widthStyle, potraitWidthStyle, paddingBottomCondition]" class="px-2 pt-2 input-eform-status" :style="style">
    <el-input
      :class="[dropDownColor, inputSuffix != '' ? 'service-sheet-input' : '']"
      v-model="inputValue"
      size="small"
      :input-style="[fontSize]"
      :readonly="true"
      @keypress="onlyNumber"
      :placeholder="placeholderLabel"
      :disabled="disabledCondition"
   >
    <template v-if="inputSuffix != ''" #append>{{ inputSuffix }}</template>
    </el-input>
    <template v-if="validation != ''">
      <label class="text-danger ps-2 font-weight-bold">{{ validation }}</label>
    </template>
  </div>

  <OilNotInRange :show="showOilNotInRange" @close="closeOilNotInRangeModal"/>
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
  ref,
  toRef,
  watch,
  onMounted
} from 'vue'
import {
  isUndefined,
  isEqual,
  last,
  isArray
} from "lodash"
import { useEFormStore } from "@/store/pinia/dma/e-form/useEFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpdateParam
} from "@/core/types/entities/dma/e-form/update-data/updateParam";
import { Task } from '@/core/types/entities/dma/e-form/Task';
import OilNotInRange from './dialog/OilNotInRange.vue';
import {
  formatNumberWithComma
} from "@/core/helpers/number-format"
import {
  usePreviewFormStore
} from '@/store/pinia/dma/preview-form/usePreviewFormStore';

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
const store = useEFormStore();
const previewStore = usePreviewFormStore();
const authStore = useAuthenticationStore();
const showOilNotInRange = ref(false)
const validation = ref('')
let timer

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

const disabledByItemKey = computed(() => {
  let disabledByItemKey = false
  if (props.item.disabledByItemKey) {
    if (previewStore.itemTriggerDisabledValue && previewStore.itemTriggerDisabledValue[props.item.disabledByItemKey] == "3") {
      disabledByItemKey = true
    }
  }
  return disabledByItemKey
})

const disabledCondition = computed(() => {
  return disabledByItemKey.value
})

const inputSuffix = computed(() => {
  let suffix = ''
  if (!isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.suffix)) {
    suffix = itemRef.value.style.suffix
  }
  return suffix
})

const fontSize = computed(() => {
  if (!props.item.categoryItemType) return ""
  const itemsCondition = itemRef.value.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING || itemRef.value.categoryItemType == CategoryItemTypeEnum.PREVIOUS_TARGET_RATING;
  if (itemsCondition) {
    return "font-size: 10px !important;"
  } else {
    return ""
  }
})

// --------------------- item client validation -----------------------------
const integerItemValueType = itemRef.value.valueType == 'int'
const percentageValidation = itemRef.value.customValidation?.toLowerCase().includes('percentage')
const cbmAuto = itemRef.value.categoryItemType == 'paramRating'
const checkOilItemValidation = !isUndefined(itemRef.value.mappingKeyId) && !isArray(itemRef.value.mappingKeyId)
// --------------------- item client validation -----------------------------

const inputValue = computed({
  get: () => {
    if (itemRef.value.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_RATING && itemRef.value.value != "") {
      return `${(Number(itemRef.value.value as string) * 100)}%`
    }
    return itemRef.value.value
  },
  set: (value) => {
    const val = value as string
    if (integerItemValueType || cbmAuto || checkOilItemValidation) {
      if (isNaN(Number(val))) {
        return
      } else {
        if (val.length > 8) {
          return
        } else {
          if ((`${val}`.split(".") || []).length - 1 > 1) {
            return
          } else {
            if (val.includes(".")) {
              const afterComma = `${val}`.split(".")[1]
              if (afterComma.length > 2) {
                return
              } else {
                itemRef.value.value = val
              }
            }
            if (val.length > 5) {
              if (val.length >= 6 && val.length <= 6) {
                if (val[5] != ".") {
                  return
                } else {
                  itemRef.value.value = val
                }
              }
            } else {
              itemRef.value.value
            }
          }
        }
      }
    }
    itemRef.value.value = val
  },
});

onMounted(() => {
  inputValue.value = itemRef.value.value as string
})

const handlePostAnswer = (taskValue, val) => {
  const payload: UpdateParam[] = [
    {
      keyValue: itemRef.value.key,
      propertyParams: [
        {
          propertyName: 'value',
          propertyValue: val
        },
        {
          propertyName: 'updatedBy',
          propertyValue: JSON.stringify(store.employee)
        },
        {
          propertyName: 'updatedDate',
          propertyValue: '<<ServerDateTime>>'
        },
      ]
    },
  ]
  if (!isUndefined(itemRef.value.isTaskValue) && itemRef.value.isTaskValue) {
    payload.push(taskValue)
  }
  store.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name);
}
const handleCBM = async (taskValue, val) => {
  let nextPost = true
  const rating = props.task!.rating

  await store.getCBMResult(props.task!, itemRef.value, taskValue).then((isSuccess) => {
    nextPost = isSuccess
  })

  return nextPost
}

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
  const isReplacement = (!isUndefined(props.task?.isShowReplacementRow) && props.task?.isShowReplacementRow)
  const isAdjustment = (!isUndefined(props.task?.isShowAdjustmentRow) && props.task?.isShowAdjustmentRow)
  const isCleaned = (!isUndefined(props.task?.isShowCleanedRow) && props.task?.isShowCleanedRow)
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
    if (totalCol == 12) {
      borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem; ` : ""
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

const closeOilNotInRangeModal = () => {
  showOilNotInRange.value = false
}

const handleCheckOil = async (val) => {
  if (!itemRef.value?.mappingKeyId) return;
  await store.getValueFromItemKey(itemRef.value.mappingKeyId as string).then((validationVal) => {
    if (validationVal != '') {
      const minVal = Number(validationVal) - (Number(validationVal) * (5 / 100))
      const maxVal = Number(validationVal) + (Number(validationVal) * (5 / 100))
      const checkMin = val >= minVal
      const checkMax = val <= maxVal
      if (checkMin && checkMax) {
        const taskValue = {
          keyValue: taskPropsItem.value!.key,
          propertyParams: [
            {
              propertyName: 'taskValue',
              propertyValue: val
            },
            {
              propertyName: 'updatedBy',
              propertyValue: JSON.stringify(store.employee)
            },
            {
              propertyName: 'updatedDate',
              propertyValue: '<<ServerDateTime>>'
            },
          ]
        }
        handlePostAnswer(taskValue, val)
      } else {
        showOilNotInRange.value = true
      }
    }
  })
}

const onlyNumber = ($event) => {
  if (itemRef.value.valueType == 'int') {
    let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
    if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
      $event.preventDefault();
    }
  }
}

const handleInputValidation = (val) => {
  if (itemRef.value.valueType == 'int') {
    const check = val.split('.')
    let isComa = false
    let isFiveMoreDigit = check[0].length > 5
    if (check[1]) {
      isComa = check[1].length > 2
    }
    const lengthCheck = isFiveMoreDigit || isComa
    if (lengthCheck) {
      validation.value = 'max input length is 5 digits and 2 number after .'
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}

watch(inputValue, () => {
  validation.value = ''
}, { deep: true })

const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2"
  if (!isUndefined(props.task!.updatedBy!.name) && props.task!.updatedBy!.name) paddingBottom = ''
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
</style>
