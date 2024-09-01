<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    :title="'Reason for Declining Intervention'"
    width="40%"
    @close="handleCloseModal()"
    v-loading="formStore.loading"
    class="dialog-word_break"
  >
    <div v-loading="formStore.loading">
      <transition name="fade">
        <ErrorAlert
          v-if="isError"
          :errorMessages="errors"
          @reset-form="handleResetError" />
      </transition>
      <Form id="kt_filter_form" class="row">
        <TextInput
          class="textarea-custom"
          :value="formData.declineReason"
          placeholder="Write reason here"
          label="Decline Reason"
          name="DeclineReason"
          required
          :max="1500"
          textInputType="textarea"
          :readonly="!props.isEdit"
          @handleChange="handleDeclineReasonChange" />
          <div class="d-flex justify-content-end">
            <span v-if="!props.isEdit">
              {{ props.declinerName }}, {{ AESTDateTime(props.declinerDate) }}
            </span>
          </div>
      </Form>
    </div>
    <template #footer v-if="props.isEdit">
      <span class="dialog-footer">
        <el-button :disabled="formStore.loading" type="secondary" @click="handleCloseModal">Cancel</el-button>
        <el-button :disabled="formStore.loading" type="primary" @click="handleSubmitData">Submit</el-button>
      </span>
    </template>
  </el-dialog>
  </template>

<script lang="ts" setup>
import {
  toRef,
  defineProps,
  defineEmits,
  ref,
  computed
} from 'vue';
import {
  useInterventionFormStore
} from "@/store/pinia/iron-portal/dashboard/intervention/useInterventionFormStore";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import TextInput from "@/components/inputs/ElementTextInput.vue";
import { AESTDateTime } from '@/core/helpers/date-format';

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  declinerName: {
    type: String,
    required: false,
    default: ""
  },
  declinerDate: {
    type: String,
    required: false,
    default: ""
  }
});
const emits = defineEmits(["handle-close", "handle-submit"]);

/* stores */
const formStore = useInterventionFormStore();

/* refs*/
const isVisible = toRef(props, "visibility");

const formData = computed(() => {
  return formStore.formIntervention;
});

/* computed */
const errors = ref([])
const isError = ref(false)

/* validation schema */
const inputValidation = Yup.object().shape({
  declineReason: Yup.string().required("Decline Reason is mandatory").nullable(),
});

/* methods */

/* handlers */
const handleCloseModal = () => {
  handleResetError();
  emits("handle-close");
};
const handleDeclineReasonChange = (value: string) => {
  formData.value.declineReason = value;
};
const handleSubmitData = async () => {
  isError.value = false
  handleResetError();
  await inputValidation.validate(formData.value, {
    abortEarly: false,
  }).catch((error) => {
    isError.value = true
    errors.value = error.errors;
  });
  if (isError.value) return;
  emits("handle-submit");
}
const handleResetError = () => {
  isError.value = false
  errors.value = []
}
</script>

<style scoped>
.textarea-custom {
  word-break: break-word !important;
}
</style>
