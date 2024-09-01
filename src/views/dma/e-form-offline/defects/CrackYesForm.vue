<template>
  <el-dialog
    v-loading="formStore.Loading"
    v-model="dialogVisible"
    width="90%"
    center
    :lock-scroll="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :custom-class="`el-defect-crack-form-custom form-crack-yes-eform ${customClass}`"
    :before-close="handleBeforeClose"
    @opened="onFormOpened"
    @closed="onFormClosed">
      <template #title>
        <div class="d-flex justify-content-between">
          <div>
            <span class="el-dialog__title">Crack Repair Request</span>
            <span class="el-dialog__title task-title" v-html="displayDesc(title)" ref="defectDetailRef" ></span>
          </div>
          <div class="d-flex" style="margin-right:3rem">
            <div class="rounded d-flex justify-content-center align-items-center header-badge text-badge mx-2"
              :class="[crackData.Type == 'YES' ? 'yellowish yellowish-text' : 'blueish blueish-text']">
              <div>{{ crackData.Type == 'YES' ? 'Repair required' : 'Monitor' }}</div>
            </div>
          </div>
        </div>
      </template>
      <div>
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
          :id="'crack'"
          :disabled="false"
          :allow-delete="true"
          :is-monitoring="false"
          :is-mandatory="true"
          :old-version="true"
          :has-submitted="showCameraValidation" />
        </div>
        <template v-if="showCameraValidation">
          <Label class="error-label">Required</Label>
        </template>
        <el-collapse
          v-if="formStore.referencePhoto.blob && formStore.referencePhoto.blob != ''"
          class="task-group general-accordion py-1 px-5"
          v-model="referencePhotoCollapse"
        >
          <el-collapse-item :title="formStore.referencePhoto.title" :name="formStore.referencePhoto.title">
            <div class="d-flex justify-content-center reference-photo">
              <el-image :src="formStore.referencePhoto.blob" />
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="mt-1 py-2">
          <Textarea
            :value="data.Description.value"
            :label="defectPlaceholder"
            name="defectPlaceholder"
            :errorMessage="data.Description.errorMessage"
            :is-valid="data.Description.isValid"
            @handleChange="onDescriptionChange"
          ></Textarea>
        </div>
        <div class="mt-1 py-2">
          <div class="row">
            <div class="col pe-0">
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  disabled
                  :value="formStore.selectedFitter.name"
               />
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
                    class="form-control"
                    @input.prevent="onPlannedHoursChange"
                    v-model="formatPlannedDuration"
                    pattern="[0-9]*" inputmode="numeric"
                    @keypress="onlyNumber"
                    @focusout="onPlannedHoursChange"
                 />
                  <label class="text-nowrap">How long will this crack repair take?</label>
                </div>
                <div class="mt-2" v-if="!data.PlannedDuration.isValid">
                  <Label class="error-label">{{
                    data.PlannedDuration.errorMessage
                  }}</Label>
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
            name="instructionPlaceholder"
            :errorMessage="data.Instruction.errorMessage"
            :is-valid="data.Instruction.isValid"
            @handleChange="onInstructionChange"
          ></Textarea>
        </div>
        <div class="mt-1 px-3 previous-crack-container word-breaker">
          <div class="row justify-content-center table-header-background-color p-1">
            Crack Length
          </div>
          <div class="row table-header-background-color p-1">
            <div class="col">Location</div>
            <div class="col-3">Previous</div>
            <div class="col-3">Current</div>
            <div class="col-1"></div>
          </div>
          <template v-for="(previousCrack, index) in previousCracks" :key="previousCrack">
            <div class="row my-1 d-flex align-items-center">
              <div class="col">
                {{ locationPreviousCrack(previousCrack) }}
              </div>
              <div class="col-3">{{ formatNumberInput(previousCrack.previousCrack)}} {{ (previousCrack.previousCrack != '-' ? "mm" : "-") }}</div>
              <div class="col-3">
                <input
                    type="text"
                    class="form-control"
                    :value="previousCrack.currentCrack"
                    @input="onCrackLengthCurrentChange($event, index)"
                    @keypress="onlyNumber"
                    pattern="[0-9]*" inputmode="numeric"
                 />
                  <div
                    class="mt-2"
                    v-if="!data.CrackLength[index].isValid"
                  >
                    <Label class="error-label">{{
                      data.CrackLength[index].errorMessage
                    }}</Label>
                  </div>
              </div>
              <div class="col-1"> mm</div>
            </div>
          </template>
        </div>
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
                    <input class="form-check-input" type="radio" v-model="defectPriority" value="P1">
                    <label class="form-check-label">
                      (P1) Immediate
                    </label>
                  </div>
                </div>
                <div class="col-6 word-breaker">Shall shut machine down and udertake repairs.</div>
                <div class="col-3 text-break">Maintenance Supervisor</div>
              </div>
              <div class="row p-3 m-1 priority-container">
                <div class="col-3">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="defectPriority" value="P2">
                    <label class="form-check-label">
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
                    <input class="form-check-input" type="radio" v-model="defectPriority" value="P3">
                    <label class="form-check-label">
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
                    <input class="form-check-input" type="radio" v-model="defectPriority" value="P4">
                    <label class="form-check-label">
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
        <el-collapse class="task-group general-accordion py-1 px-5 parts-collapse" v-model="partsRequiredCollapse">
          <el-collapse-item title="Parts Required" name="Parts Required">
            <parts-warning v-if="showPartsWarning" />
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
                    <input type="text" class="form-control" :value="data.Parts[index].partNumber" @change="onPartNumberChange($event, index)" />
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
                      <input class="form-control" v-model="item.qty" @input="onPartQtyChange($event, index)"
                      pattern="[0-9]*" inputmode="numeric" @keypress="onlyNumber" @focusout="onPartQtyChange($event, index)"/>
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
              <div class="d-flex justify-content-between align-items-center flex-row-reverse">
                <div class="fw-bolder">
                  Check Partbook
                  <a :href="onlineDefectFormStore.statePartReference.linkAddress" target="_blank" class="fw-bolder" style="color: #18AF4A;">
                    <img src="/media/icons/bumaau/open_in_new.svg"/>
                    {{ onlineDefectFormStore.statePartReference.brand }}
                  </a>
                </div>
                <button class="my-3 btn-add-new" @click="onAddNewParts">
                  <em class="fa fa-plus me-2"></em>
                  Add more parts
                </button>
              </div>
          </el-collapse-item>
        </el-collapse>
        <div class="mt-2"></div>
        <el-collapse class="task-group general-accordion py-1 px-5" v-model="labourRequired">
          <el-collapse-item title="Labour" name="Labour">
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
                    placeholder="Choose One"
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
                    <input class="form-control" v-model="item.qty" pattern="[0-9]*" inputmode="numeric" @keypress="onlyIntegerInput"
                    @input.prevent="onLabourQtyChange($event, index)" @focusout="onLabourQtyChange($event, index)"/>
                    <div class="mt-2" v-if="!item.qtyValidation.isValid">
                        <Label class="error-label">{{ item.qtyValidation.message }}</Label>
                    </div>
                  </div>
                </div>
                <div class="col-2 d-flex justify-content-start">
                  <div class="d-flex flex-column">
                    <input class="form-control" v-model="item.hireEach" @keypress="onlyNumber" pattern="[0-9]*" inputmode="numeric"
                    @input.prevent="onLabourHireEachChange($event, index)" @focusout="onLabourHireEachChange($event, index)"/>
                    <div class="mt-2" v-if="!item.hireEachValidation.isValid">
                        <Label class="error-label">{{ item.hireEachValidation.message }}</Label>
                    </div>
                  </div>
                </div>
                <div class="col-2 d-flex flex-column justify-content-start">
                  <div class="row p-0 m-0 h-50 w-100">
                    <div class="p-0 col-12 d-flex">
                      <input class="form-control" :value="item.totalHours" disabled />
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
          <button
            class="btn btn-success w-100"
            @click="onSubmitCracks"
            style="background: #18af4a; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white;">
            Submit
          </button>
        </div>
      </div>
      <CompleteOrLaterDialog
      :show="confirmVisible"
      :parts-warning="partsWarningVisible"
      @add-parts="onAddParts"
      @close="onCancel"
      @submit="onSave"/>
      <Confirmation :visibility="showConfirmExit"
          caption="Are you sure want to close the crack form? <br /> Note: By closing the crack form, you will lose your crack data that you have already inputted."
          @on-no-confirm="onCancelExit"
          @on-yes-confirm="onSaveExit" />
      <MessageBox :show="messageBoxVisible" @close="onOk" message="Crack Recording Information Successfully Submitted"/>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  defineProps,
  toRef,
  PropType,
  ref,
  computed,
  watch
} from "vue";
import CrackYesClass from "@/core/classes/CrackYesClass";
import {
  getUTCOffsetDate
} from "@/core/helpers/date-format";
import {
  useOfflineCameraStore
} from "@/store/pinia/application/useOfflineCameraStore";
import {
  useCracksFormStore
} from "@/store/pinia/dma/e-form-offline/cracks/useCracksFormStore";
import { useEFormStore } from "@/store/pinia/dma/e-form-offline/useEFormStore";
import {
  usePositionListStore
} from "@/store/pinia/administration/organization-unit/position/usePositionListStore";
import { useMasterStore } from "@/store/pinia/dma/masters/useMasterStore";
import LargeCamera from '@/components/camera/OfflineLargeCamera.vue';
import Confirmation from "@/components/dialog/Confirmation.vue";
import MessageBox from "@/components/dialog/OfflineMessageBox.vue";
import { ElLoading } from "element-plus";
import {
  formatNumberWithComma,
  reformatNumberWithComma
} from "@/core/helpers/number-format"
import {
  useGeneralFormStore
} from "@/store/pinia/dma/e-form-offline/useGeneralFormStore";
import { displayDesc } from "@/core/helpers/manipulate-html-string";
import {
  handleScrollToError,
  handleScrollToErrorModal,
  handleScrollToTopOfDialog
} from "@/core/helpers/ironforms/defects-form/defect-form"
import Textarea from "@/components/inputs/dma/Textarea.vue";
import { TextareaParam } from "@/core/types/misc/TextareaParam";
import { v4 as uuidv4 } from 'uuid';
import CompleteOrLaterDialog from "../sub-group/task-group/task/item/dialog/CompleteOrLaterDialog.vue";
import {
  formatOwnership,
  getTitle,
  disabledHyperlink,
  onlyNumberResult,
  locationPreviousCrack,
  onlyIntegerInput,
  hasDefectDataChanged
} from "@/store/pinia/dma/e-form/helpers";
import SmallCamera from "@/components/dma/defect/offline-parts-component/SmallCamera.vue"
import UploadAttachment from "@/components/dma/defect/offline-parts-component/UploadAttachment.vue"
import { db } from "@/database/schema/DexieSchema";
import {
  last,
  cloneDeep,
  isUndefined
} from "lodash";
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import { CompleteEmitParam } from "../types/CompleteEmitParam";
import PartsWarning from '@/views/dma/e-form-offline/sub-group/task-group/task/item/dialog/PartsWarning.vue';
import {
  useDefectsFormStore as onlineUseDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore";
import {
  useDefectsStore
} from "@/store/pinia/dma/e-form-offline/defects/useDefectsStore";

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean,
  },
  assetNumber: {
    required: true,
    type: String,
  },
  predefinedPriority: {
    required: true,
    type: String,
    default: 'P1'
  },
  workorder: {
    required: false,
    type: String,
    default: ''
  },
  crackData: {
    required: true,
    type: Object as PropType<CrackYesClass>,
  }
});

const camstore = useOfflineCameraStore();
const formStore = useCracksFormStore();
const store = useEFormStore();
const positionStore = usePositionListStore();
const masterStore = useMasterStore();
const showCameraValidation = ref(false)
const onlineDefectFormStore = onlineUseDefectsFormStore();
const defectsStore = useDefectsStore();

const referencePhotoCollapse = ref("")
const priorityCollapse = ref('Priority')
const partsRequiredCollapse = ref('Parts Required')
const labourRequired = ref('Labour')
const otherResourceCollapse = ref('Other Resources Required (optional)')
const defectSysmptompCollapse = ref('Defect Symptom')
const defectCausesCollapse = ref('Defect Cause')

/* refs */
const messageBoxVisible = ref(false);
const confirmVisible = ref(false);
const isCancelled = ref(true);
const loading = ref(false);
const dialogVisible = toRef(props, "visibility");
const data = toRef(props, "crackData");
const defectPriority = ref("");
const labours = ref<Array<string>>([""]);
const symptoms = ref<Array<string>>([""]);
const causes = ref<Array<string>>([""]);
const symptomDesc = ref<Array<string>>([""]);
const symptomDescValid = ref<Array<boolean>>([true]);
const causesDesc = ref<Array<string>>([""]);
const causesDescValid = ref<Array<boolean>>([true]);
const showConfirmExit = ref(false)
const customClass = ref(uuidv4())
const showPartsWarning = ref(false)
const clonedCrackData = ref()

const partsWarningVisible = computed(() => {
  return props.crackData.DefectRequirement != 'Less than 30 minutes labour and less than $250 in parts' && data.value.Parts.length == 0
})

const images = computed(() => {
  if (isUndefined(formStore.images)) {
    return []
  } else {
    return formStore.images.ImageInfos
  }
})

const comparedData = computed(() => {
  return {
    images: images.value,
    description: props.crackData.Description.value,
    priority: props.crackData.Priority,
    instruction: props.crackData.Instruction.value,
    plannedDuration: props.crackData.PlannedDuration.value,
    parts: props.crackData.Parts,
    labours: props.crackData.Labours,
    resources: props.crackData.Resources,
    symptoms: props.crackData.Symptoms,
    causes: props.crackData.Causes,
    crackLength: props.crackData.CrackLength
  }
})

let savedFilesOnLocal = [] as string[]

// ---------- format ----------
const plannedDurationInput = ref('')
// ---------- format ----------

// ---------- format (computed) ---------
const formatPlannedDuration = computed({
  get: () => {
    let formatted = plannedDurationInput.value
    formatted = plannedDurationInput.value
    // if (formatted == '0') formatted = ''
    return formatted
  },
  set: (val) => {
    plannedDurationInput.value = val
  }
})

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
  if (savedFilesOnLocal.length == 0) {
    return
  }
  const localFiles = db.pendingTaskFile.where("filename").anyOf(savedFilesOnLocal)
  if (localFiles) {
    localFiles.delete()
  }
}
// ---------- format (method) ----------

/* computes */
const previousCracks = computed(() => {
  return formStore.stateCrackInfo.CrackLength
});
const taskUpdate = computed(() => {
  return store.taskUpdated;
});
const defectPlaceholder = computed(() => {
  return "Crack Identified Description"
});
const instructionPlaceholder = computed(() => {
  return "Crack Repair Instructions / Actions"
});
const isFormAlreadySubmitted = computed(() => {
  return store.formAlreadySubmitted
});
const title = computed(() => {
  return getTitle(formStore.stateTask)
});
const isCracktMajor = computed(() => {
  return props.crackData.DefectRequirement != "Less than 30 minutes labour and less than $250 in parts"
});

const defaultLabour = computed(() => {
  const defaultLabourHardcode = "Boilermaker"
  if (positionStore.positionOption) {
    if (positionStore.positionOption.find((val) => {
      return val.label == defaultLabourHardcode
    })) {
      return defaultLabourHardcode
    }
  }
  return ""
})

/* watchers */
watch(isFormAlreadySubmitted, (newValue) => {
  if (newValue) {
    formStore.toggleYesVisible(false);
    store.resetTaskUpdated();
    messageBoxVisible.value = false;
    isCancelled.value = false;
    loading.value = false;
    formStore.setCancelledState(true)
    camstore.clearCurrent();
  }
});
const isTaskAlreadyUpdated = computed(() => {
  return store.taskAlreadyUpdated
});
watch(isTaskAlreadyUpdated, (newValue) => {
  if (newValue) {
    formStore.toggleYesVisible(false);
    store.resetTaskUpdated();
    messageBoxVisible.value = false;
    isCancelled.value = false;
    loading.value = false;
    formStore.setCancelledState(true)
    camstore.clearCurrent();
  }
});
watch(taskUpdate, (newValue) => {
  if (!formStore.CrackYesVisible) return;
  if (newValue === false) {
    loading.value = true;
  }
  if (newValue === true) {
    if (!store.stateItemKey) messageBoxVisible.value = true;
  }
});
const watchedFields = [
  "images",
  "description",
  "defectPriority",
  "instruction",
  "plannedDuration",
  "parts",
  "labours",
  "resources",
  "symptoms",
  "causes",
  "crackLength"
];

const editedForm = computed(() => {
  return hasDefectDataChanged(watchedFields, clonedCrackData.value, comparedData.value)
})

const current = () => {
  const generalStore = useGeneralFormStore()
  const date = getUTCOffsetDate(generalStore.stateTimeZone)
  return (`${date} (${generalStore.stateTimeZoneDesc})`)
}

/* event handlers */
const onlyNumber = ($event) => {
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
    $event.preventDefault();
  }
}

const onCrackLengthCurrentChange = (event, index: number) => {
  event.preventDefault();
  event.target.value = onlyNumberResult(event.target.value)
  if (isNaN(Number(event.target.value))) {
    data.value.setCurrentCrack(index, event.target.value);
    data.value.validateCurrentCrack(data.value.CrackLength[index]);
  }
  data.value.setCurrentCrack(index, event.target.value);
  data.value.validateCurrentCrack(data.value.CrackLength[index]);
};
const onDescriptionChange = (event) => {
  data.value.setDescription(event.value);
  data.value.validateDescription();
};
const onPlannedHoursChange = (event) => {
  event.preventDefault();
  event.target.value = onlyNumberResult(event.target.value)
  if (isNaN(Number(event.target.value))) {
    data.value.setPlannedDuration(event.target.value);
    data.value.validatePlannedDuration();
  }
  data.value.setPlannedDuration(event.target.value)
  data.value.validatePlannedDuration();
};
const onInstructionChange = (event) => {
  data.value.setInstruction(event.value);
  data.value.validateInstruction();
};

/* parts */
const onPartNumberChange = (event, index: number) => {
  event.preventDefault();
  data.value.setPartNumber(index, event.target.value);
}
const onPartDescriptionChange = (event, index: number) => {
  event.preventDefault();
  data.value.setPartDescription(index, event.target.value);
  data.value.validatePartDescription(data.value.Parts[index]);
};
const onPartQtyChange = (event, index: number) => {
  event.preventDefault();
  event.target.value = onlyNumberResult(event.target.value)
  if (isNaN(Number(event.target.value))) {
    data.value.setPartQty(index, event.target.value);
    data.value.validatePartQty(data.value.Parts[index]);
  }
  data.value.setPartQty(index, event.target.value)
  data.value.validatePartQty(data.value.Parts[index]);
};
const onPartImageChange = (params) => {
  const { value, index } = params
  data.value.setPartImage(index, value);
  savedFilesOnLocal.push(last(value as any[]).filename)
}
const onPartAttachmentChange = (params) => {
  const { value, index } = params
  data.value.setPartAttachment(index, value);
  savedFilesOnLocal.push(last(value as any[]).url)
}
const onAddNewParts = () => {
  /* validate first */
  const isValid = data.value.Parts.every((e) => {
    return e.partDescription !== "" && e.qty !== undefined;
  });
  if (!isValid) {
    data.value.validateParts();
    return;
  } else {
    for (const partIndex in data.value.Parts) {
      if (Object.prototype.hasOwnProperty.call(data.value.Parts, partIndex)) {
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
    qty: ""
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
  if (isNaN(Number(event.target.value))) {
    data.value.setLabourQty(index, event.target.value);
    data.value.validateLaboursQty(data.value.Labours[index]);
    if (!data.value.Labours[index].position) {
      onLabourChange(index)
    }
    calculateTotalHours(index);
  }
  data.value.setLabourQty(index, event.target.value);
  data.value.validateLaboursQty(data.value.Labours[index]);
  if (!data.value.Labours[index].position) {
    onLabourChange(index)
  }
  calculateTotalHours(index);
}
const onLabourHireEachChange = (event, index: number) => {
  event.preventDefault();
  event.target.value = onlyNumberResult(event.target.value)
  if (isNaN(Number(event.target.value))) {
    data.value.setLabourHireEach(index, event.target.value);
    data.value.validateLaboursHireEach(data.value.Labours[index]);
    if (!data.value.Labours[index].position) {
      onLabourChange(index)
    }
    calculateTotalHours(index);
  }
  data.value.setLabourHireEach(index, event.target.value);
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
  let total = qty * each;
  if (!Number.isInteger(total)) {
    total = Number((Math.round(total * 100) / 100).toFixed(2))
  }
  data.value.setLabourTotalHours(index, total.toString());
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
      if (Object.prototype.hasOwnProperty.call(data.value.Labours, labourIndex)) {
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
  if (index == 0 && data.value.Resources[index].value == '') return
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
  data.value.validateResourcesRemove();
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
const onAddParts = () => {
  confirmVisible.value = false;
  showPartsWarning.value = true;
  handleScrollToErrorModal('form-crack-yes-eform  ', 'parts-collapse')
}
const onAddNewCause = () => {
  for (const causeIndex in data.value.Causes) {
    if (Object.prototype.hasOwnProperty.call(data.value.Causes, causeIndex)) {
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
    if (Object.prototype.hasOwnProperty.call(data.value.Symptoms, causeIndex)) {
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
  store.setStateItemKey("")
  store.resetTaskUpdated()
  setTimeout(() => {
    store.setTaskUpdated()
  }, 50);
  if (!isOfflineOrSlowInternetConnection()) {
    store.getTaskProgress()
    store.updateGroupByParam(store.stateSelectedGroup!.groupName)
  }
  store.updateAllItems(formStore.ItemKey, "3")
}
const validateSymptoms = (): boolean => {
  for (const causeIndex in data.value.Symptoms) {
    if (Object.prototype.hasOwnProperty.call(data.value.Symptoms, causeIndex)) {
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
  }
  return symptomDescValid.value[lastIndex];
}
const validateCauses = (): boolean => {
  for (const causeIndex in data.value.Causes) {
    if (Object.prototype.hasOwnProperty.call(data.value.Causes, causeIndex)) {
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
  }
  return causesDescValid.value[lastIndex];
}
const onSubmitCracks = async () => {
  data.value.validateDefectForm();
  const isNoPicTaken = isUndefined(formStore.images) || formStore.images.ImageInfos.length < 1;
  if (isNoPicTaken) {
    showCameraValidation.value = true
    handleScrollToError()
  }
  if (data.value?.IsValid && validateSymptoms() && validateCauses() && !isNoPicTaken) {
    confirmVisible.value = true;
  } else {
    expandAllPanel()
    handleScrollToError()
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
const onSave = async (param: CompleteEmitParam) => {
  confirmVisible.value = false;
  const loader = ElLoading.service({
    lock: true,
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  data.value.setAssetNumber(props.assetNumber);
  data.value.setPriority(defectPriority.value);
  data.value.setIsComplete(param.isComplete);
  reAssignSymptoms();
  reAssignCauses();
  let updateCrackSuccess
  if (!isOfflineOrSlowInternetConnection()) {
    updateCrackSuccess = await formStore.createCrack();
  } else {
    updateCrackSuccess = await formStore.updateDefectToLocalDB()
  }
  if (updateCrackSuccess) await updateTask();
  else if (store.taskErrorDialog) {
    onOk()
  }
  if (!isOfflineOrSlowInternetConnection()) {
    defectsStore.getDefectsDataAll(props.workorder)
  }
  loader.close();
}
const onCancel = () => {
  confirmVisible.value = false;
}
const onOk = () => {
  defectPriority.value = "";
  labours.value = [defaultLabour.value];
  symptoms.value = [""];
  causes.value = [""];
  symptomDesc.value = [""];
  symptomDescValid.value = [true];
  causesDesc.value = [""];
  causesDescValid.value = [true];
  /* hide form */
  formStore.toggleYesVisible(false);
  store.resetTaskUpdated();
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
  showCameraValidation.value = false
  formStore.resetInstance();
  camstore.clearCurrent();
  camstore.setShowCloseButton(false)
  showPartsWarning.value = false
  camstore.reset()
};
const defectDetailRef = ref(null) as any

const onFormOpened = () => {
  savedFilesOnLocal = []
  camstore.setShowCloseButton(true)
  defectPriority.value = props.predefinedPriority;
  referencePhotoCollapse.value = formStore.referencePhoto.title;
  handleScrollToTopOfDialog(customClass.value)
  isCancelled.value = true;
  labours.value = [defaultLabour.value];
  clonedCrackData.value = {
    images: cloneDeep(images.value),
    description: cloneDeep(props.crackData.Description.value),
    priority: cloneDeep(props.crackData.Priority),
    instruction: cloneDeep(props.crackData.Instruction.value),
    plannedDuration: cloneDeep(props.crackData.PlannedDuration.value),
    parts: cloneDeep(props.crackData.Parts),
    labours: cloneDeep(props.crackData.Labours),
    resources: cloneDeep(props.crackData.Resources),
    symptoms: cloneDeep(props.crackData.Symptoms),
    causes: cloneDeep(props.crackData.Causes),
    crackLength: cloneDeep(props.crackData.CrackLength)
  }
  clonedCrackData.value.labours[0].position = defaultLabour.value
  disabledHyperlink(defectDetailRef.value)
  showPartsWarning.value = false
}
const expandAllPanel = () => {
  priorityCollapse.value = 'Priority'
  partsRequiredCollapse.value = 'Parts Required'
  labourRequired.value = 'Labour'
  otherResourceCollapse.value = 'Other Resources Required (optional)'
  defectSysmptompCollapse.value = 'Defect Symptom'
  defectCausesCollapse.value = 'Defect Cause'
}

watch(images, (newValue) => {
  if (newValue.length > 0) showCameraValidation.value = false
}, { deep: true })
</script>
<style lang="scss">
.el-select__popper {
  z-index: 90000 !important;
}
.title {
  font-size: 13px !important;
  font-weight: 800 !important;
  text-align: left;
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
.el-defect-crack-form-custom {
  .reference-photo {
    .el-image__inner {
      max-height: 500px;
    }
  }
}
</style>
<style lang="scss" scoped>
.header-badge {
  height: 25px;
  padding: 5px;
  color: white;
  font-weight: 500;
}
.text-badge {
  font-weight: 700 !important;
  font-size: 12px !important;
}
.yellowish {
  background-color: #FFF3CD;
}
.blueish {
  background-color: #EBF7FE;
}
.yellowish-text {
  font-weight: 700;
  color: #CC9A06 !important
}
.blueish-text {
  font-weight: 700;
  color: #01A3FF !important
}
 @import "@/assets/sass/pages/defect.form.scss";
 @import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
</style>
