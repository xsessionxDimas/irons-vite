<template>
  <div :class="[paddingBottomCondition]" class="px-2 pt-2" :style="style">
    <template v-if="!isUndefined(item.style) && item.style.visibility != 'hidden'">
      <label :style="labelStyle" v-html="content"></label>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { addSpanOnHyphen } from '@/core/helpers/manipulate-html-string';
import { Item } from '@/core/types/entities/dma/e-form/Item';
import { isUndefined } from 'lodash';
import {
  defineProps,
  PropType,
  toRef,
  computed
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
});
const itemRef = toRef(props, 'item')

const content = computed(() => {
  return addSpanOnHyphen(props.item.value)
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
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; ` : ""
  const fontColor = !isUndefined(itemRef.value.style) && itemRef.value.style.fontColor != 'none' ? `color: ${itemRef.value.style.fontColor}; ` : ""
  return `${backGroundColor} ${fontColor}`
})

const labelStyle = computed(() => {
  const fontWeight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.fontWeight) && itemRef.value.style.fontWeight != 'normal' ? `font-weight: ${itemRef.value.style.fontWeight}; ` : ""
  return `${fontWeight}`
})

const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2"
  return paddingBottom
})
</script>

<style lang="scss">
.letter-space-hypen {
  letter-spacing: 1.5px;
}
</style>
