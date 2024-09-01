<template>
  <el-dialog v-model='isVisible' title='Detailed Document' width='80%' custom-class="el-defect-crack-form-custom multi-defect-list-dialog"
    @close='closePDFPreview'>
    <div class="multi-defect-list-item py-2 d-flex align-items-center justify-content-between" v-for="(file) in files" :key="file.filename">
      <div class="d-flex">
        <div class="multi-icon cursor-pointer" @click="showPDFModal(file.url)">
          <img src="/media/svg/dma/attachment/pdf.png" alt="pdf" class="d-icon pdf" style="vertical-align: -1px;width:13px;" />
        </div>
        <div class="multi-description cursor-pointer" @click="showPDFModal(file.url)">
          <span style="white-space: pre-wrap;" class="pdf">{{ file.filename }}</span>
        </div>
      </div>
      <div class="multi-icon cursor-pointer" @click="onDeletePDF(file.url)" v-if="deleteButtonVisibility">
        <img src="/media/svg/dma/image-close-button-red.png" alt="close" class="d-icon pdf" style="vertical-align: -2px; width: 15px;" />
      </div>
    </div>
  </el-dialog>
  <Confirmation :visibility='isConfirmVisible' caption='Are you sure want to delete this PDF?'
    @on-no-confirm='cancelDelete'
    @on-yes-confirm='confirmDelete' />
  <PDFViewerDialog :show="previewPDF" @handle-close-modal="closePDF" :blob-url="pdfBlobUrl"/>
</template>

<script lang='ts' setup>
import {
  toRef,
  defineProps,
  defineEmits,
  PropType,
  ref,
  computed
} from 'vue'
import PDFViewerDialog from "./PDFViewerDialog.vue"
import Confirmation from '@/components/dialog/Confirmation.vue'
import { FileInfo } from "@/core/types/entities/dma/FileInfo";
import { cloneDeep } from 'lodash';

const props = defineProps({
  visibility: {
    type: Boolean,
    required: false,
  },
  files: {
    type: Array as PropType<FileInfo[]>,
    required: true
  },
  showDeleteButton: {
    type: Boolean,
    required: true,
    default: true
  },
  isMonitoring: {
    type: Boolean,
    default: false
  },
})

const emits = defineEmits(['onClose', 'onChangeAttachment', 'onDownloaded'])

// show pdf
const previewPDF = ref(false)
const pdfBlobUrl = ref('')

const closePDF = () => {
  previewPDF.value = false
}

const itemRef = toRef(props, 'files')

const isVisible = toRef(props, 'visibility')
const isConfirmVisible = ref(false)
const selectedPDF = ref("")

const deleteButtonVisibility = computed(() => {
  let isVisible = false
  if (props.showDeleteButton) {
    isVisible = true
  }
  if (props.isMonitoring) {
    // always hide
    isVisible = false
  }
  return isVisible
})

const showPDFModal = (url) => {
  pdfBlobUrl.value = url
  previewPDF.value = true
}

const closePDFPreview = () => {
  isVisible.value = false
  emits('onClose')
}

const onDeletePDF = (url: string) => {
  isConfirmVisible.value = true
  selectedPDF.value = url
}
const cancelDelete = () => {
  isConfirmVisible.value = false
}
const confirmDelete = () => {
  isConfirmVisible.value = false
  const filteredAttacthment = cloneDeep(itemRef.value).filter((pdf) => {
    return pdf.url != selectedPDF.value
  })
  emits('onChangeAttachment', filteredAttacthment)
  if (filteredAttacthment.length == 0) closePDFPreview()
  selectedPDF.value = ''
}
</script>

<style lang='scss'>
.delete-image-button {
  position: absolute;
  height: 24px;
  width: 24px;
  top: 5%;
  right: 5%;

  :hover {
    cursor: pointer;
  }
}
</style>
<style lang="scss" scoped>
@import "@/assets/sass/pages/icon-list.dialog.scss";
</style>
