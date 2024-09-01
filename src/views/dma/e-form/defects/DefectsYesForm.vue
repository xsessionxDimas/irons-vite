<template>
  <el-dialog v-model="dialogVisible" width="90%" center
    @closed="onFormClosed"
    @opened="onFormOpened"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleBeforeClose"
    :custom-class="`el-defect-crack-form-custom form-defect-yes-eform ${customClass}`"
    :destroy-on-close="true"
  >
    <template #title>
      <span class="el-dialog__title">Detailed Information for Defect Identification</span>
      <span class="el-dialog__title task-title" v-html="title" ref="defectDetailRef" ></span>
    </template>
    <div>
      <div class="d-flex flex-column justify-content-between" v-if="generic">
        <div class="py-2 d-flex flex-row flex-grow-1">
          <div class="flex-fill">
              <div class="form-floating">
                <input type="text" class="form-control" v-model="taskDescription" @handleChange="handleTaskDescription">
                <label for="floatingInput">Task Description</label>
              </div>
          </div>
        </div>
        <div class="mt-1" v-if="!taskDescriptionValidation.isValid">
          <Label class="error-label">{{ taskDescriptionValidation.errorMessage }}</Label>
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
        <large-camera
        :id="'defect'"
        :disabled="false"
        :allow-delete="true"
        :is-monitoring="false"
        :is-mandatory="isCustomValidationNormalTakePhoto" />
      </div>
      <template v-if="showCameraValidation">
        <Label class="error-label">Required</Label>
      </template>
      <div class="mt-1 py-2">
        <div class="d-flex flex-column">
          <Textarea
            class="form-control h-100px"
            :value="data?.Description?.value"
            :label="defectPlaceholder"
            name="defectPlaceholder"
            :errorMessage="data.Description.errorMessage"
            :is-valid="data.Description.isValid"
            @handleChange="onDescriptionChange"
          ></Textarea>
        </div>
      </div>
      <div class="mt-1 py-2">
        <div class="row">
          <div class="col pe-0">
            <div class="form-floating">
              <input type="text" class="form-control" disabled :value="formStore.selectedFitter.name">
              <label>Raised By</label>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-1 py-2">
        <div class="row">
          <div class="col-4 pe-0 date">
                <div class="form-floating">
                  <input type="text" class="form-control" disabled :value="current()" />
                  <label>Date Raised</label>
                </div>
              </div>
              <div class="col pe-0 d-flex">
                  <div class="d-flex flex-column flex-fill">
                    <div class="form-floating">
                      <input
                        type="text"
                        pattern="[0-9]*"
                        inputmode="numeric"
                        class="form-control"
                        :value="formatNumberInput(data.PlannedDuration.value)"
                        @input="onPlannedHoursChange"
                        @keypress="onlyNumber"
                      />
                      <label class="text-nowrap">How long will this defect repair takes?</label>
                    </div>
                    <div class="mt-2" v-if="!data.PlannedDuration.isValid">
                      <Label class="error-label">{{ data.PlannedDuration.errorMessage }}</Label>
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
          class="form-control h-100px"
          :value="data.Instruction.value"
          :label="instructionPlaceholder"
          name="instructionPlaceholder"
          :errorMessage="data.Instruction.errorMessage"
          :is-valid="data.Instruction.isValid"
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
                <input class="form-check-input" type="radio" v-model="priority" value="P1" @change.prevent="onPriorityChange">
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
                  <input class="form-check-input" type="radio" v-model="priority" value="P2" @change.prevent="onPriorityChange">
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
                  <input class="form-check-input" type="radio" v-model="priority" value="P3" @change.prevent="onPriorityChange">
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
                  <input class="form-check-input" type="radio" v-model="priority" value="P4" @change.prevent="onPriorityChange">
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
            <template v-for="(item, index) in data.Parts" :key="item">
              <div class="row p-3 m-1 priority-container px-0">
                <div class="col-3 px-0">
                  <div class="d-flex flex-column">
                    <input type="text" class="form-control" v-model="data.Parts[index].partNumber" />
                    <div class="mt-2" v-if="!item.partNumberValidation.isValid">
                        <Label class="error-label">{{ item.partNumberValidation.message }}</Label>
                    </div>
                  </div>
                </div>
                <div class="col-5">
                  <div class="d-flex flex-column">
                    <input type="text" class="form-control" :value="item.partDescription" @change="onPartDescriptionChange($event, index)" />
                    <div class="mt-2" v-if="!item.descriptionValidation.isValid">
                        <Label class="error-label">{{ item.descriptionValidation.message }}</Label>
                    </div>
                  </div>
                </div>
                <div class="col-1 px-1 d-flex flex-column justify-content-start">
                  <div class="row p-0 m-0 h-50 w-100">
                    <div class="p-0 col-12 d-flex">
                      <input pattern="[0-9]*" inputmode="numeric" class="form-control" :value="formatNumberInput(item.qty)" @input="onPartQtyChange($event, index)" @keypress="onlyNumber"/>
                    </div>
                  </div>
                  <div class="mt-2 flex-fill" v-if="!item.qtyValidation.isValid">
                      <Label class="error-label">{{ item.qtyValidation.message }}</Label>
                  </div>
                </div>
                <div class="col px-1 d-flex flex-column justify-content-start">
                  <div class="row p-0 m-0 h-100 w-100 align-items-center">
                    <SmallCamera :index="index" :item-value="item.images || []" @handle-change-image="onPartImageChange"/>
                  </div>
                </div>
                <div class="col px-1 d-flex flex-column justify-content-start position-relative">
                  <div class="row p-0 m-0 h-100 w-100 align-items-center">
                    <UploadAttachment :index="index" :item-value="item.attachment || []" @handle-change-attachment="onPartAttachmentChange"/>
                  </div>
                  <div class="position-absolute" style="top:10px; right: 0px;">
                      <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="onRemoveParts(index)"></em>
                  </div>
                </div>
              </div>
            </template>
            <button class="my-3 btn-add-new" @click="onAddNewParts">
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
          <template v-for="(item, index) in data.Labours" :key="item">
            <div class="row p-3 m-1 priority-container ps-0">
              <div class="col-6 px-0">
                <div class="d-flex flex-column">
                  <el-select
                    v-model="labours[index]"
                    filterable
                    placeholder="Choose Labour"
                    @change="onLabourChange(index)"
                    class="w-100">
                    <template v-for="opt in positionStore.positionOption" :key="opt.value">
                      <el-option :label="opt.label" :value="opt.label" />
                    </template>
                  </el-select>
                  <div class="mt-2" v-if="!item.positionValidation.isValid">
                      <Label class="error-label">{{ item.positionValidation.message }}</Label>
                  </div>
                </div>
              </div>
              <div class="col-2  d-flex justify-content-start">
                <div class="d-flex flex-column">
                  <input pattern="[0-9]*" inputmode="numeric" class="form-control" :value="formatNumberInput(item.qty)" @keypress="onlyIntegerInput"
                  @input="onLabourQtyChange($event, index)" />
                  <div class="mt-2" v-if="!item.qtyValidation.isValid">
                      <Label class="error-label">{{ item.qtyValidation.message }}</Label>
                  </div>
                </div>
              </div>
              <div class="col-2 d-flex justify-content-start">
                <div class="d-flex flex-column">
                  <input pattern="[0-9]*" inputmode="numeric" class="form-control" :value="formatNumberInput(item.hireEach)" @keypress="onlyNumber"
                  @input="onLabourHireEachChange($event, index)" />
                  <div class="mt-2" v-if="!item.hireEachValidation.isValid">
                      <Label class="error-label">{{ item.hireEachValidation.message }}</Label>
                  </div>
                </div>
              </div>
              <div class="col-2 d-flex flex-column justify-content-start">
                <div class="row p-0 m-0 h-50 w-100">
                  <div class="p-0 col-12 d-flex">
                    <input class="form-control" :value="formatNumberInput(item.totalHours)" disabled />
                    <div class="ms-4 d-flex align-items-center" :class="index === 0 ? 'hidden' : ''">
                        <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="onRemoveLabour(index)"></em>
                    </div>
                  </div>
                </div>
                <div class="mt-2 flex-fill" v-if="!item.totalHoursValidation.isValid">
                  <Label class="error-label">{{ item.totalHoursValidation.message }}</Label>
                </div>
              </div>
            </div>
          </template>
          <button class="my-3 btn-add-new" @click="onAddNewLabour">
            <em class="fa fa-plus me-2"></em>
            Add more labour
          </button>
        </el-collapse-item>
      </el-collapse>
      <div class="mt-2"></div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="otherResourceCollapse">
        <el-collapse-item title="Other Resources Required (optional)" name="Other Resources Required (optional)">
          <div class="p-2 d-flex" v-for="(item, index) in data.Resources" :key="item.value">
            <div class="d-flex flex-fill flex-column">
              <div class="d-flex flex-row">
                <input type="text" class="form-control" :value="item.value" :placeholder="`Resource ${Number(index) + 1}`"
                @change="onResourcesChange($event, index)" />
                <div class="ms-4 d-flex align-items-center" :class="index === 0 ? 'hidden' : ''">
                  <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="onRemoveResource(index)"></em>
                </div>
              </div>
              <div class="mt-2" v-if="!item.isValid">
                  <Label class="error-label">{{ item.errorMessage }}</Label>
              </div>
            </div>
          </div>
          <button class="my-3 btn-add-new" @click="onAddNewResource">
            <em class="fa fa-plus me-2"></em>
            Add new resource
          </button>
        </el-collapse-item>
      </el-collapse>
      <div class="mt-2"></div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="defectSysmptompCollapse">
        <el-collapse-item title="Defect Symptom" name="Defect Symptom">
          <div class="p-2 d-flex flex-column" v-for="(item, index) in data.Symptoms" :key="item.value">
            <div class="d-flex flex-row">
              <div class="d-flex flex-fill flex-column">
                <el-select
                    v-model="symptoms[index]"
                    placeholder="Select Symptom"
                    filterable
                    @change="onSymptomChange(index)"
                    class="w-100">
                    <template v-for="opt in masterStore.Symptoms" :key="opt.id">
                      <el-option :label="opt.symptom" :value="opt.symptom" />
                    </template>
                </el-select>
                <div class="mt-2" v-if="symptoms[index] === 'Other'">
                  <Textarea
                    class="form-control h-100px"
                    :value="symptomDesc[index]"
                    label="Description"
                    name="Description"
                    errorMessage="Required"
                    :is-valid="symptomDescValid[index]"
                    :index="index"
                    @handleChange="onSymptomDescChange"
                  ></Textarea>
                </div>
              </div>
              <div class="ms-4 d-flex align-items-center" :class="index === 0 ? 'hidden' : ''">
                <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="onRemoveSymptom(index)"></em>
              </div>
            </div>
            <div class="mt-2" v-if="!item.isValid">
                <Label class="error-label">{{ item.errorMessage }}</Label>
            </div>
          </div>
          <button class="my-3 btn-add-new" @click.prevent="onAddNewSymptom">
            <em class="fa fa-plus me-2"></em>
            Add another symptom
          </button>
        </el-collapse-item>
      </el-collapse>
      <div class="mt-2"></div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="defectCausesCollapse">
        <el-collapse-item title="Defect Cause" name="Defect Cause">
          <div class="p-2 d-flex flex-column" v-for="(item, index) in data.Causes" :key="item.value">
            <div class="d-flex flex-row">
              <div class="d-flex flex-fill flex-column">
                <el-select
                    v-model="causes[index]"
                    placeholder="Select Cause"
                    filterable
                    @change="onCauseChange(index)"
                    class="w-100">
                    <template v-for="opt in masterStore.Causes" :key="opt.id">
                      <el-option :label="opt.causes" :value="opt.causes" />
                    </template>
                </el-select>
                <div class="mt-2" v-if="causes[index] === 'Other'">
                  <Textarea
                    class="form-control h-100px"
                    :value="causesDesc[index]"
                    label="Description"
                    name="Description"
                    errorMessage="Required"
                    :is-valid="causesDescValid[index]"
                    :index="index"
                    @handleChange="onCauseDescChange"
                  ></Textarea>
                </div>
              </div>
              <div class="ms-4 d-flex align-items-center" :class="index === 0 ? 'hidden' : ''">
                <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="onRemoveCause(index)"></em>
              </div>
            </div>
            <div class="mt-2" v-if="!item.isValid">
                <Label class="error-label">{{ item.errorMessage }}</Label>
            </div>
          </div>
          <button class="my-3 btn-add-new" @click="onAddNewCause">
            <em class="fa fa-plus me-2"></em>
            Add another cause
          </button>
        </el-collapse-item>
      </el-collapse>
      <div class="my-5 w-100">
        <button class="btn btn-success w-100" @click.prevent="onSubmitDefects"
        style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Submit</button>
      </div>
    </div>
    <Confirmation :visibility="showConfirmExit"
          caption="Are you sure want to close the defect form? <br /> Note: By closing the defect form, you will lose your defect data that you have already inputted."
          @on-no-confirm="onCancelExit"
          @on-yes-confirm="onSaveExit" />
    <Confirmation :visibility="confirmVisible"
          caption="Please confirm this defect information is correct."
          @on-no-confirm="onCancel"
          @on-yes-confirm="onSave" />
    <MessageBox
      :show="messageBoxVisible"
      message="Defect Information Successfully Submitted"
      :show-left-button="true"
      left-button-label="+ Add Another Defect"
      @left-button-action="onAddAnotherDefect"
      backgroundLeftButton="#18AF4A"
      colorLeftButton="#FFF"
      borderColorLeftButton="#18AF4A"
      backgroundRightButton="#FFF"
      colorRightButton="#18AF4A"
      borderColorRightButton="#18AF4A"
      @close="onOk"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  toRef,
  PropType,
  ref,
  computed,
  watch
} from "vue";
import DefectYesClass from "@/core/classes/DefectYesClass";
import {
  AESTCurrentDateTime,
  getUTCOffsetDate
} from "@/core/helpers/date-format";
import { useCameraStore } from "@/store/pinia/application/useCameraStore";
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore";
import { useEFormStore } from "@/store/pinia/dma/e-form/useEFormStore";
import {
  UpdateParam
} from "@/core/types/entities/dma/e-form/update-data/updateParam";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  usePositionListStore
} from "@/store/pinia/administration/organization-unit/position/usePositionListStore";
import { useMasterStore } from "@/store/pinia/dma/masters/useMasterStore";
import Confirmation from "@/components/dialog/Confirmation.vue";
import LargeCamera from '@/components/camera/LargeCamera.vue';
import MessageBox from "@/components/dialog/MessageBox.vue";
import { ElLoading } from "element-plus";
import {
  formatNumberWithComma,
  reformatNumberWithComma
} from "@/core/helpers/number-format"
import {
  useGeneralFormStore
} from "@/store/pinia/dma/e-form/useGeneralFormStore";
import { displayDesc } from "@/core/helpers/manipulate-html-string";
import { isUndefined, cloneDeep } from 'lodash'
import {
  handleScrollToError,
  handleScrollToTopOfDialog
} from "@/core/helpers/ironforms/defects-form/defect-form"
import Textarea from "@/components/inputs/dma/Textarea.vue";
import { TextareaParam } from "@/core/types/misc/TextareaParam";
import { v4 as uuidv4 } from 'uuid';
import {
  formatOwnership,
  disabledHyperlink,
  getTitle,
  onlyNumberResult,
  onlyIntegerInput,
  hasDefectDataChanged
} from "@/store/pinia/dma/e-form/helpers";
import SmallCamera from "@/components/dma/defect/parts-component/SmallCamera.vue"
import UploadAttachment from "@/components/dma/defect/parts-component/UploadAttachment.vue"

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  generic: {
    required: false,
    type: Boolean,
    default: false
  },
  assetNumber: {
    required: true,
    type: String
  },
  defectData: {
    required: true,
    type: Object as PropType<DefectYesClass>
  },
  workorder: {
    required: false,
    type: String,
    default: ''
  },
  form: {
    required: false,
    type: String,
    default: ''
  },
});

const emits = defineEmits(['onRefreshData'])

const camstore = useCameraStore();
const formStore = useDefectsFormStore();
const authStore = useAuthenticationStore();
const store = useEFormStore();
const positionStore = usePositionListStore();
const masterStore = useMasterStore();

/* refs */
const messageBoxVisible = ref(false);
const confirmVisible = ref(false);
const isCancelled = ref(true);
const loading = ref(false);
const dialogVisible = toRef(props, "visibility");
const data = toRef(props, "defectData");
const priority = ref("P1");
const labours = ref<Array<string>>([""]);
const symptoms = ref<Array<string>>([""]);
const causes = ref<Array<string>>([""]);
const symptomDesc = ref<Array<string>>([""]);
const symptomDescValid = ref<Array<boolean>>([true]);
const causesDesc = ref<Array<string>>([""]);
const causesDescValid = ref<Array<boolean>>([true]);
const showConfirmExit = ref(false)
const customClass = ref(uuidv4())
const taskDescription = ref("")
const clonedDefectData = ref()
const taskDescriptionValidation = ref({
  isValid: true,
  errorMessage: ""
})
const images = computed(() => {
  if (isUndefined(formStore.images)) {
    return []
  } else {
    return formStore.images.ImageInfos
  }
})
const handleTaskDescription = (val) => {
  if (val == '') {
    taskDescriptionValidation.value.isValid = false
    taskDescriptionValidation.value.errorMessage = "Required"
  } else {
    taskDescriptionValidation.value.isValid = true
    taskDescriptionValidation.value.errorMessage = ""
  }
  taskDescription.value = val
}

const priorityCollapse = ref('Priority')
const partsRequiredCollapse = ref('Parts Required')
const labourRequired = ref('Labour Required')
const otherResourceCollapse = ref('Other Resources Required (optional)')
const defectSysmptompCollapse = ref('Defect Symptom')
const defectCausesCollapse = ref('Defect Cause')

// ---------- format ----------
const plannedDurationInput = ref('')
// ---------- format ----------

// ---------- format (computed) ---------
const serialNumber = computed(() => {
  return formStore.SerialNumber
})

const formatOwnershipHTML = computed(() => {
  const ownership = formStore.Ownership
  return formatOwnership(ownership)
})
// ---------- format (computed) ---------

// ---------- format (method) ----------
const formatNumberInput = (input) => {
  if (input === "") {
    return input;
  }
  return formatNumberWithComma(reformatNumberWithComma(input))
}
// ---------- format (method) ----------

/* computes */
const taskUpdate = computed(() => {
  return formStore.DefectUpdate;
});
const isFormAlreadySubmitted = computed(() => {
  return store.formAlreadySubmitted
});
const defectPlaceholder = computed(() => {
  return "Defect Identified Description"
});
const instructionPlaceholder = computed(() => {
  return "Defect Repair Instructions / Actions"
});
const isTaskAlreadyUpdated = computed(() => {
  return store.taskAlreadyUpdated
});
const title = computed(() => {
  if (props.generic) {
    return data.value.Title
  } else {
    return displayDesc(getTitle(formStore.stateTask))
  }
});

/* watchers */
watch(isFormAlreadySubmitted, (newValue) => {
  if (newValue) {
    formStore.toggleYesVisible(false);
    store.resetTaskUpdated();
    formStore.resetTaskUpdated()
    messageBoxVisible.value = false;
    isCancelled.value = false;
    loading.value = false;
    formStore.setCancelledState(true)
    camstore.clearCurrent();
  }
});
watch(isTaskAlreadyUpdated, (newValue) => {
  if (newValue) {
    formStore.toggleYesVisible(false);
    store.resetTaskUpdated();
    formStore.resetTaskUpdated()
    messageBoxVisible.value = false;
    isCancelled.value = false;
    loading.value = false;
    formStore.setCancelledState(true)
    camstore.clearCurrent();
  }
});
watch(taskUpdate, (newValue) => {
  if (formStore.DefectYesVisible != true) return;
  if (newValue === false) {
    loading.value = true;
  }
  if (newValue === true) {
    messageBoxVisible.value = true
  }
});

const defaultLabour = computed(() => {
  const defaultLabourHardcode = "Diesel Fitter"
  if (positionStore.positionOption) {
    if (positionStore.positionOption.find((val) => {
      return val.label == defaultLabourHardcode
    })) {
      return defaultLabourHardcode
    }
  }
  return ""
})

/* methods */
const current = () => {
  const generalStore = useGeneralFormStore()
  const date = getUTCOffsetDate(generalStore.stateTimeZone)
  return (`${date} (${generalStore.stateTimeZoneDesc})`)
}

const onAddAnotherDefect = () => {
  formStore.setOpenDialogConfirmSubmitDefect(true)
  priority.value = "P1";
  labours.value = [defaultLabour.value];
  symptoms.value = [""];
  causes.value = [""];
  symptomDesc.value = [""];
  symptomDescValid.value = [true];
  causesDesc.value = [""];
  causesDescValid.value = [true];
  /* hide form */
  formStore.toggleNoVisible(false);
  store.resetTaskUpdated();
  formStore.resetTaskUpdated()
  messageBoxVisible.value = false;
  isCancelled.value = false;
  loading.value = false;
}

/* event handlers */
const onDescriptionChange = (event) => {
  data.value.setDescription(event.value);
  data.value.validateDescription();
}
const onPlannedHoursChange = (event) => {
  event.preventDefault();
  event.target.value = onlyNumberResult(event.target.value)
  data.value.setPlannedDuration(reformatNumberWithComma(event.target.value));
  data.value.validatePlannedDuration();
}

const onlyNumber = ($event) => {
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
    $event.preventDefault();
  }
}

const onInstructionChange = (event) => {
  data.value.setInstruction(event.value);
  data.value.validateInstruction();
}
const onPriorityChange = (event) => {
  event.preventDefault();
  data.value.setPriority(event.target.value);
}
/* parts */
const onPartDescriptionChange = (event, index: number) => {
  event.preventDefault();
  data.value.setPartDescription(index, event.target.value);
  data.value.validatePartDescription(data.value.Parts[index]);
}
const onPartQtyChange = (event, index: number) => {
  event.preventDefault();
  event.target.value = onlyNumberResult(event.target.value)
  data.value.setPartQty(index, reformatNumberWithComma(event.target.value));
  data.value.validatePartQty(data.value.Parts[index]);
}
const onPartImageChange = (params) => {
  const { value, index } = params
  data.value.setPartImage(index, value);
}
const onPartAttachmentChange = (params) => {
  const { value, index } = params
  data.value.setPartAttachment(index, value);
}
const onAddNewParts = () => {
  /* validate first */
  const isValid = data.value.Parts.every((e) => {
    return e.partDescription !== "" && e.qty !== "";
  });
  if (!isValid) {
    data.value.validateParts();
    return;
  } else {
    for (const partIndex in data.value.Parts) {
      if (Object.hasOwn(data.value.Parts, partIndex)) {
        const element = data.value.Parts[partIndex];
        if (!element.partNumberValidation.isValid || !element.descriptionValidation.isValid || !element.qtyValidation.isValid) {
          return
        }
      }
    }
  }
  data.value.addPart({
    partNumber: "",
    partDescription: "",
    qty: "",
  });
}
const onRemoveParts = (index: number) => {
  data.value.removeParts(index);
}
/* labours */
const onLabourChange = (index: number) => {
  data.value.setLabourActivity(index, labours.value[index]);
  data.value.validateLaboursActivity(data.value.Labours[index]);
}
const onLabourQtyChange = (event, index: number) => {
  event.preventDefault();
  event.target.value = onlyNumberResult(event.target.value)
  data.value.setLabourQty(index, reformatNumberWithComma(event.target.value));
  data.value.validateLaboursQty(data.value.Labours[index]);
  if (!data.value.Labours[index].position) {
    onLabourChange(index)
  }
  calculateTotalHours(index);
}
const onLabourHireEachChange = (event, index: number) => {
  event.preventDefault();
  event.target.value = onlyNumberResult(event.target.value)
  data.value.setLabourHireEach(index, reformatNumberWithComma(event.target.value));
  data.value.validateLaboursHireEach(data.value.Labours[index]);
  if (!data.value.Labours[index].position) {
    onLabourChange(index)
  }
  calculateTotalHours(index);
}
const calculateTotalHours = (index: number) => {
  if (!data.value.Labours[index].qty || !data.value.Labours[index].hireEach) return;
  data.value.Labours[index].totalHoursValidation.message = ""
  data.value.Labours[index].totalHoursValidation.isValid = true
  const qty = +data.value.Labours[index].qty;
  const each = +data.value.Labours[index].hireEach;
  const total = qty * each;
  data.value.setLabourTotalHours(index, total.toFixed(2).toString());
}
const onAddNewLabour = () => {
/* validate first */
  const isValid = data.value.Labours.every((e) => {
    return e.position !== "" && e.qty !== "" && e.hireEach !== "" && e.totalHours !== "";
  });
  if (!isValid) {
    data.value.validateLabours();
    return;
  } else {
    for (const labourIndex in data.value.Labours) {
      if (Object.hasOwn(data.value.Labours, labourIndex)) {
        const element = data.value.Labours[labourIndex];
        if (!element.positionValidation.isValid || !element.qtyValidation.isValid || !element.hireEachValidation.isValid) {
          return
        }
      }
    }
    if (data.value.validateLabours()) {
      data.value.addLabour({
        position: "",
        qty: "",
        hireEach: "",
        totalHours: ""
      });
      labours.value.push(defaultLabour.value);
      onLabourChange(data.value.Labours.length - 1);
    }
  }
}
const onRemoveLabour = (index: number) => {
  labours.value.splice(index, 1);
  data.value.removeLabours(index);
}
/* resources */
const onResourcesChange = (event, index: number) => {
  event.preventDefault();
  data.value.setResources(index, event.target.value);
  if (data.value.Resources.length == 1 && data.value.Resources[index].value == '') return
  data.value.validateResource(data.value.Resources[index]);
}
const onAddNewResource = () => {
  /* validate first */
  const isValid = data.value.Resources.every((e) => {
    return e.value !== "";
  });
  if (!isValid) {
    data.value.validateResourcesAdd();
    return;
  }
  data.value.addResource("");
}
const onRemoveResource = (index: number) => {
  data.value.removeResource(index);
  data.value.validateResourcesRemove()
}
/* causes */
const onCauseChange = (index: number) => {
  causesDesc.value[index] = "";
  causesDescValid.value[index] = true;
  data.value.setCauses(index, causes.value[index]);
  data.value.validateCause(data.value.Causes[index]);
}
const onCauseDescChange = (param: TextareaParam) => {
  causesDesc.value[param.index as number] = param.value;
  causesDescValid.value[param.index as number] = causesDesc.value[param.index as number] != "";
}
const onAddNewCause = () => {
  for (const causeIndex in data.value.Causes) {
    if (Object.hasOwn(data.value.Causes, causeIndex)) {
      const element = data.value.Causes[causeIndex];
      if (!element.isValid) {
        return
      }
    }
  }
  /* validate first */
  const isValid = data.value.Causes.every((e) => {
    return e.value !== "";
  });
  if (!isValid) {
    data.value.validateCauses();
    return;
  }
  const lastIndex = causes.value.length - 1;
  if (causes.value[lastIndex] === "Other") {
    if (!causesDesc.value[lastIndex]) {
      causesDescValid.value[lastIndex] = false;
      return;
    } else {
      causesDescValid.value[lastIndex] = true;
    }
  }
  data.value.addCauses("");
  causes.value.push("");
  causesDesc.value.push("");
  causesDescValid.value.push(true);
}
const onRemoveCause = (index: number) => {
  causes.value.splice(index, 1);
  causesDesc.value.splice(index, 1);
  causesDescValid.value.splice(index, 1);
  data.value.removeCauses(index);
}
/* symptom */
const onSymptomChange = (index: number) => {
  symptomDesc.value[index] = "";
  symptomDescValid.value[index] = true;
  data.value.setSymptom(index, symptoms.value[index]);
  data.value.validateSymptom(data.value.Symptoms[index]);
}
const onSymptomDescChange = (param: TextareaParam) => {
  symptomDesc.value[param.index as number] = param.value;
  symptomDescValid.value[param.index as number] = symptomDesc.value[param.index as number] != "";
}
const onAddNewSymptom = () => {
  for (const causeIndex in data.value.Symptoms) {
    if (Object.hasOwn(data.value.Symptoms, causeIndex)) {
      const element = data.value.Symptoms[causeIndex];
      if (!element.isValid) {
        return
      }
    }
  }
  /* validate first */
  const isValid = data.value.Symptoms.every((e) => {
    return e.value !== "";
  });
  if (!isValid) {
    data.value.validateSymptoms();
    return;
  }
  const lastIndex = symptoms.value.length - 1;
  if (symptoms.value[lastIndex] === "Other") {
    if (!symptomDesc.value[lastIndex]) {
      symptomDescValid.value[lastIndex] = false;
      return;
    } else {
      symptomDescValid.value[lastIndex] = true;
    }
  }
  data.value.addSymptom("");
  symptoms.value.push("");
  symptomDesc.value.push("");
  symptomDescValid.value.push(true);
}
const onRemoveSymptom = (index: number) => {
  symptoms.value.splice(index, 1);
  symptomDesc.value.splice(index, 1);
  symptomDescValid.value.splice(index, 1);
  data.value.removeSymptom(index);
}
const updateTask = async () => {
  const payload: UpdateParam[] = [
    {
      keyValue: formStore.ItemKey,
      propertyParams: [
        {
          propertyName: "value",
          propertyValue: "2"
        },
        {
          propertyName: 'updatedBy',
          propertyValue: JSON.stringify(store.employee)
        },
        {
          propertyName: 'updatedDate',
          propertyValue: AESTCurrentDateTime()
        }
      ]
    },
  ]
  await store.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name);
  formStore.SetTaskUpdated()
  store.updateAllItems(formStore.ItemKey, "2")
}
const validateSymptoms = (): boolean => {
  for (const causeIndex in data.value.Symptoms) {
    if (Object.hasOwn(data.value.Symptoms, causeIndex)) {
      const element = data.value.Symptoms[causeIndex];
      if (!element.isValid) {
        return false
      }
    }
  }
  const lastIndex = symptoms.value.length - 1;
  if (symptoms.value[lastIndex] === "Other") {
    if (!symptomDesc.value[lastIndex]) {
      symptomDescValid.value[lastIndex] = false;
    } else {
      symptomDescValid.value[lastIndex] = true;
    }
  } else {
    symptomDescValid.value[lastIndex] = true;
  }
  return symptomDescValid.value[lastIndex];
}
const validateCauses = (): boolean => {
  for (const causeIndex in data.value.Causes) {
    if (Object.hasOwn(data.value.Causes, causeIndex)) {
      const element = data.value.Causes[causeIndex];
      if (!element.isValid) {
        return false
      }
    }
  }
  const lastIndex = causes.value.length - 1;
  if (causes.value[lastIndex] === "Other") {
    if (!causesDesc.value[lastIndex]) {
      causesDescValid.value[lastIndex] = false;
    } else {
      causesDescValid.value[lastIndex] = true;
    }
  } else {
    causesDescValid.value[lastIndex] = true;
  }
  return causesDescValid.value[lastIndex];
}

const showCameraValidation = ref(false)

watch(images, (newValue) => {
  if (newValue.length > 0) showCameraValidation.value = false
}, { deep: true })

const isCustomValidationNormalTakePhoto = computed(() => {
  return !isUndefined(formStore.stateItem.customValidation) && formStore.stateItem.customValidation!.includes("normalTakePhoto")
})

const onSubmitDefects = async () => {
  data.value.validateDefectForm();
  if (props.generic) {
    // check task desc
    if (taskDescription.value == "") {
      taskDescriptionValidation.value.isValid = false
      taskDescriptionValidation.value.errorMessage = "Required"
    } else {
      taskDescriptionValidation.value.isValid = true
      taskDescriptionValidation.value.errorMessage = ""
    }
  }
  if (isCustomValidationNormalTakePhoto.value) {
    if (isUndefined(formStore.images) || formStore.images.ImageInfos.length < 1) {
      showCameraValidation.value = true
      handleScrollToError()
    } else {
      if (data.value?.IsValid && validateSymptoms() && validateCauses() && taskDescriptionValidation.value.isValid) {
        confirmVisible.value = true;
      } else {
        expandAllPanel()
        handleScrollToError()
      }
    }
  } else {
    if (data.value?.IsValid && validateSymptoms() && validateCauses() && taskDescriptionValidation.value.isValid) {
      confirmVisible.value = true;
    } else {
      expandAllPanel()
      handleScrollToError()
    }
  }
}
const reAssignSymptoms = () => {
  data.value.Symptoms.forEach((a, index) => {
    a.value = a.value === "Other" ? `Other:${symptomDesc.value[index]}` : a.value;
  });
}
const reAssignCauses = () => {
  data.value.Causes.forEach((a, index) => {
    a.value = a.value === "Other" ? `Other:${causesDesc.value[index]}` : a.value;
  });
}
const onSave = async () => {
  confirmVisible.value = false;
  const loader = ElLoading.service({
    lock: true,
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  data.value.setAssetNumber(props.assetNumber);
  reAssignSymptoms();
  reAssignCauses();
  if (props.generic) {
    await formStore.createDefectGeneric({
      form: props.form,
      workorder: props.workorder,
      taskDesc: taskDescription.value,
    });
    emits('onRefreshData')
    formStore.SetTaskUpdated()
  } else {
    let deleteDefectNA = false
    // 3 -> NA
    if (formStore.stateTask.taskValue == "3") {
      const payload: UpdateParam[] = [
        {
          keyValue: "",
          propertyParams: [
            {
              propertyName: "isActive",
              propertyValue: "false"
            },
          ]
        },
      ]
      await store.updateDefectHeaderWithTaskKey(formStore.stateTask.key, payload);
      formStore.stateTask.taskValue = '2'
      deleteDefectNA = true
    } else if (formStore.stateTask.taskValue == "1") {
      deleteDefectNA = true
    }
    const updateDefectSuccess = await formStore.createDefect(deleteDefectNA);
    if (updateDefectSuccess) await updateTask();
    else if (store.taskErrorDialog) {
      onOk()
    }
  }
  loader.close();
}
const onCancel = () => {
  confirmVisible.value = false;
}
const onOk = () => {
  formStore.setOpenDialogConfirmSubmitDefect(false)
  priority.value = "P1";
  labours.value = [defaultLabour.value];
  symptoms.value = [""];
  causes.value = [""];
  symptomDesc.value = [""];
  symptomDescValid.value = [true];
  causesDesc.value = [""];
  causesDescValid.value = [true];
  /* hide form */
  formStore.toggleNoVisible(false);
  store.resetTaskUpdated();
  formStore.resetTaskUpdated()
  messageBoxVisible.value = false;
  isCancelled.value = false;
  loading.value = false;
}
const onFormClosed = async () => {
  if (isCancelled.value === true) {
    formStore.setCancelledState(true);
  }
  labours.value = [defaultLabour.value];
  symptoms.value = [""];
  causes.value = [""];
  symptomDesc.value = [""];
  symptomDescValid.value = [true];
  causesDesc.value = [""];
  causesDescValid.value = [true];
  plannedDurationInput.value = "";
  taskDescriptionValidation.value = {
    isValid: true,
    errorMessage: ""
  }
  taskDescription.value = "";
  if (formStore.OpenDialogConfirmSubmitDefect == false) {
    formStore.resetInstance();
  }
  formStore.setUpdateTaskDefect("")
  camstore.clearCurrent();
  camstore.setShowCloseButton(false)
  showCameraValidation.value = false
  camstore.reset()
}

const defectDetailRef = ref(null) as any

const onFormOpened = () => {
  data.value.setIsNeed30Minutes(formStore.stateIsNeed30Minutes)
  messageBoxVisible.value = false;
  camstore.setShowCloseButton(true)
  formStore.setOpenDialogConfirmSubmitDefect(false)
  handleScrollToTopOfDialog(customClass.value)
  taskDescriptionValidation.value = {
    isValid: true,
    errorMessage: ""
  }
  isCancelled.value = true;
  priority.value = "P1";
  labours.value = [defaultLabour.value];
  symptoms.value = [""];
  causes.value = [""];
  symptomDesc.value = [""];
  symptomDescValid.value = [true];
  causesDesc.value = [""];
  causesDescValid.value = [true];
  clonedDefectData.value = {
    images: cloneDeep(images.value),
    description: cloneDeep(props.defectData.Description.value),
    priority: cloneDeep(props.defectData.Priority),
    instruction: cloneDeep(props.defectData.Instruction.value),
    plannedDuration: cloneDeep(props.defectData.PlannedDuration.value),
    parts: cloneDeep(props.defectData.Parts),
    labours: cloneDeep(props.defectData.Labours),
    resources: cloneDeep(props.defectData.Resources),
    symptoms: cloneDeep(props.defectData.Symptoms),
    causes: cloneDeep(props.defectData.Causes)
  }
  clonedDefectData.value.labours[0].position = defaultLabour.value
  disabledHyperlink(defectDetailRef.value!)
}
const expandAllPanel = () => {
  priorityCollapse.value = 'Priority'
  partsRequiredCollapse.value = 'Parts Required'
  labourRequired.value = 'Labour Required'
  otherResourceCollapse.value = 'Other Resources Required (optional)'
  defectSysmptompCollapse.value = 'Defect Symptom'
  defectCausesCollapse.value = 'Defect Cause'
}

const handleBeforeClose = () => {
  if (editedForm.value) {
    showConfirmExit.value = true
  } else {
    formStore.toggleYesVisible(false)
  }
}

const onCancelExit = () => {
  showConfirmExit.value = false
}

const onSaveExit = () => {
  showConfirmExit.value = false
  formStore.toggleYesVisible(false)
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
    images: images.value,
    description: props.defectData.Description.value,
    priority: props.defectData.Priority,
    instruction: props.defectData.Instruction.value,
    plannedDuration: props.defectData.PlannedDuration.value,
    parts: props.defectData.Parts,
    labours: props.defectData.Labours,
    resources: props.defectData.Resources,
    symptoms: props.defectData.Symptoms,
    causes: props.defectData.Causes,
  }
})

const editedForm = computed(() => {
  return hasDefectDataChanged(watchedFields, clonedDefectData.value, comparedData.value)
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
    overflow:inherit !important;
    font-size: 14px;
}
</style>
<style lang="scss" scoped>
   @import "@/assets/sass/pages/defect.form.scss";
   @import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
</style>

