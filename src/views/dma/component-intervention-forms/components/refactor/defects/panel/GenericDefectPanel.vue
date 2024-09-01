<template>
    <div class="mt-5 ps-0">
      <el-collapse class="task-group general-accordion py-1 px-5 testing" v-model="defectIdentifiedCollapse">
        <el-collapse-item :title="titlePanel" :name="titlePanel">
                <!-- items -->
                <!-- items header -->
                <div class="row px-2 item mx-1 w-100 defect-panel-header">
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
                <template v-else v-for="item in headers" :key="item.id">
                  <div class="item px-2 my-2 mx-1 defect-panel-task">
                    <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                      <div class="col align-items-center d-flex text-break"><span class="text-break" v-html="item.taskDesc ?? ''"></span></div>
                      <div class="col-1 text-center column-sm-11-percent column-md-10-percent column-lg-5-percent align-items-center d-flex justify-content-center">
                        <template v-if="!isDecline(item)">
                          <div class="little-box justify-content-center align-items-center justify-content-center d-flex mx-auto"
                          :class="priorityClass(item.priority ?? '')" style="margin-top: 6px;">
                              <span class="text-center" style="font-weight:600; color:white">{{ item.priority }}</span>
                          </div>
                        </template>
                      </div>
                      <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">
                        <div v-if="!isDecline(item)" class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center"
                          :class="formClassDefectGeneric(item.defectHeaderId as string, headers)"
                          @click="showDetail(item)">
                          Detailed Information
                        </div>
                        <div v-else class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center red-bg text-dark-red"
                          @click="showDetail(item)">
                          Declined
                        </div>
                      </div>
                      <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center" :class="item.priority === undefined ? 'invisible' : ''">
                        <div class="row">
                          <template v-if="!isDecline(item)">
                            <div class="col-8 col-md-8 d-flex flex-column pe-0">
                              <input type="text" class="form-control mou-input" :value="item.defectWorkorder"
                                placeholder="Input Work Order"
                                :disabled="true" />
                            </div>
                            <div class="col-4 col-md-3 ps-0 pe-1">
                              <button :disabled="true"
                                class="btn btn-sm btn-success ms-2 d-flex justify-content-center align-items-center"
                                style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white; width: 46px; height:40px">
                                <i class="fa fa-save"></i>
                              </button>
                            </div>
                          </template>
                        </div>
                      </div>
                      <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex">
                        <template v-if="!isDecline(item)">
                          <div class="mx-3 little-box rounded-circle d-flex p-3 justify-content-center align-items-center mx-auto" style="margin-top: 6px;cursor: initial"
                            :class="repairedClass(item)">
                            <img src="/media/svg/dma/icons/Repair.png" alt="" />
                          </div>
                        </template>
                      </div>
                      <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" v-if="viewIsDownload">
                        <img v-if="viewIconDownload(item.status)" @click="handleConfirmationPrintPDF(item!.id as string)" class="ms-4 me-2 download-icon" src="media/svg/dma/document_download.svg" :class="!isDownloaded(item.downloadHistory) ? 'icon-red':'icon-green'" style="height: 18px" alt="">
                      </div>
                    </div>
                    <div class="row flex-nowrap w-100 flex-row-reverse create-by" style="font-size: 13px !important">
                      {{ handleFormatTimeStamp(item) }}
                    </div>
                  </div>
                </template>
                <button class="my-3 btn-add-new" @click="onAddNewDefect" v-if="showAddDefectGeneric">
                  <em class="fa fa-plus me-2"></em>
                  Add Generic Identified Defect, If Required
                </button>
        </el-collapse-item>
      </el-collapse>
    </div>
</template>


<script lang="ts" setup>
import {
  defineProps,
  computed,
  ref,
  PropType,
  defineEmits
} from 'vue'
import {
  priorityClass,
  formClassDefectGeneric,
} from '@/views/dma/components/defects/functions/defects-functions'
import { Defect } from '@/database/schema/Defect'
import { cloneDeep } from 'lodash'
import {
  checkDownloadStatus
} from "@/store/pinia/report/history/dma/helpers"
import {
  formatDateAUToRegularDate
} from '@/core/helpers/date-format'
import {
  Detail
} from '@/core/types/entities/dma/defects/component-intervention/Detail';

const props = defineProps({
  defectHeader: {
    required: true,
    type: Object as PropType<Defect[]>
  },
  defectDetail: {
    required: false,
    type: [] as PropType<Detail[]>,
    default: []
  },
  showAddDefect: {
    required: false,
    type: Boolean,
    default: true
  },
  viewIsDownload: {
    required: false,
    type: Boolean,
    default: false
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  },
})

const emits = defineEmits([
  "onViewDetailInformation",
  "onAddGenericDefect",
  "onPrintDefect"
])

/* refs */
const titlePanel = ref('Generic Defect Identified')
const defectIdentifiedCollapse = ref(titlePanel.value)

/* computeds */
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
const headers = computed(() => {
  const list = cloneDeep(props.defectHeader)
  return list.sort(sortDecline)
})
const repairedClass = (defect: Defect): string => {
  let className = defect.repairedStatus == 'Repaired' ? 'green' : 'red'
  className = !defect.priority ? 'green' : className
  return className
}

const showAddDefectGeneric = computed(() => {
  let show = false
  if (props.showAddDefect) {
    show = true
  }
  if (!props.generalSubmitted) {
    show = false
  }
  if (window.location.href.includes("monitoring-status")) {
    show = false
  }
  return show
})

/* methods */
const showDetail = (item: Defect) => {
  emits("onViewDetailInformation", {
    type: 'defectGeneric',
    taskId: item.taskId,
    taskNo: item.taskNo,
    taskDesc: item.taskDesc,
    taskStatus: item.status,
    taskDeclineReason: item.declineReason,
    taskDeclineDate: item.declineDate,
    taskDeclineBy: item.declineBy,
    taskApprovedDate: item.approvedDate,
    taskApprovedBy: item.approvedBy,
    defectHeaderId: item.defectHeaderId
  })
}

const handleFormatTimeStamp = (defectHeader) => {
  // as is logic
  let name = defectHeader.createdBy.name;
  let time = defectHeader.updatedDate != "" ? defectHeader.updatedDate : defectHeader.createdDate
  // saat fitter modify, akan update updatedDate
  // saat SPV approve maka update defect header updatedDate, jadi perlu compare data mana yang lebih baru
  const defectDetail = props.defectDetail.find((d) => {
    return d.defectHeaderId == defectHeader.defectHeaderId
  })
  if (defectDetail) {
    if (defectDetail.otherFitterUpdatedBy) {
      name = defectDetail.otherFitterUpdatedBy.name
      if (formatDateAUToRegularDate(defectDetail.updatedDate as string) > formatDateAUToRegularDate(time)) {
        time = defectDetail.updatedDate
      }
    }
  }
  return `${name}, ${time}`;
}

const isDecline = (item) => {
  return item.plannerStatus == 'Decline' || item.status == 'Decline'
}

const onAddNewDefect = () => {
  emits('onAddGenericDefect')
}

const isDownloaded = (downloadHistoryList: string | undefined) => {
  if (downloadHistoryList) {
    return checkDownloadStatus(JSON.parse(downloadHistoryList))
  }
  return false
}

const viewIconDownload = (status) => {
  if (status == "Acknowledge") {
    return true
  }
  return false
}
const handleConfirmationPrintPDF = (headerId: string) => {
  emits("onPrintDefect", {
    headerId: headerId,
    type: "defectGeneric"
  })
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
<style lang="scss" scoped>
@import "@/assets/sass/pages/defect.panel.scss";
</style>
