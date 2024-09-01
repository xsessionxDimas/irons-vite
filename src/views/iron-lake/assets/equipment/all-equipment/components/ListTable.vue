<template>
  <template v-if="listStore.loading">
    <div v-loading="listStore.loading" style="height: 100px"></div>
  </template>
  <template v-else>
    <el-table
      ref="eqpTableList"
      v-loading="listStore.loading"
      :data="filterTableData"
      :default-sort="{ prop: 'dateService', order: 'ascending' }"
      :empty-text="'No Data'"
      style="width: 100%"
      header-cell-class-name="ironlake-table-cell-header"
      cell-class-name="ironlake-table-cell"
      @sortChange="handleSortChange"
      :row-key="setRowKeys"
      :expand-row-keys="expandRowKeys"
      @expandChange="handleExpandChange"
    >
      <el-table-column
        prop="siteName"
        label="Site"
        width="178"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => sortCaseInsensitive(a, b, 'siteName')"
      >
        <template #default="scope">
          <div class="d-flex" style="line-height: 1.25; align-items: center">
            <p class="m-0" style="line-height: 1.25rem">
              {{ scope.row.siteName }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template #default="props">
          <div style="width: 30%">
            <el-table
              v-loading="listStore.stateCompListLoading"
              :data="props.row.component"
              :border="true"
              header-cell-class-name="ironlake-table-cell-header"
              cell-class-name="ironlake-table-cell"
              :max-height="400"
              style="width: 100%"
            >
              <el-table-column
                :width="240"
                label="Component Code"
                prop="componentCode"
              />
              <el-table-column label="Component Name" prop="componentName" />
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="equipmentNo"
        label="Equipment No"
        width="178"
        sortable
        :sort-method="sortEquipment"
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
        prop="equipmentGroup"
        label="Group"
        width="178"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => sortCaseInsensitive(a, b, 'equipmentGroup')"
      />
      <el-table-column
        prop="equipmentBrand"
        label="Brand"
        width="178"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => sortCaseInsensitive(a, b, 'equipmentBrand')"
      />
      <el-table-column
        prop="equipmentModel"
        label="Model"
        width="178"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => sortCaseInsensitive(a, b, 'equipmentModel')"
      />
      <el-table-column
        prop="ownership"
        label="Ownership"
        width="178"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="sortOwnership"
      />
      <el-table-column
        prop="engineHourMeter"
        label="Engine Hour Meter/ Service Meter (SMU)"
        width="178"
        :align="'center'"
        sortable
        :sort-orders="['ascending', 'descending']"
      >
        <template #default="scope">
          <div v-if="scope.row.engineHourMeter">
            {{ scope.row.engineHourMeter }}
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="isActive"
        label="Status"
        width="90"
        sortable
        :sort-orders="['ascending', 'descending']"
      >
        <template #default="scope">
          <template v-if="scope.row.isActive">
            <div class="d-flex justify-content-center">
              <div
                class="badge badge-circle badge-success mx-auto rounded-badge-success"
              >
                <inline-svg src="/media/svg/tables/rows/check-light.svg" />
              </div>
            </div>
          </template>
          <template v-else>
            <div class="d-flex justify-content-center">
              <div
                class="badge badge-circle badge-success mx-auto rounded-badge-error"
              >
                <inline-svg src="/media/svg/tables/rows/valid-false-light.svg" />
              </div>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="modifiedBy"
        label="Modified By"
        width="320"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="sortModifiedDate"
      >
        <template #default="scope">
          <span
            >{{ formatDateAU(scope.row.modifiedOn) }}, by
            {{ scope.row.modifiedBy }}</span
          >
        </template>
      </el-table-column>
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
        prop="resetDate"
        label="Hour Meter Offset Reset Date"
        width="320"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="sortResetDate"
      >
        <template #default="scope">
          <span v-if="scope.row.resetDate">
            {{ formatDateOnlyAU(scope.row.resetDate) }}, by
            {{ scope.row.ehmOffsetModifiedBy }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ehmOffsetModifiedOn"
        label="Last Offset Entry"
        width="320"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="sortOffsetEntryDate"
      >
        <template #default="scope">
          <span
            >{{ formatDateAU(scope.row.ehmOffsetModifiedOn) }}, by
            {{ scope.row.ehmOffsetModifiedBy }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="Action"
        header-align="center"
        fixed="right"
        width="80"
      >
        <template #default="scope">
          <div class="d-flex justify-content-center">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Edit"
              placement="top"
            >
              <span
                class="svg-icon svg-icon-btech-secondary-500"
                style="cursor: pointer"
                @click="handleEdit(scope)"
              >
                <inline-svg
                  src="/media/svg/tables/rows/mode-edit-round.svg"
                  style="width: 1.25rem; height: 1.25rem"
                />
              </span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </template>
</template>

<script lang="ts" setup>
/* import componenets here */
import { formatDateAU, formatDateOnlyAU } from "@/core/helpers/date-format";
import {
  useListStore
} from "@/store/pinia/iron-lake/equipment/all-equipment/useListStore";
import {
  useFormStore
} from "@/store/pinia/iron-lake/equipment/all-equipment/useFormStore";
import { computed, defineExpose, ref } from "vue";
import { dynamicSortCaseInsensitive } from "@/core/helpers/table-sort";
import { ElTable } from 'element-plus';

const emit = defineEmits(["show-form"]);
const listStore = useListStore();
const formStore = useFormStore();

// display data module
const filterTableData = computed(() => {
  return listStore.stateList;
});
const eqpTableList = ref<InstanceType<typeof ElTable>>();

// sorting module
const columnOrder = ref("");
const handleSortChange = (sortParam: { column; prop; order }) => {
  columnOrder.value = sortParam.order;
};
const sortCaseInsensitive = (objA, objB, field) => {
  return dynamicSortCaseInsensitive(
    objA[field],
    objB[field],
    columnOrder.value,
  );
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
const sortOwnership = (a, b) => {
  const ownershipA = a.ownership.toLowerCase();
  const ownershipB = b.ownership.toLowerCase();
  if (ownershipA === null) return 1;
  if (ownershipB === null) return -1;
  if (ownershipA === null && ownershipB === null) return 0;
  return ownershipA.localeCompare(ownershipB);
};
const sortResetDate = (a, b) => {
  if (a.resetDate === null) return 1;
  if (b.resetDate === null) return -1;

  const dateA = Date.parse(a.resetDate);
  const dateB = Date.parse(b.resetDate);
  return dateA - dateB;
};
const sortModifiedDate = (a, b) => {
  if (a.modifiedOn === null) return 1;
  if (b.modifiedOn === null) return -1;

  const dateA = Date.parse(a.modifiedOn);
  const dateB = Date.parse(b.modifiedOn);
  return dateA - dateB;
};
const sortOffsetEntryDate = (a, b) => {
  if (a.ehmOffsetModifiedOn === null) return 1;
  if (b.ehmOffsetModifiedOn === null) return -1;

  const dateA = Date.parse(a.ehmOffsetModifiedOn);
  const dateB = Date.parse(b.ehmOffsetModifiedOn);
  return dateA - dateB;
};

// expand module
const setRowKeys = (dataRow) => {
  return dataRow.equipmentNoId;
};
const expandRowKeys = ref<number[]>([]);
const handleExpandChange = (row, expandedVal) => {
  if (row.component === undefined || row.component.length === 0) {
    listStore.getComponentByEqp(row.equipmentNoId);
  }
  const expandId = row.equipmentNoId;
  const lastExpandId = expandRowKeys.value[0];
  expandRowKeys.value = expandId === lastExpandId ? [] : [expandId];
  return expandedVal;
};
const closeExpandedRow = () => {
  expandRowKeys.value = [];
  return expandRowKeys.value;
};
defineExpose({ closeExpandedRow });

// edit module
const handleEdit = async (data) => {
  formStore.stateIsNewForm = false;
  emit("show-form");

  listStore.getComponentByEqp(data.row.equipmentNoId).then(() => {
    const eqpComponents = data.row.component.map((element) => {
      return element;
    });
    formStore.stateComponentTable = eqpComponents;
  });
  const payload = {
    equipmentUnitId: data.row.equipmentNoId,
    equipmentUnit: data.row.equipmentNo,
    siteName: data.row.siteName,
    serialNo: data.row.serialNo,
    group: data.row.equipmentGroup,
    brandName: data.row.equipmentBrand,
    model: data.row.equipmentModel,
    ownership: data.row.ownership,
    engineHourMeter: data.row.engineHourMeter,
    engineHourMeterOffset: data.row.engineHourMeterOffset,
    resetDate: data.row.resetDate,
    isActive: data.row.isActive,
    isWarning: data.row.isWarning,
  };
  formStore.stateFormItem = [payload];
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

:deep(.el-table__fixed-right) {
  height: 100% !important;
  .el-table__fixed-body-wrapper {
    height: 100% !important;
  }
}

.rounded-badge-success {
  background-color: green;
}

.rounded-badge-error {
  background-color: red;
}
</style>
