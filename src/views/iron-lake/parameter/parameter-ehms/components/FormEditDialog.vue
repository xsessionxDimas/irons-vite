<!-- eslint-disable no-undef -->
<template>
    <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="Update Data"
    width="40%"
    @close="handleCloseModal()">
        <transition name="fade">
            <ErrorAlert
                v-if="isError"
                :errorMessages="errors"
                @reset-form="handleResetError" />
        </transition>
        <Form id="kt_filter_form" class="row g-9 my-4">
          <div class="row g-4 my-4">
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TextInput
              :value="formData.CbmParameterId"
              :max="10"
              placeholder="Add ID CBM Parameter"
              label="ID CBM Parameter"
              name="CbmParameterId"
              @handle-change="handleCbmParameterIdChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              placeholder="Add ID Component"
              :value="formData.ComponentId"
              :options="listStore.ComponentOption"
              label="ID Component"
              name="ComponentId"
              @handle-change="handleComponentIdChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value="formData.TypeParameterId"
              :options="listStore.ParameterTypeOption"
              label="Type Parameter"
              placeholder="Add Type Parameter"
              name="TypeParameterId"
              @handle-change="handleParameterTypeChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value="formData.CbmGroup"
              :options="listStore.CbmGroupOption"
              label="CBM Group"
              placeholder="Add CBM Group"
              name="CbmGroup"
              @handle-change="handleCbmGroupChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value="formData.CbmArea"
              :options="listStore.AreaCbmOption"
              label="Area CBM"
              placeholder="Add Area CBM"
              name="CbmArea"
              @handle-change="handleCbmAreaChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value="formData.Model"
              :options="listStore.ModelOption"
              label="Model"
              placeholder="Add Model"
              name="Model"
              @handle-change="handleModelChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value="formData.PsType"
              :options="listStore.PsTypeOption"
              label="PS Type"
              placeholder="Add PS Type"
              name="PsType"
              @handle-change="handlePsTypeChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TextInput
              :value="formData.TaskNumber"
              :max="10"
              label="Task Number"
              placeholder="Add Task Number"
              name="TaskNumber"
              @handle-change="handleTaskNumberChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TextInput
              :value="formData.DetailNumber"
              :max="20"
              label="No Detail"
              placeholder="Add No Detail"
              name="DetailNumber"
              @handle-change="handleDetailNumberChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value="formData.CbmParameter"
              :options="listStore.CbmParameterOption"
              label="CBM Parameter"
              placeholder="Add CBM Parameter"
              name="CbmParameter"
              @handle-change="handleCbmParameterChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <NumberInput
              :value="formData.Parameter"
              label="Parameter"
              placeholder="Add Parameter"
              name="Parameter"
              @handle-change="handleParameterChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TextInput
              :value="formData.ValueMin"
              :max="10"
              label="Value Min"
              placeholder="Add Value Min"
              name="ValueMin"
              @handle-change="handleValueMinChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TextInput
              :value="formData.ValueMax"
              :max="10"
              label="Value Max"
              placeholder="Add Value Max"
              name="ValueMax"
              @handle-change="handleValueMaxChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value="formData.Uom"
              :options="listStore.UomOption"
              label="UOM"
              placeholder="Add UOM"
              name="Uom"
              @handle-change="handleUomChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value="formData.StatusConverter"
              :options="listStore.StatusConverterOption"
              label="Status Converter"
              placeholder="Add Status Converter"
              name="StatusConverter"
              @handle-change="handleStatusConverterChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value="formData.StatusConverterDescription"
              :options="listStore.StatusConverterDescriptionOption"
              label="Status Converter Description"
              placeholder="Add Status Converter Description"
              name="StatusConverterDescription"
              @handle-change="handleStatusConverterDescriptionChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TextInput
              :value="formData.Status"
              :max="10"
              label="Status"
              placeholder="Add Status"
              name="Status"
              @handle-change="handleStatusChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TextInput
              :value="formData.StatusDescription"
              :max="60"
              label="Status Description"
              placeholder="Add Status Description"
              name="StatusDescription"
              @handle-change="handleStatusDescriptionChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="formData.StartDate ? formData.StartDate.toString() : ''"
                placeholder="Add Start Date"
                label="Start Date"
                name="StartDate"
                @handleChange="handleStartDateChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="formData.EndDate ? formData.EndDate.toString() : ''"
                placeholder="Add End Date"
                label="End Date"
                name="EndDate"
                @handleChange="handleEndDateChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <SwitchInput
                :value="formData.IsActive"
                label="Is Active"
                name="isActive"
                @handle-change="handleIsActiveChange"
             />
            </div>
          </div>
        </Form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="handleSubmitData" :disabled="formStore.loading">Submit</el-button>
                <el-button type="secondary" @click="handleCloseModal" :disabled="formStore.loading">Close</el-button>
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
  computed
} from 'vue';
import {
  useParameterEhmsFormStore
} from "@/store/pinia/iron-lake/parameter/parameter-ehms/useParameterEhmsFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/parameter/parameter-ehms/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import TextInput from '@/components/inputs/TextInput.vue';
import NumberInput from '@/components/inputs/NumberInput.vue';
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import AutoComplete from '@/components/inputs/AutoComplete.vue';
import SwitchInput from "@/components/inputs/SwitchInput.vue";
import {
  useParameterEhmsListStore
} from "@/store/pinia/iron-lake/parameter/parameter-ehms/useParameterEhmsListStore";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useParameterEhmsFormStore();
const authStore = useAuthenticationStore();
const listStore = useParameterEhmsListStore();

/* refs*/
const isVisible = toRef(props, "visibility");
const formData: ComputedRef<UpsertItem> = computed(() => {
  return formStore.formData;
});

/* computed */
const errors = computed(() => {
  return formStore.errors;
});

const isError = computed(() => {
  return formStore.isError;
});

/* validation schema */
const inputValidation = Yup.object().shape({
  CbmParameterId: Yup.string().required("Cbm Parameter ID is mandatory"),
  ComponentId: Yup.string().required("Component ID is mandatory"),
  CbmGroup: Yup.string().required("CBM Group is mandatory"),
  CbmArea: Yup.string().required("CBM Area is mandatory"),
  Model: Yup.string().required("Model is mandatory"),
  PsType: Yup.string().required("PS Type is mandatory"),
  TaskNumber: Yup.string().required("Task Number is mandatory"),
  DetailNumber: Yup.string().required("Detail Number is mandatory"),
  CbmParameter: Yup.string().required("CBM Parameter is mandatory"),
  TypeParameterId: Yup.string().required("Type Parameter is mandatory"),
  Parameter: Yup.string().required("Parameter is mandatory"),
  ValueMin: Yup.string().required("Value Min is mandatory"),
  ValueMax: Yup.string().required("Value Max is mandatory"),
  Uom: Yup.string().required("UOM is mandatory"),
  StatusConverter: Yup.string().required("Status Converter is mandatory"),
  StatusConverterDescription: Yup.string().required("Status Converter Description is mandatory"),
  Status: Yup.string().required("Status is mandatory"),
  StatusDescription: Yup.string().required("Status Description is mandatory"),
  StartDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  EndDate: Yup.date().required("End Date is mandatory").min(Yup.ref("StartDate"), "End date must be later than start date").typeError("End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const resetFormValue = () => {
  handleCbmParameterIdChange("")
  handleComponentIdChange("")
  handleCbmGroupChange("")
  handleCbmAreaChange("")
  handleModelChange("")
  handlePsTypeChange("")
  handleTaskNumberChange("")
  handleDetailNumberChange("")
  handleCbmParameterChange("")
  handleParameterChange("")
  handleParameterTypeChange("")
  handleValueMinChange("")
  handleValueMaxChange("")
  handleUomChange("")
  handleStatusConverterChange("")
  handleStatusConverterDescriptionChange("")
  handleStatusChange("")
  handleStatusDescriptionChange("")
  handleStartDateChange("")
  handleEndDateChange("")
  handleIsActiveChange(true)
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetFormValue();
  formStore.resetState();
  handleResetError();
  emits("handle-close", isReload);
}
const handleCbmParameterIdChange = (value: string) => {
  formData.value.CbmParameterId = value
}
const handleComponentIdChange = (value: string) => {
  formData.value.ComponentId = value
}
const handleCbmGroupChange = (value: string) => {
  formData.value.CbmGroup = value
}
const handleCbmAreaChange = (value: string) => {
  formData.value.CbmArea = value
}
const handleModelChange = (value: string) => {
  formData.value.Model = value
}
const handlePsTypeChange = (value: string) => {
  formData.value.PsType = value
}
const handleTaskNumberChange = (value: string) => {
  formData.value.TaskNumber = value
}
const handleDetailNumberChange = (value: string) => {
  formData.value.DetailNumber = value
}
const handleCbmParameterChange = (value: string) => {
  formData.value.CbmParameter = value
}
const handleParameterChange = (value: string) => {
  formData.value.Parameter = value
}
const handleParameterTypeChange = (value: string) => {
  formData.value.TypeParameterId = value
}
const handleValueMinChange = (value: string) => {
  formData.value.ValueMin = value
}
const handleValueMaxChange = (value: string) => {
  formData.value.ValueMax = value
}
const handleUomChange = (value: string) => {
  formData.value.Uom = value
}
const handleStatusConverterChange = (value: string) => {
  formData.value.StatusConverter = value
}
const handleStatusConverterDescriptionChange = (value: string) => {
  formData.value.StatusConverterDescription = value
}
const handleStatusChange = (value: string) => {
  formData.value.Status = value
}
const handleStatusDescriptionChange = (value: string) => {
  formData.value.StatusDescription = value
}
const handleStartDateChange = (value: string) => {
  formData.value.StartDate = value
}
const handleEndDateChange = (value: string) => {
  formData.value.EndDate = value
}
const handleIsActiveChange = (value: boolean) => {
  formData.value.IsActive = value
}
const handleSubmitData = async () => {
  handleResetError();
  await inputValidation.validate(formData.value, {
    abortEarly: false,
  }).catch((error) => {
    formStore.setErrors(error.errors);
  });
  if (isError.value) return;
  swalAlertConfirmation("Are you sure to submit ?").then(async (res) => {
    if (res.isConfirmed) {
      formStore.updateData(authStore.user.Name).then(() => {
        if (!formStore.isError) {
          swalAlertSuccess("Form has been successfully submitted!", "Ok")
            .then(() => {
              handleCloseModal(true)
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
