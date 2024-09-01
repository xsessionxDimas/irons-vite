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
        :value="formData.site"
        :isLoading="formLoading.site"
        placeholder="Add Site"
        label="Site"
        name="Site"
        :max="20"
        @handleChange="handleSiteChange"
        :options="formStore.siteOption" />
      <AutoComplete
        :value="formData.equipmentModel"
        :isLoading="formLoading.equipmentModel"
        :is-disabled="!formData.site || formData.site == ''"
        placeholder="Add Model"
        label="Model"
        name="EquipmentModel"
        :max="40"
        @handleChange="handleEquipmentModelChange"
        :options="formStore.equipmentModelOption" />
      <AutoComplete
        :value="formData.equipmentNumber"
        :isLoading="formLoading.equipmentNumber"
        :is-disabled="!formData.equipmentModel || formData.equipmentModel == ''"
        placeholder="Add Equipment"
        label="Equipment"
        name="EquipmentNumber"
        :max="20"
        @handleChange="handleEquipmentNumberChange"
        :options="formStore.equipmentNumberOption" />
      <AutoComplete
        :value="formData.component"
        :isLoading="formLoading.component"
        :is-disabled="!formData.equipmentNumber || formData.equipmentNumber == ''"
        placeholder="Add Component"
        label="Component"
        name="Component"
        :max="20"
        @handleChange="handleComponentChange"
        :options="formStore.componentOption" />
      <NumberInput
        :value="formData.smu"
        label="SMU"
        placeholder="Add SMU"
        name="Smu"
        :max="20"
        @handleChange="handleSmuChange" />
      <NumberInput
        :value="formData.counterReading"
        :margin="false"
        placeholder="Add Component Life"
        label="Component Life"
        name="CounterReading"
        :max="20"
        @handleChange="handleCounterReadingChange" />
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
  useCounterReadingFormStore
} from "@/store/pinia/iron-portal/iron-portal-transactional/counter-reading/useCounterReadingFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-transactional/counter-reading/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useCounterReadingFormStore();
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
const formLoading = computed(() => {
  return formStore.formLoading;
});

/* validation schema */
const inputValidation = Yup.object().shape({
  site: Yup.string().required("Site is mandatory"),
  equipmentModel: Yup.string().required("Model is mandatory"),
  equipmentNumber: Yup.string().required("Equipment is mandatory"),
  component: Yup.string().required("Component is mandatory"),
  smu: Yup.string().required("SMU is mandatory"),
  counterReading: Yup.string().required("Component Life is mandatory"),
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
const handleSiteChange = async (value: string) => {
  formData.value.site = value;
  if (value != "") {
    await formStore.getLookupEquipmentModel();
  }
  handleEquipmentModelChange("");
};
const handleEquipmentModelChange = async (value: string) => {
  formData.value.equipmentModel = value;
  if (value != "") {
    await formStore.getLookupEquipmentNumber();
  }
  handleEquipmentNumberChange("");
};
const handleEquipmentNumberChange = async (value: string) => {
  formData.value.equipmentNumber = value;
  if (value != "") {
    await formStore.getLookupComponent();
  }
  handleComponentChange("");
};
const handleComponentChange = (value: string) => {
  formData.value.component = value;
};
const handleSmuChange = (value: string) => {
  formData.value.smu = value;
};
const handleCounterReadingChange = (value: string) => {
  formData.value.counterReading = value;
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
