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
        <Form id="kt_filter_form" class="row g-9 my-4" v-loading="formStore.loading">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <TextInput
                :value="formData.systemStatus"
                :margin="false"
                placeholder="Add System Status"
                label="System Status"
                name="systemStatus"
                :max="4"
                @handleChange="handleSystemStatusChange" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <TextInput
                :value="formData.status"
                placeholder="Add Status"
                label="Status"
                name="status"
                :max="4"
                @handleChange="handleStatusChange" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <TextInput
                :value="formData.subStatus"
                placeholder="Add Sub Status"
                label="Sub Status"
                name="subStatus"
                :max="4"
                @handleChange="handleSubStatusChange" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container"></div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <DatePickerInput
              :value="formData.startDate ? formData.startDate.toString() : ''"
              placeholder="Add Start Date"
              label="Start Date"
              name="StartDate"
              @handleChange="handleStartDateChange" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <DatePickerInput
              :value="formData.endDate ? formData.endDate.toString() : ''"
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
  useStatusFormStore
} from "@/store/pinia/iron-lake/equipment/status/useStatusFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/equipment/status/UpsertItem";
import TextInput from "@/components/inputs/TextInput.vue";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import DatePickerInput from '@/components/inputs/DatePickerInput.vue';

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useStatusFormStore();
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
  systemStatus: Yup.string().required("System status is mandatory"),
  status: Yup.string().required("Status is mandatory"),
  subStatus: Yup.string().required("Sub status is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const formReset = () => {
  formData.value.statusId = 0;
  handleSystemStatusChange("");
  handleStatusChange("");
  handleStartDateChange("");
  handleEndDateChange("");
  handleSubStatusChange("");
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  formStore.resetState();
  emits("handle-close", isReload);
}
const handleSystemStatusChange = (value: string) => {
  formData.value.systemStatus = value
}
const handleStatusChange = (value: string) => {
  formData.value.status = value
}
const handleSubStatusChange = (value: string) => {
  formData.value.subStatus = value
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
