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
      <el-table-column prop="equipment" label="Equipment Number" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'equipment')" />
      <el-table-column prop="objectType" label="Object Type" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'objectType')" />
      <el-table-column prop="plannerGroup" label="Planner Group" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'plannerGroup')" />
      <el-table-column prop="maintenanceWorkCenter" label="Maintenance Work Center" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'maintenanceWorkCenter')" />
      <el-table-column prop="costCenter" label="Cost Center" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'costCenter')" />
      <el-table-column prop="wbsElement" label="WBS Element" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'wbsElement')" />
      <el-table-column prop="level" label="Level" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'level')" />
      <el-table-column prop="equipmentType" label="Equipment Type" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'equipmentType')" />
      <el-table-column prop="equipmentGroup" label="Equipment Group" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'equipmentGroup')" />
      <el-table-column prop="equipmentModel" label="Equipment Model" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'equipmentModel')" />
      <el-table-column prop="equipmentStatus" label="Equipment Status" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'equipmentStatus')" />
      <el-table-column prop="site" label="Site" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'site')" />
      <el-table-column prop="planningPlant" label="Planning Plant" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'planningPlant')" />
      <el-table-column prop="maintenancePlant" label="Maintenance Plant" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'maintenancePlant')" />
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
      <el-table-column prop="changedBy" label="Changed by" sortable width="300" :sort-method="(a, b) => customSort(a, b, 'changedBy')" />
      <el-table-column label="" width="80">
        <template #default="scope">
          <div class="row justify-content-center">
            <el-tooltip class="box-item" effect="dark" content="Edit" placement="top">
              <button class="btn btn-sm btn-icon btn-bg-light me-1" @click="handleEditRow(scope.row)">
                <inline-svg src="/media/svg/tables/rows/pencil-edit-blue.svg" width="12" height="12" />
              </button>
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
  formatDateAU,
  formatDateOnlyAU
} from "@/core/helpers/date-format";
import {
  useEquipmentAssignmentListStore
} from "@/store/pinia/iron-lake/equipment/equipment-assignment/useEquipmentAssignmentListStore";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/equipment-assignment/ListItem";
import {
  PropType,
  defineProps,
  defineEmits,
  ref
} from "vue";
import { computed } from "@vue/reactivity";
import {
  useEquipmentAssignmentFormStore
} from "@/store/pinia/iron-lake/equipment/equipment-assignment/useEquipmentAssignmentFormStore";
import { dynamicSortCaseInsensitive } from "@/core/helpers/table-sort";

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
const emits = defineEmits(["show-dialog"]);
const listStore = useEquipmentAssignmentListStore();
const formStore = useEquipmentAssignmentFormStore();
const startIndex = computed(() => {
  return ((props.page - 1) * 10) + 1
});
const columnOrder = ref("");
const handleSort = (sort) => {
  columnOrder.value = sort.order
  const payload = {
    prop: sort.prop,
    order: sort.order,
  };
  listStore.setSort(payload);
}
const customSort = (objA, objB, field) => {
  return dynamicSortCaseInsensitive(objA[field], objB[field], columnOrder.value);
}
const handleEditRow = (item: ListItem) => {
  formStore.setFormData(item);
  emits("show-dialog", null);
}
</script>
