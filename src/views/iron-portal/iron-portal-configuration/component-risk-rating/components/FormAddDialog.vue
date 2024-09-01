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
        v-if="isError && !isEdit"
        :errorMessages="errors"
        @reset-form="handleResetError" />
    </transition>
    <Form id="kt_filter_form" class="row g-9 my-4" v-loading="formStore.loading">
      <AutoComplete
        :value="formData.site"
        placeholder="Add Site"
        :isLoading="formLoading.site"
        label="Site"
        name="Site"
        @handleChange="handleSiteChange"
        :options="formStore.siteOption" />
      <AutoComplete
        :value="formData.equipmentModel"
        :isLoading="formLoading.equipmentModel"
        :is-disabled="!formData.site || formData.site == ''"
        label="Equipment Model"
        placeholder="Add Equipment Model"
        name="EquipmentModel"
        :options="formStore.equipmentModelOption"
        :max="20"
        @handleChange="handleEquipmentModelChange"
      />
      <AutoComplete
        :value="formData.component"
        :isLoading="formLoading.component"
        :is-disabled="!formData.equipmentModel || formData.equipmentModel == ''"
        label="Component"
        placeholder="Add Component"
        name="Component"
        :options="formStore.componentOption"
        :max="40"
        @handleChange="handleComponentChange"
      />
      <AutoComplete
        :value="formData.componentType"
        label="Component Type"
        placeholder="Add Component Type"
        name="ComponentType"
        :options="formStore.componentTypeOption"
        :max="20"
        @handleChange="handleComponentTypeChange"
      />
      <NumberInput
        :value="formData.componentWeight"
        placeholder="Add Component Weight"
        label="Component Weight"
        name="componentWeight"
        @handleChange="(val) => formData.componentWeight = val" />
      <NumberInput
        :value="formData.oemInterval"
        placeholder="Add OEM Interval"
        label="OEM Interval"
        name="bumaAuTarget"
        @handleChange="(val) => formData.oemInterval = val" />
      <NumberInput
        :value="formData.bumaAuTarget"
        placeholder="Add BUMA AU Target"
        label="BUMA AU Target"
        name="bumaAuTarget"
        @handleChange="(val) => formData.bumaAuTarget = val" />
      <ElementTextInput
        :value="formData.maxRiskRank"
        label="Max Risk Rank"
        placeholder="Add Max Risk Rank"
        name="MaxRiskRank"
        :max="5"
        @handleChange="(val) => formData.maxRiskRank = val"
        />
      <ElementTextInput
        :value="formData.revisedRank"
        label="Revised Rank"
        placeholder="Add Revised Rank"
        name="RevisedRank"
        :max="5"
        @handleChange="(val) => formData.revisedRank = val"
      />
      <AutoComplete
        :value="formData.overallRisk"
        label="Overall Risk"
        placeholder="Add Overall Risk"
        name="OverallRisk"
        :options="formStore.overallRiskOption"
        :max="5"
        @handleChange="(val) => formData.overallRisk = val"
      />
      <AutoComplete
        :value="formData.failureTiming"
        label="Failure Timing"
        placeholder="Add Failure Timing"
        name="FailureTiming"
        :options="formStore.failureTimingOption"
        :max="5"
        @handleChange="(val) => formData.failureTiming = val"
      />
      <AutoComplete
        :value="formData.systemImpact"
        label="System Impact"
        placeholder="Add System Impact"
        name="SystemImpact"
        :options="formStore.systemImpactOption"
        :max="5"
        @handleChange="(val) => formData.systemImpact = val"
      />
      <AutoComplete
        :value="formData.opsImpact"
        label="OPS Impact"
        placeholder="Add OPS Impact"
        name="OpsImpact"
        :options="formStore.opsImpactOption"
        :max="5"
        @handleChange="(val) => formData.opsImpact = val"
      />
      <AutoComplete
        :value="formData.supplyRisk"
        label="Supply Risk"
        placeholder="Add Supply Risk"
        name="SupplyRisk"
        :options="formStore.supplyRiskOption"
        :max="5"
        @handleChange="(val) => formData.supplyRisk = val"
      />
      <AutoComplete
        :value="formData.failureCost"
        label="Failure Cost"
        placeholder="Add Failure Cost"
        name="FailureCost"
        :options="formStore.failureCostOption"
        :max="5"
        @handleChange="(val) => formData.failureCost = val"
      />
      <ElementTextInput
        :value="formData.comments"
        label="Comments"
        placeholder="Add Comments"
        name="Comments"
        :options="formStore.commentsOption"
        :max="255"
        textInputType="textarea"
        @handleChange="(val) => formData.comments = val"
      />
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
          :value="formData.startDate"
          label="Start Date"
          placeholder="Add Start Date"
          name="StartDate"
          @handleChange="handleStartDateChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput
          :value="formData.endDate"
          label="End Date"
          placeholder="Add End Date"
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
  useComponentRiskRatingFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-risk-rating/useComponentRiskRatingFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-risk-rating/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import ElementTextInput from "@/components/inputs/ElementTextInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useComponentRiskRatingFormStore();
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
const isEdit = computed(() => {
  return formStore.isEdit;
});
const formLoading = computed(() => {
  return formStore.formLoading;
});

/* validation schema */
const inputValidation = Yup.object().shape({
  equipmentModel: Yup.string().required("Equipment Model is mandatory"),
  component: Yup.string().required("Component is mandatory"),
  componentType: Yup.string().required("Component Type is mandatory"),
  componentWeight: Yup.string().required("Component Weight is mandatory"),
  site: Yup.string().required("Site is mandatory"),
  oemInterval: Yup.string().required("OEM Interval is mandatory"),
  bumaAuTarget: Yup.string().required("BUMA AU Target is mandatory"),
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
const handleStartDateChange = (value: string) => {
  formData.value.startDate = value;
};
const handleEndDateChange = (value: string) => {
  formData.value.endDate = value;
};

const handleSiteChange = async (value: string) => {
  formData.value.site = value;
  if (value != "") {
    await formStore.getLookupEquipmentModel();
  }
  handleEquipmentModelChange("");
};

const handleEquipmentModelChange = async (value: string) => {
  formData.value.equipmentModel = value;
  if (value != "") {
    await formStore.getLookupComponent();
  }
  handleComponentChange("");
};

const handleComponentChange = async (value: string) => {
  formData.value.component = value;
};

const handleComponentTypeChange = (value: string) => {
  formData.value.componentType = value;
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
