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
                :value="formData.Code"
                :margin="false"
                placeholder="Add Code"
                label="Code"
                name="code"
                :max="50"
                :disabled="true" />
            <TextInput
                :value="formData.ValueId"
                placeholder="Add Value ID"
                label="Value ID"
                name="valueId"
                :max="50"
                @handleChange="handleValueIdChange" />
            <TextInput
                :value="formData.ValueEn"
                placeholder="Add Value EN"
                label="Value EN"
                name="valueEn"
                :max="50"
                @handleChange="handleValueEnChange" />
             <DatePickerInput
              :value="(formData.StartDate as Date)"
              placeholder="Select Start Date"
              grid-class="col-md-6"
              label="Start Date"
              name="StartDate"
              @handleChange="handleStartDateChange"
           />
            <DatePickerInput
              :value="(formData.EndDate as Date)"
              placeholder="Select End Date"
              grid-class="col-md-6"
              label="End Date"
              name="EndDate"
              @handleChange="handleEndDateChange"
           />
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
  useLanguageFormStore
} from "@/store/pinia/administration/user-management/language/useLanguageFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/administration/user-management/language/UpsertItem";
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
const formStore = useLanguageFormStore();
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
  ValueId: Yup.string().required("Value ID is mandatory"),
  ValueEn: Yup.string().required("Value EN is mandatory"),
  StartDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory")
    .max(
      Yup.ref('EndDate'),
      () => {
        return "Start Date must be less or equal than End Date"
      }).nullable().default(undefined),
  EndDate: Yup.date().required("End Date is mandatory").nullable().default(undefined)
});

/* methods */
const resetFormValue = () => {
  formData.value.LanguageId = 0;
  formData.value.Code = "";
  formData.value.ValueId = "";
  formData.value.ValueEn = "";
  formData.value.StartDate = "";
  formData.value.EndDate = "";
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetFormValue();
  formStore.resetState();
  handleResetError();
  emits("handle-close", isReload);
}
const handleValueIdChange = (value: string) => {
  formData.value.ValueId = value
}
const handleValueEnChange = (value: string) => {
  formData.value.ValueEn = value
}
const handleStartDateChange = (value: Date) => {
  formData.value.StartDate = value;
}
const handleEndDateChange = (value: Date) => {
  formData.value.EndDate = value;
}
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
          swalAlertSuccess(
            "Form has been successfully submitted!",
            "Ok",
          ).then(() => {
            resetFormValue();
            handleResetError();
            emits("handle-close", true);
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
