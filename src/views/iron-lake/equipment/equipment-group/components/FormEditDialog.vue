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
                :value="formData.EquipmentGroup"
                :margin="false"
                placeholder="Add Equipment Group"
                label="Equipment Group"
                name="Equipment Group"
                :max="20"
                :disabled="true" />
            <TextInput
                :value="formData.EquipmentGroupDescription"
                :margin="false"
                placeholder="Add Equipment Group Description"
                label="Equipment Group Desc."
                name="EquipmentGroupDescription"
                :max="40"
                @handleChange="handleEquipmentGroupDescriptionChange" />
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
  useEquipmentGroupFormStore
} from "@/store/pinia/iron-lake/equipment/equipment-group/useEquipmentGroupFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/equipment/equipment-group/UpsertItem";
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
const formStore = useEquipmentGroupFormStore();
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
  EquipmentGroupDescription: Yup.string().required("Equipment Group Description is mandatory")
});

/* methods */
const resetFormValue = () => {
  formData.value.EquipmentGroupId = 0;
  formData.value.EquipmentGroup = "";
  formData.value.EquipmentGroupDescription = "";
  formData.value.IsActive = true;
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetFormValue();
  handleResetError();
  emits("handle-close", isReload);
}
const handleEquipmentGroupDescriptionChange = (value: string) => {
  formData.value.EquipmentGroupDescription = value
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
