<template>
  <template>
    <div v-loading.fullscreen.lock="formStore.loading" element-loading-text="Submitting Data"  element-loading-background="rgba(0, 0, 0, 0.5)"></div>
    <div v-loading.fullscreen.lock="bulkStore.loading" :element-loading-text="bulkStore.loadingMessage"  element-loading-background="rgba(0, 0, 0, 0.5)"></div>
  </template>
  <section class="px-3 py-8 d-flex">
    <div class="flex-grow-1">
      <h5 class="m-0 header-title">Daily Outstanding Service</h5>
    </div>
    <div class="align-self-start d-flex gap-2">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Download Outstanding Service Template"
        placement="top"
      >
        <el-button
          class="btn btn-icon btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-lg m-0"
          @click="handleDownloadTemplate"
        >
          <span
            class="svg-icon svg-icon-btech-secondary-500 d-inline-block p-0"
          >
            <inline-svg
              src="/media/icons/bumaau/excel.svg"
              style="width: 1.25rem; height: 1.25rem"
            />
          </span>
        </el-button>
      </el-tooltip>
      <el-button
        class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-lg m-0"
        @click="handleUploadClick"
      >
        <i class="fas fa-file-upload text-btech-secondary-500 fs-4 pe-2"></i>
        Upload
      </el-button>
      <input
        ref="uploadBulk"
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        hidden
        @change="handleUpload"
      />
      <el-button
        class="btn btn-btech-secondary btech-lg m-0"
        @click="showFormDialog"
      >
        <i class="fas fa-plus fs-4 pe-2"></i>
        Add New
      </el-button>
    </div>
  </section>
  <section v-if="uploadProgress" class="ironlake-upload-progress mb-6 d-flex">
    <p class="mb-0 me-2">Uploading</p>
    <el-progress :percentage="uploadProgress" :width="500" />
  </section>
  <Alert
    v-model:show-alert="bulkStore.stateAlert.show"
    :variant="bulkStore.alertVariant"
    :desc="bulkStore.alertDesc"
  />
  <section v-if="bulkStore.stateDraftData.length > 0" class="card mb-6">
    <el-collapse
      v-model="toggleDraftCollapse"
      class="card-body p-3 ironlake-draft-collapse"
    >
      <el-collapse-item name="draftPanel">
        <template #title>
          <p class="m-0">
            Need Review
            <span class="text-btech-danger-500">
              ({{ bulkStore.stateDraftData.length }})
            </span>
          </p>
        </template>
        <section class="mb-6"></section>
        <DraftTable
          class="mb-6"
          :list-data="bulkStore.stateDraftData"
          @show-form="showFormDialog"
          @load-page="loadPageData"
        />
      </el-collapse-item>
    </el-collapse>
  </section>
  <section class="card mb-10">
    <div class="card-body p-3">
      <ListTableFilter ref="tableFilterRef" v-model:search-data="searchData" />
      <ListTable
        class="mb-6"
        :search="searchData"
        @show-form="showFormDialog"
      />
      <div class="m-0 ironlake-pagination">
        <Pagination
          v-if="!listStore.paginationLoading"
          :currentPage="pagination.currentPage"
          :totalPage="pagination.totalPage"
          :totalPageSize="pagination.totalPageSize"
          :startPaginationIndex="pagination.startPaginationIndex"
          :endPaginationIndex="pagination.endPaginationIndex"
          :isPageSizeChange="true"
          @raise-size-change="handleSizePageChange($event)"
          @raise-page-change="handlePaginationChange($event)"
        />
      </div>
    </div>
  </section>
  <FormDialog :visibility="formVisibility" @handle-close="hideFormDialog" />
  <DraftGateway ref="draftGateDialog" />
</template>

<script lang="ts" setup>
/* imports here */
import {
  ref,
  computed,
  onBeforeMount,
  onUnmounted,
  watch
} from "vue";
import { useStore } from "vuex";
import { Actions as StoreActions } from "@/store/enums/StoreEnums";
import { saveAs } from "file-saver";
/* import components here */
import Pagination from "@/components/pager/Pagination.vue";
import PaginationType from "@/core/types/misc/Pagination";
import Alert from "@/components/ironlake/MetronicAlert.vue";
import DraftTable from "./components/DraftTable.vue";
import ListTableFilter from "./components/ListTableFilter.vue";
import ListTable from "./components/ListTable.vue";
import FormDialog from "./components/FormDialog.vue";
import DraftGateway from "./components/DraftGatewayDialog.vue";
/* import stores here */
import {
  useDailyScheduleListStore
} from "@/store/pinia/iron-lake/task/daily-schedule/useDailyScheduleListStore";
import {
  useDailyScheduleBulkStore
} from "@/store/pinia/iron-lake/task/daily-schedule/useDailyScheduleBulkStore";
import {
  useDailyScheduleFormStore
} from "@/store/pinia/iron-lake/task/daily-schedule/useDailyScheduleFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";

const store = useStore();
const listStore = useDailyScheduleListStore();
const formStore = useDailyScheduleFormStore();
const bulkStore = useDailyScheduleBulkStore();
const authStore = useAuthenticationStore();

// init module
const setUserSite = (userDetail) => {
  const userSite = userDetail.isHO === 1 ? "" : userDetail.SiteId;
  if (tableFilterRef.value) {
    tableFilterRef.value.dataFilter.siteId = userSite;
  }
  listStore.stateFilterForm.siteId = userSite;
}
const tableFilterRef = ref();
// watch for when the page is reloaded by the user in this component page
watch(
  () => {
    return authStore.user;
  },
  async (newVal) => {
    setUserSite(newVal)
    loadPageData();
  },
);

// search module
const searchData = ref("");

/* pagination module */
const pagination = computed((): PaginationType => {
  return listStore.pagination;
});
const handleSizePageChange = (newSize: number) => {
  listStore.stateFilterForm.pageSize = newSize;
  listStore.setPage(1);
};
const handlePaginationChange = (newPage: number) => {
  searchData.value = "";
  listStore.setPage(newPage);
};

/* reload callback */
const loadPageData = async () => {
  await formStore.getPsTypeLookup();
  await listStore.setPage(1);
  formStore.getLookupSite();
  formStore.getEquipmentNumberLookup();
  formStore.getStatusLookup();
  formStore.getShiftLookup();
};

// form dialog module
const formVisibility = ref<boolean>(false);
const showFormDialog = () => {
  formVisibility.value = true;
};
const hideFormDialog = async (isReload: boolean) => {
  formVisibility.value = false;
  if (isReload) await loadPageData();
};

// draft module
const handleDownloadTemplate = async () => {
  const blob = (await bulkStore.downloadBulkTemplate()) as Blob;
  saveAs(
    new Blob([blob], {
      type: "application/octet-stream",
    }),
    `Outstanding Service.xlsx`,
  );
};
const uploadBulk = ref<InstanceType<typeof HTMLInputElement> | null>(null);
const handleUploadClick = () => {
  uploadBulk.value?.click();
};
const handleUpload = async (event) => {
  bulkStore.stateAlert.show = false;
  const uploadFile: File = event.target.files[0];
  await bulkStore.upload(uploadFile);
  checkGatewayData();
  if (uploadBulk.value) {
    uploadBulk.value.value = "";
  }
};
const uploadProgress = computed(() => {
  return bulkStore.stateUploadProgress;
});
const draftGateDialog = ref();
const checkGatewayData = () => {
  if (bulkStore.stateGatewayData.length > 0) {
    draftGateDialog.value.showGatewayDialog = true;
  } else {
    listStore.resetFilter();
    loadPageData();
  }
};
const toggleDraftCollapse = ref(["draftPanel"]);

/* life cycle hooks */
onBeforeMount(async () => {
  store[StoreActions.ACTIVE_PAGE]("IronLake");
  listStore.stateLoading = true
  if (authStore.user !== undefined) {
    listStore.statePaginationLoading = true
    setUserSite(authStore.user);
    loadPageData();
  }
});

onUnmounted(async () => {
  listStore.$reset();
  formStore.$reset();
  bulkStore.$reset();
});
</script>

<style>
el-overlay {
  z-index: 100 !important;
}

.ironlake-pagination > .demo-pagination-block {
  margin: 0;
  padding: 1rem;
}
</style>

<style lang="scss" scoped>
@import "@/assets/sass/core/components/mixins/_typography.scss";

.header-category {
  @include paragraph-sm();
}
.header-title {
  @include heading-h5();
  font-weight: 700;
}
.card-table-title {
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
</style>
