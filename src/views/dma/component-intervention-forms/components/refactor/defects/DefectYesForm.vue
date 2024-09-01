<template>
  <el-dialog v-model="dialogVisible" width="90%" center
    @closed="onFormClosed"
    @opened="onFormOpened"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleBeforeClose"
    :custom-class="`el-defect-crack-form-custom form-defect-yes ${customClass}`"
    :destroy-on-close="true">
    <template #title>
      <span class="el-dialog__title">Detailed Information for Defect Identification</span>
      <span class="el-dialog__title task-title" v-html="displayDesc(title, true)" ref="defectDetailRef" v-if="!generic"></span>
    </template>
    <div>
      <div class="d-flex flex-column justify-content-between" v-if="generic">
        <div class="py-2 d-flex flex-row flex-grow-1">
          <div class="flex-fill">
              <div class="form-floating">
                <input type="text" class="form-control" v-model="taskDescriptionValidation.value" @change="handleTaskDescription">
                <label for="floatingInput">Task Description</label>
              </div>
              <div class="mt-2">
                <Label class="error-label" v-if="!taskDescriptionValidation.isValid">{{ taskDescriptionValidation.errorMessage }}</Label>
              </div>
          </div>
        </div>
      </div>
      <div class="d-flex flex-row justify-content-between">
        <div class="py-2 d-flex flex-row flex-grow-1">
          <div class="flex-fill">
            <div class="form-floating">
              <div type="text" class="form-control asset-number-disabled-div" v-html="assetNumber"></div>
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
        :generated-i-d="generatedID"
        :re-render="reRender"
        :defect-images="defectImages"
        :type="'defect'"
        :disabled="false"
        :allow-delete="true"
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
          :value="description?.value"
          :label="defectPlaceholder"
          name="defectPlaceholder"
          :errorMessage="description.errorMessage"
          :is-valid="description.isValid"
          @handleChange="onDescriptionChange"
        ></Textarea>
      </div>
      <div class="mt-1 py-2">
          <div class="row">
              <div class="col pe-0">
                  <div class="form-floating">
                      <input type="text" class="form-control" disabled :value="currentFitter.name">
                      <label>Raised By</label>
                  </div>
              </div>
          </div>
      </div>
      <div class="mt-1 py-2">
        <div class="row">
          <div class="col-4 pe-0 date">
              <div class="form-floating">
                  <input type="text" class="form-control" disabled :value="current" />
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
                  @input="onPlannedHoursChange" />
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
          name="InstructionPlaceholder"
          :errorMessage="instruction.errorMessage"
          :is-valid="instruction.isValid"
          @handleChange="onInstructionChange"
        ></Textarea>
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
                  <input class="form-check-input" type="radio" v-model="priority" value="P1">
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
                    <input class="form-check-input" type="radio" v-model="priority" value="P2">
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
                    <input class="form-check-input" type="radio" v-model="priority" value="P3">
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
                    <input class="form-check-input" type="radio" v-model="priority" value="P4">
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
          <el-collapse-item title="Parts Required" name="Parts Required">
            <div class="row p-3 m-1 priority-container" style="background: #F4F6F8; border-radius: 8px;">
                <div class="col-3">Part Number</div>
                <div class="col-5">Part Description</div>
                <div class="col-1">Qty</div>
                <div class="col"></div>
                <div class="col"></div>
              </div>
              <template v-for="(item, index) in parts" :key="item">
                <div class="row p-3 m-1 priority-container px-0">
                  <div class="col-3 px-0">
                    <div class="d-flex flex-column">
                      <input type="text" class="form-control"
                      v-model="parts[index].partNumber" />
                    </div>
                  </div>
                  <div class="col-5">
                    <div class="d-flex flex-column">
                      <input type="text" class="form-control"
                      v-model="item.partDescription.value"
                      @change="onPartDescriptionChange($event, index)" />
                      <div class="mt-2" v-if="!item.partDescription.isValid">
                          <Label class="error-label">{{ item.partDescription.errorMessage }}</Label>
                      </div>
                    </div>
                  </div>
                  <div class="col-1 px-1 d-flex justify-content-start">
                    <div class="d-flex flex-column">
                      <input pattern="[0-9]*" inputmode="numeric" class="form-control"
                      :value="formatNumberInput(item.partQty.value)"
                      @input="onPartQtyChange($event, index)" />
                      <div class="mt-2" v-if="!item.partQty.isValid">
                          <Label class="error-label">{{ item.partQty.errorMessage }}</Label>
                      </div>
                    </div>
                  </div>
                  <div class="col px-1 d-flex flex-column justify-content-start">
                    <div class="row p-0 m-0 h-100 w-100 align-items-center">
                      <SmallCamera :index="index" :item-value="item.images || []" @on-camera-clicked="handleCameraClick" @on-image-delete="handleImagePartDeleted" />
                    </div>
                  </div>
                  <div class="col px-1 d-flex flex-column justify-content-start position-relative">
                    <div class="row p-0 m-0 h-100 w-100 align-items-center">
                      <UploadAttachment :index="index" :item-value="item.attachment || []" @on-attachment-clicked="handleAttachmentClicked" @on-attachment-delete="handleAttachmentPartDeleted"/>
                    </div>
                    <div class="position-absolute" style="top:10px; right: 0px;">
                        <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="removePart(index)"></em>
                    </div>
                  </div>
                </div>
              </template>
              <button class="my-3 btn-add-new" @click="addNewPart">
                <em class="fa fa-plus me-2"></em>
                Add more parts
              </button>
          </el-collapse-item>
        </el-collapse>
        <div class="mt-2"></div>
        <el-collapse class="task-group general-accordion py-1 px-5" v-model="labourRequired">
          <el-collapse-item title="Labour Required" name="Labour Required">
            <div class="row p-3 m-1 priority-container" style="background: #F4F6F8; border-radius: 8px;">
              <div class="col-6">Labour Activity</div>
              <div class="col-2">Qty</div>
              <div class="col-2 word-breaker">Hours Each</div>
              <div class="col-2 word-breaker">Total Hours</div>
            </div>
            <div class="row p-3 m-1 priority-container ps-0" v-for="(item, index) in labours" :key="item.position.value">
                <div class="col-6 px-0">
                  <div class="d-flex flex-column">
                    <el-select
                      v-model="item.position.value"
                      filterable
                      @change="onPositionChange(index)"
                      placeholder="Choose Labour"
                      class="w-100">
                      <template v-for="opt in positions" :key="opt.value">
                        <el-option :label="opt.label" :value="opt.label" />
                      </template>
                    </el-select>
                    <div class="mt-2" v-if="!item.position.isValid">
                        <Label class="error-label">{{ item.position.errorMessage }}</Label>
                    </div>
                  </div>
                </div>
                <div class="col-2  d-flex justify-content-start">
                  <div class="d-flex flex-column">
                    <input pattern="[0-9]*" inputmode="numeric" class="form-control"
                    :value="formatNumberInput(item.qty.value)" @keypress="onlyIntegerInput"
                    @input="onLabourQtyChange($event, index)" />
                    <div class="mt-2" v-if="!item.qty.isValid">
                        <Label class="error-label">{{ item.qty.errorMessage }}</Label>
                    </div>
                  </div>
                </div>
                <div class="col-2 d-flex justify-content-start">
                  <div class="d-flex flex-column">
                    <input pattern="[0-9]*" inputmode="numeric" class="form-control" @keypress="onlyNumber"
                    :value="formatNumberInput(item.hourEach.value)"
                    @input.prevent="onLabourHourEachChange($event, index)" />
                    <div class="mt-2" v-if="!item.hourEach.isValid">
                        <Label class="error-label">{{ item.hourEach.errorMessage }}</Label>
                    </div>
                  </div>
                </div>
                <div class="col-2 d-flex justify-content-start">
                  <div class="d-flex flex-column">
                    <input class="form-control" :value="item.totalHour" disabled />
                  </div>
                  <div class="ms-4 d-flex align-items-center" :class="index === 0 ? 'hidden' : ''" style="height:46px">
                      <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="removeLabour(index)"></em>
                  </div>
                </div>
            </div>
            <button class="my-3 btn-add-new" @click="addNewLabour">
              <em class="fa fa-plus me-2"></em>
              Add more labour
            </button>
          </el-collapse-item>
        </el-collapse>
        <div class="mt-2"></div>
        <el-collapse class="task-group general-accordion py-1 px-5" v-model="otherResourceCollapse">
          <el-collapse-item title="Other Resources Required (optional)" name="Other Resources Required (optional)">
            <div class="p-2 d-flex" v-for="(item, index) in resources" :key="index">
              <div class="d-flex flex-fill flex-column">
                <input type="text" class="form-control" :value="item.value" :placeholder="`Resource${index + 1}`"
                @change="onResourceChange($event, index)" />
                <div class="mt-2" v-if="!item.isValid">
                    <Label class="error-label">{{ item.errorMessage }}</Label>
                </div>
              </div>
              <div class="ms-4 d-flex align-items-center" :class="index === 0 ? 'hidden' : ''" style="height:46px">
                <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="removeResource(index)"></em>
              </div>
            </div>
            <button class="my-3 btn-add-new" @click="addNewResource">
              <em class="fa fa-plus me-2"></em>
              Add new resource
            </button>
          </el-collapse-item>
        </el-collapse>
        <div class="mt-2"></div>
        <el-collapse class="task-group general-accordion py-1 px-5" v-model="defectSysmptompCollapse">
          <el-collapse-item title="Defect Symptom" name="Defect Symptom">
            <div class="p-2 d-flex" v-for="(symptom, index) in symptoms" :key="symptom.value">
              <div class="d-flex flex-fill flex-column">
                <el-select
                  v-model="symptom.value"
                  placeholder="Select Symptom"
                  filterable
                  @change="onSymptomChange($event, index)"
                  class="w-100">
                  <template v-for="opt in symptomOptions" :key="opt.id">
                    <el-option :label="opt.symptom" :value="opt.symptom" />
                  </template>
                </el-select>
                <div class="mt-2" v-if="!symptom.isValid">
                  <Label class="error-label">{{ symptom.errorMessage }}</Label>
                </div>
                <div class="mt-2" v-if="symptom.value.includes('Other')">
                  <Textarea
                    :value="symptomsDesc[index].value"
                    label="Description"
                    name="Description"
                    errorMessage="Required"
                    :is-valid="symptomsDesc[0].isValid"
                    :index="index"
                    @handleChange="onSymptomDescChange"
                  ></Textarea>
                </div>
                <div class="mt-2" v-if="!symptomsDesc[index].isValid">
                  <Label class="error-label">{{ symptomsDesc[index].errorMessage }}</Label>
                </div>
              </div>
              <div class="ms-4 d-flex align-items-center" :class="index === 0 ? 'hidden' : ''" style="height:46px">
                <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="removeSymptom(index)"></em>
              </div>
            </div>
            <button class="my-3 btn-add-new" @click.prevent="addNewSymptom">
              <em class="fa fa-plus me-2"></em>
              Add another symptom
            </button>
          </el-collapse-item>
        </el-collapse>
        <div class="mt-2"></div>
        <el-collapse class="task-group general-accordion py-1 px-5" v-model="defectCausesCollapse">
          <el-collapse-item title="Defect Cause" name="Defect Cause">
            <div class="p-2 d-flex" v-for="(cause, index) in causes" :key="cause.value">
              <div class="d-flex flex-fill flex-column">
                <el-select
                    v-model="cause.value"
                    placeholder="Select Cause"
                    filterable
                    @change="onCauseChange($event, index)"
                    class="w-100">
                    <template v-for="opt in causeOptions" :key="opt.id">
                      <el-option :label="opt.causes" :value="opt.causes" />
                    </template>
                </el-select>
                <div class="mt-2" v-if="!cause.isValid">
                    <Label class="error-label">{{ cause.errorMessage }}</Label>
                </div>
                <div class="mt-2" v-if="cause.value.includes('Other')">
                  <Textarea
                    :value="causesDesc[index].value"
                    label="Description"
                    name="Description"
                    errorMessage="Required"
                    :is-valid="causesDesc[0].isValid"
                    :index="index"
                    @handleChange="onCauseDescChange"
                  ></Textarea>
                </div>
                <div class="mt-2" v-if="!causesDesc[index].isValid">
                    <Label class="error-label">{{ causesDesc[index].errorMessage }}</Label>
                </div>
              </div>
              <div class="ms-4 d-flex align-items-center" :class="index === 0 ? 'hidden' : ''" style="height:46px">
                <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="removeCause(index)"></em>
              </div>
            </div>
            <button class="my-3 btn-add-new" @click="addNewCause">
              <em class="fa fa-plus me-2"></em>
              Add another cause
            </button>
          </el-collapse-item>
        </el-collapse>
        <div class="my-5 w-100">
          <button class="btn btn-success w-100" @click.prevent="onSubmitDefect"
          style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Submit</button>
        </div>
      </div>
      <Confirmation :visibility="confirmVisible"
        caption="Please confirm this defect information is correct."
        @on-no-confirm="onCancel"
        @on-yes-confirm="onConfirmSubmit" />
      <Confirmation :visibility="showConfirmExit"
        caption="Are you sure want to close the defect form? <br /> Note: By closing the defect form, you will lose your defect data that you have already inputted."
        @on-no-confirm="onCancelExit"
        @on-yes-confirm="onSaveExit" />
    </el-dialog>
  </template>

<script lang="ts" setup>
import { Audit } from '@/core/types/intervention/Audit'
import DefectCamera from '@/components/camera/DefectCamera.vue'
import { IDetailTask } from '@/core/types/intervention/IDetailTask'
import {
  defineProps,
  defineEmits,
  toRef,
  PropType,
  ref,
  computed,
  defineExpose
} from 'vue'
import { displayDesc } from "@/core/helpers/manipulate-html-string"
import {
  StringWithValidationState
} from '@/core/types/misc/StringWithValidationState'
import { AESTCurrentDateTime } from '@/core/helpers/date-format'
import {
  formatNumberInput,
  isDotTheLastDigit,
  maximumFiveDigitWithTwoFraction,
  reformatNumberWithComma,
  maximumFiveDigit
} from '@/core/helpers/number-format'
import { Parts } from '@/core/types/intervention/Parts'
import { Option } from '@/core/types/misc/Option'
import { Symptom } from '@/core/types/entities/dma/masters/Symptom'
import { Causes } from '@/core/types/entities/dma/masters/Causes'
import { DefectYesFormData } from '@/core/types/intervention/DefectYesFormData'
import { Labours } from '@/core/types/intervention/Labours'
import Confirmation from '@/components/dialog/Confirmation.vue'
import { CameraParam } from '@/core/types/intervention/CameraParam'
import {
  handleScrollToErrorModal,
  handleScrollToTopOfDialog
} from '@/core/helpers/ironforms/defects-form/defect-form'
import Textarea from "@/components/inputs/dma/Textarea.vue";
import { TextareaParam } from '@/core/types/misc/TextareaParam'
import { v4 as uuidv4 } from 'uuid';
import {
  formatOwnership,
  getTitle,
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
    type: Boolean,
    required: true
  },
  assetNumber: {
    type: String,
    required: true
  },
  task: {
    type: Object as PropType<IDetailTask>,
    required: true
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
  generatedID: {
    required: false,
    type: String,
    default: ""
  },
  isNeed30Minutes: {
    default: false
  }
})

const emits = defineEmits([
  'onCameraClick',
  'onAttachmentClicked',
  'onImageDeleted',
  'onImagePartDeleted',
  'onAttachmentPartDeleted',
  'onSubmit',
  'onCancel',
  'onClose',
  'OnSetFlagFromDeleteAction'
])

/* collapsible binding */
const priorityCollapse = ref('Priority')
const partsRequiredCollapse = ref('Parts Required')
const labourRequired = ref('Labour Required')
const otherResourceCollapse = ref('Other Resources Required (optional)')
const defectSysmptompCollapse = ref('Defect Symptom')
const defectCausesCollapse = ref('Defect Cause')
/* refs */
const showConfirmExit = ref(false)
const defectSubmitted = ref(false)
const confirmVisible = ref(false)
const dialogVisible = toRef(props, "visibility")
const current = ref(AESTCurrentDateTime())
const description = ref<StringWithValidationState>({
  value: '',
  isValid: true,
  errorMessage: ''
})
const instruction = ref<StringWithValidationState>({
  value: '',
  isValid: true,
  errorMessage: ''
})
const images = ref<string[]>([])
const isImageValid = ref(true)
const defectDetailRef = ref<HTMLElement>()
const plannedDuration = ref<StringWithValidationState>(
  {
    value: '',
    isValid: true,
    errorMessage: ''
  }
)
const customClass = ref(uuidv4())
const defectCameraRef = ref()

// default P1
const priority = ref("P1")
const parts = ref<Parts[]>([])
const labours = ref<Labours[]>([{
  position: {
    value: 'Diesel Fitter',
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
}])
const resources = ref<StringWithValidationState[]>([
  {
    value: '',
    isValid: true,
    errorMessage: ''
  }
])
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

const clonedDefectData = ref()
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
  return hasDefectDataChanged(watchedFields, clonedDefectData.value, comparedData.value)
})
const handleTaskDescription = () => {
  validateTaskDescription()
}
const taskDescriptionValidation = ref<StringWithValidationState>({
  isValid: true,
  errorMessage: "",
  value: '',
})

/* computeds */
const title = computed(() => {
  return getTitle(props.task)
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
const handleImagePartDeleted = (params) => {
  // delete taskimage
  emits('onImagePartDeleted', params.filename)
  // delete on state
  const images = parts.value[params.index].images
  if (images) {
    parts.value[params.index].images = cloneDeep(images).filter((img) => {
      return img.filename != params.filename
    })
  }
}
const handleAttachmentClicked = (key) => {
  emits('onAttachmentClicked', key)
}
const handleAttachmentPartDeleted = (params) => {
  // delete taskattachment
  emits('onAttachmentPartDeleted', params.filename)
  // delete on state
  const attachments = parts.value[params.index].attachment
  if (attachments) {
    parts.value[params.index].attachment = cloneDeep(attachments).filter((att) => {
      return att.url != params.filename
    })
  }
}
const onDescriptionChange = (param: TextareaParam) => {
  description.value.value = param.value
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
const validateTaskDescription = () => {
  let isValid = true
  if (taskDescriptionValidation.value.value == "") {
    taskDescriptionValidation.value.isValid = false
    taskDescriptionValidation.value.errorMessage = "Required"
    isValid = false
  } else {
    taskDescriptionValidation.value.isValid = true
    taskDescriptionValidation.value.errorMessage = ""
  }
  return isValid
}
const onPlannedHoursChange = (e) => {
  plannedDuration.value.value = reformatNumberWithComma(e.target.value);
  validatePlannedDuration()
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
const onInstructionChange = (param: TextareaParam) => {
  instruction.value.value = param.value
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
    const validFormat = maximumFiveDigitWithTwoFraction(partQty.value)
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
      return x
    }))
  })
  isValid = parentValids.every((x) => {
    return x
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
    }
  })
}
const removePart = (index: number) => {
  parts.value.splice(index, 1)
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
      position.errorMessage = 'Duplicate position'
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
    const validFormat = maximumFiveDigit(qty.value)
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
    const validFormat = maximumFiveDigitWithTwoFraction(hourEach.value)
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
    return
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
const onSubmitDefect = () => {
  // validate first
  let isValid = [] as boolean[]
  if (props.generic) {
    // check task desc
    isValid.push(validateTaskDescription())
  }
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
    return x
  })
  if (!valid) {
    expandAllPanel()
    handleScrollToErrorModal()
    return
  }
  confirmVisible.value = true
}
const createParts = () => {
  return parts.value.map((p) => {
    return {
      partNumber: p.partNumber,
      partDescription: p.partDescription.value,
      qty: reformatNumberWithComma(p.partQty.value),
      images: p.images,
      attachment: p.attachment
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
const onConfirmSubmit = () => {
  const formData = {} as DefectYesFormData
  formData.type = 'YES'
  formData.isNeed30Minutes = props.isNeed30Minutes
  formData.assetNumber = props.assetNumber
  formData.raisedBy = props.currentFitter.name
  formData.date = current.value
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
    return s.value == 'Other' ? `${s.value}:${symptomsDesc.value[index].value}` : s.value
  })
  formData.causes = causes.value.map((c, index) => {
    return c.value == 'Other' ? `${c.value}:${causesDesc.value[index].value}` : c.value
  })
  if (props.generic) {
    formData.taskDesc = taskDescriptionValidation.value.value
    formData.taskNo = ""
  } else {
    formData.taskDesc = props.task.description
    formData.taskNo = props.task.interventionSequence as string
  }
  emits('onSubmit', formData)
  defectSubmitted.value = true
  confirmVisible.value = false
  taskDescriptionValidation.value = {
    isValid: true,
    errorMessage: "",
    value: '',
  }
}
const onCancel = () => {
  confirmVisible.value = false
}
const onFormClosed = async () => {
  taskDescriptionValidation.value = {
    isValid: true,
    errorMessage: "",
    value: '',
  }
  emits('onClose', defectSubmitted.value)
}
const resetFormModel = () => {
  defectSubmitted.value = false
  current.value = AESTCurrentDateTime()
  description.value = {
    value: '',
    isValid: true,
    errorMessage: ''
  }
  instruction.value = {
    value: '',
    isValid: true,
    errorMessage: ''
  }
  images.value = []
  isImageValid.value = true
  plannedDuration.value = {
    value: '',
    isValid: true,
    errorMessage: ''
  }
  priority.value = "P1"
  parts.value = []
  labours.value = [{
    position: {
      value: 'Diesel Fitter',
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
  }]
  resources.value = [
    {
      value: '',
      isValid: true,
      errorMessage: ''
    }
  ]
  symptoms.value = [
    {
      value: '',
      isValid: true,
      errorMessage: ''
    }
  ]
  symptomsDesc.value = [{
    value: '',
    isValid: true,
    errorMessage: ''
  }]
  causes.value = [
    {
      value: '',
      isValid: true,
      errorMessage: ''
    }
  ]
  causesDesc.value = [
    {
      value: '',
      isValid: true,
      errorMessage: ''
    }
  ]
}
const onFormOpened = () => {
  taskDescriptionValidation.value = {
    isValid: true,
    errorMessage: "",
    value: '',
  }
  try {
    resetFormModel()
    if (!props.generic) {
      disabledHyperlink(defectDetailRef.value)
    }
    handleScrollToTopOfDialog(customClass.value)
  } catch (error) {
    console.log(error)
  }
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
}
const expandAllPanel = () => {
  priorityCollapse.value = 'Priority'
  partsRequiredCollapse.value = 'Parts Required'
  labourRequired.value = 'Labour Required'
  otherResourceCollapse.value = 'Other Resources Required (optional)'
  defectSysmptompCollapse.value = 'Defect Symptom'
  defectCausesCollapse.value = 'Defect Cause'
}

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

const handleBeforeClose = () => {
  if (editedForm.value) {
    showConfirmExit.value = true
  } else {
    emits("onCancel")
  }
}

const onCancelExit = () => {
  showConfirmExit.value = false
}

const onSaveExit = () => {
  showConfirmExit.value = false
  emits("onCancel")
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

defineExpose({
  handlePartImage,
  handlePartAttachment
})

const formatOwnershipHTML = computed(() => {
  const ownership = props.ownership
  return formatOwnership(ownership)
})
</script>

<style lang="scss">
.el-dialog__title {
  text-align: start;
}

.el-select__popper {
  z-index: 90000 !important;
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
</style>
