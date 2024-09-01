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
        @reset-form="handleResetError"
     />
    </transition>
    <Form id="kt_filter_form" class="row g-9 my-4">
      <AutoComplete
          :value="formData.employeeId"
          :margin="false"
          placeholder="Add Employee Id"
          label="Employee Id"
          name="EmployeeId"
          :max="10"
          :options="formStore.employeeOptions"
          :isDisabled="true" />
      <AutoComplete
          :value="formData.employeeIdDirect"
          placeholder="Add Employee ID Direct"
          label="Employee ID Direct"
          name="EmployeeIdDirect"
          :max="10"
          @handleChange="handleEmployeeIdDirectChange"
          :options="formStore.employeeOptions" />
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
      <SwitchInput
          :value="formData.isActive"
          label="Is Active"
          name="IsActive"
          @handle-change="handleIsActiveChange" />
    </Form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="handleSubmitData"
          :disabled="formStore.loading"
          >Submit</el-button>
        <el-button
          type="secondary"
          @click="handleCloseModal"
          :disabled="formStore.loading"
          >Close</el-button>
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
} from "vue";
import {
  useUserDirectFormStore
} from "@/store/pinia/administration/organization-unit/user-direct/useUserDirectFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/administration/organization-unit/user-direct/UpsertItem";
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import SwitchInput from "@/components/inputs/SwitchInput.vue";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation,
} from "@/core/helpers/sweet-alert";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useUserDirectFormStore();
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

/* validation schema */
const inputValidation = Yup.object().shape({
  employeeIdDirect: Yup.string().required("Employee ID Direct is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End Date is mandatory"),
  isActive: Yup.boolean().required("Is Active is mandatory"),
});

/* methods */
const resetFormValue = () => {
  formData.value.employeeId = "";
  formData.value.employeeIdDirect = "";
  formData.value.startDate = "";
  formData.value.endDate = "";
  formData.value.isActive = true;
};

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetFormValue();
  formStore.resetState();
  handleResetError();
  emits("handle-close", isReload);
};
const handleEmployeeIdDirectChange = (value: string) => {
  formData.value.employeeIdDirect = value;
};
const handleStartDateChange = (value: string) => {
  formData.value.startDate = value;
};
const handleEndDateChange = (value: string) => {
  formData.value.endDate = value;
};
const handleIsActiveChange = (value: boolean) => {
  formData.value.isActive = value;
};
const handleSubmitData = async () => {
  handleResetError();
  await inputValidation
    .validate(formData.value, {
      abortEarly: false,
    })
    .catch((error) => {
      formStore.setErrors(error.errors);
    });
  if (isError.value) return;
  swalAlertConfirmation("Are you sure you want to submit ?").then(async (res) => {
    if (res.isConfirmed) {
      formStore.updateData(authStore.user.Name).then(() => {
        if (!formStore.isError) {
          swalAlertSuccess("Form has been successfully submitted!", "Ok")
            .then(() => {
              handleCloseModal(true);
            });
        }
      });
    }
  });
};
const handleResetError = () => {
  formStore.setErrors([] as string[]);
};
</script>
