<template>
  <el-dialog
    v-model="isVisible"
    modal-class="modal-component_replacement"
    title="Component Replacement"
    width="50%"
    @open="openModal"
    @close="closeModal"
  >
    <div v-if="!isFormShowed">
      <Grid
        :data="componentReplacementList"
        :loading="loading"
        :loadingMapping="loadingMapping"
        @showFormEdit="showFormEdit"
      />
    </div>
    <div v-else class="form-component_replacement">
      <div class="px-8 py-10" v-loading="loading" element-loading-background="#2d2b39b3">
        <el-row :gutter="50">
          <el-col :span="12">
            <ElementTextInput
              labelClass="text-white"
              :value="formEdit.site"
              label="Site"
              name="Site"
              :disabled="true"
            />
            <ElementTextInput
              labelClass="text-white"
              :value="formEdit.equipment"
              label="Equipment"
              name="Equipment"
              :disabled="true"
            />
            <DatePickerInput
              class="custom-text-input"
              labelClass="text-white"
              :value="formEdit.replacementDate"
              label="Replacement Date"
              name="ReplacementDate"
              format-date="DD/MM/YYYY"
              @handleChange="handleReplacementDateChange"
            />
            <ElementTextInput
              labelClass="text-white"
              :value="formEdit.frameHours"
              label="Frame Hours"
              name="FrameHours"
              :disabled="true"
            />
          </el-col>
          <el-col :span="12">
            <ElementTextInput
              labelClass="text-white"
              :value="formEdit.model"
              label="Model"
              name="Model"
              :disabled="true"
            />
            <ElementTextInput
              labelClass="text-white"
              :value="formEdit.component"
              label="Component"
              name="Component"
              :disabled="true"
            />
            <NumberInput
              labelClass="text-white"
              :value="formEdit.replacementSmu"
              label="Replacement SMU"
              name="ReplacementSmu"
              @handleChange="handleReplacementSmuChange"
            />
          </el-col>
        </el-row>
      </div>
    </div>
    <transition name="fade">
      <ErrorAlert
        v-if="isError"
        :errorMessages="errors"
        @reset-form="handleResetError" />
    </transition>
    <template #footer>
      <div class="dialog-footer" v-if="isFormShowed">
        <el-button @click="cancelEdit" :disabled="loading">Cancel</el-button>
        <el-button type="primary" @click="finishEdit" :disabled="loading">
          {{ formEdit.componentReplacementId == 0 ? "Add" : "Save" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang='ts' setup>
import {
  defineProps,
  defineEmits,
  toRef,
  ref,
  computed
} from "vue";
import * as Yup from "yup";
import { swalAlertSuccessAutoClose } from "@/core/helpers/sweet-alert";

// UI Components
import Grid from "./Grid.vue";
import ElementTextInput from "@/components/inputs/ElementTextInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";

// Stores
import {
  useComponentReplacementStore
} from "@/store/pinia/iron-portal/dashboard/pbi-equipment/component-replacement/useComponentReplacementStore"
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";

const props = defineProps({
  visibility: {
    type: Boolean,
    required: false,
  },
  equipment: {
    type: String,
    required: true,
  },
  component: {
    type: String,
    required: true,
  },
})
const emits = defineEmits(['onClose'])

const isFormShowed = ref(false);

const authStore = useAuthenticationStore();
const componentReplacementStore = useComponentReplacementStore();

// Computed
const loading = computed(() => {
  return componentReplacementStore.loading;
});
const loadingMapping = computed(() => {
  return componentReplacementStore.loadingMapping;
});
const hmoffsetDefault = computed(() => {
  return componentReplacementStore.hmoffsetDefault;
});
const formEdit = computed(() => {
  return componentReplacementStore.formEdit;
});
const componentReplacementList = computed(() => {
  return componentReplacementStore.componentReplacementList;
});
const errors = computed(() => {
  return componentReplacementStore.errors;
});
const isError = computed(() => {
  return componentReplacementStore.isError;
});

/* validation schema */
const inputValidation = Yup.object().shape({
  replacementDate: Yup.date().required("Replacement Date is mandatory").typeError("Replacement Date is mandatory"),
  replacementSmu: Yup.string().required("Replacement SMU is mandatory").typeError("Replacement SMU is mandatory"),
});

const showFormEdit = async (row) => {
  componentReplacementStore.resetFormEdit();
  if (row) {
    componentReplacementStore.setFormEditFromRow(row);
  } else {
    componentReplacementStore.setFormEditFromGetParam();
  }
  await componentReplacementStore.getHmOffset(formEdit.value.equipment, (row ? true : false));
  isFormShowed.value = true;
}
const handleReplacementDateChange = (value) => {
  formEdit.value.replacementDate = value;
}
const handleReplacementSmuChange = (value) => {
  formEdit.value.replacementSmu = value;
  formEdit.value.frameHours = (parseInt(value) || 0) + hmoffsetDefault.value;
}
const finishEdit = async () => {
  handleResetError();
  await inputValidation.validate(formEdit.value, {
    abortEarly: false,
  }).catch((error) => {
    componentReplacementStore.setErrors(error.errors);
  });
  if (isError.value) return;

  try {
    await componentReplacementStore.updateData(authStore.user.Name).then(() => {
      if (!componentReplacementStore.isError) {
        swalAlertSuccessAutoClose("Please wait 30 minutes for the dashboard to update this change", "Component Replacement has been logged in IronPortal!");
        componentReplacementStore.resetFormEdit();
        isFormShowed.value = false;
      } else {
        componentReplacementStore.setErrors(componentReplacementStore.errors);
        return
      }
    });
    await componentReplacementStore.getComponentReplacementList();
  } catch (error) {
    console.log(error)
    componentReplacementStore.setErrors([
      "There is something wrong. Please try again"
    ]);
  }
}
const handleResetError = () => {
  componentReplacementStore.setErrors([] as string[]);
}

const cancelEdit = () => {
  componentReplacementStore.resetFormEdit();
  componentReplacementStore.resetErrors();
  isFormShowed.value = false
}

const openModal = async () => {
  await componentReplacementStore.getAndSetComponentReplacementMapping(props.equipment, props.component);
  await componentReplacementStore.getComponentReplacementList();
}

const resetModal = () => {
  isFormShowed.value = false
  componentReplacementStore.resetFormEdit();
  componentReplacementStore.resetParam();
  componentReplacementStore.resetList();
  componentReplacementStore.resetErrors();
}
const closeModal = () => {
  resetModal()
  emits('onClose')
}

const isVisible = toRef(props, 'visibility')
</script>
<style lang="scss">
.modal-component_replacement {
  .el-dialog {
    background-color: #2d2b39 !important;
    .el-dialog__header {
      border: none;
      .el-dialog__title {
        color: #fff;
      }
      .el-dialog__headerbtn {
        background-color: none;
      }
    }
  }
}
</style>
