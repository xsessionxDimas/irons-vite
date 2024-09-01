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
  <template v-if="bulkStore.loading || listStore.loading">
    <div
      v-loading="bulkStore.loading || listStore.loading"
      style="height: 100px"
    ></div>
  </template>
  <el-table
    v-else
    :data="props.listData"
    style="width: 100%"
    :empty-text="'No Data to Display'"
    :max-height="400"
    header-cell-class-name="ironlake-table-cell-header"
    cell-class-name="ironlake-table-cell"
    @select="checkUserSelected"
    @select-all="checkUserSelected"
  >
    <el-table-column
      prop="siteName"
      label="Site"
      width="226"
      sortable
      :sort-orders="['ascending', 'descending']"
    >
      <template #default="scope">
        <div class="d-flex" style="line-height: 1.25; align-items: center">
          <el-tooltip
            class="box-item"
            effect="dark"
            placement="top"
            content="Click to see errors"
          >
            <span
              class="svg-icon svg-icon-btech-danger-500 me-1"
              style="cursor: pointer"
              @click="showDialogInvalid(scope.row)"
            >
              <inline-svg
                src="/media/icons/bumaau/info.svg"
                style="width: 1.25rem; height: 1.25rem"
              />
            </span>
          </el-tooltip>
          <p class="m-0" style="line-height: 1.25rem">
            {{ scope.row.siteName }}
          </p>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="equipmentNo"
      label="Equipment No"
      width="178"
      sortable
      :sort-orders="['ascending', 'descending']"
    >
      <template #default="scope">
        <div class="d-flex" style="line-height: 1.25; align-items: center">
          <p class="m-0" style="line-height: 1.25rem">
            {{ scope.row.equipmentNo }}
          </p>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      v-if="listStore.stateOnlyEquipment"
      prop="equipmentGroup"
      label="Group"
      width="178"
      sortable
      :sort-orders="['ascending', 'descending']"
    />
    <el-table-column
      v-if="listStore.stateOnlyEquipment"
      prop="equipmentBrand"
      label="Brand"
      width="178"
      sortable
      :sort-orders="['ascending', 'descending']"
    />
    <el-table-column
      v-if="listStore.stateOnlyEquipment"
      prop="equipmentModel"
      label="Model"
      width="178"
      sortable
      :sort-orders="['ascending', 'descending']"
    />
    <el-table-column
      v-if="listStore.stateOnlyEquipment"
      prop="ownership"
      label="Ownership"
      width="178"
      sortable
      :sort-orders="['ascending', 'descending']"
    />
    <el-table-column
      v-if="listStore.stateOnlyEquipment"
      prop="serialNo"
      label="Serial No"
      width="178"
      sortable
      :sort-orders="['ascending', 'descending']"
    />
    <el-table-column
      prop="engineHourMeterOffset"
      label="Hour Meter Offset"
      width="178"
      :align="'center'"
      sortable
      :sort-orders="['ascending', 'descending']"
    >
      <template #default="scope">
        <div v-if="scope.row.engineHourMeterOffset">
          {{ scope.row.engineHourMeterOffset }}
        </div>
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column
      label="Hour Meter Offset Reset Date"
      sortable
      :width="listStore.stateOnlyEquipment ? 240 : ''"
      :sort-orders="['ascending', 'descending']"
    >
      <template #default="scope">
        <span v-if="scope.row.resetDate">
          {{ formatDateOnlyAU(scope.row.resetDate) }}
        </span>
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column
      v-if="listStore.stateOnlyEquipment"
      prop="componentCode"
      label="Component Code"
      width="178"
      sortable
      :sort-orders="['ascending', 'descending']"
    />
    <el-table-column
      v-if="listStore.stateOnlyEquipment"
      prop="componentName"
      label="Component Name"
      width="178"
      sortable
      :sort-orders="['ascending', 'descending']"
    />
    <el-table-column
      label="Action"
      header-align="center"
      fixed="right"
      width="80"
    >
      <template #default="scope">
        <div class="d-flex justify-content-center gap-6">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="Edit"
            placement="top"
          >
            <span
              class="svg-icon svg-icon-btech-secondary-500 d-inline-block m-0"
              style="cursor: pointer"
              @click="handleEdit(scope)"
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
              class="svg-icon svg-icon-btech-danger-500 d-inline-block m-0"
              style="cursor: pointer"
              @click="handleDelete(scope)"
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
  <el-dialog
    v-model="dialogInvalidField"
    :title="`Errors for Equipment No. ${invalidTitle}`"
    modal-class="ironlake-dialog"
    width="40%"
    align-center
  >
    <ul class="m-0">
      <li v-for="reason in invalidList" :key="invalidList.indexOf(reason)">
        <p class="m-0 invalid-reason">{{ reason }}</p>
      </li>
    </ul>
    <template #footer>
      <span class="dialog-footer"></span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
/* import componenets here */
import {
  ValidatedDraftItem
} from "@/core/types/entities/iron-lake/equipment/all-equipment/ValidatedItem";
import {
  useListStore
} from "@/store/pinia/iron-lake/equipment/all-equipment/useListStore";
import {
  useBulkStore
} from "@/store/pinia/iron-lake/equipment/all-equipment/useBulkStore";
import {
  useFormStore
} from "@/store/pinia/iron-lake/equipment/all-equipment/useFormStore";
import { formatDateOnlyAU } from "@/core/helpers/date-format";

import {
  PropType,
  defineProps,
  defineEmits,
  ref
} from "vue";
import {
  swalAlertConfirmation,
  swalAlertSuccess,
} from "@/core/helpers/sweet-alert";

const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<ValidatedDraftItem[]>,
  },
});

/* stores */
const listStore = useListStore();
const bulkStore = useBulkStore();
const formStore = useFormStore();

// edit module
const emit = defineEmits(["show-form", "load-page", "close-expand"]);
const handleEdit = (data) => {
  formStore.stateIsNewForm = false;
  formStore.stateIsDraftForm = true;
  formStore.setErrors(data.row.validationReason.split(","));

  const payload = {
    equipmentDraftId: data.row.equipmentNoDraftId,
    equipmentUnit: data.row.equipmentNo,
    siteName: data.row.siteName,
    serialNo: data.row.serialNo,
    group: data.row.equipmentGroup,
    brandName: data.row.equipmentBrand,
    model: data.row.equipmentModel,
    ownership: data.row.ownership,
    engineHourMeterOffset: data.row.engineHourMeterOffset,
    resetDate: data.row.resetDate,
    componentCode: data.row.componentCode,
    componentName: data.row.componentName,
    isActive: true,
  };
  formStore.stateComponentTable = [
    {
      componentCode: data.row.componentCode,
      componentName: data.row.componentName,
    },
  ];
  formStore.stateFormItem = [payload];

  emit("show-form");
};

// delete module
const handleDelete = async (data) => {
  swalAlertConfirmation("Remove this record from Need Review?", "Remove").then(
    async (res) => {
      if (res.isConfirmed) {
        await bulkStore.deleteDraft(data.row.equipmentNoDraftId).then(() => {
          emit("load-page");
          emit("close-expand");
          swalAlertSuccess("Record have been successfully deleted!", "Ok");
        });
      }
    },
  );
};
// multiple delete module
interface DeleteRecordPayload {
  equipmentDraftId: number;
}
const userSelected = ref<DeleteRecordPayload[]>([]);
const checkUserSelected = (selection) => {
  userSelected.value = selection.map((element) => {
    const recordObjectID = {
      equipmentDraftId: element.equipmentNoDraftId,
    };
    return recordObjectID;
  });
};
const handleDeleteBulk = () => {
  swalAlertConfirmation("Remove all selected records from Need Review?", "Remove").then(
    async (res) => {
      if (res.isConfirmed) {
        await bulkStore.deleteBulkDraft(userSelected.value).then(() => {
          emit("load-page");
          emit("close-expand");
          swalAlertSuccess("Records have been successfully deleted!", "Ok");
          userSelected.value = [];
        });
      }
    },
  );
};

// dialog module
const dialogInvalidField = ref(false);
const invalidTitle = ref("");
const invalidList = ref<string[]>([]);
const showDialogInvalid = (data) => {
  invalidTitle.value = data.equipmentNo;
  invalidList.value = data.validationReason.split(",").map((element: string) => {
    return element;
  });
  dialogInvalidField.value = true;
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/core/components/mixins/_typography.scss";

:deep(.ironlake-table-cell) {
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid #ddd;
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
  // background-color: #D66666 !important;
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

.rounded-badge-success {
  background-color: green;
}

.rounded-badge-error {
  background-color: red;
}

.invalid-reason {
  font-size: 1rem;
  font-weight: 400;
  word-break: normal;
}

:deep(.el-table__fixed-right) {
  height: 100% !important;
  .el-table__fixed-body-wrapper {
    height: 100% !important;
  }
}
</style>
