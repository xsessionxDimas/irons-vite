<template>
  <div class="mt-5 ps-0">
    <el-collapse
      v-model="activeTaskGroupPersonnel"
      class="general-accordion task-group py-1 px-5 mb-3"
    >
      <el-collapse-item name="Intervention Labour Personnel">
        <template #title>
          <h4 class="subtitle ps-3">Intervention Labour Personnel</h4>
        </template>
        <div class="p-2 me-0">
          <div class="row" style="width: 101%">
            <div class="col-12 pe-0">
              <SelectSearch
                :field-label="'Labour Personnel Name'"
                placeholder="Select your name"
                :data="personnel"
                :value="fitter?.name"
                :display-label="true"
                @on-focus="onSelectFocus"
                @on-lost-focus="onSelectLostFocus"
                @on-selected="onPersonnelSelected"
                :disabled="personelDisabled"
              />
            </div>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between">
          <div class="p-2 d-flex flex-row flex-grow-1">
            <div class="d-flex w-100">
              <div class="flex-fill">
                <div class="form-floating mb-3">
                  <input
                    type="text"
                    class="form-control"
                    v-model="dataServiceStart"
                    disabled
                  />
                  <label>Intervention Start Date</label>
                </div>
              </div>
              <div class="flex-fill ps-3">
                <div class="form-floating mb-3">
                  <input
                    type="text"
                    class="form-control"
                    :value="serialNumber"
                    disabled
                  />
                  <label>Serial Number</label>
                </div>
              </div>
              <div class="flex-fill ps-3">
                <div class="form-floating mb-3 position-relative">
                  <template v-if="intervention.interventionSMU || !fitter">
                    <input type="text" class="form-control" placeholder="Machine SMU" disabled :value="formatNumberWithComma(intervention.interventionSMU || dataSMU)" pattern="[0-9]*" inputmode="numeric"/>
                  </template>
                  <template v-else>
                    <input type="text" name="machine-smu" ref="machineSMUField" class="form-control" placeholder="Machine SMU" :disabled="hasOpenedDialog" @keypress="onlyNumber" @input="onlyNumberWhenInput" @focusout="handleSMUOnTyping" :value="formattedSMU" pattern="[0-9]*" inputmode="numeric"/>
                  </template>
                  <!-- edit smu -->
                  <div class="ms-2 position-absolute" style="top: 2px; right: 0;" v-if="!intervention.isApprovedSmu && intervention.interventionSMU && fitter?.name">
                    <button class="btn p-4 justify-items-center rounded cursor-pointer svg-icon svg-icon-btech-primary-500" @click="handleEditClick">
                      <img src="media/icons/bumaau/icon-edit.png" style="width: 1.25rem; height: 1.25rem" />
                    </button>
                  </div>
                  <label for="floatingInput2" class="text-nowrap"
                    >Machine SMU</label
                  >
                </div>
                <template v-if="validation.SMU">
                  <label class="text-danger ps-2 font-weight-bold">{{
                    validation.SMU
                  }}</label>
                </template>
              </div>
              <div class="ms-2">
                <button
                  class="btn p-4 justify-items-center rounded"
                  :disabled="smuCameraDisabled"
                  style="background: #f4f6f8; cursor: pointer"
                  @click="onCameraClicked"
                >
                  <template v-if="smuImages && smuImages.length > 0">
                    <NwImg
                      src="/media/svg/dma/camera/e-form/png/cam-user.png"
                      style="height: 20px; width: 24px"
                      alt="camera"
                    />
                  </template>
                  <template v-else-if="smuCameraDisabled">
                    <NwImg
                      src="/media/svg/dma/camera/e-form/png/cam-read.png"
                      style="height: 20px; width: 24px"
                      alt="camera"
                    />
                  </template>
                  <template v-else>
                    <NwImg
                      src="/media/svg/dma/camera/e-form/png/cam-active.png"
                      style="height: 20px; width: 24px"
                      alt="camera"
                    />
                  </template>
                </button>
              </div>
              <div class="ms-2" v-if="smuImages && smuImages.length > 0">
                <div class="p-3 justify-items-center rounded" style="background: #18af4a">
                  <span
                    style="font-weight: 700; color: white; cursor: pointer"
                    @click="() => (showImages = true)"
                    >+{{ smuImages.length }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="smuBy && smuDate" class="d-flex flex-row justify-content-end timestamp-task">
          {{ smuBy.name }}, {{ smuDate }}
        </div>
        <div class="d-flex flex-row">
          <div class="flex-fill ps-3">
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Hour Meter Offset"
                disabled
                :value="formatHmOffset(intervention.hmOffset || dataHmOffset)"
              />
              <label for="floatingInput2" class="text-nowrap">Hour Meter Offset</label>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
  <ImagePreview
    :re-render="reRender"
    :images="(smuImages as string[])"
    :show-delete-button="true"
    :visibility="showImages"
    :type="'imageEquipment'"
    :show-mandatory-caption="false"
    @on-close="onCloseImagePreview"
    @on-downloaded="onImageDownloaded"
    @on-delete="onImageDeleted"
  />
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  defineEmits,
  defineExpose,
  nextTick,
  PropType,
  ref,
  watch
} from "vue";
import { Option } from "@/core/types/misc/Option";
import {
  formatNumberWithComma,
  reformatNumberWithComma
} from "@/core/helpers/number-format";
import SelectSearch from "@/components/inputs/dma/SelectSearchWithLabel.vue";
import { Intervention } from "@/core/types/intervention/Intervention";
import { HeaderValidation } from "@/core/types/intervention/HeaderValidation";
import { AESTCurrentDateTime } from "@/core/helpers/date-format";
import { cloneDeep, isUndefined } from "lodash";
import { Audit } from "@/core/types/intervention/Audit";
import ImagePreview from "@/components/camera/ImagePreview.vue";
import { CameraParam } from "@/core/types/intervention/CameraParam";
import { FileDeleteParam } from "@/core/types/intervention/FileDeleteParam";
import { ImageLoadParam } from "@/core/types/intervention/ImageLoadParam";
import {
  onlyNumberResult
} from "@/store/pinia/dma/e-form/helpers";
import {
  isCameraDisabled,
  isCameraDisabledParam
} from "@/core/helpers/ironforms/disabled-state";

const props = defineProps({
  personnel: {
    required: true,
    type: Object as PropType<Option[]>,
  },
  fitter: {
    required: true,
    type: Object as PropType<Audit | undefined>,
  },
  intervention: {
    required: true,
    type: Object as PropType<Intervention>,
  },
  generalSubmitted: {
    required: true,
    type: Boolean,
  },
  validation: {
    required: true,
    type: Object as PropType<HeaderValidation>,
  },
  formAgreement: {
    required: false,
    type: Boolean,
    default: false,
  },
  reRender: {
    type: Boolean,
    default: false,
  },
  serialNumber: {
    required: true,
    type: String
  },
  hasOpenedDialog: {
    required: true,
    type: Boolean,
  }
});

const emits = defineEmits([
  "onPersonnelSelected",
  "onSMUChanged",
  "onCameraClicked",
  "onImageDownloaded",
  "onImageDeleted",
  "onSMUReviseIconClicked"
]);

/* refs */
const relativeClass = ref("");
const activeTaskGroupPersonnel = ref("Intervention Labour Personnel");
const dataSMU = ref(props.intervention.interventionSMU ?? "");
const dataHmOffset = ref(props.intervention.hmOffset ?? "0");
const dataServiceStart = ref(props.intervention.serviceStart);
const showImages = ref(false);
const machineSMUField = ref();

/* computeds */
const smuCameraDisabled = computed(() => {
  const params:isCameraDisabledParam = [
    props.intervention.interventionExecution,
    props.intervention.imageEquipment
  ]
  const isDisabled = isCameraDisabled(...params)
  return isDisabled || !props.fitter;
});
const interventionSMU = computed(() => {
  return props.intervention.interventionSMU;
});
const serviceStart = computed(() => {
  return props.intervention.serviceStart;
});
const personelDisabled = computed(() => {
  return props.generalSubmitted;
});
const smuImages = computed(() => {
  return props.intervention.imageEquipment as string[] | undefined;
});
const formattedSMU = computed(() => {
  let formatted = formatNumberWithComma(dataSMU.value)
  if (formatted == '0') formatted = ''
  return formatted
})

const smuBy = computed(() : Audit | undefined => {
  return props.intervention.smuBy
})

const smuDate = computed((): string | undefined => {
  return props.intervention.smuDate
})

/* methods and handlers */

const onlyNumber = ($event) => {
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
    $event.preventDefault();
  }
  if (keyCode == 13) { // Allow 13 (Enter) to calculate
    machineSMUField.value!.blur()
    return
  }
}
const onSelectFocus = () => {
  relativeClass.value = "relative-hidder";
};
const onSelectLostFocus = () => {
  relativeClass.value = "";
};
const onPersonnelSelected = (opt: Option) => {
  if (!dataServiceStart.value) {
    dataServiceStart.value = AESTCurrentDateTime();
  }
  const data = {
    option: cloneDeep(opt),
    serviceStart: dataServiceStart.value,
  };
  emits("onPersonnelSelected", data);
};
const onCameraClicked = () => {
  // if (smuCameraDisabled.value) return;
  const param = {} as CameraParam;
  param.type = "imageEquipment";
  param.key = props.intervention.key;
  emits("onCameraClicked", param);
};
const onImageDownloaded = (image: ImageLoadParam) => {
  emits("onImageDownloaded", image);
};
const onImageDeleted = (param: FileDeleteParam) => {
  emits("onImageDeleted", param);
};

const onlyNumberWhenInput = (event) => {
  event.target.value = onlyNumberResult(event.target.value)
}

const formatSMU = (val) => {
  if (!val) return val;
  const array = val.split(".");
  if (array.length > 1) {
    array[1] = array[1].slice(0, 2);
  }
  return formatNumberWithComma(array.join("."));
};

const formatHmOffset = (val) => {
  if (val != 'Not Applicable') {
    return formatNumberWithComma(val);
  } else {
    return 'Not Applicable'
  }
}

const resetInputSMU = () => {
  dataSMU.value = '';
  machineSMUField.value.value = '';
  // focus to machine SMU field
  nextTick(() => {
    machineSMUField.value.focus();
  })
}

let timer;
// this function will be triggered when smu typed
const handleSMUOnTyping = async (event) => {
  event.target.value = formatNumberWithComma(
    reformatNumberWithComma(event.target.value),
  );
  clearTimeout(timer);
  if (event.target.value == "") return false;
  timer = setTimeout(async () => {
    emits("onSMUChanged", event.target.value);
  }, 0);
};

const onCloseImagePreview = () => {
  showImages.value = false
}

defineExpose({
  resetInputSMU,
  onCameraClicked,
  onCloseImagePreview
})

const handleEditClick = () => {
  emits("onSMUReviseIconClicked")
}

/* watchers */
// watch(dataSMU, async (newVal) => {
//   const match = newVal.match(/^[0-9]+(\.[0-9]{1,2}$)?/);
//   if (!match) {
//     dataSMU.value = "";
//     return;
//   }
//   dataSMU.value = formatSMU(newVal);
//   emits("onSMUChanged", dataSMU.value);
//   if (!interventionSMU.value) return;
//   if (dataSMU.value != interventionSMU.value) {
//     dataSMU.value = formatSMU(interventionSMU.value);
//   }
// });
watch(dataServiceStart, () => {
  if (serviceStart.value) {
    dataServiceStart.value = serviceStart.value;
  }
});
watch(
  () => {
    return props.intervention;
  },
  (newValue) => {
    if (newValue) {
      dataServiceStart.value = props.intervention.serviceStart ?? "";
    }
  }
);
</script>

<style lang="scss" scoped>
@import "@/assets/sass/pages/floating-label.scss";
</style>

<style>
.form-control,
.form-select {
  color: #919eab;
}

.vcp {
  background: white;
  border: 1px solid rgba(145, 158, 171, 0.24);
  border-radius: 12px;
}

.vcp__body {
  overflow: inherit !important;
}

.title {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #212b36;
}

.subtitle {
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
}

.no-float {
  height: 48px;
}

.relative-hidder {
  position: inherit !important;
}

@media only screen and (max-width: 767px) {
  .no-float {
    height: 44px;
  }
}
</style>
