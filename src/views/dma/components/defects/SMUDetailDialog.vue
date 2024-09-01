<template>
  <el-dialog
    v-model="showDialog"
    custom-class="el-defect-crack-form-custom"
    center
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape = "false"
    @opened="openFirst"
    @open="openFirst"
    width="90%"
  >
    <template #title>
      <label class="title-dialog">
        Detailed Information Machine SMU
        <template v-if="approvalSPVData?.status == 'Acknowledge'">
          <span class="ms-1 status-badge-dialog-header approved-badge p-1">Approved</span>
        </template>
      </label>
    </template>
    <template v-if="approvalSPVData?.status == 'Acknowledge'">
      <div class="py-2">
        <div class="row mb-1">
          <div class="col">
            <div class="form-floating approved-text-box">
                <div class="form-control" style="white-space:break-spaces;">{{ approvalSPVData?.approvedDate }} — {{ approvalSPVData?.approvedBy?.name }}</div>
                <label>Approved</label>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="d-flex flex-column">
      <template v-if="!isReviseMode">
        <div class="d-flex flex-column">
          <p class="text-bold">Asset Number - Serial Number - Ownership</p>
          <div class="d-flex flex-row">
            <p>{{ detailDefect.assetNumber }} - {{ detailDefect.serialNumber }} -</p>
            <div class="ms-1 asset-number-disabled-div" v-html="ownership"></div>
          </div>
        </div>
        <div class="d-flex flex-column mt-3" v-if="isIntevention">
          <p class="text-bold">{{ MachineSMUEnum.VIEW_DIALOG_LABEL(true) }}</p>
          <p>{{ detailDefect.machineSMU }}</p>
        </div>
        <div class="d-flex flex-column mt-3" v-else>
          <p class="text-bold" :class="[isInRange ? '': 'text-red']">{{ MachineSMUEnum.VIEW_DIALOG_LABEL(isInRange) }}</p>
          <p :class="[isInRange ? '': 'text-red']">{{ detailDefect.machineSMU }}</p>
        </div>
        <div class="d-flex flex-column mt-3" v-if="!isInRange && !isIntevention">
          <p class="text-bold">Machine SMU should be in range</p>
          <p>{{ machineRangeString }}</p>
        </div>
        <div class="d-flex flex-column mt-3" v-if="!isIntevention">
          <p class="text-bold">SMU Due (Service)</p>
          <p>{{ detailDefect.smuDue }}</p>
        </div>
        <div class="d-flex flex-column mt-3">
          <p class="text-bold">Hour Meter Offset</p>
          <p>{{ detailDefect.hmOffset }}</p>
        </div>
        <div class="d-flex flex-column mt-3">
          <p class="text-bold">Machine SMU Photo Taken</p>
          <div class="row my-4">
            <div v-for='(img, index) in imageInfos' :key='img.filename' class='col-md-6 fv-row fv-plugins-icon-container p-2 rounded position-relative'>
              <el-skeleton :loading="loader[index]" animated>
                <template #template>
                  <el-skeleton-item variant="image" class='w-100 rounded' style="height: 200px; object-fit: fill" />
                </template>
                <template #default>
                  <div class="bg-secondary">
                    <img
                      v-if="getImageUrl(img.filename) != undefined"
                      :src="getImageUrl(img.filename)"
                      class='w-100'
                      style="height: 200px; object-fit: contain; cursor: pointer"
                      alt="images"
                      @click="handleShowFullScreen(img.filename)"
                    />
                  </div>
                </template>
              </el-skeleton>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="d-flex flex-row justify-content-between">
          <div class="py-2 d-flex flex-row flex-grow-1">
            <div class="flex-fill">
              <div class="form-floating">
                <div type="text" class="form-control asset-number-disabled-div d-flex">
                  <p>{{ detailDefect.assetNumber }} - {{ detailDefect.serialNumber }} -</p>
                  <span class="ms-1 asset-number-disabled-div" v-html="ownership"></span>
                </div>
                <label for="floatingInput">Asset Number</label>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-1 py-2">
          <div class="row">
              <div class="col pe-0">
                  <div class="form-floating">
                      <input type="text" class="form-control" disabled :value="detailDefect.machineSMU">
                      <label class="text-nowrap">Previous Machine SMU</label>
                  </div>
              </div>
              <div class="col pe-0">
                  <div class="form-floating">
                      <input inputmode="numeric" class="form-control" v-model="revisedSMU.value" @keypress="onlyNumber" @change="onlyNumber" @blur="onBlur">
                      <label class="text-nowrap">{{ plannerApprove ? 'Revised Machine SMU. (If Required)': 'Revised Machine SMU' }}</label>
                  </div>
                  <div class="mt-2" v-if="!revisedSMU.isValid">
                    <Label class="error-label">{{ revisedSMU.errorMessage }}</Label>
                  </div>
              </div>
          </div>
        </div>
        <div class="mt-1 py-2" v-if="!isInRange && !isIntevention">
          <div class="row">
              <div class="col pe-0">
                  <div class="form-floating">
                      <input type="text" class="form-control" disabled :value="machineRangeString">
                      <label>Machine SMU should be in range</label>
                  </div>
              </div>
          </div>
        </div>
        <div class="mt-1 py-2" v-if="!isIntevention">
          <div class="row">
              <div class="col pe-0">
                  <div class="form-floating">
                      <input type="text" class="form-control" disabled :value="detailDefect.smuDue">
                      <label>SMU Due (Service)</label>
                  </div>
              </div>
          </div>
        </div>
        <div class="mt-1 py-2">
          <div class="row">
              <div class="col pe-0">
                  <div class="form-floating">
                      <input type="text" class="form-control" disabled :value="detailDefect.hmOffset">
                      <label class="text-nowrap">{{ plannerApprove ? 'Previous ': '' }} Hour Meter Offset</label>
                  </div>
              </div>
              <div class="col pe-0" v-if="plannerApprove">
                  <div class="form-floating">
                      <input inputmode="numeric" class="form-control" v-model="revisedHmOffset.value" @keypress="onlyNumber" @change="onlyNumber" @blur="onBlur">
                      <label class="text-nowrap">Revised Hour Meter Offset. (If Required)</label>
                  </div>
                  <div class="mt-2" v-if="!revisedHmOffset.isValid">
                    <Label class="error-label">{{ revisedHmOffset.errorMessage }}</Label>
                  </div>
              </div>
          </div>
        </div>
        <div class="d-flex flex-column mt-3">
          <div class="d-flex justify-content-between align-items-center">
            <p class="text-bold">Machine SMU Photo Taken</p>
            <button v-if="isFitter" class="btn btn-light" @click="handleRetakePhoto" style="background: #FFFFFF; border: 1px solid #18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: #18AF4A; padding: 4px;">Retake Photo</button>
          </div>
          <div class="row my-4">
            <div v-for='(img, index) in viewedImageSMU' :key='img.filename' class='col-md-6 fv-row fv-plugins-icon-container p-2 rounded position-relative'>
              <el-skeleton :loading="loader[index]" animated>
                <template #template>
                  <el-skeleton-item variant="image" class='w-100 rounded' style="height: 200px; object-fit: fill" />
                </template>
                <template #default>
                  <div class="bg-secondary">
                    <img
                      v-if="getImageUrl(img.filename, true) != undefined"
                      :src="getImageUrl(img.filename, true)"
                      class='w-100'
                      style="height: 200px; object-fit: contain; cursor: pointer"
                      alt="images"
                      @click="handleShowFullScreen(img.filename, true)"
                    />
                  </div>
                </template>
              </el-skeleton>
            </div>
          </div>
        </div>
      </template>
      <template v-if="!viewOnly">
        <div class="my-5 w-100 d-flex justify-content-around">
          <template v-if="isReviseMode">
            <button class="btn btn-light w-100" @click="handleCancelRevise"
            style="background: #FFFFFF; border: 1px solid #18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: #18AF4A">Cancel</button>
            <button class="ms-3 btn btn-success w-100" @click.prevent="confirmApproval"
            style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">{{ isFitter ? 'Submit'  : 'Submit & Approve'}}</button>
          </template>
          <template v-else>
            <button class="btn btn-light w-100" @click="handleRevise"
            style="background: #FFFFFF; border: 1px solid #18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: #18AF4A">Revise</button>
            <button class="ms-3 btn btn-success w-100" @click.prevent="confirmApproval" v-if="!isFitter"
            style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Approve</button>
          </template>
        </div>
      </template>
    </div>
  </el-dialog>
  <Confirmation
    :visibility="showConfirmation"
    :no-label="'Cancel'"
    caption="Are you sure this Machine SMU information is correct?"
    @on-no-confirm="cancelApprove"
    @on-yes-confirm="submitApproval"
  />
  <ToastWithIcon :show="successMessageBoxVisible" :message="submitSuccessMessage" />
  <FullScreenDialog :images="isReviseMode ? revisedDataFullscreen : a"
    :visibility="showFullImage"
    :image="selectedFullscreenImage"
    @handle-close="closeFullScreenImage"/>
  <ErrorBox
  :visibility="isErrorShows"
  :caption="errorStatus?.messages"
  @on-close="handleCloseErrorPopUp" />
</template>

<script lang="ts" setup>
import {
  PropType,
  computed,
  ref,
  watch
} from 'vue';
import { db } from '@/database/schema/DexieSchema'
import {
  DefectSMU,
  plannerDataSMU,
  ApproveSMU
} from "@/core/types/entities/dma/defects/DefectSMU";
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter';
import {
  StringWithValidationState
} from "@/core/types/misc/StringWithValidationState";
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo';
import { KeyValue } from '@/core/types/misc/KeyValue';
import { AxiosResponse } from 'axios';
import ApiService from '@/core/services/ApiService';
import { cloneDeep, isUndefined } from 'lodash';
import { ElLoading } from 'element-plus';
import Confirmation from '@/components/dialog/Confirmation.vue';
import FullScreenDialog from '@/components/camera/OfflineFullScreenDialog.vue';
import ToastWithIcon from "@/components/dialog/ToastWithIcon.vue";
import ErrorBox from '@/components/alert/ErrorBox.vue';
import {
  onlyNumber,
} from '@/store/pinia/dma/e-form/helpers';
import {
  isDotTheLastDigit,
} from '@/core/helpers/number-format';
import { MachineSMUEnum } from "@/store/enums/MachineSMUEnum";
import { ImageObject } from "@/core/types/entities/dma/ImageObject";
import { NoNetworkMessages } from '@/store/enums/ErrorMessagesEnum';

const props = defineProps({
  show: {
    required: true,
    type: Boolean,
    default: false
  },
  detailDefect: {
    required: true,
    type: Object as PropType<DefectSMU>,
    default: () => {
      return {
        title: "",
        machineSMU: "",
        machineSMURange: "",
        minRange: "",
        maxRange: "",
        smuDue: "",
        assetNumber: "",
        serialNumber: "",
        images: "",
        hmOffset: "",
        key: "",
        type: "",
        reason: "",
      }
    }
  },
  ownership: {
    required: true,
    type: String
  },
  viewOnly: {
    required: false,
    type: Boolean,
    default: false
  },
  plannerApprove: {
    required: false,
    type: Boolean,
    default: false
  },
  plannerData: {
    required: false,
    type: Object as PropType<plannerDataSMU>
  },
  isFitter: {
    default: false,
  },
  approvalSPVData: {
    required: false,
    type: Object as PropType<ApproveSMU>,
    default: {} as ApproveSMU
  },
  errorStatus: {
    required: true,
    type: Object as PropType<{
      messages: string,
      isError: boolean
    }>,
    default: {} as {
      messages: string,
      isError: boolean
    }
  },
  camerasImage: {
    required: false,
    type: Object as PropType<ImageObject>
  },
  isIntevention: {
    required: false,
    type: Boolean,
    default: false
  }
})
const emit = defineEmits([
  'update:show',
  'onRefreshData',
  'updateDefectDetailSMU',
  'updatePlannerDefectAcknowledge',
  'updateDefectAcknowledge',
  'resetErrorStatus',
  'retakePhoto',
  'resetPhoto'
]);

const imageObject = computed(() : ImageObject | undefined => {
  return props.camerasImage || undefined
});

const handleRetakePhoto = () => {
  emit('retakePhoto')
}

const viewedImageSMU = computed(() : ImageInfo[] => {
  if (imageObject.value && imageObject.value.ImageInfos && imageObject.value.ImageInfos.length > 0) {
    return imageObject.value.ImageInfos as ImageInfo[]
  }
  return imageInfos.value
})

const showDialog = computed({
  get: () => {
    return props.show
  },
  set: (val: boolean) => {
    toogleShow(val)
  }
})

const showConfirmation = ref<boolean>(false);
const loader = ref<boolean[]>([]);

const imageInfos = ref<ImageInfo[]>([])
const keyValues = ref<KeyValue[]>([])
const revisedKeyValues = ref<KeyValue[]>([])
const isReviseMode = ref<boolean>(false)
const revisedSMU = ref<StringWithValidationState>({
  value: "",
  isValid: true,
  errorMessage: ""
})
const revisedHmOffset = ref<StringWithValidationState>({
  value: "",
  isValid: true,
  errorMessage: ""
})

const onBlur = (e) => {
  if (isDotTheLastDigit(e.target.value)) {
    revisedSMU.value = e.target.value.replaceAll('.', '')
  }
  validateNumberInput(revisedSMU.value)
}

const smuImages = computed(() => {
  try {
    const smuImages = JSON.parse(props.detailDefect.images)
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
const selectedFullscreenImage = ref<string>("");
const showFullImage = ref<boolean>(false);
const handleShowFullScreen = (image: string, revise = false) => {
  let fullscreenData = a.value
  if (revise) {
    fullscreenData = revisedDataFullscreen.value
  }
  const imageInfo = fullscreenData.find((item) => {
    return item.imgBlob == image
  })
  selectedFullscreenImage.value = imageInfo.url;
  showFullImage.value = true
}
const closeFullScreenImage = () => {
  selectedFullscreenImage.value = ""
  showFullImage.value = false
}

const minRange = computed(() : number => {
  // add condition where minRange is exist else search by string
  if (props.detailDefect?.minRange) {
    return props.detailDefect?.minRange
  }
  if (props.detailDefect?.machineSMURange) {
    // number string number
    const splitString = props.detailDefect.machineSMURange.split(" ")
    if (!isNaN(parseFloat(splitString[0]))) {
      return parseFloat(splitString[0]);
    }
  }
  return 0
})

const maxRange = computed(() : number => {
  // add condition where maxRange is exist else search by string
  if (props.detailDefect?.maxRange) {
    return props.detailDefect?.maxRange
  }
  if (props.detailDefect?.machineSMURange) {
    // number string number
    const splitString = props.detailDefect.machineSMURange.split(" ")
    if (splitString.length >= 3 && !isNaN(parseFloat(splitString[2]))) {
      return parseFloat(splitString[2])
    }
  }
  return 0
})

const machineRangeString = computed(() => {
  return `${minRange.value - Number(props.detailDefect?.hmOffset)} to ${maxRange.value - Number(props.detailDefect?.hmOffset)}`
})

const isInRange = computed(() : boolean => {
  if (props.detailDefect?.title) {
    return !props.detailDefect?.title.toLocaleLowerCase().includes("not")
  }
  return true
})

const validateNumberInput = (refObj: StringWithValidationState) => {
  if (!props.plannerApprove) {
    if (refObj.value == '') {
      refObj.isValid = false
      refObj.errorMessage = "Required"
    } else {
      refObj.isValid = true
      refObj.errorMessage = ""
    }
  }
}

const confirmApproval = () => {
  if (isReviseMode.value) {
    let validationFailed = false;
    validateNumberInput(revisedSMU.value)
    // validation for all user
    if (!revisedSMU.value.isValid) {
      revisedSMU.value.isValid = false
      revisedSMU.value.errorMessage = "Required"
      validationFailed = true;
    }

    // // validation for planner (optional)
    // if (props.plannerApprove) {
    //   if (!revisedHmOffset.value.isValid) {
    //     revisedHmOffset.value.isValid = false
    //     revisedHmOffset.value.errorMessage = "Required"
    //     validationFailed = true;
    //   }
    // }

    if (!validationFailed) {
      showConfirmation.value = true;
    }
  } else {
    showConfirmation.value = true;
  }
}

const handleCloseErrorPopUp = () => {
  isErrorShows.value = false
  if (props.errorStatus.messages != NoNetworkMessages.NO_NETWORK_VIEW) {
    emit('resetErrorStatus')
    onOk()
  }
}

const isErrorShows = ref(false)

const handleError = () => {
  isErrorShows.value = props.errorStatus?.isError
}

const successMessageBoxVisible = ref<boolean>(false)
const autoCloseSuccessMessageBox = () => {
  successMessageBoxVisible.value = true
  setTimeout(() => {
    successMessageBoxVisible.value = false
    onOk();
  }, 1000);
}

const toogleShow = (value: boolean) => {
  emit('update:show', value)
}

const onOk = () => {
  showDialog.value = false;
  toogleShow(false)
  emit('onRefreshData');
}

const getImageUrl = (filename: string, revise = false) => {
  let blobsList = keyValues.value
  if (revise) {
    blobsList = revisedKeyValues.value
  }
  if (blobsList.length < 1) return undefined
  let value: string | undefined = undefined
  do {
    value = blobsList.find((k) => {
      return k.key == filename
    })?.value
  } while (!value)
  return value
}

const lastCount = ref<number>(0);
const a = ref([]) as any;
const revisedDataFullscreen = ref([]) as any;
const imagesObject = (() => {
  const imgsProps = smuImages.value;
  a.value = imgsProps?.map((img) => {
    return {
      imgBlob: img.filename as string,
      url: '',
      description: img.description
    }
  })
})
const openFirst = async () => {
  emit('resetErrorStatus')
  imagesObject()
  lastCount.value = 0
  keyValues.value = []
  isReviseMode.value = false
  reset()
  if (!smuImages.value) return
  imageInfos.value = stringToImageInfoConvert(smuImages.value)
  loader.value = Array.apply(null, Array(smuImages.value.length)).map(function () {
    return true
  })
  const count = imageInfos.value.length
  for (let i = lastCount.value; i < count; i++) {
    const imageName = imageInfos.value[i].filename
    const image = await db.pendingTaskFile.where({
      filename: imageName
    }).first()
    try {
      if (!image) {
        await getImageFromBlobServer(imageName, i)
      } else {
        const clone = cloneDeep(image)
        let URL = window.URL || window.webkitURL
        keyValues.value.push({
          key: imageName,
          value: URL.createObjectURL(clone.blob)
        })
        loader.value[i] = false
        a.value.forEach((img) => {
          if (img.imgBlob == imageName) {
            img.url = URL.createObjectURL(clone.blob)
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}

const getImageFromBlobServer = async (filaname: string, index: number) => {
  const params = {
    fileUrl: filaname,
    ver: 'v1',
  }
  try {
    const GET_IMAGE_API_URL = `${process.env.VUE_APP_BASE_URL_DIGITAL}/${process.env.VUE_APP_API_AM_DMA}/api/attachment/download_by_url?${new URLSearchParams(params).toString()}`
    const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL)
    const blob = new Blob([response.data])
    let URL = window.URL || window.webkitURL
    keyValues.value.push({
      key: filaname,
      value: URL.createObjectURL(blob)
    })
    a.value.forEach((img) => {
      if (img.imgBlob == filaname) {
        img.url = URL.createObjectURL(blob)
      }
    })
    loader.value[index] = false
  } catch (error) {
    console.log('image', error)
  }
}

const handleClickRevise = (value: boolean) => {
  isReviseMode.value = value
}

const reset = () => {
  revisedKeyValues.value = cloneDeep(keyValues.value)
  revisedDataFullscreen.value = cloneDeep(a.value)
  const defaultInputValue = {
    value: "",
    isValid: true,
    errorMessage: ""
  }
  revisedSMU.value = cloneDeep(defaultInputValue)
  revisedHmOffset.value = cloneDeep(defaultInputValue)
  loader.value = Array.apply(null, Array(keyValues.value.length)).map(function () {
    return false
  })
  emit('resetPhoto')
}

const handleCancelRevise = () => {
  handleClickRevise(false)
  reset()
}

const handleRevise = () => {
  handleClickRevise(true)
  revisedKeyValues.value = cloneDeep(keyValues.value)
  revisedDataFullscreen.value = cloneDeep(a.value)
}

watch(
  imageObject,
  (newVal) => {
    if (!isUndefined(newVal) && newVal?.ImageInfos.length > 0) {
      const blob = URL.createObjectURL(newVal?.ImageBlobs[0])
      revisedKeyValues.value = [
        {
          key: (newVal?.ImageInfos[0] as ImageInfo).filename,
          value: blob
        }
      ]
      revisedDataFullscreen.value = [{
        imgBlob: (newVal?.ImageInfos[0] as ImageInfo).filename,
        url: blob,
        description: (newVal?.ImageInfos[0] as ImageInfo).description
      }]

      loader.value = Array.apply(null, Array(revisedDataFullscreen.value.length)).map(function () {
        return false
      })
    }
  },
  { deep: true },
);

const submitSuccessMessage = computed(() => {
  if (props.isFitter) {
    return "Changes Successfully Saved"
  }
  return "Machine SMU Approved"
})

const cancelApprove = () => {
  showConfirmation.value = false;
}
const submitApproval = async () => {
  showConfirmation.value = false;
  const loader = ElLoading.service({
    lock: true,
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  let newTitle = props.detailDefect.title
  if (isReviseMode.value) {
    const revisedData = cloneDeep(props.detailDefect)
    if (imageObject.value && imageObject.value.ImageInfos && imageObject.value.ImageInfos.length > 0) {
      revisedData.images = JSON.stringify(imageObject.value.ImageInfos)
    }

    // if new smu is empty then use old value (for planner)
    revisedData.machineSMU = props.plannerApprove && revisedSMU.value.value === "" ? revisedData.machineSMU : revisedSMU.value.value;

    if (revisedHmOffset.value.value !== "") {
      revisedData.hmOffset = revisedHmOffset.value.value
    }

    // adding data if before don't have minRange & maxRange
    if (isUndefined(revisedData.minRange)) {
      revisedData.minRange = minRange.value
    }
    if (isUndefined(revisedData.maxRange)) {
      revisedData.maxRange = maxRange.value
    }

    // calculate in range or not
    const val = revisedData.machineSMU
    const minRangeCheck = Number(val) + Number(revisedData.hmOffset) >= minRange.value;
    const maxRangeCheck = Number(val) + Number(revisedData.hmOffset) <= maxRange.value;

    let status = MachineSMUEnum.STATUS_NOT_IN_RANGE

    if (minRangeCheck && maxRangeCheck) {
      status = MachineSMUEnum.STATUS_IN_RANGE
    }

    newTitle = MachineSMUEnum.TITLE(status)
    revisedData.title = MachineSMUEnum.TITLE(status)
    await new Promise((resolve) => {
      emit('updateDefectDetailSMU', {
        newDetail: revisedData,
        callback: resolve
      });
    });
    handleError();
  }
  if (isErrorShows.value) {
    loader.close();
    return
  }
  if (!props.isFitter) {
    if (props.plannerApprove) {
      await new Promise((resolve) => {
        emit('updatePlannerDefectAcknowledge', {
          newTitle: newTitle,
          callback: resolve
        });
      });
    } else {
      await new Promise((resolve) => {
        emit('updateDefectAcknowledge', {
          newTitle: newTitle,
          callback: resolve
        });
      });
    }
  }
  loader.close();
  handleError();
  if (isErrorShows.value) {
    return
  }
  autoCloseSuccessMessageBox();
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
.custom-dialog {
  width: 100%;
  max-width: 480px;
  @media (max-width: 767px) {
    max-width: 90%;
  }
}

p {
  color: #212B36;
  margin-bottom: 0;
}

.title-dialog {
  font-size: 16px;
  font-weight: 700;
  display: flex;
  justify-content: flex-start;
}

.text-red {
  color: #FF4842;
}
</style>
