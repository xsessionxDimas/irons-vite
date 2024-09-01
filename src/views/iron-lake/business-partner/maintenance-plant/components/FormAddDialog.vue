<!-- eslint-disable no-undef -->
<template>
    <el-dialog
    v-model="isVisible"
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
              :value="formData.MaintenancePlantId"
              :margin="false"
              placeholder="Add Maintenance Plant ID"
              label="Maintenance Plant ID"
              name="MaintenancePlantId"
              :max="4"
              @handleChange="handleMaintenancePlantChange"
           />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <TextInput
              :value="formData.MaintenancePlantCode"
              placeholder="Add Maintenance Plant Code"
              label="Maintenance Plant Code"
              name="MaintenancePlantCode"
              :max="4"
              @handleChange="handleMaintenancePlantCodeChange"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <TextInput
              :value="formData.MaintenancePlantDescription"
              placeholder="Add Maintenance Plant Description"
              label="Maintenance Plant Desc."
              name="MaintenancePlantDescription"
              :max="30"
              @handleChange="handleMaintenancePlantDescriptionChange"
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
  useMaintenancePlantFormStore
} from "@/store/pinia/iron-lake/business-partner/maintenance-plant/useMaintenancePlantFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/business-partner/maintenance-plant/UpsertItem";
import TextInput from "@/components/inputs/TextInput.vue";
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
const formStore = useMaintenancePlantFormStore();
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

/* methods */
const formReset = () => {
  handleMaintenancePlantChange("");
  handleMaintenancePlantDescriptionChange("");
  handleMaintenancePlantCodeChange("");
  handleStartDateChange("")
  handleEndDateChange("")
}

/* validation schema */
const inputValidation = Yup.object().shape({
  MaintenancePlantId: Yup.string().required("Maintenance Plant is mandatory"),
  MaintenancePlantCode: Yup.string().required("Maintenance Plant Code is mandatory"),
  MaintenancePlantDescription: Yup.string().required("Maintenance Plant Description is mandatory"),
  StartDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  EndDate: Yup.date().required("End Date is mandatory").min(Yup.ref("StartDate"), "End date must be later than start date").typeError("End date must be later than start date").typeError("End Date is mandatory"),
});

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  emits("handle-close", isReload);
}
const handleMaintenancePlantChange = (value: string) => {
  formData.value.MaintenancePlantId = value
}
const handleMaintenancePlantDescriptionChange = (value: string) => {
  formData.value.MaintenancePlantDescription = value
}
const handleMaintenancePlantCodeChange = (value: string) => {
  formData.value.MaintenancePlantCode = value
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
