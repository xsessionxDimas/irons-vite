<template>
  <!-- @NOTE THERE IS HAVE SOME ISSUE IN COLUMN SELECTION
    FOR SHOW HIDE SELECTION PANE, FOR TEMP SOLUTION MAKE 2 TABLE
    IF YOU WANT TO ADD/CHANGE LOGIC IN InterventionChecksGrid
    PLEASE PROVIDE TO IN COMPONENT InterventionCheckList -->
  <el-table
    ref="tableRecActionRef"
    :data="props.listData"
    v-loading="props.isLoading"
    element-loading-background="#2d2b39b3"
    style="width: 100%"
    empty-text="No Data"
    class="table-row table-dark"
    header-row-class-name="table-header"
    row-class-name="table-row"
  >
    <el-table-column label="No" width="50" align="center">
      <template #default="scope">
        <span class="text-white">
          {{ scope.row.subTask == null || scope.row.subTask == "" ? scope.$index+1 : "" }}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="recAction" label="Intervention Checks" min-width="200">
      <template #default="scope">
        <template v-if="scope.row.subTask != null && scope.row.subTask != ''">
          <span class="text-white" v-html="scope.row.subTask"></span><span class="text-white">. &nbsp;</span>
        </template>
        <span class="text-white" v-html="scope.row.recAction"></span>
      </template>
    </el-table-column>
    <el-table-column prop="executed" label="Executed (Yes/No)" width="100">
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
    <el-table-column width="90">
    </el-table-column>
  </el-table>
  <ImagePreview
    :showMandatoryCaption="true"
    re-render
    :images="imageValues"
    :visibility="modalImageVisibility"
    @on-close="handleHideModalImage"
  />
</template>

<script lang="ts" setup>
/* import componenets here */
import { ElTable, ElTableColumn } from "element-plus";
import {
  useInterventionListStore
} from "@/store/pinia/iron-portal/dashboard/intervention/useInterventionListStore";
import {
  InterventionCheckItem
} from "@/core/types/entities/iron-portal/dashboard/intervention/InterventionCheckItem";
import {
  PropType,
  defineProps,
  defineEmits,
  ref,
  watch,
} from "vue";
import { simpleFormatDateShortAU } from "@/core/helpers/date-format";
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

import ImagePreview from './ImagePreview.vue'

const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<InterventionCheckItem[]>,
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

const modalImageVisibility = ref<boolean>(false);
const imageValues = ref<string[]>([]);

const tableRecActionRef = ref(null)

// Methods
const onDefectClickDetail = async (interventionId: string, taskKey: string, declineReason = "") => {
  emits("setDeclineReason", declineReason && declineReason != "" ? declineReason : "");
  await defectStore.getDefectDetail(interventionId, taskKey);
};
const onNAClickDetail = async (interventionId: string, taskKey: string) => {
  await naStore.getNADetail(interventionId, taskKey);
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

</script>

<style lang="scss">
.btn-intervention__detailed__information {
  background-color: #dff4da;
  color: #229a16;
  padding: 5px 20px;
  border: none;
  border-radius: 5px;
  line-height: normal;
  width: 100%;
}
.btn-intervention__declined {
  background-color: #e8ebee;
  color: #637381;
  padding: 5px 20px;
  border: none;
  border-radius: 5px;
  line-height: normal;
  width: 100%;
}
</style>
