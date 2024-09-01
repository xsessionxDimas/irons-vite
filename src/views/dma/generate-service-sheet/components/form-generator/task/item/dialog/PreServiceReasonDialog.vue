<template>
  <el-dialog
    v-model="dialogVisible"
    width="90%"
    center
    :lock-scroll="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="onCancel"
    @closed="onFormClosed"
    custom-class="el-defect-crack-form-custom reason-dialog"
    :destroy-on-close="true"
  >
    <template #title>
      <span class="el-dialog__title">Are you sure you want to skip these checks first?</span>
      <span class="el-dialog__title task-title">Please provide a reason as to why the Pre-Service Operational Checks could not be done at the start of this service.</span>
    </template>
    <div>
      <div class="mt-1 p-2">
        <div class="d-flex flex-column">
          <label class="reason_skip--label">Reason <span class='red'>*</span></label>
          <el-select
            v-model="reasonDesc"
            filterable
            @change="onReasonChange"
            class="w-100"
          >
            <template v-for="opt in options" :key="opt.id">
              <el-option :label="opt" :value="opt" />
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
    <ToastWithIcon :show="messageBoxVisible"
      message="You may now proceed to enter other service sections before completing the pre-service operational checks."
    />
    <InformationPopUp :show="errorBoxVisible" @close="onErrorOk" :title-pop-up="'No internet connection'"/>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  PropType,
  computed,
  defineProps,
  ref,
  toRef,
  watch
} from 'vue'
import InformationPopUp from '@/components/dialog/InformationPopUp.vue'
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'
import Textarea from "@/components/inputs/dma/Textarea.vue";
import { TextareaParam } from '@/core/types/misc/TextareaParam'
import ToastWithIcon from '@/components/dialog/ToastWithIcon.vue';

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  options: {
    required: false,
    type: Array as PropType<string[]>,
    default: [] as string[]
  }
});

const emits = defineEmits(['onClose', 'onSave', 'onCancel'])

/* stores */
const globalErrorStore = useGlobalConnectionStore()

/* refs */
const dialogVisible = toRef(props, "visibility")
const messageBoxVisible = ref(false)
const errorBoxVisible = ref(false)
const loading = ref(false)
const desc = ref<string>("")
const btnDisabled = ref<boolean>(true)
const showOptionValidation = ref(false)
const reasonDesc = ref<string>("")
const descVisibility = ref<boolean>(false)

const errorConnection = computed(() => {
  return globalErrorStore.stateSubmitConnectionError
})

watch(errorConnection, (value) => {
  if (value == true) {
    errorBoxVisible.value = true
  }
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
    onSave()
  }
}
const onSave = async () => {
  emits('onSave', {
    reason: `${reasonDesc.value};;${desc.value}`,
    showToast() {
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
const onErrorOk = () => {
  /* hide form */
  errorBoxVisible.value = false
  loading.value = false
}
const onFormClosed = async () => {
  desc.value = ""
  showOptionValidation.value = false
  messageBoxVisible.value = false
  errorBoxVisible.value = false
  emits('onClose')
}
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
