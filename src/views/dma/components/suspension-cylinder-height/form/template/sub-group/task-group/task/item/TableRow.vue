<template>
<div :class="itemAlignment(column)" class="eform-table-row col px-0" v-for="column in columns" :key="column.key">
  <Image v-if="column.itemType === 'image'" :item="column" :task="task"/>
  <Label v-if="column.itemType === 'label'" :item="column" :task="task"/>
  <Input v-if="column.itemType === 'input'" :item="column" :task="task" :item-loading="itemLoading"/>
  <Dropdown v-if="column.itemType === 'dropDown'" :item="column" :task="task" :item-loading="itemLoading"/>
  <SmallCamera v-if="column.itemType === 'smallCamera'" :item="item" :task="task"/>
  <CheckBox v-if="item.itemType === 'checkbox'" :item="item" :task="task"/>
  <Html v-if="column.itemType === 'html'" :item="column" :task="task"/>
  <InteractiveButton v-if="item.itemType === 'button'" :item="item" :task="task"/>
  <StatusInfo v-if="item.itemType === 'statusInfo'" :item="item" :task="task" />
</div>
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType } from 'vue'
import Label from './Label.vue'
import Input from './Input.vue';
import Image from './Image.vue';
import Dropdown from './Dropdown.vue';
import { Item } from '@/core/types/entities/dma/e-form/Item';
import { Task } from '@/core/types/entities/dma/e-form/Task';
import SmallCamera from './small-camera/SmallCamera.vue';
import CheckBox from './CheckBox.vue';
import Html from "@/components/e-form/HTML.vue";
import InteractiveButton from './InteractiveButton.vue';
import { isUndefined } from 'lodash'
import StatusInfo from "@/components/e-form/statusInfo.vue"

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  },
  task: {
    type: Object as PropType<Task>,
  },
  itemLoading: {
    type: Boolean,
    default: false
  }
});

const columns = computed((el) => {
  const columns: any[] = []
  for (const property in props.item) {
    columns.push(props.item[property])
  }
  return columns
})

const itemAlignment = (column: Item) => {
  let alignment = ""
  if (!isUndefined(column.style) && !isUndefined(column.style.textvAlign)) {
    alignment = `align-self-${column.style.textvAlign}`
  }
  return alignment
}
</script>
