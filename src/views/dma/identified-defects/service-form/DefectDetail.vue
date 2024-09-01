<template>
  <div ref="defectDetailRef">
    <BackNavigator
      :title="`${defectSheetStore.SelectedDefectSheet?.form}`"
      :component-router-push="'identifieddefects'"
    />
    <el-collapse v-model="activeTaskGroup" class="general-accordion task-group py-1 px-5 mb-3">
      <el-collapse-item name="Equipment Information">
          <template #title>
            <h4 class="subtitle ps-3">Service Labour Personnel</h4>
          </template>
          <div class="p-2 me-0">
            <div class="row" style="width:101%">
              <div class="col-12 pe-0">
                <SelectSearch ref="selectFitter" :field-label="'Labour Personnel Name'" placeholder="Select your name"
                  :data="personelStore.PersonelLabours" :value="selectedEmployee?.name" :display-label="true" @on-focus="onSelectFocus"
                  @on-lost-focus="onSelectLostFocus" @on-selected="onPersonnelSelected" />
              </div>
            </div>
          </div>
      </el-collapse-item>
    </el-collapse>
    <DefectInformationHeader />
    <DefectPanel
      :key="key"
      :view-only="false"
      :is-approval="false"
      :fitter-id="fitter"
      :supervisor="true"
      :is-form="false"
      @on-refresh-data="onRefreshData"
      :view-is-download="true"
      @on-get-position-y="getPositon"
      title="Repairs Completed"
    />
    <DefectPanel
      :key="key"
      :view-only="false"
      :is-approval="false"
      :fitter-id="fitter"
      :supervisor="true"
      :is-form="false"
      @on-refresh-data="onRefreshData"
      :view-is-download="true"
      @on-get-position-y="getPositon"
      title="Further Action Required"
    />
    <DefectPanelGeneric
      :key="key"
      :view-only="false"
      :fitter-id="fitter"
      :is-form="false"
      :is-approval="false"
      :supervisor="true"
      @on-refresh-data="onRefreshData"
      :view-is-download="true"
      :disable-add-generic="true"
      title="Repairs Completed"
    />
    <DefectPanelGeneric
      :key="key"
      :view-only="false"
      :is-form="false"
      :is-approval="false"
      :fitter-id="fitter"
      :supervisor="true"
      @on-refresh-data="onRefreshData"
      :view-is-download="true"
      :disable-add-generic="true"
      title="Further Action Required"
    />
    <CrackPanel
      :key="key"
      :view-only="false"
      :is-form="false"
      :is-approval="false"
      :fitter-id="fitter"
      :supervisor="true"
      @on-refresh-data="onRefreshData"
      :view-is-download="true"
      @on-get-position-y="getPositon"
      title="Repairs Completed"
    />
    <CrackPanel
      :key="key"
      :view-only="false"
      :is-form="false"
      :is-approval="false"
      :fitter-id="fitter"
      :supervisor="true"
      @on-refresh-data="onRefreshData"
      :view-is-download="true"
      @on-get-position-y="getPositon"
      title="Further Action Required"
    />
    <CBMPanel
      :headers="store.ApprovalData.CBMHeaders"
      :is-disabled="!statusIsSubmitted"
      @on-refresh-data="onRefreshData"
    />
    <NAPanel
      :title="'Not Applicable Item Check'"
      :headers="store.ApprovalData.DefectNAHeaders"
      :is-defect="true"
      @on-refresh-data="onRefreshData"
      :is-disabled="!statusIsSubmitted"
      @on-get-position-y="getPositon"
    />
    <NAPanel
      :title="'Not Applicable Crack Check'"
      :headers="store.ApprovalData.CrackNAHeaders"
      :is-defect="false"
      @on-refresh-data="onRefreshData"
      :is-disabled="!statusIsSubmitted"
      @on-get-position-y="getPositon"
    />
    <div
      class="p-2 py-5 d-flex justify-content-end mt-20 border-top border-top-2"
    >
      <template
        v-if="
          store.ApprovalData.DefectHeaders.length == 0 &&
          store.ApprovalData.CrackHeaders.length == 0 &&
          store.ApprovalData.CrackNAHeaders.length == 0 &&
          store.ApprovalData.DefectNAHeaders.length == 0 &&
          store.ApprovalData.CBMHeaders.length == 0
        "
      >
        <NoDefect
          message="Service sheet was completed in full and no issues were identified."
        />
      </template>
    </div>
  </div>
  <Cameras :visibility="camstore.isVisible" />
  <Confirmation
    :visibility="confirmVisible"
    caption="Please confirm this defect information is correct."
    @on-no-confirm="onCancel"
    @on-yes-confirm="onSave"
  />
  <MessageBox
    :show="messageBoxVisible"
    @close="onOk"
    message="Data successfully approved"
  />
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
    <OfflineCameras />
</template>

<script lang="ts" setup>
import DefectInformationHeader from "@/views/dma/components/defects/DefectInformationHeader.vue";
import DefectPanel from '@/views/dma/components/defects/offline/DefectPanel.vue'
import DefectPanelGeneric from '@/views/dma/components/defects/offline/DefectPanelGeneric.vue'
import CrackPanel from '@/views/dma/components/defects/offline/CrackPanel.vue'
import CBMPanel from '@/views/dma/components/defects/offline/CBMPanel.vue'
import NAPanel from '@/views/dma/components/defects/offline/NAPanel.vue'
import OfflineCameras from "@/components/camera/OfflineCameras.vue"
import { useCameraStore } from "@/store/pinia/application/useCameraStore";
import {
  useDefectsStore
} from "@/store/pinia/dma/e-form-offline/defects/useDefectsStore";
import {
  useDefectsStore as useOnlineDefectsStore
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
import Toast from "@/components/dialog/Toast.vue";
import {
  ApprovalErrorMessages,
  NoNetworkMessages
} from "@/store/enums/ErrorMessagesEnum"
import {
  usePersonelLabourStore
} from '@/store/pinia/dma/personel-labour/usePersonelLabourStore';
import { Option } from "@/core/types/misc/Option";
import SelectSearch from "@/components/inputs/dma/SelectSearchWithLabel.vue";
import { Employee } from "@/core/types/entities/dma/Payload";
import {
  useDefectsFormStore as useOfflineDefectStore
} from '@/store/pinia/dma/e-form-offline/defects/useDefectsFormStore'

const store = useDefectsStore();
const onlineStore = useOnlineDefectsStore()
const formStore = useEFormStore();
const defectSheetStore = useDefectSheetStore();
const defectStore = useDefectsFormStore();
const camstore = useCameraStore();
const router = useRouter();
const personelStore = usePersonelLabourStore();
const offlineDefectStore = useOfflineDefectStore();

const messageBoxVisible = ref(false);
const errorMessageBoxVisible = ref(false);
const confirmVisible = ref(false);
const positionY = ref(0);
const relativeClass = ref("");
const activeTaskGroup = ref('Equipment Information')
const selectedEmployee = ref<Employee>()

const isNetworkDisable = computed(() => {
  return store.stateErrorByNetwork
})

const key = computed(() => {
  return store.DefectKey;
});

const fitter = computed(() => {
  if (!selectedEmployee.value) return ""
  return JSON.stringify(selectedEmployee.value);
});


/* helpers */
const { redirectByLink } = navigator();

const statusIsSubmitted = computed(() => {
  return defectSheetStore.SelectedDefectSheet?.eFormStatus == "Submited";
});

const onSelectFocus = () => {
  relativeClass.value = "relative-hidder";
}

const onSelectLostFocus = () => {
  relativeClass.value = "";
}

const onPersonnelSelected = async (opt: Option) => {
  const emp = {
    id: opt.value,
    name: opt.label
  }
  defectSheetStore.updateSelectedFitter(emp)
}

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
  redirectByLink("/ironforms/identified-defects");
};

const onErrorOk = () => {
  errorMessageBoxVisible.value = false;
  if (defectSheetStore.Error != ApprovalErrorMessages.INCOMPLETE_DATA && defectSheetStore.Error != NoNetworkMessages.NO_NETWORK_VIEW) {
    redirectByLink('/ironforms/identified-defects');
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
      name: "identifieddefects",
    });
  }
});


const getPositon = () => {
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

onMounted(async () => {
  defectSheetStore.updateSelectedFitter({
    id: "",
    name: "",
  })
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading Defect Data',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (store.DataFetched === false) {
    await store.getDefectsData(defectSheetStore.SelectedDefectSheet.workOrder);
    const arr = defectSheetStore.SelectedDefectSheet.equipmentModel
      .split(" ")[0]
      .split("-");
    let equipmentModel = [...new Set(arr)].join("-");
    if (
      !isUndefined(
        defectSheetStore.SelectedDefectSheet.equipmentModel.split(" ")[1],
      )
    ) {
      equipmentModel = `${equipmentModel} ${
        defectSheetStore.SelectedDefectSheet.equipmentModel.split(" ")[1]
      }`;
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
    offlineDefectStore.getOwnershipDefectForm(defectSheetStore.SelectedDefectSheet.unitNumber)
  }

  attachmentClickHandler("show-pdf", false)
  attachmentClickHandler("spv-print-pdf", true)
  store.setCurrentUserGroup("Fitter")
  onlineStore.setCurrentUserGroup("Fitter")
  await defectStore.getPartReference(defectSheetStore.SelectedDefectSheet.unitNumber);
  await offlineDefectStore.getPartReference(defectSheetStore.SelectedDefectSheet.unitNumber);
  loading.close()
});
onUnmounted(() => {
  defectSheetStore.reset()
  defectSheetStore.updateSelectedFitter({} as Employee)
  camstore.reset();
});
const closePDF = () => {
  previewPDF.value = false;
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/pages/floating-label.scss";
</style>

<style>
.form-control,
.form-select {
  color: #919EAB;
}

.vcp {
  background: white;
  border: 1px solid rgba(145, 158, 171, 0.24);
  border-radius: 12px;
}

.vcp__body {
  overflow: inherit !important;
}

.title {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #212B36;
}

.subtitle {
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
}

.no-float {
  height: 48px;
}

.relative-hidder {
  position: inherit !important;
}

@media only screen and (max-width: 767px) {
  .no-float {
    height: 44px;
  }
}
</style>
