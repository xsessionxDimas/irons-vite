<template>
    <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="New Data"
    width="60%"
    @close="handleCloseModal()">
        <transition name="fade">
            <ErrorAlert
                v-if="isError"
                :errorMessages="errors"
                @reset-form="handleResetError" />
        </transition>
        <Form id="kt_filter_form" class="row g-4 my-4"  v-loading="formStore.loading">
          <div class="row g-4 my-4">
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value="formData.equipmentModel"
              :options="formStore.EquipmentModelOption"
              label="Equipment Model"
              placeholder="Add Equipment Model"
              name="equipmentModel"
              @handle-change="handleEquipmentModelChange"
             />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value="formData.psType"
              :options="formStore.PsTypeOption"
              label="PS Type"
              placeholder="Add PS Type"
              name="psType"
              @handle-change="handlePsTypeChange"
             />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
             <NumberInput
              :value="formData.taskNo"
              label="Task No"
              name="taskNo"
              placeholder="Add Task No"
              @handle-change="handleTaskNoChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <TextInput
              :value="formData.taskCrackCode"
              label="Task Crack Code"
              placeholder="Add Task Crack Code"
              name="taskCrackCode"
              @handle-change="handleTaskCrackCodeChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value="formData.locationId"
              :options="formStore.LocationIdOption"
              label="Location Id"
              placeholder="Add Location Id"
              name="locationId"
              @handle-change="handleLocationIdChange"
             />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <AutoComplete
              :value="formData.uom"
              :options="formStore.UomOption"
              label="UOM"
              placeholder="Add UOM"
              name="uom"
              @handle-change="handleUomChange"
             />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="formData.startDate ? formData.startDate.toString() : ''"
                placeholder="Add Start Date"
                label="Start Date"
                name="startDate"
                @handleChange="handleStartDateChange" />
            </div>
            <div class="col-md-6 fv-row fv-plugins-icon-container">
              <DatePickerInput
                :value="formData.endDate ? formData.endDate.toString() : ''"
                placeholder="Add End Date"
                label="End Date"
                name="endDate"
                @handleChange="handleEndDateChange" />
            </div>
          </div>
        </Form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="handleSubmitData"  :disabled="formStore.loading">Submit</el-button>
                <el-button type="secondary" @click="handleCloseModal"  :disabled="formStore.loading">Close</el-button>
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
  useTaskCrackFormStore
} from "@/store/pinia/iron-lake/crack-assignment/task-crack/useTaskCrackFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/crack-assignment/task-crack/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import NumberInput from '@/components/inputs/NumberInput.vue';

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useTaskCrackFormStore();
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
  equipmentModel: Yup.string().required("Equipment Model is mandatory"),
  psType: Yup.string().required("PS Type is mandatory"),
  taskNo: Yup.string().required("Task No is mandatory"),
  taskCrackCode: Yup.string().required("Task Crack Code is mandatory"),
  locationId: Yup.string().required("Location ID is mandatory"),
  uom: Yup.string().required("UOM is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const formReset = () => {
  handleEquipmentModelChange("")
  handlePsTypeChange("")
  handleTaskNoChange("")
  handleTaskCrackCodeChange("")
  handleLocationIdChange("")
  handleUomChange("");
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
const handleEquipmentModelChange = (value: string) => {
  formData.value.equipmentModel = value
}
const handlePsTypeChange = (value: string) => {
  formData.value.psType = value
}
const handleTaskNoChange = (value: string) => {
  formData.value.taskNo = value
}
const handleTaskCrackCodeChange = (value: string) => {
  formData.value.taskCrackCode = value
}
const handleLocationIdChange = (value: string) => {
  formData.value.locationId = value
}
const handleUomChange = (value: string) => {
  formData.value.uom = value
}
const handleStartDateChange = (value: string) => {
  formData.value.startDate = value
}
const handleEndDateChange = (value: string) => {
  formData.value.endDate = value
}
const handleSubmitData = async () => {
  handleResetError();
  await inputValidation.validate(formData.value, {
    abortEarly: false,
  }).catch((error) => {
    formStore.setErrors(error.errors);
  });
  if (isError.value) return;
  swalAlertConfirmation("Are you sure to submit ?").then(async (res) => {
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
