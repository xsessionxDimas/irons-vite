<template>
  <div class="list-group ps-0 mt-5 mb-3">
      <div class="card">
          <el-collapse v-model="activeCollapse" class="task-group e-form-only py-1 px-5 overflow-visible appmon">
              <el-collapse-item :name="dataList.name">
                <template #title>
                  {{ dataList.name }}
                  <span class="ms-2 count-badge" v-if="showCounting">
                    {{ dataList.list.length }}
                  </span>
                </template>
                  <div class="d-flex flex-column">
                      <template v-if="displayData.length > 0 && !loading">
                          <template v-if="dataList.options">
                              <filter-input
                                :options="dataList.options"
                                @handle-select-fitter="handleSelectItemSearch"
                                :drop-down-placeholder="dataList.name == 'Digital Service Forms' ? 'Search Service Sheet': dataList.name == 'Interim Engine Service Forms'? 'Search Interim Engine Service': 'Search Component Intervention Forms'"
                              />
                          </template>
                          <!-- list e-form with defects -->
                          <template v-if="dataList.name == 'Digital Service Forms' || dataList.name == 'Interim Engine Service Forms'">
                              <template v-for="(item, index) in displayData" :key="item.dailyScheduleId">
                                  <div class="item d-flex justify-content-between my-2">
                                      <div @click="onItemClick(item)">
                                        <span class="label">{{ ((pagination.currentPage - 1) * 10) + index + 1 }}</span>
                                        <span class="label ms-5">
                                            {{ item.unitNumber }} - {{ item.brand }} {{ item.equipmentModel }} - {{ item.psType }} Hour Service - {{ item.workOrder }}
                                          </span>
                                        <template v-if="pageName == 'defect-identified'">
                                          <span class='status-badge p-1 ms-3' :class="identifiedDefctStatusBadgeColor(item.eFormStatus)">{{ getIdentifiedDefectStatStatus(item.eFormStatus, item.defectStatus) }}</span>
                                        </template>
                                        <span class='status-badge p-1 ms-3' :class="statusBadgeColor(getStatus(item.eFormStatus, item.defectStatus, item.percentage))" v-else-if="isDefectListPage">{{ getStatus(item.eFormStatus, item.defectStatus, item.percentage) }}</span>
                                        <template v-else>
                                          <span class='status-badge p-1 ms-3' :class="monStatStatusBadgeColor(item.status)" v-if="isInProgress">{{ getMonStatStatus(item.status, item.defectStatus, item.percentage) }}</span>
                                        </template>
                                      </div>
                                      <div>
                                        <span class="label item__timestamp" v-if="isMonitoring">
                                          {{ formatDate(item) }}
                                          <template v-if="isClosed">
                                            <img @click="handleDownloadPDF(item)" class="ms-4 me-2 download-icon" src="/media/svg/dma/document_download.svg" :class="!isDownloaded(item) ? 'icon-red':'icon-green'" style="height: 18px" alt="">
                                          </template>
                                        </span>
                                      </div>
                                  </div>
                              </template>
                          </template>

                          <!-- list intervention with defects -->
                          <template v-else>
                              <template v-for="(item, index) in displayData" :key="item.interventionId">
                                  <div class="item d-flex flex-fill my-2 align-items-center">
                                      <span class="label">{{ ((pagination.currentPage - 1) * 10) + index + 1 }}</span>
                                      <div class="d-flex flex-column w-100">
                                        <div class="d-flex justify-content-between">
                                          <div>
                                            <span class="label ms-5 intervention-label" @click="onItemClick(item)">
                                              {{ item.equipment }} - {{ item.equipmentDesc }} - <span :class="item.sampleStatus?.toLowerCase() == 'caution' ? 'yellow' : item.sampleStatus?.toLowerCase() == 'normal' ? 'green' : 'red'">{{ item.sampleStatus }} Intervention</span> - {{ item.componentSystem }} - {{ item.sapWorkOrder }}
                                            </span>
                                            <span class='status-badge p-1 ms-3' :class="statusBadgeColor(getStatus(item.intFormStatus, item.defectStatus, item.percentage))" v-if="isDefectListPage">{{ getStatus(item.intFormStatus, item.defectStatus, item.percentage) }}</span>
                                            <template v-else>
                                              <span class='status-badge p-1 ms-3' :class="monStatStatusBadgeColor(item.interventionExecution)" v-if="isInProgress">{{ getMonStatStatus(item.interventionExecution, item.defectStatus, item.percentage) }}</span>
                                            </template>
                                          </div>
                                          <div>
                                            <em v-if="item.isPendingSync && item.isPendingSync == true" class="fa fa-recycle me-5" @click.prevent="retrySyncClick(item.sapWorkOrder)"></em>
                                            <em v-if="item.isPendingSync && item.isPendingSync == true" class="fa fa-trash-alt" @click.prevent="revokeSyncClick(item.sapWorkOrder)"></em>
                                            <span class="label item__timestamp" v-if="isMonitoring">
                                              {{ formatDate(item) }}
                                              <template v-if="isClosed">
                                                <img @click="handleDownloadPDF(item)" class="ms-4 me-2 download-icon" src="/media/svg/dma/document_download.svg" :class="!isDownloaded(item) ? 'icon-red':'icon-green'" style="height: 18px" alt="">
                                              </template>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                  </div>
                              </template>
                          </template>

                          <template v-if="displayData.length > 0">
                              <Pagination
                                  @raise-page-change="handlePageChange($event)"
                                  :currentPage="pagination.currentPage"
                                  :totalPage="pagination.totalPage"
                                  :totalPageSize="pagination.totalPageSize"
                                  :startPaginationIndex="pagination.startPaginationIndex"
                                  :endPaginationIndex="pagination.endPaginationIndex"
                              />
                          </template>
                      </template>
                      <template v-else>
                        <div class="d-flex justify-content-center mt-8">
                            <template v-if="!loading">
                                <h5 style="color: #919EAB;">No Data Display</h5>
                            </template>
                        </div>
                      </template>
                  </div>
              </el-collapse-item>
          </el-collapse>
      </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  defineProps,
  defineEmits,
  PropType,
  watch,
  onMounted,
} from 'vue';
import {
  ListDefectSheet
} from "@/core/types/entities/dma/defects/ListDefectSheet";
import Pagination from "@/components/pager/Pagination.vue";
import PaginationListClass from "@/core/classes/PaginationListClass";
import {
  formatDateMonitoring,
  dynamicDateFormatter
} from '@/core/helpers/date-format';
import FilterInput from "@/components/e-form/filter-input/Index.vue";
import {
  statusBadgeBasedOnMonitoring,
  statusBadgeColor
} from "@/store/pinia/dma/e-form/helpers"

const props = defineProps({
  dataList: {
    required: true,
    type: Object as PropType<ListDefectSheet>
  },
  loading: {
    required: true,
    type: Boolean
  },
  isMonitoring: {
    required: false,
    type: Boolean,
    default: false
  },
  isClosed: {
    required: false,
    type: Boolean,
    default: false
  },
  isInProgress: {
    required: false,
    type: Boolean,
    default: false
  },
  isDefectListPage: {
    required: false,
    type: Boolean,
    default: false
  },
  selectedHeader: {
    required: false,
    type: String,
    default: ""
  },
  pageName: {
    required: false,
    type: String,
    default: "",
  },
  showCounting: {
    default: true,
    required: false
  }
})

const emits = defineEmits([
  "onItemClick",
  "handleDownloadPDF",
  "onRetrySync",
  "onRevokeSync"
]);
const data = new PaginationListClass();

const displayData = ref<any[]>([]);
const pagination = ref(data.getPagination());

watch(() => {
  return props.dataList && props.dataList.list
}, (newVal) => {
  data.setData(newVal);
  data.setPage(1);
  reload();
})

/* ref */
const activeCollapse = ref("")

const handlePageChange = (newPage: number) => {
  data.setPage(newPage);
  reload();
};

const reload = () => {
  displayData.value = data.getDisplayData();
  pagination.value = data.getPagination();
}

/* event handlers */
const formatDate = (item) => {
  if (props.dataList.name == "Component Intervention Forms") {
    let date = ''
    if (props.selectedHeader == 'Yet To Start') {
      if (item.estimationCompletionDate) {
        date = dynamicDateFormatter(item.estimationCompletionDate, "YYYY-MM-DD HH:mm:ss", "DD.MM.YYYY")
      }
    } else if (props.selectedHeader == 'In Progress') {
      if (item.serviceStart) {
        date = dynamicDateFormatter(item.serviceStart.substring(0, 8), "DD/MM/YY", "DD.MM.YYYY")
      }
    } else if (props.selectedHeader == 'Under Review' || props.selectedHeader == 'Final Review' || props.selectedHeader == 'Closed') {
      if (item.serviceEnd) {
        date = dynamicDateFormatter(item.serviceEnd.substring(0, 8), "DD/MM/YY", "DD.MM.YYYY")
      }
    }
    return date
  }
  let date = ''
  if (props.selectedHeader == 'Yet To Start') {
    date = item.dateService
  } else if (props.selectedHeader == 'In Progress') {
    date = item.serviceStart
  } else if (props.selectedHeader == 'Under Review' || props.selectedHeader == 'Final Review' || props.selectedHeader == 'Closed') {
    date = item.serviceEnd
  }
  return formatDateMonitoring(date)
}

const onItemClick = (item) => {
  emits("onItemClick", {
    name: props.dataList.name,
    item: item
  })
}
const retrySyncClick = (workOrder: string) => {
  emits('onRetrySync', workOrder)
}
const revokeSyncClick = (workOrder: string) => {
  emits('onRevokeSync', workOrder)
}
const handleSelectItemSearch = (value) => {
  const optionData = props.dataList.options.findIndex((val) => {
    return val.value == value
  })
  if (optionData >= 0) {
    data.setData([props.dataList.list[optionData]]);
  }
  reload();
}

const handleDownloadPDF = (e) => {
  emits("handleDownloadPDF", {
    name: props.dataList.name,
    item: e
  })
}

onMounted(() => {
  data.setData(props.dataList.list)
  activeCollapse.value = props.dataList.expand ? props.dataList.name : ""
  reload();
})

const isDownloaded = (item) => {
  return item.isDownload && item.isDownload == "true"
}

watch(() => {
  return props.dataList.expand
}, () => {
  activeCollapse.value = props.dataList.expand ? props.dataList.name : ""
})

const getStatus = (status, defectStatus, progress) => {
  return statusBadgeBasedOnMonitoring(status, defectStatus, progress)
}

const getMonStatStatus = (status, defectStatus, progress) => {
  if (status == "Open") {
    return "Yet to Start"
  } else if (status == "On Progress") {
    return `${progress}%`
  } else if (status == "Submited") {
    return "Under Review"
  } else if (status == "Close") {
    if (defectStatus == "Approved (SPV)") {
      return "Final Review"
    } else if (defectStatus == "Completed") {
      return "Closed"
    }
  }
  return ""
}

const getIdentifiedDefectStatStatus = (status, defectStatus) => {
  if (status == "Open") {
    return "Yet to Start"
  } else if (status == "On Progress") {
    return `In Progress`
  } else if (status == "Submited") {
    return "Under Review"
  } else if (status == "Close") {
    if (defectStatus == "Approved (SPV)") {
      return "Final Review"
    } else if (defectStatus == "Completed") {
      return "Closed"
    }
  }
  return ""
}

const identifiedDefctStatusBadgeColor = (formStatus) => {
  if (formStatus == "Open") {
    return "gray"
  } else if (formStatus == "On Progress") {
    return "blue"
  } else if (formStatus == "Submited") {
    return "soft-yellow"
  } else if (formStatus == "Close") {
    return "green"
  }
  return ""
}

const monStatStatusBadgeColor = (formStatus) => {
  if (formStatus == "Open") {
    return "gray"
  } else if (formStatus == "On Progress") {
    return "blue"
  } else if (formStatus == "Submited" || formStatus == "Close") {
    return "green"
  }
  return ""
}

</script>

<style lang="scss" scoped>
@import "@/assets/sass/pages/defect-review.scss";
@import "@/assets/sass/pages/intervention-label.scss";
</style>

<style lang="scss">
.appmon {
  .el-collapse-item__header {
    height: 48px;
  }
}
.list-group {
  .option-wrapper {
    position: absolute;
    top: 50px;
    left: 10px;
    width: calc(100% - 24px);
  }

  .el-collapse-item__wrap{
    overflow: visible !important;
  }

  .download-icon {
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

.count-badge {
  background-color: #DC1641;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left:6px;
  padding-right:6px;
  border-radius: 10px;
  font-size: 12px;
  color: white;
}
</style>
