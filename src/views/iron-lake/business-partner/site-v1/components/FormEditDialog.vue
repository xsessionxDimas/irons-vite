<!-- eslint-disable no-undef -->
<template>
    <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="Update Data"
    width="40%"
    @close="handleCloseModal()">
        <transition name="fade">
            <ErrorAlert
                v-if="isError"
                :errorMessages="errors"
                @reset-form="handleResetError" />
        </transition>
        <Form id="kt_filter_form" class="row g-9 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <TextInput
              :value="formData.SiteId"
              :margin="false"
              placeholder="Add Site ID"
              label="Site ID"
              name="SiteId"
              :max="4"
              :disabled="true" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <TextInput
                :value="formData.SiteCode"
                placeholder="Add Site Code"
                label="Site Code"
                name="SiteCode"
                :max="4"
                @handleChange="handleSiteCodeChange" />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <TextInput
              :value="formData.SiteDescription"
              :margin="false"
              placeholder="Add Site Description"
              label="Site Desc."
              name="SiteDescription"
              :max="30"
              @handleChange="handleSiteDescriptionChange" />
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
  useSiteFormStore
} from "@/store/pinia/iron-lake/business-partner/site-v1/useSiteFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/business-partner/site-v1/UpsertItem";
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
const formStore = useSiteFormStore();
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
  SiteDescription: Yup.string().required("Site Description is mandatory"),
  SiteCode: Yup.string().required("Site Code is mandatory"),
  StartDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  EndDate: Yup.date().required("End Date is mandatory").min(Yup.ref("StartDate"), "End date must be later than start date").typeError("End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const resetFormValue = () => {
  formData.value.SiteKeyId = 0;
  formData.value.SiteId = "";
  formData.value.SiteDescription = "";
  handleStartDateChange("");
  handleEndDateChange("");
  handleSiteCodeChange("");
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetFormValue();
  handleResetError();
  formStore.resetState();
  emits("handle-close", isReload);
}
const handleSiteDescriptionChange = (value: string) => {
  formData.value.SiteDescription = value
}
const handleSiteCodeChange = (value: string) => {
  formData.value.SiteCode = value
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
