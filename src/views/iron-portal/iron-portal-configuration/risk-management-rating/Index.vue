<template>
  <div class="grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center">
    <div class="d-flex align-items-center position-relative my-0"></div>
    <div class="d-flex justify-content-between align-items-center">
      <Add @show-dialog="handleShowFormAddDialog" />
      <Filter @show-dialog="handleShowFilterDialog" />
      <Download @handle-download="handleDownload" />
      <Upload @show-dialog="handleShowBulkUploadDialog" />
    </div>
  </div>
  <div class="card">
    <div class="card-body grid-padding">
      <Grid :list-data="listData" :page="pagination.currentPage" @fetch-data="reload" @duplicateData="handleDuplicateDialog"/>
    </div>
  </div>
  <div class="my-5">
    <Pagination v-if="!listStore.paginationLoading"
      @raise-page-change="handlePaginationChange($event)"
      :currentPage="pagination.currentPage"
      :totalPage="pagination.totalPage"
      :totalPageSize="pagination.totalPageSize"
      :startPaginationIndex="pagination.startPaginationIndex"
      :endPaginationIndex="pagination.endPaginationIndex"
    />
  </div>
  <FormAddDialog :visibility="formAddVisibility" @handle-close="handleHideFormAddDialog"></FormAddDialog>
  <FilterDialog :visibility="filterVisibility" @handle-close="handleHideFilterDialog"></FilterDialog>
  <UploadBulkDialog :visibility="uploadVisibility" @handle-close="handleHideBulkUploadDialog"></UploadBulkDialog>
</template>


<script lang="ts" setup>
/* imports here */
import { useMenuStore } from "../../../../store/templates/useMenuStore";
import {
  ref,
  onBeforeMount,
  onUnmounted,
  computed
} from "vue";
import { useRoute } from "vue-router";
import { setCurrentPageBreadcrumbs } from "../../../../core/helpers/breadcrumb";
import { Actions as StoreActions } from "../../../../store/enums/StoreEnums";
import Pagination from "../../../../components/pager/Pagination.vue";
import PaginationType from "../../../../core/types/misc/Pagination";
/* import components here */
import Filter from "../../../../components/buttons/FilterIconButton.vue";
import Add from "../../../../components/buttons/AddIconButton.vue";
import Upload from "../../../../components/buttons/UploadIconButton.vue";
import Download from "../../../../components/buttons/DownloadIconButton.vue";
import Grid from "./components/Grid.vue";
import FormAddDialog from "./components/FormAddDialog.vue";
import UploadBulkDialog from "./components/UploadBulkDialog.vue";
import FilterDialog from "./components/FilterDialog.vue";
import {
  useRiskManagementRatingListStore
} from "../../../../store/pinia/iron-portal/iron-portal-configuration/risk-management-rating/useRiskManagementRatingListStore";
import {
  useRiskManagementRatingBulkStore
} from "../../../../store/pinia/iron-portal/iron-portal-configuration/risk-management-rating/useRiskManagementRatingBulkStore";
import {
  useRiskManagementRatingFormStore
} from "../../../../store/pinia/iron-portal/iron-portal-configuration/risk-management-rating/useRiskManagementRatingFormStore";
import { saveAs } from "file-saver";

const store = useMenuStore();
const listStore = useRiskManagementRatingListStore();
const formStore = useRiskManagementRatingFormStore();
const bulkStore = useRiskManagementRatingBulkStore();

/* refs */
const formAddVisibility = ref<boolean>(false);
const filterVisibility = ref<boolean>(false);
const uploadVisibility = ref<boolean>(false);

/* computed */
const listData = computed(() => {
  return listStore.displayData;
});

const pagination = computed((): PaginationType => {
  return listStore.pagination;
});

const handlePaginationChange = (newPage: number) => {
  listStore.setPage(newPage);
}

/* life cycle hooks */

onBeforeMount(async () => {
  store[StoreActions.ACTIVE_PAGE](useRoute().meta.parentMenu as string);
  setCurrentPageBreadcrumbs("Component Risk Rating Description", [
    {
      pageName: useRoute().meta.parentMenu as string,
      pageRoute: (useRoute().meta.parentMenu as string).toLowerCase(),
    },
    {
      pageName: "IronPortal Configuration",
      pageRoute: "ironlake-config-riskmanagementrating",
    },
    {
      pageName: "Component Risk Rating Description",
      pageRoute: "ironlake-config-riskmanagementrating",
    },
  ]);
  listStore.setPage(1);
  await listStore.getLookup();
});

onUnmounted(async () => {
  listStore.resetState();
  formStore.resetState();
  bulkStore.resetState();
});

/* methods */
const reload = async () => {
  await listStore.setPage(1);
  await listStore.getLookup();
}

/* handlers here */
const handleShowFormAddDialog = () => {
  formAddVisibility.value = true;
}
const handleHideFormAddDialog = async (isReload: boolean) => {
  formAddVisibility.value = false;
  if (isReload) await reload();
}
const handleShowFilterDialog = () => {
  filterVisibility.value = true;
}
const handleHideFilterDialog = async (isReload: boolean) => {
  filterVisibility.value = false;
  if (isReload) await reload();
}
const handleDownload = async () => {
  const blob = await listStore.export() as Blob;
  saveAs(new Blob([blob],
    {
      type: "application/octet-stream"
    }), `ComponentRiskRatingDescription.xlsx`);
}
const handleShowBulkUploadDialog = () => {
  uploadVisibility.value = true;
}
const handleHideBulkUploadDialog = async (isReload: boolean) => {
  uploadVisibility.value = false;
  if (isReload) await reload();
}
const handleDuplicateDialog = () => {
  formAddVisibility.value = true;
  formStore.setErrors([] as string[]);
}
</script>

<style>
  el-overlay {
    z-index: 100 !important;
  }
</style>
