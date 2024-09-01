<template>
  <div ref="defectDetailRef">
    <DefectInformationHeader />
    <DefectSMUPanel :view-only="true" />
    <DefectPanel :view-only="true" :supervisor="true" :fitter-id="JSON.stringify(eformStore.employee)"
      :view-is-download="isClose" title="Repairs Completed" />
    <DefectPanel :view-only="true" :supervisor="true" :fitter-id="JSON.stringify(eformStore.employee)"
      :view-is-download="isClose"  title="Further Action Required"/>
    <DefectPanelGeneric :view-only="true" :supervisor="true" :fitter-id="JSON.stringify(eformStore.employee)"
      :asset-number="eformStore.stateUnitNumber" :form="eformStore.generalForm.modelId"
      :workorder="eformStore.generalForm.workOrder" :disable-add-generic="true" :view-is-download="isClose" title="Repairs Completed" />
    <DefectPanelGeneric :view-only="true" :supervisor="true" :fitter-id="JSON.stringify(eformStore.employee)"
      :asset-number="eformStore.stateUnitNumber" :form="eformStore.generalForm.modelId"
      :workorder="eformStore.generalForm.workOrder" :disable-add-generic="true" :view-is-download="isClose"  title="Further Action Required" />
    <CrackPanel :view-only="true" :supervisor="true" :fitter-id="JSON.stringify(eformStore.employee)"
      :view-is-download="isClose" title="Repairs Completed" />
    <CrackPanel :view-only="true" :supervisor="true" :fitter-id="JSON.stringify(eformStore.employee)"
      :view-is-download="isClose"  title="Further Action Required" />
    <CBMPanel :headers="dataUse.CBMHeaders" :is-disabled="true"
      :defect-status="previewStore.generalForm.defectStatus" />
    <NAPanel :is-disabled="true" :title="'Not Applicable Item Check'" :headers="dataUse.DefectNAHeaders"
      :is-defect="true" />
    <NAPanel :is-disabled="true" :title="'Not Applicable Crack Check'" :headers="dataUse.CrackNAHeaders"
      :is-defect="false" />
    <CommentPanel :headers="dataComments" />
  </div>
  <PDFViewerDialog :show="previewPDF" @handle-close-modal="closePDF" :blob-url="pdfBlobUrl" />
  <InformationPopUp :show="showPrintPopUp" @close="changePrintPopUpStatus"
    :title-pop-up="'if required, see your supervisor to print this'" />
</template>
<script lang="ts" setup>
import DefectInformationHeader from "@/views/dma/components/defects/DefectInformationHeader.vue";
import DefectSMUPanel from "@/views/dma/components/defects/DefectSMUPanel.vue";
import DefectPanel from '@/views/dma/components/defects/DefectPanel.vue'
import CrackPanel from '@/views/dma/components/defects/CrackPanel.vue'
import CBMPanel from '@/views/dma/components/defects/CBMPanel.vue'
import NAPanel from '@/views/dma/components/defects/NAPanel.vue'
import CommentPanel from "@/views/dma/components/defects/CommentPanel.vue"
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
import { Comment } from '@/core/types/entities/dma/defects/Comment'
import {
  usePreviewFormStore
} from '@/store/pinia/dma/preview-form/usePreviewFormStore'

const store = useDefectsStore()
const eformStore = useEFormStore()
const previewStore = usePreviewFormStore()

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
  isClose: {
    required: false,
    type: Boolean,
    default: false
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

const attachmentClickHandler = (className: string, shouldChangePrintPopUp: boolean) => {
  try {
    const elements: HTMLAnchorElement[] | undefined = Array.from(
      defectDetailRef.value?.getElementsByClassName(className),
    )
    if (!elements) return
    elements.forEach((element) => {
      element.onclick = (event) => {
        event.preventDefault();
        previewPDF.value = true;
        pdfBlobUrl.value = element.href;
        if (shouldChangePrintPopUp) {
          changePrintPopUpStatus(true);
        }
      };
    });
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  console.log('employee', previewStore, eformStore)
  attachmentClickHandler("show-pdf", false)
  attachmentClickHandler("spv-print-pdf", true)
})

const closePDF = () => {
  previewPDF.value = false
}
</script>
