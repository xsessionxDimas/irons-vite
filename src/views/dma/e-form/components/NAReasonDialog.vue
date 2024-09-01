<template>
  <el-dialog
    v-if="naDetail"
    v-model="dialogVisible"
    width="90%"
    center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :lock-scroll="false"
    :before-close="onCancel"
    @opened="onFormOpened"
    @closed="onFormClosed"
    custom-class="el-defect-crack-form-custom reason-dialog"
    :destroy-on-close="true"
  >
    <template #title>
      <span class="el-dialog__title">Change Status from Not Applicable</span>
      <span class="el-dialog__title task-title" v-html="displayDesc(naDetail.title, isIntervention)" ref="defectDetailRef"></span>
    </template>
    <div>
      <div class="mt-1 p-2">
        <div class="d-flex flex-column">
          <label class="reason_skip--label">Changes Reason</label>
          <el-select
            v-model="reasonDesc"
            filterable
            @change="onReasonChange"
            class="w-100"
          >
            <template v-for="opt in options" :key="opt.id">
              <el-option :label="opt.reviseNaCondition" :value="opt.reviseNaCondition" />
            </template>
          </el-select>
          <template v-if="showOptionValidation">
            <label class="px-1 text-danger">Required</label>
          </template>
        </div>
      </div>
      <div class="mt-1 p-2" v-if="descVisibility">
        <Textarea
          label-class="dma--textarea-label reason_skip--label"
          text-class="dma--textarea-input h-100px reason_skip--text"
          :value="desc"
          label="Description <span class='red'>*</span>"
          name="Description"
          placeholder="Write Reason"
          @handleChange="onDescInput"
        ></Textarea>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer" style="display:block; text-align:right">
        <el-button @click="onCancel" style="box-shadow: 0px 24px 48px rgba(145, 158, 171, 0.2)">Cancel</el-button>
        <el-button :disabled="btnDisabled" class="button-OK-confirmation" type="success" @click.prevent="onSubmitDefects" style="background: rgb(24, 175, 74); box-shadow: rgba(0, 171, 85, 0.24) 0px 8px 16px; color: white;">Submit</el-button>
      </span>
    </template>
    <ToastWithIcon
      :show="messageBoxVisible"
      message="Data Successfully Submitted"
    />
    <Confirmation :visibility="confirmVisible"
      caption="Please confirm this is the reason you could not do the service item."
      @on-no-confirm="onCancelConfirmation"
      @on-yes-confirm="onSave" />
    <InformationPopUp :show="errorBoxVisible" @close="onErrorOk" :title-pop-up="'No internet connection'"/>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  PropType,
  computed,
  defineProps,
  onMounted,
  ref,
  toRef,
  watch,
  onUnmounted
} from 'vue'
import ToastWithIcon from '@/components/dialog/ToastWithIcon.vue'
import Confirmation from '@/components/dialog/Confirmation.vue'
import InformationPopUp from '@/components/dialog/InformationPopUp.vue'
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'
import Textarea from "@/components/inputs/dma/Textarea.vue";
import { TextareaParam } from '@/core/types/misc/TextareaParam'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import { NADetails } from '@/core/types/entities/dma/defects/NADetail'
import {
  useMasterStore
} from '@/store/pinia/dma/masters/useMasterStore'
import { NADetail } from '@/core/types/intervention/NADetail'
import { disabledHyperlink } from '@/store/pinia/dma/e-form/helpers'

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  naDetail: {
    required: true,
    type: Object as PropType<NADetails | null | NADetail>
  },
  isIntervention: {
    required: false,
    type: Boolean,
    default: false
  },
});

const emits = defineEmits(['onClose', 'onSave', 'onCancel'])

/* stores */
const globalErrorStore = useGlobalConnectionStore()
const masterStore = useMasterStore()

/* refs */
const dialogVisible = toRef(props, "visibility")
const messageBoxVisible = ref(false)
const errorBoxVisible = ref(false)
const loading = ref(false)
const reasonDesc = ref<string>("")
const desc = ref<string>("")
const descVisibility = ref<boolean>(false)
const btnDisabled = ref<boolean>(true)
const showOptionValidation = ref(false)
const confirmVisible = ref(false)
const defectDetailRef = ref(null) as any

const errorConnection = computed(() => {
  return globalErrorStore.stateSubmitConnectionError
})

watch(errorConnection, (value) => {
  if (value == true) {
    errorBoxVisible.value = true
  } else {
    errorBoxVisible.value = false
  }
})

const options = computed(() => {
  return masterStore.NAConditions
})

/* event handlers */
const onReasonChange = () => {
  if (reasonDesc.value) showOptionValidation.value = false
  descVisibility.value = reasonDesc.value.includes("Other");
  if (descVisibility.value) {
    desc.value = "";
    btnDisabled.value = true;
  } else {
    btnDisabled.value = false;
  }
}
const onDescInput = (param: TextareaParam) => {
  desc.value = param.value
  btnDisabled.value = desc.value === "";
}

const onSubmitDefects = () => {
  if (!reasonDesc.value) {
    showOptionValidation.value = true
  } else {
    confirmVisible.value = true
  }
}
const onSave = async () => {
  confirmVisible.value = false
  emits('onSave', {
    selectedReason: reasonDesc.value,
    desc: desc.value,
    afterSubmit: () => {
      messageBoxVisible.value = true
      setTimeout(() => {
        messageBoxVisible.value = false
        emits('onClose')
      }, 2000);
    }
  })
}

const onCancel = () => {
  emits('onCancel')
}

const onCancelConfirmation = () => {
  confirmVisible.value = false
}
const onErrorOk = () => {
  /* hide form */
  errorBoxVisible.value = false
  loading.value = false
}
const onFormClosed = async () => {
  reasonDesc.value = ""
  desc.value = ""
  descVisibility.value = false
  showOptionValidation.value = false
  messageBoxVisible.value = false
  errorBoxVisible.value = false
  emits('onClose')
}

const onFormOpened = () => {
  disabledHyperlink(defectDetailRef.value)
}

watch(() => {
  return props.naDetail
}, () => {
  initialValue()
}, {
  deep: true
})

const initialValue = () => {
  if (props.naDetail && props.naDetail.reason) {
    const naValue = props.naDetail.reason.split(':')
    const reviseValue = options.value.find((value) => {
      return value.naCondition == naValue[0]
    })
    if (reviseValue) {
      reasonDesc.value = reviseValue.reviseNaCondition
      if (props.naDetail.reason.includes('Other')) {
        descVisibility.value = true
        desc.value = naValue[1]
      }
    } else {
      // worst case klo misalnya ganti wording di na condition
      descVisibility.value = true
      reasonDesc.value = 'Other'
      desc.value = naValue[0]
    }
    btnDisabled.value = false;
  }
}

onMounted(() => {
  initialValue()
})

onUnmounted(() => {
  reasonDesc.value = ""
  desc.value = ""
  descVisibility.value = false
  btnDisabled.value = true
  showOptionValidation.value = false
  confirmVisible.value = false
})

</script>
<style lang="scss" scoped>
   @import "@/assets/sass/pages/defect.ori.scss";
   @import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
</style>
<style lang="scss">
  .el-dialog__title {
    text-align: start;
  }
  .reason-dialog {
  .el-input {
    .el-input__inner::placeholder {
      font-size: 15px !important;
    }
  }
  @media (max-width:900px) {
    .eform-table-row {
      .el-input {
        .el-input__inner::placeholder{
          font-size: 15px !important;
        }
      }
    }
  }
  .reason_skip {
    &--label {
      color: #212B36;
      font-size: 14px;
      font-weight: 700;
      line-height: 20px;
    }
  }
}
</style>
