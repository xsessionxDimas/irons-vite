<template>
  <div ref="defectDetailRef">
    <BackNavigator
      :title="`${defectSheetStore.SelectedDefectSheet?.sampleStatus} Intervention ${defectSheetStore.SelectedDefectSheet?.equipment} ${defectSheetStore.SelectedDefectSheet?.sapWorkOrder}`"
      component-router-push="defects" />
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
        :planner-approve="false"
        :supervisor="true"
        @on-refresh-data="onRefreshData"
        @on-get-position-y="getPositon"
      />
      <DefectPanel :view-only="false" :supervisor="true" :need-confirm="false" @on-refresh-data="onRefreshData" :view-is-download="true" />
      <DefectPanel :view-only="false" :supervisor="true" :is-additional-task="true" :need-confirm="false" @on-refresh-data="onRefreshData" :view-is-download="true" />
      <DefectPanelGeneric :view-only="false" :supervisor="true" :need-confirm="false" @on-refresh-data="onRefreshData" :view-is-download="true" />
      <CBMPanel
        :headers="store.ApprovalData.CBMHeaders"
        :view-only="false"
        :supervisor="true"
        :is-disabled="!statusIsSubmitted"
        @on-refresh-data="onRefreshData"
      />
      <CBMPanel
        :headers="store.ApprovalData.CBMHeaders"
        :view-only="false"
        :supervisor="true"
        :is-disabled="!statusIsSubmitted"
        :is-additional-task="true"
        @on-refresh-data="onRefreshData"
      />
      <NAPanel :title="'Not Applicable Item Check'" :headers="store.ApprovalData.DefectNAHeaders" :is-defect="true" :is-disabled="!statusIsSubmitted" @on-refresh-data="onRefreshData" @on-get-position-y="getPositon" />
      <NAPanel :title="'Not Applicable Item Check (Additional Task)'" :headers="store.ApprovalData.DefectNAHeaders" :is-disabled="!statusIsSubmitted" @on-refresh-data="onRefreshData" @on-get-position-y="getPositon"
        :is-additional-task="true" />
      <CommentPanel :headers="dataComments" :is-intervention="true" />
        <div class="p-2 py-5 d-flex justify-content-end mt-20 border-top border-top-2">
          <template
            v-if="store.ApprovalData.DefectHeaders.length == 0 && store.ApprovalData.DefectNAHeaders.length == 0 && store.ApprovalData.CBMHeaders.length == 0">
            <NoDefect message="Component intervention sheet was completed in full and no issues were identified." />
          </template>
          <button class="btn btn-success"
            style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white" :disabled="!isDisabled"
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
    <MessageBox :show="messageBoxVisible" @close="onOk" message="Data successfully approved" />
    <ErrorBox
      :visibility="errorMessageBoxVisible"
      :caption="defectSheetStore.Error"
      @on-close="onErrorOk" />
    <PDFViewerDialog :show="previewPDF" @handle-close-modal="closePDF" :blob-url="pdfBlobUrl" />
    <InformationPopUp :show="showPrintPopUp" @close="changePrintPopUpStatus"
      :title-pop-up="'if required, see your supervisor to print this'" />
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
      :re-render="reRender"
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
import { useCameraStore } from '@/store/pinia/application/useCameraStore'
import DefectInformationHeader from '@/views/dma/components/defects/DefectInformationHeader.vue'
import DefectSMUPanel from '@/views/dma/components/defects/component-intervention/DefectSMUPanel.vue'
import DefectPanel from '@/views/dma/components/defects/component-intervention/DefectPanel.vue'
import DefectPanelGeneric from '@/views/dma/components/defects/component-intervention/DefectPanelGeneric.vue'
import CBMPanel from '@/views/dma/components/defects/component-intervention/CBMPanel.vue'
import NAPanel from '@/views/dma/components/defects/component-intervention/NAPanel.vue'
import CommentPanel from '@/views/dma/components/defects/CommentPanel.vue'
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
  useComponentInterventionEformStore
} from '@/store/pinia/dma/component-intervention/useComponentInterventionEformStore'
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
import { isEmpty } from 'lodash'
import navigator from '@/core/mixins/navigator'
import MessageBox from '@/components/dialog/MessageBox.vue'
import ErrorBox from '@/components/alert/ErrorBox.vue'
import { ElLoading } from 'element-plus'
import BackNavigator from '@/views/dma/components/form-preview/components/BackNavigator.vue'
import PDFViewerDialog from '@/components/e-form/PDFViewerDialog.vue'
import InformationPopUp from '@/components/dialog/InformationPopUp.vue'
import NoDefect from '@/components/dma/defect/NoDefect.vue'
import { db } from '@/database/schema/DexieSchema'
import { useRouter } from 'vue-router'
import {
  useDefectsFormStore
} from '@/store/pinia/dma/e-form/defects/useDefectsFormStore'
import {
  validationNAApprovalPanel,
  filterByPriority
} from '@/store/pinia/dma/e-form/helpers'
import { titlePdfIntervention } from '@/store/pinia/report/history/dma/helpers'
import {
  ApprovalErrorMessages,
  NoNetworkMessages
} from '@/store/enums/ErrorMessagesEnum'
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


const router = useRouter()

const store = useComponentInterventionDefectsStore()
const defectSheetStore = useComponentInterventionDefectSheetStore()
const eformStore = useComponentInterventionEformStore()
const interventionHeaderStore = useComponentInterventionHeaderStore()
const interventionDetailStore = useComponentInterventionDetailStore()
const interventionDefectStore = useInterventionDefectStore()
const interventionNAStore = useInterventionNAStore()
const camstore = useCameraStore()
const defectStore = useDefectsFormStore()
const authStore = useAuthenticationStore()
const masterStore = useMasterStore()

const messageBoxVisible = ref(false)
const errorMessageBoxVisible = ref(false)
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

/* helpers */
const { redirectByLink } = navigator();

const statusIsSubmitted = computed(() => {
  return defectSheetStore.SelectedDefectSheet?.intFormStatus == "Submited"
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

const dataComments = computed(() => {
  return store.Comments.slice().sort(compareComments);
})

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
const compareComments = (a, b) => {
  const numA = parseInt(a.taskDesc.split(";;")[0]);
  const numB = parseInt(b.taskDesc.split(";;")[0]);
  return numA - numB;
}

const isDisabled = computed(() => {
  const priorities = ["P1", "P2", "P3", "P4"];
  const defectsRaw = filterByPriority(
    store.ApprovalData.DefectHeaders,
    priorities,
  );
  const defects = defectsRaw.every((e) => {
    return e.status == "Acknowledge" || e.status == "Decline";
  });

  const defectsGenericRaw = filterByPriority(
    store.ApprovalData.DefectGenericHeaders,
    priorities,
  );
  const defectsGeneric = defectsGenericRaw.every((e) => {
    return e.status == "Acknowledge" || e.status == "Decline";
  });

  const cbms = store.ApprovalData.CBMHeaders.every((e) => {
    return e.cbmNAStatus === "Confirmed";
  });
  const naDefects = validationNAApprovalPanel(
    store.ApprovalData.DefectNAHeaders,
  );

  if (store.ApprovalData.SMUDefectHeaders.length > 0 && store.ApprovalData.SMUDefectHeaders[0].status !== 'Acknowledge') {
    return false
  }

  return (
    defects &&
    defectsGeneric &&
    cbms &&
    naDefects &&
    statusIsSubmitted.value
  );
});


const getPositon = () => {
  positionY.value = window.scrollY
}

const closeNoNetworkDialog = () => {
  store.toggleErrorByNetwork(false)
  router.push({
    name: "defects",
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

const approveEForm = async () => {
  const loader = ElLoading.service({
    lock: true,
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  await defectSheetStore.approveDefectSheetBySupervisor();
  // hapus local
  await db.interventionDefect.where('interventionId').equals(defectSheetStore.SelectedDefectSheet.interventionId).delete()
  await db.pendingTask.where('workorder').equals(defectSheetStore.SelectedWorkOrder).delete()

  const InterventionDetail = await db.interventionDetail.where('id').equals(defectSheetStore.SelectedDefectSheet.interventionId).first()

  await db.interventionDetail.where('id').equals(defectSheetStore.SelectedDefectSheet.interventionId).delete()

  if (InterventionDetail) {
    await db.interventionHeader.where('id').equals(InterventionDetail.keyPbi).delete()
  }
  loader.close();
  if (defectSheetStore.IsError) {
    errorMessageBoxVisible.value = true
    return
  }
  defectSheetStore.reset();
  messageBoxVisible.value = true
}
const onOk = () => {
  messageBoxVisible.value = false;
  redirectByLink('/ironforms/defects');
}

const onErrorOk = () => {
  errorMessageBoxVisible.value = false
  if (defectSheetStore.Error != ApprovalErrorMessages.INCOMPLETE_DATA && defectSheetStore.Error != NoNetworkMessages.NO_NETWORK_VIEW) {
    redirectByLink('/ironforms/defects');
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
      name: "defects",
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
    await store.getDefectsData(defectSheetStore.SelectedDefectSheet.interventionId)
    await eformStore.getInterventionDataCosmos(defectSheetStore.SelectedDefectSheet.interventionId)
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
  store.setCurrentUserGroup("Supervisor")
  loading.close()
})

const closePDF = () => {
  previewPDF.value = false
}
onUnmounted(() => {
  camstore.reset();
});
</script>
