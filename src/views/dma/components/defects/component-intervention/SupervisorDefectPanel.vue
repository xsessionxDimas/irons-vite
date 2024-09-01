<template>
  <IndexPrint ref="downloadPdfDefect" @on-download-finish="handleChangeIconDownload" />
  <div class="mt-5 ps-0">
    <el-collapse class="task-group general-accordion py-1 px-5 testing" v-model="defectIdentifiedCollapse">
      <el-collapse-item :title="titlePanel" :name="titlePanel">
              <!-- items -->
              <!-- items header -->
              <div class="row px-2 item mx-1 w-100 defect-panel-header">
                <div class="col-1 column-sm-12-percent column-md-7-percent column-lg-10-percent column-xl-6-percent text-center align-items-center d-flex justify-content-center">Task</div>
                <div class="col align-items-center d-flex text-break">Task Description</div>
                <div class="text-break col-1 text-center column-sm-11-percent column-md-10-percent column-lg-5-percent align-items-center d-flex justify-content-center">Priority</div>
                <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">Review Status</div>
                <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center">Work Order</div>
                <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" style="word-break: initial !important">Repair Status</div>
                <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" v-if="viewIsDownload"></div>
              </div>
              <!-- items data -->
              <template v-if="headers.length < 1">
                <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                  <p style="text-align: center;">No data recorded</p>
                </div>
              </template>
              <template v-else v-for="(item, index) in headers" :key="item.id">
                <div class="item px-2 my-2 mx-1 defect-panel-task">
                  <div class="row flex-nowrap px-2 my-2 item mx-1 w-100">
                    <div class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center">{{ item.taskNo }}</div>
                    <div class="col align-items-center d-flex text-break"><span class="text-break defect-identified-task" v-html="displayDesc(item.taskDesc, true)"></span></div>
                    <div class="col-1 justify-content-center column-sm-11-percent column-md-11-percent column-xl-5-percent align-items-center d-flex">
                      <template v-if="!isDecline(item)">
                        <div class="little-box justify-content-center align-items-center justify-content-center d-flex mx-auto"
                        :class="priorityClass(item.priority)" style="margin-top: 6px;">
                            <span class="text-center" style="font-weight:600; color:white">{{ item.priority }}</span>
                        </div>
                      </template>
                    </div>
                    <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">
                      <div v-if="!isDecline(item)" class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center cursor-pointer"
                        :class="formClass(item.id, headers)"
                        @click="acknowledge(item.id)">
                        Detailed Information
                      </div>
                      <div v-else class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center red-bg text-dark-red cursor-pointer"
                        @click="acknowledge(item.id)">
                        Declined
                      </div>
                    </div>
                    <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center" :class="item.priority === undefined ? 'invisible' : ''">
                      <template v-if="!isDecline(item)">
                        <div class="row">
                          <div class="col-8 col-md-8 d-flex flex-column pe-0">
                            <input type="text" class="form-control mou-input" :value="getData(item.id)" @change="(e) => {
                              handleChange(e, item.id)
                            }" autocomplete="off" @input.prevent="onChangeWoValue"
                              placeholder="Input Work Order" @keypress="onlyNumber"
                              :disabled="moFillable(item.id, headers, plannerApprove)" />
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
                            <button :disabled="moFillable(item.id, headers, plannerApprove)"
                              @click="updateMO(item.id, index)"
                              class="btn btn-sm btn-success ms-2 d-flex justify-content-center align-items-center"
                              style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white; width: 46px; height:40px">
                              <i class="fa fa-save"></i>
                            </button>
                          </div>
                        </div>
                      </template>
                    </div>
                    <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex">
                      <template v-if="!isDecline(item)">
                        <div class="mx-3 little-box rounded-circle d-flex p-3 justify-content-center align-items-center mx-auto" style="margin-top: 6px;"
                          :class="[repairedClass(item), allowedClass(item.priority)]">
                          <img src="/media/svg/dma/icons/Repair.png" alt="" />
                        </div>
                      </template>
                    </div>
                    <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" v-if="viewIsDownload">
                      <img v-if="viewIconDownload(item.status)" @click="handleConfirmationPrintPDF(item.id)" class="ms-4 me-2 download-icon" src="media/svg/dma/document_download.svg" :class="!isDownloaded(item.downloadHistory) ? 'icon-red':'icon-green'" style="height: 18px" alt="">
                    </div>
                  </div>
                  <div class="row flex-nowrap w-100 flex-row-reverse create-by" style="font-size: 13px !important">
                    {{ item.createdBy.name }}, {{ item.updatedDate != "" ? item.updatedDate : item.createdDate }}
                  </div>
                </div>
              </template>
      </el-collapse-item>
    </el-collapse>
  </div>
  <DefectForm
  :status="(store.HeaderStatus)"
  :planner-status="store.HeaderPlannerStatus"
  :visibility="formVisibility"
  :defect-data="(store.DefectFormData as DefectYesClass)"
  :header-id="refHeader"
  :work-order="refWorkOrder"
  :view-only="true"
  :approved-by="store.ApprovedBy"
  :approved-date="store.ApprovedDate"
  :planner-approve="plannerApprove"
  :decline-reason="store.DeclineReason"
  @close-form="onFormClosed" />
  <ViewOnlyDefectNoForm
  :visibility="formNoVisibility"
  :is-intervention="true"
  :defect-data="(store.stateDefectNoFormData as DefectNoClass)"
  @close="onFormNoClosed"/>
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
} from 'vue'
import DefectForm from './DefectForm.vue'
import DefectYesClass from '@/core/classes/DefectYesClass'
import { useCameraStore } from '@/store/pinia/application/useCameraStore'
import ImagePreviews from '@/components/images-preview/ImagePreviews.vue'
import ViewOnlyDefectNoForm from '@/views/dma/components/defects/ViewOnlyDefectNoForm.vue'
import DefectNoClass from '@/core/classes/DefectNoClass'
import {
  useComponentInterventionDefectsStore
} from "@/store/pinia/dma/component-intervention/defects/useComponentInterventionDefectsStore"
import {
  useComponentInterventionDefectSheetStore
} from '@/store/pinia/dma/component-intervention/defect-approval/useComponentInterventionDefectSheetStore'
import {
  useHistoricalEformDmaStore
} from '@/store/pinia/report/history/dma/useHistoricalEformDmaStore';
import {
  displayDesc
} from '@/core/helpers/manipulate-html-string'
import {
  priorityClass,
  formClass,
  moFillable,
  repairedClass,
  allowedClass
} from '@/views/dma/components/defects/functions/defects-functions'
import {
  onlyNumber
} from '@/views/dma/component-intervention-forms/functions/string-formatter'
import {
  checkIsAdditionalTask
} from "@/store/pinia/dma/component-intervention/helper";
import { cloneDeep } from 'lodash'
import {
  useDefectsFormStore
} from '@/store/pinia/dma/e-form/defects/useDefectsFormStore'
import IndexPrint from "@/views/dma/defects/components/export-pdf/DefectForm.vue"
import Confirmation from '@/components/dialog/Confirmation.vue'
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

const props = defineProps({
  viewOnly: {
    required: false,
    type: Boolean,
    default: false
  },
  plannerApprove: {
    required: true,
    type: Boolean,
    default: true
  },
  isAdditionalTask: {
    required: false,
    type: Boolean,
    default: false
  },
  viewIsDownload: {
    required: false,
    type: Boolean,
    default: false
  },
})

const emits = defineEmits(['onRefreshData'])

/* stores */
const store = useComponentInterventionDefectsStore()
const camStore = useCameraStore()
const defectSheetStore = useComponentInterventionDefectSheetStore()
const historicalEformStore = useHistoricalEformDmaStore()
const defectStore = useDefectsFormStore();

/* refs */
const titlePanel = ref(props.isAdditionalTask ? 'Defect Approval By Supervisor (Additional Task)' : 'Defect Approval By Supervisor')
const defectIdentifiedCollapse = ref(titlePanel.value)
const formVisibility = ref(false)
const formNoVisibility = ref(false)
const loader = ref<Array<boolean>>([])
const defectMOs = ref<Array<{
  id: string,
  wo: string
}>>([])
const id = ref<string>("")
const refHeader = ref<string>("")
const refWorkOrder = ref<string>("")
const imageVisibility = ref(false)
const downloadPdfDefect = ref()
const headerIdPdf = ref("")
const showConfirmationPDF = ref(false)
const selectedDefectDownload = ref()
const isErrorShows = ref(false)

const sortDecline = (a, b) => {
  const ADeclineStatus = Boolean(a.declineReason)
  const BDeclineStatus = Boolean(b.declineReason)
  if (ADeclineStatus < BDeclineStatus) {
    return -1;
  }
  if (ADeclineStatus > BDeclineStatus) {
    return 1;
  }
  return 0;
}

/* computeds */
const headers = computed(() => {
  let header = store.ApprovalData.DefectHeaders.filter((h) => {
    return !(['P3', 'P4']).includes(h.priority)
  }).sort(sortDecline)
  if (props.isAdditionalTask) {
    return header.filter((val) => {
      return checkIsAdditionalTask(val.taskDesc)
    })
  } else {
    return header.filter((val) => {
      return !checkIsAdditionalTask(val.taskDesc)
    })
  }
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

watch(dataReady, (value) => {
  if (value === true) {
    defectMOs.value = []
    headers.value.forEach((h) => {
      defectMOs.value.push({
        id: h.id,
        wo: h.defectWorkorder
      })
    })
  }
})

onMounted(() => {
  if (dataReady.value) {
    defectMOs.value = []
    headers.value.forEach((h) => {
      defectMOs.value.push({
        id: h.id,
        wo: h.defectWorkorder
      })
    })
  }
})

/* methods */
const isDecline = (item) => {
  return item.plannerStatus == 'Decline' || item.status == 'Decline'
}

const acknowledge = (headerId: string) => {
  camStore.setCurrent('defect')
  const defectType = store.setDefectData(headerId)
  refHeader.value = headerId
  refWorkOrder.value = defectSheetStore.SelectedDefectSheet.interventionId
  if (defectType != 'NO') {
    formVisibility.value = true
  } else {
    formNoVisibility.value = true
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

const updateMO = async (headerId: string, index: number) => {
  const found = defectMOs.value.find((val) => {
    return val.id == headerId
  })
  if (found) {
    if (found.wo === "") return
    loader.value[index] = true
    await store.updateDefectMO(headerId, found.wo)
    loader.value[index] = false
    if (store.IsError) {
      isErrorShows.value = true
    }
  }
}

const getData = (id) => {
  return defectMOs.value.find((val) => {
    return val.id == id
  })?.wo
}

const handleChange = (e, id) => {
  const findIndex = defectMOs.value.findIndex((val) => {
    return val.id == id
  })
  if (findIndex >= 0) {
    defectMOs.value[findIndex].wo = e.target.value
  }
}

const onChangeWoValue = (event: Event) => {
  event.preventDefault()
  const target = event.target as HTMLInputElement;
  const value = onlyNumberResult(target.value).replaceAll(".", "");
  target.value = value;
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
const handleCloseConfirmation = () => {
  showConfirmationPDF.value = false
}
const handleConfirmationPrintPDF = (headerId: string) => {
  showConfirmationPDF.value = true
  selectedDefectDownload.value = {
    headerId: headerId,
  }
}
const handleDownloadPDF = async () => {
  headerIdPdf.value = ""
  const { header, detail } = store.getDefectData(selectedDefectDownload.value.headerId)
  const data = cloneDeep(detail)
  if (data && header) {
    historicalEformStore.setIsIntervention(true)
    const isDataPrepared = prepareDownloadableData({
      header: header,
      detail: data.detail,
      serialNumber: defectStore.SerialNumber,
      approvalData: {
        approvedBy: header.approvedBy,
        approvedDate: header.approvedDate
      },
      ownership: defectStore.Ownership,
      unitNumber: defectSheetStore.SelectedDefectSheet.equipment,
      form: defectSheetStore.DefectTitle
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
  store.updateDownloadHistory(headerIdPdf.value)
}
const onRefreshData = () => {
  emits('onRefreshData')
}
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
</style>
