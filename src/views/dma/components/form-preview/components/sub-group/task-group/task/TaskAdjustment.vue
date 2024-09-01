<template>
  <div class="row w-100">
    <div class="col-1 pb-1 px-2"></div>
    <div class="col-1 pb-1 px-2" :style="[`border-left: ${borderLeft}`]"></div>
    <div class="pb-1 px-2" :class="adjDescBreakPointCond" :style="[]">
      {{  task.adjustment.description }}
    </div>
    <div class="col-2 pb-1 px-2" :style="[]">
      <el-input
        v-model.lazy="taskVal.adjustment.measurement"
        size="small"
        placeholder="Please Input"
        @keypress="onlyNumber"
        @focusout="changeEventToValue"
        readonly
      />
      <template v-if="loadingIndicator">
        <div class="d-flex align-items-center">
          <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <span>Loading...</span>
        </div>
      </template>
    </div>
    <div class="col-1 pb-1 px-2" :style="[]">
      {{  task.adjustment.uom }}
    </div>
    <div class="col-1 col-md-1 pb-1 px-2 input-eform-status" :style="[]">
      <el-input
        v-model.lazy="taskVal.adjustment.rating"
        size="small"
        disabled
        :class="dropDownColor"
      />
    </div>
    <div class="col-1 col-md-1 pb-1 px-2" :style="[]">
      <div class="row justify-content-center">
        <div class="px-0 col-6 d-flex justify-content-center">
          <button class="btn btn-sm btn-icon btn-bg-light" @click="handleTriggerCamera" disabled>
            <img :src="cameraColor()" style="height: 12px; width: 14px;">
          </button>
        </div>
      <template v-if="taskVal.adjustment.pictures.length > 0">
        <div class="col-6 ps-0 pe-1 d-flex justify-content-center">
          <button class="btn btn-sm btn-icon btn-bg-success" @click="handleShowModal" style="background-color: #18AF4A;">
            <label class="text-white">+{{ taskVal.adjustment.pictures.length }}</label>
          </button>
        </div>
      </template>
      </div>
    </div>
    <div class="pb-1 px-2" :class="adjDelBtnBreakPointCond" :style="[`border-right: ${borderLeft}`]">
      <el-button type="danger" size="small" class="item-button w-100" @click="handleResetAdjustment" disabled>Delete</el-button>
    </div>
  </div>
  <div v-if="task.adjustment.updatedBy!.name" class="row w-100">
    <div class="d-flex justify-content-end py-1 col-11 offset-1 timestamp-task" :style="[`border-left: ${borderLeft}; border-right: ${borderLeft}`]">
      {{ task.adjustment.updatedBy!.name }}, {{ task.adjustment.updatedDate! }}
    </div>
  </div>
  <template v-if="!isUndefined(taskVal.adjustment.commentValue)">
    <div class="row w-100">
      <div class="col-1 pb-1 px-2"></div>
      <div class="col-1 pb-1 px-2" :style="[`border-left: ${borderLeft}`, taskBorderBottom]"></div>
      <div class="pb-1 px-2" :class="adjCmntDescBreakPointCond" :style="[taskBorderBottom]">
        {{  task.adjustment.commentLabel }}
      </div>
      <div class="pb-1 px-2" :class="adjCmntInputBreakPointCond" :style="[taskBorderBottom, `border-right: ${borderLeft}`]">
        <el-input
          v-model.lazy="taskVal.adjustment.commentValue"
          size="small"
          :placeholder="taskVal.adjustment.commentPlaceHolder"
          :readonly="true"
        />
      </div>
    </div>
  </template>
  <template v-if="modalVisibility">
    <ImageListModal
      :images="imageValues"
      :visibility="modalVisibility"
      :showDeleteButton="false"
      @handle-close="handleHideModal"
      @handle-delete="deleteImage"
    />
  </template>
</template>

<script lang="ts" setup>
import {
  defineProps,
  PropType,
  computed,
  toRef,
  ref,
  watch,
  onMounted
} from 'vue'
import { Task } from '@/core/types/entities/dma/e-form/Task'
import { isUndefined, cloneDeep } from 'lodash';
import { useEFormStore } from '@/store/pinia/dma/e-form/useEFormStore';
import { useCameraStore } from '@/store/pinia/application/useCameraStore';
import { ElLoading } from 'element-plus';
import ImageListModal from '@/views/dma/e-form/sub-group/task-group/task/item/small-camera/ImageListModal.vue';
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter';
import {
  ImageInfo
} from '@/core/types/entities/dma/ImageInfo';

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  }
});

const deleteImage = async (image) => {
  const arr = taskVal.value.adjustment.pictures
  taskVal.value.adjustment.pictures = arr.filter((img) => {
    return img != image
  })
  camStore.setCurrent(`${taskVal.value.key}-adjustment`)
  camStore.clearCurrent()
  await eformStore.addCBMAdjustmentPictures(taskVal.value)
  if (taskVal.value.adjustment.pictures.length == 0) handleHideModal
}

const taskVal = toRef(props, 'task')
const modalVisibility = ref<boolean>(false)

const imageValues = computed(() => {
  if (!taskVal.value.adjustment.pictures) return [] as ImageInfo[]
  return stringToImageInfoConvert(taskVal.value.adjustment.pictures)
})

const adjDescBreakPointCond = computed(() => {
  let breakPoint = "col-4 col-md-3"
  if (props.task.adjustment.isCommentAdjustment) {
    breakPoint = "col-5 col-md-4"
  }
  return breakPoint
})

const adjDelBtnBreakPointCond = computed(() => {
  let breakPoint = "col-2"
  if (props.task.adjustment.isCommentAdjustment) {
    breakPoint = "col-1"
  }
  return breakPoint
})

const adjCmntDescBreakPointCond = computed(() => {
  let breakPoint = "col-4 col-md-3 "
  if (props.task.adjustment.isCommentAdjustment) {
    breakPoint = "col-5 col-md-4"
  }
  return breakPoint
})

const adjCmntInputBreakPointCond = computed(() => {
  let breakPoint = "col-6 col-md-7 "
  if (props.task.adjustment.isCommentAdjustment) {
    breakPoint = "col-5 col-md-6"
  }
  return breakPoint
})

const readOnly = computed(() => {
  let sameFitter = true
  if (!isUndefined(taskVal.value!.updatedBy!) && !isUndefined(taskVal.value!.updatedBy!.id)) {
    if (eformStore.employee.id == taskVal.value!.updatedBy!.id) {
      sameFitter = true
    } else {
      sameFitter = false
    }
  }
  return !sameFitter
})

const handleHideModal = () => {
  modalVisibility.value = false
}

const handleShowModal = () => {
  console.log(taskVal.value.adjustment.pictures)
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
  if (hasBorderBottom) borderBottom = `border-bottom: ${borderLeft.value}`
  return borderBottom
})

const updatedByBorderBottom = computed(() => {
  // check if it last item on table (inlien)
  let hasBorderBottom = false
  taskVal.value.items.forEach((item) => {
    if (!isUndefined(item.style) && !isUndefined(item.style.border) && item.style.border.bottom != 'none') {
      hasBorderBottom = true
    }
  })
  let borderBottom = ''
  if (taskVal.value.adjustment.updatedBy.name != '' && hasBorderBottom) borderBottom = `border-bottom: ${borderLeft.value}`
  return borderBottom
})

const onlyNumber = ($event) => {
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
    $event.preventDefault();
  }
}

const eformStore = useEFormStore()
const showTakePhotoDialog = ref(false)
const camStore = useCameraStore()
const loadingIndicator = ref(false)

const cameraColor = () => {
  let camera;
  if (imageValues.value.length > 0) {
    camera = "/media/svg/dma/camera/e-form/png/cam-read.png"
  } else {
    camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
  }
  return camera
}

const changeEventToValue = async (event) => {
  const val = event.target.value
  if (val && val != oldValue.value) {
    loadingIndicator.value = true
    // update measuremnt
    taskVal.value.adjustment.measurement = val
    // get rating and
    // update defect if C/X and
    // update task measurement, rating, updatedby, updatedDate
    const rating = await eformStore.getAdjusmentRating(taskVal.value)
    loadingIndicator.value = false
    if (rating == 'C' || rating == 'X') {
      showTakePhotoDialog.value = true
    }
    oldAdjustmentVal.value = val
  }
}

const handleTriggerCamera = () => {
  camStore.toggleIsVisible(true, `${taskVal.value.key}-adjustment`)
  showTakePhotoDialog.value = false
}

const handleResetAdjustment = async () => {
  if (taskVal.value.adjustment.measurement != oldValue.value && taskVal.value.adjustment.measurement) {
    const loading = ElLoading.service({
      lock: true,
      text: 'Deleting Adjustment',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    await eformStore.deleteAdjusmentTask(taskVal.value)
    loading.close()
    camStore.setCurrent(`${taskVal.value.key}-adjustment`)
    camStore.clearCurrent()
  }
  taskVal.value.isShowAdjustmentRow = false
}

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

const imageObject = computed(() => {
  return cloneDeep(camStore.ImageObjects.find((i) => {
    return i.Id === `${taskVal.value.key}-adjustment`;
  }));
})

const showTakeAnotherPicture = ref(false)

const handlePostImage = () => {
  // this is array which will be always updated after taking/ uploading a pics
  const imagesInfosArr = imageObject.value!.ImageInfos
  // this is array which we will send to BE
  const riskAssesmentArrValArr = taskVal.value.adjustment.pictures
  // get new captured/uploaded pics (will be > 1)
  const newItemArr = imagesInfosArr.filter((e) => {
    return !riskAssesmentArrValArr.includes(e)
  })
  taskVal.value.adjustment.pictures = [
    ...taskVal.value.adjustment.pictures,
    ...newItemArr
  ]
  // update data to BE
  eformStore.addCBMAdjustmentPictures(taskVal.value)
  showTakeAnotherPicture.value = true
}

const onConfirmTakePhotoCancel = () => {
  showTakeAnotherPicture.value = false
}
const onConfirmTakeAnotherPhoto = () => {
  showTakeAnotherPicture.value = false
  handleTriggerCamera()
}

watch(imageObject, async (newVal, oldVal) => {
  if (!isUndefined(newVal) && newVal.ImageInfos.length > 0) {
    if (newVal.ImageInfos.length != oldVal?.ImageInfos.length) {
      await handlePostImage()
    }
  }
}, { deep: true })

const oldValue = ref('')
const oldAdjustmentVal = ref('')
onMounted(() => {
  taskVal.value.items.forEach((element) => {
    if (element.categoryItemType == 'paramRating') {
      oldValue.value = element.value as string
      oldAdjustmentVal.value = element.value as string
    }
  });
})
</script>
