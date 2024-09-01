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
        v-if="isError"
        :errorMessages="errors"
        @reset-form="handleResetError" />
    </transition>
    <Form id="kt_filter_form" class="row g-9 my-4" v-loading="formStore.loading">
      <AutoComplete
        :value="formData.equipment"
        label="Equipment"
        name="Equipment"
        placeholder="Add Equipment"
        :options="equipmentOption"
        @handle-change="handleEquipmentChange" />
      <AutoComplete
        :value="formData.characteristicType"
        label="Characteristic Type"
        name="CharacteristicType"
        placeholder="Add Characteristic Type"
        :options="characteristicTypeOption"
        @handle-change="handleCharacteristicTypeChange" />
      <AutoComplete
        v-loading="formStore.characteristicValueOptionLoading"
        :value="formData.characteristicValue"
        label="Characteristic Value"
        name="CharacteristicValue"
        :placeholder="formData.characteristicType == '' ? 'Select Characteristic Type first' : 'Add Characteristic Value'"
        :is-disabled="formData.characteristicType == ''"
        :options="characteristicValueOption"
        @handle-change="handleCharacteristicValueChange" />
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
  useEquipmentCharacteristicValueFormStore
} from "@/store/pinia/iron-lake/equipment/equipment-characteristic-value/useEquipmentCharacteristicValueFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/equipment/equipment-characteristic-value/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useEquipmentCharacteristicValueFormStore();
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
const equipmentOption = computed(() => {
  return formStore.equipmentOption;
});
const characteristicTypeOption = computed(() => {
  return formStore.characteristicTypeOption;
});
const characteristicValueOption = computed(() => {
  return formData.value.characteristicType != "" ? formStore.characteristicValueOption : [];
});

/* validation schema */
const inputValidation = Yup.object().shape({
  equipment: Yup.string().required("Equipment is mandatory"),
  characteristicType: Yup.string().required("Characteristic Type is mandatory"),
  characteristicValue: Yup.string().required("Characteristic Value is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const formReset = () => {
  handleEquipmentChange("");
  handleCharacteristicTypeChange("");
  handleCharacteristicValueChange("");
  handleStartDateChange("");
  handleEndDateChange("");
};

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  formStore.resetState();
  emits("handle-close", isReload);
};
const handleEquipmentChange = (value: string) => {
  formData.value.equipment = value;
};
const handleCharacteristicTypeChange = async (value: string) => {
  formData.value.characteristicType = value;
  formData.value.characteristicValue = ""; // Reset Characteristic Value if Characteristic Type changed
  await formStore.getCharacteristicValueLookup();
};
const handleCharacteristicValueChange = (value: string) => {
  formData.value.characteristicValue = value;
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
