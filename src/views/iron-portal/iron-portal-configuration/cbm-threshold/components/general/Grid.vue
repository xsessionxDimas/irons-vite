<template>
  <template v-if="listStore.loading">
    <div v-loading="listStore.loading" style="height: 100px"></div>
  </template>
  <template v-else>
    <el-table v-loading="listStore.loading"
      :data="props.listData"
      style="width: 100%"
      @sort-change="handleSort"
      :empty-text="'No Data'"
      @expand-change="loadExpandRow"
      row-key="cbmThresholdId"
    >
      <el-table-column type="expand">
        <template #default="props">
          <div v-if="props.row.thresholdList">
            <el-table :data="props.row.thresholdList" :border="true" style="width: 40%">
              <el-table-column label="Rating" prop="rating" />
              <el-table-column label="Operator Min" prop="operatorMin" />
              <el-table-column label="Value Min" prop="valueMin" />
              <el-table-column label="Operator Max" prop="operatorMax" />
              <el-table-column label="Value Max" prop="valueMax" />
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="No" width="70" align="center">
        <template #default="scope">
          <span>{{ startIndex + scope.$index }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cbmType" label="CBM Type" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <span>{{ row.cbmType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="equipmentModel" label="Equipment Model" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <span>{{ row.equipmentModel }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="component" label="Component" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <span>{{ row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="parameterFrom" label="Parameter From" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          {{ row.parameterFrom }}
        </template>
      </el-table-column>
      <el-table-column prop="parameterTo" label="Parameter To" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          {{ row.parameterTo }}
        </template>
      </el-table-column>
      <el-table-column prop="uomFrom" label="Uom From" min-width="130" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          {{ row.uomFrom }}
        </template>
      </el-table-column>
      <el-table-column prop="uomTo" label="Uom To" min-width="130" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          {{ row.uomTo }}
        </template>
      </el-table-column>
      <el-table-column prop="uomConvertRatio" label="Uom Convert Ratio" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          {{ row.uomConvertRatio }}
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="Is Active" width="100" sortable align="center">
        <template #default="scope">
          <div class="row justify-content-center">
            <inline-svg v-if="scope.row.isActive" src="/media/svg/tables/rows/check.svg" />
            <inline-svg v-else src="/media/svg/tables/rows/minus.svg" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="" width="80">
        <template #default="scope">
          <div class="d-flex justify-content-end">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="scope.row.isActive ? 'Edit' : 'Inactive data cannot be edited'"
              placement="top"
            >
              <div>
                <button
                  :disabled="!scope.row.isActive"
                  class="btn btn-sm btn-icon btn-bg-light me-3"
                  @click="handleEditRow(scope.row)">
                  <inline-svg src="/media/svg/tables/rows/pencil-edit-blue.svg" width="12" height="12" />
                </button>
              </div>
            </el-tooltip>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Add new data based on table rows"
              placement="top"
            >
              <div>
                <button class="btn btn-sm btn-icon btn-bg-light" @click="handleDuplicateRow(scope.row)">
                  <inline-svg src="/media/svg/tables/rows/paste-icon-button-blue.svg" width="12" height="12" />
                </button>
              </div>
            </el-tooltip>
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
  useCbmThresholdListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-threshold/useCbmThresholdListStore";
import {
  useCbmThresholdFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-threshold/useCbmThresholdFormStore";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-threshold/ListItem";
import {
  UpsertItem,
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-threshold/UpsertItem";
import {
  PropType,
  defineProps,
  defineEmits,
  computed,
  ref,
} from "vue";
import {
  defaultSorting
} from "@/core/helpers/table-sort";

import {
  normalizeDate
} from "@/core/helpers/date-format";


const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<ListItem[]>,
  },
  page: {
    required: true,
    type: Number,
    default: 1
  }
});

const listStore = useCbmThresholdListStore();
const formStore = useCbmThresholdFormStore();
const emits = defineEmits(["fetch-data", "duplicateData", "handle-edit"]);
const startIndex = computed(() => {
  return ((props.page - 1) * 10) + 1
})
const columnOrder = ref("");
const handleSort = (sort) => {
  columnOrder.value = sort.order
  const payload = {
    prop: sort.prop,
    order: sort.order,
  };
  listStore.setSort(payload);
}

const loadExpandRow = (item, selectedExpandArray) => {
  if (selectedExpandArray.length == 0) return

  listStore.getCbmThresholdList(item.cbmThresholdId)
}

const handleEditRow = async (item: ListItem) => {
  if (item.isRequiredThreshold && !item.thresholdList) {
    await listStore.getCbmThresholdList(item.cbmThresholdId)
  }

  const editedItem: UpsertItem = assignEditItem(item)
  formStore.setFormData(editedItem);
  emits("handle-edit")
}

const assignEditItem = (item: ListItem): UpsertItem => {
  return {
    cbmThresholdId: item.cbmThresholdId,
    equipmentModel: item.equipmentModel,
    component: item.component,
    cbmType: item.cbmType,
    registerNumber: item.registerNumber,
    parameterFrom: item.parameterFrom,
    parameterTo: item.parameterTo,
    severityLevel: item.severityLevel,
    uomFrom: item.uomFrom,
    uomTo: item.uomTo,
    uomConvertRatio: item.uomConvertRatio,
    startDate: normalizeDate(new Date(item.startDate)),
    endDate: normalizeDate(new Date(item.endDate)),
    isRequiredThreshold: item.isRequiredThreshold || false,
    thresholdList: item.thresholdList ? [...item.thresholdList] : [],
  }
}

const handleDuplicateRow = async (dataRow: ListItem) => {
  if (dataRow.isRequiredThreshold && !dataRow.thresholdList) {
    await listStore.getCbmThresholdList(dataRow.cbmThresholdId)
  }

  const newItem: UpsertItem = assignEditItem(dataRow)

  formStore.setFormData(newItem);
  emits("duplicateData", true);
}
</script>
