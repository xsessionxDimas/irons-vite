<template>
  <section v-if="userSelected.length > 0" class="d-flex justify-content-end">
    <el-button
      class="btn btn-outline btn-outline-btech-danger btn-active-light-btech-danger btech-md mb-4"
      @click="handleDeleteBulk"
    >
      <span class="svg-icon svg-icon-btech-danger-500 d-inline-block mr-2">
        <inline-svg
          src="/media/icons/bumaau/delete.svg"
          style="width: 1.25rem; height: 1.25rem"
        />
      </span>
      Delete ({{ userSelected.length }})
    </el-button>
  </section>
  <template v-if="listStore.loading">
    <div v-loading="listStore.loading" style="height: 100px"></div>
  </template>
  <template v-else>
    <el-table
      v-loading="listStore.loading"
      :data="props.listData"
      style="width: 100%"
      :max-height="400"
      :table-layout="'fixed'"
      @sort-change="handleSort"
      header-cell-class-name="ironlake-table-cell-header"
      cell-class-name="ironlake-table-cell"
      :empty-text="'No Data'"
      @select="checkUserSelected"
      @select-all="checkUserSelected"
    >
      <el-table-column label="Full Name" align="left" prop="name" min-width="250">
        <template #default="scope">
          <div class="row">
            <div class="d-flex gap-4 align-items-center">
              <div>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="Click to see errors."
                  placement="top"
                >
                <span
                  class="svg-icon svg-icon-btech-danger-500 me-1"
                  style="cursor: pointer"
                  @click="handleShowErrorModals(scope.row)"
                >
                  <inline-svg
                    src="/media/icons/bumaau/info.svg"
                    style="width: 1.25rem; height: 1.25rem"
                  />
                </span>
                </el-tooltip>
              </div>
              <div class="text-name">{{ scope.row.name }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="178"
        prop="company"
        label="Company"
      />
      <el-table-column
        width="178"
        prop="position"
        label="Position"
      />
      <el-table-column
        width="178"
        prop="siteName"
        label="Site Name"
      >
      <template #default="scope">
        <div class="text-email">
          {{ scope.row.siteName }}
        </div>
      </template>
      </el-table-column>
      <el-table-column
        width="178"
        prop="vendor"
        label="Vendor"
      />
      <el-table-column
        prop="superiorName"
        label="Supervisor"
        width="178"
      />
      <el-table-column
        min-width="200"
        label="Email"
      >
      <template #default="scope">
        <div class="text-email">
          {{ scope.row.email }}
        </div>
      </template>
      </el-table-column>
      <el-table-column label="Action" width="80" align="center" fixed="right">
        <template #default="scope">
          <div class="d-flex justify-content-end align-items-center gap-6">
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
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Delete"
              placement="top"
            >
              <span
                  @click="handleDeleteDraft(scope.row)"
                  class="svg-icon svg-icon-btech-danger-500 d-inline-block m-0 cursor-pointer"
                >
                  <inline-svg
                    src="/media/icons/bumaau/delete.svg"
                    style="width: 1.25rem; height: 1.25rem"
                  />
                </span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        fixed="right"
        width="40"
        :align="'center'"
        :header-align="'center'"
      />
    </el-table>
  </template>
</template>

<script lang="ts" setup>
/* import componenets here */
import { ElTable, ElTableColumn } from "element-plus";
import {
  formatDateAU,
  formatDateOnlyAU
} from "@/core/helpers/date-format";
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
import { computed } from "@vue/reactivity";
import { dynamicSortCaseInsensitive } from "@/core/helpers/table-sort";
import {
  ListDraftItem
} from "@/core/types/entities/administration/organization-unit/employee/ListDraftItem";
import Icon from "@/components/ironlake/Icon.vue";
import {
  swalAlertConfirmation,
  swalAlertSuccess
} from "@/core/helpers/sweet-alert";

const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<ListDraftItem[]>,
  },
  page: {
    required: true,
    type: Number,
    default: 1,
  },
});
const listStore = useEmployeeListStore();
const formStore = useEmployeeFormStore();
const emits = defineEmits(["show-dialog", "show-errors", "delete-draft"]);
const startIndex = computed(() => {
  return (props.page - 1) * 20 + 1;
});
const columnOrder = ref("");
const handleSort = (sort) => {
  columnOrder.value = sort.order;
  const payload = {
    prop: sort.prop,
    order: sort.order,
  };
  listStore.setSort(payload);
};
const customSort = (objA, objB, field) => {
  return dynamicSortCaseInsensitive(
    objA[field],
    objB[field],
    columnOrder.value,
  );
};
const handleEditRow = (item: ListDraftItem) => {
  formStore.setFormDraft(item);
  emits("show-dialog", null);
};
const handleShowErrorModals = (event) => {
  const details = {
    name: event.name,
    errors: event.validationReason,
  }
  emits("show-errors", details);
};
const handleDeleteDraft = (event) => {
  emits("delete-draft", event);
}
// multiple delete module
interface DeleteRecordPayload {
  employeeDraftId: number;
}
const userSelected = ref<DeleteRecordPayload[]>([]);
const checkUserSelected = (selection) => {
  userSelected.value = selection.map((element) => {
    const recordObjectID = {
      employeeDraftId: element.employeeDraftId,
    };
    return recordObjectID;
  });
};
const handleDeleteBulk = () => {
  swalAlertConfirmation("Remove all selected records from Need Review?", "Remove").then(
    async (res) => {
      if (res.isConfirmed) {
        await formStore.deleteBulkDraft(userSelected.value).then(() => {
          listStore.setPage(1);
          swalAlertSuccess("Records have been successfully deleted!", "Ok");
          userSelected.value = [];
        });
      }
    },
  );
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
}
.text-email {
  white-space: nowrap;
  overflow-x: scroll;
}
</style>
