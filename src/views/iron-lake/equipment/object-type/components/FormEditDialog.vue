<!-- eslint-disable no-undef -->
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
            <TextInput
                :value="formData.ObjectType"
                :margin="false"
                placeholder="Add Object Type"
                label="Object Type"
                name="Object Type"
                :disabled="true" />
            <TextInput
                :value="formData.ObjectTypeDescription"
                :margin="false"
                placeholder="Add Object Type Description"
                label="Object Type Desc."
                name="ObjectTypeDescription"
                :max="40"
                @handleChange="handleObjectTypeDescriptionChange" />
            <SwitchInput
                :value="formData.IsActive"
                label="Is Active"
                name="IsActive"
                @handle-change="handleIsActiveChange" />
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
  useObjectTypeFormStore
} from "@/store/pinia/iron-lake/equipment/object-type/useObjectTypeFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/equipment/object-type/UpsertItem";
import TextInput from "@/components/inputs/TextInput.vue";
import SwitchInput from "@/components/inputs/SwitchInput.vue";
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
const formStore = useObjectTypeFormStore();
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
  ObjectTypeDescription: Yup.string().required("Object Type Description is mandatory")
});

/* methods */
const resetFormValue = () => {
  formData.value.ObjectTypeId = 0;
  formData.value.ObjectType = "";
  formData.value.ObjectTypeDescription = "";
  formData.value.IsActive = true;
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetFormValue();
  handleResetError();
  emits("handle-close", isReload);
}
const handleObjectTypeDescriptionChange = (value: string) => {
  formData.value.ObjectTypeDescription = value
}
const handleIsActiveChange = (value: boolean) => {
  formData.value.IsActive = value;
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
</script>
