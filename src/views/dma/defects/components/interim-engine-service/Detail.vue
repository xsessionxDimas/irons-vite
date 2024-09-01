<template>
    <div ref="defectDetailRef">
      <BackNavigator :title="`${defectSheetStore.SelectedDefectSheet?.form}`" component-router-push="defects" />
      <DefectInformationHeader />
      <DefectSMUPanel
        :key="key"
        :view-only="false"
        :supervisor="true"
        @on-refresh-data="onRefreshData"
        @on-get-position-y="getPositon"
      />
      <CBMPanel
        :headers="store.ApprovalData.CBMHeaders"
        :is-disabled="!statusIsSubmitted"
        @on-refresh-data="onRefreshData"
      />
      <NAPanel :title="'Not Applicable Item Check'" :headers="store.ApprovalData.DefectNAHeaders" :is-defect="true" :is-disabled="!statusIsSubmitted" @on-refresh-data="onRefreshData" @on-get-position-y="getPositon" />
      <CommentPanel :headers="dataComments" />
      <div class="p-2 py-5 d-flex justify-content-end mt-20 border-top border-top-2">
        <template v-if="store.ApprovalData.DefectNAHeaders.length == 0 && store.ApprovalData.CBMHeaders.length == 0 && store.DefectSMUHeader == undefined">
          <NoDefect message="Interim Engine Service sheet was completed in full and no issues were identified." />
        </template>
        <button class="btn btn-success" style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white"
          :disabled="!isDisabled"
          @click="onSave">Approve</button>
      </div>
    </div>
    <Cameras :visibility="camstore.isVisible" />
    <Confirmation :visibility="confirmVisible"
        caption="Please confirm this defect information is correct."
        @on-no-confirm="onCancel"
        @on-yes-confirm="onSave" />
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
import CBMPanel from '@/views/dma/components/defects/interim-engine-service/CBMPanel.vue';
import NAPanel from '@/views/dma/components/defects/interim-engine-service/NAPanel.vue';
import CommentPanel from "@/views/dma/components/defects/CommentPanel.vue";
import DefectSMUPanel from "@/views/dma/components/defects/interim-engine-service/DefectSMUPanel.vue";
import DefectInformationHeader from "@/views/dma/components/defects/DefectInformationHeader.vue";
import {
  useInterimDefectsStore
} from '@/store/pinia/dma/interim-engine-service/defects/useInterimDefectsStore'
import {
  useInterimDefectSheetStore
} from '@/store/pinia/dma/defect-approval-interim/useInterimDefectSheetStore'
import {
  onUnmounted,
  onMounted,
  computed,
  ref,
  onBeforeMount,
  watch
} from 'vue'
import navigator from "@/core/mixins/navigator"
import Confirmation from "@/components/dialog/Confirmation.vue"
import MessageBox from "@/components/dialog/MessageBox.vue"
import ErrorBox from '@/components/alert/ErrorBox.vue'
import { ElLoading } from 'element-plus'
import BackNavigator from "@/views/dma/components/form-preview/components/BackNavigator.vue"
import { useEFormStore } from '@/store/pinia/dma/e-form/useEFormStore'
import PDFViewerDialog from '@/components/e-form/PDFViewerDialog.vue'
import InformationPopUp from '@/components/dialog/InformationPopUp.vue'
import { isUndefined, isEmpty } from 'lodash'
import NoDefect from '@/components/dma/defect/NoDefect.vue'
import { useRouter } from 'vue-router';
import Toast from '@/components/dialog/Toast.vue'
import { validationNAApprovalPanel } from "@/store/pinia/dma/e-form/helpers";
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore";
import {
  ApprovalErrorMessages,
  NoNetworkMessages
} from "@/store/enums/ErrorMessagesEnum"

const store = useInterimDefectsStore();
const formStore = useEFormStore();
const defectSheetStore = useInterimDefectSheetStore();
const defectStore = useDefectsFormStore();
const camstore = useCameraStore()
const router = useRouter();

const messageBoxVisible = ref(false);
const errorMessageBoxVisible = ref(false);
const confirmVisible = ref(false);

const key = computed(() => {
  return store.DefectKey;
});

const isNetworkDisable = computed(() => {
  return store.stateErrorByNetwork
})

/* helpers */
const { redirectByLink } = navigator();

const statusIsSubmitted = computed(() => {
  return defectSheetStore.SelectedDefectSheet?.eFormStatus == "Submited"
})

const dataComments = computed(() => {
  return store.Comments.slice().sort(compareComments);
})

const compareComments = (a, b) => {
  const numA = parseInt(a.taskDesc.split(";;")[0]);
  const numB = parseInt(b.taskDesc.split(";;")[0]);
  return numA - numB;
}

const isDisabled = computed(() => {
  const cbms = store.ApprovalData.CBMHeaders.every((e) => {
    return e.cbmNAStatus === "Confirmed";
  });
  const naDefects = validationNAApprovalPanel(store.ApprovalData.DefectNAHeaders)
  let statusDefectSMU = true;
  if (store.DefectSMUHeader) {
    statusDefectSMU = store.DefectSMUHeader.status === 'Acknowledge';
  }
  return cbms && naDefects && statusIsSubmitted.value && statusDefectSMU;
});

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
          name: 'defects'
        })
      }, 3000);
    }
  }
)
const onSave = async () => {
  confirmVisible.value = false;
  const loader = ElLoading.service({
    lock: true,
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  await defectSheetStore.approveDefectSheetBySupervisor();
  loader.close();
  if (defectSheetStore.IsError) {
    errorMessageBoxVisible.value = true
    return
  }
  /* back to list */
  defectSheetStore.reset();
  messageBoxVisible.value = true;
}
const onCancel = () => {
  confirmVisible.value = false;
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
  }
});

const positionY = ref(0)
const scrollDocument = () => {
  window.scroll(0, positionY.value)
}
const getPositon = () => {
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

const closeNoNetworkDialog = () => {
  store.toggleErrorByNetwork(false)
  router.push({
    name: "defects",
  });
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
  store.setCurrentUserGroup("Supervisor")
  loading.close()
});

const closePDF = () => {
  previewPDF.value = false
}
onUnmounted(() => {
  camstore.reset();
});
</script>
