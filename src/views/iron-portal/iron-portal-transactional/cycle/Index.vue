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
      <Grid :list-data="listData" :page="pagination.currentPage"  @fetch-data="reload"/>
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
import { useStore } from "vuex";
import {
  ref,
  onBeforeMount,
  onUnmounted,
  computed
} from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { Actions as StoreActions } from "@/store/enums/StoreEnums";
import Pagination from "@/components/pager/Pagination.vue";
import PaginationType from "@/core/types/misc/Pagination";
/* import components here */
import Filter from "@/components/buttons/FilterIconButton.vue";
import Add from "@/components/buttons/AddIconButton.vue";
import Upload from "@/components/buttons/UploadIconButton.vue";
import Download from "@/components/buttons/DownloadIconButton.vue";
import Grid from "./components/Grid.vue";
import FormAddDialog from "./components/FormAddDialog.vue";
import UploadBulkDialog from "./components/UploadBulkDialog.vue";
import FilterDialog from "./components/FilterDialog.vue";
import {
  useCycleListStore
} from "@/store/pinia/iron-portal/iron-portal-transactional/cycle/useCycleListStore";
import {
  useCycleBulkStore
} from "@/store/pinia/iron-portal/iron-portal-transactional/cycle/useCycleBulkStore";
import {
  useCycleFormStore
} from "@/store/pinia/iron-portal/iron-portal-transactional/cycle/useCycleFormStore";
import { saveAs } from "file-saver";

const store = useStore();
const listStore = useCycleListStore();
const formStore = useCycleFormStore();
const bulkStore = useCycleBulkStore();

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
  formStore.setIsEdit(false);
}

/* life cycle hooks */
onBeforeMount(async () => {
  store.dispatch(StoreActions.ACTIVE_PAGE, "IronPortal");
  setCurrentPageBreadcrumbs("Cycle", [
    {
      pageName: "IronPortal",
      pageRoute: "ironportal",
    },
    {
      pageName: "IronPortal Transactional",
      pageRoute: "cycle",
    },
    {
      pageName: "Cycle",
      pageRoute: "cycle",
    },
  ]);
  await listStore.getLookup();
  await formStore.getLookup();
  await listStore.setPage(1);
});

onUnmounted(async () => {
  listStore.resetState();
  formStore.resetState();
  bulkStore.resetState();
});

/* methods */
const reload = async () => {
  await listStore.getLookup();
  await formStore.getLookup();
  await listStore.setPage(1);
}

/* handlers here */
const handleShowFormAddDialog = () => {
  formAddVisibility.value = true;
  formStore.setIsEdit(false);
  formStore.setErrors([] as string[]);
  formStore.resetState();
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
    { type: "application/octet-stream" }), `Cycle.xlsx`);
}
const handleShowBulkUploadDialog = () => {
  uploadVisibility.value = true;
}
const handleHideBulkUploadDialog = async (isReload: boolean) => {
  uploadVisibility.value = false;
  if (isReload) await reload();
}
</script>

<style>
    el-overlay {
        z-index: 100 !important;
    }
</style>
