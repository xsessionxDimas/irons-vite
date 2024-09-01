<template>
  <el-dialog v-model="dialogVisible" width="90%" center @opened="onFormOpened" @closed="onFormClosed" :destroy-on-close="true" custom-class="el-defect-crack-form-custom">
    <template #title>
      <span class="el-dialog__title">Change Status from Not Applicable</span>
      <span class="el-dialog__title task-title" v-html="displayDesc(titleDescription, isIntervention)" ref="defectDetailRef" ></span>
    </template>
    <div class="mt-1 p-2">
      <div class="d-flex flex-column">
        <h4 class="title ps-3">Changes Reason</h4>
        <el-select
          v-model="reasonOpt"
          :disabled="true"
          class="w-100"
        >
          <template v-for="opt in masterStore.NAConditions" :key="opt.id">
            <el-option :label="opt.reviseNaCondition" :value="opt.naCondition" />
          </template>
        </el-select>
      </div>
    </div>
    <div class="mt-1 p-2" v-if="isOthers">
      <Textarea
        :value="othersDesc"
        label="Description <span class='red'>*</span>"
        name="Description"
        placeholder="Write Reason"
        :disabled="true"
      ></Textarea>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  ref
} from 'vue'
import { useMasterStore } from '@/store/pinia/dma/masters/useMasterStore'
import Textarea from '@/components/inputs/dma/Textarea.vue'
import { displayDesc } from '@/core/helpers/manipulate-html-string';
import {
  useNAReasonViewStore
} from "@/store/pinia/dma/e-form/na/useNAReasonViewStore";
import { disabledHyperlink } from '@/store/pinia/dma/e-form/helpers'

defineProps({
  isIntervention: {
    required: false,
    type: Boolean,
    default: false
  }
})

/* stores */
const masterStore = useMasterStore();
const naReasonView = useNAReasonViewStore();
const defectDetailRef = ref(null) as any

/* refs */
const dialogVisible = computed(() => {
  return naReasonView.visible
})
const title = computed(() => {
  return naReasonView.title
})
const reason = computed(() => {
  return naReasonView.reason
})
/* computeds */
const reasonOpt = computed(() => {
  return reason.value.split(':')[0]
})
const isOthers = computed(() => {
  return reason.value.split(':')[0].includes("Other")
})
const othersDesc = computed(() => {
  const reasons = reason.value.split(':')
  if (reasons.length > 2) {
    return reasons.slice(1).join(':')
  }
  return ''
})
const titleDescription = computed(() => {
  return title.value
})
/* event handlers */
const onFormClosed = async () => {
  naReasonView.resetInstance()
}
const onFormOpened = () => {
  disabledHyperlink(defectDetailRef.value)
}
</script>
<style lang="scss" scoped>
   @import "@/assets/sass/pages/defect.ori.scss";
   @import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
</style>
