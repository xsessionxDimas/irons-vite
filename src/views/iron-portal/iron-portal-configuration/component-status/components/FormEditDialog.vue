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
        :value="formData.component"
        placeholder="Add Component"
        label="Component"
        name="Component"
        :max="20"
        @handleChange="handleComponentChange"
        :options="formStore.componentOption" />
      <AutoComplete
        :value="formData.sensorData"
        placeholder="Add Sensor Data"
        label="Sensor Data"
        name="SensorData"
        :max="20"
        @handleChange="handleSensorDataChange"
        :options="formStore.sensorDataOption" />
      <AutoComplete
        :value="formData.oilDataS1"
        placeholder="Add Oil Data S1"
        label="Oil Data S1"
        name="OilData1"
        :max="20"
        @handleChange="handleOilData1Change"
        :options="formStore.oilDataS1Option" />
      <AutoComplete
        :value="formData.oilDataS2"
        placeholder="Add Oil Data S2"
        label="Oil Data S2"
        name="OilData2"
        :max="20"
        @handleChange="handleOilData2Change"
        :options="formStore.oilDataS2Option" />
      <AutoComplete
        :value="formData.filterCutS1"
        placeholder="Add Filter Cut S1"
        label="Filter Cut S1"
        name="FilterCut1"
        :max="20"
        @handleChange="handleFilterCut1Change"
        :options="formStore.filterCutS1Option" />
      <AutoComplete
        :value="formData.filterCutS2"
        placeholder="Add Filter Cut S2"
        label="Filter Cut S2"
        name="FilterCut2"
        :max="20"
        @handleChange="handleFilterCut2Change"
        :options="formStore.filterCutS2Option" />
      <AutoComplete
        :value="formData.magPlug"
        placeholder="Add Mag Plug"
        label="Mag Plug"
        name="MagPlug"
        :max="20"
        @handleChange="handleMagPlugChange"
        :options="formStore.magPlugOption" />
      <AutoComplete
        :value="formData.ironFormsCbm"
        placeholder="Add Irom Forms CBM"
        label="Irom Forms CBM"
        name="IromForms"
        :max="20"
        @handleChange="handleIromFormsCbmChange"
        :options="formStore.ironFormsCbmOption" />
      <AutoComplete
        :value="formData.componentStatus"
        placeholder="Add Component Status"
        label="Component Status"
        name="ComponentStatus"
        :max="10"
        @handleChange="handleComponentStatusChange"
        :options="formStore.componentStatusOption" />
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
  useComponentStatusFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-status/useComponentStatusFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status/UpsertItem";
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
const formStore = useComponentStatusFormStore();
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
  component: Yup.string().required("Component is mandatory"),
  sensorData: Yup.string().required("Sensor Data is mandatory"),
  oilDataS1: Yup.string().required("Oil Data S1 is mandatory"),
  oilDataS2: Yup.string().required("Oil Data S2 is mandatory"),
  filterCutS1: Yup.string().required("Filter Cut S1 is mandatory"),
  filterCutS2: Yup.string().required("Filter Cut S2 is mandatory"),
  magPlug: Yup.string().required("Mag Plug is mandatory"),
  ironFormsCbm: Yup.string().required("Iron Forms is mandatory"),
  componentStatus: Yup.string().required("Status is mandatory"),
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
const handleComponentChange = (value: string) => {
  formData.value.component = value;
};
const handleSensorDataChange = (value: string) => {
  formData.value.sensorData = value;
};
const handleOilData1Change = (value: string) => {
  formData.value.oilDataS1 = value;
};
const handleOilData2Change = (value: string) => {
  formData.value.oilDataS2 = value;
};
const handleFilterCut1Change = (value: string) => {
  formData.value.filterCutS1 = value;
};
const handleFilterCut2Change = (value: string) => {
  formData.value.filterCutS2 = value;
};
const handleMagPlugChange = (value: string) => {
  formData.value.magPlug = value;
};
const handleIromFormsCbmChange = (value: string) => {
  formData.value.ironFormsCbm = value;
};
const handleComponentStatusChange = (value: string) => {
  formData.value.componentStatus = value;
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
