<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="Update Data"
    width="60%"
    @close="handleCloseModal()"
  >
    <transition name="fade">
      <ErrorAlert
        v-if="isError"
        :errorMessages="errors"
        @reset-form="handleResetError" />
    </transition>
    <Form id="kt_filter_form" class="row g-4 my-4"  v-loading="formStore.loading">
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="formData.MaintenanceStrategyParId"
          label="ID Maintenance Strategy Parent"
          placeholder="Add ID Maintenance Strategy Parent"
          name="MaintenanceStrategyParId"
          :options="listStore.maintenanceStrategyIDOption"
          @handle-change="handleMaintenanceStrategyParIdChange"
        />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="formData.MaintenanceStrategyChdId"
          label="ID Maintenance Strategy Children"
          placeholder="Add ID Maintenance Strategy Children"
          name="MaintenanceStrategyChdId"
          :options="listStore.maintenanceStrategyIDOption"
          @handle-change="handleMaintenanceStrategyChdIdChange"
        />
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
  useMaintenanceStrategyAssignmentFormStore
} from "@/store/pinia/iron-lake/maintenance/maintenance-strategy-assignment/useMaintenanceStrategyAssignmentFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/maintenance/maintenance-strategy-assignment/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import {
  useMaintenanceStrategyAssignmentListStore
} from "@/store/pinia/iron-lake/maintenance/maintenance-strategy-assignment/useMaintenanceStrategyAssignmentListStore";
import AutoComplete from '@/components/inputs/AutoComplete.vue';

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useMaintenanceStrategyAssignmentFormStore();
const authStore = useAuthenticationStore();
const listStore = useMaintenanceStrategyAssignmentListStore();

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
  MaintenanceStrategyParId: Yup.string().required("ID Maintenance Strategy Parent is mandatory"),
  MaintenanceStrategyChdId: Yup.string().required("ID Maintenance Strategy Children is mandatory"),
  StartDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  EndDate: Yup.date().required("End Date is mandatory").min(Yup.ref("StartDate"), "End date must be later than start date").typeError("End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const resetFormValue = () => {
  formData.value.MainStrategyAssignmentId = 0
  handleMaintenanceStrategyChdIdChange("")
  handleMaintenanceStrategyParIdChange("")
  handleStartDateChange("")
  handleEndDateChange("")
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetFormValue();
  handleResetError();
  formStore.resetState();
  emits("handle-close", isReload);
}
const handleMaintenanceStrategyParIdChange = (value: string) => {
  formData.value.MaintenanceStrategyParId = value
}
const handleMaintenanceStrategyChdIdChange = (value: string) => {
  formData.value.MaintenanceStrategyChdId = value
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
}
const handleResetError = () => {
  formStore.setErrors([] as string[]);
}
</script>
