<template>
   <el-dialog v-model="show"
    :custom-class="'defectform el-defect-crack-form-custom'"
    width="50%" center
    @closed="onFormClosed"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape = "false"
    :destroy-on-close="true">
    <template #title>
      <span class="el-dialog__title" style="word-break: break-word !important;">{{ formTitle }}</span>
      <template v-if="!isGeneric">
        <span class="el-dialog__title task-title" style="word-break: break-word !important;" v-html="displayDesc(taskTitle, isIntervention)" ref="defectDetailRef" ></span>
      </template>
      <template v-else>
        <span class="el-dialog__title task-title" style="word-break: break-word !important;" v-html="taskTitle" ref="defectDetailRef" ></span>
      </template>
    </template>
    <div>
      <div class="mt-1 py-2" style="word-break: break-word !important;">
        <div class="d-flex flex-column">
          <Textarea
            :value="declineVal"
            :label="property.textAreaLabel"
            :name="property.textAreaName"
            :max="255"
            @handleChange="onDeclineReasonChange"
          ></Textarea>
        </div>
      </div>
      <div class="row pt-5 justify-content-end">
      <div class="col-md-2 col-2">
        <div class="row px-0 justify-content-end px-1">
          <el-button type="success" class="ok-button" style="background-color: white; color: black; border: 1px solid gainsboro;" @click="onFormClosed">{{ property.buttonLabelCancel }}</el-button>
        </div>
      </div>
      <div class="col-md-3 col-lg-2 col-3">
        <div class="row px-0 justify-content-end px-1">
          <el-button :disabled="isDisabledCondition" :type="property.buttonTypeSubmit" :class="property.buttonClassSubmit" @click="submitDecline">{{ property.buttonLabelSubmit }}</el-button>
        </div>
      </div>
    </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  computed,
  ref,
} from 'vue'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import Textarea from "@/components/inputs/dma/Textarea.vue";
import { TextareaParam } from '@/core/types/misc/TextareaParam'

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  formTitle: {
    required: true,
    type: String
  },
  taskTitle: {
    required: true,
    type: String
  },
  isIntervention: {
    required: false,
    type: Boolean,
    default: false
  },
  isGeneric: {
    required: false,
    type: Boolean,
    default: false
  },
  isApprovalReason: {
    required: false,
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['closeForm', 'submitDecline'])

const declineVal = ref("")

const declineProperty = {
  buttonLabelSubmit: "Decline",
  buttonClassSubmit: "danger-btn",
  buttonTypeSubmit: "danger",
  buttonLabelCancel: "No",
  textAreaLabel: "Declined Reason <span class='text-danger'>*</span>",
  textAreaName: "Decline Reason",
}

const approveProperty = {
  buttonLabelSubmit: "Approve",
  buttonClassSubmit: "approval-btn",
  buttonTypeSubmit: "success",
  buttonLabelCancel: "No",
  textAreaLabel: "Approved Reason",
  textAreaName: "Approve Reason",
}

const property = computed(() => {
  if (props.isApprovalReason) {
    return approveProperty
  }
  return declineProperty
})

const isDisabledCondition = computed(() => {
  if (!props.isApprovalReason) {
    return declineVal.value == ''
  }
  return false
})

const show = computed(() => {
  return props.visibility
})

const submitDecline = () => {
  emits('submitDecline', declineVal.value)
}

const onFormClosed = () => {
  declineVal.value = ""
  emits('closeForm', false)
}

const onDeclineReasonChange = (param : TextareaParam) => {
  declineVal.value = param.value
}
</script>

<style lang="scss" scoped>
  .danger-btn {
    background-color: #FF4842;
    &:disabled {
      opacity: 0.5;
    }
  }
  .approval-btn {
    background:#18AF4A;
    &:disabled {
      opacity: 0.5;
    }
  }
  .el-dialog__title {
    display: block !important;
    font-size: 13px  !important;
    font-weight: 800  !important;
    text-align: left;
  }
</style>
