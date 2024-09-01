<template>
  <el-dialog v-model="dialogVisible" width="90%" center @opened="onFormOpened" @closed="onFormClosed" :destroy-on-close="true" custom-class="el-defect-crack-form-custom">
    <template #title>
      <span class="el-dialog__title">Not Applicable
        <template v-if="status == 'Confirmed'">
          <span class="status-badge-dialog-header approved-badge p-1">Confirmed</span>
        </template>
        <template v-else-if="status == 'Decline'">
          <span class="status-badge-dialog-header declined-badge p-1">Declined</span>
        </template>
      </span>
      <span class="el-dialog__title task-title" v-html="displayDesc(title, true)" ref="defectDetailRef" ></span>
    </template>
    <div class="mt-1 p-2">
      <div class="d-flex flex-column">
        <h4 class="title ps-3">Reason</h4>
        <el-select
            v-model="reason"
            :disabled="true"
            class="w-100">
            <template v-for="opt in conditions" :key="opt.id">
              <el-option :label="opt.naCondition" :value="opt.naCondition" />
            </template>
        </el-select>
      </div>
    </div>
    <div class="mt-1 p-2" v-if="isOthers">
      <Textarea
        :value="otherReason"
        label="Why not applicable item task?"
        name="Reason"
        :disabled="true"
      ></Textarea>
    </div>
    <template v-if="status == 'Confirmed'">
      <div class="mt-1 py-2">
        <div class="row mb-1">
          <div class="col">
            <div class="form-floating approved-text-box">
                <div class="form-control" style="white-space:break-spaces;">This information has been approved</div>
                <label>Confirmed</label>
            </div>
            <div v-if="approvedBy && approvedDate" class="mb-2 text-end status-description-text-box-timestamp">{{ approvedBy.name }}, {{ approvedDate }}</div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="status == 'Decline' && declineData">
      <div class="mt-1 py-2">
        <div class="row mb-1">
          <div class="col">
            <div class="form-floating declined-text-box">
                <div class="form-control" style="white-space:break-spaces;">{{ declineData.declineReason }}</div>
                <label>Declined</label>
            </div>
            <div v-if="declineData.declineBy && declineData.declineDate" class="mb-2 text-end status-description-text-box-timestamp">{{ declineData.declineBy.name }}, {{ declineData.declineDate }}</div>
          </div>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { NADetail } from '@/core/types/intervention/NADetail'
import {
  defineProps,
  defineEmits,
  PropType,
  computed,
  toRef,
  ref
} from 'vue'
import { NACondition } from '@/core/types/entities/dma/masters/NACondition'
import Textarea from "@/components/inputs/dma/Textarea.vue";
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import { disabledHyperlink } from '@/store/pinia/dma/e-form/helpers'
import { Audit } from '@/core/types/intervention/Audit'
import { Decline } from '@/core/types/intervention/Decline';

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  data: {
    required: true,
    type: Object as PropType<NADetail>
  },
  approvedBy: {
    required: false,
    type: Object as PropType<Audit>,
    default: {} as Audit
  },
  approvedDate: {
    required: false,
    type: String,
    default: ""
  },
  declineData: {
    required: false,
    type: Object as PropType<Decline>,
    default: {} as Decline
  },
  status: {
    required: false,
    type: String,
  },
  conditions: {
    type: Array as PropType<NACondition[]>
  }
})
const emits = defineEmits(['onClose'])
const defectDetailRef = ref(null) as any

const dialogVisible = toRef(props, "visibility")
const detail = computed(() => {
  return props.data
})
const isOthers = computed(() => {
  return detail.value && detail.value.reason && detail.value.reason.split(':')[0].includes("Other")
})
const reason = computed(() => {
  return detail.value && detail.value.reason && detail.value.reason.split(':')[0]
})
const otherReason = computed(() => {
  const reason = detail.value.reason?.split(':')
  if (reason.length >= 2) {
    return reason.slice(1).join(':')
  }
  return ''
})
const onFormClosed = async () => {
  emits("onClose", null)
}
const onFormOpened = () => {
  disabledHyperlink(defectDetailRef.value)
}
const title = computed(() => {
  if (detail.value && detail.value.title) {
    return detail.value.title.split(";")[2]
  }
  return ''
})
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
