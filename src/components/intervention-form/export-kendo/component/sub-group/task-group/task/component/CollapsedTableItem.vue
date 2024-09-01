<template>
  <div class="row w-100 mt-3 mb-3 prevent-split">
    <template v-if="reference.style && reference.style.collapseCategory == 'taskTable'">
      <div class="col-1 px-2"></div>
    </template>
    <div class="task-table collapsible-table-container" :class="reference.style && reference.style.collapseCategory == 'taskTable' ? 'col-11 px-0' : 'col-12 pe-0'">
      <el-collapse class="task-group general-accordion pt-1 pb-4 px-5" v-model="open">
        <el-collapse-item :name="taskCollapse">
          <template #title>
            <span class="small-hyperlink-text-style">{{ reference.triggerCaption }}</span>
          </template>
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
const open = ref("close")
const taskCollapse = computed(() => {
  let collapse = ""
  console.log(props.reference.style.defaultCollapse)
  if (props.reference.style?.defaultCollapse) {
    collapse = props.reference.style.defaultCollapse
  }
  return collapse
})
</script>
