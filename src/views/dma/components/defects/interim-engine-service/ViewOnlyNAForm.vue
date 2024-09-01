<template>
  <el-dialog v-model="dialogVisible" width="90%" center @opened="onFormOpened" @closed="onFormClosed" :destroy-on-close="true" custom-class="el-defect-crack-form-custom">
    <template #title>
      <span class="el-dialog__title">Not Applicable
        <template v-if="approvalData && approvalData.cbmNAStatus == 'Confirmed'">
          <span class="status-badge-dialog-header approved-badge p-1">Confirmed</span>
        </template>
        <template v-else-if="approvalData && approvalData.cbmNAStatus == 'Decline'">
          <span class="status-badge-dialog-header declined-badge p-1">Declined</span>
        </template>
      </span>
      <span class="el-dialog__title task-title" v-html="title" ref="defectDetailRef" ></span>
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
  defineEmits,
  ref
} from 'vue'
import {
  useInterimPreviewNaFormStore
} from '@/store/pinia/dma/preview-form-interim/useInterimPreviewNaFormStore'
import {
  useInterimPreviewDefectFormStore
} from '@/store/pinia/dma/preview-form-interim/useInterimPreviewDefectFormStore'
import { useMasterStore } from '@/store/pinia/dma/masters/useMasterStore'
import {
  useInterimNAFormStore
} from '@/store/pinia/dma/interim-engine-service/na/useInterimNAFormStore'
import Textarea from "@/components/inputs/dma/Textarea.vue";
import { disabledHyperlink } from '@/store/pinia/dma/e-form/helpers'

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  }
})

const emits = defineEmits(["close"])

/* stores */
const prevStore = useInterimPreviewNaFormStore()
const prevDefectStore = useInterimPreviewDefectFormStore()
const formStore = useInterimNAFormStore()
const masterStore = useMasterStore()
const defectDetailRef = ref(null) as any

/* refs */
const dialogVisible = toRef(props, "visibility")
/* computeds */
const NAData = computed(() => {
  return prevStore.Details
})
const approvalData = computed(() => {
  return prevDefectStore.ApprovalDefect
})
const title = computed(() => {
  if (NAData.value?.title) {
    if (NAData.value.title != "") {
      if (NAData.value?.title.includes(';;')) {
        return NAData.value?.title.split(';;')[1]
      } else if (NAData.value?.title.includes(';')) {
        const captions = [] as string[]
        if (NAData.value.title.includes('|')) {
          NAData.value.title.split('|').forEach((c) => {
            captions.push(c.split('')[2])
          })
          return captions.join(', ')
        } else if ((NAData.value.title.match(/;/g) || []).length == 2) {
          return `${NAData.value?.title.split(';')[1]}. ${NAData.value?.title.split(';')[2]}`
        }
      }
    }
  }
  return NAData.value?.title
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
const othersDesc = computed(() => {
  const reason = NAData.value?.reason.split(':')
  if (reason.length >= 2) {
    return reason.slice(1).join(':')
  }
  return ''
})
/* event handlers */
const onFormClosed = async () => {
  emits("close")
  prevStore.resetInstance()
  formStore.resetInstance()
}
</script>
<style lang="scss" scoped>
   @import "@/assets/sass/pages/defect.ori.scss";
   @import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
</style>
