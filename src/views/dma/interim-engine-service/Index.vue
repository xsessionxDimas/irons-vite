<template>
  <nav class="navbar navbar-light bg-light">
    <div class="container-fluid">
      <div class="logo-wrapper d-flex align-items-center ms-1" @click="handlePreviewDashboardIronForms">
        <NwImg style="cursor:pointer" src="/media/logos/logo-whitebg.png" class="h-40px logo" />
      </div>
      <div class="d-flex">
        <div class="me-2">
          <online-status></online-status>
        </div>
      </div>
    </div>
  </nav>
  <template v-if="whiteBackground">
    <div class="h-100 w-100" style="background-color: white;"></div>
  </template>
  <template v-else>
    <div class="row m-0 mt-25 p-5 bg-white e-form-container interim-container">
      <Header :formName="`${generalFormForm} (Ver. ${versionComp})`" :form-status="generalForm && generalForm.status" :percentage-progress="progressPercentage" :mechanicName="fitterName" :isGeneralUpdated="generalUpdated"  />
      <GroupStepper :groups="groups" />
      <TimerStartStop ref="timer" @onStart="onTimerStart" @onChange="onTimerChange" @onStop="onTimerStop" :visibility="isAssigned" :is-disabled="submitTimerDisabled" />
      <template v-for="subGroup in selectedSubGroups" :key="subGroup.key">
        <SubGroup :subGroup="subGroup" />
        <SubmitButton @submit="handleSubmitAndExitEform"
          :disabled="store.selectedGroup!.doneTask != store.selectedGroup!.totalTask || isEmployeeNotSet" />
      </template>
      <template v-if="groups.find((x) => x.isSelected)?.groupName === 'General' && store.isSet">
       <CardEquipmentInformation
       ref="cardEquipment"
       :data="generalForm"
       :timer="timer"
       @on-personel-selected="onPersonelSelected"
       @update-timer="updateClock" />
       <CardSafetyPrecautions :data="generalForm.safetyPrecaution" />
       <div class="p-2 flex-fill mt-6">
          <div class="form-check checkbox-success">
            <input class="form-check-input" :disabled="formAgreementDisabled" type="checkbox" v-model="formAgreement" id="agreement" @change="handleCheckAgreement">
            <label class="fw-bolder" style="color: black !important; font-size: 15px;" for="agreement">
              I have read and understood all safety precautions listed above
            </label>
          </div>
       </div>
       <CardRiskAssessment ref="riskAssesmet" :ready="store.isSet" @on-front-page-taken="onFrontPhotoTaken" />
       <CardCheckBeforeTruck :data="generalForm.checkBeforeTruck" :isAggrementChecked="formAgreement" />
        <div class="p-2 py-5 d-flex justify-content-end mt-20 border-top border-top-2">
          <Timer :clock="clock" />
          <template v-if="store.generalForm.status == 'Submited'">
            <button class="btn btn-success" :disabled="disabledSubmitButton"  style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white" @click="onNextPage">Enter</button>
          </template>
          <template v-else>
            <template v-if="!isTaskAllDone || !isSuccessEnter">
              <button class="btn btn-success" :disabled="disabledSubmitButton"  style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white" @click="onConfirmSubmit">Enter</button>
            </template>
          </template>
          <template v-if="isSuccessEnter && isTaskAllDone">
            <button
              type="button"
              class="btn btn-success"
              :disabled="disabledSubmitButton"
              style="
                background: #18af4a;
                box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24);
                color: white;
              "
              @click="handleSubmitAndExitEform">
              Submit
            </button>
          </template>
        </div>
      </template>
    </div>
  </template>
  <ViewOnlyNAForm :visibility="viewNAVisibility" />
  <NAForm :visibility="naFormVisibility" />
  <ViewOnlyNAReasonDialog />
  <Cameras :visibility="camStore.isVisible" />
  <ConfirmationNonBold :visibility="confirmSubmitVisibility"
     :caption="preriskPhotoCaption"
     yes-label="Take a Photo"
     no-label="Cancel"
     @on-no-confirm="checkAgreement"
     @on-yes-confirm="onConfirmCancel"
     yesButtonBackroundColor="#18AF4A"
    />
  <Confirmation :visibility="confirmExitVisibility"
     caption="Is your work finished?"
     @on-no-confirm="onConfirmExitCancel"
     @on-yes-confirm="onExitConfirmSubmit" />
  <Confirmation :visibility="showSubmitConfirmation"
     caption="Are you sure want to submit this form?"
     @on-no-confirm="onCancelSubmit"
     @on-yes-confirm="onConfrimSubmit" />
  <ProcessingTimePopUp :show="processingTimePopupVisibility" @close="handleCloseProcessingTimeAndShowInputPIN" :time="clock" :isTimerStopped="isTimerStopped"/>
  <GeneralDialog modal-type="alreadySubmitted" :show="isFormSubmittedOnServiceSheetDetail" @close="handleExitFormSubmittedOnServiceSheet" />
  <GeneralDialog modal-type="alreadyClose" :show="isFormCloseOnServiceSheetDetail" @close="handleExitFormCloseOnServiceSheet" />
  <GeneralDialog modal-type="notReady" :show="isFormNotReadyDialog" @close="handleExitFormNotReady"/>
  <GeneralDialog modal-type="taskError" :show="taskErrorDialog" @close="handleExitTaskAlreadyUpdated" :message="errorMessagetaskErrorDialog"/>
  <GeneralDialog modal-type="alreadyUpdated" :show="taskAlreadyUpdatedDialog" @close="handleExitTaskAlreadyUpdated"/>
  <GeneralDialog modal-type="alreadyUpdated" :show="isTruckAlreadyCheckedByOtherFitter" @close="handleExitCheckboxAlreadyUpdated"/>
  <FormAlreadyOpenedByOtherSupervisor :show="isFormOpenedByOtherSupervisor" @close="handleExitFormOpenedByOtherSupervisor" />
  <el-dialog
    v-model="historyVisibility"
    :destroy-on-close="true"
    :fullscreen="true"
    @closed="handleCloseHistory">
    <FormHistory :title="'Historical e-Form'" />
  </el-dialog>
  <NotMapped :show="showNotMapped" @close="closeNotMappedModal"/>
  <el-dialog
    v-model="historyDefectVisibility"
    :destroy-on-close="true"
    :fullscreen="true"
    custom-class="dialog-header-noborder"
    @closed="handleCloseDefectHistory">
    <DefectHistory />
  </el-dialog>
  <Confirmation :visibility="isExitFormOnProgress"
     caption="Are you sure want to leave this page?"
     @on-no-confirm="cancelExitForm"
     @on-yes-confirm="exitFomOnProgress" />
  <InformationPopUp :show="showNoNetworkDialog" @close="closeNoNetworkDialog" :title-pop-up="'No internet connection'"/>
  <InformationPopUpSideButton
    :show="showSCConfirmationToSPV"
    @close="setShowSCConfirmationToSPV(false)"
    :title-pop-up="'Please confirm with supervisor if a suspension cylinder adjustment is required.'"
    confirmLabel="Continue"
  />
  <InformationPopUpSideButton
    :show="showSCAdjustmentWarning"
    @close="setShowSCAdjustmentWarning(false)"
    :title-pop-up="'Suspension has defect, please confirm to supervisor and reliability engineer.'"
    confirmLabel="Continue"
  />
  <InformationPopUpSideButton
    :show="showPreTaskNotComplete"
    @close="handleHidePreTaskNotComplete"
    :title-pop-up="'All Pre Service Operational check must be completed prior to continuing on to the next section.'"
    confirmLabel="Ok"
  />
  <InformationPopUpSideButton
    :show="showConfirmationToCalibrateSC"
    @close="setShowConfirmationToCalibrateSC(false)"
    :title-pop-up="'Please ensure you complete a payload calibration at the end of the service, before the unit returns to work.'"
    confirmLabel="Confirm"
  />
  <template v-if="suspensionCylinderFormStore.ShowSuspensionCylinderHeightForm">
    <SuspensionCylinderHeight
      :show="suspensionCylinderFormStore.ShowSuspensionCylinderHeightForm"
      @close="() => suspensionCylinderFormStore.toggleShowSuspensionCylinderHeightForm(false)"
      @onConfrimSubmit="onConfrimSubmit"
    />
  </template>
</template>

<script lang="ts" setup>
import {
  useInterimEngineStore
} from '@/store/pinia/dma/interim-engine-service/useInterimEngineStore'
import InformationPopUp from '@/components/dialog/InformationPopUp.vue'
import Cameras from "@/components/camera/Cameras.vue"
import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue'
import GroupStepper from './GroupStepper.vue'
import Header from '@/components/e-form/Header.vue'
import SubGroup from './sub-group/SubGroup.vue'
import CardEquipmentInformation from './components/CardEquipmentInformation.vue'
import CardSafetyPrecautions from '../components/form-preview/components/general/components/SafetyPrecautions.vue'
import CardCheckBeforeTruck from './components/CardCheckBeforeTruck.vue'
import CardRiskAssessment from './components/CardRiskAssessment.vue'
import Timer from '@/components/timer/SimpleTimer.vue'
import TimerStartStop from '@/components/timer/TimerStartStop.vue'
import Confirmation from '@/components/dialog/Confirmation.vue'
import ConfirmationNonBold from '@/components/dialog/ConfirmationNonBold.vue'
import {
  useInterimGeneralFormStore
} from '@/store/pinia/dma/interim-engine-service/useInterimGeneralFormStore'
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import ViewOnlyNAForm from '@/views/dma/components/defects/interim-engine-service/ViewOnlyNAForm.vue'
import ViewOnlyNAReasonDialog from "@/views/dma/components/defects/ViewOnlyNAReasonDialog.vue"
import NAForm from './defects/NAForm.vue'
import {
  useInterimNAFormStore
} from '@/store/pinia/dma/interim-engine-service/na/useInterimNAFormStore'
import { cloneDeep, isEmpty, isUndefined } from 'lodash'
import { destroyCache, saveCacheValue } from '@/core/services/CacheService'
import { ElLoading } from 'element-plus'
import {
  usePersonelLabourStore
} from '@/store/pinia/dma/personel-labour/usePersonelLabourStore'
import ProcessingTimePopUp from '@/views/dma/components/exit-form/ProcessingTimePopUp.vue'
import SubmitButton from './components/SubmitButton.vue'
import GeneralDialog from '@/views/dma/components/GeneralDialog.vue'
import { useRouter } from 'vue-router'
import 'bootstrap/dist/js/bootstrap.min.js'
import DefectHistory from '@/views/dma/e-form/components/defect-detail-preview/Index.vue'
import FormHistory from '../monitoring-status/components/form-preview/Index.vue'
import {
  usePositionListStore
} from '@/store/pinia/administration/organization-unit/position/usePositionListStore'
import NotMapped from './sub-group/task-group/task/item/dialog/NotMapped.vue'
import {
  useHistoricalStore
} from '@/store/pinia/dma/historical/useHistoricalStore';
import FormAlreadyOpenedByOtherSupervisor from './sub-group/task-group/task/item/dialog/FormAlreadyOpenedByOtherSupervisor.vue'
import OnlineStatus from '@/components/sensors/OnlineStatus.vue'
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'
import { useCameraStore } from '@/store/pinia/application/useCameraStore'
import SuspensionCylinderHeight from '@/views/dma/components/suspension-cylinder-height/form/Index.vue'
import {
  useInterimSuspensionCylinderFormStore
} from '@/store/pinia/dma/interim-engine-service/useInterimSuspensionCylinderFormStore'
import InformationPopUpSideButton from '@/components/dialog/InformationPopUpSideButton.vue'
import {
  GetSCTemplatePayload
} from '@/core/types/entities/dma/e-form/SuspensionCylinder'
import {
  useDefectSheetStore
} from '@/store/pinia/dma/defect-approval/useDefectSheetStore'
import { DisabledItem } from '@/core/types/entities/dma/disabledItem'
import { Task } from '@/core/types/entities/dma/e-form/Task'
import { ILoadingInstance } from 'element-plus/lib/el-loading/src/loading.type'
import {
  useDefectsFormStore
} from '@/store/pinia/dma/e-form/defects/useDefectsFormStore'
import {
  handleScrollToError
} from "@/core/helpers/ironforms/defects-form/defect-form"
import { reformatNumberWithComma } from '@/core/helpers/number-format';

/* store */
const generalFormStore = useInterimGeneralFormStore();
const authStore = useAuthenticationStore();
const store = useInterimEngineStore();
const naStore = useInterimNAFormStore();
const personelStore = usePersonelLabourStore();
const listStore = usePositionListStore();
const historyStore = useHistoricalStore();
const globalConnectionStore = useGlobalConnectionStore()
const suspensionCylinderFormStore = useInterimSuspensionCylinderFormStore()

// =============== Fitter Badge ===============
const fitterName = computed(() => {
  return fitter.value ? fitter.value.name : '';
});

// =============== General Updated ===============
const generalUpdated = computed(() => {
  return generalFormStore.generalUpdated;
});

// ==================== suspension cylinder height start ====================
const showSCConfirmationToSPV = computed(() => {
  return store.stateShowSCConfirmToSPC
})
const showConfirmationToCalibrateSC = computed(() => {
  return store.stateShowConfirmToCalibrateSC
})
const showSCAdjustmentWarning = computed(() => {
  return store.stateShowSCAdjustmentWarning
})

const showPreTaskNotComplete = computed(() => {
  return store.stateShowPreTaskNotComplete
})

const taskErrorDialog = computed(() => {
  return store.taskErrorDialog
})

const errorMessagetaskErrorDialog = computed(() => {
  return store.errorMessageTaskErrorDialog
})

const setShowSCConfirmationToSPV = (status) => {
  store.toggleShowSCConfirmToSPV(status)
}

const handleHidePreTaskNotComplete = () => {
  store.toggleShowPreTaskNotComplete(false)
  store.handleScrollToUnfilledTask()
}

const setShowSCAdjustmentWarning = (status) => {
  store.toggleShowSCdjustmentWarning(status)
}

const setShowConfirmationToCalibrateSC = (status) => {
  store.toggleShowConfirmToCalibrateSC(status)
}

const handleShowSCCalibrationFormDialog = async () => {
  const paylaod = {
    modelId: store.stateGeneralForm.modelId,
    psTypeId: store.stateGeneralForm.psTypeId,
    unitNumber: store.stateGeneralForm.equipment,
    workOrder: store.stateGeneralForm.workOrder,
    employee: {
      id: authStore.stateUser.EmployeeId,
      name: authStore.stateUser.Name
    }
  } as GetSCTemplatePayload
  await suspensionCylinderFormStore.getSuspensionCalibrationTemplate(paylaod)
  suspensionCylinderFormStore.generateValidateInput()
  suspensionCylinderFormStore.generatePreAnsweredInput()
  if (suspensionCylinderFormStore.stateSCHeader.status != "Submitted") {
    suspensionCylinderFormStore.toggleShowSuspensionCylinderHeightForm(true)
  } else {
    showSubmitConfirmation.value = true
  }
}
// ==================== suspension cylinder height end   ====================

const showNoNetworkDialog = computed(() => {
  return globalConnectionStore.stateSubmitConnectionError
})

const closeNoNetworkDialog = () => {
  globalConnectionStore.setSubmitConnectionError(false)
}

const isFormOpenedByOtherSupervisor = computed(() => {
  return store.stateIsFormSelectedByOtherSupervisor
})

const handleExitFormOpenedByOtherSupervisor = () => {
  store.changeIsFormSelectedByOtherSupervisor(false)
  whiteBackground.value = true
  router.push({ name: "ironforms" })
}

const onNextPage = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading the page',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  generalFormStore.updateGeneralUpdated(true)
  // mendapatkan group yang aktif
  const nextActiveGroup = store.groups.find((group) => {
    if (isUndefined(group.isDisable) || group.isDisable == "false") {
      if (group.groupName != "General") {
        return true
      }
    }
  })
  store.setSelectedGroup(nextActiveGroup!.id)
  await store.updateGroupByParam(nextActiveGroup!.groupName)
  window.scrollTo({ top: 0, behavior: 'smooth' })
  loading.close()
}

const versionComp = computed(() => {
  let version = ''
  if (!isUndefined(store.generalForm) && !isUndefined(store.generalForm.version)) version = store.generalForm.version
  return version
})
const naFormVisibility = computed(() => {
  return naStore.Visible;
});
const viewNAVisibility = computed(() => {
  return naStore.ViewVisible;
});
const groups = computed(() => {
  return store.groups;
});
const isAssigned = computed(() => {
  if (!isUndefined(store.generalForm) && !isUndefined(store.generalForm.status)) {
    if (store.generalForm.status == 'Submited') {
      return false
    }
  }
  return !isEmpty(store.employee.id)
});
const progressPercentage = computed(() => {
  return store.percentageTaskProgressAllTab
})
const showNotMapped = computed(() => {
  return store.ratingNotMapped
});
const closeNotMappedModal = () => {
  store.toggleNotMapped(false)
}

const confirmSubmitVisibility = ref(false);
const confirmExitVisibility = ref(false);
const processingTimePopupVisibility = ref(false);
const historyVisibility = ref(false);
const historyDefectVisibility = ref(false);
const whiteBackground = ref(false);
const isFormSubmittedDialog = ref(false);
const isFormNotReadyDialog = ref(false);
const clock = ref("00:00:00")
const timer = ref()
const riskAssesmet = ref()
const formAgreement = ref(false)
const fetchHistory = ref(false)
const defectSheetStore = useDefectSheetStore()
const defectStore = useDefectsFormStore();
const iLoading = ref<ILoadingInstance>()
const preriskPhotoCaption = ref('')
const cardEquipment = ref<any>(null)

const isFormSubmittedOnServiceSheetDetail = computed(() => {
  return store.formAlreadySubmitted
})
const isFormCloseOnServiceSheetDetail = computed(() => {
  return store.formAlreadyClose
})

const updateClock = (val) => {
  timer.value.timer.reset()
  clock.value = val
  timer.value.timer.updateCLock(val)
  timer.value.continueTimer()
}

const hmOffset = computed(() => {
  if (store.generalForm.hmOffset) {
    return Number(store.generalForm.hmOffset)
  } else {
    return 0
  }
})
const minRangeValue = computed(() => {
  const smuValidation = generalFormStore.smuActual
  const tolerance = generalFormStore.smuTolerance
  return Number((Number(smuValidation) + Number(tolerance.min)))
});
const maxRangeValue = computed(() => {
  const smuValidation = generalFormStore.smuActual
  const tolerance = generalFormStore.smuTolerance
  return Number((Number(smuValidation) + Number(tolerance.max)))
});
const isSMUOnRange = computed(() => {
  let dataSMU;
  if (!isUndefined(store.generalForm.smu)) {
    dataSMU = store.generalForm.smu;
  } else if (!isUndefined(generalFormStore.payload.updateParams)) {
    const general = generalFormStore.payload.updateParams.find((updateParam) => {
      return updateParam.keyValue == 'GENERAL'
    })
    if (!isUndefined(general)) {
      const smu = general.propertyParams.find((item) => {
        return item.propertyName == 'smu'
      })

      if (!isUndefined(smu)) {
        dataSMU = smu.propertyValue;
      }
    }
  }
  let val = reformatNumberWithComma(cloneDeep(dataSMU));
  const minRange = Number(val) + Number(hmOffset.value) >= minRangeValue.value;
  const maxRange = Number(val) + Number(hmOffset.value) <= maxRangeValue.value;
  if (dataSMU != '' && minRange && maxRange) {
    return true;
  } else {
    return false;
  }
})

const formAgreementDisabled = computed(() => {
  let isSmuFilled = false
  let isFitterSelected = false
  let disableButton = true
  let isSmuImageValid = true

  // check smu image if smu value out of range
  if (!isSMUOnRange.value && !isUndefined(store.generalForm.imageEquipment) && (store.generalForm.imageEquipment == '' || store.generalForm.imageEquipment.length == 0)) {
    isSmuImageValid = false
  }

  // check smu
  if (!isUndefined(store.generalForm.smu) && store.generalForm.smu != '') {
    isSmuFilled = true
  } else if (!isUndefined(generalFormStore.payload.updateParams)) {
    const general = generalFormStore.payload.updateParams.find((updateParam) => {
      return updateParam.keyValue == 'GENERAL'
    })
    if (!isUndefined(general)) {
      const smu = general.propertyParams.find((item) => {
        return item.propertyName == 'smu'
      })

      if (!isUndefined(smu)) {
        if (smu.propertyValue != '') {
          isSmuFilled = true
        }
      }
    }
  }

  // check selected fitter
  if (!isUndefined(generalFormStore.payload.updateParams)) {
    const general = generalFormStore.payload.updateParams.find((updateParam) => {
      return updateParam.keyValue == 'GENERAL'
    })
    if (!isUndefined(general)) {
      const servicePersonnels = general.propertyParams.find((item) => {
        return item.propertyName == "servicePersonnels"
      })

      if (!isUndefined(servicePersonnels)) {
        if (servicePersonnels.propertyValue != '') {
          isFitterSelected = true
        }
      }
    }
  }

  if (isUndefined(fitter.value.id) || fitter.value.id == '') {
    isFitterSelected = false
  } else {
    isFitterSelected = true
  }

  if (isSmuFilled && isFitterSelected && isSmuImageValid) {
    disableButton = false
  }

  if (formAgreement.value) {
    disableButton = true
  }
  return disableButton
})

const router = useRouter()

const onPersonelSelected = () => {
  timer.value.timer.reset()
  timer.value.startTimer()
}
const taskAlreadyUpdatedDialog = computed(() => {
  return store.taskAlreadyUpdated
})

const isTruckAlreadyCheckedByOtherFitter = computed(() => {
  return generalFormStore.stateIsTruckAlreadyCheckedByOtherFitter
})

const submitTimerDisabled = computed(() => {
  return !generalFormStore.generalUpdated
})

const onTimerStart = (value: string) => {
  clock.value = value
}
const onTimerChange = (value: string) => {
  clock.value = value
}

const isTimerStopped = ref(false)

const onTimerStop = (value: string) => {
  if (!globalConnectionStore.stateConnectionStatus) {
    globalConnectionStore.setSubmitConnectionError(true)
  } else {
    clock.value = value;
    confirmExitVisibility.value = true
  }
}


const onExitConfirmSubmit = async () => {
  // hiding confirm dialog
  confirmExitVisibility.value = false

  // update personnel end time
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try {
    const personeel = generalFormStore.CurrentPersoneel
    personeel.serviceEnd = '<<ServerDateTime>>'
    const payload = {
      propertyName: "servicePersonnels",
      propertyValue: JSON.stringify(personeel)
    }
    // send to BE
    await generalFormStore.UpdateServiceEndMechanic(payload)
  } catch (error) {
    // encountered error
    // same fitter logged in on two device, 1 fitter will always logged in by 1 person anw
    console.log('error filtering service personnel on closing eform', error)
  }
  loading.close()
  // showing pop up and white bg
  processingTimePopupVisibility.value = true
  whiteBackground.value = true
}


const handleCloseProcessingTimeAndShowInputPIN = () => {
  processingTimePopupVisibility.value = false
  router.push({ name: "ironforms" })
}

const isEmployeeNotSet = computed(() => {
  console.log('check', isEmpty(store.employee));
  return isEmpty(store.employee)
})

const isSuccessEnter = ref(false)

const isTaskAllDone = computed(() => {
  return store.isAllTaskDone
})

const onConfirmSubmit = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading Interim Form',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  generalFormStore.addUpdatedByAndDate(authStore.user.EmployeeId, authStore.user.Name);
  confirmSubmitVisibility.value = false
  const isFormSubmitted = await generalFormStore.updateGeneralForm()
  if (isFormSubmitted) {
    isFormSubmittedDialog.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
    loading.close()
  } else {
    saveCacheValue('submitted', "true")
    await store.postGenerateServiceSheet(authStore.user.EmployeeId, authStore.user.Name, authStore.user.SiteId)
    store.setSerialNumberGeneral(defectStore.SerialNumber)
    generalFormStore.stateGeneralUpdated = true;
    // mendapatkan group yang aktif
    const nextActiveGroup = store.groups.find((group) => {
      if (isUndefined(group.isDisable) || group.isDisable == "false") {
        if (group.groupName != "General") {
          return true
        }
      }
    })
    store.setSelectedGroup(nextActiveGroup!.id)
    await store.updateGroupByParam(nextActiveGroup!.groupName)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    isSuccessEnter.value = true
    loading.close()
  }
  defectSheetStore.updateSelectedWO(
    store.generalForm.workOrder,
    store.generalForm.modelId,
    store.generalForm.equipment,
    store.generalForm.psTypeId
  )
}

const onConfirmExitCancel = () => {
  confirmExitVisibility.value = false
}

const camStore = useCameraStore()

const onConfirmCancel = () => {
  camStore.setShowCloseButton(false)
  riskAssesmet.value.triggerCamera()
  generalFormStore.setFitterInfoIsIHaveReadChecked(true)
  confirmSubmitVisibility.value = false
  formAgreement.value = true
}

const checkAgreement = () => {
  confirmSubmitVisibility.value = false
  formAgreement.value = false
}

const generalFormForm = computed(() => {
  let form = ''
  if (!isUndefined(store.generalForm)) {
    if (!isUndefined(store.generalForm.form)) {
      form = store.generalForm.form
    }
  }
  return form.replace('e-Form', '');
});

const disabledSubmitButton = computed(() => {
  let disableButton = true
  let isSmuFilled = false
  let isFitterSelected = false
  let isCheckBeforeTrucksChecked = true
  let isAgreementChecked = false
  let isPreTaskRiskUpdated = false

  let isSwingFilled = false
  let isTravelFilled = false

  // check smu
  if (!isUndefined(store.generalForm.smu) && store.generalForm.smu != '') {
    isSmuFilled = true
  } else if (!isUndefined(generalFormStore.payload.updateParams)) {
    const general = generalFormStore.payload.updateParams.find((updateParam) => {
      return updateParam.keyValue == 'GENERAL'
    })
    if (!isUndefined(general)) {
      const smu = general.propertyParams.find((item) => {
        return item.propertyName == 'smu'
      })

      if (!isUndefined(smu)) {
        if (smu.propertyValue != '') {
          isSmuFilled = true
        }
      }
    }
  }

  // check selected fitter
  if (generalFormStore.IsFitterLoggedInExist) {
    isFitterSelected = true
  } else if (!isUndefined(generalFormStore.payload.updateParams)) {
    const general = generalFormStore.payload.updateParams.find((updateParam) => {
      return updateParam.keyValue == 'GENERAL'
    })
    if (!isUndefined(general)) {
      const servicePersonnels = general.propertyParams.find((item) => {
        return item.propertyName == "servicePersonnels"
      })

      if (!isUndefined(servicePersonnels)) {
        if (servicePersonnels.propertyValue != '') {
          isFitterSelected = true
        }
      }
    }
  }

  // check prerisk assesment
  if (generalFormStore.IsFitterLoggedInExist) {
    if (fitter.value.id == generalFormStore.FitterInfo.employee.id) {
      const photos = getPreriskPhoto()
      if (photos.length > 1) isPreTaskRiskUpdated = true
    }
  } else if (!generalFormStore.IsSelectedFitterAlreadyLoggedIn) {
    isPreTaskRiskUpdated = generalFormStore.IsRiskAssesmentPhotoTaken
  } else {
    isPreTaskRiskUpdated = true
  }

  // check check b4 truck
  store.generalForm.checkBeforeTruck.items.forEach((truck) => {
    if (truck.value == 'false') {
      isCheckBeforeTrucksChecked = false
    }
  })

  // check swing, if undefined == validation off
  if (isUndefined(store.generalForm.swingHour)) {
    isSwingFilled = true
  } else {
    if (!isUndefined(store.generalForm.swingHour) && store.generalForm.swingHour != '') {
      isSwingFilled = true
    } else if (!isUndefined(generalFormStore.payload.updateParams)) {
      const general = generalFormStore.payload.updateParams.find((updateParam) => {
        return updateParam.keyValue == 'GENERAL'
      })
      if (!isUndefined(general)) {
        const swingHour = general.propertyParams.find((item) => {
          return item.propertyName == 'swingHour'
        })

        if (!isUndefined(swingHour)) {
          if (swingHour.propertyValue != '') {
            isSwingFilled = true
          }
        }
      }
    }
  }

  // check travel, if undefined == validation off
  if (isUndefined(store.generalForm.travelHour)) {
    isTravelFilled = true
  } else {
    if (!isUndefined(store.generalForm.travelHour) && store.generalForm.travelHour != '') {
      isTravelFilled = true
    } else if (!isUndefined(generalFormStore.payload.updateParams)) {
      const general = generalFormStore.payload.updateParams.find((updateParam) => {
        return updateParam.keyValue == 'GENERAL'
      })
      if (!isUndefined(general)) {
        const travelHour = general.propertyParams.find((item) => {
          return item.propertyName == 'travelHour'
        })

        if (!isUndefined(travelHour)) {
          if (travelHour.propertyValue != '') {
            isTravelFilled = true
          }
        }
      }
    }
  }

  let swingTravelValidation = false

  if (isUndefined(store.generalForm.isSwingTravelRequired)) {
    swingTravelValidation = true
  } else {
    if (store.generalForm.isSwingTravelRequired == "true" && isSwingFilled && isTravelFilled) {
      swingTravelValidation = true
    } else if (store.generalForm.isSwingTravelRequired == "false" || store.generalForm.isSwingTravelRequired == "") {
      swingTravelValidation = true
    }
  }

  // check is travel validation from JSON is exist n travel is filled
  let travelValidation = false;

  if (isUndefined(store.generalForm.isTravelRequired)) {
    travelValidation = true;
  } else {
    if (
      store.generalForm.isTravelRequired == "true" &&
      isTravelFilled
    ) {
      travelValidation = true;
    } else if (
      store.generalForm.isTravelRequired == "false" ||
      store.generalForm.isTravelRequired == ""
    ) {
      travelValidation = true;
    }
  }

  // check is swing validation from JSON is exist n swing is filled
  let swingValidation = false;

  if (isUndefined(store.generalForm.isSwingRequired)) {
    swingValidation = true;
  } else {
    if (
      store.generalForm.isSwingRequired == "true" &&
      isSwingFilled
    ) {
      swingValidation = true;
    } else if (
      store.generalForm.isSwingRequired == "false" ||
      store.generalForm.isSwingRequired == ""
    ) {
      swingValidation = true;
    }
  }

  // check agreement
  if (formAgreement.value) isAgreementChecked = true
  // console.log('isSmuFilled', isSmuFilled, 'isFitterSelected', isFitterSelected, 'isCheckBeforeTrucksChecked', isCheckBeforeTrucksChecked, 'isAgreementChecked', isAgreementChecked, 'isPreTaskRiskUpdated', isPreTaskRiskUpdated);
  if (isSmuFilled && isFitterSelected && isCheckBeforeTrucksChecked && isAgreementChecked && isPreTaskRiskUpdated && swingTravelValidation && swingValidation && travelValidation) {
    disableButton = false
  }
  return disableButton
});

const selectedSubGroups = computed(() => {
  return store.selectedSubGroups;
});

const generalForm = computed(() => {
  return store.generalForm;
});

const getPreriskPhoto = () => {
  let imgArr = [] as any[]
  if (!Array.isArray(generalFormStore.generalForm.riskAssesment[0].value)) return imgArr
  const mechanic = store.employee
  imgArr = generalFormStore.generalForm.riskAssesment[0].value.filter((imgInfo) => {
    // cast it as unknown as any
    const info = imgInfo as unknown as any
    if (info.updatedBy.id == mechanic.id) {
      return info
    }
  })
  return imgArr.slice(0, 2)
}

const handleCheckAgreement = () => {
  if (formAgreement.value) {
    // need to check if swing travel is filled
    let isSwingFilled = false
    let isTravelFilled = false
    let swingTravelValidation = false
    let travelValidation = false;
    let swingValidation = false;

    // check swing, if undefined == validation off
    if (isUndefined(generalForm.value.swingHour)) {
      isSwingFilled = true;
    } else {
      if (generalForm.value.swingHour === '') {
        const isSwingTravelRequired = store.generalForm.isSwingTravelRequired;
        const isSwingRequired = store.generalForm.isSwingRequired;
        // check validation from JSON is exist and value is true
        const isSwingTravelRequiredExist = (isSwingTravelRequired) && String(isSwingTravelRequired) === "true"
        const isSwingRequiredExist = isSwingRequired && String(isSwingRequired) === "true"
        if (isSwingTravelRequiredExist || isSwingRequiredExist) {
          cardEquipment.value?.showSwingRequired();
        } else {
          cardEquipment.value?.hideSwingRequired();
        }
      } else {
        isSwingFilled = true;
      }
    }

    // check travel, if undefined == validation off
    if (isUndefined(generalForm.value.travelHour)) {
      isTravelFilled = true;
    } else {
      if (generalForm.value.travelHour === '') {
        const isSwingTravelRequired = store.generalForm.isSwingTravelRequired;
        const isTravelRequired = store.generalForm.isTravelRequired
        // check validation from JSON is exist and value is true
        const isSwingTravelRequiredExist = (isSwingTravelRequired) && String(isSwingTravelRequired) === "true"
        const isTravelRequiredExist = isTravelRequired && String(isTravelRequired) === "true"
        if (isSwingTravelRequiredExist || isTravelRequiredExist) {
          cardEquipment.value?.showTravelRequired();
        } else {
          cardEquipment.value?.hideTravelRequired();
        }
      } else {
        isTravelFilled = true;
      }
    }

    if (isUndefined(store.generalForm.isSwingTravelRequired) || store.generalForm.isSwingTravelRequired == "false") {
      swingTravelValidation = true
    }
    if (store.generalForm.isSwingTravelRequired && store.generalForm.isSwingTravelRequired == "true" && isSwingFilled && isTravelFilled) {
      swingTravelValidation = true
    }

    // check if travel field from JSON is undefined
    if (
      isUndefined(store.generalForm.isTravelRequired) ||
      store.generalForm.isTravelRequired == "false"
    ) {
      travelValidation = true;
    }

    // check if swing field from JSON is undefined
    if (
      isUndefined(store.generalForm.isSwingRequired) ||
      store.generalForm.isSwingRequired == "false"
    ) {
      swingValidation = true;
    }

    // check is travel validation from JSON is exist n travel is filled
    if (
      store.generalForm.isTravelRequired &&
      store.generalForm.isTravelRequired == "true" &&
      isTravelFilled
    ) {
      travelValidation = true;
    }

    // check is swing validation from JSON is exist n swing is filled
    if (
      store.generalForm.isSwingRequired &&
      store.generalForm.isSwingRequired == "true" &&
      isSwingFilled
    ) {
      swingValidation = true;
    }

    if (!swingTravelValidation || !travelValidation || !swingValidation) {
      // scroll and reset form agreement
      formAgreement.value = false
      handleScrollToError('travel-swing')
      return
    }
    if (!generalFormStore.IsSelectedFitterAlreadyLoggedIn) {
      const photos = getPreriskPhoto()
      if (photos.length == 0) {
        preriskPhotoCaption.value = "Take <strong>front page</strong> photo of your completed pre-task risk assessment."
      } else {
        preriskPhotoCaption.value = "Take <strong>back page</strong> photo of your completed pre-task risk assessment."
      }
      confirmSubmitVisibility.value = true
    }
  }
}

const showSubmitConfirmation = ref(false)

const onFrontPhotoTaken = () => {
  preriskPhotoCaption.value = 'Take <strong>back page</strong> photo of your completed pre-task risk assessment.'
  confirmSubmitVisibility.value = true
}

const onConfrimSubmit = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Submitting e-form',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  showSubmitConfirmation.value = false
  await store.submitEform()
  // await updateServiceEndForAllFitter()
  loading.close()
  // showing pop up and white bg
  processingTimePopupVisibility.value = true
  whiteBackground.value = true
}

const onCancelSubmit = () => {
  showSubmitConfirmation.value = false
}

const showCalibrationPayload = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Opening Calibration form',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await handleShowSCCalibrationFormDialog()
  loading.close()
}

const handleSubmitAndExitEform = async (status) => {
  if (status) {
    // check suspension ada yang out spec, jika gada maka langsung submit
    const outSpecItem = store.stateStoredSuspensionCylinderValue.filter((item) => {
      return item.value == "Out of spec" || item.value == "Out Spec"
    })
    if (outSpecItem.length > 0) {
      if (store.stateStoredAdjustedSuspensionCylinderValue.length > 0) {
        if (store.stateStoredAdjustmentOptionValue == "2" || store.stateStoredAdjustmentOptionValue == "Yes") {
          await showCalibrationPayload()
        } else {
          showSubmitConfirmation.value = true
        }
      } else {
        showSubmitConfirmation.value = true
      }
    } else {
      showSubmitConfirmation.value = true
    }
  }
}

const handleCloseHistory = () => {
  historyVisibility.value = false;
}


const handleCloseDefectHistory = () => {
  historyDefectVisibility.value = false;
}

const isExitFormOnProgress = ref(false)

const cancelExitForm = () => {
  isExitFormOnProgress.value = false
  const windowsUrl = window.location.href
  if (!windowsUrl.includes('#!')) {
    window.location.href += "#!";
    router.currentRoute.value.hash = '#!';
  }
}

const exitFomOnProgress = () => {
  const status = generalFormStore.generalForm.status
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (status.toLowerCase() == 'open') {
    generalFormStore.updateServiceSheetHeaderToTrue()
  }
  isExitFormOnProgress.value = false
  loading.close();
  router.push({ name: "ironforms" })
}

const confirmBeforeClose = () => {
  const routerValue = router.currentRoute.value
  const windowsUrl = window.location.href
  const routerHash = routerValue.hash

  if (!windowsUrl.includes('#!')) window.location.href += "#!";
  if (!routerHash.includes('#!')) router.currentRoute.value.hash = '#!';
  const path = routerValue.path

  // const leaving =
  window.onpopstate = (event) => {
    // cek if current route is eform route
    // check if there is # on path
    // check if there is state (back button on browser will always bring state)
    if (path == '/ironforms/interim-engine-service' && !router.currentRoute.value.hash.includes('#') && event.state) {
      isExitFormOnProgress.value = true
    }
  }
}

onUnmounted(() => {
  store.resetMechanic()
  store.toogleTaskErrorDialog(false)
})

onMounted(async () => {
  await generalFormStore.getShiftListData()
  naStore.resetInstance();
  generalFormStore.resetGeneral();
  store.resetMechanic();
  /* clear localStorage */
  destroyCache('submitted');
  /* wire events */
  const myOffcanvas = document.getElementById('offcanvasNavbar');
  if (myOffcanvas != null) {
    myOffcanvas.addEventListener('show.bs.offcanvas', async () => {
      if (fetchHistory.value === false) {
        fetchHistory.value = true;
        const loading = ElLoading.service({
          lock: true,
          text: 'Loading historical data',
          background: 'rgba(0, 0, 0, 0.7)',
          target: myOffcanvas
        });
        await historyStore.getHistoricalFormData(store.statePsTypeId, store.stateModelId, store.stateUnitNumber);
        await historyStore.getHistoricalDefectData(store.statePsTypeId, store.stateModelId, store.stateUnitNumber);
        loading.close();
      }
    });
  }
  store.clearTruckCheckBoxes();
  confirmBeforeClose()
});

const handleCheckLoggedInFitter = async () => {
  generalFormStore.setIsFitterLoggedInExist(false)
}

const fitter = computed(() => {
  return store.employee
})

watch(fitter, async (newVal) => {
  if (generalFormStore.IsFitterLoggedInExist) {
    if (generalFormStore.FitterInfo.employee.id == newVal.id) {
      formAgreement.value = generalFormStore.FitterInfo.isIHaveReadChecked
    } else {
      formAgreement.value = false
    }
  } else {
    formAgreement.value = false
  }
}, { deep: true })

onBeforeMount(async () => {
  iLoading.value = ElLoading.service({
    lock: true,
    text: 'Loading Interim Form',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  whiteBackground.value = true
  store.toggleIsShowCalibrationConfirm(false)
  await listStore.getPositionDMA();
  await generalFormStore.getSMUTolerance()
  store.getGroups();
  store.getSubGroups();
  await personelStore.getPersonalLabours();
  const getEform = await store.postGenerateServiceSheet(authStore.user.EmployeeId, authStore.user.Name, authStore.user.SiteId);
  generalFormStore.getHmOffsetValue(authStore.user.SiteId)
  await defectStore.getOwnershipDefectForm(store.stateUnitNumber)
  store.setSerialNumberGeneral(defectStore.SerialNumber)
  store.stateGroups.forEach((group) => {
    if (group.groupName == "MECHANICAL_SERVICE") {
      group.subGroup.forEach((subGroup) => {
        if (subGroup.key == "MECHANICAL_SERVICE") {
          subGroup.taskGroup.forEach((taskGroup) => {
            if (taskGroup.key == "MECHANICAL_SERVICE_SUSPENSION") {
              let suspensionArr = [] as DisabledItem[]
              let adjustedSuspensionArr = [] as DisabledItem[]
              taskGroup.task.forEach((task: Task) => {
                task.items.forEach((item) => {
                  if (item.categoryItemType == "suspensionTargetRating") {
                    suspensionArr.push({
                      key: item.key,
                      value: item.value as string
                    })
                  }

                  if (item.categoryItemType == "adjustmentSuspensionTargetRating") {
                    adjustedSuspensionArr.push({
                      key: item.key,
                      value: item.value as string
                    })
                  }
                })
                if (!isUndefined(task.showParameter)) {
                  if (task.showParameter == "suspensionCylinder") {
                    store.updateStoredAdjustmentOptionValue(task.taskValue)
                  }
                }
              })
              store.pushDataToAdjustedSuspensionCylinderStoredValue(adjustedSuspensionArr)
              store.pushDataToSuspensionCylinderStoredValue(suspensionArr)
            }
          })
        }
      })
    }
  })
  store.updateStoredDisableKeyValue([])
  if (!getEform && !store.stateIsFormSelectedByOtherSupervisor) {
    whiteBackground.value = true
    iLoading.value?.close()
    iLoading.value = undefined
    isFormNotReadyDialog.value = true
  }
  generalFormStore.setGeneralForm(store.generalForm);
  // -------- check logged in fitter --------
  await handleCheckLoggedInFitter()
  // -------- check logged in fitter --------
  await store.getEhmsRating();
  await store.getOilTolerance();
  historyStore.reset();
  generalFormStore.setPayloadId(generalForm.value.id, authStore.user.EmployeeId, authStore.user.Name)
  whiteBackground.value = false
  iLoading.value?.close()
  iLoading.value = undefined
});

// handle after show form already submit dialog, then handle exit form

const handleExitFormSubmittedOnServiceSheet = () => {
  store.toggleFormAlreadySubmitted(false)
  onExitConfirmSubmit()
}
const handleExitFormCloseOnServiceSheet = () => {
  store.toggleFormAlreadyClose(false)
}

const handleExitFormNotReady = () => {
  isFormNotReadyDialog.value = false
  router.push({ name: "ironforms" })
}

const handleExitCheckboxAlreadyUpdated = async () => {
  generalFormStore.toggleIsTruckAlreadyCheckedByOtherFitter(false)
}

const handleExitTaskAlreadyUpdated = async () => {
  store.toggleTaskAlreadyUpdatedStatus(false)
  store.toogleTaskErrorDialog(false)
  const loading = ElLoading.service({
    lock: true,
    text: 'Reloading e-Form',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  await store.updateGroupByParam(store.selectedGroup?.groupName as string)
  store.getTaskProgress()
  loading.close()
}

const handlePreviewDashboardIronForms = () => {
  isExitFormOnProgress.value = true
}
</script>
<style lang="scss">
  .offcanvas {
    .el-loading-mask {
      .el-loading-spinner {
        circle {
          stroke: white;
        }
        .el-loading-text {
          color: white;
        }
      }
    }
  }
  .interim-container {
    .stepper-button{
      width: 100%;
    }
  }
</style>

<style lang="scss" scoped>
  .form-check-input:checked {
        background-color: #18AF4A;
        border-color: #18AF4A;
  }
  .e-form-container {
    font-family: 'Public sans' !important;
  }
  .avatar-card {
    background-color: #F9FAFB;
    border-radius: 10px;
  }
  .firstname-placeholder {
    width: 100px;
    height: 100px;
    background-color: #18AF4A;

    span {
      font-size: 70px;
      color: white;
    }
  }
  .name {
    font-size: 16px;
  }
  .position {
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    color: #637381;
  }
  /* off canvas */
  .navbar {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .navbar-toggler:focus {
    text-decoration: none;
    outline: 0;
    box-shadow: none;
  }
  .offcanvas-end {
    top: 10px;
    right: 10px;
    width: 260px;
    border-radius: 8px;
    transform: translateX(100%);
  }
  .offcanvas {
    position: fixed;
    bottom: 10px;
    z-index: 1050;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    visibility: hidden;
    background-color: #fff;
    background-clip: padding-box;
    outline: 0;
    transition: transform 0.3s ease-in-out;
}
.offcanvas.show {
    transform: none;
}
.offcanvas-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1rem;
}
.offcanvas-body {
    flex-grow: 1;
    padding: 1rem 1rem;
    overflow-y: auto;
}
</style>
