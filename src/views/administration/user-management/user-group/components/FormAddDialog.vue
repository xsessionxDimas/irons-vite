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
        :value="formData.groupName"
        :margin="false"
        placeholder="Add Group Name"
        label="Group Name"
        name="groupName"
        :max="100"
        @handleChange="handlegroupNameChange" />
      <TextInput
        :value="formData.groupDescription"
        placeholder="Add Group Description"
        label="Group Desc."
        name="groupDescription"
        :max="40"
        @handleChange="handlegroupDescriptionChange" />
      <AutoComplete
        :value="(formData.site as string)"
        :margin="false"
        placeholder="Add Site"
        label="Site"
        name="site"
        :max="4"
        @handleChange="handleSiteChange"
        :options="formStore.siteOption" />
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
  useUserGroupFormStore
} from "@/store/pinia/administration/user-management/user-group/useUserGroupFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/administration/user-management/user-group/UpsertItem";
import TextInput from "@/components/inputs/TextInput.vue";
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
const formStore = useUserGroupFormStore();
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
  groupName: Yup.string().required("Group Name is mandatory"),
  groupDescription: Yup.string().required("Group Description is mandatory"),
  site: Yup.string().required("Site is mandatory"),
});

/* methods */
const formReset = () => {
  handlegroupNameChange("");
  handlegroupDescriptionChange("");
  handleSiteChange("");
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  emits("handle-close", isReload);
}
const handlegroupNameChange = (value: string) => {
  formData.value.groupName = value
}
const handlegroupDescriptionChange = (value: string) => {
  formData.value.groupDescription = value
}
const handleSiteChange = (value: string) => {
  formData.value.site = value
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
