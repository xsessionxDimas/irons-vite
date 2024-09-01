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
    >
      <el-table-column label="No" width="90" align="center">
        <template #default="scope">
          <span>{{ startIndex + scope.$index }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="component" label="Component" min-width="170" sortable :sort-method="() => customSort" />
      <el-table-column prop="componentDesc" label="Component Desc" min-width="170" sortable :sort-method="() => customSort" />
      <el-table-column prop="sensorData" label="Sensor Data" min-width="120" sortable :sort-method="() => customSort" />
      <el-table-column prop="oilDataS1" label="Oil Data S1" min-width="120" sortable :sort-method="() => customSort" />
      <el-table-column prop="oilDataS2" label="Oil Data S2" min-width="120" sortable :sort-method="() => customSort" />
      <el-table-column prop="filterCutS1" label="Filter Cut S1" min-width="120" sortable :sort-method="() => customSort" />
      <el-table-column prop="filterCutS2" label="Filter Cut S2" min-width="120" sortable :sort-method="() => customSort" />
      <el-table-column prop="magPlug" label="Mag Plug" min-width="120" sortable :sort-method="() => customSort" />
      <el-table-column prop="ironFormsCbm" label="Iron Forms" min-width="120" sortable :sort-method="() => customSort" />
      <el-table-column prop="componentStatus" label="Status" min-width="170" sortable :sort-method="() => customSort" />
      <el-table-column prop="startDate" label="Start Date" align="center" width="170" sortable>
        <template #default="scope">
          <span>{{ formatDateOnlyAU(scope.row.startDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endDate" label="End Date" align="center" width="170" sortable>
        <template #default="scope">
          <span>{{ formatDateOnlyAU(scope.row.endDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="Is Active" width="100" sortable>
        <template #default="scope">
          <template v-if="scope.row.isActive">
            <div class="row justify-content-center">
              <inline-svg src="/media/svg/tables/rows/check.svg" />
            </div>
          </template>
          <template v-else>
            <div class="row justify-content-center">
              <inline-svg src="/media/svg/tables/rows/minus.svg" />
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="changedOn" label="Changed on" align="center" width="170" sortable>
        <template #default="scope">
          <span>{{ formatDateAU(scope.row.changedOn) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="changedBy" label="Changed by" sortable width="300" />
      <el-table-column label="" width="40">
        <template #default="scope">
          <el-tooltip class="box-item" effect="dark" :content="scope.row.isActive ? 'Edit' : 'Inactive data cannot be edited'" placement="top">
            <div class="row justify-content-center">
              <button :disabled="!scope.row.isActive" class="btn btn-sm btn-icon btn-bg-light me-1" @click="handleEditRow(scope.row)">
                <inline-svg src="/media/svg/tables/rows/pencil-edit-blue.svg" width="12" height="12" />
              </button>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </template>
</template>

<script lang="ts" setup>
/* import componenets here */
import { ElTable, ElTableColumn } from "element-plus";
import { formatDateAU, formatDateOnlyAU } from "@/core/helpers/date-format";
import {
  useComponentStatusListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-status/useComponentStatusListStore";
import {
  useComponentStatusFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-status/useComponentStatusFormStore";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status/ListItem";
import {
  PropType,
  defineProps,
  defineEmits,
  computed,
  ref
} from "vue";
import { defaultSorting } from "@/core/helpers/table-sort";

/* refs */

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
const listStore = useComponentStatusListStore();
const formStore = useComponentStatusFormStore();
const emits = defineEmits(["show-dialog"]);
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
const customSort = () => {
  return defaultSorting(columnOrder.value);
}
const handleEditRow = (item: ListItem) => {
  formStore.setFormData(item);
  emits("show-dialog", null);
}
</script>
