<template>
  <template>
    <div
      v-loading.fullscreen.lock="formStore.loading"
      element-loading-text="Submitting Data"
      element-loading-background="rgba(0, 0, 0, 0.5)"
    ></div>
    <div
      v-loading.fullscreen.lock="bulkStore.loading"
      :element-loading-text="bulkStore.loadingMessage"
      element-loading-background="rgba(0, 0, 0, 0.5)"
    ></div>
  </template>
  <section class="px-3 py-8 d-flex">
    <div class="flex-grow-1">
      <h5 class="m-0 header-title">Equipment</h5>
    </div>
    <div class="align-self-start d-flex gap-2">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Download Template"
        placement="top"
      >
        <el-button
          class="btn btn-icon btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-lg m-0"
          @click="showTemplateDialog"
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
      <el-dropdown @command="handleCommand">
        <el-button
          class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-lg m-0"
          style="height: 100%;"
        >
          <i class="fas fa-file-upload text-btech-secondary-500 fs-4 pe-2"></i>
          Upload
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item class="ironlake-dropdown-item" command="uploadTemplate">
              <i class="fas fa-file-upload text-btech-secondary-500 fs-4 pe-2"></i>
              <span style="color: #01a3ff;">Upload Equipment / HM Offset</span>
            </el-dropdown-item>
            <el-dropdown-item class="ironlake-dropdown-item" command="toCounterReading">
              <i class="fas fa-file-upload text-btech-secondary-500 fs-4 pe-2"></i>
              <span style="color: #01a3ff;">Upload Counter Reading</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
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
    v-if="bulkStore.stateDraftData.length > 0"
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
          @close-expand="closeExpandList"
        />
      </el-collapse-item>
    </el-collapse>
  </section>
  <section class="card mb-10">
    <div class="card-body p-3">
      <ListTableFilter
        ref="tableFilterRef"
        v-model:search-data="searchData"
        @close-expand="closeExpandList"
      />
      <ListTable ref="listTableRef" class="mb-6" @show-form="showFormDialog" />
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
  <el-dialog
    v-model="templateDialog"
    title="Download Template"
    modal-class="ironlake-dialog"
    :width="500"
  >
    <div class="container p-0 pb-8">
      <section class="row m-0 gap-4">
        <div class="col p-0">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="Download Equipment Template"
            placement="top"
          >
            <el-button
              class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-lg m-0 w-100"
              @click="downloadTemplate(false)"
            >
              <span
                class="svg-icon svg-icon-btech-secondary-500 d-inline-block p-0"
              >
                <inline-svg
                  src="/media/icons/bumaau/excel.svg"
                  style="width: 1.25rem; height: 1.25rem"
                />
                Equipment.xlsx
              </span>
            </el-button>
          </el-tooltip>
        </div>
        <div class="col p-0">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="Download Equipment Hour Meter Offset Template"
            placement="top"
          >
            <el-button
              class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-lg m-0 w-100"
              @click="downloadTemplate(true)"
            >
              <span
                class="svg-icon svg-icon-btech-secondary-500 d-inline-block p-0"
              >
                <inline-svg
                  src="/media/icons/bumaau/excel.svg"
                  style="width: 1.25rem; height: 1.25rem"
                />
                Hour Meter Offset.xlsx
              </span>
            </el-button>
          </el-tooltip>
        </div>
      </section>
      <section class="row m-0 mt-6">
        <div class="col p-0">
          <span style="word-break: break-word"
            ><strong>Note:</strong> When you upload the Hour Meter Offset
            template, please make sure file name contains the word
            'Offset'</span
          >
        </div>
      </section>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
/* imports here */
import { useMenuStore } from "../../../../../store/templates/useMenuStore";
import {
  ref,
  watch,
  computed,
  onBeforeMount,
  onUnmounted
} from "vue";
import { useRouter } from "vue-router";
import { Actions as StoreActions } from "../../../../../store/enums/StoreEnums";
import { saveAs } from "file-saver";
/* import components here */
import Pagination from "../../../../../components/pager/Pagination.vue";
import PaginationType from "../../../../../core/types/misc/Pagination";
import Alert from "../../../../../components/ironlake/MetronicAlert.vue";
import DraftTable from "./components/DraftTable.vue";
import ListTableFilter from "./components/ListTableFilter.vue";
import ListTable from "./components/ListTable.vue";
import FormDialog from "./components/FormDialog.vue";
import {
  useListStore
} from "../../../../../store/pinia/iron-lake/equipment/all-equipment/useListStore";
import {
  useBulkStore
} from "../../../../../store/pinia/iron-lake/equipment/all-equipment/useBulkStore";
import {
  useFormStore
} from "../../../../../store/pinia/iron-lake/equipment/all-equipment/useFormStore";
import {
  useAuthenticationStore
} from "../../../../../store/pinia/application/useAuthenticationStore";
import {
  swalAlertConfirmation
} from "../../../../../core/helpers/sweet-alert";

const router = useRouter();
const store = useMenuStore();
const listStore = useListStore();
const formStore = useFormStore();
const bulkStore = useBulkStore();
const authStore = useAuthenticationStore();

const setUserSite = (userDetail) => {
  const userSiteId = userDetail.isHO === 1 ? "" : userDetail.SiteId;
  const userLocation = userDetail.isHO === 1 ? "" : userDetail.Location;
  if (tableFilterRef.value) {
    tableFilterRef.value.dataFilter.siteId = userSiteId;
  }
  formStore.stateFormItem[0].siteName = userLocation;
  listStore.stateFilterForm.siteId = userSiteId;
};
const tableFilterRef = ref();
// watch for when the page is reloaded by the user in this component page
watch(
  () => {
    return authStore.user;
  },
  async (newVal) => {
    setUserSite(newVal);
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
  await listStore.setPage(1);
  formStore.getAllLookup();
};

// list table ref
const listTableRef = ref();
const closeExpandList = () => {
  // to close expanded row
  listTableRef.value?.closeExpandedRow();
};
// form dialog module
const formVisibility = ref<boolean>(false);
const showFormDialog = () => {
  formVisibility.value = true;
};
const hideFormDialog = async (isReload: boolean) => {
  formVisibility.value = false;
  closeExpandList();
  if (isReload) await loadPageData();
};

// draft module
const templateDialog = ref(false);
const showTemplateDialog = () => {
  templateDialog.value = true;
};
const downloadTemplate = async (isHMOffsetTemplate: boolean) => {
  const blob = (await bulkStore.downloadBulkTemplate(
    isHMOffsetTemplate,
  )) as Blob;
  const fileName = isHMOffsetTemplate
    ? "Hour Meter Offset.xlsx"
    : "Equipment.xlsx";
  saveAs(
    new Blob([blob], {
      type: "application/octet-stream",
    }),
    fileName,
  );
};
const uploadBulk = ref<InstanceType<typeof HTMLInputElement> | null>(null);
const handleUploadClick = () => {
  uploadBulk.value?.click();
};
const handleUpload = async (event) => {
  bulkStore.stateAlert.show = false;
  const uploadFile: File = event.target.files[0];
  const isEqpTemplate = !uploadFile.name.toLowerCase().includes("offset");
  const isHmoTemplate = uploadFile.name.toLowerCase().includes("offset");

  const changeToEqpList = isEqpTemplate && !listStore.stateOnlyEquipment;
  const changeToHMOList = isHmoTemplate && listStore.stateOnlyEquipment;

  if (
    (changeToEqpList || changeToHMOList) &&
    bulkStore.stateDraftData.length > 0
  ) {
    swalAlertConfirmation(
      "The following file has a different format from Need Review. Continue to upload this will cause you to remove all current data in Need Review.",
      "Continue",
    ).then(async (res) => {
      if (res.isConfirmed) {
        listStore.setOnlyEqpLocal(isEqpTemplate);
        await bulkStore.upload(uploadFile, listStore.stateOnlyEquipment);
        listStore.resetFilter();
        loadPageData();
      }
    });
  } else {
    listStore.setOnlyEqpLocal(isEqpTemplate);
    await bulkStore.upload(uploadFile, listStore.stateOnlyEquipment);
    listStore.resetFilter();
    loadPageData();
  }

  if (uploadBulk.value) {
    uploadBulk.value.value = "";
  }
};
const uploadProgress = computed(() => {
  return bulkStore.stateUploadProgress;
});
const toggleDraftCollapse = ref(["draftPanel"]);

// upload dropdown module
const handleCommand = (command) => {
  if (command === 'toCounterReading') {
    router.push({ name: 'counterreading' })
  } else {
    handleUploadClick()
  }
}

/* life cycle hooks */
onBeforeMount(async () => {
  store[StoreActions.ACTIVE_PAGE]("IronLake");
  listStore.stateLoading = true;
  if (authStore.user.Location !== undefined) {
    listStore.statePaginationLoading = true;
    listStore.resetFilter();
    setUserSite(authStore.user);
    loadPageData();
  }
});

onUnmounted(() => {
  listStore.$reset();
  formStore.$reset();
  bulkStore.$reset();
});
</script>

<style lang="scss" scoped>
@import "../../../../../assets/sass/core/components/mixins/_typography.scss";

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

<style>
el-overlay {
  z-index: 100 !important;
}

.ironlake-pagination > .demo-pagination-block {
  margin: 0;
  padding: 1rem;
}

.ironlake-dropdown-item {
  &:hover {
    background-color: #CCEDFF !important;
  }
  i {
    .fas {
      &:hover {
        color: #01a3ff !important;
      }
    }
  }
}
</style>
