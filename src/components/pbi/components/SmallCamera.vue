<template>
  <div :class="[widthStyle, potraitWidthStyle, paddingBottomCondition]" :style="style" class="pt-2">
    <div class="row" :class="!isUndefined(itemRef.value) && itemRef.value.length > 0 ? 'justify-content-around' : 'justify-content-center'">
      <div class="d-flex justify-content-center" :class="!isUndefined(itemRef.value) && itemRef.value.length > 0 ? 'col-6 pe-0 ps-1' : 'col-6 px-0'">
        <button class="btn btn-sm btn-icon btn-bg-light" @click="handleClickCamera" :disabled="readOnly">
          <img :src="cameraColor()" style="height: 12px; width: 14px;" alt="camera">
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
      <ImagePreview
      :type="'task'"
      :re-render="false"
      :images="imageValues"
      :show-delete-button="showDeleteButtonCondition"
      :is-mandatory="true"
      :visibility="modalVisibility"
      :is-monitoring="!showDeleteButtonCondition"
      :show-mandatory-caption="true"
      @on-close="handleHideModal"
      @on-delete="deleteImage" />
    </template>
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
  last
} from 'lodash';
import {
  defineProps,
  PropType,
  toRef,
  ref,
  watch,
} from 'vue'
import ImagePreview from '@/components/camera/ImagePreview.vue'
import { useEFormStore } from "@/store/pinia/dma/e-form/useEFormStore";
import { useCameraStore } from '@/store/pinia/application/useCameraStore';
import {
  UpdateParam
} from '@/core/types/entities/dma/e-form/update-data/updateParam';
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore';
import Confirmation from '@/components/dialog/CameraConfirmation.vue';
import { Audit } from '@/core/types/intervention/Audit';
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter';
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo';

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
});

const itemRef = toRef(props, 'item')
const modalVisibility = ref<boolean>(false);
const taskPropsItem = toRef(props, 'task')
const store = useEFormStore()
const camStore = useCameraStore()
const authStore = useAuthenticationStore()

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
      customClass = `col-md-${itemRef.value.style.potraitBreakPoint} col-lg-${itemRef.value.style.breakPoint}`
    }
  }
  return customClass
})

const imageValues = computed(() => {
  if (!itemRef.value.value) return [] as ImageInfo[]
  return stringToImageInfoConvert(itemRef.value.value)
})

const handleClickCamera = () => {
  camStore.toggleIsVisible(true, itemRef.value.key)
  camStore.setShowCloseButton(true)
}

const imageObject = computed(() => {
  return cloneDeep(camStore.ImageObjects.find((i) => {
    return i.Id === itemRef.value.key;
  }));
})

const cameraColor = () => {
  // belum ada yang take pic
  let camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
  // user yang take pic
  if (props.task?.updatedBy && itemRef.value.updatedBy) {
    if ((props.task.updatedBy as Audit).id == store.employee.id) {
      if (imageValues.value.length > 0) {
        camera = "/media/svg/dma/camera/e-form/png/cam-user.png"
      }
    } else {
      // user selain yang take pic
      camera = "/media/svg/dma/camera/e-form/png/cam-read.png"
    }
  }
  return camera
}

const showDeleteButtonCondition = computed(() => {
  let cameraMandatory = false
  if (imageValues.value.length == 1) cameraMandatory = true
  return !readOnly.value && !cameraMandatory
})

const handleShowModal = () => {
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
  if (!isUndefined(props.task?.isShowAdjustmentRow) && props.task?.isShowAdjustmentRow) {
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

const deleteImage = async (filename: string) => {
  itemRef.value.value = stringToImageInfoConvert(itemRef.value.value)
  const arr = itemRef.value.value
  itemRef.value.value = arr.filter((img) => {
    return img.filename != filename
  })
  camStore.setCurrent(itemRef.value.key)
  await updateDateToBE()
  if (itemRef.value.value.length == 0) handleHideModal()
  camStore.clearCurrent()
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
        propertyValue: '<<ServerDateTime>>'
      },
    ]
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
          propertyValue: '<<ServerDateTime>>'
        },
      ]
    },
  ]
  if (!isUndefined(itemRef.value.isTaskValue) && itemRef.value.isTaskValue) {
    payload.push(taskParam)
  }
  store.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name)
}

const showTakeAnotherPicture = ref(false)

const onConfirmTakePhotoCancel = () => {
  showTakeAnotherPicture.value = false
}
const onConfirmTakeAnotherPhoto = () => {
  showTakeAnotherPicture.value = false
  camStore.setShowCloseButton(true)
  handleClickCamera()
}

const handlePostData = async () => {
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
  itemRef.value.value = [
    ...itemRef.value.value,
    ...newItemArr
  ]
  await updateDateToBE()
  showTakeAnotherPicture.value = true
}

const readOnly = computed(() => {
  let sameFitter = true
  if (taskPropsItem.value?.updatedBy) {
    if (store.employee.id != (taskPropsItem.value.updatedBy as Audit).id) {
      sameFitter = false
    }
  }
  return !sameFitter
})

watch(imageObject, async (newVal, oldVal) => {
  if (newVal && newVal.ImageInfos.length > 0) {
    if (newVal.ImageInfos.length != oldVal?.ImageInfos.length) {
      await handlePostData()
    }
  }
}, { deep: true })

const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2"
  if (props.task?.updatedBy && (props.task.updatedBy as Audit).name) paddingBottom = ''
  return paddingBottom
})
</script>
