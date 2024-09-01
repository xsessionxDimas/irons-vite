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
            <TextInput
                :value="formData.Component"
                :margin="false"
                placeholder="Add Component"
                label="Component"
                name="Component"
                :max="20"
                @handleChange="handleComponentChange" />
            <TextInput
                :value="formData.ComponentDescription"
                placeholder="Add Component Description"
                label="Component Desc."
                name="ComponentDescription"
                :max="40"
                @handleChange="handleComponentDescriptionChange" />
            <AutoComplete
                :value="formData.Level"
                placeholder="Add Level"
                label="Level"
                name="Level"
                :options="formStore.stateFormLevelOption"
                @handleChange="handleLevelChange" />
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                  :value="formData.StartDate"
                  placeholder="Add Start Date"
                  label="Start Date"
                  name="StartDate"
                  @handleChange="handleStartDateChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="formData.EndDate"
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
  useComponentFormStore
} from "@/store/pinia/iron-lake/equipment/component/useComponentFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/equipment/component/UpsertItem";
import TextInput from "@/components/inputs/TextInput.vue";
import AutoComplete from "@/components/inputs/AutoComplete.vue"
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
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
const formStore = useComponentFormStore();
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
  Component: Yup.string().required("Component is mandatory"),
  ComponentDescription: Yup.string().required("Component Description is mandatory"),
  Level: Yup.number().typeError("Level must be a number").required("Level is mandatory"),
  StartDate: Yup.date().typeError("Start Date is mandatory").required("Start Date is mandatory"),
  EndDate: Yup.date().typeError("End Date is mandatory").required("End Date is mandatory").min(Yup.ref("StartDate"), "End date must be later than start date"),
});

/* methods */
const formReset = () => {
  handleComponentChange("");
  handleComponentDescriptionChange("");
  handleLevelChange("");
  handleStartDateChange("");
  handleEndDateChange("");
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  formStore.resetState();
  emits("handle-close", isReload);
}
const handleComponentChange = (value: string) => {
  formData.value.Component = value;
}
const handleComponentDescriptionChange = (value: string) => {
  formData.value.ComponentDescription = value;
}
const handleLevelChange = (value: string) => {
  formData.value.Level = value;
}
const handleStartDateChange = (value: string) => {
  formData.value.StartDate = value;
}
const handleEndDateChange = (value: string) => {
  formData.value.EndDate = value;
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
