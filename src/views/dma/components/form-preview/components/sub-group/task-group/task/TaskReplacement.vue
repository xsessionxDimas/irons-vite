<template>
  <div class="row w-100">
    <div class="col-1 pb-1 px-2"></div>
    <div class="col-1 pb-1 px-2" :style="[`border-left: ${borderLeft}`]"></div>
    <div class="col-4 col-md-3 pb-1 px-2" :style="[]">
      {{  task.replacement.description }}
    </div>
    <div class="col-1 pb-1 px-2"></div>
    <div class="col-2 pb-1 px-2" :style="[]">
      <el-input
        v-model.lazy="taskVal.replacement.measurement"
        size="small"
        placeholder="Please Input"
        @keypress="onlyNumber"
        readonly
      />
    </div>
    <div class="col-1 pb-1 px-2" :style="[]">
      {{  task.replacement.uom }}
    </div>
    <div class="col-1 col-md-1 pb-1 px-2 input-eform-status" :style="[]">
      <el-input
        v-model.lazy="taskVal.replacement.rating"
        size="small"
        disabled
        :class="dropDownColor"
      />
    </div>
    <div class="col-2 pb-1 px-2" :style="[`border-right: ${borderLeft}`]">
      <el-button type="danger" size="small" class="item-button w-100" disabled>Delete</el-button>
    </div>
  </div>
  <div v-if="task.replacement.updatedBy!.name" class="row w-100">
    <div class="d-flex justify-content-end py-1 col-11 offset-1 timestamp-task" :style="[`border-left: ${borderLeft}; border-right: ${borderLeft}`]">
      {{ task.replacement.updatedBy!.name }}, {{ task.replacement.updatedDate! }}
    </div>
  </div>
  <template v-if="!isUndefined(taskVal.replacement.commentValue)">
    <div class="row w-100">
      <div class="col-1 pb-1 px-2"></div>
      <div class="col-1 pb-1 px-2" :style="[`border-left: ${borderLeft}`, taskBorderBottom]"></div>
      <div class="col-4 col-md-3 pb-1 px-2" :style="[taskBorderBottom]">
        {{  task.replacement.commentLabel }}
      </div>
      <div class="col-6 col-md-7 pb-1 px-2" :style="[taskBorderBottom, `border-right: ${borderLeft}`]">
        <el-input
          v-model.lazy="taskVal.replacement.commentValue"
          size="small"
          :placeholder="taskVal.replacement.commentPlaceHolder"
          :readonly="true"
        />
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import {
  defineProps,
  PropType,
  computed,
  toRef,
  ref,
  onMounted
} from 'vue'
import { Task } from '@/core/types/entities/dma/e-form/Task'
import { isUndefined } from 'lodash';

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  }
});

const taskVal = toRef(props, 'task')

const borderLeft = computed(() => {
  let borderLeft = ''
  props.task.items.forEach((element) => {
    if (!isUndefined(element.style) && !isUndefined(element.style.border) && element.style.border.left != 'none') {
      borderLeft = element.style.border.left
    }
  });
  return borderLeft
})

const taskBorderBottom = computed(() => {
  let borderBottom = ''
  let hasBorderBottom = false
  taskVal.value.items.forEach((item) => {
    if (!isUndefined(item.style) && !isUndefined(item.style.border) && item.style.border.bottom != 'none') {
      hasBorderBottom = true
    }
  })
  if (hasBorderBottom) borderBottom = `border-bottom: ${borderLeft.value}`
  return borderBottom
})

const onlyNumber = ($event) => {
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
    $event.preventDefault();
  }
}

const dropDownColor = computed(() => {
  const val = taskVal.value.replacement.rating
  let color
  if (val == 'A') {
    color = 'a'
  } else if (val == 'B') {
    color = 'b'
  } else if (val == 'C') {
    color = 'c'
  } else if (val == 'X') {
    color = 'x'
  }
  return color
})


const oldValue = ref('')
const oldReplacementVal = ref('')
onMounted(() => {
  taskVal.value.items.forEach((element) => {
    if (element.categoryItemType == 'paramRating') {
      oldValue.value = element.value as string
      oldReplacementVal.value = element.value as string
    }
  });
})
</script>
