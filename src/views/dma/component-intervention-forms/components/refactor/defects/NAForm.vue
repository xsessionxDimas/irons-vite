<template>
  <el-dialog v-model="isVisible" width="90%"
    center
    @closed="onFormClosed"
    @opened="onFormOpened"
    custom-class="el-defect-crack-form-custom"
    :destroy-on-close="true"
  >
    <template #title>
      <span class="el-dialog__title">Not Applicable</span>
      <span class="el-dialog__title task-title" v-html="displayDesc(title, true)" ref="defectDetailRef" ></span>
    </template>
    <div>
      <div class="mt-1 p-2">
        <div class="d-flex flex-column">
          <label>Why could you not complete the required service item?</label>
          <el-select
              v-model="naReason"
              filterable
              @change="onReasonChange"
              class="w-100">
              <template v-for="opt in conditions" :key="opt.id">
                <el-option :label="opt.naCondition" :value="opt.naCondition" />
              </template>
          </el-select>
        </div>
      </div>
      <div class="mt-1 p-2" v-if="descVisible">
        <Textarea
          :value="naDesc"
          label="Description"
          name="InstructionPlaceholder"
          errorMessage="Required"
          :is-valid="naReasonInvalid"
          @handleChange="onDescInput"
        ></Textarea>
      </div>
      <div class="my-5 w-100">
        <button class="btn btn-success w-100" @click="onSubmitNA" :disabled="btnDisabled"
        style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Submit</button>
      </div>
    </div>
  </el-dialog>
  <Confirmation :visibility="confirmVisible"
    caption="Please confirm this is the reason you could not do the service item."
    @on-no-confirm="onCancel"
    @on-yes-confirm="onConfirmSubmit" />
</template>

<script lang="ts" setup>
import { IDetailTask } from '@/core/types/intervention/IDetailTask'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import Confirmation from '@/components/dialog/Confirmation.vue'
import Textarea from '@/components/inputs/dma/Textarea.vue'

import {
  defineProps,
  defineEmits,
  PropType,
  computed,
  ref,
  toRef
} from 'vue'
import { NAFormData } from '@/core/types/intervention/NAFormData'
import { NACondition } from '@/core/types/entities/dma/masters/NACondition'
import { TextareaParam } from '@/core/types/misc/TextareaParam'
import { getTitle, disabledHyperlink } from '@/store/pinia/dma/e-form/helpers'

const props = defineProps({
  task: {
    type: Object as PropType<IDetailTask>,
    required: true
  },
  visibility: {
    type: Boolean,
    required: true
  },
  conditions: {
    type: Array as PropType<NACondition[]>
  }
})

const emits = defineEmits(['onSubmit', 'onCancel', 'onClose'])

const isVisible = toRef(props, 'visibility')
/* form model */
const naReason = ref('')
const naReasonInvalid = ref(true)
const descVisible = ref(false)
const naDesc = ref('')
const btnDisabled = ref<boolean>(true)
/* dialogs */
const confirmVisible = ref(false)
const defectDetailRef = ref(null) as any

const title = computed(() => {
  return getTitle(props.task)
})

/* methods and handlers */
const onReasonChange = () => {
  descVisible.value = naReason.value.includes('Other')
  btnDisabled.value = naReason.value.includes('Other')
}
const onDescInput = (param: TextareaParam) => {
  naDesc.value = param.value
  btnDisabled.value = naDesc.value == ''
}
const onSubmitNA = () => {
  confirmVisible.value = true
}
const onConfirmSubmit = () => {
  const formData = {} as NAFormData
  formData.reason = naReason.value
  formData.reasonDesc = naDesc.value
  formData.taskDesc = props.task.description
  formData.taskNo = props.task.interventionSequence as string
  emits('onSubmit', formData)
  confirmVisible.value = false
}
const onCancel = () => {
  confirmVisible.value = false
}
const onFormClosed = async () => {
  emits('onClose', null)
}
const onFormOpened = () => {
  /* reset form */
  naReason.value = ''
  naReasonInvalid.value = true
  descVisible.value = false
  naDesc.value = ''
  btnDisabled.value = true
  disabledHyperlink(defectDetailRef.value)
}
</script>

<style lang="scss" scoped>
   @import "@/assets/sass/pages/defect.ori.scss";
   @import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
</style>
<style>
  .el-dialog__title {
    text-align: start;
  }
</style>
