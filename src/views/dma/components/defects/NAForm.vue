<template>
  <el-dialog
    v-model="dialogVisible"
    width="90%"
    center
    @opened="onFormOpened"
    @closed="onFormClosed"
    custom-class="el-defect-crack-form-custom"
    :destroy-on-close="true"
  >
    <template #title>
      <span class="el-dialog__title">Not Applicable
        <template v-if="naDataHeader?.cbmNAStatus == 'Confirmed'">
          <span class="status-badge-dialog-header approved-badge p-1">Confirmed</span>
        </template>
        <template v-else-if="isDeclineStatus">
          <span class="status-badge-dialog-header declined-badge p-1">Declined</span>
        </template>
      </span>
      <span class="el-dialog__title task-title" v-if="naDataHeader" v-html="displayDesc(naDataHeader?.taskDesc, isIntervention)" ref="defectDetailRef"></span>
    </template>
    <div class="mt-1 p-2">
      <div class="d-flex flex-column">
        <h4 class="title ps-3">Reason</h4>
        <el-select
          v-model="reasonOpt"
          :disabled="true"
          class="w-100">
          <template v-for="opt in masterStore.NAConditions" :key="opt.id">
            <el-option :label="opt.naCondition" :value="opt.naCondition" />
          </template>
        </el-select>
      </div>
    </div>
    <div class="mt-1 p-2" v-if="isOthers">
      <Textarea
        :value="othersDesc"
        label="Why not applicable item task?"
        name="Reason"
        :disabled="true"
      ></Textarea>
    </div>
    <template v-if="naDataHeader?.cbmNAStatus == 'Confirmed'">
      <div class="mt-1 py-2">
        <div class="row mb-1">
          <div class="col">
            <div class="form-floating approved-text-box">
                <div class="form-control" style="white-space:break-spaces;">{{ naDataHeader?.approveReason ? (naDataHeader.approveReason || 'This information has been approved') : 'This information has been approved' }}</div>
                <label>Confirmed</label>
            </div>
            <div v-if="naDataHeader.approvedBy && naDataHeader.approvedDate" class="mb-2 text-end status-description-text-box-timestamp">{{ naDataHeader.approvedBy.name }}, {{ naDataHeader.approvedDate }}</div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="isDeclineStatus">
      <div class="mt-1 py-2">
        <div class="row mb-1">
          <div class="col">
            <div class="form-floating declined-text-box">
                <div class="form-control" style="white-space:break-spaces;">{{ naDataHeader?.declineReason }}</div>
                <label>Declined</label>
            </div>
            <div v-if="naDataHeader?.declineBy && naDataHeader?.declineDate" class="mb-2 text-end status-description-text-box-timestamp">{{ naDataHeader?.declineBy.name }}, {{ naDataHeader?.declineDate }}</div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <template v-if="!viewOnly && ((!plannerApprove && naDataHeader?.cbmNAStatus == 'Not-Confirm') || (plannerApprove && !naDataHeader?.plannerCbmNAStatus))">
        <span class="dialog-footer" style="display: flex; justify-content: space-around;">
          <el-button @click.prevent="() => toggleShowDeclineReason(true)"
            style="width: 50%; border: 1px solid #FF4842; background:white; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: #FF4842">Decline</el-button>
          <el-button class="button-OK-confirmation" type="success"
            @click.prevent="() => toggleShowApproveReason(true)"
            style="width: 50%; background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Confirm</el-button>
        </span>
      </template>
    </template>
    <DefectDecline
      :visibility="showDeclineReason"
      formTitle="Are you sure want to decline this defect information?"
      :task-title="naDataHeader?.taskDesc || ''"
      :is-intervention="isIntervention"
      @closeForm="toggleShowDeclineReason"
      @submitDecline="submitDecline"
    />

    <DefectDecline
      :visibility="showApproveReason"
      :is-approval-reason="true"
      formTitle="Are you sure want to approve this defect information?"
      :task-title="naDataHeader?.taskDesc || ''"
      :is-intervention="isIntervention"
      @closeForm="toggleShowApproveReason"
      @submitDecline="submitConfirm"
    />
    <ToastWithIcon :show="successMessageBoxVisible" :message="completeMessage" />
  </el-dialog>
  <MessageBox :show="errorMessageBoxVisible" @close="onOk" :message="errorMessage" icon="media/svg/dma/alert.svg"/>
</template>

<script lang="ts" setup>
import {
  defineProps,
  toRef,
  ref,
  computed,
  defineEmits,
  PropType,
  defineExpose
} from 'vue';
import { useMasterStore } from '@/store/pinia/dma/masters/useMasterStore'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import Textarea from '@/components/inputs/dma/Textarea.vue'
import {
  disabledHyperlink
} from '@/store/pinia/dma/e-form/helpers';
import { ElLoading } from 'element-plus'
import ToastWithIcon from "@/components/dialog/ToastWithIcon.vue";
import { Header } from '@/core/types/entities/dma/defects/Header';
import { Detail } from '@/core/types/entities/dma/defects/Detail';
import DefectDecline from "@/components/dialog/DefectDecline.vue";
import MessageBox from '@/components/dialog/MessageBox.vue'
import { NoNetworkMessages } from '@/store/enums/ErrorMessagesEnum';

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean,
  },
  naDataHeader: {
    required: true,
    type: Object as PropType<Header | undefined>
  },
  naDataDetail: {
    required: true,
    type: Object as PropType<Detail | undefined>
  },
  isIntervention: {
    required: false,
    type: Boolean,
    default: false
  },
  plannerApprove: {
    required: false,
    type: Boolean,
    default: false
  },
  viewOnly: {
    required: false,
    type: Boolean,
    default: true
  }
});

/* stores */
const masterStore = useMasterStore();

const errorMessageBoxVisible = ref(false)
const errorMessage = ref("")

/* refs */
const successMessageBoxVisible = ref(false)
const showDeclineReason = ref(false)
const showApproveReason = ref(false)
const isDecline = ref(false)

/* computeds */
const reason = computed(() => {
  return props.naDataDetail?.detail.reason || ""
})

const reasonOpt = computed(() => {
  return reason.value.split(':')[0];
});
const isOthers = computed(() => {
  return reason.value.split(':')[0].includes("Other");
});
const othersDesc = computed(() => {
  const reasonSplit = reason.value.split(':')
  if (reasonSplit.length >= 2) {
    return reasonSplit.slice(1).join(':')
  }
  return ''
});

const isDeclineStatus = computed(() => {
  return props.naDataHeader?.cbmNAStatus == 'Decline' || props.naDataHeader?.plannerCbmNAStatus == 'Decline'
})

const emits = defineEmits([
  "close",
  'onRefreshData',
  'onSubmitDecline',
  'onSubmitConfirm'
]);

const dialogVisible = toRef(props, "visibility");
const defectDetailRef = ref<HTMLElement>()

const onFormClosed = async () => {
  errorMessage.value = ''
  errorMessageBoxVisible.value = false
  emits("close");
};
const onFormOpened = () => {
  disabledHyperlink(defectDetailRef.value)
}

const toggleShowDeclineReason = (status) => {
  showDeclineReason.value = status
}

const toggleShowApproveReason = (status) => {
  showApproveReason.value = status
}

const submitDecline = async (reason) => {
  isDecline.value = true
  const loader = ElLoading.service({
    lock: true,
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  emits('onSubmitDecline', {
    headerId: props.naDataHeader && props.naDataHeader.id || '',
    reason: reason,
    afterSubmit: (IsError: boolean, errorText: string) => {
      loader.close()
      toggleShowDeclineReason(false)
      if (IsError) {
        errorMessage.value = errorText
        errorMessageBoxVisible.value = true
      } else {
        autoCloseSuccessMessageBox();
      }
    }
  })
}

const submitConfirm = async (reason = "") => {
  isDecline.value = false
  const loader = ElLoading.service({
    lock: true,
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  emits('onSubmitConfirm', {
    headerId: props.naDataHeader && props.naDataHeader.id || '',
    reason: reason || '',
    afterSubmit: (IsError: boolean, errorText: string) => {
      loader.close()
      toggleShowApproveReason(false)
      if (IsError) {
        errorMessage.value = errorText
        errorMessageBoxVisible.value = true
      } else {
        autoCloseSuccessMessageBox();
      }
    }
  })
}

const autoCloseSuccessMessageBox = () => {
  successMessageBoxVisible.value = true
  setTimeout(() => {
    successMessageBoxVisible.value = false
    onOk();
  }, 1000);
}

const completeMessage = computed(() => {
  let message = "Not Applicable Information Successfully Confirmed"
  if (isDecline.value) {
    message = "Not Applicable Information Successfully Declined"
    return message
  }
  return message
})

const onOk = () => {
  errorMessageBoxVisible.value = false
  if (errorMessage.value != NoNetworkMessages.NO_NETWORK_VIEW) {
    onFormClosed()
    emits('onRefreshData')
  }
}

const handleErrorMessage = (IsError: boolean, errorText: string) => {
  if (IsError) {
    errorMessage.value = errorText
    errorMessageBoxVisible.value = true
  }
}

defineExpose({
  handleErrorMessage
})
</script>
  <style scoped>
  .el-overlay {
    z-index: 3000 !important;
  }
  .el-dialog__title {
    text-align: start;
  }
  </style>
  <style lang="scss" scoped>
  @import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
  .hidden {
    visibility: hidden;
  }
  .title {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
  }
  .error-label {
    color: #ff4842;
    font-size: 12px;
    font-weight: 400;
  }
  .btn-add-new {
    background: transparent;
    color: #18af4a;
    border: none;
    font-weight: 700;
    font-size: 13px;
    line-height: 22px;
  }
  .form-control {
    color: black;
  }
  .form-check-input:checked {
    background-color: #18af4a;
    border-color: #18af4a;
  }
  </style>

