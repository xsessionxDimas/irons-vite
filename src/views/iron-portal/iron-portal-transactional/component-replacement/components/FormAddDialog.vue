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
    <Form id="kt_filter_form" class="row g-9 my-4"  v-loading="formStore.loading">
      <AutoComplete
        :value="formData.site"
        :isLoading="formLoading.site"
        placeholder="Add Site"
        label="Site"
        name="Site"
        :max="20"
        @handleChange="handleSiteChange"
        :options="formStore.siteOption" />
      <AutoComplete
        :value="formData.model"
        :isLoading="formLoading.model"
        :is-disabled="!formData.site || formData.site == ''"
        placeholder="Add Model"
        label="Model"
        name="EquipmentModel"
        :max="40"
        @handleChange="handleEquipmentModelChange"
        :options="formStore.modelOption" />
      <AutoComplete
        :value="formData.equipment"
        :isLoading="formLoading.equipment"
        :is-disabled="!formData.model || formData.model == ''"
        placeholder="Add Equipment"
        label="Equipment"
        name="EquipmentNumber"
        :max="20"
        @handleChange="handleEquipmentNumberChange"
        :options="formStore.equipmentOption" />
      <AutoComplete
        :value="formData.component"
        :isLoading="formLoading.component"
        :is-disabled="!formData.equipment || formData.equipment == ''"
        placeholder="Add Component"
        label="Component"
        name="Component"
        :max="20"
        @handleChange="handleComponentChange"
        :options="formStore.componentOption" />
      <DatePickerInput
        class="custom-text-input"
        :value="formData.replacementDate"
        label="Replacement Date"
        name="ReplacementDate"
        format-date="DD/MM/YYYY"
        @handleChange="handleReplacementDateChange"
      />
      <NumberInput
        :value="formData.replacementSmu"
        label="Replacement SMU"
        name="ReplacementSmu"
        @handleChange="handleReplacementSmuChange"
      />
      <NumberInput
        :value="formData.frameHours"
        label="Frame Hours"
        name="FrameHours"
        :disabled="true"
      />
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
  useComponentReplacementFormStore
} from "@/store/pinia/iron-portal/iron-portal-transactional/component-replacement/useComponentReplacementFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/component-replacement/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
import ElementTextInput from "@/components/inputs/ElementTextInput.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useComponentReplacementFormStore();
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
const formLoading = computed(() => {
  return formStore.formLoading;
});
const hmoffsetDefault = computed(() => {
  return formStore.hmoffsetDefault;
});

/* validation schema */
const inputValidation = Yup.object().shape({
  site: Yup.string().required("Site is mandatory"),
  model: Yup.string().required("Model is mandatory"),
  equipment: Yup.string().required("Equipment is mandatory"),
  component: Yup.string().required("Component is mandatory"),
  componentAssignmentId: Yup.string().required("Component Assignment ID is mandatory"),
  replacementDate: Yup.date().required("Replacement Date is mandatory").typeError("Replacement Date is mandatory"),
  replacementSmu: Yup.number().required("Replacement SMU is mandatory").typeError("Replacement SMU is mandatory"),
});

/* methods */

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formStore.resetState();
  emits("handle-close", isReload);
};
const handleSiteChange = async (value: string) => {
  formData.value.site = value;
  if (value != "") {
    await formStore.getLookupModel();
  }
  handleEquipmentModelChange("");
};
const handleEquipmentModelChange = async (value: string) => {
  formData.value.model = value;
  if (value != "") {
    await formStore.getHmOffset(formData.value.equipment, false);
    handleReplacementSmuChange(0)
    await formStore.getLookupEquipment();
  }
  handleEquipmentNumberChange("");
};
const handleEquipmentNumberChange = async (value: string) => {
  formData.value.equipment = value;
  if (value != "") {
    await formStore.getLookupComponent();
  }
  handleComponentChange("");
};
const handleComponentChange = (value: string) => {
  formData.value.component = value;
};
const handleReplacementDateChange = (value: string) => {
  formData.value.replacementDate = value;
};
const handleReplacementSmuChange = (value) => {
  formData.value.replacementSmu = value;
  formData.value.frameHours = (parseInt(value) || 0) + hmoffsetDefault.value;
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
