<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    v-loading="loading"
    title="Update Data"
    width="40%"
    @close="handleCloseModal()"
  >
  <transition name="fade">
    <ErrorAlert
    v-if="isError"
    :errorMessages="errors"
    @reset-form="handleResetError" />
  </transition>
  <h3 v-if="!loading">{{`${groupName} Authorization`}}</h3>
    <Form id="kt_filter_form" class="row g-9 my-4">
      <el-tree
        v-loading="loading"
        ref="treeRef"
        :data="treeMenu"
        show-checkbox
        highlight-current
        :check-strictly="false"
        :indent="20"
        node-key="menuId"
        :default-expand-all="false"
        :default-checked-keys="checkedId"
        :props="defaultProps"
     />
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
  toRef,
  defineProps,
  defineEmits,
  computed,
  ref,
} from 'vue';
import {
  useUserGroupMenuFormStore
} from "@/store/pinia/administration/user-management/user-group-menu/useUserGroupMenuFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { Form } from "vee-validate";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import { ElTree } from 'element-plus';

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  },
  roleName: {
    type: String,
    required: false,
    default: 'Menu',
  }
});
const emits = defineEmits(["handle-close"]);

/* Tree Variables */
const defaultProps = {
  label: 'menuName',
  children: 'subMenu',
}
const treeRef = ref<InstanceType<typeof ElTree>>()

/* stores */
const formStore = useUserGroupMenuFormStore();
const authStore = useAuthenticationStore();

/* refs*/
const isVisible = toRef(props, "visibility");

/* computed */
const errors = computed(() => {
  return formStore.errors;
});

const isError = computed(() => {
  return formStore.isError;
});

const treeMenu = computed(() => {
  return formStore.formData.menu;
});

const checkedId = computed(() => {
  return formStore.checkedMenuIdArray;
});

const loading = computed(() => {
  return formStore.loading;
});

const groupName = computed(() => {
  return formStore.formData.userGroupName
})

/* validation schema */
const resetForm = () => {
  formStore.stateCheckedMenuIdArray = [];
}

/* methods */
const getAllCheckedNodes = () => {
  return treeRef.value!.getCheckedNodes(false, true)
};

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetForm();
  formStore.resetState();
  handleResetError();
  treeRef.value!.setCheckedKeys([], false)
  emits("handle-close", isReload);
}
const handleSubmitData = async () => {
  handleResetError();
  // getAllCheckedNodes()
  swalAlertConfirmation("Are you sure you want to submit ?").then(async (res) => {
    if (res.isConfirmed) {
      formStore.updateData(authStore.user.Name, getAllCheckedNodes()).then(() => {
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
