<template>
    <IndexPrint ref="downloadPdfDefectSupervisor" @on-download-finish="handleChangeIconDownload" :time-stamp="timeStamp" :filename="filename" class="supervisor" />
    <div class="mt-5 ps-0">
      <el-collapse class="task-group general-accordion defect-panel-wrapper py-1 px-5 pb-1" v-model="titleCollapse">
        <el-collapse-item title="Defect Approval By Supervisor" name="Defect Approval By Supervisor">
          <div class="row px-2 item mx-1 w-100 defect-panel-header">
            <div class="col-1 column-sm-12-percent column-md-7-percent column-lg-10-percent column-xl-6-percent text-center align-items-center d-flex justify-content-center">Task</div>
            <div class="col align-items-center d-flex text-break">Task Description – Defect Description</div>
            <div class="text-break col-1 text-center column-sm-11-percent column-md-10-percent column-lg-5-percent align-items-center d-flex justify-content-center">Priority</div>
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
          <template v-else v-for="index in Object.keys(headersDisplay).sort()" :key="index">
            <el-collapse v-model="activeCollapse" class="task-group e-form-only py-1 px-2 mt-2 overflow-visible defect-panel-task">
              <el-collapse-item :name="headersDisplay[index][0].taskNo">
                <template #title>
                  <div class="row mt-2 flex-nowrap px-2 my-2 mx-1 w-100">
                    <span class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center">{{ headersDisplay[index][0].taskNo.split(';')[0] }}</span>
                    <span class="col" v-html="displayDesc(headersDisplay[index][0].taskDesc)"></span>
                  </div>
                </template>
                <div v-for="defect in headersDisplay[index]" :key="defect.id">
                  <div class="row item flex-nowrap px-2 my-2 mx-1 w-100">
                    <div class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center"></div>
                    <div class="col align-items-center d-flex text-break defect-description"><span class="text-break defect-identified-task" v-html="displayDefectDescription(defect.descriptionDefect)"></span></div>
                    <div class="col-1 justify-content-center column-sm-11-percent column-md-11-percent column-xl-5-percent align-items-center d-flex flex-basis-80" :class="declineStatus(defect)">
                      <div class="little-box justify-content-center align-items-center justify-content-center d-flex mx-auto"
                      :class="priorityClass(defect.priority)" style="margin-top: 6px;">
                          <span class="text-center" style="font-weight:600; color:white">{{ defect.priority }}</span>
                      </div>
                    </div>
                    <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">
                      <template v-if="defect.plannerStatus == 'Decline' || defect.status == 'Decline'">
                        <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center grey-bg text-dark-grey cursor-pointer"
                          @click="acknowledge(defect.id)">
                          Declined
                        </div>
                      </template>
                      <template v-else>
                        <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center cursor-pointer"
                        :class="formClass(defect.id, headers)"  @click="acknowledge(defect.id)">
                          Detailed Information
                        </div>
                      </template>
                    </div>
                    <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center" :class="visibilityClass(defect)">
                      <div class="row">
                        <div class="col-8 col-md-8 d-flex flex-column pe-0">
                          <input type="text" class="form-control mou-input"
                            placeholder="Input Work Order"
                            @keypress="onlyNumber"
                            :value="woValue(defect.id)"
                            @change="(e) => handleChangeWoValue(e, defect.id)"
                            :disabled="moFillable(defect.id, headers, supervisor, fitterId)" />
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
                          <button :disabled="moFillable(defect.id, headers, supervisor, fitterId)"
                            @click="updateMO(defect.id)"
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
                    :class="declineStatus(defect)"
                    >
                    <div class="mx-3 little-box rounded-circle d-flex p-3 justify-content-center align-items-center mx-auto" style="margin-top: 6px;cursor: initial">
                      <img v-if="viewIconDownload(defect.status)" @click="handleDownloadPDF(defect.id, defect.defectWorkorder)" class="ms-4 me-2 download-icon" src="media/svg/dma/document_download.svg" :class="!isDownloaded(defect.downloadHistory) ? 'icon-red':'icon-green'" style="height: 18px" alt="">
                    </div>
                  </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
    <DefectForm
    :status="(store.HeaderStatus)"
    :visibility="formVisibility"
    :defect-data="(store.DefectFormData as DefectYesClass)"
    :view-only="true"
    @close-form="onFormClosed" />
    <image-previews :images="imageValues" :visibility="imageVisibility" @handle-close="onImagePreviewClosed" />
    <template v-if="isSuspensionDefect">
      <template v-if="suspensionCylinderFormStore.ShowPreviewSuspensionCylinderHeightForm">
        <SuspensionCylinderHeight :show="suspensionCylinderFormStore.ShowPreviewSuspensionCylinderHeightForm" @close="() => suspensionCylinderFormStore.toggleShowPreviewSuspensionCylinderHeightForm(false)" />
      </template>
    </template>
</template>


<script lang="ts" setup>
import {
  defineProps,
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
} from '@/store/pinia/dma/e-form-offline/defects/useDefectsStore'
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
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore"
import {
  GetSCTemplatePayload
} from '@/core/types/entities/dma/e-form/SuspensionCylinder'
import SuspensionCylinderHeight from "./suspension-cylinder-height/form/Index.vue"
import IndexPrint from "@/views/dma/defects/components/export-pdf/DefectForm.vue"
import { getUTCOffsetDate } from '@/core/helpers/date-format'
import {
  useGeneralFormStore
} from '@/store/pinia/dma/e-form/useGeneralFormStore'
import { cloneDeep } from 'lodash';
import { checkDozer } from '@/store/pinia/dma/e-form/helpers';

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

/* stores */
const store = useDefectsStore()
const defectSheetStore = useDefectSheetStore()
const suspensionCylinderFormStore = useSuspensionCylinderFormStore()
const authStore = useAuthenticationStore()
const generalStore = useGeneralFormStore()
const defectFormStore = useDefectsFormStore()

/* refs */
const loader = ref<Array<boolean>>([])
const formVisibility = ref(false)
const formNoVisibility = ref(false)
const id = ref<string>('')
const imageVisibility = ref(false)
const camStore = useCameraStore()
const titleCollapse = ref('Defect Approval By Supervisor')
const showSuspensionTask = ref(false)
const downloadPdfDefectSupervisor = ref()
const defectMOs = ref<Array<any>>([])

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

const handleChangeWoValue = (e, id) => {
  defectMOs.value.every((defect) => {
    if (defect.id == id) {
      defect.wo = e.target.value
      return false
    }
    return true
  })
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

const updateMO = async (id: string) => {
  const findIndex = defectMOs.value.findIndex((defect) => {
    return defect.id == id
  })
  if (findIndex < 0) return
  defectMOs.value[findIndex].load = true
  await store.updateDefectMO(id, defectMOs.value[findIndex].wo)
  defectMOs.value[findIndex].load = false
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
  let className = item.repairedStatus == 'Repaired' ? 'green' : 'red'
  className = !item.priority ? 'green' : className
  if (item.defectType == "CALIBRATION") {
    if (!isUndefined(suspensionCylinderFormStore.stateSCHeader) && !isUndefined(suspensionCylinderFormStore.stateSCHeader.status) && suspensionCylinderFormStore.stateSCHeader.status == "Submitted") {
      className = "green"
    } else {
      className = "red"
    }
  }
  return className
}

const visibilityClass = (item) => {
  if (item.status == "Decline") {
    return "invisible"
  }
  return item.priority === undefined ? 'invisible' : ''
}

const handleShowSCCalibrationFormDialog = async () => {
  const paylaod = {
    modelId: `${defectSheetStore.stateSelectedDefectSheet.brand} ${defectSheetStore.stateSelectedDefectSheet.equipmentModel}`,
    psTypeId: defectSheetStore.stateSelectedDefectSheet.psType,
    unitNumber: defectSheetStore.stateSelectedDefectSheet.unitNumber,
    workOrder: defectSheetStore.stateSelectedDefectSheet.workOrder,
    // modelId: "KOM 930E-4HPI",
    // psTypeId: "4000",
    // unitNumber: "DT0700",
    // workOrder: "9992703092",
    employee: {
      id: authStore.stateUser.EmployeeId,
      name: authStore.stateUser.Name
    }
  } as GetSCTemplatePayload
  showSuspensionTask.value = await suspensionCylinderFormStore.getSuspensionCalibrationTemplate(paylaod)
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
  if (defectType == 'CALIBRATION') {
    if (!isUndefined(suspensionCylinderFormStore.stateSCHeader) && !isUndefined(suspensionCylinderFormStore.stateSCHeader.status) && suspensionCylinderFormStore.stateSCHeader.status == "Submitted") {
      suspensionCylinderFormStore.toggleShowPreviewSuspensionCylinderHeightForm(true)
    }
  } else {
    formVisibility.value = true
  }
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

const handleDownloadPDF = (headerId, wo) => {
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
    downloadPdfDefectSupervisor.value.handleDataFetch()
  }
}

const equipmentModelGroupDescription = computed(() => {
  return checkDozer(defectSheetStore.SelectedDefectSheet.equipmentModel) ? 'Dozer' : 'Dump Truck'
})

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
