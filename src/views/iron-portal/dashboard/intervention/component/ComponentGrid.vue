<template>
  <el-table
    ref="tableComponentListRef"
    :data="props.listData"
    :height="props.height"
    style="width: 100%"
    v-loading="props.isLoading"
    element-loading-background="#2d2b39b3"
    :empty-text="'No Data'"
    class="intervention-component_table table-grey"
    header-row-class-name="bg-grey-header"
    header-cell-class-name="bg-grey-header"
    row-class-name="table-row-grey no-uppercase"
    cell-class-name="text-black small-padding"
    @selection-change="handleSelectionChange"
    row-key="componentId"
    select-on-indeterminate
  >
    <el-table-column prop="componentDescription" label="Component" width="180" class="text-black"/>
    <el-table-column prop="componentHm" label="Component Life (hours)" align="center" label-class-name="no-uppercase" class="text-black"/>
    <el-table-column prop="oemInterval" label="BUMA AU Target (hours)" label-class-name="no-uppercase" align="center" class="text-black"/>
    <el-table-column prop="percentage" label="Component Life (percentage)" label-class-name="no-uppercase" align="center" class="text-black">
      <template #default="scope">
        {{ scope.row.percentage }} %
      </template>
    </el-table-column>
    <el-table-column
      type="selection"
      reserve-selection
      :selectable="() => { return !props.isCannotEdit}"
      :width="52"
      align="center"
      class="table-selection"
      class-name="table-selection"
    />
  </el-table>
</template>

<script lang="ts" setup>
import {
  ComponentItem
} from "@/core/types/entities/iron-portal/dashboard/intervention/ComponentItem";
import {
  PropType,
  defineProps,
  watch,
  ref
} from "vue";
import {
  useInterventionListStore
} from "@/store/pinia/iron-portal/dashboard/intervention/useInterventionListStore";

const listStore = useInterventionListStore();

const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<ComponentItem[]>,
  },
  reRender: {
    required: true,
    type: Boolean
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isCannotEdit: {
    type: Boolean,
    default: false
  },
  height: {
    type: String,
    default: "200"
  }
});

const tableComponentListRef = ref();

watch(() => {
  return props.reRender === true;
}, async () => {
  setSelection();
})

const handleSelectionChange = async (rows: ComponentItem[]) => {
  listStore.updateComponentAffected(rows);
}

const setSelection = async () => {
  if (listStore.componentList.length > 0) {
    const itemsChecked = listStore.componentList.filter((item) => {
      return item.isCheck == true
    })
    itemsChecked.forEach((row) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tableComponentListRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    tableComponentListRef.value!.clearSelection()
  }
}
</script>

<style lang="scss">
  .no-uppercase {
    text-transform: none !important;
  }

  .table-row-grey {
    background-color: #bec2d3 !important;
    opacity: 0.99 !important;
    border-radius: 0px !important;
    color: darkslategrey !important;
  }
  .bg-grey-header {
    background-color: #bec2d3 !important;
    opacity: 0.99 !important;
    border-radius: 0px !important;
    color: darkslategrey !important;
    border-bottom: 1px solid !important;
    border-bottom-color: #dbdeed !important;
  }

  .text-black{
    color: #000000 !important;
  }

  .small-padding{
    padding: 2px 0px !important;
  }

  .table-grey.el-table .el-table__body-wrapper tbody tr:hover td, .el-table .el-table__fixed-body-wrapper tbody tr:hover td {
    background-color: transparent !important;
    border: none;
  }

.intervention-component_table {
  margin-bottom: 22px;
  background-color: #bec2d3 !important;
  opacity: 0.99 !important;
  border-color: darkslategrey !important;

  .table-header th {
      padding: 5px 0px !important;
  }
  .table-row td {
    padding: 2px 0px !important;
    color: darkslategrey !important;
  }
  .el-table__empty-text {
    color: #000000 !important;
  }
  .el-table td div {
    color: #000000 !important;
  }
  &span::-webkit-scrollbar-thumb, ol::-webkit-scrollbar-thumb, ul::-webkit-scrollbar-thumb, pre::-webkit-scrollbar-thumb, div::-webkit-scrollbar-thumb {
    background-color: darkslategray;
  }
  &:hover {
    span::-webkit-scrollbar-thumb, ol::-webkit-scrollbar-thumb, ul::-webkit-scrollbar-thumb, pre::-webkit-scrollbar-thumb, div::-webkit-scrollbar-thumb {
      background-color: darkslategray;
      &:hover {
        background-color: darkslategray;
      }
    }
  }

  &span::-webkit-scrollbar, ol::-webkit-scrollbar, ul::-webkit-scrollbar, pre::-webkit-scrollbar, div::-webkit-scrollbar {
    width: 0.75rem;
  }
}
</style>
