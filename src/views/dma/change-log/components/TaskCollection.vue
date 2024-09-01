<template>
  <div class="version-wrapper overflow-auto">
    <div class="w-100 h-100">
      <h1>Task Collection</h1>
      <hr />
      <div class="card mb-10">
        <div class="card-body p-3 w-100">
          <div class="d-flex justify-content-end gap-2 mb-2">
            <FilterButton
            ref=""
            @apply-filter="(value) => applyFilter(value)"
            @load-filter-data="reloadFilterData()"  />
            <DownloadButton @handle-download="handleDownload"/>
          </div>
          <Grid :list-data="listData" />
          <Pagination
            v-if="!listStore.paginationLoading"
            @raise-page-change="handlePaginationChange($event)"
            @raise-size-change="handleSizeChange($event)"
            :currentPage="pagination.currentPage"
            :totalPage="pagination.totalPage"
            :totalPageSize="pagination.totalPageSize"
            :isPageSizeChange="true"
            :pageSizes="[50, 20, 10]"
            :startPaginationIndex="pagination.startPaginationIndex"
            :endPaginationIndex="pagination.endPaginationIndex"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  computed,
  onBeforeMount,
  onUnmounted,
  ref
} from "vue";
import Grid from "./task-collection/Grid.vue";
import Pagination from "@/components/pager/Pagination.vue";
import PaginationType from "@/core/types/misc/Pagination";
import DownloadButton from "../components/task-collection/DownloadButton.vue";
import FilterButton from "../components/task-collection/FilterButton.vue";
import { saveAs } from "file-saver";
import {
  FilterData
} from "@/core/types/entities/dma/task-collection/FilterData";

import {
  useTaskCollection
} from "@/store/pinia/dma/task-collection/useTaskCollection";

const listStore = useTaskCollection();

const filter = ref<any>(null)

const listData = computed(() => {
  return listStore.displayData;
});

const pagination = computed((): PaginationType => {
  return listStore.pagination;
});

const reloadFilterData = () => {
  listStore.getLookupFilter()
};

const handlePaginationChange = (newPage: number) => {
  listStore.setPage(newPage);
};

const handleSizeChange = (size: number) => {
  listStore.setPageSize(size);
};

const applyFilter = (value: FilterData) => {
  listStore.setLastActiveFilter(value)
  listStore.setFilterData(value)
};

const handleDownload = async () => {
  const blob = await listStore.export() as Blob;
  saveAs(new Blob([blob],
    {
      type: "application/octet-stream"
    }), `task_collection.xlsx`);
}

onBeforeMount(() => {
  listStore.setPage(1);
});

onUnmounted(() => {
  listStore.resetState();
});
</script>
<style lang="scss" scoped>
.version-wrapper {
  width: 100%;
}
</style>
