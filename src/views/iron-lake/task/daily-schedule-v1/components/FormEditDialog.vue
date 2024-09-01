<!-- eslint-disable no-undef -->
<template>
    <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="Edit Data"
    width="60%"
    @close="handleCloseModal()">
        <transition name="fade">
            <ErrorAlert
                v-if="isError"
                :errorMessages="errors"
                @reset-form="handleResetError" />
        </transition>
        <Form id="kt_filter_form" class="row g-4 my-4"  v-loading="formStore.loading">
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
                :value="formData.unitNumber"
                :options="formStore.unitNumberOption"
                label="Unit Number"
                name="unitNumber"
                placeholder="Add Unit Number"
                @handle-change="handleunitNumberChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <NumberInput
                  :value="formData.smuDue"
                  placeholder="Add SMU Due (Hours)"
                  label="SMU Due (Hours)"
                  name="smuDue"
                  :max="10"
                  :margin="false"
                  @handleChange="handlesmuDueChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <NumberInput
                  :value="formData.workOrder"
                  placeholder="Add Work Order"
                  label="Work Order"
                  name="workOrder"
                  :max="10"
                  :margin="false"
                  @handleChange="handleworkOrderChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
                  :value="formData.psType"
                  placeholder="Add Service Size"
                  label="Service Size"
                  name="pS Type"
                  :options="formStore.psTypeOption"
                  @handleChange="handlepsTypeChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="formData.dateService ? formData.dateService.toString() : ''"
                placeholder="Add Planned Service Date"
                label="Planned Service Date"
                name="dateService"
                @handleChange="handledateServiceChange"
              />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
                  :value="formData.shift"
                  placeholder="Add Shift"
                  label="Shift"
                  name="shift"
                  :options="formStore.shiftOption"
                  @handleChange="handleshiftChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="formData.startDate ? formData.startDate.toString() : ''"
                placeholder="Add Start Date"
                label="Start Date"
                name="startDate"
                @handleChange="handlestartDateChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="formData.endDate ? formData.endDate.toString() : ''"
                placeholder="Add End Date"
                label="End Date"
                name="endDate"
                @handleChange="handleendDateChange" />
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
  useDailyScheduleFormStore
} from "@/store/pinia/iron-lake/task/daily-schedule-v1/useDailyScheduleFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/task/daily-schedule-v1/UpsertItem";
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
import {
  substractDynamicDateHelper,
  addDynamicDateHelper
} from "@/core/helpers/date-format"

const disabledDate = {
  from: substractDynamicDateHelper(new Date(), "DD-MM-YYYY", 1, 'days').toString(),
  to: addDynamicDateHelper(new Date(), "DD-MM-YYYY", 14, 'days').toString()
}

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useDailyScheduleFormStore();
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
  unitNumber: Yup.string().required("Unit Number is mandatory"),
  smuDue: Yup.string().required("SMU Due (Hours) is mandatory"),
  workOrder: Yup.string().required("Work Order is mandatory"),
  psType: Yup.string().required("Service Size is mandatory"),
  shift: Yup.string().required("Shift is mandatory"),
  dateService: Yup.date().required("Planned Service Date is mandatory").typeError("Planned Service Date is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const formReset = () => {
  handlesmuDueChange("");
  handlestartDateChange("")
  handleunitNumberChange("")
  handleworkOrderChange("")
  handlepsTypeChange("")
  handledateServiceChange("")
  handleshiftChange("")
  handlestartDateChange("")
  handleendDateChange("")
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  formStore.resetState();
  emits("handle-close", isReload);
}
const handlesmuDueChange = (value: string) => {
  formData.value.smuDue = value
}
const handleunitNumberChange = (value: string) => {
  formData.value.unitNumber = value
}
const handleworkOrderChange = (value: string) => {
  formData.value.workOrder = value
}
const handlepsTypeChange = (value: string) => {
  formData.value.psType = value
}
const handlestartDateChange = (value: string) => {
  formData.value.startDate = value
}
const handledateServiceChange = (value: string) => {
  formData.value.dateService = value
}
const handleshiftChange = (value: string) => {
  formData.value.shift = value
}
const handleendDateChange = (value: string) => {
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
