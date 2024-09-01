<template>
  <div style="width: 95%; margin: 20px auto;">
    <Filters />
  </div>
  <div class="section">
    <Grid
      v-loading="loading"
      element-loading-background="#2d2b39b3"
      :listData="listData"
      :page="pagination.currentPage"
    />
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
  </div>
</template>
<script lang="ts" setup>
import { useStore } from "vuex";
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb';
import {
  computed,
  onBeforeMount,
  onUnmounted,
  watch,
} from 'vue';
import { Actions as StoreActions } from "@/store/enums/StoreEnums";
import Pagination from "@/components/pager/Pagination.vue";
import PaginationType from "@/core/types/misc/Pagination";
import {
  useComponentHealthDataListStore
} from "@/store/pinia/iron-portal/iron-portal-historical/component-health-data/useComponentHealthDataListStore";

/* import components here */
import Filters from "./components/Filters.vue"
import Grid from "./components/Grid.vue"

const store = useStore();
const listStore = useComponentHealthDataListStore();

/* computed */
const loading = computed(() => {
  return listStore.loading;
});
const listData = computed(() => {
  return listStore.displayData;
});
const pagination = computed((): PaginationType => {
  return listStore.pagination;
});
const handlePaginationChange = (newPage: number) => {
  listStore.setPage(newPage);
}
const filterData = computed(() => {
  return listStore.filterData;
})

/* watchers */
watch(filterData, async () => {
  if (
    filterData.value.site && filterData.value.site != "" &&
    filterData.value.group && filterData.value.group != "" &&
    filterData.value.model && filterData.value.model != "" &&
    filterData.value.equipment && filterData.value.equipment.length != 0 &&
    filterData.value.component && filterData.value.component.length != 0 &&
    filterData.value.startDate && filterData.value.startDate != "" &&
    filterData.value.endDate && filterData.value.endDate != ""
  ) {
    await listStore.getData();
  }
}, {
  deep: true
});

/* life cycle hooks */
onBeforeMount(async () => {
  store.dispatch(StoreActions.ACTIVE_PAGE, "IronPortal");
  setCurrentPageBreadcrumbs("Component Health Data", [
    {
      pageName: "IronPortal",
      pageRoute: "ironportal",
    },
    {
      pageName: "IronPortal Historical",
      pageRoute: "componenthealthdata",
    },
    {
      pageName: "Component Health Data",
      pageRoute: "componenthealthdata",
    },
  ]);
  listStore.setPage(1);
  await listStore.getLookupSite();
  await listStore.getLookupGroup();
  await listStore.getLookupModel();
  await listStore.getLookupEquipment();
  await listStore.getLookupComponent();
});

onUnmounted(async () => {
  listStore.resetState();
});

/* methods */
</script>

<style lang="scss" scoped>
.section {
  background-color: #2d2b39;
  width: 95%;
  padding: 30px;
  margin: 0 auto;
  border-radius: 10px;
}
</style>
