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
          <div class="row g-4 my-4">
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value="formData.userGroupName"
              placeholder="Select User Group Name | User Group Description"
              label="User Group Name"
              name="userGroupName"
              :options="listStore.userGroupIdOption"
              @handle-change="handleUserGroupIDChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value="formData.employeeId"
              placeholder="Select Employee ID | Employee Name"
              label="Employee Name"
              name="employeeId"
              :options="listStore.stateEmployeeIDFormOption"
              @handle-change="handleEmployeeIDChange" />
            </div>
          </div>
          <SwitchInput
                :value="formData.isDeleted"
                label="Is Delete"
                name="isDeleted"
                @handle-change="handleIsDeleteChange" />
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
  useUserGroupMemberFormStore
} from "@/store/pinia/administration/user-management/user-group-member/useUserGroupMemberFormStore";
import {
  useUserGroupMemberListStore
} from '@/store/pinia/administration/user-management/user-group-member/useUserGroupMemberListStore';
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/administration/user-management/user-group-member/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import SwitchInput from "@/components/inputs/SwitchInput.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useUserGroupMemberFormStore();
const listStore = useUserGroupMemberListStore();
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
  userGroupName: Yup.string().required("User Group Name | User Group Description is mandatory"),
  employeeId: Yup.string().required("Employee ID | Employee Name is mandatory"),
});

/* methods */
const resetFormValue = () => {
  handleEmployeeIDChange("");
  handleUserGroupIDChange("");
  handleIsDeleteChange(false)
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetFormValue();
  formStore.resetState();
  handleResetError();
  emits("handle-close", isReload);
}
const handleEmployeeIDChange = (value: string) => {
  formData.value.employeeId = value
}
const handleUserGroupIDChange = (value: string) => {
  formData.value.userGroupName = value
}
const handleIsDeleteChange = (value: boolean) => {
  formData.value.isDeleted = value
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
              handleCloseModal(true)
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
