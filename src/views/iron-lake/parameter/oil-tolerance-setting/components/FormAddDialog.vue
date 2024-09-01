<!-- eslint-disable no-undef -->
<template>
    <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="New Data"
    width="60%"
    @close="handleCloseModal()">
        <transition name="fade">
            <ErrorAlert
                v-if="isError"
                :errorMessages="errors"
                @reset-form="handleResetError" />
        </transition>
        <Form id="kt_filter_form" class="row g-4 my-4"  v-loading="formStore.loading">
          <div class="row g-4 my-4">
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <NumberInput
              :value="formData.value"
              placeholder="Add Value"
              :max="10"
              label="Value"
              name="value"
              @handle-change="handleValueChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TextInput
              :value="formData.valueMin"
              placeholder="Add Value Min"
              :max="10"
              label="Value Min"
              name="valueMin"
              @handle-change="handleValueMinChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TextInput
              :value="formData.valueMax"
              placeholder="Add Value Max"
              :max="10"
              label="Value Max"
              name="valueMax"
              @handle-change="handleValueMaxChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value="formData.uom"
              :options="listStore.stateUomOption"
              label="UOM"
              placeholder="Add UOM"
              name="uom"
              @handle-change="handleUomChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="formData.startDate ? formData.startDate.toString() : ''"
                placeholder="Add Start Date"
                label="Start Date"
                name="startDate"
                @handleChange="handleStartDateChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="formData.endDate ? formData.endDate.toString() : ''"
                placeholder="Add End Date"
                label="End Date"
                name="endDate"
                @handleChange="handleEndDateChange" />
            </div>
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
  useOilToleranceSettingFormStore
} from "@/store/pinia/iron-lake/parameter/oil-tolerance-setting/useOilToleranceSettingFormStore";
import {
  useOilToleranceSettingListStore
} from "@/store/pinia/iron-lake/parameter/oil-tolerance-setting/useOilToleranceSettingListStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/parameter/oil-tolerance-setting/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import AutoComplete from '@/components/inputs/AutoComplete.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import NumberInput from '@/components/inputs/NumberInput.vue';

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useOilToleranceSettingFormStore();
const authStore = useAuthenticationStore();
const listStore = useOilToleranceSettingListStore();

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
  value: Yup.string().required("Value is mandatory"),
  valueMin: Yup.string().required("Value Min is mandatory"),
  valueMax: Yup.string().required("Value Max is mandatory"),
  uom: Yup.string().required("UOM is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const formReset = () => {
  handleValueChange("");
  handleValueMinChange("");
  handleValueMaxChange("");
  handleUomChange("");
  handleStartDateChange("");
  handleEndDateChange("");
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  formStore.resetState();
  emits("handle-close", isReload);
}
const handleValueMinChange = (value: string) => {
  formData.value.valueMin = value
}
const handleValueMaxChange = (value: string) => {
  formData.value.valueMax = value
}
const handleValueChange = (value: string) => {
  formData.value.value = value
}
const handleUomChange = (value: string) => {
  formData.value.uom = value
}
const handleStartDateChange = (value: string) => {
  formData.value.startDate = value
}
const handleEndDateChange = (value: string) => {
  formData.value.endDate = value
}
const handleSubmitData = async () => {
  handleResetError();
  await inputValidation.validate(formData.value, {
    abortEarly: false,
  }).catch((error) => {
    formStore.setErrors(error.errors);
  });
  if (isError.value) return;
  swalAlertConfirmation("Are you sure to submit ?").then(async (res) => {
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
