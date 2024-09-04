<template>
    <IndexPrint ref="downloadPdfDefect" @on-download-finish="handleChangeIconDownload" />
    <div class="mt-5 ps-0">
      <el-collapse class="task-group general-accordion py-1 px-5 testing" v-model="titleCollapse">
        <el-collapse-item title="Crack Approval By Supervisor" name="Crack Approval By Supervisor">
          <!-- items -->
          <div class="row px-2 item mx-1 w-100 defect-panel-header">
            <div class="col-1 column-sm-12-percent column-md-7-percent column-lg-10-percent column-xl-6-percent text-center align-items-center d-flex justify-content-center">Task</div>
            <div class="col align-items-center d-flex text-break">Task Description</div>
            <div class="text-break col-1 text-center column-sm-11-percent column-md-10-percent column-lg-5-percent align-items-center d-flex justify-content-center flex-basis-80">Priority</div>
            <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">Review Status</div>
            <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center">Work Order</div>
            <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" style="word-break: initial !important">Repair Status</div>
            <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" style="word-break: initial !important" v-if="viewIsDownload"></div>
          </div>
          <template v-for="(item, index) in crackHeader" :key="item.defectHeaderId">
            <div class="item px-2 my-2 mx-1">
              <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                <div class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center">{{ item.taskNo }}</div>
                <div class="col align-items-center d-flex text-break">
                  <span class="text-break defect-identified-task" v-html="displayDesc(item.taskDesc)"></span>
                </div>
                <div class="col-1 justify-content-center column-sm-11-percent column-md-11-percent column-xl-5-percent align-items-center d-flex flex-basis-80" :class="item.status == 'Decline' ? 'invisible' : ''">
                  <div class="little-box d-flex justify-content-center align-items-center"
                  :class="priorityClass(item.priority)" style="margin-top: 6px;">
                    <span style="font-weight:600; color:white">{{ item.priority }}</span>
                  </div>
                </div>
                <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">
                  <template v-if="item.status == 'Decline'">
                    <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center red-bg text-dark-red cursor-pointer"
                      @click="acknowledge(item.defectHeaderId)">
                      Declined
                    </div>
                  </template>
                  <template v-else>
                    <div class="label d-flex align-items-center py-2 acknowledge-btn py-2 px-1 rounded text-center justify-content-center cursor-pointer"
                    :class="detailInfoClass(item.defectHeaderId, headers)" @click="acknowledge(item.defectHeaderId)">
                      Detailed Information
                    </div>
                  </template>
                </div>
                <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center" :class="visibilityClass(item)">
                  <div class="row">
                    <div class="col-8 col-md-8 d-flex flex-column pe-0">
                      <div class="mx-3 label d-flex flex-column flex-fill">
                        <input type="text" class="form-control mou-input" v-model="defectMOs[index]" autocomplete="off"
                          placeholder="Input Work Order" @keypress="onlyNumber" @input.prevent="onChangeWoValue"
                          :disabled="defectMoFillable(item.defectHeaderId, headers, fitterId)" />
                        <template v-if="loader[index]">
                          <div class="ms-1 d-flex align-items-center">
                            <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
                            <span>Loading...</span>
                          </div>
                        </template>
                      </div>
                    </div>
                    <div class="col-4 col-md-3 ps-0 pe-1">
                      <button :disabled="defectMoFillable(item.defectHeaderId, headers, fitterId)"
                        @click="updateMO(item.defectHeaderId, index)"
                        class="btn btn-sm btn-success ms-2 d-flex justify-content-center align-items-center"
                        style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white; width: 46px; height:40px">
                        <i class="fa fa-save"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" :class="item.status == 'Decline' ? 'invisible' : ''">
                  <div class="mx-3 little-box rounded-circle d-flex p-3 justify-content-center align-items-center" style="margin-top: 6px;"
                  :class="[completeClass(item)]">
                      <img src="/media/svg/dma/icons/Repair.png" alt="" />
                  </div>
                </div>
                <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" v-if="viewIsDownload">
                  <img v-if="viewIconDownload(item.status)" @click="handleConfirmationPrintPDF(item.defectHeaderId)" class="ms-4 me-2 download-icon" src="/media/svg/dma/document_download.svg" :class="!isDownloaded(item.downloadHistory) ? 'icon-red':'icon-green'" style="height: 18px" alt="">
                </div>
              </div>
              <div class="row flex-nowrap w-100 flex-row-reverse create-by" style="font-size: 13px !important">
                {{ handleFormatTimeStamp(item) }}
              </div>
            </div>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
    <CrackForm
    :status="(store.GeneralStatus)"
    :status-spv="(store.DefectFormStatusSPV)"
    :visibility="formVisibility"
    :header-id="refHeader"
    :work-order="refWorkOrder"
    :view-only="viewOnly"
    :fitter-id="fitterId"
    :plannerApprove="true"
    :is-form="false"
    :is-complete="crackIsComplete"
    :crack-data="(store.CrackFormData as CrackYesClass)" @close-form="onFormClosed"
    @on-refresh-data="onRefreshData"
    />
    <image-previews :images="imageValues" :visibility="imageVisibility" @handle-close="onImagePreviewClosed" />
    <Confirmation :visibility="showConfirmationPDF"
      caption="Are you sure want to download all the attachment in this defect file?"
      yesLabel="Yes, Download All File"
      noLabel="No, Only F55 Form"
      :showClose="true"
      :widthDialog="60"
      footerTemplate="50-50"
      @on-close="handleCloseConfirmation"
      @on-no-confirm="onPrintWithoutAttachment"
      @on-yes-confirm="onPrintWithAttachment" />
  <ErrorBox
    :visibility="isErrorShows"
    :caption="store.stateErrorMessage"
    @on-close="handleCloseErrorPopUp" />
</template>


<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  PropType,
  ref,
  computed,
  onMounted,
  watch
} from 'vue'
import { Header } from '@/core/types/entities/dma/defects/Header'
import { Detail } from '@/core/types/entities/dma/defects/Detail'
import {
  useDefectsStore
} from '@/store/pinia/dma/e-form/defects/useDefectsStore'
import CrackYesClass from '@/core/classes/CrackYesClass'
import CrackForm from '@/views/dma/components/defects/CrackForm.vue'
import ImagePreviews from '@/components/images-preview/ImagePreviews.vue'
import { useCameraStore } from '@/store/pinia/application/useCameraStore'
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore"
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import {
  priorityClass,
  formClass,
  moFillable,
} from '@/views/dma/components/defects/functions/defects-functions'
import IndexPrint from "@/views/dma/defects/components/export-pdf/CrackForm.vue"
import {
  useHistoricalEformDmaStore
} from '@/store/pinia/report/history/dma/useHistoricalEformDmaStore';
import {
  useDefectSheetStore
} from '@/store/pinia/dma/defect-approval/useDefectSheetStore'
import { cloneDeep } from 'lodash';
import Confirmation from '@/components/dialog/Confirmation.vue'
import {
  ReferencePhoto
} from '@/core/types/entities/dma/e-form/defects/DefectCrackYesDetail'
import {
  prepareDownloadableData,
  checkDownloadStatus
} from "@/store/pinia/report/history/dma/helpers"
import {
  DownloadHistory
} from '@/core/types/entities/dma/defects/DownloadHistory'
import { onlyNumberResult } from '@/store/pinia/dma/e-form/helpers'
import ErrorBox from '@/components/alert/ErrorBox.vue'
import { NoNetworkMessages } from '@/store/enums/ErrorMessagesEnum'
import { formatDateAUToRegularDate } from '@/core/helpers/date-format'

const props = defineProps({
  viewOnly: {
    required: false,
    type: Boolean,
    default: false
  },
  supervisor: {
    required: false,
    type: Boolean,
    default: true
  },
  headers: {
    required: true,
    type: [] as PropType<Header[]>
  },
  details: {
    required: true,
    type: [] as PropType<Detail[]>
  },
  fitterId: {
    required: false,
    type: String,
    default: ""
  },
  viewIsDownload: {
    required: false,
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['onRefreshData'])

/* stores */
const store = useDefectsStore()
const defectFormStore = useDefectsFormStore()
const defectSheetStore = useDefectSheetStore()
const historicalEformStore = useHistoricalEformDmaStore()

/* refs */
const formVisibility = ref(false)
const camStore = useCameraStore()
const loader = ref<Array<boolean>>([])
const id = ref<string>("")
const crackIsComplete = ref(true)
const refHeader = ref<string>("")
const refWorkOrder = ref<string>("")
const imageVisibility = ref(false)
const isErrorShows = ref(false)

const defectMOs = ref<Array<string>>([])
const downloadPdfDefect = ref()
const headerIdPdf = ref("")

const handleSetDefectData = (headerId) => {
  return store.getCrackDetail(headerId)
}

const showConfirmationPDF = ref(false)
const selectedDefectDownload = ref()

const handleCloseConfirmation = () => {
  showConfirmationPDF.value = false
}

const handleConfirmationPrintPDF = (headerId: string) => {
  showConfirmationPDF.value = true
  selectedDefectDownload.value = {
    headerId: headerId,
  }
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

const defectMoFillable = (headerId: string, headers: Header[], fitterId = ""): boolean => {
  let disabled = true
  const header = headers?.find((h) => {
    return h.id === headerId
  })
  if (header) {
    if (fitterId) return true
    disabled = false
    disabled = !(!header.defectWorkorder || header.defectWorkorder == "")
  }
  return disabled
}

const detailInfoClass = (headerId: string, headers: Header[]) => {
  let cssClass = "light-yellow color-dark-yellow"
  const header = headers?.find((h) => {
    return h.id === headerId
  })
  if (props.supervisor) {
    if (header) {
      if ([
        "P3",
        "P4"
      ].includes(header?.priority ?? '')) return "light-green color-dark-green"
      cssClass = header.generalStatus === 'Acknowledge' ? "light-green color-dark-green" : "light-yellow color-dark-yellow"
      if (header.priority === undefined && header.defectType !== 'machineSMU') {
        cssClass = "light-green color-dark-green"
      }
    }
  } else {
    if (header) {
      switch (header.generalStatus) {
        case "Submited":
          cssClass = "light-yellow color-dark-yellow"
          break
        case "Acknowledge":
          cssClass = "light-green color-dark-green"
          break
      }
      if (header.priority === undefined) {
        cssClass = "light-green color-dark-green"
      }
    }
  }
  return cssClass
}

const handleDownloadPDF = async () => {
  headerIdPdf.value = ""
  const data = cloneDeep(handleSetDefectData(selectedDefectDownload.value.headerId))
  const header = store.getCrackHeader(selectedDefectDownload.value.headerId)
  if (data && header) {
    const resultImage = await store.getReferencePhoto(data.detail.referencePhoto)
    const referencePhotoData: ReferencePhoto = {
      title: data.detail.referenceSection,
      blob: resultImage,
      dimension: store.referencePhoto.dimension,
      id: data.detail.referencePhoto
    }
    const isDataPrepared = prepareDownloadableData({
      header: header,
      detail: data.detail,
      referencePhoto: referencePhotoData,
      serialNumber: defectFormStore.SerialNumber,
      approvalData: {
        approvedBy: header.approvedBy,
        approvedDate: header.approvedDate
      },
      ownership: defectFormStore.Ownership,
      unitNumber: defectSheetStore.SelectedDefectSheet.unitNumber
    })
    if (isDataPrepared) {
      headerIdPdf.value = selectedDefectDownload.value.headerId
      downloadPdfDefect.value.handleDataFetch()
    }
  }
}

const isDownloaded = (downloadHistoryList: DownloadHistory[] | undefined) => {
  if (downloadHistoryList) {
    return checkDownloadStatus(downloadHistoryList)
  }
  return false
}

const viewIconDownload = (status) => {
  if (status == "Acknowledge") {
    return true
  }
  return false
}

const completeClass = (item): string => {
  let className = 'red  '
  const isComplete = store.getCrackCompleteStatus(item.defectHeaderId)
  className = isComplete ? 'green' : 'red'
  return className
}

const handleChangeIconDownload = () => {
  store.updateDownloadHistory(headerIdPdf.value, "crack")
}

const onlyNumber = ($event) => {
  if ($event.target.value.length >= 15) {
    $event.preventDefault()
  }
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if ((keyCode < 48 || keyCode > 57)) {
    $event.preventDefault();
  }
}

const onChangeWoValue = (event: Event) => {
  event.preventDefault()
  const target = event.target as HTMLInputElement;
  const value = onlyNumberResult(target.value).replaceAll(".", "");
  target.value = value;
}

onMounted(() => {
  defectMOs.value = []
  crackHeader.value.forEach((h) => {
    defectMOs.value.push(h.defectWorkorder)
  })
})

const isRefresh = ref(false)
const handleCloseErrorPopUp = () => {
  isRefresh.value = true
  isErrorShows.value = false
  if (store.stateErrorMessage != NoNetworkMessages.NO_NETWORK_VIEW) {
    isRefresh.value = false
    store.resetErrorStatus()
    onRefreshData()
  }
}


const handleFormatTimeStamp = (defectHeader) => {
  // as is logic
  let name = defectHeader.createdBy.name;
  let time = defectHeader.updatedDate != "" ? defectHeader.updatedDate : defectHeader.createdDate
  // saat fitter modify, akan update updatedDate
  // saat SPV approve maka update defect header updatedDate, jadi perlu compare data mana yang lebih baru
  const defectDetail = store.ApprovalData.CrackDetails.find((d) => {
    return d.defectHeaderId == defectHeader.id
  })
  if (defectDetail) {
    if (defectDetail.otherFitterUpdatedBy) {
      name = defectDetail.otherFitterUpdatedBy.name
      if (formatDateAUToRegularDate(defectDetail.updatedDate) > formatDateAUToRegularDate(time)) {
        time = defectDetail.updatedDate
      }
    }
  }
  return `${name}, ${time}`;
}

const updateMO = async (headerId: string, index: number) => {
  if (defectMOs.value[index] === "" || !defectMOs.value[index]) return
  loader.value[index] = true
  await store.updateCrackMO(headerId, defectMOs.value[index])
  loader.value[index] = false
  if (store.IsError) {
    isErrorShows.value = true
  }
}

const visibilityClass = (item) => {
  if (item.status == "Decline") {
    return "invisible"
  }
  return item.priority === undefined ? 'invisible' : ''
}

const titleCollapse = ref('Crack Approval By Supervisor')

/* computeds */
const crackHeader = computed(() => {
  const priorities = ["P3", "P4"]
  return props.headers.filter((h) => {
    return !priorities.includes(h.priority)
  })
})
const imageValues = computed(() => {
  return store.DefectPictures[id.value]?.map((a: string) => {
    return {
      fileName: a,
      url: ''
    }
  })
})


watch(crackHeader, (val) => {
  defectMOs.value = []
  val.forEach((h) => {
    defectMOs.value.push(h.defectWorkorder)
  })
}, {
  deep: true
})

props.headers.forEach(() => {
  loader.value.push(false)
})

/* event handlers */
const onFormClosed = () => {
  formVisibility.value = false
}
const onImagePreviewClosed = () => {
  imageVisibility.value = false
}
const acknowledge = async (headerId: string) => {
  camStore.setCurrent('crack')
  await store.setCrackData(headerId)
  store.setCrackGeneralStatus(headerId)
  crackIsComplete.value = store.getCrackCompleteStatus(headerId)
  refHeader.value = headerId
  if (props.fitterId) {
    refWorkOrder.value = defectSheetStore.SelectedWorkOrder
  } else {
    refWorkOrder.value = defectSheetStore.SelectedDefectSheet.workOrder
  }
  formVisibility.value = true
}
const onRefreshData = () => {
  emits('onRefreshData')
}
</script>

<style lang="scss">
.vcp {
  background: white;
  border: 1px solid rgba(145, 158, 171, 0.24);
  border-radius: 12px;
}
.vcp__body {
  overflow: inherit !important;
}
.letter-space-hypen {
  letter-spacing: 1.5px;
}
.testing {
  .el-collapse-item__header {
    min-height: min-content;
    height: fit-content;
    margin-bottom: 10px;
  }
}
</style>
<style lang="scss" scoped>
   @import "@/assets/sass/pages/defect.panel.scss";
   .download-icon {
    cursor: pointer;
    &.icon-{
      &red {
      filter: invert(16%) sepia(51%) saturate(7200%) hue-rotate(355deg) brightness(98%) contrast(118%);
      }
      &green {
        filter: invert(74%) sepia(57%) saturate(6500%) hue-rotate(103deg) brightness(93%) contrast(81%);
      }
    }
  }
</style>
