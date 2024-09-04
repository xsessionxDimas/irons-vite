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
    <div v-loading="bulkStore.loading || listStore.loading" style="height: 100px"></div>
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
    <el-table-column prop="equipmentNo" label="Equipment No." width="174" sortable>
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
            {{ scope.row.equipmentNo }}
          </p>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="smuDue" label="SMU Due (Hours)" width="174" sortable />
    <el-table-column prop="workOrder" label="Work Order" width="174" sortable />
    <el-table-column prop="serviceSize" label="Service Size" width="174" sortable />
    <el-table-column prop="dateService" label="Planned Service Date" width="185" sortable>
      <template #default="scope">
        <span>{{ scope.row.dateService ? formatDateOnlyAU(scope.row.dateService) : "" }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="shift" label="Shift" min-width="90" sortable />
    <el-table-column prop="startDate" label="Start Date" min-width="110" sortable>
      <template #default="scope">
        <span>{{ scope.row.startDate ? formatDateOnlyAU(scope.row.startDate) : "" }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="endDate" label="End Date" min-width="110" sortable>
      <template #default="scope">
        <span>{{ scope.row.endDate ? formatDateOnlyAU(scope.row.endDate) : "" }}</span>
      </template>
    </el-table-column>
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
    :title="`Errors for work order ${invalidTitle}`"
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
      <span class="dialog-footer"> </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
/* import componenets here */
import {
  ValidatedDraftItem
} from "../../../../../core/types/entities/iron-lake/task/daily-schedule/ValidatedItem";
import {
  useDailyScheduleBulkStore
} from "../../../../..//store/pinia/iron-lake/task/daily-schedule/useDailyScheduleBulkStore";
import {
  useDailyScheduleFormStore
} from "../../../../..//store/pinia/iron-lake/task/daily-schedule/useDailyScheduleFormStore";
import {
  useDailyScheduleListStore
} from "../../../../..//store/pinia/iron-lake/task/daily-schedule/useDailyScheduleListStore";
import { formatDateOnlyAU } from "../../../../..//core/helpers/date-format";

import {
  defineProps,
  defineEmits,
  PropType,
  ref
} from "vue";
import {
  swalAlertConfirmation,
  swalAlertSuccess,
} from "../../../../..//core/helpers/sweet-alert";

const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<ValidatedDraftItem[]>,
  },
});

/* stores */
const listStore = useDailyScheduleListStore();
const bulkStore = useDailyScheduleBulkStore();
const formStore = useDailyScheduleFormStore();

// edit module
const emit = defineEmits(["show-form", "load-page"]);
const handleEdit = (data) => {
  const payload = {
    dailyScheduleId: data.row.dailyOutstandingServiceDraftId,
    unitNumber: data.row.equipmentNo,
    smuDue: data.row.smuDue?.toString(),
    workOrder: data.row.workOrder?.toString(),
    psType: data.row.serviceSize,
    dateService: data.row.dateService,
    shift: data.row.shift,
    startDate: data.row.startDate,
    endDate: data.row.endDate,
    isActive: data.row.isActive,
  };
  formStore.stateIsNewForm = false;
  formStore.stateIsDraftForm = true;
  formStore.stateFormItem = [payload];
  formStore.lookupServiceSize(payload.unitNumber);

  emit("show-form");
};

// delete module
const handleDelete = async (data) => {
  swalAlertConfirmation("Remove this record from Need Review ?", "Remove").then(
    async (res) => {
      if (res.isConfirmed) {
        await bulkStore
          .deleteDraft(data.row.dailyOutstandingServiceDraftId)
          .then(() => {
            emit("load-page");
            swalAlertSuccess("Record has been removed !", "Ok");
          });
      }
    },
  );
};
// multiple delete module
interface DeleteRecordPayload {
  dailyScheduleDraftId: number;
}
const userSelected = ref<DeleteRecordPayload[]>([]);
const checkUserSelected = (selection) => {
  userSelected.value = selection.map((element) => {
    const recordObjectID = {
      dailyScheduleDraftId: element.dailyOutstandingServiceDraftId,
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
  invalidTitle.value = data.workOrder;
  invalidList.value = data.validationReason.split(",");
  invalidList.value = invalidList.value.map((element: string) => {
    const regexServiceSize = /PS Type/g;
    element = element.replace(regexServiceSize, "Planned Service Size");

    const regexEquipmentNo = /Unit Number/g;
    element = element.replace(regexEquipmentNo, "Equipment No.");
    return element;
  });
  dialogInvalidField.value = true;
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/core/components/mixins/_typography.scss";

:deep(.ironlake-table-cell) {
  padding: .5rem .5rem;
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

.invalid-reason {
  font-size: 1rem;
  font-weight: 400;
  word-break: normal;
}
</style>
