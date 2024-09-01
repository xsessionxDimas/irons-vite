<template>
    <div ref="defectDetailRef">
        <CBMPanel :headers="dataUse.CBMHeaders" />
        <NAPanel :is-disabled="true" :title="'Not Applicable Item Check'" :headers="dataUse.DefectNAHeaders" :is-defect="true" />
        <CommentPanel :headers="dataComments" />
    </div>
    <PDFViewerDialog :show="previewPDF" @handle-close-modal="closePDF" :blob-url="pdfBlobUrl" />
    <InformationPopUp :show="showPrintPopUp" @close="changePrintPopUpStatus"
        :title-pop-up="'if required, see your supervisor to print this'" />
</template>
<script lang="ts" setup>
import CBMPanel from '@/views/dma/components/defects/interim-engine-service/CBMPanel.vue'
import NAPanel from '@/views/dma/components/defects/interim-engine-service/NAPanel.vue'
import CommentPanel from "@/views/dma/components/defects/CommentPanel.vue"
import {
  useInterimDefectsStore
} from "@/store/pinia/dma/interim-engine-service/defects/useInterimDefectsStore"
import { onMounted, ref } from 'vue';
import {
  defineProps,
  computed,
  PropType
} from 'vue';
import PDFViewerDialog from '@/components/e-form/PDFViewerDialog.vue';
import InformationPopUp from '@/components/dialog/InformationPopUp.vue';
import { Comment } from '@/core/types/entities/dma/defects/Comment'

const store = useInterimDefectsStore();

const defectDetailRef = ref(null) as any
const pdfBlobUrl = ref('')
const previewPDF = ref(false)
const showPrintPopUp = ref(false)

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default() {
      return null
    }
  },
  comments: {
    type: [] as PropType<Comment[] | null>,
    required: false,
    default: null
  }
});

const dataUse = computed(() => {
  if (props.data) {
    return props.data
  }
  return store.ApprovalData
})

const dataComments = computed(() => {
  if (props.comments) {
    return props.comments
  }
  return store.Comments
})

const changePrintPopUpStatus = (status) => {
  showPrintPopUp.value = status
}

onMounted(() => {
  try {
    const showPDFArr = Array.from(defectDetailRef.value!.getElementsByClassName('show-pdf')) as HTMLAnchorElement[]
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

  try {
    const spvPrintPDFArr = Array.from(defectDetailRef.value!.getElementsByClassName('spv-print-pdf')) as HTMLAnchorElement[]
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

const closePDF = () => {
  previewPDF.value = false
}
</script>
