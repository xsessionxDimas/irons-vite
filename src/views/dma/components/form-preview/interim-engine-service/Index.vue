<template>
  <div class="row m-0 p-5 bg-white e-form-container interim-container">
    <BackNavigator
    :title="title"
    :formName="`${previewStore.generalForm.form} (Ver. ${previewStore.generalForm.version})`"
    :component-router-push="pageFrom"
    :form-status="previewStore.generalForm.status"
    :percentage-progress="progressPercentage"
    :approve-history="approvalHistory"
    :defect-status="previewStore.generalForm.defectStatus" />
    <GroupStepper :groups="groups"/>
    <!-- show general -->
    <template v-if="previewStore.selectedGroup?.groupName == 'General-interim'">
      <General :general="previewStore.generalForm" />
    </template>
    <!-- show service sheet detail -->
    <template v-else v-for="subGroup in selectedSubGroups" :key="subGroup.key">
      <SubGroup :subGroup="subGroup"/>
    </template>
    <!-- footer / next button -->
    <slot name="buttonEndOfGroup" v-if="!showNextButton"></slot>
    <FooterForm v-if="showFooter"/>
  </div>
  <!-- view NA -->
  <ViewOnlyNAForm :visibility="viewNAVisibility" />
  <ViewOnlyNAReasonDialog />
</template>
<script setup lang="ts">
import {
  computed,
  defineProps,
  onUnmounted,
  onMounted,
  onBeforeMount
} from 'vue'
import GroupStepper from './GroupStepper.vue'
import SubGroup from './sub-group/SubGroup.vue'
import FooterForm from './Footer.vue'
import BackNavigator from './BackNavigator.vue'
import General from './general/Index.vue'
import {
  useInterimPreviewDefectFormStore
} from '@/store/pinia/dma/preview-form-interim/useInterimPreviewDefectFormStore'
import ViewOnlyNAForm from '@/views/dma/components/defects/interim-engine-service/ViewOnlyNAForm.vue'
import {
  useInterimPreviewCrackFormStore
} from '@/store/pinia/dma/preview-form-interim/useInterimPreviewCrackFormStore'
import {
  useInterimPreviewNaFormStore
} from '@/store/pinia/dma/preview-form-interim/useInterimPreviewNaFormStore'
import { useRouter } from 'vue-router'
import {
  useInterimPreviewFormStore
} from '@/store/pinia/dma/preview-form-interim/useInterimPreviewFormStore'
import { useSlots } from 'vue'
import {
  useDefectSheetStore
} from '@/store/pinia/dma/defect-approval/useDefectSheetStore'
import ViewOnlyNAReasonDialog from "@/views/dma/components/defects/ViewOnlyNAReasonDialog.vue"
import {
  useInterimDefectsStore
} from '@/store/pinia/dma/interim-engine-service/defects/useInterimDefectsStore'
import {
  useDefectsFormStore
} from '@/store/pinia/dma/e-form/defects/useDefectsFormStore'

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
  }
})

const previewStore = useInterimPreviewFormStore()
const defectStore = useInterimPreviewDefectFormStore()
const eFormDefectStore = useDefectsFormStore()
const crackStore = useInterimPreviewCrackFormStore()
const naStore = useInterimPreviewNaFormStore()
const defectSheetStore = useDefectSheetStore()
const store = useInterimDefectsStore();

const router = useRouter()

const groups = computed(() => {
  return previewStore.groups
})

const approvalHistory = computed(() => {
  if (previewStore.generalForm.defectStatus != 'Completed') return undefined
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
  defectSheetStore.updateSelectedWO(
    previewStore.generalForm.workOrder,
    previewStore.generalForm.modelId,
    previewStore.generalForm.equipment,
    previewStore.generalForm.psTypeId
  )
})

onBeforeMount(async () => {
  await eFormDefectStore.getOwnershipDefectForm(defectSheetStore.SelectedDefectSheet.unitNumber)
  previewStore.setSerialNumberGeneral(eFormDefectStore.SerialNumber)
  await store.getDefectsData(defectSheetStore.SelectedDefectSheet.workOrder);
})

onUnmounted(() => {
  previewStore.resetPreview()
})
</script>

<style lang="scss">
.interim-container {
  .stepper-button{
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
  .e-form-container {
    font-family: 'Public sans' !important;
  }
</style>

