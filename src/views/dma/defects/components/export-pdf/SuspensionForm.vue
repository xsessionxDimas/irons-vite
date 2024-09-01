<template>
  <div class="hiddenContainer" v-if="!isEmpty(dataCalibration)">
  <pdfexport ref="contentToExport">
    <div :id="id" class="defect-review-eform" style="width: 100%;">
      <div class="report-header mb-2">
        <div class="el-dialog__title avoid prevent-split">
          Digital Payload Calibration
        </div>
        <div class="el-dialog__title task-title download-by avoid prevent-split">Downloaded by {{ timeStamp }}</div>
      </div>
      <div class="report" style="border-color: transparent;">
        <template v-if="dataHeader.modelId.includes('CAT')">
          <div class="report mb-4">
            <div class="report_section_header prevent-split">
              <h4 class="title ps-3">Equipment Information</h4>
            </div>
            <div class="d-flex flex-row justify-content-between pb-5 prevent-split">
              <div class="d-flex flex-row flex-grow-1 prevent-split">
                <div class="flex-fill">
                  <div class="form-floating">
                    <div type="text" class="form-control asset-number-disabled-div" v-html="dataHeader.equipment"></div>
                    <label for="floatingInput">Unit Number</label>
                  </div>
                </div>
                <div class="flex-fill ps-3">
                  <div class="form-floating">
                    <div type="text" class="form-control asset-number-disabled-div" v-html="dataHeader.updatedDate"></div>
                    <label for="floatingInput">Calibration Date</label>
                  </div>
                </div>
                <div class="flex-fill ps-3">
                  <div class="form-floating">
                    <div type="text" class="form-control asset-number-disabled-div" v-html="dataHeader.smu"></div>
                    <label for="floatingInput">Machine SMU</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="report_section_header prevent-split">
              <h4 class="title ps-3">Service Labour Personnel</h4>
            </div>
            <div class="d-flex flex-row justify-content-between pb-5 prevent-split">
              <div class="d-flex flex-row flex-grow-1 prevent-split">
                <div class="flex-fill">
                  <div class="form-floating">
                    <div type="text" class="form-control asset-number-disabled-div" v-html="dataHeader.updatedBy.name"></div>
                    <label for="floatingInput">Service Labour Personnel</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex flex-row pb-5 prevent-split">
            <div class="text-center d-flex align-items-center justify-content-start light-green color-dark-green rounded py-4 px-2 w-100">
              <img class="mx-2" :src="imageCheck" alt="">
              Payload Calibrated Successfully
            </div>
          </div>
          <template v-if="sylinderMeasurements">
            <TransactionTable
            :tasks="sylinderMeasurements"
            :title="'Cylinder Height Initial Measurement'" />
          </template>
          <template v-if="sylinderMeasurements && adjustmentSylinderMeasurements">
            <TransactionTable
            :tasks="adjustmentSylinderMeasurements"
            :title="'Cylinder Height Adjustment'" />
          </template>
          <div class="report mb-4 prevent-split">
            <div class="report_section_header">
              <h4 class="title ps-3">Additional Information</h4>
            </div>
            <div class="desc-wrapper">
              <div class="desc-wrapper-content">
              <pre class="desc-wrapper-content-pre">{{ additionalInfoField }}</pre>
            </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="report" style="border-color: transparent;">
            <template v-if="sylinderMeasurements">
              <TransactionTable
              class="prevent-split"
              :tasks="sylinderMeasurements"
              :title="'Cylinder Height Initial Measurement'" />
            </template>
            <template v-if="sylinderMeasurements && adjustmentSylinderMeasurements">
              <TransactionTable
              class="prevent-split"
              :tasks="adjustmentSylinderMeasurements"
              :title="'Cylinder Height Adjustment'" />
            </template>
            <div class="row">
              <template v-for="subGroup in dataCalibration.subGroup" :key="subGroup.key">
                <SubGroup :subGroup="subGroup"/>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </pdfexport>
</div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineExpose,
  defineEmits,
  ref,
  h,
  markRaw,
  defineComponent,
  nextTick
} from 'vue'
import { ElLoading } from 'element-plus';
import { v4 as uuidv4 } from 'uuid';
import { PDFExport, savePDF } from "@progress/kendo-vue-pdf";
import {
  useHistoricalEformDmaStore
} from '@/store/pinia/report/history/dma/useHistoricalEformDmaStore';
import {
  ILoadingInstance
} from 'element-plus/lib/el-loading/src/loading.type';
import {
  isEmpty
} from 'lodash';
import {
  useSuspensionCylinderFormStore
} from '@/store/pinia/dma/e-form/useSuspensionCylinderFormStore';
import TransactionTable from "./component/TransactionTable.vue";
import SubGroup from "@/views/dma/components/defects/suspension-cylinder-height/form/template/sub-group/SubGroup.vue"

defineComponent({
  components: {
    pdfexport: PDFExport,
  },
});

const emits = defineEmits(["onDownloadFinish"])
const historyEformStore = useHistoricalEformDmaStore()
const suspensionCylinderFormStore = useSuspensionCylinderFormStore()
const contentToExport = ref();
const loading = ref<ILoadingInstance>();
const id = uuidv4()
const imageCheck = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHnSURBVHgB3VVLUsJAEO0exmLhBk9g3GmMiidQT2AsscqdcAM9AXgC8QTgzgVoPIHcgJQJbIUbsNWCtD3hl5gAAVb6FtTM9KRf03mvA/DXgfOCZlPLyPRmHgFP+GqWgDQ/QGAjQmfgeW8vRru6EsHlx56JMlXhZQbmgEk75NH9LKJYglz74IEfvYVlQFCq7bv3CwlyLaPIpyVYCVSu6a27mQRXrp4nISqwBqiPF/VDxxrvRSgqsAhrAlNUMZvZTITArx5Qg4QgDx5russdwKcwA2TExrcZISBEExKCC+nUDXcoAs+LxEUg17RFiNvx6bD3ez/A1Jla5dz9W852EykA4ShKAJCNXsRqTXe2VDvGZ1zwnbVnd66bu9qsd8bG1OIIohdp6NxROxrcGzaUU1UOH6RT77DAhGECgm5M/NT3BUOiLLCRSv56Y7O8QBB2lADIjr3Kpss5xukzt0VtfcKYvodANClWBhI1+Pc89gEBr2Zz91hKqSVxuUfCmqYdQZlDpvufkKCv8+BLWHd2prWNYB3bPQ4WYE2w4kIDL6QiZraCklw++1BlwaP4cd0yShxZai6pwibuXkSgcOUe5Pn/FSdfsZnAHvWhEJygiQiCRISeqXSP0xHQZSnaPDob/S9RVe8P/i1+AL4YslyBfy7HAAAAAElFTkSuQmCC"

const dataCalibration = computed(() => {
  return suspensionCylinderFormStore.SCCalibration
})

const dataHeader = computed(() => {
  return suspensionCylinderFormStore.SCHeader
})

const sylinderMeasurements = computed(() => {
  const initial = dataCalibration.value.transactionCalibration.filter((t) => {
    return t.rating && t.rating == 'CALIBRATION'
  })
  return initial ?? []
})
const adjustmentSylinderMeasurements = computed(() => {
  const initial = dataCalibration.value.transactionCalibration.filter((t) => {
    return t.showParameter && t.showParameter == 'cylinderHeightNeedAdjustment' && t.items.length > 3
  && t.items.find((i) => {
    return i.itemType === 'statusInfo'
  }) != undefined
  })
  return initial ?? []
})
const additionalInfoField = computed(() => {
  let val = ''
  dataCalibration.value.subGroup.forEach((subG) => {
    subG.taskGroup.forEach((taskG) => {
      if (taskG.key == "ADDITIONAL_INFORMATION") {
        val = taskG.task[0].items[0].value
      }
    })
  })
  return val
})

const timeStamp = computed(() => {
  return historyEformStore.TimeStamp
})

const handleDataFetch = async () => {
  loading.value = ElLoading.service({
    lock: true,
    text: 'Generating PDF',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await nextTick();
  handleDownload()
}

const pageTemplate = markRaw({
  render: function () {
    return h('div', {
      style: {
        position: 'absolute',
        bottom: '10px',
        right: '15px'
      }
    })
  }
})

const handleDownload = async () => {
  savePDF(
    contentToExport.value,
    {
      forcePageBreak: '.page-break',
      paperSize: "A4",
      scale: 0.6,
      margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
      fileName: `Digital Payload Calibration ${dataHeader.value.equipment} - ${dataHeader.value.modelId} - ${dataHeader.value.updatedDate}`,
      pageTemplate: pageTemplate,
      keepTogether: '.prevent-split',
    },
    () => {
      historyEformStore.resetAfterDownload()
      emits("onDownloadFinish")
      loading.value?.close()
    }
  )
};

defineExpose({
  handleDataFetch
})
</script>
<style lang="scss" scoped>
@import "@/assets/sass/pages/defect.ori.scss";
@import "@/assets/sass/pages/custom.defect.crack.dialog.scss";

.defect-review-eform {
.task-title {
  color: #212B36;
  font-weight: 400 !important;
  font-size: 14px !important;
  line-height: 20px;
  &.download-by {
    color: #637381;
    font-size: 14px !important;
    font-weight: 400 !important;
    line-height: 20px;
  }
}
.desc-wrapper {
  padding: 5px 10px;
  border: 1px solid #e4e6ef;
  background: #eff2f5;
  border-radius: 0.475rem;
  min-height: 80px;
}
.desc-wrapper-title {
  font-size: 13px;
  color: grey;
  font-family: 'Public sans', sans-serif !important;
}
.desc-wrapper-content pre {
  margin-top: 4px;
}
.desc-wrapper-content-pre {
  font-size: 13px;
  color: #212b36;
  font-family: 'Public sans', sans-serif !important;
}
.report{
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
      padding: 0px;
      &--image {
        // max-width: 100%;
        // height: auto;
        object-fit: contain;
      }
    }
  }
}
.form-control {
  color: #919EAB;
  font-family: 'Public Sans', sans-serif;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
}

div {
  &.form-control {
      &.asset-number-disabled-div {
          padding-top: 2rem;
          padding-bottom: 2rem;
          background-color: #EFF2F5;
      }
  }
}
}
</style>

<style lang="scss" scoped>
.hiddenContainer {
z-index: -999;
position: relative;
height: 0;
overflow: hidden;
}

.light-green {
    background:#DFF4DA;
}
.color-dark-green {
  font-weight: 700 !important;
  font-size: 14px !important;
  color: #229A16 !important;
}
</style>
