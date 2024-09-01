<template>
  <div ref="defectDetailRef">
    <BackNavigator :title="`${defectSheetStore.SelectedDefectSheet?.form}`" :component-router-push="'defects'" />
    <DefectInformationHeader />
    <DefectSMUPanel :key="key" :view-only="false" :planner-approve="false" :supervisor="true"
      @on-refresh-data="onRefreshData" @on-get-position-y="getPosition" />
    <DefectPanel :key="key" :view-only="false" :is-approval="true" :supervisor="true" @on-refresh-data="onRefreshData"
      :view-is-download="true" @on-get-position-y="getPosition" title="Repairs Completed" />
    <DefectPanel :key="key" :view-only="false" :is-approval="true" :supervisor="true" @on-refresh-data="onRefreshData"
      :view-is-download="true" @on-get-position-y="getPosition" title="Further Action Required" />
    <DefectPanelGeneric :key="key" :view-only="false" :is-approval="true" :supervisor="true"
      @on-refresh-data="onRefreshData" :view-is-download="true" :disable-add-generic="true" title="Repairs Completed" />
    <DefectPanelGeneric :key="key" :view-only="false" :is-approval="true" :supervisor="true"
      @on-refresh-data="onRefreshData" :view-is-download="true" :disable-add-generic="true" title="Further Action Required" />
    <CrackPanel :key="key" :view-only="false" :is-approval="true" :supervisor="true" @on-refresh-data="onRefreshData"
      :view-is-download="true" @on-get-position-y="getPosition" title="Repairs Completed" />
    <CrackPanel :key="key" :view-only="false" :is-approval="true" :supervisor="true" @on-refresh-data="onRefreshData"
      :view-is-download="true" @on-get-position-y="getPosition" title="Further Action Required" />
    <CBMPanel :headers="store.ApprovalData.CBMHeaders" :is-disabled="!statusIsSubmitted"
      @on-refresh-data="onRefreshData" />
    <NAPanel :title="'Not Applicable Item Check'" :headers="store.ApprovalData.DefectNAHeaders" :is-defect="true"
      @on-refresh-data="onRefreshData" :is-disabled="!statusIsSubmitted" @on-get-position-y="getPosition" />
    <NAPanel :title="'Not Applicable Crack Check'" :headers="store.ApprovalData.CrackNAHeaders" :is-defect="false"
      @on-refresh-data="onRefreshData" :is-disabled="!statusIsSubmitted" @on-get-position-y="getPosition" />
    <CommentPanel :headers="dataComments" />
    <div class="p-2 py-5 d-flex justify-content-end mt-20 border-top border-top-2">
      <template v-if="store.ApprovalData.DefectHeaders.length == 0 &&
      store.ApprovalData.CrackHeaders.length == 0 &&
      store.ApprovalData.CrackNAHeaders.length == 0 &&
      store.ApprovalData.DefectNAHeaders.length == 0 &&
      store.ApprovalData.CBMHeaders.length == 0
      ">
        <NoDefect message="Service sheet was completed in full and no issues were identified." />
      </template>
      <button class="btn btn-success" style="
          background: #18af4a;
          box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24);
          color: white;
        " :disabled="!isDisabled" @click="onSave">
        Approve
      </button>
    </div>
  </div>
  <Cameras :visibility="camstore.isVisible" />
  <Confirmation :visibility="confirmVisible" caption="Please confirm this defect information is correct."
    @on-no-confirm="onCancel" @on-yes-confirm="onSave" />
  <MessageBox :show="messageBoxVisible" @close="onOk" message="Data successfully approved" />
  <ErrorBox :visibility="errorMessageBoxVisible" :caption="defectSheetStore.Error" @on-close="onErrorOk" />
  <PDFViewerDialog :show="previewPDF" @handle-close-modal="closePDF" :blob-url="pdfBlobUrl" />
  <InformationPopUp :show="showPrintPopUp" @close="changePrintPopUpStatus"
    :title-pop-up="'if required, see your supervisor to print this'" />

  <Toast :visibility="isApprovalError"
    caption="You cannot approve this digital service sheet because another user already approved." />

  <InformationPopUp :show="isNetworkDisable" @close="closeNoNetworkDialog" :title-pop-up="'No internet connection'" />
</template>

<script lang="ts" setup>
import DefectInformationHeader from "@/views/dma/components/defects/DefectInformationHeader.vue";
import DefectSMUPanel from "@/views/dma/components/defects/DefectSMUPanel.vue";
import DefectPanel from "@/views/dma/components/defects/DefectPanel.vue";
import DefectPanelGeneric from "@/views/dma/components/defects/DefectPanelGeneric.vue";
import CrackPanel from "@/views/dma/components/defects/CrackPanel.vue";
import CBMPanel from "@/views/dma/components/defects/CBMPanel.vue";
import NAPanel from "@/views/dma/components/defects/NAPanel.vue";
import CommentPanel from "@/views/dma/components/defects/CommentPanel.vue";
import Cameras from "@/components/camera/Cameras.vue";
import { useCameraStore } from "@/store/pinia/application/useCameraStore";
import {
  useDefectsStore
} from "@/store/pinia/dma/e-form/defects/useDefectsStore";
import {
  useDefectSheetStore
} from "@/store/pinia/dma/defect-approval/useDefectSheetStore";
import {
  onUnmounted,
  onMounted,
  computed,
  ref,
  onBeforeMount,
  watch,
} from "vue";
import navigator from "@/core/mixins/navigator";
import Confirmation from "@/components/dialog/Confirmation.vue";
import MessageBox from "@/components/dialog/MessageBox.vue";
import ErrorBox from "@/components/alert/ErrorBox.vue";
import { ElLoading } from "element-plus";
import BackNavigator from "@/views/dma/components/form-preview/components/BackNavigator.vue";
import { useEFormStore } from "@/store/pinia/dma/e-form/useEFormStore";
import PDFViewerDialog from "@/components/e-form/PDFViewerDialog.vue";
import InformationPopUp from "@/components/dialog/InformationPopUp.vue";
import { isUndefined, isEmpty } from "lodash";
import NoDefect from "@/components/dma/defect/NoDefect.vue";
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore";
import { useRouter } from "vue-router";
import {
  filterByPriority,
  validationNAApprovalPanel,
} from "@/store/pinia/dma/e-form/helpers";
import Toast from "@/components/dialog/Toast.vue";
import {
  ApprovalErrorMessages,
  NoNetworkMessages
} from "@/store/enums/ErrorMessagesEnum"

const store = useDefectsStore();
const formStore = useEFormStore();
const defectSheetStore = useDefectSheetStore();
const defectStore = useDefectsFormStore();
const camstore = useCameraStore();
const router = useRouter();

const messageBoxVisible = ref(false);
const errorMessageBoxVisible = ref(false);
const confirmVisible = ref(false);
const positionY = ref(0);

const isNetworkDisable = computed(() => {
  return store.stateErrorByNetwork
})

const key = computed(() => {
  return store.DefectKey;
});

const dataComments = computed(() => {
  return store.Comments.slice().sort(compareComments);
});

const compareComments = (a, b) => {
  const numA = parseInt(a.taskDesc.split(";;")[0]);
  const numB = parseInt(b.taskDesc.split(";;")[0]);
  return numA - numB;
};

/* helpers */
const { redirectByLink } = navigator();

const statusIsSubmitted = computed(() => {
  return defectSheetStore.SelectedDefectSheet?.eFormStatus == "Submited";
});

const isDisabled = computed(() => {
  const priorities = ["P1", "P2"];
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

  const cracksRaw = filterByPriority(
    store.ApprovalData.CrackHeaders,
    priorities,
  );
  const cracks = cracksRaw.every((e) => {
    return e.status == "Acknowledge" || e.status == "Decline";
  });
  const cbms = store.ApprovalData.CBMHeaders.every((e) => {
    return e.cbmNAStatus === "Confirmed";
  });
  const naDefects = validationNAApprovalPanel(
    store.ApprovalData.DefectNAHeaders,
  );
  const crackDefects = validationNAApprovalPanel(
    store.ApprovalData.CrackNAHeaders,
  );
  let statusDefectSMU = true;
  if (Object.keys(store.DefectSMUHeader).length > 0) {
    statusDefectSMU = store.DefectSMUHeader.status === "Acknowledge";
  }
  return (
    defects &&
    defectsGeneric &&
    cracks &&
    cbms &&
    naDefects &&
    crackDefects &&
    statusIsSubmitted.value &&
    statusDefectSMU
  );
});

// const approveEForm = async () => {
//   confirmVisible.value = true;
// }

const isApprovalError = computed(() => {
  return defectSheetStore.stateSheetAlreadyApproved;
});
watch(
  () => {
    return isApprovalError.value;
  },
  (val) => {
    if (val) {
      setTimeout(() => {
        defectSheetStore.stateSheetAlreadyApproved = false;
        router.push({
          name: "defects",
        });
      }, 3000);
    }
  },
);
const onSave = async () => {
  confirmVisible.value = false;
  const loader = ElLoading.service({
    lock: true,
    text: "Processing...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  await defectSheetStore.approveDefectSheetBySupervisor();
  loader.close();
  /* back to list */
  if (defectSheetStore.IsError) {
    errorMessageBoxVisible.value = true;
    return;
  }
  defectSheetStore.reset();
  messageBoxVisible.value = true;
};
const onCancel = () => {
  confirmVisible.value = false;
};
const onOk = () => {
  messageBoxVisible.value = false;
  redirectByLink("/ironforms/defects");
};

const onErrorOk = () => {
  errorMessageBoxVisible.value = false;
  if (defectSheetStore.Error != ApprovalErrorMessages.INCOMPLETE_DATA && defectSheetStore.Error != NoNetworkMessages.NO_NETWORK_VIEW) {
    redirectByLink('/ironforms/defects');
  }
};

const defectDetailRef = ref(null) as any;
const pdfBlobUrl = ref("");
const previewPDF = ref(false);
const showPrintPopUp = ref(false);

const changePrintPopUpStatus = (status) => {
  showPrintPopUp.value = status;
};

onBeforeMount(() => {
  if (
    !defectSheetStore.SelectedDefectSheet ||
    isEmpty(defectSheetStore.SelectedDefectSheet)
  ) {
    router.push({
      name: "defects",
    });
  }
});

const getPosition = () => {
  positionY.value = window.scrollY;
};

const onRefreshData = async () => {
  const loader = ElLoading.service({
    lock: true,
    text: "Refresh Data...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  await store.getDefectsData(defectSheetStore.SelectedDefectSheet.workOrder);
  loader.close();
};

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
    console.log("defectSheetStore.SelectedDefectSheet", defectSheetStore.SelectedDefectSheet)
    const arr = defectSheetStore.SelectedDefectSheet.equipmentModel
      .split(" ")[0]
      .split("-");
    let equipmentModel = [...new Set(arr)].join("-");
    if (
      !isUndefined(
        defectSheetStore.SelectedDefectSheet.equipmentModel.split(" ")[1],
      )
    ) {
      equipmentModel = `${equipmentModel} ${defectSheetStore.SelectedDefectSheet.equipmentModel.split(" ")[1]}`;
    }
    formStore.setModelAndPsTypeId(
      "",
      defectSheetStore.SelectedDefectSheet.psType,
      "",
      equipmentModel,
      "",
    );
    await formStore.getEhmsRating();
    await defectStore.getOwnershipDefectForm(
      defectSheetStore.SelectedDefectSheet.unitNumber,
    );
  }
  attachmentClickHandler("show-pdf", false)
  attachmentClickHandler("spv-print-pdf", true)
  store.setCurrentUserGroup("Supervisor")
  defectStore.getPartReference(defectSheetStore.SelectedDefectSheet.unitNumber);
  loading.close()
});

const attachmentClickHandler = (className, shouldChangePrintPopUp) => {
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
onUnmounted(() => {
  camstore.reset();
});
const closePDF = () => {
  previewPDF.value = false;
};
</script>
