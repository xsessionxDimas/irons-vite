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
                :value="formData.ComponentType"
                :margin="false"
                placeholder="Add Component Type"
                label="Component Type"
                name="ComponentType"
                :max="20"
                @handleChange="handleComponentTypeChange" />
            <TextInput
                :value="formData.ComponentTypeDescription"
                placeholder="Add Component Type Desc"
                label="Component Type Desc"
                name="ComponentTypeDescription"
                :max="40"
                @handleChange="handleComponentTypeDescriptionChange" />
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
  useComponentTypeFormStore
} from "@/store/pinia/iron-lake/equipment/component-type/useComponentTypeFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/equipment/component-type/UpsertItem";
import TextInput from "@/components/inputs/TextInput.vue";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";


const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useComponentTypeFormStore();
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
  ComponentType: Yup.string().required("Component Type is mandatory"),
  ComponentTypeDescription: Yup.string().required("Component Type Desc is mandatory"),
  StartDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  EndDate: Yup.date().required("End Date is mandatory").min(Yup.ref("StartDate"), "End date must be later than start date").typeError("End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const formReset = () => {
  handleComponentTypeChange("");
  handleComponentTypeDescriptionChange("");
  handleStartDateChange("")
  handleEndDateChange("")
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  formStore.resetState()
  emits("handle-close", isReload);
}
const handleComponentTypeChange = (value: string) => {
  formData.value.ComponentType = value
}
const handleComponentTypeDescriptionChange = (value: string) => {
  formData.value.ComponentTypeDescription = value
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
