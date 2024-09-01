<template>
  <div class="condition-modified my-5" v-if="props.isModifying">
    <!-- condition modify -->
    <table class="table table-bordered">
      <caption></caption>
      <thead>
        <tr style="background: #f4f6f8">
          <th scope="col" class="table-header ps-3">Task</th>
          <th scope="col" class="table-header">Measurement Location</th>
          <th scope="col" class="table-header">Measurement Value</th>
          <th scope="col" class="table-header">UoM</th>
          <th scope="col" class="table-header">Rating</th>
          <th scope="col" class="table-header"></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" class="ps-3 align-middle">{{ taskNo }}</th>
          <th scope="row" class="align-middle">
            {{ measurementLocation }}
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
          <th scope="row" class="align-middle">
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
          <th scope="row" class="align-middle">
            <SmallCameraModify
              :images="modifiedObject.images"
              :is-mandatory="false"
              @on-handle-images="handleModifiedImage"
            />
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
        <div class="col-1 py-3 table-header"></div>
        <div class="col-2 py-3 table-header">Action</div>
      </div>
      <div
        v-if="showHistoryModified"
      >
        <template
          v-for="(item, index) in detailCbm.historyModified.detail.history"
          :key="index"
        >
          <div class="row px-0 mx-0 row-histories">
            <div class="d-flex align-items-center col-1 table-value">
              <span>{{ getTaskNoHistory(item) }}</span>
            </div>
            <div class="d-flex align-items-center col-3 table-value">
              <span>{{ getMeasurementLocation(item) }}</span>
            </div>
            <div class="d-flex align-items-center col-2 table-value">
              <span>{{ getMeasurementData(item) }}</span>
            </div>
            <div class="d-flex align-items-center col-1 table-value">
              <span>{{ getUomData(item) }}</span>
            </div>
            <div class="d-flex align-items-center col-2 table-value">
              <InputHistoryAdjustment
                :item="getRatingDataAdjustment(item)"
                :task="item"
                v-if="isAutoAdjustment && item.cbmAdjustmentReplacementValue"
              />
              <InputHistory
                :item="getRatingData(item.items)"
                v-else
              />
            </div>
            <div class="col-1 table-value">
              <SmallCamera
                :item="getPhotoData(item)"
                :is-updated-by-current-user="item.updatedBy.id == authStore.user.EmployeeId"
                @showPreviewImages="showPreviewImages"
              />
            </div>
            <div class="d-flex align-items-center col-2 table-value">
              {{
                detailCbm.historyModified.detail.history.length - 1 == index
                  ? "IronForms"
                  : "IronPortal"
              }}
            </div>
            <div v-if="isAutoAdjustment && item.cbmAdjustmentReplacementValue" class="row px-0 mx-0">
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
  <template v-if="modalImagePreview">
    <ImagePreview
    :type="'task'"
    :re-render="false"
    :images="imagesForPreview"
    :show-delete-button="false"
    :is-mandatory="false"
    :visibility="modalImagePreview"
    :is-monitoring="true"
    :show-mandatory-caption="false"
    @on-close="closeImagePreview" />
  </template>
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
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  ImageInfo
} from "@/core/types/entities/dma/ImageInfo";

import InputHistory from "../item/InputHistory.vue";
import InputHistoryAdjustment from "../item/InputHistoryAdjustment.vue";
import SmallCamera from "../item/small-camera-history/SmallCamera.vue";
import SmallCameraModify from "../item/SmallCamera.vue";
import ImagePreview from '@/components/camera/ImagePreview.vue';

const props = defineProps({
  isModifying: {
    type: Boolean,
    required: true,
    default: false,
  },
  detailCbm: {
    type: Object,
    required: true
  },
  source: {
    type: String,
    required: false,
    default: 'serviceSheet'
  }
});

const authStore = useAuthenticationStore();
const overwriteStore = useOverwriteCbmStore();
const isAutoAdjustment = computed(() => {
  return props.detailCbm.historyModifiedDefault[0].items[0].description == 'Adjustment';
})
const errorInput = computed(() => {
  return overwriteStore.inputError;
});
const showHistoryModified = computed(() => {
  if (props.source == 'intervention' && props.detailCbm && props.detailCbm.historyModified && props.detailCbm.historyModified.detail.history.length > 1) {
    return true;
  } else if (props.source != 'intervention' && props.detailCbm && props.detailCbm.historyModified && props.detailCbm.historyModified.detail.history.length > 0) {
    return true;
  } else {
    return false;
  }
})
const isCaliper = computed(() => {
  return props.detailCbm.historyModifiedDefault[0].rating == 'CALIPER';
})

// TECH-DEBT: this should not computed if need to be writen, or set getter setter
const modifiedObject = computed(() => {
  return overwriteStore.modifiedObjAut as CbmAutomatic;
});

const taskNumber = computed(() => {
  return props.detailCbm.currentCondition.taskNo;
})
const taskNo = computed(() => {
  let numberFromHistory = props.detailCbm.historyModifiedDefault[0].description.split(';')[0];
  if (props.detailCbm.historyModifiedDefault[0].description.split(';')[1] != '') {
    numberFromHistory += props.detailCbm.historyModifiedDefault[0].description.split(';')[1]
  }
  if (taskNumber.value == '') {
    return numberFromHistory
  } else if ((taskNumber.value.replace(/[^a-z]/gi, "").length > 1)) {
    return taskNumber.value.replace(';', '').replace(/\D/g, '')
  } else {
    return taskNumber.value.replace(';', '')
  }
})
const getTaskNoHistory = (item) => {
  const taskNumber = item.items[0].value;
  let numberFromDescription = item.description.split(';')[0];
  if (item.description.split(';')[1] != '') {
    numberFromDescription += item.description.split(';')[1]
  }
  if (taskNumber == '') {
    return numberFromDescription;
  } else {
    return taskNumber;
  }
}
const measurementLocation = computed(() => {
  if (isCaliper.value) {
    return getLocationCaliper();
  }
  let location = '';
  for (const element of props.detailCbm.historyModifiedDefault[0].items) {
    if (element.itemType === 'html') {
      location = element.value;
    }
  }
  if (location != '') {
    return location;
  } else {
    return props.detailCbm.currentCondition.measurementLocation;
  }
})
const getLocationCaliper = () => {
  let location = '';
  if (props.detailCbm.historyModifiedDefault) {
    location += props.detailCbm.historyModifiedDefault[0].description.split(';')[1];
    location += '. ';
    location += props.detailCbm.historyModifiedDefault[0].description.split(';')[2];
  }
  return location;
}
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

const getMeasurementLocation = (item) => {
  if (isCaliper.value) {
    return getLocationCaliper();
  }
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
  if (isAutoAdjustment.value && item.cbmAdjustmentReplacementValue) {
    return item.cbmAdjustmentReplacementValue.measurement
  }
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
  if (isAutoAdjustment.value && item.cbmAdjustmentReplacementValue) {
    return item.cbmAdjustmentReplacementValue.uom
  }
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
const getRatingDataAdjustment = (item) => {
  return item.cbmAdjustmentReplacementValue.rating
}
const getPhotoData = (item) => {
  if (item.isUpdatePhoto != undefined && !item.isUpdatePhoto) {
    return [];
  }
  if (isAutoAdjustment.value && item.cbmAdjustmentReplacementValue) {
    return item.cbmAdjustmentReplacementValue.pictures;
  }
  if (props.source == 'intervention') {
    return item.pictures;
  }
  const photoObj = item.items.find((obj) => {
    return obj.itemType == "smallCamera";
  });
  if (photoObj) {
    return photoObj.value;
  } else {
    return [];
  }
}

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
  let rating;
  const taskFormulas = props.detailCbm.detailSpec;
  const formulasWithSameUom = taskFormulas.filter((formula) => {
    return formula.uom == modifiedObject.value.uom
  })
  if (formulasWithSameUom.length > 0) {
    if (modifiedObject.value.measurementValue === "") {
      return;
    }

    formulasWithSameUom.every((formula) => {
      // check 1st param
      const checkMin = checkMinValue(formula, modifiedObject.value.measurementValue);
      // check 2nd param
      const checkMax = checkMaxValue(formula, modifiedObject.value.measurementValue);
      rating = checkRating(checkMin, checkMax, formula);

      return !rating;
    });
    // Set modified rating value
    return rating;
  }
};

const modalImagePreview = ref<boolean>(false);
const imagesForPreview = ref<ImageInfo[]>([]);
const closeImagePreview = () => {
  modalImagePreview.value = false;
}
const showPreviewImages = (val) => {
  imagesForPreview.value = val;
  modalImagePreview.value = true;
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
