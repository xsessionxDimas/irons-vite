<template>
    <div :class="[widthStyle, textAlign, potraitWidthStyle, paddingBottomCondition]" class="px-2 pt-2" :style="style">
      <template v-if="!isUndefined(item.style) && item.style.visibility != 'hidden'">
        <span ref="html" v-html="content" :style="labelStyle"></span>
      </template>
    </div>

    <PDFViewerDialog :show="previewPDF" @handle-close-modal="closePDF" :blob-url="pdfBlobUrl"/>
    <InformationPopUp :show="showPrintPopUp" @close="changePrintPopUpStatus" :title-pop-up="'if required, see your supervisor to print this'"/>
  </template>

<script lang="ts" setup>
import { Item } from '@/core/types/generate-service-sheet/Item';
import { Task } from '@/core/types/generate-service-sheet/Task';
import { isUndefined, isEqual, last } from 'lodash';
import {
  defineProps,
  PropType,
  toRef,
  computed,
  onMounted,
  ref
} from 'vue'

import PDFViewerDialog from '@/components/e-form/PDFViewerDialog.vue'
import InformationPopUp from '@/components/dialog/InformationPopUp.vue';
import { addSpanOnHyphen } from '@/core/helpers/manipulate-html-string';


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
const html = ref(null) as any
const pdfBlobUrl = ref('')

const content = computed(() => {
  return addSpanOnHyphen(props.item.value)?.replaceAll('{BLOB_URL}', process.env.VUE_APP_BASE_URL_VERSIONING_DIGITAL)
})

const widthStyle = computed(() => {
  if (props.generalStyle) {
    return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col";
  }
  return ''
})

const textAlign = computed(() => {
  if (!isUndefined(itemRef.value.style)) {
    if (itemRef.value.style.textAlign == 'left') {
      return 'text-start';
    } else if (itemRef.value.style.textAlign == 'right') {
      return 'text-end'
    } else {
      return 'text-center'
    }
  } else {
    return '';
  }
})

const style = computed(() => {
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; ` : ""
  const fontColor = !isUndefined(itemRef.value.style) && itemRef.value.style.fontColor != 'none' ? `color: ${itemRef.value.style.fontColor}; ` : ""
  const borderTop = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.top != 'none' ? `border-top: ${itemRef.value.style.border.top}; ` : ""
  const borderRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.right != 'none' ? `border-right: ${itemRef.value.style.border.right}; ` : ""
  let borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
  // get total col for border bottom (if 12 this means full table and the border bottom must be below timestamp)
  // otherwise border bottom must be below item
  let totalCol = 0;
  (props.task?.items as Item[]).forEach((item) => {
    if (!isUndefined(item.style)) {
      if (!isUndefined(item.style.border)) {
        if (item.style.border.right == 'none' || isUndefined(item.style.border.right)) {
          totalCol = totalCol + Number(item.style.breakPoint)
        }
        if (isEqual(item, last(props.task?.items as Item[]))) {
          totalCol = totalCol + Number(item.style.breakPoint)
        }
      } else if (isUndefined(item.style.border)) {
        totalCol = totalCol + Number(item.style.breakPoint)
      }
    }
  })
  if (totalCol == 12) {
    borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
  }
  const borderLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.left != 'none' ? `border-left: ${itemRef.value.style.border.left}; ` : ""
  const borderRadiusTopRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topRight != 'none' ? `border-top-right-radius: ${itemRef.value.style.borderRadius.topRight}; ` : ""
  const borderRadiusBottomRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomRight != 'none' ? `border-bottom-right-radius: ${itemRef.value.style.borderRadius.bottomRight}; ` : ""
  const borderRadiusTopLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topLeft != 'none' ? `border-top-left-radius: ${itemRef.value.style.borderRadius.topLeft}; ` : ""
  const borderRadiusBottomLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomLeft != 'none' ? `border-bottom-left-radius: ${itemRef.value.style.borderRadius.bottomLeft}; ` : ""
  return `${backGroundColor}${fontColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
})

const labelStyle = computed(() => {
  const fontWeight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.fontWeight) && itemRef.value.style.fontWeight != 'normal' ? `font-weight: ${itemRef.value.style.fontWeight}; ` : ""
  return `${fontWeight}`
})

const showPrintPopUp = ref(false)
const changePrintPopUpStatus = (status) => {
  showPrintPopUp.value = status
}

const potraitWidthStyle = computed(() => {
  let customClass = ''
  if (props.generalStyle) {
    const hasStyle = !isUndefined(itemRef.value.style)
    if (hasStyle) {
      customClass = `col-md-${itemRef.value.style.potraitBreakPoint}`
      customClass = `${customClass} col-lg-${itemRef.value.style.breakPoint}`
    }
  }
  return customClass
})

onMounted(() => {
  try {
    const showPDFArr = Array.from(html.value!.getElementsByClassName('show-pdf')) as unknown as HTMLAnchorElement[]
    showPDFArr.forEach((element) => {
      element.onclick = (event) => {
        event.preventDefault()
        previewPDF.value = true
        pdfBlobUrl.value = element.href
      }
    });
  } catch (error) {
    console.log(error);
  }

  // also showing pop up to print the pdf to supervisor
  try {
    const spvPrintPDFArr = Array.from(html.value!.getElementsByClassName('spv-print-pdf')) as unknown as HTMLAnchorElement[]
    spvPrintPDFArr.forEach((element) => {
      element.onclick = (event) => {
        event.preventDefault()
        previewPDF.value = true
        pdfBlobUrl.value = element.href
        changePrintPopUpStatus(true)
      }
    });
  } catch (error) {
    console.log(error);
  }
})

// show pdf
const previewPDF = ref(false)
const closePDF = () => {
  previewPDF.value = false
}
// show pdf end
const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2"
  return paddingBottom
})
</script>

<style lang="scss">
.letter-space-hypen {
  letter-spacing: 1.5px;
}
</style>
