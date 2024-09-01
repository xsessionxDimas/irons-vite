<template>
  <el-dialog v-model="dialogVisible"
    :custom-class="`crackform el-defect-crack-form-custom edit-crack-yes ${customClass}`"
    width="90%" center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="onFormClosed"
    :before-close="handleBeforeClose"
    @opened="onFormOpened" :destroy-on-close="true">
    <template #title>
      <div class="d-flex justify-content-between">
        <div>
          <span class="el-dialog__title">Crack Repair Request</span>
          <span class="el-dialog__title task-title" v-html="displayDesc(data.Title)" ref="defectDetailRef"></span>
        </div>
        <div class="d-flex" style="margin-right:3rem">
          <div class="rounded d-flex justify-content-center align-items-center header-badge text-badge mx-2"
            :class="[crackData.Type == 'YES' ? 'yellowish yellowish-text' : 'blueish blueish-text']">
            <div>{{ crackData.Type == 'YES' ? 'Repair required' : 'Monitor' }}</div>
          </div>
          <template v-if="defectStatus == 'Decline'">
            <div
              class="rounded d-flex justify-content-center align-items-center header-badge red-bg text-dark-red mx-2">
              <div>Declined</div>
            </div>
          </template>
          <template v-else-if="defectStatus == 'Acknowledge'">
            <div
              class="rounded d-flex justify-content-center align-items-center approved-badge header-badge green mx-2">
              <div>Approved</div>
            </div>
          </template>
          <div class="rounded d-flex justify-content-center align-items-center header-badge"
            :class="completeStatus ? 'green' : 'red'">
            <div>
              <img src="/media/svg/dma/icons/Repair.png" alt="" />
            </div>
            <div style="margin:6px 0 4px 5px">{{ completeStatus ? 'Completed' : 'Incomplete' }}</div>
          </div>
        </div>
      </div>
    </template>
    <div>
      <el-collapse class="task-group general-accordion py-1 px-5" v-model="historyCollapse">
      <el-collapse-item title="Changes and Approval History" name="History">
        <div class="history-wrapper">
          <DefectHistoryPanel :activities="timeline" />
          <hr />
          <DefectHistoryVersion :version-dates="versionDate" @change-version="onDefectVersionChange" ref="defectVersion" />
        </div>
      </el-collapse-item>
      </el-collapse>
      <div class="mt-1 p-2"></div>
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
        <large-camera :id="'crack'" :disabled="isDisabled" :allow-delete="!isDisabled" :is-mandatory="true" :has-submitted="showCameraValidation" />
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
          :value="data?.Description?.value"
          :label="defectPlaceholder"
          name="defectPlaceholder"
          :errorMessage="data.Description.errorMessage"
          :is-valid="data.Description.isValid"
          :max="255"
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
                        @input.prevent="onPlannedHoursChange"
                        v-model="formatPlannedDuration"
                        :disabled="isDisabled"
                        @keypress="onlyNumber"
                        pattern="[0-9]*" inputmode="numeric"
                        @focusout="onPlannedHoursChange"
                      />
                      <label class="text-nowrap">How long will this crack repair take?</label>
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
          :max="255"
          :disabled="isDisabled"
          @handleChange="onInstructionChange"
        ></Textarea>
      </div>
      <div class="mt-1 mb-3 px-3 previous-crack-container word-breaker">
          <div class="row justify-content-center table-header-background-color p-1">
              Crack Length
          </div>
          <div class="row table-header-background-color p-1">
              <div class="col">Location</div>
              <div class="col-3">Previous</div>
              <div class="col-3">Current</div>
              <div class="col-1"></div>
          </div>
          <template v-for="(previousCrack, index) in crackData.CrackLength" :key="previousCrack">
              <div class="row my-1 d-flex align-items-center">
              <div class="col">
                {{ locationPreviousCrack(previousCrack) }}
              </div>
              <div class="col-3">{{ formatNumberInput(previousCrack.previousCrack) }} {{ (previousCrack.previousCrack != '-' ? "mm" : "-") }}</div>
              <div class="col-3">
                  <input
                      type="text"
                      class="form-control"
                      :value="formatNumberInput(previousCrack.currentCrack)"
                      @input="onCrackLengthCurrentChange($event, index)"
                      @keypress="onlyNumber"
                      pattern="[0-9]*" inputmode="numeric"
                      :disabled="isDisabled" />
                  <div
                      class="mt-2"
                      v-if="!data.CrackLength[index].isValid">
                      <Label class="error-label">{{
                      data.CrackLength[index].errorMessage
                      }}</Label>
                  </div>
              </div>
              <div class="col-1"> mm</div>
              </div>
          </template>
      </div>
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
                  <label class="form-check-label">
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
                  <input class="form-check-input" type="radio" v-model="priority" value="P3" @change.prevent="onPriorityChange" :disabled="isDisabled">
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
                  <input class="form-check-input" type="radio" v-model="priority" value="P4" @change.prevent="onPriorityChange" :disabled="isDisabled">
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
      <el-collapse class="task-group general-accordion py-1 px-5 parts-collapse" v-model="collapsibleParts">
        <el-collapse-item title="Parts" name="Parts">
          <parts-warning v-if="showPartsWarning" />
          <div class="row p-3 m-1 priority-container px-0" style="background: #F4F6F8; border-radius: 8px;">
              <div class="col-3">Part Number</div>
              <div class="col-5">Part Description</div>
              <div class="col-1">Qty</div>
              <div class="col"></div>
              <div class="col"></div>
            </div>
            <div class="row p-3 m-1 priority-container ps-0" v-for="(item, index) in data.Parts" :key="item.partNumber">
              <div class="col-3 px-0">
                <div class="d-flex flex-column">
                  <input type="text" class="form-control" :value="data.Parts[index].partNumber" :disabled="isDisabled" @change="onPartNumberChange($event, index)" />
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
              <div class="col-1 px-1 d-flex flex-column justify-content-start">
                <div class="row p-0 m-0 h-50 w-100">
                  <div class="p-0 col-12 d-flex">
                    <input class="form-control" v-model="item.qty" @input.prevent="onPartQtyChange($event, index)" :disabled="isDisabled" pattern="[0-9]*" inputmode="numeric" @keypress="onlyNumber"
                    @focusout="onPartQtyChange($event, index)" />
                  </div>
                </div>
                <div class="mt-2 flex-fill" v-if="!item.qtyValidation.isValid">
                    <Label class="error-label">{{ item.qtyValidation.message }}</Label>
                </div>
              </div>
              <div class="col px-1 d-flex flex-column justify-content-start">
                <div class="row p-0 m-0 h-100 w-100 align-items-center">
                  <SmallCamera :index="index" :item-value="item.images || []" @handle-change-image="onPartImageChange" :is-disabled="isDisabled" />
                </div>
              </div>
              <div class="col px-1 d-flex flex-column justify-content-start position-relative">
                <div class="row p-0 m-0 h-100 w-100 align-items-center">
                  <UploadAttachment :index="index" :item-value="item.attachment || []" @handle-change-attachment="onPartAttachmentChange" :is-disabled="isDisabled"/>
                </div>
                <div class="position-absolute" style="top:10px; right: 0px;" :class="isDisabled ? 'hidden' : ''">
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
            <button class="my-3 btn-add-new" @click="onAddNewParts" v-show="!isDisabled">
              <em class="fa fa-plus me-2"></em>
              Add more parts
            </button>
          </div>
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
          <template v-for="(item, index) in data.Labours" :key="item">
            <div class="row p-3 m-1 priority-container px-0">
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
              <div class="col-2  d-flex justify-content-start">
                <div class="d-flex flex-column">
                  <input class="form-control" v-model="item.qty" pattern="[0-9]*" inputmode="numeric" @keypress="onlyIntegerInput"
                  @input.prevent="onLabourQtyChange($event, index)" :disabled="isDisabled" @focusout="onLabourQtyChange($event, index)"/>
                  <div class="mt-2" v-if="!item.qtyValidation.isValid">
                      <Label class="error-label">{{ item.qtyValidation.message }}</Label>
                  </div>
                </div>
              </div>
              <div class="col-2 d-flex justify-content-start">
                <div class="d-flex flex-column">
                  <input class="form-control" v-model="item.hireEach" pattern="[0-9]*" inputmode="numeric" @keypress="onlyNumber"
                  @input.prevent="onLabourHireEachChange($event, index)" :disabled="isDisabled" @focusout="onLabourHireEachChange($event, index)"/>
                  <div class="mt-2" v-if="!item.hireEachValidation.isValid">
                      <Label class="error-label">{{ item.hireEachValidation.message }}</Label>
                  </div>
                </div>
              </div>
              <div class="col-2 d-flex flex-column justify-content-start">
                <div class="row p-0 m-0 h-50 w-100">
                  <div class="p-0 col-12 d-flex">
                    <input class="form-control" :value="item.totalHours" disabled/>
                    <div class="ms-4 d-flex align-items-center" :class="handleRemoveButton(index)">
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
              <div class="d-flex flex-row">
                <input type="text" class="form-control" :value="item.value" :placeholder="`Resource ${Number(index) + 1}`"
                @change="onResourcesChange($event, index)" :disabled="isDisabled" />
                <div class="ms-4 d-flex align-items-center" :class="handleRemoveButton(index)">
                  <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="onRemoveResource(index)"></em>
                </div>
              </div>
              <div class="mt-2" v-if="!item.isValid">
                  <Label class="error-label">{{ item.errorMessage }}</Label>
              </div>
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
          <div class="p-2 d-flex flex-column" v-for="(item, index) in data.Symptoms" :key="item.value">
            <div class="d-flex flex-row">
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
                <div class="mt-2" v-if="symptoms[index] === 'Other'">
                  <Textarea
                    :value="symptomDesc[index]"
                    label="Description"
                    name="Description"
                    errorMessage="Required"
                    :is-valid="symptomDescValid[index]"
                    :index="index"
                    :disabled="isDisabled"
                    @handleChange="onSymptomDescChange"
                  ></Textarea>
                </div>
              </div>
              <div class="ms-4 d-flex align-items-center" :class="handleRemoveButton(index)">
                <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="onRemoveSymptom(index)"></em>
              </div>
            </div>
            <div class="mt-2" v-if="!item.isValid">
                <Label class="error-label">{{ item.errorMessage }}</Label>
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
          <div class="p-2 d-flex flex-column" v-for="(item, index) in data.Causes" :key="item.value">
            <div class="d-flex flex-row">
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
              <div class="ms-4 d-flex align-items-center" :class="handleRemoveButton(index)">
                <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="onRemoveCause(index)"></em>
              </div>
            </div>
            <div class="mt-2" v-if="!item.isValid">
                <Label class="error-label">{{ item.errorMessage }}</Label>
            </div>
          </div>
          <button class="my-3 btn-add-new" @click="onAddNewCause" v-if="!isDisabled">
            <em class="fa fa-plus me-2"></em>
            Add another cause
          </button>
        </el-collapse-item>
      </el-collapse>
      <template v-if="isForm">
        <div class="my-5 w-100 d-flex justify-content-around">
          <template v-if="!showCancelButtonOnModify">
            <button class="btn btn-warning w-100" @click.prevent="preHandleModifyAndShowCancelButton"
              style="background:#FFC107; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: black">Modify</button>
          </template>
          <template v-else>
            <button class="btn btn-light w-100" @click.prevent="handleCancelModify"
              style="background: #FFFFFF; border: 1px solid rgba(145, 158, 171, 0.24); box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: black">Cancel</button>
              <button class="ms-3 btn btn-success w-100" @click.prevent="onSubmitDefects"
              :disabled="!showCancelButtonOnModify"
              style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Submit</button>
          </template>
        </div>
      </template>
      <template v-else>
        <template v-if="defectSheetStore.SelectedFitter.name" >
          <template v-if="!showCancelButtonOnModify">
            <div class="my-5 w-100 d-flex justify-content-around">
              <button class="ms-3 btn btn-warning w-100" @click.prevent="preHandleModifyAndShowCancelButton"
                style="background:#FFC107; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: black">Modify</button>
            </div>
          </template>
          <template v-else>
            <div class="my-5 w-100 d-flex justify-content-around">
              <button class="btn btn-light w-100" @click.prevent="handleCancelModify"
                style="background: #FFFFFF; border: 1px solid rgba(145, 158, 171, 0.24); box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: black">Cancel</button>
              <button class="ms-3 btn btn-success w-100" @click.prevent="onSubmitDefects"
                style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Submit</button>
            </div>
          </template>
        </template>
      </template>
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
    <Confirmation :visibility="showReviseConfirm"
      :caption="reviseCaption"
      @on-no-confirm="() => { showReviseConfirm = false }" @on-yes-confirm="handleModifyAndShowCancelButton" />
    <MessageBox :show="messageBoxVisible" @close="onOk" :message="completeMessage"/>
    <MessageBox :show="errorMessageBoxVisible" @close="onOk" :message="errorMessage" icon="media/svg/dma/alert.svg"/>
    <DefectDecline
      :visibility="showDeclineReason"
      formTitle="Are you sure want to decline this defect information?"
      :task-title="data.Title"
      @closeForm="toggleShowDeclineRease"
      @submitDecline="submitDecline"
    />
  </el-dialog>
  <ToastWithIcon :show="successMessageBoxVisible" :message="completeMessage" />
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
} from 'vue'
import {
  useOfflineCameraStore
} from '@/store/pinia/application/useOfflineCameraStore'
import {
  useDefectsStore
} from '@/store/pinia/dma/e-form-offline/defects/useDefectsStore'
import {
  usePositionListStore
} from '@/store/pinia/administration/organization-unit/position/usePositionListStore'
import {
  useCracksFormStore
} from "@/store/pinia/dma/e-form-offline/cracks/useCracksFormStore";
import { useMasterStore } from '@/store/pinia/dma/masters/useMasterStore'
import CrackYessClass from '@/core/classes/CrackYesClass'
import LargeCamera from '@/components/camera/OfflineLargeCamera.vue'
import DefectHistoryPanel from '@/views/dma/components/defects/offline/DefectHistoryPanel.vue'
import DefectHistoryVersion from '@/views/dma/components/defects/offline/DefectHistoryVersion.vue'
import PartsWarning from '@/views/dma/e-form-offline/sub-group/task-group/task/item/dialog/PartsWarning.vue';
import CompleteOrLaterDialog from "@/views/dma/e-form-offline/sub-group/task-group/task/item/dialog/CompleteOrLaterDialog.vue";
import Confirmation from '@/components/dialog/Confirmation.vue'
import MessageBox from '@/components/dialog/OfflineMessageBox.vue'
import { ElLoading } from 'element-plus'
import {
  formatNumberWithComma,
  reformatNumberWithComma
} from '@/core/helpers/number-format'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import {
  handleScrollToError,
  handleScrollToTopOfDialog,
  handleScrollToErrorModal,
  stringGroupExtractor
} from "@/core/helpers/ironforms/defects-form/defect-form"
import DefectDecline from "@/components/dialog/DefectDecline.vue"
import Textarea from "@/components/inputs/dma/Textarea.vue";
import { v4 as uuidv4 } from 'uuid';
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form-offline/defects/useDefectsFormStore";
import {
  useDefectsFormStore as onlineUseDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore";
import {
  formatOwnership,
  disabledHyperlink,
  onlyNumberResult,
  locationPreviousCrack,
  onlyIntegerInput,
  hasDefectDataChanged
} from '@/store/pinia/dma/e-form/helpers';
import ToastWithIcon from "@/components/dialog/ToastWithIcon.vue";
import SmallCamera from "@/components/dma/defect/offline-parts-component/SmallCamera.vue"
import UploadAttachment from "@/components/dma/defect/offline-parts-component/UploadAttachment.vue"
import { db } from "@/database/schema/DexieSchema";
import {
  last,
  cloneDeep,
  isUndefined,
} from 'lodash'
import { TextareaParam } from '@/core/types/misc/TextareaParam';
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import {
  ChangeDefectVersionParam
} from '@/views/dma/e-form-offline/types/ChangeDefectVersionParam';
import {
  safelyParseJSON
} from '@/store/pinia/dma/e-form-offline/defects/methods';
import {
  CompleteEmitParam
} from '@/views/dma/e-form-offline/types/CompleteEmitParam';
import {
  useDefectSheetStore
} from "@/store/pinia/dma/defect-approval/useDefectSheetStore";

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  crackData: {
    required: true,
    type: Object as PropType<CrackYessClass>
  },
  workOrder: {
    required: false,
    type: String,
  },
  headerId: {
    required: false,
    type: String
  },
  taskId: {
    required: false,
    type: String
  },
  status: {
    required: true,
    type: String
  },
  viewOnly: {
    required: false,
    type: Boolean,
    default: false
  },
  fitterId: {
    required: false,
    type: String,
    default: ""
  },
  plannerApprove: {
    required: false,
    type: Boolean,
    default: false
  },
  isForm: {
    required: false,
    type: Boolean,
    default: false
  },
  isComplete: {
    required: true,
    type: Boolean,
    default: false
  },
})

const emits = defineEmits(['closeForm', 'onRefreshData'])

const camstore = useOfflineCameraStore()
const formStore = useDefectsStore()
const positionStore = usePositionListStore()
const masterStore = useMasterStore()
const defectformStore = useDefectsFormStore();
const onlineDefectFormStore = onlineUseDefectsFormStore();
const cracksFormStore = useCracksFormStore();
const authStore = useAuthenticationStore()
const defectSheetStore = useDefectSheetStore();

/* refs */
const historyCollapse = ref('')
const referencePhotoCollapse = ref()
const collapsiblePriority = ref('Priority')
const collapsibleParts = ref('Parts')
const collapsibleLabour = ref('Labour')
const collapsibleResource = ref('Other Resource (optional)')
const collapsibleSymptom = ref('Symptom')
const collapsibleCauses = ref('Cause')
let savedFilesOnLocal = [] as string[]
const defectVersion = ref()
const completeStatus = ref(true)

const isDisabled = ref(true)
const successMessageBoxVisible = ref(false)
const errorMessageBoxVisible = ref(false)
const showPartsWarning = ref(false)
const errorMessage = ref("")
const messageBoxVisible = ref(false)
const confirmVisible = ref(false)
const dialogVisible = toRef(props, "visibility")
const data = toRef(props, "crackData")
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
const viewOnlyRef = ref(true)
const updateDataOnly = ref(false)
const showCancelButtonOnModify = ref(false)
const showConfirmExit = ref(false)
const showReviseConfirm = ref(false)
const customClass = ref(uuidv4())
const showCameraValidation = ref(false)

// ---------- format ----------
const plannedDurationInput = ref('')
// ---------- format ----------

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
const clonedCrackData = ref()
const selectedVersionDate = ref('')

const reviseCaption = computed(() => {
  const status = getDefectStatus() == 'Decline' ? 'Declined' : 'Approved'
  const role = timeline.value[0]?.role ?? ' '
  return `Are you sure want to modify this crack that has already ${status.toLowerCase()} by the ${role.charAt(0).toUpperCase() + role.slice(1)}`
})


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
  "crackLength"
];

const timeline = computed(() => {
  return formStore.SelectedDefectHeaderHistory
})

const versionDate = computed(() => {
  return formStore.VersionDate
})

const images = computed(() => {
  if (isUndefined(cracksFormStore.images)) {
    return []
  } else {
    return cracksFormStore.images.ImageInfos
  }
})

const isComplete = () => {
  return formStore.SelectedDefectDetailVersion?.detail?.isComplete ?? true
}

const partsWarningVisible = computed(() => {
  return props.crackData.DefectRequirement != 'Less than 30 minutes labour and less than $250 in parts' && data.value.Parts.length == 0
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

const editedForm = computed(() => {
  if (!isDisabled.value) {
    return hasDefectDataChanged(watchedFields, clonedCrackData.value, comparedData.value)
  }
  return false
})

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
  clonedPlannedDurationInput.value = props.crackData.PlannedDuration.value
}

const cloneDataToInitial = () => {
  formStore.setCrackData(props.headerId ?? "")
  if (props.plannerApprove) {
    if (formStore.HeaderStatus != 'Decline') {
      formStore.updateHeaderCrack(props.headerId)
    }
  }
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
}

const showDeclineReason = ref(false)

const toggleShowDeclineRease = (status) => {
  showDeclineReason.value = status
}

const serialNumber = computed(() => {
  return defectformStore.SerialNumber
})

const formatOwnershipHTML = computed(() => {
  const ownership = defectformStore.Ownership
  return formatOwnership(ownership)
})

const submitDecline = async (val) => {
  const loader = ElLoading.service({
    lock: true,
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (props.plannerApprove) {
    await formStore.updatePlannerCrackDecline(val)
  } else {
    await formStore.updateCrackDecline(val)
  }
  loader.close()
  toggleShowDeclineRease(false)
  autoCloseSuccessMessageBox();
}

const autoCloseSuccessMessageBox = () => {
  successMessageBoxVisible.value = true
  setTimeout(async () => {
    successMessageBoxVisible.value = false;
    await onOk();
  }, 1000);
}

const completeMessage = computed(() => {
  let message = "Crack Information Successfully Submitted"
  if (props.status == "Decline") {
    if (defectSheetStore.SelectedFitter.id) {
      message = "Crack Identified Successfully Modified"
      return message
    }
    message = "Crack Identified Successfully Submitted"
    return message
  }
  if (!updateDataOnly.value) {
    message = "Crack Approved"
    return message
  }
  return message
})

const preHandleModifyAndShowCancelButton = () => {
  const status = ['Acknowledge', 'Decline']
  if (status.includes(getDefectStatus() ?? '') || status.includes(props.status)) {
    showReviseConfirm.value = true
  } else {
    handleModifyAndShowCancelButton()
  }
}

const handleModifyAndShowCancelButton = () => {
  showReviseConfirm.value = false
  handleScrollToTopOfDialog(customClass.value)
  showCancelButtonOnModify.value = true
  cloneInitialData()
  setModify()
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
}

const handleCancelModify = () => {
  showCancelButtonOnModify.value = false
  showPartsWarning.value = false
  cloneDataToInitial()
  isDisabled.value = true
  clearEmptyResource()
}

// ---------- format (computed) ---------
const formatPlannedDuration = computed({
  get: () => {
    return plannedDurationInput.value
  },
  set: (val) => {
    plannedDurationInput.value = val
  }
})
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
  return "Crack Identified Description"
})
const instructionPlaceholder = computed(() => {
  return "Crack Repair Instructions / Actions"
})

const onlyNumber = ($event) => {
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
    $event.preventDefault();
  }
}

/* event handlers */
const onCrackLengthCurrentChange = (event, index: number) => {
  event.preventDefault()
  event.target.value = onlyNumberResult(event.target.value)
  data.value.setCurrentCrack(index, event.target.value)
  data.value.validateCurrentCrack(data.value.CrackLength[index])
}
const onDescriptionChange = (event) => {
  data.value.setDescription(event.value)
  data.value.validateDescription()
}
const onPlannedHoursChange = (event) => {
  event.preventDefault()
  event.target.value = onlyNumberResult(event.target.value)
  if (isNaN(Number(event.target.value))) {
    data.value.setPlannedDuration(event.target.value);
    data.value.validatePlannedDuration();
  }
  data.value.setPlannedDuration(event.target.value)
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
const onPartNumberChange = (event, index: number) => {
  event.preventDefault();
  data.value.setPartNumber(index, event.target.value);
}
const onPartQtyChange = (event, index: number) => {
  event.preventDefault()
  event.target.value = onlyNumberResult(event.target.value)
  if (isNaN(Number(event.target.value))) {
    data.value.setPartQty(index, event.target.value);
    data.value.validatePartQty(data.value.Parts[index]);
  }
  data.value.setPartQty(index, event.target.value)
  data.value.validatePartQty(data.value.Parts[index])
}
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
const onAddParts = () => {
  confirmVisible.value = false;
  showPartsWarning.value = true;
  handleScrollToErrorModal(customClass.value, 'parts-collapse')
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
  event.preventDefault()
  event.target.value = onlyNumberResult(event.target.value)
  if (isNaN(Number(event.target.value))) {
    data.value.setLabourQty(index, event.target.value);
    data.value.validateLaboursQty(data.value.Labours[index]);
    if (!data.value.Labours[index].position) {
      onLabourChange(index)
    }
    calculateTotalHours(index);
  }
  data.value.setLabourQty(index, event.target.value)
  data.value.validateLaboursQty(data.value.Labours[index])
  calculateTotalHours(index)
}
const onLabourHireEachChange = (event, index: number) => {
  event.preventDefault()
  event.target.value = onlyNumberResult(event.target.value)
  if (isNaN(Number(event.target.value))) {
    data.value.setLabourHireEach(index, event.target.value);
    data.value.validateLaboursHireEach(data.value.Labours[index]);
    if (!data.value.Labours[index].position) {
      onLabourChange(index)
    }
    calculateTotalHours(index);
  }
  data.value.setLabourHireEach(index, event.target.value)
  data.value.validateLaboursHireEach(data.value.Labours[index])
  calculateTotalHours(index)
}
const calculateTotalHours = (index: number) => {
  if (!data.value.Labours[index].qty || !data.value.Labours[index].hireEach) return
  data.value.Labours[index].totalHoursValidation.message = ""
  data.value.Labours[index].totalHoursValidation.isValid = true
  const qty = +data.value.Labours[index].qty
  const each = +data.value.Labours[index].hireEach
  let total = qty * each;
  if (!Number.isInteger(total)) {
    total = Number((Math.round(total * 100) / 100).toFixed(2))
  }
  data.value.setLabourTotalHours(index, total.toString())
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
  labours.value.splice(index, 1);
  data.value.removeLabours(index)
}
/* resources */
const onResourcesChange = (event, index: number) => {
  event.preventDefault()
  data.value.setResources(index, event.target.value)
  if (index == 0 && data.value.Resources[index].value == '') return
  data.value.validateResource(data.value.Resources[index])
}
const onAddNewResource = () => {
  /* validate first */
  const isValid = data.value.Resources.every((e) => {
    return e.value !== ""
  })
  if (!isValid) {
    data.value.validateResourcesAdd()
    return
  }
  data.value.addResource("")
}
const onRemoveResource = (index: number) => {
  data.value.removeResource(index)
  data.value.validateResourcesRemove()
}
/* causes */
const onCauseChange = (index: number) => {
  if (causes.value[index] === "Other") {
    causesDesc.value[index] = ""
    causesDescValid.value[index] = true
  }
  data.value.setCauses(index, causes.value[index])
  data.value.validateCause(data.value.Causes[index])
}
const onCauseDescChange = (param: TextareaParam) => {
  const index = param.index
  if (typeof index == 'undefined' || index < 0) return
  causesDescValid.value[index] = param.value != ""
  causesDesc.value[index] = param.value
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
}
const onRemoveCause = (index: number) => {
  causes.value.splice(index, 1)
  causesDesc.value.splice(index, 1)
  causesDescValid.value.splice(index, 1)
  data.value.removeCauses(index)
}
/* symptom */
const onSymptomChange = (index: number) => {
  if (symptoms.value[index] === "Other") {
    symptomDesc.value[index] = ""
    symptomDescValid.value[index] = true
  }
  data.value.setSymptom(index, symptoms.value[index])
  data.value.validateSymptom(data.value.Symptoms[index])
}
const onSymptomDescChange = (param: TextareaParam) => {
  const index = param.index
  if (typeof index == 'undefined' || index < 0) return
  symptomDescValid.value[index] = param.value != ""
  symptomDesc.value[index] = param.value
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
}
const onRemoveSymptom = (index: number) => {
  symptoms.value.splice(index, 1)
  symptomDesc.value.splice(index, 1)
  symptomDescValid.value.splice(index, 1)
  data.value.removeSymptom(index)
}
const setModify = () => {
  isDisabled.value = false
  if (data.value.Resources.length == 0) {
    data.value.addResource("")
  }
}

const setDataValue = async () => {
  data.value.setAssetNumber(formStore.SelectedDefectDetailVersion.detail.assetNumber);
  data.value.setPriority(formStore.SelectedDefectDetailVersion.detail.priority);
  data.value.setRaisedBy(formStore.SelectedDefectDetailVersion.detail.raisedBy);
  data.value.setDate(formStore.SelectedDefectDetailVersion.detail.date);
  data.value.setTitle(formStore.SelectedDefectDetailVersion.detail.title);
  data.value.setDescription(formStore.SelectedDefectDetailVersion.detail.description);
  data.value.importParts(...safelyParseJSON(formStore.SelectedDefectDetailVersion.detail.parts));
  data.value.importLabours(...safelyParseJSON(formStore.SelectedDefectDetailVersion.detail.labours));
  data.value.importResources(...safelyParseJSON(formStore.SelectedDefectDetailVersion.detail.resources));
  data.value.importSymptoms(...safelyParseJSON(formStore.SelectedDefectDetailVersion.detail.symptoms));
  data.value.importCauses(...safelyParseJSON(formStore.SelectedDefectDetailVersion.detail.causes));
  data.value.setPlannedDuration(formStore.SelectedDefectDetailVersion.detail.plannedDuration ?? '');
  data.value.setInstruction(formStore.SelectedDefectDetailVersion.detail.instruction as string);
  data.value.importPreviousCrack(...safelyParseJSON(formStore.SelectedDefectDetailVersion.detail.previousCracks));
  symptoms.value = []
  symptomDesc.value = []
  symptomDescValid.value = []
  data.value.Symptoms.forEach((x) => {
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
  data.value.Causes.forEach((x) => {
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
  formatPlannedDuration.value = formStore.SelectedDefectDetailVersion.detail.plannedDuration ?? '';
  priority.value = formStore.SelectedDefectDetailVersion.detail.priority;
  labours.value = data.value.Labours.map((x) => {
    return x.position
  })
  await formStore.setCrackImages(formStore.SelectedDefectDetailVersion.detail.images)
}

const onDefectVersionChange = (param: ChangeDefectVersionParam) => {
  const isFound = formStore.setDetailVersion(param.versionDate)
  if (isFound) {
    selectedVersionDate.value = param.versionDate
    getCompleteAndStatus()
    setDataValue()
  }
}

const clearEmptyResource = () => {
  if (data.value.Resources.length == 1) {
    if (data.value.Resources[0].value == "") {
      data.value.removeResource(0)
    }
  }
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
  for (const causeIndex in data.value.Causes) {
    if (Object.hasOwn(data.value.Causes, causeIndex)) {
      const element = data.value.Causes[causeIndex];
      if (!element.isValid) {
        return false
      }
    }
  }
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
const onSubmitDefects = async () => {
  data.value.validateDefectForm()
  if (isUndefined(cracksFormStore.images) || cracksFormStore.images.ImageInfos.length < 1) {
    showCameraValidation.value = true
  }
  if (data.value?.IsValid && validateSymptoms() && validateCauses() && !showCameraValidation.value) {
    confirmVisible.value = true
  } else {
    handleScrollToError()
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
const onSave = async (param: CompleteEmitParam) => {
  confirmVisible.value = false
  const loader = ElLoading.service({
    lock: true,
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  reAssignSymptoms()
  reAssignCauses()
  data.value.setIsComplete(param.isComplete)
  const fitter = props.fitterId == '' ? JSON.stringify(defectSheetStore.SelectedFitter) : props.fitterId
  const result = await formStore.updateCrackFitter(fitter)
  if (isError.value) {
    errorMessage.value = result
    loader.close()
    errorMessageBoxVisible.value = true
    return
  }
  if (resetDefect.value === true) {
    await formStore.getDefectsData(props.workOrder ?? "")
    formStore.setNewDefectKey()
  } else {
    formStore.setCrackNewData()
  }
  formStore.setDefectData(props.headerId ?? "")
  loader.close()
  autoCloseSuccessMessageBox();
}
const onCancel = () => {
  confirmVisible.value = false
}
const onOk = async () => {
  messageBoxVisible.value = false
  errorMessageBoxVisible.value = false
  onFormClosed()
  clearEmptyResource()
  emits('onRefreshData')
}
const handleRemoveButton = (index) => {
  if (isDisabled.value) {
    return 'hidden'
  } else {
    if (index == 0) {
      return 'hidden'
    }
  }
  return ''
}
const onFormClosed = () => {
  formStore.setDetailVersion('')
  showCancelButtonOnModify.value = false
  showCameraValidation.value = false
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
  showPartsWarning.value = false
  emits('closeForm')
}

const getCompleteAndStatus = (formOpened = false) => {
  defectStatus.value = getDefectStatus()
  completeStatus.value = formOpened ? props.crackData.IsComplete : isComplete()
}

// kalau di page eform ada kemungkinan bisa edit, selain itu gabisa
// harus lihat status, harusnya kalo kuning (cari kuning!!) bisa edit tapii
// kalau raised by dan fitter yang masuk sama, bisa edit (ril)
// cek wo biar make sure dia cuman bisa edit wo yang lagi di buka
const updateViewOnlyCondition = () => {
  if (window.location.href.includes("e-form")) {
    if (!props.viewOnly) {
      if (props.status == "Submited") {
        // in ticket BAA-10696 now other fitter can modify defect
        viewOnlyRef.value = false
        updateDataOnly.value = true
      } else {
        viewOnlyRef.value = true
      }
    } else {
      viewOnlyRef.value = true
    }
  }
}

const getDefectStatus = (() => {
  if (selectedVersionDate.value) {
    return timeline.value.find((x) => {
      return x.createdDate == selectedVersionDate.value
    })?.action
  }
  return props.status
})

const defectStatus = ref(getDefectStatus())

const onFormOpened = () => {
  getCompleteAndStatus(true)
  camstore.addLocalImageInfo({
    taskKey: props.taskId,
    workOrder: props.workOrder,
    type: 'defect',
    updatedBy: props.fitterId,
    email: authStore.user.Email,
  })
  referencePhotoCollapse.value = formStore.referencePhoto.title;
  camstore.setShowCloseButton(true)
  handleScrollToTopOfDialog(customClass.value)
  viewOnlyRef.value = props.viewOnly
  updateViewOnlyCondition()
  priority.value = props.crackData.Priority
  plannedDurationInput.value = props.crackData.PlannedDuration.value
  labours.value = props.crackData.Labours.map((x) => {
    return x.position
  })
  clearEmptyResource()
  symptoms.value = []
  symptomDesc.value = []
  symptomDescValid.value = []
  props.crackData.Symptoms.forEach((x) => {
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
  props.crackData.Causes.forEach((x) => {
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
  disabledHyperlink(defectDetailRef.value)
}

const handleBeforeClose = () => {
  formStore.resetDetailVersion()
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
  if (savedFilesOnLocal.length == 0) {
    return
  }
  const localFiles = db.pendingTaskFile.where("filename").anyOf(savedFilesOnLocal)
  if (localFiles) {
    localFiles.delete()
  }
}
watch(images, (newValue) => {
  if (newValue.length > 0) showCameraValidation.value = false
}, { deep: true })
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
.red {
  background-color: #ff4842;
}
.green {
  background-color: #54d62c;
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

.text-dark-red {
  font-weight: 700 !important;
  font-size: 12px !important;
  color: #ce3a38 !important;
  font-family: "Public sans";
}
.red-bg {
  background-color: #ffd9d8 !important;
  border-radius: 6px;
}
</style>
