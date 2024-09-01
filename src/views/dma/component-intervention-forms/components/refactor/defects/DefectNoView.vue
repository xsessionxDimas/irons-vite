<template>
  <el-dialog v-model="dialogVisible" width="90%" center @closed="onFormClosed" @opened="onFormOpened" :destroy-on-close="true" :custom-class="`el-defect-crack-form-custom form-defect-no-intervention-view ${customClass}`">
    <template #title>
      <span class="el-dialog__title">Detailed Information for Defect Identification</span>
      <span class="el-dialog__title task-title" v-html="title" ref="defectDetailRef" ></span>
    </template>
      <div class="d-flex flex-row justify-content-between" v-if="reason != ''">
        <div class="mb-2 w-100">
          <div class="p-2">
            <div class="d-flex flex-column">
              <h4 class="title ps-3">Change Reason - "Not Applicable" </h4>
              <el-select
                v-model="reasonOpt"
                :disabled="true"
                class="w-100">
                <template v-for="opt in naReasonOptions" :key="opt.id">
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
      </div>
      <div class="d-flex flex-row justify-content-between">
        <div class="p-2 d-flex flex-row flex-grow-1">
          <div class="flex-fill">
            <div class="form-floating">
              <div type="text" class="form-control asset-number-disabled-div" v-html="detail.assetNumber"></div>
              <label for="floatingInput">Asset Number</label>
            </div>
          </div>
          <div class="flex-fill ps-3">
            <div class="form-floating">
              <div type="text" class="form-control asset-number-disabled-div" v-html="serialNumber"></div>
              <label for="floatingInput">Serial Number</label>
            </div>
          </div>
          <div class="flex-fill ps-3">
            <div class="form-floating">
              <div type="text" class="form-control asset-number-disabled-div" v-html="formatOwnershipHTML"></div>
              <label for="floatingInput">Ownership</label>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex flex-row justify-content-between">
        <defect-camera
          :is-monitoring="isMonitoring"
          :re-render="reRender"
          :task="task"
          :defect-images="data.images ? JSON.parse(data.images) as string[] : []"
          :show-delete-button="false"
          :type="'defect'"
          :disabled="true"
          :allow-delete="false"
          @on-image-downloaded="handleImageDownloaded"
        ></defect-camera>
      </div>
      <div class="mt-1 p-2">
        <div class="d-flex flex-column">
          <Textarea
            :value="detail.description"
            label="Defect Identified Description"
            name="DefectIdentifiedDescription"
            :disabled="true"
          ></Textarea>
        </div>
      </div>
      <div class="mt-1 p-2">
        <div class="row" style="width:101%">
            <div class="col-6 pe-0">
                <div class="form-floating">
                    <input type="text" class="form-control" disabled :value="detail.raisedBy">
                    <label>Raised By</label>
                </div>
            </div>
            <div class="col-6 pe-0">
                <div class="form-floating">
                    <input type="text" class="form-control" disabled :value="detail.date" />
                    <label>Date Raised</label>
                </div>
            </div>
        </div>
      </div>
      <div class="mt-2"></div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="actionRepaired">
        <el-collapse-item title="Repairs Completed" name="Repairs Completed">
          <div class="p-2 d-flex" v-for="action in (JSON.parse(detail?.actions) as string[])" :key="action">
            <div class="d-flex flex-fill flex-column">
              <div class="mt-2">
                <Textarea
                  :value="action"
                  label="Description of Repairs Completed"
                  name="DescriptionofRepairsCompleted"
                  :disabled="true"
                ></Textarea>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  toRef,
  PropType,
  ref,
  computed
} from 'vue'
import DefectCamera from '@/components/camera/DefectCamera.vue'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import { IDefectNoDetail } from '@/core/types/intervention/IDefectNoDetail'
import { IDetailTask } from '@/core/types/intervention/IDetailTask';
import Textarea from "@/components/inputs/dma/Textarea.vue";
import {
  handleScrollToTopOfDialog
} from '@/core/helpers/ironforms/defects-form/defect-form'
import { v4 as uuidv4 } from 'uuid';
import { ImageLoadParam } from '@/core/types/intervention/ImageLoadParam';
import {
  formatOwnership,
  disabledHyperlink
} from '@/store/pinia/dma/e-form/helpers';
import { NACondition } from '@/core/types/entities/dma/masters/NACondition';

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  task: {
    type: Object as PropType<IDetailTask>,
    required: true
  },
  data: {
    required: true,
    type: Object as PropType<IDefectNoDetail>
  },
  reRender: {
    type: Boolean,
    default: false
  },
  isMonitoring: {
    type: Boolean,
    default: false
  },
  ownership: {
    type: String,
    default: "",
  },
  serialNumber: {
    type: String,
    default: "",
  },
  generic: {
    required: false,
    type: Boolean,
    default: false
  },
  naReasonOptions: {
    required: true,
    type: Array as PropType<NACondition[]>,
  },
})

const emits = defineEmits([
  'onClose',
  'onImageDownloaded'
])

/* refs */
const actionRepaired = ref('Repairs Completed')
const dialogVisible = toRef(props, "visibility")
const detail = toRef(props, "data")
const defectDetailRef = ref<HTMLElement>()
const customClass = ref(uuidv4())

const reason = computed(() => {
  let reason = "";
  if (props.task.reason) {
    reason = props.task.reason;
  }
  return reason;
})

const reasonOpt = computed(() => {
  return reason.value.split(':')[0]
})
const isOthers = computed(() => {
  return reason.value.split(':')[0].includes("Other")
})
const othersDesc = computed(() => {
  return reason.value.split(':')[1]
})

/* event handlers */
const onFormClosed = async () => {
  emits("onClose", null)
}
const onFormOpened = () => {
  try {
    disabledHyperlink(defectDetailRef.value)
    handleScrollToTopOfDialog(customClass.value)
  } catch (error) {
    console.log(error)
  }
}
const handleImageDownloaded = (image: ImageLoadParam) => {
  emits('onImageDownloaded', image)
}
const formatOwnershipHTML = computed(() => {
  const ownership = props.ownership
  return formatOwnership(ownership)
})
const title = computed(() => {
  if (props.generic) {
    return detail.value?.title
  }
  return displayDesc(detail.value?.title, true)
})
</script>
<style lang="scss" scoped>
 @import "@/assets/sass/pages/defect.ori.scss";
 @import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
</style>
