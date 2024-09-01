<template>
  <div :class="[paddingBottomCondition]" class="px-2 pt-2 dropdown-eform-status" :style="style">
    <div class="px-0 mx-0 d-flex">
      <el-select
        v-model="inputValue"
        :placeholder="placeholderLabel"
        size="small"
        class="w-100"
        :disabled="readOnly"
        :class="[dropDownColor, dropdownToolStyle]"
        >
        <el-option
          v-for="option in options"
          :key="option"
          :value="option.value"
        >
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
import { Item } from '@/core/types/entities/dma/e-form/Item';
import {
  computed,
  defineProps,
  PropType,
  toRef,
} from 'vue'
import { isUndefined } from 'lodash';
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
  generalStyle: {
    type: Boolean,
    default: true
  },
});

const itemRef = toRef(props, 'item')

const placeholderLabel = computed(() => {
  let placeholderLabel = 'Choose One'
  if (!isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.placeholder)) placeholderLabel = itemRef.value.style.placeholder
  return placeholderLabel
})

const dropdownToolStyle = computed(() => {
  let customClass = ''
  if (props.item.categoryItemType == "dropdownToolGroup") {
    customClass = 'dropdown-tool'
  }
  return customClass
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
  return options
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
  if (val == 'A') {
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
});

const style = computed(() => {
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; ` : ""
  const fontColor = !isUndefined(itemRef.value.style) && itemRef.value.style.fontColor != 'none' ? `color: ${itemRef.value.style.fontColor}; ` : ""
  return `${backGroundColor}${fontColor}`
});

const readOnly = computed(() => {
  return true
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
