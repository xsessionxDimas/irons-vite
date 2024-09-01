<template>
  <el-dialog
    v-model="showGatewayDialog"
    modal-class="ironlake-dialog"
    :width="1100"
    :align-center="true"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <template #title>
      <p class="ironlake-dialog-title m-0">
        Need Attention
        <span class="text-btech-danger-500">
          ({{ bulkStore.stateGatewayData.length }})
        </span>
      </p>
    </template>
    <template #default>
      <el-table
        :data="bulkStore.stateGatewayData"
        header-cell-class-name="ironlake-table-cell-header"
        cell-class-name="ironlake-table-cell"
        :max-height="500"
        style="width: 100%"
      >
        <el-table-column
          prop="unitNumber"
          label="Equipment No."
          sortable
          :sort-orders="['ascending', 'descending']"
        >
          <template #default="scope">
            <div class="d-flex" style="line-height: 1.25; align-items: center">
              <el-tooltip
                class="box-item"
                effect="dark"
                placement="top"
                :content="setTooltipContent(scope.row)"
              >
                <span
                  class="svg-icon me-1 svg-icon-btech-danger-500"
                  style="cursor: pointer"
                  @click="showDialogInvalid(scope.row)"
                >
                  <inline-svg
                    :src="setIcon(scope.row)"
                    style="width: 1.25rem; height: 1.25rem"
                  />
                </span>
              </el-tooltip>
              <p class="m-0" style="line-height: 1.25rem">
                {{ scope.row.unitNumber }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="smuDue"
          label="SMU Due (Hours)"
          sortable
          :sort-orders="['ascending', 'descending']"
          :width="150"
        />
        <el-table-column
          prop="workOrder"
          label="Work Order"
          sortable
          :sort-orders="['ascending', 'descending']"
          :width="120"
        />
        <el-table-column
          prop="psType"
          label="Service Size"
          sortable
          :sort-orders="['ascending', 'descending']"
          :width="120"
        />
        <el-table-column
          prop="dateService"
          label="Planned Service Date"
          sortable
          :sort-orders="['ascending', 'descending']"
          :width="180"
        >
          <template #default="scope">
            <span>{{ formatDateOnlyAU(scope.row.dateService) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="shift"
          label="Shift"
          sortable
          :sort-orders="['ascending', 'descending']"
          :width="90"
        />
        <el-table-column
          prop="startDate"
          label="Start Date"
          sortable
          :sort-orders="['ascending', 'descending']"
          :width="120"
        >
          <template #default="scope">
            <span>{{ scope.row.startDate ? formatDateOnlyAU(scope.row.startDate) : "" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="endDate"
          label="End Date"
          sortable
          :sort-orders="['ascending', 'descending']"
          :width="120"
        >
          <template #default="scope">
            <span>{{ scope.row.endDate ? formatDateOnlyAU(scope.row.endDate) : "" }}</span>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary"
          @click="handleCancelGate"
        >
          Cancel
        </el-button>
        <el-button class="btn btn-btech-secondary" @click="handleUploadGate">
          Upload
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogInvalidField"
    :title="invalidTitle"
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
import { ref } from "vue";
// Stores
import {
  useDailyScheduleListStore
} from "@/store/pinia/iron-lake/task/daily-schedule/useDailyScheduleListStore";
import {
  useDailyScheduleFormStore
} from "@/store/pinia/iron-lake/task/daily-schedule/useDailyScheduleFormStore";
import {
  useDailyScheduleBulkStore
} from "@/store/pinia/iron-lake/task/daily-schedule/useDailyScheduleBulkStore";
// Helpers
import { formatDateOnlyAU } from "@/core/helpers/date-format";

const listStore = useDailyScheduleListStore();
const formStore = useDailyScheduleFormStore();
const bulkStore = useDailyScheduleBulkStore();

// list display module
const setTooltipContent = (dataRow) => {
  return !dataRow.isValid && !dataRow.isWarning
    ? "Click to see error"
    : "Click to see warning";
};
const setIcon = (dataRow) => {
  return !dataRow.isValid && !dataRow.isWarning
    ? "/media/icons/bumaau/info.svg"
    : "/media/icons/bumaau/circle_close.svg";
};
// Invalid dialog module
const dialogInvalidField = ref(false);
const invalidTitle = ref("");
const invalidList = ref<string[]>([]);
const setInvalidMsg = (type: string, eqpUnit: string) => {
  return eqpUnit ? `${type} for Equipment No. ${eqpUnit}` : `${type}`;
};
const showDialogInvalid = (dataRow) => {
  if (dataRow.isWarning) {
    invalidTitle.value = setInvalidMsg("Warning", dataRow.equipmentUnit);
  } else {
    invalidTitle.value = setInvalidMsg("Error", dataRow.equipmentUnit);
  }
  invalidList.value = dataRow.validationReason
    .split(",")
    .map((element: string) => {
      return element;
    });
  dialogInvalidField.value = true;
};

// Gateway dialog module
const showGatewayDialog = ref(false);
defineExpose({
  showGatewayDialog,
});
const handleCancelGate = () => {
  showGatewayDialog.value = false;
};
const handleUploadGate = () => {
  bulkStore.insertGateway().then(async () => {
    formStore.getLookupSite();
    formStore.getEquipmentNumberLookup();
    formStore.getStatusLookup();
    formStore.getShiftLookup();
    listStore.resetFilter();
    await listStore.setPage(1);
  });
  showGatewayDialog.value = false;
};
</script>

<style lang="scss">
.ironlake-dialog {
  &.el-overlay {
    .el-dialog {
      .el-dialog__header {
        padding: 1.5rem 1.5rem 2rem;
        border: none;
        .el-dialog__title {
          font-size: 1.125rem;
        }
        .el-dialog__headerbtn {
          background-color: transparent;
          padding: 0;
          border: none;
          .el-dialog__close {
            font-size: 1.5rem;
          }
        }
      }
      .el-dialog__body {
        padding: 0 1.5rem;
      }
      .el-dialog__footer {
        padding: 2rem 1.5rem 1.5rem;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import "@/assets/sass/core/components/mixins/_typography.scss";

.ironlake-dialog-title {
  @include heading-h6();
  font-weight: 700;
}
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

:deep(.el-table__fixed-right) {
  height: 100% !important;
  .el-table__fixed-body-wrapper {
    height: 100% !important;
  }
}
</style>
