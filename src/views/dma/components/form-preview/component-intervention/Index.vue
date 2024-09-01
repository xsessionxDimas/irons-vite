<template>
  <IndexPrint ref="downloadPdfDefect" @on-download-finish="handleChangeIconDownload" />
  <div class="row m-0 p-5 bg-white e-form-container">
    <BackNavigator :title="title" :formName="formName" :form-status="Intervention.interventionExecution"
      :component-router-push="'monitoringstatus'"
      :percentage-progress="interventionDetailStore.percentageTaskProgressAllTab" :approve-history="approvalHistory"
      :defect-status="Intervention.defectStatus" />
    <GroupStepper :groups="Groups" :selected-group="Group" :general-submitted="GeneralSubmitted"
      :task-progress="TaskProgress" :count-identified-defect="countIdentifiedDefect" :is-monitoring="true"
      @group-change="handleGroupChange" />
    <!-- show general -->
    <template v-if="Group.group == 'General'">
      <CardEquipmentInformation :intervention="Intervention" />
      <CardPersonnelMonitoring :intervention="Intervention" :serial-number="SerialNumber"
        @on-s-m-u-revise-icon-clicked="handleSMUReviseClicked" />
      <CardSafetyPrecautions :tasks="Intervention.safetyPrecaution" />
      <CardRiskAssesment :general-submitted="GeneralSubmitted" :intervention="Intervention" :fitter="FitterLog.employee"
        :fitter-photos="riskPhotos" :re-render="reRender" :is-monitoring="true" />
    </template>
    <!-- show service sheet detail -->
    <template v-else-if="Group.group != 'General' && Group.group != 'Identified Defects'">
      <CardEquipmentInformation :intervention="Intervention" :default-accordion-open="false" />
      <TaskGroup v-for="section in Group.sections" :key="section.key" :re-render="reRender" :is-read-only="true"
        :defect-images="DefectImages" :intervention="Intervention" :section="section"
        :current-fitter="FitterLog.employee" :loading-indicator="loadingIndicator"
        :item-trigger-disabled-value="itemTriggerDisabledValue" :expand-all="true"
        @on-defect-view="handleDefectsView" />
      <AdditionalInformation property-name="Provide additional information if required"
        :property-value="Intervention.additionalInformation" :is-disabled="true" />
    </template>
    <template v-else-if="Group.group == 'Identified Defects'">
      <template
        v-if="Intervention.interventionExecution == 'Submited' || Intervention.interventionExecution == 'Close' || Intervention.interventionExecution == 'On Progress'">
        <DefectIdentified :data="defectIdentifiedData" :comments="defectIdentifiedCommentData"
          :defect-status="Intervention.defectStatus"
          :view-is-download="Intervention.interventionExecution == 'Submited' && Intervention.defectStatus == 'Completed'"
          @on-view-detail-information="handleViewDefectIdentified" @on-print-defect="handlePrintDefect" />
      </template>
    </template>
    <!-- footer / next button -->
    <slot name="buttonEndOfGroup" v-if="!showNextButton"></slot>
    <FooterForm :show-prev="showPrev" :show-next="showNext" @go-next="handleGoNext" @go-prev="handleGoPrev"
      v-if="true" />
  </div>
  <CBMInfo :cbmData="(cbmData ?? {} as Defect)" :images="cbmImages" :is-monitoring="true" :visibility="showCBMView"
    :ratingFormula="ratingFormula" @on-close="handleCBMInfoViewClose" />
  <DefectYesView :is-monitoring="true" :re-render="reRender" :task="Task" :decline="decline"
    :visibility="showDefectYesView" :ownership="ownership" :serial-number="SerialNumber" :approved-by="approvedBy"
    :approved-date="approvedDate" :data="(defectData as IDefectYesDetail)" @on-close="handleDefectYesViewClose" />
  <DefectNoView :is-monitoring="true" :re-render="reRender" :task="Task" :visibility="showDefectNoView"
    :data="(defectData as IDefectNoDetail)" :ownership="ownership" :serial-number="SerialNumber"
    @on-close="handleDefectNoViewClose" />
  <NAView :visibility="showNAView" :status="defectStatus" :approved-by="approvedBy" :approved-date="approvedDate"
    :declineData="decline" :data="(defectData as NADetail)" @on-close="handleNAViewClose" />
  <ViewOnlyNAReasonDialog />
  <Confirmation :visibility="showConfirmationPDF"
    caption="Are you sure want to download all the attachment in this defect file?" yesLabel="Yes, Download All File"
    noLabel="No,  Only F55 Form" :showClose="true" :widthDialog="60" footerTemplate="50-50"
    @on-close="handleCloseConfirmation" @on-no-confirm="onPrintWithoutAttachment"
    @on-yes-confirm="onPrintWithAttachment" />
  <SMUDetailDialog v-model:show="showSMUDetailDialog" :detailDefect="detailSMUDialog" :ownership="ownership"
    :view-only="false" :isFitter="true" :cameras-image="imageObjectRevise" @updateDefectDetailSMU="handleReviseSMU"
    @retake-photo="handleRetakePhotoRevise" @reset-photo="resetCameraState" :isIntevention="true" />
  <SMUDetailDialog v-model:show="showSMUDetailDialogViewer" :detailDefect="detailSMUDialogViewer" :ownership="ownership"
    :approval-s-p-v-data="(approvalSMUDetail as ApproveSMU)" :view-only="true" :isFitter="true" :isIntevention="true" />
  <Camera :show-close-button="showCloseButtonCamera" :is-visible="cameraVisible" :is-preview="isPreview"
    :image-url="imageUrl" :camera-type="currentCameraType" :switch-camera="isSwitchingCamera"
    :image-description="descriptionValue" @on-camera-switch="handleCameraSwitch"
    @on-close-camera="handleCloseCameraClick" @on-snapshot-created="handleSnapshotCreated"
    @on-back-to-capture="handleBackToCapture" @on-snapshot-save="handleSnapshotSave" @on-file-dropped="handleFileUpload"
    @on-add-description="handleOpenDescriptionForm" />
  <UploadImageFailureDialog :show="errorUploadVisible" :imageList="errorImageList"
    @close="handleCloseFailedUploadDialog" />
  <PhotoDescription :description="descriptionValue" :is-visible="descriptionFormVisible"
    @on-close="handleCloseDescriptionForm" @on-save-desc="handleSaveDesc" />
  <GeneralDialog modal-type="notMapped" :show="showSMUToleranceNotMapped" @close="closeSMUToleranceNotMappedModal" />
  <ToastWithIcon :show="isSuccessTakePhotoSMU" message="Machine SMU photo has been taken" />
</template>
<script setup lang="ts">
import {
  computed,
  defineProps,
  ref,
  watch,
  onMounted,
  onBeforeMount,
} from 'vue'
import GroupStepper from '@/views/dma/component-intervention-forms/components/refactor/GroupStepper.vue'
import FooterForm from './Footer.vue'
import BackNavigator from '../components/BackNavigator.vue'
import DefectIdentified from '@/views/dma/component-intervention-forms/components/refactor/defects/Index.vue'
import CardPersonnelMonitoring from '@/views/dma/component-intervention-forms/components/refactor/CardPersonnelMonitoring.vue'
import CardEquipmentInformation from '@/views/dma/component-intervention-forms/components/refactor/CardEquipmentInformation.vue'
import CardSafetyPrecautions from '@/views/dma/component-intervention-forms/components/refactor/CardSafetyPrecautions.vue'
import CardRiskAssesment from '@/views/dma/component-intervention-forms/components/refactor/CardRiskAssesment.vue'
import TaskGroup from '@/views/dma/component-intervention-forms/components/refactor/TaskGroup.vue'
import AdditionalInformation from '@/views/dma/component-intervention-forms/components/refactor/AdditionalInformation.vue'
import DefectNoView from '@/views/dma/component-intervention-forms/components/refactor/defects/DefectNoView.vue'
import DefectYesView from '@/views/dma/component-intervention-forms/components/refactor/defects/DefectYesView.vue'
import NAView from '@/views/dma/component-intervention-forms/components/refactor/defects/NAView.vue'
import ViewOnlyNAReasonDialog from "@/views/dma/components/defects/ViewOnlyNAReasonDialog.vue"
import Confirmation from '@/components/dialog/Confirmation.vue'
import IndexPrint from "@/views/dma/defects/components/export-pdf/DefectForm.vue"
import {
  useComponentInterventionHeaderStore
} from '@/store/pinia/dma/component-intervention/refactor/useComponentInterventionHeaderStore'
import {
  useComponentInterventionDetailStore
} from '@/store/pinia/dma/component-intervention/refactor/useComponentInterventionDetailStore'
import {
  useInterventionNAStore
} from '@/store/pinia/dma/component-intervention/refactor/useInterventionNAStore'
import {
  useInterventionDefectStore
} from '@/store/pinia/dma/component-intervention/refactor/useInterventionDefectStore'
import { useMasterStore } from '@/store/pinia/dma/masters/useMasterStore'
import {
  orderBy,
  isEmpty,
} from 'lodash'
import GeneralDialog from "@/views/dma/components/GeneralDialog.vue";
import Camera from "@/components/camera/Camera.vue";
import { Decline } from '@/core/types/intervention/Decline'
import { KeyValue } from '@/core/types/misc/KeyValue'
import { IBasicDefect } from '@/core/types/intervention/IBasicDefect'
import { IDefectNoDetail } from '@/core/types/intervention/IDefectNoDetail'
import { IDefectYesDetail } from '@/core/types/intervention/IDefectYesDetail'
import { NADetail } from '@/core/types/intervention/NADetail'
import { db } from '@/database/schema/DexieSchema'
import {
  useComponentInterventionDefectsIdentifiedStore
} from '@/store/pinia/dma/component-intervention/refactor/useComponentInterventionDefectsIdentifiedStore'
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import CBMInfo from '@/views/dma/component-intervention-forms/components/refactor/defects/dialog/CBMInfo.vue'
import { DefectDetailParam } from '@/core/types/intervention/DefectDetailParam'
import { Defect } from '@/database/schema/Defect'
import DefectIdentifiedClass from '@/core/classes/DefectIdentifiedClass'
import { InterventionGroup } from '@/core/types/intervention/InterventionGroup'
import { ElLoading } from 'element-plus'
import { Comment } from '@/core/types/entities/dma/defects/Comment'
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo'
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter'
import { Audit } from '@/core/types/intervention/Audit'
import {
  useHistoricalEformDmaStore
} from '@/store/pinia/report/history/dma/useHistoricalEformDmaStore';
import {
  prepareDownloadableData,
  titlePdfIntervention,
} from "@/store/pinia/report/history/dma/helpers"
import { ImagePayload } from '@/core/types/intervention/ImagePayload'
import {
  ImageObject as imageObjectSMU
} from "@/core/types/entities/dma/ImageObject";
import { CameraId } from "@/store/enums/CameraIdEnum";
import { UpdateSMUParam } from "@/core/types/intervention/UpdateSMUParam";
import SMUDetailDialog from '@/views/dma/components/defects/SMUDetailDialog.vue'
import {
  DefectSMU,
  submitDetailParameter,
  ApproveSMU
} from "@/core/types/entities/dma/defects/DefectSMU"
import { MachineSMUEnum } from "@/store/enums/MachineSMUEnum";
import {
  useNewCameraStore
} from '@/store/pinia/application/refactor/useNewCameraStore'
import { DefectSMUFormData } from '@/core/types/intervention/DefectSMUFormData'
import { AESTCurrentDateTime } from '@/core/helpers/date-format'
import { v4 as uuidv4 } from "uuid";
import { CameraParam } from '@/core/types/intervention/CameraParam'
import ToastWithIcon from "@/components/dialog/ToastWithIcon.vue";
import {
  convertToWebP,
  generateString
} from '@/store/pinia/dma/e-form/helpers'
import UploadImageFailureDialog from "@/components/camera/UploadImageFailureDialog.vue";
import PhotoDescription from "@/components/camera/PhotoDescription.vue";
import { IDetailTask } from '@/core/types/intervention/IDetailTask'

const interventionHeaderStore = useComponentInterventionHeaderStore()
const interventionDetailStore = useComponentInterventionDetailStore()
const interventionNAStore = useInterventionNAStore()
const interventionDefectStore = useInterventionDefectStore()
const interventionDefectIdentifiedStore = useComponentInterventionDefectsIdentifiedStore()
const masterStore = useMasterStore()
const historicalEformStore = useHistoricalEformDmaStore()
const authStore = useAuthenticationStore()
const cameraStore = useNewCameraStore();

defineProps({
  title: {
    type: String,
    required: true
  },
  pageFrom: {
    type: String,
    required: false,
    default: null
  },
  defectCloseFirst: {
    type: Boolean,
    required: false,
    default: false
  }
})
const reRender = ref(false)
const decline = ref<Decline>()
const defectStatus = ref<string>("Not-Confirm")
const approvedBy = ref<Audit>()
const approvedDate = ref("")
const showNAView = ref(false)
const showDefectYesView = ref(false)
const showDefectNoView = ref(false)
const showCBMView = ref(false)
const defectData = ref<NADetail | IDefectYesDetail | IDefectNoDetail>()
const cbmData = ref<Defect>()
const cbmImages = ref<ImageInfo[]>([])
const ratingFormula = ref()
const ownership = ref('')
const currentHeaderId = ref('')
const showConfirmationPDF = ref(false)
const selectedDefectDownload = ref<{
  headerId: string,
  type: string
}>({
  headerId: '',
  type: ''
})
const downloadPdfDefect = ref()
// SMU
const isSuccessTakePhotoSMU = ref<boolean>(false);
const showSMUToleranceNotMapped = ref<boolean>(false);
const pendingUpdateSMUParam = ref<UpdateSMUParam>({} as UpdateSMUParam)
const showSMUDetailDialog = ref<boolean>(false);
const cameraIDRevise = CameraId.SMU_REVISE;
const revisedImageParam = ref<ImagePayload>({} as ImagePayload)
const imageObjectRevise = ref<imageObjectSMU>({} as imageObjectSMU)
const showSMUDetailDialogViewer = ref<boolean>(false);
const detailSMUDialogViewer = ref<any>({});
const approvalSMUDetail = ref({});
const showCloseButtonCamera = ref(true);
const isPreview = ref(false);
const imageUrl = ref("");
const blobImage = ref<Blob>();
const key = ref("");
const errorUploadVisible = ref(false);
const errorImageList = ref<string[]>([]);
const isSwitchingCamera = ref(false);
const descriptionFormVisible = ref(false);
const descriptionValue = ref("");

const cameraVisible = computed(() => {
  return cameraStore.IsVisible;
});
const currentCameraType = computed(() => {
  return cameraStore.CurrentType;
});
const formName = computed(() => {
  return `${Intervention.value?.equipment} <span class="${Intervention.value?.sampleStatus?.toLowerCase() == 'caution' ? 'yellow' : Intervention.value?.sampleStatus?.toLowerCase() == 'normal' ? 'green' : 'red'}">${Intervention.value?.sampleStatus}</span>`
})
const Intervention = computed(() => {
  return interventionDetailStore.Intervention
})
const FitterLog = computed(() => {
  return interventionHeaderStore.Log
})
const Groups = computed(() => {
  return interventionDetailStore.Groups
})
const SerialNumber = computed(() => {
  return interventionDetailStore.serialNumber
})
const approvalHistory = computed(() => {
  if (Intervention.value.defectStatus != 'Completed') return undefined
  return `${interventionDefectIdentifiedStore.ApproveBy?.name}, ${interventionDefectIdentifiedStore.ApproveDate}`
})
const Group = computed(() => {
  return interventionDetailStore.Group
})
const GeneralSubmitted = computed(() => {
  return interventionHeaderStore.GeneralSubmitted
})
const DefectImages = computed(() => {
  if (!Task.value) {
    return []
  }
  return interventionDefectStore.DefectImages[Task.value.key]
})
const Task = computed(() => {
  return interventionDetailStore.Task
})
const TaskProgress = computed(() => {
  return interventionDetailStore.TaskProgress
})
const countIdentifiedDefect = computed(() => {
  return interventionDetailStore.CountIdentifiedDefect
})
const loadingIndicator = computed(() => {
  return interventionDetailStore.LoadingTask
})
const itemTriggerDisabledValue = computed(() => {
  return interventionDetailStore.ItemTriggerDisabledValue
})
const riskPhotos = computed(() => {
  return interventionDetailStore.RiskAssessmentImages
})
const defectIdentifiedData = computed(() => {
  return interventionDefectIdentifiedStore.defectIdentifiedData as DefectIdentifiedClass ?? new DefectIdentifiedClass()
})
const defectIdentifiedCommentData = computed(() => {
  return interventionDefectIdentifiedStore.defectIdentifiedCommentData as Comment[]
})
const showNextButton = computed(() => {
  const currentGroup = Groups.value.findIndex((group) => {
    return group.group == Group.value.group
  })
  if (currentGroup + 1 >= Groups.value.length) {
    return false
  }
  return true
})
const showPrev = computed(() => {
  if (Group.value.group == 'Identified Defects' || Group.value.group == 'Intervention Checks') return true
  return false
})
const showNext = computed(() => {
  if (Group.value.group == 'General' || Group.value.group == 'Intervention Checks') return true
  return false
})
const handleGroupChange = (group: InterventionGroup) => {
  interventionDetailStore.setSelectedGroup(group)
}
const handleViewDefectIdentified = async (data: DefectDetailParam) => {
  switch (data.type) {
    case "machineSMU":
      handleDefectIdentifiedDefectDetailSMU(data);
      break;
    case 'defect':
      await handleDefectIdentifiedDefectDetail(data, "taskId")
      break
    case 'defectGeneric':
      await handleDefectIdentifiedDefectDetail(data, "defectHeaderId")
      break
    case 'na':
      handleDefectIdentifiedNADetail(data.taskId)
      break
    case 'cbm':
      handleDefectIdentifiedCBMDetail(data.taskId)
      break
  }
}
const handleDefectIdentifiedDefectDetailSMU = (data) => {
  showSMUDetailDialogViewer.value = true
  // get data dan assign to view
  detailSMUDialogViewer.value = data.smuDetail
  approvalSMUDetail.value = data.approvalSPVData
}
const handlePrintDefect = (data: {
  headerId: string,
  type: string
}) => {
  showConfirmationPDF.value = true
  selectedDefectDownload.value = data
}
const handleCloseConfirmation = () => {
  showConfirmationPDF.value = false
}
const onPrintWithoutAttachment = () => {
  historicalEformStore.setIsAttachmentIncludeDownload(false)
  handleCloseConfirmation()
  handleDownloadPDF()
}
const onPrintWithAttachment = () => {
  historicalEformStore.setIsAttachmentIncludeDownload(true)
  handleCloseConfirmation()
  handleDownloadPDF()
}
const handleDownloadPDF = async () => {
  let header,
    detail;
  currentHeaderId.value = ""
  switch (selectedDefectDownload.value.type) {
    case 'defect':
    {
      const defectData = interventionDefectIdentifiedStore.getDefectHeaderDetailData(selectedDefectDownload.value.headerId)
      if (defectData) {
        header = defectData.header
        detail = defectData.detail
      }
      break
    }
    case 'defectGeneric':
    {
      const defectData = interventionDefectIdentifiedStore.getDefectGenericHeaderDetailData(selectedDefectDownload.value.headerId)
      if (defectData) {
        header = defectData.header
        detail = defectData.detail
      }
      break
    }
  }

  if (header && detail) {
    historicalEformStore.setIsIntervention(true)
    const isDataPrepared = prepareDownloadableData({
      header: header,
      detail: detail,
      serialNumber: SerialNumber.value,
      approvalData: {
        approvedBy: header.approvedBy,
        approvedDate: header.approvedDate
      },
      ownership: ownership.value,
      unitNumber: Intervention.value.equipment,
      form: filenamePDFDefect.value
    })
    if (isDataPrepared) {
      currentHeaderId.value = selectedDefectDownload.value.headerId
      downloadPdfDefect.value.handleDataFetch()
    }
  }
}
const handleChangeIconDownload = () => {
  const employee = {
    id: authStore.user.EmployeeId,
    name: authStore.user.Name
  }
  interventionDefectIdentifiedStore.updateDownloadHistory({
    ...selectedDefectDownload.value,
    employee
  })
}
const handleDefectIdentifiedDefectDetail = async (data: DefectDetailParam, idProperty) => {
  const baseDefect = (await interventionDefectStore.getDefectDetail(data[idProperty] as string,
    Intervention.value.trInterventionHeaderId,
    Intervention.value.sapWorkOrder,
    idProperty
  )) as IBasicDefect
  if (baseDefect.type == 'NO') {
    defectData.value = baseDefect as IDefectNoDetail
    showDefectNoView.value = true
  } else {
    decline.value = {} as Decline
    defectData.value = baseDefect as IDefectYesDetail
    const record = await interventionDefectStore.getDefectDecline(data.taskId)
    decline.value.isDecline = record.isDecline
    decline.value.declineReason = record.declineReason
    decline.value.declineDate = record.declineDate
    decline.value.declineBy = record.declineBy
    approvedDate.value = data.taskApprovedDate ?? ""
    approvedBy.value = data.taskApprovedBy ?? {} as Audit
    showDefectYesView.value = true
  }
}
const handleDefectIdentifiedNADetail = (taskId: string) => {
  const defect = interventionDefectIdentifiedStore.getNADetailData(taskId)
  if (defect) {
    defectData.value = JSON.parse(defect.defectData) as NADetail
    defectStatus.value = defect.cbmNAStatus
    decline.value = {} as Decline
    decline.value.declineReason = defect.declineReason || ""
    decline.value.declineDate = defect.declineDate || ""
    decline.value.declineBy = defect.declineBy || {} as Audit
    approvedBy.value = defect.approvedBy
    approvedDate.value = defect.approvedDate || ""
    showNAView.value = true
  }
}
const handleDefectIdentifiedCBMDetail = async (headerId: string) => {
  const tasks = Intervention.value.details[0].tasks
  const cbmDataDetail = interventionDefectIdentifiedStore.getCBMDetailData(headerId)
  let task;
  let images: string[] = []
  tasks.every((t) => {
    task = t.tasks.find((it) => {
      return it.key == headerId
    })
    if (task) {
      return false
    }
    return true
  })
  if (task) {
    if (task.psType) {
      const mappings = await db.cbmMapping.where({
        model: Intervention.value.equipmentModel,
        psType: task.psType
      }).first()
      const formulas = mappings?.detail.filter((k) => {
        return k.taskKey == task.key
      })
      ratingFormula.value = orderBy(formulas, ['uom', 'cbmRating', 'minValue'])
    } else {
      ratingFormula.value = []
    }
    if (task.adjustment && task.adjustment.pictures && task.adjustment.measurement) {
      images = task.adjustment.pictures
    } else {
      images = task.images
    }
  }
  cbmData.value = cbmDataDetail as Defect
  const header = interventionDefectIdentifiedStore.stateDefectHeader.find((header) => {
    return header.id == cbmData.value?.defectHeaderId
  })
  if (header) {
    if (header.appSPVBy) {
      cbmData.value.appSPVBy = header.appSPVBy
      cbmData.value.appSPVDate = header.appSPVDate
    }
    if (header.appPlannerBy) {
      cbmData.value.appPlannerBy = header.appPlannerBy
      cbmData.value.appPlannerDate = header.appPlannerDate
    }
  }
  cbmImages.value = stringToImageInfoConvert(images)
  showCBMView.value = true
}
const handleDefectsView = async ({
  param,
  task = {} as IDetailTask
}) => {
  switch (param.key) {
    case 'na':
      handleNAView(param)
      break
    case 'defect':
      handleDefectView(param)
      if (task) {
        interventionDetailStore.setSelectedTask(task)
      }
      break
  }
}
const handleDefectView = async (data: KeyValue) => {
  const baseDefect = (await interventionDefectStore.getDefectDetail(data.value,
    Intervention.value.trInterventionHeaderId,
    Intervention.value.sapWorkOrder,
    "taskId"
  )) as IBasicDefect
  const headerDefect = (await interventionDefectStore.getDefectHeader(data.value,
    Intervention.value.trInterventionHeaderId,
    Intervention.value.sapWorkOrder,
    "taskId"
  )) as Defect
  if (baseDefect.type == 'NO') {
    defectData.value = baseDefect as IDefectNoDetail
    showDefectNoView.value = true
  } else {
    decline.value = {} as Decline
    defectData.value = baseDefect as IDefectYesDetail
    const record = await interventionDefectStore.getDefectDecline(data.value)
    decline.value.isDecline = record.isDecline
    decline.value.declineReason = record.declineReason
    decline.value.declineDate = record.declineDate
    decline.value.declineBy = record.declineBy
    approvedBy.value = headerDefect.approvedBy
    approvedDate.value = headerDefect.approvedDate ?? ""
    showDefectYesView.value = true
  }
}
const handleNAView = async (data: KeyValue) => {
  const defect = (await interventionNAStore.getNADetail(data.value,
    Intervention.value.trInterventionHeaderId,
    Intervention.value.sapWorkOrder)) as Defect
  if (defect) {
    defectData.value = JSON.parse(defect.defectData) as NADetail
    defectStatus.value = defect.cbmNAStatus
    decline.value = {} as Decline
    decline.value.declineReason = defect.declineReason || ""
    decline.value.declineDate = defect.declineDate || ""
    decline.value.declineBy = defect.declineBy || {} as Audit
    approvedBy.value = defect.approvedBy
    approvedDate.value = defect.approvedDate || ""
    showNAView.value = true
  }
}
const handleDefectYesViewClose = () => {
  showDefectYesView.value = false
}
const handleDefectNoViewClose = () => {
  showDefectNoView.value = false
}
const handleNAViewClose = () => {
  showNAView.value = false
}
const handleCBMInfoViewClose = () => {
  showCBMView.value = false
}
const handleGoPrev = () => {
  const index = Groups.value.findIndex((g) => {
    return g.group == Group.value.group
  })
  const group = Groups.value[index - 1]
  interventionDetailStore.setSelectedGroup(group)
}
const handleGoNext = () => {
  const index = Groups.value.findIndex((g) => {
    return g.group == Group.value.group
  })
  const group = Groups.value[index + 1]
  interventionDetailStore.setSelectedGroup(group)
}
const setOwnerShip = (equipment) => {
  ownership.value = ""
  const ownerFind = masterStore.Ownership.find((owner) => {
    return owner.equipmentNumber == equipment
  })
  if (ownerFind) {
    ownership.value = ownerFind.ownership
  }
}
const filenamePDFDefect = computed(() => {
  return titlePdfIntervention(Intervention.value)
})
const smuTolerance = computed(() => {
  return interventionHeaderStore.smuTolerance
})
const minRangeValue = computed(() => {
  const smuValidation = Intervention.value.smuDue
  const tolerance = smuTolerance.value
  return Number((Number(smuValidation) + Number(tolerance.min)))
});
const maxRangeValue = computed(() => {
  const smuValidation = Intervention.value.smuDue
  const tolerance = smuTolerance.value
  return Number((Number(smuValidation) + Number(tolerance.max)))
});
const detailSMUDialog = computed((): DefectSMU => {
  return {
    title: MachineSMUEnum.MACHINESMUTITLE(),
    machineSMU: Intervention.value.interventionSMU as string,
    minRange: minRangeValue.value,
    maxRange: maxRangeValue.value,
    smuDue: Intervention.value.smuDue,
    assetNumber: Intervention.value.equipment,
    serialNumber: SerialNumber.value,
    images: JSON.stringify(Intervention.value.imageEquipment),
    hmOffset: Intervention.value.hmOffset ?? "0" as string,
    key: "",
    type: "",
    reason: "",
  }
})
const handleSMUReviseClicked = () => {
  showSMUDetailDialog.value = true
}

const saveSMU = async () => {
  const params = {} as DefectSMUFormData;
  params.id = Intervention.value.id;
  params.status = Intervention.value.interventionExecution;
  params.key = Intervention.value.key;
  params.value = pendingUpdateSMUParam.value.value;
  params.employee = {
    id: authStore.user.EmployeeId,
    name: authStore.user.Name,
  };
  params.submitDate = AESTCurrentDateTime();
  pendingUpdateSMUParam.value.submitDate = params.submitDate;

  // Assume the user logged in is the fitter (the one who updates the SMU)
  params.fitter = pendingUpdateSMUParam.value.fitter

  await interventionDetailStore.updateSMU({
    value: pendingUpdateSMUParam.value.value,
    smuBy: pendingUpdateSMUParam.value.fitter!,
    smuDate: params.submitDate
  })
  params.detail = {
    isInRange: pendingUpdateSMUParam.value.isInRange,
    range: {
      minRange: minRangeValue.value,
      maxRange: maxRangeValue.value
    },
    serialNumber: SerialNumber.value,
  }
  params.idGenerated = uuidv4()

  // lempar ke defect
  // interventionDefectStore.createDefectSMU(params)
  await interventionDefectStore.updateDefectSMUMonitoring(params)
  pendingUpdateSMUParam.value = {} as UpdateSMUParam
}

const handleReviseSMU = async (params: submitDetailParameter) => {
  // param for update
  const newParams = {} as UpdateSMUParam;
  newParams.id = Intervention.value.id;
  newParams.status = Intervention.value.interventionExecution;
  newParams.key = Intervention.value.key;
  newParams.value = params.newDetail.machineSMU;
  newParams.employee = {
    id: authStore.user.EmployeeId,
    name: authStore.user.Name,
  };
  const isInRange = !params.newDetail.title.toLowerCase().includes("not")
  newParams.isInRange = isInRange

  // Assume the user logged in is the fitter (the one who updates the SMU)
  newParams.fitter = {
    id: authStore.user.EmployeeId,
    name: authStore.user.Name,
  }

  // check gambar
  if (!isEmpty(revisedImageParam.value)) {
    await interventionHeaderStore.createTaskImage(revisedImageParam.value);
    interventionDetailStore.updateEquipmentImageData(revisedImageParam.value)
  }
  pendingUpdateSMUParam.value = newParams
  await saveSMU()
  interventionDefectIdentifiedStore.setDefectIdentifiedData(Intervention.value.sapWorkOrder)
  params.callback()
}

const handleCameraClick = (param: CameraParam) => {
  if (param.type == "value") {
    showCloseButtonCamera.value = false;
  }
  cameraStore.setCameraVisible(true);
  cameraStore.setCurrentType(param.type);
  key.value = param.key;
};

const handleRetakePhotoRevise = () => {
  handleCameraClick({
    type: cameraIDRevise,
    key: 'value'
  })
}
const resetCameraState = () => {
  cameraStore.setCameraVisible(false);
  cameraStore.setCurrentType("");
  isPreview.value = false;
  imageUrl.value = "";
  blobImage.value = undefined;
  key.value = "";
};
const closeSMUToleranceNotMappedModal = () => {
  showSMUToleranceNotMapped.value = false
}

const handleCameraSwitch = (value: boolean) => {
  isSwitchingCamera.value = value;
};
const handleCloseCameraClick = () => {
  cameraStore.setCameraVisible(false);
  showCloseButtonCamera.value = true;
  isSwitchingCamera.value = false;
  resetCameraState();
};
const handleCloseCamera = (reset: boolean) => {
  cameraStore.setCameraVisible(false);
  isSwitchingCamera.value = false;
  showCloseButtonCamera.value = true;
  if (reset) resetCameraState();
};
const handleSnapshotCreated = (blob: Blob) => {
  blobImage.value = blob;
  const url = URL.createObjectURL(blob);
  isPreview.value = true;
  imageUrl.value = url;
};
const handleFileUpload = async (acceptFiles) => {
  errorImageList.value = [];
  if (acceptFiles.length < 1) return;
  const loading = ElLoading.service({
    lock: true,
    text: "Uploading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  let isFilePassValidation = true;
  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
  if (
    !validImageTypes.includes(acceptFiles[0].type)
  ) {
    isFilePassValidation = false;
    errorImageList.value.push(acceptFiles[0].name);
  }
  if (!isFilePassValidation) {
    if (errorImageList.value.length > 0) {
      cameraStore.setCameraVisible(false);
      errorUploadVisible.value = true;
      loading.close();
    }
  } else {
    blobImage.value = acceptFiles[0];
    const url = URL.createObjectURL(acceptFiles[0]);
    isPreview.value = true;
    imageUrl.value = url;
    loading.close();
  }
};

const handleSnapshotSave = async (
  description: string | null | undefined,
  drawImage: Blob,
) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Uploading Picture",
    background: "rgba(0, 0, 0, 0.7)",
  });
  let fileName = generateString(15);
  if (description) {
    descriptionValue.value = encodeURI(description);
  }
  const imageInfo = {
    filename: fileName,
    description: descriptionValue.value,
  };
  let finalImage = drawImage
  // convert to webp
  try {
    const convertedImage = await convertToWebP(finalImage);
    finalImage = new File([convertedImage.file], `${fileName}.webp`)
  } catch (error: any) {
    console.error(error.message);
  }
  await saveImage([imageInfo], [finalImage]);
  descriptionValue.value = "";
  handleCloseCamera(true);
  loading.close();
};
const handleBackToCapture = () => {
  isPreview.value = false;
  imageUrl.value = "";
  descriptionValue.value = "";
};
const handleOpenDescriptionForm = () => {
  descriptionFormVisible.value = true;
};
const handleCloseFailedUploadDialog = () => {
  errorUploadVisible.value = false;
  cameraStore.setCameraVisible(true);
};
const handleCloseDescriptionForm = () => {
  descriptionFormVisible.value = false;
};
const handleSaveDesc = (desc: string) => {
  descriptionValue.value = desc;
  descriptionFormVisible.value = false;
};
const saveImage = async (filenames: ImageInfo[], blobs: Blob[]) => {
  const params = {} as ImagePayload;
  params.id = Intervention.value.id;
  params.key = key.value;
  params.type = currentCameraType.value;
  params.employee = {
    id: authStore.user.EmployeeId,
    name: authStore.user.Name,
  };
  params.files = filenames;
  params.blobs = blobs;
  params.submitDate = AESTCurrentDateTime();
  try {
    switch (currentCameraType.value) {
      case cameraIDRevise:
        // revise SMU
        params.key = Intervention.value.key;
        params.type = "imageEquipment"
        revisedImageParam.value = {
          ...params
        }
        imageObjectRevise.value = {
          Id: cameraIDRevise,
          ImageBlobs: blobs,
          ImageInfos: filenames,
        }
        break;
    }
  } catch (error) {
    console.log(error);
  }
};
onMounted(() => {
  setOwnerShip(Intervention.value.equipment)
})
onBeforeMount(async () => {
  await interventionHeaderStore.getSMUTolerance();
  console.log(Intervention.value, Intervention.value.defectStatus)
})
watch(() => {
  return Group.value.group
}, async (newVal) => {
  if (newVal == 'Identified Defects') {
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading the page',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    await interventionDefectIdentifiedStore.getDefectsData(Intervention.value.id, Intervention.value.sapWorkOrder)
    await interventionDefectIdentifiedStore.setDefectIdentifiedData(Intervention.value.sapWorkOrder)
    loading.close()
  } else {
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading the page',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    await interventionDetailStore.updateIntervention()
    loading.close()
  }
})
</script>

<style lang="scss" scoped>
.e-form-container {
  font-family: 'Public sans' !important;
}
</style>
