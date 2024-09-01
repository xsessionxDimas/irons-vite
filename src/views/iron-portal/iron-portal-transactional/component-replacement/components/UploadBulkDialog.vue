<template>
  <el-dialog
    title="Upload Bulk Data"
    v-model="isVisible"
    :before-close="handleCloseDialog"
    width="70%"
    custom-class="upload-modal"
  >
    <div class="text-center"></div>
    <div class="mb-3">
      <span>
         Download template
        <a href="documents/MasterDataComponentReplacement.xlsx" target="_blank" id="link-download">here</a>
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
      <div class="d-flex align-items-center position-relative my-0 mb-2"></div>
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
  useComponentReplacementBulkStore
} from "@/store/pinia/iron-portal/iron-portal-transactional/component-replacement/useComponentReplacementBulkStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  swalAlertConfirmation,
  swalAlertErrorBulk,
  swalAlertSuccessAutoClose
} from "@/core/helpers/sweet-alert";
import { handleDataToExcel } from '@/core/helpers/excel-generator';
import { mapObject } from "map-anything";
import {
  ValidatedItem
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/component-replacement/ValidatedItem";
import {
  BulkItem
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/component-replacement/BulkItem";

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const authStore = useAuthenticationStore();
const bulkStore = useComponentReplacementBulkStore();

/* refs */
const isVisible = toRef(props, "visibility");

/* methods */
const mapToBulkItem = () => {
  const data = mapObject(bulkStore.validatedData, (data) => {
    const item = data as ValidatedItem;
    return {
      componentReplacementId: 0,
      site: item.site,
      model: item.model,
      equipment: item.equipment,
      component: item.component,
      replacementDate: item.replacementDate,
      replacementSmu: item.replacementSmu,
      hmOffset: item.hmOffset,
      frameHours: item.frameHours,
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
    "SITE",
    "MODEL",
    "EQUIPMENT",
    "COMPONENT",
    "REPLACEMENT DATE",
    "REPLACEMENT SMU",
    "HM OFFSET",
    "FRAME HOURS",
    "VALIDATION REASON",
    "STATUS"
  ];
  const data = bulkStore.validatedData.map((val) => {
    return {
      site: val.site,
      model: val.model,
      equipment: val.equipment,
      component: val.component,
      replacementDate: val.replacementDate,
      replacementSmu: val.replacementSmu,
      hmoffset: val.hmoffset,
      frameHours: val.frameHours,
      remark: val.validationReason,
      status: val.isValid ? "OK" : "Error",
    };
  });
  handleDataToExcel("ComponentReplacement", columns, data);
}
const handleSubmitBulk = async () => {
  if (bulkStore.displayData.length < 1) {
    swalAlertErrorBulk("There is no data to submit");
    return;
  }
  if (bulkStore.isError) {
    swalAlertErrorBulk(bulkStore.errorBulkMsg);
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
      swalAlertSuccessAutoClose("Form has been successfully submitted!")
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
