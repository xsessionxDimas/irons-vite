<template>
  <template v-if="listStore.loading">
    <div v-loading="listStore.loading" style="height: 100px"></div>
  </template>
  <template v-else>
    <el-table
      v-loading="listStore.loading"
      :data="props.listData"
      :table-layout="'fixed'"
      @sort-change="handleSort"
      style="width: 100%"
      header-cell-class-name="ironlake-table-cell-header"
      cell-class-name="ironlake-table-cell"
      :empty-text="'No Data'"
    >
      <el-table-column
        min-width="250"
        prop="name"
        label="Full Name"
        align="left"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="sortName"
      >
        <template #default="scope">
          <div class="row">
            <div>
              <div class="text-name">{{ scope.row.name }}</div>
              <div class="text-black">
                {{ scope.row.position }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="company"
        label="Company"
        width="178"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => sortNew(a.company, b.company)"
      />
      <el-table-column
        prop="siteName"
        label="Site Name"
        width="178"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => sortNew(a.siteName, b.siteName)"
      />
      <el-table-column
        prop="vendor"
        label="Vendor"
        width="178"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => sortNew(a.vendor, b.vendor)"
      />
      <el-table-column
        prop="superiorName"
        label="Supervisor"
        width="178"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => sortNew(a.superiorName, b.superiorName)"
      />
      <el-table-column
        prop="email"
        label="Email"
        min-width="200"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => sortNew(a.email, b.email)"
      >
      <template #default="scope">
        <div class="text-email">
          {{ scope.row.email }}
        </div>
      </template>
      </el-table-column>
      <el-table-column
        prop="isActive"
        label="Status"
        width="100"
        align="center"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => sortNew(a.isActive.toString(), b.isActive.toString())"

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
            <div class="d-flex justify-content-center">
              <div class="badge badge-circle badge-success mx-auto rounded-badge-error">
                <inline-svg src="/media/svg/tables/rows/valid-false-light.svg" />
              </div>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="Action" width="80" align="center" fixed="right">
        <template #default="scope">
          <div class="row justify-content-center">
            <div>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="Edit"
                placement="top"
              >
                <span
                  @click="handleEditRow(scope.row)"
                  class="svg-icon svg-icon-btech-secondary-500 d-inline-block m-0 cursor-pointer"
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
import { ElTable, ElTableColumn } from "element-plus";
import {
  useEmployeeListStore
} from "@/store/pinia/administration/organization-unit/employee/useEmployeeListStore";
import {
  useEmployeeFormStore
} from "@/store/pinia/administration/organization-unit/employee/useEmployeeFormStore";
import {
  ListItem
} from "@/core/types/entities/administration/organization-unit/employee/ListItem";
import {
  PropType,
  defineProps,
  defineEmits,
  ref
} from "vue";
import { formatDateAU, formatDateOnlyAU } from "@/core/helpers/date-format";
import { computed } from "@vue/reactivity";
import { dynamicSortCaseInsensitive } from "@/core/helpers/table-sort";
import Avatar from "@/components/ironlake/Avatar.vue";
import Icon from "@/components/ironlake/Icon.vue";

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
const listStore = useEmployeeListStore();
const formStore = useEmployeeFormStore();
const emits = defineEmits(["show-dialog"]);
const columnOrder = ref({});
const handleSort = (sortParam: {column; prop; order}) => {
  columnOrder.value = sortParam.order;
};
const customSort = (objA, objB, field) => {
  return dynamicSortCaseInsensitive(
    objA[field].toString() || "",
    objB[field].toString() || "",
    columnOrder.value,
  );
};
const sortNew = (a, b) => {
  const valueA = a.toLowerCase();
  const valueB = b.toLowerCase();
  if (valueA === null) return 1;
  if (valueB === null) return -1;
  if (valueA === null && valueB === null) return 0;
  return valueA.localeCompare(valueB);
}

const handleEditRow = (item: ListItem) => {
  const editRow = {
    employeeId: item.employeeId,
    company: item.company,
    name: item.name,
    profileUrl: item.profileUrl,
    email: item.email,
    position: item.position,
    siteName: item.siteName,
    vendor: item.vendor,
    supervisor: item.superiorName,
    isActive: item.isActive,
    employeeCode: item.employeeCode,
  };
  listStore.getLookupPosition();
  formStore.setFormData(editRow);
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
  font-style: italic;
}
.text-email {
  white-space: nowrap;
  overflow-x: auto;
}
</style>
