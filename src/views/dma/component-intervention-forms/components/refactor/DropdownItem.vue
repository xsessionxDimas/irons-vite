<template>
    <div :class="[potraitWidthStyle, widthStyle, paddingBottomCondition]" class="px-2 pt-2 dropdown-eform-status" :style="style">
      <div class="px-0 mx-0 d-flex">
        <el-select
          v-model="inputValue"
          :placeholder="placeholderLabel"
          size="small"
          class="w-100"
          :disabled="readOnly"
          :class="dropDownColor"
          :key="triggerRender">
          <el-option
            v-for="option in options"
            :key="option"
            :value="option.value">
          <span v-html="option && option.label ? content(option && option.label): ''"></span>
          </el-option>
          <!-- label if selected -->
          <template v-if="inputValue" #prefix>
            <span class="el-input__custom-option" v-html="selectedOption"></span>
          </template>
        </el-select>
        <!-- icon detail -->
        <template v-if='props.item.categoryItemType != "basic"'>
          <template v-if="props.item.valueItemType == 'condition'">
            <div v-if="props.item.value === '3'" class="ms-2">
              <NwImg src="/media/logos/bumaau/defect.png" alt="defect" class="d-icon" @click="onDefectView('defect')" />
            </div>
            <div v-if="props.item.value === '4'" class="ms-2">
              <NwImg src="/media/logos/bumaau/na.png" alt="na" class="d-icon" @click="onDefectView('na')" />
            </div>
            <div v-if="(props.item.value === '1' || props.item.value === '2') && props.task.reason && props.task.reason != ''" class="ms-2" @click="onNAReasonClick">
              <img src="/media/logos/bumaau/ok.png" alt="ok" class="d-icon" />
            </div>
          </template>
        </template>
      </div>
      <template v-if="loadingIndicator">
        <div class="ms-1 d-flex align-items-center">
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
  toRef
} from 'vue'
import { Border } from '@/core/types/intervention/Border'
import { BorderRadius } from '@/core/types/intervention/BorderRadius'
import { DetailTaskItem } from '@/core/types/intervention/DetailTaskItem'
import { IDetailTask } from '@/core/types/intervention/IDetailTask'
import { Style } from '@/core/types/intervention/Style'
import {
  isEqual,
  last,
  find,
  findIndex
} from 'lodash';
import { Audit } from '@/core/types/intervention/Audit'
import { addSpanOnHyphen } from '@/core/helpers/manipulate-html-string'
import { TaskUpdateObject } from '@/core/types/intervention/TaskUpdateObject'
import { AESTCurrentDateTime } from '@/core/helpers/date-format'
import { KeyValue } from '@/core/types/misc/KeyValue'
import {
  useNAReasonViewStore
} from "@/store/pinia/dma/e-form/na/useNAReasonViewStore";
import { checkTaskEditSameFitter } from '@/store/pinia/dma/e-form/helpers'

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
  itemTriggerDisabledValue: {
    required: true,
    type: Object
  },
  isReadOnly: {
    type: Boolean,
    default: false
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  },
})

/* emits */
const emits = defineEmits(['onTaskChanged', 'onDefectView'])

/* refs */
const reRenderTrigger = ref(false)
const selectedTask = toRef(props, 'task')

const naReasonView = useNAReasonViewStore();

/* getter setter */
const inputValue = computed({
  get: () => {
    return props.item.value.toString().replaceAll("'", '');
  },
  set: (value) => {
    const data = {} as TaskUpdateObject
    data.employee = props.currentFitter
    data.taskKey = props.task.key
    data.taskCategory = props.task.category
    data.itemKey = props.item.key
    data.type = props.item.valueItemType as string
    data.value = value
    data.timeStamp = AESTCurrentDateTime()
    data.task = selectedTask.value
    if (props.task.category == 'CBM-NORMAL') {
      const uomInput = find(props.task.items, { 'valueItemType': 'inputUom' })
      if (uomInput) {
        const uomInputIndex = findIndex(props.task.items, {
          'valueItemType': 'inputUom'
        })
        data.uomValue = props.task.items[(uomInputIndex + 1)].value
        data.cbmMeasurement = uomInput.value
      }
    }
    emits('onTaskChanged', data)
  }
})

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
  return props.task.updatedBy != ''
})
const widthStyle = computed(() => {
  return hasStyle.value && itemStyle.value.breakPoint != 'none' ? `col-${itemStyle.value.breakPoint}` : 'col'
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
  const backGroundColor = hasStyle.value && itemStyle.value.bgColor != 'none' ? `background-color: ${itemStyle.value.bgColor}; ` : ''
  const fontColor = hasStyle.value && itemStyle.value.fontColor != 'none' ? `color: ${itemStyle.value.fontColor}; ` : ''
  const borderTop = hasBorder.value && itemStyleBorder.value.top != 'none' ? `border-top: ${itemStyleBorder.value.top}; ` : ''
  const borderRight = hasBorder.value && itemStyleBorder.value.right != 'none' ? `border-right: ${itemStyleBorder.value.right}; ` : ''
  let borderBottom = hasBorder.value && itemStyleBorder.value.bottom != 'none' ? `border-bottom: ${itemStyleBorder.value.bottom}; margin-bottom: 4px;` : ''
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
    borderBottom = isTaskUpdated.value && hasStyle.value && !hasBorder.value && itemStyleBorder.value && itemStyleBorder.value.bottom != 'none' ? `border-bottom: ${itemStyleBorder.value.bottom}; margin-bottom: 4px; ` : ''
  }
  const borderLeft = hasBorder.value && itemStyleBorder.value.left != 'none' ? `border-left: ${itemStyleBorder.value.left}; ` : ''
  const borderRadiusTopRight = hasBorderRadius.value && itemStyleBorderRadius.value.topRight != 'none' ? `border-top-right-radius: ${itemStyleBorderRadius.value.topRight}; ` : ''
  const borderRadiusBottomRight = hasBorderRadius.value && itemStyleBorderRadius.value.bottomRight != 'none' ? `border-bottom-right-radius: ${itemStyleBorderRadius.value.bottomRight}; ` : ''
  const borderRadiusTopLeft = hasBorderRadius.value && itemStyleBorderRadius.value.topLeft != 'none' ? `border-top-left-radius: ${itemStyleBorderRadius.value.topLeft}; ` : ''
  const borderRadiusBottomLeft = hasBorderRadius.value && itemStyleBorderRadius.value.bottomLeft != 'none' ? `border-bottom-left-radius: ${itemStyleBorderRadius.value.bottomLeft}; ` : ''
  return `${backGroundColor}${fontColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
})
const placeholderLabel = computed(() => {
  let placeholderLabel = 'Choose One'
  if (hasStyle.value && itemStyle.value.placeholder != undefined) {
    placeholderLabel = itemStyle.value.placeholder
  }
  return placeholderLabel
})
const checkSameFitter = computed(() => {
  return checkTaskEditSameFitter(props.task.updatedBy || "", props.currentFitter as Audit)
})
const readOnly = computed(() => {
  if (props.isReadOnly) return true
  if (!props.generalSubmitted) return true
  let defect = false
  // if (props.item.categoryItemType != 'basic') {
  //   // 1&2 ok, 3 defect, 4 NA
  //   if (inputValue.value == '3') {
  //     defect = true
  //   }
  // }
  let sameFitter = true
  if (!checkSameFitter.value) {
    if (props.item.value == "3" && props.item.valueItemType == 'condition') {
      sameFitter = true
    } else {
      sameFitter = false
    }
  }

  const cbmCategory = props.item.valueItemType == 'rating'
  const normalCategory = (props.item.value == "1" || props.item.value == "4") && props.item.valueItemType == 'condition'

  if (normalCategory || cbmCategory) {
    sameFitter = true
  }

  let disabledByItemKey = false
  if (props.item.disabledByItemKey) {
    if (props.itemTriggerDisabledValue && props.itemTriggerDisabledValue[props.item.disabledByItemKey] == "4") {
      disabledByItemKey = true
    }
  }
  return defect || !sameFitter || disabledByItemKey
})
const triggerRender = computed(() => {
  return reRenderTrigger;
})
const dropDownColor = computed(() => {
  // 1&2 ok, 3 defect, 4 NA
  const val = props.item.value.toString().replaceAll("'", '');
  let color
  if (props.item.categoryItemType == "basic") {
    return 'basic'
  } else {
    if (val == '1' || val == '2') {
      color = 'green'
    } else if (val == '3') {
      color = 'red'
    } else if (val == '4') {
      color = 'yellow'
    } else if (val == 'A') {
      color = 'a'
    } else if (val == 'B') {
      color = 'b'
    } else if (val == 'C') {
      color = 'c'
    } else if (val == 'X') {
      color = 'x'
    }
    return color
  }
})
const options = computed(() => {
  if (props.item.caption && props.item.itemValue) {
    const itemValArr = props.item.caption.replace('[', '').replace(']', '').split('; ') as string[]
    const valArr = props.item.itemValue.replace('[', '').replace(']', '').split(', ') as string[]
    let options = (itemValArr as string[]).map((el, index) => {
      return {
        label: el.replaceAll("'", ''),
        value: valArr[index].replaceAll("'", '')
      }
    });
    if (!checkSameFitter.value) {
      if ((props.task?.category == 'NORMAL' || props.task?.category == 'CRACK') && (inputValue.value == "1")) {
        // remove NA
        options = options.filter((opt) => {
          return !opt.label.includes("Not Applicable")
        });
      } else if (props.item.value == "3" && props.item.valueItemType == 'condition') {
        // only show input n ok system
        options = options.filter((opt) => {
          return opt.value.includes("1") || opt.value == inputValue.value
        });
      }
    }
    return options
  }
  return []
})
const selectedOption = computed(() => {
  if (inputValue.value) {
    return options.value.find((val) => {
      return val.value == String(inputValue.value)
    })?.label
  }
  return inputValue.value
})
/* methods and handlers*/
const content = (str: string) => {
  return addSpanOnHyphen(str)
}
const onDefectView = (type: string) => {
  const param = {} as KeyValue
  param.key = type
  param.value = props.task.key
  const task = props.task
  emits('onDefectView', {
    param,
    task
  })
}
const onNAReasonClick = () => {
  naReasonView.setReason(props.task?.reason)
  naReasonView.setTitle(props.task?.description)
  naReasonView.setVisible(true)
};
</script>

<style scoped>
.d-icon {
    width: 24px;
    cursor: pointer;
}
</style>

