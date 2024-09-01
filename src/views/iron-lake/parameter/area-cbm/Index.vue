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
        <Grid :list-data="listData" :page="pagination.currentPage" @show-dialog="handleShowFormEditDialog" />
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
    <FormEditDialog :visibility="formEditVisibility" @handle-close="handleHideFormEditDialog"></FormEditDialog>
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
import FormEditDialog from "./components/FormEditDialog.vue";
import UploadBulkDialog from "./components/UploadBulkDialog.vue";
import FilterDialog from "./components/FilterDialog.vue";
import {
  useAreaCbmListStore
} from "@/store/pinia/iron-lake/parameter/area-cbm/useAreaCbmListStore";
import {
  useAreaCbmBulkStore
} from "@/store/pinia/iron-lake/parameter/area-cbm/useAreaCbmBulkStore";
import {
  useAreaCbmFormStore
} from "@/store/pinia/iron-lake/parameter/area-cbm/useAreaCbmFormStore";
import { saveAs } from "file-saver";

const store = useStore();
const listStore = useAreaCbmListStore();
const formStore = useAreaCbmFormStore();
const bulkStore = useAreaCbmBulkStore();

/* refs */
const formAddVisibility = ref<boolean>(false);
const formEditVisibility = ref<boolean>(false);
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
  store[StoreActions.ACTIVE_PAGE]("IronLake");
  setCurrentPageBreadcrumbs("Area CBM", [
    {
      pageName: "Iron Lake",
      pageRoute: "ironlake",
    },
    {
      pageName: "Parameter",
      pageRoute: "areacbm",
    },
    {
      pageName: "Area CBM",
      pageRoute: "areacbm",
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
const handleShowFormEditDialog = () => {
  formEditVisibility.value = true;
}
const handleHideFormEditDialog = async (isReload: boolean) => {
  formEditVisibility.value = false;
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
    { type: "application/octet-stream" }), `Area CBM.xlsx`);
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
