<template>
  <div id="print" :class="isHidden ? 'hidden' : 'hiddenContainer'">
    <pdfexport ref="contentToExport">
      <div id="General-Intervention" class="dma-historical-eform">
        <div class="row m-0 bg-white e-form-container">
          <div class="row w-100 pe-0 header-form">
            <div class="col-5">
              <h1>Intervention Form</h1>
            </div>
            <!-- Form Name -->
            <div class="col-7 text-right">
              <template v-if="componentInterventionEformStore.generalForm.sampleStatus">
                <h4 class="form-name" v-html="InterventionForm"></h4>
              </template>
            </div>
          </div>
        </div>
        <SubHeader :subHeader="componentInterventionEformStore.generalForm" />
        <General :general="componentInterventionEformStore.generalForm" />
      </div>
      <div class="page-break" />
      <SubGroup :data="serviceSheetsForm"
        :additional-information="componentInterventionEformStore.generalForm.additionalInformation" />
      <div class="page-break" />
      <DefectIdentified />
    </pdfexport>
    <pdfexport ref="emptyContent">
      <div></div>
    </pdfexport>
  </div>
</template>

<script lang="ts" setup>
import {
  h,
  ref,
  markRaw,
  computed,
  defineExpose,
  defineEmits,
  defineProps,
  defineComponent,
  onUnmounted
} from "vue";
import { PDFExport, savePDF } from "@progress/kendo-vue-pdf";
import ApiService from "@/core/services/ApiService";
import { AxiosResponse } from "axios";
import { ElLoading } from 'element-plus';
import _, { find } from "lodash";
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore";
import {
  useHistoricalEformDmaStore
} from '@/store/pinia/report/history/dma/useHistoricalEformDmaStore';
import {
  useComponentInterventionEformStore
} from '@/store/pinia/dma/component-intervention/useComponentInterventionEformStore';
import {
  useComponentInterventionDefectsStore
} from '@/store/pinia/dma/component-intervention/defects/useComponentInterventionDefectsStore';

import SubHeader from "./component/general/SubHeader.vue";
import General from './component/general/General.vue';
import SubGroup from "./component/sub-group/SubGroup.vue";
import DefectIdentified from "./component/defect/DefectIdentified.vue";

const props = defineProps({
  fileName: {
    type: String,
    default: "Report.pdf"
  },
  addTimeStamp: {
    type: String,
    default: ""
  }
})
const emits = defineEmits(["onDownloadFinish"])
defineComponent({
  components: {
    pdfexport: PDFExport,
  },
});

const componentInterventionEformStore = useComponentInterventionEformStore()
const defectStore = useComponentInterventionDefectsStore();
const historyEformStore = useHistoricalEformDmaStore()
const defectFormStore = useDefectsFormStore()

const loading = ref();

const generalDataForm = computed(() => {
  return componentInterventionEformStore.generalForm
})

const errorMessage = computed(() => {
  return componentInterventionEformStore.errorMessage
})

const serviceSheetsForm = computed(() => {
  return componentInterventionEformStore.groups[1]
})

const InterventionForm = computed(() => {
  const formName = `${generalDataForm.value?.equipment} <span class="${generalDataForm.value?.sampleStatus?.toLowerCase() == 'caution' ? 'yellow' : generalDataForm.value?.sampleStatus?.toLowerCase() == 'normal' ? 'green' : 'red'}">${generalDataForm.value?.sampleStatus}</span>`
  return formName
})

const isHidden = ref<boolean>(true);
const contentToExport = ref();
const pageTemplate = markRaw({
  render: function () {
    return h('div', {
      style: {
        position: 'absolute',
        bottom: '10px',
        right: '15px'
      }
    },
    [props.addTimeStamp])
  }
})
const handleDownload = async () => {
  isHidden.value = false;
  savePDF(
    contentToExport.value,
    {
      forcePageBreak: '.page-break',
      paperSize: "A4",
      scale: 0.6,
      margin: {
        top: "1.3cm",
        left: "1cm",
        right: "1cm",
        bottom: "1.3cm"
      },
      fileName: props.fileName,
      pageTemplate: pageTemplate,
      keepTogether: '.prevent-split',
    },
    () => {
      isHidden.value = true;
      emits("onDownloadFinish", generalDataForm.value);
      componentInterventionEformStore.resetPreviewPDF();
      historyEformStore.resetImageList();
      loading.value.close();
    }
  )
}

const emptyContent = ref();
const handleDownloadEmptyDocument = async () => {
  savePDF(
    emptyContent.value,
    {
      paperSize: "A4",
      scale: 0.6,
      margin: "1cm",
      fileName: 'Report.pdf'
    },
    () => {
      componentInterventionEformStore.resetPreviewPDF();
      historyEformStore.resetImageList();
      loading.value.close();
    }
  );
}

const handleFetchItem = async (item) => {
  loading.value = ElLoading.service({
    lock: true,
    text: 'Generating PDF',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  componentInterventionEformStore.setComponentInterventionHeader(
    item.id,
    item.equipment,
    item.equipmentDesc,
    item.sampleStatus,
    item.componentDescription,
    item.sapWorkOrder
  )
  await componentInterventionEformStore.postGenerateServiceSheet(true, true);
  await defectFormStore.getOwnershipDefectForm(item.equipment)
  componentInterventionEformStore.setSerialNumber(defectFormStore.SerialNumber)
  let promises: any[] = []

  if (!_.isEmpty(serviceSheetsForm.value)) {
    serviceSheetsForm.value.tasks?.forEach((tasks) => {
      tasks.tasks.forEach((task) => {
        if (task.category == "CBM") {
          if (task.images.length > 0) {
            task.images.forEach((image) => {
              promises.push(new Promise((resolve) => {
                loadImage(image).then((res) => {
                  resolve(res)
                })
              }))
            })
          }
        }
      })
    })
    const imageEquipment = generalDataForm.value.imageEquipment as any[];
    imageEquipment?.forEach((image) => {
      promises.push(new Promise((resolve) => {
        loadImage(image.image).then((res) => {
          resolve(res)
        })
      }))
    })
    Promise.all(promises).then(async (res) => {
      res.forEach((val) => {
        let x = find(historyEformStore.imageList, ['id', val.id])
        if (!x) {
          historyEformStore.setImageList(val)
        }
      })
      if (generalDataForm.value) {
        await defectStore.getDefectsData(item.id);
        await handleDownload();
      } else {
        await handleDownloadEmptyDocument();
      }
    })
    return {
      status: true,
      message: ""
    }
  } else {
    return {
      status: false,
      message: errorMessage.value || "test"
    }
  }
}

const loadImage = async (filename) => {
  const params = {
    fileUrl: `${filename}`,
    ver: 'v1',
  }
  try {
    const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/dinspect/api/attachment/download_by_url`;
    await ApiService.getBlob(GET_IMAGE_API_URL, "", new URLSearchParams(params).toString())
    const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL, "", new URLSearchParams(params).toString())
    const buffer = response.data;
    const blob = new Blob([buffer]);
    const urlCreator = window.URL || window.webkitURL
    return {
      id: filename,
      buffer: urlCreator.createObjectURL(blob)
    }
  } catch (e) {
    console.log(e);
    return null
  }
}

defineExpose({
  handleFetchItem
})

onUnmounted(() => {
  loading.value?.close();
})
</script>

<style lang="scss" scoped>
.text-right {
  text-align: end;
}

.form-name {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: right;
}

.hidden {
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  overflow: hidden;
  height: 0;
}

.hiddenContainer {
  z-index: -999;
  position: relative;
}
</style>

<style lang="scss">
.yellow {
  color: #CC9A06;
}

.red {
  color: #FF4842;
}

.dma-historical-eform {
  .before {
    page-break-before: always;
  }

  .after {
    page-break-after: always;
  }

  .avoid {
    page-break-inside: avoid;
  }

  .title {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
  }

  .report {
    font-family: 'Public sans', sans-serif !important;
    border-radius: 8px;
    border: 1px solid rgba(145, 158, 171, 0.24);
    padding: 12px !important;

    &_section {
      &_header {
        padding-bottom: 12px;

        &_subtitle {
          .title {
            font-size: 14px;
          }
        }
      }

      &_body {
        padding: 12px;
      }
    }
  }
}
</style>
