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
      <AutoComplete
        :value="formData.objectType"
        placeholder="Add Object Type"
        label="Object Type"
        name="ObjectType"
        :max="4"
        @handleChange="handleObjectTypeChange"
        :options="formStore.objectTypeOption" />
      <AutoComplete
        :value="formData.codeGroup"
        placeholder="Add Code Group"
        label="Code Group"
        name="CodeGroup"
        :max="10"
        @handleChange="handleCodeGroupChange"
        :options="formStore.codeGroupOption" />
      <AutoComplete
        :value="formData.damageCategory"
        placeholder="Add DamageCategory"
        label="Damage Category"
        name="DamageCategory"
        :max="10"
        @handleChange="handleDamageCategoryChange"
        :options="formStore.damageCategoryOption" />
      <AutoComplete
        :value="formData.damage"
        placeholder="Add Damage"
        label="Damage"
        name="Damage"
        :max="10"
        @handleChange="handleDamageChange"
        :options="formStore.damageOption" />
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
  useEquipmentConfigInIronPortalFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/equipment-config-in-iron-portal/useEquipmentConfigInIronPortalFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/equipment-config-in-iron-portal/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import AutoComplete from "@/components/inputs/AutoComplete.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useEquipmentConfigInIronPortalFormStore();
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
  objectType: Yup.string().required("Object Type is mandatory"),
  codeGroup: Yup.string().required("Code Group is mandatory"),
  damage: Yup.string().required("Damage is mandatory"),
  damageCategory: Yup.string().required("Damage Category is mandatory"),
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
const handleObjectTypeChange = (value: string) => {
  formData.value.objectType = value;
};
const handleCodeGroupChange = (value: string) => {
  formData.value.codeGroup = value;
};
const handleDamageChange = (value: string) => {
  formData.value.damage = value;
};
const handleDamageCategoryChange = (value: string) => {
  formData.value.damageCategory = value;
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
