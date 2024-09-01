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
      style="width: 100%;"
      :max-height="400"
      @sort-change="handleSort"
      :empty-text="'No Data'"
      header-cell-class-name="ironlake-table-cell-header"
      cell-class-name="ironlake-table-cell"
      @select="checkUserSelected"
      @select-all="checkUserSelected"
    >
      <el-table-column label="Site ID" width="200" align="left" prop="validationReason">
        <template #default="scope">
          <!-- <span>{{ startIndex + scope.$index }}</span> -->
          <div class="d-flex gap-4">
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
            <div class="text-name">
              {{ scope.row.siteId }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        prop="siteCode"
        label="Site Code"
      />
      <el-table-column
        min-width="200"
        prop="siteName"
        label="Site Name"
      />
      <el-table-column label="Action" width="80" align="center" fixed="right">
        <template #default="scope">
          <div class="d-flex justify-content-end gap-6">
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
  PropType,
  defineProps,
  defineEmits,
  ref
} from "vue";
import { computed } from "@vue/reactivity";
import { dynamicSortCaseInsensitive } from "@/core/helpers/table-sort";
import Icon from "@/components/ironlake/Icon.vue";
import {
  ListDraftItem
} from "@/core/types/entities/administration/organization-unit/employee/ListDraftItem";
import {
  useSiteListStore
} from "@/store/pinia/iron-lake/business-partner/site/useSiteListStore";
import {
  useSiteFormStore
} from "@/store/pinia/iron-lake/business-partner/site/useSiteFormStore";
import {
  useSiteBulkStore
} from "@/store/pinia/iron-lake/business-partner/site/useSiteBulkStore";
import {
  ListDraft
} from "@/core/types/entities/iron-lake/business-partner/site/ListDraft";
import {
  swalAlertConfirmation,
  swalAlertSuccess
} from "@/core/helpers/sweet-alert";


const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<ListDraft[]>,
  },
  page: {
    required: true,
    type: Number,
    default: 1,
  },
});
const listStore = useSiteListStore();
const formStore = useSiteFormStore();
const bulkStore = useSiteBulkStore();
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
const handleEditRow = (item: ListDraft[]) => {
  formStore.setFormDraftData(item);
  emits("show-dialog", null);
};
const handleShowErrorModals = (event) => {
  const details = {
    name: event.siteName,
    errors: event.validationReason,
  }
  emits("show-errors", details);
};
const handleDeleteDraft = (event) => {
  emits("delete-draft", event);
}
// multiple delete module
interface DeleteRecordPayload {
  dailyScheduleDraftId: number;
}
const userSelected = ref<DeleteRecordPayload[]>([]);
const checkUserSelected = (selection) => {
  userSelected.value = selection.map((element) => {
    const recordObjectID = {
      siteDraftId: element.siteDraftId,
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
