<template>
  <div class="row w-100 mt-3 mb-3" v-show="showTask">
    <template v-if="!isUndefined(task.style) && task.style.collapseCategory == 'taskTable'">
      <div class="col-1 px-2"></div>
    </template>
    <div class="task-table collapsible-table-container" :class="!isUndefined(task.style) && task.style.collapseCategory == 'taskTable' ? 'col-11 px-0' : 'col-12 pe-0'">
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="open">
        <el-collapse-item :name="taskCollapse">
          <template #title>
            <span class="small-hyperlink-text-style">{{ task.triggerCaption }}</span>
          </template>
          <TableTask :task="task"/>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Task,
  ShowParametereEnum
} from '@/core/types/entities/dma/e-form/Task';
import {
  PropType,
  defineProps,
  ref,
  computed
} from 'vue';
import TableTask from './TableTask.vue'
import { isUndefined } from "lodash"
import {
  BrakePackTypeDropdownValueEnum
} from '@/core/types/entities/dma/e-form/Item';
import {
  usePreviewFormStore
} from '@/store/pinia/dma/preview-form/usePreviewFormStore';

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  }
})

const open = ref("open")

const eformStore = usePreviewFormStore()

const showTask = computed(() => {
  let showTask = true

  // check brake pack type
  // ticket BAA-11165
  showTask = handleCheckShwoBrakePackTask(showTask);
  return showTask
})

// logic untuk menampilkan task caliper/oil cooled
// default is caliper
const handleCheckShwoBrakePackTask = (currentShowTask: boolean): boolean => {
  let showTask = currentShowTask;
  if (eformStore.SelectedBrakeTypeDropdown == BrakePackTypeDropdownValueEnum.OIL_COOLED) {
    if (props.task.showParameter == ShowParametereEnum.BRAKE_TYPE_CALIPER) {
      showTask = false;
    }
  } else {
    if (props.task.showParameter == ShowParametereEnum.BRAKE_TYPE_OIL_COOLED) {
      showTask = false;
    }
  }
  return showTask;
}

const taskCollapse = computed(() => {
  let collapse = ""
  if (!isUndefined(props.task.style) && !isUndefined(props.task.style.defaultCollapse)) {
    collapse = props.task.style.defaultCollapse
  }
  return collapse
})

</script>
