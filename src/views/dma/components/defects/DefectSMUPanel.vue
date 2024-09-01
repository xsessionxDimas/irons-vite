<template>
    <div class="mt-0 ps-0">
      <el-collapse class="task-group general-accordion py-1 px-5 testing" v-model="smuIdentifiedCollapse">
        <el-collapse-item title="SMU Machine Acknowledgement" name="SMU Machine Acknowledgement">
          <div class="row px-2 item mx-1 w-100 defect-panel-header">
            <div class="col align-items-center d-flex text-break">Task Description</div>
            <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center">Status</div>
            <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">Review Status</div>
          </div>
          <template v-if="headers.length < 1">
            <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
              <p style="text-align: center;">No data recorded</p>
            </div>
          </template>
          <template v-else v-for="(item) in headers" :key="item.id">
            <div class="item px-2 my-2 mx-1">
              <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                <div class="col align-items-center d-flex text-break">
                  <span class="text-break defect-identified-task" v-html="displayDesc(item.taskDesc)"></span>
                </div>
                <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center">
                  {{ statusRange(item.taskDesc) ? 'In Range' : 'Out of Range' }}
                </div>
                <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">
                  <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center cursor-pointer"
                    :class="detailInfoClass(item.id, headers)"
                    @click="acknowledge(item.id)">
                    Detailed Information
                  </div>
                </div>
              </div>
              <div class="row flex-nowrap w-100 flex-row-reverse create-by" style="font-size: 13px !important">
                {{ timestamp }}
              </div>
            </div>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- smu detail -->
    <SMUDetailDialog
      v-model:show="showSMUDetailDialog"
      :detailDefect="detailDefectSMU!"
      :ownership="formatOwnershipHTML"
      :view-only="(!plannerApprove && defectSMU?.status == 'Acknowledge') || (plannerApprove && defectSMU?.plannerStatus == 'Acknowledge') || route.path == '/ironforms/e-form' || route.path == '/ironforms/monitoring-status/preview'"
      :plannerApprove="plannerApprove"
      :error-status="errorData"
      :planner-data="plannerData"
      :approval-s-p-v-data="approvalData"
      @on-refresh-data="onRefreshData"
      @update-defect-detail-s-m-u="updateDefectDetailSMU"
      @update-planner-defect-acknowledge="updatePlannerDefectAcknowledge"
      @update-defect-acknowledge="updateDefectAcknowledge"
      @reset-error-status="resetErrorStatus"
    />
</template>


<script lang="ts" setup>
import {
  defineProps,
  computed,
  ref,
  defineEmits
} from "vue"
import {
  useDefectsStore
} from "@/store/pinia/dma/e-form/defects/useDefectsStore"
import { useCameraStore } from "@/store/pinia/application/useCameraStore"
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore"
import {
  displayDesc,
} from '@/core/helpers/manipulate-html-string'
import { Header } from '@/core/types/entities/dma/defects/Header'
import { isUndefined } from 'lodash'
import SMUDetailDialog from './SMUDetailDialog.vue';
import { formatOwnership } from "@/store/pinia/dma/e-form/helpers"
import {
  plannerDataSMU,
  submitDetailParameter,
  ApproveSMU
} from "@/core/types/entities/dma/defects/DefectSMU"
import { useRoute } from 'vue-router';

const props = defineProps({
  viewOnly: {
    required: false,
    type: Boolean,
    default: false
  },
  supervisor: {
    required: false,
    type: Boolean,
    default: true
  },
  fitterId: {
    required: false,
    type: String,
    default: ""
  },
  plannerApprove: {
    required: false,
    type: Boolean,
    default: false
  },
})

/* stores */
const route = useRoute();
const store = useDefectsStore()
const camStore = useCameraStore()
const defectFormStore = useDefectsFormStore()

const emits = defineEmits(['onRefreshData', 'onGetPositionY'])

/* refs */
const smuIdentifiedCollapse = ref('SMU Machine Acknowledgement')
const refHeader = ref<string>("")
const showSMUDetailDialog = ref<boolean>(false);

const headers = computed(() => {
  return store.ApprovalData.SMUDefectHeaders
})
const defectSMU = computed(() => {
  return store.DefectSMUHeader;
});
const detailDefectSMU = computed(() => {
  return store.DefectSMUDetail;
});
const errorData = computed(() => {
  return {
    isError: store.stateErrorMessage == '' ? false : true,
    messages: store.stateErrorMessage
  }
})
const plannerData = computed((): plannerDataSMU | undefined => {
  if (defectSMU.value) {
    const { plannerStatus, updatedBy, updatedDate } = defectSMU.value;
    return { plannerStatus, updatedBy, updatedDate };
  }
  return undefined;
});

const approvalData = computed((): ApproveSMU | undefined => {
  if (defectSMU.value) {
    const { approvedBy, approvedDate, status } = defectSMU.value;
    return { approvedBy, approvedDate, status };
  }
  return undefined;
});
const formatOwnershipHTML = computed(() => {
  const ownership = defectFormStore.Ownership
  return formatOwnership(ownership)
})
const statusRange = (description: string) => {
  const isInRange = !description.toLowerCase().includes("not")
  return isInRange
}

const detailInfoClass = (headerId: string, headers: Header[]) => {
  let cssClass = "light-yellow color-dark-yellow"
  const header = headers?.find((h) => {
    return h.id === headerId
  })
  if (props.supervisor) {
    if (header) {
      switch (header.status) {
        case "Submited":
          cssClass = "light-yellow color-dark-yellow"
          break
        case "Acknowledge":
          cssClass = "light-green color-dark-green"
          break
      }
    }
  } else {
    if (!isUndefined(header!.plannerStatus) && header!.plannerStatus) {
      cssClass = "light-green color-dark-green"
    }
  }
  return cssClass
}

const acknowledge = async (headerId: string) => {
  emits('onGetPositionY')
  camStore.setCurrent('defect')
  const isFound = store.setSMUDefectData(headerId)
  if (props.plannerApprove) {
    if (store.HeaderStatus != 'Decline') {
      store.updateHeaderDefectSMU(headerId)
    }
  }
  refHeader.value = headerId
  if (isFound) {
    showSMUDetailDialog.value = true
  }
}

const onRefreshData = () => {
  emits('onRefreshData')
}

const updateDefectDetailSMU = async (param: submitDetailParameter) => {
  await store.updateDefectDetailSMU(param.newDetail)
  param.callback()
}

const updatePlannerDefectAcknowledge = async (param) => {
  await store.updatePlannerDefectAcknowledge({
    newTitle: param.newTitle,
    smu: true
  })
  param.callback()
}

const updateDefectAcknowledge = async (param) => {
  await store.updateDefectAcknowledge({
    newTitle: param.newTitle,
    smu: true
  })
  param.callback()
}

const resetErrorStatus = () => {
  store.resetErrorStatus()
}
// based on when smu is revised
const timestamp = computed(() => {
  if (headers.value.length > 0) {
    const detail = store.ApprovalData.SMUDefectDetails.find((obj) => {
      return obj.defectHeaderId == headers.value[0].id
    }) ?? null
    if (detail) {
      return `${detail.updatedBy?.name || detail.createdBy.name}, ${detail.updatedDate != "" ? detail.updatedDate : detail.createdDate}`
    }
  }
  return ""
})
</script>
<style lang="scss">
.vcp {
  background: white;
  border: 1px solid rgba(145, 158, 171, 0.24);
  border-radius: 12px;
}
.vcp__body {
  overflow: inherit !important;
}
.letter-space-hypen {
  letter-spacing: 1.5px;
}
.testing {
  .el-collapse-item__header {
    min-height: min-content;
    height: fit-content;
    margin-bottom: 10px;
  }
}
</style>
<style lang="scss" scoped>
   @import "@/assets/sass/pages/defect.panel.scss";
   .download-icon {
    cursor: pointer;
    &.icon-{
      &red {
      filter: invert(16%) sepia(51%) saturate(7200%) hue-rotate(355deg) brightness(98%) contrast(118%);
      }
      &green {
        filter: invert(74%) sepia(57%) saturate(6500%) hue-rotate(103deg) brightness(93%) contrast(81%);
      }
    }
  }
</style>
