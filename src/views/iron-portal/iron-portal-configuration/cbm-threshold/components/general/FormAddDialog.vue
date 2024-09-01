<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="New Data General"
    width="60%"
    @close="handleCloseModal()"
  >
    <transition name="fade">
      <ErrorAlert
        v-if="isError"
        :errorMessages="errors"
        @reset-form="handleResetError" />
    </transition>
    <Form id="kt_filter_form" class="row g-9 my-4"  v-loading="formStore.loading">
      <AutoComplete
        :value="formData.cbmType"
        placeholder="Add CBM Type"
        label="CBM Type"
        name="omsType"
        :max="40"
        @handleChange="handleCbmTypeChange"
        :options="formStore.cbmTypeOption" />
      <AutoComplete
        :value="formData.equipmentModel"
        placeholder="Add Equipment Model"
        label="Equipment Model"
        name="equipmentModel"
        :max="20"
        @handleChange="handleEquipmentModelChange"
        :options="formStore.equipmentModelOption" />
      <AutoComplete
        :value="formData.component"
        placeholder="Add Component"
        label="Component"
        name="Component"
        :max="40"
        @handleChange="handleComponentChange"
        :options="formStore.componentOption" />
      <TextInput
        :value="formData.parameterFrom"
        :margin="false"
        placeholder="Add Parameter From"
        label="Parameter From"
        name="parameterFrom"
        @handleChange="handleParameterFromChange" />
      <AutoComplete
        :value="formData.parameterTo"
        :margin="false"
        placeholder="Add Parameter To"
        label="Parameter To"
        name="parameterTo"
        :max="255"
        :options="formStore.parameterToOption"
        @handleChange="handleParameterToChange" />
      <TextInput
        :value="formData.registerNumber"
        :margin="false"
        label="Register Number"
        name="registerNumber"
        :max="20"
        :disabled="true"
        @handleChange="handleRegisterNumberChange" />
      <NumberInput
        v-if="!isStateCondition2"
        :value="formData.severityLevel"
        :margin="false"
        placeholder="Add Severity Level"
        label="Severity Level"
        name="severityLevel"
        :max="20"
        :disabled="isOilData"
        @handleChange="handleSeverityLevelChange" />
      <AutoComplete
        v-if="!isStateCondition2"
        :value="formData.uomFrom"
        placeholder="Add Uom From"
        label="Uom From"
        name="uomFrom"
        :max="40"
        @handleChange="handleUomFromChange"
        :options="formStore.uomOption" />
      <AutoComplete
        v-if="!isStateCondition2"
        :value="formData.uomTo"
        placeholder="Add Uom To"
        label="Uom To"
        name="uomTo"
        :max="40"
        @handleChange="handleUomToChange"
        :options="formStore.uomOption" />
      <Decimal3Input
        v-if="!isStateCondition2"
        :value="formData.uomConvertRatio"
        placeholder="Add Uom Convert Ratio"
        label="Uom Convert Ratio"
        name="uomConvertRatio"
        :max="40"
        @handleChange="handleUomConvertRatioChange" />
      <div v-if="!isStateCondition2">
        <div class="d-flex">
          <el-switch v-model="formData.isRequiredThreshold" @change="handleIsRequiredThresholdChange" />
          <span class="ms-5">Required to maintain threshold</span>
        </div>
        <div v-if="formData.isRequiredThreshold">
          <table>
            <tr>
              <th>Sample Rating</th>
              <th>Operator Min</th>
              <th>Value Min</th>
              <th>Operator Max</th>
              <th>Value Max</th>
              <th></th>
            </tr>
            <tr v-for="threshold in thresholdList" :key="threshold.idFe">
              <td>
                <SelectInput
                  :value="threshold.rating"
                  placeholder="Add Sample Rating"
                  name="rating"
                  :max="40"
                  @handleChange="(value) => { handleRatingChange(value, threshold.idFe) }"
                  :options="formStore.ratingOption"/>
              </td>
              <td>
                <SelectInput
                  :value="threshold.operatorMin"
                  placeholder="Add Operator Min"
                  name="operatorMin"
                  :max="40"
                  @handleChange="(value) => { handleOperatorMinChange(value, threshold.idFe) }"
                  :options="formStore.operatorOption" />
              </td>
              <td>
                <Decimal3Input
                  :value="threshold.valueMin"
                  :margin="false"
                  placeholder="Add Value Min"
                  name="valueMin"
                  :max="20"
                  @handleChange="(value) => { handleValueMinChange(value, threshold.idFe) }" />
              </td>
              <td>
                <SelectInput
                  :value="threshold.operatorMax"
                  placeholder="Add Operator Max"
                  name="operatorMax"
                  :max="40"
                  @handleChange="(value) => { handleOperatorMaxChange(value, threshold.idFe) }"
                  :options="formStore.operatorOption" />
              </td>
              <td>
                <Decimal3Input
                  :value="threshold.valueMax"
                  :margin="false"
                  placeholder="Add Value Max"
                  name="valueMax"
                  :max="20"
                  @handleChange="(value) => { handleValueMaxChange(value, threshold.idFe) }" />
              </td>
              <td class="d-flex align-items-start">
                <button class="btn btn-icon btn-bg-light" @click.prevent="handleDeleteThreshold(threshold.idFe)">
                  <inline-svg src="/media/svg/tables/rows/trash-delete-blue.svg" width="12" height="12" />
                </button>
              </td>
            </tr>
          </table>
          <div class="d-flex justify-content-end">
            <el-button text size="small" @click="handleAddMoreButton">Add more</el-button>
          </div>
        </div>
      </div>
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
  watchEffect,
} from 'vue';
import {
  useCbmThresholdFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-threshold/useCbmThresholdFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem,
  ThresholdItem,
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-threshold/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import TextInput from "@/components/inputs/TextInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import AutoComplete from "@/components/inputs/v2/AutoComplete.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
// import DecimalInput from "@/components/inputs/DecimalInput.vue";
import Decimal3Input from "@/components/inputs/Decimal3Input.vue";
// import OperatorComponent from '../../components/OperatorComponent.vue';

import useConditionState from '../../composable/useConditionState'


const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

const { stateCondition, calStateCondition } = useConditionState()

/* stores */
const formStore = useCbmThresholdFormStore();
const authStore = useAuthenticationStore();

/* refs*/
const isVisible = toRef(props, "visibility");
const formData: ComputedRef<UpsertItem> = computed(() => {
  return formStore.formData;
});
const thresholdList: ComputedRef<ThresholdItem[]> = computed(() => {
  return formData.value.thresholdList;
});

/* computed */
const errors = computed(() => {
  return formStore.errors;
});
const isError = computed(() => {
  return formStore.isError;
});
const isStateCondition2 = computed(() => {
  return stateCondition.value === 2;
})
const isOilData = computed(() => {
  return formData.value.cbmType == "Oil Data"
})

watchEffect(() => {
  if (formData.value && formData.value.parameterTo != "") {
    formStore.getRegisterNumber(formData.value.cbmType, formData.value.parameterTo)
  }
})

//* validation schema */
const validationCase1 = Yup.object().shape({
  cbmType: Yup.string().required("CBM Type is mandatory"),
  equipmentModel: Yup.string().required("Equipment Model is mandatory"),
  component: Yup.string().required("Component is mandatory"),
  parameterFrom: Yup.string().required("Parameter From is mandatory"),
  parameterTo: Yup.string().required("Parameter To is mandatory"),
  registerNumber: Yup.string().required("Register Number is mandatory"),
  severityLevel: Yup.string().required("Severity Level is mandatory"),
  uomConvertRatio: Yup.string().required("Uom Convert Ratio is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End date must be later than start date"),
});
const validationCase2 = Yup.object().shape({
  cbmType: Yup.string().required("CBM Type is mandatory"),
  equipmentModel: Yup.string().required("Equipment Model is mandatory"),
  component: Yup.string().required("Component is mandatory"),
  parameterFrom: Yup.string().required("Parameter From is mandatory"),
  parameterTo: Yup.string().required("Parameter To is mandatory"),
  registerNumber: Yup.string().required("Register Number is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End date must be later than start date"),
});

/* methods */
const formReset = () => {
  handleCbmTypeChange("");
  handleEquipmentModelChange("");
  handleComponentChange("");
  handleRegisterNumberChange("");
  handleParameterFromChange("");
  handleParameterToChange("");
  handleSeverityLevelChange("");
  handleUomFromChange("");
  handleUomToChange("");
  handleUomConvertRatioChange("");
  handleStartDateChange("");
  handleEndDateChange("");
  thresholdList.value.length = 0
};

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  formStore.resetState();
  emits("handle-close", isReload);
};
const handleEquipmentModelChange = (value: string) => {
  formData.value.equipmentModel = value;
  handleComponentChange("")
  formStore.getLookupComponent()
};
const handleComponentChange = (value: string) => {
  formData.value.component = value;
};
const handleCbmTypeChange = async (value: string) => {
  if (value == "VIMS") {
    handleSeverityLevelChange("3");
  } else if (value == "Oil Data") {
    handleSeverityLevelChange("3");
    handleUomConvertRatioChange("1");
    handleParameterToChange("");
    handleRegisterNumberChange("");
  }

  calStateCondition(value);
  formData.value.cbmType = value;
  await formStore.getLookupParameterTo(value);
  formData.value.parameterTo = ""
};
const handleRegisterNumberChange = (value: string) => {
  formData.value.registerNumber = value;
};
const handleParameterFromChange = (value: string) => {
  formData.value.parameterFrom = value;
};
const handleParameterToChange = (value: string) => {
  formData.value.parameterTo = value;
};
const handleSeverityLevelChange = (value: string) => {
  formData.value.severityLevel = value;
};
const handleUomFromChange = (value: string) => {
  formData.value.uomFrom = value;
};
const handleUomToChange = (value: string) => {
  formData.value.uomTo = value;
};
const handleUomConvertRatioChange = (value: string) => {
  formData.value.uomConvertRatio = value;
};
const handleIsRequiredThresholdChange = (value) => {
  if (value) {
    const ratings = ["A", "B", "C", "X"]
    ratings.forEach((rating, index) => {
      thresholdList.value.push({
        id: 0,
        idFe: index + 1,
        rating: rating,
        operatorMin: ">=",
        valueMin: "-999999.000",
        operatorMax: "<",
        valueMax: "5.000",
        isActive: true
      })
    })
  } else {
    thresholdList.value.length = 0
  }
}
const handleRatingChange = (value: string, idFe: number) => {
  const index = findIdFe(idFe)
  if (index == -1) return

  thresholdList.value[index].rating = value;
};
const handleOperatorMinChange = (value: string, idFe: number) => {
  const index = findIdFe(idFe)
  if (index == -1) return

  thresholdList.value[index].operatorMin = value;
};
const handleValueMinChange = (value: string, idFe: number) => {
  const index = findIdFe(idFe)
  if (index == -1) return

  thresholdList.value[index].valueMin = value;
};
const handleOperatorMaxChange = (value: string, idFe: number) => {
  const index = findIdFe(idFe)
  if (index == -1) return

  thresholdList.value[index].operatorMax = value;
};
const handleValueMaxChange = (value: string, idFe: number) => {
  const index = findIdFe(idFe)
  if (index == -1) return

  thresholdList.value[index].valueMax = value;
};
const findIdFe = (idFe: number) => {
  const index = thresholdList.value.findIndex((e) => {
    return e.idFe == idFe
  })

  return index
}
const handleAddMoreButton = () => {
  const length = thresholdList.value.length
  const lastItem = thresholdList.value[length == 0 ? 0 : length - 1]
  thresholdList.value.push({
    id: 0,
    idFe: lastItem.idFe + 1,
    rating: "A",
    operatorMin: ">=",
    valueMin: "-999999.000",
    operatorMax: "<",
    valueMax: "5.000",
    isActive: true
  })
}
const handleDeleteThreshold = (idFe: number) => {
  const index = findIdFe(idFe)

  if (index == -1) return
  thresholdList.value.splice(index, 1)
}
const handleStartDateChange = (value: string) => {
  formData.value.startDate = value;
};
const handleEndDateChange = (value: string) => {
  formData.value.endDate = value;
};
const handleSubmitData = async () => {
  handleResetError();
  let inputValidation = validationCase2
  switch (stateCondition.value) {
    case 2:
      inputValidation = validationCase2;
      handleSeverityLevelChange("");
      handleUomFromChange("");
      handleUomToChange("");
      handleUomConvertRatioChange("");
      formData.value.isRequiredThreshold = false
      thresholdList.value.length = 0
      break;
    default:
      inputValidation = validationCase1;
      break;
  }
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
