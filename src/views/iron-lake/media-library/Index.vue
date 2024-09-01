<template>
  <template>
    <div v-loading.fullscreen.lock="formStore.loading" element-loading-text="Submitting Data"  element-loading-background="rgba(0, 0, 0, 0.5)"></div>
    <div v-loading.fullscreen.lock="bulkStore.loading" :element-loading-text="bulkStore.loadingMessage"  element-loading-background="rgba(0, 0, 0, 0.5)"></div>
  </template>
  <section class="px-3 py-8 d-flex">
    <div class="flex-grow-1">
      <h5 class="m-0 header-title">Media Library</h5>
    </div>
    <div class="align-self-start d-flex gap-2">
      <el-button
        class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-lg m-0"
        v-if="!bulkStore.isBulkDownload"
        @click="handleBulkActionClick(true)"
      >
        Bulk Action
      </el-button>
      <el-button
        class="btn btn-outline btn-outline-btech-cancel btn-active-light-btech-cancel btech-lg m-0"
        :style="{
          borderColor:'#DFE3E8 !important'
        }"
        v-if="bulkStore.isBulkDownload"
        @click="handleBulkActionClick(false)"
      >
        Cancel Action
      </el-button>
      <el-button
        class="btn btn-btech-secondary btech-lg m-0"
        v-if="isHo"
        :disabled="bulkStore.isBulkDownload"
        @click="showFormDialog"
      >
        Upload Media
      </el-button>
    </div>
  </section>
  <section class="card mb-10">
    <div class="card-body p-3">
      <ListTableFilter
      ref="tableFilterRef" />
      <ListTable
        class="mb-6"
        ref="listTable"
        :search="searchData"
        :current-selection="currentChecklistDownload"
        @show-form="showFormDialog"
        @show-viewer="handleViewer"
        @change-selection="handleChangeSelection"
        @update-checklist-download="updateCurrentChecklistDownload"
      />
      <div class="m-0 ironlake-pagination">
        <Pagination
          v-if="!listStore.paginationLoading"
          :currentPage="pagination.currentPage"
          :totalPage="pagination.totalPage"
          :totalPageSize="pagination.totalPageSize"
          :startPaginationIndex="pagination.startPaginationIndex"
          :endPaginationIndex="pagination.endPaginationIndex"
          :isPageSizeChange="true"
          @raise-size-change="handleSizePageChange($event)"
          @raise-page-change="handlePaginationChange($event)"
        />
      </div>
    </div>
  </section>
  <FormDialog :visibility="formVisibility" @handle-close="hideFormDialog" />
  <ImageViewerDialog :visibility="showImageViewer" :data="currentDataViewer" :url="fileUrl" @handle-close-modal="handleCloseImageViewer"/>
  <PDFViewerDialog :visibility="showPDFViewer" :data="currentDataViewer" :url="fileUrl" @handle-close-modal="handleCloseDocumentViewer" />
</template>

<script lang="ts" setup>
/* imports here */
import {
  ref,
  computed,
  onBeforeMount,
  onUnmounted,
} from "vue";
import { useStore } from "vuex";
import { Actions as StoreActions } from "@/store/enums/StoreEnums";
/* import components here */
import Pagination from "@/components/pager/Pagination.vue";
import PaginationType from "@/core/types/misc/Pagination";
import ListTableFilter from "./components/ListTableFilter.vue";
import ListTable from "./components/ListTable.vue";
import FormDialog from "./components/FormDialog.vue";
import ImageViewerDialog from "./components/ImageViewerDialog.vue";
import PDFViewerDialog from "./components/PDFViewerDialog.vue";
/* import stores here */
import {
  useMediaLibraryListStore
} from "@/store/pinia/iron-lake/media-library/useMediaLibraryListStore";
import {
  useMediaLibraryFormStore
} from "@/store/pinia/iron-lake/media-library/useMediaLibraryFormStore";
import {
  useMediaLibraryBulkStore
} from "@/store/pinia/iron-lake/media-library/useMediaLibraryBulkStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  ListItem
} from "@/core/types/entities/iron-lake/media-library/ListItem";
import _ from "lodash";

const store = useStore();
const listStore = useMediaLibraryListStore();
const formStore = useMediaLibraryFormStore();
const bulkStore = useMediaLibraryBulkStore();
const authStore = useAuthenticationStore();

// init module
const isHo = computed(() => {
  return authStore.user.isHO === 1
})
const tableFilterRef = ref();
const currentChecklistDownload = ref<ListItem[]>([])

// search module
const searchData = ref("");

const listTable = ref()

/* pagination module */
const pagination = computed((): PaginationType => {
  return listStore.pagination;
});
const handleSizePageChange = async (newSize: number) => {
  listStore.stateFilterForm.pageSize = newSize;
  await listStore.setPage(1);
  updateCurrentChecklistDownload()
};
const handlePaginationChange = async (newPage: number) => {
  searchData.value = "";
  await listStore.setPage(newPage);
  updateCurrentChecklistDownload()
};

const updateCurrentChecklistDownload = () => {
  currentChecklistDownload.value = listStore.intersectionListItem
  listTable.value.toggleSelection(currentChecklistDownload.value)
}

/* reload callback */
const loadPageData = async () => {
  await listStore.setPage(1);
  formStore.getFileTypeLookup();
};

// form dialog module
const formVisibility = ref<boolean>(false);
const showFormDialog = () => {
  formVisibility.value = true;
};
const hideFormDialog = async (isReload: boolean) => {
  formVisibility.value = false;
  if (isReload) await loadPageData();
};

const handleBulkActionClick = (value: boolean) => {
  bulkStore.resetBulkList()
  bulkStore.setIsBulkDownload(value)
  listTable.value.resetSelectionRef()
  currentChecklistDownload.value = []
}

const handleChangeSelection = (resultSelection: ListItem[]) => {
  const action: 'remove' | 'add' = currentChecklistDownload.value.length > resultSelection.length ? 'remove' : 'add'
  const difference = _.xor(currentChecklistDownload.value, resultSelection)
  if (difference.length == 1) {
    // select one by one
    listStore.setChecklistDownload(action, difference[0])
    currentChecklistDownload.value = resultSelection
  } else if (resultSelection.length == 0) {
    // refer when use unselect all
    listStore.setUnselectedAllChecklistDownload()
  } else if (resultSelection.length == pagination.value.totalPageSize) {
    // refer when select all
    listStore.setSelectedAllChecklistDownload()
  }
}

// handle viewer
const fileUrl = ref<any>()
const showImageViewer = ref(false)
const showPDFViewer = ref(false)
const currentDataViewer = ref<ListItem>({} as ListItem)
const handleViewer = async (data: {dataList, type}) => {
  bulkStore.setLoading(true)
  console.log(data)
  const { dataList, type } = data
  currentDataViewer.value = dataList
  try {
    const buffer = await bulkStore.downloadAttachmentBlob(dataList)
    if (buffer) {
      const blob = new Blob([buffer]);
      const urlCreator = window.URL || window.webkitURL
      fileUrl.value = urlCreator.createObjectURL(blob)
      if (type == "Image") {
        showImageViewer.value = true
      } else if (type == "Document") {
        showPDFViewer.value = true
      }
    }
    bulkStore.setLoading(false)
  } catch (error) {
    bulkStore.setLoading(false)
  }
}
const handleCloseImageViewer = () => {
  resetViewer()
  showImageViewer.value = false
}
const handleCloseDocumentViewer = () => {
  resetViewer()
  showPDFViewer.value = false
}
const resetViewer = () => {
  fileUrl.value = ''
  currentDataViewer.value = {} as ListItem
}
/* life cycle hooks */
onBeforeMount(async () => {
  store[StoreActions.ACTIVE_PAGE]("IronLake");
  listStore.stateLoading = true
  if (authStore.user !== undefined) {
    listStore.statePaginationLoading = true
    loadPageData();
  }
});

onUnmounted(async () => {
  listStore.$reset();
  formStore.$reset();
});
</script>

<style>
el-overlay {
  z-index: 100 !important;
}

.ironlake-pagination > .demo-pagination-block {
  margin: 0;
  padding: 1rem;
}
</style>

<style lang="scss" scoped>
@import "@/assets/sass/core/components/mixins/_typography.scss";

.header-category {
  @include paragraph-sm();
}
.header-title {
  @include heading-h5();
  font-weight: 700;
}
.card-table-title {
  @include heading-h6();
  font-weight: 700;
}

.alert-desc {
  @include paragraph-sm();
}

.close-alert {
  cursor: pointer;
}

.fas {
  &:hover {
    color: unset !important;
  }
}

.ironlake-draft-collapse {
  .el-collapse-item {
    :deep(.el-collapse-item__header) {
      border: none;
      height: unset;
      background-color: inherit;

      @include heading-h6();
      font-weight: 700;
      i {
        font-size: 1.25rem;
      }
    }
  }
}

:deep(.el-collapse-item__wrap) {
  border: none;
  background-color: inherit;
  .el-collapse-item__content {
    padding: 0;
  }
}

.ironlake-upload-progress {
  @include paragraph-sm();
  :deep(.el-progress) {
    width: 100%;
    .el-progress__text {
      @include paragraph-sm();
      min-width: unset;
    }
  }
}
</style>
