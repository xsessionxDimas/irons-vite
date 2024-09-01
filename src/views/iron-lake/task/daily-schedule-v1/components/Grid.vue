<template>
    <template v-if="listStore.loading">
        <div v-loading="listStore.loading" style="height: 100px"></div>
    </template>
    <template v-else>
      <el-table v-loading="listStore.loading"
      :data="props.listData"
      style="width: 100%"
      @sort-change="handleSort"
      :default-sort="{ prop: 'dateService', order: 'ascending' }"
      :empty-text="'No Data'">
          <el-table-column label="No" width="90" align="center">
              <template #default="scope">
                  <span>{{ startIndex + scope.$index }}</span>
              </template>
          </el-table-column>
          <el-table-column prop="unitNumber" label="Unit Number" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'unitNumber')" />
          <el-table-column prop="smuDue" label="SMU Due (Hours) " width="170" sortable :sort-method="(a, b) => defaultSort(a, b, 'smuDue')" />
          <el-table-column prop="workOrder" label="Work Order" width="170" sortable :sort-method="(a, b) => defaultSort(a, b, 'workOrder')" />
          <el-table-column prop="psType" label="Service Size" width="170" sortable :sort-method="() => defaultSort()" />
          <el-table-column prop="dateService" label="Planned Service Date" align="center" width="180" sortable>
              <template #default="scope">
                  <span>{{ formatDateOnlyAU(scope.row.dateService) }}</span>
              </template>
          </el-table-column>
          <el-table-column prop="shift" label="Shift" width="170" sortable :sort-method="(a, b) => customSort(a, b, 'shift')" />
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
          <el-table-column prop="changedBy" label="Changed by" sortable width="170" :sort-method="(a, b) => customSort(a, b, 'changedBy')" />
          <el-table-column label="" width="80">
                <template #default="scope">
                    <div class="row justify-content-center">
                      <el-tooltip class="box-item" effect="dark" content="Edit" placement="top">
                          <button class="btn btn-sm btn-icon btn-bg-light me-1" :disabled="disableButtonCond(scope.row)"  @click="handleEditRow(scope.row)">
                              <inline-svg src="/media/svg/tables/rows/pencil-edit-blue.svg" width="12" height="12" />
                          </button>
                      </el-tooltip>
                      <el-tooltip class="box-item" effect="dark" content="Delete" placement="top">
                          <button class="btn btn-sm btn-icon btn-bg-light me-1" :disabled="disableButtonCond(scope.row)" @click="handleDeleteRow(scope.row)">
                              <inline-svg src="/media/svg/tables/rows/trash-delete-blue.svg"  width="12" height="12" />
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
  useDailyScheduleListStore
} from "@/store/pinia/iron-lake/task/daily-schedule-v1/useDailyScheduleListStore";
import {
  ListItem
} from "@/core/types/entities/iron-lake/task/daily-schedule-v1/ListItem";
import {
  PropType,
  defineProps,
  computed,
  ref,
  defineEmits
} from "vue";
import {
  dynamicSortCaseInsensitive,
  defaultSorting
} from "@/core/helpers/table-sort";
import {
  useDailyScheduleFormStore
} from "@/store/pinia/iron-lake/task/daily-schedule-v1/useDailyScheduleFormStore";
import {
  swalAlertConfirmation,
  swalAlertSuccess
} from "@/core/helpers/sweet-alert";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { ElLoading } from "element-plus"

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
const listStore = useDailyScheduleListStore();
const formStore = useDailyScheduleFormStore();
const authStore = useAuthenticationStore();
const emits = defineEmits(["show-dialog", "reload"]);

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
const defaultSort = () => {
  return defaultSorting(columnOrder.value);
}
const customSort = (objA, objB, field) => {
  return dynamicSortCaseInsensitive(objA[field], objB[field], columnOrder.value);
}

const handleEditRow = (item: ListItem) => {
  formStore.setFormData(item);
  emits("show-dialog", null);
}

const disableButtonCond = (item: ListItem) => {
  let status = false
  if (item.status != "Open") {
    status = true
  }
  return status
}

const handleDeleteRow = (item: ListItem) => {
  swalAlertConfirmation("Are you sure want to delete this data", "Ok")
    .then(async () => {
      const loading = ElLoading.service({
        lock: true,
        text: 'Deleting data',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      // console.log("handleDelete", item);
      formStore.deleteData(item, authStore.user.Name).then(() => {
        if (!formStore.isError) {
          swalAlertSuccess("Data has been successfully deleted!", "Ok")
            .then(() => {
              loading.close()
              emits("reload");
            });
        }
      })
    });
}
</script>
