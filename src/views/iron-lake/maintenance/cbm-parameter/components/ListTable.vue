<template>
  <template v-if="listStore.loading">
    <div v-loading="listStore.loading" style="height: 100px"></div>
  </template>
  <template v-else>
    <el-table
    v-loading="listStore.loading"
    :data="props.listData"
    style="width: 100%"
    :empty-text="'No Data'"
    header-cell-class-name="ironlake-table-cell-header"
    cell-class-name="ironlake-table-cell"
    @sortChange="handleSortChange"
  >
    <el-table-column
      type="expand"
      min-width="50"
    >
      <template #default="props">
        <div>
            <el-table
              :data="props.row.cbmParameter"
              :border="true"
              header-cell-class-name="ironlake-table-cell-header"
              cell-class-name="ironlake-table-cell"
              :max-height="400"
              style="width: 30%"
            >
              <el-table-column label="Status" prop="status" />
              <el-table-column label="Min Value" prop="minValue" />
              <el-table-column label="Max Value" prop="maxValue" />
              <el-table-column label="UoM" prop="uom" />
            </el-table>
          </div>
      </template>
    </el-table-column>
    <el-table-column
      label="Description"
      prop="taskDescription"
      min-width="400"
      sortable
      :sort-orders="['ascending', 'descending']"
      :sort-method="(a, b) => sortNew(a.taskDescription, b.taskDescription)"/>
    <el-table-column label="Model" prop="equipmentModel" width="200" sortable :sort-orders="['ascending', 'descending']" :sort-method="(a, b) => sortNew(a.equipmentModel, b.equipmentModel)"/>
    <el-table-column label="Service Size" prop="serviceSize" width="200" sortable :sort-orders="['ascending', 'descending']" :sort-method="sortServiceSize"/>
    <el-table-column label="Rating" prop="rating" width="200" sortable :sort-orders="['ascending', 'descending']"
      :sort-method="(a, b) => sortNew(a.rating, b.rating)"/>
    <el-table-column label="Type Parameter" prop="typeParameter" width="200" sortable :sort-orders="['ascending', 'descending']"
      :sort-method="(a, b) => sortNew(a.typeParameter, b.typeParameter)"/>
    <el-table-column label="Component" prop="component" width="200" sortable :sort-orders="['ascending', 'descending']"
      :sort-method="(a, b) => sortNew(a.component, b.component)"/>
    <el-table-column label="CBM Group" prop="cbmGroup" width="200" sortable :sort-orders="['ascending', 'descending']"
      :sort-method="(a, b) => sortNew(a.cbmGroup, b.cbmGroup)"/>
    <el-table-column label="Modified By" prop="modifiedBy" width="200" sortable :sort-orders="['ascending', 'descending']"
      :sort-method="(a, b) => sortNew(a.modifiedBy, b.modifiedBy)"/>
    <el-table-column label="Action" min-width="80" align="center" fixed="right">
        <template #default="scope">
          <div class="row">
            <div class="d-flex justify-content-center">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="Edit"
                placement="top"
              >
                <span
                  @click="handleEditRow(scope.row)"
                  class="svg-icon svg-icon-btech-secondary-500 d-flex justify-content-end cursor-pointer"
                >
                  <inline-svg
                    src="/media/svg/tables/rows/mode-edit-round.svg"
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
import {
  defineProps,
  defineEmits,
  PropType,
  ref
} from "vue";
import {
  ListItem
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/ListItem";
import {
  useCbmParameterListStore
} from "@/store/pinia/iron-lake/maintenance/cbm-parameter/useCbmParameterListStore";
import { computed } from "@vue/reactivity";
import {
  useCbmParameterFormStore
} from "@/store/pinia/iron-lake/maintenance/cbm-parameter/useCbmParameterFormStore";
import { dynamicSortCaseInsensitive } from "@/core/helpers/table-sort";

// props
const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<ListItem[]>,
  },
});

// stores
const listStore = useCbmParameterListStore();
const formStore = useCbmParameterFormStore();

// emits
const emits = defineEmits(["show-errors", "delete-draft", "show-dialog"]);

// handler
const handleEditRow = (item: ListItem) => {
  formStore.resetFormData()
  const editRow = {
    taskKey: item.taskKey,
    equipmentModel: item.equipmentModel,
    serviceSize: item.serviceSize,
    component: item.component,
    typeParameter: item.typeParameter,
    cbmGroup: item.cbmGroup,
    rating: item.rating,
    taskDescription: item.taskDescription,
    isActive: item.isActive,
    taskNo: item.taskNo,
    taskNoDetail: item.taskNoDetail,
    modifiedBy: item.modifiedBy,
    modifiedOn: item.modifiedOn,
    cbmParameter: item.cbmParameter,
  }
  formStore.setFormCbmData(item.cbmParameter)
  formStore.setFormEditData(editRow)
  emits("show-dialog", null);
}

const columnOrder = ref("");
const handleSortChange = (sortParam: { column; prop; order }) => {
  columnOrder.value = sortParam.order;
};

const sortNew = (a, b) => {
  const valueA = a.toLocaleLowerCase();
  const valueB = b.toLocaleLowerCase();
  if (valueA === null) return 1;
  if (valueB === null) return -1;
  if (valueA === null && valueB === null) return 0;
  return valueA.localeCompare(valueB);
}

const sortServiceSize = (a, b) => {
  const numA = parseInt(a.serviceSize);
  const numB = parseInt(b.serviceSize);
  return numA - numB;
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/core/components/mixins/_typography.scss";

:deep(.el-table__fixed-right) {
  height: 100% !important;
  .el-table__fixed-body-wrapper {
    height: 100% !important;
  }
}

:deep(.ironlake-table-cell) {
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid #ddd;
  // border-bottom: none;
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
.text-name {
  font-size: 1rem;
  font-weight: 600;
}
.rounded-badge-success {
  background-color: green;
}
.rounded-badge-error {
  background-color: red;
}
.text-black i {
  color: rgb(55, 71, 79);
}
.text-sitename {
  white-space: nowrap;
  overflow-x: auto;
}
</style>
