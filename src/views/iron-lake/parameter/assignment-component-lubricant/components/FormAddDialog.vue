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
            <AutoComplete
              :value="formData.equipmentModel"
              placeholder="Add Equipment Model"
              label="Equipment Model"
              name="equipmentModel"
              @handleChange="handleEquipmentModelChange"
              :options="formStore.equipmentModelOption"
            />
            <AutoComplete
              :value="formData.psType"
              placeholder="Add PS Type"
              label="PS Type"
              name="psType"
              @handleChange="handlePsTypeChange"
              :options="formStore.psTypeOption"
            />
            <AutoComplete
                :value="formData.component"
                placeholder="Add Component Lubricant"
                label="Component Lubricant"
                name="component"
                @handleChange="handleComponentChange"
                :options="formStore.componentOption" />
            <NumberInput
                :value="formData.taskNo"
                placeholder="Add Task No"
                label="Task No"
                name="taskNo"
                :max="10"
                @handleChange="handleTaskNoChange" />
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="formData.startDate"
                placeholder="Add Start Date"
                label="Start Date"
                name="startDate"
                @handleChange="handleStartDateChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="formData.endDate"
                placeholder="Add End Date"
                label="End Date"
                name="endDate"
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
  useAssignmentComponentLubricantFormStore
} from "@/store/pinia/iron-lake/parameter/assignment-component-lubricant/useAssignmentComponentLubricantFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/parameter/assignment-component-lubricant/UpsertItem";
import NumberInput from "@/components/inputs/NumberInput.vue";
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
const formStore = useAssignmentComponentLubricantFormStore();
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
  component: Yup.string().required("Component Lubricant is mandatory"),
  psType: Yup.string().required("PS Type is mandatory"),
  taskNo: Yup.string().required("Task No is mandatory"),
  equipmentModel: Yup.string().required("Equipment Model is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const formReset = () => {
  handleComponentChange("")
  handleEquipmentModelChange("")
  handlePsTypeChange("")
  handleTaskNoChange("")
  handleStartDateChange("")
  handleEndDateChange("")
};

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  formStore.resetState();
  emits("handle-close", isReload);
};
const handleComponentChange = (value: string) => {
  formData.value.component = value
};
const handleEquipmentModelChange = (value: string) => {
  formData.value.equipmentModel = value
};
const handlePsTypeChange = (value: string) => {
  formData.value.psType = value
};
const handleTaskNoChange = (value: string) => {
  formData.value.taskNo = value;
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
