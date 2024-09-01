<template>
    <template>
      <div v-loading.fullscreen.lock="bulkStore.loading" element-loading-text="Uploading File"  element-loading-background="rgba(0, 0, 0, 0.5)"></div>
      <div v-loading.fullscreen.lock="formStore.loading"  :element-loading-text="formStore.stateLoadingMessage" element-loading-background="rgba(0, 0, 0, 0.5)"></div>
    </template>
    <section class="px-3 py-8">
    <div class="d-flex justify-content-between align-items-center">
      <div class="">
        <div class="flex-grow-1">
          <h5 class="mb-2 header-title">Site</h5>
        </div>
      </div>
      <div class="align-self-start d-flex gap-2">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Download Site Template"
          placement="top"
        >
          <el-button
            class="btn btn-icon btn-btech-outline btech-lg m-0"
            @click="handleDownloadTemplate"
          >
            <Icon name="excel-icon" size="20" />
          </el-button>
        </el-tooltip>
        <el-button
          class="btn btn-btech-outline btech-lg m-0"
          @click="handleUploadClick"
        >
          <Icon name="upload" size="20" />
          Upload
        </el-button>
          <input
              ref="bulkFile"
              type="file"
              accept=".xlsx"
              hidden
              @change="handleUploadBulk"
            />
        <el-button
          class="btn btn-btech-secondary btech-lg m-0"
          @click="handleShowFormAddDialog()"
        >
          <i class="fas fa-plus fs-4 pe-2"></i>
          Add New
        </el-button>
      </div>
      </div>
    </section>
    <Alert
      v-model:show-alert="bulkStore.stateAlert.show"
      :variant="bulkStore.alertVariant"
      :desc="bulkStore.alertDesc"
    />
    <section v-if="draftData.length > 0" class="card mb-6" >
      <el-collapse
      v-model="draftGridVisibility"
      class="card-body p-3 ironlake-draft-collapse"
    >
      <el-collapse-item
        name="draftPanel"
      >
        <template #title>
          <p class="m-0">
            Need Review
            <span class="text-btech-danger-500">
              ({{ draftData.length }})
            </span>
          </p>
        </template>
        <section class="mb-6"></section>
        <DraftGrid :list-data="draftData" :page="pagination.currentPage" @show-dialog="handleShowFormEditDraftDialog" @show-errors="handleShowErrorsModal($event)" @delete-draft="handleDeleteDraft($event)" />
      </el-collapse-item>
    </el-collapse>
    </section>
    <section class="card mb-10">
      <div class="card-body p-3">
        <div class="d-flex justify-content-between my-4 align-items-center">
          <p class="m-0 card-table-title">Site List</p>
          <div class="d-flex justify-content-between gap-2">
            <FilterButton @apply-filter="value => applyFilter(value)" />
            <DownloadButton @handle-download="handleDownload" />
          </div>
        </div>
        <Grid :list-data="listData" :page="pagination.currentPage" @show-dialog="handleShowFormEditDialog" />
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
        <FormAddDialog :visibility="formAddVisibility" @handle-close="handleHideFormAddDialog"></FormAddDialog>
        <FormEditDialog :visibility="formEditVisibility" @handle-close="handleHideFormEditDialog"></FormEditDialog>
        <FormEditDraftDialog :visibility="formEditDraftVisibility" @handle-close="handleHideFormEditDraftDialog"/>
        <DraftErrorModal :visibility="errorModalVisibility" @handle-close="handleHideErrorsModal" :error-data="errorDraftDetail"></DraftErrorModal>
      </div>
    </section>
</template>


<script lang="ts" setup>
/* imports here */
store[StoreActions.ACTIVE_PAGE]("IronLake");
import {
  ref,
  onBeforeMount,
  onUnmounted,
  computed
} from "vue";
import { setCurrentPageBreadcrumbs } from "../../../../core/helpers/breadcrumb";
import { Actions as StoreActions } from "../../../../store/enums/StoreEnums";
import Pagination from "../../../../components/pager/Pagination.vue";
import PaginationType from "../../../../core/types/misc/Pagination";
/* import components here */
import Grid from "./components/Grid.vue";
import DraftGrid from "./components/DraftGrid.vue";
import FormAddDialog from "./components/FormAddDialog.vue";
import FormEditDialog from "./components/FormEditDialog.vue";
import {
  useSiteListStore
} from "../../../../store/pinia/iron-lake/business-partner/site/useSiteListStore";
import {
  useSiteBulkStore
} from "../../../../store/pinia/iron-lake/business-partner/site/useSiteBulkStore";
import {
  useSiteFormStore
} from "../../../../store/pinia/iron-lake/business-partner/site/useSiteFormStore";
import { saveAs } from "file-saver";
import DownloadButton from "./components/DownloadButton.vue"
import DraftErrorModal from "./components/DraftErrorModal.vue";
import FormEditDraftDialog from "./components/FormEditDraftDialog.vue";
import {
  swalAlertConfirmation,
  swalAlertError,
  swalAlertSuccess,
  swalAlertSuccessTitle,
  swalAlertErrorTitle,
} from "../../../../core/helpers/sweet-alert";
import Alert from "../../../../components/ironlake/MetronicAlert.vue";
import Icon from "../../../../components/ironlake/Icon.vue";
import FilterButton from "./components/FilterButton.vue";
import {
  FilterData
} from "../../../../core/types/entities/iron-lake/business-partner/site/FilterData";


const store = useMenuStore();
const listStore = useSiteListStore();
const formStore = useSiteFormStore();
const bulkStore = useSiteBulkStore();

/* refs */
const formAddVisibility = ref<boolean>(false);
const formEditVisibility = ref<boolean>(false);
const formEditDraftVisibility = ref<boolean>(false);
const errorModalVisibility = ref<boolean>(false);
const errorDraftDetail = ref({});
const bulkFile = ref<InstanceType<typeof HTMLInputElement> | null>(null);
const draftGridVisibility = ref(["draftPanel"]);


/* computed */

const listData = computed(() => {
  return listStore.displayData;
});

const draftData = computed(() => {
  return listStore.draftData
})

const bulkData = computed(() => {
  return bulkStore.stateBulkPayload
})

const pagination = computed((): PaginationType => {
  return listStore.pagination;
});

const handlePaginationChange = (newPage: number) => {
  listStore.setPage(newPage);
}

/* life cycle hooks */
onBeforeMount(async () => {
  store[StoreActions.ACTIVE_PAGE]("IronLake");
  setCurrentPageBreadcrumbs("Site", [
    {
      pageName: "Site",
      pageRoute: "site",
    },
  ]);
  await listStore.setPage(1);
});

onUnmounted(() => {
  listStore.resetState();
  formStore.resetState();
  bulkStore.resetState();
});

/* methods */
const reload = async () => {
  await listStore.setPage(1);
}

/* handlers here */
const handleSearchSite = async (e: Event) => {
  const { value } = e.target as HTMLInputElement
  listStore.setSearchValue(value);
}

const handleShowFormAddDialog = () => {
  formAddVisibility.value = true;
}
const handleHideFormAddDialog = async (isReload: boolean) => {
  formAddVisibility.value = false;
  if (isReload) await reload();
}
const handleShowFormEditDialog = () => {
  formEditVisibility.value = true;
}
const handleHideFormEditDialog = async (isReload: boolean) => {
  formEditVisibility.value = false;
  if (isReload) await reload();
}
const handleDownload = async () => {
  const blob = await listStore.export() as Blob;
  saveAs(new Blob([blob],
    { type: "application/octet-stream" }), `Site.xlsx`);
}
const handleSizeChange = (size: number) => {
  listStore.setPageSize(size);
}
const handleShowErrorsModal = (e) => {
  errorDraftDetail.value = e;
  errorModalVisibility.value = true;
}
const handleHideErrorsModal = () => {
  errorModalVisibility.value = false;
}
const handleShowFormEditDraftDialog = () => {
  formEditDraftVisibility.value = true;
}
const handleHideFormEditDraftDialog = async (isReload: boolean) => {
  formEditDraftVisibility.value = false;
  if (isReload) await reload();
}
const handleUploadClick = () => {
  bulkFile.value?.click();
}
const handleDownloadTemplate = async () => {
  const blob = await listStore.template() as Blob;
  saveAs(new Blob([blob],
    {
      type: "application/octet-stream"
    }), `MasterSite.xlsx`);
}
const handleBulkChange = (value: File) => {
  bulkData.value.fileUpload = value;
}
const handleUploadBulk = async (e) => {
  const file = e.target.files[0];
  handleBulkChange(file);
  handleSubmitBulk();
  if (bulkFile.value) {
    bulkFile.value.value = "";
  }
}
const handleSubmitBulk = () => {
  bulkStore.bulkUpload().then(() => {
    reload();
  })
}

const handleDeleteDraft = async (e) => {
  formStore.stateLoadingMessage = "Removing Data";
  swalAlertConfirmation(`Remove this record from Need Review ?`).then(async (res) => {
    if (res.isConfirmed) {
      formStore.deleteDraft(e.siteDraftId).then(() => {
        if (!formStore.isError) {
          swalAlertSuccess("Record has been removed successfuly!", "Close").then(() => {
            reload();
          });
        } else {
          swalAlertError(`Failed to delete : ${formStore.stateErrors[0].toString}`, "Close").then(() => {
            reload();
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

<style scoped lang="scss">
@import "../../../../assets/sass/core/components/mixins/_typography.scss";
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
.ironlake-draft-collapse {
  .el-collapse-item {
    :deep(.el-collapse-item__header) {
      border: none;
      height: unset;
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
  .el-collapse-item__content {
    padding: 0;
  }
}
  #kt_toolbar {
    margin: 32px 0;
    padding: 0;
    #kt_toolbar_container {
      padding: 0;
    }
  }
  el-overlay {
      z-index: 100 !important;
  }
  .btn-btech {
  border: 1.5px solid #01A3FF !important;
  color: #fff;
  background-color: #01A3FF;
}
.btn-btech:hover {
  background-color: #0175ff;
  color: #fff;
}
.btn-btech-outline {
  border: 1.5px solid #01A3FF !important;
  color: #01A3FF;
}
.btn-btech-outline:hover {
  background-color: #01A3FF;
  color: #fff;
}

.site-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: #FFFFFF;
  border-radius: 10px;
  padding: 12px;

  .site-table-header {
    display: flex;
    align-items: center;
    gap: 16px;

    .input-group {
      input {
        border-right: none;
      }

      .input-group-text {
        background-color: #FFFFFF;
      }
    }

    .site-table-header-buttons {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }
}
  .action-buttons-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .row {
  .alert-warning {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #fffbbb;
    border-radius: 8px;
    padding: 16px 24px;
    margin: 0;
  }
  .alert-success {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #3699FF;
    border-radius: 8px;
    padding: 16px 24px;
    margin: 0;
    color: #FFFFFF;
  }
  .btn-close-alert {
    cursor: pointer;
  }
  .el-alert {
      &.el-alert--success {
        i {
          color: #54d62c !important;
        }
      }
    }
}
.form-control {
  border: none;
}
.box-search {
    border: 1px solid #DFE3E8;
    border-radius: 10px;
  }
  .box-search {
  border: 1px solid #DFE3E8;
  border-radius: 10px;
}
</style>
