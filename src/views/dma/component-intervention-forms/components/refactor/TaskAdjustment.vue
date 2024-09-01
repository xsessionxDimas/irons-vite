<template>
  <div class="row w-100 m-0">
    <div class="col-md-1 col-lg-1 pb-2 px-2 pt-2"></div>
    <div class="col-md-3 col-lg-3 pb-2 px-2 pt-2">
      {{  taskValAdjustment.description }}
    </div>
    <div class="col-md-2 col-lg-2 col-2 pb-2 px-2 pt-2 input-eform-status">
      <el-input
        v-model="inputValue"
        size="small"
        placeholder="Please Input"
        @keypress="onlyNumber"
        @focusout="changeEventToValue"
        inputmode="numeric"
        :readonly="readOnly"
      />
      <template v-if="loadingIndicatorMeasurement">
        <div class="d-flex align-items-center">
          <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <span>Loading...</span>
        </div>
      </template>
    </div>
    <div class="text-start col-md-1 col-lg-1 pb-2 px-2 pt-2">
      {{  taskValAdjustment.uom }}
    </div>
    <div class="col-md-2 col-lg-2 col-2 pb-2 px-2 pt-2 input-eform-status">
      <el-input
        v-model.lazy="taskValAdjustment.rating"
        size="small"
        disabled
        :class="dropDownColor"
      />
      <template v-if="loadingIndicatorRating">
        <div class="d-flex align-items-center">
          <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <span>Loading...</span>
        </div>
      </template>
    </div>
    <div class="col-1 col-md-1 col-lg-1 pb-2 pt-2">
      <div class="row justify-content-center">
        <div class="px-0 col-6 d-flex justify-content-center">
          <button class="btn btn-sm btn-icon btn-bg-light" @click="handleClickCamera" :disabled="readOnly">
            <NwImg :src="cameraColor()" style="height: 12px; width: 14px;" />
          </button>
        </div>
      <template v-if="imageValues.length > 0">
        <div class="col-6 ps-0 pe-1 d-flex justify-content-center">
          <button class="btn btn-sm btn-icon btn-bg-success" @click="handleShowModal" style="background-color: #18AF4A;">
            <label class="text-white">+{{ taskValAdjustment.pictures.length }}</label>
          </button>
        </div>
      </template>
      </div>
    </div>
    <div class="col-2 text-center col-md-2 col-lg-2 pb-2 px-2 pt-2" :style="[`border-right: ${borderLeft}`, taskBorderBottom]">
      <el-button :disabled="readOnly" type="danger" size="small" class="item-button w-100" @click="handleResetAdjustment">Delete</el-button>
    </div>
  </div>
  <div v-if="taskValAdjustment.updatedBy != '' && (taskValAdjustment.updatedBy as Audit).name" class="row w-100 position-absolute pe-3">
    <div class="d-flex justify-content-end py-1 col-11 offset-1 timestamp-task" :style="[`border-left: ${borderLeft}; border-right: ${borderLeft}`]">
      {{ (taskValAdjustment.updatedBy as Audit).name }}, {{ taskValAdjustment.updatedDate }}
    </div>
  </div>
  <template v-if="taskValAdjustment.updatedBy != ''">
    <div class="row w-100"><div style="height: 25px;"></div></div>
  </template>
  <template v-if="!isUndefined(taskValAdjustment.commentValue)">
    <div class="row w-100 m-0">
      <div class="col-md-1 col-lg-1 pb-2 px-2 pt-2"></div>
      <div class="col-md-3 col-lg-3 pb-2 px-2 pt-2">
        {{  taskValAdjustment.commentLabel }}
      </div>
      <div class="col-md-8 col-lg-8 col-8 pb-2 px-2 pt-2 input-eform-status">
        <el-input
          v-model.lazy="taskValAdjustment.commentValue"
          size="small"
          :placeholder="taskValAdjustment.commentPlaceHolder"
          @focusout="changeCommentToValue"
          :readonly="readOnly"
        />
        <template v-if="loadingCommentIndicator">
          <div class="d-flex align-items-center">
            <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <span>Loading...</span>
          </div>
        </template>
      </div>
    </div>
  </template>
  <!-- <template v-if="!isUndefined(taskValAdjustment.commentValue)">
    <div class="row w-100">
      <div class="col-1 pb-1 px-2"></div>
      <div class="col-1 pb-1 px-2" :style="[`border-left: ${borderLeft}`, taskBorderBottom]"></div>
      <div class="col-4 col-md-3 pb-1 px-2" :style="[taskBorderBottom]">
        {{  taskValAdjustment.commentLabel }}
      </div>
      <div class="col-6 col-md-7 pb-1 px-2" :style="[taskBorderBottom, `border-right: ${borderLeft}`]">
        <el-input
          v-model.lazy="taskValAdjustment.commentValue"
          size="small"
          :placeholder="taskValAdjustment.commentPlaceHolder"
          @focusout="changeCommentToValue"
          :readonly="readOnly"
        />
        <template v-if="loadingCommentIndicator">
          <div class="d-flex align-items-center">
            <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <span class="timestamp-task">Updating...</span>
          </div>
        </template>
      </div>
    </div>
  </template> -->
  <ImagePreview
  :re-render="reRender"
  :type="'cbm'"
  :images="imageValues"
  :visibility="modalVisibility"
  :showDeleteButton="!readOnly"
  :show-mandatory-caption="true"
  @on-close="handleHideModal"
  @on-delete="handleDelete"
  @on-downloaded="handleDownload" />
</template>

<script lang="ts" setup>
import {
  defineProps,
  PropType,
  computed,
  ref,
  defineEmits,
  toRef,
  onMounted,
} from 'vue'
import { isUndefined } from 'lodash'
import { ElLoading } from 'element-plus'
import { IDetailTask } from '@/core/types/intervention/IDetailTask'
import { Audit } from '@/core/types/intervention/Audit'
import {
  DetailTaskAdjustmentItem
} from '@/core/types/intervention/DetailTaskAdjustmentItem'
import { TaskUpdateObject } from '@/core/types/intervention/TaskUpdateObject'
import { AESTCurrentDateTime } from '@/core/helpers/date-format'
import ImagePreview from '@/components/camera/ImagePreview.vue'
import { FileDeleteParam } from '@/core/types/intervention/FileDeleteParam'
import { ImageLoadParam } from '@/core/types/intervention/ImageLoadParam'
import {
  formatNumberOnInput,
  validateDecimalNumber
} from '@/core/helpers/number-format';

const props = defineProps({
  task: {
    required: true,
    type: Object as PropType<IDetailTask>
  },
  currentFitter: {
    type: Object as PropType<Audit>,
    required: true
  },
  reRender: {
    type: Boolean,
    default: false
  },
  isReadOnly: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits([
  "onHideAdjustment",
  'onCameraClicked',
  'onImageDelete',
  'onTaskChanged',
  'onDownloaded'
])

const taskVal = toRef(props, 'task')
const modalVisibility = ref<boolean>(false)
const loadingIndicatorMeasurement = ref(false)
const loadingIndicatorRating = ref(false)
const loadingCommentIndicator = ref(false)

const taskValAdjustment = computed(() => {
  return props.task.adjustment || {} as DetailTaskAdjustmentItem
})

const inputValue = computed({
  get: () => {
    return taskValAdjustment.value.measurement
  },
  set: (value) => {
    if (validateDecimalNumber(value)) taskValAdjustment.value.measurement = formatNumberOnInput(value);
  }
})

const handleDelete = async (filename: string) => {
  const task = {} as TaskUpdateObject
  task.employee = props.currentFitter
  task.taskKey = props.task.key
  task.taskCategory = "Adjustment"
  task.itemKey = taskValAdjustment.value.key
  task.type = "cbmAdjustment" as string
  task.value = ''
  task.timeStamp = AESTCurrentDateTime()
  task.task = taskVal.value
  const data = {} as FileDeleteParam
  data.task = task
  data.filename = filename
  emits('onImageDelete', data)
}

const handleDownload = (image: ImageLoadParam) => {
  emits('onDownloaded', image)
}

const imageValues = computed(() => {
  return taskValAdjustment.value.pictures
})

const readOnly = computed(() => {
  if (props.isReadOnly) return true
  let sameFitter = true
  return !sameFitter
})

const handleHideModal = () => {
  modalVisibility.value = false
}

const handleShowModal = () => {
  modalVisibility.value = true
}

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
  if (taskValAdjustment.value.updatedBy != "" && (taskValAdjustment.value.updatedBy as Audit).name == '' || isUndefined((taskValAdjustment.value.updatedBy as Audit).name) && hasBorderBottom) borderBottom = `border-bottom: ${borderLeft.value}`
  return borderBottom
})

const onlyNumber = ($event) => {
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
    $event.preventDefault();
  }
}

const cameraColor = () => {
  // belum ada yang take pic
  let camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
  // user yang take pic
  if (imageValues.value.length > 0) {
    camera = "/media/svg/dma/camera/e-form/png/cam-user.png"
  }
  return camera
}

const changeEventToValue = async (event) => {
  const val = String(parseFloat(event.target.value))
  if (oldAdjustmentVal.value == val) {
    return
  }
  const data = {} as TaskUpdateObject
  data.employee = props.currentFitter
  data.taskKey = props.task.key
  data.taskCategory = "Adjustment"
  data.itemKey = taskValAdjustment.value.key
  data.type = "inputUom"
  data.value = val
  data.timeStamp = AESTCurrentDateTime()
  data.task = props.task
  emits("onTaskChanged", data, () => {
    oldAdjustmentVal.value = val
  }, {
    setLoadingMeasurement: (loading: boolean) => {
      loadingIndicatorMeasurement.value = loading
    },
    setLoadingRating: (loading: boolean) => {
      loadingIndicatorRating.value = loading
    }
  })
}

const changeCommentToValue = async (event) => {
  if (readOnly.value) return
  if (oldCommentVal.value == event.target.value) {
    return
  }
  const data = {} as TaskUpdateObject
  data.employee = props.currentFitter
  data.taskKey = props.task.key
  data.taskCategory = "Adjustment"
  data.itemKey = taskValAdjustment.value.key
  data.type = "commentValue"
  data.value = event.target.value
  data.timeStamp = AESTCurrentDateTime()
  data.task = props.task
  emits("onTaskChanged", data, () => {
    oldCommentVal.value = event.target.value
  }, {
    setLoadingComment: (loading) => {
      loadingCommentIndicator.value = loading
    }
  })
}

const handleClickCamera = () => {
  const data = {} as TaskUpdateObject
  data.employee = props.currentFitter
  data.taskKey = props.task.key
  data.taskCategory = props.task.category
  data.itemKey = taskValAdjustment.value.key
  data.type = "cbmAdjustment" as string
  data.value = JSON.stringify(taskValAdjustment.value.pictures)
  data.timeStamp = AESTCurrentDateTime()
  data.task = taskVal.value
  emits('onCameraClicked', data)
}

const handleResetAdjustment = async () => {
  oldAdjustmentVal.value = ""
  oldCommentVal.value = ""
  if (taskValAdjustment.value.measurement || taskValAdjustment.value.rating) {
    const loading = ElLoading.service({
      lock: true,
      text: 'Deleting Adjustment',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    const data = {} as TaskUpdateObject
    data.employee = props.currentFitter
    data.taskKey = props.task.key
    data.taskCategory = "Adjustment"
    data.itemKey = taskValAdjustment.value.key
    data.type = "reset"
    data.value = taskValAdjustment.value.rating
    data.timeStamp = AESTCurrentDateTime()
    data.task = props.task
    emits("onTaskChanged", data, () => {
      emits("onHideAdjustment")
      loading.close()
    })
  } else {
    emits("onHideAdjustment")
  }
}

const dropDownColor = computed(() => {
  const val = taskValAdjustment.value.rating
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

const oldAdjustmentVal = ref('')
const oldCommentVal = ref('')
onMounted(() => {
  oldAdjustmentVal.value = taskValAdjustment.value.measurement
  oldCommentVal.value = taskValAdjustment.value.commentValue!
})
</script>
