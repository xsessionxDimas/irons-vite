<!-- eslint-disable no-undef -->
<template>
    <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="New Data"
    width="40%"
    @close="handleCloseModal()">
        <transition name="fade">
            <ErrorAlert
                v-if="isError"
                :errorMessages="errors"
                @reset-form="handleResetError" />
        </transition>
        <Form id="kt_filter_form" class="row g-4 my-4"  v-loading="formStore.loading">
            <TextInput
                :value="formData.Shift"
                :margin="false"
                placeholder="Add Shift"
                label="Shift"
                name="Shift"
                :max="10"
                @handleChange="handleShiftChange" />
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TimePickerInput
                  :value="formData.StartHour ? `${formData.StartHour} ${formData.StartHourType}` : ''"
                  placeholder="Add Start Hour"
                  label="Start Hour"
                  name="StartHour"
                  @handleChange="handleStartHourChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TimePickerInput
                  :value="formData.EndHour ? `${formData.EndHour} ${formData.EndHourType}` : ''"
                  placeholder="Add End Hour"
                  label="End Hour"
                  name="EndHour"
                  @handleChange="handleEndHourChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="(formData.StartDate as Date)"
                placeholder="Add Start Date"
                label="Start Date"
                name="StartDate"
                @handleChange="handleStartDateChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="(formData.EndDate as Date)"
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
  watch
} from 'vue';
import {
  useShiftFormStore
} from "@/store/pinia/administration/organization-unit/shift/useShiftFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/administration/organization-unit/shift/UpsertItem";
import TextInput from "@/components/inputs/TextInput.vue";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import TimePickerInput from '@/components/inputs/TimePickerInput.vue';
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";


const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useShiftFormStore();
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
  Shift: Yup.string().required("Shift is mandatory"),
  StartHour: Yup.string().required("Start Hour is mandatory"),
  EndHour: Yup.string().required("End Hour is mandatory"),
  StartDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  EndDate: Yup.date().required("End Date is mandatory").min(Yup.ref("StartDate"), "End date must be later than start date").typeError("End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const formReset = () => {
  handleShiftChange("");
  handleStartHourChange("")
  handleEndHourChange("")
  handleStartDateChange("")
  handleEndDateChange("")
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  formStore.resetState();
  emits("handle-close", isReload);
}
const handleShiftChange = (value: string) => {
  formData.value.Shift = value
}
const handleStartHourChange = (value: string) => {
  if (value) {
    const hourNType = value.split(" ")
    formData.value.StartHour = hourNType[0]
    formData.value.StartHourType = hourNType[1]
  } else {
    formData.value.StartHour = ""
    formData.value.StartHourType = ""
  }
}
const handleEndHourChange = (value: string) => {
  if (value) {
    const hourNType = value.split(" ")
    formData.value.EndHour = hourNType[0]
    formData.value.EndHourType = hourNType[1]
  } else {
    formData.value.EndHour = ""
    formData.value.EndHourType = ""
  }
}
const handleStartDateChange = (value: string) => {
  formData.value.StartDate = value
}
const handleEndDateChange = (value: string) => {
  formData.value.EndDate = value
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
