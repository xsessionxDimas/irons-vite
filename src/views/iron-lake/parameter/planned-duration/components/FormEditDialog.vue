<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="Update Data"
    width="40%"
    @close="handleCloseModal()"
  >
    <transition name="fade">
      <ErrorAlert
        v-if="isError"
        :errorMessages="errors"
        @reset-form="handleResetError"
     />
    </transition>
    <Form id="kt_filter_form" class="row g-9 my-4" v-loading="formStore.loading">
      <AutoComplete
              :value="formData.model"
              placeholder="Add Model"
              label="Model"
              name="model"
              @handleChange="handleModelChange"
              :options="formStore.modelOption"
            />
            <AutoComplete
              :value="formData.psType"
              placeholder="Add PS Type"
              label="PS Type"
              name="psType"
              @handleChange="handlePsTypeChange"
              :options="formStore.psTypeOption"
            />
            <NumberInput
              :value="formData.value"
              placeholder="Add Value"
              label="Value"
              name="value"
              :max="10"
              @handleChange="handleValueChange"
            />
            <AutoComplete
              :value="formData.uom"
              placeholder="Add UOM"
              label="UOM"
              name="uom"
              @handleChange="handleUomChange"
              :options="formStore.uomOption"
            />
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
        <el-button
          type="primary"
          @click="handleSubmitData"
          :disabled="formStore.loading"
          >Submit</el-button
        >
        <el-button
          type="secondary"
          @click="handleCloseModal"
          :disabled="formStore.loading"
          >Close</el-button
        >
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
} from "vue";
import {
  usePlannedDurationFormStore
} from "@/store/pinia/iron-lake/parameter/planned-duration/usePlannedDurationFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/parameter/planned-duration/UpsertItem";
import NumberInput from "@/components/inputs/NumberInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation,
} from "@/core/helpers/sweet-alert";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = usePlannedDurationFormStore();
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
  psType: Yup.string().required("PS Type is mandatory"),
  model: Yup.string().required("Model is mandatory"),
  uom: Yup.string().required("UOM is mandatory"),
  value: Yup.string().required("Value is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const resetFormValue = () => {
  formData.value.plannedDurationId = 0;
  handleUomChange("")
  handleModelChange("")
  handlePsTypeChange("")
  handleValueChange("")
  handleStartDateChange("")
  handleEndDateChange("")
};

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetFormValue();
  formStore.resetState();
  handleResetError();
  emits("handle-close", isReload);
};
const handleUomChange = (value: string) => {
  formData.value.uom = value
};
const handleModelChange = (value: string) => {
  formData.value.model = value
};
const handlePsTypeChange = (value: string) => {
  formData.value.psType = value
};
const handleValueChange = (value: string) => {
  formData.value.value = value;
};
const handleStartDateChange = (value: string) => {
  formData.value.startDate = value;
};
const handleEndDateChange = (value: string) => {
  formData.value.endDate = value;
};
const handleSubmitData = async () => {
  handleResetError();
  await inputValidation
    .validate(formData.value, {
      abortEarly: false,
    })
    .catch((error) => {
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
