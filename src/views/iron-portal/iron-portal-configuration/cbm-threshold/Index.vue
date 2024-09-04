<!-- eslint-disable no-undef -->
<template>
  <div class="grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center">
    <div class="d-flex justify-content-between align-items-center ms-auto">
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
      <GridGeneral
        v-if="activeTab === 'General'"
        :list-data="listData"
        :page="pagination.currentPage"
        @duplicateData="handleDuplicateDialog"
        @fetch-data="reload"
        @handle-edit="handleShowFormEditDialog"
      />
      <GridSpecific
        v-if="activeTab === 'Specific'"
        :list-data="listData"
        :page="pagination.currentPage"
        @duplicateData="handleDuplicateDialog"
        @fetch-data="reload"
        @handle-edit="handleShowFormEditDialog"
      />
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
  <FormAdd v-if="activeTab === 'General'" :visibility="formAddVisibility" @handle-close="handleHideFormAddDialog"></FormAdd>
  <FormEdit v-if="activeTab === 'General'" :visibility="formEditVisibility" @handle-close="handleHideFormEditDialog"></FormEdit>
  <FilterDialog v-if="activeTab === 'General'" :visibility="filterVisibility" @handle-close="handleHideFilterDialog"></FilterDialog>
  <UploadBulk v-if="activeTab === 'General'" :visibility="uploadVisibility" @handle-close="handleHideBulkUploadDialog"></UploadBulk>

  <FormAddSpecific v-if="activeTab === 'Specific'" :visibility="formAddVisibility" @handle-close="handleHideFormAddDialog"></FormAddSpecific>
  <FormEditSpecific v-if="activeTab === 'Specific'" :visibility="formEditVisibility" @handle-close="handleHideFormEditDialog"></FormEditSpecific>
  <FilterDialogSpecific v-if="activeTab === 'Specific'" :visibility="filterVisibility" @handle-close="handleHideFilterDialog"></FilterDialogSpecific>
  <UploadBulkSpecific v-if="activeTab === 'Specific'" :visibility="uploadVisibility" @handle-close="handleHideBulkUploadDialog"></UploadBulkSpecific>
</template>


<script lang="ts" setup>
/* eslint-disable no-undef*/
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
import {
  useCbmThresholdListStore
} from "../../../../store/pinia/iron-portal/iron-portal-configuration/cbm-threshold/useCbmThresholdListStore";
import {
  useCbmThresholdBulkStore
} from "../../../../store/pinia/iron-portal/iron-portal-configuration/cbm-threshold/useCbmThresholdBulkStore";
import {
  useCbmThresholdFormStore
} from "../../../../store/pinia/iron-portal/iron-portal-configuration/cbm-threshold/useCbmThresholdFormStore";
import { saveAs } from "file-saver";

import Filter from "../../../../components/buttons/FilterIconButton.vue";
import Add from "../../../../components/buttons/AddIconButton.vue";
import Upload from "../../../../components/buttons/UploadIconButton.vue";
import Download from "../../../../components/buttons/DownloadIconButton.vue";

import GridGeneral from "./components/general/Grid.vue";
import FormAdd from "./components/general/FormAddDialog.vue";
import FormEdit from "./components/general/FormEditDialog.vue";
import UploadBulk from "./components/general/UploadBulkDialog.vue";
import FilterDialog from "./components/general/FilterDialog.vue";

import GridSpecific from "./components/specific/Grid.vue";
import FormAddSpecific from "./components/specific/FormAddDialog.vue";
import FormEditSpecific from "./components/specific/FormEditDialog.vue";
import UploadBulkSpecific from "./components/specific/UploadBulkDialog.vue";
import FilterDialogSpecific from "./components/specific/FilterDialog.vue";

const store = useMenuStore();
const listStore = useCbmThresholdListStore();
const formStore = useCbmThresholdFormStore();
const bulkStore = useCbmThresholdBulkStore();

/* refs */
const formAddVisibility = ref<boolean>(false);
const formEditVisibility = ref<boolean>(false);
const filterVisibility = ref<boolean>(false);
const uploadVisibility = ref<boolean>(false);

const activeTab = computed(() => {
  return listStore.activeTab
});

const listData = computed(() => {
  return listStore.displayData;
});

const pagination = computed((): PaginationType => {
  return listStore.pagination;
});

const handlePaginationChange = (newPage: number) => {
  if (activeTab.value == "General") {
    listStore.setPage(newPage)
  } else {
    listStore.setPageSpecific(newPage)
  }
}

const handleClickTab = async (tab) => {
  listStore.resetState();
  formStore.resetState();
  bulkStore.resetState();

  if (tab.paneName === "General") {
    await listStore.setPage(1);
  } else {
    await listStore.setPageSpecific(1);
  }
  console.log(activeTab.value)
  await listStore.getLookup(activeTab.value == "Specific");
  await formStore.getLookup(activeTab.value == "Specific");
}

/* life cycle hooks */
onBeforeMount(async () => {
  store[StoreActions.ACTIVE_PAGE](useRoute().meta.parentMenu as string);
  setCurrentPageBreadcrumbs("CBM Parameter Threshold", [
    {
      pageName: useRoute().meta.parentMenu as string,
      pageRoute: (useRoute().meta.parentMenu as string).toLowerCase(),
    },
    {
      pageName: "IronPortal Configuration",
      pageRoute: "ironlake-config-cbmthreshold",
    },
    {
      pageName: "CBM Parameter Threshold",
      pageRoute: "ironlake-config-cbmthreshold",
    },
  ]);
  listStore.setPage(1);
  await formStore.getLookup();
  await listStore.getLookup(false);
});

onUnmounted(async () => {
  listStore.resetState();
  formStore.resetState();
  bulkStore.resetState();
});

/* methods */
const reload = async () => {
  if (activeTab.value == "Specific") {
    await listStore.setPageSpecific(1);
  } else {
    await listStore.setPage(1);
  }
  await listStore.getLookup(activeTab.value == "Specific");
  await formStore.getLookup(activeTab.value == "Specific");
}

/* handlers here */
const handleShowFormAddDialog = () => {
  formAddVisibility.value = true;
  formStore.setErrors([] as string[]);
  formStore.resetState();
}
const handleShowFormEditDialog = () => {
  formEditVisibility.value = true;
  formStore.setErrors([] as string[]);
}
const handleHideFormAddDialog = async (isReload: boolean) => {
  formAddVisibility.value = false;
  if (isReload) await reload();
}
const handleHideFormEditDialog = async () => {
  formEditVisibility.value = false;
  if (activeTab.value == "General") {
    await listStore.setPage(pagination.value.currentPage);
  } else {
    await listStore.setPageSpecific(pagination.value.currentPage);
  }
}
const handleShowFilterDialog = () => {
  filterVisibility.value = true;
}
const handleHideFilterDialog = async (isReload: boolean) => {
  filterVisibility.value = false;
  if (isReload) await reload();
}
const handleDownload = async () => {
  const blob = await listStore.export(activeTab.value == "Specific") as Blob;
  saveAs(new Blob([blob],
    {
      type: "application/octet-stream"
    }), `CBMParameterThreshold${activeTab.value == "Specific" ? "Specific" : ""}.xlsx`);
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
