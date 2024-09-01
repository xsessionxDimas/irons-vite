<template>
    <div class="mt-5 px-0">
      <div class="row vcp mx-0 py-4 d-flex justify-content-between me-3 risk-assessment-title">
        <div class="col title ps-6">Take photo of completed Pre-Task Risk Assessment Form <span class="text-danger">(required)</span>.</div>
        <div class="col-2 col-md-1">
          <div class="row justify-content-center">
            <div class="px-0 col-6">
              <button class="btn btn-sm btn-icon btn-bg-light" :disabled="!isButtonEnabled" style="cursor:default">
                <img :src="cameraColor()" style="height: 12px; width: 14px;" alt="camera">
              </button>
            </div>
            <template v-if="imageValues && imageValues.length > 0">
              <div class="col-6 ps-0 pe-1">
                <button class="btn btn-sm btn-icon btn-bg-success" @click="handleShowModal" style="background-color: #18AF4A;">
                  <label class="text-white">+{{ imageValues.length }}</label>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <template v-if="modalVisibility">
    <ImagePreviewPrerisk
      :workOrder="formStore.stateGeneralForm.workOrder"
      :taskId="formStore.generalForm.riskAssesment[0].key"
      :employeeId="fitter?.id"
      ref="preview"
      :images="currentImage"
      :visibility="modalVisibility"
      :view-only="false"
      @on-delete="handlePostDeleteImageData"
      @on-close="handleHideModal" />
    </template>
    <Toast :visibility="isSuccessTakePhoto"
     caption="Pre-Task Risk Assessment Photo Sucessfully Taken"
    />
</template>

<script lang="ts" setup>
import {
  useOfflineCameraStore
} from "@/store/pinia/application/useOfflineCameraStore";
import {
  computed,
  defineProps,
  ref,
  watch,
  defineExpose,
  defineEmits
} from "vue";
import {
  useGeneralFormStore
} from "@/store/pinia/dma/e-form-offline/useGeneralFormStore";
import _, {
  orderBy
} from "lodash"
import { useEFormStore } from "@/store/pinia/dma/e-form-offline/useEFormStore";
import {
  AESTCurrentDateTime
} from '@/core/helpers/date-format'
import Toast from '@/components/dialog/Toast.vue'
import { useOnline } from "@vueuse/core";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo";
import {
  sortRiskAssesmentValue,
  stringToImageInfoConvert
} from "@/core/helpers/string-to-imageinfo-converter";
import {
  RiskAssesmentValue
} from "@/core/types/entities/dma/RiskAssesmentValue";
import ImagePreviewPrerisk from '@/components/camera/offline/ImagePreviewPrerisk.vue'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"

defineProps({
  ready: {
    required: true,
    type: Boolean
  }
});


const emits = defineEmits(['onFrontPageTaken'])

const camstore = useOfflineCameraStore();
const formStore = useGeneralFormStore()
const eformStore = useEFormStore()
const authStore = useAuthenticationStore();

const currentImage = ref<RiskAssesmentValue[]>([])
const callCount = ref(0)
const preview = ref()

const fitter = computed(() => {
  return eformStore.employee
})

watch(fitter, async (newVal) => {
  callCount.value = 0
  if (formStore.IsFitterLoggedInExist) {
    if (formStore.FitterInfo.employee.id == newVal.id) {
      uploadedImageArr.value = formStore.FitterInfo.riskPhotos
    } else {
      uploadedImageArr.value = []
    }
  } else {
    uploadedImageArr.value = []
  }
}, { deep: true })

/* refs */
const online = useOnline()
const componentKey = ref(0);
const modalVisibility = ref<boolean>(false)
const isSuccessTakePhoto = ref(false)

const handleShowModal = () => {
  modalVisibility.value = true
}

const isButtonEnabled = computed(() => {
  let mechanicStatus = false
  let photoTakenCountStatus = true
  const employee = eformStore.employee
  if (!_.isUndefined(employee.id) && employee.id) {
    mechanicStatus = true
  }
  if (uploadedImageArr.value.length > 1) photoTakenCountStatus = false

  // if general already submitted, the button will be disabled
  let isGeneralSubmittedAndOnitsShift = !formStore.generalUpdated

  return mechanicStatus && photoTakenCountStatus && isGeneralSubmittedAndOnitsShift
})

const isButtonDisabled = computed(() => {
  const employee = eformStore.employee
  const mechanicStatus = employee?.id != ''
  getPreriskPhoto()
  const photoTakenCountStatus = currentImage.value.length > 1
  return mechanicStatus && photoTakenCountStatus
})

const cameraColor = () => {
  // belum ada yang take pic
  let camera = "/media/svg/dma/camera/e-form/png/cam-active.png"
  // user yang take pic
  if (!isButtonDisabled.value) {
    if (currentImage.value.length > 0 || formStore.IsSelectedFitterAlreadyLoggedIn) {
      camera = "/media/svg/dma/camera/e-form/png/cam-user.png"
    }
  } else {
    camera = "/media/svg/dma/camera/e-form/png/cam-read.png"
  }
  return camera
}

/* computes */
const imageValues = computed(() => {
  let imgArr = [] as ImageInfo[]
  const mechanic = eformStore.employee
  if (!mechanic.id) return imgArr
  getPreriskPhoto()
  return currentImage.value
})

const getPreriskPhoto = () => {
  // call it only once per fitter
  if (callCount.value > 0) return
  let imgArr = [] as any[]
  if (!Array.isArray(formStore.generalForm.riskAssesment[0].value)) return imgArr
  const mechanic = eformStore.employee
  const sorted = sortRiskAssesmentValue(formStore.generalForm.riskAssesment[0].value as any[])
  imgArr = sorted.filter((imgInfo) => {
    // cast it as unknown as any
    const info = imgInfo as unknown as any
    if (info.updatedBy.id == mechanic.id) {
      return info
    }
  })
  imgArr = imgArr.filter((value, index, self) => {
    return index === self.findIndex((t) => {
      return t.image.filename === value.image.filename && t.imageType === value.imageType
    })
  })
  const oldVersion = imgArr.filter((x) => {
    return !x.imageType
  }).length > 0
  if (oldVersion) {
    imgArr = orderBy(imgArr, (r) => {
      return r.updatedDate
    })
  } else {
    imgArr = orderBy(imgArr, (r) => {
      return r.imageType
    }, ['desc'])
  }
  currentImage.value = imgArr.slice(0, 2)
  currentImage.value.forEach((x) => {
    if (typeof x.image == 'string') {
      x.image = {
        filename: x.image,
        description: x.image.includes('^') ? x.image.split('^')[1] : ''
      }
    }
  })
  callCount.value = 1
}

const imageObject = computed(() => {
  return _.cloneDeep(camstore.ImageObjects.find((i) => {
    return i.Id === "pre-risk";
  }));
});

const imageCount = computed(() => {
  return imageObject.value?.ImageInfos.length;
});

const preRiskKey = computed(() => {
  return eformStore.generalForm.riskAssesment[0].key
})


/* watchers */
watch(imageCount, () => {
  componentKey.value += 1;
});

const handleHideModal = () => {
  modalVisibility.value = false
}

const handlePostDeleteImageData = async (filename: string) => {
  let riskAssesValue = formStore.generalForm.riskAssesment[0].value as unknown as RiskAssesmentValue[]
  riskAssesValue = riskAssesValue.filter((x) => {
    if (typeof x.image == 'string') return x.image != filename
    return x.image.filename != filename
  })
  await eformStore.updateRiskAssesment(riskAssesValue)
  triggerCamera()
}

watch(imageObject, async (newVal, oldVal) => {
  callCount.value = 0
  if (!_.isUndefined(newVal) && newVal.ImageInfos.length > 0) {
    formStore.addPropertyParam(preRiskKey.value, "value", JSON.stringify(imageObject.value?.ImageInfos));
    if (newVal.ImageInfos.length != oldVal?.ImageInfos.length) {
      await handlePostData()
    }
  }
}, { deep: true })

// this var will be the temp storage of mechanic risk assesment photo
const uploadedImageArr = ref<string[]>([])

const handlePostData = async () => {
  formStore.toggleChangeIsRiskAssesmentPhotoTaken(true)
  // get time
  let currentTime
  if (!isOfflineOrSlowInternetConnection()) {
    currentTime = await formStore.getServerTimestamp()
  } else {
    currentTime = AESTCurrentDateTime()
  }
  // get emchanic
  const mechanic = eformStore.employee

  let imageInfo: ImageInfo = {} as ImageInfo
  if (imageObject.value) {
    imageInfo = stringToImageInfoConvert(imageObject.value.ImageInfos)[0]
  }

  const originalRiskAssesValue = formStore.generalForm.riskAssesment[0].value as any
  let riskAssesValue = [] as RiskAssesmentValue[]

  if (Array.isArray(originalRiskAssesValue)) {
    let sorted = sortRiskAssesmentValue(originalRiskAssesValue)
    /* get the keys */
    const keys = [
      ...new Set(sorted.map((risk) => {
        return risk.updatedBy.id
      }))
    ]
    keys.forEach((id) => {
      let innerSorted = sorted.filter((p) => {
        return p.updatedBy.id == id
      })
      let photos = innerSorted.filter((p) => {
        return p.imageType
      }).slice(0, 2)
      if (photos.length < 2) {
        // get two last picture
        photos = orderBy(innerSorted, (p) => {
          return p.updatedDate
        }).slice(0, 1)
        photos[0].imageType = photos[0].imageType == '' ? 'front' : photos[0].imageType
      }
      riskAssesValue = [
        ...riskAssesValue,
        ...photos
      ]
    })
  }
  let current = riskAssesValue.filter((r) => {
    return r.updatedBy.id == mechanic.id
  }).slice(0, 1)
  let type = 'front'
  if (current.length > 0) {
    type = current[0].imageType == 'front' ? 'back' : type
  }
  const newImage = {
    image: imageInfo,
    imageType: type,
    updatedDate: currentTime,
    updatedBy: mechanic
  } as RiskAssesmentValue
  riskAssesValue.push(newImage)
  current = riskAssesValue.filter((r) => {
    return r.updatedBy.id == mechanic.id
  })
  if (current.length < 2) {
    emits('onFrontPageTaken')
  } else {
    isSuccessTakePhoto.value = true
    setTimeout(() => {
      isSuccessTakePhoto.value = false
      preview.value?.openFirstReRender()
    }, 2000);
  }
  camstore.setCurrent('pre-risk')
  camstore.clearCurrent()
  await eformStore.updateRiskAssesment(riskAssesValue)
  formStore.setFitterInfoRiskPhotos(imageInfo)
  if (type == 'back') {
    formStore.setGeneralFitterInfoToIndexedDB(true)
  }
}

const triggerCamera = () => {
  camstore.toggleIsVisible(true, "pre-risk");
  camstore.addLocalImageInfo({
    taskKey: formStore.generalForm.riskAssesment[0].key,
    workOrder: formStore.generalForm.workOrder,
    type: 'pre-risk',
    updatedBy: eformStore.employee.id,
    email: authStore.user.Email,
  })
}

defineExpose({
  triggerCamera
});
</script>

<style scoped>
    .form-control,.form-select {
        color: #919EAB;
    }
    .vcp {
        background: white;
        border: 1px solid rgba(145, 158, 171, 0.24);
        border-radius: 12px;
    }
    .h-120px {
        height: 120px !important;
    }
    .title {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
    }
    .small-label {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 18px;
      color: #637381;
    }
</style>
