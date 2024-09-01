<template>
  <div class="row w-100 avoid flex-wrap">
    <div class="col-1 pb-1 px-2"></div>
    <div class="col-1 pb-1 px-2" :style="[`border-left: ${borderLeft}`]"></div>
    <div class="col-3 pb-1 px-2" :style="[]">
      {{  task.adjustment.description }}
    </div>
    <div class="col-2 pb-1 px-2" :style="[]">
      <el-input
        v-model.lazy="taskVal.adjustment.measurement"
        size="small"
        placeholder="Please Input"
        inputmode="numeric"
      />
    </div>
    <div class="col-1 pb-1 px-2" :style="[]">
      {{  task.adjustment.uom }}
    </div>
    <div class="col-2 pb-1 px-2" :style="[]">
      <div class="rating" :class="dropDownColor">{{ taskVal.adjustment.rating }}</div>
    </div>
    <div class="col-1 pb-1 px-2" :style="[]">
      <div class="row justify-content-center">
        <div class="px-0 small-camera-button col-6">
          <button class="btn btn-sm btn-icon btn-bg-light">
            <img src="/media/svg/dma/camera/e-form/png/cam-read.png" width="12" height="12" />
          </button>
        </div>
      <template v-if="taskVal.adjustment.pictures.length > 0">
        <div class="col-6 ps-0 pe-1">
          <button class="btn btn-sm btn-icon btn-bg-success" style="background-color: #18AF4A;">
            <label class="text-white">+{{ taskVal.adjustment.pictures.length }}</label>
          </button>
        </div>
      </template>
      </div>
    </div>
    <div class="col-1 pb-1 px-2" :style="[`border-right: ${borderLeft}`]">
      <el-button type="danger" size="small" class="item-button w-100">Delete</el-button>
    </div>
  </div>
  <div v-if="task.adjustment.updatedBy!.name" class="row w-100 avoid flex-wrap">
    <div class="d-flex justify-content-end py-1 col-11 offset-1" :style="[`border-left: ${borderLeft}; border-right: ${borderLeft}`]">
      {{ task.adjustment.updatedBy!.name }}, {{ task.adjustment.updatedDate! }}
    </div>
  </div>
  <template v-if="!isUndefined(taskVal.adjustment.commentValue)">
    <div class="row w-100">
      <div class="col-1 pb-1 px-2"></div>
      <div class="col-1 pb-1 px-2" :style="[`border-left: ${borderLeft}`, taskBorderBottom]"></div>
      <div class="col-4 col-md-3 pb-1 px-2" :style="[taskBorderBottom]">
        {{  task.adjustment.commentLabel }}
      </div>
      <div class="col-6 col-md-7 pb-1 px-2" :style="[taskBorderBottom, `border-right: ${borderLeft}`]">
        <el-input
          v-model.lazy="taskVal.adjustment.commentValue"
          size="small"
          :placeholder="taskVal.adjustment.commentPlaceHolder"
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
} from 'vue'
import { Task } from '@/core/types/entities/dma/e-form/Task'
import { isUndefined } from 'lodash';

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  },
  style: {
    type: String,
    required: false,
    default: ""
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

const dropDownColor = computed(() => {
  const val = taskVal.value.adjustment.rating
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
</script>
<style lang="scss" scoped>
.row {
  margin: 0;
}
.rating {
  border: 1px solid rgb(220, 223, 230);
  padding: 0 15px;
  border-radius: 4px;
  height: 32px;
  overflow: hidden;
  font-size: 12px;
}
.a {
  border: 1px solid rgba(24, 175, 74, 0.48);
  color: #18AF4A;
  background-color: rgba(24, 175, 74, 0.08);
}
.b {
  border: 1px solid rgba(51, 102, 255, 0.48);
  color: #01A3FF;
  background-color: rgba(51, 102, 255, 0.08);
}
.c {
  border: 1px solid #FFC107;
  color: #FFC107;
  background-color: rgba(255, 193, 7, 0.08);
}
.x {
  border: 1px solid rgba(255, 72, 66, 0.48);
  color: #FF4842;
  background-color: rgba(255, 72, 66, 0.08);
}
</style>
