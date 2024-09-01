<template>
  <div class="condition-modified my-5" v-if="props.isModifying">
    <!-- condition modify -->
    <table class="table table-bordered">
      <caption></caption>
      <thead>
        <tr style="background: #f4f6f8">
          <th scope="col" class="table-header ps-3">Task</th>
          <th scope="col" class="table-header">Measurement Location</th>
          <th scope="col" class="table-header">Current Value</th>
          <th scope="col" class="table-header">UoM</th>
          <th scope="col" class="table-header">Rating</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" class="ps-3 align-middle">{{ modifiedObject.taskNo }}</th>
          <th scope="row" class="align-middle">
            {{ modifiedObject.measurementLocation }}
          </th>
          <th scope="row" class="align-middle">
            <el-input
              v-model="measurementValue"
              class="mb-0"
              @keypress="onlyNumber"
              @focusout="validateForm"
            />
            <span
              v-show="errorInput.measurementValue.isShowError"
              class="text-danger font-weight-bold"
              >{{ errorInput.measurementValue.errorMessage }}</span
            >
          </th>
          <th scope="row" class="align-middle">{{ modifiedObject.uom }}</th>
          <th scope="row" class="pe-3 align-middle">
            <div class="div px-0 px-0 mx-0 my-0 w-100 h-100 input-eform-status">
              <el-input
                v-model="modifiedObject.measurementRating"
                placeholder="Rating"
                :class="dropDownColor(modifiedObject.measurementRating)"
                disabled
                readonly
              />
            </div>
          </th>
        </tr>
        <tr v-if="detailCbm.replacementPhoto">
          <th scope="row" class="px-3 align-middle" colspan="5">
            <div class="d-flex align-items-center px-3 w-100" style="border: 1px solid #e7eaee;">
              <span>
                {{ detailCbm.replacementPhoto[0].items[1].value }}
              </span>
              <span class="ms-auto me-3">
                <SmallCameraModify
                  :images="modifiedObject.images"
                  :is-mandatory="isPhotoMandatory"
                  :item="detailCbm.replacementPhoto[0].items[2]"
                  :itemkey="detailCbm.replacementPhoto[0].items[2].key"
                  :section-data="detailCbm.currentCondition.section"
                  :is-replacement="true"
                  @on-handle-images="handleModifiedImage"
                />
              </span>
            </div>
          </th>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="history-modified">
    <!-- history modified -->
    <div class="row w-100 table table-bordered">
      <div class="row w-100 ms-0" style="background: #f4f6f8">
        <div class="col-1 py-3 table-header">Task</div>
        <div class="col-3 py-3 table-header">Measurement Location</div>
        <div class="col-2 py-3 table-header">Measurement Value</div>
        <div class="col-1 py-3 table-header">UoM</div>
        <div class="col-2 py-3 table-header">Rating</div>
        <div class="col-2 py-3 table-header">Action</div>
      </div>
      <div
        v-if="
          detailCbm.historyModified && detailCbm.historyModified.detail.history.length > 0
        "
      >
        <template
          v-for="(item, index) in detailCbm.historyModified.detail.history"
          :key="index"
        >
          <div class="row px-0 mx-0">
            <div class="d-flex align-items-center col-1">
              <span>{{ item.items[0].value }}</span>
            </div>
            <div class="d-flex align-items-center col-3">
              <span>{{ getMeasurementLocation(item) }}</span>
            </div>
            <div class="d-flex align-items-center col-2">
              <span>{{ props.isReplacement ? item.cbmAdjustmentReplacementValue.measurement : getMeasurementData(item) }}</span>
            </div>
            <div class="d-flex align-items-center col-1">
              <span>{{ getUomData(item) }}</span>
            </div>
            <div class="d-flex align-items-center col-2">
              <div v-if="props.isReplacement" class="input-eform-status">
                <el-input
                  v-model="item.cbmAdjustmentReplacementValue.rating"
                  placeholder="Rating"
                  :class="dropDownColor(item.cbmAdjustmentReplacementValue.rating)"
                  disabled
                  readonly
                />
              </div>
              <InputHistory
                v-else
                :item="getRatingData(item.items)"
              />
            </div>
            <div class="d-flex align-items-center col-2">
              {{
                detailCbm.historyModified.detail.history.length - 1 == index
                  ? "IronForms"
                  : "IronPortal"
              }}
            </div>
            <div v-if="props.isReplacement && item.cbmAdjustmentReplacementValue" class="row px-0 mx-0">
              <div class="d-flex justify-content-end pb-1 pt-0 my-0 timestamp-task">
                {{ item.cbmAdjustmentReplacementValue.updatedBy!.name }}, {{ item.cbmAdjustmentReplacementValue.updatedDate! }}
              </div>
            </div>
            <div v-else-if="item.updatedBy!.name" class="row px-0 mx-0">
              <div class="d-flex justify-content-end pb-1 pt-0 my-0 timestamp-task">
                {{ item.updatedBy!.name }}, {{ item.updatedDate! }}
              </div>
            </div>
          </div>
        </template>
      </div>
      <template v-else>
        <div class="col-12 table-header text-center py-8">No Data Recorded</div>
      </template>
    </div>
  </div>
  <TakeReplacementPhoto
    v-if="detailCbm.replacementPhoto"
    :show="showReplacementPhotoDialog"
    :item="detailCbm.replacementPhoto[0].items[2]"
    :tool="replacementTool"
    :side="camStore.replacementPosition"
    @close="onCloseReplacementDialog"
  />
</template>
<script lang="ts" setup>
import {
  computed,
  defineProps,
  ref
} from "vue";
import {
  useOverwriteCbmStore
} from "@/store/pinia/iron-portal/dashboard/pbi-equipment/overwrite-cbm/useOverwriteCbmStore";
import {
  checkMaxValue,
  checkMinValue,
  checkRating,
} from "@/store/pinia/dma/e-form/helpers";
import {
  CbmAutomatic
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/OverwriteType";
import {
  maximumFiveDigitWithTwoFraction
} from "@/core/helpers/number-format";
import {
  Item
} from "@/core/types/entities/dma/e-form/Item";

import InputHistory from "../item/InputHistory.vue";
import SmallCameraModify from "../item/SmallCamera.vue";
import TakeReplacementPhoto from "@/components/dialog/TakeReplacementPhoto.vue";
import { useCameraStore } from "@/store/pinia/application/useCameraStore";

const props = defineProps({
  isModifying: {
    type: Boolean,
    required: true,
    default: false,
  },
  normalFormula: {
    type: Array
  },
  gapFormula: {
    type: Array
  },
  isReplacement: {
    type: Boolean
  }
});

const overwriteStore = useOverwriteCbmStore();

const cbmType = computed(() => {
  return overwriteStore.cbmType;
});

const detailCbm = computed(() => {
  return overwriteStore.detailCbm;
});

const previousValue = computed(() => {
  const prevItem = detailCbm.value.beforeReplacementItems.find((i) => {
    return i.categoryItemType == 'previousParamRating'
  }) as Item

  if (prevItem.value) {
    return prevItem.value
  } else {
    return ""
  }
})

const errorInput = computed(() => {
  return overwriteStore.inputError;
});

// TECH-DEBT: this should not computed if need to be writen, or set getter setter
const modifiedObject = computed(() => {
  return overwriteStore.modifiedObjAut as CbmAutomatic;
});
const measurementValue = computed({
  get: () => {
    return overwriteStore.modifiedObjAut.measurementValue;
  },
  set: (val) => {
    if (isNaN(Number(val))) {
      return
    } else if (val.length > 8) {
      return
    } else if ((`${val}`.split(".") || []).length - 1 > 1) {
      return
    } else if (val.includes(".")) {
      const afterComma = `${val}`.split(".")[1]
      if (afterComma.length > 2) {
        return
      } else {
        modifiedObject.value.measurementValue = val
      }
    }
    if (val.length > 5) {
      if (val.length >= 6 && val.length <= 6) {
        if (val[5] != ".") {
          return
        } else {
          modifiedObject.value.measurementValue = val
        }
      }
    }
    modifiedObject.value.measurementValue = val
  }
})

const isPhotoMandatory = computed(() => {
  if (detailCbm.value.historyModifiedDefault[0].items.length == 1) {
    return true;
  }
  const inputObj = detailCbm.value.historyModifiedDefault[0].items.find((obj) => {
    return (
      obj.categoryItemType == "paramRating" ||
      obj.categoryItemType == "paramRatingDynamic"
    );
  });
  const customValidation = inputObj?.customValidation || '';
  if (!customValidation) return false;

  if (
    customValidation == 'cbmTakePhoto' ||
    customValidation == "cbmTakePhotoAllRating" ||
    (customValidation == "cbmDefectTakePhoto" || customValidation == "cbmReplaceDefectTakePhoto" && (modifiedObject.value.measurementRating == 'C' || modifiedObject.value.measurementRating == 'X'))
  ) {
    return true;
  }
  return false;
});

const getMeasurementLocation = (item) => {
  if (item.items[2].itemType != 'input') {
    return item.items[2].value;
  } else {
    const measurementObj = item.items.find((obj) => {
      return (
        obj.itemType == "html"
      );
    });
    return measurementObj.value
  }
}
const getMeasurementData = (item) => {
  const measurementObj = item.items.find((obj) => {
    return (
      obj.categoryItemType == "paramRating" ||
      obj.categoryItemType == "paramRatingDynamic"
    );
  });
  if (measurementObj) {
    return measurementObj.value;
  } else {
    return '';
  }
};
const getUomData = (item) => {
  const uomObj = item.items.find((obj) => {
    return obj.categoryItemType == "targetTool";
  });
  if (uomObj) {
    return uomObj.value;
  } else if (!uomObj) {
    const measurementValueIndex = item.items.findIndex((obj) => {
      return (
        obj.categoryItemType == "paramRating" ||
        obj.categoryItemType == "paramRatingDynamic"
      )
    });
    return item.items[measurementValueIndex + 1].value;
  } else {
    return "";
  }
};
const getRatingData = (items) => {
  const ratingObj = items.find((obj) => {
    return obj.categoryItemType == "targetRating";
  });
  if (ratingObj) {
    return ratingObj;
  } else {
    return {} as Item;
  }
};

const onlyNumber = ($event) => {
  let keyCode = $event.keyCode ? $event.keyCode : $event.which;
  if (keyCode != 46 && (keyCode < 48 || keyCode > 57)) {
    $event.preventDefault();
  }
};

const dropDownColor = (value) => {
  let color: string | undefined;
  if (value == "A") {
    color = "a";
  } else if (value == "B") {
    color = "b";
  } else if (value == "C") {
    color = "c";
  } else if (value == "X") {
    color = "x";
  }
  return color;
};

const handleModifiedImage = (images) => {
  overwriteStore.setImageAutomatic(images);
};

const validateForm = () => {
  overwriteStore.resetErrors();
  overwriteStore.setInputErrorCbmAutomatic("", false);
  let formattedVal;
  formattedVal = parseFloat(measurementValue.value);
  measurementValue.value = String(formattedVal);

  // measurementValue REQUIRED
  if (modifiedObject.value.measurementValue == "") {
    overwriteStore.setInputErrorCbmAutomatic("This field is Required", true);
    overwriteStore.setErrors(["Please Check the form again"]);
    return;
  }

  // range 0-52 if type is AUTOMATIC_REPLACEMENT_GAP dan punya previous value
  if ((cbmType.value == "AUTOMATIC_REPLACEMENT_GAP" && previousValue.value) && (Number(modifiedObject.value.measurementValue) < 0 || Number(modifiedObject.value.measurementValue) > 52)) {
    overwriteStore.setInputErrorCbmAutomatic("Must be 0-52", true);
    overwriteStore.setErrors(["Please Check the form again"]);
    return;
  }

  // measurementValue max 5 digit, termasuk desimal 2 digit (udah ada helper di Modal.vue)
  if (!maximumFiveDigitWithTwoFraction(modifiedObject.value.measurementValue)) {
    overwriteStore.setInputErrorCbmAutomatic("Max. 2 decimal digits", true);
    overwriteStore.setErrors(["Please Check the form again"]);
    return;
  }

  // Set modified rating value
  let ratingResult = calculateRating();
  if (!ratingResult) {
    overwriteStore.setInputErrorCbmAutomatic("Out of range", true);
    overwriteStore.setErrors(["Please Check the form again"]);
    return;
  }
  overwriteStore.setAutomaticRating(ratingResult);
};

const calculateRating = () => {
  // jika AUTOMATIC_REPLACEMENT, maka langsung pakai NORMAL.
  if (cbmType.value == "AUTOMATIC_REPLACEMENT") {
    return calculateRatingNormal()
  }

  // jika AUTOMATIC_REPLACEMENT_GAP, maka:
  // tanpa previous sama dengan no replacement, maka langsung generate rating A TAPI harus tetap dalam range detail spec gap
  // dengan previous sama dengan with replacement, maka hitung GAP previous-current. GAP harus positif (value prev >= current)
  if (!previousValue.value) {
    const rating = getCBMRatingValue(props.normalFormula, modifiedObject.value.measurementValue)
    if (rating) {
      return "A"
    } else {
      overwriteStore.setInputErrorCbmAutomatic("Out of range", true);
      overwriteStore.setErrors(["Please Check the form again"]);
      return ""
    }
  } else {
    return calculateRatingGap()
  }
}

const getCBMRatingValue = (taskFormulas, measurementValue) => {
  let rating;

  taskFormulas.every((formula) => {
    // check 1st param
    const checkMin = checkMinValue(formula, measurementValue);
    // check 2nd param
    const checkMax = checkMaxValue(formula, measurementValue);
    rating = checkRating(checkMin, checkMax, formula);

    return !rating;
  });
  return rating
}

const calculateRatingNormal = () => {
  if (props.normalFormula && props.normalFormula.length > 0) {
    if (modifiedObject.value.measurementValue === "") {
      return;
    }
    // Set modified rating value
    return getCBMRatingValue(props.normalFormula, modifiedObject.value.measurementValue);
  }
};

const calculateRatingGap = () => {
  const currentValue = Number(measurementValue.value)
  const prevValue = Number(previousValue.value)
  const difference = Math.abs(currentValue - prevValue).toFixed(2)
  if (prevValue < currentValue) {
    overwriteStore.setInputErrorCbmAutomatic("Out of range", true);
    overwriteStore.setErrors(["Please Check the form again"]);
    return ""
  }

  // Hasil perhitungan gap
  return getCBMRatingValue(props.gapFormula, difference)
}

const camStore = useCameraStore();
const replacementTool = ref<string>('');
const showReplacementPhotoDialog = ref<boolean>(false);
const modifiedReplacementPhoto = ref('');
const handleCameraReplacement = () => {
  camStore.setShowCloseButton(false)
  camStore.setIsReplacementCamera(true)
  let currentPosition = 'cab side'
  camStore.setReplacementPosition(currentPosition)
  modifiedReplacementPhoto.value = modifiedObject.value.images;
  camStore.setReplacementPhotoLength(modifiedObject.value.images.length)
  setReplacementTool(detailCbm.value.currentCondition.section)
  camStore.setReplacementTool(replacementTool.value)
  showReplacementPhotoDialog.value = true
}
const onCloseReplacementDialog = () => {
  if (modifiedReplacementPhoto.value.length < 2) {
    camStore.toggleIsVisible(true, detailCbm.value.replacementPhoto[0].items[2].key as string)
  }
  setReplacementTool(detailCbm.value.currentCondition.section)
  camStore.setReplacementTool(replacementTool.value)
  showReplacementPhotoDialog.value = false
}
const setReplacementTool = (tool: string) => {
  replacementTool.value = ''
  switch (tool) {
    case "HV Alternator":
      replacementTool.value = "alternator"
      break;
    case "Retarder Grid Box 1":
    case "Retarder Grid Box 2":
      replacementTool.value = "blower motor"
      break;
    default:
      break;
  }
}
</script>
<style lang="scss" scoped>
.table {
  border: #e7eaee 2px solid;
}
.table-header .table-border-right-white {
  text-align: center;
  font-weight: 500 !important;
}
</style>
