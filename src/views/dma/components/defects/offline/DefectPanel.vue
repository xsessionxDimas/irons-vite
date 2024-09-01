<template>
    <div class="mt-5 ps-0">
      <el-collapse class="task-group general-accordion defect-panel-wrapper px-5 pb-1 testing" v-model="defectIdentifiedCollapse">
        <el-collapse-item :title="`Defect Identified - ${title}`" name="Defect Identified">
                <!-- items -->
                <!-- items header -->
                <div class="row px-2 item mx-1 w-100 defect-panel-header">
                  <div class="col-1 column-sm-12-percent column-md-7-percent column-lg-10-percent column-xl-6-percent text-center align-items-center d-flex justify-content-center">Task</div>
                  <div class="col align-items-center d-flex text-break">Task Description – Defect Description</div>
                  <div class="text-break col-1 text-center column-sm-11-percent column-md-10-percent column-lg-5-percent align-items-center d-flex justify-content-center flex-basis-80">Priority</div>
                  <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">Review Status</div>
                  <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center">Work Order</div>
                  <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" style="word-break: initial !important">Repair Status</div>
                  <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" style="word-break: initial !important" v-if="viewIsDownload"></div>
                </div>
                <!-- items data -->
                <template v-if="Object.keys(defectSMU).length > 0">
                  <div class="item px-2 my-2 mx-1">
                    <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                      <div class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center"></div>
                      <div class="col align-items-center d-flex text-break defect-description"><span class="text-break" v-html="defectSMU.taskDesc"></span></div>
                      <div class="col-1 justify-content-center column-sm-11-percent column-md-11-percent column-xl-5-percent align-items-center d-flex flex-basis-80"></div>
                      <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">
                          <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center cursor-pointer"
                            :class="detailInfoClass(defectSMU.id, headers)"
                            @click="onClickDefectDetail(defectSMU.id, defectSMU.taskId)">
                            Detailed Information
                          </div>
                      </div>
                      <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center"></div>
                      <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex"></div>
                    </div>
                    <div class="row flex-nowrap w-100 flex-row-reverse create-by" style="font-size: 13px !important">
                      {{ defectSMU.createdBy?.name }}, {{ defectSMU.updatedDate != "" ? defectSMU.updatedDate : defectSMU.createdDate }}
                    </div>
                  </div>
                </template>
                <template v-if="Object.keys(headersDisplay).length === 0 && Object.keys(defectSMU).length === 0">
                  <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                    <p style="text-align: center;">No data recorded</p>
                  </div>
                </template>
                <template v-else v-for="index in sortTaskKeys(Object.keys(headersDisplay))" :key="index">
                  <el-collapse v-if="!checkServiceCleanedAndReplaced(index)" v-model="activeCollapse" class="task-group e-form-only py-1 px-2 mt-2 overflow-visible defect-panel-task">
                    <el-collapse-item :name="headersDisplay[index][0].taskNo">
                      <template #title>
                        <div class="row mt-2 flex-nowrap px-2 my-2 mx-1 w-100">
                          <span class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center">{{ headersDisplay[index][0].taskNo && headersDisplay[index][0].taskNo.split(';')[0] }}</span>
                          <span class="col defect-identified-task" v-html="displayDesc(headersDisplay[index][0].taskDesc)"></span>
                        </div>
                      </template>
                      <div v-for="defect in headersDisplay[index]" :key="defect.id">
                        <div class="item px-2 my-2 mx-1">
                          <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                            <div class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center"></div>
                            <div class="col align-items-center d-flex text-break defect-description"><span class="text-break" style="white-space:break-spaces;" v-html="displayDefectDescription(defect.descriptionDefect)"></span></div>
                            <div class="col-1 justify-content-center column-sm-11-percent column-md-11-percent column-xl-5-percent align-items-center d-flex flex-basis-80" :class="declineStatus(defect)">
                              <div class="little-box justify-content-center align-items-center justify-content-center d-flex mx-auto"
                              :class="priorityClass(defect.priority)" style="margin-top: 6px;">
                                  <span class="text-center" style="font-weight:600; color:white">{{ defect.priority }}</span>
                              </div>
                            </div>
                            <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">
                              <template v-if="defect.plannerStatus == 'Decline' || defect.status == 'Decline'">
                                <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center red-bg text-dark-red cursor-pointer"
                                  @click="onClickDefectDetail(defect.id, defect.taskId)">
                                  Declined
                                </div>
                              </template>
                              <template v-else>
                                <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center cursor-pointer"
                                  :class="detailInfoClass(defect.id, headers)"
                                  @click="onClickDefectDetail(defect.id, defect.taskId)">
                                  Detailed Information
                                </div>
                              </template>
                            </div>
                            <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center" :class="visibilityClass(defect)">
                              <div class="row">
                                <div class="col-8 col-md-8 d-flex flex-column pe-0">
                                  <input type="text" class="form-control mou-input"
                                    placeholder="Input Work Order"
                                    :value="woValue(defect.id)"
                                    :disabled="true" />
                                  <template v-if="loadValue(defect.id)">
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
                            <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex"
                            :class="declineStatus(defect)"
                            >
                            <div class="mx-3 little-box rounded-circle d-flex p-3 justify-content-center align-items-center mx-auto" style="margin-top: 6px;"
                              :class="[repairedClasss(defect)]">
                              <img src="/media/svg/dma/icons/Repair.png" alt="" />
                            </div>
                          </div>
                          <!-- download -->
                          <div v-if="viewIsDownload" class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex"
                            :class="declineStatus(defect)"
                            >
                            <div class="mx-3 little-box rounded-circle d-flex p-3 justify-content-center align-items-center mx-auto" style="margin-top: 6px;cursor: initial">
                              <img v-if="viewIconDownload(plannerApprove ? defect.plannerStatus : defect.status)" @click="handleDownloadPDF(defect.id, defect.defectWorkorder)" class="ms-4 me-2 download-icon" src="media/svg/dma/document_download.svg" :class="!isDownloaded(defect.downloadHistory) ? 'icon-red':'icon-green'" style="height: 18px" alt="">
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
                        <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">
                        </div>
                        <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center" :class="visibilityClass(headersDisplay[index][0])">
                        </div>
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
                        {{ handleFormatTimeStamp(headersDisplay[index][0]) }}
                      </div>
                    </div>
                  </div>
                </template>
        </el-collapse-item>
      </el-collapse>
    </div>
    <DefectForm
    :status="(store.GeneralStatus)"
    :visibility="formVisibility"
    :defect-data="(store.DefectFormData as DefectYesClass)"
    :header-id="refHeader"
    :work-order="refWorkOrder"
    :view-only="viewOnly"
    :fitter-id="fitterId"
    :task-id="refTaskId"
    :plannerApprove="plannerApprove"
    :is-form="isForm"
    :is-complete="defectIsComplete"
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
} from 'vue'
import {
  useDefectsStore
} from '@/store/pinia/dma/e-form-offline/defects/useDefectsStore'
import DefectForm from '@/views/dma/components/defects/offline/DefectForm.vue'
import DefectYesClass from '@/core/classes/DefectYesClass'
import {
  useDefectSheetStore
} from '@/store/pinia/dma/defect-approval/useDefectSheetStore'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import {
  priorityClass,
} from '@/views/dma/components/defects/functions/defects-functions'
import {
  useSuspensionCylinderFormStore
} from '@/store/pinia/dma/e-form-offline/useSuspensionCylinderFormStore'
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import {
  GetSCTemplatePayload
} from '@/core/types/entities/dma/e-form/SuspensionCylinder'
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form-offline/defects/useDefectsFormStore"
import { Header } from '@/core/types/entities/dma/defects/Header'
import { useEFormStore } from '@/store/pinia/dma/e-form-offline/useEFormStore'
import {
  getUTCOffsetDate,
  formatDateAUToRegularDate
} from '@/core/helpers/date-format'
import {
  useGeneralFormStore
} from '@/store/pinia/dma/e-form-offline/useGeneralFormStore'
import {
  cloneDeep,
  isUndefined,
  isEmpty
} from 'lodash';
import {
  checkDozer,
  sortTaskKeys
} from "@/store/pinia/dma/e-form/helpers"
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"

const props = defineProps({
  viewOnly: {
    required: false,
    type: Boolean,
    default: false
  },
  supervisor: {
    required: true,
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
  },
})

/* stores */
const store = useDefectsStore()
const defectSheetStore = useDefectSheetStore()
const suspensionCylinderFormStore = useSuspensionCylinderFormStore()
const authStore = useAuthenticationStore()
const generalStore = useGeneralFormStore()
const defectFormStore = useDefectsFormStore()

const emits = defineEmits(['onRefreshData', 'on-handle-pdf'])

/* refs */
const defectIdentifiedCollapse = ref('Defect Identified')
const formVisibility = ref(false)
const defectIsComplete = ref(true)
const defectMOs = ref<Array<any>>([])
const refHeader = ref<string>("")
const refWorkOrder = ref<string>("")
const refTaskId = ref<string>("")
const showSuspensionTask = ref(false)

const downloadPdfDefect = ref()
const headerIdPdf = ref("")
const timeStamp = ref("")
const filename = ref("")

const selectedDefect = ref<any>({
  "type": "",
  "title": "",
  "assetNumber": "",
  "description": "",
  "raisedBy": "",
  "date": "",
  "plannedDuration": "",
  "instruction": "",
  "priority": "P1",
  "parts": JSON.parse("[]"),
  "labours": JSON.parse("[]"),
  "resources": JSON.parse("[]"),
  "symptoms": JSON.parse("[]"),
  "causes": JSON.parse("[]"),
  "images": JSON.parse("[]"),
  "key": ""
})

const defectSMU = computed(() => {
  return store.DefectSMUHeader;
});

const checkServiceCleanedAndReplaced = (indexHeader) => {
  if (headersDisplay.value[indexHeader].length == 1) {
    if (headersDisplay.value[indexHeader][0].cbmRatingType == 'SERVICE_CLEANED_AND_REPLACED') {
      return true
    }
  }
  return false
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

const repairedClasss = (item: any): string => {
  let className = 'red  '
  if (item.defectType == "CALIBRATION") {
    if (!isUndefined(suspensionCylinderFormStore.stateSCHeader) && !isUndefined(suspensionCylinderFormStore.stateSCHeader.status) && suspensionCylinderFormStore.stateSCHeader.status == "Submitted") {
      className = "green"
    } else {
      className = "red"
    }
  } else {
    const isComplete = store.getCompleteStatus(item.id)
    className = isComplete ? 'green' : 'red'
  }
  return className
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

const setDetailToDownload = (detail) => {
  store.setDefectDetailDownload(detail)
}

const setApprovalToDownload = (approvedBy, approvedDate) => {
  store.setApprovalDefectDownload(approvedBy, approvedDate)
}

const handleDownloadPDF = (headerId: string, wo: string) => {
  selectedDefect.value = null
  headerIdPdf.value = ""
  filename.value = ""
  const dataReal = handleSetDefectData(headerId)
  const data = cloneDeep(dataReal)
  const header = store.getDefectHeader(headerId)
  if (data) {
    for (const key in data.detail) {
      if (key == "parts" || key == "labours" || key == "resources" || key == "symptoms" || key == "causes" || key == "images") {
        try {
          data.detail[key] = JSON.parse(data.detail[key])
        } catch (e) {
          console.log(e)
        }
      }
    }
    data.detail["ownership"] = defectFormStore.Ownership
    selectedDefect.value = data.detail
    setDetailToDownload(data.detail)
    if (header) {
      setApprovalToDownload(header.approvedBy, header.approvedDate)
    }
    headerIdPdf.value = headerId
  }
  if (selectedDefect.value) {
    updateTimeStamp()
    filename.value = `${defectSheetStore.SelectedDefectSheet.brand} ${defectSheetStore.SelectedDefectSheet.equipmentModel} ${equipmentModelGroupDescription.value} ${defectSheetStore.SelectedDefectSheet.psType} Hr Service ${defectSheetStore.SelectedDefectSheet.unitNumber} ${defectSheetStore.SelectedDefectSheet.workOrder}${wo ? " WO " : ""}${wo}` // If WO exist, print WO to filename
    downloadPdfDefect.value.handleDataFetch()
  }
}

const equipmentModelGroupDescription = computed(() => {
  return checkDozer(defectSheetStore.SelectedDefectSheet.equipmentModel) ? 'Dozer' : 'Dump Truck'
})

/* computeds */
const headers = computed(() => {
  const headers = store.ApprovalData.DefectHeaders.filter((header) => {
    const detail = store.ApprovalData.DefectDetails.find((detail) => {
      return header.id == detail.defectHeaderId
      && (detail.detail.isComplete ?? true) == (props.title == "Repairs Completed")
    })
    return detail != undefined
  })
  return headers
})

const headersDisplay = computed(() => {
  const headerTemp = headers.value as Header[]
  store.ApprovalData.DefectDetails.forEach((detail) => {
    const headerIndex = headers.value.findIndex((h) => {
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
  const headerNoSMU = headerTemp.filter((obj) => {
    return obj.defectType !== 'machineSMU'
  })
  return headerNoSMU.reduce((groups, item) => {
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

const dataReady = computed(() => {
  return store.DataFetched
})


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
    initialDefectMO()
    initialCollapseData()
  }
})

const selectedWO = computed(() => {
  return defectSheetStore.SelectedDefectSheet.workOrder
})

watch(selectedWO, () => {
  handleShowSCCalibrationFormDialog()
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

const updateTimeStamp = () => {
  const loggedInUser = authStore.user.Name
  const timeServer = getUTCOffsetDate(generalStore.stateTimeZone)
  timeStamp.value = `${loggedInUser}, at ${timeServer} (${generalStore.stateTimeZoneDesc})`
}


watch(headersDisplay, (value, oldVal) => {
  if (isEmpty(oldVal)) {
    if (isOfflineOrSlowInternetConnection()) {
      initialDefectMO()
      initialCollapseData()
    }
  }
}, { deep: true })

onMounted(() => {
  if (dataReady.value) {
    if (!isOfflineOrSlowInternetConnection()) {
      initialDefectMO()
      initialCollapseData()
    }
  }
  handleShowSCCalibrationFormDialog()
  setTimeout(() => {
    emits("on-handle-pdf")
  }, 1000);

  if (!isOfflineOrSlowInternetConnection()) {
    generalStore.getServerTimestamp()
  } else {
    generalStore.setTimeStamp()
    let time = 1000
    if (isUndefined(headersDisplay.value)) {
      return
    }
    initialDefectMO()
    setTimeout(() => {
      initialCollapseData()
    }, time);
  }
})

/* methods */
const handleShowSCCalibrationFormDialog = async () => {
  const store = useEFormStore()
  const equipmentModel = !isUndefined(defectSheetStore.stateSelectedDefectSheet.equipmentModel) ? defectSheetStore.stateSelectedDefectSheet.equipmentModel : ""
  const modelId = `${defectSheetStore.stateSelectedDefectSheet.brand} ${equipmentModel}`
  if (modelId.includes('undefined')) {
    const payload = {
      modelId: store.stateGeneralForm.modelId,
      psTypeId: store.stateGeneralForm.psTypeId,
      unitNumber: store.stateGeneralForm.equipment,
      workOrder: store.stateGeneralForm.workOrder,
      employee: {
        id: authStore.stateUser.EmployeeId,
        name: authStore.stateUser.Name
      }
    } as GetSCTemplatePayload
    if (!isOfflineOrSlowInternetConnection()) {
      showSuspensionTask.value = await suspensionCylinderFormStore.getSuspensionCalibrationTemplate(payload)
    } else {
      showSuspensionTask.value = await suspensionCylinderFormStore.getSuspensionCalibrationTemplateFromLocalDB(store.stateGeneralForm.workOrder)
    }
  } else {
    const payload = {
      modelId: modelId,
      psTypeId: defectSheetStore.stateSelectedDefectSheet.psType,
      unitNumber: defectSheetStore.stateSelectedDefectSheet.unitNumber,
      workOrder: defectSheetStore.stateSelectedDefectSheet.workOrder,
      employee: {
        id: authStore.stateUser.EmployeeId,
        name: authStore.stateUser.Name
      }
    } as GetSCTemplatePayload
    suspensionCylinderFormStore.toggleShowPreviewSuspensionCylinderHeightForm(false)
    if (!isOfflineOrSlowInternetConnection()) {
      showSuspensionTask.value = await suspensionCylinderFormStore.getSuspensionCalibrationTemplate(payload)
    } else {
      showSuspensionTask.value = await suspensionCylinderFormStore.getSuspensionCalibrationTemplateFromLocalDB(store.stateGeneralForm.workOrder)
    }
  }
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

const onClickDefectDetail = async (headerId: string, taskKey: string) => {
  const defectType = await store.setDefectData(headerId)
  store.setDefectGeneralStatus(headerId)
  defectIsComplete.value = store.getCompleteStatus(headerId)
  if (store.HeaderStatus != 'Decline') {
    store.updateHeaderDefect(headerId)
  }
  refHeader.value = headerId
  refTaskId.value = taskKey
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

const handleSetDefectData = (headerId) => {
  return store.getDefectDetail(headerId)
}

/* event handlers */
const onFormClosed = () => {
  formVisibility.value = false
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
.testing {
  .el-collapse-item__header {
    min-height: min-content;
    height: fit-content;
    margin-bottom: 10px;
  }
}
</style>
