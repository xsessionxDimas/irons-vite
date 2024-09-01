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
        <Form id="kt_filter_form" class="row g-9 my-4"  v-loading="formStore.loading">
            <TextInput
                :value="formData.Position"
                :margin="false"
                placeholder="Add Position"
                label="Position"
                name="Position"
                :max="40"
                @handleChange="handlePositionChange" />
            <TextInput
                :value="formData.PositionDescription"
                placeholder="Add Position Description"
                label="Position Desc."
                name="PositionDescription"
                :max="40"
                @handleChange="handlePositionDescriptionChange" />
            <DatePickerInput
              :value="(formData.StartDate as unknown  as Date)"
              placeholder="Select Start Date"
              grid-class="col-md-6"
              label="Start Date"
              name="StartDate"
              @handleChange="handleStartDateChange"
           />
            <DatePickerInput
              :value="(formData.EndDate as unknown as Date)"
              placeholder="Select End Date"
              grid-class="col-md-6"
              label="End Date"
              name="EndDate"
              @handleChange="handleEndDateChange"
           />
           <SwitchInput
              :value="formData.IsDma"
              label="Is DMA"
              name="IsDma"
              @handle-change="handleIsDmaChange" />
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
  usePositionFormStore
} from "@/store/pinia/administration/organization-unit/position/usePositionFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/administration/organization-unit/position/UpsertItem";
import TextInput from "@/components/inputs/TextInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import SwitchInput from "@/components/inputs/SwitchInput.vue";
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
const formStore = usePositionFormStore();
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
  Position: Yup.string().required("Position is mandatory"),
  PositionDescription: Yup.string().required("Position Description is mandatory"),
  StartDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory")
    .max(
      Yup.ref('EndDate'),
      () => {
        return "Start Date must be less or equal than End Date"
      }).nullable().default(undefined),
  EndDate: Yup.date().required("End Date is mandatory").nullable().default(undefined)
});

/* methods */
const formReset = () => {
  handlePositionChange("");
  handlePositionDescriptionChange("");
  handleStartDateChange(null);
  handleEndDateChange(null);
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  formStore.resetState();
  emits("handle-close", isReload);
}
const handlePositionChange = (value: string) => {
  formData.value.Position = value
}
const handlePositionDescriptionChange = (value: string) => {
  formData.value.PositionDescription = value
}
const handleIsDmaChange = (value: boolean) => {
  formData.value.IsDma = value
}
const handleStartDateChange = (value: Date | null) => {
  formData.value.StartDate = value as unknown as string;
}
const handleEndDateChange = (value: Date | null) => {
  formData.value.EndDate = value as unknown as string;
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
