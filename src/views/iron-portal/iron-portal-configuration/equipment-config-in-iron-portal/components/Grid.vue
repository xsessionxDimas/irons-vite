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
      <el-table-column prop="site" label="Site" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)" />
      <el-table-column prop="equipmentModel" label="Equipment Model" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)" />
      <el-table-column prop="objectType" label="Object Type" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)" />
      <el-table-column prop="codeGroup" label="Code Group" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)" />
      <el-table-column prop="damageCategory" label="Damage Category" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)" />
      <el-table-column prop="damage" label="Damage" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)" />
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
      <el-table-column label="" width="80">
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
  useEquipmentConfigInIronPortalListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/equipment-config-in-iron-portal/useEquipmentConfigInIronPortalListStore";
import {
  useEquipmentConfigInIronPortalFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/equipment-config-in-iron-portal/useEquipmentConfigInIronPortalFormStore";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/equipment-config-in-iron-portal/ListItem";
import {
  PropType,
  defineProps,
  defineEmits,
  computed,
  ref
} from "vue";
import { defaultSorting } from "@/core/helpers/table-sort";

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
const listStore = useEquipmentConfigInIronPortalListStore();
const formStore = useEquipmentConfigInIronPortalFormStore();
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
const handleEditRow = (item: ListItem) => {
  formStore.setFormData(item);
  emits("show-dialog", null);
}
</script>
