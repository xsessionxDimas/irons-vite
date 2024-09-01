<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="New Data"
    width="40%"
    @close="handleCloseModal()"
  >
    <transition name="fade">
      <ErrorAlert
        v-if="isError"
        :errorMessages="errors"
        @reset-form="handleResetError" />
    </transition>
    <Form class="row g-9 my-4"  v-loading="formStore.loading">
      <AutoComplete
        :value="formData.cbmType"
        placeholder="Add CBM Type"
        label="CBM Type"
        name="cbmType"
        @handleChange="handleCbmTypeChange"
        :options="formStore.cbmTypeOption" />
      <AutoComplete
        :value="formData.equipmentModel"
        placeholder="Add Equipment Model"
        label="Equipment Model"
        name="EquipmentModel"
        @handleChange="handleEquipmentModelChange"
        :options="formStore.equipmentModelOption" />
      <AutoComplete
        :value="formData.component"
        placeholder="Add Component"
        label="Component"
        name="Component"
        @handleChange="handleComponentChange"
        :options="formStore.componentOption" />
      <AutoComplete
        v-if="stateCondition === 1"
        :value="formData.parameterTo"
        :margin="false"
        placeholder="Add Parameter To"
        label="Parameter To"
        name="parameterTo"
        :options="formStore.parameterToOption"
        @handleChange="handleParameterToChange" />
      <ComponentTo
          v-if="stateCondition === 2 || stateCondition === 3"
          :isDisabled="!checkedParameterTo"
          :value="formData.parameterTo"
          :value-checkbox="checkedParameterTo"
          :margin="false"
          placeholder="Add Parameter To"
          label="Parameter To"
          name="parameterTo"
          :options="formStore.parameterToOption"
          @handleChange="handleParameterToChange"
          @handleChangeCheckbox="handleChangeCheckboxParameterTo"
          />
      <TextInput
        :value="formData.interventionCode"
        :margin="false"
        placeholder="Add Intervention Code"
        label="Intervention Code"
        name="InterventionCode"
        @handleChange="handleInterventionCodeChange" />
      <AutoComplete
        :value="formData.sampleStatus"
        placeholder="Add Sample Status"
        label="Sample Status"
        name="SampleStatus"
        @handleChange="handleSampleStatusChange"
        :options="formStore.sampleStatusOption" />
      <NumberInput
        :value="formData.sequence"
        :margin="false"
        placeholder="Add Sequence"
        label="Sequence"
        name="Sequence"
        @handleChange="handleSequenceChange" />
      <TextInput
        :value="formData.subTask"
        :margin="false"
        placeholder="Add Sub Task"
        label="Subtask"
        name="Subtask"
        @handleChange="handleSubtaskChange" />
      <TextInput
        :value="formData.recAction"
        :margin="false"
        placeholder="Add Rec Action"
        label="Rec Action"
        name="RecAction"
        :max="1000"
        @handleChange="handleRecActionChange" />
      <SwitchInput
        :value="formData.isAutoFill"
        label="Auto Fill"
        name="AutoFill"
        @handle-change="handleAutoFillChange"/>
      <SwitchInput
        :value="formData.isUom"
        label="Is Uom"
        name="isUom"
        @handle-change="handleIsUomChange"/>
      <AutoComplete
        :value="formData.uom"
        :margin="false"
        placeholder="Add Uom"
        label="uom"
        name="uom"
        @handleChange="handleUomChange"
        :options="formStore.uomOption" />
      <SelectInput
        :value="formData.referenceDocument"
        :margin="false"
        placeholder="Add Reference Document"
        label="Reference Document"
        name="referenceDocument"
        @handleChange="handleReferenceDocumentChange"
        :options="formStore.referenceDocumentOption" />
      <AutoComplete
        :value="formData.psType"
        :margin="false"
        placeholder="Add Ps Type"
        label="Ps Type"
        name="PsType"
        @handleChange="handlePsTypeChange"
        :options="formStore.statePsTypeOption" />
        <AutoComplete
          v-if="formStore.taskGroupKeyOption.length > 0"
          :value="formData.taskGroupKey"
          :margin="false"
          placeholder="Add Task Group Key"
          label="Task Group Key"
          name="taskGroupKey"
          :options="formStore.taskGroupKeyOption"
          @handleChange="handleTaskGroupKeyChange" />
        <TextInput
          v-else
          :value="formData.taskGroupKey"
          :margin="false"
          placeholder="Add Task Group Key"
          label="Task Group Key"
          name="taskGroupKey"
          @handleChange="handleTaskGroupKeyChange" />
        <AutoComplete
          v-if="formStore.taskKeyOption.length > 0"
          :value="formData.taskKey"
          :margin="false"
          placeholder="Add Task Key"
          label="Task Key"
          name="taskKey"
          :options="formStore.taskKeyOption"
          @handleChange="handleTaskKeyChange"/>
        <TextInput
          v-else
          :value="formData.taskKey"
          :margin="false"
          placeholder="Add Task Key"
          label="Task Key"
          name="taskKey"
          @handleChange="handleTaskKeyChange"/>
      <AutoComplete
        :value="formData.typeTask"
        :margin="false"
        placeholder="Add Type Task"
        label="Type Task"
        name="TypeTask"
        @handleChange="handleTypeTaskChange"
        :options="formStore.typeTaskOption" />
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
          :value="formData.startDate"
          placeholder="Add Start Date"
          label="Start Date"
          name="StartDate"
          @handleChange="handleStartDateChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
          :value="formData.endDate"
          placeholder="Add End Date"
          label="End Date"
          name="EndDate"
          @handleChange="handleEndDateChange" />
      </div>
    </Form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmitData"  :disabled="formStore.loading">Submit</el-button>
        <el-button type="secondary" @click="handleCloseModal"  :disabled="formStore.loading">Close</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed,
  ref
} from 'vue';
import {
  useRecommendedActionFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/recommended-action/useRecommendedActionFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/recommended-action/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import TextInput from "@/components/inputs/TextInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import AutoComplete from "@/components/inputs/v2/AutoComplete.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import SwitchInput from "@/components/inputs/SwitchInput.vue";
import ComponentTo from "./ComponentTo.vue"

import useConditionState from '../composeable/useConditionState'


const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useRecommendedActionFormStore();
const authStore = useAuthenticationStore();

/* refs*/
const isVisible = toRef(props, "visibility");
const formData: ComputedRef<UpsertItem> = computed(() => {
  return formStore.formData;
});

const checkedParameterTo = ref<boolean>(false);

const { stateCondition, calStateCondition } = useConditionState();

/* computed */
const errors = computed(() => {
  return formStore.errors;
});
const isError = computed(() => {
  return formStore.isError;
});

const isDataReqIntCode = computed(() => {
  return formData.value.equipmentModel && formData.value.component && (formData.value.parameterTo || (stateCondition.value !== 1 && checkedParameterTo.value))
})

/* validation schema */
const validationCase1 = Yup.object().shape({
  interventionCode: Yup.string().nullable().required("Intervention Code is mandatory"),
  equipmentModel: Yup.string().required("Equipment Model is mandatory"),
  component: Yup.string().required("Component is mandatory"),
  recAction: Yup.string().required("Rec Action is mandatory"),
  sampleStatus: Yup.string().required("Sample Status is mandatory"),
  sequence: Yup.string().required("Sequence is mandatory"),
  referenceDocument: Yup.string().required("Reference Document is mandatory"),
  cbmType: Yup.string().required("CBM Type is mandatory"),
  parameterTo: Yup.string().required("Parameter To is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End date must be later than start date"),
});
const validationCase2 = Yup.object().shape({
  interventionCode: Yup.string().nullable().required("Intervention Code is mandatory"),
  equipmentModel: Yup.string().required("Equipment Model is mandatory"),
  component: Yup.string().required("Component is mandatory"),
  recAction: Yup.string().required("Rec Action is mandatory"),
  referenceDocument: Yup.string().required("Reference Document is mandatory"),
  sampleStatus: Yup.string().required("Sample Status is mandatory"),
  sequence: Yup.string().required("Sequence is mandatory"),
  cbmType: Yup.string().required("CBM Type is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End date must be later than start date"),
});

/* methods */
const formReset = () => {
  handleInterventionCodeChange("");
  handleEquipmentModelChange("");
  handleComponentChange("");
  handleCbmTypeChange("");
  handleRecActionChange("");
  handleSampleStatusChange("");
  handleSequenceChange("");
  handleSubtaskChange("");
  handleIsUomChange(true);
  handleUomChange("");
  handleAutoFillChange(true);
  handleTypeTaskChange("");
  handleStartDateChange("");
  handleEndDateChange("");
  handleParameterToChange("");
  handlePsTypeChange("");
  handleTaskGroupKeyChange("");
  handleTaskKeyChange("");
};

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  formStore.resetState();
  emits("handle-close", isReload);
};

const handleChangeCheckboxParameterTo = async (value: boolean) => {
  checkedParameterTo.value = value;
  formData.value.parameterTo = ''
  formData.value.interventionCode = ''
  await formStore.getLookupTaskGroupAndKey(formData.value.equipmentModel, formData.value.component, formData.value.parameterTo);
}

const handleInterventionCodeChange = (value: string) => {
  formData.value.interventionCode = value;
};
const handleEquipmentModelChange = async (value: string) => {
  formData.value.equipmentModel = value;
  if (value) {
    if (isDataReqIntCode.value) {
      const equipmentModel = stateCondition.value === 1 ? formData.value.equipmentModel : "";
      await formStore.getLookupInterventionCode(equipmentModel, formData.value.component, formData.value.parameterTo);
    }
    await formStore.getLookupTaskGroupAndKey(formData.value.equipmentModel, formData.value.component, formData.value.parameterTo);
  }
};
const handleComponentChange = async (value: string) => {
  formData.value.component = value;
  if (value) {
    if (isDataReqIntCode.value) {
      const equipmentModel = stateCondition.value === 1 ? formData.value.equipmentModel : "";
      await formStore.getLookupInterventionCode(equipmentModel, formData.value.component, formData.value.parameterTo);
    }
    await formStore.getLookupTaskGroupAndKey(formData.value.equipmentModel, formData.value.component, formData.value.parameterTo);
  }
};
const handleCbmTypeChange = async (value: string) => {
  formData.value.cbmType = value;
  formData.value.parameterTo = ""
  calStateCondition(value);
  if (value) {
    await formStore.getLookupParameterTo(value);
  }
};
const handleRecActionChange = (value: string) => {
  formData.value.recAction = value;
};
const handleSampleStatusChange = (value: string) => {
  formData.value.sampleStatus = value;
};
const handleSequenceChange = (value: string) => {
  formData.value.sequence = value;
};
const handleSubtaskChange = (value: string) => {
  formData.value.subTask = value;
};
const handleAutoFillChange = (value: boolean) => {
  formData.value.isAutoFill = value;
};
const handleIsUomChange = (value: boolean) => {
  formData.value.isUom = value;
};
const handleUomChange = (value: string) => {
  formData.value.uom = value;
};
const handleReferenceDocumentChange = (value: string) => {
  formData.value.referenceDocument = value;
};
const handleTypeTaskChange = (value: string) => {
  formData.value.typeTask = value;
};
const handleParameterToChange = async (value: string) => {
  formData.value.parameterTo = value;
  if (value) {
    if (isDataReqIntCode.value) {
      const equipmentModel = stateCondition.value === 1 ? formData.value.equipmentModel : "";
      await formStore.getLookupInterventionCode(equipmentModel, formData.value.component, formData.value.parameterTo);
    }
    await formStore.getLookupTaskGroupAndKey(formData.value.equipmentModel, formData.value.component, formData.value.parameterTo);
  }
};
const handlePsTypeChange = (value: string) => {
  formData.value.psType = value;
};
const handleTaskGroupKeyChange = (value: string) => {
  formData.value.taskGroupKey = value;
};
const handleTaskKeyChange = (value: string) => {
  formData.value.taskKey = value;
};
const handleStartDateChange = (value: string) => {
  formData.value.startDate = value;
};
const handleEndDateChange = (value: string) => {
  formData.value.endDate = value;
};
const handleSubmitData = async () => {
  handleResetError();
  let inputValidation = validationCase1
  switch (stateCondition.value) {
    case 1:
      inputValidation = validationCase1;
      break;
    case 2:
    case 3:
      inputValidation = validationCase2;
      if (!checkedParameterTo.value) {
        handleParameterToChange("");
      }
      break;
    default:
      inputValidation = validationCase1
      break;
  }
  await inputValidation.validate(formData.value, {
    abortEarly: false,
  }).catch((error) => {
    formStore.setErrors(error.errors);
  });
  if (isError.value) return;
  swalAlertConfirmation("Are you sure you want to submit ?").then(async (res) => {
    if (res.isConfirmed) {
      formStore.insertData(authStore.user.Name).then(() => {
        if (!formStore.isError) {
          swalAlertSuccess("Form has been successfully submitted!", "Ok")
            .then(() => {
              handleCloseModal(true);
            });
        }
      });
    }
  });
}
const handleResetError = () => {
  formStore.setErrors([] as string[]);
}
</script>
