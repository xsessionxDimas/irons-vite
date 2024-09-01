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
        v-if="isError && !isEdit"
        :errorMessages="errors"
        @reset-form="handleResetError" />
    </transition>
    <Form id="kt_filter_form" class="row g-9 my-4" v-loading="formStore.loading">
      <ElementTextInput
        :value="formData.type"
        placeholder="Add Type"
        label="Type"
        name="Type"
        :max="30"
        @handleChange="handleTypeChange" />
      <ElementTextInput
        :value="formData.typeDescription"
        placeholder="Add Type Description"
        label="Type Description"
        name="TypeDescription"
        :max="80"
        @handleChange="handleTypeDescriptionChange" />
      <ElementTextInput
        :value="formData.parameter"
        placeholder="Add Parameter"
        label="Parameter"
        name="Parameter"
        :max="80"
        @handleChange="handleParameterChange" />
      <ElementTextInput
        :value="formData.parameterDescription"
        placeholder="Add Parameter Description"
        label="Parameter Description"
        name="ParameterDescription"
        :max="80"
        @handleChange="handleParameterDescriptionChange" />
      <SelectInput
        :value="formData.parameterGroup"
        placeholder="Add Parameter Group"
        label="Parameter Group"
        name="ParameterGroup"
        :allowCreate="true"
        :defaultFirstOption="true"
        :options="formStore.parameterGroupOption"
        @handleChange="handleParameterGroupChange" />
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
  computed
} from 'vue';
import {
  useTypeFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/type/useTypeFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/type/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import ElementTextInput from "@/components/inputs/ElementTextInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import SelectInput from "@/components/inputs/v2/SelectInputSearch.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useTypeFormStore();
const authStore = useAuthenticationStore();

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
const isEdit = computed(() => {
  return formStore.isEdit;
});

/* validation schema */
const inputValidation = Yup.object().shape({
  type: Yup.string().required("Type is mandatory"),
  typeDescription: Yup.string().required("Type Description is mandatory"),
  parameter: Yup.string().required("Parameter is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End date must be later than start date"),
});

/* methods */

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formStore.resetState();
  emits("handle-close", isReload);
};
const handleTypeChange = (value: string) => {
  formData.value.type = value;
};
const handleTypeDescriptionChange = (value: string) => {
  formData.value.typeDescription = value;
};
const handleParameterChange = (value: string) => {
  formData.value.parameter = value;
};
const handleParameterDescriptionChange = (value: string) => {
  formData.value.parameterDescription = value;
};
const handleParameterGroupChange = (value: string) => {
  formData.value.parameterGroup = value;
};
const handleStartDateChange = (value: string) => {
  formData.value.startDate = value;
};
const handleEndDateChange = (value: string) => {
  formData.value.endDate = value;
};
const handleSubmitData = async () => {
  handleResetError();
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
