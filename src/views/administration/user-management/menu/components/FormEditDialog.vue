<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="Update Data"
    width="60%"
    @close="handleCloseModal()"
  >
    <transition name="fade">
      <ErrorAlert
        v-if="isError"
        :errorMessages="errors"
        @reset-form="handleResetError" />
    </transition>
    <Form id="kt_filter_form" class="row g-4 my-4"  v-loading="formStore.loading">
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <TextInput
          :margin="false"
          :max="50"
          :value="formData.menuName"
          placeholder="Add Menu Name"
          label="Menu Name"
          name="menuName"
          @handle-change="handleMenuNameChange"
        />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <TextInput
          :margin="false"
          :max="40"
          :value="formData.pageName"
          placeholder="Add Page Name"
          label="Page Name"
          name="pageName"
          @handle-change="handlePageNameChange"
        />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <TextInput
          :margin="false"
          :max="10"
          :value="formData.menuType"
          placeholder="Add Menu Type"
          label="Menu Type"
          name="menuType"
          @handle-change="handleMenuTypeChange"
        />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <NumberInput
          :margin="false"
          :max="15"
          :value="formData.level?.toString() ?? ''"
          placeholder="Add Level"
          label="Level"
          name="level"
          @handle-change="handleLevelChange"
        />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <NumberInput
          :margin="false"
          :max="5"
          :value="formData.sequence?.toString() ?? ''"
          placeholder="Add Sequence"
          label="Sequence"
          name="sequence"
          @handle-change="handleSequenceChange"
        />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <SwitchInput
          :value="formData.isChild"
          label="Is Child"
          name="isChild"
          @handle-change="handleIsChildChange"
        />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value="formData.parentId?.toString() ?? ''"
          :options="listStore.parentIdOption"
          placeholder="Add Parent ID"
          label="Parent ID"
          name="parentId"
          @handle-change="handleParentIdChange"
        />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <SwitchInput
          :value="formData.isMenu"
          label="Is Menu"
          name="isMenu"
          @handle-change="handleIsMenuChange"
        />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <TextInput
          :margin="false"
          :max="10"
          :value="formData.section"
          placeholder="Add Section"
          label="Section"
          name="section"
          @handle-change="handleSectionChange"
        />
      </div>
        <div class="col-md-6 fv-row fv-plugins-icon-container">
          <SwitchInput
            :value="formData.isActive"
            label="Is Active"
            name="isActive"
            @handle-change="handleIsActiveChange" />
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
  useMenuFormStore
} from "@/store/pinia/administration/user-management/menu/useMenuFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/administration/user-management/menu/UpsertItem";
import TextInput from "@/components/inputs/TextInput.vue";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import SwitchInput from "@/components/inputs/SwitchInput.vue";
import {
  useMenuListStore
} from "@/store/pinia/administration/user-management/menu/useMenuListStore";
import NumberInput from "@/components/inputs/NumberInput.vue";
import AutoComplete from "@/components/inputs/AutoComplete.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useMenuFormStore();
const authStore = useAuthenticationStore();
const listStore = useMenuListStore();

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
  menuName: Yup.string().required("Menu Name is mandatory"),
  pageName: Yup.string().required("Page Name is mandatory"),
  menuType: Yup.string().required("Menu Type is mandatory"),
  level: Yup.string().required("Level is mandatory"),
  sequence: Yup.string().required("Sequence is mandatory"),
  parentId: Yup.string().required("Parent Id is mandatory"),
  section: Yup.string().required("Section is mandatory"),
});

/* methods */
const resetFormValue = () => {
  formData.value.mdMenuId = 0;
  handleMenuNameChange("")
  handlePageNameChange("")
  handleMenuTypeChange("")
  handleLevelChange(null)
  handleSequenceChange(null)
  handleIsChildChange(false)
  handleParentIdChange(null)
  handleIsMenuChange(false)
  handleSectionChange("")
  formData.value.isActive = true;
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetFormValue();
  handleResetError();
  formStore.resetState();
  emits("handle-close", isReload);
}
const handleMenuNameChange = (value: string) => {
  formData.value.menuName = value
}
const handlePageNameChange = (value: string) => {
  formData.value.pageName = value
}
const handleMenuTypeChange = (value: string) => {
  formData.value.menuType = value
}
const handleLevelChange = (value: number | null) => {
  formData.value.level = value
}
const handleSequenceChange = (value: number | null) => {
  formData.value.sequence = value
}
const handleIsChildChange = (value: boolean) => {
  formData.value.isChild = value
}
const handleParentIdChange = (value: number | null) => {
  formData.value.parentId = value
}
const handleIsMenuChange = (value: boolean) => {
  formData.value.isMenu = value
}
const handleSectionChange = (value: string) => {
  formData.value.section = value
}
const handleIsActiveChange = (value: boolean) => {
  formData.value.isActive = value
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
