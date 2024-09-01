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
        :value="formData.componentCode"
        placeholder="Add Component Code"
        label="Component Code"
        name="ComponentCode"
        :max="20"
        @handleChange="handleComponentCodeChange"
        :options="formStore.componentCodeOption" />
      <AutoComplete
        :value="formData.equipmentModel"
        placeholder="Add Equipment Model"
        label="Equipment Model"
        name="EquipmentModel"
        :max="20"
        @handleChange="handleEquipmentModelChange"
        :options="formStore.equipmentModelOption" />
      <TextInput
        :value="formData.modifierCode"
        :margin="false"
        placeholder="Add Modifier Code"
        label="Modifier Code"
        name="ModifierCode"
        :max="10"
        @handleChange="handleModifierCodeChange" />
      <TextInput
        :value="formData.taskType"
        :margin="false"
        placeholder="Add Task Type"
        label="Task Type"
        name="TaskType"
        :max="20"
        @handleChange="handleTaskTypeChange" />
      <TextInput
        :value="formData.strategyTaskDesc"
        :margin="false"
        placeholder="Add Strategy Task Description"
        label="Strategy Task Description"
        name="StrategyTaskDesc"
        :max="10"
        @handleChange="handleStrategyTaskDescriptionChange" />
      <NumberInput
        :value="formData.oemInterval"
        :margin="false"
        placeholder="Add OEM Interval"
        label="OEM Interval"
        name="OemInterval"
        :max="20"
        @handleChange="handleOemIntervalChange" />
      <NumberInput
        :value="formData.percentageOfOem"
        :margin="false"
        placeholder="Add Percent Of OEM"
        label="Percent Of OEM"
        name="PercentageOfOem"
        :max="20"
        @handleChange="handlePercentOfOemChange" />
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
  useComponentStrategyFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-strategy/useComponentStrategyFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-strategy/UpsertItem";
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
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
const formStore = useComponentStrategyFormStore();
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
  componentCode: Yup.string().required("Component Code is mandatory"),
  equipmentModel: Yup.string().required("Equipment Model is mandatory"),
  modifierCode: Yup.string().required("Modifier Code is mandatory"),
  taskType: Yup.string().required("Task Type is mandatory"),
  strategyTaskDesc: Yup.string().required("Strategy Task Description is mandatory"),
  oemInterval: Yup.string().required("OEM Interval is mandatory"),
  percentageOfOem: Yup.string().required("Percent Of Oem is mandatory"),
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
const handleComponentCodeChange = (value: string) => {
  formData.value.componentCode = value;
};
const handleEquipmentModelChange = (value: string) => {
  formData.value.equipmentModel = value;
};
const handleModifierCodeChange = (value: string) => {
  formData.value.modifierCode = value;
};
const handleTaskTypeChange = (value: string) => {
  formData.value.taskType = value;
};
const handleStrategyTaskDescriptionChange = (value: string) => {
  formData.value.strategyTaskDesc = value;
};
const handleOemIntervalChange = (value: string) => {
  formData.value.oemInterval = value;
};
const handlePercentOfOemChange = (value: string) => {
  formData.value.percentageOfOem = value;
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
