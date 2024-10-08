<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="Update Data"
    width="60%"
    @close="handleCloseModal()"
  >
    <transition name="fade">
      <ErrorAlert
        v-if="isError"
        :errorMessages="errors"
        @reset-form="handleResetError" />
    </transition>
    <Form id="kt_filter_form" class="row g-4 my-4"  v-loading="formStore.loading">
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <TextInput
          :value="formData.MaintenanceStrategyId"
          :margin="false"
          :max="10"
          label="ID Maintenance Strategy"
          name="MaintenanceStrategyId"
          placeholder="Add Strategy ID"
          @handle-change="handleStrategyIdChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <TextInput
          :value="formData.StrategyCategory"
          :margin="false"
          :max="10"
          label="Strategy Category"
          name="StrategyCategory"
          placeholder="Add Strategy Category"
          @handle-change="handleStrategyCategoryChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <TextInput
          :value="formData.StrategyPackage"
          :margin="false"
          placeholder="Add Strategy Package"
          label="Strategy Package"
          name="StrategyPackage"
          :max="40"
          @handleChange="handleStrategyPackageChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <TextInput
          :value="formData.BudgetLife"
          :margin="false"
          placeholder="Add Budget Life/Cycle"
          label="Budget Life/Cycle"
          name="BudgetLife"
          :max="10"
          @handleChange="handleBudgetLifeChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <Autocomplete
          :value="formData.Uom"
          placeholder="Add UOM"
          label="UOM"
          name="Uom"
          :options="listStore.uomOption"
          @handleChange="handleUomChange" />
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
  useMaintenanceStrategyFormStore
} from "@/store/pinia/iron-lake/maintenance/maintenance-strategy/useMaintenanceStrategyFormStore";
import {
  useMaintenanceStrategyListStore
} from "@/store/pinia/iron-lake/maintenance/maintenance-strategy/useMaintenanceStrategyListStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/maintenance/maintenance-strategy/UpsertItem";
import TextInput from "@/components/inputs/TextInput.vue";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import Autocomplete from "@/components/inputs/AutoComplete.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useMaintenanceStrategyFormStore();
const authStore = useAuthenticationStore();
const listStore = useMaintenanceStrategyListStore();

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
  StrategyCategory: Yup.string().required("Strategy Category is mandatory"),
  StrategyPackage: Yup.string().required("Strategy Package is mandatory"),
  BudgetLife: Yup.string().required("Budget Life/Cycle is mandatory"),
  Uom: Yup.string().required("UOM is mandatory"),
  StartDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  EndDate: Yup.date().required("End Date is mandatory").min(Yup.ref("StartDate"), "End date must be later than start date").typeError("End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const resetFormValue = () => {
  formData.value.MdMaintenanceStrategyId = 0;
  handleStrategyPackageChange("");
  handleStartDateChange("")
  handleStrategyCategoryChange("")
  handleStrategyIdChange("")
  handleBudgetLifeChange("")
  handleUomChange("")
  handleStartDateChange("")
  handleEndDateChange("")
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetFormValue();
  handleResetError();
  formStore.resetState();
  emits("handle-close", isReload);
}
const handleStrategyPackageChange = (value: string) => {
  formData.value.StrategyPackage = value
}
const handleStrategyCategoryChange = (value: string) => {
  formData.value.StrategyCategory = value
}
const handleStrategyIdChange = (value: string) => {
  formData.value.MaintenanceStrategyId = value
}
const handleBudgetLifeChange = (value: string) => {
  formData.value.BudgetLife = value
}
const handleUomChange = (value: string) => {
  formData.value.Uom = value
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
