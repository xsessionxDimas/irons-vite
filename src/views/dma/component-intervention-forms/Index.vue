<template>
  <nav class="navbar navbar-light bg-light">
    <div class="container-fluid">
      <div
        class="logo-wrapper d-flex align-items-center ms-1"
        @click="handleLogoClick"
      >
        <NwImg
          style="cursor: pointer"
          src="/media/logos/logo-whitebg.png"
          class="h-40px logo"
        />
      </div>
      <div class="d-flex">
        <div class="me-2">
          <online-status></online-status>
        </div>
      </div>
    </div>
  </nav>
  <!-- start of header -->
  <div
    class="row m-0 mt-25 p-5 bg-white e-form-container"
    v-loading="IsBusy"
    v-if="!isFormNotReadyDialog"
  >
  <div class="row w-100 pe-0 header-form">
  <!-- Title -->
  <div class="col-5">
    <h4 class="title">Intervention Form</h4>
  </div>

    <div :class="{'d-flex justify-content-between mt-1 mb-4': GeneralSubmitted, 'col-7 text-right': !GeneralSubmitted}">
      <template v-if="GeneralSubmitted">
        <FitterBadge :mechanicName="mechanicName" />
      </template>

      <!-- Form Name -->
      <template v-if="Intervention.sampleStatus">
        <h4 class="form-name" v-html="InterventionForm"></h4>
      </template>
      <template v-else>
        <h4 class="form-name">(Ver.)</h4>
      </template>
    </div>
</div>


    <!-- end of header -->
    <!-- start tabs  -->
    <GroupStepper
      :groups="Groups"
      :selected-group="Group"
      :general-submitted="GeneralSubmitted"
      :task-progress="TaskProgress"
      :count-identified-defect="countIdentifiedDefect"
      @group-change="handleGroupChange"
      @on-go-to-open-required-task="handleGoToRequiredTask"
    />
    <!-- end of tabs -->
    <TimerStartStop
      ref="timer"
      @onStart="onTimerStart"
      @onChange="onTimerChange"
      @onStop="onTimerStop"
      :visibility="!isSubmited && isSelectedFitter"
      :is-disabled="!GeneralSubmitted"
    />
    <template v-if="Group.group == 'General'">
      <CardPersonnel
        ref="cardPersonel"
        :intervention="Intervention"
        :personnel="Fitters"
        :general-submitted="GeneralSubmitted"
        :re-render="reRender"
        :fitter="FitterLog.employee"
        :validation="headerValidation"
        :formAgreement="formAgreement"
        :smuTolerance="smuTolerance"
        :hasOpenedDialog="showConfirmSMU || showTakePhotoSMU"
        @on-personnel-selected="handleFitterSelected"
        @on-s-m-u-changed="handleSMUChanged"
        :serial-number="serialNumber"
        @on-camera-clicked="handleCameraClick"
        @on-image-downloaded="handleImageDownloaded"
        @on-image-deleted="handleEquipmentImageDelete"
        @on-s-m-u-revise-icon-clicked="handleSMUReviseClicked"
      />
      <CardEquipmentInformation :intervention="Intervention" />
      <CardSafetyPrecautions :tasks="Intervention.safetyPrecaution" />
      <div class="p-2 flex-fill mt-6">
        <div class="form-check checkbox-success">
          <input
            class="form-check-input"
            :disabled="formAgreementDisabled"
            type="checkbox"
            v-model="formAgreement"
            id="agreement"
            @change="handleAgreementChange"
          />
          <label
            class="fw-bolder"
            style="color: black !important; font-size: 15px"
            for="agreement"
          >
            I have read and understood all safety precautions listed above
          </label>
        </div>
      </div>
      <CardRiskAssesment
        ref="preRiskComponent"
        :general-submitted="GeneralSubmitted"
        :intervention="Intervention"
        :fitter="FitterLog.employee"
        :fitter-photos="riskAssesment"
        :re-render="reRender"
        @on-camera-clicked="handleCameraClick"
        @on-image-downloaded="handleImageDownloaded"
        @on-image-deleted="handlePreRiskImageDelete"
      />
      <div
        class="p-2 py-5 d-flex justify-content-end mt-20 border-top border-top-2"
        v-if="!GeneralSubmitted"
      >
      <Timer :clock="clock" />
        <button
          class="btn btn-success"
          :disabled="submitDisabled"
          style="
            background: #18af4a;
            box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24);
            color: white;
          "
          @click="handleSubmitGeneral"
        >
          Enter
        </button>
      </div>
      <div v-else>
        <div class="p-2 py-5 d-flex justify-content-end mt-20 border-top border-top-2" v-if="!submitFormDisabled">
          <button
            type="button"
            :disabled="submitFormDisabled"
            class="btn btn-success"
            @click="handleNextOrSubmit"
            style="background-color: #18af4a"
          >
            SUBMIT
          </button>
        </div>
      </div>
    </template>
    <template v-else-if="Group.group == 'Identified Defects'">
      <DefectIdentified
        :data="defectIdentifiedData"
        :comments="defectIdentifiedCommentData"
        :general-submitted="GeneralSubmitted"
        @on-view-detail-information="handleViewDefectIdentified"
        @on-add-generic-defect="handleAddGenericDefect"
        :defect-detail="interventionDefectIdentifiedStore.DefectDetail"
      />
      <div
        class="row justify-content-end mt-3"
        v-if="Intervention.interventionExecution != 'Submited' && !submitFormDisabled"
      >
        <div class="col-3 col-sm-2 col-xl-1">
          <div class="row justify-content-end">
            <button
              type="button"
              :disabled="submitFormDisabled"
              class="btn btn-success"
              @click="handleNextOrSubmit"
              style="background-color: #18af4a"
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </template>
    <template
      v-else-if="
        Group.group != 'General' && Group.group != 'Identified Defects'
      ">
      <CardEquipmentInformation
        :intervention="Intervention"
        :default-accordion-open="false"
      />
      <TaskGroup
        v-for="section in Group.sections"
        :key="section.key"
        :re-render="reRender"
        :defect-images="DefectImages"
        :intervention="Intervention"
        :section="section"
        :current-fitter="FitterLog.employee"
        :validation="inputValidation"
        :loading-indicator="loadingIndicator"
        :item-trigger-disabled-value="itemTriggerDisabledValue"
        :currInputTyped="currInputTyped"
        :expand-all="expandAll"
        @on-task-changed="handleTaskUpdate"
        @on-n-a-created="handleNACreated"
        :is-read-only="isReadOnly"
        @on-defect-view="handleDefectsView"
        @on-init-loading-item="handleSetInitLoadingItem"
        @on-small-camera-clicked="cbmCameraClick"
        @on-image-deleted="cbmImageDeleted"
        @on-image-downloaded="handleImageDownloaded"
        :general-submitted="GeneralSubmitted"
      />
      <AdditionalInformation
        property-name="Provide additional information if required"
        :property-value="additionalInformation"
        @on-input-changed="handleChangeAdditionalInformation"
        :is-disabled="Intervention.interventionExecution == 'Submited'"
      />
      <div
        class="row justify-content-end"
        v-if="Intervention.interventionExecution != 'Submited'"
      >
        <div class="col-3 col-sm-2 col-xl-1">
          <div class="row justify-content-end">
            <button
              type="button"
              :disabled="submitFormDisabled"
              class="btn btn-success"
              @click="handleNextOrSubmit"
              style="background-color: #18af4a"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </template>
    <template v-if="showOnlineIndicator">
      <OnlineIndicator @onToggleIndicator="toggleShowOnlineIndicator" />
    </template>
  </div>
  <ProcessingTimePopUp
    :show="processingTimePopupVisibility"
    @close="handleCloseMessageBox"
  />
  <Confirmation
    :visibility="submitConfirmVisible"
    caption="Are you sure want to submit this form?"
    @on-no-confirm="
      () => {
        submitConfirmVisible = false;
      }
    "
    @on-yes-confirm="handleSubmitForm"
  />
  <Confirmation
    :visibility="confirmExitVisibility"
    caption="Is your work finished?"
    @on-no-confirm="onConfirmExitCancel"
    @on-yes-confirm="onExitConfirmSubmit"
  />
  <ConfirmationNonBold
    :visibility="confirmSubmitVisibility"
    :caption="preriskPhotoCaption"
    yes-label="Take a Photo"
    no-label="Cancel"
    @on-no-confirm="handleCancelPrerisk"
    @on-yes-confirm="handleSubmitPrerisk"
    yesButtonBackroundColor="#18AF4A"
  />
  <OfflineDialog
    :error="errorSubmit"
    :work-order="Intervention.sapWorkOrder"
    :visibility="offlineDialogVisible"
    @close="handleConfirmSubmit"
  />
  <DefectYesForm
    ref="defectYesFormRef"
    :asset-number="Intervention.equipment"
    :task="Task"
    :re-render="reRender"
    :defect-images="DefectImages"
    :visibility="showDefectYesForm"
    :current-fitter="FitterLog.employee"
    :positions="masterStore.Positions"
    :generated-i-d="generatedID"
    :ownership="ownership"
    :isNeed30Minutes="isNeed30Minutes"
    :serialNumber="serialNumber"
    :symptom-options="masterStore.Symptoms"
    :cause-options="masterStore.Causes"
    @on-submit="handleDefectYesSubmit"
    @on-cancel="handleDefectYesCancelled"
    @on-close="handleDefectYesClose"
    @on-camera-click="handleCameraClick"
    @on-image-deleted="handleImageDeleted"
    @on-image-part-deleted="handleImagePartDeleted"
    :generic="isGeneric"
    @on-attachment-clicked="handleAttachmentClicked"
    @on-set-flag-from-delete-action="setFromActionDelete"
  />
  <DefectNoForm
    :asset-number="Intervention.equipment"
    :re-render="reRender"
    :task="Task"
    :visibility="showDefectNoForm"
    :generated-i-d="generatedID"
    :ownership="ownership"
    :serialNumber="serialNumber"
    :current-fitter="FitterLog.employee"
    :defect-images="DefectImages"
    @on-submit="handleDefectNoSubmit"
    @on-cancel="handleDefectNoCancelled"
    @on-close="handleDefectNoClose"
    @on-camera-click="handleCameraClick"
    @on-image-deleted="handleImageDeleted"
    :generic="isGeneric"
    @on-set-flag-from-delete-action="setFromActionDelete"
  />
  <Camera
    :show-close-button="showCloseButtonCamera"
    :is-visible="cameraVisible"
    :is-preview="isPreview"
    :image-url="imageUrl"
    :camera-type="currentCameraType"
    :switch-camera="isSwitchingCamera"
    :image-description="descriptionValue"
    @on-camera-switch="handleCameraSwitch"
    @on-close-camera="handleCloseCameraClick"
    @on-snapshot-created="handleSnapshotCreated"
    @on-back-to-capture="handleBackToCapture"
    @on-snapshot-save="handleSnapshotSave"
    @on-file-dropped="handleFileUpload"
    @on-add-description="handleOpenDescriptionForm"
    @on-retry-camera="handleOpenCameraClick"
  />
  <PhotoDescription
    :is-visible="descriptionFormVisible"
    :description="descriptionValue"
    @on-close="handleCloseDescriptionForm"
    @on-save-desc="handleSaveDesc"
  />
  <DefectConfirmationDialog
    :show="showDefectConfirmForm"
    :check-list-arr="checkBoxList"
    @update-check-list="updateDefectCheckList"
    @submit="handleDefectConfirmed"
    @close="handleDefectCancelled"
  />
  <NAForm
    :task="Task"
    :conditions="masterStore.NAConditions"
    :visibility="showNAForm"
    @on-submit="handleNASubmit"
    @on-close="handleNAClose"
    @on-cancel="handleNACancelled"
  />
  <DefectYesView
    :re-render="reRender"
    :task="Task"
    :decline="decline"
    :visibility="showDefectYesView"
    :approved-by="approvedBy"
    :approved-date="approvedDate"
    :ownership="ownership"
    :serialNumber="serialNumber"
    :data="(defectData as IDefectYesDetail)"
    @on-image-downloaded="handleImageDownloaded"
    @on-close="handleDefectYesViewClose"
    :naReasonOptions="masterStore.NAConditions"
  />
  <DefectNoView
    :re-render="reRender"
    :task="Task"
    :generic="isGeneric"
    :visibility="showDefectNoView"
    :data="(defectData as IDefectNoDetail)"
    :ownership="ownership"
    :serialNumber="serialNumber"
    @on-image-downloaded="handleImageDownloaded"
    @on-close="handleDefectNoViewClose"
    :naReasonOptions="masterStore.NAConditions"
  />
  <NAView
    :visibility="showNAView"
    :status="defectStatus"
    :approved-by="approvedBy"
    :approved-date="approvedDate"
    :declineData="decline"
    :data="(defectData as NADetail)"
    @on-close="handleNAViewClose"
  />
  <CBMInfo
    :cbmData="(cbmData ?? {} as Defect)"
    :images="cbmImages"
    :visibility="showCBMView"
    :ratingFormula="ratingFormula"
    @on-close="handleCBMInfoViewClose"
    @on-downloaded="handleImageDownloaded"
  />
  <DefectYesEditForm
    ref="defectEditYesFormRef"
    :isNeed30Minutes="isNeed30Minutes"
    :visibility="showDefectYesEditView"
    :current-fitter="FitterLog.employee"
    :defectData="(defectEditData ?? {} as IDefectYesDetail)"
    :defect-images="DefectImages"
    :ownership="ownership"
    :serialNumber="serialNumber"
    :positions="masterStore.Positions"
    :symptom-options="masterStore.Symptoms"
    :cause-options="masterStore.Causes"
    :task="Task"
    :task-no="editTaskNo"
    :task-desc="editTaskDesc"
    :status="status"
    :decline-reason="declineReason"
    :generic="isGeneric"
    :decline-by="declineBy"
    :decline-date="declineDate"
    :approved-by="approvedBy"
    :approved-date="approvedDate"
    :general-submitted="GeneralSubmitted"
    @on-image-downloaded="handleImageDownloaded"
    @on-image-deleted="handleImageDeleted"
    @on-camera-click="handleCameraClick"
    @on-submit="handleUpdateDefectYes"
    @on-close="handleDefectYesEditViewClose"
    @on-reset-image="handleResetImage"
    @on-image-part-deleted="handleImagePartDeleted"
    @on-attachment-clicked="handleAttachmentClicked"
    @on-set-flag-from-delete-action="setFromActionDelete"
  />
  <ViewOnlyNAReasonDialog :is-intervention="true" />
  <UploadImageFailureDialog
    :show="errorUploadVisible"
    :imageList="errorImageList"
    @close="handleCloseFailedUploadDialog"
    :file-type="selectedType"
  />
  <PhotoDescription
    :description="descriptionValue"
    :is-visible="descriptionFormVisible"
    @on-close="handleCloseDescriptionForm"
    @on-save-desc="handleSaveDesc"
  />
  <MessageBox :show="messageBoxVisible" @close="handleMessageBoxClose" />
  <MessageBoxOnly :show="messageBoxOnlyVisible" />
  <MandatoryPhotoPopUp
    :visibility="mandatoryPhotoDialog"
    @on-ok="handleMandatoryPhoto"
  />
  <ErrorDialog
    :visibility="errorDownloadDialog"
    :caption="`Detail data of work order ${SelectedShortWO} is failed to be retrieved, please retry!`"
    @on-yes-confirm="handleRetry"
    @on-no-confirm="handleCancel"
  />
  <MessageBox
    :show="errorNotMappedDialog"
    :icon="'/media/svg/dma/alert.svg'"
    :message="'Rating for this task has not been mapped yet, please insert mapping on IronLake first'"
    @close="
      () => {
        errorNotMappedDialog = false;
      }
    "
  />
  <Confirmation
    :visibility="leavePageConfirm"
    caption="Are you sure want to leave this page?"
    @on-no-confirm="cancelExitForm"
    @on-yes-confirm="exitFomOnProgress"
  />
  <TakeMoreImageConfirmation
    :visibility="showTakeAnotherPicture"
    caption="The photo successfully taken, would you like to take another photo?"
    @on-no-confirm="
      () => {
        showTakeAnotherPicture = false;
      }
    "
    @on-yes-confirm="takeMoreImage"
  />
  <GeneralDialog
    modal-type="taskError"
    :show="taskErrorDialog"
    @close="handleReloadIntervention"
    :message="errorMessagetaskErrorDialog"
  />
  <GeneralDialog
    modal-type="alreadySubmitted"
    :show="isFormSubmittedDialog"
    @close="handleExitFormSubmitted"
  />
  <GeneralDialog
    modal-type="alreadyClose"
    :show="isFormCloseDialog"
    @close="handleExitFormSubmitted"
  />
  <GeneralDialog
    modal-type="notReady"
    :show="isFormNotReadyDialog"
    @close="handleExitFormNotReady"
  />
  <GeneralDialog modal-type="notMapped" :show="showSMUToleranceNotMapped" @close="closeSMUToleranceNotMappedModal"/>
  <Toast
    :visibility="isSuccessTakePhoto"
    caption="Pre-Task Risk Assessment Photo Sucessfully Taken"
  />
  <ToastWithIcon
    :show="cannotModifyDefect"
    :message="errorApprovedOrDeclined"
    icon="/media/svg/dma/alert.svg"
  />
  <GeneralDialog
    modal-type="alreadyFilled"
    :show="showSMUAlreadyFilled"
    @close="closeSMUAlreadyFilledModal"
  />
  <NAReasonDialog
    :na-detail="(defectData as NADetail)"
    :visibility="viewReasonDialog"
    @on-save="handleSaveReason"
    @on-close="handleCloseReason"
    @on-cancel="handleCancelReason"
    :isIntervention="true"
  />
  <Confirmation
    :visibility="confirmSubmitFromDefectVisibility"
    caption="Are you sure to change this data? Defect data that already recorded will be deleted."
    @on-no-confirm="onConfirmDefectCancel"
    @on-yes-confirm="onConfirmDefectSubmit"
  />
  <AttachmentUploader
    ref="attachmentUploader"
    @on-drop-attachment="handleDropAttachment"
  />
  <ErrorBox
    :visibility="isOutOfRangeValidationShow"
    :isCloseButtonShow="false"
    :caption="'Out Of Range'"
    @on-close="
      () => {
        isOutOfRangeValidationShow = false;
      }
    "
  />
  <ConfirmationNonBold :visibility="showConfirmSMU" :caption="confirmationSMUCaption" @on-no-confirm="onCancelSMU"
    @on-yes-confirm="onConfirmSMU" />
  <Confirmation :visibility="showTakePhotoSMU" caption="Please take photo of Machine SMU in the cabin dashboard"
    yes-label="Take a Photo" :hide-no="true" @on-yes-confirm="onConfirmTakePhotoSMU" />
  <ToastWithIcon :show="isSuccessTakePhotoSMU" message="Machine SMU photo has been taken" />
  <SMUDetailDialog
    v-model:show="showSMUDetailDialog"
    :detailDefect="detailSMUDialog"
    :ownership="ownership"
    :view-only="Intervention.isApprovedSmu"
    :isFitter="true"
    :cameras-image="imageObjectRevise"
    @updateDefectDetailSMU="handleReviseSMU"
    @retake-photo="handleRetakePhotoRevise"
    @reset-photo="resetCameraState"
    :isIntevention="true"
    />
    <SMUDetailDialog
    v-model:show="showSMUDetailDialogViewer"
    :detailDefect="detailSMUDialogViewer"
    :ownership="ownership"
    :approval-s-p-v-data="(approvalSMUDetail as ApproveSMU)"
    :view-only="true"
    :isFitter="true"
    :isIntevention="true"
    />
    <!-- :error-status="errorData"
    @reset-error-status="resetErrorStatus" -->
</template>

<script lang="ts" setup>
import {
  computed,
  ref,
  onMounted,
  onBeforeMount,
  watch
} from "vue";
import GeneralDialog from "@/views/dma/components/GeneralDialog.vue";
import OnlineStatus from "@/components/sensors/OnlineStatus.vue";
import Camera from "@/components/camera/Camera.vue";
import Toast from "@/components/dialog/Toast.vue";
import GroupStepper from "@/views/dma/component-intervention-forms/components/refactor/GroupStepper.vue";
import OnlineIndicator from '@/components/sensors/OnlineIndicator.vue'
import CardPersonnel from "@/views/dma/component-intervention-forms/components/refactor/CardPersonnel.vue";
import CardEquipmentInformation from "@/views/dma/component-intervention-forms/components/refactor/CardEquipmentInformation.vue";
import CardSafetyPrecautions from "@/views/dma/component-intervention-forms/components/refactor/CardSafetyPrecautions.vue";
import CardRiskAssesment from "@/views/dma/component-intervention-forms/components/refactor/CardRiskAssesment.vue";
import DefectIdentified from "@/views/dma/component-intervention-forms/components/refactor/defects/Index.vue";
import TaskGroup from "@/views/dma/component-intervention-forms/components/refactor/TaskGroup.vue";
import NAView from "@/views/dma/component-intervention-forms/components/refactor/defects/NAView.vue";
import CBMInfo from "@/views/dma/component-intervention-forms/components/refactor/defects/dialog/CBMInfo.vue";
import DefectYesEditForm from "@/views/dma/component-intervention-forms/components/refactor/defects/dialog/DefectEditForm.vue";
import DefectNoView from "@/views/dma/component-intervention-forms/components/refactor/defects/DefectNoView.vue";
import DefectYesView from "@/views/dma/component-intervention-forms/components/refactor/defects/DefectYesView.vue";
import SMUDetailDialog from '@/views/dma/components/defects/SMUDetailDialog.vue'
import Confirmation from "@/components/dialog/Confirmation.vue";
import ConfirmationNonBold from "@/components/dialog/ConfirmationNonBold.vue";
import TakeMoreImageConfirmation from "@/views/dma/component-intervention-forms/components/refactor/TakeMoreImageConfirmation.vue";
import OfflineDialog from "@/components/dialog/OfflineDialog.vue";
import ProcessingTimePopUp from "@/views/dma/components/exit-form/ProcessingTimePopUp.vue";
import NAForm from "@/views/dma/component-intervention-forms/components/refactor/defects/NAForm.vue";
import DefectConfirmationDialog from "@/views/dma/component-intervention-forms/components/refactor/defects/DefectConfirmationDialog.vue";
import DefectYesForm from "@/views/dma/component-intervention-forms/components/refactor/defects/DefectYesForm.vue";
import DefectNoForm from "@/views/dma/component-intervention-forms/components/refactor/defects/DefectNoForm.vue";
import MessageBox from "@/components/dialog/MessageBox.vue";
import AdditionalInformation from "@/views/dma/component-intervention-forms/components/refactor/AdditionalInformation.vue";
import UploadImageFailureDialog from "@/components/camera/UploadImageFailureDialog.vue";
import MandatoryPhotoPopUp from "@/components/dialog/MandatoryPhotoPopUp.vue";
import ErrorDialog from "@/components/alert/ErrorDialog.vue";
import ToastWithIcon from "@/components/dialog/ToastWithIcon.vue";
import ViewOnlyNAReasonDialog from "@/views/dma/components/defects/ViewOnlyNAReasonDialog.vue";
import NAReasonDialog from "@/views/dma/e-form/components/NAReasonDialog.vue";
import AttachmentUploader from "@/components/dma/defect/parts-component-intervention/AttachmentUploader.vue";
import Timer from "@/components/timer/SimpleTimer.vue";
import TimerStartStop from "@/components/timer/TimerStartStop.vue";
import {
  useComponentInterventionHeaderStore
} from "@/store/pinia/dma/component-intervention/refactor/useComponentInterventionHeaderStore";
import {
  useComponentInterventionDetailStore
} from "@/store/pinia/dma/component-intervention/refactor/useComponentInterventionDetailStore";
import {
  useInterventionNAStore
} from "@/store/pinia/dma/component-intervention/refactor/useInterventionNAStore";
import {
  useInterventionDefectStore
} from "@/store/pinia/dma/component-intervention/refactor/useInterventionDefectStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  useNewCameraStore
} from "@/store/pinia/application/refactor/useNewCameraStore";
import {
  useComponentInterventionDefectsIdentifiedStore
} from "@/store/pinia/dma/component-intervention/refactor/useComponentInterventionDefectsIdentifiedStore";
import { useRouter } from "vue-router";
import { useMasterStore } from "@/store/pinia/dma/masters/useMasterStore";
import {
  useAttachmentStore
} from "@/store/pinia/dma/e-form/attachments/useAttachmentStore";
import {
  InterventionGroup
} from "@/core/types/intervention/InterventionGroup";
import { HeaderValidation } from "@/core/types/intervention/HeaderValidation";
import { ElLoading } from "element-plus";
import { GeneralPayload } from "@/core/types/intervention/GeneralPayload";
import {
  AESTCurrentDateTime,
  AESTCurrentTimestamp,
  AESTShortCurrentDateTime,
  dayNightConverter,
} from "@/core/helpers/date-format";
import { TaskUpdateObject } from "@/core/types/intervention/TaskUpdateObject";
import { LogParamObject } from "@/core/types/intervention/LogParamObject";
import {
  StatusHistoryParam
} from "@/core/types/intervention/StatusHistoryParam";
import {
  SubmitFormPayload
} from "@/core/types/intervention/SubmitFormPayload";
import { ImagePayload } from "@/core/types/intervention/ImagePayload";
import { CameraParam } from "@/core/types/intervention/CameraParam";
import { NAFormData } from "@/core/types/intervention/NAFormData";
import { KeyValue } from "@/core/types/misc/KeyValue";
import { NADetail } from "@/core/types/intervention/NADetail";
import { DefectNoFormData } from "@/core/types/intervention/DefectNoFormData";
import { IDefectNoDetail } from "@/core/types/intervention/IDefectNoDetail";
import { IBasicDefect } from "@/core/types/intervention/IBasicDefect";
import {
  DefectYesFormData
} from "@/core/types/intervention/DefectYesFormData";
import { IDefectYesDetail } from "@/core/types/intervention/IDefectYesDetail";
import { reformatNumberWithComma } from "@/core/helpers/number-format";
import {
  cloneDeep,
  isEmpty,
  orderBy,
  find,
  findIndex,
  omit
} from "lodash";
import { CBMFormData } from "@/core/types/intervention/CBMFormData";
import { FileDeleteParam } from "@/core/types/intervention/FileDeleteParam";
import { db } from "@/database/schema/DexieSchema";
import {
  Intervention as Interventions
} from "@/core/types/intervention/Intervention";
import { WorkOrder } from "@/core/types/intervention/WorkOrder";
import { Defect } from "@/database/schema/Defect";
import {
  DefectDetailParam
} from "@/core/types/intervention/DefectDetailParam";
import { IDetailTask } from "@/core/types/intervention/IDetailTask";
import { ImageLoadParam } from "@/core/types/intervention/ImageLoadParam";
import DefectIdentifiedClass from "@/core/classes/DefectIdentifiedClass";
import {
  ServicePersonnel
} from "@/core/types/entities/dma/e-form/general/ServicePersonnel";
import {
  handleScrollToError
} from "@/core/helpers/ironforms/defects-form/defect-form";
import {
  PreRiskImagePayload
} from "@/core/types/intervention/PreRiskImagePayload";
import { Decline } from "@/core/types/intervention/Decline";
import {
  checkIsSMUOnRange,
  checkTaskEditSameFitter,
  statusBadge,
  statusBadgeColor,
} from "@/store/pinia/dma/e-form/helpers";
import { UpdateSMUParam } from "@/core/types/intervention/UpdateSMUParam";
import { Audit } from "@/core/types/intervention/Audit";
import PhotoDescription from "@/components/camera/PhotoDescription.vue";
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo";
import {
  stringToImageInfoConvert
} from "@/core/helpers/string-to-imageinfo-converter";
import { Comment } from "@/database/schema/Comment";
import {
  RiskAssesmentValue
} from "@/core/types/intervention/RiskAssesmentValue";
import { v4 as uuidv4 } from "uuid";
import ErrorBox from "@/components/alert/ErrorBox.vue";
import {
  ILoadingInstance
} from "element-plus/lib/el-loading/src/loading.type";
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import {
  convertToWebP
} from "@/store/pinia/dma/e-form/helpers";
import { DefectSMUFormData } from '@/core/types/intervention/DefectSMUFormData'
import { CameraId } from "@/store/enums/CameraIdEnum";
import {
  ImageObject as imageObjectSMU
} from "@/core/types/entities/dma/ImageObject";
import { MachineSMUEnum } from "@/store/enums/MachineSMUEnum";
import {
  DefectSMU,
  submitDetailParameter,
  ApproveSMU
} from "@/core/types/entities/dma/defects/DefectSMU";
import MessageBoxOnly from '@/components/dialog/OfflineMessageBoxOnly.vue'
import FitterBadge from '@/components/e-form/FitterBadge.vue';

/* online sensor */
const router = useRouter();

/* stores */
const interventionHeaderStore = useComponentInterventionHeaderStore();
const interventionDefectIdentifiedStore =
  useComponentInterventionDefectsIdentifiedStore();
const interventionDetailStore = useComponentInterventionDetailStore();
const interventionNAStore = useInterventionNAStore();
const interventionDefectStore = useInterventionDefectStore();
const masterStore = useMasterStore();
const authStore = useAuthenticationStore();
const cameraStore = useNewCameraStore();
const attachmentStore = useAttachmentStore();

/* refs */
const headerValidation = ref<HeaderValidation>({
  SMU: "",
});
const formAgreement = ref(false);
const smu = ref<string>("");
const serviceStart = ref<string>("");
const submitConfirmVisible = ref(false);
const offlineDialogVisible = ref(false);
const confirmSubmitVisibility = ref(false);
const processingTimePopupVisibility = ref(false);
const isPreview = ref(false);
const messageBoxVisible = ref(false);
const messageBoxOnlyVisible = ref(false);
const imageUrl = ref("");
const blobImage = ref<Blob>();
const errorUploadVisible = ref(false);
const errorImageList = ref<string[]>([]);
const key = ref("");
const errorSubmit = ref(false);
const mandatoryPhotoDialog = ref(false);
const cbmAdjustmentType = ref(false);
// SMU
const cardPersonel = ref()
const showConfirmSMU = ref<boolean>(false);
const showTakePhotoSMU = ref<boolean>(false);
const confirmationSMUCaption = ref<string>('');
const isSuccessTakePhotoSMU = ref<boolean>(false);
const showSMUToleranceNotMapped = ref<boolean>(false);
const pendingUpdateSMUParam = ref<UpdateSMUParam>({} as UpdateSMUParam)
const showSMUDetailDialog = ref<boolean>(false);
const cameraIDRevise = CameraId.SMU_REVISE;
const revisedImageParam = ref<ImagePayload>({} as ImagePayload)
const imageObjectRevise = ref<imageObjectSMU>({} as imageObjectSMU)
const showSMUDetailDialogViewer = ref<boolean>(false);
const detailSMUDialogViewer = ref<any>({});
const approvalSMUDetail = ref({});
/* defects */
const dataTaskObject = ref<TaskUpdateObject>();
const showNAView = ref(false);
const showDefectYesView = ref(false);
const showDefectNoView = ref(false);
const showCBMView = ref(false);
const showDefectYesEditView = ref(false);
const defectData = ref<NADetail | IDefectYesDetail | IDefectNoDetail>();
const cbmData = ref<Defect>();
const cbmImages = ref<ImageInfo[]>([]);
const defectEditData = ref<IDefectYesDetail>();
const ratingFormula = ref();
const showDefectConfirmForm = ref(false);
const showNAForm = ref(false);
const showDefectYesForm = ref(false);
const showDefectNoForm = ref(false);
const errorDownloadDialog = ref(false);
const errorNotMappedDialog = ref(false);
const checkBoxList = ref<string[]>([]);
const messageText = ref("");
const sapWorkOrder = ref("");
const editTaskNo = ref("");
const editTaskDesc = ref("");
const defectHeaderId = ref("");
const reRender = ref(false);
const showCloseButtonCamera = ref(true);
const showTakeAnotherPicture = ref(false);
const status = ref("");
const isSuccessTakePhoto = ref(false);
const cannotModifyDefect = ref(false);
const expandAll = ref(false);
const leavePageConfirm = ref(false);
const isFormNotReadyDialog = ref(false);
const showSMUAlreadyFilled = ref(false);
const viewReasonDialog = ref(false);
const declineReason = ref("");
const declineBy = ref<Audit>();
const declineDate = ref("");
const defectStatus = ref<string>("Not-Confirm");
const approvedBy = ref<Audit>();
const approvedDate = ref("");
const isSwitchingCamera = ref(false);
const decline = ref<Decline>();
const descriptionFormVisible = ref(false);
const descriptionValue = ref("");
const errorApprovedOrDeclined = ref("");
const ownership = ref("");
const serialNumber = ref("");
const tempData = ref<TaskUpdateObject>();
const tempParamUpdateTask = ref<any>();
const tempReason = ref("");
const preriskPhotoCaption = ref("");
const additionalInformation = ref("");
const completedPreRisk = ref(false);
const confirmSubmitFromDefectVisibility = ref(false);
const preRiskComponent = ref();
const isGeneric = ref(false);
const generatedID = ref("");
const fromActionDelete = ref(false);
const selectedType = ref("");
const attachmentUploader = ref();
let isNeed30Minutes = false;
const inputValidation = ref("");
const currInputTyped = ref("");
const isOutOfRangeValidationShow = ref(false);
const iLoading = ref<ILoadingInstance>();

const confirmExitVisibility = ref(false);
const clock = ref("00:00:00");
const timer = ref();
const isSelectedFitter = ref(false)

const onTimerStart = (value: string) => {
  clock.value = value;
};
const onTimerChange = (value: string) => {
  clock.value = value;
};

const onTimerStop = (value: string) => {
  clock.value = value;
  confirmExitVisibility.value = true;
};

const onConfirmExitCancel = () => {
  confirmExitVisibility.value = false;
};

const onExitConfirmSubmit = async () => {
  // hiding confirm dialog
  confirmExitVisibility.value = false;

  // update personnel end time
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    const params = {} as GeneralPayload;
    params.id = Intervention.value.id;
    params.key = Intervention.value.key;
    params.employee = {
      id: authStore.user.EmployeeId,
      name: authStore.user.Name,
    };
    params.status = "On Progress";
    // send to BE
    await interventionHeaderStore.UpdateServiceEndMechanic(params)
    processingTimePopupVisibility.value = true;
    // whiteBackground.value = true;
  } catch (error) {
    // encountered error
    // same fitter logged in on two device, 1 fitter will always logged in by 1 person anw
    console.log("error filtering service personnel on closing eform", error);
  }
  loading.close();
};

// ref component
const defectYesFormRef = ref();
const defectEditYesFormRef = ref();
const originalFilename = ref('');

const cameraVisible = computed(() => {
  return cameraStore.IsVisible;
});
const currentCameraType = computed(() => {
  return cameraStore.CurrentType;
});
const SelectedWO = computed(() => {
  return interventionHeaderStore.SelectedWorkOrder;
});
const SelectedShortWO = computed(() => {
  return interventionHeaderStore.SelectedShortWO;
});
const IsBusy = computed(() => {
  return interventionHeaderStore.IsBusy;
});
const Intervention = computed(() => {
  return interventionDetailStore.Intervention;
});
const FitterLog = computed(() => {
  return interventionHeaderStore.Log;
});

// ============ Fitter Badge =============
const mechanicName = computed(() => {
  const log = FitterLog.value;
  return log && log.employee ? log.employee.name : '';
});

const GeneralSubmitted = computed(() => {
  return interventionHeaderStore.GeneralSubmitted;
});
const Fitters = computed(() => {
  return orderBy(masterStore.Fitters, ["label"]);
});
const Groups = computed(() => {
  return interventionDetailStore.Groups;
});
const countIdentifiedDefect = computed(() => {
  const data = interventionDefectIdentifiedStore.defectIdentifiedData
  let total = 0
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      total += data[key].length
    }
  });
  return total
})
const Group = computed(() => {
  return interventionDetailStore.Group;
});
const Task = computed(() => {
  return interventionDetailStore.Task;
});
const TaskProgress = computed(() => {
  return interventionDetailStore.TaskProgress;
});
const submitFormDisabled = computed(() => {
  if (!GeneralSubmitted.value) return true
  if (
    TaskProgress.value.filter((group) => {
      return group.taskDone != group.taskTotal;
    }).length > 0
  ) {
    return true;
  }

  return !interventionDetailStore.IsFilledAllRequiredItem;
});
const InterventionForm = computed(() => {
  const status = statusBadge(
    Intervention.value.interventionExecution,
    interventionDetailStore.percentageTaskProgressAllTab,
  );
  const formName = `${Intervention.value?.equipment} <span class="${
    Intervention.value?.sampleStatus?.toLowerCase() == "caution"
      ? "yellow"
      : Intervention.value?.sampleStatus?.toLowerCase() == "normal" ? "green" : "red"
  }">${Intervention.value?.sampleStatus}</span>`;
  const badge = `<span class='status-badge p-1 ${statusBadgeColor(
    status,
  )}'>${status}</span>`;
  return `<span>${badge} ${formName}</span>`;
});
const submitDisabled = computed(() => {
  const smuValidation = headerValidation.value.SMU == "";
  const fitterSelected = !isEmpty(FitterLog.value.employee);
  const smuIsEmpty = smu.value != "";
  const formAggremeentNotClick = formAgreement.value;
  const fitterPhotos = fitterRiskAssesment.value.length > 1;
  const isDisabled =
    smuValidation &&
    fitterSelected &&
    smuIsEmpty &&
    formAggremeentNotClick &&
    fitterPhotos;
  return !isDisabled;
});
const DefectImages = computed(() => {
  if (!Task.value) {
    return [];
  }
  if (isGeneric.value) {
    if (defectHeaderId.value == "") {
      return interventionDefectStore.DefectImages[generatedID.value] || [];
    } else {
      return interventionDefectStore.DefectImages[defectHeaderId.value] || [];
    }
  }
  return interventionDefectStore.DefectImages[Task.value.key];
});
const formAgreementDisabled = computed(() => {
  if (headerValidation.value.SMU != "") {
    return true;
  }
  if (isEmpty(FitterLog.value)) {
    return true;
  }
  if (smu.value == "") {
    return true;
  }
  if (formAgreement.value) {
    return true;
  }
  if (
    preRiskComponent.value?.riskPhotos &&
    preRiskComponent.value?.riskPhotos.length == 2
  ) {
    return true;
  }
  return false;
});
const loadingIndicator = computed(() => {
  return interventionDetailStore.LoadingTask;
});
const riskAssesment = computed(() => {
  return interventionDetailStore.RiskAssessmentImages;
});
const fitterRiskAssesment = computed(() => {
  if (!FitterLog.value?.employee) return [] as RiskAssesmentValue[];
  const fitterImages = riskAssesment.value.filter((x) => {
    return x.updatedBy.id == FitterLog.value.employee.id;
  });
  return fitterImages;
});
const itemTriggerDisabledValue = computed(() => {
  return interventionDetailStore.ItemTriggerDisabledValue;
});
const defectIdentifiedData = computed(() => {
  return (
    (interventionDefectIdentifiedStore.defectIdentifiedData as DefectIdentifiedClass) ??
    new DefectIdentifiedClass()
  );
});

const defectIdentifiedCommentData = computed(() => {
  return interventionDefectIdentifiedStore.defectIdentifiedCommentData as Comment[];
});
const taskErrorDialog = computed(() => {
  return interventionDetailStore.taskErrorDialog;
});

const errorMessagetaskErrorDialog = computed(() => {
  return interventionDetailStore.errorMessageTaskErrorDialog;
});

const isFormSubmittedDialog = computed(() => {
  return interventionDetailStore.formSubmittedDialog;
});

const isFormCloseDialog = computed(() => {
  return interventionDetailStore.formCloseDialog;
});

const isSubmited = computed(() => {
  return Intervention.value.interventionExecution == "Submited";
});

const onlineValue = computed(() => {
  return !isOfflineOrSlowInternetConnection();
});

const isReadOnly = computed(() => {
  return isSubmited.value;
});

const smuTolerance = computed(() => {
  return interventionHeaderStore.smuTolerance
})

// SMU
const minRangeValue = computed(() => {
  const smuValidation = Intervention.value.smuDue
  const tolerance = smuTolerance.value
  return Number((Number(smuValidation) + Number(tolerance.min)))
});
const maxRangeValue = computed(() => {
  const smuValidation = Intervention.value.smuDue
  const tolerance = smuTolerance.value
  return Number((Number(smuValidation) + Number(tolerance.max)))
});
const minSMUValue = computed(() => {
  return minRangeValue.value - Number(Intervention.value.hmOffset);
})
const maxSMUValue = computed(() => {
  return maxRangeValue.value - Number(Intervention.value.hmOffset);
})
const isSMUOnRange = (value) => {
  return checkIsSMUOnRange({
    smu: value,
    hmOffset: Intervention.value.hmOffset || "0",
    range: {
      min: minRangeValue.value,
      max: maxRangeValue.value
    }
  })
}

const handleReviseSMU = async (params: submitDetailParameter) => {
  // param for update
  const newParams = {} as UpdateSMUParam;
  newParams.id = Intervention.value.id;
  newParams.status = Intervention.value.interventionExecution;
  newParams.key = Intervention.value.key;
  newParams.value = params.newDetail.machineSMU;
  newParams.employee = {
    id: authStore.user.EmployeeId,
    name: authStore.user.Name,
  };
  const isInRange = !params.newDetail.title.toLowerCase().includes("not")
  newParams.isInRange = isInRange

  // check gambar
  if (!isEmpty(revisedImageParam.value)) {
    await interventionHeaderStore.updateEquipmentImage(revisedImageParam.value);
  }
  pendingUpdateSMUParam.value = newParams
  await saveSMU()
  interventionDefectIdentifiedStore.setDefectIdentifiedData(Intervention.value.sapWorkOrder)
  params.callback()
}

const handleRetakePhotoRevise = () => {
  handleCameraClick({
    type: cameraIDRevise,
    key: 'value'
  })
}

/* methods and handler */
const updateDefectCheckList = (val) => {
  checkBoxList.value = val;
};
const handleOpenDescriptionForm = () => {
  descriptionFormVisible.value = true;
};
const handleCloseDescriptionForm = () => {
  descriptionFormVisible.value = false;
};
const handleSaveDesc = (desc: string) => {
  descriptionValue.value = desc;
  descriptionFormVisible.value = false;
};
const resetCameraState = () => {
  cameraStore.setCameraVisible(false);
  cameraStore.setShowCloseButton(true);
  cameraStore.setCurrentType("");
  isPreview.value = false;
  imageUrl.value = "";
  blobImage.value = undefined;
  key.value = "";
};
const takeMoreImage = () => {
  showTakeAnotherPicture.value = false;
  cameraStore.setCameraVisible(true);
};
const handleCameraClick = (param: CameraParam) => {
  if (param.type == "defect" && DefectImages.value.length == 0) {
    showCloseButtonCamera.value = false;
  } else if (param.type == "value") {
    showCloseButtonCamera.value = false;
  }
  cameraStore.setCameraVisible(true);
  cameraStore.setCurrentType(param.type);
  key.value = param.key;
};
const cbmCameraClick = (data: TaskUpdateObject) => {
  showCloseButtonCamera.value = true;
  interventionDetailStore.setSelectedTask(data.task);
  dataTaskObject.value = data;
  dataTaskObject.value.headerId = Intervention.value.id;
  dataTaskObject.value.id = Intervention.value.id;
  if (data.type == "cbmAdjustment") {
    key.value = data.itemKey;
    interventionDefectStore.initCBMImages(key.value, data.value);
  } else {
    key.value = Task.value.key;
    interventionDefectStore.initCBMImages(key.value, Task.value.images);
  }
  cameraStore.setCurrentType(data.type ? data.type : "cbm");
  cameraStore.setCameraVisible(true);
};
const cbmImageDeleted = async (data: FileDeleteParam) => {
  fromActionDelete.value = false;
  interventionDetailStore.setSelectedTask(data.task.task);
  dataTaskObject.value = data.task;
  dataTaskObject.value.headerId = Intervention.value.id;
  dataTaskObject.value.id = Intervention.value.id;
  if (data.task.task.images?.length == 1) {
    fromActionDelete.value = true;
    cbmCameraClick(data.task);
  } else {
    if (data.task.type == "cbmAdjustment" && Task.value.adjustment) {
      key.value = data.task.itemKey;
      interventionDefectStore.initCBMImages(
        key.value,
        Task.value.adjustment.pictures,
      );
    } else {
      key.value = Task.value.key;
      interventionDefectStore.initCBMImages(key.value, Task.value.images);
    }
    await interventionDefectStore.deleteCBMImage(key.value, data.filename);
    await interventionDefectStore.submitCBMImageData(dataTaskObject.value);
  }
};
const handleMandatoryPhoto = () => {
  key.value = Task.value.key;
  mandatoryPhotoDialog.value = false;
  if (cbmAdjustmentType.value && Task.value.adjustment) {
    interventionDefectStore.initCBMImages(
      Task.value.adjustment.key,
      Task.value.adjustment.pictures,
    );
    cameraStore.setCurrentType("cbmAdjustment");
    cbmAdjustmentType.value = false;
  } else {
    interventionDefectStore.initCBMImages(key.value, Task.value.images);
    cameraStore.setCurrentType("cbm");
  }
  showCloseButtonCamera.value = false;
  cameraStore.setCameraVisible(true);
};
const handleCameraSwitch = (value: boolean) => {
  isSwitchingCamera.value = value;
};

const handleOpenCameraClick = () => {
  cameraStore.setCameraVisible(false);
  setTimeout(() => {
    cameraStore.setCameraVisible(true);
  }, 100);
}

const handleCloseCameraClick = () => {
  cameraStore.setCameraVisible(false);
  showCloseButtonCamera.value = true;
  isSwitchingCamera.value = false;
  fromActionDelete.value = false;
  resetCameraState();
};
const handleCloseCamera = (reset: boolean, preRisk = false) => {
  cameraStore.setCameraVisible(false);
  isSwitchingCamera.value = false;
  showCloseButtonCamera.value = true;
  if (reset) resetCameraState();
  if (preRisk) {
    const allPhotos = riskAssesment.value.filter((r) => {
      return r.updatedBy.id == FitterLog.value.employee.id;
    });
    if (allPhotos.length > 1) {
      isSuccessTakePhoto.value = true;
      setTimeout(() => {
        preRiskComponent.value?.reRender();
        isSuccessTakePhoto.value = false;
      }, 1000);
    } else {
      preriskPhotoCaption.value =
        "Take <strong>back page</strong> photo of your completed pre-task risk assessment.";
      showCloseButtonCamera.value = false;
      confirmSubmitVisibility.value = true;
    }
  }
};
const handleSnapshotCreated = (blob: Blob) => {
  blobImage.value = blob;
  const url = URL.createObjectURL(blob);
  isPreview.value = true;
  imageUrl.value = url;
};
const handleFileUpload = async (acceptFiles) => {
  errorImageList.value = [];
  if (acceptFiles.length < 1) return;
  const loading = ElLoading.service({
    lock: true,
    text: "Uploading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  let isFilePassValidation = true;
  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
  if (
    !validImageTypes.includes(acceptFiles[0].type)
  ) {
    isFilePassValidation = false;
    errorImageList.value.push(acceptFiles[0].name);
  }
  if (!isFilePassValidation) {
    if (errorImageList.value.length > 0) {
      cameraStore.setCameraVisible(false);
      errorUploadVisible.value = true;
      loading.close();
    }
  } else {
    blobImage.value = acceptFiles[0];
    originalFilename.value = acceptFiles[0].name;
    const url = URL.createObjectURL(acceptFiles[0]);
    isPreview.value = true;
    imageUrl.value = url;
    loading.close();
  }
};

const handleSnapshotSave = async (
  description: string | null | undefined,
  drawImage: Blob,
) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Uploading Picture",
    background: "rgba(0, 0, 0, 0.7)",
  });
  let fileName = generateString(15);
  if (description) {
    descriptionValue.value = encodeURI(description);
  }
  const imageInfo = {
    filename: fileName,
    description: descriptionValue.value,
    originalFilename: originalFilename.value,
  };
  let finalImage = drawImage
  // convert to webp
  try {
    const convertedImage = await convertToWebP(finalImage);
    finalImage = new File([convertedImage.file], `${fileName}.webp`)
  } catch (error: any) {
    console.error(error.message);
  }
  await saveImage([imageInfo], [finalImage]);
  descriptionValue.value = "";
  const cbmTypes = ["cbm", "cbmAdjustment"];
  const isCBM = cbmTypes.includes(currentCameraType.value);
  if (isCBM) {
    isPreview.value = false;
    cameraStore.setCameraVisible(false);
    showCloseButtonCamera.value = true;
    showTakeAnotherPicture.value = true;
  } else {
    const isPrerisk = currentCameraType.value == "value";
    handleCloseCamera(true, isPrerisk);
  }
  loading.close();
  fromActionDelete.value = false;
};

const setFromActionDelete = (value) => {
  fromActionDelete.value = value;
}

const handleAttachmentClicked = (params) => {
  attachmentStore.setCurrentKey(params.key);
  attachmentStore.setMode(params.mode);
  selectedType.value = "PDF";
  attachmentUploader.value.handleAttachmentClicked();
};

const handleDropAttachment = async (acceptFiles) => {
  errorImageList.value = [];
  const loading = ElLoading.service({
    lock: true,
    text: "Uploading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  let isFilePassValidation = true;
  // check if all files is not more than 1mb
  const validFileTypes = ["application/pdf"];
  if (
    acceptFiles[0].size > 2097152 ||
    !validFileTypes.includes(acceptFiles[0].type)
  ) {
    isFilePassValidation = false;
    errorImageList.value.push(acceptFiles[0].name);
  }
  if (!isFilePassValidation) {
    if (errorImageList.value.length > 0) errorUploadVisible.value = true;
  } else {
    // upload to uploadAttactment
    const blob = new Blob([acceptFiles[0]], {
      type: "application/pdf",
    });
    let fileName = generateString(15);
    const payload = new FormData();
    payload.append("files", blob, encodeURI(`${fileName}.pdf`));
    payload.append("userAccount", authStore.user.Email);
    let promise;
    promise = await db.pendingTaskFile.add({
      module: "Intervention",
      key: Task.value.key,
      workorder: Intervention.value.sapWorkOrder,
      type: "defect",
      fileType: "pdf",
      createdBy: interventionHeaderStore.ActiveFitter.id,
      email: authStore.user.Email,
      filename: fileName,
      originalFilename: fileName,
      blob: blob,
      syncDate: AESTShortCurrentDateTime(),
      syncStatus: "Pending"
    });
    // if online
    if (!isOfflineOrSlowInternetConnection()) {
      promise = await attachmentStore.uploadAttachment(
        payload,
        authStore.user.Email,
      );
    }
    Promise.all([promise]).then((res) => {
      if ((typeof res[0] == "string" && !isOfflineOrSlowInternetConnection()) || isOfflineOrSlowInternetConnection()) {
        if (attachmentStore.mode == "edit") {
          defectEditYesFormRef.value.handlePartAttachment(
            attachmentStore.currentKey,
            {
              filename: acceptFiles[0].name,
              url: fileName,
            },
          );
        } else {
          defectYesFormRef.value.handlePartAttachment(
            attachmentStore.currentKey,
            {
              filename: acceptFiles[0].name,
              url: fileName,
            },
          );
        }
        selectedType.value = "";
      }
    });
  }
  loading.close();
};
const saveImage = async (filenames: ImageInfo[], blobs: Blob[]) => {
  const params = {} as ImagePayload;
  params.id = Intervention.value.id;
  if (isGeneric.value) {
    if (defectHeaderId.value != "") {
      params.key = defectHeaderId.value
    } else {
      params.key = key.value;
    }
  } else {
    params.key = key.value;
  }
  params.type = currentCameraType.value;
  params.employee = FitterLog.value.employee;
  params.files = filenames;
  params.blobs = blobs;
  params.submitDate = AESTCurrentDateTime();
  params.email = authStore.user.Email

  let cloneTask = {} as TaskUpdateObject;
  if (currentCameraType.value == "cbm") {
    cloneTask = cloneDeep(dataTaskObject.value as TaskUpdateObject);
    cloneTask.type = "images";
  } else if (currentCameraType.value == "cbmAdjustment") {
    cloneTask = cloneDeep(dataTaskObject.value as TaskUpdateObject);
    cloneTask.type = "images";
    cloneTask.taskCategory = "Adjustment";
    params.key = cloneTask.itemKey;
  }
  cloneTask.workOrder = Intervention.value.sapWorkOrder
  completedPreRisk.value = fitterRiskAssesment.value.length > 0;

  if (fromActionDelete.value) {
    switch (currentCameraType.value) {
      case "cbmAdjustment":
      case "cbm":
        // replace cbm image
        await interventionDefectStore.defineNewCBMImages(params);
        await interventionDefectStore.submitCBMImageData(cloneTask);
        break;
      case "defect":
        await interventionDefectStore.defineNewDefectImages(params);
        break;
      default:
        break;
    }
  } else {
    try {
      switch (currentCameraType.value) {
        case "imageEquipment":
          // make default
          cameraStore.setShowCloseButton(true)
          await interventionHeaderStore.updateEquipmentImage(params);
          isSuccessTakePhotoSMU.value = true
          setTimeout(() => {
            isSuccessTakePhotoSMU.value = false;
          }, 2000);
          if (!isEmpty(pendingUpdateSMUParam.value)) {
            await saveSMU()
          } else {
            await saveSMU(true)
          }
          break;
        case "value":
          await interventionHeaderStore.updateRiskAssesmentImage(
            params,
            completedPreRisk.value,
          );
          break;
        case "defect":
          await interventionDefectStore.addNewDefectImages(params);
          break;
        case "parts":
          // defect yes form
          params.taskKey = Task.value.key;
          await interventionDefectStore.addNewPartImages(params);
          await defectYesFormRef.value.handlePartImage(
            params.key,
            params.files,
          );
          selectedType.value = "";
          break;
        case "parts-edit":
          // defect edit form
          params.taskKey = Task.value.key;
          await interventionDefectStore.addNewPartImages(params);
          await defectEditYesFormRef.value.handlePartImage(
            params.key,
            params.files,
          );
          selectedType.value = "";
          break;
        case "cbmAdjustment":
        case "cbm":
          await interventionDefectStore.addNewCBMImages(params);
          await interventionDefectStore.submitCBMImageData(cloneTask);
          break;
        case cameraIDRevise:
          // revise SMU
          params.key = Intervention.value.key;
          params.type = "imageEquipment"
          revisedImageParam.value = {
            ...params
          }
          imageObjectRevise.value = {
            Id: cameraIDRevise,
            ImageBlobs: blobs,
            ImageInfos: filenames,
          }
          selectedType.value = "";
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }
};
const handleEquipmentImageDelete = async (filename: string) => {
  if (Intervention.value.imageEquipment && Intervention.value.imageEquipment.length == 1) {
    cardPersonel.value.onCameraClicked()
    cardPersonel.value.onCloseImagePreview()
  } else {
    const loading = ElLoading.service({
      lock: true,
      text: "Uploading Picture",
      background: "rgba(0, 0, 0, 0.7)",
    });
    await interventionDetailStore.deleteImageFromEquipmentImage(filename);
    loading.close();
  }
};
const handlePreRiskImageDelete = async (filename: string) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Deleting image",
    background: "rgba(0, 0, 0, 0.7)",
  });
  const params = {} as PreRiskImagePayload;
  params.id = Intervention.value.id;
  params.key = Intervention.value.riskAssesment[0].key;
  params.employee = FitterLog.value.employee;
  params.submitDate = AESTCurrentDateTime();
  params.filename = filename;
  await interventionHeaderStore.deleteRiskAssesmentImage(params);
  loading.close();
  showCloseButtonCamera.value = false;
  selectedType.value = "image";
  handleCameraClick({
    type: "value",
    key: Intervention.value.riskAssesment[0].key,
  });
};
const handleImageDeleted = async (filename: string) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Uploading Picture",
    background: "rgba(0, 0, 0, 0.7)",
  });
  if (isGeneric.value) {
    if (defectHeaderId.value != "") {
      await interventionDefectStore.deleteDefectImage(defectHeaderId.value, filename);
    } else {
      await interventionDefectStore.deleteDefectImage(generatedID.value, filename);
    }
  } else {
    await interventionDefectStore.deleteDefectImage(Task.value.key, filename);
  }
  loading.close();
};
const handleImagePartDeleted = async (filename: string) => {
  await interventionDefectStore.deletePartImage(filename);
};
const handleResetImage = (imageValue: string) => {
  if (imageValue) {
    if (isGeneric.value) {
      interventionDefectStore.setExistingDefectImages(
        defectHeaderId.value,
        JSON.parse(imageValue),
      );
    } else {
      interventionDefectStore.setExistingDefectImages(
        Task.value.key,
        JSON.parse(imageValue),
      );
    }
  }
};
const handleImageDownloaded = async (paramsImage: ImageLoadParam) => {
  if (paramsImage.index == 0) {
    reRender.value = false;
  }
  const image = paramsImage.image;
  const params = {} as ImagePayload;
  params.id = Intervention.value.id;
  if (image.type == "imageEquipment") {
    params.key = Intervention.value.key;
  } else if (image.type == "value") {
    params.key = Intervention.value.riskAssesment[0].key;
  } else {
    params.key = key.value;
  }
  params.type = image.type;
  params.employee = {
    id: authStore.user.EmployeeId,
    name: authStore.user.Name,
  };
  const convertedImages = stringToImageInfoConvert([image.filename]);
  params.files = convertedImages;
  params.blobs = [image.blob];
  params.submitDate = AESTCurrentDateTime();
  await interventionHeaderStore.storeImageLocal(params);
  if (paramsImage.index == paramsImage.length - 1) {
    reRender.value = true;
  }
};
const handleBackToCapture = () => {
  isPreview.value = false;
  imageUrl.value = "";
  descriptionValue.value = "";
};
const handleLogoClick = () => {
  leavePageConfirm.value = true;
};
const handleGoToRequiredTask = () => {
  const loading = ElLoading.service({
    lock: true,
    text: "Scrolling to unfilled task",
    background: "rgba(0, 0, 0, 0.7)",
  });
  expandAll.value = !expandAll.value;
  handleScrollToError("task-required", 500);
  loading.close();
};
const handleGroupChange = async (group: InterventionGroup) => {
  interventionDetailStore.setSelectedGroup(group);
  const pendingOfflineUpdateTask = await db.pendingTask.where({
    workorder: interventionDetailStore.Intervention.sapWorkOrder,
    module: "Intervention"
  }).toArray()
  if (group.group == "Identified Defects" && (isOfflineOrSlowInternetConnection() || pendingOfflineUpdateTask)) {
    await interventionDefectIdentifiedStore.getCommentFromServiceSheet(interventionDetailStore.Intervention.sapWorkOrder)
  }
};

const handleSMUChanged = async (value: string) => {
  showSMUAlreadyFilled.value = false;
  if (interventionHeaderStore.SMUToleranceNotMapped) {
    headerValidation.value.SMU = 'SMU tolerance not yet mapped'
    showSMUToleranceNotMapped.value = true
    return
  }
  let loading = null as ILoadingInstance | null

  const processDataSMU = async () => {
    // check category
    // const isInRange = isSMUOnRange(smu.value)
    // changed to true bcs intervention doesn't need range validation
    const isInRange = true
    // param for update
    const params = {} as UpdateSMUParam;
    params.id = Intervention.value.id;
    params.status = Intervention.value.interventionExecution;
    params.key = Intervention.value.key;
    params.value = smu.value;
    params.employee = {
      id: authStore.user.EmployeeId,
      name: authStore.user.Name,
    };
    params.isInRange = isInRange
    params.submitDate = AESTCurrentDateTime()

    if (isInRange) {
      // check length dari gambar baru take camera
      if (Intervention.value.imageEquipment.length > 0) {
        pendingUpdateSMUParam.value = params
        await saveSMU()
      } else {
        showTakePhotoSMU.value = true
        pendingUpdateSMUParam.value = params
      }
    } else {
      confirmationSMUCaption.value = `<b>Is this correct Machine SMU value?</b><br><span>Machine SMU should be in range <b>${minSMUValue.value} to ${maxSMUValue.value}</b></span>`;
      showConfirmSMU.value = true;
      pendingUpdateSMUParam.value = params
    }
  }

  if (!isOfflineOrSlowInternetConnection()) {
    loading = ElLoading.service({
      lock: true,
      text: "Check SMU Value",
      background: "rgba(0, 0, 0, 0.7)",
    });
    // checking value
    try {
      const val = await interventionHeaderStore.getExisitingSMU({
        id: interventionDetailStore.Intervention.id,
        key: interventionDetailStore.Intervention.key,
        propertyName: "interventionSMU",
      });
      if (val) {
        showSMUAlreadyFilled.value = true;
        value = val;
        loading.close();
        return
      }
    } catch (e) {
      // if error
    }

    const raw = reformatNumberWithComma(value);
    if (raw[raw.length - 1] == ".") {
      headerValidation.value.SMU = "Invalid format";
      loading.close();
      return;
    }
    // initial
    headerValidation.value.SMU = "";
    smu.value = reformatNumberWithComma(value);

    await processDataSMU()
    loading.close()
  } else {
    const raw = reformatNumberWithComma(value);
    if (raw[raw.length - 1] == ".") {
      headerValidation.value.SMU = "Invalid format";
      return;
    }
    headerValidation.value.SMU = "";
    smu.value = reformatNumberWithComma(value);

    await processDataSMU()
  }
};

const onConfirmTakePhotoSMU = () => {
  showTakePhotoSMU.value = false
  const param = {} as CameraParam;
  param.type = "imageEquipment";
  param.key = Intervention.value.key;
  cameraStore.setShowCloseButton(false);
  showCloseButtonCamera.value = false
  handleCameraClick(param)
}

const onCancelSMU = () => {
  showConfirmSMU.value = false;
  cardPersonel.value.resetInputSMU()
}

const saveSMU = async (onlyUpdatePhoto = false) => {
  if (onlyUpdatePhoto) {
    // check data defect
    const checkData = await interventionDefectStore.checkDataInterventionSMU()
    // if has defect data then create defect
    // else no need to add defect
    if (checkData) {
      const params = {} as DefectSMUFormData;
      params.id = Intervention.value.id;
      params.status = Intervention.value.interventionExecution;
      params.key = Intervention.value.key as string;
      params.value = Intervention.value.interventionSMU as string;
      params.employee = {
        id: authStore.user.EmployeeId,
        name: authStore.user.Name,
      };
      params.submitDate = AESTCurrentDateTime();
      params.detail = {
        // isInRange: isSMUOnRange(params.value),
        // changed to true bcs intervention doesn't need range validation
        isInRange: true,
        range: {
          minRange: minRangeValue.value,
          maxRange: maxRangeValue.value
        },
        serialNumber: serialNumber.value,
      }
      params.idGenerated = uuidv4()
      // lempar ke defect
      interventionDefectStore.createDefectSMU(params)
    }
  } else {
    const params = {} as DefectSMUFormData;
    params.id = Intervention.value.id;
    params.status = Intervention.value.interventionExecution;
    params.key = Intervention.value.key;
    params.value = pendingUpdateSMUParam.value.value;
    params.employee = {
      id: authStore.user.EmployeeId,
      name: authStore.user.Name,
    };
    params.submitDate = AESTCurrentDateTime();
    pendingUpdateSMUParam.value.submitDate = params.submitDate;
    await interventionHeaderStore.updateSMU(omit(pendingUpdateSMUParam.value, [
      'isInRange'
    ]) as UpdateSMUParam);
    params.detail = {
      isInRange: pendingUpdateSMUParam.value.isInRange,
      range: {
        minRange: minRangeValue.value,
        maxRange: maxRangeValue.value
      },
      serialNumber: serialNumber.value,
    }
    params.idGenerated = uuidv4()
    // lempar ke defect
    interventionDefectStore.createDefectSMU(params)
    pendingUpdateSMUParam.value = {} as UpdateSMUParam
  }
}

const onConfirmSMU = async () => {
  showConfirmSMU.value = false;
  // Only update if SMU photo already uploaded
  if (Intervention.value.imageEquipment.length > 0) {
    saveSMU()
    await interventionDetailStore.getCountIdentifiedDefect();
  } else {
    showTakePhotoSMU.value = true;
  }
}

const closeSMUAlreadyFilledModal = () => {
  showSMUAlreadyFilled.value = false;
};

const handleFitterSelected = (data: any) => {
  const existing = Intervention.value.log?.find((l) => {
    return l.employee.id == data.option.value;
  });
  const logObject = {} as LogParamObject;
  logObject.employee = {
    id: data.option.value,
    name: data.option.label,
  };
  const selectedShift = dayNightConverter("+10.00");
  logObject.shift = selectedShift;
  logObject.timeLoggedIn = AESTCurrentDateTime();
  logObject.riskPhotos = existing
    ? stringToImageInfoConvert(existing.riskPhotos)
    : ([] as ImageInfo[]);
  logObject.isIHaveReadChecked = existing?.isIHaveReadChecked as boolean;

  const servicePersonnel = {} as ServicePersonnel;

  servicePersonnel.key = generateString(10);
  servicePersonnel.mechanic = logObject.employee;
  servicePersonnel.shift = selectedShift;
  servicePersonnel.serviceStart = AESTCurrentDateTime();
  servicePersonnel.serviceEnd = "";
  interventionHeaderStore.setServicePersonnel(servicePersonnel);
  interventionHeaderStore.setLog(logObject);
  serviceStart.value = data.serviceStart;
  formAgreement.value = logObject.isIHaveReadChecked;
  isSelectedFitter.value = true
  timer.value.timer.reset();
  timer.value.startTimer();
};
const handleAgreementChange = () => {
  showCloseButtonCamera.value = false;
  const photos = riskAssesment.value.filter((x) => {
    return x.updatedBy.id == FitterLog.value.employee.id;
  });
  if (photos.length == 0) {
    preriskPhotoCaption.value =
      "Take <strong>front page</strong> photo of your completed pre-task risk assessment.";
  } else {
    preriskPhotoCaption.value =
      "Take <strong>back page</strong> photo of your completed pre-task risk assessment.";
    completedPreRisk.value = true;
  }
  confirmSubmitVisibility.value = true;
};
const handleSubmitGeneral = async () => {
  if (Intervention.value.interventionExecution != "Submited") {
    const loading = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    const params = {} as GeneralPayload;
    params.id = Intervention.value.id;
    params.key = Intervention.value.key;
    params.employee = {
      id: authStore.user.EmployeeId,
      name: authStore.user.Name,
    };
    params.submitDate = AESTCurrentDateTime();
    params.serviceStart = serviceStart.value;
    params.status = "On Progress";
    params.smu = smu.value;
    params.log = {} as LogParamObject;
    params.log.employee = FitterLog.value.employee;
    params.log.timeLoggedIn = serviceStart.value;
    params.log.isIHaveReadChecked = true;
    params.log.shift = "Day Shift";
    params.log.riskPhotos = [];
    params.history = {} as StatusHistoryParam;
    params.history.status = "On Progress";
    params.history.updatedBy = FitterLog.value.employee;
    params.history.updatedDate = params.submitDate;
    params.history.tsUpdatedDate = AESTCurrentTimestamp();
    try {
      await interventionHeaderStore.submitGeneral(params);
      interventionDetailStore.setSelectedGroup(Groups.value[1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      loading.close();
    }
    loading.close();
  } else {
    const loading = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    interventionHeaderStore.setInterventionGeneralSubmited(true);
    interventionDetailStore.setSelectedGroup(Groups.value[1]);
    window.scrollTo({ top: 0, behavior: "smooth" });
    loading.close();
  }
};
const submitInterventionForm = async () => {
  const params = {} as SubmitFormPayload;
  params.id = Intervention.value.id;
  params.employee = {
    id: authStore.user.EmployeeId,
    name: authStore.user.Name,
  };
  params.serviceEnd = AESTCurrentDateTime();
  params.status = "Submited";
  params.history = {} as StatusHistoryParam;
  params.history.status = "Submited";
  params.history.updatedBy = FitterLog.value.employee;
  params.history.updatedDate = params.serviceEnd;
  params.history.tsUpdatedDate = AESTCurrentTimestamp();
  params.additionalInformation = additionalInformation.value;
  try {
    await interventionHeaderStore.submitForm(params);
    errorSubmit.value = false;
  } catch (error) {
    errorSubmit.value = true;
  }
};
const handleNextOrSubmit = async () => {
  const status =
    (await interventionDetailStore.checIsReadySubmitInterventionData()) as boolean;
  if (status) {
    submitConfirmVisible.value = true;
  } else {
    interventionDetailStore.toogleFormSubmittedDialog(true);
  }
};

const onConfirmDefectCancel = () => {
  confirmSubmitFromDefectVisibility.value = false;
};
const onConfirmDefectSubmit = () => {
  confirmSubmitFromDefectVisibility.value = false;
  handleTaskUpdate(tempParamUpdateTask.value, true);
};

const handleTaskUpdate = async (
  params: { data: TaskUpdateObject; asyncfunction; helper },
  fromOtherDialog = false,
) => {
  inputValidation.value = "";
  const data = params.data;
  currInputTyped.value = data.itemKey;
  interventionDetailStore.setSelectedTask(data.task);
  data.model = Intervention.value.equipmentModel as string;
  dataTaskObject.value = data;
  isGeneric.value = false;
  // from other dialog = from add NA reason dialog
  // if not from another dialog, then there's no need to store a reason
  if (!fromOtherDialog) {
    tempReason.value = "";
  }
  if (Intervention.value.interventionExecution == "On Progress") {
    const category = ["NORMAL", "CBM"];
    const sameFitter = checkTaskEditSameFitter(
      params.data.task.updatedBy || "",
      FitterLog.value.employee as Audit,
    );
    if (category.includes(data.taskCategory) && data.type == "condition") {
      const oldValue = data.task.taskValue;
      if (oldValue != data.value) {
        if (oldValue == "4" && !fromOtherDialog && !sameFitter) {
          // 4 na
          const defect = (await interventionNAStore.getNADetail(
            data.task.key,
            Intervention.value.trInterventionHeaderId,
            Intervention.value.sapWorkOrder,
          )) as Defect;
          if (defect) {
            defectData.value = JSON.parse(defect.defectData) as NADetail;
          }
          tempData.value = data;
          tempParamUpdateTask.value = params;
          viewReasonDialog.value = true;
        } else if (oldValue == "3" && !fromOtherDialog) {
          tempParamUpdateTask.value = params;
          confirmSubmitFromDefectVisibility.value = true;
        } else {
          switch (data.value) {
            // 1&2 ok, 3 defect, 4 na
            case "1":
            case "2":
              await interventionDetailStore.updateTask(data);
              if (
                data.task.rating == "AUTOMATIC_REPLACEMENT" ||
                data.task.rating == "AUTOMATIC_REPLACEMENT_GAP"
              ) {
                const defaultValue =
                  await interventionDetailStore.getReplacementDefaultValueByTask(
                    data.task,
                  );
                handleSetDefValReplacement(defaultValue, data.task.key);
              }
              interventionDefectStore.deleteLocalDefect({
                interventionId: Intervention.value.id,
                taskId: data.task.key
              })
              break
            case '3':
              showDefectConfirmForm.value = true
              break
            case '4':
              showNAForm.value = true
              break
          }
        }
      }
    } else if (
      ["CBM", "CBM-NORMAL"].includes(data.taskCategory) &&
      data.type == "rating"
    ) {
      if (!iLoading.value) {
        iLoading.value = ElLoading.service({
          lock: true,
          text: "Updating...",
          background: "rgba(0, 0, 0, 0.7)",
        });
      }
      try {
        switch (data.value) {
          case "":
          case "A":
          case "B":
            await interventionDetailStore.updateTask(data);
            if (!interventionDetailStore.IsError) {
              await interventionDefectStore.updateLocalDefect(
                createDefectFormData(data),
              );
            }
            await interventionDetailStore.getCountIdentifiedDefect();
            if (
              data.task.images == "" &&
              data.task.rating != "AUTOMATIC" &&
              data.task.rating != "AUTOMATIC_REPLACEMENT" &&
              data.task.rating != "AUTOMATIC_REPLACEMENT_GAP"
            ) {
              mandatoryPhotoDialog.value = true;
            }
            break;
          case "C":
          case "X":
            await interventionDefectStore.submitDefectCBM(
              createDefectFormData(data),
            );
            try {
              await interventionDetailStore.getCountIdentifiedDefect();
              if (!isOfflineOrSlowInternetConnection()) {
                await interventionDetailStore.updateFormDataFromServer();
              }
              if (
                data.task.images == "" &&
                data.task.rating != "AUTOMATIC" &&
                data.task.rating != "AUTOMATIC_REPLACEMENT" &&
                data.task.rating != "AUTOMATIC_REPLACEMENT_GAP"
              ) {
                mandatoryPhotoDialog.value = true;
              }
            } catch (error) {
              console.log(error);
            }
            break;
          case "In spec":
          case "Out of spec":
            await interventionDetailStore.updateTask(data);
            await interventionDetailStore.getCountIdentifiedDefect();
        }
      } catch (error) {
        console.log(error);
      } finally {
        iLoading.value?.close();
        iLoading.value = undefined;
      }
    } else if (data.taskCategory == "CBM" && data.type == "inputUom") {
      iLoading.value = ElLoading.service({
        lock: true,
        text: "Updating...",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const paramRatingData = cloneDeep(data);
      const result = await interventionDefectStore.getCBMResult(data);
      if (!result.rating) {
        paramRatingData.value = "";
      }
      await interventionDetailStore.updateTask(paramRatingData);
      if (interventionDetailStore.IsError) {
        iLoading.value?.close();
        iLoading.value = undefined;
        params.helper();
      }
      params.asyncfunction();
      if (!result.rating) {
        iLoading.value?.close();
        iLoading.value = undefined;
        let isShowOutOfRangeValidation = true;
        if (data.task.rating == "AUTOMATIC_REPLACEMENT" || data.task.rating == "AUTOMATIC_REPLACEMENT_GAP") {
          if (data.task.items[7]?.value == "4") {
            isShowOutOfRangeValidation = false;
          }
        }
        if (!result.isError && isShowOutOfRangeValidation) {
          isOutOfRangeValidationShow.value = true;
        }
        // inputValidation.value = "Out of Range"
        setTimeout(() => {
          preRiskComponent.value?.reRender();
          isOutOfRangeValidationShow.value = false;
        }, 2000);
      }
      if (result.isError) {
        iLoading.value?.close();
        iLoading.value = undefined;
        errorNotMappedDialog.value = true;
        return;
      }
      await interventionDetailStore.updateLocalAutoCBM(result.task);
      iLoading.value?.close();
      iLoading.value = undefined;
    } else if (data.taskCategory == "CBM-NORMAL" && data.type == "inputUom") {
      iLoading.value = ElLoading.service({
        lock: true,
        text: "Updating...",
        background: "rgba(0, 0, 0, 0.7)",
      });
      await interventionDetailStore.updateTask(data);
      if (data.task.taskValue && ["C", "X"].includes(data.task.taskValue)) {
        const cloneData = cloneDeep(data);
        const ratingItem = find(data.task.items, { valueItemType: "rating" });
        if (ratingItem) {
          const uomInputIndex = findIndex(data.task.items, {
            'valueItemType': 'inputUom'
          })
          cloneData.cbmMeasurement = data.value;
          cloneData.uomValue = data.task.items[(uomInputIndex + 1)].value;
          cloneData.type = ratingItem.valueItemType as string;
          cloneData.itemKey = ratingItem.key;
          cloneData.value = ratingItem.value;
          const formData = createDefectFormData(cloneData);
          formData.task.itemKey = ratingItem.key;
          formData.task.type = ratingItem.valueItemType as string;
          formData.task.value = ratingItem.value;
          formData.task.uomValue = data.task.items[(uomInputIndex + 1)].value;
          await interventionDefectStore.submitDefectCBM(formData);
        }
      }
      iLoading.value?.close();
      iLoading.value = undefined;
    } else if (data.taskCategory == "Adjustment" && data.type == "inputUom") {
      if (data.value) {
        params.helper.setLoadingMeasurement(true);
        const paramRatingData = cloneDeep(data);
        const result = await interventionDefectStore.getCBMResult(data, true);
        if (!result.isError && !result.rating) {
          paramRatingData.isOutOfRange = true
          paramRatingData.value = ""
        }
        await interventionDetailStore.updateTask(paramRatingData);
        if (interventionDetailStore.IsError) {
          params.helper.setLoadingMeasurement(false);
          return;
        }
        params.helper.setLoadingMeasurement(false);
        params.asyncfunction();
        // check hasil cbmnya
        params.helper.setLoadingRating(true);
        if (!result.isError && !result.rating) {
          isOutOfRangeValidationShow.value = true;
          // inputValidation.value = "Out of Range"
          setTimeout(() => {
            isOutOfRangeValidationShow.value = false;
          }, 2000);
        }
        if (result.isError) {
          errorNotMappedDialog.value = true;
          return;
        }
        const dataClone = data;
        dataClone.value = result.rating;
        dataClone.type = "rating";
        cbmAdjustmentType.value = true;
        switch (result.rating) {
          case "":
          case "A":
          case "B":
          case "C":
          case "X":
            try {
              params.helper.setLoadingRating(true);
              await interventionDefectStore.submitDefectCBM(
                createDefectFormData(data),
              );
              params.helper.setLoadingRating(false);
              if (!isOfflineOrSlowInternetConnection()) {
                await interventionDetailStore.updateFormDataFromServer();
              }
            } catch (error) {
              params.helper.setLoadingRating(false);
              return;
            }
            break;
        }
      }
    } else if (data.taskCategory == "Adjustment" && data.type == "reset") {
      const dataClone = { ...data };
      Task.value.items.every((t) => {
        if (t.valueItemType == "rating") {
          dataClone.value = t.value;
          return false;
        }
        return true;
      });
      const updateData = createDefectFormData(dataClone);
      updateData.task.value = dataClone.value;
      switch (data.value) {
        case "A":
        case "B":
        case "C":
        case "X":
          await interventionDefectStore.resetDefectCBMAdjustment(updateData);
          await interventionDetailStore.updateTask(dataClone, false, true);
          break;
      }
      dataClone.type = "images";
      interventionDefectStore
        .resetCBMImages(dataClone.itemKey, Intervention.value.sapWorkOrder)
        .then(() => {
          interventionDefectStore.submitCBMImageData(dataClone);
        });
      params.asyncfunction();
    } else if (
      data.taskCategory == "Adjustment" &&
      data.type == "commentValue"
    ) {
      params.helper.setLoadingComment(true);
      await interventionDetailStore.updateTask(data);
      params.helper.setLoadingComment(false);
    } else {
      await interventionDetailStore.updateTask(data);
    }
    interventionDefectIdentifiedStore.setDefectIdentifiedData(Intervention.value.sapWorkOrder)
  } else {
    interventionDetailStore.toogleFormSubmittedDialog(true);
  }
};
const createDefectFormData = (data: TaskUpdateObject) => {
  const formData = {} as CBMFormData;
  formData.cbmMeasurement = data.cbmMeasurement;
  formData.uomValue = data.uomValue;
  formData.taskDesc = Task.value.description;
  formData.taskNo = Task.value.interventionSequence as string;
  formData.submitDate = AESTCurrentDateTime();
  formData.task = dataTaskObject.value as TaskUpdateObject;
  formData.task.headerId = Intervention.value.id;
  formData.task.id = Intervention.value.id;
  if (data.correctedMeasurement) formData.correctedMeasurement = data.correctedMeasurement;
  if (data.correctedValue) formData.correctedValue = data.correctedValue;
  if (data.correctedUom) formData.correctedUom = data.correctedUom;
  return formData;
};
const handleNACreated = async (data: NAFormData) => {
  await interventionNAStore.submitNA(data);
};
const handleSubmitForm = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "Submitting Intervention Form",
    background: "rgba(0, 0, 0, 0.7)",
  });
  submitConfirmVisible.value = false;
  await submitInterventionForm();
  await interventionDetailStore.getCountIdentifiedDefect();
  interventionHeaderStore.reset();
  loading.close();
  if (!isOfflineOrSlowInternetConnection()) {
    processingTimePopupVisibility.value = true;
  } else {
    offlineDialogVisible.value = true;
  }
};
const handleConfirmSubmit = async () => {
  if (errorSubmit.value) return;
  offlineDialogVisible.value = false;
  router.push({ name: "ironforms" });
};
const handleCloseMessageBox = () => {
  processingTimePopupVisibility.value = false;
  router.push({ name: "ironforms" });
};
const handleDefectConfirmed = () => {
  isNeed30Minutes = false;
  interventionDefectStore.initDefectImages(Task.value.key);
  if (checkBoxList.value.length < 1) {
    handleDefectNoSelected();
  } else {
    const need30MntsLabel =
      "Does the defect identified require > 30 minutes in labour to repair?";
    if (checkBoxList.value.includes(need30MntsLabel)) {
      isNeed30Minutes = true;
    }
    handleDefectYesSelected();
  }
  checkBoxList.value = [];
};
const handleDefectYesSelected = () => {
  showDefectConfirmForm.value = false;
  showDefectYesForm.value = true;
};
const handleDefectNoSelected = () => {
  showDefectConfirmForm.value = false;
  showDefectNoForm.value = true;
};
const handleDefectCancelled = () => {
  showDefectConfirmForm.value = false;
};
const handleDefectYesClose = async (defectSubmitted: boolean) => {
  if (!defectSubmitted) {
    await interventionDefectStore.resetDefectImages(
      Task.value.key,
      Intervention.value.sapWorkOrder,
    );
  }
  // resetting
  generatedID.value = ""
  showDefectYesForm.value = false;
};
const handleDefectYesCancelled = () => {
  handleDefectYesClose(false);
};
const handleDefectYesSubmit = async (data: DefectYesFormData) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Processing...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  if (isGeneric.value) {
    data.task = {
      taskKey: "",
      taskCategory: "NORMAL",
      itemKey: "",
      type: "YES",
      value: "",
      defectType: "Generic",
      timeStamp: AESTCurrentDateTime(),
      model: Intervention.value.equipmentModel,
      headerId: Intervention.value.id,
      id: Intervention.value.id,
      supervisor: {
        id: authStore.user.EmployeeId,
        name: authStore.user.Name,
      },
      employee: FitterLog.value.employee,
      task: {} as IDetailTask,
    } as TaskUpdateObject;
    data.submitDate = AESTCurrentDateTime();
    data.idGenerated = generatedID.value;
    const isError = await interventionDefectStore.submitDefectYes(data, true);
    if (!isError) {
      await interventionDetailStore.getCountIdentifiedDefect();
      handleDefectYesClose(true);
      messageText.value = "Defect Information Successfully Submitted";
      messageBoxVisible.value = true;
    }
    loading.close();
  } else {
    data.task = dataTaskObject.value as TaskUpdateObject;
    if (tempReason.value) {
      data.reason = tempReason.value;
    }
    tempReason.value = "";
    data.task.headerId = Intervention.value.id;
    data.task.id = Intervention.value.id;
    data.task.supervisor = {
      id: authStore.user.EmployeeId,
      name: authStore.user.Name,
    };
    data.submitDate = AESTCurrentDateTime();
    const isError = await interventionDefectStore.submitDefectYes(data, false);
    if (!isError) {
      await interventionDetailStore.getCountIdentifiedDefect();
      loading.close();
      handleDefectYesClose(true);
      messageText.value = "Defect Information Successfully Submitted";
      messageBoxVisible.value = true;
    }
    loading.close();
  }
  isGeneric.value = false;
};
const handleUpdateDefectYes = async (data: DefectYesFormData) => {
  data.task.headerId = Intervention.value.id;
  data.task.id = Intervention.value.id;
  data.task.supervisor = {
    id: authStore.user.EmployeeId,
    name: authStore.user.Name,
  };
  data.submitDate = AESTCurrentDateTime();
  if (isGeneric.value) {
    data.defectHeaderId = defectHeaderId.value;
  }
  try {
    await interventionDefectStore.updateDefectDetail(data, isGeneric.value);
    await interventionDefectIdentifiedStore.setDefectIdentifiedData(
      Intervention.value.sapWorkOrder,
    );
    showDefectYesEditView.value = false;
    messageText.value = "Defect Information Successfully Submitted";
    messageBoxVisible.value = true;
  } catch (error: any) {
    if (!isOfflineOrSlowInternetConnection()) {
      if (error) {
        cannotModifyDefect.value = true;
        errorApprovedOrDeclined.value = error.response.data.result
          .message as string;
        setTimeout(async () => {
          cannotModifyDefect.value = false;
          errorApprovedOrDeclined.value = "";
          showDefectYesEditView.value = false;
          interventionHeaderStore.setBusyState(true);
          await interventionDefectIdentifiedStore.getDefectsData(
            Intervention.value.id,
            Intervention.value.sapWorkOrder,
          );
          await interventionDefectIdentifiedStore.setDefectIdentifiedData(
            Intervention.value.sapWorkOrder,
          );
          interventionHeaderStore.setBusyState(false);
        }, 2000);
      }
    }
  }
};
const handleCloseFailedUploadDialog = () => {
  errorUploadVisible.value = false;
  if (selectedType.value == "PDF") {
    attachmentUploader.value.handleAttachmentClicked();
  } else {
    cameraStore.setCameraVisible(true);
  }
};
const handleDefectNoClose = async (defectSubmitted: boolean) => {
  if (!defectSubmitted) {
    await interventionDefectStore.resetDefectImages(
      Task.value.key,
      Intervention.value.sapWorkOrder,
    );
  }
  showDefectNoForm.value = false;
  tempReason.value = "";
};
const handleDefectNoCancelled = () => {
  handleDefectNoClose(false);
};
const handleDefectNoSubmit = async (data: DefectNoFormData) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Processing...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  if (tempReason.value) {
    data.reason = tempReason.value;
  }
  tempReason.value = "";
  if (isGeneric.value) {
    data.task = {
      taskKey: "",
      taskCategory: "NORMAL",
      itemKey: "",
      type: "NO",
      value: "",
      defectType: "Generic",
      timeStamp: "06/09/23 19:36:51 (AEST)",
      model: Intervention.value.equipmentModel,
      headerId: Intervention.value.id,
      id: Intervention.value.id,
      supervisor: {
        id: authStore.user.EmployeeId,
        name: authStore.user.Name,
      },
      employee: FitterLog.value.employee,
      task: {} as IDetailTask,
    } as TaskUpdateObject;
    data.submitDate = AESTCurrentDateTime();
    data.idGenerated = generatedID.value;
    const isError = await interventionDefectStore.submitDefectNo(data, true);
    if (!isError) {
      await interventionDetailStore.getCountIdentifiedDefect();
      handleDefectNoClose(true);
      messageText.value = "Defect Information Successfully Submitted";
      messageBoxVisible.value = true;
    }
    loading.close();
  } else {
    data.task = dataTaskObject.value as TaskUpdateObject;
    data.task.headerId = Intervention.value.id;
    data.task.id = Intervention.value.id;
    data.task.supervisor = {
      id: authStore.user.EmployeeId,
      name: authStore.user.Name,
    };
    data.submitDate = AESTCurrentDateTime();
    const isError = await interventionDefectStore.submitDefectNo(data, false);
    if (!isError) {
      await interventionDetailStore.getCountIdentifiedDefect();
      loading.close();
      handleDefectNoClose(true);
      messageText.value = "Defect Information Successfully Submitted";
      messageBoxVisible.value = true;
    }
    loading.close();
  }
  isGeneric.value = false;
};
const handleNAClose = () => {
  showNAForm.value = false;
};
const handleNACancelled = () => {
  handleNAClose();
};
const handleNASubmit = async (data: NAFormData) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Processing...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  data.task = dataTaskObject.value as TaskUpdateObject;
  data.task.headerId = Intervention.value.id;
  data.task.id = Intervention.value.id;
  data.task.supervisor = {
    id: authStore.user.EmployeeId,
    name: authStore.user.Name,
  };
  data.submitDate = AESTCurrentDateTime();
  const isError = await interventionNAStore.submitNA(data);
  if (!isError) {
    await interventionDetailStore.getCountIdentifiedDefect();
    loading.close();
    handleNAClose();
    messageText.value = "Data successfully submitted";
    messageBoxOnlyVisible.value = true;
    setTimeout(() => {
      handleMessageBoxOnlyClose()
    }, 2000);
    if (
      data.task.task.rating == "AUTOMATIC_REPLACEMENT" ||
      data.task.task.rating == "AUTOMATIC_REPLACEMENT_GAP"
    ) {
      handleSetDefValReplacement("", data.task.task.key);
    }
  }
  loading.close();
};
const handleSetDefValReplacement = (
  defaultValue: string,
  taskKey: string,
): void => {
  for (const group of Groups.value) {
    if (group.group == "Intervention Checks") {
      for (const section of group.sections) {
        for (const task of section.tasks) {
          if (task.key == taskKey) {
            for (const item of task.items) {
              if (item.categoryItemType == "paramRating") {
                item.value = defaultValue;
                break;
              }
            }
          }
        }
      }
    }
  }
};
const handleDefectsView = async ({
  param,
  task = {} as IDetailTask
}) => {
  switch (param.key) {
    case "na":
      handleNAView(param);
      break;
    case "defect":
      handleDefectView(param);
      if (task) {
        interventionDetailStore.setSelectedTask(task)
      }
      break;
  }
};
const handleDefectView = async (data: KeyValue) => {
  const baseDefect = (await interventionDefectStore.getDefectDetail(
    data.value,
    Intervention.value.trInterventionHeaderId,
    Intervention.value.sapWorkOrder,
    "taskKey",
  )) as IBasicDefect;
  const headerDefect = (await interventionDefectStore.getDefectHeader(
    data.value,
    Intervention.value.trInterventionHeaderId,
    Intervention.value.sapWorkOrder,
    "taskKey",
  )) as Defect;
  if (baseDefect.type == "NO") {
    defectData.value = baseDefect as IDefectNoDetail;
    showDefectNoView.value = true;
  } else {
    decline.value = {} as Decline;
    defectData.value = baseDefect as IDefectYesDetail;
    const record = await interventionDefectStore.getDefectDecline(data.value);
    decline.value.isDecline = record.isDecline;
    decline.value.declineReason = record.declineReason;
    decline.value.declineDate = record.declineDate;
    decline.value.declineBy = record.declineBy;
    approvedBy.value = headerDefect.approvedBy;
    approvedDate.value = headerDefect.approvedDate ?? "";
    showDefectYesView.value = true;
  }
};
const handleCancelPrerisk = () => {
  confirmSubmitVisibility.value = false;
  formAgreement.value = false;
  completedPreRisk.value = false;
};
const handleSubmitPrerisk = () => {
  confirmSubmitVisibility.value = false;
  cameraStore.setCameraVisible(true);
  cameraStore.setCurrentType("value");
  key.value = Intervention.value.riskAssesment[0].key;
};
const handleDefectYesViewClose = () => {
  showDefectYesView.value = false;
};
const handleDefectYesEditViewClose = () => {
  showDefectYesEditView.value = false;
};
const handleDefectNoViewClose = () => {
  showDefectNoView.value = false;
};
const handleNAView = async (data: KeyValue) => {
  const defect = (await interventionNAStore.getNADetail(
    data.value,
    Intervention.value.trInterventionHeaderId,
    Intervention.value.sapWorkOrder,
  )) as Defect;
  if (defect) {
    defectData.value = JSON.parse(defect.defectData) as NADetail;
    defectStatus.value = defect.cbmNAStatus;
    decline.value = {} as Decline;
    decline.value.declineReason = defect.declineReason || "";
    decline.value.declineDate = defect.declineDate || "";
    decline.value.declineBy = defect.declineBy || ({} as Audit);
    approvedBy.value = defect.approvedBy;
    approvedDate.value = defect.approvedDate || "";
    showNAView.value = true;
  }
};
const handleNAViewClose = () => {
  showNAView.value = false;
  decline.value = {} as Decline;
  approvedBy.value = {} as Audit;
  approvedDate.value = "";
};
const handleCBMInfoViewClose = () => {
  showCBMView.value = false;
};
const handleMessageBoxClose = async () => {
  messageBoxVisible.value = false;
  messageText.value = "";
  if (Group.value.group == "Identified Defects") {
    const loading = ElLoading.service({
      lock: true,
      text: "getting defects data",
      background: "rgba(0, 0, 0, 0.7)",
    });
    await interventionDefectIdentifiedStore.getDefectsData(
      Intervention.value.id,
      Intervention.value.sapWorkOrder,
    );
    loading.close()
  }
};
const handleMessageBoxOnlyClose = () => {
  messageBoxOnlyVisible.value = false;
  messageText.value = "";
};
const generateString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const handleChangeAdditionalInformation = (value) => {
  additionalInformation.value = value;
};
const handleSetInitLoadingItem = (key) => {
  interventionDetailStore.updateLoading(key);
};
const handleCancel = () => {
  errorDownloadDialog.value = false;
};
const handleRetry = async () => {
  errorDownloadDialog.value = false;
  interventionHeaderStore.setBusyState(true);
  try {
    await downloadJSONDetail();
  } catch {
    const wo = await interventionHeaderStore.getWorkOrderFromDB(
      SelectedWO.value,
    );
    if (wo != undefined) {
      sapWorkOrder.value = (wo as WorkOrder).sapWorkOrder as string;
    }
    errorDownloadDialog.value = true;
  }
  interventionHeaderStore.setBusyState(false);
};
const downloadJSONDetail = async () => {
  const intervention = (await interventionHeaderStore.getWorkOrderDetailById(
    SelectedWO.value,
  )) as unknown as Interventions;
  if (!intervention) {
    throw new ReferenceError("intervention not valid");
  }
  interventionDetailStore.initGroup(intervention);
  smu.value = intervention.interventionSMU ?? "";
  serviceStart.value = interventionDetailStore.Intervention.serviceStart ?? "";
  additionalInformation.value =
    interventionDetailStore.Intervention.additionalInformation ?? "";
};
const handleViewDefectIdentified = async (data: DefectDetailParam) => {
  isGeneric.value = false;
  switch (data.type) {
    case "machineSMU":
      handleDefectIdentifiedDefectDetailSMU(data);
      break;
    case "defect":
      handleDefectIdentifiedDefectDetail(data);
      break;
    case "defectGeneric":
      handleGenericDefectIdentifiedDefectDetail(data);
      break;
    case "na":
      handleDefectIdentifiedNADetail(data.taskId);
      break;
    case "cbm":
      handleDefectIdentifiedCBMDetail(data.taskId);
      break;
  }
};
const handleGenericDefectIdentifiedDefectDetail = (data: DefectDetailParam) => {
  editTaskNo.value = "";
  editTaskDesc.value = "";
  defectHeaderId.value = "";
  isGeneric.value = true;
  const defect = interventionDefectIdentifiedStore.getDefectGenericData(
    data.defectHeaderId as string,
  );
  if (defect) {
    defectHeaderId.value = defect.defectHeaderId as string;
    if (JSON.parse(defect.defectData).type == "YES") {
      const detail = JSON.parse(defect.defectData) as IDefectYesDetail;
      const task = {
        key: "",
        category: "NORMAL",
        updatedBy: defect.createdBy,
      } as unknown as IDetailTask;
      interventionDetailStore.setSelectedTask(task);
      defectEditData.value = detail as unknown as IDefectYesDetail;
      const images = defectEditData.value.images
        ? JSON.parse(defectEditData.value.images)
        : [];
      interventionDefectStore.setExistingDefectImages(
        defectHeaderId.value,
        images as string[] | ImageInfo[],
      );
      editTaskNo.value = data.taskNo;
      editTaskDesc.value = data.taskDesc;
      status.value = data.taskStatus ?? "";
      declineReason.value = data.taskDeclineReason ?? "";
      declineDate.value = data.taskDeclineDate ?? "";
      declineBy.value = data.taskDeclineBy ?? ({} as Audit);
      approvedDate.value = data.taskApprovedDate ?? "";
      approvedBy.value = data.taskApprovedBy ?? ({} as Audit);
      showDefectYesEditView.value = true;
    } else if (JSON.parse(defect.defectData).type == "NO") {
      const detail = JSON.parse(defect.defectData) as IDefectNoDetail;
      defectData.value = detail as unknown as IDefectNoDetail;
      showDefectNoView.value = true;
    }
  }
};
const handleAddGenericDefect = () => {
  editTaskNo.value = "";
  editTaskDesc.value = "";
  defectHeaderId.value = "";
  isGeneric.value = true;
  showDefectConfirmForm.value = true;
  generatedID.value = uuidv4();
};
const handleDefectIdentifiedDefectDetail = (data: DefectDetailParam) => {
  editTaskNo.value = "";
  editTaskDesc.value = "";
  const detail = interventionDefectIdentifiedStore.getDefectDetailData(
    data.taskId,
  );
  if (detail) {
    if (detail.type == "YES") {
      const task = interventionDetailStore.getTaskById(
        data.taskId,
      ) as unknown as IDetailTask;
      interventionDetailStore.setSelectedTask(task);
      defectEditData.value = detail as unknown as IDefectYesDetail;
      const images = defectEditData.value.images
        ? JSON.parse(defectEditData.value.images)
        : [];
      interventionDefectStore.setExistingDefectImages(
        data.taskId,
        images as string[] | ImageInfo[],
      );
      editTaskNo.value = data.taskNo;
      editTaskDesc.value = data.taskDesc;
      status.value = data.taskStatus ?? "";
      declineReason.value = data.taskDeclineReason ?? "";
      declineDate.value = data.taskDeclineDate ?? "";
      declineBy.value = data.taskDeclineBy ?? ({} as Audit);
      approvedDate.value = data.taskApprovedDate ?? "";
      approvedBy.value = data.taskApprovedBy ?? ({} as Audit);
      showDefectYesEditView.value = true;
    } else if (detail.type == "NO") {
      defectData.value = detail as unknown as IDefectNoDetail;
      showDefectNoView.value = true;
    }
  }
};
const handleDefectIdentifiedDefectDetailSMU = (data) => {
  showSMUDetailDialogViewer.value = true
  // get data dan assign to view
  detailSMUDialogViewer.value = data.smuDetail
  approvalSMUDetail.value = data.approvalSPVData
}
const handleDefectIdentifiedNADetail = (taskId: string) => {
  const defect = interventionDefectIdentifiedStore.getNADetailData(taskId);
  if (defect) {
    defectData.value = JSON.parse(defect.defectData) as NADetail;
    defectStatus.value = defect.cbmNAStatus;
    decline.value = {} as Decline;
    decline.value.declineReason = defect.declineReason || "";
    decline.value.declineDate = defect.declineDate || "";
    decline.value.declineBy = defect.declineBy || ({} as Audit);
    approvedBy.value = defect.approvedBy;
    approvedDate.value = defect.approvedDate || "";
    showNAView.value = true;
  }
};
const handleDefectIdentifiedCBMDetail = async (headerId) => {
  const tasks = Intervention.value.details[0].tasks;
  const cbmDataDetail =
    interventionDefectIdentifiedStore.getCBMDetailData(headerId);
  let task;
  let images: string[] = [];
  tasks.every((t) => {
    task = t.tasks.find((it) => {
      return it.key == headerId;
    });
    if (task) {
      return false;
    }
    return true;
  });
  if (task) {
    if (task.psType) {
      const mappings = await db.cbmMapping
        .where({
          model: Intervention.value.equipmentModel,
          psType: task.psType,
        })
        .first();
      const formulas = mappings?.detail.filter((k) => {
        return k.taskKey == task.key;
      });
      ratingFormula.value = orderBy(formulas, [
        "uom",
        "cbmRating",
        "minValue"
      ]);
    } else {
      ratingFormula.value = [];
    }
    if (task.adjustment?.pictures) {
      images = task.adjustment.pictures;
    } else {
      images = task.images;
    }
  }
  cbmData.value = cbmDataDetail as Defect;
  const header = interventionDefectIdentifiedStore.stateDefectHeader.find((header) => {
    return header.id == cbmData.value?.defectHeaderId
  })
  if (header) {
    if (header.appSPVBy) {
      cbmData.value.appSPVBy = header.appSPVBy
      cbmData.value.appSPVDate = header.appSPVDate
    }
    if (header.appPlannerBy) {
      cbmData.value.appPlannerBy = header.appPlannerBy
      cbmData.value.appPlannerDate = header.appPlannerDate
    }
  }
  cbmImages.value = stringToImageInfoConvert(images);
  showCBMView.value = true;
};
const cancelExitForm = () => {
  leavePageConfirm.value = false;
  const windowsUrl = window.location.href;
  if (!windowsUrl.includes("#!")) {
    window.location.href += "#!";
    router.currentRoute.value.hash = "#!";
  }
};
const exitFomOnProgress = () => {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  leavePageConfirm.value = false;
  /* need to confirm is it already submited */
  if (!Intervention.value.interventionSMU) {
    interventionDetailStore.discardGeneralChanges();
  }
  loading.close();
  router.push({ name: "ironforms" });
};
const confirmBeforeClose = () => {
  const routerValue = router.currentRoute.value;
  const windowsUrl = window.location.href;
  const routerHash = routerValue.hash;

  if (!windowsUrl.includes("#!")) window.location.href += "#!";
  if (!routerHash.includes("#!")) router.currentRoute.value.hash = "#!";
  const path = routerValue.path;

  // const leaving =
  window.onpopstate = (event) => {
    // cek if current route is eform route
    // check if there is # on path
    // check if there is state (back button on browser will always bring state)
    if (
      path == "/ironforms/component-intervention-forms" &&
      !router.currentRoute.value.hash.includes("#") &&
      event.state
    ) {
      leavePageConfirm.value = true;
    }
  };
};

const showOnlineIndicator = ref(false);
const toggleShowOnlineIndicator = (status) => {
  showOnlineIndicator.value = status;
  if (onlineValue.value && showOnlineIndicator.value) {
    setTimeout(() => {
      if (onlineValue.value) {
        showOnlineIndicator.value = false;
      }
    }, 3000);
  }
};

const setDefectAssetNumberData = (equipment) => {
  const ownerFind = masterStore.Ownership.find((owner) => {
    return owner.equipmentNumber == equipment;
  });
  ownership.value = ownerFind?.ownership ?? "";
  serialNumber.value = ownerFind?.serialNumber ?? "";
};

/* life cycles */
onMounted(async () => {
  interventionDetailStore.resetLoading();
  interventionDefectIdentifiedStore.reset();
  resetCameraState();
  confirmBeforeClose();
});
onBeforeMount(async () => {
  if (!SelectedWO.value) {
    isFormNotReadyDialog.value = true;
  } else {
    interventionDetailStore.resetIntervention();
    interventionHeaderStore.reset();
    interventionHeaderStore.setBusyState(true);
    await masterStore.getFitters();
    await interventionHeaderStore.getSMUTolerance();
    let intervention: Interventions;
    if (!onlineValue.value) {
      toggleShowOnlineIndicator(true);
    }
    if (!isOfflineOrSlowInternetConnection()) {
      try {
        await downloadJSONDetail();
        await interventionDetailStore.getCountIdentifiedDefect();
        await interventionDefectIdentifiedStore.getDefectsData(
          Intervention.value.id,
          Intervention.value.sapWorkOrder,
        );
        await interventionDetailStore.saveReplacementPreviousValue();
      } catch {
        const wo = await interventionHeaderStore.getWorkOrderFromDB(
          SelectedWO.value,
        );
        if (wo != undefined) {
          sapWorkOrder.value = (wo as WorkOrder).sapWorkOrder as string;
        }
        errorDownloadDialog.value = true;
      }
      interventionHeaderStore.setBusyState(false);
      interventionHeaderStore.syncWithIronPortalData()
      interventionHeaderStore.getLatestSyncDate()
    } else {
      intervention = (await db.interventionDetail
        .where("keyPbi")
        .equals(SelectedWO.value)
        .first()) as Interventions;
      interventionDetailStore.initGroup(intervention);
      smu.value = intervention.interventionSMU ?? "";
      serviceStart.value =
        interventionDetailStore.Intervention.serviceStart ?? "";
      additionalInformation.value =
        interventionDetailStore.Intervention.additionalInformation ?? "";
      interventionHeaderStore.setBusyState(false);
    }
    setDefectAssetNumberData(Intervention.value.equipment);
  }
});

const handleExitFormSubmitted = () => {
  interventionHeaderStore.reset();
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  setTimeout(() => {
    loading.close();
    processingTimePopupVisibility.value = true;
  }, 500);
};
const handleExitFormNotReady = () => {
  interventionHeaderStore.reset();
  isFormNotReadyDialog.value = false;
  router.push({ name: "ironforms" });
};

const handleReloadIntervention = async () => {
  interventionDetailStore.toogleTaskErrorDialog(false);
  handleDefectYesClose(false);
  handleDefectNoClose(false);
  handleNAClose();

  if (!isOfflineOrSlowInternetConnection()) {
    const loading = ElLoading.service({
      lock: true,
      text: "Reloading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    const intervention = (await interventionHeaderStore.getWorkOrderDetailById(
      SelectedWO.value,
    )) as unknown as Interventions;
    interventionDetailStore.initGroup(intervention, 1);
    loading.close();
  }
};

const handleSaveReason = async (reasonResult) => {
  const reasonString = reasonResult.selectedReason + ":" + reasonResult.desc;
  const cast = tempData.value as TaskUpdateObject;
  switch (cast.value) {
    case "1":
    case "2":
      cast.reason = reasonString;
      await interventionDetailStore.updateTask(cast);
      tempData.value = undefined;
      tempParamUpdateTask.value = undefined;
      reasonResult.afterSubmit();
      break;
    case "3":
      tempReason.value = reasonString;
      tempParamUpdateTask.value.data.task.reason = reasonString
      handleTaskUpdate(tempParamUpdateTask.value, true);
      tempParamUpdateTask.value = undefined;
      viewReasonDialog.value = false;
      break;
    default:
      break;
  }
};

const handleCloseReason = () => {
  defectData.value = undefined;
  viewReasonDialog.value = false;
};
const handleCancelReason = () => {
  handleCloseReason();
};
const closeSMUToleranceNotMappedModal = () => {
  showSMUToleranceNotMapped.value = false
}
const handleSMUReviseClicked = () => {
  showSMUDetailDialog.value = true
}
const detailSMUDialog = computed(() : DefectSMU => {
  return {
    title: MachineSMUEnum.MACHINESMUTITLE(),
    machineSMU: Intervention.value.interventionSMU as string,
    minRange: minRangeValue.value,
    maxRange: maxRangeValue.value,
    smuDue: Intervention.value.smuDue,
    assetNumber: Intervention.value.equipment,
    serialNumber: serialNumber.value,
    images: JSON.stringify(Intervention.value.imageEquipment),
    hmOffset: Intervention.value.hmOffset ?? "0" as string,
    key: "",
    type: "",
    reason: "",
  }
})
watch(
  () => {
    return Group.value.group;
  },
  async (newVal) => {
    if (newVal == "Identified Defects") {
      interventionHeaderStore.setBusyState(true);
      await interventionDefectIdentifiedStore.getDefectsData(
        Intervention.value.id,
        Intervention.value.sapWorkOrder,
      );
      await interventionDefectIdentifiedStore.setDefectIdentifiedData(
        Intervention.value.sapWorkOrder,
      );
      interventionHeaderStore.setBusyState(false);
    }
  },
);
watch(
  onlineValue,
  () => {
    toggleShowOnlineIndicator(true);
  },
  { deep: true },
);
</script>

<style lang="scss" scoped>
/* off canvas */
.form-check-input:checked {
  background-color: #18af4a;
  border-color: #18af4a;
}

.navbar {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.title {
  font-size: 20px !important;
  line-height: 30px;
}

.form-name {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: right;
}
</style>
<style lang="scss">
.header-form {
  .yellow {
    color: #cc9a06;
  }

  .red {
    color: #ff4842;
  }

  .green {
    color: #18af4a;
  }
}
</style>
