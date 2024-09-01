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
        @reset-form="handleResetError" />
    </transition>
    <Form id="kt_filter_form" class="row g-9 my-4">
      <AutoComplete
        :value="formData.site"
        placeholder="Add Site"
        label="Site"
        name="Site"
        :max="4"
        @handleChange="handleSiteChange"
        :options="formStore.siteOption" />
      <AutoComplete
        :value="formData.equipmentModel"
        placeholder="Add Equipment Model"
        label="Equipment Model"
        name="EquipmentModel"
        :max="20"
        @handleChange="handleEquipmentModelChange"
        :options="formStore.equipmentModelOption" />
      <AutoComplete
        :value="formData.componentStatusId"
        placeholder="Add Component Status ID"
        label="Component Status ID"
        name="ComponentStatusId"
        :max="4"
        @handleChange="handleComponentStatusIdChange"
        :options="formStore.componentStatusIdOption" />
      <AutoComplete
        :value="formData.cbmGroup"
        placeholder="Add CBM Group"
        label="CBM Group"
        name="CbmGroup"
        :max="10"
        @handleChange="handleCbmGroupChange"
        :options="formStore.cbmGroupOption" />
      <AutoComplete
        :value="formData.rating"
        placeholder="Add Rating"
        label="Rating"
        name="Rating"
        :max="10"
        @handleChange="handleRatingChange"
        :options="formStore.ratingOption" />
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
  useComponentStatusMappingFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-status-mapping/useComponentStatusMappingFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status-mapping/UpsertItem";
import AutoComplete from "@/components/inputs/AutoComplete.vue";
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
const formStore = useComponentStatusMappingFormStore();
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
  site: Yup.string().required("Site is mandatory"),
  equipmentModel: Yup.string().required("Equipment Model is mandatory"),
  componentStatusId: Yup.string().required("Component Status ID is mandatory"),
  cbmGroup: Yup.string().required("CBM Group is mandatory"),
  rating: Yup.string().required("Rating is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End date must be later than start date"),
});

/* methods */

/* handlers */
const handleCloseModal = (isReload = false) => {
  formStore.resetState();
  handleResetError();
  emits("handle-close", isReload);
};
const handleSiteChange = (value: string) => {
  formData.value.site = value;
};
const handleEquipmentModelChange = (value: string) => {
  formData.value.equipmentModel = value;
};
const handleComponentStatusIdChange = (value: string) => {
  formData.value.componentStatusId = value;
};
const handleCbmGroupChange = (value: string) => {
  formData.value.cbmGroup = value;
};
const handleRatingChange = (value: string) => {
  formData.value.rating = value;
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
