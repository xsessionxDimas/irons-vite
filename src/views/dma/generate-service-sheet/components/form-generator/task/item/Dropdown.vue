<template>
  <div :class="[potraitWidthStyle, widthStyle, paddingBottomCondition]" class="px-2 pt-2 dropdown-eform-status" :style="style">
    <div class="px-0 mx-0 d-flex">
      <el-select
        v-model="inputValue"
        :placeholder="placeholderLabel"
        size="small"
        class="w-100"
        :disabled="readOnly"
        :class="[dropDownColor, dropdownToolStyle]"
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Item } from '@/core/types/generate-service-sheet/Item';
import { Task } from '@/core/types/generate-service-sheet/Task';
import {
  computed,
  defineProps,
  PropType,
  toRef,
  ref,
  onMounted,
  defineEmits
} from 'vue'
import { isUndefined, isEqual, last } from 'lodash';
import { addSpanOnHyphen } from '@/core/helpers/manipulate-html-string';

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
  },
  taskGroupName: {
    type: String,
    required: false,
    default: ""
  }
});

const emits = defineEmits(["setLoading"])
const CBM = ["A", "B", "C", "X"]

const itemRef = toRef(props, 'item')
const taskPropsItem = toRef(props, 'task')
const reRenderTrigger = ref(false);
const oldValue = ref("");
const loadingIndicator = ref(false)
const multiDefectListView = ref(false)

const triggerRender = computed(() => {
  return reRenderTrigger;
})

const placeholderLabel = computed(() => {
  let placeholderLabel = 'Choose One'
  if (!isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.placeholder)) placeholderLabel = itemRef.value.style.placeholder
  return placeholderLabel
})

const widthStyle = computed(() => {
  if (props.generalStyle) {
    return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col"
  }
  return ''
});

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

const dropdownToolStyle = computed(() => {
  let customClass = ''
  if (props.item.categoryItemType == "dropdownToolGroup") {
    customClass = 'dropdown-tool'
  }
  return customClass
})

const selectedOption = computed(() => {
  if (inputValue.value) {
    return options.value.find((val) => {
      return val.value == String(inputValue.value)
    })?.label
  }
  return inputValue.value
})

const dropDownColor = computed(() => {
  const val = itemRef.value.value.toString().replaceAll("'", '');
  let color
  if (val == '1') {
    color = 'green'
  } else if ((val == '2' || (val == '3' && taskPropsItem.value?.category == 'CRACK'))) {
    color = 'red'
  } else if ((val == '3' && (taskPropsItem.value?.category == 'NORMAL' || itemRef.value.categoryItemType == 'resultStatus')) || val == '4') {
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
})


const inputValue = computed(() => {
  return props.item.value.toString().replaceAll("'", '');
})

onMounted(async () => {
  oldValue.value = itemRef.value.value as string
})


const options = computed(() => {
  const itemValArr = props.item.caption!.replace("[", "").replace("]", "").split("; ")
  const valArr = props.item.itemValue!.replace("[", "").replace("]", "").split(", ")
  let options = itemValArr.map((el, index) => {
    return {
      label: el.replaceAll("'", ''),
      value: valArr[index].replaceAll("'", '')
    }
  });

  if (inputValue.value != '' && !CBM.includes(inputValue.value)) {
    options.push({
      label: "Reset",
      value: "",
    });
  }
  return options
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

const onDefectClickDetail = () => {
  multiDefectListView.value = true
}

const readOnly = computed(() => {
  let sameFitter = true
  let defect = false
  let isSCAdjustmentYes = false
  return !sameFitter || defect || loadingIndicator.value || isSCAdjustmentYes
});


const content = ((string) => {
  return addSpanOnHyphen(string)
})

const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2"
  return paddingBottom
})

</script>

<style scoped>
  .d-icon {
    width: 24px;
    cursor: pointer;
  }

  .dropdown-tool {
    font-weight: 400;
    .el-input__custom-option {
      color: darkslategray;
    }
  }

  .multiple-defect-badge {
    display: flex;
    padding: 2px 6px;
    align-items: center;
    gap: 2px;
    border-radius: 6px;
    background: #FF4842;
    color: white;
    height: 32px;
  }
</style>
