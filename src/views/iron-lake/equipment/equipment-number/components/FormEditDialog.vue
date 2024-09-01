<template>
    <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="Update Data"
    width="40%"
    @close="handleCloseModal()">
        <transition name="fade">
            <ErrorAlert
                v-if="isError"
                :errorMessages="errors"
                @reset-form="handleResetError" />
        </transition>
        <Form id="kt_filter_form" class="row g-9 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <TextInput
              :value="formData.EquipmentNumber"
              :margin="false"
              placeholder="Add Equipment Number"
              label="Equipment Number"
              name="EquipmentNumber"
              :max="20"
              :disabled="true"
           />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <TextInput
              :value="formData.EquipmentNumberDescription"
              placeholder="Add Equipment Number Description"
              label="Description"
              name="EquipmentNumberDescription"
              :max="40"
              @handleChange="handleEquipmentNumberDescriptionChange"
           />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <TextInput
              :value="formData.SerialNumber"
              placeholder="Add Serial Number"
              label="Serial Number"
              name="SerialNumber"
              :max="20"
              @handleChange="handleSerialNumberChange"
           />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value="formData.Level"
              label="Level"
              name="Level"
              placeholder="Add Level"
              :options="levelOption"
              @handle-change="handleLevelChange"
           />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <DatePickerInput
              :value="formData.StartDate ? formData.StartDate.toString() : ''"
              placeholder="Add Start Date"
              label="Start Date"
              name="StartDate"
              @handleChange="handleStartDateChange"
           />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <DatePickerInput
              :value="formData.EndDate ? formData.EndDate.toString() : ''"
              placeholder="Add End Date"
              label="End Date"
              name="EndDate"
              @handleChange="handleEndDateChange"
           />
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
  computed,
  onMounted
} from 'vue';
import {
  useEquipmentNumberFormStore
} from "@/store/pinia/iron-lake/equipment/equipment-number/useEquipmentNumberFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/equipment/equipment-number/UpsertItem";
import TextInput from "@/components/inputs/TextInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import AutoComplete from "@/components/inputs/AutoComplete.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useEquipmentNumberFormStore();
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
const levelOption = computed(() => {
  return formStore.levelDescOption
})

/* validation schema */
const inputValidation = Yup.object().shape({
  EquipmentNumber: Yup.string().required("Equipment Number is mandatory"),
  EquipmentNumberDescription: Yup.string().required(
    "Equipment Number Description is mandatory",
  ),
  SerialNumber: Yup.string().required("Serial Number Description is mandatory"),
  StartDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  EndDate: Yup.date().required("End Date is mandatory").min(Yup.ref("StartDate"), "End date must be later than start date").typeError("End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const resetFormValue = () => {
  formData.value.EquipmentNumberId = 0;
  handleEquipmentNumberDescriptionChange("");
  handleSerialNumberChange("");
  handleLevelChange("");
  handleStartDateChange("");
  handleEndDateChange("");
}

/* handlers */
const handleCloseModal = () => {
  resetFormValue();
  handleResetError();
  formStore.resetState();
  emits("handle-close", false);
}
const handleEquipmentNumberDescriptionChange = (value: string) => {
  formData.value.EquipmentNumberDescription = value
}
const handleLevelChange = (value: string) => {
  formData.value.Level = value
}
const handleSerialNumberChange = (value: string) => {
  formData.value.SerialNumber = value
}
const handleStartDateChange = (value: string) => {
  formData.value.StartDate = value;
};
const handleEndDateChange = (value: string) => {
  formData.value.EndDate = value;
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
        swalAlertSuccess(
          "Form has been successfully submitted!",
          "Ok",
        ).then(() => {
          resetFormValue();
          handleResetError();
          emits("handle-close", true);
        });
      });
    }
  });
}
const handleResetError = () => {
  formStore.setErrors([] as string[]);
}
onMounted(() => {
  formStore.getLevelLookup()
})
</script>
