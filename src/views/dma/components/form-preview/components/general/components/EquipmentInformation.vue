<template>
  <div class="mt-5 ps-0">
    <el-collapse v-model="activeTaskGroup" class="general-accordion task-group py-1 px-5 mb-3">
      <el-collapse-item name="Equipment Information">
        <template #title>
          <h4 class="subtitle ps-3" v-if="!viewEmpty">Equipment Information</h4>
          <h4 class="subtitle ps-3" v-else>Service Labour Personnel</h4>
        </template>
        <template v-if="viewEmpty">
          <div class="p-2 me-0">
            <div class="row" style="width:101%">
              <div class="col-12 pe-0">
                <SelectSearch ref="selectFitter" :field-label="'Labour Personnel Name'" placeholder="Select your name" :data="[]" value="" :display-label="true" :disabled="true" />
              </div>
            </div>
          </div>
          <div class="p-2 me-0">
            <div class="row" style="width:101%">
              <div class="col-6 pe-0">
                <div class="form-floating mb-3" style="position: relative !important;">
                  <input type="text" class="form-control" disabled value="" />
                  <label for="floatingInput" class="text-nowrap">Actual Service Start (each labour personnel)</label>
                </div>
              </div>
              <div class="col-6 pe-0">
                <div class="form-floating mb-3" style="position: relative !important;">
                  <input type="text" class="form-control no-float" disabled value="" />
                  <label for="floatingInput">Shift</label>
                </div>
              </div>
            </div>
          </div>
          <h4 class="subtitle ps-3">Equipment Information</h4>
        </template>
        <div class="d-flex flex-row justify-content-between">
          <div class="p-2 d-flex flex-row flex-grow-1">
            <div class="d-flex w-100">
              <div class="flex-fill">
                <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="general.equipment">
                <label>Unit Number</label>
              </div>
              </div>
              <div class="flex-fill ps-3">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" disabled :value="general.serialNumber">
                  <label for="floatingInput">Serial Number</label>
                </div>
              </div>
              <div class="flex-fill ps-3">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" disabled :value="general.workOrder">
                  <label for="floatingInput">Work Order</label>
                </div>
              </div>
                <div class="flex-fill ps-3">
                <div class="form-floating mb-3 position-relative">
                  <input type="text" class="form-control" placeholder="Machine SMU" disabled :value="formatNumberWithComma(general.smu)" />
                  <label for="floatingInput2" class="text-nowrap">Machine SMU</label>
                  <!-- edit smu -->
                  <div class="ms-2 position-absolute" style="top: 2px; right: 0;" v-if="isEditableSMU">
                    <button class="btn p-4 justify-items-center rounded cursor-pointer svg-icon svg-icon-btech-primary-500" @click="handleEditClick">
                      <img src="/media/icons/bumaau/icon-edit.png" style="width: 1.25rem; height: 1.25rem" />
                    </button>
                  </div>
                </div>
                <template v-if="validation.smu">
                  <label class="text-danger ps-2 font-weight-bold">{{ validation.smu }}</label>
                </template>
              </div>
              <div class="ms-2" v-if="smuImages.length > 0">
                  <div class="p-3 justify-items-center rounded" style="background: #18AF4A;">
                    <span style="font-weight: 700; color:white" @click="handleShowSMUImagesDialog">+{{smuImages.length}}</span>
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
                <input type="text" class="form-control" disabled :value="general.serviceStart">
                <label for="floatingInput">Actual Service Start</label>
              </div>
              </div>
              <div class="flex-fill ps-3">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" disabled :value="hmOffset">
                  <label for="floatingInput">Hour Meter Offset</label>
                </div>
              </div>
              <div v-if="!isUndefined(data.travelHour)" class="d-flex" style="flex-basis: 40%">
                  <div class="flex-fill ps-3">
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control" placeholder="Travel Hours" disabled :value="formatNumberWithComma(general.travelHour)" />
                    <label for="floatingInput2" class="text-nowrap">Travel Hours</label>
                  </div>
                </div>
                <div class="ms-2" v-if="travelHourImages.length > 0">
                    <div class="p-3 justify-items-center rounded" style="background: #18AF4A;">
                      <span style="font-weight: 700; color:white" @click="handleShowTravelImagesDialog">+{{travelHourImages.length}}</span>
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
                <input type="text" class="form-control" disabled :value="general.serviceEnd">
                <label for="floatingInput">Actual Service Finish</label>
              </div>
              </div>
              <div v-if="!isUndefined(data.swingHour)" class="d-flex" style="flex-basis: 40%">
                  <div class="flex-fill ps-3">
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control" placeholder="Swing Hours" disabled :value="formatNumberWithComma(general.swingHour)" />
                    <label for="floatingInput2" class="text-nowrap">Swing Hours</label>
                  </div>
                </div>
                <div class="ms-2" v-if="swingHourImages.length > 0">
                    <div class="p-3 justify-items-center rounded" style="background: #18AF4A;">
                      <span style="font-weight: 700; color:white" @click="handleShowSwingImagesDialog">+{{swingHourImages.length}}</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <template v-if="!viewEmpty">
          <h4 class="subtitle ps-3 service-labour">Service Labour Personnel</h4>
          <div class="me-0 previous-crack-container word-breaker px-3 pt-0 ms-2">
            <div class="row table-header-background-color p-2 border-bottom">
              <div class="col-3 text-center">Name</div>
              <div class="col-3 text-center">Shift</div>
              <div class="col-3 text-center">Start Date</div>
              <div class="col-3 text-center">Finish Date</div>
            </div>
            <service-personnel v-for="mechanic in general.servicePersonnels" :key="mechanic.key" :mechanic="mechanic" :mechanics="general.servicePersonnels"/>
          </div>
        </template>
      </el-collapse-item>
    </el-collapse>
  </div>
  <ImagePreviewSimple
  :images="smuImages"
  :visibility="showSMUImageDialog"
  @on-close="handleHideSMUImagesDialog" />
  <ImagePreviewSimple
  :images="travelHourImages"
  :visibility="showTravelImageDialog"
  @on-close="handleHideTravelImagesDialog" />
  <ImagePreviewSimple
  :images="swingHourImages"
  :visibility="showSwingImageDialog"
  @on-close="handleHideSwingImagesDialog" />
  <SMUDetailDialog
    v-model:show="showSMUDetailDialog"
    :detailDefect="detailSMUDialog"
    :ownership="formatOwnershipHTML"
    :view-only="false"
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
  ref,
  computed,
  defineProps,
  PropType
} from "vue";
import {
  cloneDeep,
  isEqual,
  isNull,
  isUndefined
} from "lodash"
import ServicePersonnel from "./ServicePersonnel.vue";
import ImagePreviewSimple from '@/components/camera/ImagePreviewSimple.vue'
import {
  formatNumberWithComma,
  reformatNumberWithComma
} from "@/core/helpers/number-format"
import { General } from "@/core/types/entities/dma/e-form/general/General";
import SelectSearch from "@/components/inputs/dma/SelectSearchWithLabel.vue";
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo";
import {
  stringToImageInfoConvert
} from "@/core/helpers/string-to-imageinfo-converter";
import SMUDetailDialog from '@/views/dma/components/defects/SMUDetailDialog.vue'
import { MachineSMUEnum } from "@/store/enums/MachineSMUEnum";
import { formatOwnership, isPlanner } from "@/store/pinia/dma/e-form/helpers";
import {
  DefectSMU,
  submitDetailParameter
} from "@/core/types/entities/dma/defects/DefectSMU";
import { CameraId } from "@/store/enums/CameraIdEnum";
import { ImageObject } from "@/core/types/entities/dma/OfflineImageObject";
import {
  useGeneralFormStore
} from "@/store/pinia/dma/e-form-offline/useGeneralFormStore";
import {
  useDefectsFormStore
} from '@/store/pinia/dma/e-form/defects/useDefectsFormStore';
import {
  useDefectsFormStore as useOfflineDefectsFormStore
} from "@/store/pinia/dma/e-form-offline/defects/useDefectsFormStore";
import {
  useOfflineCameraStore
} from "@/store/pinia/application/useOfflineCameraStore";
import {
  usePreviewFormStore
} from "@/store/pinia/dma/preview-form/usePreviewFormStore";
import {
  usePreviewDefectFormStore
} from "@/store/pinia/dma/preview-form/usePreviewDefectFormStore";
import { Audit } from "@/core/types/intervention/Audit";
import {
  AESTCurrentDateTime,
  isBefore,
  removeAEST,
  add
} from "@/core/helpers/date-format";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";

const props = defineProps({
  data: {
    required: true,
    type: Object as PropType<General>,
  },
  viewEmpty: {
    type: Boolean,
    required: false,
    default: false
  }
});

/* stores */
const formStore = useGeneralFormStore();
const defectStore = useDefectsFormStore();
const defectOfflineStore = useOfflineDefectsFormStore();
const camStore = useOfflineCameraStore();
const previewStore = usePreviewFormStore()
const authStore = useAuthenticationStore()
const defectPreview = usePreviewDefectFormStore()

const activeTaskGroup = ref('Equipment Information');
const dataSMUBy = ref<Audit>({
  name: '',
  id: ''
});
const dataSMUDate = ref("");
const showSMUDetailDialog = ref<boolean>(false);
const smuImages = computed(() => {
  const smuImages = props.data?.imageEquipment
  if (!isUndefined(smuImages)) {
    if (smuImages == '') {
      return [] as ImageInfo[]
    } else {
      return stringToImageInfoConvert(smuImages as string[])
    }
  } else {
    return [] as ImageInfo[]
  }
})

const travelHourImages = computed(() => {
  const travelImages = props.data?.travelHourImages
  if (!isUndefined(travelImages)) {
    if (travelImages == '') {
      return [] as ImageInfo[]
    } else {
      return stringToImageInfoConvert(travelImages as string[])
    }
  } else {
    return [] as ImageInfo[]
  }
})

const swingHourImages = computed(() => {
  const swingImages = props.data?.swingHourImages
  if (!isUndefined(swingImages)) {
    if (swingImages == '') {
      return [] as ImageInfo[]
    } else {
      return stringToImageInfoConvert(swingImages as string[])
    }
  } else {
    return [] as ImageInfo[]
  }
})

const handleEditClick = () => {
  showSMUDetailDialog.value = true
}

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

const detailSMUDialog = computed(() => {
  let val = reformatNumberWithComma(cloneDeep(props.data?.smu));
  const minRange = Number(val) + Number(hmOffset.value) >= minRangeValue.value;
  const maxRange = Number(val) + Number(hmOffset.value) <= maxRangeValue.value;

  let status = MachineSMUEnum.STATUS_NOT_IN_RANGE
  if (minRange && maxRange) {
    status = MachineSMUEnum.STATUS_IN_RANGE
  }

  return {
    title: MachineSMUEnum.TITLE(status),
    machineSMU: props.data?.smu,
    minRange: minRangeValue.value,
    maxRange: maxRangeValue.value,
    smuDue: formStore.smuActual,
    assetNumber: general.value.equipment,
    serialNumber: general.value.serialNumber,
    images: JSON.stringify(smuImages.value),
    hmOffset: general.value.hmOffset,
    key: "",
    type: "",
    reason: "",
  } as DefectSMU
})

const generalData = computed(() => {
  return {
    id: props.data.id,
    workOrder: props.data.workOrder,
    form: props.data.form,
    smuDue: formStore.smuActual,
    equipment: props.data.equipment,
    serialNumber: (general.value.serialNumber as string),
    imageEquipment: JSON.stringify(general.value.imageEquipment),
    localStatus: props.data.status
  }
})

const formatOwnershipHTML = computed(() => {
  const ownership = defectStore.Ownership
  return formatOwnership(ownership)
})

const showSMUImageDialog = ref(false)

const handleShowSMUImagesDialog = () => {
  showSMUImageDialog.value = true
}

const handleHideSMUImagesDialog = () => {
  showSMUImageDialog.value = false
}

const showSwingImageDialog = ref(false)

const handleShowSwingImagesDialog = () => {
  showSwingImageDialog.value = true
}

const handleHideSwingImagesDialog = () => {
  showSwingImageDialog.value = false
}

const showTravelImageDialog = ref(false)

const handleShowTravelImagesDialog = () => {
  showTravelImageDialog.value = true
}

const handleHideTravelImagesDialog = () => {
  showTravelImageDialog.value = false
}

const cameraIDRevise = CameraId.SMU_REVISE;

const imageObjectRevise = computed(() : ImageObject => {
  const images = camStore.ImageObjects.find((i) => {
    return i.Id === cameraIDRevise;
  }) as ImageObject
  return cloneDeep(images);
});

const errorData = computed(() => {
  return {
    isError: defectOfflineStore.stateErrorMessage == '' ? false : true,
    messages: defectOfflineStore.stateErrorMessage
  }
})
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

const resetErrorStatus = () => {
  defectOfflineStore.resetErrorStatus()
}

const handleRetakePhotoRevise = () => {
  camStore.toggleIsVisible(true, cameraIDRevise);
}

const handleResetCameraStore = () => {
  camStore.reset();
}

/* refs */
const validation = ref({
  smu: ''
})

/* computes */
const general = computed(() => {
  return props.data
})

const hmOffset = computed(() => {
  if (general.value.status == "Open") {
    return ""
  } else if (isUndefined(general.value.hmOffset) || isNull(general.value.hmOffset) || general.value.hmOffset == "") {
    return "Not Applicable"
  } else {
    return general.value.hmOffset
  }
})

const changeSMUValue = async (revisedSMU) => {
  const reformattedSMU = reformatNumberWithComma(revisedSMU);
  dataSMUDate.value = AESTCurrentDateTime()
  dataSMUBy.value = {
    id: authStore.user.EmployeeId,
    name: authStore.user.Name
  }
  previewStore.updateSMUONGeneral({
    value: reformattedSMU,
    smuBy: dataSMUBy.value,
    smuDate: dataSMUDate.value
  });
  // formStore.updateSMUValueToBE({
  //   smu: reformattedSMU,
  //   hmOffset: String(general.value.hmOffset),
  //   smuDate: dataSMUDate.value,
  //   smuBy: dataSMUBy.value,
  //   generalData: generalData.value
  // })
}

const handleReviseSMU = async (params: submitDetailParameter) => {
  const isInRange = !params.newDetail.title.toLowerCase().includes("not")
  changeSMUValue(params.newDetail.machineSMU);
  const isImageRevised = isEqual(smuImages.value, JSON.parse(params.newDetail.images))

  if (!isImageRevised) {
    previewStore.updateSMUImages(JSON.parse(params.newDetail.images));
    // await formStore.updateSMUImageToBE({
    //   id: props.data.id,
    //   employee: {
    //     id: authStore.user.EmployeeId,
    //     name: authStore.user.Name
    //   },
    //   localStatus: props.data.status,
    //   imageEquipment: JSON.parse(params.newDetail.images)
    // });
  }

  // alternative for monitoring just update defect header n detail
  // if no defect data then create smu defect
  await defectPreview.updateSMUDefect({
    val: reformatNumberWithComma(params.newDetail.machineSMU),
    hmOffset: String(general.value.hmOffset),
    range: {
      MinRange: minRangeValue.value,
      MaxRange: maxRangeValue.value
    },
    smuDate: dataSMUDate.value,
    isInRange: isInRange,
    employee: {
      id: authStore.user.EmployeeId,
      name: authStore.user.Name
    },
    generalData: generalData.value
  })
  previewStore.getTaskProgress();

  params.callback();
}

const isEditableSMU = computed(() => {
  const checkIsPlanner = isPlanner()
  const checkNewData = !isUndefined(general.value.smuBy) && !isUndefined(general.value.smuDate)
  const checkStatus = general.value.status == "Close" && general.value.defectStatus == "Completed"
  const statusHistoryClose = general.value.statusHistory.filter((history) => {
    return history.status == "Completed"
  })
  let checkHistoryDate = false
  if (statusHistoryClose.length == 1) {
    const completedDate = removeAEST(statusHistoryClose[0].updatedDate)
    checkHistoryDate = isBefore(undefined, add(completedDate, 3, "months", "DD/MM/YY HH:mm:ss"))
  }
  return checkIsPlanner && checkNewData && checkStatus && checkHistoryDate
})
</script>

<style lang="scss" scoped>
 @import "@/assets/sass/pages/floating-label.scss";
</style>


<style lang="scss">
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
}

.subtitle {
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
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

.table-header-background-color {
  background-color: #F9FAFB;

  &.border-bottom {
    border-bottom: 1px solid #919eab3d
  }
}

.previous-crack-container {
  border: 1px solid #919eab3d;
}

.previous-crack-container word-breaker {
  border: 1px solid #919eab3d;
}

.service-labour {
  &.table-body {
    border-bottom: 1px solid #919eab3d;
  }

  .border-left {
    border-left: 1px solid #919eab3d
  }
}
</style>
