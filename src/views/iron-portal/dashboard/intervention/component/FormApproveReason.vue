<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    :title="'Reason for Revising Intervention'"
    width="40%"
    @close="handleCloseModal()"
    v-loading="formStore.loading"
    class="dialog-word_break"
  >
    <div v-loading="formStore.loading">
      <Form id="kt_filter_form" class="row">
        <TextInput
          class="textarea-custom"
          :value="formData.approveReason"
          placeholder="Write reason here"
          label="Approve Reason"
          name="ApproveReason"
          required
          textInputType="textarea"
          readonly />
          <div class="d-flex justify-content-end">
            <span>
              {{ props.approverName }}, {{ AESTDateTime(props.approverDate) }}
            </span>
          </div>
      </Form>
    </div>
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
import TextInput from "@/components/inputs/ElementTextInput.vue";
import { AESTDateTime } from '@/core/helpers/date-format';

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  },
  approverName: {
    type: String,
    required: false,
    default: ""
  },
  approverDate: {
    type: String,
    required: false,
    default: ""
  }
});
const emits = defineEmits(["handle-close"]);

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

/* methods */

/* handlers */
const handleCloseModal = () => {
  handleResetError();
  emits("handle-close");
};
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
