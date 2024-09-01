<template>
  <div class="row w-100" data-testid='task-cleaned-row'>
    <div class="col-1 pb-1 px-2"></div>
    <div class="col-1 pb-1 px-2" :style="[`border-left: ${borderLeft}`, taskBorderBottom]"></div>
    <div class="pb-1 px-2" :class="adjDescBreakPointCond" :style="[taskBorderBottom]">
      {{  task.cleaned.description }}
    </div>
    <div class="col-2 pb-1 px-2" :style="[taskBorderBottom]">
      <el-select
        v-model="inputValue"
        placeholder="Choose One"
        size="small"
        class="w-100"
        :disabled="true"
        :class="[dropDownColor]"
        @change="changeEventToValue"
        :key="task.cleaned.key">
        <el-option
          v-for="option in options"
          :key="option"
          :value="option.value"
        >
        <span v-html="option && option.label ? content(option && option.label): ''"></span>
        </el-option>
      </el-select>
      <template v-if="loadingIndicator">
        <div class="d-flex align-items-center">
          <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <span class="timestamp-task">Updating...</span>
        </div>
      </template>
    </div>
    <div class="col-1 col-md-1 pb-1 px-2" :style="[taskBorderBottom]">
      <div class="row justify-content-center">
        <div class="px-0 col-6 d-flex justify-content-center">
          <button class="btn btn-sm btn-icon btn-bg-light" @click="handleTriggerCamera" :disabled="cameraReadOnly">
            <img :src="cameraColor()" style="height: 12px; width: 14px;">
          </button>
        </div>
      <template v-if="taskVal.cleaned.pictures.length > 0">
        <div class="col-6 ps-0 pe-1 d-flex justify-content-center">
          <button class="btn btn-sm btn-icon btn-bg-success" @click="handleShowModal" style="background-color: #18AF4A;">
            <label class="text-white">+{{ taskVal.cleaned.pictures.length }}</label>
          </button>
        </div>
      </template>
      </div>
    </div>
    <div class="pb-1 px-2" :class="adjDelBtnBreakPointCond" :style="[`border-right: ${borderLeft}`, taskBorderBottom]">
      <el-button type="danger" size="small" class="item-button w-100" @click="handleResetAdjustment" disabled>Delete</el-button>
    </div>
  </div>
  <div v-if="task.cleaned.updatedBy!.name" class="row w-100">
    <div class="d-flex justify-content-end py-1 col-11 offset-1 timestamp-task" :style="[`border-left: ${borderLeft}; border-right: ${borderLeft}; ${updatedByBorderBottom}`]">
      {{ task.cleaned.updatedBy!.name }}, {{ task.cleaned.updatedDate! }}
    </div>
  </div>

  <!-- <TakePhoto :show="showTakePhotoDialog" @close="handleTriggerCamera"/> -->
  <!-- <Confirmation :visibility="showTakeAnotherPicture"
    caption="The photo successfully taken, would you like to take another photo?"
    @on-no-confirm="onConfirmTakePhotoCancel"
    @on-yes-confirm="onConfirmTakeAnotherPhoto" /> -->
    <template v-if="modalVisibility">
      <ImageListModal
        :images="imageValues"
        :visibility="modalVisibility"
        :showDeleteButton="false"
        @handle-close="handleHideModal"
        @handle-delete="deleteImage"
      />
    </template>
    <ErrorBox
    :visibility="isOutOfRangeValidationShow"
    :isCloseButtonShow="false"
    :caption="'Out Of Range'"
    @on-close="() => { isOutOfRangeValidationShow = false }" />
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
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
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore';
import { useOnline } from '@vueuse/core';
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo';
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter';
import {
  maximumFiveDigitWithTwoFraction
} from "@/core/helpers/number-format"
import { Audit } from '@/core/types/intervention/Audit';
import ErrorBox from '@/components/alert/ErrorBox.vue'
import {
  bindingKeyGeneratorServiceSheet
} from '@/core/helpers/binding-key-generator';
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import { addSpanOnHyphen } from '@/core/helpers/manipulate-html-string';

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  }
});
const emits = defineEmits(["showTaskAdjustment"])
const online = useOnline()

const deleteImage = async (image) => {
  const arr = taskVal.value.cleaned.pictures
  taskVal.value.cleaned.pictures = arr.filter((img) => {
    return img != image
  })
  camStore.setCurrent(`${taskVal.value.key}-cleaned`)
  camStore.clearCurrent()
  await eformStore.addCBMCleanedPictures(taskVal.value)
  if (taskVal.value.cleaned.pictures.length == 0) handleHideModal
}

const taskVal = toRef(props, 'task')
const modalVisibility = ref<boolean>(false)
const validation = ref('')
const isOutOfRangeValidationShow = ref(false)

const adjDescBreakPointCond = computed(() => {
  let breakPoint = "col-6 col-md-5"
  if (props.task.cleaned.isCommentAdjustment) {
    breakPoint = "col-6 col-md-5"
  }
  return breakPoint
})

const adjDelBtnBreakPointCond = computed(() => {
  let breakPoint = "col-2"
  if (props.task.cleaned.isCommentAdjustment) {
    breakPoint = "col-1"
  }
  return breakPoint
})

const adjCmntDescBreakPointCond = computed(() => {
  let breakPoint = "col-4 col-md-3 "
  if (props.task.cleaned.isCommentAdjustment) {
    breakPoint = "col-5 col-md-4"
  }
  return breakPoint
})

const adjCmntInputBreakPointCond = computed(() => {
  let breakPoint = "col-6 col-md-7 "
  if (props.task.cleaned.isCommentAdjustment) {
    breakPoint = "col-5 col-md-6"
  }
  return breakPoint
})

const inputValue = computed({
  get: () => {
    return taskVal.value.cleaned.rating
  },
  set: (value) => {
    taskVal.value.cleaned.rating = value
  }
})

const options = computed(() => {
  const item = props.task.items.find((item) => {
    return item.itemType == "dropDown" && (item.customValidation && item.customValidation == "cbmTakePhotoAllRating");
  });
  const itemValArr = item.caption!.replace("[", "").replace("]", "").split("; ")
  const valArr = item.itemValue!.replace("[", "").replace("]", "").split(", ")
  let options = itemValArr.map((el, index) => {
    return {
      label: el.replaceAll("'", ''),
      value: valArr[index].replaceAll("'", '')
    }
  });

  return options
});

const content = ((string) => {
  return addSpanOnHyphen(string)
})

const selectedOption = computed(() => {
  if (inputValue.value) {
    return options.value.find((val) => {
      return val.value == String(inputValue.value)
    })?.label
  }
  return inputValue.value
})


const imageValues = computed(() => {
  // return taskVal.value.cleaned.pictures
  if (!taskVal.value.cleaned.pictures) return [] as ImageInfo[]
  return stringToImageInfoConvert(taskVal.value.cleaned.pictures)
})

const isSubmited = computed(() => {
  return eformStore.generalForm.status == 'Submited'
})

const readOnly = computed(() => {
  let sameFitter = true
  // if (!isUndefined(taskVal.value!.updatedBy!) && !isUndefined(taskVal.value!.updatedBy!.id)) {
  //   if (eformStore.employee.id == taskVal.value!.updatedBy!.id) {
  //     sameFitter = true
  //   } else {
  //     sameFitter = false
  //   }
  // }
  return !sameFitter || isSubmited.value
})

const cameraReadOnly = computed(() => {
  let sameFitter = true
  if (taskVal.value?.cleaned.updatedBy) {
    if (eformStore.employee.id != (taskVal.value?.cleaned.updatedBy as Audit).id) {
      sameFitter = false
    }
  }
  return !sameFitter || isSubmited.value
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
    // check if task filled, return false, hide border bottom
    if (props.task.cleaned.rating) {
      hasBorderBottom = false
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
  if (taskVal.value.cleaned.updatedBy.name != '' && hasBorderBottom) borderBottom = `border-bottom: ${borderLeft.value}`
  return borderBottom
})

const adjustmentInput = ref<HTMLInputElement>()
const onlyNumber = ($event) => {
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if (keyCode == 13) { // Allow 13 (Enter) to calculate
    adjustmentInput.value?.blur()
    return
  }
  if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
    $event.preventDefault();
  }
}

const checkCBMDecimal = () => {
  if (!isUndefined(inputValue.value == "")) return true
  const validFormat = maximumFiveDigitWithTwoFraction(inputValue.value as string);
  if (!validFormat) {
    validation.value = "max. 2 decimal digits"
    return false
  }
  return true
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
  if (!isUndefined(props.task.cleaned.updatedBy?.id)) {
    if (props.task.cleaned.updatedBy?.id == eformStore.employee.id && taskVal.value.cleaned.pictures.length > 0) {
      camera = "/media/svg/dma/camera/e-form/png/cam-user.png"
    }
  }
  if (cameraReadOnly.value && taskVal.value.cleaned.pictures.length > 0) camera = "/media/svg/dma/camera/e-form/png/cam-read.png"
  return camera
}

const changeCommentToValue = async (event) => {
  const bindingKey = bindingKeyGeneratorServiceSheet(props.task)
  let val = event.target.value
  if (readOnly.value) return
  if (val != oldCommentValue.value) {
    loadingCommentIndicator.value = true
    const propertyParams = [
      {
        keyValue: props.task.cleaned.key, // this will be cleaned key
        propertyParams: [
          {
            propertyName: "commentValue",
            propertyValue: val
          },
        ]
      }
    ]
    if (!isOfflineOrSlowInternetConnection()) {
      await eformStore.updateServiceSheetTaskValue(propertyParams, authStore.user.EmployeeId, authStore.user.Name)
    } else {
      await eformStore.updateServiceSheetTaskOnLocalDB(propertyParams, props.task.cleaned.key, `changeComment-${props.task.cleaned.key}`, false, bindingKey)
    }
    loadingCommentIndicator.value = false
    oldCommentValue.value = val
  }
}

const handleInputValidation = (val) => {
  const check = String(val).split('.')
  let isComa = false
  let isFiveMoreDigit = check[0].length > 5
  if (check[1]) {
    isComa = check[1].length > 2
  }
  const lengthCheck = isFiveMoreDigit || isComa
  if (lengthCheck) {
    validation.value = 'max input length is 5 digits and 2 number after .'
    return false
  } else {
    return true
  }
}

const changeEventToValue = async (event) => {
  const bindingKey = bindingKeyGeneratorServiceSheet(props.task as Task)
  let val = event
  if (readOnly.value) return
  if (val && val != oldValue.value) {
    loadingIndicator.value = true
    // update measuremnt
    taskVal.value.cleaned.measurement = val
    // get rating and
    // update defect if C/X and
    // update task measurement, rating, updatedby, updatedDate
    const rating = await eformStore.getCleanedRating(taskVal.value, bindingKey)
    if (!rating) {
      await eformStore.deleteCleanedTask(taskVal.value, bindingKey)
      isOutOfRangeValidationShow.value = true
      setTimeout(() => {
        isOutOfRangeValidationShow.value = false
      }, 2000)
      oldValue.value = ""
      // validation.value = 'Out Of Range'
      val = ""
      taskVal.value.cleaned.measurement = ""
    }
    loadingIndicator.value = false
  } else if (val == "" && val != oldValue.value) {
    await eformStore.getCleanedRating(taskVal.value, bindingKey)
    oldValue.value = ""
    validation.value = ""
    val = ""
    taskVal.value.cleaned.measurement = ""
    loadingIndicator.value = false
  }
}

const handleTriggerCamera = () => {
  const camRead = cameraColor() == "/media/svg/dma/camera/e-form/png/cam-read.png"
  let sameFitter = false
  const taskTimeStamp = props.task.cleaned.updatedBy?.id ? true : false
  if (taskTimeStamp) {
    if ((props.task.cleaned.updatedBy as Audit).id == eformStore.employee.id) {
      sameFitter = true
    }
  }
  if (camRead || (taskTimeStamp && !sameFitter)) {
    return
  }
  camStore.toggleIsVisible(true, `${taskVal.value.key}-cleaned`)
  showTakePhotoDialog.value = false
}

const handleResetAdjustment = async () => {
  const bindingKey = bindingKeyGeneratorServiceSheet(props.task as Task)
  if (taskVal.value.cleaned.rating) {
    const loading = ElLoading.service({
      lock: true,
      text: 'Deleting Cleaned Value',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    await eformStore.deleteCleanedTask(taskVal.value, bindingKey)
    loading.close()
    camStore.setCurrent(`${taskVal.value.key}-cleaned`)
    camStore.clearCurrent()
  }
  emits("showTaskAdjustment", false)
  taskVal.value.isShowAdjustmentRow = false
}

const dropDownColor = computed(() => {
  const val = taskVal.value.cleaned.rating
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
    return i.Id === `${taskVal.value.key}-cleaned`;
  }));
})

const showTakeAnotherPicture = ref(false)

const handlePostImage = () => {
  // this is array which will be always updated after taking/ uploading a pics
  let imagesInfosArr: ImageInfo[] = []
  if (imageObject.value) {
    imagesInfosArr = stringToImageInfoConvert(imageObject.value.ImageInfos)
  }
  // this is array which we will send to BE
  const riskAssesmentArrValArr = stringToImageInfoConvert(taskVal.value.cleaned.pictures as string[])
  // const image =
  // get new captured/uploaded pics (will be > 1)
  const newItemArr = imagesInfosArr.filter((e) => {
    return !riskAssesmentArrValArr.some((e2) => {
      return e.filename === e2.filename
    })
  });

  taskVal.value.cleaned.pictures = stringToImageInfoConvert(taskVal.value.cleaned.pictures as string)
  taskVal.value.cleaned.pictures = [
    ...taskVal.value.cleaned.pictures,
    ...newItemArr
  ]
  // update data to BE
  eformStore.addCBMCleanedPictures(taskVal.value)
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
const oldCommentValue = ref('')
const oldAdjustmentVal = ref('')
onMounted(() => {
  oldValue.value = taskVal.value.cleaned.measurement
  oldAdjustmentVal.value = taskVal.value.cleaned.measurement
  if (!isUndefined(taskVal.value.cleaned.commentValue)) {
    oldCommentValue.value = taskVal.value.cleaned.measurement
  }
  // taskVal.value.items.forEach((element) => {
  //   if (element.categoryItemType == 'paramRating') {
  //     oldValue.value = element.value as string
  //     oldAdjustmentVal.value = element.value as string
  //   }
  // });
})
</script>
