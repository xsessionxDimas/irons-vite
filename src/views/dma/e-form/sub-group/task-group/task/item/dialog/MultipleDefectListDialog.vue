<template>
  <el-dialog
    v-model="dialogVisible"
    width="90%"
    center
    :lock-scroll="false"
    :before-close="onFormCancel"
    @opened="onFormOpened"
    @closed="onFormClosed"
    custom-class="el-defect-crack-form-custom multi-defect-list-dialog"
    :destroy-on-close="true"
  >
    <template #title>
      <div class="d-flex align-items-center">
        <span class="el-dialog__title">Defect Identified</span>
        <div class="ms-2 multiple-defect-badge">
          <img src="/media/logos/bumaau/detail.png" alt="defect" class="d-icon" />
          <span>+{{ defectList.length }}</span>
        </div>
      </div>
      <span class="el-dialog__title task-title" v-html="displayDesc(title)" ref="defectDetailRef"></span>
    </template>
    <div>
      <div class="mb-2" v-if="reason != ''">
        <div class="p-2">
          <div class="d-flex flex-column">
            <h4 class="title ps-3">Change Reason - "Not Applicable" </h4>
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
      </div>
      <div class="multi-defect-list-item py-2 d-flex align-items-center cursor-pointer" v-for="defect in defectList" :key="defect.id" @click="onDefectDetailClick(defect)">
        <div class="multi-icon">
          <img src="/media/logos/bumaau/defect.png" alt="defect" class="d-icon" />
        </div>
        <div class="multi-description">
          <span style="white-space: pre-wrap;">{{ defect.detail.description }}</span>
        </div>
      </div>
    </div>
    <template #footer v-if="!isDisabled">
      <div @click="onAddDefectDetail" class="add-button cursor-pointer">+ Add Another Defect</div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  PropType,
  defineProps,
  toRef,
  computed,
  ref
} from 'vue'
import { MultipleDefectList } from "@/database/schema/MultipleDefectList"
import { useMasterStore } from '@/store/pinia/dma/masters/useMasterStore'
import Textarea from "@/components/inputs/dma/Textarea.vue";
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import { disabledHyperlink } from '@/store/pinia/dma/e-form/helpers'

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  defectList: {
    required: false,
    type: Array as PropType<MultipleDefectList[]>,
    default: [] as MultipleDefectList[]
  },
  isDisabled: {
    required: true,
    type: Boolean,
  },
  reason: {
    required: false,
    type: String,
    default: ''
  }
});

const emits = defineEmits([
  'onClose',
  'onOpenDetail',
  'onCancel',
  'onAddDefect'
])

/* refs */
const dialogVisible = toRef(props, "visibility")
const masterStore = useMasterStore();
const defectDetailRef = ref(null) as any


const onFormClosed = async () => {
  emits('onClose')
}

const onFormCancel = async () => {
  emits('onCancel')
}

const title = computed(() => {
  if (props.defectList && props.defectList.length >= 1) {
    return props.defectList[0].detail.title
  }
  return ""
})

const reasonOpt = computed(() => {
  return props.reason.split(':')[0]
})
const isOthers = computed(() => {
  return props.reason.split(':')[0].includes("Other")
})
const othersDesc = computed(() => {
  return props.reason.split(':')[1]
})

const onDefectDetailClick = async (defect) => {
  emits('onOpenDetail', defect)
}

const onAddDefectDetail = async () => {
  emits('onAddDefect')
}

const onFormOpened = () => {
  disabledHyperlink(defectDetailRef.value)
}
</script>
<style lang="scss" scoped>
   @import "@/assets/sass/pages/defect.ori.scss";
   @import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
</style>
<style lang="scss">
  // .el-overlay {
  //   z-index: 10 !important;
  // }
  .el-dialog__title {
    text-align: start;
  }
</style>

<style lang="scss" scoped>
@import "@/assets/sass/pages/icon-list.dialog.scss";
</style>
