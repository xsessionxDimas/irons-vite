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
      <el-tabs
        v-model="activeTab"
        type="card"
        @tab-click="handleClickTab"
      >
        <el-tab-pane label="General" name="General">
        </el-tab-pane>
        <el-tab-pane label="Specific" name="Specific">
        </el-tab-pane>
      </el-tabs>
      <GridGeneral v-if="activeTab === 'General'" :list-data="listData" :page="pagination.currentPage" @fetch-data="reload"/>
      <GridSpecific v-if="activeTab === 'Specific'" :list-data="listDataSpecific" :page="paginationSpecific.currentPage" @duplicateData="handleDuplicateDialog" @fetch-data="reload"/>
    </div>
  </div>
  <div class="my-5">
    <Pagination v-if="!listStore.paginationLoading && activeTab === 'General'"
      @raise-page-change="handlePaginationChange($event)"
      :currentPage="pagination.currentPage"
      :totalPage="pagination.totalPage"
      :totalPageSize="pagination.totalPageSize"
      :startPaginationIndex="pagination.startPaginationIndex"
      :endPaginationIndex="pagination.endPaginationIndex"
    />
    <Pagination v-if="!listStore.paginationLoading && activeTab === 'Specific'"
      @raise-page-change="handlePaginationChangeSpecific($event)"
      :currentPage="paginationSpecific.currentPage"
      :totalPage="paginationSpecific.totalPage"
      :totalPageSize="paginationSpecific.totalPageSize"
      :startPaginationIndex="paginationSpecific.startPaginationIndex"
      :endPaginationIndex="paginationSpecific.endPaginationIndex"
    />
  </div>
  <FormAddDialog ref="addFormRef" :re-render="isDuplicate" :visibility="formAddVisibility" @handle-close="handleHideFormAddDialog"></FormAddDialog>
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
import Download from "./components/DownloadButton.vue";
import GridGeneral from "./components/Grid.vue";
import GridSpecific from "./components/GridSpesific.vue";
import FormAddDialog from "./components/FormAddDialog.vue";
import UploadBulkDialog from "./components/UploadBulkDialog.vue";
import FilterDialog from "./components/FilterDialog.vue";
import {
  useCbmStatusListStore
} from "../../../../store/pinia/iron-portal/iron-portal-configuration/cbm-status/useCbmStatusListStore";
import {
  useCbmStatusBulkStore
} from "../../../../store/pinia/iron-portal/iron-portal-configuration/cbm-status/useCbmStatusBulkStore";
import {
  useCbmStatusFormStore
} from "../../../../store/pinia/iron-portal/iron-portal-configuration/cbm-status/useCbmStatusFormStore";
import { saveAs } from "file-saver";

const store = useMenuStore();
const listStore = useCbmStatusListStore();
const formStore = useCbmStatusFormStore();
const bulkStore = useCbmStatusBulkStore();

/* refs */
const formAddVisibility = ref<boolean>(false);
const filterVisibility = ref<boolean>(false);
const uploadVisibility = ref<boolean>(false);
const isDuplicate = ref<boolean>(false);
const addFormRef = ref(null);

/* computed */
const listData = computed(() => {
  return listStore.displayData;
});
const listDataSpecific = computed(() => {
  return listStore.displayDataSpecific;
});

const activeTab = computed(() => {
  return formStore.activeTab
});

const handleClickTab = async (tab) => {
  formStore.setActiveTab(tab.paneName)
  if (tab.paneName === 'General') {
    await listStore.getData();
  } else {
    await listStore.setPageSpecific(1);
  }
}

const pagination = computed((): PaginationType => {
  return listStore.pagination;
});
const paginationSpecific = computed((): PaginationType => {
  return listStore.paginationSpecific;
});

const handlePaginationChange = (newPage: number) => {
  listStore.setPage(newPage);
  formStore.setIsEdit(false);
}
const handlePaginationChangeSpecific = (newPage: number) => {
  listStore.setPageSpecific(newPage);
}

/* life cycle hooks */
onBeforeMount(async () => {
  store[StoreActions.ACTIVE_PAGE](useRoute().meta.parentMenu as string);
  setCurrentPageBreadcrumbs("Criticality Logic", [
    {
      pageName: useRoute().meta.parentMenu as string,
      pageRoute: (useRoute().meta.parentMenu as string).toLowerCase(),
    },
    {
      pageName: "IronPortal Configuration",
      pageRoute: "ironlake-config-cbmstatus",
    },
    {
      pageName: "Criticality Logic",
      pageRoute: "ironlake-config-cbmstatus",
    },
  ]);
  listStore.setPage(1);
  await listStore.getLookup();
  await formStore.getLookup();
});

onUnmounted(async () => {
  listStore.resetState();
  formStore.resetState();
  bulkStore.resetState();
});

/* methods */
const reload = async () => {
  await listStore.setPage(1);
  await listStore.setPageSpecific(1);
  await listStore.getLookup();
  await formStore.getLookup();
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
  isDuplicate.value = false
  if (isReload) await reload();
}
const handleShowFilterDialog = () => {
  filterVisibility.value = true;
}
const handleHideFilterDialog = async (isReload: boolean) => {
  filterVisibility.value = false;
  if (isReload) {
    formStore.setActiveTab('Specific')
    await reload()
  }
}
const handleDownload = async (command) => {
  const blob = await listStore.export(command) as Blob;
  saveAs(new Blob([blob],
    { type: "application/octet-stream" }), `CriticalityLogic${command}.xlsx`);
}
const handleShowBulkUploadDialog = () => {
  uploadVisibility.value = true;
}
const handleHideBulkUploadDialog = async (isReload: boolean) => {
  uploadVisibility.value = false;
  if (isReload) {
    formStore.setActiveTab('Specific')
    await reload()
  }
}
const handleDuplicateDialog = async () => {
  formAddVisibility.value = true;
  formStore.setErrors([] as string[]);
  isDuplicate.value = true
}
</script>

<style>
    el-overlay {
        z-index: 100 !important;
    }
</style>
