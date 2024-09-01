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
        @reset-form="handleResetError"
     />
    </transition>
    <Form id="kt_filter_form" class="row g-9 my-4">
      <TextInput
          :value="formData.model"
          :margin="false"
          placeholder="Add Model"
          label="Model"
          name="Model"
          :max="10"
          :disabled="true"
     />
      <AutoComplete
            :value="formData.psType"
          placeholder="Add Ps Type"
          label="Ps Type"
          name="PsType"
          :max="10"
          @handleChange="handlePsTypeChange"
          :options="formStore.psTypeFormOption"
     />
      <AutoComplete
          :value="formData.locationIdParent"
          placeholder="Add Location Id Parent"
          label="Location Id Parent"
          name="LocationIdParent"
          :max="10"
          @handleChange="handleLocationIdParentChange"
          :options="formStore.locationFormOption"
     />
      <AutoComplete
          :value="formData.taskNumberDetailParent"
          placeholder="Add Task Number Detail Parent"
          label="Task Number Detail Parent"
          name="TaskNumberDetailParent"
          :max="10"
          @handleChange="handleTaskNumberDetailParentChange"
          :options="formStore.taskFormOption"
     />
      <AutoComplete
          :value="formData.locationIdChild"
          placeholder="Add Location Id Child"
          label="Location Id Child"
          name="LocationIdChild"
          :max="10"
          @handleChange="handleLocationIdChildChange"
          :options="formStore.locationFormOption"
     />
      <AutoComplete
          :value="formData.taskNumberDetailChild"
          placeholder="Add Task Number Detail Child"
          label="Task Number Detail Child"
          name="TaskNumberDetailChild"
          :max="10"
          @handleChange="handleTaskNumberDetailChildChange"
          :options="formStore.taskFormOption"
     />
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
          :value="formData.startDate"
          placeholder="Add Start Date"
          label="Start Date"
          name="StartDate"
          @handleChange="handleStartDateChange"
     />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
          :value="formData.endDate"
          placeholder="Add End Date"
          label="End Date"
          name="EndDate"
          @handleChange="handleEndDateChange"
     />
      </div>
    </Form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="handleSubmitData"
          :disabled="formStore.loading"
          >Submit</el-button
        >
        <el-button
          type="secondary"
          @click="handleCloseModal"
          :disabled="formStore.loading"
          >Close</el-button
        >
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
} from "vue";
import {
  useAssignmentLocationCrackFormStore
} from "@/store/pinia/iron-lake/crack-assignment/assignment-location-crack/useAssignmentLocationCrackFormStore";
import {
  useAssignmentLocationCrackListStore
} from "@/store/pinia/iron-lake/crack-assignment/assignment-location-crack/useAssignmentLocationCrackListStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/crack-assignment/assignment-location-crack/UpsertItem";
import TextInput from "@/components/inputs/TextInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation,
} from "@/core/helpers/sweet-alert";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useAssignmentLocationCrackFormStore();
const listStore = useAssignmentLocationCrackListStore();
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
  model: Yup.string().required("Model is mandatory"),
  psType: Yup.string().required("PS Type is mandatory"),
  locationIdParent: Yup.string().required("Location Id Parent is mandatory"),
  taskNumberDetailParent: Yup.string().required("Task Number Detail Parent is mandatory"),
  locationIdChild: Yup.string().required("Location Id Child is mandatory"),
  taskNumberDetailChild: Yup.string().required("Task Number Detail Child is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const resetFormValue = () => {
  formData.value.assignmentLocationCrackId = 0;
  formData.value.model = "";
  formData.value.psType = "";
  formData.value.taskNumberDetailParent = "";
  formData.value.locationIdParent = "";
  formData.value.taskNumberDetailChild = "";
  formData.value.locationIdChild = "";
  formData.value.startDate = "";
  formData.value.endDate = "";
};

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetFormValue();
  formStore.resetState();
  handleResetError();
  emits("handle-close", isReload);
};
const handlePsTypeChange = (value: string) => {
  formData.value.psType = value;
};
const handleTaskNumberDetailParentChange = (value: string) => {
  formData.value.taskNumberDetailParent = value;
};
const handleLocationIdParentChange = (value: string) => {
  formData.value.locationIdParent = value;
};
const handleTaskNumberDetailChildChange = (value: string) => {
  formData.value.taskNumberDetailChild = value;
};
const handleLocationIdChildChange = (value: string) => {
  formData.value.locationIdChild = value;
};
const handleStartDateChange = (value: string) => {
  formData.value.startDate = value;
};
const handleEndDateChange = (value: string) => {
  formData.value.endDate = value;
};
const handleSubmitData = async () => {
  handleResetError();
  await inputValidation
    .validate(formData.value, {
      abortEarly: false,
    })
    .catch((error) => {
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
