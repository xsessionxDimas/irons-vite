<template>
  <div class="condition-modified my-5" v-if="props.isModifying">
    <!-- REVISE FORM -->
    <table class="table table-bordered">
      <caption></caption>
      <thead>
        <tr style="background:#f4f6f8">
          <th scope="col" class="table-header ps-3">Task</th>
          <th scope="col" class="table-header">Measurement Location</th>
          <th scope="col" class="table-header">Adjusted Value</th>
          <th scope="col" class="table-header">UoM</th>
          <th scope="col" class="table-header">Rating</th>
          <th scope="col" class="table-header"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(questionRow, qRowIndex) in detailCbm.historyModifiedDefault"
          :key="`cbm-avg-table-edit-${qRowIndex}`"
        >
          <th
            scope="row" class="ps-3 align-middle"
            v-text="questionRow.items[1].value"
          />
          <th
            scope="row"
            class="align-middle"
            v-text="questionRow.items[2].value"
          />
          <th scope="row" class="align-middle">
            <el-input
              v-model="modifiedObject.value[qRowIndex].measurementValue"
              @keypress="onlyNumber"
              @change="changeEventToValue(qRowIndex)"
              :disabled="questionRow.items[3].categoryItemType == 'resultParamRating'"
            />
            <span
              class="text-danger font-weight-bold"
              v-if="inputErrorList[qRowIndex].measurementValue.isShowError"
              v-text="inputErrorList[qRowIndex].measurementValue.errorMessage"
            />
          </th>
          <th scope="row" class="align-middle" v-text="modifiedObject.value[qRowIndex].uom" />
          <th scope="row" class="align-middle">
            <div
              class="div px-0 px-0 mx-0 my-0 w-100 h-100 input-eform-status"
              v-if="questionRow.items[5].itemType != 'label'"
            >
              <el-input
                v-model="modifiedObject.value[qRowIndex].measurementRating"
                placeholder="Rating"
                :class="dropDownColor(modifiedObject.value[qRowIndex].measurementRating)"
                disabled
                readonly
              />
            </div>
          </th>
          <th scope="row" class="align-middle">
            <SmallCameraModify
              @click="last_clicked_cam_index = qRowIndex"
              :images="modifiedObject.value[qRowIndex].images"
              @on-handle-images="(filename) => handleModifiedImage(filename)"
            />
          </th>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- REVISE HISTORY -->
  <div v-else class="history-modified">
    <table class="table table-bordered">
      <caption></caption>
      <thead>
        <tr style="background:#f4f6f8">
          <th scope="col" class="table-header px-4">Task</th>
          <th scope="col" class="table-header px-4">Measurement Location</th>
          <th scope="col" class="table-header px-4">Measurement Value</th>
          <th scope="col" class="table-header px-4">UoM</th>
          <th scope="col" class="table-header px-4">Status</th>
          <th scope="col" class="table-header px-4" colspan="2">Action</th>
        </tr>
      </thead>
      <tbody v-if="detailCbm.historyModified && detailCbm.historyModified.detail?.history.length > 0">
        <template v-for="(item, index) in detailCbm.historyModified.detail?.history" :key="index">
        <tr>
          <td class="p-4 align-middle" v-text="item.items[0].value" />
          <td class="p-4 align-middle" v-text="item.items[2].value" />
          <td class="p-4 align-middle">
            <el-input
              class="input-overwrite-cbm"
              v-model="item.items[3].value"
              placeholder="Measurement Value"
              readonly
            />
          </td>
          <td class="p-4 align-middle">
            <el-input
              class="input-overwrite-cbm"
              v-model="item.items[5].value"
              placeholder="Measurement Value"
              readonly
            />
          </td>
          <td class="p-4 align-middle" v-text="item.items[4].value" />
          <td class="p-4 align-middle">
            <SmallCamera :item="item.items[6]" :task="item" />
          </td>
          <td
            class="p-4 align-middle"
            v-text='detailCbm.historyModified.detail.history.length - 1 == index ? "IronForms" : "IronPortal" '
          />
        </tr>
        <tr v-if="item.updatedBy?.name">
          <td class="timestamp-task text-end m-auto px-5 py-0" colspan="9">
            {{ item?.updatedBy?.name }}, {{ item?.updatedDate }}
          </td>
        </tr>
        </template>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="6" class="table-header text-center py-8">
            No Data Recorded
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts" setup>
import {
  defineProps,
  computed,
} from "vue";
import {
  useOverwriteCbmStore
} from "@/store/pinia/iron-portal/dashboard/pbi-equipment/overwrite-cbm/useOverwriteCbmStore"
import {
  maximumFiveDigitWithTwoFraction
} from "@/core/helpers/number-format"
import {
  checkMaxValue,
  checkMinValue,
  checkRating
} from "@/store/pinia/dma/e-form/helpers";
import { useCameraStore } from '@/store/pinia/application/useCameraStore';
import SmallCamera from "../item/small-camera-history/SmallCamera.vue";
import SmallCameraModify from "../item/SmallCamera.vue";
import { ref } from "vue";

const camStore = useCameraStore()
const overwriteStore = useOverwriteCbmStore();

const props = defineProps({
  isModifying: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const modifiedObject = computed(() => {
  return overwriteStore.modifiedObjectAvg
})
const detailCbm = computed(() => {
  return overwriteStore.detailCbm;
})
const inputErrorList = computed(() => {
  return overwriteStore.inputErrorList;
})

const countAverage = () => {
  const blankValueIndex = modifiedObject.value.value.findIndex((e) => {
    return e.measurementValue == ""
  })
  const lastIndex = modifiedObject.value.value.length - 1

  if (blankValueIndex != -1 && blankValueIndex != lastIndex) return
  let sum = 0
  for (let i = 0; i < lastIndex; i++) {
    sum += Number(modifiedObject.value.value[i].measurementValue)
  }
  overwriteStore.setModifiedData(lastIndex, "measurementValue", (sum / (modifiedObject.value.value.length - 1)).toString())
  // modifiedObject.value.value[lastIndex].measurementValue = (sum / (modifiedObject.value.value.length - 1)).toString()
  calculateRating(lastIndex)
}

// TECH-DEBT: this should not like this, user still can pass number by copy pase
const onlyNumber = ($event) => {
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if (keyCode != 46 && (keyCode < 48 || keyCode > 57)) {
    $event.preventDefault();
  }
}

const changeEventToValue = (qRowIndex) => {
  overwriteStore.resetErrors();

  overwriteStore.setInputErrorCbmAverage(qRowIndex, "", false)
  if (modifiedObject.value.value[qRowIndex].measurementValue == "") {
    overwriteStore.setInputErrorCbmAverage(qRowIndex, "This field is required", true)
    overwriteStore.setErrors(["Please Check the form again"])
    return
  }
  if (!checkMeasurementValueInputValid(qRowIndex)) {
    overwriteStore.setInputErrorCbmAverage(qRowIndex, "Max. 2 decimal digits", true)
    overwriteStore.setErrors(["Please Check the form again"])
    return
  }

  overwriteStore.setInputErrorCbmAverage(qRowIndex, "", false)
  openCameraIfMandatory(qRowIndex)
  countAverage()
}

const calculateRating = (rowIndex) => {
  const taskFormulas = detailCbm.value.detailSpec
  const objectTarget = modifiedObject.value.value[rowIndex];

  const is_task_formula_exists = taskFormulas.length > 0;
  if (!is_task_formula_exists) return; // void

  const is_measurement_value_empty = objectTarget.measurementValue === "";
  if (is_measurement_value_empty) return; // void

  // masukkan rating
  let rating;
  taskFormulas.every((formula) => {
    // check 1st param
    const checkMin = checkMinValue(formula, objectTarget.measurementValue);
    // check 2nd param
    const checkMax = checkMaxValue(formula, objectTarget.measurementValue);
    rating = checkRating(checkMin, checkMax, formula);

    return !rating;
  });

  overwriteStore.setModifiedData(rowIndex, "measurementRating", rating || "")
}

const checkMeasurementValueInputValid = (qRowIndex) => {
  return maximumFiveDigitWithTwoFraction(modifiedObject.value.value[qRowIndex].measurementValue);
}

const last_clicked_cam_index = ref<number | undefined>();

const handleModifiedImage = (images) => {
  const index = last_clicked_cam_index.value;

  if (!index) return;

  modifiedObject.value.value[index].images = images;
}

const dropDownColor = (value) => {
  let color: string | undefined
  if (value == 'A') {
    color = 'a'
  } else if (value == 'B') {
    color = 'b'
  } else if (value == 'C') {
    color = 'c'
  } else if (value == 'X') {
    color = 'x'
  }
  return color
}

const isPhotoMandatory = (qRowIndex) => {
  const customValidation = detailCbm.value.historyModifiedDefault[qRowIndex].items[3].customValidation
  if (!customValidation) return false

  let value = modifiedObject.value.value[qRowIndex].measurementValue
  if (customValidation == "cbmTakePhotoAllRating") {
    return true
  } else if (customValidation == "cbmDefectTakePhoto") {
    if (value == "C" || value == "X") return true
  }

  return false
}

const handleClickCamera = (showCloseButton: boolean) => {
  camStore.toggleIsVisible(true, "modifiedCBM")
  camStore.setShowCloseButton(showCloseButton)
}

const openCameraIfMandatory = (qRowIndex) => {
  if (modifiedObject.value.value[qRowIndex].images.length < 1 && isPhotoMandatory(qRowIndex)) {
    handleClickCamera(false)
  }
}
</script>

<style scoped>
.table {
  border: #e7eaee 2px solid;
}
</style>
