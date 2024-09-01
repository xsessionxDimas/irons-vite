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
    :empty-text="'No Data'"
    header-cell-class-name="ironlake-table-cell-header"
    cell-class-name="ironlake-table-cell"
    @select="checkUserSelected"
    @select-all="checkUserSelected">
    <el-table-column label="" min-width="50" align="center" prop="validationReason">
        <template #default="scope">
          <div class="d-flex gap-4 justify-content-center">
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
        </template>
      </el-table-column>
    <el-table-column
      label="Description"
      prop="taskDescription"
      min-width="400"
    />
    <el-table-column
      label="Model"
      prop="equipmentModel"
      width="200"
    />
    <el-table-column
      label="Service Size"
      prop="serviceSize"
      width="200"
    />
    <el-table-column
      label="Rating"
      prop="rating"
      width="200"
    />
    <el-table-column
      label="Type Parameter"
      prop="typeParameter"
      width="200"
    />
    <el-table-column
      label="Component"
      prop="component"
      width="200"
    />
    <el-table-column
      label="CBM Group"
      prop="cbmGroup"
      width="200"
    />
    <el-table-column
      label="UoM"
      prop="uom"
      width="200"
    />
    <el-table-column
      label="Status"
      prop="status"
      width="200"
    />
    <el-table-column
      label="Min Value"
      prop="minValue"
      width="200"
    />
    <el-table-column
      label="Max Value"
      prop="maxValue"
      width="200"
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
import {
  ref,
  defineEmits,
} from "vue";
import {
  DraftItem
} from "@entities/iron-lake/maintenance/cbm-parameter/DraftItem";
import {
  useCbmParameterListStore
} from "@/store/pinia/iron-lake/maintenance/cbm-parameter/useCbmParameterListStore";
import {
  useCbmParameterFormStore
} from "@/store/pinia/iron-lake/maintenance/cbm-parameter/useCbmParameterFormStore";
import {
  useCbmParameterBulkStore
} from "@/store/pinia/iron-lake/maintenance/cbm-parameter/useCbmParameterBulkStore";
import {
  swalAlertConfirmation,
  swalAlertSuccess,
} from "@/core/helpers/sweet-alert";
import { PropType } from "vue";

// props
const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<DraftItem[]>,
  }
})

// stores
const listStore = useCbmParameterListStore();
const formStore = useCbmParameterFormStore();
const bulkStore = useCbmParameterBulkStore();

// emits
const emits = defineEmits(
  [
    'show-errors',
    'delete-draft',
    'show-dialog',
    'load-page'
  ]);

const handleShowErrorModals = (event) => {
  const details = {
    name: event.taskDescription,
    errors: event.validationReason,
  }
  emits("show-errors", details);
};

const handleEditRow = (event) => {
  formStore.setFormDraftData(event)
  emits("show-dialog", event)
}

const handleDeleteDraft = (event) => {
  emits("delete-draft", event);
}

// Multiple record delete
interface DeleteRecordPayload {
  cbmParameterDraftId: number;
}
const userSelected = ref<DeleteRecordPayload[]>([]);
const checkUserSelected = (selection) => {
  userSelected.value = selection.map((element) => {
    const recordObjectID = {
      cbmParameterDraftId: element.cbmParameterDraftId,
    };
    return recordObjectID;
  });
};
const handleDeleteBulk = () => {
  swalAlertConfirmation("Remove all selected records from Need Review?", "Remove").then(
    async (res) => {
      if (res.isConfirmed) {
        await bulkStore.deleteBulkDraft(userSelected.value).then(() => {
          emits("load-page");
          swalAlertSuccess("Records have been successfully deleted!", "Ok");
          userSelected.value = [];
        });
      }
    },
  );
};
</script>
<style lang="scss" scoped>
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
