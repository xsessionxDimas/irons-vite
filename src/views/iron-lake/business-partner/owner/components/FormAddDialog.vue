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
    <Form id="kt_filter_form" class="row g-9 my-4"  v-loading="formStore.loading">
      <AutoComplete
        :value="formData.Owner"
        label="Owner"
        name="Owner"
        placeholder="Add Owner"
        :options="formStore.companyOption"
        @handle-change="handleOwnerChange" />
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
  useOwnerFormStore
} from "@/store/pinia/iron-lake/business-partner/owner/useOwnerFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/business-partner/owner/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useOwnerFormStore();
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
  Owner: Yup.string().required("Owner is mandatory"),
  StartDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  EndDate: Yup.date().required("End Date is mandatory").min(Yup.ref("StartDate"), "End date must be later than start date").typeError("End date must be later than start date"),
});

/* methods */
const formReset = () => {
  handleOwnerChange("");
  handleStartDateChange("");
  handleEndDateChange("");
};

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  formStore.resetState();
  emits("handle-close", isReload);
};
const handleOwnerChange = (value: string) => {
  formData.value.Owner = value;
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
