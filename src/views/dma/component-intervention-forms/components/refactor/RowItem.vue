<template>
  <div :class="itemAlignment(column)" class="eform-table-row col px-0" v-for="column in columns" :key="column.key">
    <Image v-if="column.itemType === 'image'" :item="column" :reference="reference" />
    <Label v-if="column.itemType === 'label'" :item="column" :reference="reference" />
    <Html v-if="column.itemType === 'html'" :item="column" :reference="reference" />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType } from 'vue'
import Label from './ReferenceLabel.vue'
import Image from './ReferenceImage.vue'
import Html from './ReferenceHTML.vue'
import { isUndefined } from 'lodash'
import { ReferenceItem } from '@/core/types/intervention/ReferenceItem'
import {
  ReferenceItemDetail
} from '@/core/types/intervention/ReferenceItemDetail'
import { Reference } from '@/core/types/intervention/Reference'

const props = defineProps({
  item: {
    type: Object as PropType<ReferenceItem>,
    required: true
  },
  reference: {
    type: Object as PropType<Reference>,
    required: true
  },
  itemLoading: {
    type: Boolean,
    default: false
  }
})

const columns = computed(() => {
  const columns: ReferenceItemDetail[] = []
  for (const property in props.item) {
    columns.push(props.item[property])
  }
  return columns
})

const itemAlignment = (column: ReferenceItemDetail) => {
  let alignment = ""
  if (!isUndefined(column.style) && !isUndefined(column.style.textvAlign)) {
    alignment = `align-self-${column.style.textvAlign}`
  }
  return alignment
}
</script>
