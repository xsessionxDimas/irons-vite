<template>
  <template v-if="listStore.loading">
    <div v-loading="listStore.loading" style="height: 100px"></div>
  </template>
  <template v-else>
    <el-table
      v-loading="listStore.loading"
      :data="props.listData"
      style="width: 100%"
      @sort-change="handleSort"
      :sort-orders="['ascending', 'descending']"
      :default-sort="{ prop: 'siteId', order: 'ascending' }"
      header-cell-class-name="ironlake-table-cell-header"
      cell-class-name="ironlake-table-cell"
      :empty-text="'No Data'"
    >
      <el-table-column
        prop="siteId"
        label="Site ID"
        width="200"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => customSort(a, b, 'siteId')"
        align="left"
      >
      <template #default="props">
        <div class="text-name">
          {{ props.row.siteId }}
        </div>
      </template>
      </el-table-column>
      <el-table-column
        width="200"
        prop="siteCode"
        label="Site Code"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => customSort(a, b, 'siteCode')"
      />
      <el-table-column
        width="200"
        prop="siteName"
        label="Site Name"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => customSort(a, b, 'siteName')"
      >
      <template #default="scope">
        <div class="text-sitename">
          {{ scope.row.siteName }}
        </div>
      </template>
      </el-table-column>
      <el-table-column
        width="200"
        prop="isActive"
        label="Status"
        align="center"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => customSort(a, b, 'isActive')"
      >
        <template #default="scope">
          <template v-if="scope.row.isActive">
            <div class="d-flex justify-content-center ">
              <div class="badge badge-circle badge-success mx-auto rounded-badge-success">
                <inline-svg src="/media/svg/tables/rows/check-light.svg" />
              </div>
            </div>
          </template>
          <template v-else>
            <div class="d-flex justify-content-center ">
              <div class="badge badge-circle badge-success mx-auto rounded-badge-error">
                <inline-svg src="/media/svg/tables/rows/valid-false-light.svg" />
              </div>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="Action" min-width="80" align="right" fixed="right">
        <template #default="scope">
          <div class="row">
            <div class="d-flex justify-content-end">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="Edit"
                placement="top"
              >
                <span
                  @click="handleEditRow(scope.row)"
                  class="svg-icon svg-icon-btech-secondary-500 d-flex justify-content-end cursor-pointer"
                >
                  <inline-svg
                    src="/media/svg/tables/rows/mode-edit-round.svg"
                    style="width: 1.25rem; height: 1.25rem"
                  />
                </span>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </template>
</template>

<script lang="ts" setup>
/* import componenets here */
import {
  useSiteListStore
} from "@/store/pinia/iron-lake/business-partner/site/useSiteListStore";
import {
  useSiteFormStore
} from "@/store/pinia/iron-lake/business-partner/site/useSiteFormStore";
import {
  ListItem
} from "@/core/types/entities/iron-lake/business-partner/site/ListItem";
import {
  PropType,
  defineProps,
  defineEmits,
  ref
} from "vue";
import {
  dynamicSortCaseInsensitive
} from "@/core/helpers/table-sort";

const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<ListItem[]>,
  },
  page: {
    required: true,
    type: Number,
    default: 1,
  },
});
const listStore = useSiteListStore();
const formStore = useSiteFormStore();
const emits = defineEmits(["show-dialog"]);
const columnOrder = ref("");
const handleSort = (sort) => {
  columnOrder.value = sort.order;
};
const customSort = (objA, objB, field) => {
  return dynamicSortCaseInsensitive(
    objA[field].toString() || "",
    objB[field].toString() || "",
    columnOrder.value,
  );
};
const handleEditRow = (item: ListItem) => {
  formStore.setFormData(item);
  emits("show-dialog", null);
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/core/components/mixins/_typography.scss";

:deep(.el-table__fixed-right) {
height: 100% !important;
.el-table__fixed-body-wrapper {
  height: 100% !important;
}
}


:deep(.ironlake-table-cell) {
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid #ddd;
  // border-bottom: none;
  .cell {
    padding: 0;
    @include paragraph-sm();
  }
  &:first-child {
    padding-left: 1rem;
  }
  &:last-child {
    padding-right: 1rem;
  }
}

:deep(.ironlake-table-cell-header) {
  padding: 1rem 0.5rem;
  color: #000;
  .cell {
    padding: 0;
    @include paragraph-md();
    font-weight: 600;
  }
  &:first-child {
    padding-left: 1rem !important;
  }
  &:last-child {
    padding-right: 1rem;
  }
}
.text-name {
  font-size: 1rem;
  font-weight: 600;
}
.rounded-badge-success {
  background-color: green;
}
.rounded-badge-error {
  background-color: red;
}
.text-black i{
  color: rgb(55, 71, 79);
}
.text-sitename {
  white-space: nowrap;
  overflow-x: auto;
}
</style>
