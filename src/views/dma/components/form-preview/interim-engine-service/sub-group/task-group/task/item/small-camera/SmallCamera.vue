<template>
  <div :class="[widthStyle, potraitWidthStyle, paddingBottomCondition]" :style="style" class="pt-2">
    <div class="row" :class="!isUndefined(itemRef.value) && itemRef.value.length > 0 ? 'justify-content-around' : 'justify-content-center'">
      <div class="d-flex justify-content-center" :class="!isUndefined(itemRef.value) && itemRef.value.length > 0 ? 'col-6 pe-0 ps-1' : 'col-6 px-0'">
        <button class="btn btn-sm btn-icon btn-bg-light" @click="handleClickCamera" :disabled="true">
          <img :src="cameraColor()" style="height: 12px; width: 14px;" alt="photo">
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
    <ImagePreview
      :type="'task'"
      :re-render="false"
      :images="imageValues"
      :show-delete-button="false"
      :is-mandatory="false"
      :visibility="modalVisibility"
      :is-monitoring="true"
      :show-mandatory-caption="false"
      @on-close="handleHideModal" />
  </div>
</template>

<script lang="ts" setup>
import { Item } from '@/core/types/entities/dma/e-form/Item';
import { Task } from '@/core/types/entities/dma/e-form/Task';
import { computed } from '@vue/reactivity';
import {
  isUndefined,
  cloneDeep,
  isEqual,
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
import { ImageObject } from '@/core/types/entities/dma/ImageObject';
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo';
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter';
import { Audit } from '@/core/types/intervention/Audit';

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

const cameraColor = () => {
  let camera = "/media/svg/dma/camera/e-form/png/cam-read.png"
  return camera
}

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
}

const imageObject = computed(() => {
  return cloneDeep(camStore.ImageObjects.find((i) => {
    return i.Id === itemRef.value.key;
  }));
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
  let borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; ` : ""
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

const handlePostData = async () => {
  if (itemRef.value.value == '') {
    itemRef.value.value = []
  }
  if (imageObject.value) {
    imageObject.value.ImageInfos = stringToImageInfoConvert(imageObject.value.ImageInfos)
    itemRef.value.value = stringToImageInfoConvert(itemRef.value.value)
    const lastImage = last(imageObject.value.ImageInfos);
    if (lastImage) itemRef.value.value.push(lastImage);
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
    {
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
    },
  ]
  store.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name)
}

watch(imageObject, async (newVal, oldVal) => {
  if (!isUndefined(newVal) && newVal.ImageInfos.length > 0) {
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
