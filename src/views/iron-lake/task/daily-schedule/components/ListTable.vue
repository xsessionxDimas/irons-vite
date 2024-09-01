<template>
  <template v-if="listStore.loading">
    <div v-loading="listStore.loading" style="height: 100px"></div>
  </template>
  <template v-else>
    <el-table
      v-loading="listStore.loading"
      :data="filterTableData"
      :empty-text="'No Data'"
      style="width: 100%"
      header-cell-class-name="ironlake-table-cell-header"
      cell-class-name="ironlake-table-cell"
      @sortChange="handleSortChange"
    >
      <el-table-column
        prop="equipmentNo"
        label="Equipment No"
        width="174"
        sortable
        :sort-method="sortEquipment"
        :sort-orders="['ascending', 'descending']"
      >
        <template #default="scope">
          <div class="d-flex" style="line-height: 1.25; align-items: center">
            <el-tooltip
              v-if="checkStatusAction(scope.row)"
              class="box-item"
              effect="dark"
              placement="top"
              content="Planned Service Date has passed"
            >
              <span class="me-1">
                <inline-svg
                  src="/media/icons/bumaau/bookmark.svg"
                  style="width: 1.125rem; height: 1.125rem"
                />
              </span>
            </el-tooltip>
            <p class="m-0" style="line-height: 1.25rem">
              {{ scope.row.equipmentNo }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="smuDue"
        label="SMU Due (hours)"
        width="174"
        sortable
        :sort-orders="['ascending', 'descending']"
      />
      <el-table-column
        prop="workOrder"
        label="Work Order"
        width="174"
        sortable
        :sort-orders="['ascending', 'descending']"
      />
      <el-table-column
        prop="serviceSize"
        label="Service Size"
        width="174"
        sortable
        :sort-method="sortNumberInString"
        :sort-orders="['ascending', 'descending']"
      />
      <el-table-column
        prop="dateService"
        label="Planned Service Date"
        width="185"
        sortable
        :sort-orders="['ascending', 'descending']"
      >
        <template #default="scope">
          <span>{{ formatDateOnlyAU(scope.row.dateService) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="Status"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => sortCaseInsensitive(a, b, 'status')"
      >
        <template #default="scope">
          <span
            class="badge btech-badge"
            :class="checkStatusBadge(scope.row.status)"
          >
            {{ scope.row.status }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="Action"
        header-align="center"
        width="80"
      >
        <template #default="scope">
          <div v-if="scope.row.status === 'Yet To Start'">
            <div class="d-flex justify-content-center gap-6">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="Edit"
                placement="top"
              >
                <span
                  class="svg-icon svg-icon-btech-secondary-500 d-flex justify-content-end"
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
          </div>
        </template>
      </el-table-column>
    </el-table>
  </template>
</template>

<script lang="ts" setup>
/* import componenets here */
import {
  formatDateOnlyAU,
  simpleFormatDateShortAU,
} from "@/core/helpers/date-format";
import {
  useDailyScheduleListStore
} from "@/store/pinia/iron-lake/task/daily-schedule/useDailyScheduleListStore";
import {
  useDailyScheduleFormStore
} from "@/store/pinia/iron-lake/task/daily-schedule/useDailyScheduleFormStore";
import { computed, ref } from "vue";
import { swalAlertConfirmation } from "@/core/helpers/sweet-alert";
import { dynamicSortCaseInsensitive } from "@/core/helpers/table-sort";

const props = defineProps({
  search: {
    required: true,
    type: String,
  },
});
const emit = defineEmits(["show-form"]);
const listStore = useDailyScheduleListStore();
const formStore = useDailyScheduleFormStore();

// display data module
const filterTableField = (fieldData: string, searchValue: string) => {
  return fieldData.toLowerCase().includes(searchValue.toLowerCase());
};
const filterTableData = computed(() => {
  listStore.stateList.forEach((element) => {
    element.status = element.status === null ? "null" : element.status;
  });
  return listStore.stateList.filter((data) => {
    const searchEquipment = filterTableField(data.equipmentNo, props.search);
    const searchServiceSize = filterTableField(data.serviceSize, props.search);
    const searchWorkOrder = filterTableField(
      data.workOrder.toString(),
      props.search,
    );
    const searchDateService = filterTableField(data.dateService, props.search);
    const searchSmuDue = filterTableField(data.smuDue.toString(), props.search);
    return (
      !props.search ||
      searchEquipment ||
      searchServiceSize ||
      searchWorkOrder ||
      searchSmuDue ||
      searchDateService
    );
  });
});
const checkStatusBadge = (status: string) => {
  if (status === "Yet To Start") {
    return "badge-light-dark";
  } else if (status === "In Progress") {
    return "badge-light-btech-secondary";
  } else if (status === "Under Review") {
    return "badge-light-btech-info text-btech-info-500";
  } else if (status === "Final Review") {
    return "badge-light-btech-success text-btech-success-500";
  } else if (status === "Closed") {
    return "badge-light-btech-primary";
  }
};

// check flag action module
const checkStatusAction = (data) => {
  const today = new Date();
  const dataDateService = new Date(data.dateService);

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const comparisonYear = dataDateService.getFullYear();
  const comparisonMonth = dataDateService.getMonth();
  const comparisonDay = dataDateService.getDate();

  const isSameDate =
    currentYear === comparisonYear &&
    currentMonth === comparisonMonth &&
    currentDay === comparisonDay;

  const isFuture = dataDateService > today;

  return (
    data.status !== null &&
    data.status === "Yet To Start" &&
    !isSameDate &&
    data.status === "Yet To Start" &&
    !isFuture
  );
};

// sorting module
const columnOrder = ref("");
const handleSortChange = (sortParam: { column; prop; order }) => {
  columnOrder.value = sortParam.order;
};
const sortCaseInsensitive = (objA, objB, field) => {
  return dynamicSortCaseInsensitive(objA[field], objB[field], columnOrder.value);
};
const sortNumberInString = (a, b) => {
  const numA = parseInt(a.serviceSize);
  const numB = parseInt(b.serviceSize);
  return numA - numB;
};
const sortEquipment = (a, b) => {
  const equipmentA = a.equipmentNo.toLowerCase();
  const equipmentB = b.equipmentNo.toLowerCase();

  const alphaA = equipmentA.match(/[A-Za-z]+/)[0];
  const alphaB = equipmentB.match(/[A-Za-z]+/)[0];

  if (alphaA !== alphaB) {
    return alphaA.localeCompare(alphaB);
  }

  const numericA = parseInt(equipmentA.match(/\d+/)[0]);
  const numericB = parseInt(equipmentB.match(/\d+/)[0]);

  return numericA - numericB;
};

// upsert module
const generatePayload = (dataRow) => {
  return {
    dailyScheduleId: dataRow.dailyOutstandingServiceId,
    unitNumber: dataRow.equipmentNo,
    smuDue: dataRow.smuDue.toString(),
    workOrder: dataRow.workOrder.toString(),
    psType: dataRow.serviceSize,
    dateService: dataRow.dateService,
    shift: dataRow.shift,
    startDate: dataRow.startDate,
    endDate: dataRow.endDate,
    isActive: dataRow.isActive,
  };
};
const handleEdit = (data) => {
  const payload = generatePayload(data.row);
  formStore.stateIsNewForm = false;
  formStore.stateFormItem = [payload];
  formStore.lookupServiceSize(payload.unitNumber);

  emit("show-form");
};
const handleDelete = (data) => {
  data.row.isActive = false;
  data.row.dateService = simpleFormatDateShortAU(data.row.dateService);
  data.row.startDate = simpleFormatDateShortAU(data.row.startDate);
  data.row.endDate = simpleFormatDateShortAU(data.row.endDate);
  const payload = generatePayload(data.row);
  formStore.stateIsDeleteList = true;
  formStore.stateFormItem = [payload];
  swalAlertConfirmation("Remove this record from List?", "Remove").then(
    (res) => {
      if (res.isConfirmed) {
        formStore.insertData().then((response) => {
          if (!response?.data.result.isError) {
            formStore.resetFormItem();
            listStore.setPage(1);
            formStore.stateIsDeleteList = false;
          }
        });
      }
    },
  );
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
</style>
