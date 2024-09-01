<!-- eslint-disable @typescript-eslint/no-explicit-any -->
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
    <Form id="kt_filter_form" class="row g-9 my-4"  v-loading="formStore.loading">
      <AutoComplete
        :value="formData.cbmGroup"
        placeholder="Add CBM Group"
        label="CBM Group"
        name="cbmGroup"
        :max="20"
        @handleChange="handleCbmGroupChange"
        :options="formStore.cbmGroupOption" />
      <AutoComplete
        :value="formData.component"
        placeholder="Add Component"
        label="Component"
        name="component"
        :max="200"
        @handleChange="handleComponentChange"
        :options="formStore.componentOption" />
      <!-- <AutoComplete
        :value="formData.parameter"
        placeholder="Add Parameter"
        label="Parameter"
        name="paramater"
        :max="20"
        @handleChange="handleParameterChange"
        :options="formStore.parameterOption" /> -->
        <template v-for="(item, index) in dataGeneral" :key="item.cbmStatusId">
          <ClusterForm
          ref="clusterForm"
          :name="item.cluster"
          @handle-change="val => handleDataClusterChange(val,index)"
          />
        </template>
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
  computed,
  ref,
  watch,
  onMounted
} from 'vue';
import {
  useCbmStatusFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-status/useCbmStatusFormStore";
import {
  useCbmStatusListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-status/useCbmStatusListStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItemSpecific
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-status/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import AutoComplete from "@/components/inputs/v2/AutoComplete.vue";
import ClusterForm from '../components/ClusterForm.vue'

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  },
  reRender: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

const clusterForm = ref(null)

/* stores */
const formStore = useCbmStatusFormStore();
const authStore = useAuthenticationStore();
const listStore = useCbmStatusListStore();

/* refs*/
const isVisible = toRef(props, "visibility");
const formData: ComputedRef<UpsertItemSpecific> = computed(() => {
  return formStore.formDataSpecific;
});
const dataGeneral = computed(() => {
  return listStore.displayData;
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

watch(() => {
  return props.reRender
}, async (newValue) => {
  if (newValue === true) {
    await setClusterData();
  }
})
watch(() => {
  return clusterForm.value
}, async () => {
  if (props.reRender) {
    await setClusterData();
  }
})
const setClusterData = async () => {
  if (formData.value.clusterData && formData.value.clusterData.length > 0) {
    formData.value.clusterData.forEach((item) => {
      clusterForm.value[item.index].setClusterData(item)
    })
  }
}
/* validation schema */
const inputValidation = Yup.object().shape({
  cbmGroup: Yup.string().required("Cbm Group is mandatory"),
  component: Yup.string().required("Component is mandatory"),
  // parameter: Yup.string().required("Parameter is mandatory"),
  clusterData: Yup.array().of(Yup.object().shape({
    // sampleCount: Yup.number().max(10, "Sample Count should not be more than 10").required("Sample Count is mandatory"),
    sampleWeight: Yup.string().required("Weight is mandatory")
      .matches(/^\d+(\.\d+)?%?$/, {
        message: 'Value Weight should be a valid percentage'
      })
      .test('max-value', 'Weight should not be more than 100%', function (value) {
        const percentageValue = parseFloat(value.replace('%', ''));
        return percentageValue <= 100;
      }),
    cautionLimit: Yup.string().required("Caution Limit is mandatory"),
    criticalLimit: Yup.string().required("Critical Limit is mandatory"),
    // summaryWeight: Yup.string().required("Summary Weight is mandatory"),
  }))
    .test('hasItems', 'Please provide at all cluster data', function (value) {
      return value && value.length >= 4;
    }).required(),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End date must be later than start date"),
});

/* methods */

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formStore.resetState();
  dataGeneral.value.forEach((_i, index) => {
    clusterForm.value[index].handleResetForm()
  });
  emits("handle-close", isReload);
};

const handleCbmGroupChange = (value: string) => {
  formData.value.cbmGroup = value;
};
const handleParameterChange = (value: string) => {
  formData.value.parameter = value;
};
const handleComponentChange = (value: string) => {
  formData.value.component = value;
};
const handleStartDateChange = (value: string) => {
  formData.value.startDate = value;
};
const handleEndDateChange = (value: string) => {
  formData.value.endDate = value;
};

const handleDataClusterChange = (val, index) => {
  formData.value.clusterData[index] = { ...val, index: index };
}

const handleSubmitData = async () => {
  handleResetError();
  await inputValidation.validate(formData.value, {
    abortEarly: false,
  }).catch((error) => {
    formStore.setErrors(error.errors);
    if (window) {
      window.scrollTo(0, 0);
    }
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
