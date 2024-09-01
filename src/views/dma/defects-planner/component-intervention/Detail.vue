<template>
    <div ref="defectDetailRef">
      <BackNavigator :title="`${defectSheetStore.SelectedDefectSheet?.sampleStatus} Intervention ${defectSheetStore.SelectedDefectSheet?.equipment} ${defectSheetStore.SelectedDefectSheet?.sapWorkOrder}`" component-router-push="defectsplanner"
      :approve-history="approvalHistory" />
      <!-- add tabs -->
      <GroupStepper :groups="Groups" :selected-group="Group" :general-submitted="GeneralSubmitted" :is-approval="true"
      :task-progress="TaskProgress" :count-identified-defect="CountIdentifiedDefect" :is-monitoring="true" @group-change="handleGroupChange" />
      <template v-if="Group.group == 'General'">
        <CardEquipmentInformation :intervention="Intervention" />
        <CardPersonnelMonitoring :intervention="Intervention" :serial-number="SerialNumber" />
        <CardSafetyPrecautions :tasks="Intervention.safetyPrecaution" />
        <CardRiskAssesment :general-submitted="GeneralSubmitted" :intervention="Intervention" :fitter="FitterLog.employee"
          :fitter-photos="RiskPhotos"  :is-monitoring="true" />
      </template>
      <template v-else-if="Group.group == 'Identified Defects'">
        <DefectInformationHeader />
        <DefectSMUPanel
          :view-only="false"
          :planner-approve="true"
          :supervisor="false"
          @on-refresh-data="onRefreshData"
        />
        <DefectPanel :view-only="false" :supervisor="false" :planner-approve="true" @on-refresh-data="onRefreshData" :view-is-download="true" />
        <DefectPanel :view-only="false" :supervisor="false" :planner-approve="true" :is-additional-task="true" @on-refresh-data="onRefreshData" :view-is-download="true"/>
        <DefectPanelGeneric :view-only="false" :supervisor="false" @on-refresh-data="onRefreshData" :planner-approve="true" :disable-add-generic="true" :view-is-download="true"/>
        <SupervisorDefectPanel :view-only="false" :planner-approve="true" :view-is-download="true" @on-refresh-data="onRefreshData" />
        <SupervisorDefectPanel :view-only="false" :planner-approve="true" :is-additional-task="true" :view-is-download="true" @on-refresh-data="onRefreshData" />
        <SupervisorGenericDefectPanel :view-only="false" :planner-approve="true" :view-is-download="true" @on-refresh-data="onRefreshData" />
        <CBMPanel
          :headers="store.ApprovalData.CBMHeaders"
          :planner-approve="true"
          @on-refresh-data="onRefreshData"
        />
        <CBMPanel
          :headers="store.ApprovalData.CBMHeaders"
          :planner-approve="true"
          :is-additional-task="true"
          @on-refresh-data="onRefreshData"
        />
        <NAPanel :title="'Not Applicable Item Check'" :headers="store.ApprovalData.DefectNAHeaders" :planner-approve="true" @on-refresh-data="onRefreshData"/>
        <NAPanel :title="'Not Applicable Item Check (Additional Task)'" :headers="store.ApprovalData.DefectNAHeaders" :planner-approve="true" :is-additional-task="true" @on-refresh-data="onRefreshData"/>
        <CommentPanel :headers="store.Comments" :is-intervention="true"/>
        <div class="p-2 py-5 d-flex justify-content-end mt-20 border-top border-top-2">
            <template v-if="store.ApprovalData.DefectHeaders.length == 0 && store.ApprovalData.DefectNAHeaders.length == 0 && store.ApprovalData.CBMHeaders.length == 0">
              <NoDefect message="Component intervention sheet was completed in full and no issues were identified." />
            </template>
            <button class="btn btn-success" style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white"
            :disabled="!isDisabled"
            @click="approveEForm">Approve</button>
        </div>
      </template>
      <template v-else>
        <CardEquipmentInformation :intervention="Intervention" :default-accordion-open="false" />
        <TaskGroup
          v-for="section in Group.sections"
          :key="section.key"
          :re-render="false"
          :defect-images="DefectImages"
          :intervention="Intervention"
          :section="section"
          :current-fitter="FitterLog.employee"
          :general-submitted="false"
          validation=""
          :loading-indicator="LoadingIndicator"
          :item-trigger-disabled-value="ItemTriggerDisabledValue"
          currInputTyped=""
          :expand-all="false"
          @on-image-downloaded="handleImageDownloaded"
          @on-defect-view="handleDefectsView"
        />
    </template>
    <Cameras :visibility="camstore.isVisible" />
    <Confirmation :visibility="confirmVisible"
        caption="Please ensure you generate a PDF copy of the completed Component Intervention Form and attach it to the SAP work order."
        @on-no-confirm="onCancel"
        @on-yes-confirm="onSave" />
    <MessageBox :show="messageBoxVisible" @close="onOk" message="Data successfully approved"/>
    <ErrorBox
    :visibility="errorMessageBoxVisible"
    :caption="defectSheetStore.Error"
    @on-close="onErrorOk" />
    <PDFViewerDialog :show="previewPDF" @handle-close-modal="closePDF" :blob-url="pdfBlobUrl"/>
    <InformationPopUp :show="showPrintPopUp" @close="changePrintPopUpStatus" :title-pop-up="'if required, see your supervisor to print this'"/>
    <InformationPopUp
      :show="isNetworkDisable"
      @close="closeNoNetworkDialog"
      :title-pop-up="'No internet connection'" />
    <DefectYesView
      :re-render="false"
      :task="Task"
      :decline="decline"
      :visibility="showDefectYesView"
      :approved-by="approvedBy"
      :approved-date="approvedDate"
      :ownership="ownership"
      :serialNumber="SerialNumber"
      :data="(defectData as IDefectYesDetail)"
      @on-image-downloaded="handleImageDownloaded"
      @on-close="handleDefectYesViewClose"
      :naReasonOptions="masterStore.NAConditions" />
    <DefectNoView
      :re-render="false"
      :task="Task"
      :generic="isGeneric"
      :visibility="showDefectNoView"
      :data="(defectData as IDefectNoDetail)"
      :ownership="ownership"
      :serialNumber="SerialNumber"
      @on-image-downloaded="handleImageDownloaded"
      @on-close="handleDefectNoViewClose"
      :naReasonOptions="masterStore.NAConditions"  />
    <NAView
      :visibility="showNAView"
      :status="defectStatus"
      :approved-by="approvedBy"
      :approved-date="approvedDate"
      :declineData="decline"
      :data="(defectData as NADetail)"
      @on-close="handleNAViewClose" />
    <ViewOnlyNAReasonDialog :is-intervention="true" />
    </div>
</template>

<script lang="ts" setup>
import GroupStepper from '@/views/dma/component-intervention-forms/components/refactor/GroupStepper.vue'
import CardPersonnelMonitoring from '@/views/dma/component-intervention-forms/components/refactor/CardPersonnelMonitoring.vue'
import CardEquipmentInformation from '@/views/dma/component-intervention-forms/components/refactor/CardEquipmentInformation.vue'
import CardSafetyPrecautions from '@/views/dma/component-intervention-forms/components/refactor/CardSafetyPrecautions.vue'
import CardRiskAssesment from '@/views/dma/component-intervention-forms/components/refactor/CardRiskAssesment.vue'
import TaskGroup from '@/views/dma/component-intervention-forms/components/refactor/TaskGroup.vue'
import Cameras from "@/components/camera/Cameras.vue"
import { useCameraStore } from "@/store/pinia/application/useCameraStore"
import DefectInformationHeader from "@/views/dma/components/defects/DefectInformationHeader.vue"
import DefectSMUPanel from '@/views/dma/components/defects/component-intervention/DefectSMUPanel.vue'
import DefectPanel from '@/views/dma/components/defects/component-intervention/DefectPanel.vue'
import DefectPanelGeneric from '@/views/dma/components/defects/component-intervention/DefectPanelGeneric.vue'
import CBMPanel from '@/views/dma/components/defects/component-intervention/CBMPanel.vue'
import NAPanel from '@/views/dma/components/defects/component-intervention/NAPanel.vue'
import SupervisorDefectPanel from "@/views/dma/components/defects/component-intervention/SupervisorDefectPanel.vue"
import SupervisorGenericDefectPanel from "@/views/dma/components/defects/component-intervention/SupervisorGenericDefectPanel.vue"
import CommentPanel from "@/views/dma/components/defects/CommentPanel.vue"
import NAView from '@/views/dma/component-intervention-forms/components/refactor/defects/NAView.vue'
import ViewOnlyNAReasonDialog from '@/views/dma/components/defects/ViewOnlyNAReasonDialog.vue'
import DefectNoView from '@/views/dma/component-intervention-forms/components/refactor/defects/DefectNoView.vue'
import DefectYesView from '@/views/dma/component-intervention-forms/components/refactor/defects/DefectYesView.vue'
import {
  useComponentInterventionDefectsStore
} from '@/store/pinia/dma/component-intervention/defects/useComponentInterventionDefectsStore'
import {
  useComponentInterventionDefectSheetStore
} from '@/store/pinia/dma/component-intervention/defect-approval/useComponentInterventionDefectSheetStore'
import {
  useComponentInterventionHeaderStore
} from '@/store/pinia/dma/component-intervention/refactor/useComponentInterventionHeaderStore'
import {
  useComponentInterventionDetailStore
} from '@/store/pinia/dma/component-intervention/refactor/useComponentInterventionDetailStore'
import {
  useInterventionDefectStore
} from '@/store/pinia/dma/component-intervention/refactor/useInterventionDefectStore'
import {
  useInterventionNAStore
} from '@/store/pinia/dma/component-intervention/refactor/useInterventionNAStore'
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import {
  useMasterStore
} from '@/store/pinia/dma/masters/useMasterStore'
import {
  onUnmounted,
  onMounted,
  computed,
  ref,
  onBeforeMount
} from 'vue'
import { isEmpty } from "lodash"
import Confirmation from "@/components/dialog/Confirmation.vue"
import MessageBox from "@/components/dialog/MessageBox.vue"
import ErrorBox from '@/components/alert/ErrorBox.vue'
import { ElLoading } from 'element-plus'
import BackNavigator from "@/views/dma/defects-planner/BackNavigator.vue";
import PDFViewerDialog from '@/components/e-form/PDFViewerDialog.vue'
import InformationPopUp from '@/components/dialog/InformationPopUp.vue'
import {
  useComponentInterventionEformStore
} from '@/store/pinia/dma/component-intervention/useComponentInterventionEformStore';
import NoDefect from '@/components/dma/defect/NoDefect.vue'
import { useRouter } from "vue-router";
import {
  useMonitoringListStore
} from "@/store/pinia/dma/status-monitoring/useMonitoringListStore";
import {
  useDefectsFormStore
} from '@/store/pinia/dma/e-form/defects/useDefectsFormStore'
import {
  checkStatus,
  filterByPriority,
  validationNAApprovalPanel,
  validationPlannerApprovalPanel
} from "@/store/pinia/dma/e-form/helpers"
import { titlePdfIntervention } from "@/store/pinia/report/history/dma/helpers"
import {
  ApprovalErrorMessages,
  NoNetworkMessages
} from "@/store/enums/ErrorMessagesEnum"
import { InterventionGroup } from '@/core/types/intervention/InterventionGroup'
import { ImageLoadParam } from '@/core/types/intervention/ImageLoadParam'
import { ImagePayload } from '@/core/types/intervention/ImagePayload'
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter'
import { AESTCurrentDateTime } from '@/core/helpers/date-format'
import { IDetailTask } from '@/core/types/intervention/IDetailTask'
import { KeyValue } from '@/core/types/misc/KeyValue'
import { Defect } from '@/database/schema/Defect'
import { NADetail } from '@/core/types/intervention/NADetail'
import { Decline } from '@/core/types/intervention/Decline'
import { Audit } from '@/core/types/intervention/Audit'
import { IDefectYesDetail } from '@/core/types/intervention/IDefectYesDetail'
import { IDefectNoDetail } from '@/core/types/intervention/IDefectNoDetail'
import { IBasicDefect } from '@/core/types/intervention/IBasicDefect'

const store = useComponentInterventionDefectsStore()
const defectSheetStore = useComponentInterventionDefectSheetStore()
const eformStore = useComponentInterventionEformStore()
const interventionHeaderStore = useComponentInterventionHeaderStore()
const interventionDetailStore = useComponentInterventionDetailStore()
const interventionDefectStore = useInterventionDefectStore()
const interventionNAStore = useInterventionNAStore()
const monitoringStore = useMonitoringListStore();
const camstore = useCameraStore()
const router = useRouter();
const defectStore = useDefectsFormStore()
const authStore = useAuthenticationStore()
const masterStore = useMasterStore()

const messageBoxVisible = ref(false);
const errorMessageBoxVisible = ref(false);
const confirmVisible = ref(false);
const reRender = ref(false)
const defectData = ref<NADetail | IDefectYesDetail | IDefectNoDetail>()
const defectStatus = ref<string>("Not-Confirm")
const approvedBy = ref<Audit>()
const approvedDate = ref("")
const ownership = ref("")
const isGeneric = ref(false)
const decline = ref<Decline>()
const showNAView = ref(false)
const showDefectYesView = ref(false)
const showDefectNoView = ref(false)
const positionY = ref(0)

const approvalHistory = computed(() => {
  return `${store.ApproveBy?.name}, ${store.ApproveDate}`
})

const Intervention = computed(() => {
  return interventionDetailStore.Intervention
})

const SerialNumber = computed(() => {
  return interventionDetailStore.serialNumber
})

const FitterLog = computed(() => {
  return interventionHeaderStore.Log
})

const RiskPhotos = computed(() => {
  return interventionDetailStore.RiskAssessmentImages
})

const Groups = computed(() => {
  return interventionDetailStore.Groups
})

const Group = computed(() => {
  return interventionDetailStore.Group
})

const Task = computed(() => {
  return interventionDetailStore.Task
})

const DefectImages = computed(() => {
  if (!Task.value) {
    return []
  }
  return interventionDefectStore.DefectImages[Task.value.key]
})

const LoadingIndicator = computed(() => {
  return interventionDetailStore.LoadingTask;
})

const ItemTriggerDisabledValue = computed(() => {
  return interventionDetailStore.ItemTriggerDisabledValue
})

const CountIdentifiedDefect = computed(() => {
  return interventionDetailStore.CountIdentifiedDefect
})

const GeneralSubmitted = computed(() => {
  return interventionHeaderStore.GeneralSubmitted
})

const TaskProgress = computed(() => {
  return interventionDetailStore.TaskProgress
})

const isNetworkDisable = computed(() => {
  return store.stateErrorByNetwork
})

const isDisabled = computed(() => {
  const priorities = ["P1", "P2", "P3", "P4"];

  const defects = checkStatus(filterByPriority(store.ApprovalData.DefectHeaders, priorities));
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

  if (store.ApprovalData.SMUDefectHeaders.length > 0 && store.ApprovalData.SMUDefectHeaders[0].plannerStatus !== 'Acknowledge') {
    return false
  }

  return true;
});

const handleGroupChange = (group: InterventionGroup) => {
  interventionDetailStore.setSelectedGroup(group)
}

const handleImageDownloaded = async (paramsImage: ImageLoadParam) => {
  if (paramsImage.index == 0) {
    reRender.value = false;
  }
  const image = paramsImage.image;
  const params = {} as ImagePayload;
  params.id = Intervention.value.id;
  if (image.type == "imageEquipment") {
    params.key = Intervention.value.key;
  } else if (image.type == "value") {
    params.key = Intervention.value.riskAssesment[0].key;
  } else {
    params.key = Task.value?.key;
  }
  params.type = image.type;
  params.employee = {
    id: authStore.user.EmployeeId,
    name: authStore.user.Name,
  };
  const convertedImages = stringToImageInfoConvert([image.filename]);
  params.files = convertedImages;
  params.blobs = [image.blob];
  params.submitDate = AESTCurrentDateTime();
  await interventionHeaderStore.storeImageLocal(params);
  if (paramsImage.index == paramsImage.length - 1) {
    reRender.value = true;
  }
}

const handleDefectsView = async ({
  param,
  task = {} as IDetailTask
}) => {
  switch (param.key) {
    case "na":
      handleNAView(param)
      break
    case "defect":
      handleDefectView(param);
      if (task) {
        interventionDetailStore.setSelectedTask(task)
      }
      break
  }
}

const handleNAView = async (data: KeyValue) => {
  const defect = (await interventionNAStore.getNADetail(
    data.value,
    Intervention.value.trInterventionHeaderId,
    Intervention.value.sapWorkOrder,
  )) as Defect;
  if (defect) {
    defectData.value = JSON.parse(defect.defectData) as NADetail;
    defectStatus.value = defect.cbmNAStatus;
    decline.value = {} as Decline;
    decline.value.declineReason = defect.declineReason || ""
    decline.value.declineDate = defect.declineDate || ""
    decline.value.declineBy = defect.declineBy || ({} as Audit)
    approvedBy.value = defect.approvedBy
    approvedDate.value = defect.approvedDate || ""
    showNAView.value = true
  }
}

const handleDefectView = async (data: KeyValue) => {
  const baseDefect = (await interventionDefectStore.getDefectDetail(
    data.value,
    Intervention.value.trInterventionHeaderId,
    Intervention.value.sapWorkOrder,
    "taskId",
  )) as IBasicDefect;
  const headerDefect = (await interventionDefectStore.getDefectHeader(
    data.value,
    Intervention.value.trInterventionHeaderId,
    Intervention.value.sapWorkOrder,
    "taskId",
  )) as Defect;
  if (baseDefect.type == "NO") {
    defectData.value = baseDefect as IDefectNoDetail;
    showDefectNoView.value = true;
  } else {
    decline.value = {} as Decline;
    defectData.value = baseDefect as IDefectYesDetail;
    const record = await interventionDefectStore.getDefectDecline(data.value);
    decline.value.isDecline = record.isDecline;
    decline.value.declineReason = record.declineReason;
    decline.value.declineDate = record.declineDate;
    decline.value.declineBy = record.declineBy;
    approvedBy.value = headerDefect.approvedBy;
    approvedDate.value = headerDefect.approvedDate ?? "";
    showDefectYesView.value = true;
  }
}

const handleNAViewClose = () => {
  showNAView.value = false;
  decline.value = {} as Decline
  approvedBy.value = {} as Audit
  approvedDate.value = ""
}
const handleDefectYesViewClose = () => {
  showDefectYesView.value = false;
}
const handleDefectNoViewClose = () => {
  showDefectNoView.value = false;
}

const approveEForm = async () => {
  confirmVisible.value = true;
}

const closeNoNetworkDialog = () => {
  store.toggleErrorByNetwork(false)
  router.push({
    name: "defectsplanner",
  });
}


const onRefreshData = async () => {
  positionY.value = window.scrollY
  const loader = ElLoading.service({
    lock: true,
    text: 'Refresh Data...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  await store.getDefectsData(defectSheetStore.SelectedDefectSheet.interventionId);
  // scrollDocument()
  loader.close()
}

const onSave = async () => {
  confirmVisible.value = false;
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
  messageBoxVisible.value = true;
}
const onCancel = () => {
  confirmVisible.value = false;
}
const onOk = () => {
  messageBoxVisible.value = false;
  // redirectByLink('/ironforms/defects-planner');
  monitoringStore.setDefaultFormTypeOpenFromApprovalPlanner('Component Intervention Forms')
  router.push({
    name: "monitoringstatus",
  })
}

const onErrorOk = () => {
  errorMessageBoxVisible.value = false
  if (defectSheetStore.Error != ApprovalErrorMessages.INCOMPLETE_DATA && defectSheetStore.Error != NoNetworkMessages.NO_NETWORK_VIEW) {
    monitoringStore.setDefaultFormTypeOpenFromApprovalPlanner('Component Intervention Forms')
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
  } else {
    defectSheetStore.setDefectTitle(titlePdfIntervention(defectSheetStore.SelectedDefectSheet))
  }
})

const setDefectAssetNumberData = (equipment) => {
  const ownerFind = masterStore.Ownership.find((owner) => {
    return owner.equipmentNumber == equipment
  })
  ownership.value = ownerFind?.ownership ?? ""
}

onMounted(async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading Defect Data',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (store.DataFetched === false) {
    await store.getDefectsData(defectSheetStore.SelectedDefectSheet?.interventionId);
    await eformStore.getInterventionDataCosmos(defectSheetStore.SelectedDefectSheet?.interventionId)
    interventionDetailStore.initGroup(eformStore.intervention)
    const defaultGroup = Groups.value.find((g) => {
      return g.key == "Identified Defects"
    })
    if (defaultGroup) {
      interventionDetailStore.setSelectedGroup(defaultGroup)
    }
    await defectStore.getOwnershipDefectForm(eformStore.intervention.equipment)
    interventionDetailStore.setSerialNumber(defectStore.SerialNumber)
    setDefectAssetNumberData(Intervention.value.equipment)
    await interventionDetailStore.getCountIdentifiedDefect()
  }
  try {
    const htmlElement = defectDetailRef.value as HTMLElement
    const showPDFArr = Array.from(htmlElement.getElementsByClassName('show-pdf')) as HTMLElement[]
    const spvPrintPDFArr = Array.from(htmlElement.getElementsByClassName('spv-print-pdf')) as HTMLElement[]
    showPDFArr.forEach((element) => {
      element.onclick = (event) => {
        event.preventDefault()
      }
    })
    spvPrintPDFArr.forEach((element) => {
      element.onclick = (event) => {
        event.preventDefault()
      }
    })
  } catch (error) {
    console.log(error)
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
