<template>
  <template>
    <div
      v-loading.fullscreen.lock="bulkStore.loading"
      element-loading-text="Submitting Data"
      element-loading-background="rgba(0, 0, 0, 0.5)"
    ></div>
    <div
      v-loading.fullscreen.lock="formStore.loading"
      :element-loading-text="'Loading'"
      element-loading-background="rgba(0, 0, 0, 0.5)"
    ></div>
  </template>
  <section class="px-3 py-8 d-flex">
    <div class="flex-grow-1">
      <h5 class="m-0 header-title">CBM Parameter</h5>
    </div>
    <div class="align-self-start d-flex gap-2">
      <el-button
        class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-lg m-0"
        @click="handleUploadClick"
        >
        <i class="fas fa-file-upload text-btech-secondary-500 fs-4 pe-2"></i>
        Upload
      </el-button>
      <input
        ref="bulkFile"
        type="file"
        accept=".xlsx"
        hidden
        @change="handleUploadBulk"
      />
    </div>
  </section>
  <section>
    <el-tabs v-model="activeTabs" @tab-click="handleTabChange">
      <el-tab-pane label="LIST" name="list">
        <Alert
          v-model:show-alert="bulkStore.stateAlert.show"
          :variant="bulkStore.alertVariant"
          :desc="bulkStore.alertDesc"
        />
        <section v-if="draftData.length > 0" class="card mb-6">
          <el-collapse
            v-model="toggleDraftCollapse"
            class="card-body p-3 ironlake-draft-collapse"
          >
            <el-collapse-item name="draftPanel">
              <template #title>
                <p class="m-0">
                  Need Review
                  <span class="text-btech-danger-500"> ({{ draftData.length }})</span>
                </p>
              </template>
              <section class="mb-6"></section>
              <DraftTable :list-data="draftData"  @delete-draft="handleDeleteDraft($event)" @show-errors="handleShowErrorModals" @show-dialog="handleShowFormEditDraftDialog" @load-page="reloadList"/>
            </el-collapse-item>
          </el-collapse>
        </section>
        <section class="card mb-10">
          <div class="card-body p-3">
            <div class="d-flex justify-content-between my-4 align-items-center">
              <div class="d-flex gap-2 align-items-center">
                <p class="m-0 card-table-title">CBM Parameter List</p>
                <p class="m-0" v-if="!listStore.loading">Last Sync At : {{ formatDateAU(listStore.stateLastSyncDate) }}</p>
              </div>
              <div class="d-flex justify-content-between gap-2">
                <FilterButton @apply-filter="value => applyFilter(value)" />
                <DownloadButton @handle-download="handleDownload" />
              </div>
            </div>
            <ListTable :list-data="listData" @show-dialog="handleShowFormEditDialog"/>
            <div class="my-5">
              <Pagination v-if="!listStore.paginationLoading"
                @raise-page-change="handlePaginationChange($event)"
                @raise-size-change="handleSizeChange($event)"
                :currentPage="pagination.currentPage"
                :totalPage="pagination.totalPage"
                :totalPageSize="pagination.totalPageSize"
                :startPaginationIndex="pagination.startPaginationIndex"
                :endPaginationIndex="pagination.endPaginationIndex"
                :isPageSizeChange="true"
                :pageSizes="[50,20,10]"
              />
            </div>
          </div>
        </section>
      </el-tab-pane>
      <el-tab-pane label="SYNC HISTORY" name="sync">
        <section class="card mb-10">
          <div class="card-body p-3">
            <h5 class="mb-2">Last Sync : {{ lastSyncDate }}</h5>
            <SyncTable :list-data="syncData" />
          </div>
        </section>
      </el-tab-pane>
    </el-tabs>
    <FormEdit :visibility="formEditVisibility" @handle-close="handleHideFormEditDialog"></FormEdit>
    <FormEditDraft :visibility="formEditDraftVisibility" @handle-close="handleHideFormEditDraftDialog"></FormEditDraft>
    <DraftErrorModal :visibility="errorModalVisibility" @handle-close="handleHideErrorsModal" :error-data="errorDraftDetail"></DraftErrorModal>
  </section>
</template>
<script lang="ts" setup>
import {
  formatDateAU,
} from "@/core/helpers/date-format";
import { useStore } from "vuex";
import SyncTable from "./components/SyncTable.vue";
import DraftTable from "./components/DraftTable.vue";
import ListTable from "./components/ListTable.vue";
import DownloadButton from "./components/DownloadButton.vue";
import FilterButton from "./components/FilterButton.vue";
import Alert from "@/components/ironlake/MetronicAlert.vue";
import DraftErrorModal from "./components/DraftErrorModal.vue";
import FormEdit from "./components/FormEdit.vue";
import FormEditDraft from "./components/FormEditDraft.vue";
import { ref, computed } from "vue";
import Pagination from "@/components/pager/Pagination.vue";
import PaginationType from "@/core/types/misc/Pagination";
import { onBeforeMount, onUnmounted } from "vue";
import { Actions as StoreActions } from "@/store/enums/StoreEnums";
import { saveAs } from "file-saver";
import {
  useCbmParameterListStore
} from "@/store/pinia/iron-lake/maintenance/cbm-parameter/useCbmParameterListStore";
import {
  useCbmParameterFormStore
} from "@/store/pinia/iron-lake/maintenance/cbm-parameter/useCbmParameterFormStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/FilterData";
import {
  swalAlertConfirmation,
  swalAlertError,
  swalAlertSuccess
} from "@/core/helpers/sweet-alert";
import {
  useCbmParameterBulkStore
} from "@/store/pinia/iron-lake/maintenance/cbm-parameter/useCbmParameterBulkStore";

const store = useStore();
const listStore = useCbmParameterListStore();
const formStore = useCbmParameterFormStore();
const bulkStore = useCbmParameterBulkStore();

const activeTabs = ref("list");
const toggleDraftCollapse = ref(["draftPanel"]);
/* refs */
const formEditVisibility = ref<boolean>(false);
const errorModalVisibility = ref<boolean>(false);
const formEditDraftVisibility = ref<boolean>(false);
const bulkFile = ref<InstanceType<typeof HTMLInputElement> | null>(null)
const errorDraftDetail = ref({});

/* life cycle hooks */
onBeforeMount(async () => {
  store[StoreActions.ACTIVE_PAGE]("IronLake");
  await listStore.setPage(1);
  await listStore.getSyncData();
  listStore.getLookupCbmGroup();
  listStore.getLookupStatus();
  listStore.getLookupTypeParameter();
  listStore.getLookupComponent();
  listStore.getLookupEquipmentModel();
  listStore.getLookupServiceSize();
  listStore.getLookupRating();
});

onUnmounted(() => {
  listStore.resetState();
})

// function
const reloadList = async () => {
  await listStore.setPage(1);
  listStore.getLookupCbmGroup();
  listStore.getLookupStatus();
  listStore.getLookupTypeParameter();
  listStore.getLookupComponent();
  listStore.getLookupEquipmentModel();
  listStore.getLookupServiceSize();
}

const reloadSyncHistory = async () => {
  await listStore.getSyncData();
  lastSyncDate.value = formatDateAU(listStore.stateLastSyncDate)
}

// computed
const draftData = computed(() => {
  return listStore.draftData
})

const lastSyncDate = computed(() => {
  return formatDateAU(listStore.stateLastSyncDate)
})

const listData = computed(() => {
  return listStore.displayData
})

const syncData = computed(() => {
  return listStore.syncData
})

const pagination = computed((): PaginationType => {
  return listStore.pagination;
});

const bulkData = computed(() => {
  return bulkStore.stateBulkPayload;
});


const reload = async () => {
  await listStore.setPage(1);
}

// handler
const handleUploadClick = () => {
  bulkFile.value?.click();
}
const handleBulkChange = (value: File) => {
  bulkData.value.fileUpload = value
}
const handleUploadBulk = async (e) => {
  const file = e.target.files[0];
  handleBulkChange(file);
  handleSubmitBulk();
  if (bulkFile.value) {
    bulkFile.value.value = ""
  }
}
const handleSubmitBulk = () => {
  bulkStore.bulkUpload().then(() => {
    reload();
  })
}

const handleShowFormEditDraftDialog = () => {
  formEditDraftVisibility.value = true;
}

const handleHideFormEditDraftDialog = async (isReload: boolean) => {
  formEditDraftVisibility.value = false;
  if (isReload) await reload();
}

const handleHideErrorsModal = () => {
  errorModalVisibility.value = false;
}
const handleShowErrorModals = (e) => {
  errorDraftDetail.value = e;
  errorModalVisibility.value = true;
}
const handlePaginationChange = (newPage: number) => {
  listStore.setPage(newPage);
}

const handleSizeChange = (size: number) => {
  listStore.setPageSize(size);
}

const handleTabChange = () => {
  listStore.setFilterVisibility(false)
  if (activeTabs.value === 'list') {
    reloadList();
    reloadSyncHistory();
  } else {
    reloadSyncHistory();
  }
}

const handleShowFormEditDialog = () => {
  formEditVisibility.value = true;
}
const handleHideFormEditDialog = async (isReload: boolean) => {
  formEditVisibility.value = false;
  if (isReload) await reload();
}

const handleDownload = async () => {
  formStore.stateLoading = true;
  const blob = await listStore.export() as Blob;
  formStore.stateLoading = false;
  saveAs(new Blob([blob],
    {
      type: "application/octet-stream"
    }), `CBMData.xlsx`);
}

const handleDeleteDraft = async (e) => {
  swalAlertConfirmation(`Remove this record from Need Review ?`, 'Remove').then(async (res) => {
    if (res.isConfirmed) {
      formStore.stateLoadingMessage = "Removing Data";
      formStore.deleteDraft(e.cbmParameterDraftId).then(() => {
        if (!formStore.stateIsError) {
          swalAlertSuccess("Record has been removed !", "Close").then(() => {
            reloadList();
          });
        } else {
          swalAlertError(`Failed to delete : ${formStore.stateErrors[0].toString}`, "Close").then(() => {
            reloadList();
          });
        }
      });
    }
  });
}

const applyFilter = (value: FilterData) => {
  listStore.setFilterData(value)
  listStore.setLastActiveFilter(value)
}

</script>
<style lang="scss" scoped>
@import "@/assets/sass/core/components/mixins/_typography.scss";

.header-category {
  font-family: "Public Sans";
  @include paragraph-sm();
}
.header-title {
  font-family: "Public Sans";
  @include heading-h5();
  font-weight: 700;
}
.card-table-title {
  font-family: "Public Sans";
  @include heading-h6();
  font-weight: 700;
}

.alert-desc {
  @include paragraph-sm();
}

.close-alert {
  cursor: pointer;
}

.fas {
  &:hover {
    color: unset !important;
  }
}

.ironlake-draft-collapse {
  .el-collapse-item {
    :deep(.el-collapse-item__header) {
      border: none;
      height: unset;
      background-color: inherit;
      font-family: "Public Sans";
      @include heading-h6();
      font-weight: 700;
      i {
        font-size: 1.25rem;
      }
    }
  }
}

:deep(.el-collapse-item__wrap) {
  border: none;
  background-color: inherit;
  .el-collapse-item__content {
    padding: 0;
  }
}

.ironlake-upload-progress {
  @include paragraph-sm();
  :deep(.el-progress) {
    width: 100%;
    .el-progress__text {
      @include paragraph-sm();
      min-width: unset;
    }
  }
}
:deep(.el-table__fixed-right) {
  height: 100% !important;
  .el-table__fixed-body-wrapper {
    height: 100% !important;
  }
}

:deep(.ironlake-table-cell) {
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid #ddd;
  // border-bottom: none;
  .cell {
    padding: 0;
    @include paragraph-sm();
  }
  &:first-child {
    padding-left: 1rem;
  }
  &:last-child {
    padding-right: 1rem;
  }
}

:deep(.ironlake-table-cell-header) {
  padding: 1rem 0.5rem;
  color: #000;
  .cell {
    padding: 0;
    @include paragraph-md();
    font-weight: 600;
  }
  &:first-child {
    padding-left: 1rem !important;
  }
  &:last-child {
    padding-right: 1rem;
  }
}
</style>
