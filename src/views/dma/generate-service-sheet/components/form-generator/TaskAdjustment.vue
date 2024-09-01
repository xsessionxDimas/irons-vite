<template>
  <div class="row w-100">
    <div class="col-1 pb-1 px-2"></div>
    <div class="col-1 pb-1 px-2" :style="[`border-left: ${borderLeft}`]"></div>
    <div class="col-4 col-md-3 pb-1 px-2" :style="[]">
      {{  task.adjustment.description }}
    </div>
    <div class="col-2 pb-1 px-2" :style="[]">
      <el-input
        ref="adjustmentInput"
        v-model="inputValue"
        size="small"
        placeholder="Please Input"
        @keypress="onlyNumber"
        @focusout="changeEventToValue"
        inputmode="numeric"
        :readonly="readOnly"
      />
      <template v-if="loadingIndicator">
        <div class="d-flex align-items-center">
          <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <span class="timestamp-task">Updating...</span>
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
          <button class="btn btn-sm btn-icon btn-bg-light" @click="handleTriggerCamera" :disabled="readOnly">
            <img :src="cameraColor()" style="height: 12px; width: 14px;" alt="photo">
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
    <div class="col-2 pb-1 px-2" :style="[`border-right: ${borderLeft}`]">
      <el-button :disabled="readOnly" type="danger" size="small" class="item-button w-100" @click="handleResetAdjustment">Delete</el-button>
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
      <div class="col-4 col-md-3 pb-1 px-2" :style="[taskBorderBottom]">
        {{  task.adjustment.commentLabel }}
      </div>
      <div class="col-6 col-md-7 pb-1 px-2" :style="[taskBorderBottom, `border-right: ${borderLeft}`]">
        <el-input
          v-model.lazy="taskVal.adjustment.commentValue"
          size="small"
          :placeholder="taskVal.adjustment.commentPlaceHolder"
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
  </template>
    <template v-if="modalVisibility">
      <ImagePreview
      :type="'cbm'"
      :re-render="false"
      :images="imageValues"
      :show-delete-button="!readOnly"
      :is-mandatory="false"
      :visibility="modalVisibility"
      :is-monitoring="readOnly"
      :show-mandatory-caption="false"
      @on-close="handleHideModal"
      @on-delete="deleteImage" />
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
import ImagePreview from '@/components/camera/ImagePreview.vue'
import { Task } from '@/core/types/entities/dma/e-form/Task'
import { isUndefined, cloneDeep } from 'lodash';
import { useEFormStore } from '@/store/pinia/dma/e-form/useEFormStore';
import { useCameraStore } from '@/store/pinia/application/useCameraStore';
import { ElLoading } from 'element-plus';
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore';
import { Audit } from '@/core/types/intervention/Audit';
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter';
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo';
import {
  formatNumberOnInput,
  validateDecimalNumber
} from '@/core/helpers/number-format'

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  }
});

const deleteImage = async (filename: string) => {
  const arr = stringToImageInfoConvert(taskVal.value.adjustment.pictures)
  taskVal.value.adjustment.pictures = arr.filter((img) => {
    return img.filename != filename
  })
  camStore.setCurrent(`${taskVal.value.key}-adjustment`)
  await eformStore.addCBMAdjustmentPictures(taskVal.value)
  if (taskVal.value.adjustment.pictures.length == 0) handleHideModal()
  camStore.clearCurrent()
}

const taskVal = toRef(props, 'task')
const modalVisibility = ref<boolean>(false)
const globalConnectionStore = useGlobalConnectionStore()

const inputValue = computed({
  get: () => {
    return taskVal.value.adjustment.measurement
  },
  set: (value) => {
    if (validateDecimalNumber(value)) taskVal.value.adjustment.measurement = formatNumberOnInput(value);
  }
})

const imageValues = computed(() => {
  if (!taskVal.value.adjustment.pictures) return [] as ImageInfo[]
  return stringToImageInfoConvert(taskVal.value.adjustment.pictures)
})

const readOnly = computed(() => {
  let sameFitter = true
  // if (taskVal.value?.updatedBy) {
  //   if (eformStore.employee.id != (taskVal.value.updatedBy as Audit).id) {
  //     sameFitter = false
  //   }
  // }
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
  if (hasBorderBottom) borderBottom = `border-bottom: ${borderLeft.value}`
  return borderBottom
})

const adjustmentInput = ref<HTMLInputElement>()
const onlyNumber = ($event) => {
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if (keyCode == 13) { // Allow 13 (Enter) to calculate
    adjustmentInput.value!.blur()
    return
  }
  if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
    $event.preventDefault();
  }
}

const eformStore = useEFormStore()
const showTakePhotoDialog = ref(false)
const camStore = useCameraStore()
const loadingIndicator = ref(false)
const authStore = useAuthenticationStore()
const loadingCommentIndicator = ref(false)

const cameraColor = () => {
  // belum ada yang take pic
  let camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
  // user yang take pic
  if (!isUndefined(props.task.adjustment.updatedBy?.id)) {
    if (props.task.adjustment.updatedBy?.id == eformStore.employee.id && taskVal.value.adjustment.pictures.length > 0) {
      camera = "/media/svg/dma/camera/e-form/png/cam-user.png"
    }
  }
  if (readOnly.value) camera = "/media/svg/dma/camera/e-form/png/cam-read.png"
  return camera
}

const changeCommentToValue = async (event) => {
  let val = event.target.value
  if (readOnly.value) return
  if (!globalConnectionStore.stateConnectionStatus) {
    globalConnectionStore.setSubmitConnectionError(true)
    taskVal.value.adjustment.measurement = oldValue.value
    return
  }
  if (val != oldCommentValue.value) {
    loadingCommentIndicator.value = true
    const propertyParams = [
      {
        keyValue: props.task.adjustment.key, // this will be adjustment key
        propertyParams: [
          {
            propertyName: "commentValue",
            propertyValue: val
          },
        ]
      }
    ]
    await eformStore.updateServiceSheetTaskValue(propertyParams, authStore.user.EmployeeId, authStore.user.Name)
    loadingCommentIndicator.value = false
    oldCommentValue.value = val
  }
}

const changeEventToValue = async (event) => {
  let val = event.target.value
  if (readOnly.value) return
  if (!globalConnectionStore.stateConnectionStatus) {
    globalConnectionStore.setSubmitConnectionError(true)
    taskVal.value.adjustment.measurement = oldValue.value
    return
  }
  const loader = ElLoading.service({
    lock: true,
    text: 'Updating...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (val && val != oldValue.value) {
    loadingIndicator.value = true
    // update measuremnt
    taskVal.value.adjustment.measurement = val
    const rating = await eformStore.getAdjusmentRating(taskVal.value)
    loadingIndicator.value = false
    if (rating == 'C' || rating == 'X') {
      showTakePhotoDialog.value = true
    }
    oldValue.value = val
  }
  loader.close()
}

const handleTriggerCamera = () => {
  camStore.toggleIsVisible(true, `${taskVal.value.key}-adjustment`)
  showTakePhotoDialog.value = false
}

const handleResetAdjustment = async () => {
  if (taskVal.value.adjustment.measurement) {
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
  let imagesInfosArr: ImageInfo[] = []
  // this is array which will be always updated after taking/ uploading a pics
  if (imageObject.value) {
    imagesInfosArr = stringToImageInfoConvert(imageObject.value.ImageInfos)
  }
  // this is array which we will send to BE
  const taskPhotos = stringToImageInfoConvert(taskVal.value.adjustment.pictures)
  // get new captured/uploaded pics (will be > 1)
  const newItemArr = imagesInfosArr.filter((e) => {
    return !taskPhotos.includes(e)
  })
  taskVal.value.adjustment.pictures = [
    ...taskVal.value.adjustment.pictures,
    ...newItemArr
  ]
  // update data to BE
  eformStore.addCBMAdjustmentPictures(taskVal.value)
  showTakeAnotherPicture.value = true
}


watch(imageObject, async (newVal, oldVal) => {
  if (!isUndefined(newVal) && newVal.ImageInfos.length > 0) {
    if (newVal.ImageInfos.length != oldVal?.ImageInfos.length) {
      await handlePostImage()
    }
  }
}, { deep: true })

const oldValue = ref('')
const oldCommentValue = ref('')
const oldAdjustmentVal = ref('')
onMounted(() => {
  oldValue.value = taskVal.value.adjustment.measurement
  oldAdjustmentVal.value = taskVal.value.adjustment.measurement
  if (!isUndefined(taskVal.value.adjustment.commentValue)) {
    oldCommentValue.value = taskVal.value.adjustment.measurement
  }
  // taskVal.value.items.forEach((element) => {
  //   if (element.categoryItemType == 'paramRating') {
  //     oldValue.value = element.value as string
  //     oldAdjustmentVal.value = element.value as string
  //   }
  // });
})
</script>
