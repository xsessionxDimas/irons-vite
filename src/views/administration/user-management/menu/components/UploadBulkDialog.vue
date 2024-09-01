<template>
  <el-dialog
    title="Upload Bulk Data"
    v-model="isVisible"
    :before-close="handleCloseDialog"
    width="70%"
    custom-class="upload-modal">
    <div class="text-center">
    </div>
    <div class="mb-3">
      <span>
         Download template
        <a href="documents/Menu.xlsx" target="_blank" id="link-download">here</a>
        before uploading file
      </span>
    </div>
    <FileDropZone v-loading="bulkStore.uploadLoading"
      :isSubmissionUploadSuccess="bulkStore.isUploaded"
      @handle-close-uploaded-file="handleCloseDialog"
      @handle-upload="handleUpload"
      @handle-set-is-excel-file-uploaded="handleSetIsExcelFileUploaded"
   />
    <div class="grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center">
        <div class="d-flex align-items-center position-relative my-0 mb-2">
        </div>
      </div>
    <div class="card">
      <div class="card-body grid-padding">
        <GridBulk :list-data="bulkStore.displayData" :page="bulkStore.pagination.currentPage" />
      </div>
    </div>
    <template v-if="bulkStore.displayData.length > 0">
      <pagination
        @raise-page-change="handlePageChange($event)"
        :currentPage="bulkStore.pagination.currentPage"
        :totalPage="bulkStore.pagination.totalPage"
        :totalPageSize="bulkStore.pagination.totalPageSize"
        :startPaginationIndex="bulkStore.pagination.startPaginationIndex"
        :endPaginationIndex="bulkStore.pagination.endPaginationIndex"
     />
    </template>
    <template #footer>
      <div>
        <span class="dialog-footer">
          <el-button type="success" @click="handleDownload">Download</el-button>
          <el-button type="primary" @click="handleSubmitBulk">Upload</el-button>
          <el-button type="success" @click="handleCloseDialog">Cancel</el-button>
        </span>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  toRef
} from "vue";
import GridBulk from "./GridBulk.vue";
import FileDropZone from '@/components/upload/FileDropZone.vue';
import Pagination from "@/components/pager/Pagination.vue";
import {
  useMenuBulkStore
} from "@/store/pinia/administration/user-management/menu/useMenuBulkStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  swalAlertConfirmation,
  swalAlertErrorBulk,
  swalAlertSuccess
} from "@/core/helpers/sweet-alert";
import { handleDataToExcel } from '@/core/helpers/excel-generator';
import { mapObject } from "map-anything";
import {
  ValidatedItem
} from "@/core/types/entities/administration/user-management/menu/ValidatedItem";
import {
  BulkItem
} from "@/core/types/entities/administration/user-management/menu/BulkItem";

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const authStore = useAuthenticationStore();
const bulkStore = useMenuBulkStore();

/* refs */
const isVisible = toRef(props, "visibility");

/* methods */
const mapToBulkItem = () => {
  const data = mapObject(bulkStore.validatedData, (data) => {
    const item = data as ValidatedItem;
    return {
      mdMenuId: 0,
      menuName: item.MenuName,
      pageName: item.PageName,
      // icon: item.Icon,
      menuType: item.MenuType,
      level: item.Level,
      sequence: item.Sequence,
      isChild: item.IsChild,
      parentId: item.ParentId,
      isMenu: item.IsMenu,
      section: item.Section,
      isActive: true
    } as BulkItem
  });
  return Object.values(data);
};

const downloadTemplate = () => {
  const link = document.getElementById("link-download");
  if (link) {
    link.click();
  }
}

/* handlers */
const handleCloseDialog = () => {
  if (bulkStore.validatedData.length > 0) {
    const textConfirmation = 'Cancel Upload Data?';
    swalAlertConfirmation(textConfirmation, 'Confirm').then((res) => {
      if (res.isConfirmed) {
        handleClose();
      }
    });
  } else {
    handleClose();
  }
};
const handleUpload = async (excel: FormData) => {
  await bulkStore.upload({
    userAccount: authStore.user.Name,
    excelFile: excel,
  });
  if (bulkStore.stateError) {
    swalAlertErrorBulk(bulkStore.error);
  }
};
const handleClose = (isReload = false) => {
  bulkStore.resetState();
  emits("handle-close", isReload);
};
const handleSetIsExcelFileUploaded = (state: boolean) => {
  bulkStore.setIsUploadedState(state);
};
const handlePageChange = (newPage: number) => {
  bulkStore.setPage(newPage)
};
const handleDownload = () => {
  if (bulkStore.validatedData.length < 1) {
    downloadTemplate();
    return;
  }
  const columns = [
    "Menu Name",
    "Page Name",
    "Menu Type",
    "Level",
    "Sequence",
    "Is Child",
    "Parent Id",
    "Is Menu",
    "Section",
    "Remark",
    "Status"
  ];
  const data = bulkStore.validatedData.map((val) => {
    return {
      menuName: val.MenuName,
      pageName: val.PageName,
      menuType: val.MenuType,
      level: val.Level,
      sequence: val.Sequence,
      isChild: val.IsChild,
      parentId: val.ParentId,
      isMenu: val.IsMenu,
      section: val.Section,
      remark: val.ValidationReason,
      status: val.IsValid ? "OK" : "Error",
    };
  });
  handleDataToExcel("Master Menu", columns, data);
}
const handleSubmitBulk = async () => {
  if (bulkStore.displayData.length < 1) {
    swalAlertErrorBulk("There is no data to submit");
    return;
  }
  if (bulkStore.isError) {
    swalAlertErrorBulk("There is still invalid row(s)");
    return;
  }
  swalAlertConfirmation("Are you sure you want to submit ?").then(async (res) => {
    if (res.isConfirmed) {
      const bulkData = mapToBulkItem();
      bulkStore.setBulkData(bulkData);
      await bulkStore.bulkInsert(authStore.user.Name);
      if (bulkStore.isError) {
        swalAlertErrorBulk(bulkStore.stateError);
        return;
      }
      swalAlertSuccess("Form has been successfully submitted!", "Ok")
        .then(() => {
          handleClose(true);
        });
    }
  });
};
</script>

<style lang="scss" scoped>
.upload-modal {
  border-radius: 8px !important;
  height: 400px;
  .card {
    box-shadow: 0px 0px 30px rgb(56 71 109 / 9%);
  }
}
</style>
