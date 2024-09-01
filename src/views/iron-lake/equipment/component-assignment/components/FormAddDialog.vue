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
            <AutoComplete
                :value="formData.ComponentType"
                placeholder="Add Component Type"
                label="Component Type"
                name="ComponentType"
                @handleChange="handleComponentTypeChange"
                :options="listStore.componentTypeOption" />
            <AutoComplete
                :value="formData.Component"
                :margin="false"
                placeholder="Add Component"
                label="Component"
                name="Component"
                @handleChange="handleComponentChange"
                :options="listStore.componentOption" />
            <AutoComplete
                :value="formData.Equipment"
                placeholder="Add Equipment"
                label="Equipment"
                name="Equipment"
                @handleChange="handleEquipmentChange"
                :options="listStore.equipmentOption" />
            <AutoComplete
                :value="formData.ObjectType"
                placeholder="Add ObjectType"
                label="Object Type"
                name="ObjectType"
                @handleChange="handleObjectTypeChange"
                :options="listStore.objectTypeOption" />
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                  :value="formData.StartDate"
                  placeholder="Add Start Date"
                  label="Start Date"
                  name="StartDate"
                  @handleChange="handleStartDateChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                  :value="formData.EndDate"
                  placeholder="Add End Date"
                  label="End Date"
                  name="EndDate"
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
  useComponentAssignmentFormStore
} from "@/store/pinia/iron-lake/equipment/component-assignment/useComponentAssignmentFormStore";
import {
  useComponentAssignmentListStore
} from "@/store/pinia/iron-lake/equipment/component-assignment/useComponentAssignmentListStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/equipment/component-assignment/UpsertItem";
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
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
const formStore = useComponentAssignmentFormStore();
const listStore = useComponentAssignmentListStore();
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
  ComponentType: Yup.string().required("Component Type is mandatory"),
  Component: Yup.string().required("Component is mandatory"),
  Equipment: Yup.string().required("Equipment is mandatory"),
  ObjectType: Yup.string().required("Object Type is mandatory"),
  StartDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  EndDate: Yup.date().required("End Date is mandatory").min(Yup.ref("StartDate"), "End date must be later than start date").typeError("End date must be later than start date"),
});

/* methods */
const formReset = () => {
  handleComponentChange("");
  handleComponentTypeChange("");
  handleEquipmentChange("");
  handleObjectTypeChange("");
  handleStartDateChange("");
  handleEndDateChange("");
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  formStore.resetState();
  emits("handle-close", isReload);
}
const handleComponentChange = (value: string) => {
  formData.value.Component = value;
}
const handleComponentTypeChange = (value: string) => {
  formData.value.ComponentType = value;
}
const handleEquipmentChange = (value: string) => {
  formData.value.Equipment = value;
}
const handleObjectTypeChange = (value: string) => {
  formData.value.ObjectType = value;
}
const handleStartDateChange = (value: string) => {
  formData.value.StartDate = value;
}
const handleEndDateChange = (value: string) => {
  formData.value.EndDate = value;
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
