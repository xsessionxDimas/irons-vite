<template>
  <section
    id="table-actions"
    class="mb-6 d-flex"
    :class="
      bulkStore.stateDraftData.length > 0
        ? 'justify-content-between'
        : 'justify-content-end'
    "
  >
    <section
      v-if="bulkStore.stateDraftData.length > 0"
      class="mb-3 d-flex justify-content-between"
    >
      <p class="m-0 card-table-title">Outstanding Service List</p>
    </section>
    <div class="align-self-center d-flex gap-2 ironlake-table-toolbar">
      <el-date-picker
        v-model="dateRangeFilter"
        class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary"
        type="daterange"
        unlink-panels
        range-separator="-"
        start-placeholder="Start date"
        end-placeholder="End date"
        format="DD/MM/YYYY"
        :clearable="false"
        :shortcuts="dateRangeShortcuts"
        @change="handleDateRange"
      />
      <el-popover
        placement="bottom-end"
        :visible="showFilterPopover"
        :width="360"
        @after-leave="handleHideFilterForm"
      >
        <template #reference>
          <el-button
            class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-md m-0"
            @click="showFilterPopover = !showFilterPopover"
          >
            <span
              class="svg-icon svg-icon-btech-secondary-500 d-inline-block mr-2"
            >
              <inline-svg
                src="/media/icons/bumaau/filter_list.svg"
                style="width: 1.25rem; height: 1.25rem"
              />
            </span>
            Filter
          </el-button>
        </template>
        <template #default>
          <div class="p-2 d-flex flex-column gap-8">
            <section>
              <p class="m-0 popover-title">Filters</p>
            </section>
            <section class="d-flex flex-column gap-6">
              <el-form
                :model="dataFilter"
                label-position="top"
                class="ironlake-form d-flex flex-column gap-6"
              >
                <el-form-item v-if="userDetail.isHO === 1" label="Site">
                  <el-select
                    v-model="dataFilter.siteId"
                    placeholder="Write site name"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in formStore.siteOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Equipment">
                  <el-select
                    v-model="dataFilter.equipmentNoId"
                    placeholder="Write your equipment unite"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in listStore.unitNumberOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <template #label>
                    <span>SMU Due (hours)</span>
                  </template>
                  <el-input
                    v-model="dataFilter.smuDue"
                    maxlength="10"
                    placeholder="Write SMU Due (hours)"
                    @input="smuDueNumberOnly()"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <template #label>
                    <span> Work Order </span>
                  </template>
                  <el-input
                    v-model="dataFilter.workOrder"
                    maxlength="10"
                    placeholder="Write your work order"
                    @input="workOrderNumberOnly()"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="Service Size">
                  <el-select
                    v-model="dataFilter.serviceSize"
                    placeholder="Choose service size"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in formStore.stateFilterServiceSizeOpt"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Status">
                  <el-select
                    v-model="dataFilter.statusId"
                    placeholder="Choose status"
                    clearable
                  >
                    <el-option
                      v-for="item in listStore.statusOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </section>
            <section class="d-flex justify-content-end gap-3">
              <button
                class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-md me-auto"
                @click="handleResetFilter"
              >
                Reset
              </button>
              <button
                class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-md"
                @click="showFilterPopover = false"
              >
                Close
              </button>
              <button
                class="btn btn-btech-secondary btech-md"
                @click="handleAppliedFilter"
              >
                Apply
              </button>
            </section>
          </div>
        </template>
      </el-popover>
      <el-button
        class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-md m-0"
        @click="handleExport"
      >
        <span class="svg-icon svg-icon-btech-secondary-500 d-inline-block mr-2">
          <inline-svg
            src="/media/icons/bumaau/download.svg"
            style="width: 1.25rem; height: 1.25rem"
          />
        </span>
        Export
      </el-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  useDailyScheduleListStore
} from "@/store/pinia/iron-lake/task/daily-schedule/useDailyScheduleListStore";
import {
  useDailyScheduleBulkStore
} from "@/store/pinia/iron-lake/task/daily-schedule/useDailyScheduleBulkStore";
import {
  useDailyScheduleFormStore
} from "@/store/pinia/iron-lake/task/daily-schedule/useDailyScheduleFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { saveAs } from "file-saver";
import {
  formatDateForPostData,
  getLastMonthFirstDayDateHelper,
  getcurrentMonthLastDayDateHelper
} from "@/core/helpers/date-format";
import { reqBody } from "@entities/iron-lake/task/daily-schedule/FilterData";

// stores
const listStore = useDailyScheduleListStore();
const formStore = useDailyScheduleFormStore();
const bulkStore = useDailyScheduleBulkStore();
const authStore = useAuthenticationStore();
const userDetail = computed(() => {
  return authStore.user;
})

// filter date module
const dateRangeFilter = ref<string[]>([]);
const pastToPresentByDay = (day: number) => {
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * day);
  const end = new Date();
  return [start, end];
};
const lastMonth = () => {
  const startDate = getLastMonthFirstDayDateHelper()
  const endDate = getcurrentMonthLastDayDateHelper(startDate);

  return [startDate, endDate];
};
const dateRangeShortcuts = [
  {
    text: "Yesterday",
    value: pastToPresentByDay(1),
  },
  {
    text: "Last week",
    value: pastToPresentByDay(7),
  },
  {
    text: "Last month",
    value: lastMonth(),
  },
];
const handleDateRange = () => {
  listStore.stateFilterForm.dateFrom = formatDateForPostData(
    dateRangeFilter.value[0],
  );
  listStore.stateFilterForm.dateTo = formatDateForPostData(
    dateRangeFilter.value[1],
  );
  listStore.setPage(1);
};

// filter form module
const showFilterPopover = ref<boolean>(false);
const dataFilter = ref<reqBody>({
  equipmentNoId: null,
  serviceSize: "",
  workOrder: undefined,
  smuDue: undefined,
  dateFrom: null,
  dateTo: null,
  statusId: null,
  siteId: userDetail.value.isHO === 1 ? "" : authStore.user.SiteId,
  page: 1,
  pageSize: 20,
});
defineExpose({
  dataFilter
});
const handleResetFilter = () => {
  dateRangeFilter.value = [];
  dataFilter.value = {
    equipmentNoId: null,
    serviceSize: "",
    workOrder: undefined,
    smuDue: undefined,
    dateFrom: null,
    dateTo: null,
    statusId: null,
    siteId: userDetail.value.isHO === 1 ? "" : authStore.user.SiteId,
    page: 1,
    pageSize: 20,
  };
};
const handleHideFilterForm = () => {
  const appliedFilter = listStore.stateFilterForm;
  dataFilter.value = {
    equipmentNoId: appliedFilter.equipmentNoId,
    serviceSize: appliedFilter.serviceSize,
    workOrder: appliedFilter.workOrder,
    smuDue: appliedFilter.smuDue,
    dateFrom: appliedFilter.dateFrom,
    dateTo: appliedFilter.dateTo,
    statusId: appliedFilter.statusId,
    siteId: appliedFilter.siteId,
    page: appliedFilter.page,
    pageSize: appliedFilter.pageSize,
  };
};
const handleAppliedFilter = () => {
  dataFilter.value.workOrder =
    dataFilter.value.workOrder === "" ? null : dataFilter.value.workOrder;
  dataFilter.value.smuDue =
    dataFilter.value.smuDue === "" ? null : dataFilter.value.smuDue;
  listStore.setAppliedFilter(dataFilter.value);
  showFilterPopover.value = false;
};
const smuDueNumberOnly = () => {
  if (typeof dataFilter.value.smuDue === "string") {
    dataFilter.value.smuDue = dataFilter.value.smuDue.replace(/\D/g, "");
    const isNumber = parseInt(dataFilter.value.smuDue);
    dataFilter.value.smuDue = isNaN(isNumber) ? null : isNumber;
  }
};
const workOrderNumberOnly = () => {
  if (typeof dataFilter.value.workOrder === "string") {
    dataFilter.value.workOrder = dataFilter.value.workOrder.replace(/\D/g, "");
    const isNumber = parseInt(dataFilter.value.workOrder);
    dataFilter.value.workOrder = isNaN(isNumber) ? null : isNumber;
  }
};

// download list module
const handleExport = async () => {
  const blob = (await listStore.export()) as Blob;
  saveAs(
    new Blob([blob], {
      type: "application/octet-stream",
    }),
    `Master Data Outstanding Service.xlsx`,
  );
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/core/components/mixins/_typography.scss";

.card-table-title {
  @include heading-h6();
  font-weight: 700;
}

.ironlake-table-toolbar {
  :deep(.el-range-editor) {
    &.el-input__inner {
      padding: 0.5rem 1rem;
      height: unset;
      width: 200px;
      min-height: 0;
      min-width: 200px;

      .el-input__icon {
        line-height: 1.25rem;
        margin: 0;
        color: #01a3ff;

        &.el-range__close-icon {
          display: none;
        }

        &.el-icon-date {
          margin-right: 0.5rem;
          padding: 0;
        }
      }

      &:hover {
        .el-range-input {
          background-color: #e6f6ff;
        }
      }

      .el-range-input {
        height: 1.25rem;
        width: 100%;
        color: #01a3ff;
        font-size: 0.875rem !important;
        line-height: 1.25rem;

        &:hover {
          background-color: #e6f6ff;
        }
      }

      .el-range-separator {
        padding: 0;
        color: #01a3ff;
        line-height: 1.25rem;
        height: auto;
      }
    }
  }
}

.ironlake-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  min-height: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.popover-title {
  @include paragraph-lg();
  font-weight: 700;
}

.ironlake-form {
  :deep(.el-form-item) {
    margin: 0;
    label {
      padding: 0;
      margin-bottom: 0.375rem;
      @include paragraph-sm();
      font-weight: 700;
    }
    .el-form-item__content {
      .el-input {
        .el-input__inner {
          border-radius: 8px;
          padding: 0.375rem 0.625rem;
          @include paragraph-sm();
        }
      }
      .el-select {
        width: 100%;
        .select-trigger {
          width: 100%;
        }
      }
    }
  }
}
</style>
