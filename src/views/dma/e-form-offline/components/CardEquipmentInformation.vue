<template>
  <div class="mt-5 ps-0">
    <el-collapse v-model="activeTaskGroup" class="general-accordion task-group py-1 px-5 mb-3">
      <el-collapse-item name="Equipment Information">
        <template #title>
          <h4 class="subtitle ps-3">Service Labour Personnel</h4>
        </template>
        <div class="p-2 me-0">
          <div class="row" style="width:101%">
            <div class="col-12 pe-0">
              <SelectSearch ref="selectFitter" :field-label="'Labour Personnel Name'" placeholder="Select your name"
                :data="personelStore.PersonelLabours" :value="fitter.name" :display-label="true" @on-focus="onSelectFocus"
                @on-lost-focus="onSelectLostFocus" @on-selected="onPersonnelSelected" :disabled="personelDisabled" />
            </div>
          </div>
        </div>
        <div class="p-2 me-0">
          <div class="row" style="width:101%">
            <div class="col-6 pe-0">
              <div class="form-floating mb-3" :class="relativeClass" style="position: relative !important;">
                <input type="text" class="form-control" disabled :value="actualServiceStart">
                <label for="floatingInput" class="text-nowrap">Actual Service Start (each labour personnel)</label>
              </div>
            </div>
            <div class="col-6 pe-0">
              <div class="form-floating mb-3" style="position: relative !important;">
                <input type="text" class="form-control no-float" disabled :value="shift">
                <label for="floatingInput">Shift</label>
              </div>
            </div>
          </div>
        </div>
        <h4 class="subtitle ps-3">Equipment Information</h4>
        <div class="d-flex flex-row justify-content-between">
          <div class="p-2 d-flex flex-row flex-grow-1">
            <div class="d-flex w-100">
              <div class="flex-fill">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" disabled :value="eFormStore.unitNumber">
                  <label>Unit Number</label>
                </div>
              </div>
              <div class="flex-fill ps-3">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" disabled :value="data.serialNumber">
                  <label for="floatingInput">Serial Number</label>
                </div>
              </div>
              <div class="flex-fill ps-3">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" disabled :value="data.workOrder">
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
                    <input type="text" name="machine-smu" ref="machineSMUField" class="form-control"
                      placeholder="Machine SMU" @keypress="onlyNumber" @input="onlyNumberWhenInput" :value="formattedSMU"
                      :disabled="showConfirmSMU || showTakePhotoSMU" @focusout="handleSMUOnTyping" pattern="[0-9]*"
                      inputmode="numeric" />
                  </template>
                  <!-- edit smu -->
                  <div class="ms-2 position-absolute" style="top: 2px; right: 0;" v-if="!data.isApprovedSmu && data.smu && fitter?.name">
                    <button class="btn p-4 justify-items-center rounded cursor-pointer svg-icon svg-icon-btech-primary-500" @click="handleEditClick">
                      <!-- <inline-svg
                      /> -->
                      <img src="media/icons/bumaau/icon-edit.png" style="width: 1.25rem; height: 1.25rem" />
                    </button>
                  </div>
                  <label for="floatingInput2" class="text-nowrap">Machine SMU</label>
                </div>
                <template v-if="validation.smu">
                  <label class="text-danger ps-2 font-weight-bold">{{ validation.smu }}</label>
                </template>
              </div>
              <div class="ms-2">
                <button class="btn p-4 justify-items-center rounded" :disabled="smuCameraDisabled || smuImages.length > 0"
                  style="background: #F4F6F8; cursor: pointer;" @click="triggerCamera">
                  <img :src="cameraColor()" style="height: 20px; width: 24px;" alt="smu" />
                </button>
              </div>
              <div class="ms-2" v-if="smuImages.length > 0">
                <div class="p-3 justify-items-center rounded" style="background: #18AF4A;">
                  <span style="font-weight: 700; color:white" @click="handleShowSMUImagesDialog">+{{ smuImages.length
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
                  <input type="text" class="form-control" disabled :value="data.serviceStart">
                  <label>Actual Service Start</label>
                </div>
              </div>
              <div class="flex-fill ps-3">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" disabled :value="formStore.HmOffset">
                  <label for="floatingInput">HM Offset</label>
                </div>
              </div>
              <div v-if="!isUndefined(data.travelHour)" class="d-flex" style="flex-basis: 40%">
                <div class="flex-fill ps-3">
                  <div class="form-floating mb-3">
                    <template
                      v-if="data.travelHour !== '' || formStore.generalUpdated || formStore.generalForm.status == 'Submited'">
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
                    <label class="text-danger ps-2 font-weight-bold">{{ validation.travelHour }}</label>
                  </template>
                </div>
                <div class="ms-2">
                  <button class="btn p-4 justify-items-center rounded"
                    :disabled="travelHourCameraDisabled || travelHourImages.length > 0"
                    style="background: #F4F6F8; cursor: pointer;" @click="triggerCameraTravel">
                    <img :src="travelCameraColor()" style="height: 20px; width: 24px;" alt="travel" />
                  </button>
                </div>
                <div class="ms-2" v-if="travelHourImages.length > 0">
                  <div class="p-3 justify-items-center rounded" style="background: #18AF4A;">
                    <span style="font-weight: 700; color:white" @click="handleShowTravelHourImagesDialog">+{{
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
                  <input type="text" class="form-control" disabled :value="data.serviceEnd">
                  <label>Actual Service Finish</label>
                </div>
              </div>
              <div v-if="!isUndefined(data.swingHour)" class="d-flex" style="flex-basis: 40%">
                <div class="flex-fill ps-3">
                  <div class="form-floating mb-3">
                    <template
                      v-if="data.swingHour !== '' || formStore.generalUpdated || formStore.generalForm.status == 'Submited'">
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
                    <label class="text-danger ps-2 font-weight-bold">{{ validation.swingHour }}</label>
                  </template>
                </div>
                <div class="ms-2">
                  <button class="btn p-4 justify-items-center rounded"
                    :disabled="swingHourCameraDisabled || swingHourImages.length > 0"
                    style="background: #F4F6F8; cursor: pointer;" @click="triggerCameraSwing">
                    <img :src="swingCameraColor()" style="height: 20px; width: 24px;" alt="swing" />
                  </button>
                </div>
                <div class="ms-2" v-if="swingHourImages.length > 0">
                  <div class="p-3 justify-items-center rounded" style="background: #18AF4A;">
                    <span style="font-weight: 700; color:white" @click="handleShowSwingHourImagesDialog">+{{
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
  <GeneralDialog modal-type="alreadyFilled" :show="showSMUAlreadyFilled" :type="smuType"
    @close="closeSMUAlreadyFilledModal" />
  <GeneralDialog modal-type="notMapped" :show="showSMUToleranceNotMapped" @close="closeSMUToleranceNotMappedModal" />
  <template v-if="showSMUImageDialog">
    <ImageListModal :images="smuImages" :show-delete-button="smuPhotoDeleteDisabled"
      :show-remaining-photos-message="!isSMUOnRange" :visibility="showSMUImageDialog"
      @handle-close="handleHideSMUImagesDialog" @handle-delete="deleteImage" />
  </template>
  <template v-if="showTravelHourImageDialog">
    <ImageListModal :images="travelHourImages" :visibility="showTravelHourImageDialog"
      :showDeleteButton="!travelHourCameraDisabled" @handle-close="handleHideTravelHourImagesDialog" @handle-delete="deleteImageTravel" />
  </template>
  <template v-if="showSwingHourImageDialog">
    <ImageListModal :images="swingHourImages" :visibility="showSwingHourImageDialog"
      :showDeleteButton="!swingHourCameraDisabled" @handle-close="handleHideSwingHourImagesDialog" @handle-delete="deleteImageSwing" />
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
  AESTCurrentDateTime
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
  onUnmounted,
} from "vue";
import {
  useGeneralFormStore
} from "@/store/pinia/dma/e-form-offline/useGeneralFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  useOfflineCameraStore
} from "@/store/pinia/application/useOfflineCameraStore";
import { Option } from "@/core/types/misc/Option";
import { v4 as uuidv4 } from 'uuid';
import { useEFormStore } from "@/store/pinia/dma/e-form-offline/useEFormStore";
import {
  checkIsSMUOnRange,
  formatOwnership
} from "@/store/pinia/dma/e-form/helpers"
import {
  isUndefined,
  cloneDeep,
  last,
  isEqual,
  isNull
} from "lodash"
import GeneralDialog from "@/views/dma/components/GeneralDialog.vue";
import {
  usePersonelLabourStore
} from '@/store/pinia/dma/personel-labour/usePersonelLabourStore';
import {
  ServicePersonnel
} from "@/core/types/entities/dma/e-form/general/ServicePersonnel";
import {
  ListItem
} from "@/core/types/entities/administration/organization-unit/shift/ListItem";
import ImageListModal from '@/views/dma/e-form-offline/sub-group/task-group/task/item/small-camera/ImageListModal.vue'
import ConfirmationNonBold from '@/components/dialog/ConfirmationNonBold.vue'
import Confirmation from '@/components/dialog/Confirmation.vue'
import ToastWithIcon from '@/components/dialog/ToastWithIcon.vue'
import {
  formatNumberWithComma,
  reformatNumberWithComma
} from "@/core/helpers/number-format";
import { useOnline } from "@vueuse/core";
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo";
import {
  stringToImageInfoConvert
} from "@/core/helpers/string-to-imageinfo-converter";
import { onlyNumberResult } from "@/store/pinia/dma/e-form/helpers";
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form-offline/defects/useDefectsFormStore";
import {
  ElLoading
} from "element-plus";
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
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
    type: Object as PropType<General>
  },
  timer: {
    required: true,
    type: String
  }
});

const emits = defineEmits(["onPersonelSelected", 'updateTimer']);

/* stores */
const formStore = useGeneralFormStore();
const authStore = useAuthenticationStore();
const camStore = useOfflineCameraStore();
const eFormStore = useEFormStore();
const personelStore = usePersonelLabourStore();
const defectStore = useDefectsFormStore();

/* refs */
const online = useOnline()
const actualServiceStart = ref(eFormStore.serviceStart);
const shift = ref(eFormStore.shift);
const activeTaskGroup = ref('Equipment Information')
const relativeClass = ref("");
const validation = ref({
  smu: '',
  travelHour: '',
  swingHour: ''
});
const showSMUAlreadyFilled = ref(false);
const showSMUToleranceNotMapped = ref(false)
const showConfirmSMU = ref<boolean>(false);
const showTakePhotoSMU = ref<boolean>(false);
const showTakePhotoTravel = ref<boolean>(false)
const showTakePhotoSwing = ref<boolean>(false)
const confirmationSMUCaption = ref<string>('');
const isSuccessTakePhoto = ref<boolean>(false);
const isSMUDefect = ref(false);
const currentValue = ref("");
const smuType = ref<string>("");
const showSMUDetailDialog = ref<boolean>(false);
const dataSMU = ref("");
const fromDeleteCamera = ref(false);
const dataSMUBy = ref<Audit>({
  name: '',
  id: ''
});
const dataSMUDate = ref("");
const dataTravelHour = ref("");
const dataSwingHour = ref("");

const hmOffset = computed(() => {
  if (isUndefined(formStore.generalForm.hmOffset) || formStore.generalForm.hmOffset == '') {
    if (formStore.HmOffset == '' || formStore.HmOffset == 'Not Applicable') {
      return 0
    } else {
      return Number(formStore.HmOffset)
    }
  } else {
    return formStore.generalForm.hmOffset
  }
})
const minRangeValue = computed(() => {
  const smuValidation = formStore.smuActual
  const tolerance = formStore.smuTolerance
  return Number((Number(smuValidation) + Number(tolerance.min)))
});
const maxRangeValue = computed(() => {
  const smuValidation = formStore.smuActual
  const tolerance = formStore.smuTolerance
  return Number((Number(smuValidation) + Number(tolerance.max)))
});
const minSMUValue = computed(() => {
  return minRangeValue.value - hmOffset.value;
})
const maxSMUValue = computed(() => {
  return maxRangeValue.value - hmOffset.value;
})
const isSMUOnRange = (value: string | number) => {
  return checkIsSMUOnRange({
    smu: value,
    hmOffset: hmOffset.value,
    range: {
      min: minRangeValue.value,
      max: maxRangeValue.value,
    }
  })
}

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
  let camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
  // hanya red
  if (smuCameraDisabled.value) camera = "/media/svg/dma/camera/e-form/png/cam-read.png"
  if (smuImages.value.length > 0) camera = "/media/svg/dma/camera/e-form/png/cam-user.png"
  return camera
}

const travelCameraColor = () => {
  // belum ada yang take pic
  let camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
  // hanya red
  if (travelHourCameraDisabled.value) camera = "/media/svg/dma/camera/e-form/png/cam-read.png"
  if (travelHourImages.value.length > 0) camera = "/media/svg/dma/camera/e-form/png/cam-user.png"
  return camera
}

const swingCameraColor = () => {
  // belum ada yang take pic
  let camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
  // hanya red
  if (swingHourCameraDisabled.value) camera = "/media/svg/dma/camera/e-form/png/cam-read.png"
  if (swingHourImages.value.length > 0) camera = "/media/svg/dma/camera/e-form/png/cam-user.png"
  return camera
}

// ----- SMU IMAGES -----
const smuImages = computed(() => {
  try {
    const smuImages = formStore.generalForm.imageEquipment
    if (!isUndefined(smuImages)) {
      if (smuImages == '') {
        return [] as ImageInfo[]
      } else {
        return stringToImageInfoConvert(smuImages)
      }
    } else {
      return [] as ImageInfo[]
    }
  } catch {
    return [] as ImageInfo[]
  }
})

const travelHourImages = computed(() => {
  try {
    const smuImages = formStore.generalForm.travelHourImages
    if (!isUndefined(smuImages)) {
      if (smuImages == '') {
        return [] as ImageInfo[]
      } else {
        return stringToImageInfoConvert(smuImages)
      }
    } else {
      return [] as ImageInfo[]
    }
  } catch {
    return [] as ImageInfo[]
  }
})

const swingHourImages = computed(() => {
  try {
    const smuImages = formStore.generalForm.swingHourImages
    if (!isUndefined(smuImages)) {
      if (smuImages == '') {
        return [] as ImageInfo[]
      } else {
        return stringToImageInfoConvert(smuImages)
      }
    } else {
      return [] as ImageInfo[]
    }
  } catch {
    return [] as ImageInfo[]
  }
})

const imageObject = computed(() => {
  return cloneDeep(camStore.ImageObjects.find((i) => {
    return i.Id === "equipment-smu";
  }));
});

const imageObjectSwing = computed(() => {
  return cloneDeep(camStore.ImageObjects.find((i) => {
    return i.Id === "equipment-swing";
  }));
});

const imageObjectTravel = computed(() => {
  return cloneDeep(camStore.ImageObjects.find((i) => {
    return i.Id === "equipment-travel";
  }));
});

const loadingPhoto = ref();

// trigger from input smu, click camera, delete from image list
const handlePostData = async () => {
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
  await formStore.updateSMUImages([last(newItemArr)])
  // Update SMU value and photo to BE
  if (formStore.generalForm.imageEquipment.length == 1) {
    if (!isOfflineOrSlowInternetConnection()) {
      loadingPhoto.value = ElLoading.service({
        lock: true,
        text: "Uploading Picture",
        background: "rgba(0, 0, 0, 0.7)",
      });
      try {
        const res = await formStore.updateSMUImageToBE();
        if (!res.data.result.isError) {
          isSuccessTakePhoto.value = true;
          loadingPhoto.value.close();
          setTimeout(() => {
            isSuccessTakePhoto.value = false;
          }, 2000);
          // 1. (fromDeleteCamera false) trigger smu -> dataSMU.value
          // 2. (fromDeleteCamera false) click camera only -> from props bcos no changing value
          // 3. (fromDeleteCamera true) delete from image list -> from props bcos no changing value
          let smuData = props.data.smu
          if (!fromDeleteCamera.value) {
            // dataSMU.value is filled
            // ^ 1. not filled from start (will be compared with props.data.smu that assumed to be "")
            // ^ 2. from props.data.smu (from onMounted)
            // dataSMU.value == ""
            // ^ clicking camera only
            if (dataSMU.value != "" && dataSMU.value != props.data.smu) {
              smuData = dataSMU.value
              await changeSMUValue();
            }
          }
          // no need to create defect
          if (smuData != "") {
            try {
              await defectStore.createSMUDefect(
                {
                  val: reformatNumberWithComma(smuData),
                  hmOffset: String(formStore.HmOffset),
                  range: {
                    MinRange: minRangeValue.value,
                    MaxRange: maxRangeValue.value
                  },
                  smuDate: dataSMUDate.value,
                  isInRange: isSMUOnRange(smuData)
                }
              );
              eFormStore.getTaskProgress();
            } catch (e) {
              updateSmuDefectToLocalDB(smuData);
            }
            isSMUDefect.value = false
          }
        }
        // reset after use
        fromDeleteCamera.value = false
      } finally {
        // if updateSMUImageToBE throw error
        loadingPhoto.value.close()
      }
    } else {
      // 1. (fromDeleteCamera false) trigger smu -> dataSMU.value
      // 2. (fromDeleteCamera false) click camera only -> from props bcos no changing value
      // 3. (fromDeleteCamera true) delete from image list -> from props bcos no changing value
      let smuData = props.data.smu
      if (!fromDeleteCamera.value) {
        // in case dataSMU is changing from input element
        // dataSMU.value is filled -> not filled from start (will be compared with props.data.smu that assumed to be "") / from props.data.smu (from onMounted)
        if (dataSMU.value != "" && dataSMU.value != props.data.smu) {
          smuData = dataSMU.value
          await changeSMUValue();
        }
      }
      formStore.updateSMUImageToLocal()
      updateSmuDefectToLocalDB(smuData);
      isSuccessTakePhoto.value = true;
      setTimeout(() => {
        isSuccessTakePhoto.value = false;
      }, 2000);
    }
  } else {
    if (isOfflineOrSlowInternetConnection()) {
      await formStore.updateSMUImageToLocal();
    }
  }
}

const handleEditClick = () => {
  showSMUDetailDialog.value = true
}

const detailSMUDialog = computed(() => {
  let val = reformatNumberWithComma(cloneDeep(props.data?.smu || dataSMU.value));
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
  const ownership = defectStore.Ownership
  return formatOwnership(ownership)
})

const updateSmuDefectToLocalDB = async (value, isInRange?) => {
  await defectStore.updateDefectSMUToLocalDB(
    {
      val: reformatNumberWithComma(value),
      hmOffset: String(formStore.HmOffset),
      range: {
        MinRange: minRangeValue.value,
        MaxRange: maxRangeValue.value
      },
      smuDate: dataSMUDate.value,
      isInRange: isInRange ? isInRange : isSMUOnRange(value)
    }
  );
  eFormStore.getMultiDefectList()
}

const handlePostDataSwing = async () => {
  // this is array which will be always updated after taking/ uploading a pics
  let imagesInfosArr: ImageInfo[] = []
  if (imageObjectSwing.value) {
    imagesInfosArr = stringToImageInfoConvert(imageObjectSwing.value!.ImageInfos)
  }
  // this is array which we will send to BE
  const smuImagesArrValArr = stringToImageInfoConvert(formStore.generalForm.swingHourImages)
  // get new captured/uploaded pics (will be > 1)
  const newItemArr = imagesInfosArr.filter((e) => {
    return !smuImagesArrValArr.includes(e)
  })
  await formStore.updateSwingImages(newItemArr)

  const swingOffline = async () => {
    await formStore.updateTravelSwingImageToLocal('swingHourImages', formStore.generalForm.swingHourImages as ImageInfo[])
  }

  if (!isOfflineOrSlowInternetConnection()) {
    try {
      await formStore.updateTravelSwingImageToBE('swingHourImages', formStore.generalForm.swingHourImages as ImageInfo[]);
    } catch (error) {
      swingOffline()
    }
  } else {
    swingOffline()
  }
}

const handlePostDataTravel = async () => {
  // this is array which will be always updated after taking/ uploading a pics
  let imagesInfosArr: ImageInfo[] = []
  if (imageObjectTravel.value) {
    imagesInfosArr = stringToImageInfoConvert(imageObjectTravel.value!.ImageInfos)
  }
  // this is array which we will send to BE
  const smuImagesArrValArr = stringToImageInfoConvert(formStore.generalForm.travelHourImages)
  // get new captured/uploaded pics (will be > 1)
  const newItemArr = imagesInfosArr.filter((e) => {
    return !smuImagesArrValArr.includes(e)
  })
  await formStore.updateTravelImages(newItemArr)
  const travelOffline = async () => {
    await formStore.updateTravelSwingImageToLocal('travelHourImages', formStore.generalForm.travelHourImages as ImageInfo[]);
  }
  if (!isOfflineOrSlowInternetConnection()) {
    try {
      await formStore.updateTravelSwingImageToBE('travelHourImages', formStore.generalForm.travelHourImages as ImageInfo[]);
    } catch (e) {
      travelOffline()
    }
  } else {
    travelOffline()
  }
}

watch(imageObject, async (newVal, oldVal) => {
  if (!isUndefined(newVal) && newVal.ImageInfos.length > 0) {
    if (!isEqual(newVal.ImageInfos, oldVal?.ImageInfos)) {
      await handlePostData()
    }
  }
}, { deep: true })

watch(imageObjectSwing, async (newVal, oldVal) => {
  if (!isUndefined(newVal) && newVal.ImageInfos.length > 0) {
    if (!isEqual(newVal.ImageInfos, oldVal?.ImageInfos)) {
      await handlePostDataSwing()
    }
  }
}, { deep: true })

watch(imageObjectTravel, async (newVal, oldVal) => {
  if (!isUndefined(newVal) && newVal.ImageInfos.length > 0) {
    if (!isEqual(newVal.ImageInfos, oldVal?.ImageInfos)) {
      await handlePostDataTravel()
    }
  }
}, { deep: true })

const showSMUImageDialog = ref<boolean>(false)

const handleShowSMUImagesDialog = () => {
  showSMUImageDialog.value = true
}

const showTravelHourImageDialog = ref<boolean>(false)

const handleShowTravelHourImagesDialog = () => {
  showTravelHourImageDialog.value = true
}

const handleHideTravelHourImagesDialog = () => {
  showTravelHourImageDialog.value = false
}

const showSwingHourImageDialog = ref<boolean>(false)

const handleShowSwingHourImagesDialog = () => {
  showSwingHourImageDialog.value = true
}

const handleHideSwingHourImagesDialog = () => {
  showSwingHourImageDialog.value = false
}

const handleHideSMUImagesDialog = () => {
  showSMUImageDialog.value = false
}

const smuPhotoDeleteDisabled = computed(() => {
  if (!fitter.value.name) return false
  return true
})

const smuCameraDisabled = computed(() => {
  if (!fitter.value.name) return true
  if (smuImages.value.length > 1) return true
  return formStore.stateIsSmuCameraDisabled || eFormStore.generalForm.smu == ''
})

const travelHourCameraDisabled = computed(() => {
  if (!fitter.value.name) return true
  if (travelHourImages.value.length > 1) return true
  return formStore.stateIsTravelHourCameraDisabled || eFormStore.generalForm.travelHour == ''
})

const swingHourCameraDisabled = computed(() => {
  if (!fitter.value.name) return true
  if (swingHourImages.value.length > 1) return true
  return formStore.stateIsSwingHourCameraDisabled || eFormStore.generalForm.swingHour == ''
})

const deleteImage = () => {
  triggerCamera()
  fromDeleteCamera.value = true
  handleHideSMUImagesDialog()
}
const deleteImageSwing = (image) => {
  formStore.deleteSwingPic(image)
  camStore.setCurrent('equipment-swing')
  camStore.clearCurrent()
  if (formStore.stateGeneralForm.isSwingMandatoryTakePhoto && swingHourImages.value.length == 0) {
    triggerCameraSwing(false)
  }
  if (swingHourImages.value.length == 0) handleHideSwingHourImagesDialog()
}
const deleteImageTravel = (image) => {
  formStore.deleteTravelPic(image)
  camStore.setCurrent('equipment-travel')
  camStore.clearCurrent()
  if (formStore.stateGeneralForm.isTravelMandatoryTakePhoto && travelHourImages.value.length == 0) {
    triggerCameraTravel(false)
  }
  if (travelHourImages.value.length == 0) handleHideTravelHourImagesDialog()
}
// ----- SMU IMAGES -----

/* computes */

const fitter = computed(() => {
  return eFormStore.employee;
});
const personelDisabled = computed(() => {
  const fitterSelectedNGeneralSubmitted = fitter.value.name != "" && formStore.generalUpdated
  return fitterSelectedNGeneralSubmitted
});

/* event handlers */
const triggerCamera = () => {
  camStore.toggleIsVisible(true, "equipment-smu");
  camStore.addLocalImageInfo({
    taskKey: 'GENERAL',
    workOrder: formStore.generalForm.workOrder,
    type: 'imageEquipment',
    updatedBy: eFormStore.employee.id,
    email: authStore.user.Email,
  })
}

const onConfirmTakePhoto = () => {
  camStore.toggleIsVisible(true, "equipment-smu");
  camStore.addLocalImageInfo({
    taskKey: 'GENERAL',
    workOrder: formStore.generalForm.workOrder,
    type: 'imageEquipment',
    updatedBy: eFormStore.employee.id,
    email: authStore.user.Email,
  })
  camStore.setShowCloseButton(false);
  showTakePhotoSMU.value = false;
}

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
  camStore.addLocalImageInfo({
    taskKey: 'GENERAL',
    workOrder: formStore.generalForm.workOrder,
    type: 'imageSwing',
    updatedBy: eFormStore.employee.id,
    email: authStore.user.Email,
  })
  camStore.setShowCloseButton(closeButton)
}

const triggerCameraTravel = (closeButton = true) => {
  camStore.toggleIsVisible(true, "equipment-travel");
  camStore.addLocalImageInfo({
    taskKey: 'GENERAL',
    workOrder: formStore.generalForm.workOrder,
    type: 'imageTravel',
    updatedBy: eFormStore.employee.id,
    email: authStore.user.Email,
  })
  camStore.setShowCloseButton(closeButton)
}

const closeSMUAlreadyFilledModal = () => {
  showSMUAlreadyFilled.value = false
}

const closeSMUToleranceNotMappedModal = () => {
  showSMUToleranceNotMapped.value = false
}

const formattedSMU = computed(() => {
  let formatted = formatNumberWithComma(dataSMU.value)
  if (formatted == '0') formatted = ''
  return formatted
})

const formattedTravelHour = computed(() => {
  let formatted = formatNumberWithComma(dataTravelHour.value)
  if (formatted == '0') formatted = ''
  return formatted
})

const formattedSwingHour = computed(() => {
  let formatted = formatNumberWithComma(dataSwingHour.value)
  if (formatted == '0') formatted = ''
  return formatted
})

// this function will be triggered when after done typing smu, then change to other input/ lost focuss to smu input
const onSMUChange = async (value) => {
  validation.value.smu = ''
  dataSMU.value = value;
  // get real smu value from adm (progress)
  if (formStore.SMUToleranceNotMapped) {
    validation.value.smu = 'SMU tolerance not yet mapped'
    showSMUToleranceNotMapped.value = true
  } else if (isSMUOnRange(value)) {
    // Only update if SMU photo already uploaded
    if (formStore.generalForm.imageEquipment.length > 0) {
      changeSMUValue();
      if (!isOfflineOrSlowInternetConnection()) {
        try {
          defectStore.createSMUDefect(
            {
              val: reformatNumberWithComma(dataSMU.value),
              hmOffset: String(formStore.HmOffset),
              range: {
                MinRange: minRangeValue.value,
                MaxRange: maxRangeValue.value
              },
              smuDate: dataSMUDate.value,
              isInRange: isSMUOnRange(dataSMU.value)
            }
          );
          eFormStore.getTaskProgress();
        } catch (error) {
          updateSmuDefectToLocalDB(dataSMU.value);
        }
      } else {
        updateSmuDefectToLocalDB(dataSMU.value);
      }
    } else {
      showTakePhotoSMU.value = true;
    }
  } else {
    confirmationSMUCaption.value = `<b>Is this correct Machine SMU value?</b><br><span>Machine SMU should be in range <b>${minSMUValue.value} to ${maxSMUValue.value}</b></span>`;
    showConfirmSMU.value = true;
  }
}

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

  const updateSMUValueToLocal = () => {
    formStore.updateSMUValueToLocal({
      smu: reformattedSMU,
      hmOffset: String(formStore.HmOffset),
      smuDate: dataSMUDate.value,
      smuBy: dataSMUBy.value
    })
  }

  try {
    if (!isOfflineOrSlowInternetConnection()) {
      try {
        await formStore.updateSMUValueToBE({
          smu: reformattedSMU,
          hmOffset: String(formStore.HmOffset),
          smuDate: dataSMUDate.value,
          smuBy: dataSMUBy.value
        })
      } catch (error) {
        // if error then add to retry task
        updateSMUValueToLocal()
      }
    } else {
      updateSMUValueToLocal()
    }
  } finally {
    // finish
  }
}

const machineSMUField = ref();
const onCancelSMU = () => {
  showConfirmSMU.value = false;
  dataSMU.value = "";
  dataSMUBy.value = {
    id: '',
    name: ''
  };
  dataSMUDate.value = "";
  machineSMUField.value.value = '';
  // changeSMUValue();
  // focus to machine SMU field
  nextTick(() => {
    machineSMUField.value.focus();
  })
}

const onConfirmSMU = () => {
  showConfirmSMU.value = false;
  isSMUDefect.value = true
  // Only update if SMU photo already uploaded
  if (formStore.generalForm.imageEquipment.length > 0) {
    changeSMUValue();
    if (!isOfflineOrSlowInternetConnection()) {
      try {
        defectStore.createSMUDefect(
          {
            val: reformatNumberWithComma(dataSMU.value),
            hmOffset: String(formStore.HmOffset),
            range: {
              MinRange: minRangeValue.value,
              MaxRange: maxRangeValue.value
            },
            smuDate: dataSMUDate.value,
            isInRange: isSMUOnRange(dataSMU.value)
          }
        );
        eFormStore.getTaskProgress();
      } catch (e) {
        updateSmuDefectToLocalDB(dataSMU.value);
      }
    } else {
      updateSmuDefectToLocalDB(dataSMU.value);
    }
  } else {
    showTakePhotoSMU.value = true;
  }
}

let timer
// this function will be triggered when smu typed
const handleSMUOnTyping = async (event) => {
  event.target.value = formatNumberWithComma(reformatNumberWithComma(event.target.value))
  validation.value.smu = ''
  clearTimeout(timer)
  if (event.target.value == '') return false;
  const value = event.target.value
  timer = setTimeout(async () => {
    // first personnel must be selected
    const checkPersonel = handleCheckPersonnelAlreadySelected('smu')
    // if passed smu value on DB must be empty
    if (checkPersonel) {
      let isSMUSubmitted = false
      if (!isOfflineOrSlowInternetConnection()) {
        isSMUSubmitted = await handleCheckPropValOnBE('smu')
      }
      if (!isSMUSubmitted) {
        await onSMUChange(value)
      }
    } else {
      event.target.value = ''
      dataSMU.value = ''
    }
  }, 0)
}

const onlyNumberWhenInput = (event) => {
  event.target.value = onlyNumberResult(event.target.value)
}

// this function will be triggered when after done typing smu, then change to other input/ lost focuss to smu input
const onTravelHourChange = async (value) => {
  validation.value.travelHour = ''
  // get real smu value from adm (progress)
  let val = reformatNumberWithComma(cloneDeep(value))
  formStore.addPropertyParam("GENERAL", "travelHour", val);
  formStore.updateTravelHourONGeneral(val)

  const travelOffline = async () => {
    await formStore.updateSwingValueToLocal(val, "travelHour")
  }

  if (!isOfflineOrSlowInternetConnection()) {
    try {
      await formStore.updateSwingTravelValueToBE("travelHour", val)
    } catch (e) {
      travelOffline()
    }
  } else {
    travelOffline()
  }
}

// this function will be triggered when smu typed
const handleTravelHourOnTyping = async (event) => {
  if (currentValue.value == event.target.value) return
  event.target.value = formatNumberWithComma(reformatNumberWithComma(event.target.value))
  validation.value.travelHour = ''
  clearTimeout(timer)
  const value = event.target.value
  timer = setTimeout(async () => {
    // first personnel must be selected
    const checkPersonel = handleCheckPersonnelAlreadySelected('travelHour')
    // if passed smu value on DB must be empty
    if (checkPersonel) {
      let isSMUSubmitted = false
      if (!isOfflineOrSlowInternetConnection()) {
        isSMUSubmitted = await handleCheckPropValOnBE('travelHour')
      }
      if (!isSMUSubmitted) {
        if (formStore.stateGeneralForm.isTravelMandatoryTakePhoto && travelHourImages.value.length == 0) {
          showTakePhotoTravel.value = true
        }
        await onTravelHourChange(value)
      }
    } else {
      event.target.value = ''
    }
  }, 0)
}

// this function will be triggered when after done typing smu, then change to other input/ lost focuss to smu input
const onSwingHourChange = async (value) => {
  validation.value.swingHour = ''
  // get real smu value from adm (progress)
  let val = reformatNumberWithComma(cloneDeep(value))
  formStore.addPropertyParam("GENERAL", "swingHour", val);
  formStore.updateSwingHourONGeneral(val)

  const swingOffline = async () => {
    await formStore.updateSwingValueToLocal(val, "swingHour")
  }
  if (!isOfflineOrSlowInternetConnection()) {
    try {
      await formStore.updateSwingTravelValueToBE("swingHour", val)
    } catch (e) {
      swingOffline()
    }
  } else {
    swingOffline()
  }
}


const handleSwingHourOnTyping = async (event) => {
  if (currentValue.value == event.target.value) return
  event.target.value = formatNumberWithComma(reformatNumberWithComma(event.target.value))
  validation.value.swingHour = ''
  clearTimeout(timer)
  const value = event.target.value
  timer = setTimeout(async () => {
    // first personnel must be selected
    const checkPersonel = handleCheckPersonnelAlreadySelected('swingHour')
    // if passed smu value on DB must be empty
    if (checkPersonel) {
      let isSMUSubmitted = false
      if (!isOfflineOrSlowInternetConnection()) {
        isSMUSubmitted = await handleCheckPropValOnBE('swingHour')
      }
      if (!isSMUSubmitted) {
        if (formStore.stateGeneralForm.isSwingMandatoryTakePhoto && swingHourImages.value.length == 0) {
          showTakePhotoSwing.value = true
        }
        await onSwingHourChange(value)
      }
    } else {
      event.target.value = ''
    }
  }, 0)
}

const handleCheckPersonnelAlreadySelected = (prop: string) => {
  const validationMsg = 'Labour Personnel Name Personnel field must be completed'
  // first check if Service Personnels exists while typing smu
  // if it doesnt, show error validation
  // check if updateparams object exist on form
  if (eFormStore.employee.id == "" || isUndefined(eFormStore.employee.id)) {
    validation.value[prop] = validationMsg
    return false
  } else {
    return true
  }
}

const handleCheckPropValOnBE = async (prop) => {
  let status
  let nameField = ''
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
      if (prop == 'smu') {
        showConfirmSMU.value = false
        handleCheckImageSMUOnBE();
      }
      eFormStore.updateGeneralValue(prop, value)
      setTimeout(() => {
        // validation.value.smu = ''
      }, 0);
      status = true
    } else {
      status = false
    }
  })
  return status
}

const handleCheckImageSMUOnBE = async () => {
  await formStore.getServiceSheetHeaderKeyVal('imageEquipment', 'SMU Images').then(async (value) => {
    if (value != '') {
      eFormStore.updateGeneralValue('imageEquipment', value)
    }
  })
}

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
}
const onSelectLostFocus = () => {
  relativeClass.value = "";
}

const reformateEndDate = (mechanic: ServicePersonnel, shift: ListItem) => {
  let endHour = ''
  let endDate = ''

  const mechanicDateArr = mechanic.serviceStart.split(' ')
  // const mechanicDateArr = '02.11.2022 19:03:23'.split(' ')

  // case when end hour of shift is PM
  // format on DMA is 24 hrs
  // format on ADM is 12 hrs
  if (shift.endHourType == 'PM') {
    // split to get the hour
    const hourArr = shift.endHour.split(':')
    // then add 12
    const twenty4Format = Number(hourArr[0]) + 12
    endHour = `${twenty4Format}:${hourArr[1]}:${hourArr[2]}`
  } else {
    endHour = shift.endHour
  }

  // 02.11.2022 10:03:23
  // case when end hour of shift is AM
  // but start hour of mechanic is >= start shift (24 hrs format)
  // mechanic start working on 19.00, the end may be 06.00 am next day
  if (shift.startHourType == 'PM' && shift.endHourType == 'AM') {
    // add one on date
    const dateArr = mechanicDateArr[0].split('/')
    const date = ('0' + `${Number(Number(dateArr[0]) + 1)}`).slice(-2)
    mechanicDateArr[0] = `${date}.${dateArr[1]}.${dateArr[2]}`


    // update the time
    endHour = shift.endHour
  }
  endDate = `${mechanicDateArr[0]} ${endHour} ${mechanicDateArr[2]}`
  return endDate
}

const handleGetShift = () => {
  // check all shift di ADM
  const shifList = formStore.stateShiftList
  // check current time
  const currTime = getUTCOffsetTime(formStore.stateTimeZone)
  // return current shift
  const currShift = shifList.find((shift) => {
    // check if current time is between
    const startShift = shift.startHourType == 'PM' ? handleConvertTo24Hrs(`${shift.startHour}:00`) : `${shift.startHour}:00`
    const endShift = shift.endHourType == 'PM' ? handleConvertTo24Hrs(`${shift.endHour}:00`) : `${shift.endHour}:00`
    if (shift.startHourType == 'PM' && shift.endHourType == 'AM') {
      if (currTime > '12:00:00') {
        if (currTime >= startShift || currTime <= endShift) {
          return shift
        }
      } else {
        if (currTime <= startShift && currTime <= endShift) {
          return shift
        }
      }
    } else {
      if (currTime >= startShift && currTime <= endShift) {
        return shift
      }
    }
  })
  if (isUndefined(currShift)) {
    return dayNightConverter(formStore.stateTimeZone)
  } else {
    return currShift!.shift.toLowerCase().includes('shift') ? currShift!.shift : `${currShift!.shift} Shift`
  }
}

const handleCheckFitterFromLog = (opt: Option) => {
  if (opt.value == '') return
  // jika array []
  if (formStore.generalForm.log.length == 0) {
    formStore.setFitterInfoFitter(opt, getUTCOffsetDate(formStore.stateTimeZone), shift.value)
    formStore.setIsFitterLoggedInExist(false)
  } else {
    // filter yang namanya sama
    const fitterArr = formStore.generalForm.log.filter((fitter) => {
      if (!isUndefined(fitter.employee)) return fitter.employee.id == opt.value
    })

    if (fitterArr.length == 0) {
      formStore.setFitterInfoFitter(opt, getUTCOffsetDate(formStore.stateTimeZone), shift.value)
      formStore.setIsFitterLoggedInExist(false)
    } else {
      // filter yang terakhir
      const lastFitter = last(fitterArr)
      formStore.setFitterInfo(lastFitter!)

      // cek fitter terakhir apakah sama dengan shift
      // get time now
      const timeNow = getUTCOffsetDate(formStore.stateTimeZone).split(" ")[1]
      // get shift berdasarkan time now
      const currentShift = formStore.stateShiftList.find((shift) => {
        let isCurrentShift = false
        if (shift.startHourType == "AM" && shift.endHourType == "PM") {
          const endHourExtended = Number(shift.endHour.split(":")[0]) + 6
          let endHour = `${Number(endHourExtended) + 12}:${shift.endHour.split(":")[1]}`
          isCurrentShift = timeNow >= shift.startHour && timeNow <= endHour
        } else if (shift.startHourType == "PM" && shift.endHourType == "AM") {
          let startHour = `${Number(shift.startHour.split(":")[0]) + 12}:${shift.startHour.split(":")[1]}`
          const endHourAM = `${Number(shift.endHour) + 6}:${shift.endHour.split(":")[1]}`
          if (timeNow < "24:00:00") {
            isCurrentShift = timeNow <= startHour || timeNow >= endHourAM
          } else {
            isCurrentShift = timeNow <= startHour && timeNow <= endHourAM
          }
        } else {
          isCurrentShift = true
        }
        return isCurrentShift
      })
      // end shift yang ketemu + 6 jam
      let extendedHour = Number(currentShift?.endHour.split(":")[0]) + 6
      if (currentShift?.endHourType == 'PM') extendedHour += 12
      if (extendedHour > 24) extendedHour - 24
      let extendedTime = `${extendedHour}:${currentShift?.endHour.split(":")[1]}:${currentShift?.endHour.split(":")[2]}`
      // apakah shift + 6 jam < time now
      if (timeNow < extendedTime) {
        formStore.setIsFitterLoggedInExist(true)
      }
    }
  }
  // jika di array tidak nemu fitter yang sama
}

const onPersonnelSelected = async (opt: Option) => {
  // logic pindah ke BE
  relativeClass.value = "";
  actualServiceStart.value = `${getUTCOffsetDate(formStore.stateTimeZone)} (${formStore.stateTimeZoneDesc})`;
  shift.value = handleGetShift()
  const selectedMechanic = {
    id: opt.value,
    name: opt.label
  }
  eFormStore.updateSelectedFitter(selectedMechanic)
  handleCheckFitterFromLog(opt)

  emits("onPersonelSelected");

  /* set payload items */
  const payload = {
    key: uuidv4(),
    mechanic: selectedMechanic,
    serviceStart: "<<ServerDateTime>>",
    serviceEnd: "",
    shift: shift.value
  }
  formStore.addPropertyParam('GENERAL', 'servicePersonnels', JSON.stringify(payload));

  formStore.setCurrentPersoneel(payload)

  // update fitter state
  eFormStore.updateServiceStart(actualServiceStart.value);
  for (const key in validation.value) {
    if (validation.value[key] == 'Labour Personnel Name Personnel field must be completed') {
      validation.value[key] = ''
    }
  }

  eFormStore.updateSelectedFitter(selectedMechanic);
}


const selectFitter = ref()

const showTravelRequired = () => {
  validation.value.travelHour = 'Required'
}
const showSwingRequired = () => {
  validation.value.swingHour = 'Required'
}

const hideTravelRequired = () => {
  validation.value.travelHour = ''
}
const hideSwingRequired = () => {
  validation.value.swingHour = ''
}

const handleReviseSMU = async (params: submitDetailParameter) => {
  const isInRange = !params.newDetail.title.toLowerCase().includes("not")
  changeSMUValue(params.newDetail.machineSMU);
  const isImageRevised = isEqual(smuImages.value, JSON.parse(params.newDetail.images))

  if (!isImageRevised) {
    formStore.updateSMUImages(JSON.parse(params.newDetail.images));

    const imageOffline = () => {
      formStore.updateSMUImageToLocal()
    }
    if (!isOfflineOrSlowInternetConnection()) {
      try {
        await formStore.updateSMUImageToBE();
      } catch (e) {
        imageOffline()
      }
    } else {
      imageOffline()
    }
  }
  if (!isOfflineOrSlowInternetConnection()) {
    try {
      defectStore.createSMUDefect(
        {
          val: reformatNumberWithComma(params.newDetail.machineSMU),
          hmOffset: String(formStore.HmOffset),
          range: {
            MinRange: minRangeValue.value,
            MaxRange: maxRangeValue.value
          },
          smuDate: dataSMUDate.value,
          isInRange: isInRange
        }
      );
      eFormStore.getTaskProgress();
    } catch (error) {
      updateSmuDefectToLocalDB(params.newDetail.machineSMU, isInRange);
    }
  } else {
    updateSmuDefectToLocalDB(params.newDetail.machineSMU, isInRange);
  }
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

defineExpose({
  showTravelRequired,
  showSwingRequired,
  hideTravelRequired,
  hideSwingRequired
})

/* life cycles */
onMounted(() => {
  // formStore.setPayloadId(props.data.id, authStore.user.EmployeeId, authStore.user.Name);
  if (eFormStore.stateFromHomePage) {
    selectFitter.value.optionSelected({
      label: "",
      value: ""
    })
    actualServiceStart.value = ""
    eFormStore.setFromHomePage(false)
    dataSMU.value = props.data.smu
  }
});
onUnmounted(() => {
  if (loadingPhoto.value) {
    loadingPhoto.value.close()
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/sass/pages/floating-label.scss";
</style>

<style>
.form-control,
.form-select {
  color: #919EAB;
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
  color: #212B36;
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
