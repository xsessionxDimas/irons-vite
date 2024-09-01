<template>
    <div ref="defectDetailRef">
      <BackNavigator :title="`${defectSheetStore.SelectedDefectSheet?.form}`" component-router-push="defectsplanner"
      :approve-history="approvalHistory" />
      <DefectInformationHeader />
      <DefectSMUPanel
        :view-only="false"
        :planner-approve="true"
        :supervisor="false"
        @on-refresh-data="onRefreshData"
        @on-get-position-y="getPosition"
      />
      <DefectPanel :view-only="false" :supervisor="false" @on-refresh-data="onRefreshData" :planner-approve="true" :view-is-download="true" @on-get-position-y="getPosition"
      title="Repairs Completed"/>
      <DefectPanel :view-only="false" :supervisor="false" @on-refresh-data="onRefreshData" :planner-approve="true" :view-is-download="true" @on-get-position-y="getPosition"
      title="Further Action Required" />
      <DefectPanelGeneric :view-only="false" :supervisor="false" @on-refresh-data="onRefreshData" :planner-approve="true" :view-is-download="true" :disable-add-generic="true"
      title="Repairs Completed"/>
      <DefectPanelGeneric :view-only="false" :supervisor="false" @on-refresh-data="onRefreshData" :planner-approve="true" :view-is-download="true" :disable-add-generic="true" title="Further Action Required"/>
      <CrackPanel  :view-only="false" :supervisor="false" @on-refresh-data="onRefreshData" :planner-approve="true" :view-is-download="true" @on-get-position-y="getPosition" title="Repairs Completed" />
      <CrackPanel  :view-only="false" :supervisor="false" @on-refresh-data="onRefreshData" :planner-approve="true" :view-is-download="true" @on-get-position-y="getPosition" title="Further Action Required" />
      <SupervisorDefectPanel :headers="store.ApprovalData.DefectHeaders" :details="store.ApprovalData.DefectDetails" :view-only="false" :view-is-download="true" />
      <SupervisorDefectGenericPanel :view-only="true" @on-refresh-data="onRefreshData" :planner-approve="true" :view-is-download="true" :disable-add-generic="true" />
      <SupervisorCrackPanel :headers="store.ApprovalData.CrackHeaders" @on-refresh-data="onRefreshData" :details="store.ApprovalData.CrackDetails" :view-only="false" :view-is-download="true" />
      <CBMPanel
        :headers="store.ApprovalData.CBMHeaders"
        :planner-approve="true"
        @on-refresh-data="onRefreshData"
      />
      <NAPanel :title="'Not Applicable Item Check'" :headers="store.ApprovalData.DefectNAHeaders" :is-defect="true" :planner-approve="true" @on-refresh-data="onRefreshData" />
      <NAPanel :title="'Not Applicable Crack Check'" :headers="store.ApprovalData.CrackNAHeaders" :is-defect="false" :planner-approve="true" @on-refresh-data="onRefreshData" />
      <CommentPanel :headers="store.Comments" />
      <div class="p-2 py-5 d-flex justify-content-end mt-20 border-top border-top-2">
        <template v-if="store.ApprovalData.DefectHeaders.length == 0 && store.ApprovalData.CrackHeaders.length == 0 && store.ApprovalData.CrackNAHeaders.length == 0 && store.ApprovalData.DefectNAHeaders.length == 0 && store.ApprovalData.CBMHeaders.length == 0">
          <NoDefect message="Service sheet was completed in full and no issues were identified." />
        </template>
        <button class="btn btn-success" style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white"
          :disabled="!isDisabled"
          @click="onSave">Approve</button>
      </div>
    </div>
    <Cameras :visibility="camstore.isVisible" />
    <InformationPopUpSideButton
      :show="confirmVisible"
      @close="onCancel"
      :title-pop-up="'Please ensure you generate a PDF copy of the completed IronForms service sheet and attach it to the SAP work order.'"
      confirmLabel="Ok"
    />
    <MessageBox :show="messageBoxVisible" @close="onOk" message="Data successfully approved"/>
    <ErrorBox
    :visibility="errorMessageBoxVisible"
    :caption="defectSheetStore.Error"
    @on-close="onErrorOk" />
    <PDFViewerDialog :show="previewPDF" @handle-close-modal="closePDF" :blob-url="pdfBlobUrl"/>
    <InformationPopUp :show="showPrintPopUp" @close="changePrintPopUpStatus" :title-pop-up="'if required, see your supervisor to print this'"/>
    <Toast
      :visibility="isApprovalError"
      caption="You cannot approve this digital service sheet because another user already approved."
    />
    <InformationPopUp
      :show="isNetworkDisable"
      @close="closeNoNetworkDialog"
      :title-pop-up="'No internet connection'"/>
</template>

<script lang="ts" setup>
import Cameras from "@/components/camera/Cameras.vue"
import { useCameraStore } from "@/store/pinia/application/useCameraStore"
import DefectPanel from '@/views/dma/components/defects/DefectPanel.vue';
import CrackPanel from '@/views/dma/components/defects/CrackPanel.vue';
import CBMPanel from '@/views/dma/components/defects/CBMPanel.vue';
import NAPanel from '@/views/dma/components/defects/NAPanel.vue';
import SupervisorDefectPanel from "@/views/dma/components/defects/SupervisorDefectPanel.vue";
import SupervisorCrackPanel from "@/views/dma/components/defects/SupervisorCrackPanel.vue";
import CommentPanel from "@/views/dma/components/defects/CommentPanel.vue"
import {
  useDefectsStore
} from '@/store/pinia/dma/e-form/defects/useDefectsStore';
import {
  useDefectSheetStore
} from '@/store/pinia/dma/defect-approval/useDefectSheetStore';
import {
  onUnmounted,
  onMounted,
  computed,
  ref,
  onBeforeMount,
  watch
} from 'vue';
import { isEmpty } from "lodash"
import MessageBox from "@/components/dialog/MessageBox.vue";
import ErrorBox from '@/components/alert/ErrorBox.vue'
import { ElLoading } from 'element-plus';
import BackNavigator from "@/views/dma/defects-planner/BackNavigator.vue";
import { useEFormStore } from '@/store/pinia/dma/e-form/useEFormStore';
import PDFViewerDialog from '@/components/e-form/PDFViewerDialog.vue'
import InformationPopUp from '@/components/dialog/InformationPopUp.vue';
import { isUndefined } from "lodash"
import InformationPopUpSideButton from '@/components/dialog/InformationPopUpSideButton.vue'
import DefectInformationHeader from "@/views/dma/components/defects/DefectInformationHeader.vue";
import DefectSMUPanel from "@/views/dma/components/defects/DefectSMUPanel.vue";
import NoDefect from '@/components/dma/defect/NoDefect.vue'
import { useRouter } from "vue-router";
import {
  useMonitoringListStore
} from "@/store/pinia/dma/status-monitoring/useMonitoringListStore";
import {
  useDefectsFormStore
} from '@/store/pinia/dma/e-form/defects/useDefectsFormStore'
import DefectPanelGeneric from '@/views/dma/components/defects/DefectPanelGeneric.vue'
import SupervisorDefectGenericPanel from '@/views/dma/components/defects/SupervisorDefectGenericPanel.vue'
import Toast from '@/components/dialog/Toast.vue'
import {
  checkStatus,
  filterByPriority,
  validationNAApprovalPanel,
  validationPlannerApprovalPanel
} from "@/store/pinia/dma/e-form/helpers";
import {
  ApprovalErrorMessages,
  NoNetworkMessages
} from "@/store/enums/ErrorMessagesEnum"

const store = useDefectsStore();
const formStore = useEFormStore();
const defectSheetStore = useDefectSheetStore();
const monitoringStore = useMonitoringListStore();
const camstore = useCameraStore()
const defectStore = useDefectsFormStore();
const router = useRouter();

const messageBoxVisible = ref(false);
const errorMessageBoxVisible = ref(false);
const confirmVisible = ref(false);
const positionY = ref(0)

const isNetworkDisable = computed(() => {
  return store.stateErrorByNetwork
})

const isDisabled = computed(() => {
  const priorities = ["P1", "P2", "P3", "P4"];

  const defects = checkStatus(filterByPriority(store.ApprovalData.DefectHeaders.filter((item) => {
    return item.defectType != 'machineSMU'
  }), priorities));
  if (!defects) {
    return false;
  }

  const defectsGeneric = checkStatus(filterByPriority(store.ApprovalData.DefectGenericHeaders, priorities));
  if (!defectsGeneric) {
    return false;
  }

  const plannerDefects = validationPlannerApprovalPanel(filterByPriority(store.ApprovalData.DefectHeaders, priorities));
  if (!plannerDefects) {
    return false;
  }

  const genericPlannerDefects = validationPlannerApprovalPanel(filterByPriority(store.ApprovalData.DefectGenericHeaders, priorities));
  if (!genericPlannerDefects) {
    return false;
  }

  const cracks = checkStatus(filterByPriority(store.ApprovalData.CrackHeaders, priorities));
  if (!cracks) {
    return false;
  }

  const plannerCracks = validationPlannerApprovalPanel(filterByPriority(store.ApprovalData.CrackHeaders, priorities));
  if (!plannerCracks) {
    return false;
  }

  const cbms = store.ApprovalData.CBMHeaders.every((e) => {
    return e.plannerCbmNAStatus === "Confirmed"
  });
  if (!cbms) {
    return false;
  }

  const naDefects = validationNAApprovalPanel(store.ApprovalData.DefectNAHeaders, true)
  if (!naDefects) {
    return false;
  }

  const crackDefects = validationNAApprovalPanel(store.ApprovalData.CrackNAHeaders, true)
  if (!crackDefects) {
    return false;
  }
  if (Object.keys(store.DefectSMUHeader).length > 0 && store.DefectSMUHeader.plannerStatus !== 'Acknowledge') {
    return false
  }

  return true;
});

const approvalHistory = computed(() => {
  return `${store.ApproveBy?.name}, ${store.ApproveDate}`
})
const isApprovalError = computed(() => {
  return defectSheetStore.stateSheetAlreadyApproved;
})
watch(
  () => {
    return isApprovalError.value
  },
  (val) => {
    if (val) {
      setTimeout(() => {
        defectSheetStore.stateSheetAlreadyApproved = false;
        router.push({
          name: 'defectsplanner'
        })
      }, 3000);
    }
  }
)

const closeNoNetworkDialog = () => {
  store.toggleErrorByNetwork(false)
  router.push({
    name: "defectsplanner",
  });
}

const onSave = async () => {
  const loader = ElLoading.service({
    lock: true,
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  await defectSheetStore.approveDefectSheetByPlanner();
  loader.close();
  /* back to list */
  if (defectSheetStore.IsError) {
    errorMessageBoxVisible.value = true
    return
  }
  defectSheetStore.reset();
  confirmVisible.value = true;
}
const onCancel = () => {
  confirmVisible.value = false;
  onOk()
}
const onOk = () => {
  messageBoxVisible.value = false;
  monitoringStore.setDefaultFormTypeOpenFromApprovalPlanner('Digital Service Forms')
  router.push({
    name: "monitoringstatus",
  })
}

const onErrorOk = () => {
  errorMessageBoxVisible.value = false
  if (defectSheetStore.Error != ApprovalErrorMessages.INCOMPLETE_DATA && defectSheetStore.Error != NoNetworkMessages.NO_NETWORK_VIEW) {
    monitoringStore.setDefaultFormTypeOpenFromApprovalPlanner('Digital Service Forms')
    router.push({
      name: "monitoringstatus",
    })
  }
}

const defectDetailRef = ref(null) as any
const pdfBlobUrl = ref('')
const previewPDF = ref(false)
const showPrintPopUp = ref(false)

const changePrintPopUpStatus = (status) => {
  showPrintPopUp.value = status
}

onBeforeMount(() => {
  if (!defectSheetStore.SelectedDefectSheet || isEmpty(defectSheetStore.SelectedDefectSheet)) {
    router.push({
      name: "defectsplanner",
    });
  }
});

const getPosition = () => {
  positionY.value = window.scrollY
}

const onRefreshData = async () => {
  const loader = ElLoading.service({
    lock: true,
    text: 'Refresh Data...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  await store.getDefectsData(defectSheetStore.SelectedDefectSheet.workOrder);
  // scrollDocument()
  loader.close()
}

onMounted(async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading Defect Data',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (store.DataFetched === false) {
    await store.getDefectsData(defectSheetStore.SelectedDefectSheet.workOrder);
    const arr = defectSheetStore.SelectedDefectSheet.equipmentModel.split(' ')[0].split('-');
    let equipmentModel = [...new Set(arr)].join('-');
    if (!isUndefined(defectSheetStore.SelectedDefectSheet.equipmentModel.split(' ')[1])) {
      equipmentModel = `${equipmentModel} ${defectSheetStore.SelectedDefectSheet.equipmentModel.split(' ')[1]}`
    }
    formStore.setModelAndPsTypeId('', defectSheetStore.SelectedDefectSheet.psType, '', equipmentModel, '');
    await formStore.getEhmsRating();
    await defectStore.getOwnershipDefectForm(defectSheetStore.SelectedDefectSheet.unitNumber)
    await defectStore.getPartReference(defectSheetStore.SelectedDefectSheet.unitNumber);
  }

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
  store.setCurrentUserGroup("Planner")
  loading.close()
});

const closePDF = () => {
  previewPDF.value = false
}
onUnmounted(() => {
  camstore.reset();
});
</script>
