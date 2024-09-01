<template>
    <template v-if="listStore.loading">
        <div v-loading="listStore.loading" style="height: 100px"></div>
    </template>
    <template v-else>
      <el-table v-loading="listStore.loading"
      :data="props.listData"
      style="width: 100%"
      @sort-change="handleSort"
      :empty-text="'No Data'">
          <el-table-column label="No" width="90" align="center">
              <template #default="scope">
                  <span>{{ startIndex + scope.$index }}</span>
              </template>
          </el-table-column>
          <el-table-column prop="equipmentModel" label="Equipment Model" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'equipmentModel')" />
          <el-table-column prop="equipmentModelDescription" label="Equipment Model Desc." width="200" sortable :sort-method="(a, b) => customSort(a, b, 'equipmentModelDescription')"/>
          <el-table-column prop="brand" label="Brand" width="100" sortable :sort-method="(a, b) => customSort(a, b, 'brand')" />
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
          <el-table-column prop="changedOn" label="Changed on" align="center" width="150" sortable>
              <template #default="scope">
                  <span>{{ formatDateAU(scope.row.changedOn) }}</span>
              </template>
          </el-table-column>
          <el-table-column prop="changedBy" label="Changed by" sortable width="300" :sort-method="(a, b) => customSort(a, b, 'changedBy')"/>
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
import { formatDateAU, formatDateOnlyAU } from "@/core/helpers/date-format";
import {
  useEquipmentModelListStore
} from "@/store/pinia/iron-lake/equipment/equipment-model/useEquipmentModelListStore";
import {
  useEquipmentModelFormStore
} from "@/store/pinia/iron-lake/equipment/equipment-model/useEquipmentModelFormStore";
import {
  ListItem
} from "@/core/types/entities/iron-lake/equipment/equipment-model/ListItem";
import {
  PropType,
  defineProps,
  defineEmits,
  ref
} from "vue";
import { computed } from "@vue/reactivity";
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
const listStore = useEquipmentModelListStore();
const formStore = useEquipmentModelFormStore();
const emits = defineEmits(["show-dialog"]);
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
