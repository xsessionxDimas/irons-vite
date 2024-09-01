<template>
  <div class="condition-modified my-5" v-if="props.isModifying">
    <!-- condition modify -->
    <table class="table table-bordered">
      <caption></caption>
      <thead>
        <tr style="background: #f4f6f8">
          <th scope="col" style="width: 5%" class="table-header ps-3">Task</th>
          <th scope="col" style="width: 15%" class="table-header">Measurement Location</th>
          <th scope="col" style="width: 15%" class="table-header">Tool</th>
          <th scope="col" style="width: 8%" class="table-header">A</th>
          <th scope="col" style="width: 8%" class="table-header">B</th>
          <th scope="col" style="width: 15%" class="table-header">Piston Movement (B-A)</th>
          <th scope="col" style="width: 5%" class="table-header">UoM</th>
          <th scope="col" style="width: 10%" class="table-header">Percent Worn</th>
          <th scope="col" style="width: 10%" class="table-header">Rating</th>
          <th scope="col" style="width: 9%" class="table-header"></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" class="ps-3 align-middle">{{ taskNo }}</th>
          <th scope="row" class="align-middle">
            {{ measurementLocation }}
          </th>
          <th scope="row" class="align-middle">
            <el-select
              v-model="pistonTool"
              readonly
            >
              <el-option value="BIRRANA">Birrana Gauge</el-option>
              <el-option value="CAT_GAUGE">CAT Gauge</el-option>
            </el-select>
          </th>
          <th scope="row" class="align-middle">
            <el-input
              v-model="pistonMovementA"
              class="mb-0"
              @keypress="onlyNumber"
              @focusout="validateFormA"
            />
            <p
              v-show="errorInput.pistonA.isShowError"
              class="text-danger font-weight-bold"
              >{{ errorInput.pistonA.errorMessage }}</p
            >
          </th>
          <th scope="row" class="align-middle">
            <el-input
              v-model="pistonMovementB"
              class="mb-0"
              @keypress="onlyNumber"
              @focusout="validateFormB"
              :disabled="pistonMovementA == ''"
            />
            <p
              v-show="errorInput.pistonB.isShowError"
              class="text-danger font-weight-bold"
              >{{ errorInput.pistonB.errorMessage }}</p
            >
          </th>
          <th scope="row" class="align-middle">
            <el-input v-model="pistonMovementResult" readonly />
            <p
              v-show="isOutOfRange"
              class="text-danger font-weight-bold">Out of range</p>
          </th>
          <th scope="row" class="align-middle">{{ modifiedObject.uom }}</th>
          <th scope="row" class="align-middle">
            {{ modifiedObject.pistonMovementRating ? `${modifiedObject.pistonMovementRating}%` : "-" }}
          </th>
          <th scope="row" class="align-middle">
            <div class="div px-0 px-0 mx-0 my-0 w-100 h-100 input-eform-status">
              <el-input
                v-model="modifiedObject.rating"
                placeholder="Rating"
                :class="dropDownColor(modifiedObject.rating)"
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
        <div class="col py-3 table-header">Task</div>
        <div class="col-2 py-3 table-header">Measurement Location</div>
        <div class="col-1 py-3 table-header">Tool</div>
        <div class="col py-3 table-header">A</div>
        <div class="col py-3 table-header">B</div>
        <div class="col-2 py-3 table-header">Piston Movement (B-A)</div>
        <div class="col py-3 table-header">UoM</div>
        <div class="col-1 py-3 table-header">Percent Worn</div>
        <div class="col-1 py-3 table-header">Rating</div>
        <div class="col-1 py-3 table-header"></div>
        <div class="col-1 py-3 table-header">Action</div>
      </div>
      <div
        v-if="showHistoryModified"
      >
        <template
          v-for="(item, index) in detailCbm.historyModified.detail.history"
          :key="index"
        >
          <div class="row px-0 mx-0">
            <div class="d-flex align-items-center col">
              <span>{{ getTaskNoHistory(item) }}</span>
            </div>
            <div class="d-flex align-items-center col-2">
              <span>{{ getMeasurementLocation(item) }}</span>
            </div>
            <div class="d-flex align-items-center col-1">
              <span>{{ getToolData(item.items) }}</span>
            </div>
            <div class="d-flex align-items-center col">
              <span>{{ getAData(item.items) }}</span>
            </div>
            <div class="d-flex align-items-center col">
              <span>{{ getBData(item.items) }}</span>
            </div>
            <div class="d-flex align-items-center col-2">
              <span>{{ getResultData(item.items) }}</span>
            </div>
            <div class="d-flex align-items-center col">
              <span>{{ getUomData(item.items) }}</span>
            </div>
            <div class="d-flex align-items-center col-1">
              <span>{{ getPercentWornData(item.items) }}</span>
            </div>
            <div class="d-flex align-items-center col-1">
              <InputHistoryAdjustment
                :item="getRatingDataAdjustment(item)"
                :task="item"
                v-if="isAutoAdjustment && item.cbmAdjustmentReplacementValue"
              />
              <InputHistory
                :item="getRatingData(item.items)"
                :task="item"
                v-else
              />
            </div>
            <div class="col-1">
              <SmallCamera
                :item="getPhotoData(item)"
                :is-updated-by-current-user="item.updatedBy.id == authStore.user.EmployeeId"
                @showPreviewImages="showPreviewImages"
              />
            </div>
            <div class="d-flex align-items-center col-1">
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
  CbmOilCooled
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
  source: {
    type: String,
    required: false,
    default: 'serviceSheet'
  }
});

const emits = defineEmits(["openCamera"]);

const authStore = useAuthenticationStore();
const overwriteStore = useOverwriteCbmStore();
const detailCbm = computed(() => {
  return overwriteStore.detailCbm;
});
const isAutoAdjustment = computed(() => {
  return detailCbm.value.historyModifiedDefault[0].items[0].description == 'Adjustment';
})
const errorInput = computed(() => {
  return overwriteStore.inputErrorOilCooled;
});
const showHistoryModified = computed(() => {
  if (props.source == 'intervention' && detailCbm.value.historyModified && detailCbm.value.historyModified.detail.history.length > 1) {
    return true;
  } else if (props.source != 'intervention' && detailCbm.value.historyModified && detailCbm.value.historyModified.detail.history.length > 0) {
    return true;
  } else {
    return false;
  }
})

// TECH-DEBT: this should not computed if need to be writen, or set getter setter
const modifiedObject = computed(() => {
  return overwriteStore.modifiedObjOilCooled as CbmOilCooled;
});

const taskNumber = computed(() => {
  return detailCbm.value.currentCondition.taskNo;
})
const taskNo = computed(() => {
  let numberFromHistory = detailCbm.value.historyModifiedDefault[0].description.split(';')[0];
  if (detailCbm.value.historyModifiedDefault[0].description.split(';')[1] != '') {
    numberFromHistory += detailCbm.value.historyModifiedDefault[0].description.split(';')[1]
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
  let location = '';
  for (const element of detailCbm.value.historyModifiedDefault[0].items) {
    if (element.itemType === 'html') {
      location = element.value;
    }
  }
  if (location != '') {
    return location;
  } else {
    return detailCbm.value.currentCondition.measurementLocation;
  }
})
const pistonTool = computed(() => {
  return modifiedObject.value.tool == "BIRRANA" ? "Birrana Gauge" : "CAT Gauge"
})
const pistonMovementA = computed({
  get: () => {
    return modifiedObject.value.pistonMovementA
  },
  set: (val) => {
    modifiedObject.value.pistonMovementA = measureValue(val)
  }
})
const pistonMovementB = computed({
  get: () => {
    return modifiedObject.value.pistonMovementB
  },
  set: (val) => {
    modifiedObject.value.pistonMovementB = measureValue(val)
  }
})
const pistonMovementResult = computed(() => {
  return modifiedObject.value.pistonMovementResult
})

const measureValue = (val) => {
  let temp = val
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
      temp = val
    }
  }
  if (val.length > 5) {
    if (val.length >= 6 && val.length <= 6) {
      if (val[5] != ".") {
        return
      } else {
        temp = val
      }
    }
  }
  return temp
}

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
const getToolData = (items) => {
  const dropdownTool = items.find((obj) => {
    return obj.categoryItemType == "dropdownTool";
  });
  if (dropdownTool) return dropdownTool.value == "BIRRANA" ? "Birrana Gauge" : "CAT Gauge"
  return ""
};
const getAData = (items) => {
  const pistonMovementA = items.find((obj) => {
    return obj.categoryItemType == "pistonMovementA";
  });
  return pistonMovementA ? pistonMovementA.value : "";
};
const getBData = (items) => {
  const pistonMovementB = items.find((obj) => {
    return obj.categoryItemType == "pistonMovementB";
  });
  return pistonMovementB ? pistonMovementB.value : "";
};
const getResultData = (items) => {
  const pistonMovementResult = items.find((obj) => {
    return obj.categoryItemType == "pistonMovementResult";
  });
  return pistonMovementResult ? pistonMovementResult.value : "";
};
const getPercentWornData = (items) => {
  const pistonMovementRating = items.find((obj) => {
    return obj.categoryItemType == "pistonMovementRating";
  });
  return pistonMovementRating && pistonMovementRating.value != "-" ? `${parseFloat(pistonMovementRating.value) * 100}%` : "-";
};
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
const getUomData = (items) => {
  const uomObj = items.find((obj) => {
    return obj.categoryItemType == "targetTool";
  });
  return uomObj ? uomObj.value : "";
};
const getRatingData = (items) => {
  const ratingObj = items.find((obj) => {
    return obj.categoryItemType == "targetRating";
  });
  return ratingObj ? ratingObj : {} as Item;
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
  overwriteStore.setImageOilCooled(images);
};

const validateFormA = () => {
  overwriteStore.resetErrors();
  overwriteStore.setInputErrorCbmOilCooledPistonA("", false);
  let formattedVal;
  formattedVal = parseFloat(pistonMovementA.value);
  pistonMovementA.value = String(formattedVal);

  // pistonMovementA REQUIRED
  if (!modifiedObject.value.pistonMovementA) {
    overwriteStore.setInputErrorCbmOilCooledPistonA("This field is Required", true);
    overwriteStore.setErrors(["Please Check the form again"]);
    return;
  }

  // pistonMovementA max 5 digit, termasuk desimal 2 digit (udah ada helper di Modal.vue)
  if (!maximumFiveDigitWithTwoFraction(modifiedObject.value.pistonMovementA)) {
    overwriteStore.setInputErrorCbmOilCooledPistonA("Max. 2 decimal digits", true);
    overwriteStore.setErrors(["Please Check the form again"]);
    return;
  }

  if (pistonMovementB.value) {
    calculatePercentAndRating()
  }
};

const validateFormB = () => {
  overwriteStore.resetErrors();
  overwriteStore.setInputErrorCbmOilCooledPistonB("", false);
  let formattedVal;
  formattedVal = parseFloat(pistonMovementB.value);
  pistonMovementB.value = String(formattedVal);

  // pistonMovementB REQUIRED
  if (!modifiedObject.value.pistonMovementB) {
    overwriteStore.setInputErrorCbmOilCooledPistonB("This field is Required", true);
    overwriteStore.setErrors(["Please Check the form again"]);
    return;
  }

  // pistonMovementB max 5 digit, termasuk desimal 2 digit (udah ada helper di Modal.vue)
  if (!maximumFiveDigitWithTwoFraction(modifiedObject.value.pistonMovementB)) {
    overwriteStore.setInputErrorCbmOilCooledPistonB("Max. 2 decimal digits", true);
    overwriteStore.setErrors(["Please Check the form again"]);
    return;
  }

  // pistonMovementB harus lebih besar dari pistonMovementA
  if (formattedVal < parseFloat(pistonMovementA.value)) {
    overwriteStore.setInputErrorCbmOilCooledPistonB("Piston B must be greater than Piston A", true);
    overwriteStore.setErrors(["Please Check the form again"]);
    return;
  }

  if (pistonMovementA.value) {
    calculatePercentAndRating()
  }
};

const isOutOfRange = ref(false)

const calculatePercentAndRating = () => {
  isOutOfRange.value = false
  if (pistonMovementB.value && pistonMovementA.value) {
    modifiedObject.value.pistonMovementResult = (parseFloat(pistonMovementB.value) - parseFloat(pistonMovementA.value)).toFixed(2).toString()
  }

  // Set modified rating value
  let percentWorn = calculatePercentWorn();
  overwriteStore.setOilCooledPercentWorn(percentWorn);

  let rating = calculateRating();
  if (!percentWorn) {
    isOutOfRange.value = true
    overwriteStore.setErrors(["Please Check the form again"]);
    return;
  }
  overwriteStore.setOilCooledRating(rating);
}

const calculatePercentWorn = () => {
  let rating;

  const taskFormulas = detailCbm.value.detailSpec;
  const formulaForPercent = taskFormulas.filter((formula) => {
    return !["A", "B", "C", "X"].includes(formula.cbmRating)
  })

  if (formulaForPercent.length > 0) {
    if (!modifiedObject.value.pistonMovementResult) {
      return;
    }

    formulaForPercent.every((formula) => {
      // check 1st param
      const checkMin = checkMinValue(formula, modifiedObject.value.pistonMovementResult);
      // check 2nd param
      const checkMax = checkMaxValue(formula, modifiedObject.value.pistonMovementResult);
      rating = checkRating(checkMin, checkMax, formula);

      return !rating;
    });
    // Set modified rating value
    return rating;
  }
};
const calculateRating = () => {
  let rating;

  const taskFormulas = detailCbm.value.detailSpec;
  const formulaForRating = taskFormulas.filter((formula) => {
    return ["A", "B", "C", "X"].includes(formula.cbmRating)
  })

  if (formulaForRating.length > 0) {
    if (!modifiedObject.value.pistonMovementRating) {
      return;
    }

    formulaForRating.every((formula) => {
      // check 1st param
      const checkMin = checkMinValue(formula, modifiedObject.value.pistonMovementRating);
      // check 2nd param
      const checkMax = checkMaxValue(formula, modifiedObject.value.pistonMovementRating);
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
