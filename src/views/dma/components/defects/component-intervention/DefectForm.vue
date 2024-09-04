<template>
  <el-dialog v-model="dialogVisible"
  :custom-class="`defectform el-defect-crack-form-custom form-defect-yes ${customClass}`"
  width="90%" center
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  :before-close="handleBeforeClose"
  @closed="onFormClosed"
  @opened="onFormOpened" :destroy-on-close="true">
    <template #title>
      <span class="el-dialog__title">Detailed Information for Defect Identification
        <template v-if="viewDeclineCondition">
          <span class="red-bg text-dark-red p-1">Declined</span>
        </template>
        <template v-else-if="viewApprovedSPVCondition">
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
      <template v-else-if="viewApprovedSPVCondition">
        <div class="mt-1 py-2">
          <div class="d-flex flex-column">
            <div class="row mb-1">
                <div class="col">
                  <div class="form-floating approved-text-box" v-if="approvedBy && approvedDate">
                      <div class="form-control">{{ approvedDate }} — {{ approvedBy.name }}</div>
                      <label>Approved</label>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </template>
      <div class="d-flex flex-row justify-content-between">
        <div class="py-2 d-flex flex-row flex-grow-1">
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
        :disabled="isDisabled"
        :allow-delete="!isDisabled"
        :is-monitoring="viewOnly"
        :is-mandatory="false"
        />
      </div>
      <div class="mt-1 py-2">
        <Textarea
          :value="data.Description?.value"
          :label="defectPlaceholder"
          name="defectPlaceholder"
          :errorMessage="data.Description.errorMessage"
          :is-valid="data.Description.isValid"
          :disabled="isDisabled"
          @handleChange="onDescriptionChange"
        ></Textarea>
      </div>
      <div class="mt-1 py-2">
        <div class="row">
          <div class="col pe-0">
            <div class="form-floating">
              <input type="text" class="form-control" disabled :value="data.RaisedBy">
              <label>Raised By</label>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-1 py-2">
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
                <input
                  type="text"
                  class="form-control"
                  pattern="[0-9]*"
                  inputmode="numeric"
                  :value="formatNumberInput(data.PlannedDuration.value)"
                  @input="onPlannedHoursChange"
                  :disabled="isDisabled"
                  @keypress="onlyNumber"
                />
                <label class="text-nowrap">How long will this defect repair take?</label>
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
          :value="data.Instruction.value"
          :label="instructionPlaceholder"
          name="InstructionPlaceholder"
          :errorMessage="data.Instruction.errorMessage"
          :is-valid="data.Instruction.isValid"
          :disabled="isDisabled"
          @handleChange="onInstructionChange"
        ></Textarea>
      </div>
      <div class="mt-2"></div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="collapsiblePriority">
        <el-collapse-item title="Priority" name="Priority">
          <div class="row p-3 m-1 priority-container" style="background: #F4F6F8; border-radius: 8px;">
              <div class="col-3">Priority</div>
              <div class="col-6">Action</div>
              <div class="col-3 text-break">Person Responsible</div>
            </div>
            <div class="row p-3 m-1 priority-container">
              <div class="col-3">
                <div class="form-check">
                  <input class="form-check-input" type="radio" v-model="priority" value="P1" @change.prevent="onPriorityChange" :disabled="isDisabled">
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
                  <input class="form-check-input" type="radio" v-model="priority" value="P2" @change.prevent="onPriorityChange" :disabled="isDisabled">
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
                  <input class="form-check-input" type="radio" v-model="priority" value="P3" @change.prevent="onPriorityChange" :disabled="isDisabled">
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
                  <input class="form-check-input" type="radio" v-model="priority" value="P4" @change.prevent="onPriorityChange" :disabled="isDisabled">
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
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="collapsibleParts">
        <el-collapse-item title="Parts" name="Parts" id="partsSection">
          <div class="row p-3 m-1 priority-container" style="background: #F4F6F8; border-radius: 8px;">
              <div class="col-3">Part Number</div>
                <div class="col-5">Part Description</div>
                <div class="col-1">Qty</div>
                <div class="col"></div>
                <div class="col"></div>
            </div>
            <div class="row p-3 m-1 priority-container px-0" v-for="(item, index) in data.Parts" :key="item.partNumber">
              <div class="col-3 ps-0">
                <div class="d-flex flex-column">
                  <input type="text" class="form-control" v-model="data.Parts[index].partNumber" :disabled="isDisabled" />
                  <div class="mt-2" v-if="!item.partNumberValidation.isValid">
                      <Label class="error-label">{{ item.partNumberValidation.message }}</Label>
                  </div>
                </div>
              </div>
              <div class="col-5">
                <div class="d-flex flex-column">
                  <input type="text" class="form-control" :value="item.partDescription" @change="onPartDescriptionChange($event, index)" :disabled="isDisabled" />
                  <div class="mt-2" v-if="!item.descriptionValidation.isValid">
                      <Label class="error-label">{{ item.descriptionValidation.message }}</Label>
                  </div>
                </div>
              </div>
              <div class="col-1 px-1 d-flex justify-content-start">
                <div class="d-flex flex-column">
                  <input class="form-control" :value="formatNumberInput(item.qty)" @input="onPartQtyChange($event, index)" :disabled="isDisabled"
                  />
                  <div class="mt-2" v-if="!item.qtyValidation.isValid">
                      <Label class="error-label">{{ item.qtyValidation.message }}</Label>
                  </div>
                </div>
              </div>
              <div class="col px-1 d-flex flex-column justify-content-start">
                <div class="row p-0 m-0 h-100 w-100 align-items-center">
                  <SmallCamera :index="index" :item-value="item.images || []" @handle-change-image="onPartImageChange" :is-disabled="isDisabled"/>
                </div>
              </div>
              <div class="col px-1 d-flex flex-column justify-content-start position-relative">
                <div class="row p-0 m-0 h-100 w-100 align-items-center">
                  <UploadAttachment :index="index" :item-value="item.attachment || []" @handle-change-attachment="onPartAttachmentChange" :is-disabled="isDisabled"/>
                </div>
                <div class="position-absolute" style="top:10px; right: 0px;" :class="[isDisabled ? 'hidden': '']">
                    <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="onRemoveParts(index)"></em>
                </div>
              </div>
            </div>
            <button class="my-3 btn-add-new" @click="onAddNewParts" v-if="!isDisabled">
              <em class="fa fa-plus me-2"></em>
              Add more parts
            </button>
        </el-collapse-item>
      </el-collapse>
      <div class="mt-2"></div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="collapsibleLabour">
        <el-collapse-item title="Labour" name="Labour">
          <div class="row p-3 m-1 priority-container" style="background: #F4F6F8; border-radius: 8px;">
              <div class="col-6">Labour Activity</div>
              <div class="col-2">Qty</div>
              <div class="col-2">Hours Each</div>
              <div class="col-2">Total Hours</div>
          </div>
          <div class="row p-3 m-1 priority-container px-0                                                                                                                                                                                                                                                          "  v-for="(item, index) in data.Labours" :key="item.position">
              <div class="col-6 px-0">
                <div class="d-flex flex-column">
                  <el-select
                  v-model="labours[index]"
                  filterable
                  placeholder="Select Labour"
                  @change="onLabourChange(index)"
                  class="w-100"
                  :disabled="isDisabled">
                    <template v-for="opt in positionStore.positionOption" :key="opt.value">
                      <el-option :label="opt.label" :value="opt.label" />
                    </template>
                  </el-select>
                  <div class="mt-2" v-if="!item.positionValidation.isValid">
                      <Label class="error-label">{{ item.positionValidation.message }}</Label>
                  </div>
                </div>
              </div>
              <div class="col-2 d-flex justify-content-start">
                <div class="d-flex flex-column">
                  <input class="form-control"
                  :value="formatNumberInput(item.qty)" @keypress="onlyNumber"
                  @input="onLabourQtyChange($event, index)" :disabled="isDisabled" />
                  <div class="mt-2" v-if="!item.qtyValidation.isValid">
                      <Label class="error-label">{{ item.qtyValidation.message }}</Label>
                  </div>
                </div>
              </div>
              <div class="col-2 d-flex justify-content-start">
                <div class="d-flex flex-column">
                  <input class="form-control" @keypress="onlyNumber"
                  :value="formatNumberInput(item.hireEach)"
                  @input.prevent="onLabourHireEachChange($event, index)" :disabled="isDisabled" />
                  <div class="mt-2" v-if="!item.hireEachValidation.isValid">
                      <Label class="error-label">{{ item.hireEachValidation.message }}</Label>
                  </div>
                </div>
              </div>
              <div class="col-2 d-flex justify-content-start">
                <div class="d-flex flex-column">
                  <input class="form-control" :value="item.totalHours" disabled />
                  <div class="mt-2" v-if="!item.totalHoursValidation.isValid">
                      <Label class="error-label">{{ item.totalHoursValidation.message }}</Label>
                  </div>
                </div>
                <div class="ms-4 d-flex align-items-center" :class="[index === 0 || isDisabled ? 'hidden': '']">
                    <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="onRemoveLabour(index)"></em>
                </div>
              </div>
          </div>
          <button class="my-3 btn-add-new" @click="onAddNewLabour" v-if="!isDisabled">
            <em class="fa fa-plus me-2"></em>
            Add more labour
          </button>
        </el-collapse-item>
      </el-collapse>
      <div class="mt-2"></div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="collapsibleResource">
        <el-collapse-item title="Other Resource (optional)" name="Other Resource (optional)">
          <div class="p-2 d-flex" v-for="(item, index) in data.Resources" :key="item.value">
            <div class="d-flex flex-fill flex-column">
              <input type="text" class="form-control" :value="item.value" placeholder="Resource1"
              @change="onResourcesChange($event, index)" :disabled="isDisabled" />
              <div class="mt-2" v-if="!item.isValid">
                  <Label class="error-label">{{ item.errorMessage }}</Label>
              </div>
            </div>
            <div class="ms-4 d-flex align-items-center" :class="[index === 0 || isDisabled ? 'hidden': '']">
              <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="onRemoveResource(index)"></em>
            </div>
          </div>
          <button class="my-3 btn-add-new" @click="onAddNewResource" v-if="!isDisabled">
            <em class="fa fa-plus me-2"></em>
            Add new resource
          </button>
        </el-collapse-item>
      </el-collapse>
      <div class="mt-2"></div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="collapsibleSymptom">
        <el-collapse-item title="Symptom" name="Symptom">
          <div class="p-2 d-flex" v-for="(item, index) in data.Symptoms" :key="item.value">
            <div class="d-flex flex-fill flex-column">
              <el-select
                v-model="symptoms[index]"
                placeholder="Select Symptom"
                filterable
                @change="onSymptomChange(index)"
                class="w-100"
                :disabled="isDisabled">
                <template v-for="opt in masterStore.Symptoms" :key="opt.id">
                  <el-option :label="opt.symptom" :value="opt.symptom" />
                </template>
              </el-select>
              <div class="mt-2" v-if="!item.isValid">
                  <Label class="error-label">{{ item.errorMessage }}</Label>
              </div>
              <div class="mt-2" v-if="symptoms[index] === 'Other'">
                <Textarea
                  :value="symptomDesc[index]"
                  label="Description"
                  name="Description"
                  errorMessage="Required"
                  :disabled="isDisabled"
                  :is-valid="symptomDescValid[index]"
                  :index="index"
                  @handleChange="onSymptomDescChange"
                ></Textarea>
              </div>
            </div>
            <div class="ms-4 d-flex align-items-center" :class="index === 0 || isDisabled? 'hidden' : ''">
              <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="onRemoveSymptom(index)"></em>
            </div>
          </div>
          <button class="my-3 btn-add-new" @click.prevent="onAddNewSymptom" v-if="!isDisabled">
            <em class="fa fa-plus me-2"></em>
            Add another symptom
          </button>
        </el-collapse-item>
      </el-collapse>
      <div class="mt-2"></div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="collapsibleCauses">
        <el-collapse-item title="Cause" name="Cause">
          <div class="p-2 d-flex" v-for="(item, index) in data.Causes" :key="item.value">
            <div class="d-flex flex-fill flex-column">
              <el-select
                v-model="causes[index]"
                placeholder="Select Cause"
                filterable
                @change="onCauseChange(index)"
                class="w-100"
                :disabled="isDisabled">
                <template v-for="opt in masterStore.Causes" :key="opt.id">
                  <el-option :label="opt.causes" :value="opt.causes" />
                </template>
              </el-select>
              <div class="mt-2" v-if="!item.isValid">
                  <Label class="error-label">{{ item.errorMessage }}</Label>
              </div>
              <div class="mt-2" v-if="causes[index] === 'Other'">
                <Textarea
                  :value="causesDesc[index]"
                  label="Description"
                  name="Description"
                  errorMessage="Required"
                  :is-valid="causesDescValid[index]"
                  :index="index"
                  :disabled="isDisabled"
                  @handleChange="onCauseDescChange"
                ></Textarea>
              </div>
            </div>
            <div class="ms-4 d-flex align-items-center" :class="index === 0 || isDisabled? 'hidden' : ''">
              <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="onRemoveCause(index)"></em>
            </div>
          </div>
          <button class="my-3 btn-add-new" @click="onAddNewCause" v-if="!isDisabled">
            <em class="fa fa-plus me-2"></em>
            Add another cause
          </button>
        </el-collapse-item>
      </el-collapse>
      <template v-if="!viewOnly">
        <div class="my-5 w-100 d-flex justify-content-around" v-if="isNotSubmit">
          <button v-if="!showCancelButtonOnModify" class="btn btn-outline w-100" @click.prevent="() => toggleShowDeclineReason(true)"
                style="border: 1px solid #FF4842; background:white; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: #FF4842">Decline</button>
          <button v-if="!showCancelButtonOnModify" class="btn btn-warning w-100 ms-3" @click.prevent="setModify"
              :disabled="!isDisabled"
              style="background: rgb(255, 193, 7); box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: black">Modify</button>
          <template v-else>
              <button class="btn btn-light w-100 ms-3" @click.prevent="handleCancelModify"
                  style="background: #FFFFFF; border: 1px solid rgba(145, 158, 171, 0.24); box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: black">Cancel</button>
            </template>
          <button class="ms-3 btn btn-success w-100" @click.prevent="onSubmitDefects"
              style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Approve</button>
        </div>
      </template>
    </div>
    <Confirmation :visibility="confirmVisible"
        :caption="confirmationMessage"
        @on-no-confirm="onCancel"
        @on-yes-confirm="onSave" />
    <Confirmation :visibility="confirmVisibleWithPart"
        :caption="confirmationMessage"
        :parts-exist="partsExist"
        footerTemplate="defect"
        @on-no-confirm="onCancel"
        @on-yes-confirm="onSave"
        @on-add-part="onAddPart" />
    <Confirmation :visibility="showConfirmExit"
      caption="Are you sure want to close the defect form? <br /> Note: By closing the defect form, you will lose your defect data that you have already inputted."
      @on-no-confirm="onCancelExit"
      @on-yes-confirm="onSaveExit" />
    <MessageBox :show="messageBoxVisible" @close="onOk" :message="messageCaption"/>
    <MessageBox :show="errorMessageBoxVisible" @close="onOk" :message="errorMessage" icon="/media/svg/dma/alert.svg"/>
    <DefectDecline
      :visibility="showDeclineReason"
      formTitle="Are you sure want to decline this defect information?"
      :task-title="data?.Title"
      @closeForm="toggleShowDeclineReason"
      @submitDecline="onSubmitDecline"
      :isIntervention="true"
      :isGeneric="generic"
    />
  </el-dialog>
  <ToastWithIcon :show="successMessageBoxVisible" :message="messageCaption" />
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
import DefectYesClass from '@/core/classes/DefectYesClass'
import { useCameraStore } from '@/store/pinia/application/useCameraStore'
import {
  useComponentInterventionDefectsStore
} from '@/store/pinia/dma/component-intervention/defects/useComponentInterventionDefectsStore'
import {
  usePositionListStore
} from '@/store/pinia/administration/organization-unit/position/usePositionListStore'
import { useMasterStore } from '@/store/pinia/dma/masters/useMasterStore'
import LargeCamera from '@/components/camera/LargeCamera.vue'
import Confirmation from '@/components/dialog/Confirmation.vue'
import MessageBox from '@/components/dialog/MessageBox.vue'
import { ElLoading } from 'element-plus'
import {
  formatNumberWithComma,
  reformatNumberWithComma
} from '@/core/helpers/number-format'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import Textarea from "@/components/inputs/dma/Textarea.vue";
import { TextareaParam } from '@/core/types/misc/TextareaParam'
import DefectDecline from "@/components/dialog/DefectDecline.vue"
import { cloneDeep } from 'lodash'
import {
  handleScrollToErrorModal,
  handleScrollToTopOfDialog,
  stringGroupExtractor,
  handleScrollToID
} from '@/core/helpers/ironforms/defects-form/defect-form'
import { v4 as uuidv4 } from 'uuid';
import { Audit } from "@/core/types/intervention/Audit";
import ToastWithIcon from "@/components/dialog/ToastWithIcon.vue";
import {
  formatOwnership,
  disabledHyperlink,
  onlyNumberResult,
  hasDefectDataChanged,
} from '@/store/pinia/dma/e-form/helpers'
import {
  useDefectsFormStore
} from '@/store/pinia/dma/e-form/defects/useDefectsFormStore'
import SmallCamera from "@/components/dma/defect/parts-component/SmallCamera.vue"
import UploadAttachment from "@/components/dma/defect/parts-component/UploadAttachment.vue"
import { NoNetworkMessages } from '@/store/enums/ErrorMessagesEnum'

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  defectData: {
    required: true,
    type: Object as PropType<DefectYesClass>
  },
  workOrder: {
    required: false,
    type: String,
  },
  headerId: {
    required: false,
    type: String
  },
  status: {
    required: true,
    type: String
  },
  plannerStatus: {
    required: true,
    type: String
  },
  viewOnly: {
    required: false,
    type: Boolean,
    default: false
  },
  plannerApprove: {
    required: false,
    type: Boolean,
    default: false
  },
  declineReason: {
    required: false,
    type: String,
    default: ""
  },
  needConfirm: {
    required: false,
    type: Boolean,
    default: true
  },
  declineBy: {
    required: false,
    type: Object as PropType<Audit>,
    default: null
  },
  declineDate: {
    required: false,
    type: String,
    default: ""
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
  generic: {
    required: false,
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['closeForm', 'onRefreshData'])

const camstore = useCameraStore()
const formStore = useComponentInterventionDefectsStore()
const eformDefectStore = useDefectsFormStore()
const positionStore = usePositionListStore()
const masterStore = useMasterStore()

const collapsiblePriority = ref('Priority')
const collapsibleParts = ref('Parts')
const collapsibleLabour = ref('Labour')
const collapsibleResource = ref('Other Resource (optional)')
const collapsibleSymptom = ref('Symptom')
const collapsibleCauses = ref('Cause')

/* refs */
const isDisabled = ref(true)
const successMessageBoxVisible = ref(false)
const messageBoxVisible = ref(false)
const errorMessageBoxVisible = ref(false)
const errorMessage = ref("")
const confirmVisible = ref(false)
const confirmVisibleWithPart = ref(false)
const dialogVisible = toRef(props, "visibility")
const data = toRef(props, "defectData")
const defectDetailRef = ref<HTMLElement>()
const priority = ref("")
const labours = ref<Array<string>>([""])
const symptoms = ref<Array<string>>([""])
const causes = ref<Array<string>>([""])
const symptomDesc = ref<Array<string>>([""])
const symptomDescValid = ref<Array<boolean>>([true])
const causesDesc = ref<Array<string>>([""])
const causesDescValid = ref<Array<boolean>>([true])
const resetDefect = ref<boolean>(false)
const showCancelButtonOnModify = ref<boolean>(false)
const messageCaption = ref('Defect Information Successfully Submitted')
const showConfirmExit = ref(false)
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

const imageObject = computed(() => {
  return camstore.ImageObjects.find((obj) => {
    return obj.Id == 'defect'
  })?.ImageInfos || []
})

const comparedData = computed(() => {
  return {
    images: imageObject.value,
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
  if (!isDisabled.value) {
    return hasDefectDataChanged(watchedFields, clonedDefectData.value, comparedData.value)
  }
  return false
})

// ---------- format ----------
const plannedDurationInput = ref('')
// ---------- format ----------

// ---------- format (computed) ---------

// ---------- format (method) ----------
const formatNumberInput = (input) => {
  return formatNumberWithComma(reformatNumberWithComma(input))
}
// ---------- format (method) ----------

/* computes */
const isError = computed(() => {
  return formStore.IsError
})
const defectPlaceholder = computed(() => {
  return "Defect Identified Description"
})
const instructionPlaceholder = computed(() => {
  return "Defect Repair Instructions"
})


/* event handlers */
const showDeclineReason = ref(false)

const viewDeclineCondition = computed(() => {
  return props.status == "Decline" || props.plannerStatus == "Decline"
})

const viewApprovedSPVCondition = computed(() => {
  return props.status == "Acknowledge"
})

const toggleShowDeclineReason = (status: boolean) => {
  showDeclineReason.value = status
}

const handleCancelModify = () => {
  showCancelButtonOnModify.value = false
  cloneDataToInitial()
  isDisabled.value = true
  clearEmptyResource()
}

const isNotSubmit = computed(() => {
  let status;
  if (props.plannerApprove) {
    status = props.plannerStatus
  } else {
    status = props.status
  }
  const isAcknowledge = status == 'Acknowledge'
  const isDecline = viewDeclineCondition.value
  return !(isAcknowledge || isDecline)
})

const onSubmitDecline = async (val) => {
  const loader = ElLoading.service({
    lock: true,
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (props.plannerApprove) {
    await formStore.updateDefectDecline(val, true, props.generic)
  } else {
    await formStore.updateDefectDecline(val, false, props.generic)
  }
  loader.close()
  toggleShowDeclineReason(false)
  if (formStore.IsError) {
    errorMessage.value = formStore.stateErrorMessage
    errorMessageBoxVisible.value = true
    return
  }
  messageCaption.value = 'Defect Identified Successfully Declined'
  autoCloseSuccessMessageBox();
}

const autoCloseSuccessMessageBox = () => {
  successMessageBoxVisible.value = true
  setTimeout(() => {
    successMessageBoxVisible.value = false
    onOk();
  }, 1000);
}

const clearEmptyResource = () => {
  if (data.value.Resources.length == 1) {
    if (data.value.Resources[0].value == "") {
      data.value.removeResource(0)
    }
  }
}

// cloned var
const clonedPlannedDurationInput = ref('')
const clonedDefectDetailRef = ref<HTMLElement>()
const clonedPriority = ref("")
const clonedLabours = ref<Array<string>>([""])
const clonedSymptoms = ref<Array<string>>([""])
const clonedCauses = ref<Array<string>>([""])
const clonedSymptomDesc = ref<Array<string>>([""])
const clonedSymptomDescValid = ref<Array<boolean>>([true])
const clonedCausesDesc = ref<Array<string>>([""])
const clonedCausesDescValid = ref<Array<boolean>>([true])
const customClass = ref(uuidv4())

const cloneInitialData = () => {
  clonedDefectDetailRef.value = cloneDeep(defectDetailRef.value)
  clonedPriority.value = cloneDeep(priority.value)
  clonedLabours.value = cloneDeep(labours.value)
  clonedSymptoms.value = cloneDeep(symptoms.value)
  clonedCauses.value = cloneDeep(causes.value)
  clonedSymptomDesc.value = cloneDeep(symptomDesc.value)
  clonedSymptomDescValid.value = cloneDeep(symptomDescValid.value)
  clonedCausesDesc.value = cloneDeep(causesDesc.value)
  clonedCausesDescValid.value = cloneDeep(causesDescValid.value)
  clonedPlannedDurationInput.value = plannedDurationInput.value
}

const cloneDataToInitial = () => {
  formStore.setDefectData(props.headerId ?? "")
  defectDetailRef.value = cloneDeep(clonedDefectDetailRef.value)
  priority.value = cloneDeep(clonedPriority.value)
  labours.value = cloneDeep(clonedLabours.value)
  symptoms.value = cloneDeep(clonedSymptoms.value)
  causes.value = cloneDeep(clonedCauses.value)
  symptomDesc.value = cloneDeep(clonedSymptomDesc.value)
  symptomDescValid.value = cloneDeep(clonedSymptomDescValid.value)
  causesDesc.value = cloneDeep(clonedCausesDesc.value)
  causesDescValid.value = cloneDeep(clonedCausesDescValid.value)
  plannedDurationInput.value = clonedPlannedDurationInput.value
  data.value.PlannedDuration.isValid = true
  data.value.PlannedDuration.errorMessage = ''
}

const onDescriptionChange = (event) => {
  data.value.setDescription(event.value)
  data.value.validateDescription()
}
const onPlannedHoursChange = (event) => {
  event.target.value = onlyNumberResult(event.target.value)
  data.value.setPlannedDuration(reformatNumberWithComma(event.target.value))
  data.value.validatePlannedDuration()
}
const onInstructionChange = (event) => {
  data.value.setInstruction(event.value)
  data.value.validateInstruction()
}

const onPriorityChange = (event) => {
  event.preventDefault()
  if (data.value.Priority != event.target.value) {
    resetDefect.value = true
  }
  data.value.setPriority(event.target.value)
}
/* parts */
const onPartDescriptionChange = (event, index: number) => {
  event.preventDefault()
  data.value.setPartDescription(index, event.target.value)
  data.value.validatePartDescription(data.value.Parts[index])
}
const onPartQtyChange = (event, index: number) => {
  event.preventDefault()
  data.value.setPartQty(index, reformatNumberWithComma(event.target.value))
  data.value.validatePartQty(data.value.Parts[index])
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
    return e.partDescription !== "" && e.qty !== ""
  })
  if (!isValid) {
    data.value.validateParts()
    return
  }
  data.value.addPart({
    partNumber: "",
    partDescription: "",
    qty: ""
  })
}
const onRemoveParts = (index: number) => {
  data.value.removeParts(index)
}
/* labours */
const onLabourChange = (index: number) => {
  data.value.setLabourActivity(index, labours.value[index])
  data.value.validateLaboursActivity(data.value.Labours[index])
}
const onLabourQtyChange = (event, index: number) => {
  event.target.value = onlyNumberResult(event.target.value)
  data.value.setLabourQty(index, reformatNumberWithComma(event.target.value))
  data.value.validateLaboursQty(data.value.Labours[index])
  calculateTotalHours(index)
}
const onLabourHireEachChange = (event, index: number) => {
  event.target.value = onlyNumberResult(event.target.value)
  data.value.setLabourHireEach(index, reformatNumberWithComma(event.target.value))
  data.value.validateLaboursHireEach(data.value.Labours[index])
  calculateTotalHours(index)
}
const calculateTotalHours = (index: number) => {
  if (!data.value.Labours[index].qty || !data.value.Labours[index].hireEach) return
  const qty = +data.value.Labours[index].qty
  const each = +data.value.Labours[index].hireEach
  const total = (qty * each)
  if (data.value.Labours[index].qty.includes('.') || data.value.Labours[index].hireEach.includes('.')) {
    data.value.setLabourTotalHours(index, total.toFixed(2).toString())
  } else {
    data.value.setLabourTotalHours(index, total.toString())
  }
}
const onAddNewLabour = () => {
  /* validate first */
  const isValid = data.value.Labours.every((e) => {
    return e.position !== "" && e.qty !== "" && e.hireEach !== "" && e.totalHours !== ""
  })
  if (!isValid) {
    data.value.validateLabours()
    return
  }
  data.value.addLabour({
    position: "",
    qty: "",
    hireEach: "",
    totalHours: ""
  })
}
const onRemoveLabour = (index: number) => {
  data.value.removeLabours(index)
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

/* resources */
const onResourcesChange = (event, index: number) => {
  event.preventDefault()
  data.value.setResources(index, event.target.value)
  data.value.validateResource(data.value.Resources[index])
}
const onAddNewResource = () => {
  /* validate first */
  const isValid = data.value.Resources.every((e) => {
    return e.value !== ""
  })
  if (!isValid) {
    data.value.validateResources()
    return
  }
  data.value.addResource("")
}
const onRemoveResource = (index: number) => {
  data.value.removeResource(index)
}
/* causes */
const onCauseChange = (index: number) => {
  causesDesc.value[index] = ""
  causesDescValid.value[index] = true
  data.value.setCauses(index, causes.value[index])
  data.value.validateCause(data.value.Causes[index])
}
const onCauseDescChange = (param: TextareaParam) => {
  if (param.index == undefined) return
  causesDesc.value[param.index] = param.value
}
const onAddNewCause = () => {
  /* validate first */
  const isValid = data.value.Causes.every((e) => {
    return e.value !== ""
  })
  if (!isValid) {
    data.value.validateCauses()
    return
  }
  const lastIndex = causes.value.length - 1
  if (causes.value[lastIndex] === "Other") {
    if (!causesDesc.value[lastIndex]) {
      causesDescValid.value[lastIndex] = false
      return
    } else {
      causesDescValid.value[lastIndex] = true
    }
  }
  data.value.addCauses("")
  causes.value.push("")
  causesDesc.value.push("")
  causesDescValid.value.push(true)
}
const onRemoveCause = (index: number) => {
  data.value.removeCauses(index)
  causes.value.pop()
  causesDesc.value.pop()
  causesDescValid.value.pop()
}
/* symptom */
const onSymptomChange = (index: number) => {
  symptomDesc.value[index] = ""
  symptomDescValid.value[index] = true
  data.value.setSymptom(index, symptoms.value[index])
  data.value.validateSymptom(data.value.Symptoms[index])
}
const onSymptomDescChange = (param: TextareaParam) => {
  if (param.index == undefined) return
  symptomDesc.value[param.index] = param.value
}
const onAddNewSymptom = () => {
  /* validate first */
  const isValid = data.value.Symptoms.every((e) => {
    return e.value !== ""
  })
  if (!isValid) {
    data.value.validateSymptoms()
    return
  }
  const lastIndex = symptoms.value.length - 1
  if (symptoms.value[lastIndex] === "Other") {
    if (!symptomDesc.value[lastIndex]) {
      symptomDescValid.value[lastIndex] = false
      return
    } else {
      symptomDescValid.value[lastIndex] = true
    }
  }
  data.value.addSymptom("")
  symptoms.value.push("")
  symptomDesc.value.push("")
  symptomDescValid.value.push(true)
}
const onRemoveSymptom = (index: number) => {
  data.value.removeSymptom(index)
  symptoms.value.pop()
  symptomDesc.value.pop()
  symptomDescValid.value.pop()
}
const setModify = (scrollTarget) => {
  if (scrollTarget === 'partsSection') {
    handleScrollToID('partsSection');
  } else {
    handleScrollToTopOfDialog(customClass.value);
  }
  isDisabled.value = false
  showCancelButtonOnModify.value = true
  if (data.value.Resources.length == 0) {
    data.value.addResource("")
  }
  clonedDefectData.value = {
    images: cloneDeep(imageObject.value),
    description: cloneDeep(props.defectData.Description.value),
    priority: cloneDeep(props.defectData.Priority),
    instruction: cloneDeep(props.defectData.Instruction.value),
    plannedDuration: cloneDeep(props.defectData.PlannedDuration.value),
    parts: cloneDeep(props.defectData.Parts),
    labours: cloneDeep(props.defectData.Labours),
    resources: cloneDeep(props.defectData.Resources),
    symptoms: cloneDeep(props.defectData.Symptoms),
    causes: cloneDeep(props.defectData.Causes),
  }
}
const validateSymptoms = (): boolean => {
  const lastIndex = symptoms.value.length - 1
  if (symptoms.value[lastIndex] === "Other") {
    if (!symptomDesc.value[lastIndex]) {
      symptomDescValid.value[lastIndex] = false
    } else {
      symptomDescValid.value[lastIndex] = true
    }
  } else {
    symptomDescValid.value[lastIndex] = true
  }
  return symptomDescValid.value[lastIndex]
}
const validateCauses = (): boolean => {
  const lastIndex = causes.value.length - 1
  if (causes.value[lastIndex] === "Other") {
    if (!causesDesc.value[lastIndex]) {
      causesDescValid.value[lastIndex] = false
    } else {
      causesDescValid.value[lastIndex] = true
    }
  } else {
    causesDescValid.value[lastIndex] = true
  }
  return causesDescValid.value[lastIndex]
}
const expandAllPanel = () => {
  collapsiblePriority.value = 'Priority'
  collapsibleParts.value = 'Parts'
  collapsibleLabour.value = 'Labour'
  collapsibleResource.value = 'Other Resource (optional)'
  collapsibleSymptom.value = 'Symptom'
  collapsibleCauses.value = 'Cause'
}
const onSubmitDefects = async () => {
  data.value.validateDefectForm()
  if (data.value?.IsValid && validateSymptoms() && validateCauses()) {
    if (!partsExist.value || !props.plannerApprove) {
      confirmVisibleWithPart.value = true
    } else {
      confirmVisible.value = true
    }
  } else {
    expandAllPanel()
    handleScrollToErrorModal()
  }
}

const reAssignSymptoms = () => {
  data.value.Symptoms.forEach((a, index) => {
    a.value = a.value.includes("Other") ? `Other:${symptomDesc.value[index]}` : a.value
  })
}
const reAssignCauses = () => {
  data.value.Causes.forEach((a, index) => {
    a.value = a.value.includes("Other") ? `Other:${causesDesc.value[index]}` : a.value
  })
}
const onSave = async () => {
  confirmVisibleWithPart.value = false
  confirmVisible.value = false
  const loader = ElLoading.service({
    lock: true,
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  reAssignSymptoms()
  reAssignCauses()
  const result = await formStore.updateDefectDetail(props.generic)
  if (isError.value) {
    errorMessage.value = result
    loader.close()
    errorMessageBoxVisible.value = true
    return
  }
  await formStore.updateDefectAcknowledge(props.plannerApprove, props.generic)
  if (formStore.IsError) {
    loader.close()
    errorMessage.value = formStore.stateErrorMessage
    errorMessageBoxVisible.value = true
    return
  }
  if (isError.value) {
    loader.close()
    return
  }
  if (resetDefect.value === true) {
    await formStore.getDefectsData(props.workOrder ?? "")
    formStore.setDefectData(props.headerId ?? "")
    formStore.setNewDefectKey()
  } else {
    formStore.setDefectNewData()
  }
  loader.close()
  messageCaption.value = 'Defect Approved'
  autoCloseSuccessMessageBox();
}
const onCancel = () => {
  confirmVisibleWithPart.value = false
  confirmVisible.value = false
}
const onOk = () => {
  messageBoxVisible.value = false
  errorMessageBoxVisible.value = false
  if (errorMessage.value != NoNetworkMessages.NO_NETWORK_VIEW) {
    onFormClosed()
    emits('onRefreshData')
  }
}
const onFormClosed = () => {
  camstore.clearCurrent()
  priority.value = ""
  labours.value = [""]
  symptoms.value = [""]
  causes.value = [""]
  symptomDesc.value = [""]
  symptomDescValid.value = [true]
  causesDesc.value = [""]
  causesDescValid.value = [true]
  isDisabled.value = true
  showCancelButtonOnModify.value = false
  formStore.resetErrorStatus()
  errorMessageBoxVisible.value = false
  errorMessage.value = ""
  emits('closeForm')
}
const onFormOpened = () => {
  handleScrollToTopOfDialog(customClass.value)
  priority.value = props.defectData.Priority
  plannedDurationInput.value = props.defectData.PlannedDuration.value
  labours.value = props.defectData.Labours.map((x) => {
    return x.position
  })
  symptoms.value = []
  symptomDesc.value = []
  symptomDescValid.value = []
  props.defectData.Symptoms.forEach((x) => {
    if (x.value.indexOf(":") > -1) {
      const symptom = x.value.split(":")
      symptoms.value.push(symptom[0])
      symptomDesc.value.push(stringGroupExtractor(x.value))
      symptomDescValid.value.push(true)
    } else {
      symptoms.value.push(x.value)
      symptomDesc.value.push("")
      symptomDescValid.value.push(true)
    }
  })
  causes.value = []
  causesDesc.value = []
  causesDescValid.value = []
  props.defectData.Causes.forEach((x) => {
    if (x.value.indexOf(":") > -1) {
      const cause = x.value.split(":")
      causes.value.push(cause[0])
      causesDesc.value.push(stringGroupExtractor(x.value))
      causesDescValid.value.push(true)
    } else {
      causes.value.push(x.value)
      causesDesc.value.push("")
      causesDescValid.value.push(true)
    }
  })
  cloneInitialData()
  disabledHyperlink(defectDetailRef.value)
}

const handleBeforeClose = () => {
  camstore.setShowCloseButton(false)
  if (isDisabled.value) {
    emits("closeForm")
  } else {
    if (editedForm.value) {
      showConfirmExit.value = true
    } else {
      emits("closeForm")
    }
  }
}

const onCancelExit = () => {
  showConfirmExit.value = false
}

const onSaveExit = () => {
  showConfirmExit.value = false
  emits("closeForm")
}

const serialNumber = computed(() => {
  return eformDefectStore.SerialNumber
})


const formatOwnershipHTML = computed(() => {
  const ownership = eformDefectStore.Ownership
  return formatOwnership(ownership)
})

const title = computed(() => {
  if (props.generic) {
    return data.value?.Title
  } else {
    return displayDesc(data.value?.Title, true)
  }
});

const partsExist = computed(() => {
  return props.defectData.Parts && props.defectData.Parts.length > 0;
});

const confirmationMessage = computed(() => {
  if (!props.plannerApprove) {
    return partsExist.value
      ? "Are you sure all parts have been covered?"
      : "Are you sure this defect doesn't require any parts?";
  }
  // planner
  return partsExist.value
    ? "Please confirm this defect information is correct."
    : "Are you sure this defect doesn't require any parts?";
});

const onAddPart = () => {
  confirmVisibleWithPart.value = false;
  setModify('partsSection');
};
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
    overflow:inherit !important;
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
