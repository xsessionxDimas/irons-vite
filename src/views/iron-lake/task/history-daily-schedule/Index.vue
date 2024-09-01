<template>
    <div class="grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center">
      <div class="d-flex align-items-center position-relative my-0"></div>
      <div class="d-flex justify-content-between align-items-center">
        <Filter @show-dialog="handleShowFilterDialog" />
        <Download @handle-download="handleDownload" />
        </div>
    </div>
    <div class="card">
      <div class="card-body grid-padding">
        <Grid :list-data="listData" :page="pagination.currentPage" />
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
    <FilterDialog :visibility="filterVisibility" @handle-close="handleHideFilterDialog"></FilterDialog>
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
import Download from "@/components/buttons/DownloadIconButton.vue";
import Grid from "./components/Grid.vue";
import FilterDialog from "./components/FilterDialog.vue";
import {
  useHistoryDailyScheduleListStore
} from "@/store/pinia/iron-lake/task/history-daily-schedule/useHistoryDailyScheduleListStore";
import { saveAs } from "file-saver";

const store = useStore();
const listStore = useHistoryDailyScheduleListStore();

/* refs */
const filterVisibility = ref<boolean>(false);

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
  setCurrentPageBreadcrumbs("Closed Services", [
    {
      pageName: "Iron Lake",
      pageRoute: "ironlake",
    },
    {
      pageName: "Task",
      pageRoute: "closedservices",
    },
    {
      pageName: "Closed Services",
      pageRoute: "closedservices",
    },
  ]);
  listStore.setPage(1);
  listStore.getLookup();
  listStore.getDailyScheduleLookup();
  listStore.getMaintenanceAssignmentLookup();
});

onUnmounted(() => {
  listStore.resetState();
});

/* methods */
const reload = async () => {
  await listStore.setPage(1);
  listStore.getLookup();
  listStore.getDailyScheduleLookup();
  listStore.getMaintenanceAssignmentLookup();
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
    }), `Master Data Closed Services.xlsx`);
}
</script>

<style>
    el-overlay {
        z-index: 100 !important;
    }
</style>
