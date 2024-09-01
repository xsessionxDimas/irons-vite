<!-- eslint-disable @typescript-eslint/no-unused-vars -->
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
    <Form id="kt_filter_form" class="row g-9 my-4" v-loading="formStore.loading">
      <AutoComplete
        :value="formData.type"
        placeholder="Add Type Category"
        label="Type Category"
        name="Type"
        :max="40"
        :options="formStore.typeOption"
        @handleChange="handleTypeChange" />
      <NumberInput
        :value="formData.sequential"
        placeholder="Add Sequential"
        label="Sequential"
        name="Sequential"
        :max="5"
        @handleChange="handleSequentialChange" />
      <!-- <SelectInput
        :value="formData.operator"
        placeholder="Add Operator"
        label="Operator"
        name="Operator"
        :max="80"
        :options="formStore.operatorOption"
        @handleChange="handleOperatorChange" /> -->
      <NumberInput
        :value="formData.valueMin"
        placeholder="Add Value Min"
        label="Value Min"
        name="ValueMin"
        :max="5"
        @handleChange="handleValueMinChange" />
      <NumberInput
        :value="formData.valueMax"
        placeholder="Add Value Max"
        label="Value Max"
        name="ValueMax"
        :max="5"
        @handleChange="handleValueMaxChange" />
      <SelectInput
        :value="formData.uom"
        placeholder="Add UOM"
        label="UOM"
        name="Uom"
        :max="5"
        :options="formStore.uomOption"
        @handleChange="handleUomChange" />
      <ElementTextInput
        :value="formData.category"
        placeholder="Add Category"
        label="Category"
        name="Category"
        :max="80"
        @handleChange="handleCategoryChange" />
      <!-- <ElementTextInput
        :value="formData.categoryDesc"
        placeholder="Add Category Description"
        label="Category Description"
        name="CategoryDescription"
        :max="80"
        text-input-type="textarea"
        @handleChange="handleCategoryDescChange" /> -->
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
  useComponentCategoryFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-category/useComponentCategoryFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-category/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import ElementTextInput from "@/components/inputs/ElementTextInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useComponentCategoryFormStore();
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
  type: Yup.string().required("Type is mandatory"),
  sequential: Yup.number().nullable().required("Sequential is mandatory"),
  // operator: Yup.string().required("Operator is mandatory"),
  valueMin: Yup.number().nullable().required("Value Min is mandatory"),
  valueMax: Yup.number().nullable().required("Value Max is mandatory"),
  uom: Yup.string().required("UOM is mandatory"),
  category: Yup.string().required("Category is mandatory"),
  // categoryDesc: Yup.string().required("Category Description is mandatory"),
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
const handleTypeChange = (value: string) => {
  formData.value.type = value;
};
const handleSequentialChange = (value: number) => {
  formData.value.sequential = value;
};
const handleOperatorChange = (value: string) => {
  formData.value.operator = value;
};
const handleValueMinChange = (value: number) => {
  formData.value.valueMin = value;
};
const handleValueMaxChange = (value: number) => {
  formData.value.valueMax = value;
};
const handleUomChange = (value: string) => {
  formData.value.uom = value;
};
const handleCategoryChange = (value: string) => {
  formData.value.category = value;
};
const handleCategoryDescChange = (value: string) => {
  formData.value.categoryDesc = value;
};
const handleStartDateChange = (value: string) => {
  formData.value.startDate = value;
};
const handleEndDateChange = (value: string) => {
  formData.value.endDate = value;
};
const handleSubmitData = async () => {
  handleResetError();
  formData.value.sequential = formData.value.sequential === "" ? null : formData.value.sequential;
  formData.value.valueMin = formData.value.valueMin === "" ? null : formData.value.valueMin;
  formData.value.valueMax = formData.value.valueMax === "" ? null : formData.value.valueMax;
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
