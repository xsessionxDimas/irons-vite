<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="Delete Data"
    width="40%"
    @close="handleCloseModal()"
  >
    <transition name="fade">
      <ErrorAlert
        v-if="isError"
        :errorMessages="errors"
        @reset-form="handleResetError" />
    </transition>
    <Form id="kt_filter_form" class="row g-9 my-4" v-loading="formStore.loading">
      <AutoComplete
        :value="formDeleteData.component"
        placeholder="Type Component"
        label="Component"
        name="Component"
        :max="20"
        @handleChange="handleComponentChange"
        :options="formStore.componentOption" />
      <AutoComplete
        :value="formDeleteData.componentStatus"
        placeholder="Type Component Status"
        label="Component Status"
        name="ComponentStatus"
        :max="20"
        @handleChange="handleComponentStatusChange"
        :options="formStore.componentStatusOption" />
    </Form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleDeleteData" :disabled="formStore.loading">Delete</el-button>
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
  DeleteItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-status/DeleteItem";
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
const formStore = useComponentStatusFormStore();
const authStore = useAuthenticationStore();

/* refs*/
const isVisible = toRef(props, "visibility");
const formDeleteData: ComputedRef<DeleteItem> = computed(() => {
  return formStore.formDeleteData;
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
  componentStatus: Yup.string().required("Status is mandatory"),
});

/* methods */

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formStore.resetState();
  emits("handle-close", isReload);
};
const handleComponentChange = (value: string) => {
  formDeleteData.value.component = value;
};
const handleComponentStatusChange = (value: string) => {
  formDeleteData.value.componentStatus = value;
};
const handleDeleteData = async () => {
  handleResetError();
  await inputValidation.validate(formDeleteData.value, {
    abortEarly: false,
  }).catch((error) => {
    formStore.setErrors(error.errors);
  });
  if (isError.value) return;
  swalAlertConfirmation("Are you sure you want to delete the data?").then(async (res) => {
    if (res.isConfirmed) {
      formStore.deleteData(authStore.user.Name).then(() => {
        if (!formStore.isError) {
          swalAlertSuccess("Data has been successfully deleted!", "Ok")
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
