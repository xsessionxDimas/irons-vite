<template>
  <el-dialog v-model="dialogVisible"
  :custom-class="`defectform el-defect-crack-form-custom edit-form-defect-yes ${customClass}`"
  width="90%" center
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  :before-close="handleBeforeClose"
  @closed="onFormClosed"
  @opened="onFormOpened"
  :destroy-on-close="true">
    <template #title>
      <span class="el-dialog__title">Detailed Information for Defect Identification
        <template v-if="viewDeclineCondition">
          <span class="red-bg text-dark-red p-1">Declined</span>
        </template>
        <template v-else-if="viewApprovedCondition">
            <span class="status-badge-dialog-header approved-badge p-1">Approved</span>
        </template>
      </span>
      <span class="el-dialog__title task-title" v-html="title" ref="defectDetailRef" ></span>
    </template>
    <div>
      <template v-if="viewDeclineCondition">
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
      <template v-else-if="viewApprovedCondition">
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
        <div class="py-2 d-flex flex-row flex-grow-1">
          <div class="flex-fill">
            <div class="form-floating">
              <div type="text" class="form-control asset-number-disabled-div" v-html="defectData?.assetNumber"></div>
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
        ref="defectCameraRef"
        :task="task"
        :re-render="reRender"
        :defect-images="defectImages || []"
        :type="'defect'"
        :disabled="isDisabled"
        :allow-delete="!isDisabled"
        @on-image-downloaded="handleImageDownloaded"
        @on-camera-clicked="handleCameraClick"
        @on-image-delete="handleImageDeleted"
        :has-submitted="!isImageValid"
        />
      </div>
      <template v-if="!isImageValid">
      <Label class="error-label">Required</Label>
      </template>
      <div class="mt-1 py-2">
        <Textarea
          :disabled="isDisabled"
          :value="description?.value"
          :label="defectPlaceholder"
          name="defectPlaceholder"
          :errorMessage="description.errorMessage"
          :is-valid="description.isValid"
          @handleChange="onDescriptionChange"
        />
      </div>
      <div class="mt-1 py-2">
        <div class="row">
          <div class="col pe-0">
            <div class="form-floating">
              <input type="text" class="form-control" disabled :value="defectData?.raisedBy">
              <label>Raised By</label>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-1 py-2">
        <div class="row">
          <div class="col-4 pe-0 date">
            <div class="form-floating">
              <input type="text" class="form-control" disabled :value="defectData?.date" />
              <label>Date Raised</label>
            </div>
          </div>
          <div class="col pe-0 d-flex">
            <div class="d-flex flex-column flex-fill">
              <div class="form-floating">
                <input type="text"
                class="form-control"
                pattern="[0-9]*"
                inputmode="numeric"
                :value="formatNumberInput(plannedDuration.value)"
                @input="onPlannedHoursChange"
                :disabled="isDisabled" />
                <label class="text-nowrap">How long will this defect repair take?</label>
              </div>
              <div class="mt-2" v-if="!plannedDuration.isValid">
                <Label class="error-label">{{ plannedDuration.errorMessage }}</Label>
              </div>
            </div>
            <div class="ms-2 d-flex align-items-center">
              <Label>Hours</Label>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-1 py-2">
        <Textarea
          :value="instruction.value"
          :label="instructionPlaceholder"
          name="instruction"
          :disabled="isDisabled"
          :isValid="instruction.isValid"
          :errorMessage="instruction.errorMessage"
          @handleChange="onInstructionChange"
        />
      </div>
      <div class="mt-2"></div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="priorityCollapse">
        <el-collapse-item title="Priority" name="Priority">
          <div class="row p-3 m-1 priority-container" style="background: #F4F6F8; border-radius: 8px;">
            <div class="col-3">Priority</div>
            <div class="col-6">Action</div>
            <div class="col-3 text-break">Person Responsible</div>
          </div>
          <div class="row p-3 m-1 priority-container">
            <div class="col-3">
              <div class="form-check">
                <input class="form-check-input" type="radio" v-model="priority" value="P1" :disabled="isDisabled">
                <label class="form-check-label text-nowrap">
                  (P1) Immediate
                </label>
              </div>
            </div>
            <div class="col-6 word-breaker">Shall shut machine down and undertake repairs.</div>
            <div class="col-3 text-break">Maintenance Supervisor</div>
          </div>
          <div class="row p-3 m-1 priority-container">
            <div class="col-3">
              <div class="form-check">
                <input class="form-check-input" type="radio" v-model="priority" value="P2" :disabled="isDisabled">
                <label class="form-check-label text-nowrap">
                  (P2) Urgent
                </label>
              </div>
            </div>
            <div class="col-6 word-breaker">Shall complete within 7 days.</div>
            <div class="col-3 text-break">Maintenance Supervisor</div>
          </div>
          <div class="row p-3 m-1 priority-container">
            <div class="col-3">
              <div class="form-check">
                <input class="form-check-input" type="radio" v-model="priority" value="P3" :disabled="isDisabled">
                <label class="form-check-label text-nowrap">
                  (P3) Routine
                </label>
              </div>
            </div>
            <div class="col-6 word-breaker">Shall complete within 60 days.</div>
            <div class="col-3 text-break">Maintenance Planner</div>
          </div>
          <div class="row p-3 m-1 priority-container">
            <div class="col-3">
              <div class="form-check">
                <input class="form-check-input" type="radio" v-model="priority" value="P4" :disabled="isDisabled">
                <label class="form-check-label text-nowrap">
                  (P4) Monitor
                </label>
              </div>
            </div>
            <div class="col-6 word-breaker">Shall continue to inspect and monitor for 90 days.</div>
            <div class="col-3 text-break">Maintenance Planner</div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="mt-2"></div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="partsRequiredCollapse">
        <el-collapse-item title="Parts" name="Parts">
          <div class="row p-3 m-1 priority-container" style="background: #F4F6F8; border-radius: 8px;">
            <div class="col-3">Part Number</div>
            <div class="col-5">Part Description</div>
            <div class="col-1">Qty</div>
            <div class="col"></div>
            <div class="col"></div>
          </div>
          <template v-for="(item, index) in parts" :key="item">
            <div class="row p-3 m-1 priority-container px-0">
              <div class="col-3 ps-0">
                <div class="d-flex flex-column">
                  <input type="text" class="form-control" :value="item.partNumber" :disabled="isDisabled" />
                </div>
              </div>
              <div class="col-5">
                <div class="d-flex flex-column">
                  <input type="text" class="form-control" :value="item.partDescription.value"
                    @change="onPartDescriptionChange($event, index)" :disabled="isDisabled" />
                  <div class="mt-2" v-if="!item.partDescription.isValid">
                    <Label class="error-label">{{ item.partDescription.errorMessage }}</Label>
                  </div>
                </div>
              </div>
              <div class="col-1 px-1 d-flex justify-content-start">
                <div class="d-flex flex-column">
                  <input pattern="[0-9]*" inputmode="numeric" class="form-control"
                    :value="formatNumberInput(item.partQty.value)" @input="onPartQtyChange($event, index)"
                    :disabled="isDisabled" />
                  <div class="mt-2" v-if="!item.partQty.isValid">
                    <Label class="error-label">{{ item.partQty.errorMessage }}</Label>
                  </div>
                </div>
              </div>
              <div class="col px-1 d-flex flex-column justify-content-start">
                <div class="row p-0 m-0 h-100 w-100 align-items-center">
                  <SmallCamera mode="edit" :index="index" :item-value="item.images || []" @on-camera-clicked="handleCameraClick" @on-image-delete="handleImagePartDeleted" :isDisabled="isDisabled" />
                </div>
              </div>
              <div class="col px-1 d-flex flex-column justify-content-start position-relative">
                <div class="row p-0 m-0 h-100 w-100 align-items-center">
                  <UploadAttachment mode="edit" :index="index" :item-value="item.attachment || []" @on-attachment-clicked="handleAttachmentClicked" @on-attachment-delete="handleAttachmentPartDeleted" :isDisabled="isDisabled"/>
                </div>
                <div class="position-absolute" style="top:10px; right: 0px;" v-if="!isDisabled">
                    <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="removePart(index)"></em>
                </div>
              </div>
            </div>
          </template>
          <button class="my-3 btn-add-new" @click="addNewPart" v-if="!isDisabled">
            <em class="fa fa-plus me-2"></em>
            Add more parts
          </button>
        </el-collapse-item>
      </el-collapse>
      <div class="mt-2"></div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="labourRequired">
        <el-collapse-item title="Labour" name="Labour">
          <div class="row p-3 m-1 priority-container" style="background: #F4F6F8; border-radius: 8px;">
            <div class="col-6">Labour Activity</div>
            <div class="col-2">Qty</div>
            <div class="col-2">Hours Each</div>
            <div class="col-2">Total Hours</div>
          </div>
          <template v-for="(item, index) in labours" :key="item">
            <div class="row p-3 m-1 priority-container px-0">
              <div class="col-6 px-0">
                <div class="d-flex flex-column">
                  <el-select
                  v-model="item.position.value"
                  filterable placeholder="Choose Labour"
                  @change="onPositionChange(index)"
                  class="w-100"
                  :disabled="isDisabled">
                    <template v-for="opt in positions" :key="opt.value">
                      <el-option :label="opt.label" :value="opt.label" />
                    </template>
                  </el-select>
                  <div class="mt-2" v-if="!item.position.isValid">
                    <Label class="error-label">{{ item.position.errorMessage }}</Label>
                  </div>
                </div>
              </div>
              <div class="col-2 d-flex justify-content-start">
                <div class="d-flex flex-column">
                  <input pattern="[0-9]*" inputmode="numeric" class="form-control" @keypress="onlyIntegerInput"
                    :value="formatNumberInput(item.qty.value)" @input="onLabourQtyChange($event, index)"
                    :disabled="isDisabled" />
                  <div class="mt-2" v-if="!item.qty.isValid">
                    <Label class="error-label">{{ item.qty.errorMessage }}</Label>
                  </div>
                </div>
              </div>
              <div class="col-2 d-flex justify-content-start">
                <div class="d-flex flex-column">
                  <input pattern="[0-9]*" inputmode="numeric" class="form-control" @keypress="onlyNumber"
                    :value="formatNumberInput(item.hourEach.value)"
                    @input="onLabourHourEachChange($event, index)"
                    :disabled="isDisabled" />
                  <div class="mt-2" v-if="!item.hourEach.isValid">
                    <Label class="error-label">{{ item.hourEach.errorMessage }}</Label>
                  </div>
                </div>
              </div>
              <div class="col-2 d-flex justify-content-start">
                <div class="d-flex flex-column">
                  <input class="form-control" :value="item.totalHour" disabled />
                </div>
                <div class="ms-4 d-flex align-items-center" :class="index === 0 || isDisabled ? 'hidden' : ''" style="height:46px">
                  <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="removeLabour(index)"></em>
                </div>
              </div>
            </div>
          </template>
          <button class="my-3 btn-add-new" @click="addNewLabour" v-if="!isDisabled">
            <em class="fa fa-plus me-2"></em>
            Add more labour
          </button>
        </el-collapse-item>
      </el-collapse>
      <div class="mt-2"></div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="otherResourceCollapse">
        <el-collapse-item title="Other Resource (optional)" name="Other Resource (optional)">
          <div class="p-2 d-flex" v-for="(item, index) in resources" :key="item.value">
            <div class="d-flex flex-fill flex-column">
              <input type="text" class="form-control" :value="item.value" :placeholder="`Resource${index + 1}`"
                @change="onResourceChange($event, index)" :disabled="isDisabled" />
              <div class="mt-2" v-if="!item.isValid">
                <Label class="error-label">{{ item.errorMessage }}</Label>
              </div>
            </div>
            <div class="ms-4 d-flex align-items-center" :class="index === 0 || isDisabled ? 'hidden' : ''" style="height:46px">
              <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="removeResource(index)"></em>
            </div>
          </div>
          <button class="my-3 btn-add-new" @click="addNewResource" v-if="!isDisabled">
            <em class="fa fa-plus me-2"></em>
            Add new resource
          </button>
        </el-collapse-item>
      </el-collapse>
      <div class="mt-2"></div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="defectSysmptompCollapse">
        <el-collapse-item title="Symptom" name="Symptom">
          <div class="p-2 d-flex" v-for="(symptom, index) in symptoms" :key="symptom.value">
            <div class="d-flex flex-fill flex-column">
              <el-select v-model="symptom.value" placeholder="Select Symptom" filterable
                @change="onSymptomChange($event, index)" class="w-100" :disabled="isDisabled">
                <template v-for="opt in symptomOptions" :key="opt.id">
                  <el-option :label="opt.symptom" :value="opt.symptom" />
                </template>
              </el-select>
              <div class="mt-2" v-if="!symptom.isValid">
                <Label class="error-label">{{ symptom.errorMessage }}</Label>
              </div>
              <div class="mt-2" v-if="symptom.value.includes('Other')">
                <Textarea
                  :value="symptomsDesc[index] && symptomsDesc[index].value"
                  label="Description"
                  name="Description"
                  errorMessage="Required"
                  :disabled="isDisabled"
                  :is-valid="symptomsDesc[0].isValid"
                  :index="index"
                  @handleChange="onSymptomDescChange"
                ></Textarea>
              </div>
            </div>
            <div class="ms-4 d-flex align-items-center" :class="index === 0 || isDisabled ? 'hidden' : ''" style="height:46px">
              <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="removeSymptom(index)"></em>
            </div>
          </div>
          <button class="my-3 btn-add-new" @click.prevent="addNewSymptom" v-if="!isDisabled">
            <em class="fa fa-plus me-2"></em>
            Add another symptom
          </button>
        </el-collapse-item>
      </el-collapse>
      <div class="mt-2"></div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="defectCausesCollapse">
        <el-collapse-item title="Cause" name="Cause">
          <div class="p-2 d-flex" v-for="(cause, index) in causes" :key="cause.value">
            <div class="d-flex flex-fill flex-column">
              <el-select v-model="cause.value" placeholder="Select Cause" filterable
                @change="onCauseChange($event, index)" class="w-100" :disabled="isDisabled">
                <template v-for="opt in causeOptions" :key="opt.id">
                  <el-option :label="opt.causes" :value="opt.causes" />
                </template>
              </el-select>
              <div class="mt-2" v-if="!cause.isValid">
                <Label class="error-label">{{ cause.errorMessage }}</Label>
              </div>
              <div class="mt-2" v-if="cause.value.includes('Other')">
                <Textarea
                  :value="causesDesc[index] && causesDesc[index].value"
                  label="Description"
                  name="Description"
                  errorMessage="Required"
                  :is-valid="causesDesc[0].isValid"
                  :index="index"
                  :disabled="isDisabled"
                  @handleChange="onCauseDescChange"
                ></Textarea>
              </div>
            </div>
            <div class="ms-4 d-flex align-items-center" :class="index === 0 || isDisabled ? 'hidden' : ''" style="height:46px">
              <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="removeCause(index)"></em>
            </div>
          </div>
          <button class="my-3 btn-add-new" @click="addNewCause" v-if="!isDisabled">
            <em class="fa fa-plus me-2"></em>
            Add another cause
          </button>
        </el-collapse-item>
      </el-collapse>
      <div class="my-5 w-100 d-flex justify-content-around" v-if="canModify">
        <button v-if="!isDisabled" class="btn btn-light w-100" @click.prevent="setCancel"
          style="background: rgb(255, 255, 255); border: 1px solid rgba(145, 158, 171, 0.24); box-shadow: rgba(0, 171, 85, 0.24) 0px 8px 16px; color: black;">Cancel</button>
        <button v-if="!isDisabled" class="ms-3 btn btn-success w-100" @click.prevent="onSubmitDefect" :disabled="isDisabled"
          style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Submit</button>
        <button v-if="isDisabled" class="btn btn-warning w-100" @click.prevent="setModify"
          style="background: rgb(255, 193, 7); box-shadow: rgba(0, 171, 85, 0.24) 0px 8px 16px; color: black;">Modify</button>
      </div>
    </div>
    <Confirmation :visibility="confirmVisible" caption="Please confirm this defect information is correct."
      @on-no-confirm="onCancel" @on-yes-confirm="onSave" />
    <Confirmation :visibility="showConfirmExit"
      caption="Are you sure want to close the defect form? <br /> Note: By closing the defect form, you will lose your defect data that you have already inputted."
      @on-no-confirm="onCancelExit"
      @on-yes-confirm="onSaveExit" />
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  defineExpose,
  toRef,
  PropType,
  ref,
  computed
} from 'vue'
import Confirmation from '@/components/dialog/Confirmation.vue'
import {
  formatNumberInput,
  isDotTheLastDigit,
  maximumFiveDigitWithTwoFraction,
  reformatNumberWithComma,
  maximumFiveDigit
} from '@/core/helpers/number-format'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import { IDefectYesDetail } from '@/core/types/intervention/IDefectYesDetail'
import {
  StringWithValidationState
} from '@/core/types/misc/StringWithValidationState'
import { Parts } from '@/core/types/intervention/Parts'
import { Labours } from '@/core/types/intervention/Labours'
import { CameraParam } from '@/core/types/intervention/CameraParam'
import { Audit } from '@/core/types/intervention/Audit'
import { Symptom } from '@/core/types/entities/dma/masters/Symptom'
import { Causes } from '@/core/types/entities/dma/masters/Causes'
import { Option } from '@/core/types/misc/Option'
import { DefectYesFormData } from '@/core/types/intervention/DefectYesFormData'
import { IDetailTask } from '@/core/types/intervention/IDetailTask'
import { TaskUpdateObject } from '@/core/types/intervention/TaskUpdateObject'
import { AESTCurrentDateTime } from '@/core/helpers/date-format'
import DefectCamera from '@/components/camera/DefectCamera.vue'
import {
  handleScrollToErrorModal,
  handleScrollToTopOfDialog,
  stringGroupExtractor
} from '@/core/helpers/ironforms/defects-form/defect-form'
import Textarea from '@/components/inputs/dma/Textarea.vue'
import { TextareaParam } from '@/core/types/misc/TextareaParam'
import { v4 as uuidv4 } from 'uuid';
import { ImageLoadParam } from '@/core/types/intervention/ImageLoadParam'
import {
  formatOwnership,
  disabledHyperlink,
  onlyNumberResult,
  onlyIntegerInput,
  hasDefectDataChanged
} from '@/store/pinia/dma/e-form/helpers';
import SmallCamera from "@/components/dma/defect/parts-component-intervention/SmallCamera.vue"
import UploadAttachment from "@/components/dma/defect/parts-component-intervention/UploadAttachment.vue"
import {
  cloneDeep,
  isEmpty,
} from 'lodash'

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  task: {
    required: true,
    type: Object as PropType<IDetailTask>
  },
  taskNo: {
    required: true,
    type: String
  },
  taskDesc: {
    required: true,
    type: String
  },
  defectData: {
    required: true,
    type: Object as PropType<IDefectYesDetail>
  },
  currentFitter: {
    type: Object as PropType<Audit>,
    required: true
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
  defectImages: {
    type: Array as PropType<string[]>,
    required: true
  },
  reRender: {
    type: Boolean,
    default: false
  },
  status: {
    required: true,
    type: String
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
  ownership: {
    type: String,
    default: "",
  },
  serialNumber: {
    type: String,
    default: "",
  },
  isNeed30Minutes: {
    default: false
  },
  generic: {
    required: false,
    type: Boolean,
    default: false
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  }
})

const emits = defineEmits([
  'onCameraClick',
  'onImageDeleted',
  'onImageDownloaded',
  'onSubmit',
  'onCancel',
  'onClose',
  'onResetImage',
  'onAttachmentClicked',
  'onImageDeleted',
  'onImagePartDeleted',
  'onAttachmentPartDeleted',
  'OnSetFlagFromDeleteAction'
])

const isDisabled = ref(true)

/* collapsible binding */
const priorityCollapse = ref('Priority')
const partsRequiredCollapse = ref('Parts')
const labourRequired = ref('Labour')
const otherResourceCollapse = ref('')
const defectSysmptompCollapse = ref('Symptom')
const defectCausesCollapse = ref('Cause')

const clonedDefectData = ref()

const showConfirmExit = ref(false)
const dialogVisible = toRef(props, "visibility")
const defectSubmitted = ref(false)
const confirmVisible = ref(false)
const description = ref<StringWithValidationState>({
  value: props.defectData?.description ?? '',
  isValid: true,
  errorMessage: ''
})
const instruction = ref<StringWithValidationState>({
  value: props.defectData?.instruction ?? '',
  isValid: true,
  errorMessage: ''
})
const isImageValid = ref(true)
const defectDetailRef = ref<HTMLElement>()
const plannedDuration = ref<StringWithValidationState>(
  {
    value: props.defectData?.plannedDuration ?? '',
    isValid: true,
    errorMessage: ''
  }
)
// default P1
const priority = ref(props.defectData?.priority ?? 'P1')
const parts = ref<Parts[]>([])
const labours = ref<Labours[]>([])
const resources = ref<StringWithValidationState[]>([])
const symptoms = ref<StringWithValidationState[]>([
  {
    value: '',
    isValid: true,
    errorMessage: ''
  }
])
const symptomsDesc = ref<StringWithValidationState[]>([
  {
    value: '',
    isValid: true,
    errorMessage: ''
  }
])
const causes = ref<StringWithValidationState[]>([
  {
    value: '',
    isValid: true,
    errorMessage: ''
  }
])
const causesDesc = ref<StringWithValidationState[]>([
  {
    value: '',
    isValid: true,
    errorMessage: ''
  }
])
const customClass = ref(uuidv4())
const defectCameraRef = ref()

const viewDeclineCondition = computed(() => {
  return props.status == "Decline"
})
const viewApprovedCondition = computed(() => {
  return props.status == "Acknowledge"
})
const defectPlaceholder = computed(() => {
  return "Defect Identified Description"
})
const instructionPlaceholder = computed(() => {
  return "Defect Repair Instructions"
})
/* methods and event handlers */
const handleCameraClick = (param: CameraParam) => {
  isImageValid.value = true
  emits('onCameraClick', param)
}
const handleImageDeleted = (filename: string) => {
  if (props.defectImages.length == 1) {
    isImageValid.value = false
    emits('OnSetFlagFromDeleteAction', true)
    defectCameraRef.value.handleClickCamera()
    defectCameraRef.value.handleHideModal()
  } else {
    emits('onImageDeleted', filename)
  }
}
const handleImageDownloaded = (image: ImageLoadParam) => {
  emits('onImageDownloaded', image)
}
const onDescriptionChange = (event) => {
  description.value.value = event.value
  validateDescription()
}
const validateDescription = () => {
  let isValid = true
  if (description.value.value === "") {
    description.value.isValid = false
    description.value.errorMessage = 'Required'
    isValid = false
  } else {
    description.value.isValid = true
    description.value.errorMessage = ""
  }
  return isValid
}
const validateImage = () => {
  if (props.defectImages.length >= 1) {
    isImageValid.value = true
    return true
  }
  isImageValid.value = false
  return false
}

const onPlannedHoursChange = (event) => {
  event.target.value = onlyNumberResult(event.target.value)
  plannedDuration.value.value = reformatNumberWithComma(event.target.value);
  validatePlannedDuration();
}

const validatePlannedDuration = () => {
  let isValid = true
  if (plannedDuration.value.value === "") {
    plannedDuration.value.isValid = false
    plannedDuration.value.errorMessage = 'Required'
    isValid = false
  } else {
    let validFormat = !isDotTheLastDigit(plannedDuration.value.value);
    if (!validFormat) {
      plannedDuration.value.isValid = false;
      plannedDuration.value.errorMessage = "Invalid format";
      isValid = false;
      return isValid
    } else {
      plannedDuration.value.isValid = true;
      plannedDuration.value.errorMessage = "";
    }
    validFormat = maximumFiveDigitWithTwoFraction(plannedDuration.value.value);
    if (!validFormat) {
      plannedDuration.value.isValid = false;
      plannedDuration.value.errorMessage = "Out of range (max 5 digit and 2 fraction)";
      isValid = false;
    } else {
      if (props.isNeed30Minutes) {
        const number = Number(plannedDuration.value.value);
        if (number <= 0.5) {
          plannedDuration.value.isValid = false;
          plannedDuration.value.errorMessage = "Must more than half an hour";
          isValid = false;
        } else {
          plannedDuration.value.isValid = true;
          plannedDuration.value.errorMessage = "";
        }
      }
    }
  }
  return isValid
}
const onInstructionChange = (event) => {
  instruction.value.value = event.value
  validateInstruction()
}
const validateInstruction = () => {
  let isValid = true
  if (instruction.value.value === "") {
    instruction.value.isValid = false
    instruction.value.errorMessage = 'Required'
    isValid = false
  } else {
    instruction.value.isValid = true
    instruction.value.errorMessage = ""
  }
  return isValid
}
const onPartDescriptionChange = (event, index: number) => {
  parts.value[index].partDescription.value = event.target.value
  validatePartDescription(parts.value[index].partDescription)
}
const validatePartDescription = (partDesc: StringWithValidationState) => {
  let isValid = true
  if (partDesc.value === "") {
    partDesc.isValid = false
    partDesc.errorMessage = 'Required'
    isValid = false
  } else {
    partDesc.isValid = true
    partDesc.errorMessage = ""
  }
  return isValid
}
const onPartQtyChange = (event, index: number) => {
  parts.value[index].partQty.value = reformatNumberWithComma(event.target.value)
  validatePartQty(parts.value[index].partQty)
}
const validatePartQty = (partQty: StringWithValidationState) => {
  let isValid = true
  if (partQty.value === "") {
    partQty.isValid = false
    partQty.errorMessage = 'Required'
    isValid = false
  } else {
    let validFormat = !isDotTheLastDigit(partQty.value);
    if (!validFormat) {
      partQty.isValid = false;
      partQty.errorMessage = "Invalid format";
      isValid = false;
      return isValid
    } else {
      partQty.isValid = true;
      partQty.errorMessage = "";
    }
    validFormat = maximumFiveDigitWithTwoFraction(partQty.value)
    if (!validFormat) {
      partQty.isValid = false
      partQty.errorMessage = "Out of range (max 5 digit and 2 fraction)"
      isValid = false
    } else {
      partQty.isValid = true
      partQty.errorMessage = ""
    }
  }
  return isValid
}
const validateParts = () => {
  let isValid = true
  const parentValids = [] as boolean[]
  parts.value.forEach((e) => {
    const valids = [] as boolean[]
    valids.push(validatePartDescription(e.partDescription))
    valids.push(validatePartQty(e.partQty))
    parentValids.push(valids.every((x) => {
      return x == true
    }))
  })
  isValid = parentValids.every((x) => {
    return x == true
  })
  return isValid
}
const addNewPart = () => {
  /* validate first */
  const isValid = validateParts()
  if (!isValid) return
  parts.value.push({
    partNumber: '',
    partDescription: {
      value: '',
      isValid: true,
      errorMessage: ''
    },
    partQty: {
      value: '',
      isValid: true,
      errorMessage: ''
    },
    images: [],
    attachment: []
  })
}
const removePart = (index: number) => {
  parts.value.splice(index, 1)
}
const handleImagePartDeleted = (params) => {
  // delete taskimage
  emits('onImagePartDeleted', params.filename)
  // delete on state
  parts.value[params.index].images = cloneDeep(parts.value[params.index].images).filter((img) => {
    return img.filename != params.filename
  })
}
const handleAttachmentClicked = (params) => {
  emits('onAttachmentClicked', params)
}
const handleAttachmentPartDeleted = (params) => {
  // delete taskattachment
  emits('onAttachmentPartDeleted', params.filename)
  // delete on state
  parts.value[params.index].attachment = cloneDeep(parts.value[params.index].attachment).filter((img) => {
    return img.url != params.filename
  })
}
const handlePartImage = (key, files) => {
  const index = key.split("-")[0]
  if (isEmpty(parts.value[index].images)) parts.value[index].images = []
  parts.value[index].images = [...parts.value[index].images, ...files]
}

const handlePartAttachment = (key, files) => {
  const index = key.split("-")[0]
  if (isEmpty(parts.value[index].attachment)) parts.value[index].attachment = []
  parts.value[index].attachment = [
    ...parts.value[index].attachment,
    ...[files]
  ]
}
const validateLabourPosition = (position: StringWithValidationState) => {
  let isValid = true
  if (position.value === "") {
    position.isValid = false
    position.errorMessage = 'Required'
    isValid = false
  } else {
    const duplicateLabours = labours.value.filter((l) => {
      return l.position.value == position.value;
    })
    if (duplicateLabours.length > 1) {
      position.isValid = false
      position.errorMessage = 'Required'
      isValid = false
    } else {
      position.isValid = true
      position.errorMessage = ""
    }
  }
  return isValid
}
const onLabourQtyChange = (event, index: number) => {
  event.target.value = onlyNumberResult(event.target.value)
  labours.value[index].qty.value = reformatNumberWithComma(event.target.value)
  validateLabourQty(labours.value[index].qty)
  calculateTotalHours(index)
}
const validateLabourQty = (qty: StringWithValidationState) => {
  let isValid = true
  if (qty.value === "") {
    qty.isValid = false
    qty.errorMessage = 'Required'
    isValid = false
  } else {
    let validFormat = !isDotTheLastDigit(qty.value);
    if (!validFormat) {
      qty.isValid = false;
      qty.errorMessage = "Invalid format";
      isValid = false;
      return isValid
    } else {
      qty.isValid = true;
      qty.errorMessage = "";
    }
    validFormat = maximumFiveDigit(qty.value)
    if (!validFormat) {
      qty.isValid = false
      qty.errorMessage = "Out of range (max 5 digits)"
      isValid = false
    } else {
      qty.isValid = true
      qty.errorMessage = ""
    }
  }
  return isValid
}
const onLabourHourEachChange = (event, index: number) => {
  event.target.value = onlyNumberResult(event.target.value)
  labours.value[index].hourEach.value = reformatNumberWithComma(event.target.value);
  validateLabourHourEach(labours.value[index].hourEach)
  calculateTotalHours(index)
}
const validateLabourHourEach = (hourEach: StringWithValidationState) => {
  let isValid = true
  if (hourEach.value === "") {
    hourEach.isValid = false
    hourEach.errorMessage = 'Required'
    isValid = false
  } else {
    let validFormat = !isDotTheLastDigit(hourEach.value);
    if (!validFormat) {
      hourEach.isValid = false;
      hourEach.errorMessage = "Invalid format";
      isValid = false;
      return isValid
    } else {
      hourEach.isValid = true;
      hourEach.errorMessage = "";
    }
    validFormat = maximumFiveDigitWithTwoFraction(hourEach.value)
    if (!validFormat) {
      hourEach.isValid = false
      hourEach.errorMessage = "Out of range (max 5 digit and 2 fraction)"
      isValid = false
    } else {
      hourEach.isValid = true
      hourEach.errorMessage = ""
    }
  }
  return isValid
}
const calculateTotalHours = (index: number) => {
  if (labours.value[index].qty.isValid && labours.value[index].qty.value != ''
  && labours.value[index].hourEach.isValid && labours.value[index].hourEach.value != '') {
    const qty = +labours.value[index].qty.value
    const each = +labours.value[index].hourEach.value
    const total = qty * each
    if (labours.value[index].qty.value.includes('.') || labours.value[index].hourEach.value.includes('.')) {
      labours.value[index].totalHour = total.toFixed(2).toString()
    } else {
      labours.value[index].totalHour = total.toString()
    }
  } else {
    labours.value[index].totalHour = ''
  }
}
const validateLabours = () => {
  let isValid = true
  const parentValids = [] as boolean[]
  labours.value.forEach((e) => {
    const valids = [] as boolean[]
    valids.push(validateLabourPosition(e.position))
    valids.push(validateLabourQty(e.qty))
    valids.push(validateLabourHourEach(e.hourEach))
    parentValids.push(valids.every((x) => {
      return x
    }))
  })
  isValid = parentValids.every((x) => {
    return x
  })
  return isValid
}
const onPositionChange = (index: number) => {
  let duplicateFound = false
  const value = labours.value[index].position.value
  for (let i = 0; i < index; i++) {
    if (i == index) continue
    const labourPos = labours.value[i].position.value
    if (labourPos == value) {
      labours.value[i].position.isValid = false
      labours.value[i].position.errorMessage = 'Duplicate position'
      labours.value[index].position.isValid = false
      labours.value[index].position.errorMessage = 'Duplicate position'
      duplicateFound = true
    } else {
      labours.value[i].position.isValid = true
      labours.value[i].position.errorMessage = ''
      if (!duplicateFound) {
        labours.value[index].position.isValid = true
        labours.value[index].position.errorMessage = ''
      }
    }
  }
}
const addNewLabour = () => {
  /* validate first */
  const isValid = validateLabours()
  if (!isValid) return
  labours.value.push({
    position: {
      value: '',
      isValid: true,
      errorMessage: ''
    },
    qty: {
      value: '',
      isValid: true,
      errorMessage: ''
    },
    hourEach: {
      value: '',
      isValid: true,
      errorMessage: ''
    },
    totalHour: ''
  })
}
const removeLabour = (index: number) => {
  labours.value.splice(index, 1)
}
const onResourceChange = (event, index: number) => {
  event.preventDefault()
  resources.value[index].value = event.target.value
  validateResources()
}
const validateResource = (resource: StringWithValidationState) => {
  let isValid = true
  if (resource.value === "" && resources.value.length > 1) {
    resource.isValid = false
    resource.errorMessage = 'Required'
    isValid = false
  } else {
    const duplicateResource = resources.value.filter((l) => {
      return l.value == resource.value;
    })
    if (duplicateResource.length > 1) {
      resource.isValid = false
      resource.errorMessage = 'Duplicate resource'
      isValid = false
    } else {
      resource.isValid = true
      resource.errorMessage = ""
    }
  }
  return isValid
}
const validateResources = () => {
  let isValid = true
  const parentValids = [] as boolean[]
  /* if resources length is zero need to clear the validation aswell */
  resources.value.forEach((e) => {
    const valids = [] as boolean[]
    valids.push(validateResource(e))
    parentValids.push(valids.every((x) => {
      return x
    }))
  })
  isValid = parentValids.every((x) => {
    return x
  })
  return isValid
}
const validateResourcesAdd = () => {
  let isValid = true
  const parentValids = [] as boolean[]
  resources.value.forEach((e) => {
    const valids = [] as boolean[]
    valids.push(validateResourceAdd(e))
    parentValids.push(valids.every((x) => {
      return x
    }))
  })
  isValid = parentValids.every((x) => {
    return x
  })
  return isValid
}
const validateResourceAdd = (resource: StringWithValidationState) => {
  let isValid = true
  if (resource.value === "") {
    resource.isValid = false
    resource.errorMessage = 'Required'
    isValid = false
  } else {
    const duplicateResource = resources.value.filter((l) => {
      return l.value == resource.value;
    })
    if (duplicateResource.length > 1) {
      resource.isValid = false
      resource.errorMessage = 'Duplicate resource'
      isValid = false
    } else {
      resource.isValid = true
      resource.errorMessage = ""
    }
  }
  return isValid
}
const addNewResource = () => {
  /* validate first */
  const isValid = validateResourcesAdd()
  if (!isValid) return
  resources.value.push({
    value: '',
    isValid: true,
    errorMessage: ''
  })
}
const removeResource = (index: number) => {
  resources.value.splice(index, 1)
  if (resources.value.length == 1 && resources.value[0].value == '') {
    resources.value[0].isValid = true
    resources.value[0].errorMessage = ''
  }
}
const onSymptomChange = (event, index: number) => {
  validateSymptom(symptoms.value[index])
}
const onSymptomDescChange = (param: TextareaParam) => {
  if (param.index == undefined) return
  symptomsDesc.value[param.index].value = param.value
  validateSymptomDesc(symptomsDesc.value[param.index], symptoms.value[param.index].value)
}
const validateSymptom = (symptom: StringWithValidationState) => {
  let isValid = true
  if (symptom.value === "") {
    symptom.isValid = false
    symptom.errorMessage = 'Required'
    isValid = false
  } else {
    const duplicateSymptom = symptoms.value.filter((l) => {
      return l.value == symptom.value;
    })
    if (duplicateSymptom.length > 1) {
      symptom.isValid = false
      symptom.errorMessage = 'Duplicate symptom'
      isValid = false
    } else {
      symptom.isValid = true
      symptom.errorMessage = ""
    }
  }
  return isValid
}
const validateSymptomDesc = (desc: StringWithValidationState, symptom: string) => {
  let isValid = true
  if (desc.value === "" && symptom == 'Other') {
    desc.isValid = false
    desc.errorMessage = 'Required'
    isValid = false
  } else {
    desc.isValid = true
    desc.errorMessage = ""
  }
  return isValid
}
const validateSymptoms = () => {
  let isValid = true
  const parentValids = [] as boolean[]
  symptoms.value.forEach((e, index) => {
    const valids = [] as boolean[]
    valids.push(validateSymptom(e))
    valids.push(validateSymptomDesc(symptomsDesc.value[index], e.value))
    parentValids.push(valids.every((x) => {
      return x
    }))
  })
  isValid = parentValids.every((x) => {
    return x
  })
  return isValid
}
const addNewSymptom = () => {
  /* validate first */
  const isValid = validateSymptoms()
  if (!isValid) return
  symptoms.value.push({
    value: '',
    isValid: true,
    errorMessage: ''
  })
  symptomsDesc.value.push({
    value: '',
    isValid: true,
    errorMessage: ''
  })
}
const removeSymptom = (index: number) => {
  symptoms.value.splice(index, 1)
  symptomsDesc.value.splice(index, 1)
}
const onCauseChange = (event, index: number) => {
  validateCause(causes.value[index])
}
const onCauseDescChange = (param: TextareaParam) => {
  if (param.index == undefined) return
  causesDesc.value[param.index].value = param.value
  validateCauseDesc(causesDesc.value[param.index], causes.value[param.index].value)
}
const validateCauseDesc = (desc: StringWithValidationState, cause: string) => {
  let isValid = true
  if (desc.value === '' && cause == 'Other') {
    desc.isValid = false
    desc.errorMessage = 'Required'
    isValid = false
  } else {
    desc.isValid = true
    desc.errorMessage = ""
  }
  return isValid
}
const validateCause = (cause: StringWithValidationState) => {
  let isValid = true
  if (cause.value == "") {
    cause.isValid = false
    cause.errorMessage = 'Required'
    isValid = false
  } else {
    const duplicateCause = causes.value.filter((l) => {
      return l.value == cause.value;
    })
    if (duplicateCause.length > 1) {
      cause.isValid = false
      cause.errorMessage = 'Duplicate cause'
      isValid = false
    } else {
      cause.isValid = true
      cause.errorMessage = ""
    }
  }
  return isValid
}
const validateCauses = () => {
  let isValid = true
  const parentValids = [] as boolean[]
  causes.value.forEach((e, index) => {
    const valids = [] as boolean[]
    valids.push(validateCause(e))
    valids.push(validateCauseDesc(causesDesc.value[index], e.value))
    parentValids.push(valids.every((x) => {
      return x
    }))
  })
  isValid = parentValids.every((x) => {
    return x
  })
  return isValid
}
const addNewCause = () => {
  /* validate first */
  const isValid = validateCauses()
  if (!isValid) return
  causes.value.push({
    value: '',
    isValid: true,
    errorMessage: ''
  })
  causesDesc.value.push({
    value: '',
    isValid: true,
    errorMessage: ''
  })
}
const removeCause = (index: number) => {
  causes.value.splice(index, 1)
  causesDesc.value.splice(index, 1)
}
const setModify = () => {
  handleScrollToTopOfDialog(customClass.value)
  if (resources.value.length < 1) {
    resources.value.push({
      value: '',
      isValid: true,
      errorMessage: ''
    })
  }
  otherResourceCollapse.value = 'Other Resource (optional)'
  clonedDefectData.value = {
    images: cloneDeep(props.defectImages),
    description: cloneDeep(description.value.value),
    priority: cloneDeep(priority.value),
    instruction: cloneDeep(instruction.value.value),
    plannedDuration: cloneDeep(plannedDuration.value.value),
    parts: cloneDeep(parts.value),
    labours: cloneDeep(labours.value),
    resources: cloneDeep(resources.value),
    symptoms: cloneDeep(symptoms.value),
    causes: cloneDeep(causes.value),
  }
  isDisabled.value = false
}
const setCancel = () => {
  setDefault()
  setParts()
  setLabours()
  setResources()
  setSymptoms()
  setCauses()
  isDisabled.value = true
}
const createParts = () => {
  return parts.value.map((p) => {
    return {
      partNumber: p.partNumber,
      partDescription: p.partDescription.value,
      qty: reformatNumberWithComma(p.partQty.value),
      images: p.images ?? [],
      attachment: p.attachment ?? []
    }
  })
}
const createLabours = () => {
  return labours.value.map((l) => {
    return {
      position: l.position.value,
      qty: reformatNumberWithComma(l.qty.value),
      hireEach: reformatNumberWithComma(l.hourEach.value),
      totalHours: reformatNumberWithComma(l.totalHour)
    }
  })
}
const expandAllPanel = () => {
  priorityCollapse.value = 'Priority'
  partsRequiredCollapse.value = 'Parts'
  labourRequired.value = 'Labour'
  otherResourceCollapse.value = 'Other Resource (optional)'
  defectSysmptompCollapse.value = 'Symptom'
  defectCausesCollapse.value = 'Cause'
}
const onSubmitDefect = () => {
  // validate first
  let isValid = [] as boolean[]
  isValid.push(validateImage())
  isValid.push(validateDescription())
  isValid.push(validatePlannedDuration())
  isValid.push(validateInstruction())
  isValid.push(validateParts())
  isValid.push(validateLabours())
  isValid.push(validateResources())
  isValid.push(validateSymptoms())
  isValid.push(validateCauses())
  const valid = isValid.every((x) => {
    return x == true
  })
  if (!valid) {
    expandAllPanel()
    handleScrollToErrorModal('edit-form-defect-yes')
    return
  }
  confirmVisible.value = true
}
const onSave = () => {
  const formData = {} as DefectYesFormData
  formData.isNeed30Minutes = props.isNeed30Minutes
  formData.type = 'YES',
  formData.assetNumber = props.defectData.assetNumber
  formData.raisedBy = props.currentFitter.name
  formData.date = props.defectData.date
  formData.description = description.value.value
  formData.plannedDuration = reformatNumberWithComma(plannedDuration.value.value)
  formData.instruction = instruction.value.value
  formData.priority = priority.value
  formData.parts = createParts()
  formData.labours = createLabours()
  formData.resources = resources.value.filter((r) => {
    return r.value != ''
  }).map((r) => {
    return r.value
  })
  formData.symptoms = symptoms.value.map((s, index) => {
    return s.value.includes('Other') ? `${s.value}:${symptomsDesc.value[index].value}` : s.value
  })
  formData.causes = causes.value.map((c, index) => {
    return c.value.includes('Other') ? `${c.value}:${causesDesc.value[index].value}` : c.value
  })
  formData.taskDesc = props.taskDesc
  formData.taskNo = props.taskNo
  const data = {} as TaskUpdateObject
  data.employee = props.currentFitter
  data.taskKey = props.task.key
  data.taskCategory = props.task.category
  data.itemKey = props.task.key
  data.type = 'NORMAL'
  data.value = '3'
  data.timeStamp = AESTCurrentDateTime()
  data.task = props.task
  formData.task = data
  emits('onSubmit', formData)
  defectSubmitted.value = true
  confirmVisible.value = false
}
const onCancel = () => {
  confirmVisible.value = false
}
const onFormClosed = async () => {
  emits('onClose', defectSubmitted.value)
}
const setDefault = () => {
  description.value.value = props.defectData.description
  description.value.isValid = true
  description.value.errorMessage = ''
  plannedDuration.value.value = props.defectData.plannedDuration
  plannedDuration.value.isValid = true
  plannedDuration.value.errorMessage = ''
  instruction.value.value = props.defectData.instruction
  instruction.value.isValid = true
  instruction.value.errorMessage = ''
  priority.value = props.defectData.priority
  emits('onResetImage', props.defectData.images)
}
const setParts = () => {
  parts.value = []
  const rawData = JSON.parse(props.defectData.parts) as unknown as any[]
  rawData.forEach((p) => {
    parts.value.push({
      partNumber: p.partNumber,
      partDescription: {
        value: p.partDescription,
        isValid: true,
        errorMessage: ''
      },
      partQty: {
        value: p.qty,
        isValid: true,
        errorMessage: ''
      },
      images: p.images ?? [],
      attachment: p.attachment ?? []
    })
  })
}
const setLabours = () => {
  labours.value = []
  const rawData = JSON.parse(props.defectData.labours) as unknown as any[]
  rawData.forEach((l) => {
    labours.value.push({
      position: {
        value: l.position,
        isValid: true,
        errorMessage: ''
      },
      qty: {
        value: l.qty,
        isValid: true,
        errorMessage: ''
      },
      hourEach: {
        value: l.hireEach,
        isValid: true,
        errorMessage: ''
      },
      totalHour: l.totalHours
    })
  })
}
const setResources = () => {
  otherResourceCollapse.value = ''
  resources.value = []
  const rawData = JSON.parse(props.defectData.resources) as unknown as string[]
  rawData.forEach((r) => {
    resources.value.push({
      value: r,
      isValid: true,
      errorMessage: ''
    })
  })
  if (resources.value.length > 0) {
    otherResourceCollapse.value = 'Other Resource (optional)'
  }
}
const setSymptoms = () => {
  symptoms.value = []
  symptomsDesc.value = []
  const rawData = JSON.parse(props.defectData.symptoms) as unknown as string[]
  rawData.forEach((s) => {
    symptoms.value.push({
      value: s.split(":")[0],
      isValid: true,
      errorMessage: ''
    })
    symptomsDesc.value.push({
      value: stringGroupExtractor(s),
      isValid: true,
      errorMessage: ''
    })
  })
}
const setCauses = () => {
  causes.value = []
  causesDesc.value = []
  const rawData = JSON.parse(props.defectData.causes) as unknown as string[]
  rawData.forEach((c) => {
    causes.value.push({
      value: c.split(":")[0],
      isValid: true,
      errorMessage: ''
    })
    causesDesc.value.push({
      value: stringGroupExtractor(c),
      isValid: true,
      errorMessage: ''
    })
  })
}
const onFormOpened = () => {
  isDisabled.value = true
  disabledHyperlink(defectDetailRef.value)
  try {
    setDefault()
    setParts()
    setLabours()
    setResources()
    setSymptoms()
    setCauses()
    handleScrollToTopOfDialog(customClass.value)
  } catch (error) {
    console.log(error)
  }
}

const sameFitter = computed(() => {
  if (props.task.updatedBy) {
    const user = props.task.updatedBy as Audit
    if (user.id == props.currentFitter.id) {
      return true
    }
  }
  return false
})

const isNotSubmit = computed(() => {
  const isAcknowledge = props.status == "Acknowledge"
  const isDecline = props.status == "Decline"
  return !(isAcknowledge || isDecline)
})

const canModify = computed(() => {
  if (!props.generalSubmitted) return false
  // in ticket BAA-10696 now other fitter can modify defect
  // if defect approved, modify is hidden
  if (props.approvedBy && props.approvedBy.name) return false
  return true
})

const onlyNumber = (e) => {
  const keyCode = e.which ? e.which : e.keyCode;

  // only allow number and one dot
  if (
    (keyCode < 48 || keyCode > 57)
        && (keyCode !== 46 || e.target.value.indexOf('.') !== -1)
  ) {
    // 46 is dot
    e.preventDefault();
  }
}

const watchedFields = [
  "images",
  "description",
  "priority",
  "instruction",
  "plannedDuration",
  "parts",
  "labours",
  "resources",
  "symptoms",
  "causes",
];

const comparedData = computed(() => {
  return {
    images: props.defectImages,
    description: description.value.value,
    priority: priority.value,
    instruction: instruction.value.value,
    plannedDuration: plannedDuration.value.value,
    parts: parts.value,
    labours: labours.value,
    resources: resources.value,
    symptoms: symptoms.value,
    causes: causes.value,
  }
})

const editedForm = computed(() => {
  if (!isDisabled.value) {
    return hasDefectDataChanged(watchedFields, clonedDefectData.value, comparedData.value)
  }
  return false
})

const handleBeforeClose = () => {
  if (isDisabled.value) {
    emits("onClose")
  } else {
    if (editedForm.value) {
      showConfirmExit.value = true
    } else {
      emits("onClose")
    }
  }
}

const onCancelExit = () => {
  showConfirmExit.value = false
}

const onSaveExit = () => {
  showConfirmExit.value = false
  emits("onClose")
}

const formatOwnershipHTML = computed(() => {
  const ownership = props.ownership
  return formatOwnership(ownership)
})

const title = computed(() => {
  if (props.generic) {
    return props.taskDesc
  }
  return displayDesc(props.taskDesc, true)
})
defineExpose({
  handlePartImage,
  handlePartAttachment
})
</script>

<style lang="scss">
.el-dialog__title {
  text-align: start;
}

.vcp {
  background: white;
  border: 1px solid rgba(145, 158, 171, 0.24);
  border-radius: 12px;
}

.vcp__body {
  overflow: inherit !important;
  font-size: 14px;
}
</style>
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
