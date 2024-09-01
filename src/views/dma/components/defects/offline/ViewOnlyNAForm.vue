<template>
  <el-dialog v-model="dialogVisible" width="90%" center @opened="onFormOpened" @close="onFormClosed" :destroy-on-close="true" custom-class="el-defect-crack-form-custom">
    <template #title>
      <span class="el-dialog__title">Not Applicable
        <template v-if="approvalData && approvalData.cbmNAStatus == 'Confirmed'">
          <span class="status-badge-dialog-header approved-badge p-1">Confirmed</span>
        </template>
        <template v-else-if="approvalData && approvalData.cbmNAStatus == 'Decline'">
          <span class="status-badge-dialog-header declined-badge p-1">Declined</span>
        </template>
      </span>
      <span class="el-dialog__title task-title" v-html="displayDesc(NAData.title)" ref="defectDetailRef" ></span>
    </template>
    <div class="mt-1 p-2">
      <div class="d-flex flex-column">
        <h4 class="title ps-3">Reason</h4>
        <el-select
          v-model="reasonOpt"
          :disabled="true"
          class="w-100"
        >
          <template v-for="opt in masterStore.NAConditions" :key="opt.id">
            <el-option :label="opt.naCondition" :value="opt.naCondition" />
          </template>
        </el-select>
      </div>
    </div>
    <div class="mt-1 p-2" v-if="isOthers">
      <Textarea
        :value="stringGroupExtractor(NAData.reason)"
        label="Why not applicable item task?"
        name="Reason"
        :disabled="true"
      ></Textarea>
    </div>
    <template v-if="approvalData && approvalData.cbmNAStatus == 'Confirmed'">
      <div class="mt-1 py-2">
        <div class="row mb-1">
          <div class="col">
            <div class="form-floating approved-text-box">
                <div class="form-control" style="white-space:break-spaces;">This information has been approved</div>
                <label>Confirmed</label>
            </div>
            <div v-if="approvalData.approvedBy && approvalData.approvedDate" class="mb-2 text-end status-description-text-box-timestamp">{{ approvalData.approvedBy.name }}, {{ approvalData.approvedDate }}</div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="approvalData && approvalData.cbmNAStatus == 'Decline' && approvalData.declineReason">
      <div class="mt-1 py-2">
        <div class="row mb-1">
          <div class="col">
            <div class="form-floating declined-text-box">
                <div class="form-control" style="white-space:break-spaces;">{{ approvalData.declineReason }}</div>
                <label>Declined</label>
            </div>
            <div v-if="approvalData.declineBy && approvalData.declineDate" class="mb-2 text-end status-description-text-box-timestamp">{{ approvalData.declineBy.name }}, {{ approvalData.declineDate }}</div>
          </div>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  toRef,
  ref,
  defineEmits
} from 'vue'
import {
  usePreviewNaFormStore
} from '@/store/pinia/dma/preview-form/usePreviewNaFormStore'
import { useMasterStore } from '@/store/pinia/dma/masters/useMasterStore'
import {
  useNAFormStore
} from '@/store/pinia/dma/e-form-offline/na/useNAFormStore'
import Textarea from '@/components/inputs/dma/Textarea.vue'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import { disabledHyperlink } from '@/store/pinia/dma/e-form/helpers'
import {
  stringGroupExtractor
} from "@/core/helpers/ironforms/defects-form/defect-form"
import {
  useDefectsFormStore
} from '@/store/pinia/dma/e-form-offline/defects/useDefectsFormStore'

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  }
})

const emits = defineEmits(["close"])

/* stores */
const prevStore = usePreviewNaFormStore()
const prevDefectStore = useDefectsFormStore()
const formStore = useNAFormStore()
const masterStore = useMasterStore()

/* refs */
const dialogVisible = toRef(props, "visibility")
const defectDetailRef = ref(null) as any

/* computeds */
const NAData = computed(() => {
  return prevStore.Details
})
const approvalData = computed(() => {
  return prevDefectStore.ApprovalDefect
})
const onFormOpened = () => {
  disabledHyperlink(defectDetailRef.value)
}
const reasonOpt = computed(() => {
  return NAData.value?.reason.split(':')[0]
})
const isOthers = computed(() => {
  return NAData.value?.reason.split(':')[0].includes("Other")
})
/* event handlers */
const onFormClosed = async () => {
  if (!dialogVisible.value) {
    return
  }
  console.log("terpanggil na close")
  emits("close")
  prevStore.resetInstance()
  formStore.resetInstance()
}
</script>
<style lang="scss" scoped>
   @import "@/assets/sass/pages/defect.ori.scss";
   @import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
</style>
