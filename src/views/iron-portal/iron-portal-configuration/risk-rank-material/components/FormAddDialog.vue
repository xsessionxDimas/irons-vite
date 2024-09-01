<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="New Data"
    width="40%"
    @close="handleCloseModal()"
  >
    <transition name="fade">
      <ErrorAlert
        v-if="isError"
        :errorMessages="errors"
        @reset-form="handleResetError" />
    </transition>
    <Form id="kt_filter_form" class="row g-9 my-4"  v-loading="formStore.loading">
      <NumberInput
        :value="formData.maxRiskRank"
        :margin="false"
        placeholder="Add Max Risk Ranked Interval"
        label="Max Risk Ranked Interval"
        name="MaxRiskRankedInterval"
        :max="20"
        @handleChange="handleMaxRiskRankChange" />
      <TextInput
        :value="formData.revisedRisk"
        :margin="false"
        placeholder="Add Revised Risk Rating"
        label="Revised Risk Rating"
        name="RevisedRiskRating"
        :max="20"
        @handleChange="handleRevisedRiskChange" />
      <TextInput
        :value="formData.overallRisk"
        :margin="false"
        placeholder="Add Overall Risk Rating"
        label="Overall Risk Rating"
        name="OverallRiskRating"
        :max="20"
        @handleChange="handleOverallRiskChange" />
      <TextInput
        :value="formData.failureTiming"
        :margin="false"
        placeholder="Add Failure Timing Risk"
        label="Failure Timing Risk"
        name="FailureTimingRisk"
        :max="20"
        @handleChange="handleFailureTimingChange" />
      <TextInput
        :value="formData.systemImpact"
        :margin="false"
        placeholder="Add System Impact Risk"
        label="System Impact Risk"
        name="SystemImpactRisk"
        :max="20"
        @handleChange="handleSystemImpactChange" />
      <TextInput
        :value="formData.opsImpact"
        :margin="false"
        placeholder="Add OPS Impact Risk"
        label="OPS Impact Risk"
        name="OpsImpactRisk"
        :max="20"
        @handleChange="handleOpsImpactChange" />
      <TextInput
        :value="formData.supplyRisk"
        :margin="false"
        placeholder="Add Supply Risk"
        label="Supply Risk"
        name="SupplyRisk"
        :max="20"
        @handleChange="handleSupplyRiskChange" />
      <TextInput
        :value="formData.failureCost"
        :margin="false"
        placeholder="Add Failure Cost Risk"
        label="Failure Cost Risk"
        name="FailureCostRisk"
        :max="20"
        @handleChange="handleFailureCostChange" />
      <TextInput
        :value="formData.comments"
        :margin="false"
        placeholder="Add Comments"
        label="Comments"
        name="Comments"
        :max="225"
        @handleChange="handleCommentsChange" />
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
          :value="formData.startDate"
          placeholder="Add Start Date"
          label="Start Date"
          name="StartDate"
          @handleChange="handleStartDateChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
          :value="formData.endDate"
          placeholder="Add End Date"
          label="End Date"
          name="EndDate"
          @handleChange="handleEndDateChange" />
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
  useRiskRankMaterialFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/risk-rank-material/useRiskRankMaterialFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/risk-rank-material/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import TextInput from "@/components/inputs/TextInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useRiskRankMaterialFormStore();
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
  maxRiskRank: Yup.string().required("max Risk Ranked Interval is mandatory"),
  revisedRisk: Yup.string().required("Revised Risk Rating is mandatory"),
  overallRisk: Yup.string().required("Overall Risk Rating is mandatory"),
  failureTiming: Yup.string().required("Failure Timing Risk is mandatory"),
  systemImpact: Yup.string().required("System Impact Risk is mandatory"),
  opsImpact: Yup.string().required("OPS Impact Risk is mandatory"),
  supplyRisk: Yup.string().required("Supply Risk is mandatory"),
  failureCost: Yup.string().required("Failure Cost Risk is mandatory"),
  comments: Yup.string().required("Comments is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End date must be later than start date"),
});

/* methods */

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formStore.resetState();
  emits("handle-close", isReload);
};
const handleMaxRiskRankChange = (value: string) => {
  formData.value.maxRiskRank = value;
};
const handleRevisedRiskChange = (value: string) => {
  formData.value.revisedRisk = value;
};
const handleOverallRiskChange = (value: string) => {
  formData.value.overallRisk = value;
};
const handleFailureTimingChange = (value: string) => {
  formData.value.failureTiming = value;
};
const handleSystemImpactChange = (value: string) => {
  formData.value.systemImpact = value;
};
const handleOpsImpactChange = (value: string) => {
  formData.value.opsImpact = value;
};
const handleSupplyRiskChange = (value: string) => {
  formData.value.supplyRisk = value;
};
const handleFailureCostChange = (value: string) => {
  formData.value.failureCost = value;
};
const handleCommentsChange = (value: string) => {
  formData.value.comments = value;
};
const handleStartDateChange = (value: string) => {
  formData.value.startDate = value;
};
const handleEndDateChange = (value: string) => {
  formData.value.endDate = value;
};
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
