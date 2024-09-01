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
      <AutoComplete
        :value="formData.cbmType"
        placeholder="Add CBM Type"
        label="CBM Type"
        name="CBMType"
        :max="20"
        @handleChange="handleCbmTypeChange"
        :options="formStore.cbmTypeOption" />
      <AutoComplete
        :value="formData.equipmentModel "
        placeholder="Add Model"
        label="Model"
        name="EquipmentModel"
        :max="20"
        @handleChange="handleEquipmentModelChange"
        :options="formStore.equipmentModelOption" />
      <AutoComplete
        :value="formData.component"
        placeholder="Add Component"
        label="Component"
        name="Component"
        :max="20"
        @handleChange="handleComponentChange"
        :options="formStore.componentOption" />
      <DecimalInput
        :value="formData.valueThreshold"
        :margin="false"
        placeholder="Add Value Threshold"
        label="Value Threshold"
        name="ValueThreshold"
        :max="10"
        @handleChange="handleValueThreshold" />
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
  useCbmGapThresholdFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-gap-threshold/useCbmGapThresholdFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-gap-threshold/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import AutoComplete from "@/components/inputs/v2/AutoComplete.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
import DecimalInput from "@/components/inputs/DecimalInput.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useCbmGapThresholdFormStore();
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

const isEdit = computed(() => {
  return formStore.isEdit;
});

/* validation schema */
const inputValidation = Yup.object().shape({
  cbmType: Yup.string().required("CBM Type is mandatory"),
  equipmentModel: Yup.string().required("Model Unit is mandatory"),
  component: Yup.string().required("Component is mandatory"),
  valueThreshold: Yup.number().required("Value Threshold is mandatory").typeError("Value Threshold is mandatory"),
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
const handleEquipmentModelChange = (value: string) => {
  formData.value.equipmentModel = value;
};
const handleCbmTypeChange = (value: string) => {
  formData.value.cbmType = value;
};
const handleValueThreshold = (value: string) => {
  formData.value.valueThreshold = value;
};
const handleComponentChange = (value: string) => {
  formData.value.component = value;
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
