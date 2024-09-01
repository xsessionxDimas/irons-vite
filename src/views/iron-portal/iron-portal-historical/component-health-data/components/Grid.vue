<template>
  <template v-if="listStore.loading">
    <div v-loading="listStore.loading" style="height: 100px"></div>
  </template>
  <template v-else>
    <el-table
      v-loading="listStore.loading"
      :data="props.listData"
      style="width: 100%"
      empty-text="No Data"
      class="table_dark-row table-dark"
      header-row-class-name="table_dark-header"
      row-class-name="table_dark-row text-white"
      @sort-change="handleSort"
    >
      <el-table-column prop="site" label="Site" min-width="170" sortable :sort-method="defaultSorting(columnOrder)" />
      <el-table-column prop="group" label="Group" min-width="170" sortable :sort-method="defaultSorting(columnOrder)" />
      <el-table-column prop="model" label="Model" min-width="170" sortable :sort-method="defaultSorting(columnOrder)" />
      <el-table-column prop="equipment" label="Equipment" min-width="170" sortable :sort-method="defaultSorting(columnOrder)" />
      <el-table-column prop="component" label="Component" min-width="170" sortable :sort-method="defaultSorting(columnOrder)" />
      <el-table-column prop="sourceType" label="Source Type" min-width="170" sortable :sort-method="defaultSorting(columnOrder)" />
      <el-table-column label="" width="170">
        <template #header>
          <el-tooltip class="box-item" effect="dark" :content="isFilterEmpty ? `Please fill all the filter first` : `Click to Download All`" placement="top">
            <div>
              <button
                class="btn fw-bolder comp_heath_data-btn_download"
                @click="handleDownloadAll"
                :disabled="isFilterEmpty"
                v-loading="loadingDownloadAll"
                element-loading-background="#2d2b39b3"
                align="center"
              >
                Download All
              </button>
            </div>
          </el-tooltip>
        </template>
        <template #default="scope">
          <button
            class="btn fw-bolder comp_heath_data-btn_download"
            @click="handleDownloadRow(scope.row)"
          >
            Download
          </button>
        </template>
      </el-table-column>
    </el-table>
  </template>
</template>
<script lang="ts" setup>
import {
  useComponentHealthDataListStore
} from "@/store/pinia/iron-portal/iron-portal-historical/component-health-data/useComponentHealthDataListStore";
/* import components here */
import { ElTable, ElTableColumn } from "element-plus";
import {
  PropType,
  computed,
  defineProps,
  ref,
} from "vue";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-historical/component-health-data/ListItem";
import { defaultSorting } from "@/core/helpers/table-sort";
import { saveAs } from "file-saver";

const listStore = useComponentHealthDataListStore();

const loadingDownloadAll = ref(false);

const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<ListItem[]>,
  },
  page: {
    required: true,
    type: Number,
    default: 1
  }
});

const filterData = computed(() => {
  return listStore.filterData;
})

const isFilterEmpty = computed(() => {
  if (
    filterData.value.site && filterData.value.site != "" &&
    filterData.value.group && filterData.value.group != "" &&
    filterData.value.model && filterData.value.model != "" &&
    filterData.value.equipment && filterData.value.equipment.length != 0 &&
    filterData.value.component && filterData.value.component.length != 0 &&
    filterData.value.startDate && filterData.value.startDate != "" &&
    filterData.value.endDate && filterData.value.endDate != ""
  ) {
    return false
  }
  return true
})

const columnOrder = ref("");
const handleSort = (sort) => {
  columnOrder.value = sort.order
  const payload = {
    prop: sort.prop,
    order: sort.order,
  };
  listStore.setSort(payload);
}

const handleDownloadAll = async () => {
  loadingDownloadAll.value = true;
  const blob = await listStore.exportAll() as Blob;
  saveAs(new Blob([blob],
    { type: "application/octet-stream" }), `ComponentHealthData.xlsx`);
  loadingDownloadAll.value = false;
}

const handleDownloadRow = async (row) => {
  const blob = await listStore.exportRow(row) as Blob;
  saveAs(new Blob([blob],
    {
      type: "application/octet-stream"
    }), `ComponentHealthData-${row.site}-${row.group}-${row.model}-${row.equipment}-${row.sourceType}.xlsx`);
}
</script>

<style lang="scss">
.comp_heath_data-btn_download {
  color: #229a16;
}
</style>
