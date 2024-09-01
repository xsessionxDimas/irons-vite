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
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
                :value="formData.Company"
                label="Company"
                name="Company"
                :options="listStore.companyOption"
                placeholder="Add Company"
                @handle-change="handleCompanyChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TextInput
                  :value="formData.EmployeeId"
                  :margin="false"
                  placeholder="Add Employee ID"
                  label="Employee ID"
                  name="EmployeeId"
                  :max="10"
                  @handleChange="handleEmployeeIdChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TextInput
                  :value="formData.Name"
                  :margin="false"
                  placeholder="Add Name"
                  label="Name"
                  name="Name"
                  :max="255"
                  @handleChange="handleNameChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TextInput
                  :value="formData.AdAccount"
                  :margin="false"
                  placeholder="Add Ad Account"
                  label="Ad Account"
                  name="AdAccount"
                  :max="255"
                  @handleChange="handleAdAccountChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TextInput
                  :value="formData.Email"
                  :margin="false"
                  placeholder="Add Email"
                  label="Email"
                  name="Email"
                  :max="255"
                  @handleChange="handleEmailChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <NumberInput
                  :value="formData.Phone"
                  :margin="false"
                  placeholder="Add Phone"
                  label="Phone"
                  name="Phone"
                  :max="15"
                  @handleChange="handlePhoneChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <SelectInput
                  :value="formData.Gender"
                  label="Gender"
                  name="Gender"
                  placeholder="Add Gender"
                  :options="listStore.genderOption"
                  @handle-change="handleGenderChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
                :value="formData.Position"
                label="Position"
                name="Position"
                :options="listStore.positionOption"
                placeholder="Add Position"
                @handle-change="handlePositionChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
                :value="formData.Location"
                label="Location"
                name="Location"
                :options="listStore.locationOption"
                placeholder="Add Location"
                @handle-change="handleLocationChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container"></div>
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
  useEmployeeFormStore
} from "@/store/pinia/administration/organization-unit/employee-v1/useEmployeeFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/administration/organization-unit/employee-v1/UpsertItem";
import TextInput from "@/components/inputs/TextInput.vue";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import NumberInput from '@/components/inputs/NumberInput.vue';
import SelectInput from "@/components/inputs/SelectInput.vue";
import {
  useEmployeeListStore
} from '@/store/pinia/administration/organization-unit/employee-v1/useEmployeeListStore';


const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useEmployeeFormStore();
const listStore = useEmployeeListStore();
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
  Company: Yup.string().required("Company is mandatory"),
  EmployeeId: Yup.string().required("Employee ID is mandatory"),
  Name: Yup.string().required("Name is mandatory"),
  AdAccount: Yup.string().required("Ad Account is mandatory"),
  Email: Yup.string().required("Email is mandatory"),
  Gender: Yup.string().required("Gender is mandatory"),
  Position: Yup.string().required("Position is mandatory"),
  Location: Yup.string().required("Location is mandatory"),
  StartDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  EndDate: Yup.date().required("End Date is mandatory").min(Yup.ref("StartDate"), "End date must be later than start date").typeError("End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const formReset = () => {
  handleEmployeeIdChange("");
  handleStartDateChange("")
  handleCompanyChange("")
  handleNameChange("")
  handleAdAccountChange("")
  handleEmailChange("")
  handlePhoneChange("")
  handleGenderChange("")
  handlePositionChange("")
  handleLocationChange("")
  handleStartDateChange("")
  handleEndDateChange("")
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  emits("handle-close", isReload);
}
const handleEmployeeIdChange = (value: string) => {
  formData.value.EmployeeId = value
}
const handleCompanyChange = (value: string) => {
  formData.value.Company = value
}
const handleNameChange = (value: string) => {
  formData.value.Name = value
}
const handleAdAccountChange = (value: string) => {
  formData.value.AdAccount = value
}
const handleEmailChange = (value: string) => {
  formData.value.Email = value
}
const handlePhoneChange = (value: string) => {
  formData.value.Phone = value
}
const handleGenderChange = (value: string) => {
  formData.value.Gender = value
}
const handlePositionChange = (value: string) => {
  formData.value.Position = value
}
const handleLocationChange = (value: string) => {
  formData.value.Location = value
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
