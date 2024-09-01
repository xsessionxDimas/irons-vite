 cursor-pointer<template>
    <IndexPrint ref="downloadPdfDefect" :time-stamp="timeStamp" :filename="filename" />
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
            <div class="item px-2 my-2 mx-1">
              <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                <div class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center">{{ item.taskNo }}</div>
                <div class="col align-items-center d-flex text-break">
                  <span class="text-break defect-identified-task" v-html="displayDesc(item.taskDesc)"></span>
                </div>
                <div class="col-1 justify-content-center column-sm-11-percent column-md-11-percent column-xl-5-percent align-items-center d-flex flex-basis-80" :class="declineStatus(item)">
                  <div class="little-box d-flex justify-content-center align-items-center"
                    :class="priorityClass(item.priority)" style="margin-top: 6px;">
                    <span style="font-weight:600; color:white">{{ item.priority }}</span>
                  </div>
                </div>
                <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">
                  <template v-if="item.plannerStatus == 'Decline' || item.status == 'Decline'">
                    <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center red-bg text-dark-red cursor-pointer"
                      @click="acknowledge(item.id, item.taskId)">
                      Declined
                    </div>
                  </template>
                  <template v-else>
                    <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center cursor-pointer"
                      :class="detailInfoClass(item.id, headers)"
                      @click="acknowledge(item.id, item.taskId)">
                      Detailed Information
                    </div>
                  </template>
                </div>
                <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center" :class="visibilityClass(item)">
                  <div class="row justify-content-center">
                    <div class="col-8 col-md-8 d-flex flex-column pe-0">
                      <input type="text" class="form-control mou-input" v-model="defectMOs[index]"
                        placeholder="Input Work Order"
                        :disabled="true" />
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
                      <button :disabled="true"
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
                  <img v-if="viewIconDownload(plannerApprove ? item.plannerStatus : item.status)" @click="handleDownloadPDF(item.id, item.defectWorkorder)" class="ms-4 me-2 download-icon" src="media/svg/dma/document_download.svg" :class="!isDownloaded(item.downloadHistory) ? 'icon-red':'icon-green'" style="height: 18px" alt="">
                </div>
              </div>
              <div class="row flex-nowrap w-100 flex-row-reverse create-by">
                {{ handleFormatTimeStamp(item) }}
              </div>
            </div>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
    <CrackForm
    :status="(store.GeneralStatus)"
    :visibility="formVisibility"
    :header-id="refHeader"
    :work-order="refWorkOrder"
    :view-only="viewOnly"
    :fitter-id="fitterId"
    :task-id="refTaskId"
    :plannerApprove="plannerApprove"
    :is-form="isForm"
    :is-complete="crackIsComplete"
    :crack-data="(store.CrackFormData as CrackYesClass)"
    @close-form="onFormClosed"
    @on-refresh-data="onRefreshData"
    />
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
} from "@/store/pinia/dma/e-form-offline/defects/useDefectsStore"
import CrackYesClass from "@/core/classes/CrackYesClass"
import {
  useOfflineCameraStore
} from "@/store/pinia/application/useOfflineCameraStore"
import CrackForm from "@/views/dma/components/defects/offline/CrackForm.vue"
import {
  useDefectSheetStore
} from '@/store/pinia/dma/defect-approval/useDefectSheetStore'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import {
  priorityClass,
} from '@/views/dma/components/defects/functions/defects-functions'
import { Header } from '@/core/types/entities/dma/defects/Header'
import IndexPrint from "@/views/dma/defects/components/export-pdf/CrackForm.vue"
import {
  useGeneralFormStore
} from "@/store/pinia/dma/e-form-offline/useGeneralFormStore"
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore"
import {
  getUTCOffsetDate,
  formatDateAUToRegularDate
} from "@/core/helpers/date-format"
import { cloneDeep } from 'lodash';
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore"

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
  isForm: {
    type: Boolean,
    default: false
  },
  title: {
    required: false,
    type: String,
    default: "Repairs Completed"
  }
})

/* stores */
const store = useDefectsStore()
const camStore = useOfflineCameraStore()
const defectSheetStore = useDefectSheetStore()
const generalStore = useGeneralFormStore()
const authStore = useAuthenticationStore()
const defectFormStore = useDefectsFormStore()

const emits = defineEmits(['onRefreshData', 'onGetPositionY'])

/* refs */
const crackIdentifiedCollapse = ref('Crack Identified')
const formVisibility = ref(false)
const crackIsComplete = ref(true)
const loader = ref<Array<boolean>>([])
const defectMOs = ref<Array<string>>([])
const refHeader = ref<string>("")
const refWorkOrder = ref<string>("")
const refTaskId = ref<string>("")
const downloadPdfDefect = ref()
const headerIdPdf = ref("")
const timeStamp = ref("")
const filename = ref("")
const selectedDefect = ref<any>({
  "assetNumber": "",
  "description": "",
  "title": "",
  "raisedBy": "",
  "date": "",
  "plannedDuration": "",
  "instruction": "",
  "priority": "",
  "parts": JSON.parse("[]"),
  "labours": JSON.parse("[]"),
  "resources": JSON.parse("[]"),
  "symptoms": JSON.parse("[]"),
  "causes": JSON.parse("[]"),
  "images": JSON.parse("[]"),
  "previousCracks": JSON.parse("[]")
})

const handleSetDefectData = (headerId) => {
  return store.getCrackDetail(headerId)
}

const updateTimeStamp = () => {
  const loggedInUser = authStore.user.Name
  const timeServer = getUTCOffsetDate(generalStore.stateTimeZone)
  timeStamp.value = `${loggedInUser}, at ${timeServer} (${generalStore.stateTimeZoneDesc})`
}

const setDetailToDownload = (detail) => {
  store.setDefectDetailDownload(detail)
}

const setApprovalToDownload = (approvedBy, approvedDate) => {
  store.setApprovalDefectDownload(approvedBy, approvedDate)
}

const completeClass = (item): string => {
  let className = 'red  '
  const isComplete = store.getCrackCompleteStatus(item.id)
  className = isComplete ? 'green' : 'red'
  return className
}


const handleDownloadPDF = async (headerId, wo) => {
  selectedDefect.value = null
  headerIdPdf.value = ""
  filename.value = ""
  const dataReal = handleSetDefectData(headerId)
  if (dataReal?.detail.referencePhoto) {
    await store.setReferencePhoto(dataReal.detail.referenceSection, dataReal.detail.referencePhoto)
  }
  const data = cloneDeep(dataReal)
  const header = store.getDefectHeader(headerId)
  if (data) {
    for (const key in data.detail) {
      if (key == "parts" || key == "labours" || key == "resources" || key == "symptoms" || key == "causes" || key == "images" || key == "previousCracks") {
        try {
          data.detail[key] = JSON.parse(data.detail[key])
        } catch (e) {
          console.log(e)
        }
      }
    }
    data.detail["ownership"] = defectFormStore.Ownership
    selectedDefect.value = data.detail
    if (header) {
      setApprovalToDownload(header.approvedBy, header.approvedDate)
    }
    setDetailToDownload(data.detail)
    headerIdPdf.value = headerId
  }
  if (selectedDefect.value) {
    updateTimeStamp()
    filename.value = `${defectSheetStore.SelectedDefectSheet.brand} ${defectSheetStore.SelectedDefectSheet.equipmentModel} Dump Truck ${defectSheetStore.SelectedDefectSheet.psType} Hr Service ${defectSheetStore.SelectedDefectSheet.unitNumber} ${defectSheetStore.SelectedDefectSheet.workOrder}${wo ? " WO " : ""}${wo}` // If WO exist, print WO to
    downloadPdfDefect.value.handleDataFetch()
  }
}

const isDownloaded = (item) => {
  if (item) {
    const findDownloadHistory = item.find((e) => {
      return e.downloadBy.id == authStore.user.EmployeeId
    })
    if (findDownloadHistory) return true
  }
  return false
}

const viewIconDownload = (status) => {
  if (status == "Acknowledge") {
    return true
  }
  return false
}

const headers = computed(() => {
  const headers = store.ApprovalData.CrackHeaders.filter((header) => {
    const detail = store.ApprovalData.CrackDetails.find((detail) => {
      return header.id == detail.defectHeaderId
      && (detail.detail.isComplete ?? true) == (props.title == "Repairs Completed")
    })
    return detail != undefined
  })
  return headers;
})
const dataReady = computed(() => {
  return store.DataFetched
})


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

const detailInfoClass = (headerId: string, headers: Header[]) => {
  let cssClass = "light-yellow color-dark-yellow"
  const header = headers?.find((h) => {
    return h.id === headerId
  })
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

const acknowledge = async (headerId: string, taskKey: string) => {
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
  refTaskId.value = taskKey
  if (props.fitterId) {
    refWorkOrder.value = defectSheetStore.SelectedWorkOrder
  } else {
    refWorkOrder.value = defectSheetStore.SelectedDefectSheet.workOrder
  }
  formVisibility.value = true
}

/* event handlers */
const onFormClosed = () => {
  formVisibility.value = false
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
