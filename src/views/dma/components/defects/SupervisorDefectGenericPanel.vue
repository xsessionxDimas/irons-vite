<template>
  <IndexPrint ref="downloadPdfDefect" @on-download-finish="handleChangeIconDownload" />
  <div class="mt-5 ps-0">
    <el-collapse class="task-group general-accordion defect-panel-wrapper px-5 pb-1" v-model="defectIdentifiedCollapse">
      <el-collapse-item title="Generic Defect Identified By Supervisor" name="Generic Defect Identified By Supervisor">
              <!-- items -->
              <!-- items header -->
              <div class="row px-2 item mx-1 w-100 defect-panel-header">
                <div class="col align-items-center d-flex text-break">Task Description</div>
                <div class="text-break col-1 text-center column-sm-11-percent column-md-10-percent column-lg-5-percent align-items-center d-flex justify-content-center flex-basis-80">Priority</div>
                <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">Review Status</div>
                <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center">Work Order</div>
                <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" style="word-break: initial !important">Repair Status</div>
                <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" style="word-break: initial !important" v-if="viewIsDownload"></div>
              </div>
              <!-- items data -->
              <template v-if="headers.length === 0">
                <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                  <p style="text-align: center;">No data recorded</p>
                </div>
              </template>
              <template v-else v-for="header in headers" :key="header">
                <div class="item px-2 my-2 mx-1">
                  <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                    <div class="col align-items-center d-flex text-break defect-description"><span class="text-break defect-identified-task" v-html="header.taskDesc"></span></div>
                    <div class="col-1 justify-content-center column-sm-11-percent column-md-11-percent column-xl-5-percent align-items-center d-flex flex-basis-80" :class="declineStatus(header)">
                      <div class="little-box justify-content-center align-items-center justify-content-center d-flex mx-auto"
                      :class="priorityClass(header.priority)" style="margin-top: 6px;">
                          <span class="text-center" style="font-weight:600; color:white">{{ header.priority }}</span>
                      </div>
                    </div>
                    <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">
                      <template v-if="header.plannerStatus == 'Decline' || header.status == 'Decline'">
                        <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center red-bg text-dark-red cursor-pointer"
                          @click="acknowledge(header.defectHeaderId)">
                          Declined
                        </div>
                      </template>
                      <template v-else>
                        <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center cursor-pointer"
                          :class="detailInfoClass(header.defectHeaderId, headers)"
                          @click="acknowledge(header.defectHeaderId)">
                          Detailed Information
                        </div>
                      </template>
                    </div>
                    <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center" :class="visibilityClass(header)">
                      <div class="row">
                        <div class="col-8 col-md-8 d-flex flex-column pe-0">
                          <input type="text" class="form-control mou-input" autocomplete="off"
                            placeholder="Input Work Order"
                            @keypress="onlyNumber"
                            :value="woValue(header.defectHeaderId)" @input.prevent="onChangeWoValue"
                            @change="(e) => handleChangeWoValue(e, header.defectHeaderId)"
                            :disabled="defectMoFillable(header.defectHeaderId, headers, fitterId)" />
                          <template v-if="loadValue(header.defectHeaderId)">
                            <div class="ms-1 d-flex align-items-center">
                              <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                              <span>Loading...</span>
                            </div>
                          </template>
                        </div>
                        <div class="col-4 col-md-3 ps-0 pe-1">
                          <button :disabled="defectMoFillable(header.defectHeaderId, headers, fitterId)"
                            @click="updateMO(header.defectHeaderId)"
                            class="btn btn-sm btn-success ms-2 d-flex justify-content-center align-items-center"
                            style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white; width: 46px; height:40px">
                            <i class="fa fa-save"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex"
                    :class="declineStatus(header)"
                    >

                    <div class="mx-3 little-box rounded-circle d-flex p-3 justify-content-center align-items-center mx-auto" style="margin-top: 6px;"
                      :class="[completeClass(header)]">
                      <img src="/media/svg/dma/icons/Repair.png" alt="" />
                    </div>
                  </div>
                  <!-- download -->
                  <div v-if="viewIsDownload" class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex"
                    :class="declineStatus(header)"
                    >
                    <div class="mx-3 little-box rounded-circle d-flex p-3 justify-content-center align-items-center mx-auto" style="margin-top: 6px;cursor: initial">
                      <img v-if="viewIconDownload(header.status)" @click="handleConfirmationPrintPDF(header.defectHeaderId)" class="ms-4 me-2 download-icon" src="media/svg/dma/document_download.svg" :class="!isDownloaded(header.downloadHistory) ? 'icon-red':'icon-green'" style="height: 18px" alt="">
                    </div>
                  </div>
                  </div>
                  <div class="row flex-nowrap w-100 flex-row-reverse create-by" style="font-size: 13px !important">
                    {{ handleFormatTimeStamp(header) }}
                  </div>
                </div>
              </template>
          <button class="my-3 btn-add-new" @click="onAddNewDefect" v-if="!isDisabledCondition">
            <em class="fa fa-plus me-2"></em>
            Add Generic Identified Defect, If Required
          </button>
      </el-collapse-item>
    </el-collapse>
  </div>
  <DefectForm
  :status="(store.GeneralStatus)"
  :status-spv="(store.DefectFormStatusSPV)"
  :visibility="formVisibility"
  :defect-data="(store.DefectFormData as DefectYesClass)"
  :header-id="refHeader"
  :work-order="refWorkOrder"
  :view-only="viewOnly"
  :fitter-id="fitterId"
  :plannerApprove="plannerApprove"
  :is-complete="defectIsComplete"
  :generic="true"
  @close-form="onFormClosed"
  @on-refresh-data="onRefreshData"
   />
  <image-previews :images="imageValues" :visibility="imageVisibility" @handle-close="onImagePreviewClosed" />
  <DefectConfirmationDialog :show="confirmSubmitVisibility"
    :check-list-arr="checkBoxList"
    @update-check-list="updateCheckList"
    @submit="showDefectForm"
    @close="onCancel"
   />
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
} from 'vue'
import {
  useDefectsStore
} from '@/store/pinia/dma/e-form/defects/useDefectsStore'
import DefectConfirmationDialog from "@/views/dma/e-form/sub-group/task-group/task/item/dialog/DefectConfirmationDialog.vue"
import DefectForm from '@/views/dma/components/defects/DefectForm.vue'
import DefectYesClass from '@/core/classes/DefectYesClass'
import { useCameraStore } from '@/store/pinia/application/useCameraStore'
import ImagePreviews from '@/components/images-preview/ImagePreviews.vue'
import {
  useDefectSheetStore
} from '@/store/pinia/dma/defect-approval/useDefectSheetStore'
import {
  priorityClass,
  moFillable,
} from '@/views/dma/components/defects/functions/defects-functions'
import IndexPrint from "@/views/dma/defects/components/export-pdf/DefectForm.vue"
import {
  useGeneralFormStore
} from '@/store/pinia/dma/e-form/useGeneralFormStore'
import { cloneDeep } from 'lodash';
import {
  prepareDownloadableData,
  checkDownloadStatus
} from "@/store/pinia/report/history/dma/helpers"
import {
  DownloadHistory
} from '@/core/types/entities/dma/defects/DownloadHistory'
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore";
import {
  useHistoricalEformDmaStore
} from '@/store/pinia/report/history/dma/useHistoricalEformDmaStore';
import Confirmation from '@/components/dialog/Confirmation.vue'
import {
  onlyNumberResult,
} from "@/store/pinia/dma/e-form/helpers"
import ErrorBox from '@/components/alert/ErrorBox.vue'
import { NoNetworkMessages } from '@/store/enums/ErrorMessagesEnum'
import { Header } from '@/core/types/entities/dma/defects/Header'
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
  assetNumber: {
    required: false,
    type: String,
    default: ''
  },
  workorder: {
    required: false,
    type: String,
    default: ''
  },
  form: {
    required: false,
    type: String,
    default: ''
  },
  disableAddGeneric: {
    required: false,
    type: Boolean,
    default: true
  }
})

/* stores */
const store = useDefectsStore()
const camStore = useCameraStore()
const defectSheetStore = useDefectSheetStore()
const generalStore = useGeneralFormStore()
const defectStore = useDefectsFormStore();
const historicalEformStore = useHistoricalEformDmaStore()

const emits = defineEmits(['onRefreshData'])

/* refs */
const defectIdentifiedCollapse = ref('Generic Defect Identified By Supervisor')
const formVisibility = ref(false)
const formNoVisibility = ref(false)
const defectMOs = ref<Array<any>>([])
const id = ref<string>("")
const defectIsComplete = ref(true)
const refHeader = ref<string>("")
const refWorkOrder = ref<string>("")
const imageVisibility = ref(false)
const confirmSubmitVisibility = ref(false);
const isErrorShows = ref(false)

const downloadPdfDefect = ref()
const headerIdPdf = ref("")

const checkBoxList = ref([])

const updateCheckList = (val) => {
  checkBoxList.value = val
}
const showDefectForm = () => {
  if (checkBoxList.value.length < 1) {
    onConfirmCancel()
  } else {
    onConfirmSubmit()
  }
  checkBoxList.value = []
}

const onConfirmSubmit = async () => {
  confirmSubmitVisibility.value = false;
  defectStore.cretateInstance(true);
  defectStore.toggleYesVisible(true);
}
const onConfirmCancel = () => {
  confirmSubmitVisibility.value = false;
  defectStore.cretateInstance(false);
  defectStore.toggleNoVisible(true);
}
const onCancel = () => {
  checkBoxList.value = []
  confirmSubmitVisibility.value = false;
}

const isDownloaded = (downloadHistoryList: DownloadHistory[] | undefined) => {
  if (downloadHistoryList) {
    return checkDownloadStatus(downloadHistoryList)
  }
  return false
}

const onAddNewDefect = () => {
  confirmSubmitVisibility.value = true;
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

const isDisabledCondition = computed(() => {
  return props.disableAddGeneric
})

const viewIconDownload = (status) => {
  if (status == "Acknowledge") {
    return true
  }
  return false
}

const activeCollapse = ref([""])

const woValue = (id) => {
  return defectMOs.value.find((defect) => {
    return defect.id == id
  })?.wo
}

const loadValue = (id) => {
  return defectMOs.value.find((defect) => {
    return defect.id == id
  })?.load
}

const handleChangeWoValue = (e, id) => {
  defectMOs.value.every((defect) => {
    if (defect.id == id) {
      defect.wo = e.target.value
      return false
    }
    return true
  })
}
const onChangeWoValue = (event: Event) => {
  event.preventDefault()
  const target = event.target as HTMLInputElement;
  const value = onlyNumberResult(target.value).replaceAll(".", "");
  target.value = value;
}


const handleFormatTimeStamp = (defectHeader) => {
  // as is logic
  let name = defectHeader.createdBy.name;
  let time = defectHeader.updatedDate != "" ? defectHeader.updatedDate : defectHeader.createdDate
  // saat fitter modify, akan update updatedDate
  // saat SPV approve maka update defect header updatedDate, jadi perlu compare data mana yang lebih baru
  const defectDetail = store.ApprovalData.DefectGenericDetails.find((d) => {
    return d.defectHeaderId == defectHeader.defectHeaderId
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

const visibilityClass = (item) => {
  if (item.plannerStatus == "Decline") {
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
const handleDownloadPDF = () => {
  headerIdPdf.value = ""
  const data = cloneDeep(handleSetDefectData(selectedDefectDownload.value.headerId))
  const header = store.getDefectGenericHeader(selectedDefectDownload.value.headerId)
  if (data && header) {
    const isDataPrepared = prepareDownloadableData({
      header: header,
      detail: data.detail,
      serialNumber: defectStore.SerialNumber,
      approvalData: {
        approvedBy: header.approvedBy,
        approvedDate: header.approvedDate
      },
      ownership: defectStore.Ownership,
      unitNumber: defectSheetStore.SelectedDefectSheet.unitNumber,
      generic: true
    })
    if (isDataPrepared) {
      headerIdPdf.value = selectedDefectDownload.value.headerId
      downloadPdfDefect.value.handleDataFetch()
    }
  }
}

const handleChangeIconDownload = () => {
  store.updateDownloadHistory(headerIdPdf.value, "defect", true)
}

/* computeds */
const headers = computed(() => {
  return store.ApprovalData.DefectGenericHeaders.filter((h) => {
    return !(['P3', 'P4']).includes(h.priority)
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

const onlyNumber = ($event) => {
  if ($event.target.value.length >= 15) {
    $event.preventDefault()
  }
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if ((keyCode < 48 || keyCode > 57)) {
    $event.preventDefault();
  }
}

watch(dataReady, (value) => {
  if (value === true) {
    initialDefectMO()
    initialCollapseData()
  }
})

const initialDefectMO = () => {
  defectMOs.value = []
  headers.value.forEach((h) => {
    defectMOs.value.push({
      id: h.id,
      wo: h.defectWorkorder,
      load: false
    })
  })
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

const completeClass = (item): string => {
  return store.getGenericCompleteStatus(item.id) ? 'green' : 'red'
}

const initialCollapseData = () => {
  activeCollapse.value = []
  headers.value.forEach((h) => {
    const foundIndex = activeCollapse.value.findIndex((val) => {
      if (h.taskDesc && h.taskDesc.split(";")[1] && h.taskDesc.split(";")[1] != '') {
        return val == h.taskDesc.split(";")[0] + ";" + h.taskDesc.split(";")[1]
      }
      return val == h.taskNo
    })
    if (foundIndex < 0) {
      if (h.taskDesc && h.taskDesc.split(";")[1] && h.taskDesc.split(";")[1] != '') {
        activeCollapse.value.push(h.taskDesc.split(";")[0] + ";" + h.taskDesc.split(";")[1])
      } else {
        activeCollapse.value.push(h.taskNo)
      }
    }
  })
}

onMounted(() => {
  defectStore.resetInstance()
  if (dataReady.value) {
    initialDefectMO()
    initialCollapseData()
  }
  generalStore.getServerTimestamp()
})

/* methods */
const acknowledge = async (headerId: string) => {
  camStore.setCurrent('defect')
  await store.setDefectDataGeneric(headerId)
  store.setGenericDefectGeneralStatus(headerId)
  defectIsComplete.value = store.getGenericCompleteStatus(headerId)
  if (props.plannerApprove) {
    if (store.HeaderStatus != 'Decline') {
      store.updateHeaderGenericDefect(headerId)
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

const handleSetDefectData = (headerId) => {
  return store.getDefectGenericDetail(headerId)
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

const updateMO = async (id: string) => {
  const findIndex = defectMOs.value.findIndex((defect) => {
    return defect.id == id
  })
  if (findIndex < 0) return
  defectMOs.value[findIndex].load = true
  await store.updateDefectMO(id, defectMOs.value[findIndex].wo, true)
  defectMOs.value[findIndex].load = false
  if (store.IsError) {
    isErrorShows.value = true
  }
}

/* event handlers */
const onFormClosed = () => {
  formVisibility.value = false
}
const onFormNoClosed = () => {
  formNoVisibility.value = false
}
const onImagePreviewClosed = () => {
  imageVisibility.value = false
}

const onRefreshData = () => {
  emits('onRefreshData')
}

watch(() => {
  return defectStore.OpenDialogConfirmSubmitDefect
}, (newVal) => {
  if (newVal) {
    confirmSubmitVisibility.value = newVal
  }
})
</script>
<style>
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
</style>
<style lang="scss" scoped>
  @import "@/assets/sass/pages/defect.panel.scss";
</style>
<style lang="scss">
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

<style lang="scss" scoped>
 @import "@/assets/sass/pages/defect.form.scss";
</style>
