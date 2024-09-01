<template>
  <div class="mt-5 ps-0">
    <el-collapse v-model="activeTaskGroup" class="general-accordion task-group py-1 px-5 mb-3">
      <el-collapse-item name="Equipment Information">
        <template #title>
          <h4 class="subtitle ps-3">Service Labour Personnel</h4>
        </template>
        <div class="p-2 me-0">
          <div class="row" style="width: 101%">
            <div class="col-12 pe-0">
              <SelectSearch ref="selectFitter" :field-label="'Labour Personnel Name'" placeholder="Select your name"
                :data="personelStore.PersonelLabours" :value="fitter.name" :display-label="true" @on-focus="onSelectFocus"
                @on-lost-focus="onSelectLostFocus" @on-selected="onPersonnelSelected" :disabled="personelDisabled" />
            </div>
          </div>
        </div>
        <div class="p-2 me-0">
          <div class="row" style="width: 101%">
            <div class="col-6 pe-0">
              <div class="form-floating mb-3" :class="relativeClass" style="position: relative !important">
                <input type="text" class="form-control" disabled :value="actualServiceStart" />
                <label for="floatingInput" class="text-nowrap">Actual Service Start (each labour personnel)</label>
              </div>
            </div>
            <div class="col-6 pe-0">
              <div class="form-floating mb-3" style="position: relative !important">
                <input type="text" class="form-control no-float" disabled :value="shift" />
                <label for="floatingInput">Shift</label>
              </div>
            </div>
          </div>
        </div>
        <h4 class="subtitle ps-3">Equipment Information</h4>
        <div class="d-flex flex-row justify-content-between">
          <div class="p-2 pb-0 d-flex flex-row flex-grow-1">
            <div class="d-flex w-100">
              <div class="flex-fill">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" disabled :value="eFormStore.unitNumber" />
                  <label>Unit Number</label>
                </div>
              </div>
              <div class="flex-fill ps-3">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" disabled :value="eFormStore.generalForm.serialNumber" />
                  <label>Serial Number</label>
                </div>
              </div>
              <div class="flex-fill ps-3">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" disabled :value="data.workOrder" />
                  <label for="floatingInput">Work Order</label>
                </div>
              </div>
              <div class="flex-fill ps-3">
                <div class="form-floating mb-3 position-relative">
                  <template v-if="data.smu !== ''">
                    <input type="text" class="form-control" placeholder="Machine SMU" disabled
                      :value="formatNumberWithComma(data.smu)" pattern="[0-9]*" inputmode="numeric" />
                  </template>
                  <template v-else>
                    <input type="text" name="machine-smu" ref="machineSMUField" class="form-control" :disabled="showConfirmSMU || showTakePhotoSMU"
                      placeholder="Machine SMU" @keypress="onlyNumber" @input="onlyNumberWhenInput" :value="formattedSMU"
                      @focusout="handleSMUOnTyping" pattern="[0-9]*" inputmode="numeric" />
                  </template>
                  <!-- edit smu -->
                  <div class="ms-2 position-absolute" style="top: 2px; right: 0;" v-if="!data.isApprovedSmu && data.smu && fitter?.name">
                    <button class="btn p-4 justify-items-center rounded cursor-pointer svg-icon svg-icon-btech-primary-500" @click="handleEditClick">
                      <img src="media/icons/bumaau/icon-edit.png" style="width: 1.25rem; height: 1.25rem" />
                    </button>
                  </div>
                  <label for="floatingInput2" class="text-nowrap">Machine SMU</label>
                </div>
                <template v-if="validation.smu">
                  <label class="text-danger ps-2 font-weight-bold">{{
                    validation.smu
                  }}</label>
                </template>
              </div>
              <div class="ms-2">
                <button class="btn p-4 justify-items-center rounded" :disabled="smuCameraDisabled"
                  style="background: #f4f6f8; cursor: pointer" @click="triggerCamera">
                  <img :src="cameraColor()" style="height: 20px; width: 24px" alt="camera" />
                </button>
              </div>
              <div class="ms-2" v-if="smuImages.length > 0">
                <div class="p-3 justify-items-center rounded" style="background: #18af4a">
                  <span style="font-weight: 700; color: white" @click="handleShowSMUImagesDialog">+{{ smuImages.length
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="smuBy && smuDate" class="d-flex flex-row justify-content-end timestamp-task">
          {{ smuBy.name }}, {{ smuDate }}
        </div>
        <div class="d-flex flex-row justify-content-between">
          <div class="p-2 d-flex flex-row flex-grow-1">
            <div class="d-flex w-100">
              <div class="flex-fill">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" disabled :value="data.serviceStart" />
                  <label>Actual Service Start</label>
                </div>
              </div>
              <div class="flex-fill ps-3">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" disabled :value="formStore.HmOffset" />
                  <label for="floatingInput">Hour Meter Offset</label>
                </div>
              </div>
              <div v-if="!isUndefined(data.travelHour)" class="d-flex" style="flex-basis: 40%">
                <div class="flex-fill ps-3">
                  <div class="form-floating mb-3">
                    <template v-if="data.travelHour !== '' ||
                      formStore.generalUpdated ||
                      formStore.generalForm.status == 'Submited'
                      ">
                      <input type="text" class="form-control travel-swing" placeholder="Travel Hours" disabled
                        :value="formatNumberWithComma(data.travelHour)" pattern="[0-9]*" inputmode="numeric" />
                    </template>
                    <template v-else>
                      <input type="text" class="form-control travel-swing" placeholder="Travel Hours"
                        @keypress="onlyNumber" @input="onlyNumberWhenInput" :value="formattedTravelHour"
                        @focusin="() => { currentValue = formattedTravelHour }" @focusout="handleTravelHourOnTyping"
                        pattern="[0-9]*" inputmode="numeric" />
                    </template>
                    <label for="floatingInput2" class="text-nowrap">Travel Hours</label>
                  </div>
                  <template v-if="validation.travelHour">
                    <label class="text-danger ps-2 font-weight-bold">{{
                      validation.travelHour
                    }}</label>
                  </template>
                </div>
                <div class="ms-2">
                  <button class="btn p-4 justify-items-center rounded" :disabled="travelHourCameraDisabled"
                    style="background: #f4f6f8; cursor: pointer" @click="triggerCameraTravel">
                    <img :src="cameraColorTravel()" style="height: 20px; width: 24px" alt="photo" />
                  </button>
                </div>
                <div class="ms-2" v-if="travelHourImages.length > 0">
                  <div class="p-3 justify-items-center rounded" style="background: #18af4a">
                    <span style="font-weight: 700; color: white" @click="handleShowTravelHourImagesDialog">+{{
                      travelHourImages.length }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between">
          <div class="p-2 d-flex flex-row flex-grow-1">
            <div class="d-flex w-100">
              <div class="flex-fill">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" disabled :value="data.serviceEnd" />
                  <label>Actual Service Finish</label>
                </div>
              </div>
              <div v-if="!isUndefined(data.swingHour)" class="d-flex" style="flex-basis: 40%">
                <div class="flex-fill ps-3">
                  <div class="form-floating mb-3">
                    <template v-if="data.swingHour !== '' ||
                      formStore.generalUpdated ||
                      formStore.generalForm.status == 'Submited'
                      ">
                      <input type="text" class="form-control travel-swing" placeholder="Swing Hours" disabled
                        :value="formatNumberWithComma(data.swingHour)" pattern="[0-9]*" inputmode="numeric" />
                    </template>
                    <template v-else>
                      <input type="text" class="form-control travel-swing" placeholder="Swing Hours"
                        @keypress="onlyNumber" @input="onlyNumberWhenInput" :value="formattedSwingHour"
                        @focusin="() => { currentValue = formattedTravelHour }" @focusout="handleSwingHourOnTyping"
                        pattern="[0-9]*" inputmode="numeric" />
                    </template>
                    <label for="floatingInput2" class="text-nowrap">Swing Hours</label>
                  </div>
                  <template v-if="validation.swingHour">
                    <label class="text-danger ps-2 font-weight-bold">{{
                      validation.swingHour
                    }}</label>
                  </template>
                </div>
                <div class="ms-2">
                  <button class="btn p-4 justify-items-center rounded" :disabled="swingHourCameraDisabled"
                    style="background: #f4f6f8; cursor: pointer" @click="triggerCameraSwing">
                    <img :src="cameraColorSwing()" style="height: 20px; width: 24px" alt="photo" />
                  </button>
                </div>
                <div class="ms-2" v-if="swingHourImages.length > 0">
                  <div class="p-3 justify-items-center rounded" style="background: #18af4a">
                    <span style="font-weight: 700; color: white" @click="handleShowSwingHourImagesDialog">+{{
                      swingHourImages.length }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>

  <GeneralDialog modal-type="alreadyFilled" :show="showSMUAlreadyFilled" @close="closeSMUAlreadyFilledModal" />
  <GeneralDialog modal-type="notMapped" :show="showSMUToleranceNotMapped" @close="closeSMUToleranceNotMappedModal" />
  <template v-if="showSMUImageDialog">
    <ImagePreview :type="'imageEquipment'" :re-render="false" :images="smuImages" :show-delete-button="true"
      :is-mandatory="true" :visibility="showSMUImageDialog" :is-monitoring="false" :show-mandatory-caption="false"
      @on-close="handleHideSMUImagesDialog" @on-delete="deleteSMUImage" />
  </template>
  <template v-if="showTravelHourImageDialog">
    <ImagePreview :type="'equipment-travel'" :re-render="false" :images="travelHourImages" :show-delete-button="true"
      :is-mandatory="false" :visibility="showTravelHourImageDialog" :is-monitoring="false" :show-mandatory-caption="false"
      @on-close="handleHideTravelHourImagesDialog" @on-delete="deleteTravelImage" />
  </template>
  <template v-if="showSwingHourImageDialog">
    <ImagePreview :type="'equipment-swing'" :re-render="false" :images="swingHourImages" :show-delete-button="true"
      :is-mandatory="false" :visibility="showSwingHourImageDialog" :is-monitoring="false" :show-mandatory-caption="false"
      @on-close="handleHideSwingHourImagesDialog" @on-delete="deleteSwingImage" />
  </template>
  <ConfirmationNonBold :visibility="showConfirmSMU" :caption="confirmationSMUCaption" @on-no-confirm="onCancelSMU"
    @on-yes-confirm="onConfirmSMU" />
  <Confirmation :visibility="showTakePhotoSMU" caption="Please take photo of Machine SMU in the cabin dashboard"
    yes-label="Take a Photo" :hide-no="true" @on-yes-confirm="onConfirmTakePhoto" />
  <Confirmation :visibility="showTakePhotoTravel" caption="Please take photo"
  yes-label="Take a Photo" :hide-no="true" @on-yes-confirm="onConfirmTakeTravelPhoto" />
  <Confirmation :visibility="showTakePhotoSwing" caption="Please take photo"
  yes-label="Take a Photo" :hide-no="true" @on-yes-confirm="onConfirmTakeSwingPhoto" />
  <ToastWithIcon :show="isSuccessTakePhoto" message="Machine SMU photo has been taken" />
  <SMUDetailDialog
    v-model:show="showSMUDetailDialog"
    :detailDefect="detailSMUDialog"
    :ownership="formatOwnershipHTML"
    :view-only="data.isApprovedSmu"
    :error-status="errorData"
    :isFitter="true"
    :cameras-image="imageObjectRevise"
    @updateDefectDetailSMU="handleReviseSMU"
    @retake-photo="handleRetakePhotoRevise"
    @reset-photo="handleResetCameraStore"
    @reset-error-status="resetErrorStatus"
  />
</template>

<script lang="ts" setup>
import {
  handleConvertTo24Hrs,
  getUTCOffsetTime,
  dayNightConverter,
  getUTCOffsetDate,
  AESTCurrentDateTime,
} from "@/core/helpers/date-format";
import { General } from "@/core/types/entities/dma/e-form/general/General";
import SelectSearch from "@/components/inputs/dma/SelectSearchWithLabel.vue";
import {
  defineEmits,
  defineProps,
  defineExpose,
  onMounted,
  PropType,
  ref,
  computed,
  watch,
  nextTick,
} from "vue";
import {
  useInterimGeneralFormStore
} from "@/store/pinia/dma/interim-engine-service/useInterimGeneralFormStore";
import { useCameraStore } from "@/store/pinia/application/useCameraStore";
import { Option } from "@/core/types/misc/Option";
import { v4 as uuidv4 } from "uuid";
import {
  useInterimEngineStore
} from "@/store/pinia/dma/interim-engine-service/useInterimEngineStore";
import {
  isUndefined,
  cloneDeep,
  last,
  isEqual
} from "lodash";
import GeneralDialog from "@/views/dma/components/GeneralDialog.vue";
import {
  usePersonelLabourStore
} from '@/store/pinia/dma/personel-labour/usePersonelLabourStore';
import ImagePreview from '@/components/camera/ImagePreview.vue'
import ConfirmationNonBold from '@/components/dialog/ConfirmationNonBold.vue'
import Confirmation from '@/components/dialog/Confirmation.vue'
import ToastWithIcon from '@/components/dialog/ToastWithIcon.vue'
import {
  formatNumberWithComma,
  reformatNumberWithComma,
} from "@/core/helpers/number-format";
import {
  stringToImageInfoConvert
} from "@/core/helpers/string-to-imageinfo-converter";
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo";
import {
  checkIsSMUOnRange,
  onlyNumberResult
} from "@/store/pinia/dma/e-form/helpers";
import {
  useInterimDefectsFormStore
} from "@/store/pinia/dma/interim-engine-service/defects/useInterimDefectsFormStore";
import { ElLoading } from "element-plus";
import {
  useDefectsFormStore
} from '@/store/pinia/dma/e-form/defects/useDefectsFormStore'
import { formatOwnership } from "@/store/pinia/dma/e-form/helpers"
import SMUDetailDialog from '@/views/dma/components/defects/SMUDetailDialog.vue'
import {
  DefectSMU,
  submitDetailParameter
} from "@/core/types/entities/dma/defects/DefectSMU";
import { MachineSMUEnum } from "@/store/enums/MachineSMUEnum";
import { Audit } from "@/core/types/intervention/Audit";
import { ImageObject } from "@/core/types/entities/dma/ImageObject";
import { CameraId } from "@/store/enums/CameraIdEnum";

const props = defineProps({
  data: {
    required: true,
    type: Object as PropType<General>,
  },
  timer: {
    required: true,
    type: String,
  },
});

const emits = defineEmits(["onPersonelSelected", "updateTimer"]);

/* stores */
const formStore = useInterimGeneralFormStore();
const camStore = useCameraStore();
const eFormStore = useInterimEngineStore();
const personelStore = usePersonelLabourStore();
const defectStore = useInterimDefectsFormStore();
const eFormDefectStore = useDefectsFormStore();

/* refs */
const actualServiceStart = ref(eFormStore.serviceStart);
const shift = ref(eFormStore.shift);
const activeTaskGroup = ref("Equipment Information");
const relativeClass = ref("");
const validation = ref({
  smu: "",
  travelHour: "",
  swingHour: "",
});
const showSMUAlreadyFilled = ref(false);
const showSMUToleranceNotMapped = ref(false);
const selectFitter = ref();
const showConfirmSMU = ref<boolean>(false);
const showTakePhotoSMU = ref<boolean>(false);
const showTakePhotoTravel = ref<boolean>(false)
const showTakePhotoSwing = ref<boolean>(false)
const confirmationSMUCaption = ref<string>("");
const isSuccessTakePhoto = ref<boolean>(false);
const currentValue = ref("");
const smuType = ref<string>("")
const showSMUDetailDialog = ref<boolean>(false);
const dataSMU = ref("");
const dataSMUBy = ref<Audit>({
  name: '',
  id: ''
});
const dataSMUDate = ref("");
const dataTravelHour = ref("");
const dataSwingHour = ref("");
const fromDeleteCamera = ref(false);

const hmOffset = computed(() => {
  if (formStore.generalForm.hmOffset) {
    return Number(formStore.generalForm.hmOffset);
  } else {
    return 0;
  }
});
const minRangeValue = computed(() => {
  const smuValidation = formStore.smuActual;
  const tolerance = formStore.smuTolerance;
  return Number(Number(smuValidation) + Number(tolerance.min));
});
const maxRangeValue = computed(() => {
  const smuValidation = formStore.smuActual;
  const tolerance = formStore.smuTolerance;
  return Number(Number(smuValidation) + Number(tolerance.max));
});
const minSMUValue = computed(() => {
  return minRangeValue.value - hmOffset.value;
});
const maxSMUValue = computed(() => {
  return maxRangeValue.value - hmOffset.value;
});
const isSMUOnRange = computed(() => {
  return checkIsSMUOnRange({
    smu: dataSMU.value || props.data.smu,
    hmOffset: hmOffset.value,
    range: {
      min: minRangeValue.value,
      max: maxRangeValue.value,
    }
  })
});
const smuBy = computed(() : Audit | undefined => {
  if (dataSMUBy.value.name) {
    return dataSMUBy.value
  }
  return props.data?.smuBy
})

const smuDate = computed((): string | undefined => {
  if (dataSMUDate.value != "") {
    return dataSMUDate.value
  }
  return props.data?.smuDate
})

const errorData = computed(() => {
  return {
    isError: defectStore.stateErrorMessage == '' ? false : true,
    messages: defectStore.stateErrorMessage
  }
})

const cameraColor = () => {
  // belum ada yang take pic
  let camera = "/media/svg/dma/camera/e-form/png/cam-active.png";
  // hanya red
  if (smuCameraDisabled.value) {
    camera = "/media/svg/dma/camera/e-form/png/cam-read.png";
  }
  if (smuImages.value.length > 0) {
    camera = "/media/svg/dma/camera/e-form/png/cam-user.png";
  }
  return camera;
};
const cameraColorSwing = () => {
  // belum ada yang take pic
  let camera = "/media/svg/dma/camera/e-form/png/cam-active.png";
  // hanya red
  if (swingHourCameraDisabled.value) {
    camera = "/media/svg/dma/camera/e-form/png/cam-read.png";
  }
  if (swingHourImages.value.length > 0) {
    camera = "/media/svg/dma/camera/e-form/png/cam-user.png";
  }
  return camera;
};
const cameraColorTravel = () => {
  // belum ada yang take pic
  let camera = "/media/svg/dma/camera/e-form/png/cam-active.png";
  // hanya red
  if (travelHourCameraDisabled.value) {
    camera = "/media/svg/dma/camera/e-form/png/cam-read.png";
  }
  if (travelHourImages.value.length > 0) {
    camera = "/media/svg/dma/camera/e-form/png/cam-user.png";
  }
  return camera;
};

// ----- SMU IMAGES -----
const smuImages = computed(() => {
  const smuImages = formStore.generalForm.imageEquipment;
  if (!isUndefined(smuImages)) {
    if (smuImages == "") {
      return [] as ImageInfo[];
    } else {
      return stringToImageInfoConvert(smuImages as string[]);
    }
  } else {
    return [] as ImageInfo[];
  }
});

const travelHourImages = computed(() => {
  try {
    const travelImages = formStore.generalForm.travelHourImages;
    if (!isUndefined(travelImages)) {
      if (travelImages == "") {
        return [] as ImageInfo[];
      } else {
        return stringToImageInfoConvert(travelImages as string[]);
      }
    } else {
      return [] as ImageInfo[];
    }
  } catch {
    return [] as ImageInfo[];
  }
});

const swingHourImages = computed(() => {
  try {
    const swingImages = formStore.generalForm.swingHourImages;
    if (!isUndefined(swingImages)) {
      if (swingImages == "") {
        return [] as ImageInfo[];
      } else {
        return stringToImageInfoConvert(swingImages as string[]);
      }
    } else {
      return [] as ImageInfo[];
    }
  } catch {
    return [];
  }
});

const imageObject = computed(() => {
  return cloneDeep(
    camStore.ImageObjects.find((i) => {
      return i.Id === "equipment-smu";
    }),
  );
});

const imageObjectSwing = computed(() => {
  return cloneDeep(
    camStore.ImageObjects.find((i) => {
      return i.Id === "equipment-swing";
    }),
  );
});

const imageObjectTravel = computed(() => {
  return cloneDeep(
    camStore.ImageObjects.find((i) => {
      return i.Id === "equipment-travel";
    }),
  );
});
const loadingPhoto = ref();
const handlePostData = async () => {
  if (!imageObject.value?.ImageInfos) return;
  // const newImage = imageObject.value.ImageInfos as any as ImageInfo[];
  // // this is array which we will send to BE
  // const allImages = stringToImageInfoConvert(
  //   formStore.generalForm.imageEquipment as any[],
  // );
  // // get new captured/uploaded pics (will be > 1)
  // const newImages = [...allImages, ...newImage];

  // this is array which will be always updated after taking/ uploading a pics
  let imagesInfosArr: ImageInfo[] = []
  if (imageObject.value) {
    imagesInfosArr = stringToImageInfoConvert(imageObject.value.ImageInfos)
  }
  // this is array which we will send to BE
  const smuImagesArrValArr = stringToImageInfoConvert(formStore.generalForm.imageEquipment)
  // get new captured/uploaded pics (will be > 1)
  const newItemArr = imagesInfosArr.filter((e) => {
    return !smuImagesArrValArr.includes(e)
  })

  formStore.updateSMUImages([last(newItemArr)]);

  if (formStore.generalForm.imageEquipment.length == 1) {
    loadingPhoto.value = ElLoading.service({
      lock: true,
      text: "Uploading Picture",
      background: "rgba(0, 0, 0, 0.7)",
    });
    const res = await formStore.updateSMUImageToBE();
    if (!res.data.result.isError) {
      isSuccessTakePhoto.value = true;
      loadingPhoto.value.close();
      setTimeout(() => {
        isSuccessTakePhoto.value = false;
      }, 2000);
      let smuData = props.data.smu
      if (!fromDeleteCamera.value) {
        smuData = dataSMU.value
        await changeSMUValue();
      }
      // reset after use
      fromDeleteCamera.value = false
      await defectStore.createSMUDefect(
        {
          val: reformatNumberWithComma(smuData),
          hmOffset: String(formStore.HmOffset),
          range: {
            MinRange: minRangeValue.value,
            MaxRange: maxRangeValue.value
          },
          smuDate: dataSMUDate.value,
          isInRange: isSMUOnRange.value
        }
      );
      eFormStore.getTaskProgress();
    } else {
      loadingPhoto.value.close();
    }
  }
};

const handleEditClick = () => {
  showSMUDetailDialog.value = true
}

const detailSMUDialog = computed(() => {
  let val = reformatNumberWithComma(cloneDeep(dataSMU.value || props.data?.smu));
  const minRange = Number(val) + Number(hmOffset.value) >= minRangeValue.value;
  const maxRange = Number(val) + Number(hmOffset.value) <= maxRangeValue.value;

  let status = MachineSMUEnum.STATUS_NOT_IN_RANGE

  if (minRange && maxRange) {
    status = MachineSMUEnum.STATUS_IN_RANGE
  }

  return {
    title: MachineSMUEnum.TITLE(status),
    machineSMU: props.data?.smu || dataSMU.value,
    minRange: minRangeValue.value,
    maxRange: maxRangeValue.value,
    smuDue: formStore.smuActual,
    assetNumber: eFormStore.unitNumber,
    serialNumber: eFormStore.generalForm.serialNumber,
    images: JSON.stringify(smuImages.value),
    hmOffset: formStore.HmOffset,
    key: "",
    type: "",
    reason: "",
  } as DefectSMU
})
const formatOwnershipHTML = computed(() => {
  const ownership = eFormDefectStore.Ownership
  return formatOwnership(ownership)
})

const handlePostDataSwing = async () => {
  // this is array which will be always updated after taking/ uploading a pics
  if (!imageObjectSwing.value?.ImageInfos) return;
  const newImage = imageObjectSwing.value.ImageInfos as any as ImageInfo[];
  const allImages = stringToImageInfoConvert(
    formStore.generalForm.swingHourImages as any[],
  );
  // get new captured/uploaded pics (will be > 1)
  const newImages = [...allImages, ...newImage];
  formStore.updateSwingImages(newImages);
  await formStore.updateTravelSwingImageToBE(
    "swingHourImages",
    formStore.generalForm.swingHourImages as ImageInfo[],
  );
  camStore.setCurrent("equipment-swing");
  camStore.clearCurrent();
};

const handlePostDataTravel = async () => {
  // this is array which will be always updated after taking/ uploading a pics
  if (!imageObjectTravel.value?.ImageInfos) return;
  const newImage = imageObjectTravel.value.ImageInfos as any as ImageInfo[];
  const allImages = stringToImageInfoConvert(
    formStore.generalForm.travelHourImages as any[],
  );
  // get new captured/uploaded pics (will be > 1)
  const newImages = [...allImages, ...newImage];
  formStore.updateTravelImages(newImages);
  await formStore.updateTravelSwingImageToBE(
    "travelHourImages",
    formStore.generalForm.travelHourImages as ImageInfo[],
  );
  camStore.setCurrent("equipment-travel");
  camStore.clearCurrent();
};

watch(
  imageObject,
  (newVal, oldVal) => {
    if (!isUndefined(newVal) && newVal.ImageInfos.length > 0) {
      if (!isEqual(newVal.ImageInfos, oldVal?.ImageInfos)) {
        handlePostData();
      }
    }
  },
  { deep: true },
);

watch(
  imageObjectSwing,
  (newVal, oldVal) => {
    if (!isUndefined(newVal) && newVal.ImageInfos.length > 0) {
      if (!isEqual(newVal.ImageInfos, oldVal?.ImageInfos)) {
        handlePostDataSwing();
      }
    }
  },
  { deep: true },
);

watch(
  imageObjectTravel,
  (newVal, oldVal) => {
    if (!isUndefined(newVal) && newVal.ImageInfos.length > 0) {
      if (!isEqual(newVal.ImageInfos, oldVal?.ImageInfos)) {
        handlePostDataTravel();
      }
    }
  },
  { deep: true },
);

const showSMUImageDialog = ref<boolean>(false);

const handleShowSMUImagesDialog = () => {
  showSMUImageDialog.value = true;
};

const handleHideSMUImagesDialog = () => {
  showSMUImageDialog.value = false;
};

const showTravelHourImageDialog = ref<boolean>(false);

const handleShowTravelHourImagesDialog = () => {
  showTravelHourImageDialog.value = true;
};
const handleHideTravelHourImagesDialog = () => {
  showTravelHourImageDialog.value = false;
};
const showSwingHourImageDialog = ref<boolean>(false);

const handleShowSwingHourImagesDialog = () => {
  showSwingHourImageDialog.value = true;
};
const handleHideSwingHourImagesDialog = () => {
  showSwingHourImageDialog.value = false;
};

const smuCameraDisabled = computed(() => {
  if (!fitter.value.name) return true;
  return formStore.stateIsSmuCameraDisabled || eFormStore.generalForm.smu == "";
});

const travelHourCameraDisabled = computed(() => {
  if (!fitter.value.name) return true;
  return (
    formStore.stateIsTravelHourCameraDisabled ||
    eFormStore.generalForm.travelHour == ""
  );
});

const swingHourCameraDisabled = computed(() => {
  if (!fitter.value.name) return true;
  return (
    formStore.stateIsSwingHourCameraDisabled ||
    eFormStore.generalForm.swingHour == ""
  );
});
const deleteSMUImage = () => {
  triggerCamera()
  fromDeleteCamera.value = true
  handleHideSMUImagesDialog()
}
const deleteSwingImage = (filename: string) => {
  let swingImages = formStore.generalForm.swingHourImages as any[];
  swingImages = swingImages.filter((p) => {
    if (typeof p == "string") {
      return p != filename;
    } else {
      return p.filename != filename;
    }
  });
  formStore.updateSwingImages(swingImages);
  camStore.setCurrent("equipment-swing");
  camStore.clearCurrent();
  if (formStore.stateGeneralForm.isSwingMandatoryTakePhoto && swingHourImages.value.length == 0) {
    triggerCameraSwing(false)
  }
  if (swingHourImages.value.length == 0) handleHideSwingHourImagesDialog();
};
const deleteTravelImage = (filename: string) => {
  let travelImages = formStore.generalForm.travelHourImages as any[];
  travelImages = travelImages.filter((p) => {
    if (typeof p == "string") {
      return p != filename;
    } else {
      return p.filename != filename;
    }
  });
  formStore.updateTravelImages(travelImages);
  camStore.setCurrent("equipment-travel");
  camStore.clearCurrent();
  if (formStore.stateGeneralForm.isTravelMandatoryTakePhoto && travelHourImages.value.length == 0) {
    triggerCameraTravel(false)
  }
  if (travelHourImages.value.length == 0) handleHideTravelHourImagesDialog();
};
/* computes */
const fitter = computed(() => {
  return eFormStore.employee;
});
const personelDisabled = computed(() => {
  const fitterSelectedNGeneralSubmitted =
    fitter.value.name != "" && formStore.generalUpdated;
  return fitterSelectedNGeneralSubmitted;
});
/* event handlers */
const triggerCamera = () => {
  camStore.toggleIsVisible(true, "equipment-smu");
};

const onConfirmTakePhoto = () => {
  camStore.toggleIsVisible(true, "equipment-smu");
  camStore.setShowCloseButton(false);
  showTakePhotoSMU.value = false;
};

const onConfirmTakeTravelPhoto = () => {
  triggerCameraTravel(false)
  showTakePhotoTravel.value = false;
}
const onConfirmTakeSwingPhoto = () => {
  triggerCameraSwing(false)
  showTakePhotoSwing.value = false;
}

const triggerCameraSwing = (closeButton = true) => {
  camStore.toggleIsVisible(true, "equipment-swing");
};

const triggerCameraTravel = (closeButton = true) => {
  camStore.toggleIsVisible(true, "equipment-travel");
};
const closeSMUAlreadyFilledModal = () => {
  showSMUAlreadyFilled.value = false;
};
const closeSMUToleranceNotMappedModal = () => {
  showSMUToleranceNotMapped.value = false;
};

const formattedSMU = computed(() => {
  let formatted = formatNumberWithComma(dataSMU.value);
  if (formatted == "0") formatted = "";
  return formatted;
});

const formattedTravelHour = computed(() => {
  let formatted = formatNumberWithComma(dataTravelHour.value);
  if (formatted == "0") formatted = "";
  return formatted;
});

const formattedSwingHour = computed(() => {
  let formatted = formatNumberWithComma(dataSwingHour.value);
  if (formatted == "0") formatted = "";
  return formatted;
});
// this function will be triggered when after done typing smu, then change to other input/ lost focuss to smu input
const onSMUChange = async (value) => {
  validation.value.smu = "";
  dataSMU.value = value;
  // get real smu value from adm (progress)
  if (formStore.SMUToleranceNotMapped) {
    validation.value.smu = "SMU tolerance not yet mapped";
    showSMUToleranceNotMapped.value = true;
  } else if (isSMUOnRange.value) {
    // Only update if SMU photo already uploaded
    if (formStore.generalForm.imageEquipment.length > 0) {
      changeSMUValue();
      defectStore.createSMUDefect(
        {
          val: reformatNumberWithComma(dataSMU.value),
          hmOffset: String(formStore.HmOffset),
          range: {
            MinRange: minRangeValue.value,
            MaxRange: maxRangeValue.value
          },
          smuDate: dataSMUDate.value,
          isInRange: isSMUOnRange.value
        }
      );
    } else {
      showTakePhotoSMU.value = true;
    }
  } else {
    confirmationSMUCaption.value = `<b>Is this correct Machine SMU value?</b><br><span>Machine SMU should be in range <b>${minSMUValue.value} to ${maxSMUValue.value}</b></span>`;
    showConfirmSMU.value = true;
  }
};

const changeSMUValue = async (revisedSMU = "") => {
  const reformattedSMU = reformatNumberWithComma(revisedSMU || dataSMU.value);
  dataSMUDate.value = reformattedSMU == "" ? "" : AESTCurrentDateTime()
  dataSMUBy.value = reformattedSMU == "" ? "" : defectStore.selectedFitter
  formStore.addPropertyParam("GENERAL", "smu", reformattedSMU);
  formStore.addPropertyParam("GENERAL", "smuBy", JSON.stringify(dataSMUBy.value));
  formStore.addPropertyParam("GENERAL", "smuDate", dataSMUDate.value);
  formStore.addPropertyParam("GENERAL", "hmOffset", String(formStore.HmOffset));
  formStore.updateSMUONGeneral({
    value: reformattedSMU,
    smuBy: dataSMUBy.value,
    smuDate: dataSMUDate.value
  });
  await formStore.updateSMUValueToBE({
    smu: reformattedSMU,
    hmOffset: String(formStore.HmOffset),
    smuDate: dataSMUDate.value,
    smuBy: dataSMUBy.value,
  })
};

const machineSMUField = ref();
const onCancelSMU = () => {
  showConfirmSMU.value = false;
  dataSMU.value = "";
  dataSMUBy.value = {
    id: '',
    name: ''
  };
  dataSMUDate.value = "";
  machineSMUField.value.value = "";
  // changeSMUValue();
  // focus to machine SMU field
  nextTick(() => {
    machineSMUField.value.focus();
  });
};

const onConfirmSMU = () => {
  showConfirmSMU.value = false;
  // Only update if SMU photo already uploaded
  if (formStore.generalForm.imageEquipment.length > 0) {
    changeSMUValue();
    defectStore.createSMUDefect(
      {
        val: reformatNumberWithComma(dataSMU.value),
        hmOffset: String(formStore.HmOffset),
        range: {
          MinRange: minRangeValue.value,
          MaxRange: maxRangeValue.value
        },
        smuDate: dataSMUDate.value,
        isInRange: isSMUOnRange.value
      }
    );
  } else {
    showTakePhotoSMU.value = true;
  }
};

let timer;
// this function will be triggered when smu typed
const handleSMUOnTyping = async (event) => {
  if (currentValue.value == event.target.value) return
  event.target.value = formatNumberWithComma(
    reformatNumberWithComma(event.target.value),
  );
  validation.value.smu = "";
  clearTimeout(timer);
  if (event.target.value == "") return false;
  const value = event.target.value;
  timer = setTimeout(async () => {
    // first personnel must be selected
    const checkPersonel = handleCheckPersonnelAlreadySelected("smu");
    // if passed smu value on DB must be empty
    if (checkPersonel) {
      const isSMUSubmitted = await handleCheckPropValOnBE("smu");
      if (!isSMUSubmitted) {
        await onSMUChange(value);
      }
    } else {
      event.target.value = "";
      dataSMU.value = "";
    }
  }, 0);
};

const onlyNumberWhenInput = (event) => {
  event.target.value = onlyNumberResult(event.target.value);
};

// this function will be triggered when after done typing smu, then change to other input/ lost focuss to smu input
const onTravelHourChange = async (value) => {
  validation.value.travelHour = "";
  // get real smu value from adm (progress)
  let val = reformatNumberWithComma(cloneDeep(value));
  formStore.addPropertyParam("GENERAL", "travelHour", val);
  formStore.updateTravelHourONGeneral(val);
  await formStore.updateSwingTravelValueToBE("travelHour", val);
};

// this function will be triggered when smu typed
const handleTravelHourOnTyping = async (event) => {
  if (currentValue.value == event.target.value) return
  event.target.value = formatNumberWithComma(
    reformatNumberWithComma(event.target.value),
  );
  validation.value.travelHour = "";
  clearTimeout(timer);
  const value = event.target.value;
  timer = setTimeout(async () => {
    // first personnel must be selected
    const checkPersonel = handleCheckPersonnelAlreadySelected("travelHour");
    // if passed smu value on DB must be empty
    if (checkPersonel) {
      const isSMUSubmitted = await handleCheckPropValOnBE("travelHour");
      if (!isSMUSubmitted) {
        if (formStore.stateGeneralForm.isTravelMandatoryTakePhoto && travelHourImages.value.length == 0) {
          showTakePhotoTravel.value = true
        }
        await onTravelHourChange(value);
      }
    } else {
      event.target.value = "";
    }
  }, 0);
};

// this function will be triggered when after done typing smu, then change to other input/ lost focuss to smu input
const onSwingHourChange = async (value) => {
  validation.value.swingHour = "";
  // get real smu value from adm (progress)
  let val = reformatNumberWithComma(cloneDeep(value));
  formStore.addPropertyParam("GENERAL", "swingHour", val);
  formStore.updateSwingHourONGeneral(val);
  await formStore.updateSwingTravelValueToBE("swingHour", val);
};

const handleSwingHourOnTyping = async (event) => {
  if (currentValue.value == event.target.value) return
  event.target.value = formatNumberWithComma(
    reformatNumberWithComma(event.target.value),
  );
  validation.value.swingHour = "";
  clearTimeout(timer);
  const value = event.target.value;
  timer = setTimeout(async () => {
    // first personnel must be selected
    const checkPersonel = handleCheckPersonnelAlreadySelected("swingHour");
    // if passed smu value on DB must be empty
    if (checkPersonel) {
      const isSMUSubmitted = await handleCheckPropValOnBE("swingHour");
      if (!isSMUSubmitted) {
        if (formStore.stateGeneralForm.isSwingMandatoryTakePhoto && swingHourImages.value.length == 0) {
          showTakePhotoSwing.value = true
        }
        await onSwingHourChange(value);
      }
    } else {
      event.target.value = "";
    }
  }, 0);
};

const handleCheckPersonnelAlreadySelected = (prop: string) => {
  const validationMsg =
    "Labour Personnel Name Personnel field must be completed";
  // first check if Service Personnels exists while typing smu
  // if it doesnt, show error validation
  // check if updateparams object exist on form
  if (eFormStore.employee.id == "" || isUndefined(eFormStore.employee.id)) {
    validation.value[prop] = validationMsg;
    return false;
  } else {
    return true;
  }
};

const handleCheckPropValOnBE = async (prop: string) => {
  let status = false;
  let nameField = "";
  if (prop == "smu") {
    nameField = "SMU";
    smuType.value = "SMU";
  } else if (prop == "travelHour") {
    nameField = "Travel Hour";
    smuType.value = "Travel Hours";
  } else if (prop == "swingHour") {
    nameField = "Swing Hour";
    smuType.value = "Swing Hours";
  }
  await formStore.getServiceSheetHeaderKeyVal(prop, nameField).then(async (value) => {
    if (value != '') {
      showSMUAlreadyFilled.value = true
      eFormStore.updateGeneralValue(prop, value)
      status = true
    } else {
      status = false
    }
  })
  return status
}

const onlyNumber = ($event) => {
  let keyCode = $event.keyCode ? $event.keyCode : $event.which;
  if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
    $event.preventDefault();
  }
  if (keyCode == 13) {
    // Allow 13 (Enter) to calculate
    machineSMUField.value!.blur();
    return;
  }
};
const onSelectFocus = () => {
  relativeClass.value = "relative-hidder";
};
const onSelectLostFocus = () => {
  relativeClass.value = "";
};
const handleGetShift = () => {
  // check all shift di ADM
  const shifList = formStore.stateShiftList;
  // check current time
  const currTime = getUTCOffsetTime(formStore.stateTimeZone);
  // return current shift
  const currShift = shifList.find((shift) => {
    // check if current time is between
    const startShift =
      shift.startHourType == "PM"
        ? handleConvertTo24Hrs(`${shift.startHour}:00`)
        : `${shift.startHour}:00`;
    const endShift =
      shift.endHourType == "PM"
        ? handleConvertTo24Hrs(`${shift.endHour}:00`)
        : `${shift.endHour}:00`;
    if (shift.startHourType == "PM" && shift.endHourType == "AM") {
      if (currTime > "12:00:00") {
        if (currTime >= startShift || currTime <= endShift) {
          return shift;
        }
      } else {
        if (currTime <= startShift && currTime <= endShift) {
          return shift;
        }
      }
    } else {
      if (currTime >= startShift && currTime <= endShift) {
        return shift;
      }
    }
  });
  if (isUndefined(currShift)) {
    return dayNightConverter(formStore.stateTimeZone);
  } else {
    return currShift!.shift.toLowerCase().includes("shift")
      ? currShift!.shift
      : `${currShift!.shift} Shift`;
  }
};
const handleCheckFitterFromLog = (opt: Option) => {
  if (opt.value == "") return;
  // jika array []
  if (formStore.generalForm.log.length == 0) {
    formStore.setFitterInfoFitter(
      opt,
      getUTCOffsetDate(formStore.stateTimeZone),
      shift.value,
    );
    formStore.setIsFitterLoggedInExist(false);
  } else {
    // filter yang namanya sama
    const fitterArr = formStore.generalForm.log.filter((fitter) => {
      if (!isUndefined(fitter.employee)) return fitter.employee.id == opt.value;
    });

    if (fitterArr.length == 0) {
      formStore.setFitterInfoFitter(
        opt,
        getUTCOffsetDate(formStore.stateTimeZone),
        shift.value,
      );
      formStore.setIsFitterLoggedInExist(false);
    } else {
      // filter yang terakhir
      const lastFitter = last(fitterArr);
      formStore.setFitterInfo(lastFitter!);

      // cek fitter terakhir apakah sama dengan shift
      // get time now
      const timeNow = getUTCOffsetDate(formStore.stateTimeZone).split(" ")[1];
      // get shift berdasarkan time now
      const currentShift = formStore.stateShiftList.find((shift) => {
        let isCurrentShift = false;
        if (shift.startHourType == "AM" && shift.endHourType == "PM") {
          const endHourExtended = Number(shift.endHour.split(":")[0]) + 6;
          let endHour = `${Number(endHourExtended) + 12}:${shift.endHour.split(":")[1]}`;
          isCurrentShift = timeNow >= shift.startHour && timeNow <= endHour;
        } else if (shift.startHourType == "PM" && shift.endHourType == "AM") {
          let startHour = `${Number(shift.startHour.split(":")[0]) + 12}:${shift.startHour.split(":")[1]}`;
          const endHourAM = `${Number(shift.endHour) + 6}:${shift.endHour.split(":")[1]}`;
          if (timeNow < "24:00:00") {
            isCurrentShift = timeNow <= startHour || timeNow >= endHourAM;
          } else {
            isCurrentShift = timeNow <= startHour && timeNow <= endHourAM;
          }
        } else {
          isCurrentShift = true;
        }
        return isCurrentShift;
      });
      // end shift yang ketemu + 6 jam
      let extendedHour = Number(currentShift?.endHour.split(":")[0]) + 6;
      if (currentShift?.endHourType == "PM") extendedHour += 12;
      if (extendedHour > 24) extendedHour - 24;
      let extendedTime = `${extendedHour}:${currentShift?.endHour.split(":")[1]}:${currentShift?.endHour.split(":")[2]}`;
      // apakah shift + 6 jam < time now
      if (timeNow < extendedTime) {
        formStore.setIsFitterLoggedInExist(true);
        // formAgreement.value = generalFormStore.FitterInfo.isIHaveReadChecked
      }
    }
  }
  // jika di array tidak nemu fitter yang sama
};
const onPersonnelSelected = async (opt: Option) => {
  // logic pindah ke BE
  relativeClass.value = "";
  actualServiceStart.value = `${getUTCOffsetDate(formStore.stateTimeZone)} (${formStore.stateTimeZoneDesc})`;
  shift.value = handleGetShift();
  const selectedMechanic = {
    id: opt.value,
    name: opt.label,
  };
  eFormStore.updateSelectedFitter(selectedMechanic);
  handleCheckFitterFromLog(opt);

  emits("onPersonelSelected");

  /* set payload items */
  const payload = {
    key: uuidv4(),
    mechanic: selectedMechanic,
    serviceStart: "<<ServerDateTime>>",
    serviceEnd: "",
    shift: shift.value,
  };
  formStore.addPropertyParam(
    "GENERAL",
    "servicePersonnels",
    JSON.stringify(payload),
  );

  formStore.setCurrentPersoneel(payload);

  // update fitter state
  eFormStore.updateServiceStart(actualServiceStart.value);
  if (validation.value.smu == "Service Labour Personnel must be filled") {
    validation.value.smu = "";
  }

  eFormStore.updateSelectedFitter(selectedMechanic);
};

const showTravelRequired = () => {
  validation.value.travelHour = "Required";
};
const showSwingRequired = () => {
  validation.value.swingHour = "Required";
};

const hideTravelRequired = () => {
  validation.value.travelHour = "";
};
const hideSwingRequired = () => {
  validation.value.swingHour = "";
};

defineExpose({
  showTravelRequired,
  showSwingRequired,
  hideTravelRequired,
  hideSwingRequired,
});

/* life cycles */
onMounted(() => {
  if (eFormStore.stateFromHomePage) {
    selectFitter.value.optionSelected({
      label: "",
      value: "",
    });
    actualServiceStart.value = "";
    eFormStore.setFromHomePage(false);
  }
});

const handleReviseSMU = async (params: submitDetailParameter) => {
  const isInRange = !params.newDetail.title.toLowerCase().includes("not")
  changeSMUValue(params.newDetail.machineSMU);
  const isImageRevised = isEqual(smuImages.value, JSON.parse(params.newDetail.images))

  if (!isImageRevised) {
    formStore.updateSMUImages(JSON.parse(params.newDetail.images));
    await formStore.updateSMUImageToBE();
  }
  await defectStore.createSMUDefect(
    {
      val: reformatNumberWithComma(params.newDetail.machineSMU),
      hmOffset: String(formStore.HmOffset),
      range: {
        MinRange: params.newDetail.minRange! as number,
        MaxRange: params.newDetail.maxRange! as number
      },
      smuDate: dataSMUDate.value,
      isInRange: isInRange
    }
  );

  params.callback();
}

const cameraIDRevise = CameraId.SMU_REVISE;

const imageObjectRevise = computed(() : ImageObject => {
  const images = camStore.ImageObjects.find((i) => {
    return i.Id === cameraIDRevise;
  }) as ImageObject
  return cloneDeep(images);
});

const handleRetakePhotoRevise = () => {
  camStore.toggleIsVisible(true, cameraIDRevise);
  camStore.setIsActionFromDelete(true);
}

const handleResetCameraStore = () => {
  camStore.reset();
}
const resetErrorStatus = () => {
  defectStore.resetErrorStatus()
}
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
