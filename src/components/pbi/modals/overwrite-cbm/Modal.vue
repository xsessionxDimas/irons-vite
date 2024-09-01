<template>
  <el-dialog
    v-model="isVisible"
    title="Detailed Information"
    width="80%"
    @open="openFirst"
    @close="closeModal"
  >
    <div v-if="!availableCbmTypes.includes(cbmRating) && !loading" class="text-center py-10 my-10">
      Overwrite will be available soon
    </div>
    <div v-else>
      <!-- <ApprovalInfo
        v-if="historicalApproval"
        approvedBy="Supervisor"
        :name="historicalApproval.supervisorApproval.name"
        :date="historicalApproval.supervisorApprovalDate"
        :comment="historicalApproval.supervisorApprovalComment"
      />
      <ApprovalInfo
        v-if="historicalApproval"
        approvedBy="Planner"
        :name="historicalApproval.plannerApproval.name"
        :date="historicalApproval.plannerApprovalDate"
        :comment="historicalApproval.plannerApprovalComment"
      /> -->
      <div class="d-flex justify-content-between my-4">
        <div class="grey-box p-3" v-loading="loading">
          <h5>Work Order</h5>
          <span>{{ detailCbm.workOrder }}</span>
        </div>
        <div class="grey-box p-3 mx-3" v-loading="loading">
          <h5>Asset Number</h5>
          <span>{{ detailCbm.equipment }}</span>
        </div>
        <div class="grey-box p-3" v-loading="loading">
          <h5>Component</h5>
          <span>{{ cbmComponent }}</span>
        </div>
      </div>
      <div class="my-4">
        <h3 class="my-7">Current Condition</h3>
        <CurrentConditionAutTable
          v-if="currentCondition && (cbmRating === 'AUTOMATIC' || cbmRating.includes('PREVIOUS') || cbmRating === 'AVERAGE')"
          :item-service="itemService"
          :loading="loading"
        />
        <CurrentConditionManTable
          v-else-if="currentCondition && (cbmRating === 'MANUAL' || cbmRating === 'NORMAL')"
          :item-service="itemService"
          :loading="loading"
        />
        <CurrentConditionSuspensionTable
          v-else-if="cbmRating === 'CALIBRATION'"
          :currentCondition="currentCondition"
          :loading="loading"
        />
        <CurrentConditionAutRepTable
          v-else-if="cbmRating === 'AUTOMATIC_REPLACEMENT' || cbmRating === 'AUTOMATIC_REPLACEMENT_GAP'"
          :item-service="itemService"
          :loading="loading"
        />
        <CurrentConditionOilCooledTable
          v-else-if="cbmRating === 'OIL_COOLED'"
          :item-service="OilCooledItemService"
          :loading="loading"
        />
        <CurrentConditionCaliperTable
          v-if="currentCondition && cbmRating === 'CALIPER'"
          :item-service="caliperItemService"
          :loading="loading"
        />

        <h4 v-if="cbmRating != 'AUTOMATIC_REPLACEMENT_GAP'" class="my-3">Detail Spec</h4>
        <h4 class="my-3" v-else>Detail Spec Gap</h4>
        <table v-if="cbmRating != 'AUTOMATIC_REPLACEMENT_GAP'" class="table table-bordered" style="width: 500px" v-loading="loading">
          <caption></caption>
          <thead>
            <tr style="background: #18af4a; color: #fff">
              <th scope="col" class="table-header table-border-right-white ps-2">
                Rating
              </th>
              <th scope="col" class="table-header table-border-right-white">Value Min</th>
              <th scope="col" class="table-header table-border-right-white">Value Max</th>
              <th scope="col" class="table-header table-border-right-white">UoM</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailSpec" :key="index">
              <tr :class="index % 2 == 0 ? 'even' : 'odd'">
                <th scope="row" class="ps-2">{{ item.cbmRating }}</th>
                <th scope="row">{{ item.minValueComplete }}</th>
                <th scope="row">{{ item.maxValueComplete }}</th>
                <th scope="row">{{ item.uom }}</th>
              </tr>
            </template>
          </tbody>
        </table>
        <table v-else
          class="table table-bordered"
          style="width: 500px"
          v-loading="loading"
        >
          <caption></caption>
          <thead>
            <tr style="background: #18af4a; color: #fff">
              <th scope="col" class="table-header table-border-right-white ps-2">
                Rating
              </th>
              <th scope="col" class="table-header table-border-right-white">Value Min</th>
              <th scope="col" class="table-header table-border-right-white">Value Max</th>
              <th scope="col" class="table-header table-border-right-white">UoM</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailSpecGap" :key="index">
              <tr :class="index % 2 == 0 ? 'even' : 'odd'">
                <th scope="row" class="ps-2">{{ item.cbmRating }}</th>
                <th scope="row">{{ item.minValueComplete }}</th>
                <th scope="row">{{ item.maxValueComplete }}</th>
                <th scope="row">{{ item.uom }}</th>
              </tr>
            </template>
          </tbody>
        </table>

        <h4>Detailed Picture</h4>
        <div v-loading="loading">
          <el-empty
            v-if="!imageArray || imageArray.length === 0"
          >
            <template #image>
              <inline-svg
                src="/media/icons/bootstrap-icon/card-image.svg"
                width="30"
                height="30"
              />
            </template>
            <template #description>
              <span>No Picture.</span>
            </template>
          </el-empty>
          <div v-else class="w-100 d-flex flex-wrap">
            <div
              v-for="(img, index) in imageArray"
              :key="img.filename"
              class="col-md-3 fv-row fv-plugins-icon-container p-2 rounded position-relative"
            >
              <el-skeleton :loading="loader[index]" animated>
                <template #template>
                  <el-skeleton-item
                    variant="image"
                    class="w-100 rounded"
                    style="height: 200px; object-fit: contain; cursor: pointer"
                    @click="handleShowFullScreen(img.filename)"
                    :alt="img.filename"
                  />
                </template>
                <template #default>
                  <h4 v-if="img.type && (cbmRating === 'AUTOMATIC_REPLACEMENT' || cbmRating === 'AUTOMATIC_REPLACEMENT_GAP')">{{ img.type }}</h4>
                  <div class="bg-secondary cursor-pointer">
                    <img
                      :src="img.url"
                      class="w-100 rounded"
                      style="height: 200px; object-fit: contain"
                      @click="handleShowFullScreen(img.filename)"
                      :alt="img.filename"
                    />
                  </div>
                </template>
              </el-skeleton>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-20" v-loading="loading">
        <!-- New Version Start -->
        <h3 class="my-7">
          {{ isModifying ? "Condition Modified" : "History Modified" }}
        </h3>
        <el-alert
          v-if="
            detailCbm.historyModified &&
            detailCbm.historyModified.detail.history.length >= 3
          "
          title="You have reached the maximum limit for revising 2 times."
          type="info"
          show-icon
          :closable="false"
          class="mb-10 alert-revise"
        />

        <CbmAutomaticTable
          v-if="cbmRating === 'AUTOMATIC' || cbmRating.includes('PREVIOUS') || cbmRating === 'CALIPER'"
          :detail-cbm="detailCbm"
          :is-modifying="isModifying"
          :source="source"
        />
        <CbmNormalTable
          v-else-if="cbmRating === 'MANUAL' || cbmRating === 'NORMAL'"
          :is-modifying="isModifying"
          :source="source"
        />
        <CbmAvgTable v-else-if="cbmRating === 'AVERAGE'" :is-modifying="isModifying" />
        <CbmSuspensionTable
          v-else-if="cbmRating === 'CALIBRATION'"
          :is-modifying="isModifying"
        />

        <CbmAutomaticReplacementTable
          v-if="cbmRating === 'AUTOMATIC_REPLACEMENT' || cbmRating === 'AUTOMATIC_REPLACEMENT_GAP'"
          :is-modifying="isModifying"
          :normal-formula="detailSpec"
          :gap-formula="detailSpecGap"
          :is-replacement="detailCbm.isReplacementAdjustment"
          @open-camera="handleClickCamera($event)"
        />

        <CbmOilCooledTable
          :is-modifying="isModifying"
          :source="source"
          v-if="cbmRating === 'OIL_COOLED'"
          @open-camera="handleClickCamera($event)"
        />
        <!-- New Version End -->
      </div>
    </div>
    <template #footer>
      <div
        class="dialog-footer"
        v-if="isUserCanRevise && availableCbmTypes.includes(cbmRating)"
        v-loading="loading"
      >
        <div class="dialog-footer" v-if="cbmRating != 'CALIBRATION'" v-loading="loading">
          <el-button @click="closeModal">Cancel</el-button>
          <template v-if="isModifying">
            <el-button :disabled="isError" @click="submitRevision" type="primary">
              Submit
            </el-button>
          </template>
          <template v-else>
            <el-button @click="openEdit" type="primary">Revise</el-button>
          </template>
        </div>
      </div>
    </template>
  </el-dialog>
  <FullScreenDialog
    :images="imageArrayCopied"
    :visibility="showFullImage"
    :image="selectedFullscreenImage"
    @handle-close="closeFullScreenImage"
  />
  <Cameras :visibility="camStore.isVisible" />
</template>
<script lang="ts" setup>
import {
  toRef,
  defineProps,
  defineEmits,
  ref,
  computed
} from "vue";
import { KeyValue } from "@/core/types/misc/KeyValue";
import Cameras from "@/components/camera/Cameras.vue";
import {
  stringToImageInfoConvert
} from "@/core/helpers/string-to-imageinfo-converter";
import FullScreenDialog from "@/components/camera/FullScreenDialog.vue";
// import ApprovalInfo from "./ApprovalInfo.vue";

import CurrentConditionAutTable from "./current-condition-table/CurrentConditionAutTable.vue";
import CurrentConditionCaliperTable from './current-condition-table/CurrentConditionCaliperTable.vue';
import CurrentConditionAutRepTable from "./current-condition-table/CurrentConditionAutRepTable.vue";
import CurrentConditionOilCooledTable from "./current-condition-table/CurrentConditionOilCooledTable.vue";

import CbmAutomaticTable from "./history-table/CbmAutomaticTable.vue";
import CbmAvgTable from "./history-table/CbmAvgTable.vue";
import CbmNormalTable from "./history-table/CbmNormalTable.vue";
import CbmSuspensionTable from "./history-table/CbmSuspensionTable.vue";
import CbmAutomaticReplacementTable from "./history-table/CbmAutomaticReplacementTable.vue"
import CbmOilCooledTable from "./history-table/CbmOilCooledTable.vue";

import {
  swalAlertSuccessTitle,
  swalAlertError
} from "@/core/helpers/sweet-alert";
import { ImageFull } from "@/core/types/entities/dma/ImageInfo";
import {
  useOverwriteCbmStore
} from "@/store/pinia/iron-portal/dashboard/pbi-equipment/overwrite-cbm/useOverwriteCbmStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { useMenuStore } from "@/store/pinia/application/useMenuStore";
import { useCameraStore } from "@/store/pinia/application/useCameraStore";
import CurrentConditionManTable from "./current-condition-table/CurrentConditionManTable.vue";
import CurrentConditionSuspensionTable from "./current-condition-table/CurrentConditionSuspensionTable.vue";
import {
  get,
  orderBy
} from "lodash";

const props = defineProps({
  visibility: {
    type: Boolean,
    required: false,
  },
  type: {
    type: String,
    required: true,
    default: "cbm",
  },
  workOrder: {
    type: String,
    required: true,
  },
  taskKey: {
    type: String,
    required: true,
  },
  assetNumber: {
    type: String,
    required: true,
  },
  component: {
    type: String,
    required: true,
  },
  sampleDate: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: false,
    default: 'serviceSheet'
  }
});

const emits = defineEmits(["onClose", "onDelete", "onDownloaded"]);

const overwriteCbmStore = useOverwriteCbmStore();
const authStore = useAuthenticationStore();
const camStore = useCameraStore();

const isModifying = ref(false);
const keyValues = ref<KeyValue[]>([]);
const isVisible = toRef(props, "visibility");
const loader = ref<boolean[]>([]);
const lastCount = ref(0);
const imageArray = ref<ImageFull[]>([]);

const isFormError = ref(false);

// refs
const loadingForModal = ref(false);

// computed
const isUserCanRevise = computed(() => {
  return overwriteCbmStore.isUserCanRevise;
});
const loading = computed(() => {
  return overwriteCbmStore.loading || loadingForModal.value;
});
const detailCbm = computed(() => {
  return overwriteCbmStore.detailCbm;
});
// const historicalApproval = computed(() => {
//   return overwriteCbmStore.detailCbm.historicalApproval || null;
// });
const cbmComponent = computed(() => {
  if (detailCbm.value.component != '') {
    return detailCbm.value.component;
  } else {
    return props.component;
  }
})
const isError = computed(() => {
  return overwriteCbmStore.isError;
});
const detailSpec = computed(() => {
  if (!detailCbm.value.detailSpec) return

  const tempDetailSpec = detailCbm.value.detailSpec.filter((e) => {
    return e.cbmType != "CBM_GAP"
  })
  return orderBy(tempDetailSpec, ['uom', 'cbmRating', 'minValue'])
})
const detailSpecGap = computed(() => {
  if (!detailCbm.value.detailSpec) return

  const tempDetailSpecGap = detailCbm.value.detailSpec.filter((e) => {
    return e.cbmType == "CBM_GAP"
  })
  return orderBy(tempDetailSpecGap, ['uom', 'cbmRating', 'minValue'])
})
const isPreviousValueExist = computed(() => {
  return detailCbm.value.beforeReplacementItems && detailCbm.value.beforeReplacementItems[3].value ? true : false
})

const currentCondition = computed(() => {
  if (detailCbm.value && detailCbm.value.currentCondition) {
    return detailCbm.value.currentCondition;
  } else {
    return {};
  }
})
const historyModifiedDefault = computed(() => {
  if (detailCbm.value) {
    return detailCbm.value.historyModifiedDefault;
  } else {
    return [];
  }
})
const currentUpdatedBy = computed(() => {
  if (historyModifiedDefault.value
    && historyModifiedDefault.value[0].items[0].description == 'Adjustment'
    && detailCbm.value.historyModified != null
    && detailCbm.value.historyModified.detail.history[0].cbmAdjustmentReplacementValue) {
    return {
      name: detailCbm.value.historyModified.detail.history[0].cbmAdjustmentReplacementValue.updatedBy!.name,
      date: detailCbm.value.historyModified.detail.history[0].cbmAdjustmentReplacementValue.updatedDate!
    }
  } else {
    return {
      name: currentCondition.value?.updatedBy?.name || '',
      date: currentCondition.value?.updatedDate || ''
    }
  }
})
const itemServiceNumber = computed(() => {
  let numberFromHistory = '';
  if (historyModifiedDefault.value) {
    numberFromHistory = historyModifiedDefault.value[0]?.description.split(';')[0];
    if (historyModifiedDefault.value[0].description.split(';')[1] != '') {
      numberFromHistory += historyModifiedDefault.value[0]?.description.split(';')[1];
    }
  }
  if (currentCondition.value && currentCondition.value.taskNo == '') {
    return numberFromHistory
  } else if (currentCondition.value && currentCondition.value.taskNo && (currentCondition.value.taskNo.replace(/[^a-z]/gi, "").length > 1)) {
    return currentCondition.value.taskNo.replace(';', '').replace(/\D/g, '')
  } else if (currentCondition.value && currentCondition.value.taskNo && currentCondition.value.taskNo != '' && (currentCondition.value.taskNo.replace(/[^a-z]/gi, "").length <= 1)) {
    return currentCondition.value.taskNo.replace(';', '');
  } else {
    return ''
  }
})
const itemServiceText = computed(() => {
  let location = '';
  if (historyModifiedDefault.value) {
    for (const element of historyModifiedDefault.value[0].items) {
      if (element.itemType === 'html') {
        location = element.value;
      }
    }
  }
  if (location != '') {
    return location;
  } else {
    return currentCondition.value ? currentCondition.value.measurementLocation : '';
  }
})
const beforeReplacementItems = computed(() => {
  if (overwriteCbmStore.detailCbm.beforeReplacementItems != undefined) {
    return overwriteCbmStore.detailCbm.beforeReplacementItems;
  } else {
    return []
  }
})
const itemServiceValue = computed(() => {
  return overwriteCbmStore.isReplacementAdjustment ? beforeReplacementItems.value[4].value : currentCondition.value.measurementValue
})
const itemServiceRating = computed(() => {
  return overwriteCbmStore.isReplacementAdjustment ? beforeReplacementItems.value[6].value : currentCondition.value.rating
})
const itemServiceTimestamp = computed(() => {
  if (overwriteCbmStore.isReplacementAdjustment) {
    return {
      name: beforeReplacementItems.value[6].updatedBy!.name,
      date: beforeReplacementItems.value[6].updatedDate!
    }
  } else {
    return currentUpdatedBy.value
  }
})
const itemServicePrevious = computed(() => {
  if (beforeReplacementItems.value) {
    return beforeReplacementItems.value[3] ? beforeReplacementItems.value[3].value : "-"
  } else {
    return "-"
  }
})
const itemService = computed(() => {
  return {
    number: itemServiceNumber.value,
    text: itemServiceText.value,
    uom: currentCondition.value ? currentCondition.value.uom : '',
    measurement: itemServiceValue.value,
    rating: itemServiceRating.value,
    timestamp: itemServiceTimestamp.value,
    color: dropDownColor(itemServiceRating.value),
    previousMeasurement: itemServicePrevious.value,
    replacementMeasurement: currentCondition.value ? currentCondition.value.measurementValue : '',
    replacementRating: currentCondition.value ? currentCondition.value.rating : '',
    colorReplacementRating: dropDownColor(currentCondition.value ? currentCondition.value.rating : ''),
    replacementTimestamp: currentUpdatedBy.value,
    isReplacementAdjustment: overwriteCbmStore.isReplacementAdjustment,
  }
})

const itemServiceTextCaliper = computed(() => {
  let location = '';
  if (historyModifiedDefault.value) {
    location += historyModifiedDefault.value[0].description.split(';')[1];
    location += '. ';
    location += historyModifiedDefault.value[0].description.split(';')[2];
  }
  if (location != '') {
    return location;
  } else {
    return currentCondition.value ? currentCondition.value.measurementLocation : '';
  }
})
const itemServicePreviousCaliper = computed(() => {
  let prevVal = '-';
  if (historyModifiedDefault.value) {
    for (const element of historyModifiedDefault.value[0].items) {
      if (element.categoryItemType === 'previousParamRating') {
        prevVal = element.value;
      }
    }
  }
  return prevVal;
})
const itemServicePreviousRatingCaliper = computed(() => {
  let prevRating = '-';
  if (historyModifiedDefault.value) {
    for (const element of historyModifiedDefault.value[0].items) {
      if (element.categoryItemType === 'previousTargetRating') {
        prevRating = element.value ? element.value : '-';
      }
    }
  }
  return prevRating;
})
const caliperItemService = computed(() => {
  return {
    number: itemServiceNumber.value,
    text: itemServiceTextCaliper.value,
    uom: currentCondition.value ? currentCondition.value.uom : '',
    measurement: itemServiceValue.value,
    rating: itemServiceRating.value,
    timestamp: itemServiceTimestamp.value,
    color: dropDownColor(itemServiceRating.value),
    previousMeasurement: itemServicePreviousCaliper.value,
    previousRating: itemServicePreviousRatingCaliper.value,
    previousColor: itemServicePreviousRatingCaliper.value != '-' ? dropDownColor(itemServicePreviousRatingCaliper.value) : ''
  }
})
const OilCooledItemService = computed(() => {
  return {
    number: itemServiceNumber.value,
    text: itemServiceTextCaliper.value,
    uom: currentCondition.value ? currentCondition.value.pistonUom : '',
    tool: currentCondition.value ? currentCondition.value.pistonTool : '',
    pistonAValue: currentCondition.value ? currentCondition.value.pistonAValue : '',
    pistonBValue: currentCondition.value ? currentCondition.value.pistonBValue : '',
    pistonResultValue: currentCondition.value ? currentCondition.value.pistonResultValue : '',
    pistonPercentageValue: currentCondition.value ? currentCondition.value.pistonPercentageValue : 0,
    rating: currentCondition.value ? currentCondition.value.pistonRating : '',
    timestamp: itemServiceTimestamp.value,
    color: dropDownColor(currentCondition.value ? currentCondition.value.pistonRating : ''),
  }
})

const dropDownColor = (value: string | undefined) => {
  return value?.toLocaleLowerCase()
}

// define rating new version
const cbmRating = computed(() => {
  return overwriteCbmStore.cbmType;
});
const availableCbmTypes = computed(() => {
  return [
    ...overwriteCbmStore.cbmTypeAutomatic,
    ...overwriteCbmStore.cbmTypeManual,
    "AVERAGE",
    "CALIBRATION",
    "AUTOMATIC_REPLACEMENT",
    "AUTOMATIC_REPLACEMENT_GAP",
    "AUTOMATIC_PREVIOUS_GROUP",
    "OIL_COOLED",
    "CALIPER"
  ];
});

const submitRevision = async () => {
  // For some cases when sometimes the loading show in late
  loadingForModal.value = true;

  if (isError.value) return;

  overwriteCbmStore.stateEmployeeData = {
    id: authStore.user.EmployeeId,
    name: authStore.user.Name,
  };
  if (cbmRating.value == "MANUAL" || cbmRating.value == "NORMAL") {
    await overwriteCbmStore
      .updateTaskReviseManual(props.component, props.sampleDate, authStore.user.Name, props.source)
      .then(() => {
        if (!isError.value) {
          alertSuccess();
        } else {
          swalAlertError(overwriteCbmStore.errors[0], "Ok");
        }
      })
      .catch((error) => {
        console.log(error);
        swalAlertError("Error when revising. Please check your input.", "Ok");
      });
  } else if (cbmRating.value == "AUTOMATIC" || cbmRating.value.includes("PREVIOUS") || cbmRating.value == "CALIPER") {
    await overwriteCbmStore
      .updateTaskReviseAutomatic(props.component, props.sampleDate, authStore.user.Name, props.source)
      .then(() => {
        if (!isError.value) {
          alertSuccess();
        } else {
          swalAlertError(overwriteCbmStore.errors[0], "Ok");
        }
      })
      .catch((error) => {
        console.log(error);
        swalAlertError("Error when revising. Please check your input.", "Ok");
      });
  } else if (cbmRating.value == "AVERAGE") {
    await overwriteCbmStore.updateTaskReviseAverage();
    if (!isError.value) {
      alertSuccess();
    } else {
      swalAlertError(overwriteCbmStore.errors[0], "Ok");
    }
  } else if (cbmRating.value == "AUTOMATIC_REPLACEMENT" || cbmRating.value == "AUTOMATIC_REPLACEMENT_GAP") {
    await overwriteCbmStore
      .updateTaskReviseAutomaticReplacementAndGap(props.component, props.sampleDate, authStore.user.Name, props.source)
      .then(() => {
        if (!isError.value) {
          alertSuccess();
        } else {
          swalAlertError(overwriteCbmStore.errors[0], "Ok");
        }
      })
      .catch((error) => {
        console.log(error);
        swalAlertError("Error when revising. Please check your input.", "Ok");
      });
  } else if (cbmRating.value == "OIL_COOLED") {
    await overwriteCbmStore.updateTaskReviseOilCooled(props.component, props.sampleDate, authStore.user.Name, props.source)
      .then(() => {
        if (!isError.value) {
          alertSuccess();
        } else {
          swalAlertError(overwriteCbmStore.errors[0], "Ok");
        }
      })
      .catch((error) => {
        console.log(error);
        swalAlertError("Error when revising. Please check your input.", "Ok");
      });
  }
  loadingForModal.value = false;
};

const alertSuccess = () => {
  swalAlertSuccessTitle(
    "Revision Successfully Submitted",
    "Please allow up to 30 minutes for IronPortal to update visualisations.",
    "Ok"
  ).then(() => {
    closeModal();
  });
};

const handleClickCamera = (showCloseButton: boolean) => {
  camStore.setIsReplacementCamera(cbmRating.value === 'AUTOMATIC_REPLACEMENT' || cbmRating.value === 'AUTOMATIC_REPLACEMENT_GAP');
  camStore.toggleIsVisible(true, "modifiedCBM");
  camStore.setShowCloseButton(showCloseButton);
};

// Fullscreen Image
const selectedFullscreenImage = ref<string>("");
const showFullImage = ref(false);

const getImageUrl = (filename: string) => {
  if (keyValues.value.length < 1) return undefined;
  let value: string | undefined = undefined;
  do {
    value = keyValues.value.find((k) => {
      return k.key == filename;
    })?.value;
  } while (!value);
  return value;
};

const closeModal = () => {
  resetAll();
  emits("onClose");
};

const resetAll = () => {
  isFormError.value = false;
  isModifying.value = false;
  camStore.reset();
  overwriteCbmStore.resetList();
  overwriteCbmStore.resetErrors();
  overwriteCbmStore.setInputErrorCbmAutomatic("", false);
};

const openEdit = () => {
  if (cbmRating.value == "AVERAGE") {
    overwriteCbmStore.initErrorInputCbmAverage();
  }

  // TECH-DEBT: must be not use lodash.get because intelicense can't detech some of object address changed
  const is_modify_limit_reached =
    get(detailCbm.value, "historyModified.detail.history.length", 0) >= 3;

  if (is_modify_limit_reached) {
    swalAlertError("Cannot revise the data, you have limit for revising 2 times.", "Ok");
    return;
  }

  isModifying.value = true;
  overwriteCbmStore.setModifiedObject(detailCbm);
};

const openFirst = async () => {
  overwriteCbmStore.stateIsError = true;

  // Check if user has the access to revise
  const menuStore = useMenuStore();
  console.log(menuStore.menu.allMenu);
  const hasMenuRevise = menuStore.menu.allMenu.findIndex((menu) => {
    return menu.MenuId == 224;
  })
  overwriteCbmStore.setIsUserCanRevise(hasMenuRevise != -1)

  await getDetailCbm();

  console.log("📦 detailCbm.value", detailCbm.value);
  const imagesFromCurrentCbm = (cbmRating.value == "AUTOMATIC_REPLACEMENT" || cbmRating.value == "AUTOMATIC_REPLACEMENT_GAP") && props.source == 'serviceSheet'
    ? detailCbm.value.replacementPhoto[0].items[2].value
    : detailCbm.value.detailedPicture;

  if (!imagesFromCurrentCbm) {
    imageArray.value = [];
    return
  }

  loader.value = Array.apply(null, Array(imagesFromCurrentCbm)).map(
    function () {
      return true;
    }
  );
  lastCount.value = 0;
  keyValues.value = [];

  console.log("📦 imagesFromCurrentCbm", imagesFromCurrentCbm);

  imageArray.value = Array.isArray(imagesFromCurrentCbm)
    ? stringToImageInfoConvert(imagesFromCurrentCbm)
    : imagesFromCurrentCbm;

  console.log("📦 imageArray.value", imageArray.value);
  await getUrl();
};

const getDetailCbm = async () => {
  const params = {
    taskKey: props.taskKey,
    workOrder: props.workOrder,
    component: props.component || "",
  };
  overwriteCbmStore.setParamGetDetailCbm(params);
  switch (props.source) {
    case 'interim':
      await overwriteCbmStore.getDetailCbmInterim();
      break;
    case 'intervention':
      await overwriteCbmStore.getDetailIntervention();
      break;
    default:
      await overwriteCbmStore.getDetailCbm();
      break;
  }
};
const getUrl = async () => {
  if (imageArray.value && imageArray.value.length < 1) {
    return;
  }
  for (const [index, info] of imageArray.value.entries()) {
    const resImage: any = await overwriteCbmStore.getImage(info);

    if (resImage) {
      keyValues.value.push({
        key: resImage.key,
        value: resImage.value,
      });

      imageArray.value[index] = {
        ...imageArray.value[index],
        imgBlob: resImage.blob,
        url: getImageUrl(imageArray.value[index].filename),
      };
      loader.value[index] = false;
    }
  }
};

const imageArrayCopied = ref();
const handleShowFullScreen = (fileName) => {
  const index = imageArray.value.findIndex((item) => {
    return item.filename == fileName;
  });

  const imageInfo = imageArray.value[index];
  if (index > 0) {
    const front = imageArray.value.slice(index);
    const back = imageArray.value.slice(0, index);
    imageArrayCopied.value = [...front, ...back];
  } else {
    imageArrayCopied.value = imageArray.value;
  }

  selectedFullscreenImage.value = imageInfo.url;
  showFullImage.value = true;
};

const closeFullScreenImage = () => {
  selectedFullscreenImage.value = "";
  showFullImage.value = false;
};
</script>

<style lang="scss" scoped>
.grey-box {
  background-color: #f4f6f8;
  border: #e7eaee 2px solid;
  width: 100%;
  border-radius: 0.75rem;
}
.table {
  border: #e7eaee 2px solid;
}
.table-header .table-border-right-white {
  text-align: center;
  font-weight: 500 !important;
}
.table-border-right-white {
  border-right: 1px solid white;
}
.alert-revise {
  background-color: #d6f0fc;
  i {
    color: #154860;
  }
}

.odd {
  background: #d5e3cf;
}
.even {
  background: #eaf1e9;
}

.cursor-pointer:hover {
  cursor: pointer;
}
</style>
