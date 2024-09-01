<template>
  <div>
    <div class="row w-100 m-0">
      <template v-for="item in items" :key="item.key">
        <Image v-if="item.itemType === 'image'" :item="item" :reference="reference" />
        <Label v-if="item.itemType === 'label'" :item="item" :reference="reference" />
        <Html v-if="item.itemType === 'html'" :item="item" :reference="reference" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  PropType
} from 'vue'
import Label from './ReferenceLabel.vue'
import Image from './ReferenceImage.vue'
import Html from './ReferenceHTML.vue'
import { Reference } from '@/core/types/intervention/Reference'
import { last } from 'lodash'
import {
  ReferenceItemDetail
} from '@/core/types/intervention/ReferenceItemDetail'

const props = defineProps({
  items: {
    required: true,
    type: Object as PropType<ReferenceItemDetail[]>,
  },
  reference: {
    required: true,
    type: Object as PropType<Reference>
  }
})

const style = computed(() => {
  // get first item
  const firstItem = props.reference.items[0] as any
  // get last item
  const lastItem = last(props.items) as any
  const isUpdated = props.reference.updatedBy != ''
  const borderRight = lastItem.style && lastItem.style.border && lastItem.style.border.right != 'none' ? `border-right: ${lastItem.style.border.right}; ` : ""
  const borderBottom = isUpdated && (lastItem.style && lastItem.style.border && lastItem.style.border.bottom != 'none') ? `border-bottom: ${lastItem.style.border.bottom}; ` : ""
  const borderLeft = firstItem.style && firstItem.style.border && firstItem.style.border.left != 'none' ? `border-left: ${firstItem.style.border.left}; ` : ""
  const marginBottomTable = isUpdated && lastItem.style && lastItem.style.border && lastItem.style.border.bottom != 'none' ? `margin-bottom: 4px ` : ""
  return `${borderRight}${borderLeft}${borderBottom}${marginBottomTable}`
})
</script>
