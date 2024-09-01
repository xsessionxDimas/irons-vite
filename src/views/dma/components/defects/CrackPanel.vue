<template>
    <IndexPrint ref="downloadPdfDefect" @on-download-finish="handleChangeIconDownload" />
    <div class="mt-5 ps-0">
      <el-collapse class="task-group general-accordion py-1 px-5 testing" v-model="crackIdentifiedCollapse">
        <el-collapse-item :title="`Crack Identified - ${title}`" name="Crack Identified">
          <div class="row px-2 item mx-1 w-100 defect-panel-header">
            <div class="col-1 column-sm-12-percent column-md-7-percent column-lg-10-percent column-xl-6-percent text-center align-items-center d-flex justify-content-center">Task</div>
            <div class="col align-items-center d-flex text-break">Task Description</div>
            <div class="text-break col-1 text-center column-sm-11-percent column-md-10-percent column-lg-5-percent align-items-center d-flex justify-content-center flex-basis-80">Priority</div>
            <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">Review Status</div>
            <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center">Work Order</div>
            <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" style="word-break: initial !important">Repair Status</div>
            <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" v-if="viewIsDownload"></div>
          </div>
          <template v-if="headers.length < 1">
            <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
              <p style="text-align: center;">No data recorded</p>
            </div>
          </template>
          <template v-else v-for="(item, index) in headers" :key="item.id">
            <div class="item px-2 my-2 mx-1" :class="backgroundPanelColor(item)">
              <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                <div class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center">{{ item.taskNo }}</div>
                <div class="col align-items-center d-flex text-break">
                  <span class="text-break defect-identified-task" v-html="displayDesc(item.taskDesc)"></span>
                </div>
                <div class="col-1 justify-content-center column-sm-11-percent column-md-11-percent column-xl-5-percent align-items-center d-flex flex-basis-80" :class="declineStatus(item)">
                  <div class="little-box d-flex justify-content-center align-items-center"
                    :class="priorityClass(item.priority)" style="margin-top: 6px;" @click="updateRepaired(item.id, item.priority)">
                    <span style="font-weight:600; color:white">{{ item.priority }}</span>
                  </div>
                </div>
                <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">
                  <template v-if="item.plannerStatus == 'Decline' || item.status == 'Decline'">
                    <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center red-bg text-dark-red cursor-pointer"
                      @click="getDetailInformation(item.id)">
                      Declined
                    </div>
                  </template>
                  <template v-else>
                    <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center cursor-pointer"
                      :class="detailInfoClass(item.id, headers)"
                      @click="getDetailInformation(item.id)">
                      {{ item.isRevised == "true" ? "Revision Approval" : "Detailed Information" }}
                    </div>
                  </template>
                </div>
                <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center" :class="visibilityClass(item)">
                  <div class="row">
                    <div class="col-8 col-md-8 d-flex flex-column pe-0">
                      <input type="text" class="form-control mou-input" v-model="defectMOs[index]" autocomplete="off"
                        placeholder="Input Work Order" @keypress="onlyNumber"
                        @input.prevent="onChangeWoValue"
                        :disabled="defectMoFillable(item.id, headers, fitterId)" />
                      <template v-if="loader[index]">
                        <div class="ms-1 d-flex align-items-center">
                          <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
                            <span class="sr-only">Loading...</span>
                          </div>
                          <span>Loading...</span>
                        </div>
                      </template>
                    </div>
                    <div class="col-4 col-md-3 ps-0 pe-1">
                      <button :disabled="defectMoFillable(item.id, headers, fitterId)"
                        @click="updateMO(item.id, index)"
                        class="btn btn-sm btn-success ms-2 d-flex justify-content-center align-items-center"
                        style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white; width: 46px; height:40px">
                        <i class="fa fa-save"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" :class="declineStatus(item)">
                  <div class="mx-3 little-box rounded-circle d-flex p-3 justify-content-center align-items-center" style="margin-top: 6px;"
                    :class="[completeClass(item)]">
                    <img src="/media/svg/dma/icons/Repair.png" alt="" />
                  </div>
                </div>
                <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" v-if="viewIsDownload">
                  <img v-if="viewIconDownload(plannerApprove ? item.plannerStatus : item.status)" @click="handleConfirmationPrintPDF(item.id)" class="ms-4 me-2 download-icon" src="media/svg/dma/document_download.svg" :class="!isDownloaded(item.downloadHistory) ? 'icon-red':'icon-green'" style="height: 18px" alt="">
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
    :plannerApprove="plannerApprove"
    :is-form="!plannerApprove"
    :is-complete="crackIsComplete"
    :crack-data="(store.CrackFormData as CrackYesClass)" @close-form="onFormClosed"
    @on-refresh-data="onRefreshData"
    />
    <image-previews :images="imageValues" :visibility="imageVisibility" @handle-close="onImagePreviewClosed" />
    <Confirmation :visibility="showConfirmationPDF"
      caption="Are you sure want to download all the attachment in this defect file?"
      yesLabel="Yes, Download All File"
      noLabel="No,  Only F55 Form"
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
  computed,
  ref,
  watch,
  onMounted,
  defineEmits
} from "vue"
import {
  useDefectsStore
} from "@/store/pinia/dma/e-form/defects/useDefectsStore"
import CrackYesClass from "@/core/classes/CrackYesClass"
import { useCameraStore } from "@/store/pinia/application/useCameraStore"
import CrackForm from "@/views/dma/components/defects/CrackForm.vue"
import ImagePreviews from "@/components/images-preview/ImagePreviews.vue"
import {
  useDefectSheetStore
} from '@/store/pinia/dma/defect-approval/useDefectSheetStore'
import {
  displayDesc,
} from '@/core/helpers/manipulate-html-string'
import {
  priorityClass
} from '@/views/dma/components/defects/functions/defects-functions'
import { Header } from '@/core/types/entities/dma/defects/Header'
import { isUndefined } from 'lodash'
import IndexPrint from "@/views/dma/defects/components/export-pdf/CrackForm.vue"
import { cloneDeep } from 'lodash';
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore"
import {
  useHistoricalEformDmaStore
} from '@/store/pinia/report/history/dma/useHistoricalEformDmaStore';
import Confirmation from '@/components/dialog/Confirmation.vue'
import {
  ReferencePhoto
} from "@/core/types/entities/dma/e-form/defects/DefectCrackYesDetail";
import {
  prepareDownloadableData,
  checkDownloadStatus
} from "@/store/pinia/report/history/dma/helpers"
import {
  DownloadHistory
} from '@/core/types/entities/dma/defects/DownloadHistory'
import { onlyNumberResult } from "@/store/pinia/dma/e-form/helpers"
import {
  formatDateAUToRegularDate
} from '@/core/helpers/date-format'
import ErrorBox from '@/components/alert/ErrorBox.vue'
import { NoNetworkMessages } from '@/store/enums/ErrorMessagesEnum'

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
  fitterId: {
    required: false,
    type: String,
    default: ""
  },
  plannerApprove: {
    required: false,
    type: Boolean,
    default: false
  },
  viewIsDownload: {
    required: false,
    type: Boolean,
    default: false
  },
  isApproval: {
    type: Boolean,
    default: false
  },
  title: {
    default: "Repairs Completed"
  },
  isIdentifiedDefectMenu: {
    required: false,
    type: Boolean,
    default: false
  }
})

/* stores */
const store = useDefectsStore()
const defectSheetStore = useDefectSheetStore()
const defectFormStore = useDefectsFormStore()
const historicalEformStore = useHistoricalEformDmaStore()
const camStore = useCameraStore()

const emits = defineEmits(['onRefreshData', 'onGetPositionY'])

/* refs */
const crackIdentifiedCollapse = ref('Crack Identified')
const formVisibility = ref(false)
const crackIsComplete = ref(true)
const loader = ref<Array<boolean>>([])
const defectMOs = ref<Array<string>>([])
const id = ref<string>("")
const refHeader = ref<string>("")
const refWorkOrder = ref<string>("")
const imageVisibility = ref(false)
const downloadPdfDefect = ref()
const headerIdPdf = ref("")
const isErrorShows = ref(false)

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
    headerId: headerId
  }
}

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

const handleChangeIconDownload = () => {
  store.updateDownloadHistory(headerIdPdf.value, "crack")
}

const updateRepaired = async (headerId: string, priority: string | undefined) => {
  if (!props.supervisor) return
  if (!props.isApproval) return
  if (!priority) return
  /* check if already repaired */
  const header = store.ApprovalData.CrackHeaders.find((h) => {
    return h.id === headerId;
  })
  if (header) {
    const value = header.repairedStatus == "Repaired" ? "Not-Repaired" : "Repaired";
    await store.updateCrackRepairedStatus(headerId, value);
  }
}

const backgroundPanelColor = (defect: Header) => {
  let bgColor = ""
  if (defect.isRevised == "true") {
    bgColor = "soft-yellow-background"
  }
  return bgColor;
}

const headers = computed(() => {
  const plannerPriority = ["P3", "P4"]
  return store.ApprovalData.CrackHeaders.filter((header) => {
    const detail = store.ApprovalData.CrackDetails.find((detail) => {
      return header.id == detail.defectHeaderId
      && (detail.detail.isComplete ?? true) == (props.title == "Repairs Completed")
      && ((props.supervisor || props.viewOnly) ? true : plannerPriority.includes(detail.detail.priority))
    })
    return detail != undefined
  })
})
const dataReady = computed(() => {
  return store.DataFetched
})
const imageValues = computed(() => {
  return store.DefectPictures[id.value]?.map((a: string) => {
    return {
      fileName: a,
      url: ''
    }
  })
})

const completeClass = (item): string => {
  let className = 'red  '
  const isComplete = store.getCrackCompleteStatus(item.id)
  className = isComplete ? 'green' : 'red'
  return className
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

const visibilityClass = (item) => {
  if (item.plannerStatus == 'Decline') {
    return "invisible"
  } else {
    if (item.status == "Decline") {
      return "invisible"
    }
    return item.priority === undefined ? 'invisible' : ''
  }
}

const declineStatus = (item) => {
  if (item.plannerStatus == 'Decline') {
    return 'invisible'
  } else {
    return item.status == 'Decline' ? 'invisible' : ''
  }
}

const defectMoFillable = (headerId: string, headers: Header[], fitterId = ""): boolean => {
  let disabled = true
  const header = headers?.find((h) => {
    return h.id === headerId
  })
  if (header) {
    if (fitterId) return true
    disabled = false
    if (props.plannerApprove) {
      if ((header.priority == "P3" || header.priority == "P4") && header.generalStatus == 'Acknowledge') {
        disabled = false
      }
      if ((header.priority == "P1" || header.priority == "P2") && header.defectWorkorder) {
        return true
      }
      if ((header.priority == "P1" || header.priority == "P2") && !header.defectWorkorder) {
        return false
      }
    } else {
      if (header.priority == "P3" || header.priority == "P4" && header.defectWorkorder) {
        return true
      }
      if (header.priority == "P3" || header.priority == "P4" && !header.defectWorkorder) {
        return false
      }
      if ((header.priority == "P1" || header.priority == "P2") && header.generalStatus == 'Acknowledge') {
        disabled = false
      }
    }
    if (disabled) return disabled
    disabled = props.plannerApprove ? !(header.plannerStatus == 'Acknowledge') : !(header.status == 'Acknowledge')
    if (disabled) return disabled
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
      ].includes(header?.priority ?? '') && !props.isIdentifiedDefectMenu) return "light-green color-dark-green"
      cssClass = header.generalStatus === 'Acknowledge' ? "light-green color-dark-green" : "light-yellow color-dark-yellow"
      if (header.priority === undefined) {
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

watch(dataReady, (value) => {
  if (value === true) {
    defectMOs.value = []
    headers.value.forEach((h) => {
      defectMOs.value.push(h.defectWorkorder)
    })
  }
})

onMounted(() => {
  if (dataReady.value) {
    defectMOs.value = []
    headers.value.forEach((h) => {
      defectMOs.value.push(h.defectWorkorder)
    })
  }
})

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

const getDetailInformation = async (headerId: string) => {
  emits('onGetPositionY')
  camStore.setCurrent('crack')
  await store.setCrackData(headerId)
  store.setCrackGeneralStatus(headerId)
  crackIsComplete.value = store.getCrackCompleteStatus(headerId)
  if (props.plannerApprove) {
    if (store.HeaderStatus != 'Decline') {
      store.updateHeaderCrack(headerId)
    }
  }
  refHeader.value = headerId
  if (props.fitterId) {
    refWorkOrder.value = defectSheetStore.SelectedWorkOrder
  } else {
    refWorkOrder.value = defectSheetStore.SelectedDefectSheet.workOrder
  }
  formVisibility.value = true
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

/* event handlers */
const onFormClosed = () => {
  formVisibility.value = false
}
const onImagePreviewClosed = () => {
  imageVisibility.value = false
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
