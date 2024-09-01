<template>
  <div class="row w-100 mx-0 mb-5">
    <template v-if="reference.style && reference.style.collapseCategory == 'taskTable'">
      <div class="col-1 px-2"></div>
    </template>
    <div class="task-table" style="font-size: 12px !important" :class="reference.style && reference.style.collapseCategory == 'taskTable' ? 'col-11 px-0' : 'col-12 pe-0'">
      <label>{{ reference.description }}</label>
      <div class="row text-center task-table__header py-2 w-100">
        <div v-for="header in headers" class="col font-weight-normal task-table__header__item" :key="header">
          {{ header }}
        </div>
      </div>
      <div v-for="(row, index) in reference.items" :key="index" class="row w-100 task-table__body d-flex align-items-start" :class="taskRowBorder(index)">
        <TableRow :item="(row as ReferenceItem)" :reference="reference" :item-loading="itemLoading"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  PropType,
  ref
} from 'vue'
import TableRow from './RowItem.vue'
import { Reference } from '@/core/types/intervention/Reference'
import { ReferenceItem } from '@/core/types/intervention/ReferenceItem'


const props = defineProps({
  reference: {
    type: Object as PropType<Reference>,
    required: true
  }
})
const headers = computed(() => {
  return props.reference.header.replaceAll("'", '').replace('[', '').replace(']', '').split(", ")
})
const hasStyle = computed(() => {
  return props.reference.style != undefined
})
const taskRowBorder = (index: number) => {
  let className = ''
  if (hasStyle.value && props.reference.style.borderBottom && props.reference.style.borderBottom == "none") {
    className = ""
  } else {
    className = "border-bottom-table"
  }
  if ((index + 1) == props.reference.items.length) className = "border-bottom-table"
  return className
}
const itemLoading = ref(false)
</script>
<style lang="scss" scoped>
.task-table {
  .task-table__header {
    background-color: #F9FAFB;
    border: 1px solid #919eab3d ;
  }
  .task-table__body {
    border-left: 1px solid #919eab3d ;
    border-right: 1px solid #919eab3d ;
  }
  .border-bottom-table {
    border-bottom: 1px solid #919eab3d ;
  }
}
</style>
