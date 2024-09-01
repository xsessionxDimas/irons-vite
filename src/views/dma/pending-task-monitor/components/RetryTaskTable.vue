<template>
  <div class="row">
    <table class="table sync-table">
      <thead>
        <tr>
          <th class="ps-2 py-5" scope="col">Work Order</th>
          <th class="ps-2 py-5" scope="col">Form</th>
          <th class="ps-2 py-5" scope="col">Type</th>
          <th class="ps-2 py-5" scope="col">Key</th>
          <th class="ps-2 py-5" scope="col">{{ isTask ? 'Section' : 'Name' }}</th>
          <th class="ps-2 py-5" scope="col">Error Message</th>
          <th class="px-2 py-5" scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="records.length == 0">
          <tr>
            <td class="ps-2 text-center fs-3" colspan="7" scope="row">
              <div class="d-flex justify-content-center">
                <div class="badge-finished">No data found</div>
              </div>
            </td>
          </tr>
        </template>
        <template v-else v-for="item in records" :key="item.workOrder">
          <tr>
            <th class="ps-2" scope="row">{{ item.workorder }}</th>
            <td class="ps-2">{{ item.module }}</td>
            <td class="ps-2">{{ isTask ? item.type : (item as QueueFileTask).fileType }}</td>
            <td class="ps-2">{{ item.key }}</td>
            <td class="ps-2">{{ isTask ? (item as QueueTask).section : (item as QueueFileTask).originalFilename  }}</td>
            <td class="ps-2">{{ item.errorMessage }}</td>
            <td class="px-2">
              <button @click="handleConfirmDeleteRow(item)" class="btn btn-sm btn-bg-danger me-1 text-white mb-1 hide">
                <i class="fas fa-trash-alt"></i>
              </button>
              <button @click="handleClickPayload(item)" class="btn btn-sm btn-bg-primary me-1">
                <i class="fas fa-eye fa-xl"></i>
              </button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <!-- header -->
    <!-- list -->
  </div>
  <template v-if="showPayloadModal">
    <PayloadModal
      :visibility="showPayloadModal"
      :caption="selectedPayload"
      @close-modal="handleClosePayload"
    />
  </template>
  <Confirmation :visibility="confirmDeleteVisibility"
     caption="Are you sure want to delete this data?"
     @on-no-confirm="onToggleDeleteConfirmation(false)"
     @on-yes-confirm="onDeleteConfirmSubmit" />
  <ToastWithIcon :show="successMessageBoxVisible" message="Data succesfully deleted." />
  <FilePreview :blob="selectedBlob" :original-filename="selectedFilename" :visibility="previewVisibilitiy" @on-close="() => { previewVisibilitiy = false }" />
</template>

<script setup lang="ts">
import {
  usePendingTaskMonitorListStore
} from '@/store/pinia/dma/pending-task-monitor/usePendingTaskMonitorListStore'
import {
  defineProps,
  PropType,
  ref
} from 'vue';
import PayloadModal from './PayloadModal.vue';
import FilePreview from './FilePreview.vue';
import Confirmation from '@/components/dialog/Confirmation.vue';
import ToastWithIcon from "@/components/dialog/ToastWithIcon.vue";
import { IndexableType } from 'dexie';
import { deleteRecordByKey } from '@/database/schema/DatabaseWrapper';
import { db } from '@/database/schema/DexieSchema';
import { QueueTask } from '@/database/schema/QueueTask';
import { QueueFileTask } from '@/database/schema/QueueFileTask';

const props = defineProps({
  records: {
    required: true,
    type: Array as PropType<QueueTask[] | QueueFileTask[]>
  },
  isTask: {
    required: false,
    type: Boolean,
    default: true
  }
});

const pendingTaskMonitorListStore = usePendingTaskMonitorListStore()

const showPayloadModal = ref(false)
const selectedPayload = ref("")
const selectedBlob = ref<Blob>(new Blob())
const selectedFilename = ref("")
const confirmDeleteVisibility = ref(false)
const selectedItem = ref<QueueTask | QueueFileTask>()
const successMessageBoxVisible = ref(false)
const previewVisibilitiy = ref(false)

const handleClickPayload = (item) => {
  selectedPayload.value = item.payload
  selectedItem.value = item
  if (props.isTask) {
    showPayloadModal.value = true
  } else {
    selectedBlob.value = (item as QueueFileTask).blob
    selectedFilename.value = (item as QueueFileTask).originalFilename
    previewVisibilitiy.value = true
  }
}

const handleConfirmDeleteRow = (item) => {
  onToggleDeleteConfirmation(true)
  selectedItem.value = item
}

const onDeleteConfirmSubmit = async () => {
  onToggleDeleteConfirmation(false)
  const tableName = props.isTask ? 'pendingTask' : 'pendingTaskFile'
  await deleteRecordByKey(db, tableName, selectedItem.value?.id as IndexableType)
  autoCloseSuccessMessageBox()
  await pendingTaskMonitorListStore.getTaskList()
}

const autoCloseSuccessMessageBox = () => {
  successMessageBoxVisible.value = true
  setTimeout(() => {
    successMessageBoxVisible.value = false
  }, 1000);
}

const onToggleDeleteConfirmation = (status) => {
  confirmDeleteVisibility.value = status
}

const handleClosePayload = () => {
  selectedPayload.value = ""
  showPayloadModal.value = false
}
</script>

<style scoped lang="scss">
.sync-table {
  thead {
    background-color: #F4F6F8;
    tr {
      :first-child {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }
      :last-child {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }

      th {
        font-weight: 700
      }
    }
  }
  .badge-finished {
    border: 3px solid #1fdb5d;
    padding: 5px;
    border-radius: 10px;
    color: white;
    background: #1fdb5d;
  }
}
.hide {
  display: none;
}
</style>
