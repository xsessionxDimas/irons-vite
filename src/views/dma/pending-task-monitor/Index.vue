<template>
  <div class="wrapper d-flex flex-column flex-fill">
    <div class="d-flex justify-content-between align-items-center">
      <p class="page-title">Offline Sync Monitoring</p>
      <div>
        <online-status></online-status>
      </div>
    </div>

    <div class="col-12 w-100% bg-white">
      <div class="row ms-2 mb-10">
        <SyncTable
          :records="pendingTaskMonitorListStore.statePendingListNew"
        />
      </div>
      <el-tabs v-model="activeTab" type="border-card" class="sync-tabs">
        <el-tab-pane label="Data" name="data">
          <div class="row mx-2 justify-content-end mb-2">
            <div class="col-3 col-lg-2 col-xl-1 pe-1">
              <button @click="handleExportData" class="btn btn-sm btn-bg-primary text-white custom-retry-button d-flex text-center w-100">
                <span class="text-center flex-fill">
                  Export Data
                </span>
              </button>
            </div>
            <div class="col-3 col-lg-2 col-xl-1 pe-1 hide">
              <button :disabled="pendingTaskMonitorListStore.statePendingList.length == 0" @click="handleConfirmDeleteRow" class="btn btn-sm btn-bg-danger text-white custom-retry-button d-flex text-center w-100">
                <span class="text-center flex-fill">
                  Delete All
                </span>
              </button>
            </div>
            <div class="col-3 col-lg-2 col-xl-1 ps-1">
              <button @click="handleRetrySync" class="btn btn-sm btn-bg-light custom-retry-button d-flex text-center w-100">
                <template v-if="pendingTaskMonitorListStore.stateLoadingRetry">
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </template>
                <span class="text-center flex-fill">
                  Retry Sync
                </span>
              </button>
            </div>
          </div>
          <div class="row ms-2">
            <RetryTable :records="pendingTaskMonitorListStore.dataTasks" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="Files" name="files">
          <div class="row mx-2 justify-content-end mb-2">
            <div class="col-3 col-lg-2 col-xl-1 pe-1">
              <button @click="handleExportDataFile" class="btn btn-sm btn-bg-primary text-white custom-retry-button d-flex text-center w-100">
                <span class="text-center flex-fill">
                  Export Data
                </span>
              </button>
            </div>
            <div class="col-3 col-lg-2 col-xl-1 pe-1 hide">
              <button :disabled="pendingTaskMonitorListStore.statePendingList.length == 0" @click="handleConfirmDeleteRow" class="btn btn-sm btn-bg-danger text-white custom-retry-button d-flex text-center w-100">
                <span class="text-center flex-fill">
                  Delete All
                </span>
              </button>
            </div>
            <div class="col-3 col-lg-2 col-xl-1 ps-1">
              <button @click="handleRetrySync" class="btn btn-sm btn-bg-light custom-retry-button d-flex text-center w-100">
                <template v-if="pendingTaskMonitorListStore.stateLoadingRetry">
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </template>
                <span class="text-center flex-fill">
                  Retry Sync
                </span>
              </button>
            </div>
          </div>
          <div class="row ms-2">
            <RetryTable :records="pendingTaskMonitorListStore.fileTasks" :is-task="false" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <ErrorDialog :visibility="confirmDeleteVisibility"
    :caption="deleteAllPendingData"
    yes-label="Yes"
    no-label="No"
    @on-no-confirm="onToggleDeleteConfirmation(false)"
    @on-yes-confirm="onDeleteConfirmSubmit" />
  />
  <GeneralDialog
    modal-type="errorSync"
    :word-breaker="true"
    :show="showErrorDialog"
    :message="errorSyncMessage"
    @close="() => { showErrorDialog = false }"
  />
  <ToastWithIcon :show="successMessageBoxVisible" message="All data succesfully deleted." />
</template>

<script setup lang="ts">
import {
  usePendingTaskMonitorListStore
} from '@/store/pinia/dma/pending-task-monitor/usePendingTaskMonitorListStore'
import { onBeforeMount, ref } from 'vue';
import SyncTable from "./components/PendingTaskTable.vue"
import RetryTable from "./components/RetryTaskTable.vue"
import { db } from '@/database/schema/DexieSchema';
import {
  useInterventionFormSyncStore
} from '@/store/pinia/dma/component-intervention/refactor/useInterventionFormSyncStore';
import OnlineStatus from '@/components/sensors/OnlineStatus.vue'
import ToastWithIcon from "@/components/dialog/ToastWithIcon.vue";
import {
  clearRecords,
  tableToArray
} from '@/database/schema/DatabaseWrapper';
import GeneralDialog from '@/views/dma/components/GeneralDialog.vue';
import ErrorDialog from '@/components/alert/ErrorDialog.vue'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import XLSX from 'xlsx';
import { QueueTask } from '@/database/schema/QueueTask';

const pendingTaskMonitorListStore = usePendingTaskMonitorListStore()
const syncStore = useInterventionFormSyncStore()

const activeTab = ref("data")
const successMessageBoxVisible = ref(false)
const confirmDeleteVisibility = ref(false)
const showErrorDialog = ref(false)
const errorSyncMessage = ref(`Please export the data using the 'Export' button and send the file to your supervisor. Additionally, ask your supervisor to contact us at support@bukittechnology.com and jacob.staader@buma.com.au for further assistance.`)
const deleteAllPendingData = ref(`<span style="font-weight: normal">This action will <b>delete all data include pending synced data</b>. Are you sure want to proceed?</span>`)

onBeforeMount(async () => {
  await pendingTaskMonitorListStore.getPendingTaskList()
  await pendingTaskMonitorListStore.getPendingFileTaskList()
  await pendingTaskMonitorListStore.getTaskList()
  await pendingTaskMonitorListStore.getFileTaskList()
  pendingTaskMonitorListStore.getpendingList()
})

const handleConfirmDeleteRow = () => {
  onToggleDeleteConfirmation(true)
}

const handleExportData = async () => {
  const allRows = await tableToArray<QueueTask>(db, 'pendingTask')
  const data = XLSX.utils.json_to_sheet(allRows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, data, 'data')
  XLSX.writeFile(wb, 'sync data.xlsx')
}

const handleExportDataFile = async () => {
  const allRows = await tableToArray<QueueTask>(db, 'pendingTaskFile')
  const data = XLSX.utils.json_to_sheet(allRows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, data, 'data')
  XLSX.writeFile(wb, 'sync data.xlsx')
}

const onToggleDeleteConfirmation = (status) => {
  confirmDeleteVisibility.value = status
}

const onDeleteConfirmSubmit = async () => {
  onToggleDeleteConfirmation(false)
  await clearRecords(db, 'pendingTask')
  await clearRecords(db, 'pendingTaskFile')
  autoCloseSuccessMessageBox()
  await pendingTaskMonitorListStore.getPendingTaskList()
  await pendingTaskMonitorListStore.getPendingFileTaskList()
  await pendingTaskMonitorListStore.getTaskList()
  await pendingTaskMonitorListStore.getFileTaskList()
}

const autoCloseSuccessMessageBox = () => {
  successMessageBoxVisible.value = true
  setTimeout(() => {
    successMessageBoxVisible.value = false
  }, 1000);
}

const handleRetrySync = async () => {
  if (isOfflineOrSlowInternetConnection()) {
    return
  }
  pendingTaskMonitorListStore.toggleLoadingRetry(true)
  const error = await syncStore.RetrySyncData()
  pendingTaskMonitorListStore.toggleLoadingRetry(false)
  await pendingTaskMonitorListStore.getTaskList()
  await pendingTaskMonitorListStore.getFileTaskList()
  if (error) {
    // show general dialog
    showErrorDialog.value = true
  }
}
</script>

<style lang="scss" scoped>
  @import "@/assets/sass/pages/defect-review.scss";

  .custom-retry-button {
    font-weight: 700;
  }
  .sync-tabs {
    margin-top: 10px;
    margin-left: 7px;
    margin-right: 7px;
  }
  .sync-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }

  .hide {
    display: none;
  }
</style>
