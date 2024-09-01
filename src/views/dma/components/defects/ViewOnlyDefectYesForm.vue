<template>
    <el-dialog v-model="dialogVisible" width="90%" @closed="onFormClosed"  @opened="onFormOpened" :destroy-on-close="true" :custom-class="`el-defect-crack-form-custom form-defect-yes ${customClass}`">
      <template #title>
        <span class="el-dialog__title">
          Detailed Information for Defect Identification
          <template v-if="declineReason != ''">
            <span class="red-bg text-dark-red p-1">Declined</span>
          </template>
          <template v-else-if="approvalData && approvalData.status == 'Acknowledge'">
              <span class="status-badge-dialog-header approved-badge p-1">Approved</span>
          </template>
        </span>
        <span class="el-dialog__title task-title" v-html="displayDesc(data.Title, isIntervention)" ref="defectDetailRef" ></span>
      </template>
      <template v-if="declineReason != ''">
        <div class="mt-1 py-2">
          <div class="d-flex flex-column">
            <div class="row mb-1">
                <div class="col">
                  <div class="form-floating declined-text-box">
                      <div class="form-control">{{ declineReason }}</div>
                      <label>Declined Reason*</label>
                  </div>
                </div>
              </div>
            <div v-if="declineBy && declineDate" class="mb-2 text-end">
              {{ declineBy.name }}, {{ declineDate }}
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="approvalData && approvalData.status == 'Acknowledge'">
        <div class="mt-1 py-2">
          <div class="row mb-1">
            <div class="col">
              <div class="form-floating approved-text-box" v-if="approvalData.approvedBy && approvalData.approvedDate">
                  <div class="form-control" style="white-space:break-spaces;">{{ approvalData.approvedDate }} — {{ approvalData.approvedBy.name }}</div>
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
              <div type="text" class="form-control asset-number-disabled-div" v-html="data.AssetNumber"></div>
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
        <large-camera
        :id="'defect'"
        :disabled="true"
        :allow-delete="false"
        :is-monitoring="true"
        :is-mandatory="false" />
      </div>
      <div class="mt-1 p-2">
        <Textarea
          :value="data.Description.value"
          label="Defect Identified Description"
          name="DefectIdentifiedDescription"
          :disabled="true"
        ></Textarea>
      </div>
      <div class="mt-1 p-2">
          <div class="row">
              <div class="col pe-0">
                  <div class="form-floating">
                      <input type="text" class="form-control" disabled :value="data.RaisedBy">
                      <label>Raised By</label>
                  </div>
              </div>
          </div>
      </div>
      <div class="mt-1 p-2">
        <div class="row">
          <div class="col-4 pe-0 date">
                  <div class="form-floating">
                      <input type="text" class="form-control" disabled :value="data.Date" />
                      <label>Date Raised</label>
                  </div>
              </div>
              <div class="col pe-0 d-flex">
                  <div class="d-flex flex-column flex-fill">
                    <div class="form-floating">
                      <input type="text" class="form-control" :value="formatNumberWithComma(data.PlannedDuration.value)" disabled />
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
          :value="data.Instruction.value"
          label="Defect Repair instruction"
          name="DefectRepairInstruction"
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
                  <input class="form-check-input" type="radio" v-model="data.Priority" value="P1" disabled>
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
                  <input class="form-check-input" type="radio" v-model="data.Priority" value="P2" disabled>
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
                  <input class="form-check-input" type="radio" v-model="data.Priority" value="P3" disabled>
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
                  <input class="form-check-input" type="radio" v-model="data.Priority" value="P4" disabled>
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
            <div class="row p-3 m-1 priority-container px-0" v-for="(item, index) in data.Parts" :key="item.partNumber">
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
                <div class="ms-4 d-flex align-items-center" :class="index === 0 ? 'hidden' : ''">
                </div>
              </div>
              <div class="col px-1 d-flex flex-column justify-content-start">
                <div class="row p-0 m-0 h-100 w-100 align-items-center">
                  <SmallCamera :index="index" :item-value="item.images || []" :is-disabled="true" />
                </div>
              </div>
              <div class="col px-1 d-flex flex-column justify-content-start position-relative">
                <div class="row p-0 m-0 h-100 w-100 align-items-center">
                  <UploadAttachment :index="index" :item-value="item.attachment || []" :is-disabled="true" />
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
          <div class="row p-3 m-1 priority-container ps-0" v-for="(item) in data.Labours" :key="item.position">
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
          <div class="p-2 d-flex" v-for="(item, index) in data.Resources" :key="item.value">
            <div class="d-flex flex-fill flex-column">
              <input type="text" class="form-control" :value="item.value" placeholder="Resource1" disabled />
            </div>
            <div class="ms-4 d-flex align-items-center" :class="index === 0 ? 'hidden' : ''">
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="mt-2"></div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="defectSysmptompCollapse">
        <el-collapse-item title="Defect Symptom" name="Defect Symptom">
          <div class="p-2 d-flex" v-for="(item, index) in data.Symptoms" :key="item.value">
            <div class="d-flex flex-fill flex-column">
                <el-select
                    v-model="symptoms[index]"
                    :disabled="true"
                    class="w-100">
                    <template v-for="opt in masterStore.Symptoms" :key="opt.id">
                      <el-option :label="opt.symptom" :value="opt.symptom" />
                    </template>
                </el-select>
                <div class="mt-2" v-if="symptoms[index] === 'Other'">
                <Textarea
                  :value="stringGroupExtractor(item.value)"
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
          <div class="p-2 d-flex" v-for="(item, index) in data.Causes" :key="item.value">
            <div class="d-flex flex-fill flex-column">
                <el-select
                    v-model="causes[index]"
                    :disabled="true"
                    class="w-100">
                    <template v-for="opt in masterStore.Causes" :key="opt.id">
                      <el-option :label="opt.causes" :value="opt.causes" />
                    </template>
                </el-select>
                <div class="mt-2" v-if="causes[index] === 'Other'">
                <Textarea
                  :value="stringGroupExtractor(item.value)"
                  label="Description"
                  name="Description"
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
  toRef,
  PropType,
  computed,
  ref,
  defineEmits
} from 'vue'
import DefectYesClass from '@/core/classes/DefectYesClass'
import { useCameraStore } from '@/store/pinia/application/useCameraStore'
import LargeCamera from '@/components/camera/LargeCamera.vue'
import SmallCamera from "@/components/dma/defect/parts-component/SmallCamera.vue"
import UploadAttachment from "@/components/dma/defect/parts-component/UploadAttachment.vue"
import { useMasterStore } from '@/store/pinia/dma/masters/useMasterStore'
import {
  formatNumberWithComma
} from '@/core/helpers/number-format'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import Textarea from "@/components/inputs/dma/Textarea.vue";
import {
  handleScrollToTopOfDialog,
  stringGroupExtractor
} from "@/core/helpers/ironforms/defects-form/defect-form"
import { v4 as uuidv4 } from 'uuid';
import { Audit } from "@/core/types/intervention/Audit";
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore";
import {
  formatOwnership,
  disabledHyperlink
} from '@/store/pinia/dma/e-form/helpers';
import {
  ApprovalData
} from "@/core/types/entities/dma/e-form/defects/ApprovalData"

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  defectData: {
    required: true,
    type: Object as PropType<DefectYesClass>
  },
  declineReason: {
    required: false,
    type: String,
    default: ""
  },
  declineDate: {
    required: false,
    type: String,
    default: ""
  },
  declineBy: {
    required: false,
    type: Object as PropType<Audit>,
    default: {} as Audit
  },
  isIntervention: {
    required: false,
    type: Boolean,
    default: false
  },
  approvalData: {
    required: true,
    type: Object as PropType<ApprovalData>
  }
})

const emits = defineEmits(["close"])

const priorityCollapse = ref('Priority')
const partsRequiredCollapse = ref('Parts Required')
const labourRequired = ref('Labour Required')
const otherResourceCollapse = ref('Other Resources Required (optional)')
const defectSysmptompCollapse = ref('Defect Symptom')
const defectCausesCollapse = ref('Defect Cause')
const dialogVisible = toRef(props, "visibility")
const data = toRef(props, "defectData")
const defectDetailRef = ref<HTMLElement>()
const customClass = ref(uuidv4())

const camstore = useCameraStore()
const masterStore = useMasterStore()
const defectformStore = useDefectsFormStore();

/* computes */
const symptoms = computed(() => {
  return data.value.Symptoms.map((a) => {
    return a.value.split(':')[0]
  })
})
const causes = computed(() => {
  return data.value.Causes.map((a) => {
    return a.value.split(':')[0]
  })
})

const onFormClosed = async () => {
  camstore.clearCurrent()
  emits("close")
}

const onFormOpened = () => {
  handleScrollToTopOfDialog(customClass.value)
  disabledHyperlink(defectDetailRef.value)
}

const serialNumber = computed(() => {
  return defectformStore.SerialNumber
})


const formatOwnershipHTML = computed(() => {
  const ownership = defectformStore.Ownership
  return formatOwnership(ownership)
})
</script>
<style lang="scss" scoped>
@import "@/assets/sass/pages/defect.ori.scss";
@import "@/assets/sass/pages/custom.defect.crack.dialog.scss";

.el-dialog__title .text-dark-grey {
  font-weight: 700 !important;
  font-size: 12px !important;
  color: #637381 !important;
  font-family: "Public sans", serif;
}
.el-dialog__title .grey-bg {
  background-color: rgba(145, 158, 171, 0.16) !important;
  border-radius: 6px;
}

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

.el-dialog__title {
  display: block !important;
}
</style>
