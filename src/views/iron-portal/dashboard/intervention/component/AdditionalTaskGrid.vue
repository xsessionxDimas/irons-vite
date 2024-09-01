<template>
  <el-table
    :data="props.listData"
    v-loading="props.isLoading"
    element-loading-background="#2d2b39b3"
    style="width: 100%"
    :empty-text="'No Data'"
    class="table_dark-row table-dark"
    header-row-class-name="table_dark-header"
    row-class-name="table_dark-row"
  >
    <el-table-column label="No" width="52" align="center">
      <template #default="scope">
        <span class="text-white">
          {{ scope.row.sequence }}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="recAction" label="Intervention Checks" min-width="150">
      <template #default="{row}">
        <span class="text-white">
          {{ row.recAction }}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="typeTaskId" label="Type Task" width="161">
      <template #default="scope">
        <button
          v-if="scope.row.typeTaskId"
          size="small"
          class="btn btn-sm btn-bg-light"
          @click="handleShowPreview(scope.row)"
          style="padding: 5px !important"
        >
            <span class="me-2">
              {{ getLabelOptions(scope.row.typeTaskId) || scope.row.typeTask}}
            </span>
            <em class="fa fa-eye" style="color: black;cursor: pointer;" ></em>
        </button>
      </template>
    </el-table-column>
    <el-table-column prop="executed" label="Executed (Yes/No)" width="79">
      <template #default="scope">
        <span class="text-white">
          {{ scope.row.executed ? "Yes" : "No" }}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="actualInterventionDate" label="Actual Intervention Date" max-width="200">
      <template #default="scope">
        <span class="text-white">
          {{ scope.row.actualInterventionDate && scope.row.actualInterventionDate != "" ? simpleFormatDateShortAU(scope.row.actualInterventionDate) : "-" }}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="interventionStatus" label="Result" min-width="100">
      <template #default="scope">
        <span class="text-white">
          {{ scope.row.interventionStatus && scope.row.interventionStatus != "" ? scope.row.interventionStatus : "-" }}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="condition" label="Condition" max-width="200">
      <template #default="scope">
        <span class="text-white">
          {{ scope.row.condition && scope.row.condition != "" ? scope.row.condition : "-" }}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="detailedInformation" label="Detailed Information" width="150" align="center">
      <template #default="scope">
        <!-- Code = 1 => none => No detail information -->
        <!-- Code = 2 => warna abu-abu jika declined, hijau jika detail info => Defect Yes/No -->
        <button
          size="small"
          v-if="scope.row.condition != null && scope.row.condition[0] == '2' && (scope.row.spvStatus == 'Decline' || scope.row.plannerStatus == 'Decline')"
          class="btn-intervention__declined fw-bolder"
          @click="onDefectClickDetail(scope.row.interventionHeaderId, scope.row.taskKey, scope.row.declineReason)"
        >
          Declined
        </button>
        <button
          size="small"
          v-else-if="scope.row.condition != null && scope.row.condition[0] == '2'"
          class="btn-intervention__detailed__information fw-bolder"
          @click="onDefectClickDetail(scope.row.interventionHeaderId, scope.row.taskKey)"
        >
          Detailed Information
        </button>
        <!-- Code = 3 => warna hijau => NA -->
        <button
          size="small"
          v-else-if="scope.row.condition != null && scope.row.condition[0] == '3'"
          class="btn-intervention__detailed__information fw-bolder"
          @click="onNAClickDetail(scope.row.interventionHeaderId, scope.row.taskKey)"
        >
          Detailed Information
        </button>
          <!-- Result C atau X -->
          <button
          size="small"
          v-else-if="scope.row.interventionStatus && (scope.row.interventionStatus.includes('X') || scope.row.interventionStatus.includes('C'))"
          class="btn-intervention__detailed__information fw-bolder"
          @click="onDetailHeader(scope.row.interventionHeaderId, scope.row.taskKey, scope.row.psType)"
        >
          Detailed Information
        </button>
      </template>
    </el-table-column>
    <el-table-column width="50">
      <template #default="scope">
        <div v-if="(scope.row.images && scope.row.images?.length > 0 ) && (!scope.row.interventionStatus?.includes('X') && !scope.row.interventionStatus?.includes('C'))">
          <button
              size="small"
              class="btn btn-sm btn-icon btn-bg-light me-1"
              @click="handleShowModalImage(scope.row.images)"
            >
              <inline-svg src="/media/icons/bootstrap-icon/card-image.svg" width="12" height="12" />
            </button>
        </div>
        <div v-if="(scope.row.interventionStatus && (scope.row.interventionStatus.includes('X') || scope.row.interventionStatus.includes('C'))) && (scope.row.condition != null && scope.row.condition[0] == '2')">
          <button
              size="small"
              class="btn btn-sm btn-icon btn-bg-light me-1"
              @click="onDetailHeader(scope.row.interventionHeaderId, scope.row.taskKey, scope.row.psType)"
            >
              <inline-svg src="/media/icons/bootstrap-icon/card-image.svg" width="12" height="12" />
          </button>
        </div>
      </template>
    </el-table-column>
    <el-table-column width="90" class-name="el-table__body-wrapper fixed-right">
      <template #default="scope" v-if="canEditAndDelete">
        <!-- Edit not active -->
        <div class="d-flex justify-space-between">
          <el-tooltip class="box-item" effect="dark" content="Edit" placement="top">
            <button class="btn btn-sm btn-icon btn-bg-light me-1" @click="handleEditRow(scope.row)">
              <inline-svg src="/media/svg/tables/rows/pencil-edit-blue.svg" width="12" height="12" />
            </button>
          </el-tooltip>
          <el-tooltip class="box-item" effect="dark" content="Delete" placement="top">
            <button class="btn btn-sm btn-icon btn-bg-light me-1" @click="handleDeleteRow(scope.row)">
              <inline-svg src="/media/svg/tables/rows/trash-delete-blue.svg" width="12" height="12" />
            </button>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <el-tooltip
    v-if="canEditAndDelete"
    class="box-item"
    effect="dark"
    :content="editedItem.additionalTaskId != -1 ? `Please finish the edited item first` : `Add additional task`" placement="bottom"
  >
    <button :disabled="listStore.loading" class="fw-bolder my-5 text-green btn-additional-task" @click="handleAddRow">
      <span class="svg-icon svg-icon-1x text-white">
        <inline-svg src="/media/icons/duotune/arrows/arr075.svg" />
      </span>
      If required, please add other specific intervention check
    </button>
  </el-tooltip>
  <transition name="fade">
    <ErrorAlert
      ref="additionalTaskError"
      v-if="isError"
      :errorMessages="errors"
      @reset-form="handleResetError" />
  </transition>
  <ImagePreview
    :showMandatoryCaption="true"
    re-render
    :images="imageValues"
    :visibility="modalImageVisibility"
    @on-close="handleHideModalImage" />
  <FormAdditionalTask
    :is-preview="isPreview"
    :is-edit="isEditAdditional"
    :visibility="formAdditionalTaskVisibility"
    @handle-close="handleHideFormAddDialog"
    @handle-submit="handleSubmitFormAddDialog"
    />

</template>

<script lang="ts" setup>
/** eslint-disable @typescript-eslint/no-unused-vars */

/* import componenets here */
import { ElTable, ElTableColumn } from "element-plus";
import { simpleFormatDateShortAU } from "@/core/helpers/date-format";
import {
  PropType,
  defineProps,
  defineEmits,
  defineExpose,
  computed,
  ref,
  onMounted
} from "vue";

import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  useInterventionListStore
} from "@/store/pinia/iron-portal/dashboard/intervention/useInterventionListStore";
import {
  AdditionalTaskUpsertItem,
  ComponentListItem
} from "@/core/types/entities/iron-portal/dashboard/intervention/UpsertItem";
import {
  AdditionalTaskItem
} from "@/core/types/entities/iron-portal/dashboard/intervention/AdditionalTaskItem";
import {
  useComponentInterventionDefectsFormStore
} from '@/store/pinia/dma/component-intervention/defects/useComponentInterventionDefectsFormStore';
import {
  useComponentInterventionNAFormStore
} from '@/store/pinia/dma/component-intervention/na/useComponentInterventionNAFormStore';
import {
  useInterventionFormStore
} from "@/store/pinia/iron-portal/dashboard/intervention/useInterventionFormStore";
import {
  useInterventionDefectStore
} from '@/store/pinia/dma/component-intervention/refactor/useInterventionDefectStore';

import {
  swalAlertSuccessAutoClose,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";

import ImagePreview from './ImagePreview.vue'

import FormAdditionalTask from './additonal-task/FormAdditionalTask.vue'

const modalImageVisibility = ref<boolean>(false);
const imageValues = ref<string[]>([]);

const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<AdditionalTaskItem[]>,
  },
  canEditAndDelete: {
    required: true,
    type: Boolean
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(["setDeclineReason"]);

const listStore = useInterventionListStore();
const defectStore = useComponentInterventionDefectsFormStore();
const naStore = useComponentInterventionNAFormStore();
const defectHeader = useInterventionDefectStore()
const formStore = useInterventionFormStore();

const defaultAdditionalTask = {
  additionalTaskId: -1,
  sequence: 0,
  recAction: "",
  executed: false,
  actualInterventionDate: "",
  interventionStatus: "",
  condition: "",
  detailedInformation: "",
  isActive: true,
  isDeleted: false,
  typeTaskId: 0,
  typeTask: "",
  uom: "",
  listComponent: [] as ComponentListItem[]
};
const defaultItem = ref<AdditionalTaskUpsertItem>({
  ...defaultAdditionalTask
});
const editedItem = ref<AdditionalTaskUpsertItem>({
  ...defaultAdditionalTask
});

const formAdditionalTaskVisibility = ref<boolean>(false);
const isEditAdditional = ref<boolean>(false);
const isPreview = ref<boolean>(false);

const dataPreview = ref({
  sequence: '',
  recAction: '',
  typeTask: '',
  uom: ""
});
/* computed */
const isError = computed(() => {
  return listStore.isError;
});
const errors = computed(() => {
  return listStore.errors;
});

/* handlers */

onMounted(() => {
  dataPreview.value = {
    sequence: '',
    recAction: '',
    typeTask: '',
    uom: ""
  }
})

const getLabelOptions = (typeId) => {
  if (typeId) {
    return listStore.typeTaskOptions.find((item) => {
      return item.value == typeId
    })?.label
  }
  return ""
}

const handleHideFormAddDialog = () => {
  formAdditionalTaskVisibility.value = false;
  isPreview.value = false;
}

const handleSubmitFormAddDialog = (dataForm) => {
  swalAlertConfirmation("Are you sure you want to submit ?").then((res) => {
    if (res.isConfirmed) {
      if (isEditAdditional.value) {
        listStore.updateAdditionalTask(defaultItem.value, dataForm)
        handleCancelEditRow();
      } else {
        listStore.insertAdditionalTask(dataForm);
      }
      swalAlertSuccessAutoClose("Form has been successfully submitted!")
        .then(() => {
          formAdditionalTaskVisibility.value = false;
        });
    }
  });
}

const handleShowPreview = async (row) => {
  handleEditRow(row)
  isPreview.value = true;
  await listStore.getLookupConditionOption(row.typeTaskId);
}

const onDefectClickDetail = async (interventionId: string, taskKey: string, declineReason = "") => {
  emits("setDeclineReason", declineReason && declineReason != "" ? declineReason : "");
  await defectStore.getDefectDetail(interventionId, taskKey);
};
const onNAClickDetail = async (interventionId: string, taskId: string) => {
  await naStore.getNADetail(interventionId, taskId);
};

const handleAddRow = () => {
  listStore.addAdditionalForm();
  isEditAdditional.value = false
  formAdditionalTaskVisibility.value = true
};

const handleEditRow = async (row) => {
  defaultItem.value = { ...row, uom: row.uom || "" };
  editedItem.value = { ...row, uom: row.uom || "" };
  console.log(row)
  listStore.setAdditionalForm(editedItem.value);
  isEditAdditional.value = true;
  formAdditionalTaskVisibility.value = true;
};

const handleDeleteRow = (row) => {
  listStore.deleteAdditionalTask(row);
};

const handleCancelEditRow = async () => {
  handleResetError();
  defaultItem.value = { ...defaultAdditionalTask };
  editedItem.value = { ...defaultAdditionalTask };
};

const handleResetError = () => {
  listStore.setErrors([] as string[]);
};

const onDetailHeader = async (interventionId: string, taskKey: string, psType:string) => {
  const dataHeader = await defectHeader.getDefectHeaderFromServer(taskKey, interventionId, "taskId");
  formStore.setHeaderCbm(dataHeader);
  formStore.setFormCbmHeaderVisibility(true);
  formStore.setPsTypeCbm(psType);
}

const handleShowModalImage = async (images) => {
  modalImageVisibility.value = true
  imageValues.value = images
}
const handleHideModalImage = async () => {
  modalImageVisibility.value = false
  imageValues.value = []
}

defineExpose({
  editedItem,
  handleCancelEditRow
})
</script>
<style lang="scss" scoped>
.fixed-right{
  position: sticky;
  right: 0;
  background-color: #fff;
  z-index: 1;
  width: 100px;
  /* sesuaikan lebar kolom kiri */
}
.el-table__body-wrapper .fixed-right {
  position: sticky !important;
  right: 0;
  z-index: 1;
}
/* Button Add */
.btn-additional-task {
  background-color: transparent;
  border: none;
  padding: 15px;
  width: fit-content;
  border-radius: 10px;
}
.btn-additional-task:hover {
  background-color: #201f29;
}
</style>
