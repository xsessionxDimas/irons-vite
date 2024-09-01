<template>
    <div class="row m-0 p-5 bg-white e-form-container">
      <BackNavigator
      :hideBackBtnComp=hideBackBtnComp
      :title="title"
      :formName="`${previewStore.generalForm.form} (Rel. ${previewStore.generalForm.releasedDate})`"
      :component-router-push="pageFrom" :form-status="previewStore.generalForm.status"
      :percentage-progress="progressPercentage"
      :approve-history="approvalHistory"
      :show-status="!viewEmpty"
      :defect-status="previewStore.generalForm.defectStatus" />
      <GroupStepper :groups="groups" :view-empty="viewEmpty"/>
      <!-- show general -->
      <template v-if="previewStore.selectedGroup?.groupName == 'General'">
        <General :general="previewStore.generalForm" :view-empty="viewEmpty" />
      </template>
      <!-- show service sheet detail -->
      <template v-else v-for="subGroup in selectedSubGroups" :key="subGroup.key">
        <SubGroup :subGroup="subGroup" :is-monitoring="isMonitoring" />
      </template>
      <!-- show defect identified-->
      <template v-if="previewStore.selectedGroup?.groupName == 'DEFECT_IDENTIFIED_SERVICE'">
        <DefectIdentified :is-close="previewStore.generalForm.status == 'Close' && (previewStore.generalForm.defectStatus == 'Completed' || previewStore.generalForm.defectStatus == 'Approved (PLN)')" />
      </template>
      <!-- footer / next button -->
      <slot name="buttonEndOfGroup" v-if="!showNextButton"></slot>
      <FooterForm v-if="showFooter"/>
    </div>
    <!-- view defect preview -->
    <DefectForm
      :status="(store.GeneralStatus)"
      :visibility="viewDefectYesVisibility"
      :defect-data="(store.DefectFormData as DefectYesClass)"
      :header-id="''"
      :work-order="''"
      :view-only="true"
      :fitter-id="''"
      :task-id="''"
      :plannerApprove="true"
      :is-form="false"
      :is-complete="(store.CompleteStatus)"
      @close-form="() => store.setViewDefectVisible(false)"
    />
    <!-- view crack preview -->
    <CrackForm
    :status="(store.GeneralStatus)"
    :visibility="viewCrackYesVisibility"
    :header-id="''"
    :work-order="''"
    :view-only="true"
    :fitter-id="''"
    :task-id="''"
    :plannerApprove="true"
    :is-complete="(store.CompleteStatus)"
    :crack-data="(store.CrackFormData as CrackYesClass)"
    @close-form="() => store.setViewCrackVisible(false)" />

    <!-- view NA -->
    <ViewOnlyNAForm :visibility="viewNAVisibility" />
    <ViewOnlyNAReasonDialog />
  </template>
<script setup lang="ts">
import {
  computed,
  defineProps,
  onUnmounted,
  onMounted
} from 'vue'
import GroupStepper from './components/GroupStepper.vue'
import DefectForm from '@/views/dma/components/defects/offline/DefectForm.vue';
import CrackForm from "@/views/dma/components/defects/offline/CrackForm.vue";
import SubGroup from './components/sub-group/SubGroup.vue'
import FooterForm from './components/Footer.vue'
import BackNavigator from './components/BackNavigator.vue'
import General from './components/general/Index.vue'
import DefectYesClass from '@/core/classes/DefectYesClass'
import ViewOnlyNAForm from '@/views/dma/components/defects/ViewOnlyNAForm.vue'
import CrackYesClass from '@/core/classes/CrackYesClass'
import {
  usePreviewNaFormStore
} from '@/store/pinia/dma/preview-form/usePreviewNaFormStore'
import { useRouter } from 'vue-router'
import DefectIdentified from './components/defect-identified/Index.vue'
import {
  usePreviewFormStore
} from '@/store/pinia/dma/preview-form/usePreviewFormStore'
import { useSlots } from 'vue'
import {
  useDefectSheetStore
} from '@/store/pinia/dma/defect-approval/useDefectSheetStore'
import {
  useDefectsFormStore
} from '@/store/pinia/dma/e-form/defects/useDefectsFormStore'
import {
  useDefectsFormStore as useOfflineDefectStore
} from '@/store/pinia/dma/e-form-offline/defects/useDefectsFormStore'
import ViewOnlyNAReasonDialog from "@/views/dma/components/defects/ViewOnlyNAReasonDialog.vue"
import {
  useDefectsStore
} from '@/store/pinia/dma/e-form-offline/defects/useDefectsStore';

const slots = useSlots()

const showNextButton = computed(() => {
  const currentGroup = previewStore.stateGroups.findIndex((group) => {
    return group.groupName == previewStore.stateSelectedGroup?.groupName
  })
  if (currentGroup + 1 >= previewStore.groups.length) {
    return false
  }
  return true
})

const showFooter = computed(() => {
  if (slots.buttonEndOfGroup) {
    if (!showNextButton.value) {
      return false
    }
    return true
  }
  return true
})

const progressPercentage = computed(() => {
  return previewStore.percentageTaskProgressAllTab
})

const props = defineProps({
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
  },
  viewEmpty: {
    type: Boolean,
    required: false,
    default: false
  },
  hideBackBtnComp: {
    type: Boolean,
    required: false,
    default: false
  }
})

const previewStore = usePreviewFormStore()
const naStore = usePreviewNaFormStore()
const defectSheetStore = useDefectSheetStore()
const defectFormStore = useDefectsFormStore();
const offlineDefectStore = useOfflineDefectStore();

const store = useDefectsStore();

const router = useRouter()

const groups = computed(() => {
  return previewStore.groups
})

const isMonitoring = computed(() => {
  return props.pageFrom == 'monitoringstatus'
})

const viewDefectYesVisibility = computed(() => {
  return store.ViewDefectVisible;
})
const viewCrackYesVisibility = computed(() => {
  return store.ViewCrackVisible
})
const approvalHistory = computed(() => {
  if (previewStore.generalForm.defectStatus != 'Completed') return undefined
  if (!store.ApproveBy?.name || store.ApproveDate) {
    return undefined
  }
  return `${store.ApproveBy?.name}, ${store.ApproveDate}`
})

const viewNAVisibility = computed(() => {
  return naStore.ViewVisible
})

const selectedSubGroups = computed(() => {
  return previewStore.selectedSubGroups
})

onMounted(() => {
  const model = previewStore.stateModelId == ''
  const psType = previewStore.statePsTypeId == ''
  const workOrder = previewStore.stateWorkOrder == ''
  if (model || psType || workOrder) router.push({ name: props.pageFrom })
  if (!props.viewEmpty) {
    defectSheetStore.updateSelectedWO(
      previewStore.generalForm.workOrder,
      previewStore.generalForm.modelId,
      previewStore.generalForm.equipment,
      previewStore.generalForm.psTypeId
    )
    defectFormStore.getOwnershipDefectForm(defectSheetStore.SelectedDefectSheet.unitNumber)
    offlineDefectStore.getOwnershipDefectForm(defectSheetStore.SelectedDefectSheet.unitNumber)
    defectFormStore.getPartReference(defectSheetStore.SelectedDefectSheet.unitNumber)
    offlineDefectStore.getPartReference(defectSheetStore.SelectedDefectSheet.unitNumber)
    store.getDefectsData(previewStore.generalForm.workOrder)
  }
})

onUnmounted(() => {
  previewStore.resetPreview()
  previewStore.resetDefectMultiList()
})
</script>

  <style lang="scss" scoped>
    .e-form-container {
      font-family: 'Public sans' !important;
    }
  </style>

