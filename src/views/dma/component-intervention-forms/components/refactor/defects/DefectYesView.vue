<template>
    <el-dialog v-model="dialogVisible"
    width="90%" center @closed="onFormClosed"
    @opened="onFormOpened"
    :destroy-on-close="true"
    :custom-class="`el-defect-crack-form-custom form-defect-yes-intervention-view ${customClass}`">
      <template #title>
        <span class="el-dialog__title">Detailed Information for Defect Identification
          <template v-if="decline?.isDecline">
            <span class="red-bg text-dark-red p-1">Declined</span>
          </template>
          <template v-else-if="approvedBy && approvedDate">
              <span class="status-badge-dialog-header approved-badge p-1">Approved</span>
          </template>
        </span>
        <span class="el-dialog__title task-title" v-html="displayDesc(detail?.title, true)" ref="defectDetailRef" ></span>
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
      <div>
        <template v-if="decline?.isDecline">
          <div class="mt-1 py-2">
            <div class="d-flex flex-column">
              <div class="row mb-1">
                <div class="col">
                  <div class="form-floating declined-text-box">
                      <div class="form-control">{{ decline?.declineReason }}</div>
                      <label>Declined Reason*</label>
                  </div>
                </div>
              </div>
              <div v-if="decline && decline.declineBy && decline.declineDate" class="mb-2 text-end">
                {{ decline.declineBy.name }}, {{ decline.declineDate }}
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="approvedBy && approvedDate">
          <div class="mt-1 py-2">
            <div class="row mb-1">
              <div class="col">
                <div class="form-floating approved-text-box" v-if="approvedBy && approvedDate">
                    <div class="form-control" style="white-space:break-spaces;">{{ approvedDate }} — {{ approvedBy.name }}</div>
                    <label>Approved</label>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="d-flex flex-row justify-content-between">
          <div class="p-2 d-flex flex-row flex-grow-1">
            <div class="flex-fill">
              <div class="form-floating">
                <div type="text" class="form-control asset-number-disabled-div" v-html="detail?.assetNumber"></div>
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
          :task="task"
          :is-monitoring="isMonitoring"
          :re-render="reRender"
          :defect-images="images"
          :show-delete-button="false"
          :type="'defect'"
          :disabled="true"
          :allow-delete="false"
          @on-image-downloaded="handleImageDownloaded" />
        </div>
        <div class="mt-1 p-2">
          <Textarea
            :value="detail?.description"
            label="Defect Identified Description"
            name="DefectIdentifiedDescription"
            :disabled="true"
          ></Textarea>
        </div>
        <div class="mt-1 p-2">
            <div class="row">
                <div class="col pe-0">
                    <div class="form-floating">
                        <input type="text" class="form-control" disabled :value="detail?.raisedBy">
                        <label>Raised By</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-1 p-2">
          <div class="row">
            <div class="col-4 pe-0 date">
              <div class="form-floating">
                  <input type="text" class="form-control" disabled :value="detail?.date" />
                  <label>Date Raised</label>
              </div>
            </div>
            <div class="col pe-0 d-flex">
                <div class="d-flex flex-column flex-fill">
                  <div class="form-floating">
                    <input type="text" class="form-control" :value="formatNumberWithComma(detail?.plannedDuration)" disabled />
                    <label class="text-nowrap">How long will this defect repair take?</label>
                  </div>
                </div>
                <div class="ms-2 d-flex align-items-center">
                  <Label>Hours</Label>
                </div>
            </div>
          </div>
        </div>
        <div class="mt-1 p-2">
          <Textarea
            :value="detail?.instruction"
            label="Defect Identified instruction"
            name="DefectIdentifiedInstruction"
            :disabled="true"
          ></Textarea>
        </div>
        <div class="mt-2"></div>
        <el-collapse class="task-group general-accordion py-1 px-5" v-model="priorityCollapse ">
          <el-collapse-item title="Priority" name="Priority">
            <div class="row p-3 m-1 priority-container" style="background: #F4F6F8; border-radius: 8px;">
                <div class="col-3">Priority</div>
                <div class="col-6">Action</div>
                <div class="col-3 text-break">Person Responsible</div>
              </div>
              <div class="row p-3 m-1 priority-container">
                <div class="col-3">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="detail.priority" value="P1" disabled>
                    <label class="form-check-label text-nowrap">
                      (P1) Immediate
                    </label>
                  </div>
                </div>
                <div class="col-6">Shall shut machine down and undertake repairs.</div>
                <div class="col-3 text-break">Maintenance Supervisor</div>
              </div>
              <div class="row p-3 m-1 priority-container">
                <div class="col-3">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="detail.priority" value="P2" disabled>
                    <label class="form-check-label text-nowrap">
                      (P2) Urgent
                    </label>
                  </div>
                </div>
                <div class="col-6">Shall complete within 7 days.</div>
                <div class="col-3 text-break">Maintenance Supervisor</div>
              </div>
              <div class="row p-3 m-1 priority-container">
                <div class="col-3">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="detail.priority" value="P3" disabled>
                    <label class="form-check-label text-nowrap">
                      (P3) Routine
                    </label>
                  </div>
                </div>
                <div class="col-6">Shall complete within 60 days.</div>
                <div class="col-3 text-break">Maintenance Planner</div>
              </div>
              <div class="row p-3 m-1 priority-container">
                <div class="col-3">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="detail.priority" value="P4" disabled>
                    <label class="form-check-label text-nowrap">
                      (P4) Monitor
                    </label>
                  </div>
                </div>
                <div class="col-6">Shall continue to inspect and monitor for 90 days.</div>
                <div class="col-3 text-break">Maintenance Planner</div>
              </div>
          </el-collapse-item>
        </el-collapse>
        <div class="mt-2"></div>
        <el-collapse class="task-group general-accordion py-1 px-5" v-model="partsRequiredCollapse">
          <el-collapse-item title="Parts Required" name="Parts Required">
            <div class="row p-3 m-1 priority-container" style="background: #F4F6F8; border-radius: 8px;">
                <div class="col-3">Part Number</div>
                <div class="col-5">Part Description</div>
                <div class="col-1">Qty</div>
                <div class="col"></div>
                <div class="col"></div>
              </div>
              <div class="row p-3 m-1 priority-container px-0" v-for="item in parts" :key="item.partNumber">
                <div class="col-3 px-0">
                  <div class="d-flex flex-column">
                    <input type="text" class="form-control" :value="item.partNumber" disabled />
                  </div>
                </div>
                <div class="col-5">
                  <div class="d-flex flex-column">
                    <input type="text" class="form-control" :value="item.partDescription" disabled />
                  </div>
                </div>
                <div class="col-1 px-1 d-flex justify-content-start">
                  <div class="d-flex flex-column">
                    <input class="form-control" :value="formatNumberWithComma(item.qty)" disabled />
                  </div>
                  <div class="ms-4 d-flex align-items-center">
                  </div>
                </div>
                <div class="col px-1 d-flex flex-column justify-content-start">
                  <div class="row p-0 m-0 h-100 w-100 align-items-center">
                    <SmallCamera :item-value="item.images || []" :is-disabled="true" />
                  </div>
                </div>
                <div class="col px-1 d-flex flex-column justify-content-start position-relative">
                  <div class="row p-0 m-0 h-100 w-100 align-items-center">
                    <UploadAttachment :item-value="item.attachment || []" :is-disabled="true" />
                  </div>
                </div>
              </div>
          </el-collapse-item>
        </el-collapse>
        <div class="mt-2"></div>
        <el-collapse class="task-group general-accordion py-1 px-5" v-model="labourRequired ">
          <el-collapse-item title="Labour Required" name="Labour Required">
            <div class="row p-3 m-1 priority-container" style="background: #F4F6F8; border-radius: 8px;">
                <div class="col-6">Labour Activity</div>
                <div class="col-2">Qty</div>
                <div class="col-2 word-breaker">Hours Each</div>
                <div class="col-2 word-breaker">Total Hours</div>
            </div>
            <div class="row p-3 m-1 priority-container ps-0" v-for="(item) in labours" :key="item.position">
                <div class="col-6 px-0">
                  <div class="d-flex flex-column">
                    <select class="form-select" aria-label="Disabled select example" disabled>
                      <option selected>{{ item.position }}</option>
                    </select>
                  </div>
                </div>
                <div class="col-2  d-flex justify-content-start">
                  <div class="d-flex flex-column">
                    <input class="form-control" :value="formatNumberWithComma(item.qty)"
                    disabled />
                  </div>
                </div>
                <div class="col-2 d-flex justify-content-start">
                  <div class="d-flex flex-column">
                    <input class="form-control" :value="formatNumberWithComma(item.hireEach)"
                    disabled />
                  </div>
                </div>
                <div class="col-2 d-flex justify-content-start">
                  <div class="d-flex flex-column">
                    <input class="form-control" :value="formatNumberWithComma(item.totalHours)"
                    disabled />
                  </div>
                </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="mt-2"></div>
        <el-collapse class="task-group general-accordion py-1 px-5" v-model="otherResourceCollapse">
          <el-collapse-item title="Other Resources Required (optional)" name="Other Resources Required (optional)">
            <div class="p-2 d-flex" v-for="item in resources" :key="item">
              <div class="d-flex flex-fill flex-column">
                <input type="text" class="form-control" :value="item" placeholder="Resource1" disabled />
              </div>
              <div class="ms-4 d-flex align-items-center">
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="mt-2"></div>
        <el-collapse class="task-group general-accordion py-1 px-5" v-model="defectSysmptompCollapse">
          <el-collapse-item title="Defect Symptom" name="Defect Symptom">
            <div class="p-2 d-flex" v-for="item in symptoms" :key="item">
              <div class="d-flex flex-fill flex-column">
                  <el-select
                      v-model="item.split(':')[0]"
                      :disabled="true"
                      class="w-100">
                      <template v-for="opt in symptomOptions" :key="opt.id">
                        <el-option :label="item.split(':')[0]" :value="item.split(':')[0]" />
                      </template>
                  </el-select>
                  <div class="mt-2" v-if="item.includes('Other')">
                    <Textarea
                      :value="stringGroupExtractor(item)"
                      label="Description"
                      name="Description"
                      :disabled="true"
                    ></Textarea>
                  </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="mt-2"></div>
        <el-collapse class="task-group general-accordion py-1 px-5" v-model="defectCausesCollapse  ">
          <el-collapse-item title="Defect Cause" name="Defect Cause">
            <div class="p-2 d-flex" v-for="cause in causes" :key="cause">
              <div class="d-flex flex-fill flex-column">
                  <el-select
                      v-model="cause.split(':')[0]"
                      disabled
                      class="w-100">
                      <el-option :label="cause.split(':')[0]" :value="cause.split(':')[0]" />
                  </el-select>
                  <div class="mt-2" v-if="cause.includes('Other')">
                    <Textarea
                      :value="stringGroupExtractor(cause)"
                      label="Description"
                      name="Description"
                      :disabled="true"
                    ></Textarea>
                  </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import {
  defineProps,
  toRef,
  PropType,
  computed,
  ref,
  defineEmits
} from 'vue'
import DefectCamera from '@/components/camera/DefectCamera.vue'
import {
  formatNumberWithComma
} from '@/core/helpers/number-format'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import { IDefectYesDetail } from '@/core/types/intervention/IDefectYesDetail'
import { Option } from '@/core/types/misc/Option'
import { Symptom } from '@/core/types/entities/dma/masters/Symptom'
import { Causes } from '@/core/types/entities/dma/masters/Causes'
import { Labour } from '@/core/types/intervention/Labour'
import { Part } from '@/core/types/entities/dma/e-form/defects/Part'
import { IDetailTask } from '@/core/types/intervention/IDetailTask'
import {
  stringGroupExtractor
} from '@/core/helpers/ironforms/defects-form/defect-form'
import Textarea from '@/components/inputs/dma/Textarea.vue'
import { Decline } from '@/core/types/intervention/Decline'
import { v4 as uuidv4 } from 'uuid';
import { ImageLoadParam } from '@/core/types/intervention/ImageLoadParam'
import {
  formatOwnership,
  disabledHyperlink
} from '@/store/pinia/dma/e-form/helpers';
import { Audit } from '@/core/types/intervention/Audit'
import SmallCamera from "@/components/dma/defect/parts-component-intervention/SmallCamera.vue"
import UploadAttachment from "@/components/dma/defect/parts-component-intervention/UploadAttachment.vue"
import { NACondition } from '@/core/types/entities/dma/masters/NACondition'

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
    type: Object as PropType<IDefectYesDetail>
  },
  positions: {
    type: Array as PropType<Option[]>
  },
  symptomOptions: {
    type: Array as PropType<Symptom[]>
  },
  causeOptions: {
    type: Array as PropType<Causes[]>
  },
  reRender: {
    type: Boolean,
    default: false
  },
  decline: {
    type: Object as PropType<Decline>
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
  approvedDate: {
    required: false,
    type: String,
    default: ""
  },
  approvedBy: {
    required: false,
    type: Object as PropType<Audit>,
    default: {} as Audit
  },
  naReasonOptions: {
    required: true,
    type: Array as PropType<NACondition[]>,
  },
})

const emits = defineEmits([
  "onClose",
  "onImageDownloaded"
])

const priorityCollapse = ref('Priority')
const partsRequiredCollapse = ref('Parts Required')
const labourRequired = ref('Labour Required')
const otherResourceCollapse = ref('Other Resources Required (optional)')
const defectSysmptompCollapse = ref('Defect Symptom')
const defectCausesCollapse = ref('Defect Cause')
const dialogVisible = toRef(props, "visibility")
const detail = toRef(props, "data")
const defectDetailRef = ref<HTMLElement>()
const customClass = ref(uuidv4())

/* computes */
const images = computed(() => {
  return props.data.images ? JSON.parse(props.data.images) as string[] : []
})
const parts = computed(() => {
  return JSON.parse(detail.value.parts) as Part[]
})
const labours = computed(() => {
  return JSON.parse(detail.value.labours) as Labour[]
})
const resources = computed(() => {
  const resources = JSON.parse(detail.value.resources) as string[]
  return resources.map((a) => {
    return a
  })
})
const symptoms = computed(() => {
  const symptoms = JSON.parse(detail.value.symptoms) as string[]
  return symptoms.map((a) => {
    return a
  })
})
const causes = computed(() => {
  const causes = JSON.parse(detail.value.causes) as string[]
  return causes.map((a) => {
    return a
  })
})

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

const onFormClosed = async () => {
  emits("onClose")
}
const onFormOpened = () => {
  disabledHyperlink(defectDetailRef.value)
}
const handleImageDownloaded = (image: ImageLoadParam) => {
  emits('onImageDownloaded', image)
}
const formatOwnershipHTML = computed(() => {
  const ownership = props.ownership
  return formatOwnership(ownership)
})
</script>
<style lang="scss" scoped>
@import "@/assets/sass/pages/defect.form.scss";
@import "@/assets/sass/pages/custom.defect.crack.dialog.scss";

.el-dialog__title .text-dark-red {
  font-weight: 700 !important;
  font-size: 12px !important;
  color: #ce3a38 !important;
  font-family: "Public sans";
}
.el-dialog__title .red-bg {
  background-color: #ffd9d8 !important;
  border-radius: 6px;
}
</style>
