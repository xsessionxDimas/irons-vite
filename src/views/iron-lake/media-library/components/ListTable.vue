<template>
  <template v-if="listStore.loading">
    <div v-loading="listStore.loading" style="height: 100px"></div>
  </template>
  <template v-else>
    <div class="mt-3 mb-3" v-if="bulkStore.isBulkDownload">
      <span>
        Choose bulk action:
      </span>
      <el-button
        class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-lg m-0"
        style="padding: 0.23rem 0.8rem;"
        @click="handleDownload"
      >
      <icon name="download" size="24" />
        Download
      </el-button>
    </div>
    <el-table
      ref="multipleTableRef"
      v-loading="listStore.loading"
      :data="filterTableData"
      :empty-text="'No Data'"
      :default-sort="defaultSortObject"
      style="width: 100%"
      header-cell-class-name="ironlake-table-cell-header"
      cell-class-name="ironlake-table-cell"
      @sortChange="handleSortChange"
      @select="checkSelected"
      @select-all="checkSelected"
    >
      <el-table-column
        prop="AttachmentId"
        label="Code & ID"
        width="350"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => customSort(a, b, 'AttachmentId')"
      >
      <template #default="scope">
        <div class="d-flex align-items-start gap-3">
          <img src="/media/icons/bumaau/iron-lake/File.png" style="
              width: 50px;
              height: 50px;
          " alt="file" />
          <div class="mt-2">
            <div>{{ scope.row.Code }}</div>
            <div style="
                color: #919EAB;
            ">{{ scope.row.AttachmentId }}</div>
          </div>
        </div>
      </template>
      </el-table-column>
      <el-table-column
        prop="Description"
        label="Description"
        width="400"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => customSort(a, b, 'Description')"
      />
      <el-table-column
        prop="FileType"
        label="Media Type"
        width="200"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => customSort(a, b, 'FileType')"
      >
        <template #default="scope">
          <span>{{ scope.row.FileType ? convertToMimeType(scope.row.FileType) : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="FileUrl"
        label="Path Directory"
        width="300"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => customSort(a, b, 'FileUrl')"
      >
        <template #default="scope">
          <span style="color: #34B3F1;">{{ scope.row.FileUrl ? scope.row.FileUrl.replaceAll('{BLOB_URL}/', '') : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="CreatedOn"
        label="Created Date"
        width="185"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => customSort(a, b, 'CreatedOn')"
      >
        <template #default="scope">
          <span>{{ formatDateAU(scope.row.CreatedOn) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="CreatedBy"
        label="Created By"
        width="300"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => customSort(a, b, 'CreatedBy')"
      />
      <el-table-column
        prop="ChangedOn"
        label="Updated Date"
        width="185"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => customSort(a, b, 'ChangedOn')"
      >
        <template #default="scope">
          <span>{{ formatDateAU(scope.row.ChangedOn) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ChangedBy"
        label="Updated By"
        width="300"
        sortable
        :sort-orders="['ascending', 'descending']"
        :sort-method="(a, b) => customSort(a, b, 'ChangedBy')"
      />
      <el-table-column
        v-if="!bulkStore.isBulkDownload"
        label="Action"
        header-align="center"
        fixed="right"
        width="80"
      >
        <template #default="scope">
          <div class="d-flex justify-content-center gap-6">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Edit"
              placement="top"
            >
              <span
                class="svg-icon svg-icon-btech-secondary-500 d-flex justify-content-end"
                style="cursor: pointer"
                @click="handleEdit(scope)"
              >
                <inline-svg
                  src="/media/svg/tables/rows/mode-edit-round.svg"
                  style="width: 1.25rem; height: 1.25rem"
                />
              </span>
            </el-tooltip>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="View"
              placement="top"
            >
              <span
                class="svg-icon svg-icon-btech-secondary-500 d-flex justify-content-end"
                style="cursor: pointer"
                @click="handleViewer(scope)"
              >
                <inline-svg
                  src="/media/svg/tables/rows/viewer.svg"
                  style="width: 1.25rem; height: 1.25rem"
                />
              </span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="bulkStore.isBulkDownload"
        type="selection"
        fixed="left"
        width="40"
        :align="'center'"
        :header-align="'center'"
      />
    </el-table>
  </template>
</template>

<script lang="ts" setup>
import {
  formatDateAU,
} from "@/core/helpers/date-format";
import {
  useMediaLibraryListStore
} from "@/store/pinia/iron-lake/media-library/useMediaLibraryListStore";
import {
  useMediaLibraryBulkStore
} from "@/store/pinia/iron-lake/media-library/useMediaLibraryBulkStore";
import {
  useMediaLibraryFormStore
} from "@/store/pinia/iron-lake/media-library/useMediaLibraryFormStore";
import {
  computed,
  ref,
  PropType,
  watch
} from "vue";
import {
  ListItem
} from "@/core/types/entities/iron-lake/media-library/ListItem";
import Icon from "@/components/ironlake/Icon.vue";
import {
  convertToMimeType,
  getType
} from "@/store/pinia/iron-lake/media-library/helper";
import _ from "lodash";
import { dynamicSortCaseInsensitive } from "@/core/helpers/table-sort";

const props = defineProps({
  search: {
    required: true,
    type: String,
  },
  currentSelection: {
    required: true,
    type: Object as PropType<ListItem[]>,
  }
});
const emit = defineEmits([
  "show-form",
  "show-viewer",
  "change-selection",
  "update-checklist-download"
]);
const listStore = useMediaLibraryListStore();
const formStore = useMediaLibraryFormStore();
const bulkStore = useMediaLibraryBulkStore();

const multipleTableRef = ref()
const defaultSortObject = ref({
  prop: "",
  order: ""
})

// display data module
const filterTableField = (fieldData: string, searchValue: string) => {
  const data = fieldData ?? ""
  return data.toLowerCase().includes(searchValue.toLowerCase());
};
const filterTableData = computed(() => {
  return listStore.stateList.filter((data) => {
    const searchCode = filterTableField(data.Code, props.search)
    const searchOriginalFileName = filterTableField(data.OriginalFileName, props.search)
    const searchFormattedFileName = filterTableField(data.FormattedFileName, props.search)
    const searchFileType = filterTableField(data.FileType, props.search)
    const searchFileUrl = filterTableField(data.FileUrl, props.search)
    const searchDescription = filterTableField(data.Description, props.search)
    return (
      !props.search ||
      searchCode ||
      searchOriginalFileName ||
      searchFormattedFileName ||
      searchFileType ||
      searchFileUrl ||
      searchDescription
    );
  });
});

const customSort = (objA, objB, field) => {
  return dynamicSortCaseInsensitive(objA[field], objB[field], defaultSortObject.value.order);
}

watch(() => {
  return filterTableData.value
}, () => {
  setTimeout(() => {
    if (multipleTableRef.value) {
      toggleSelection(props.currentSelection)
    }
  }, 100);
})

// sorting module
const handleSortChange = async (sortParam: { column; prop; order }) => {
  const payload = {
    prop: sortParam.prop,
    order: sortParam.order,
  };
  defaultSortObject.value = {
    prop: sortParam.prop,
    order: sortParam.order
  }
  await listStore.setSort(payload);
  emit('update-checklist-download');
};
// upsert module
const generatePayload = (dataRow) => {
  return {
    Code: dataRow.Code,
    Description: dataRow.Description,
    FileType: dataRow.FileType,
    AttachmentId: dataRow.AttachmentId,
    IsActive: dataRow.IsActive
  };
};
const handleEdit = (data) => {
  const payload = generatePayload(data.row);
  formStore.stateIsNewForm = false;
  formStore.stateFormItem = payload;

  emit("show-form");
};
const handleViewer = (data) => {
  emit("show-viewer", {
    dataList: data.row,
    type: getType(data.row.FileType)
  })
}
const resetSelectionRef = () => {
  multipleTableRef.value.clearSelection()
}
const handleDownload = async () => {
  await bulkStore.downloadAttachmentList()
  // reset selection
  resetSelectionRef()
}
const checkSelected = (selection: ListItem[]) => {
  bulkStore.setItemListBulkDownload(selection)
  emit('change-selection', selection)
}
const toggleSelection = (rows?: ListItem[]) => {
  if (rows) {
    const searchCriteria = rows?.map((val) => {
      return val.AttachmentId
    })
    const toogleRow = _.filter(listStore.stateList, (obj) => {
      return searchCriteria && searchCriteria.includes(obj.AttachmentId)
    });
    toogleRow.forEach((row) => {
      // multipleTableRef.value.toggleRowSelection(row, undefined)
      const exists = multipleTableRef.value.store.states.selection.value.some((list) => {
        return list.AttachmentId === row.AttachmentId
      });
      if (!exists) {
        multipleTableRef.value.store.states.selection.value.push(row)
      }
    })
  } else {
    resetSelectionRef()
  }
}

defineExpose({
  toggleSelection,
  resetSelectionRef
})
</script>

<style scoped lang="scss">
@import "@/assets/sass/core/components/mixins/_typography.scss";

:deep(.el-table__fixed), :deep(.el-table__fixed-right) {
  .el-table__fixed-body-wrapper {
    height: auto !important;
  }
}

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
</style>
