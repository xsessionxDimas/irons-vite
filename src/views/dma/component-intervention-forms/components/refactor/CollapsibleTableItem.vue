<template>
  <div class="row w-100 mt-3 mb-3">
    <template v-if="reference.style && reference.style.collapseCategory == 'taskTable'">
      <div class="col-1 px-2"></div>
    </template>
    <div class="task-table collapsible-table-container" :class="reference.style && reference.style.collapseCategory == 'taskTable' ? 'col-11 px-0' : 'col-12 pe-0'">
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="open">
        <el-collapse-item :name="taskCollapse">
          <template #title>
            <span class="small-hyperlink-text-style">{{ reference.triggerCaption }}</span>
          </template>
          <TableTask :reference="reference"/>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  PropType,
  defineProps,
  ref,
  computed
} from 'vue';
import TableTask from './TableItem.vue'
import { Reference } from '@/core/types/intervention/Reference'

const props = defineProps({
  reference: {
    type: Object as PropType<Reference>,
    required: true
  },
  isPrint: {
    type: Boolean,
    default: false
  }
})
const open = ref("open")
const taskCollapse = computed(() => {
  let collapse = ""
  if (props.reference.style && props.reference.style.defaultCollapse) {
    collapse = props.reference.style.defaultCollapse
  }
  if (props.isPrint) {
    collapse = 'open'
  }
  return collapse
})
</script>
