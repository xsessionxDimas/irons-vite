<template>
  <div class="div">
    <div class="d-flex justify-content-end">
      <el-date-picker
        v-model="dateRangeFilter"
        class="btn btn-outline filter-date-monitoring"
        popper-class="filter-date-monitoring-popper"
        type="daterange"
        unlink-panels
        range-separator="-"
        start-placeholder="Start date"
        end-placeholder="End date"
        format="DD/MM/YYYY"
        :clearable="true"
        @change="handleDateRange"
      />
    </div>
    <template v-for="list in MonitoringList" :key="list.name">
      <ListGroup
        :dataList="list"
        :loading="loading"
        :is-monitoring="true"
        :is-closed="listStore.stateSelectedHeader == 'Closed'"
        :is-in-progress="listStore.stateSelectedHeader == 'In Progress'"
        @onItemClick="handlePreview"
        @handle-download-p-d-f="handleDownloadPDF"
        @on-retry-sync="handleRetryTask"
        @on-revoke-sync="handleRevokeRetryTask"
        :selectedHeader="listStore.stateSelectedHeader"
      />
    </template>
  </div>
  <exportPdf ref="downloadPdf" :file-name="fileNameRef" :add-time-stamp="timeStamp" @on-download-finish="(item) => handleChangeIconDownload('Digital Service Forms', item)" />
  <exportInterimPdf ref="downloadInterimPdf" :file-name="fileNameRef" :add-time-stamp="timeStamp" @on-download-finish="(item) => handleChangeIconDownload('Interim Engine Service Forms', item)"/>
  <exportPdfIntervention ref="downloadInterventionPdf" :file-name="fileNameRef" :add-time-stamp="timeStamp" @on-download-finish="(item) => handleChangeIconDownload('Component Intervention Forms', item)"/>
  <RetryDialog :in-process="syncInProcess" :result="syncResult" :visibility="showRetryDialog" @on-closed="handleCloseRetryTask" />
</template>

<script lang="ts" setup>
import { ElLoading } from 'element-plus';
import {
  usePreviewFormStore
} from '@/store/pinia/dma/preview-form/usePreviewFormStore';
import {
  useInterimPreviewFormStore
} from '@/store/pinia/dma/preview-form-interim/useInterimPreviewFormStore';
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore';
import {
  useMonitoringListStore
} from '@/store/pinia/dma/status-monitoring/useMonitoringListStore';
import {
  useDefectsStore
} from '@/store/pinia/dma/e-form/defects/useDefectsStore';
import {
  useDefectsFormStore
} from '@/store/pinia/dma/e-form/defects/useDefectsFormStore';
import {
  useInterimDefectsStore
} from '@/store/pinia/dma/interim-engine-service/defects/useInterimDefectsStore';
import { useEFormStore } from '@/store/pinia/dma/e-form/useEFormStore';
import {
  useInterimEngineStore
} from '@/store/pinia/dma/interim-engine-service/useInterimEngineStore';
import {
  computed,
  ref,
  onMounted,
  watch
} from 'vue';
import { List } from '@/core/types/entities/dma/monitoring-status/List';
import {
  getUTCOffsetDate,
  formatDateHelper,
  addCurrentDateWithFormatHelper,
  substractCurrentDateWithFormatHelper,
  formatCurrentDateHelper
} from '@/core/helpers/date-format';
import { useRouter } from "vue-router";
import exportPdf from "@/components/e-form/export-kendo/Index.vue";
import exportPdfIntervention from "@/components/intervention-form/export-kendo/Index.vue";
import exportInterimPdf from "@/components/e-form/export-kendo/InterimIndex.vue";
import RetryDialog from '@/components/dialog/RetryDialog.vue';
import {
  useGeneralFormStore
} from '@/store/pinia/dma/e-form/useGeneralFormStore';
import ListGroup from "@/components/e-form/ListGroup.vue"
import {
  ListDefectSheet
} from '@/core/types/entities/dma/defects/ListDefectSheet';
import {
  InterventionList
} from "@/core/types/entities/dma/monitoring-status/InterventionList"
import {
  useInterventionFormSyncStore
} from '@/store/pinia/dma/component-intervention/refactor/useInterventionFormSyncStore';
import { SyncResult } from '@/core/types/intervention/SyncResult';
import { Intervention } from '@/core/types/intervention/Intervention';
import {
  useComponentInterventionDetailStore
} from '@/store/pinia/dma/component-intervention/refactor/useComponentInterventionDetailStore';
import {
  useComponentInterventionHeaderStore
} from '@/store/pinia/dma/component-intervention/refactor/useComponentInterventionHeaderStore';
import {
  useComponentInterventionDefectsIdentifiedStore
} from '@/store/pinia/dma/component-intervention/refactor/useComponentInterventionDefectsIdentifiedStore';
import { defineProps } from "vue";
import { isEqual } from 'lodash';
import {
  useGeneralFormStore as useOfflineGeneralFormStore
} from "@/store/pinia/dma/e-form-offline/useGeneralFormStore";
import {
  useInterimGeneralFormStore
} from '@/store/pinia/dma/interim-engine-service/useInterimGeneralFormStore';

const props = defineProps(['fromApprovalPageType'])
const authStore = useAuthenticationStore()
const previewFormStore = usePreviewFormStore()
const previewFormInterimStore = useInterimPreviewFormStore()
const listStore = useMonitoringListStore()
const syncStore = useInterventionFormSyncStore()
const store = useDefectsStore();
const defectFormStore = useDefectsFormStore();
const formStore = useEFormStore();
const formInterimStore = useInterimEngineStore();
const storeDefectInternim = useInterimDefectsStore();
const router = useRouter()
const generalStore = useGeneralFormStore()

const downloadPdf = ref()
const downloadInterimPdf = ref()
const downloadInterventionPdf = ref()
const fileNameRef = ref()
const timeStamp = ref("")
const showRetryDialog = ref(false)
const syncInProcess = ref(false)
const syncResult = ref<SyncResult[]>([])

const dateRangeFilter = ref<string[]>(listStore.defaultRange);

const list = computed(() => {
  return listStore.list
})

const interventionList = computed(() => {
  return listStore.interventionList
})

const interimnList = computed(() => {
  return listStore.interimnList
})

const loading = computed(() => {
  return listStore.listLoading
})

const selectedHeader = computed(() => {
  return listStore.selectedHeader;
});


const getDefaultDate = () => {
  if (selectedHeader.value == "Yet To Start") listStore.setDefaultFilterDateRangeForYetToStart()
  else listStore.setDefaultFilterDateRange();
}

const handlePreview = (item) => {
  if (item.name == "Digital Service Forms") {
    handlePreviewFormEform(item.item)
  } else if (item.name == "Interim Engine Service Forms") {
    handlePreviewFormEformInterim(item.item)
  } else {
    handlePreviewFormIntervention(item.item)
  }
}

const MonitoringList = computed(() => {
  if (selectedHeader.value == "Yet To Start") {
    return [
      {
        name: "Digital Service Forms",
        list: list.value,
        options: listStore.serviceSheetOptions,
        expand: props.fromApprovalPageType == "Digital Service Forms"
      },
      {
        name: "Component Intervention Forms",
        list: interventionList.value,
        options: listStore.serviceSheetInterventionOptions,
        expand: props.fromApprovalPageType == "Component Intervention Forms"
      }
    ] as ListDefectSheet[]
  }
  return [
    {
      name: "Digital Service Forms",
      list: list.value,
      options: listStore.serviceSheetOptions,
      expand: props.fromApprovalPageType == "Digital Service Forms"
    },
    {
      name: "Interim Engine Service Forms",
      list: interimnList.value,
      options: listStore.serviceSheetInterimOptions,
      expand: props.fromApprovalPageType == "Interim Engine Service Forms"
    },
    {
      name: "Component Intervention Forms",
      list: interventionList.value,
      options: listStore.serviceSheetInterventionOptions,
      expand: props.fromApprovalPageType == "Component Intervention Forms"
    }
  ] as ListDefectSheet[]
})

const updateTimeStamp = () => {
  const loggedInUser = authStore.user.Name
  const timeServer = getUTCOffsetDate(generalStore.stateTimeZone)
  timeStamp.value = `Printed at ${timeServer} (${generalStore.stateTimeZoneDesc}) by ${loggedInUser}`
}
const handlePreviewFormIntervention = async (item: InterventionList) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Generating Form',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const interventionHeaderStore = useComponentInterventionHeaderStore()
  const interventionDetailStore = useComponentInterventionDetailStore()
  interventionDetailStore.resetIntervention()
  interventionHeaderStore.reset()
  const interventionDefectIdentifiedStore = useComponentInterventionDefectsIdentifiedStore()
  const intervention = await interventionHeaderStore.getWorkOrderDetailById(item.keyPbi) as unknown as Intervention
  interventionDetailStore.initGroup(intervention)
  await interventionDefectIdentifiedStore.getDefectsData(intervention.id, intervention.sapWorkOrder)
  await interventionDetailStore.getCountIdentifiedDefect()
  await defectFormStore.getOwnershipDefectForm(intervention.equipment)
  interventionDetailStore.setSerialNumber(defectFormStore.SerialNumber)
  loading.close()
  router.push({ name: 'monitoringstatusintervention' })
}

const handlePreviewFormEform = async (item: List) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Generating Form',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const offlineGeneralStore = useOfflineGeneralFormStore()
  offlineGeneralStore.setSMUActual(Number(item.smuDue))
  await offlineGeneralStore.getSMUTolerance();
  previewFormStore.setSelectedWorkOrder(item)
  previewFormStore.setModelAndPsTypeId(`${item.brand} ${item.equipmentModel}`, item.psType.toString(), item.workOrder, item.unitNumber)
  await previewFormStore.postGenerateServiceSheet(authStore.user.EmployeeId, authStore.user.Name, authStore.user.SiteId)
  await store.getDefectsData(item.workOrder.toString());
  await defectFormStore.getOwnershipDefectForm(item.unitNumber)
  await defectFormStore.getPartReference(item.unitNumber)
  previewFormStore.setSerialNumberGeneral(defectFormStore.SerialNumber)
  formStore.setModelAndPsTypeId('', item.psType.toString(), '', item.equipmentModel, '');
  await formStore.getEhmsRating();
  loading.close()
  router.push({ name: 'monitoringstatuspreview' })
}

const handlePreviewFormEformInterim = async (item: List) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Generating Form',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const interimGeneralStore = useInterimGeneralFormStore()
  interimGeneralStore.setSMUActual(Number(item.smuDue))
  await interimGeneralStore.getSMUTolerance()
  previewFormInterimStore.setSelectedWorkOrder(item)
  previewFormInterimStore.setModelAndPsTypeId(`${item.brand} ${item.equipmentModel}`, item.psType.toString(), item.workOrder, item.unitNumber)
  await previewFormInterimStore.postGenerateServiceSheet(authStore.user.EmployeeId, authStore.user.Name, authStore.user.SiteId)
  await storeDefectInternim.getDefectsData(item.workOrder.toString());
  await defectFormStore.getOwnershipDefectForm(item.unitNumber)
  previewFormInterimStore.setSerialNumberGeneral(defectFormStore.SerialNumber)
  formInterimStore.setModelAndPsTypeId('', item.psType.toString(), '', item.equipmentModel, '');
  await formInterimStore.getEhmsRating();
  loading.close()
  router.push({ name: 'monitoringstatusInterimpreview' })
}

const handleCloseRetryTask = async () => {
  await listStore.revalidate()
  showRetryDialog.value = false
}
const handleRetryTask = async (sapWorkOrder: string) => {
  showRetryDialog.value = true
  syncInProcess.value = true
  const tasks = await syncStore.GetRetryTasks(sapWorkOrder)
  syncResult.value = []
  tasks.forEach(async (task, index) => {
    const result = await syncStore.RetrySync(task, index)
    syncResult.value.push(result)
    if (index == tasks.length - 1) {
      syncInProcess.value = false
    }
  })
}
const handleRevokeRetryTask = async (sapWorkOrder: string) => {
  await syncStore.RevokeSync(sapWorkOrder)
  await listStore.revalidate()
}
const handleDownloadPDF = (item) => {
  if (item.name == "Digital Service Forms") {
    updateTimeStamp()
    fileNameRef.value = `${item.item.unitNumber} - ${item.item.brand} ${item.item.equipmentModel} - ${item.item.psType} Hour Service - ${item.item.workOrder}`
    downloadPdf.value.handleFetchItem(item.item)
  } else if (item.name == "Interim Engine Service Forms") {
    updateTimeStamp()
    fileNameRef.value = `${item.item.unitNumber} - ${item.item.brand} ${item.item.equipmentModel} - ${item.item.psType} Hour Service - ${item.item.workOrder}`
    downloadInterimPdf.value.handleFetchItem(item.item)
  } else {
    updateTimeStamp()
    fileNameRef.value = `${item.item.equipment} - ${item.item.equipmentDesc} - ${item.item.sampleStatus} Intervention - ${item.item.sapWorkOrder}`
    downloadInterventionPdf.value.handleFetchItem(item.item)
  }
}

const handleChangeIconDownload = (name, item) => {
  if (authStore.user.isPlanner == 1) {
    listStore.updateDownloadHistory(name, item)
  }
}

const handleDateRange = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading Monitoring Status List',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (!dateRangeFilter.value || dateRangeFilter.value.length === 0) {
    getDefaultDate()
    dateRangeFilter.value = listStore.defaultRange
  }
  listStore.setDefaultFilter(formatDateHelper(dateRangeFilter.value[0], "YYYY-MM-DD"), formatDateHelper(dateRangeFilter.value[1], "YYYY-MM-DD"))
  await listStore.setHeaderChange(selectedHeader.value)
  loading.close()
}

const setInitialRange = (oldHeader) => {
  let oldDefaultRange = ['', ''];
  if (oldHeader == "Yet To Start" || oldHeader == "Open") {
    oldDefaultRange[0] = substractCurrentDateWithFormatHelper(7, "days", "YYYY-MM-DD");
    oldDefaultRange[1] = addCurrentDateWithFormatHelper(7, "days", "YYYY-MM-DD");
  } else {
    oldDefaultRange[0] = substractCurrentDateWithFormatHelper(7, "days", "YYYY-MM-DD");
    oldDefaultRange[1] = formatCurrentDateHelper("YYYY-MM-DD");
  }
  // when filter is still default then to default
  if (isEqual(oldDefaultRange, dateRangeFilter.value)) {
    dateRangeFilter.value = listStore.defaultRange
  }
}

onMounted(() => {
  generalStore.getServerTimestamp()
})

watch(() => {
  return selectedHeader.value
}, (_, oldValue: string) => {
  setInitialRange(oldValue)
})

watch(() => {
  return dateRangeFilter.value
}, () => {
  if (!dateRangeFilter.value || dateRangeFilter.value.length === 0) {
    getDefaultDate()
    dateRangeFilter.value = listStore.defaultRange
  }
})
</script>

<style lang="scss">
  .monitoring-item {
    border-radius: 12px;
    :hover {
      cursor: pointer;
    }
    .item__desc {
      font-weight: 400;
      font-size: 14px;
      color: #212B36;

      &.text-green {
        color: #18AF4A;
      }

      &.text-yellow {
        color: orange;
      }
    }
    .item__timestamp {
      text-align: right;
      font-weight: 400;
      font-size: 14px;
      color: #637381;
      word-wrap: break-word
    }
  }

  .filter-date-monitoring {
    &.el-range-editor.el-input__inner {
      border: 1px solid #DFE3E8;
      padding: 0.5rem 1rem;
      min-height: 0;
      width: 250px;
    }

    .el-input__icon, input, .el-range-separator {
      font-weight: 600;
      color: #212B36;
    }

    .el-range-separator {
      display: flex;
      align-items: center;
      padding: 0 3px;
    }

    &-popper {
      .el-date-table td.end-date span, .el-date-table td.start-date span {
        background-color: #18AF4A;
      }
      .el-date-table td.in-range div {
        background-color: #E8F7ED;
      }
      .el-date-table td.today span {
        color: #18AF4A;
      }
    }
  }
</style>
