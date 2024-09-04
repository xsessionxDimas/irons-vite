<template>
  <IndexPrint ref="downloadPdfDefectSupervisor" @on-download-finish="handleChangeIconDownload" />
  <IndexPrintSuspension ref="downloadPdfSuspension" @on-download-finish="handleChangeIconDownload" />
  <div class="mt-5 ps-0">
    <el-collapse class="task-group general-accordion defect-panel-wrapper py-1 px-5 pb-1 testing" v-model="titleCollapse">
      <el-collapse-item title="Defect Approval By Supervisor" name="Defect Approval By Supervisor">
        <div class="row px-2 item mx-1 w-100 defect-panel-header">
          <div class="col-1 column-sm-12-percent column-md-7-percent column-lg-10-percent column-xl-6-percent text-center align-items-center d-flex justify-content-center">Task</div>
          <div class="col align-items-center d-flex text-break">Task Description – Defect Description</div>
          <div class="text-break col-1 text-center column-sm-11-percent column-md-10-percent column-lg-5-percent align-items-center d-flex justify-content-center flex-basis-80">Priority</div>
          <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">Review Status</div>
          <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center">Work Order</div>
          <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" style="word-break: initial !important">Repair Status</div>
          <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" style="word-break: initial !important" v-if="viewIsDownload"></div>
        </div>
        <template v-if="Object.keys(headersDisplay).length === 0">
          <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
            <p style="text-align: center;">No data recorded</p>
          </div>
        </template>
        <template v-else v-for="index in sortTaskKeys(Object.keys(headersDisplay))" :key="index">
          <el-collapse v-if="!checkServiceCleanedAndReplaced(index)" v-model="activeCollapse"
            class="task-group e-form-only py-1 px-2 mt-2 overflow-visible defect-panel-task">
            <el-collapse-item :name="headersDisplay[index][0].taskNo">
              <template #title>
                <div class="row mt-2 flex-nowrap px-2 my-2 mx-1 w-100">
                  <span
                    class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center">{{
                      headersDisplay[index][0].taskNo.split(';')[0] }}</span>
                  <span class="col defect-identified-task" v-html="displayDesc(headersDisplay[index][0].taskDesc)"></span>
                </div>
              </template>
              <div v-for="defect in headersDisplay[index]" :key="defect.defectHeaderId">
                <div class="item px-2 my-2 mx-1">
                  <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                    <div class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center"></div>
                    <div class="col align-items-center d-flex text-break defect-description"><span class="text-break" v-html="displayDefectDescription(defect.descriptionDefect)"></span></div>
                    <div class="col-1 justify-content-center column-sm-11-percent column-md-11-percent column-xl-5-percent align-items-center d-flex flex-basis-80"
                    :class="declineStatus(defect)">
                    <div
                      class="little-box justify-content-center align-items-center justify-content-center d-flex mx-auto"
                      :class="priorityClass(defect.priority)" style="margin-top: 6px;">
                      <span class="text-center" style="font-weight:600; color:white">{{ defect.priority }}</span>
                    </div>
                    </div>
                    <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">
                      <template v-if="defect.plannerStatus == 'Decline' || defect.status == 'Decline'">
                        <div
                          class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center red-bg text-dark-red cursor-pointer"
                          @click="acknowledge(defect.defectHeaderId)">
                          Declined
                        </div>
                      </template>
                      <template v-else>
                        <div
                          class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center cursor-pointer"
                          :class="detailInfoClass(defect.defectHeaderId, headers)" @click="acknowledge(defect.defectHeaderId)">
                          Detailed Information
                        </div>
                      </template>
                    </div>
                    <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center"
                      :class="visibilityClass(defect)">
                      <div class="row">
                        <div class="col-8 col-md-8 d-flex flex-column pe-0">
                          <input type="text" class="form-control mou-input" placeholder="Input Work Order"
                            @keypress="onlyNumber" :value="woValue(defect.defectHeaderId)"
                            @change="(e) => handleChangeWoValue(e, defect.defectHeaderId)"
                            @input.prevent="onChangeWoValue" autocomplete="off"
                            :disabled="defectMoFillable(defect.defectHeaderId, headers, fitterId)" />
                          <template v-if="loadValue(defect.defectHeaderId)">
                            <div class="ms-1 d-flex align-items-center">
                              <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;"
                                role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                              <span>Loading...</span>
                            </div>
                          </template>
                        </div>
                        <div class="col-4 col-md-3 ps-0 pe-1">
                          <button :disabled="defectMoFillable(defect.defectHeaderId, headers, fitterId)"
                            @click="updateMO(defect.defectHeaderId)"
                            class="btn btn-sm btn-success ms-2 d-flex justify-content-center align-items-center"
                            style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white; width: 46px; height:40px">
                            <i class="fa fa-save"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex"
                     :class="declineStatus(defect)"
                      >
                      <div class="mx-3 little-box rounded-circle d-flex p-3 justify-content-center align-items-center mx-auto" style="margin-top: 6px;"
                        :class="[repairedClasss(defect)]">
                        <img src="/media/svg/dma/icons/Repair.png" alt="" />
                      </div>
                    </div>
                    <div v-if="viewIsDownload" class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex"
                      :class="declineStatus(defect)">
                      <div class="mx-3 little-box rounded-circle d-flex p-3 justify-content-center align-items-center mx-auto" style="margin-top: 6px;cursor: initial">
                        <img v-if="viewIconDownload(defect.status)" @click="handleConfirmationPrintPDF(defect.defectHeaderId, headersDisplay[index][0].taskDesc, defect.defectType)" class="ms-4 me-2 download-icon" src="/media/svg/dma/document_download.svg" :class="!isDownloaded(defect.downloadHistory) ? 'icon-red':'icon-green'" style="height: 18px" alt="">
                      </div>
                    </div>
                  </div>
                  <div class="row flex-nowrap w-100 flex-row-reverse create-by" style="font-size: 13px !important">
                    {{ handleFormatTimeStamp(defect) }}
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div v-else>
                    <div class="item header-collapse px-2 my-2 mx-1">
                      <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                        <div class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center">{{ headersDisplay[index][0].taskNo && headersDisplay[index][0].taskNo.split(';')[0] }}</div>
                        <div class="col align-items-center d-flex text-break defect-description"><span class="text-break" style="white-space:break-spaces;" v-html="displayDesc(headersDisplay[index][0].taskDesc)"></span></div>
                        <div class="col-1 justify-content-center column-sm-11-percent column-md-11-percent column-xl-5-percent align-items-center d-flex flex-basis-80">
                          <div class="little-box justify-content-center align-items-center justify-content-center d-flex mx-auto"
                          :class="priorityClass(headersDisplay[index][0].priority)" style="margin-top: 6px;">
                              <span class="text-center" style="font-weight:600; color:white">{{ headersDisplay[index][0].priority }}</span>
                          </div>
                        </div>
                        <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center"></div>
                        <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center" :class="visibilityClass(headersDisplay[index][0])"></div>
                        <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex"
                        >
                        <div class="mx-3 little-box rounded-circle d-flex p-3 justify-content-center align-items-center mx-auto" style="margin-top: 6px;"
                          :class="[repairedClasss(headersDisplay[index][0])]">
                          <img src="/media/svg/dma/icons/Repair.png" alt="" />
                        </div>
                      </div>
                      <!-- download -->
                      <div v-if="viewIsDownload" class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex">
                      </div>
                      </div>
                      <div class="row flex-nowrap w-100 flex-row-reverse create-by" style="font-size: 13px !important">
                        {{ headersDisplay[index][0].createdBy.name }}, {{ headersDisplay[index][0].updatedDate != "" ? headersDisplay[index][0].updatedDate : headersDisplay[index][0].createdDate }}
                      </div>
                    </div>
                  </div>
        </template>
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
    :plannerApprove="true"
    :is-complete="defectIsComplete"
    @close-form="onFormClosed"
    @on-refresh-data="onRefreshData"
     />
  <image-previews :images="imageValues" :visibility="imageVisibility" @handle-close="onImagePreviewClosed" />
  <template v-if="isSuspensionDefect">
    <template v-if="suspensionCylinderFormStore.ShowPreviewSuspensionCylinderHeightForm">
      <SuspensionCylinderHeight :show="suspensionCylinderFormStore.ShowPreviewSuspensionCylinderHeightForm"
        @close="() => suspensionCylinderFormStore.toggleShowPreviewSuspensionCylinderHeightForm(false)" />
    </template>
  </template>
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
  defineEmits,
  PropType,
  ref,
  computed,
  onMounted,
  watch,
} from 'vue'
import { Header } from '@/core/types/entities/dma/defects/Header'
import { Detail } from '@/core/types/entities/dma/defects/Detail'
import {
  useDefectsStore
} from '@/store/pinia/dma/e-form/defects/useDefectsStore'
import DefectForm from '@/views/dma/components/defects/DefectForm.vue'
import DefectYesClass from '@/core/classes/DefectYesClass'
import ImagePreviews from '@/components/images-preview/ImagePreviews.vue'
import { useCameraStore } from '@/store/pinia/application/useCameraStore'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import {
  priorityClass,
  formClass,
  moFillable,
} from '@/views/dma/components/defects/functions/defects-functions'
import {
  useSuspensionCylinderFormStore
} from '@/store/pinia/dma/e-form/useSuspensionCylinderFormStore'
import { isUndefined } from 'lodash'
import {
  useDefectSheetStore
} from '@/store/pinia/dma/defect-approval/useDefectSheetStore'
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore"
import SuspensionCylinderHeight from "./suspension-cylinder-height/form/Index.vue"
import IndexPrint from "@/views/dma/defects/components/export-pdf/DefectForm.vue"
import IndexPrintSuspension from "@/views/dma/defects/components/export-pdf/SuspensionForm.vue"
import {
  useHistoricalEformDmaStore
} from '@/store/pinia/report/history/dma/useHistoricalEformDmaStore';
import {
  prepareDownloadableData,
  checkDownloadStatus,
  getTimeStampPDF
} from "@/store/pinia/report/history/dma/helpers"
import {
  DownloadHistory
} from '@/core/types/entities/dma/defects/DownloadHistory'
import { cloneDeep } from 'lodash';
import {
  onlyNumberResult,
  sortTaskKeys
} from "@/store/pinia/dma/e-form/helpers"
import Confirmation from '@/components/dialog/Confirmation.vue'
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
const defectSheetStore = useDefectSheetStore()
const suspensionCylinderFormStore = useSuspensionCylinderFormStore()
const defectFormStore = useDefectsFormStore()
const historicalEformStore = useHistoricalEformDmaStore()

/* refs */
const loader = ref<Array<boolean>>([])
const formVisibility = ref(false)
const id = ref<string>('')
const imageVisibility = ref(false)
const camStore = useCameraStore()
const titleCollapse = ref('Defect Approval By Supervisor')
const defectIsComplete = ref(true)
const refHeader = ref<string>("")
const refWorkOrder = ref<string>("")
const downloadPdfSuspension = ref()
const downloadPdfDefectSupervisor = ref()
const defectMOs = ref<Array<any>>([])
const isErrorShows = ref(false)
const headerIdPdf = ref("")

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

const onChangeWoValue = (event: Event) => {
  event.preventDefault()
  const target = event.target as HTMLInputElement;
  const value = onlyNumberResult(target.value).replaceAll(".", "");
  target.value = value;
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


const handleFormatTimeStamp = (defectHeader) => {
  // as is logic
  let name = defectHeader.createdBy.name;
  let time = defectHeader.updatedDate != "" ? defectHeader.updatedDate : defectHeader.createdDate
  // saat fitter modify, akan update updatedDate
  // saat SPV approve maka update defect header updatedDate, jadi perlu compare data mana yang lebih baru
  const defectDetail = store.ApprovalData.DefectDetails.find((d) => {
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

const onlyNumber = ($event) => {
  if ($event.target.value.length >= 15) {
    $event.preventDefault()
  }
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if ((keyCode < 48 || keyCode > 57)) {
    $event.preventDefault();
  }
}

const dataReady = computed(() => {
  return store.DataFetched
})

const checkServiceCleanedAndReplaced = (indexHeader) => {
  if (headersDisplay.value[indexHeader].length == 1) {
    if (headersDisplay.value[indexHeader][0].cbmRatingType == 'SERVICE_CLEANED_AND_REPLACED') {
      return true
    }
  }
  return false
}

watch(dataReady, (value) => {
  if (value === true) {
    initialDefectMO()
    initialCollapseData()
  }
})

const initialDefectMO = () => {
  defectMOs.value = []
  defectHeader.value.forEach((h) => {
    defectMOs.value.push({
      id: h.id,
      wo: h.defectWorkorder,
      load: false
    })
  })
}

onMounted(() => {
  initialDefectMO()
  initialCollapseData()
})

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

const initialCollapseData = () => {
  activeCollapse.value = []
  defectHeader.value.forEach((h) => {
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

const handleChangeIconDownload = () => {
  store.updateDownloadHistory(headerIdPdf.value, "defect")
}

const handleSetDefectData = (headerId) => {
  return store.getDefectDetail(headerId)
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
  await store.updateDefectMO(id, defectMOs.value[findIndex].wo)
  defectMOs.value[findIndex].load = false
  if (store.IsError) {
    isErrorShows.value = true
  }
}

/* computeds */
const defectHeader = computed(() => {
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
props.headers.forEach(() => {
  loader.value.push(false)
})

const isSuspensionDefect = computed(() => {
  let isSuspension = false
  props.headers.forEach((item) => {
    if (item.defectType == "CALIBRATION") {
      isSuspension = true
    }
  })
  return isSuspension
})

/* event handlers */
const repairedClasss = (item: any): string => {
  let className = 'red  '
  const isComplete = store.getCompleteStatus(item.defectHeaderId)
  className = isComplete ? 'green' : 'red'
  return className
}

const visibilityClass = (item) => {
  if (item.status == "Decline") {
    return "invisible"
  }
  return item.priority === undefined ? 'invisible' : ''
}

const onFormClosed = () => {
  formVisibility.value = false
}
const onImagePreviewClosed = () => {
  imageVisibility.value = false
}
const acknowledge = async (headerId: string) => {
  camStore.setCurrent('defect')
  const defectType = await store.setDefectData(headerId)
  store.setDefectGeneralStatus(headerId)
  defectIsComplete.value = store.getCompleteStatus(headerId)
  refHeader.value = headerId
  if (props.fitterId) {
    refWorkOrder.value = defectSheetStore.SelectedWorkOrder
  } else {
    refWorkOrder.value = defectSheetStore.SelectedDefectSheet.workOrder
  }
  if (defectType && defectType == 'CALIBRATION') {
    if (!isUndefined(suspensionCylinderFormStore.stateSCHeader) && !isUndefined(suspensionCylinderFormStore.stateSCHeader.status) && suspensionCylinderFormStore.stateSCHeader.status == "Submitted") {
      suspensionCylinderFormStore.toggleShowPreviewSuspensionCylinderHeightForm(true)
    }
  } else {
    formVisibility.value = true
  }
}

const showConfirmationPDF = ref(false)
const selectedDefectDownload = ref()

const handleCloseConfirmation = () => {
  showConfirmationPDF.value = false
}

const handleConfirmationPrintPDF = async (headerId: string, taskDesc: string, defectType: string) => {
  if (defectType == "CALIBRATION") {
    headerIdPdf.value = headerId
    historicalEformStore.setIsDownloadPDF(true)
    const timeStamp = await getTimeStampPDF()
    historicalEformStore.setTimeStamp(timeStamp)
    downloadPdfSuspension.value.handleDataFetch()
  } else {
    showConfirmationPDF.value = true
    selectedDefectDownload.value = {
      headerId: headerId,
      taskDesc: taskDesc,
    }
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
  const header = store.getDefectHeader(selectedDefectDownload.value.headerId)
  if (data && header) {
    const isDataPrepared = prepareDownloadableData({
      header: header,
      detail: data.detail,
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
      downloadPdfDefectSupervisor.value.handleDataFetch()
    }
  }
}

const headersDisplay = computed(() => {
  const headerTemp = defectHeader.value as Header[]
  store.ApprovalData.DefectDetails.forEach((detail) => {
    const headerIndex = defectHeader.value.findIndex((h) => {
      return h.id === detail.defectHeaderId;
    });
    if (headerIndex >= 0) {
      headerTemp[headerIndex].descriptionDefect = detail.detail.description
    }
  })
  headerTemp.forEach((item) => {
    if (item.taskDesc && item.taskDesc.split(";")[1] && item.taskDesc.split(";")[1] != '') {
      item.taskNo = item.taskDesc.split(";")[0] + ";" + item.taskDesc.split(";")[1]
    }
  })
  return headerTemp.reduce((groups, item) => {
    const group = (groups[item.taskNo] || []);
    group.push(item);
    groups[item.taskNo] = group;
    return groups;
  }, {}) as any;
})

const displayDefectDescription = (string) => {
  if (string && string.length >= 30) {
    return string.substring(0, 30) + "..."
  }
  return string
}

const declineStatus = (item) => {
  if (item.plannerStatus == 'Decline') {
    return 'invisible'
  } else {
    return item.status == 'Decline' ? 'invisible' : ''
  }
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
<style lang="scss">
.defect-panel-task {
  border: none !important;
  .el-collapse-item__header {
    font-size: 14px !important;
    font-weight: 400 !important;
    background-color: #F4F6F8;
    padding: 2.5rem 0;
    border-radius: 12px;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
  .defect-description {
    color: #637381;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }
  .el-collapse-item__arrow {
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.defect-panel-header, .defect-panel-task {
  .flex-basis-80 {
    flex-basis: 80px;
  }
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
}
</style>
