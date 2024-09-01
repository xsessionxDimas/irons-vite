<template>
    <div ref="defectDetailRef">
        <DefectPanel :view-only="false" :supervisor="true" :fitter-id="JSON.stringify(eformStore.employee)" @on-refresh-data="onRefreshData" />
        <DefectPanelGeneric :view-only="false" :supervisor="true" :fitter-id="JSON.stringify(eformStore.employee)" @on-refresh-data="onRefreshData" :asset-number="eformStore.stateUnitNumber" :form="eformStore.generalForm.modelId" :workorder="eformStore.generalForm.workOrder" :disable-add-generic="eformStore.generalForm.status == 'Submited'" />
        <CrackPanel :view-only="false"  :supervisor="true" :fitter-id="JSON.stringify(eformStore.employee)" @on-refresh-data="onRefreshData"/>
        <CBMPanel :headers="dataUse.CBMHeaders" />
        <NAPanel :is-disabled="true" :planner-approve="false" :title="'Not Applicable Item Check'" :headers="dataUse.DefectNAHeaders" :is-defect="true" />
        <NAPanel :is-disabled="true" :planner-approve="false" :title="'Not Applicable Crack Check'" :headers="dataUse.CrackNAHeaders"
            :is-defect="false" />
        <CommentPanel :headers="dataComments" />
    </div>
    <PDFViewerDialog :show="previewPDF" @handle-close-modal="closePDF" :blob-url="pdfBlobUrl" />
    <InformationPopUp :show="showPrintPopUp" @close="changePrintPopUpStatus"
        :title-pop-up="'if required, see your supervisor to print this'" />
</template>
<script lang="ts" setup>
import DefectPanel from '@/views/dma/components/defects/DefectPanel.vue'
import CrackPanel from '@/views/dma/components/defects/CrackPanel.vue'
import CBMPanel from '@/views/dma/components/defects/CBMPanel.vue'
import NAPanel from '@/views/dma/components/defects/NAPanel.vue'
import DefectPanelGeneric from '@/views/dma/components/defects/DefectPanelGeneric.vue'
import {
  useDefectsStore
} from "@/store/pinia/dma/e-form/defects/useDefectsStore"
import { onMounted, ref } from 'vue';
import {
  defineProps,
  computed,
  PropType
} from 'vue';
import PDFViewerDialog from '@/components/e-form/PDFViewerDialog.vue';
import InformationPopUp from '@/components/dialog/InformationPopUp.vue';
import {
  useEFormStore
} from '@/store/pinia/dma/e-form/useEFormStore'
import { ElLoading } from 'element-plus'
import CommentPanel from "@/views/dma/components/defects/CommentPanel.vue"
import { Comment } from '@/core/types/entities/dma/defects/Comment'

const store = useDefectsStore();
const eformStore = useEFormStore()

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
    return props.comments.slice().sort(compareComments);
  }
  return store.Comments.slice().sort(compareComments);
})

const compareComments = (a, b) => {
  const numA = parseInt(a.taskDesc.split(";;")[0]);
  const numB = parseInt(b.taskDesc.split(";;")[0]);
  return numA - numB;
}

const changePrintPopUpStatus = (status) => {
  showPrintPopUp.value = status
}
const onRefreshData = async () => {
  const loader = ElLoading.service({
    lock: true,
    text: 'Refresh Data...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  Promise.allSettled([
    store.getDefectsData(eformStore.generalForm.workOrder),
    eformStore.getTaskProgress()
  ]).finally(() => {
    loader.close()
  })
}

onMounted(() => {
  if (defectDetailRef.value) {
    try {
      const showPDFArr = Array.from(defectDetailRef.value.getElementsByClassName('show-pdf')) as HTMLAnchorElement[]
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
      const spvPrintPDFArr = Array.from(defectDetailRef.value.getElementsByClassName('spv-print-pdf')) as HTMLAnchorElement[]
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
  }
})

const closePDF = () => {
  previewPDF.value = false
}
</script>
