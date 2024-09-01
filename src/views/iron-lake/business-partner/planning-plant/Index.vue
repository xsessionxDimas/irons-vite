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
        <Grid :list-data="listStore.displayData" :page="listStore.pagination.currentPage" @show-dialog="handleShowFormEditDialog" />
      </div>
    </div>
    <div class="my-5">
      <Pagination v-if="!listStore.paginationLoading"
        @raise-page-change="handlePaginationChange($event)"
        :currentPage="listStore.pagination.currentPage"
        :totalPage="listStore.pagination.totalPage"
        :totalPageSize="listStore.pagination.totalPageSize"
        :startPaginationIndex="listStore.pagination.startPaginationIndex"
        :endPaginationIndex="listStore.pagination.endPaginationIndex"
        :isPageSizeChange="false"
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
  onUnmounted
} from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { Actions as StoreActions } from "@/store/enums/StoreEnums";
import Pagination from "@/components/pager/Pagination.vue";
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
  usePlanningPlantListStore
} from "@/store/pinia/iron-lake/business-partner/planning-plant/usePlanningPlantListStore";
import {
  usePlanningPlantBulkStore
} from "@/store/pinia/iron-lake/business-partner/planning-plant/usePlanningPlantBulkStore";
import {
  usePlanningPlantFormStore
} from "@/store/pinia/iron-lake/business-partner/planning-plant/usePlanningPlantFormStore";
import { saveAs } from "file-saver";

const store = useStore();
const listStore = usePlanningPlantListStore();
const formStore = usePlanningPlantFormStore();
const bulkStore = usePlanningPlantBulkStore();

/* refs */
const formAddVisibility = ref<boolean>(false);
const formEditVisibility = ref<boolean>(false);
const filterVisibility = ref<boolean>(false);
const uploadVisibility = ref<boolean>(false);

/* life cycle hooks */
onBeforeMount(async () => {
  store[StoreActions.ACTIVE_PAGE]("IronLake");
  setCurrentPageBreadcrumbs("Planning Plant", [
    {
      pageName: "Iron Lake",
      pageRoute: "ironlake",
    },
    {
      pageName: "Business Partner",
      pageRoute: "planningplant",
    },
    {
      pageName: "Planning Plant",
      pageRoute: "planningplant",
    },
  ]);
  await listStore.setPage(1);
  await listStore.getLookup();
});
onUnmounted(() => {
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
const handlePaginationChange = (newPage: number) => {
  listStore.setPage(newPage);
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
    { type: "application/octet-stream" }),
  `Planning Plant.xlsx`);
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
