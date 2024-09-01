<template>
  <div class="row">
    <div class="col-12" v-if="sosData != undefined && sosData != null && Object.keys(sosData).length != 0">
      <div class="header-preview d-flex flex-column px-5 py-5">
        <div class="d-flex flex-row align-items-center">
          <p class="title me-auto">Preview SOS Print Label</p>
          <online-status />
        </div>
        <div class="d-flex flex-row align-items-center justify-content-between mt-12">
          <div class="d-flex flex-row align-items-center">
            <button
              v-if="!isEdit"
              class="btn-outline-secondary btn-sm"
              type="button"
              @click="toPrevPage">
              <inline-svg
                src="media/icons/bootstrap-icon/arrow-left-short.svg"
                fill="black"
                width="20"
                height="20"
                class="m-auto"
              />
            </button>
            <p v-if="isEdit" class="mb-0 mx-3">
              Page {{ currentLabel }} of {{ totalLabels }}
            </p>
            <p v-else class="mb-0 mx-3">
              Page {{ currentPage }} of {{ totalPages }}
            </p>
          </div>
          <div v-if="isEdit" class="d-flex flex-row align-items-center">
            <el-button type="button" class="edit-button" @click="discardChanges">
              Discard Changes
            </el-button>
            <el-button type="success" class="button" :disabled="isSaveDisabled" @click="saveChanged">
              <img src="media/svg/buttons/save.svg" class="me-2" style="height: 18px" alt="icon">
              Save
            </el-button>
          </div>
          <div v-else class="d-flex flex-row align-items-center">
            <el-button type="button" class="edit-button" :disabled="!isCanEdit" @click="changeToEdit">
              <img src="media/svg/buttons/edit.svg" class="me-2" style="height: 18px" alt="icon">
              Edit
            </el-button>
            <el-button v-if="isCanGenerate" type="success" class="secondary-button" @click="generateLabel">
              Generate Label Number
            </el-button>
            <el-button v-if="isCanRegenerate" type="success" class="secondary-button" @click="generateLabel">
              Regenerate Label Number
            </el-button>
            <el-button type="success" class="button" :disabled="isCanGenerate" @click="handleDownload">
              <img src="media/svg/buttons/print.svg" class="me-2" style="height: 18px" alt="icon">
              Print PDF
            </el-button>
          </div>
        </div>
      </div>
      <div class="body-preview p-8 mt-5 d-flex flex-column">
        <Alert
          v-if="alertVisibility"
         :type="alertType"
         :message="alertMessage"
         class="mx-auto"
         @close="alertVisibility = false"
        />
        <template v-if="isEdit">
          <div ref="editForm">
            <div
              v-for="(compartment, indexCompartment) in labels"
              :key="indexCompartment"
              :id="`label-${indexCompartment}`"
              class="paper-edit editing-data py-2 mx-auto mb-6"
            >
              <edit-label
                :label-data="sosData"
                :detail="compartment"
                :index-compartment="indexCompartment"
                :print-data="printData"
              />
            </div>
          </div>
        </template>
        <template v-else>
          <div :key="componentPreviewKey" class="py-2 mx-auto">
            <preview-label
              v-for="(compartment, indexCompartment) in labels"
              :key="indexCompartment"
              :label-data="sosData"
              :detail="compartment"
              :print-data="printData"
              :index-compartment="indexCompartment"
              :qr-code="compartment.label ? compartment.label : ''"
              class="paper"
              :class="indexCompartment % 3 == 0 ? 'mt-3 new-page' : ''"
            />
          </div>
        </template>
      </div>
      <div :key="componentPrintKey" class="hiddenContainer">
        <pdfexport ref="contentToExport">
          <template v-for="(compartment, indexCompartment) in labels" :key="indexCompartment">
            <preview-label
              v-if="compartment.label"
              :label-data="sosData"
              :detail="compartment"
              :index-compartment="indexCompartment"
              :print-data="printData"
              :qr-code="compartment.label ? compartment.label : ''"
            />
          </template>
        </pdfexport>
      </div>
    </div>
  </div>

  <error-dialog :show="showDialog" :modal-type="'notReady'" @close="redirectToIndex"></error-dialog>
  <Confirmation
    :visibility='isConfirmDiscardVisible'
    caption='Are you sure want to discard changes?'
    @on-no-confirm='cancelDiscard'
    @on-yes-confirm='confirmDiscard' />
  <success-print-dialog
    :show="successDialogVisibility"
    :label-data="sosData"
    @close="successDialogVisibility = false"
  ></success-print-dialog>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeMount,
  onUnmounted,
  defineComponent,
  nextTick
} from "vue";
import { Detail, SosLabel } from "@/core/types/entities/dma/sos/SosLabel";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  getUTCOffsetDate
} from '@/core/helpers/date-format';
import {
  useGeneralFormStore
} from "@/store/pinia/dma/e-form/useGeneralFormStore";
import {
  checkSignInStatus
} from '@/core/helpers/get-user-info';
import {
  useSosStore
} from "@/store/pinia/dma/sos/useSosStore";
import navigator from '@/core/mixins/navigator';
import { useMsal } from "@/msal/api/useMsal";
import { PDFExport, savePDF } from "@progress/kendo-vue-pdf";
import { useRouter } from "vue-router";
import { ElLoading } from "element-plus";
import { cloneDeep } from "lodash";

import OnlineStatus from "@/components/sensors/OnlineStatus.vue";
import Confirmation from '@/components/dialog/Confirmation.vue'
import PreviewLabel from "./components/Label.vue";
import EditLabel from "./components/EditLabel.vue";
import ErrorDialog from './components/ErrorDialog.vue';
import Alert from './components/Alert.vue';
import SuccessPrintDialog from './components/SuccessPrintDialog.vue';

defineComponent({
  components: {
    pdfexport: PDFExport,
  },
});

const { instance } = useMsal()

// General Functionality
const loading = ref();
const sosStore = useSosStore();
const sosData = computed((): SosLabel => {
  return sosStore.SosLabel
})
const labels = ref<Detail[]>([]);
const totalPages = computed(() => {
  return Math.ceil(labels.value.length / 3);
})
const currentPage = ref<number>(1);

const currentLabel = ref<number>(1);
const totalLabels = computed(() => {
  return Math.ceil(labels.value.length);
})

const { redirectByName } = navigator()
const showDialog = ref<boolean>(false);
const redirectToIndex = () => {
  redirectByName('sosprintlabel')
}

const listenScrollLabel = () => {
  const pages = document.querySelectorAll('.new-page');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        currentPage.value = Array.from(pages).indexOf(entry.target) + 1;
      }
    });
  }, {
    threshold: 0.5 // Trigger when 50% of the page is visible
  });

  pages.forEach((page) => {
    observer.observe(page);
  });
}

const isCanEdit = computed(() => {
  return sosStore.SosLabel.details.some((item) => {
    return item.label === "" || item.label === null || item.label === undefined
  });
})
const isCanGenerate = computed(() => {
  return sosStore.SosLabel.details.every((item) => {
    return item.label === "" || item.label === null || item.label === undefined
  });
})
const isCanRegenerate = computed(() => {
  const anyFilled = sosStore.SosLabel.details.some((item) => {
    return item.label !== "" && item.label !== null && item.label !== undefined
  });
  const notAllFilled = sosStore.SosLabel.details.some((item) => {
    return item.label === "" || item.label === null || item.label === undefined
  });
  return anyFilled && notAllFilled;
})
const isSaveDisabled = computed(() => {
  return sosStore.IsSaveDisabled;
})

const selectedSosHistory = computed(() => {
  return sosStore.SelectedSosHistory;
});
const selectedCompartment = computed(() => {
  return sosStore.SelectedSosCompartment;
});

const successDialogVisibility = ref<boolean>(false);
// End General Functionality

// Alert Functionality
const alertVisibility = computed({
  get: () => {
    return sosStore.AlertVisibility
  },
  set: (val) => {
    sosStore.stateAlertVisibility = val;
  }
})
const alertType = computed({
  get: () => {
    return sosStore.AlertType
  },
  set: (val) => {
    sosStore.stateAlertType = val;
  }
})
const alertMessage = computed({
  get: () => {
    return sosStore.AlertMessage
  },
  set: (val) => {
    sosStore.stateAlertMessage = val;
  }
})
// End Alert Functionality

// Print Data Functionality
const authStore = useAuthenticationStore()
const generalStore = useGeneralFormStore()
const printData = computed(() => {
  const loggedInUser = authStore.user.Name
  const timeServer = getUTCOffsetDate(generalStore.stateTimeZone)
  return `Printed  by ${loggedInUser} ${timeServer} (${generalStore.stateTimeZoneDesc})`
})

const router = useRouter();
const toPrevPage = () => {
  router.go(-1);
}
// End Print Data Functionality

// Edit Data Functionality
const isEdit = ref<boolean>(false);
const changeToEdit = () => {
  isEdit.value = true;
  sosStore.stateSosLabelBefore = cloneDeep(sosStore.stateSosLabel);
  nextTick(() => {
    listenEditScrollLabel();
    // listenEditData();
  })
}
const listenEditScrollLabel = () => {
  const pages = document.querySelectorAll('.paper-edit');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        currentLabel.value = Array.from(pages).indexOf(entry.target) + 1;
      }
    });
  }, {
    threshold: 0.5 // Trigger when 50% of the page is visible
  });

  pages.forEach((page) => {
    observer.observe(page);
  });
}
const isConfirmDiscardVisible = ref<boolean>(false);
const cancelDiscard = () => {
  isConfirmDiscardVisible.value = false;
}
const confirmDiscard = () => {
  let oldValue = cloneDeep(sosStore.stateSosLabelBefore);
  sosStore.stateSosLabel = oldValue;
  sosStore.resetPayload();
  isEdit.value = false;
  isConfirmDiscardVisible.value = false;
  alertVisibility.value = false;
}
const discardChanges = () => {
  isConfirmDiscardVisible.value = true;
}
const scrollInto = (index: number) => {
  const el = document.getElementById(`label-${index}`) as HTMLElement;
  el.scrollIntoView({ behavior: 'smooth' });
}
const validateAllField = () => {
  let isPassed = true;
  sosStore.SosLabel.details.forEach((item, indexItem) => {
    if (!item.sampleDate) {
      sosStore.updateErrorWarning(0, indexItem, 'This field is required');
      scrollInto(indexItem);
      isPassed = false;
    } else {
      sosStore.updateErrorWarning(0, indexItem, '');
    }
    if (!item.lastMeterHrs) {
      sosStore.updateErrorWarning(1, indexItem, 'This field is required');
      scrollInto(indexItem);
      isPassed = false;
    } else {
      sosStore.updateErrorWarning(1, indexItem, '');
    }
    if (!item.fuelBurn) {
      sosStore.updateErrorWarning(2, indexItem, 'This field is required');
      scrollInto(indexItem);
      isPassed = false;
    } else {
      sosStore.updateErrorWarning(2, indexItem, '');
    }
  });
  return isPassed;
}
const editForm = ref();
const saveChanged = async () => {
  if (!validateAllField()) return;
  loading.value = ElLoading.service({
    lock: true,
    text: "Saving",
    background: "rgba(0, 0, 0, 0.7)",
  });
  sosStore.stateEmployeeData = {
    id: authStore.user.EmployeeId,
    name: authStore.user.Name,
  };
  const response = await sosStore.saveLabelDataChanged();
  if (response && response.data.statusCode == 200) {
    isEdit.value = false;
    alertType.value = 'success';
    alertMessage.value = 'All changes has been saved';
    alertVisibility.value = true;
    await getLabelData();
  } else if (response && response.data.statusCode != 200) {
    alertType.value = 'error';
    alertMessage.value = response.data.result.message;
    alertVisibility.value = true;
  }
  loading.value.close();
}
const getLabelData = async () => {
  loading.value = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  const payload = {
    workOrder: selectedSosHistory.value.workOrder,
    eformType: selectedSosHistory.value.eformType,
    oilSampleKey: selectedCompartment.value.map((comp) => {
      return comp.value;
    }),
  };
  await sosStore.getLabelData(payload);
  loading.value.close();
};
// Edit Data Functionality

// Generate QR Functionality
const componentPreviewKey = ref<number>(0);
const componentPrintKey = ref<number>(0);
const generateLabel = async () => {
  loading.value = ElLoading.service({
    lock: true,
    text: "Generating",
    background: "rgba(0, 0, 0, 0.7)",
  });
  sosStore.stateEmployeeData = {
    id: authStore.user.EmployeeId,
    name: authStore.user.Name,
  }
  const payloadGenerate = {
    workOrder: selectedSosHistory.value.workOrder,
    taskKey: selectedCompartment.value.map((comp) => {
      return comp.value;
    }),
    employee: sosStore.stateEmployeeData
  };
  const response = await sosStore.generateLabel(payloadGenerate);
  if (response && response.data.statusCode == 200) {
    isEdit.value = false;
    alertType.value = 'success';
    alertMessage.value = 'All label number has been succesfully generated';
    alertVisibility.value = true;
    await getLabelData();
  } else if (response && response.data.statusCode != 200) {
    alertType.value = 'error';
    alertMessage.value = response.data.result.message;
    alertVisibility.value = true;
  }
  // re-render label component
  componentPreviewKey.value += 1;
  componentPrintKey.value += 1;
  loading.value.close();
}
// End enerate QR Functionality

// Print/Export Functionality
const contentToExport = ref();
const isHidden = ref<boolean>(true);
const handleDownload = async () => {
  isHidden.value = false;
  savePDF(
    contentToExport.value,
    {
      forcePageBreak: '.page-break',
      paperSize: "A4",
      scale: 0.9,
      margin: {
        top: "1cm",
        left: "1cm",
        right: "1cm",
        bottom: "1cm"
      },
      fileName: `${selectedSosHistory.value.equipment} - ${selectedSosHistory.value.modelId} - ${selectedSosHistory.value.psTypeId == null ? '' : selectedSosHistory.value.psTypeId + ' Hr Service - '}${selectedSosHistory.value.workOrder} - ${selectedSosHistory.value.eformType}.pdf`,
      keepTogether: '.prevent-split',
    },
    () => {
      isHidden.value = true;
      successDialogVisibility.value = true;
    }
  )
}
// End Print/Export Functionality

onBeforeMount(async () => {
  await checkSignInStatus(instance);
});
onMounted(async () => {
  if (sosData.value == undefined || sosData.value == null || Object.keys(sosData.value).length == 0) {
    showDialog.value = true;
  } else {
    loading.value = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    generalStore.getServerTimestamp();
    labels.value = sosData.value.details;
    await Promise.allSettled([
      sosStore.getOilTypeList(),
      sosStore.getCoolantList()
    ])
    loading.value.close();
  }
  nextTick(() => {
    listenScrollLabel();
  })
})
onUnmounted(() => {
  if (loading.value) {
    loading.value.close();
  }
})
</script>

<style lang="scss" scoped>
.header-preview {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  background-color: white;
  width: 100%;
  .title {
    font-size: 20px;
    font-weight: 700;
    line-height: 28px;
  }
  .button {
    background:#18AF4A;
    color: white;
    font-weight: 600;
    border-radius: 8px;
  }
  .edit-button {
    background: white;
    color: black;
    font-weight: 600;
    border-radius: 8px;
  }
  .secondary-button {
    background: white;
    color: #18AF4A;
    font-weight: 600;
    border: 2px solid #18AF4A;
    border-radius: 8px;
  }
  .btn-outline-secondary {
    background: white;
    color: #DFE3E8;
    border: 1px solid #DFE3E8;
    border-radius: 8px;
    padding: 0;
    width: 36px;
    height: 36px;
    :hover {
      opacity: 0.6;
    }
  }
}
.body-preview {
   background-color: #F9FAFB;
   position: absolute;
   width: 100%;
   top: 150px;
   left: 0;
   z-index: 1;
}
.paper {
  width: 595px;
  height: 310px;
  padding: 0 10px;
  background-color: white;
  .service-label {
    height: 281px;
  }
}
.paper-edit {
  border: 1px solid #DFE3E8;
  padding: 0 10px;
  background-color: white;
}
.hiddenContainer {
  z-index: -999;
  position: relative;
  height: 0;
  overflow: hidden;
}
</style>
