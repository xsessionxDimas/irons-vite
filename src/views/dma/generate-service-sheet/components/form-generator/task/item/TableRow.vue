<template>
<div :class="itemAlignment(column)" class="eform-table-row col px-0" v-for="column in columns" :key="column.key">
  <Image v-if="column.itemType === 'image'" :item="column" :task="task"/>
  <Label v-if="column.itemType === 'label'" :item="column" :task="task"/>
  <Input v-if="column.itemType === 'input'" :item="column" :task="task" :item-loading="itemLoading"/>
  <Dropdown v-if="column.itemType === 'dropDown'" :item="column" :task="task" :item-loading="itemLoading"/>
  <SmallCamera v-if="column.itemType === 'smallCamera'" :item="item" :task="task"/>
  <CheckBox v-if="item.itemType === 'checkbox'" :item="item" :task="task"/>
  <HTMLComponent v-if="item.itemType === 'html'" :item="item" :task="task"/>
  <InteractiveButton v-if="item.itemType === 'button'" :item="item" :task="task"/>
</div>
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType } from 'vue'
import Image from './Image.vue'
import Label from './Label.vue'
import HTMLComponent from './HTMLComponent.vue'
import Dropdown from './Dropdown.vue';
import Input from './Input.vue';
import SmallCamera from './small-camera/SmallCamera.vue';
import CheckBox from './CheckBox.vue';
import { isUndefined } from 'lodash'
import { Item } from '@/core/types/generate-service-sheet/Item';
import { Task } from '@/core/types/generate-service-sheet/Task';

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
