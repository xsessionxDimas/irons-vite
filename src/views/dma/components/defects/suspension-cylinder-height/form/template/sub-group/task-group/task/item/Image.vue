<template>
  <div :class="[widthStyle, potraitWidthStyle, paddingBottomCondition]" class="pt-2 px-2 d-flex d-flex justify-content-center prevent-split" :style="style" v-loading="loading">
    <img :src="image" class="img-fluid" :style="imageStyle"/>
  </div>
</template>

<script lang="ts" setup>
import ApiService from '@/core/services/ApiService';
import { Item } from '@/core/types/entities/dma/e-form/Item';
import { Task } from '@/core/types/entities/dma/e-form/Task';
import { computed } from '@vue/reactivity';
import { AxiosResponse } from 'axios';
import { isUndefined, isEqual, last } from 'lodash';
import {
  defineProps,
  onBeforeMount,
  PropType,
  toRef,
  ref
} from 'vue'

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

const image = ref<string>('/media/svg/dma/warning.svg')
const loading = ref<boolean>(true)

const itemRef = toRef(props, 'item')

const widthStyle = computed(() => {
  return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col"
});

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
      borderBottom = !props.task!.updatedBy?.name && !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem; ` : ""
    }
  }
  const borderLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.left != 'none' ? `border-left: ${itemRef.value.style.border.left}; ` : ""

  const borderRadiusTopRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topRight != 'none' ? `border-top-right-radius: ${itemRef.value.style.borderRadius.topRight}; ` : ""
  const borderRadiusBottomRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomRight != 'none' ? `border-bottom-right-radius: ${itemRef.value.style.borderRadius.bottomRight}; ` : ""
  const borderRadiusTopLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topLeft != 'none' ? `border-top-left-radius: ${itemRef.value.style.borderRadius.topLeft}; ` : ""
  const borderRadiusBottomLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomLeft != 'none' ? `border-bottom-left-radius: ${itemRef.value.style.borderRadius.bottomLeft}; ` : ""

  return `${backGroundColor}${fontColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
})

const imageStyle = computed(() => {
  if (!isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint == '1') {
    return 'width: 20px; height: 20px'
  }
  return ''
})

onBeforeMount(async () => {
  const params = {
    id: itemRef.value.value.toString(),
    ver: 'v1',
  }
  try {
    const GET_IMAGE_API_URL = `${process.env.VUE_APP_BASE_URL_DIGITAL}/utility/api/master_attachment/download_by_id`
    const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL, "", new URLSearchParams(params).toString())
    const buffer = response.data;
    const blob = new Blob([buffer]);
    const urlCreator = window.URL || window.webkitURL
    image.value = urlCreator.createObjectURL(blob)
    loading.value = false
  } catch (error) {
    loading.value = false
  }
})

const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2"
  if (!isUndefined(props.task!.updatedBy!.name) && props.task!.updatedBy!.name) paddingBottom = ''
  return paddingBottom
})
</script>
