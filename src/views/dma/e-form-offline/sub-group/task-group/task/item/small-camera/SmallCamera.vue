<template>
  <div :class="[widthStyle, potraitWidthStyle, paddingBottomCondition]" :style="style" class="pt-2">
    <div class="row" :class="!isUndefined(itemRef.value) && itemRef.value.length > 0 ? 'justify-content-around' : 'justify-content-center'">
      <div class="d-flex justify-content-center" :class="!isUndefined(itemRef.value) && itemRef.value.length > 0 ? 'col-6 pe-0 ps-1' : 'col-6 px-0'">
        <button class="btn btn-sm btn-icon btn-bg-light" @click="handleClickCamera()" :disabled="readOnly">
          <template v-if="cameraColor() == 'camUser'">
            <NwImg src="/media/svg/dma/camera/e-form/png/cam-user.png" style="height: 12px; width: 14px;" alt="camera" />
          </template>
          <template v-else-if="cameraColor() == 'camRead'">
            <NwImg src="/media/svg/dma/camera/e-form/png/cam-read.png" style="height: 12px; width: 14px;" alt="camera" />
          </template>
          <template v-else>
            <NwImg src="/media/svg/dma/camera/e-form/png/cam-active.png" style="height: 12px; width: 14px;" alt="camera" />
          </template>
        </button>
      </div>
      <template v-if="imageValues && imageValues.length > 0">
        <div class="col-6 ps-0 pe-1 d-flex justify-content-center">
          <button class="btn btn-sm btn-icon btn-bg-success" @click="handleShowModal" style="background-color: #18AF4A;">
            <label class="text-white">+{{ imageValues.length }}</label>
          </button>
        </div>
      </template>
    </div>
    <template v-if="modalVisibility">
      <ImagePreviewCabSide v-if="task?.rating == 'CAB_SIDE'"
        ref="preview"
        :images="imageValues"
        :visibility="modalVisibility"
        :view-only="false"
        @on-close="handleHideModal"
        @on-delete="deleteImageReplacement" />
      <ImageListModal v-else
        :images="imageValues"
        :visibility="modalVisibility"
        :showDeleteButton="showDeleteButtonCondition"
        @handle-close="handleHideModal"
        @handle-delete="deleteImage"
        :showRemainingPhotosMessage="true"
      />
    </template>
    <TakeReplacementPhoto
      :show="showReplacementConfirmation"
      :item="$props.item"
      :tool="replacementTool"
      side="off cab side"
      @close="onConfirmTakeAnotherPhoto"  />
    <Confirmation :visibility="showTakeAnotherPicture"
      caption="The photo successfully taken, would you like to take another photo?"
      @on-no-confirm="onConfirmTakePhotoCancel"
      @on-yes-confirm="onConfirmTakeAnotherPhoto" />
  </div>
</template>

<script lang="ts" setup>
import { Item } from '@/core/types/entities/dma/e-form/Item';
import { Task } from '@/core/types/entities/dma/e-form/Task';
import { computed } from '@vue/reactivity';
import {
  isUndefined,
  isEqual,
  cloneDeep,
  last,
  uniqBy
} from 'lodash';
import {
  defineProps,
  PropType,
  toRef,
  ref,
  watch,
} from 'vue'
import ImageListModal from './ImageListModal.vue';
import { useEFormStore } from "@/store/pinia/dma/e-form-offline/useEFormStore";
import {
  useOfflineCameraStore
} from '@/store/pinia/application/useOfflineCameraStore';
import {
  UpdateParam
} from '@/core/types/entities/dma/e-form/update-data/updateParam';
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore';
import Confirmation from '@/components/dialog/CameraConfirmation.vue';
import { AESTCurrentDateTime } from '@/core/helpers/date-format';
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter';
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo';
import { Audit } from '@/core/types/intervention/Audit';
import TakeReplacementPhoto from '../dialog/TakeReplacementPhoto.vue'
import ImagePreviewCabSide from '@/components/camera/OfflineImagePreviewCabSide.vue'
import { DeleteImageParam } from '@/core/types/misc/DeleteImageParam';
import {
  bindingKeyGeneratorServiceSheet
} from '@/core/helpers/binding-key-generator';
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  },
  generalStyle: {
    type: Boolean,
    default: true
  },
  task: {
    type: Object as PropType<Task>
  },
  isShowAdjustment: {
    type: Boolean
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  }
});

const itemRef = toRef(props, 'item')
const modalVisibility = ref<boolean>(false);
const taskPropsItem = toRef(props, 'task')
const store = useEFormStore()
const camStore = useOfflineCameraStore()
const authStore = useAuthenticationStore()
const showReplacementConfirmation = ref(false)
const preview = ref()

const widthStyle = computed(() => {
  if (props.generalStyle) {
    return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col"
  }
  return ''
})

const potraitWidthStyle = computed(() => {
  let customClass = ''
  if (props.generalStyle) {
    const hasStyle = !isUndefined(itemRef.value.style)
    if (hasStyle) {
      const hasPotraitBreakPoint = !isUndefined(itemRef.value.style.potraitBreakPoint)
      if (hasPotraitBreakPoint && itemRef.value.style.breakPoint != 'none') {
        customClass = `col-md-${itemRef.value.style.potraitBreakPoint}`

        customClass = `${customClass} col-lg-${itemRef.value.style.breakPoint}`
      } else {
        customClass = `col-md-${itemRef.value.style.potraitBreakPoint}`

        customClass = `${customClass} col-lg-${itemRef.value.style.breakPoint}`
      }
    }
  }
  return customClass
})

const imageValues = computed(() => {
  if (!itemRef.value.value) return [] as ImageInfo[]
  return stringToImageInfoConvert(itemRef.value.value)
  // return JSON.parse(itemRef.value.value)
})

const isMandatory = computed(() => {
  let mandatory = false
  if (props.task?.category == "CBM") {
    props.task.items.every((item) => {
      if (item.itemType == "dropDown" || item.itemType == "input") {
        if (item.customValidation == "cbmTakePhotoAllRating") {
          mandatory = true
          return false
        } else if (item.customValidation == "cbmDefectTakePhoto" && (props.task?.taskValue == "C" || props.task?.taskValue == "X")) {
          mandatory = true
          return false
        }
      }
      return true
    })
  } else if (props.task?.category == "NORMAL" && props.task?.rating == "SERVICE_CLEANED_AND_REPLACED") {
    return true
  }
  return mandatory
})

const deleteImageReplacement = async (param: DeleteImageParam): Promise<void> => {
  itemRef.value.value = stringToImageInfoConvert(itemRef.value.value)
  const arr = itemRef.value.value
  itemRef.value.value = arr.filter((img) => {
    return img.filename != param.filename
  })
  camStore.setIsReplacementCamera(true)
  camStore.setCurrent(itemRef.value.key)
  await updateDateToBE().then(() => {
    camStore.clearCurrent()
    if (itemRef.value.value.length < 2) {
      camStore.setReplacementPosition(param.type)
      takeAnotherPicture()
    }
  })
}

const replacementTool = computed(() => {
  let toolType = ''
  switch (props.task?.SectionData) {
    case "HV Alternator":
      toolType = "alternator"
      break;
    case "Retarder Grid Box 1":
    case "Retarder Grid Box 2":
      toolType = "blower motor"
      break;
  }
  return toolType
})

watch(imageValues, () => {
  cameraColor()
})

const handleClickCamera = (isFromActionDelete = false, showCloseButton = true) => {
  const camRead = cameraColor() == "camRead"
  let sameFitter = true
  const taskTimeStamp = props.task?.updatedBy?.id ? true : false
  if (camRead || (taskTimeStamp && !sameFitter)) {
    return
  }
  if (store.generalForm.status == "Submited") {
    store.toggleFormAlreadySubmitted(true)
    return
  }
  camStore.setIsActionFromDelete(isFromActionDelete)
  camStore.toggleIsVisible(true, itemRef.value.key)
  camStore.setShowCloseButton(showCloseButton)
  camStore.addLocalImageInfo({
    taskKey: props.task!.key,
    workOrder: store.generalForm.workOrder,
    type: 'task',
    updatedBy: store.employee.id,
    email: authStore.user.Email,
  })
}

const imageObject = computed(() => {
  return cloneDeep(camStore.ImageObjects.find((i) => {
    return i.Id === itemRef.value.key;
  }));
})

const cameraColor = () => {
  // belum ada yang take pic
  let camera = "camActive"
  // user yang take pic
  if (!isUndefined(props.task?.updatedBy?.id) && !isUndefined(itemRef.value.updatedBy!.id)) {
    if (props.task?.updatedBy?.id == store.employee.id) {
      if (imageValues.value.length == 0) {
        camera = "camActive"
      } else {
        camera = "camUser"
      }
    } else {
      // user selain yang take pic
      if (imageValues.value.length == 0) {
        camera = "camActive"
      } else {
        camera = "camUser"
      }
    }
  }
  if (props.task?.rating === "CAB_SIDE" && imageValues.value.length === 2) {
    camera = "camRead"
  }
  return camera
}

const showDeleteButtonCondition = computed(() => {
  if (!props.generalSubmitted) return false
  return cameraColor() != "camRead"
})

const handleShowModal = () => {
  if (props.task?.rating == 'CAB_SIDE') {
    camStore.setIsReplacementCamera(true)
  }
  modalVisibility.value = true
}

const handleHideModal = () => {
  modalVisibility.value = false
}

const style = computed(() => {
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; ` : ""
  const fontColor = !isUndefined(itemRef.value.style) && itemRef.value.style.fontColor != 'none' ? `color: ${itemRef.value.style.fontColor}; ` : ""
  const borderTop = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.top != 'none' ? `border-top: ${itemRef.value.style.border.top}; ` : ""
  const borderRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.right != 'none' ? `border-right: ${itemRef.value.style.border.right}; ` : ""
  let borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
  // check for condition CBM auto has additional row, jadi harus cek apakah menampilkan border dari item atau dari additional row
  const isReplacement = (!isUndefined(props.task?.isShowReplacementRow) && props.task?.isShowReplacementRow)
  const isAdjustment = (!isUndefined(props.task?.isShowAdjustmentRow) && props.task?.isShowAdjustmentRow)
  const isCleaned = (!isUndefined(props.task?.isShowCleanedRow) && props.task?.isShowCleanedRow)
  const isRepJust = isReplacement || isAdjustment || isCleaned || props.isShowAdjustment
  if (isRepJust) {
    borderBottom = ''
  } else {
    // get total col for border bottom (if 12 this means full table and the border bottom must be below timestamp)
    // otherwise border bottom must be below item
    let totalCol = 0
    props.task?.items.forEach((item) => {
      if (!isUndefined(item.style)) {
        if (!isUndefined(item.style.border)) {
          if (item.style.border.right == 'none' || isUndefined(item.style.border.right)) {
            totalCol = totalCol + Number(item.style.breakPoint)
          }
          if (isEqual(item, last(props.task?.items))) {
            totalCol = totalCol + Number(item.style.breakPoint)
          }
        } else if (isUndefined(item.style.border)) {
          totalCol = totalCol + Number(item.style.breakPoint)
        }
      }
    })
    if (totalCol == 12) {
      borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem; ` : ""
    }
  }
  const borderLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.left != 'none' ? `border-left: ${itemRef.value.style.border.left}; ` : ""

  const borderRadiusTopRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topRight != 'none' ? `border-top-right-radius: ${itemRef.value.style.borderRadius.topRight}; ` : ""
  const borderRadiusBottomRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomRight != 'none' ? `border-bottom-right-radius: ${itemRef.value.style.borderRadius.bottomRight}; ` : ""
  const borderRadiusTopLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topLeft != 'none' ? `border-top-left-radius: ${itemRef.value.style.borderRadius.topLeft}; ` : ""
  const borderRadiusBottomLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomLeft != 'none' ? `border-bottom-left-radius: ${itemRef.value.style.borderRadius.bottomLeft}; ` : ""

  // kondisi kalau dia row terakhir table (border bottom at last index)
  let paddingBottom = ''
  if (borderBottom) {
    paddingBottom = 'padding-bottom: 25px; '
  }
  return `${paddingBottom}${backGroundColor}${fontColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
})

const deleteImage = async (image) => {
  if (isMandatory.value && imageValues.value.length == 1) {
    modalVisibility.value = false;
    handleClickCamera(true)
  } else {
    const arr = uniqBy(itemRef.value.value as ImageInfo[], 'filename')
    itemRef.value.value = arr.filter((img) => {
      return img != image
    })
    camStore.setCurrent(itemRef.value.key)
    camStore.clearCurrent()
    await updateDateToBE()
    // console.log(itemRef.value.value.length);
    if (itemRef.value.value.length == 0) handleHideModal()
  }
}

const updateDateToBE = async () => {
  const taskParam = {
    keyValue: taskPropsItem.value!.key,
    propertyParams: [
      {
        propertyName: 'updatedBy',
        propertyValue: JSON.stringify(store.employee)
      },
      {
        propertyName: 'updatedDate',
        propertyValue: AESTCurrentDateTime()
      },
    ]
  }

  if (itemRef.value.isTaskValue) {
    taskParam.propertyParams.push({
      propertyName: 'taskValue',
      propertyValue: JSON.stringify(itemRef.value.value)
    })
  }

  const payload: UpdateParam[] = [
    {
      keyValue: itemRef.value.key,
      propertyParams: [
        {
          propertyName: 'value',
          propertyValue: JSON.stringify(itemRef.value.value)
        },
        {
          propertyName: 'updatedBy',
          propertyValue: JSON.stringify(store.employee)
        },
        {
          propertyName: 'updatedDate',
          propertyValue: AESTCurrentDateTime()
        },
      ]
    },
  ]
  if (!isUndefined(itemRef.value.isTaskValue) && itemRef.value.isTaskValue) {
    payload.push(taskParam)
  }
  const bindingKey = bindingKeyGeneratorServiceSheet(props.task as Task)
  if (!isOfflineOrSlowInternetConnection()) {
    const offlinePayload = {
      taskKey: props.task?.key,
      targetItem: itemRef.value.key,
      bindingKey: bindingKey
    }
    store.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name, true, "", offlinePayload)
  } else {
    store.updateServiceSheetTaskOnLocalDB(payload, props.task!.key, props.item.key, false, bindingKey)
  }
}

const showTakeAnotherPicture = ref(false)

const onConfirmTakePhotoCancel = () => {
  showTakeAnotherPicture.value = false
}
const onConfirmTakeAnotherPhoto = () => {
  showTakeAnotherPicture.value = false
  if (camStore.isReplacementCamera && itemRef.value.value.length < 2) {
    takeAnotherPicture()
  } else {
    handleClickCamera(false, true)
  }
}

const handlePostData = async () => {
  showReplacementConfirmation.value = false
  if (itemRef.value.value == '') {
    itemRef.value.value = []
  }

  // this is array which will be always updated after taking/ uploading a pics
  let imagesInfosArr: ImageInfo[] = []
  if (imageObject.value) {
    imagesInfosArr = stringToImageInfoConvert(imageObject.value.ImageInfos)
  }
  // this is array which we will send to BE
  const riskAssesmentArrValArr = stringToImageInfoConvert(itemRef.value.value as string[])
  // get new captured/uploaded pics (will be > 1)
  const newItemArr = imagesInfosArr.filter((e) => {
    return !riskAssesmentArrValArr.includes(e)
  })
  itemRef.value.value = stringToImageInfoConvert(itemRef.value.value as string)
  if (camStore.IsFromActionDelete) {
    itemRef.value.value = newItemArr
  } else {
    // remove duplicate
    const finalValue = uniqBy([
      ...itemRef.value.value,
      ...newItemArr
    ], 'filename')
    itemRef.value.value = Array.from(finalValue)
  }
  const isReplacement = props.task?.rating == 'CAB_SIDE'
  camStore.setIsReplacementCamera(isReplacement);
  await updateDateToBE().then(() => {
    if (!camStore.isReplacementCamera) {
      showTakeAnotherPicture.value = true
    } else if (camStore.isReplacementCamera && itemRef.value.value.length < 2) {
      showReplacementConfirmation.value = true
    }
    setTimeout(() => {
      preview.value?.openFirstReRender()
    }, 2000)
    setTimeout(() => {
      preview.value?.openFirstReRender()
    }, 2000)
  })
  camStore.setReplacementPhotoLength(itemRef.value.value.length)
  camStore.setIsActionFromDelete(false)
}

const takeAnotherPicture = () => {
  camStore.setIsActionFromDelete(false)
  camStore.setShowCloseButton(false)
  camStore.toggleIsVisible(true, itemRef.value.key)
}

const isSubmited = computed(() => {
  return store.generalForm.status == 'Submited'
})

const readOnly = computed(() => {
  if (!props.generalSubmitted) return true
  // other fitter bisa change value camera
  let sameFitter = true
  let isDisabledByParamRatingDynamic = false
  let isHaveCBMParamRatingDynamic = false
  taskPropsItem.value!.items.every((itemTask) => {
    if (itemTask.categoryItemType == "paramRatingDynamic") {
      isHaveCBMParamRatingDynamic = true
      return false
    }
    return true
  })
  if (isHaveCBMParamRatingDynamic) {
    sameFitter = true

    taskPropsItem.value!.items.every((itemTask) => {
      if (
        itemTask.itemType == "dropDown" &&
        (itemTask.categoryItemType == "dropdownTool" || itemTask.categoryItemType == "dropdownToolDisc")
      ) {
        if (itemTask.value == "") {
          isDisabledByParamRatingDynamic = true
          return false;
        }
      }
      return true
    })
  }

  let isReplacementPhotoFulfilled = false
  if (props.task?.rating === "CAB_SIDE" && props.item.value.length === 2) {
    isReplacementPhotoFulfilled = true
  }
  return !sameFitter || isDisabledByParamRatingDynamic || isReplacementPhotoFulfilled || isSubmited.value
})

watch(imageObject, async (newVal, oldVal) => {
  if (!isUndefined(newVal) && newVal.ImageInfos.length > 0) {
    if (newVal.ImageInfos.length != oldVal?.ImageInfos.length) {
      await handlePostData()
    } else if (camStore.IsFromActionDelete) {
      // else new val & oldval length sama (biasa triggernya karena delete foto)
      // check isi -> if sama ga perlu trigger tp klo beda trigger

      if (!isEqual(newVal, oldVal)) {
        await handlePostData()
      }
    }
  }
}, { deep: true })

const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2"
  if (!isUndefined(props.task!.updatedBy!.name) && props.task!.updatedBy!.name) paddingBottom = ''
  return paddingBottom
})
</script>
