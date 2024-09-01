<template>
    <div ref="defectDetailRef" class="mb-3">
        <DefectInformationHeader />
        <DefectSMUPanel
          :view-only="true"
        />
        <DefectPanel :view-only="false" :is-form="true" :supervisor="true" :fitter-id="JSON.stringify(eformStore.employee)" @on-refresh-data="onRefreshData" @on-handle-pdf="handleShowPdf"
        title="Repairs Completed" />
        <DefectPanel :view-only="false" :is-form="true" :supervisor="true" :fitter-id="JSON.stringify(eformStore.employee)" @on-refresh-data="onRefreshData" @on-handle-pdf="handleShowPdf"
        title="Further Action Required"/>
        <DefectPanelGeneric :view-only="false" :is-form="true" :supervisor="true" :fitter-id="JSON.stringify(eformStore.employee)" @on-refresh-data="onRefreshData"
        :asset-number="eformStore.stateUnitNumber" :form="eformStore.generalForm.modelId" :workorder="eformStore.generalForm.workOrder"
        :disable-add-generic="eformStore.generalForm.status == 'Submited'" title="Repairs Completed" />
        <DefectPanelGeneric :view-only="false" :is-form="true" :supervisor="true" :fitter-id="JSON.stringify(eformStore.employee)" @on-refresh-data="onRefreshData"
        :asset-number="eformStore.stateUnitNumber" :form="eformStore.generalForm.modelId" :workorder="eformStore.generalForm.workOrder"
        :disable-add-generic="eformStore.generalForm.status == 'Submited'" title="Further Action Required" />
        <CrackPanel :view-only="false"  :is-form="true" :supervisor="true" :fitter-id="JSON.stringify(eformStore.employee)" @on-refresh-data="onRefreshData"
        title="Repairs Completed"/>
        <CrackPanel :view-only="false"  :is-form="true" :supervisor="true" :fitter-id="JSON.stringify(eformStore.employee)" @on-refresh-data="onRefreshData"
        title="Further Action Required"/>
        <CBMPanel :headers="dataUse.CBMHeaders" :defect-status="eformStore.generalForm.defectStatus" />
        <NAPanel :title="'Not Applicable Item Check'" :headers="dataUse.DefectNAHeaders" :is-defect="true" />
        <NAPanel :planner-approve="false" :title="'Not Applicable Crack Check'" :headers="dataUse.CrackNAHeaders"
            :is-defect="false" />
      <CommentPanel :headers="dataComments" />
    </div>
    <PDFViewerDialog :show="previewPDF" @handle-close-modal="closePDF" :blob-url="pdfBlobUrl" />
    <InformationPopUp :show="showPrintPopUp" @close="changePrintPopUpStatus"
        :title-pop-up="'if required, see your supervisor to print this'" />
</template>
<script lang="ts" setup>
import DefectInformationHeader from "@/views/dma/components/defects/DefectInformationHeader.vue";
import DefectSMUPanel from "@/views/dma/components/defects/offline/DefectSMUPanel.vue";
import DefectPanel from '@/views/dma/components/defects/offline/DefectPanel.vue'
import CrackPanel from '@/views/dma/components/defects/offline/CrackPanel.vue'
import CBMPanel from '@/views/dma/components/defects/offline/CBMPanel.vue'
import NAPanel from '@/views/dma/components/defects/offline/NAPanel.vue'
import {
  useDefectsStore
} from "@/store/pinia/dma/e-form-offline/defects/useDefectsStore"
import { PropType, onMounted, ref } from 'vue';
import {
  defineProps,
  computed,
} from 'vue';
import PDFViewerDialog from '@/components/e-form/OfflinePDFViewerDialog.vue';
import InformationPopUp from '@/components/dialog/InformationPopUp.vue';
import {
  useEFormStore
} from '@/store/pinia/dma/e-form-offline/useEFormStore'
import { ElLoading } from 'element-plus'
import CommentPanel from "@/views/dma/components/defects/CommentPanel.vue"
import { Comment } from '@/core/types/entities/dma/defects/Comment'
import DefectPanelGeneric from '@/views/dma/components/defects/offline/DefectPanelGeneric.vue'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form-offline/defects/useDefectsFormStore";

const store = useDefectsStore();
const eformStore = useEFormStore()
const defectFormStore = useDefectsFormStore()

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
  if (!isOfflineOrSlowInternetConnection()) {
    const isOfflineTaskPending = await eformStore.checkCurrentWoPendingOfflineTask()
    if (isOfflineTaskPending) {
      await store.getDefectFromLocalDB(eformStore.generalForm.workOrder)
      await eformStore.updateTaskProgressOnLocalDB2()
    } else {
      await store.getDefectsData(eformStore.generalForm.workOrder)
      eformStore.getTaskProgress()
      await store.saveDefectServiceFormToLocalDB(eformStore.generalForm.workOrder)
    }
  } else {
    await store.getDefectFromLocalDB(eformStore.generalForm.workOrder)
    await eformStore.updateTaskProgressOnLocalDB2()
  }
  loader.close()
}

const handleShowPdf = () => {
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
}

onMounted(async () => {
  handleShowPdf()
  await defectFormStore.getPartReference(eformStore.stateGeneralForm.equipment);
})

const closePDF = () => {
  previewPDF.value = false
}
</script>
