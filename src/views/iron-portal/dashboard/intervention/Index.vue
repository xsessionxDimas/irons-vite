<template>
  <div class="section-header">
    <HeaderMenu @onBackToList="onBackToList" />
  </div>
  <div class="section iron_portal-intervention" v-loading="formStore.loading" element-loading-background="#2d2b39b3">
    <el-row :gutter="50">
      <el-col :span="12">
        <SelectInput
          id="site"
          class="custom-text-input"
          labelClass="text-white"
          :value="formIntervention.site"
          :isLoading="formLoading.site"
          placeholder="Select Site"
          label="Site"
          name="Site"
          :max="200"
          @handleChange="handleSiteChange"
          :is-disabled="formStore.isFromEquipment || isSiteDisabled"
          :options="formStore.siteOption"
        />
        <div id="error-site" class="mb-2 d-flex justify-content-end error-label is-hidden">
          <span>Site is mandatory</span>
        </div>
        <SelectInput
          id="model"
          class="custom-text-input"
          labelClass="text-white"
          :value="formIntervention.equipmentModel"
          :isLoading="formLoading.equipmentModel"
          placeholder="Select Model"
          label="Model"
          name="EquipmentModel"
          :max="200"
          @handleChange="handleEquipmentModelChange"
          :is-disabled="formStore.isFromEquipment"
          :options="formStore.equipmentModelOption"
        />
        <div id="error-model" class="mb-2 d-flex justify-content-end error-label is-hidden">
          <span>Model is mandatory</span>
        </div>
        <SelectInput
          id="equipment"
          class="custom-text-input"
          labelClass="text-white"
          :value="formIntervention.equipmentNumber"
          :isLoading="formLoading.equipmentNumber"
          placeholder="Select Equipment"
          label="Equipment"
          name="EquipmentNumber"
          :max="200"
          @handleChange="handleEquipmentNumberChange"
          :is-disabled="formStore.isFromEquipment"
          :options="formStore.equipmentNumberOption"
        />
        <div id="error-equipment" class="mb-2 d-flex justify-content-end error-label is-hidden">
          <span>Equipment is mandatory</span>
        </div>
      </el-col>
      <el-col :span="12">
        <InterventionReason
          labelClass="text-white"
          :value="formIntervention.interventionReason"
          :paragraph="formIntervention.interventionReason"
          placeholder="This value will appear when other form is filled"
          label="Intervention Reason"
          name="InterventionReason"
          textInputType="textarea"
          :disabled="true" />
      </el-col>
      <el-col :span="12">
        <label :class="`form-label fs-6 fw-bolder text-white`" for="componentAffected">Component Affected</label>
        <ComponentGrid
          :isCannotEdit="isCannotEditForm"
          :list-data="componentList"
          :reRender="reRenderComponentList"
          :isLoading="listStore.componentListLoading || listStore.loading"
          :height="componentGridHeight"
        />
      </el-col>
      <el-col :span="12">
        <el-row :gutter="20" class="mt-0.5">
          <el-col :span="12">
            <SelectInput
              id="intervention-status"
              class="custom-text-input"
              labelClass="text-white"
              :value="formIntervention.interventionStatus"
              :isLoading="formLoading.interventionStatus"
              placeholder="Select Intervention Status"
              label="Intervention Status"
              name="InterventionStatus"
              :max="200"
              @handleChange="handleInterventionStatusChange"
              :options="formStore.interventionStatusOption"
              :is-disabled="formIntervention.interventionExecutionId > 4"
            >
              <template #after-label>
                <span v-if="formIntervention.interventionHeaderId && formIntervention.declineReason" class="ms-auto">
                  <em
                    class="fa fa-info-circle me-2"
                    style="color: red; font-size: 1.1em; cursor: pointer;"
                    @click="onDeclineIconStatusClick"
                  ></em>
                </span>
                <span v-else-if="formIntervention.interventionHeaderId && formIntervention.approveReason" class="ms-auto">
                  <em
                    class="fa fa-info-circle me-2"
                    style="color: green; font-size: 1.1em; cursor: pointer;"
                    @click="onApproveIconStatusClick"
                  ></em>
                </span>
              </template>
            </SelectInput>
            <span v-if="formIntervention.statusIP.name && formIntervention.statusIP.date" class="mb-2 d-flex justify-content-end text-white">
              {{ formIntervention.statusIP.name }}, {{ AESTDateTime(formIntervention.statusIP.date) }}
            </span>
            <span v-if="formIntervention.statusIF.name && formIntervention.statusIF.date" class="mb-2 d-flex justify-content-end text-white">
              {{ formIntervention.statusIF.name }}, {{ AESTDateTime(formIntervention.statusIF.date) }}
            </span>
          </el-col>
          <el-col :span="12">
            <SelectInput
              id="follow-up-priority"
              class="custom-text-input"
              labelClass="text-white"
              :value="formIntervention.followUpPriority"
              :isLoading="formLoading.followUpPriority"
              placeholder="Select Follow-up Priority"
              label="Follow-up Priority"
              name="FollowUpPriority"
              :max="200"
              @handleChange="handleFollowUpPriorityChange"
              :is-disabled="isCannotEditForm"
              :options="formStore.followUpPriorityOption"
            />
            <div id="error-follow-up-priority" class="mb-2 d-flex justify-content-end error-label is-hidden">
              <span>Follow Up Priority is mandatory</span>
            </div>
          </el-col>
        </el-row>
        <ElementTextInput
          id="intervention-description"
          class="textarea-custom"
          labelClass="text-white"
          :value="formIntervention.interventionDiagnostic"
          placeholder="Add Intervention Description"
          label="Intervention Description"
          name="InterventionDiagnostic"
          @handleChange="handleInterventionDiagnostic"
          :max="1500"
          :disabled="isCannotEditForm"
          textInputType="textarea"
        />
        <div id="error-intervention-description" class="mb-2 d-flex justify-content-end error-label is-hidden">
          <span>Intervention Description is mandatory</span>
        </div>
      </el-col>
      <el-col :span="12">
        <SelectInput
          id="condition-rating-date"
          class="custom-text-input"
          labelClass="text-white"
          :value="formIntervention.conditionRatingDate"
          :isLoading="formLoading.conditionRatingDate"
          :placeholder="(!formIntervention.equipmentNumber || formIntervention.equipmentNumber == '') ? 'Please select an Equipment first' : 'Select Condition Rating Date'"
          label="Condition Rating Date"
          name="ConditionRatingDate"
          :max="200"
          @handleChange="handleConditionRatingDateChange"
          :is-disabled="(!formIntervention.equipmentNumber || formIntervention.equipmentNumber == '') || formStore.isFromEquipment"
          :options="formStore.conditionRatingDateOption"
        >
          <template #after-label>
            <span v-if="showConditionRatingDate.length > 1" class="ms-auto">
              <em class="fa fa-info-circle me-2" style="color: #f0f0f0;font-size: 1.1em;cursor: pointer;" @click="onIconRatingDateClick"></em>
            </span>
          </template>
        </SelectInput>
        <div id="error-condition-rating-date" class="mb-2 d-flex justify-content-end error-label is-hidden">
          <span>
            Condition Rating Date is mandatory
          </span>
        </div>
      </el-col>
      <el-col :span="12">
        <DatePickerInput
          id="estimation-completion-date"
          class="custom-text-input"
          labelClass="text-white"
          :value="formIntervention.estimationCompletionDate"
          label="Estimated Completion Date"
          name="EstCompletionDate"
          :is-loading="formLoading.estimationCompletionDate"
          :is-disabled="isCannotEditForm"
          @handleChange="handleEstCompletionDateChange"
        />
        <div id="error-estimation-completion-date" class="mb-2 d-flex justify-content-end error-label is-hidden">
          <span>Estimation Completion Date is mandatory</span>
        </div>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="20">
          <el-col :span="12">
            <ElementTextInput
              labelClass="text-white"
              :value="formIntervention.conditionRatingSmu"
              placeholder="This value will appear when other form is filled"
              label="Condition Rating SMU"
              name="ConditionRatingSmu"
              :disabled="true" />
          </el-col>
          <el-col :span="12">
            <ElementTextInput
              labelClass="text-white"
              :value="formIntervention.frameHours"
              placeholder="This value will appear when other form is filled"
              label="Frame Hours"
              name="FrameHours"
              :disabled="true" />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <ElementTextInput
          id="work-order"
          textInputType="number"
          labelClass="text-white"
          :value="formIntervention.workOrder"
          placeholder="Add SAP Work Order Number"
          label="SAP Work Order Number"
          name="SapWorkOrderNumber"
          @handleChange="handleWorkOrder"
          :disabled="isCannotEditForm"
          :max="20"
        />
        <div id="error-work-order" class="mb-2 d-flex justify-content-end error-label is-hidden">
          <span>SAP Work Order is mandatory</span>
        </div>
      </el-col>
    </el-row>
  </div>
  <div class="section">
    <h3 class="text-white mb-5">Intervention Checks</h3>
    <!-- @NOTE THERE IS HAVE SOME ISSUE IN COLUMN SELECTION
    FOR SHOW HIDE SELECTION PANE, FOR TEMP SOLUTION MAKE 2 TABLE
    IF YOU WANT TO ADD/CHANGE LOGIC IN InterventionChecksGrid
    PLEASE PROVIDE TO IN COMPONENT InterventionCheckList -->
    <InterventionChecksGrid
      v-if="isCannotEditForm"
      :listData="interventionCheckList"
      @set-decline-reason="setDeclineReason"
      :isLoading="listStore.componentListLoading || listStore.loading"
    />
    <InterventionCheckList
      v-else
      :reRender="reRenderSelection"
      :listData="interventionCheckList"
      @set-decline-reason="setDeclineReason"
      :disableSelection="isCannotEditForm"
      :isLoading="listStore.componentListLoading || listStore.loading"
    />
  </div>
  <div class="section">
    <h3 class="text-white mb-5">Additional Tasks</h3>
    <AdditionalTaskGrid
      ref="additionalTaskRef"
      :listData="additionalTaskList"
      :canEditAndDelete="formIntervention.interventionStatus != 'Declined' && formIntervention.interventionExecutionId <= 4"
      @set-decline-reason="setDeclineReason"
    />
  </div>
  <div class="section">
    <h3 class="text-white mb-5">Additional Information</h3>
    <p class="text-white text-medium">
      {{ formIntervention.additionalInformation }}
    </p>
  </div>
  <div class="section">
    <h3 class="text-white mb-5">Generic Defect</h3>
    <GenericDefect
      :list-data="genericDefect"
      @on-view-detail-information="handleViewDefectIdentified"
      :loading="formStore.genericLoading"
    />
  </div>
  <div style="margin: 20px 50px">
    <transition name="fade">
      <ErrorAlert
        v-if="isError && errors.length > 0"
        :errorMessages="errors"
        @reset-form="handleResetError" />
    </transition>
    <div id="submit-button-container" class="d-flex justify-content-end">
      <SubmitButton :form-intervention="formIntervention" @clicked="handleSubmitData" :isLoading="formStore.loading" :selectedHeader="selectedHeader" />
    </div>
  </div>
  <!-- view defect preview -->
  <ViewOnlyDefectYesForm
    :visibility="viewDefectYesVisibility"
    :defect-data="(defectStore.defectInfo as DefectYesClass)"
    @close="() => defectStore.resetInstance()"
    :is-intervention="true"
    :decline-reason="declineReason"
  />
  <ViewOnlyDefectNoForm
    :visibility="viewDefectNoVisibility"
    :is-intervention="true"
    :defect-data="(defectStore.defectInfo as DefectNoClass)" @close="() => defectStore.resetInstance()"
  />
  <!-- view NA -->
  <ViewOnlyNAForm
    :visibility="viewNAVisibility"
    :is-intervention="true"
    @close="() => naStore.resetInstance()"
  />
  <CBMInfo
    viewOnly
    :equipmentModel="formIntervention.equipmentModel"
    :psType="psType"
    :visibility="formCbmVisibility"
    :cbm-data="(headerCbm as Header)"
    @close-form="onFormCbmClosed"
  />
  <DeclineReasonDialog
    :isEdit="!isFromIconStatus"
    :visibility="formDeclineVisibility"
    :declinerName="formIntervention.statusIF.name || formIntervention.statusIP.name"
    :declinerDate="formIntervention.statusIF.date || formIntervention.statusIP.date"
    @handle-close="handleHideFormDeclineDialog"
    @handle-submit="handleSubmitDataDeclineReason"
  />
  <ApproveReasonDialog
    :visibility="formApproveVisibility"
    :approverName="formIntervention.statusIP.name || formIntervention.statusIP.name"
    :approverDate="formIntervention.statusIP.date || formIntervention.statusIP.date"
    @handle-close="handleHideFormApproveDialog"
  />
  <ReviseReasonDialog
    :visibility="formReviseVisibility"
    @handle-close="handleHideFormReviseDialog"
    @handle-submit="handleSubmitDataReviseReason"
  />
  <ConditionRatingDateDialog
    :dates="showConditionRatingDate"
    :visibility="conditionRatingDateVisibility"
    @handle-close="() => { conditionRatingDateVisibility = false;}"
  />
  <AdditionalSensorDataDialog
    :visibility="additionalSensorDataVisibility"
    @handle-close="() => { additionalSensorDataVisibility = false;}"
  />
  <DefectNoView
    :visibility="showDefectNoView"
    :data="(defectNoData as IDefectNoDetail)"
    :ownership="ownership"
    :serial-number="serialNumber"
    @on-close="() => { showDefectNoView = false }"
  />
  <DefectYesView
    :visibility="showDefectYesView"
    :data="(defectYesData as IDefectYesDetail)"
    :decline="decline"
    :ownership="ownership"
    :serial-number="serialNumber"
    @on-close="() => { showDefectYesView = false }"
  />
</template>

<script lang="ts" setup>
import {
  ComputedRef,
  computed,
  onBeforeMount,
  onUnmounted,
  ref,
  watch,
  WritableComputedRef,
  nextTick,
} from "vue";
import { debounce } from "lodash"
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  useInterventionFormStore
} from "@/store/pinia/iron-portal/dashboard/intervention/useInterventionFormStore";
import {
  useInterventionListStore
} from "@/store/pinia/iron-portal/dashboard/intervention/useInterventionListStore";
import SelectInput from "@/components/inputs/SelectInput.vue";
import ElementTextInput from "@/components/inputs/ElementTextInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import InterventionReason from "./component/InterventionReason.vue";
import ComponentGrid from "./component/ComponentGrid.vue";
import InterventionChecksGrid from "./component/InterventionChecksGrid.vue";
import InterventionCheckList from "./component/InterventionCheckList.vue";
import AdditionalTaskGrid from "./component/AdditionalTaskGrid.vue";
import GenericDefect from "./component/GenericDefect.vue"
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation,
  swalAlertError,
} from "@/core/helpers/sweet-alert";
import {
  useRouter,
  onBeforeRouteLeave,
} from "vue-router";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import ApiService from "@/core/services/ApiService";
import {
  CRUD_API_URL as GET_EMPLOYEE_API_URL
} from "@/store/pinia/administration/organization-unit/employee/urls";

// IronForms
import DefectYesClass from '@/core/classes/DefectYesClass'
import DefectNoClass from '@/core/classes/DefectNoClass'
import DefectYesView from './component/DefectYesView.vue'
import DefectNoView from './component/DefectNoView.vue'
import CBMInfo from './component/CBMInfo.vue'
import SubmitButton from "@/views/iron-portal/dashboard/intervention/component/SubmitButton.vue";
import {
  useComponentInterventionDefectsFormStore
} from "@/store/pinia/dma/component-intervention/defects/useComponentInterventionDefectsFormStore";
import {
  useComponentInterventionNAFormStore
} from "@/store/pinia/dma/component-intervention/na/useComponentInterventionNAFormStore";
import { useMasterStore } from '@/store/pinia/dma/masters/useMasterStore'
import { Header } from '@/core/types/entities/dma/defects/Header'
import HeaderMenu from './component/HeaderMenu.vue'
import DeclineReasonDialog from './component/FormDeclineReason.vue'
import ApproveReasonDialog from './component/FormApproveReason.vue'
import ReviseReasonDialog from './component/FormReviseReason.vue'
import AdditionalSensorDataDialog from './component/AdditionalSensorDataDialog.vue'
import ConditionRatingDateDialog from './component/ConditionRatingDateDialog.vue'
import {
  useComponentInterventionDefectsStore
} from "@/store/pinia/dma/component-intervention/defects/useComponentInterventionDefectsStore";
import { IDefectNoDetail } from "@/core/types/intervention/IDefectNoDetail";
import { IDefectYesDetail } from "@/core/types/intervention/IDefectYesDetail";
import {
  DefectDetailParam
} from "@/core/types/intervention/DefectDetailParam";
import { Decline } from "@/core/types/intervention/Decline";
import { IBasicDefect } from "@/core/types/intervention/IBasicDefect";

import { filterList } from "../utils"
import { AESTDateTime } from "@/core/helpers/date-format";
import {
  FormIntervention
} from "@/core/types/entities/iron-portal/dashboard/intervention/FormIntervention";

/* stores */
const authStore = useAuthenticationStore();
const defectStore = useComponentInterventionDefectsFormStore();
const naStore = useComponentInterventionNAFormStore();
const masterStore = useMasterStore();
const interventionStore = useComponentInterventionDefectsStore()
const formStore = useInterventionFormStore();
const listStore = useInterventionListStore();

const router = useRouter();

/* refs */
const isSiteDisabled = ref(false); // For disabling site when the logged in user's location is not AU02 (HO)
const declineReason = ref("");
const formDeclineVisibility = ref(false);
const formApproveVisibility = ref(false);
const formReviseVisibility = ref(false);
const conditionRatingDateVisibility = ref(false);
const isFromIconStatus = ref(false);
const oldDeclineReason = ref("");
const showDefectYesView = ref(false)
const showDefectNoView = ref(false)
const ownership = ref('')
const serialNumber = ref('')
const decline = ref<Decline>()

const defectYesData = ref<IDefectYesDetail>()
const defectNoData = ref<IDefectNoDetail>()

const reRenderSelection: WritableComputedRef<boolean> = computed({
  get() {
    return listStore.reRenderSelection;
  },
  // setter
  set(newValue) {
    listStore.setReRenderSelection(newValue)
  }
});
const reRenderComponentList: WritableComputedRef<boolean> = computed({
  get() {
    return listStore.reRenderComponentList;
  },
  // setter
  set(newValue) {
    listStore.setReRenderComponentList(newValue)
  }
});
const formIntervention: ComputedRef = computed((): FormIntervention => {
  return formStore.formIntervention;
});
const formFilter: ComputedRef = computed(() => {
  return formStore.formFilter;
});
const formCbmVisibility: ComputedRef = computed(() => {
  return formStore.formCbmHeaderVisibility;
});
const headerCbm: ComputedRef = computed(() => {
  return formStore.headerCbm;
});
const psType: ComputedRef = computed(() => {
  return formStore.psTypeCbm;
});
const genericDefect: ComputedRef = computed(() => {
  return interventionStore.ApprovalData.DefectGenericHeaders as Header[]
});
const genericDefectDetails = computed(() => {
  return interventionStore.ApprovalData.DefectGenericDetails
});
const employeeId = computed(() => {
  return authStore.user.EmployeeId
});
const additionalTaskRef = ref(null);

watch(employeeId, async () => {
  await setDefaultFilterAccordingToLoggedInUserLocationAndSessionStorage();
}, { deep: true })

/* computed */
const formLoading = computed(() => {
  return formStore.formLoading;
});
const errors = computed(() => {
  return formStore.errors;
});
const isError = computed(() => {
  return formStore.isError;
});
const interventionCheckList = computed(() => {
  return listStore.interventionCheckList.filter((checkItem) => {
    return !checkItem.isDeleted && checkItem.isActive
  });
});
const additionalTaskList = computed(() => {
  return listStore.additionalTaskList;
});
const componentList = computed(() => {
  return listStore.componentList;
});
const viewDefectYesVisibility = computed(() => {
  return defectStore.ViewYesVisible
});
const viewDefectNoVisibility = computed(() => {
  return defectStore.ViewNoVisible
});
const viewNAVisibility = computed(() => {
  return naStore.ViewVisible
});
const showConditionRatingDate = computed(() => {
  if (!formIntervention.value.showConditionRatingDate) return []

  return formIntervention.value.showConditionRatingDate.split(";");
})
const additionalSensorDataVisibility = computed(() => {
  return formStore.isAdditionalSensorExist;
})

const componentGridHeight = computed(() => {
  if (formIntervention.value.statusIP.name && formIntervention.value.statusIF.name) return "255"
  else if (formIntervention.value.statusIP.name && !formIntervention.value.statusIF.name) return "225"
  else return "200"
})

const isSelectedItemHeader = computed({
  get() {
    return listStore.isSelectedItem
  },
  // setter
  set(newValue) {
    listStore.setIsSelectedItem(newValue)
    reRenderComponentList.value = true
  }
});

const selectedHeader = computed(() => {
  return listStore.selectedHeader;
});

/* validation schema */
const inputValidation = Yup.object().shape({
  site: Yup.string().required("site"),
  equipmentModel: Yup.string().required("model"),
  equipmentNumber: Yup.string().required("equipment"),
  conditionRatingDate: Yup.string().required("Condition Rating Date"),
  interventionStatus: Yup.string().required("intervention-status"),
  followUpPriority: Yup.string().when("interventionStatus", {
    is: "Accepted",
    then: Yup.string().required("follow-up-priority")
  }),
  interventionDiagnostic: Yup.string().when("interventionStatus", {
    is: "Accepted",
    then: Yup.string().required("intervention-description")
  }),
  workOrder: Yup.string().when("interventionStatus", {
    is: "Accepted",
    then: Yup.string().required("work-order")
  })
});

const setOwnerShip = (equipment) => {
  const ownerFind = masterStore.Ownership.find((owner) => {
    return owner.equipmentNumber == equipment
  })
  ownership.value = ownerFind?.ownership ?? ""
  serialNumber.value = ownerFind?.serialNumber ?? ""
}

const setFilterAndGetList = async () => {
  if (formFilter.value.keyPbi != "") {
    const filter = {
      keyPbi: formFilter.value.keyPbi,
    };
    formStore.setFormFilter(filter);
    listStore.setFilter(filter);
    
    await formStore.getDataFromKeyPbi(formFilter.value.keyPbi)

    formDeclineVisibility.value = false
    isFromIconStatus.value = false;
    setOwnerShip(formIntervention.value.equipment)
    tempDeclineReason.value = ""
  }
};

/* handlers */
const isSiteBlank = computed(() => {
  return formIntervention.value.site == ""
})
const isEquipmentModelBlank = computed(() => {
  return formIntervention.value.equipmentModel == ""
})

const debounceGetSiteLookup = debounce((isSearch = false) => {
  formStore.getSiteLookup(isSearch)
}, 300)
const debounceGetEquipmentModelLookup = debounce((isSearch = false) => {
  formStore.getEquipmentModelLookup(isSearch)
}, 300)
const debounceGetEquipmentNumberLookup = debounce(() => {
  formStore.getEquipmentNumberLookup()
}, 300)

const handleSiteChange = (value: string) => {
  formIntervention.value.site = value;
  handleResetError();
  resetListAndForm();
  isSelectedItemHeader.value = false;
  setFilterToSessionStorage(filterList[0]);

  if (value == "") {
    debounceGetSiteLookup();
    handleEquipmentModelChange("");
  }

  debounceGetSiteLookup();
  debounceGetEquipmentModelLookup();
  debounceGetEquipmentNumberLookup();
};

const handleEquipmentModelChange = async (value: string) => {
  formIntervention.value.equipmentModel = value;
  handleResetError();
  resetListAndForm();
  isSelectedItemHeader.value = false;
  setFilterToSessionStorage(filterList[1]);

  if (value == "") handleEquipmentNumberChange("")
  else if (value != "" && isSiteBlank.value) await formStore.getSiteLookup(isSiteBlank.value)

  debounceGetSiteLookup();
  debounceGetEquipmentModelLookup();
  debounceGetEquipmentNumberLookup();
};

const handleEquipmentNumberChange = async (value: string) => {
  formIntervention.value.equipmentNumber = value;
  handleResetError();
  resetListAndForm();
  isSelectedItemHeader.value = false;
  setFilterToSessionStorage(filterList[2]);

  if (value != "") {
    if (isSiteBlank.value) await formStore.getSiteLookup(isSiteBlank.value)
    if (isEquipmentModelBlank.value) await formStore.getEquipmentModelLookup(isEquipmentModelBlank.value)
    formStore.getConditionRatingDateLookup();
  }

  debounceGetSiteLookup();
  debounceGetEquipmentModelLookup();
  debounceGetEquipmentNumberLookup();

  handleConditionRatingDateChange("");
};

const handleConditionRatingDateChange = async (value: string) => {
  handleResetError();
  isSelectedItemHeader.value = false;
  if (value == "") {
    resetListAndForm();
    formIntervention.value.conditionRatingDate = "";
    formIntervention.value.componentHours = "";
    formIntervention.value.interventionReason = "";
    formIntervention.value.conditionRatingSmu = "";
    formIntervention.value.interventionCodeId = "";
  } else {
    formIntervention.value.conditionRatingDate = formStore.conditionRatingDateOption[value].conditionRatingDate;
    formStore.setFormFilter({
      keyPbi: formStore.conditionRatingDateOption[value].keyPbi
    })
    await setFilterAndGetList();
    setHeader(formIntervention.value.interventionStatus == "Accepted");
  }
};

const resetListAndForm = () => {
  listStore.resetAllList();
  formStore.resetFormIntervention();
  formStore.resetGeneric(true)
  resetAllRequiredError()
};

const resetAllRequiredError = () => {
  let errorArray = document.getElementsByClassName("error-label")
  if (errorArray) {
    for (let i = 0; i < errorArray.length; i++) {
      errorArray[i].classList.add("is-hidden")
    }
  }
  errorArray = document.getElementsByClassName("is-input-error")
  if (errorArray) {
    for (let i = 0; i < errorArray.length; i++) {
      errorArray[i].classList.remove("is-input-error")
    }
  }
}

const resetSingleRequiredError = (idName) => {
  let divHtml = document.getElementById(`error-${idName}`)
  if (divHtml) {
    divHtml.classList.add("is-hidden")
  }
  divHtml = document.getElementById(idName)!.getElementsByClassName("el-form-item__content")[0]
  if (divHtml) {
    divHtml.classList.remove("is-input-error")
  }
}

const tempDeclineReason = ref("")

const handleInterventionStatusChange = async (value: string) => {
  resetSingleRequiredError("intervention-status");
  formIntervention.value.interventionStatus = value;

  listStore.setReRenderSelection(false)

  resetAllRequiredError();
  if (value == "Accepted") {
    tempDeclineReason.value = formIntervention.value.declineReason
    formIntervention.value.declineReason = "";
    oldDeclineReason.value = "";
    await formStore.getFollowUpPriorityLookup();
  } else if (value == "Declined") {
    formIntervention.value.declineReason = tempDeclineReason.value
    tempDeclineReason.value = ""
    await handleFollowUpPriorityChange("");
    formStore.resetInterventionWhenStatusIsDeclined();
    const submitButton = document.getElementById('submit-button-container');

    if (selectedHeader.value == "Declined") {
      await listStore.getComponentList()
    }

    nextTick(() => {
      submitButton?.scrollIntoView();
    });
  }
  listStore.setReRenderSelection(true)
};
const handleInterventionDiagnostic = (value: string) => {
  resetSingleRequiredError("intervention-description");
  formIntervention.value.interventionDiagnostic = value;
};
const handleFollowUpPriorityChange = async (value: string) => {
  resetSingleRequiredError("follow-up-priority");
  formIntervention.value.followUpPriority = value;
  if (value == "") {
    formIntervention.value.estimationCompletionDate = "";
  } else {
    await formStore.getEstimationCompletionDate();
  }
};
const handleEstCompletionDateChange = async (value: string) => {
  handleResetError();
  resetSingleRequiredError("estimation-completion-date");
  formIntervention.value.estimationCompletionDate = value;
};
const handleWorkOrder = (value: string) => {
  resetSingleRequiredError("work-order");
  formIntervention.value.workOrder = value;
};

const submitDataIntervention = async () => {
  formDeclineVisibility.value = false;
  formApproveVisibility.value = false;
  formReviseVisibility.value = false;
  swalAlertConfirmation("Are you sure you want to submit?").then(async (res) => {
    if (res.isConfirmed) {
      reRenderSelection.value = false
      reRenderComponentList.value = false
      formStore.updateData(authStore.user.Name, employeeId.value).then(async () => {
        if (!formStore.isError) {
          swalAlertSuccess("Form has been successfully submitted!", "Ok")
            .then(async () => {
              if (formStore.isFromEquipment) {
                router.push(`/ironportal-dashboard/equipment`);
                formStore.setIsFromEquipment(false);
              } else {
                await setFilterAndGetList();
                setHeader(formIntervention.value.interventionStatus == "Accepted")
              }
            });
        } else {
          formStore.setIsError(false)
          swalAlertError(errors.value[0], "Ok")
        }
      })
      reRenderSelection.value = true
      reRenderComponentList.value = true
    }
  });
}

const handleSubmitData = async () => {
  handleResetError();
  await inputValidation.validate(formIntervention.value, {
    abortEarly: false,
  }).catch((error) => {
    formStore.setIsError(true);
    error.errors.forEach((e) => {
      let divHtml = document.getElementById(`error-${e}`)
      if (divHtml) {
        divHtml.classList.remove("is-hidden");
      }
      divHtml = document.getElementById(e)!.getElementsByClassName("el-form-item__content")[0];
      if (divHtml) {
        divHtml.classList.add("is-input-error");
      }
    })
    setTimeout(() => {
      const errorElement = document.getElementById(error.errors[0])
      if (errorElement) {
        errorElement.scrollIntoView({
          behavior: "smooth",
          block: "center"
        })
      }
    }, 100)
  });

  if (isError.value) {
    return
  }

  if (formIntervention.value.interventionStatus == 'Accepted' && !formIntervention.value.interventionHeaderId) {
    await submitDataIntervention()
  } else if (formIntervention.value.interventionStatus == 'Accepted') {
    formReviseVisibility.value = true;
  } else {
    if (formIntervention.value.declineReason && formIntervention.value.interventionHeaderId) {
      oldDeclineReason.value = formIntervention.value.declineReason
    }
    formDeclineVisibility.value = true;
  }
}

const handleSubmitDataDeclineReason = async () => {
  await formStore.updateData(authStore.user.Name, employeeId.value).then(async () => {
    formDeclineVisibility.value = false;
    if (!formStore.isError) {
      swalAlertSuccess("Form has been successfully submitted!", "Ok")
        .then(async () => {
          await setFilterAndGetList();
          setHeader(formIntervention.value.interventionStatus == "Accepted")
        });
    }
  }).catch(async (err) => {
    console.log(err)
  });
  reRenderSelection.value = true
  reRenderComponentList.value = true
}

const handleSubmitDataReviseReason = async () => {
  await formStore.updateData(authStore.user.Name, employeeId.value).then(async () => {
    formReviseVisibility.value = false;
    if (!formStore.isError) {
      swalAlertSuccess("Form has been successfully submitted!", "Ok")
        .then(async () => {
          await setFilterAndGetList();
          setHeader(formIntervention.value.interventionStatus == "Accepted")
        });
    }
  }).catch(async (err) => {
    console.log(err)
  });
  reRenderSelection.value = true
  reRenderComponentList.value = true
}

const onDeclineIconStatusClick = () => {
  oldDeclineReason.value = formIntervention.value.declineReason
  isFromIconStatus.value = true
  formDeclineVisibility.value = true;
}

const onApproveIconStatusClick = () => {
  isFromIconStatus.value = true
  formApproveVisibility.value = true;
}

const onIconRatingDateClick = () => {
  conditionRatingDateVisibility.value = true;
}

const handleResetError = () => {
  formStore.setErrors([] as string[]);
  listStore.setErrors([]);
}

const setDeclineReason = (reason: string) => {
  declineReason.value = reason;
}

const onFormCbmClosed = () => {
  formStore.setFormCbmHeaderVisibility(false);
  formStore.setPsTypeCbm("");
}

/* methods */
const getLocationCode = async (employeeId) => {
  const params = {
    employeeId: employeeId,
    page: "1",
    pageSize: "1",
    ver: "v1"
  };
  try {
    const response: AxiosResponse<ApiResponse<any>> = await ApiService.get(GET_EMPLOYEE_API_URL, "", new URLSearchParams(params).toString());
    return response.data.result.content[0].Location;
  } catch (error) {
    console.log(error);
  }
  return "";
};

const isCannotEditForm = computed(() => {
  return formIntervention.value.interventionStatus == 'Declined' || formIntervention.value.interventionExecutionId > 4;
})

const setDefaultFilterAccordingToLoggedInUserLocationAndSessionStorage = async (loggedInUserLocation = "") => {
  if (employeeId.value) {
    if (loggedInUserLocation && loggedInUserLocation != "AU02") {
      isSiteDisabled.value = true;
    }

    const firstItemOfSessStorage = getFirstArrayItemInSessionStorage(filterList[0].sessionStorageName);
    const userLocation = authStore.user.Location == "Head Office" ? "Blackwater" : authStore.user.Location
    const tempSite = firstItemOfSessStorage || userLocation;
    formIntervention.value.site = tempSite;
    sessionStorage.setItem(filterList[0].sessionStorageName, JSON.stringify([
      tempSite
    ]))
  } else {
    formIntervention.value.site = "Blackwater";
    formIntervention.value.equipmentModel = "930E-4 HPI";
  }

  for (let i = 1; i < filterList.length; i++) {
    const filter = filterList[i];
    const tempValueArray = JSON.parse((sessionStorage.getItem(filter.sessionStorageName)) as string);
    const tempValue = tempValueArray != null && tempValueArray.length > 0 ? tempValueArray[0] : formIntervention.value[filter.name];
    if (tempValue) {
      if (filter.name == "equipmentModel") {
        formIntervention.value.equipmentModel = tempValue;
      } else if (filter.name == "equipmentNumber") {
        formIntervention.value.equipmentNumber = tempValue;
      } else if (filter.name == "componentDescription") {
        formIntervention.value.componentDescription = tempValue;
      }
    }
  }
};

const getFirstArrayItemInSessionStorage = (storageName: string): string => {
  const stringifiedArrayValue = sessionStorage.getItem(storageName)
  if (stringifiedArrayValue && stringifiedArrayValue.length > 0) {
    return JSON.parse(stringifiedArrayValue)[0]
  }
  return ""
}

const setFilterToSessionStorage = (filterDetail: any = null) => {
  if (filterDetail) {
    if (formIntervention.value[filterDetail.name] || formIntervention.value[filterDetail.name] == "") {
      const tempValueFromIntervention = formIntervention.value[filterDetail.name] == "" ? [] : [
        formIntervention.value[filterDetail.name]
      ];
      sessionStorage.setItem(filterDetail.sessionStorageName, JSON.stringify(tempValueFromIntervention));
    }
    return
  }
  filterList.forEach((filter) => {
    if (formIntervention.value[filter.name] || formIntervention.value[filter.name] == "") {
      const tempValueFromIntervention = formIntervention.value[filter.name] == "" ? [] : [
        formIntervention.value[filter.name]
      ];
      sessionStorage.setItem(filter.sessionStorageName, JSON.stringify(tempValueFromIntervention));
    }
  });
};

onBeforeMount(async () => {
  isSelectedItemHeader.value = false;
  formStore.setIsFromIntervention(true);

  try {
    await formStore.getInterventionStatusLookup();
    let loggedInUserLocation = ""
    if (employeeId.value) {
      loggedInUserLocation = await getLocationCode(employeeId.value);
      if (loggedInUserLocation != "AU02") {
        isSiteDisabled.value = true;
      }
    }
    debounceGetSiteLookup()

    if (!formStore.isFromEquipment && !sessionStorage.getItem("formFilter")) {
      await setDefaultFilterAccordingToLoggedInUserLocationAndSessionStorage(loggedInUserLocation);
      debounceGetEquipmentModelLookup()
      if (formIntervention.value.equipmentModel == "") {
        const tempModel = JSON.parse(sessionStorage.getItem("IronPortalDashboardFilter-Model") as string)
        formStore.equipmentModelOption.map((option) => {
          if (option.label == "930E-4 HPI" && (!tempModel || tempModel.length == 0)) {
            formIntervention.value.equipmentModel = "930E-4 HPI";
            sessionStorage.setItem("IronPortalDashboardFilter-Model", JSON.stringify([
              "930E-4 HPI"
            ]));
          }
        });
      }
      debounceGetEquipmentNumberLookup()
      if (formIntervention.value.equipmentNumber != "") await formStore.getConditionRatingDateLookup();
    } else {
      const tempFilterFromEquipment = JSON.parse(sessionStorage.getItem("formFilter")!)
      formStore.setIsFromEquipment(true);
      formStore.setFormFilter(tempFilterFromEquipment);
      sessionStorage.removeItem("formFilter")
      const componentSessionStorage = JSON.parse(sessionStorage.getItem("IronPortalDashboardFilter-Component")!)[0]
      if (componentSessionStorage) listStore.setComponentFromEquipment(componentSessionStorage)

      var interval = setInterval(async () => {
        if (employeeId.value) {
          clearInterval(interval);
          await setFilterAndGetList();
          setHeader(formIntervention.value.interventionStatus == "Accepted" || !formIntervention.value.interventionStatus);
          setFilterToSessionStorage()
        }
      }, 750);
    }
    await listStore.getLookupTypeTask();
    await listStore.getLookupUom();
    await masterStore.getCBMMappingDataFromServer()
    await masterStore.getMasterDataFromServer()
    await masterStore.getCBMMappings();

    window.addEventListener("beforeunload", () => {
      setFilterToSessionStorage()
    });
  } catch (error) {
    console.log(error)
  }
});

const setHeader = async (isAccepted: boolean) => {
  const paramHeader = isAccepted
    ? listStore.mapHeaderFromExecutionIdAndDefectId(formIntervention.value.interventionExecutionId, formIntervention.value.defectStatusId)
    : "Declined"
  if (paramHeader == "Declined") {
    listStore.setSelectedHeader("Declined")
    await listStore.setHeaderDeclined("Declined", 1)
  } else {
    await listStore.setHeaderChange(paramHeader)
  }
}

onUnmounted(async () => {
  formStore.resetFormIntervention();
  listStore.resetAllList();
  formStore.resetGeneric(true)
  await formStore.getFollowUpPriorityLookup();
});

onBeforeRouteLeave((to) => {
  if (!to.fullPath.includes("/ironportal-dashboard/equipment")) {
    formStore.setIsFromIntervention(false);
    formStore.resetFormInterventionAndFilter();
  }
});

const handleHideFormDeclineDialog = () => {
  if (formIntervention.value.declineReason && oldDeclineReason.value) {
    formIntervention.value.declineReason = oldDeclineReason.value;
  }
  isFromIconStatus.value = false;
  formDeclineVisibility.value = false;
}

const handleHideFormApproveDialog = () => {
  isFromIconStatus.value = false;
  formApproveVisibility.value = false;
}

const handleHideFormReviseDialog = () => {
  formReviseVisibility.value = false;
  isFromIconStatus.value = false;
}

const onBackToList = async () => {
  if (employeeId.value) {
    const loggedInUserLocation = await getLocationCode(employeeId.value);
    if (loggedInUserLocation != "AU02") {
      isSiteDisabled.value = true;
      const tempSiteArray = JSON.parse(sessionStorage.getItem(filterList[0].sessionStorageName) as string);
      const tempSite = tempSiteArray != null && tempSiteArray.length > 0 ? tempSiteArray[0] : authStore.user.Location;
      formIntervention.value.site = tempSite;
      const tempSiteForStorage = tempSiteArray != null && tempSiteArray.length > 0 ? tempSiteArray : [
        tempSite
      ];
      sessionStorage.setItem(filterList[0].sessionStorageName, JSON.stringify(tempSiteForStorage))
    }
  } else {
    formIntervention.value.site = "Blackwater";
    formIntervention.value.equipmentModel = "930E-4 HPI";
  }
}
const handleViewDefectIdentified = async (data: DefectDetailParam) => {
  setOwnerShip(formIntervention.value.equipmentNumber)
  const defect = genericDefectDetails.value.find((x) => {
    return x.defectHeaderId == data.defectHeaderId as string
  })
  if (!defect) return
  const detail = defect.detail as IBasicDefect
  if (detail.type == 'NO') {
    defectNoData.value = detail as unknown as IDefectNoDetail
    showDefectNoView.value = true
  } else {
    defectYesData.value = detail as unknown as IDefectYesDetail
    decline.value = {} as Decline
    decline.value.isDecline = data.taskDeclineReason != ""
    decline.value.declineReason = data.taskDeclineReason ?? ""
    decline.value.declineDate = data.taskDeclineDate
    decline.value.declineBy = data.taskDeclineBy
    showDefectYesView.value = true
  }
}
</script>

<style lang="scss" scoped>
.section {
  background-color: #2d2b39;
  width: 95%;
  padding: 30px;
  margin: 20px auto;
  border-radius: 10px;
}
.section-header {
  background-color: #2d2b39;
  width: 95%;
  padding: 10px 30px 30px;
  margin: 20px auto;
  border-radius: 10px;
}
.is-hidden {
  display: none !important;
}
</style>

<style lang="scss">
.iron_portal-intervention {
  .el-form-item {
    margin-bottom: 10px !important;
  }
  .is-input-error {
    border-radius: 0.5rem;
    border: red 2px solid;
  }
}
</style>
