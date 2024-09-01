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
            <TextInput
                :value="formData.Company"
                :margin="false"
                placeholder="Add Company"
                label="Company"
                name="Company"
                :max="25"
                :disabled="true" />
            <TextInput
                :value="formData.CompanyDescription"
                :margin="false"
                placeholder="Add Company Description"
                label="Company Desc."
                name="CompanyDescription"
                :max="40"
                @handleChange="handleCompanyDescriptionChange" />
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="formData.StartDate"
                placeholder="Add Start Date"
                label="Start Date"
                name="StartDate"
                @handleChange="handleStartDateChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="formData.EndDate"
                placeholder="Add End Date"
                label="End Date"
                name="EndDate"
                @handleChange="handleEndDateChange" />
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
  useCompanyFormStore
} from "@/store/pinia/iron-lake/business-partner/company/useCompanyFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/business-partner/company/UpsertItem";
import TextInput from "@/components/inputs/TextInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useCompanyFormStore();
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
  CompanyDescription: Yup.string().required("Company Description is mandatory"),
  StartDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  EndDate: Yup.date().required("End Date is mandatory").min(Yup.ref("StartDate"), "End date must be later than start date").typeError("End date must be later than start date"),
});

/* methods */
const resetFormValue = () => {
  formData.value.CompanyId = 0;
  formData.value.Company = "";
  formData.value.CompanyDescription = "";
  formData.value.StartDate = "";
  formData.value.EndDate = "";
};

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetFormValue();
  formStore.resetState();
  handleResetError();
  emits("handle-close", isReload);
};
const handleCompanyDescriptionChange = (value: string) => {
  formData.value.CompanyDescription = value
};
const handleStartDateChange = (value: string) => {
  formData.value.StartDate = value;
};
const handleEndDateChange = (value: string) => {
  formData.value.EndDate = value;
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
