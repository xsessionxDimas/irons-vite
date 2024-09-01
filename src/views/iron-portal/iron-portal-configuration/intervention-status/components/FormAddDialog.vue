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
    <Form id="kt_filter_form" class="row g-9 my-4"  v-loading="formStore.loading">
      <TextInput
        :value="formData.interventionStatus"
        placeholder="Add Intervention Status"
        label="Intervention Status"
        name="InterventionStatus"
        :max="50"
        @handleChange="handleInterventionStatusChange" />
      <TextInput
        :value="formData.interventionStatusDesc"
        placeholder="Add Intervention Status Description"
        label="Intervention Status Description"
        name="interventionStatusDesc"
        :max="50"
        @handleChange="handleinterventionStatusDescChange" />
      <NumberInput
        :value="formData.followUpPriority"
        placeholder="Add Follow Up Priority"
        label="Follow Up Priority"
        name="FollowUpPriority"
        :max="10"
        @handleChange="handleFollowUpPriorityChange" />
      <AutoComplete
        :value="formData.followUpPriorityUom"
        placeholder="Add Follow Up Priority Uom"
        label="Follow Up Priority Uom"
        name="FollowUpPriority"
        :max="10"
        @handleChange="handleFollowUpPriorityUomChange"
        :options="formStore.followUpPriorityUomOption" />
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
  useInterventionStatusFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/intervention-status/useInterventionStatusFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/intervention-status/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import TextInput from "@/components/inputs/TextInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import AutoComplete from "@/components/inputs/AutoComplete.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useInterventionStatusFormStore();
const authStore = useAuthenticationStore();

/* refs*/
const isVisible = toRef(props, "visibility");
const formData: ComputedRef<UpsertItem> = computed(() => {
  return formStore.formData;
});

const isEdit = computed(() => {
  return formStore.isEdit;
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
  interventionStatus: Yup.string().required("Intervention Status is mandatory"),
  interventionStatusDesc: Yup.string().required("Intervention Status Description is mandatory"),
  // followUpPriority: Yup.string().required("Follow Up Priority is mandatory").nullable(),
  // followUpPriorityUom: Yup.string().required("Follow Up Priority Uom is mandatory").nullable(),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End date must be later than start date"),
});

/* methods */
const formReset = () => {
  handleInterventionStatusChange("");
  handleinterventionStatusDescChange("");
  handleFollowUpPriorityChange("");
  handleFollowUpPriorityUomChange("");
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
const handleInterventionStatusChange = (value: string) => {
  formData.value.interventionStatus = value;
};
const handleinterventionStatusDescChange = (value: string) => {
  formData.value.interventionStatusDesc = value;
};
const handleFollowUpPriorityChange = (value: string) => {
  formData.value.followUpPriority = value;
};
const handleFollowUpPriorityUomChange = (value: string) => {
  formData.value.followUpPriorityUom = value;
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
