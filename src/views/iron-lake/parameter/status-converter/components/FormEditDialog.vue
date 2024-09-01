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
              :value="formData.statusConverter"
              placeholder="Add Status Converter"
              label="Status Converter"
              name="statusConverter"
              :max="10"
              :margin="false"
              @handleChange="handleStatusConverterChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TextInput
              :value="formData.statusConverterDescription"
              placeholder="Add Status Converter Desc"
              label="Status Converter Description"
              name="statusConverterDescription"
              :max="10"
              :margin="false"
              @handleChange="handleStatusConverterDescChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="formData.startDate ? formData.startDate.toString() : ''"
                placeholder="Add Start Date"
                label="Start Date"
                name="startDate"
                @handleChange="handleStartDateChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="formData.endDate ? formData.endDate.toString() : ''"
                placeholder="Add End Date"
                label="End Date"
                name="endDate"
                @handleChange="handleEndDateChange" />
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
  useStatusConverterFormStore
} from "@/store/pinia/iron-lake/parameter/status-converter/useStatusConverterFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/parameter/status-converter/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import TextInput from '@/components/inputs/TextInput.vue';

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useStatusConverterFormStore();
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
  statusConverter: Yup.string().required("Status Converter is mandatory"),
  statusConverterDescription: Yup.string().required("Status Converter Description is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const resetFormValue = () => {
  formData.value.statusConverterId = "0"
  handleStatusConverterChange("");
  handleStatusConverterDescChange("");
  handleStartDateChange("");
  handleEndDateChange("");
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetFormValue();
  formStore.resetState();
  handleResetError();
  emits("handle-close", isReload);
}
const handleStatusConverterChange = (value: string) => {
  formData.value.statusConverter = value
}
const handleStatusConverterDescChange = (value: string) => {
  formData.value.statusConverterDescription = value
}
const handleStartDateChange = (value: string) => {
  formData.value.startDate = value
}
const handleEndDateChange = (value: string) => {
  formData.value.endDate = value
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
