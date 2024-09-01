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
        :value="formData.site"
        placeholder="Add Site"
        label="Site"
        name="Site"
        :max="10"
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
      <NumberInput
        :value="formData.weight"
        :margin="false"
        placeholder="Add Weight"
        label="Weight"
        name="Weight"
        :max="10"
        @handleChange="handleWeightChange" />
      <DecimalInput
        :value="formData.whPerday"
        placeholder="Add Wh Perday"
        label="Wh Perday"
        name="WhPerday"
        :max="20"
        @handleChange="handleWhPerdayChange" />
      <DecimalInput
        :value="formData.fuelBurn"
        :margin="false"
        placeholder="Add Fuel Burn"
        label="Fuel Burn"
        name="FuelBurn"
        :max="15"
        @handleChange="handleFuelBurnChange" />
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
  useModelWeightFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/model-weight/useModelWeightFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/model-weight/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import DecimalInput from "@/components/inputs/DecimalInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import AutoComplete from "@/components/inputs/v2/AutoComplete.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useModelWeightFormStore();
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
  site: Yup.string().required("Site is mandatory"),
  equipmentModel: Yup.string().required("Equipment Model is mandatory"),
  weight: Yup.number().required("Weight is mandatory").typeError("Weight must be number"),
  whPerday: Yup.string().required("Wh Perday is mandatory").typeError("Wh Perday must be number"),
  fuelBurn: Yup.number().required("Fuel Burn is mandatory").typeError("Fuel Burn must be number"),
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
const handleSiteChange = (value: string) => {
  formData.value.site = value;
};
const handleEquipmentModelChange = (value: string) => {
  formData.value.equipmentModel = value;
};
const handleWeightChange = (value: string) => {
  formData.value.weight = value;
};
const handleWhPerdayChange = (value: string) => {
  formData.value.whPerday = value;
};
const handleFuelBurnChange = (value: string) => {
  formData.value.fuelBurn = value;
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
