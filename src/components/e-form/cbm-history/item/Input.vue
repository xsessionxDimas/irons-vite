<template>
  <div :class="[paddingBottomCondition]" class="px-2 pt-2 input-eform-status" :style="style">
    <el-input
      ref="cbmInput"
      :class="[dropDownColor, inputSuffix != '' ? 'service-sheet-input' : '']"
      v-model="showValLogic"
      size="small"
      :placeholder="placeholderLabel"
      :readonly="true">
    <template v-if="inputSuffix != ''" #append>{{ inputSuffix }}</template>
   </el-input>
  </div>
</template>

<script lang="ts" setup>
import {
  CategoryItemTypeEnum,
  Item
} from '@/core/types/entities/dma/e-form/Item';
import {
  computed,
  defineProps,
  PropType,
  toRef,
} from 'vue'
import {
  isUndefined,
  isEqual,
  last,
} from "lodash"
import { Audit } from '@/core/types/intervention/Audit';

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  },
  generalStyle: {
    type: Boolean,
    default: true
  },
});

const itemRef = toRef(props, 'item')

const showValLogic = computed(() => {
  if (itemRef.value.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_RATING && itemRef.value.value != "") {
    return `${(Number(itemRef.value.value as string) * 100)}%`
  }
  return itemRef.value.value
})

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

const dropDownColor = computed(() => {
  const val = itemRef.value.value.toString().replaceAll("'", '');
  let color: string | undefined
  if (itemRef.value.categoryItemType == "targetRating") {
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
  return `${backGroundColor} ${fontColor}`
})

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
