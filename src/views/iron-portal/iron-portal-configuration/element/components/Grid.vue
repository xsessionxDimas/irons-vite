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
      <el-table-column prop="Element" label="Element" min-width="170" sortable :sort-method="(a, b) => customSort(a, b, 'Element')" />
      <el-table-column prop="ElementDescription" label="Element Description" min-width="170" sortable :sort-method="(a, b) => customSort(a, b, 'ElementDescription')" />
      <el-table-column prop="StartDate" label="Start Date" align="center" width="170" sortable>
        <template #default="scope">
          <span>{{ formatDateOnlyAU(scope.row.StartDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="EndDate" label="End Date" align="center" width="170" sortable>
        <template #default="scope">
          <span>{{ formatDateOnlyAU(scope.row.EndDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="IsActive" label="Is Active" width="100" sortable>
        <template #default="scope">
          <template v-if="scope.row.IsActive">
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
      <el-table-column prop="ChangedOn" label="Changed on" align="center" width="170" sortable>
        <template #default="scope">
          <span>{{ formatDateAU(scope.row.ChangedOn) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ChangedBy" label="Changed by" sortable width="300" :sort-method="(a, b) => customSort(a, b, 'ChangedBy')" />
      <el-table-column label="" width="80">
        <template #default="scope">
          <el-tooltip class="box-item" effect="dark" :content="scope.row.IsActive ? 'Edit' : 'Inactive data cannot be edited'" placement="top">
            <div class="row justify-content-center">
              <button :disabled="!scope.row.IsActive" class="btn btn-sm btn-icon btn-bg-light me-1" @click="handleEditRow(scope.row)">
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
  useElementListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/element/useElementListStore";
import {
  useElementFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/element/useElementFormStore";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/element/ListItem";
import {
  PropType,
  defineProps,
  defineEmits,
  computed,
  ref
} from "vue";
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
const listStore = useElementListStore();
const formStore = useElementFormStore();
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
const customSort = (objA, objB, field) => {
  return dynamicSortCaseInsensitive(objA[field], objB[field], columnOrder.value);
}
const handleEditRow = (item: ListItem) => {
  formStore.setFormData(item);
  emits("show-dialog", null);
}
</script>
