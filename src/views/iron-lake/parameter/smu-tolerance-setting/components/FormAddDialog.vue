<!-- eslint-disable no-undef -->
<template>
    <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="New Data"
    width="40%"
    @close="handleCloseModal()">
        <transition name="fade">
            <ErrorAlert
                v-if="isError"
                :errorMessages="errors"
                @reset-form="handleResetError" />
        </transition>
        <Form id="kt_filter_form" class="row g-9 my-4" v-loading="formStore.loading">
            <TextInput
                :value="formData.parameter"
                :margin="false"
                placeholder="Add Parameter"
                label="Parameter"
                name="parameter"
                :max="10"
                @handleChange="handleParameterChange" />
            <TextInput
                :value="formData.valueMin"
                placeholder="Add Value Min"
                label="Value Min"
                name="ValueMin"
                :max="10"
                @handleChange="handleValueMinChange" />
            <TextInput
                :value="formData.ValueMax"
                placeholder="Add Value Max"
                label="Value Max"
                name="Value Max"
                :max="10"
                @handleChange="handleValueMaxChange" />
            <AutoComplete
                :value="formData.Uom"
                placeholder="Add Uom"
                label="Uom"
                name="Uom"
                :max="10"
                @handleChange="handleUomChange"
                :options="listStore.UomFormOption" />
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
  useSmuToleranceSettingFormStore
} from "@/store/pinia/iron-lake/parameter/smu-tolerance-setting/useSmuToleranceSettingFormStore";
import {
  useSmuToleranceSettingListStore
} from "@/store/pinia/iron-lake/parameter/smu-tolerance-setting/useSmuToleranceSettingListStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/parameter/smu-tolerance-setting/UpsertItem";
import TextInput from "@/components/inputs/TextInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import AutoComplete from "@/components/inputs/AutoComplete.vue";
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
const formStore = useSmuToleranceSettingFormStore();
const listStore = useSmuToleranceSettingListStore();
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
  parameter: Yup.number().required("Parameter is mandatory").typeError("Parameter should be number"),
  valueMin: Yup.number().required("Value Min is mandatory").typeError("Value min should be negative or positive number"),
  ValueMax: Yup.number().required("Value Max is mandatory").typeError("Value max should be negative or positive number").min(Yup.ref("valueMin"), "Value max must be bigger than value min"),
  Uom: Yup.string().required("Uom is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const formReset = () => {
  handleParameterChange("");
  handleValueMinChange("");
  handleValueMaxChange("");
  handleUomChange("");
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
const handleParameterChange = (value: string) => {
  formData.value.parameter = value
};
const handleValueMinChange = (value: string) => {
  formData.value.valueMin = value
};
const handleValueMaxChange = (value: string) => {
  formData.value.ValueMax = value
};
const handleUomChange = (e) => {
  formData.value.Uom = e.uomDescription;
  formData.value.uomId = e.masterUomId;
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
};
const handleResetError = () => {
  formStore.setErrors([] as string[]);
};
</script>
