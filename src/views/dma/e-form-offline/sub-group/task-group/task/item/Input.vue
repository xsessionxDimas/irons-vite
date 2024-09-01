<template>
  <div :class="[widthStyle, potraitWidthStyle, paddingBottomCondition]" class="px-2 pt-2 input-eform-status" :style="style">
    <el-input
      ref="cbmInput"
      :class="[dropDownColor, inputSuffix != '' ? 'service-sheet-input' : '']"
      v-model="inputValue"
      size="small"
      :input-style="[fontSize]"
      :placeholder="placeholderLabel"
      :readonly="readOnly"
      @keypress="onlyNumber"
      @focusout="changeEventToValue"
      @change="onlyNumber"
      :inputmode="inputMode"
      :disabled="disabledCondition">
    <template v-if="inputSuffix != ''" #append>{{ inputSuffix }}</template>
   </el-input>
    <template v-if="validation != ''">
      <label class="text-danger ps-2 font-weight-bold">{{ validation }}</label>
    </template>
    <template v-if="loadingIndicator">
      <div class="d-flex align-items-center">
        <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        <span class="timestamp-task busy">Calculating...</span>
      </div>
    </template>
    <template v-if="loadingCommentIndicator">
      <div class="d-flex align-items-center">
        <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
          <span class="sr-only">Updating...</span>
        </div>
        <span class="timestamp-task busy">Updating...</span>
      </div>
    </template>
    <template v-if="loadingContainer">
      <div class="ms-1 d-flex align-items-center" style="opacity: 0;">
        <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
          <span class="sr-only">Updating...</span>
        </div>
        <span class="timestamp-task">Updating...</span>
      </div>
    </template>
  </div>

  <OilNotInRange :show="showOilNotInRange" @close="closeOilNotInRangeModal"/>
  <CBMDefectC :show="showCBMDefectC" @close="closeCBMDefectCModal"/>
  <CBMDefectX :show="showCBMDefectX" @close="closeCBMDefectXModal"/>
  <TakePhoto :show="showTakePicture" @close="handleTriggerCamera"/>
  <TakeReplacementPhoto
    :show="showReplacementPhotoDialog"
    :item="$props.item"
    :tool="replacementTool"
    :side="camStore.replacementPosition"
    @close="onCloseReplacementDialog"
  />
  <ErrorBox
    :visibility="isOutOfRangeValidationShow"
    :isCloseButtonShow="false"
    :caption="'Out Of Range'"
    @on-close="() => { isOutOfRangeValidationShow = false }" />
  <ErrorBox
    :visibility="isPistonBGreaterValidationShow"
    :isCloseButtonShow="false"
    :caption="'Piston B must be greater or equal to Piston A'"
    @on-close="() => { isPistonBGreaterValidationShow = false }" />
</template>

<script lang="ts" setup>
import {
  Item,
  CategoryItemTypeEnum,
  CustomValidationEnum,
  ValueItemTypeEnum
} from '@/core/types/entities/dma/e-form/Item';
import {
  computed,
  defineProps,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  toRef,
  watch
} from 'vue'
import {
  isUndefined,
  isArray,
  isEqual,
  last,
  round,
  clone
} from "lodash"
import { useEFormStore } from "@/store/pinia/dma/e-form-offline/useEFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpdateParam
} from "@/core/types/entities/dma/e-form/update-data/updateParam";
import {
  Task,
  TaskRatingEnum
} from '@/core/types/entities/dma/e-form/Task';
import OilNotInRange from './dialog/OilNotInRange.vue';
import CBMDefectC from './dialog/CBMDefectC.vue';
import CBMDefectX from './dialog/CBMDefectX.vue';
import {
  useOfflineCameraStore
} from '@/store/pinia/application/useOfflineCameraStore';
import TakePhoto from './dialog/TakePhoto.vue';
import {
  maximumFiveDigitWithTwoFraction,
} from "@/core/helpers/number-format"
import { AESTCurrentDateTime } from '@/core/helpers/date-format';
import { ElLoading } from 'element-plus';
import TakeReplacementPhoto from './dialog/TakeReplacementPhoto.vue'
import {
  useTaskReplacement
} from '@/core/helpers/ironforms/useTaskReplacement'
import {
  ILoadingInstance
} from 'element-plus/lib/el-loading/src/loading.type';
import ErrorBox from '@/components/alert/ErrorBox.vue';
import {
  bindingKeyGeneratorServiceSheet
} from '@/core/helpers/binding-key-generator'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import {
  useNAFormStore
} from '@/store/pinia/dma/e-form-offline/na/useNAFormStore';
import { setDefectIsActiveByTaskId } from "@/core/helpers/ironforms/offline/defect-form";

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object as PropType<Task>
  },
  generalStyle: {
    type: Boolean,
    default: true
  },
  itemLoading: {
    type: Boolean,
    default: false
  },
  isShowAdjustment: {
    type: Boolean
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  }
});

type result = {
  value: string,
  status: boolean
}

type HandlePistonInputComputeReturnValue = {
  inputValue: string
}

type HandleUpdatePistonResultValueArgument = {
  isReset: boolean
}

type handleResetPistonPayloadArgument = {
  isOutOfRange: boolean
}

const itemRef = toRef(props, 'item')
const taskPropsItem = toRef(props, 'task')
const store = useEFormStore();
const authStore = useAuthenticationStore();
const showOilNotInRange = ref(false)
const validation = ref('')
let timer
const loadingIndicator = ref(false)
const showOilNotMapped = ref(false)
const loadingCommentIndicator = ref(false)
const camStore = useOfflineCameraStore()
const loadingContainer = ref(false)
const isDisabledByKeyDropdownToolGroup = ref(false)
const showReplacementPhotoDialog = ref(false)
const replacementTool = ref('')
const taskReplacement = useTaskReplacement(store.stateSelectedGroup)
const loader = ref<ILoadingInstance>()
const isOutOfRangeValidationShow = ref(false)
const isPistonBGreaterValidationShow = ref(false)
const naStore = useNAFormStore();

const onCloseReplacementDialog = () => {
  if (itemRef.value.customValidation?.includes("cbmReplaceDefectTakePhoto")) {
    camStore.setShowCloseButton(false)
  }
  const task = taskReplacement.getCameraItem(props.task?.groupTaskId ?? "", store.stateSelectedSubGroups)
  let cameraItem
  if (task) {
    cameraItem = task.items.find((x) => {
      return x.itemType === 'smallCamera'
    })
  }
  if (cameraItem.value.length < 2) {
    camStore.toggleIsVisible(true, cameraItem.key as string)
  }
  replacementTool.value = ''
  switch (props.task?.SectionData) {
    case "HV Alternator":
      replacementTool.value = "alternator"
      break;
    case "Retarder Grid Box 1":
    case "Retarder Grid Box 2":
      replacementTool.value = "blower motor"
      break;
    default:
      break;
  }
  camStore.setReplacementTool(replacementTool.value)
  showReplacementPhotoDialog.value = false
  camStore.addLocalImageInfo({
    taskKey: props.task!.key,
    workOrder: store.generalForm.workOrder,
    type: 'task',
    updatedBy: store.employee.id,
    email: authStore.user.Email,
  })
}

const inputSuffix = computed(() => {
  let suffix = ''
  if (!isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.suffix)) {
    suffix = itemRef.value.style.suffix
  }
  return suffix
})

const placeholderLabel = computed(() => {
  let placeholderLabel = 'Please Input'
  if (itemRef.value.categoryItemType == 'targetRating') {
    placeholderLabel = ''
  } else if (itemRef.value.categoryItemType == 'resultParamRating') {
    placeholderLabel = ''
  }
  if (!isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.placeholder)) placeholderLabel = itemRef.value.style.placeholder
  return placeholderLabel
})

// cbm defect
const showCBMDefectC = ref(false)
const showCBMDefectX = ref(false)
const showTakePicture = ref(false)

const handleTriggerCamera = () => {
  props.task?.items.forEach((item) => {
    if (item.itemType === 'smallCamera') {
      if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmDefectTakePhoto")) camStore.setShowCloseButton(false)
      if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("normalTakePhoto")) camStore.setShowCloseButton(false)
      if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmTakePhoto")) camStore.setShowCloseButton(false)
      camStore.toggleIsVisible(true, item.key as string)
    }
  })
  showTakePicture.value = false
  camStore.addLocalImageInfo({
    taskKey: props.task!.key,
    workOrder: store.generalForm.workOrder,
    type: 'task',
    updatedBy: store.employee.id,
    email: authStore.user.Email,
  })
}

const widthStyle = computed(() => {
  if (props.generalStyle) {
    return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col"
  }
  return ''
})

const potraitWidthStyle = computed(() => {
  let customClass = ''
  if (props.generalStyle) {
    const hasStyle = !isUndefined(itemRef.value.style)
    if (hasStyle) {
      const hasPotraitBreakPoint = !isUndefined(itemRef.value.style.potraitBreakPoint)
      if (hasPotraitBreakPoint && itemRef.value.style.breakPoint != 'none') {
        customClass = `col-md-${itemRef.value.style.potraitBreakPoint}`

        customClass = `${customClass} col-lg-${itemRef.value.style.breakPoint}`
      } else {
        customClass = `col-md-${itemRef.value.style.potraitBreakPoint}`

        customClass = `${customClass} col-lg-${itemRef.value.style.breakPoint}`
      }
    }
  }
  return customClass
})

const taskAlreadyUpdatedDialog = computed(() => {
  return store.taskAlreadyUpdated
})

const isSubmited = computed(() => {
  return store.generalForm.status == 'Submited'
})

const taskAlreadyUpdatedByOtherFitter = ref(false)

watch(taskAlreadyUpdatedDialog, async (newVal, oldVal) => {
  if (newVal) taskAlreadyUpdatedByOtherFitter.value = true
})

const disabledCondition = computed(() => {
  if (!props.generalSubmitted) return true
  let cond = false
  const categoryItemType = itemRef.value.categoryItemType
  if (categoryItemType == 'targetRating' || categoryItemType == 'resultParamRating') cond = true
  // dynamic param rating
  let dynamicParamRatingUomNotSelected = false
  if (itemRef.value.categoryItemType == "paramRatingDynamic" || pistonMovementInput.value) {
    taskPropsItem.value!.items.forEach((item) => {
      if (item.itemType == "dropDown" && (item.categoryItemType == "dropdownTool" || item.categoryItemType == "dropdownToolDisc")) {
        if (item.value == "") {
          dynamicParamRatingUomNotSelected = true
        }
      }
    })
  }

  let scHeightInputNDropdownYes = false
  if (itemRef.value.categoryItemType == "suspensionParamRating") {
    if (store.stateStoredAdjustmentOptionValue == "Yes" || store.stateStoredAdjustmentOptionValue == "2") {
      scHeightInputNDropdownYes = true
    }
  }

  // piston B should enabled when piston A has value
  let isPistonBDisabled = false;

  if (itemRef.value.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_B) {
    isPistonBDisabled = true;
  }

  (taskPropsItem.value as Task).items.forEach((item) => {
    if (item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_A) {
      if (item.value) {
        isPistonBDisabled = false;
      }
    }
  })

  // piston result should be enabled when both piston already have value
  let isPistonResultDisabled = false;

  if (pistonMovementResult.value) {
    isPistonResultDisabled = true;
  }

  if (isPistonResultDisabled) {
    let pistonA
    let pistonB
    (taskPropsItem.value as Task).items.forEach((item) => {
      if (item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_A) {
        pistonA = item.value;
      } else if (item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_B) {
        pistonB = item.value;
      }
    })
    if (pistonA && pistonB) {
      isPistonResultDisabled = false
    }
  }

  // piston Rating should enabled when piston result has value
  let isPistonRatingDisabled = false;

  if (pistonMovementRating.value) {
    isPistonRatingDisabled = true;
  }

  (taskPropsItem.value as Task).items.forEach((item) => {
    if (item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_RESULT) {
      if (item.value) {
        isPistonRatingDisabled = false;
      }
    }
  })

  const isPrevTargetRating = itemRef.value.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING || itemRef.value.categoryItemType == CategoryItemTypeEnum.PREVIOUS_TARGET_RATING;

  const isNotCommentAndAdjustmentShwon = (!props.item.valueItemType || props.item.valueItemType != "comment") && props.isShowAdjustment

  let localIsShowAdj = props.isShowAdjustment
  if ((props.task as Task).rating == TaskRatingEnum.MANUAL_CLEANED) {
    if (props.item.valueItemType == ValueItemTypeEnum.COMMENT) {
      localIsShowAdj = false
    }
  }

  return cond || props.task!.isShowAdjustmentRow || props.task?.isShowReplacementRow || dynamicParamRatingUomNotSelected || disabledByOtherItem.value || scHeightInputNDropdownYes || isDisabledByKeyDropdownToolGroup.value || localIsShowAdj || isSubmited.value || isPistonBDisabled || isPistonResultDisabled || isPistonRatingDisabled || isPrevTargetRating || isNotCommentAndAdjustmentShwon
})

const disabledByOtherItem = ref(false)

const inputMode = computed(() => {
  let value = 'text'
  if (integerItemValueType.value || percentageValidation.value || cbmAuto.value || checkOilItemValidation.value) {
    value = "numeric"
  }
  return value
})

const fontSize = computed(() => {
  if (!props.item.categoryItemType) return ""
  const itemsCondition = itemRef.value.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING || itemRef.value.categoryItemType == CategoryItemTypeEnum.PREVIOUS_TARGET_RATING;
  if (itemsCondition) {
    return "font-size: 10px !important;"
  } else {
    return ""
  }
})


// --------------------- item client validation -----------------------------
const integerItemValueType = computed(() => {
  return itemRef.value.valueType == 'int'
})
const percentageValidation = computed(() => {
  return itemRef.value.customValidation?.toLowerCase().includes('percentage')
})
const cbmAuto = computed(() => {
  return itemRef.value.categoryItemType == 'paramRating' || itemRef.value.categoryItemType == 'paramRatingDynamic' || pistonMovementInput.value
})
const checkOilItemValidation = computed(() => {
  return !isUndefined(itemRef.value.mappingKeyId) && !isArray(itemRef.value.mappingKeyId) && itemRef.value.categoryItemType != "adjustmentSuspensionRating"
})
// --------------------- item client validation -----------------------------

const inputType = computed(() => {
  let type = ''
  if (integerItemValueType.value || percentageValidation.value || cbmAuto.value || checkOilItemValidation.value) {
    type = "number"
  }
  return type
})

const inputValue = computed({
  get: (): string => {
    let formatted = itemRef.value.value as string
    // if (integerItemValueType || percentageValidation || cbmAuto || checkOilItemValidation) {
    //   formatted = formatNumberWithComma(itemRef.value.value)
    //   return formatted
    // }
    if (itemRef.value.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_RATING && itemRef.value.value != "") {
      formatted = `${(Number(itemRef.value.value as string) * 100)}%`
    }
    return formatted
  },
  set: async (val: string) => {
    if (integerItemValueType.value || cbmAuto.value || checkOilItemValidation.value) {
      // line ini akan check hasil speech to text, karena perubhana speech to text terbaca disini
      if (isNaN(Number(val))) {
        return
      } else {
        if (val.length > 8) {
          return
        } else {
          if ((`${val}`.split(".") || []).length - 1 > 1) {
            return
          } else {
            if (val.includes(".")) {
              const afterComma = `${val}`.split(".")[1]
              if (afterComma.length > 2) {
                return
              } else {
                itemRef.value.value = val
              }
            }
            if (val.length > 5) {
              if (val.length >= 6 && val.length <= 6) {
                if (val[5] != ".") {
                  return
                } else {
                  itemRef.value.value = val
                }
              }
            } else {
              itemRef.value.value
            }
          }
        }
      }
    }
    itemRef.value.value = val
    // if (integerItemValueType || percentageValidation || cbmAuto || checkOilItemValidation) {
    //   itemRef.value.value = reformatNumberWithComma(val)
    // } else {
    //   itemRef.value.value = val
    // }
  },
});

const changeEventToValue = (event) => {
  if (store.generalForm.status == "Submited") {
    store.toggleFormAlreadySubmitted(true)
    return
  }
  taskAlreadyUpdatedByOtherFitter.value = false
  if (readOnly.value) return
  // const val = reformatNumberWithComma(event.target.value)
  const val = event.target.value
  const isNumberPassed = numberValidation(val)
  if (isNumberPassed) {
    let formattedVal = val
    if (integerItemValueType.value || percentageValidation.value || cbmAuto.value || checkOilItemValidation.value) {
      formattedVal = parseFloat(val)
    }
    if (isNaN(formattedVal)) {
      formattedVal = event.target.value
    }
    handleInputChange(String(formattedVal))
  } else {
    itemRef.value.value = oldValue.value
  }
}

const numberValidation = (val) => {
  validation.value = ""
  let passed = true
  if (integerItemValueType.value || percentageValidation.value || cbmAuto.value || checkOilItemValidation.value) {
    if (isNaN(val)) {
      passed = false
      validation.value = "value must be a number"
    }
  }
  return passed
}

// const checkCBMNumber = () => {
//   if (props.task!.category == 'CBM' && itemRef.value.categoryItemType == 'paramRating' || itemRef.value.categoryItemType == 'resultParamRating') {
//     console.log(itemRef.value.value, 'isnan', isNaN(itemRef.value.value), 'below zero', Number(itemRef.value.value) < 0);
//     if (isNaN(itemRef.value.value) || Number(itemRef.value.value) < 0) {
//       validation.value = 'value must be a number and cannot be below 0'
//       itemRef.value.value = oldValue.value
//       return false
//     } else {
//       return true
//     }
//   }
//   return true
// }

const checkCBMDecimal = () => {
  if ((props.task as Task).category == 'CBM' && itemRef.value.categoryItemType == 'paramRating' || itemRef.value.categoryItemType == 'resultParamRating' || itemRef.value.categoryItemType == 'paramRatingDynamic' || pistonMovementInput.value) {
    if (!isUndefined(itemRef.value.disabledByItemKey && itemRef.value.value == "")) return true
    if (isUndefined(itemRef.value.customValidation) || !itemRef.value.customValidation?.toLowerCase().includes('required')) return true
    const validFormat = maximumFiveDigitWithTwoFraction(itemRef.value.value as string);
    if (!validFormat) {
      validation.value = "max. 2 decimal digits"
      return false
    }
  }
  return true
}

const handleInputChange = async (val, needCheckOldVal = true) => {
  if (itemRef.value.categoryItemType == 'resultParamRating') {
    needCheckOldVal = false
  }
  if (needCheckOldVal) {
    if (val !== oldValue.value) {
      await handleValueChange(val)
    } else {
      validation.value = ''
    }
  } else {
    await handleValueChange(val)
  }
}

const pistonMovementInput = computed(() => {
  return itemRef.value.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_A || itemRef.value.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_B;
})

const pistonMovementResult = computed(() => {
  return itemRef.value.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_RESULT;
})

const pistonMovementRating = computed(() => {
  return itemRef.value.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_RATING;
})

const handleValueChange = async (val, triggerOutOfRange = true) => {
  clearTimeout(timer)
  let loading;
  // console.log("itemRef sebelum diupdate dengan val", itemRef.value.value, "val", val);
  itemRef.value.value = val
  let clientValidationPassed = checkPercentageInput()
  if (clientValidationPassed) clientValidationPassed = checkCBMDecimal()
  // clientValidationPassed = checkCBMNumber()
  if (clientValidationPassed) {
    validation.value = ''
    timer = setTimeout(async () => {
      if ((props.task as Task).category == 'CBM' && (itemRef.value.categoryItemType == 'paramRating' || itemRef.value.categoryItemType == 'resultParamRating' || itemRef.value.categoryItemType == 'paramRatingDynamic' || pistonMovementInput.value)) {
        loadingIndicator.value = true
      } else if (!isUndefined(itemRef.value.mappingKeyId) && isArray(itemRef.value.mappingKeyId)) {
        loadingCommentIndicator.value = true
      } else {
        loadingCommentIndicator.value = true
      }

      if (props.task?.rating?.includes('AUTOMATIC_REPLACEMENT')) {
        loader.value = ElLoading.service({
          lock: true,
          text: 'Updating...',
          background: 'rgba(0, 0, 0, 0.7)',
        })
      }

      if (!isUndefined(itemRef.value.customValidation)) {
        const allRating = itemRef.value.customValidation!.includes("cbmTakePhotoAllRating")
        const cbmRating = itemRef.value.customValidation!.includes("cbmDefectTakePhoto")
        if (allRating || cbmRating) {
          if (itemRef.value.categoryItemType == 'paramRating' || itemRef.value.categoryItemType == 'paramRatingDynamic') {
            const smallCameraValue = props.task?.items.find((item) => {
              return item.itemType == 'smallCamera'
            })
            if (smallCameraValue && smallCameraValue.value.length == 0) {
              loading = ElLoading.service({
                lock: true,
                text: '',
                background: 'rgba(0, 0, 0, 0.7)',
              })
            }
          }
        }
      }

      const isValidationPassed = handleInputValidation(val)
      if (isValidationPassed) {
        const taskValue = {
          keyValue: (taskPropsItem.value as Task).key,
          propertyParams: [
            {
              propertyName: 'taskValue',
              propertyValue: val
            },
            {
              propertyName: 'updatedBy',
              propertyValue: val != "" ? JSON.stringify(store.employee) : ""
            },
            {
              propertyName: 'updatedDate',
              propertyValue: val != "" ? AESTCurrentDateTime() : ""
            },
          ]
        }
        if (checkOilItemValidation.value) {
          if (val !== "") {
            await handleCheckOil(val)
          } else {
            await handlePostAnswer(taskValue, val)
          }
        } else {
          let continuePostData = true
          if ((props.task as Task).category == 'CBM' && itemRef.value.categoryItemType == 'paramRating' || itemRef.value.categoryItemType == 'resultParamRating' || itemRef.value.categoryItemType == 'paramRatingDynamic') {
            await handleCBM().then((handleCBMVal) => {
              continuePostData = handleCBMVal
              if (!handleCBMVal.value && !store.ratingNotMapped) {
                if (triggerOutOfRange) {
                  // jika avg, sekali saja waktu ngereset
                  const isAvgItem = itemRef.value.categoryItemType == 'resultParamRating'
                  let tempVal = clone(val)
                  if (!isAvgItem || !val) {
                    isOutOfRangeValidationShow.value = true;
                  }
                  setTimeout(() => {
                    if (!isAvgItem || !tempVal) {
                      isOutOfRangeValidationShow.value = false
                    }
                  }, 2000)
                  val = ""
                  itemRef.value.value = ""
                }
              }
            }).catch(() => {
              val = ""
              itemRef.value.value = ""
            })
            .finally(() => {
              if (loading) {
                loading.close()
              }
              loadingIndicator.value = false
              if (loader.value) {
                loader.value.close()
                loader.value = undefined
              }
            })
          } else if (pistonMovementInput.value) {
            const pistonData = handlePistonInputComputation();
            if (!pistonData.inputValue) {
              val = pistonData.inputValue;
            }
          }
          // suspension cylinder
          if (itemRef.value.categoryItemType == "suspensionParamRating") {
            await store.updateSuspensionCylinderTask(props.task!, itemRef.value)
            continuePostData = false
            oldValue.value = val
          }
          if (itemRef.value.categoryItemType == "adjustmentSuspensionRating") {
            await store.updateAdjustmentSuspensionCylinderTask(props.task!, itemRef.value)
            continuePostData = true
          }
          if (continuePostData) {
            if (itemRef.value.category == 'cbmCalculateAvg') {
              store.toggleCalculatingBrakeAvg(true)
            }
            await handlePostAnswer(taskValue, val)
            oldValue.value = val
            if (itemRef.value.category == 'cbmCalculateAvg') {
              store.setAvgTargetKey(itemRef.value.targetCalculateKeyId)
              handleCalculateAvg(val)
            }
          }
        }
      }
      loadingIndicator.value = false
      loadingCommentIndicator.value = false
      itemRef.value.isCalculatingTrue = false
      // to make input with timestamp have additional space
      // if (!isUndefined(itemRef.value.isTaskValue) && itemRef.value.isTaskValue) {
      //   loadingContainer.value = true
      // }
      if (updatedByTask.value == "" || (isUndefined(updatedByTask.value!.id) || updatedByTask.value!.id == "")) {
        loadingContainer.value = true
      }
      // if (itemRef.value.category == 'cbmCalculateAvg') {
      //   handleCalculateAvg(val)
      // }
    }, 0)
  }
}

let pistonResult = 0;
let isBothPistonHaveValue = false;

const handlePistonInputComputation = (): HandlePistonInputComputeReturnValue => {
  pistonResult = 0;
  isBothPistonHaveValue = false;

  let pistonA = 0;
  let pistonB = 0;
  let val = "";
  const isInputPistonB = itemRef.value.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_B;

  const pistonBItem = (props.task as Task).items.find((item) => {
    return item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_B
  })

  if (isInputPistonB) {
    pistonB = Number(itemRef.value.value as string)
    val = `${pistonB}`;
    const pistonAItem = (props.task as Task).items.find((item) => {
      return item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_A
    })
    if (pistonAItem) {
      pistonA = Number(pistonAItem.value as string)
    }
  } else {
    pistonA = Number(itemRef.value.value as string)
    val = `${pistonA}`;
    if (pistonBItem) {
      pistonB = Number(pistonBItem.value as string)
    }
  }
  // get data of piston movement A
  console.log("pistonA", pistonA, "pistonB", pistonB);

  // check piston B jika input "" maka tidak perlu reset value
  // jika piston B ada value == 0 maka harus reset
  if ((pistonBItem && pistonBItem.value != "")) {
    isBothPistonHaveValue = true;
    // reset both value if A is greater
    const isPistonAGreaterThanB = pistonA > pistonB;

    if (isPistonAGreaterThanB) {
      val = "";
      isPistonBGreaterValidationShow.value = true;
      setTimeout(() => {
        isPistonBGreaterValidationShow.value = false;
      }, 2000);
    } else {
      pistonResult = pistonB - pistonA;
      if (!Number.isInteger(pistonResult)) pistonResult = Number(pistonResult.toFixed(2));
    }
  }

  return {
    inputValue: val
  }
}

const updatedByTask = computed(() => {
  return props.task?.updatedBy
})

watch(updatedByTask, (newVal) => {
  if (newVal != "" || (!isUndefined(newVal.id) && newVal.id != "")) {
    loadingContainer.value = false
  }
}, {
  deep: true
})

const checkPercentageInput = () => {
  if (itemRef.value.customValidation?.toLowerCase().includes('percentage')) {
    const x = parseFloat(itemRef.value.value as string);
    if (isNaN(x) || x < 0 || x > 100) {
      validation.value = 'must be between 0 - 100'
      // itemRef.value.value = oldValue.value
      return false
    }
    if (validation.value == 'must be between 0 - 100') validation.value = ''
    return true
  }
  if (validation.value == 'must be between 0 - 100') validation.value = ''
  return true
}

const handleCalculateAvg = async (val) => {
  const arrKey = itemRef.value.mappingKeyId
  const avgArr = [] as number[]
  let allFieldHaveValue = true

  let targetItem
  const item = store.stateSelectedSubGroups.find((subGroup) => {
    return subGroup.taskGroup.some((taskGroup) => {
      return taskGroup.task.some((task: Task) => {
        return task.items.some((item) => {
          if (item.key == itemRef.value.targetCalculateKeyId) {
            targetItem = item
          }
          return item.key == itemRef.value.targetCalculateKeyId
        })
      })
    });
  });

  if (isArray(arrKey)) {
    for (let index = 0; index < arrKey.length; index++) {
      let num
      num = await store.getFieldValueByKey(arrKey[index], 'value')
      // if (!isOfflineOrSlowInternetConnection()) {
      //   num = await store.getValueFromItemKey(arrKey[index])
      // } else {
      // }
      avgArr.push(Number(num))
      if (num === "") allFieldHaveValue = false
    }

    let avg = 0
    if (allFieldHaveValue) {
      avgArr.forEach((number) => {
        avg = avg + number
      })
      avg = round(avg / avgArr.length, 2)

      if (avg != targetItem.value) {
        targetItem.isCalculatingTrue = true
      }
    }

    const item = store.stateSelectedSubGroups.find((subGroup) => {
      return subGroup.taskGroup.some((taskGroup) => {
        return taskGroup.task.some((task: Task) => {
          return task.items.some((item) => {
            if (item.key == itemRef.value.targetCalculateKeyId) {
              targetItem = item
            }
            return item.key == itemRef.value.targetCalculateKeyId
          })
        })
      });
    });

    if (allFieldHaveValue) {
      targetItem.value = avg
    } else {
      if (targetItem.value) {
        targetItem.value = ""
      }
    }
  }
}

const handlePostAnswer = async (taskValue, val) => {
  let payload: UpdateParam[] = [
    {
      keyValue: itemRef.value.key,
      propertyParams: [
        {
          propertyName: 'value',
          propertyValue: val
        },
        {
          propertyName: 'updatedBy',
          propertyValue: val == "" ? "" : JSON.stringify(store.employee)
        },
        {
          propertyName: 'updatedDate',
          propertyValue: val == "" ? "" : AESTCurrentDateTime()
        },
      ]
    },
  ]
  let isTaskValue = false
  if (!isUndefined(itemRef.value.isTaskValue) && itemRef.value.isTaskValue) {
    payload.push(taskValue)
    isTaskValue = true
  }
  if (itemRef.value.categoryItemType == "adjustmentSuspensionRating") {
    const adjustmenttaskValue = {
      keyValue: taskPropsItem.value!.key,
      propertyParams: [
        {
          propertyName: 'updatedBy',
          propertyValue: val == "" ? "" : JSON.stringify(store.employee)
        },
        {
          propertyName: 'updatedDate',
          propertyValue: val == "" ? "" : AESTCurrentDateTime()
        },
      ]
    }
    payload.push(adjustmenttaskValue)
  }
  // variable ini untuk cek apakah perlu cek target rating dari percentage worn
  // jika reset maka value ini akan false, karena target rating otomatis akan ""
  let isPistonNeedChecTargetkRating = false;
  if (pistonMovementInput.value) {
    isPistonOutOfRange.value = false
    if (val == "") {
      const otherPistonData = handleResetOtherPistonValue();
      payload.push(otherPistonData);
      const pistonResultData = await handleUpdatePistonResultValue({
        isReset: !isPistonNeedChecTargetkRating
      });
      payload = [
        ...payload,
        ...pistonResultData
      ];
    } else if (isBothPistonHaveValue) {
      isPistonNeedChecTargetkRating = true
      const pistonResultData = await handleUpdatePistonResultValue({
        isReset: !isPistonNeedChecTargetkRating
      });
      if(isPistonOutOfRange.value) {
        val = ""
        isPistonNeedChecTargetkRating = false
        setDefectIsActiveByTaskId(store.stateGeneralForm.workOrder, (props.task as Task).key, "false")
      }
      payload = [
        ...payload,
        ...pistonResultData
      ];
    }
  }
  if (!isOfflineOrSlowInternetConnection()) {
    // else = as is post data logic
    // if condition matched, will get target rating of piston by percentage worn
    if (isPistonNeedChecTargetkRating) {
      loader.value = ElLoading.service({
        lock: true,
        text: 'Updating...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      try {
        await store.postFinalDataPistonMovementInput({
          task: props.task as Task,
          updateParams: payload
        })
      } finally {
        loader.value.close()
        loader.value = undefined

        if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation.includes(CustomValidationEnum.CBM_TAKE_PHOTO_ALL_RATING)) {
          store.setInputCameraMandatoryKey(itemRef.value.key)
          if (!taskAlreadyUpdatedByOtherFitter.value) {
            if (imageLength.value.length == 0) {
              showTakePicture.value = true
            }
          }
          taskAlreadyUpdatedByOtherFitter.value = false
        }
      }
    } else {
      await store.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name, true, props.task!.key);
    }
  } else {
    // else = as is post data logic
    // if condition matched, will get target rating of piston by percentage worn
    if (isPistonNeedChecTargetkRating) {
      await store.postFinalDataPistonMovementInput({
        task: props.task as Task,
        updateParams: payload
      })

      if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation.includes(CustomValidationEnum.CBM_TAKE_PHOTO_ALL_RATING)) {
        store.setInputCameraMandatoryKey(itemRef.value.key)
        if (!taskAlreadyUpdatedByOtherFitter.value) {
          if (imageLength.value.length == 0) {
            showTakePicture.value = true
          }
        }
        taskAlreadyUpdatedByOtherFitter.value = false
      }
    } else {
      // need to call function that generate binding key by task
      const bindingKey = bindingKeyGeneratorServiceSheet(props.task as Task)
      await store.updateServiceSheetTaskOnLocalDB(payload, props.task!.key, props.item.key, true, bindingKey)
    }
  }
}

const isPistonOutOfRange = ref(false)

const handleResetOtherPistonValue = ():UpdateParam => {
  // cari other piston key untuk update value jadi ""
  const isInputPistonB = itemRef.value.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_B;
  const otherPistonCategoryType = isInputPistonB ? CategoryItemTypeEnum.PISTON_INPUT_A : CategoryItemTypeEnum.PISTON_INPUT_B;
  const otherPistonItem = (props.task as Task).items.find((item) => {
    return item.categoryItemType == otherPistonCategoryType;
  })
  let otherPistonItemKey = ""
  if (otherPistonItem) {
    otherPistonItemKey = otherPistonItem.key
  }
  const otherPistonPayload: UpdateParam = {
    keyValue: otherPistonItemKey,
    propertyParams: [
      {
        propertyName: 'value',
        propertyValue: ""
      },
      {
        propertyName: 'updatedBy',
        propertyValue: ""
      },
      {
        propertyName: 'updatedDate',
        propertyValue: ""
      },
    ]
  }
  return otherPistonPayload;
}

const handleUpdatePistonResultValue = async (argument: HandleUpdatePistonResultValueArgument):Promise<UpdateParam[]> => {
  const pistonResultItem = (props.task as Task).items.find((item) => {
    return item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_RESULT;
  })
  let pistonResultItemKey = ""
  if (pistonResultItem) {
    pistonResultItemKey = pistonResultItem.key
    pistonResultItem.value = (!argument.isReset ? pistonResult : "") as string
  }

  let pistonTasksPayloadArr = [] as UpdateParam[]
  const pistonResultPayload: UpdateParam = {
    keyValue: pistonResultItemKey,
    propertyParams: [
      {
        propertyName: 'value',
        propertyValue: !argument.isReset ? pistonResult : ""
      },
      {
        propertyName: 'updatedBy',
        propertyValue: !argument.isReset ? JSON.stringify(store.employee) : ""
      },
      {
        propertyName: 'updatedDate',
        propertyValue: !argument.isReset ? AESTCurrentDateTime() : ""
      },
    ]
  }
  pistonTasksPayloadArr.push(pistonResultPayload);

  // jika reset value, maka measurement n rating di reset
  // jika tidak reset harus cari rating dan measurement piston
  if (argument.isReset) {
    const resetParam = handleResetPistonPayload({
      isOutOfRange: false
    })
    pistonTasksPayloadArr = [
      ...pistonTasksPayloadArr,
      ...resetParam
    ]
  } else {
    const ratingItem = (props.task as Task).items.find((item) => {
      return item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_RATING;
    })

    // mencari percentage worn
    let pistonRatingValue
    if (pistonResultItem) {
      pistonRatingValue = store.getPistonMovementRatingPercentage({
        task: (props.task as Task),
        item: pistonResultItem
      })
    }

    // check jika pistonRating ""
    if (!pistonRatingValue) {
      isOutOfRangeValidationShow.value = true;
      const resetParam = handleResetPistonPayload({
        isOutOfRange: true
      })
      pistonTasksPayloadArr = [
        ...pistonTasksPayloadArr,
        ...resetParam
      ]
      isPistonOutOfRange.value = true
      setTimeout(() => {
        isOutOfRangeValidationShow.value = false
      }, 2000)
      // reset
    } else {
      // percentage worn requestnya dibuat decimal agar bisa diitung di IP
      pistonRatingValue = pistonRatingValue / 100
  
      // update percentage worn ke task item dan tambah payload untuk dikirim ke BE
      if (ratingItem) {
        ratingItem.value = pistonRatingValue;
        pistonTasksPayloadArr.push({
          keyValue: ratingItem.key,
          propertyParams: [
            {
              propertyName: 'value',
              propertyValue: pistonRatingValue
            },
            {
              propertyName: 'updatedBy',
              propertyValue: ""
            },
            {
              propertyName: 'updatedDate',
              propertyValue: ""
            },
          ]
        })
      }
    }
  }

  return pistonTasksPayloadArr;
}

const handleResetPistonPayload = (argument: handleResetPistonPayloadArgument): UpdateParam[] => {
  const pistonTasksPayloadArr = [] as UpdateParam[]
  (props.task as Task).items.forEach((item) => {
    // current value
    const isPistonRating = item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_RATING;
    const isTargetRating = item.categoryItemType == CategoryItemTypeEnum.TARGET_RATING
    // last value
    const isPrevPistonAItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_A
    const isPrevPistonBItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_B
    const isPrevPistonResultItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RESULT
    const isPrevUomItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_UOM
    const isPrevPistonRatingItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING
    const isPrevPistonPercentageItem = item.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_PERCENTAGE

    const isPreviousItem = isPrevPistonAItem || isPrevPistonBItem || isPrevPistonResultItem || isPrevUomItem || isPrevPistonRatingItem || isPrevPistonPercentageItem
    // all piston reset
    const isPistonA = item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_B;
    const isPistonB = item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_A;
    const isPistonResult = item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_RESULT;

    // out of range additional condition
    const isOutOfRangeCondtion = isPistonA || isPistonB || isPistonResult

    // all item condition
    const itemsCondition = isPistonRating || isTargetRating || isPreviousItem

    // final condition
    let finalCondition
    if (argument.isOutOfRange) {
      finalCondition = itemsCondition || isOutOfRangeCondtion
    } else {
      finalCondition = itemsCondition
    }

    if (finalCondition) {
      pistonTasksPayloadArr.push({
        keyValue: item.key,
        propertyParams: [
          {
            propertyName: 'value',
            propertyValue: isPreviousItem ? "-" : ""
          },
          {
            propertyName: 'updatedBy',
            propertyValue: ""
          },
          {
            propertyName: 'updatedDate',
            propertyValue: ""
          },
        ]
      })
    }
  })
  pistonTasksPayloadArr.push({
    keyValue: (props.task as Task).key,
    propertyParams: [
      {
        propertyName: 'taskValue',
        propertyValue: ""
      },
      {
        propertyName: 'updatedBy',
        propertyValue: ""
      },
      {
        propertyName: 'updatedDate',
        propertyValue: ""
      },
    ]
  })
  return pistonTasksPayloadArr
}

const imageLength = computed(() => {
  let image: string[] = []
  props.task?.items.forEach((item) => {
    if (item.itemType === 'smallCamera') {
      image = item.value as string[]
    }
  })
  return image
})

const resetCBMValue = () => {
  const isCBM = props.task?.category == "CBM"
  if (!isCBM) return
  const isHaveValidation = itemRef.value.customValidation
  if (!isHaveValidation) return
  let cbmRating
  const allRating = itemRef.value.customValidation!.includes("cbmTakePhotoAllRating")
  cbmRating = itemRef.value.customValidation!.includes("cbmDefectTakePhoto")
  if (cbmRating) {
    if (props.task?.taskValue != "C" && props.task?.taskValue != "X") {
      cbmRating = false
    }
  }
  if (allRating || cbmRating) {
    const cameraItem = props.task?.items.find((item) => {
      return item.itemType == 'smallCamera'
    })
    if ((cameraItem?.value as any[]).length > 0) return
    if (!itemRef.value.value) return
    // check jika input piston A, jangan langsung direset
    // karena ada kemungkinan user hanya input A saja
    // jika input A & B maka akan trigger rating & otomatis tak photo
    if (itemRef.value.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_A) {
      let isPistonBEmpty = false
      for (const item of props.task.items) {
        if (item.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_B) {
          if (item.value == "") {
            isPistonBEmpty = true
            break
          }
        }
      }
      if (isPistonBEmpty) return
    }
    handleValueChange("", false)
  }
}

const handleCBM = async () => {
  let nextPost = {} as any;
  const task = props.task as Task;
  // need to set uom and measurement value
  const index = task.items.findIndex((i) => {
    return i.key == itemRef.value.key;
  }) + 1;
  const uomItem = task.items[index];
  let cameraItem = task.items.find((x) => {
    return x.itemType === 'smallCamera'
  });
  if (props.task?.rating === "AUTOMATIC_REPLACEMENT" || props.task?.rating === "AUTOMATIC_REPLACEMENT_GAP") {
    const task = taskReplacement.getCameraItem(props.task?.groupTaskId ?? "", store.stateSelectedSubGroups)
    if (task) {
      cameraItem = task.items.find((x) => {
        return x.itemType === 'smallCamera'
      })
    }
  }
  if (uomItem && cameraItem) {
    store.setMeasurementValueAndUOM(itemRef.value.value as string, uomItem.value as string, cameraItem.key);
  }
  if (itemRef.value.categoryItemType != "resultParamRating") {
    loader.value = ElLoading.service({
      lock: true,
      text: 'Updating...',
      background: 'rgba(0, 0, 0, 0.7)',
    })
  }
  let result: Promise<result> | undefined;
  if (props.task?.rating === "AUTOMATIC_REPLACEMENT_GAP") {
    result = store.getCBMResultGap(task, itemRef.value)
  } else {
    result = store.getCBMResult(task, itemRef.value)
  }
  await result?.then((isSuccess) => {
    nextPost = isSuccess
    if (isSuccess.status) {
      if (isSuccess.value) {
        if (
          !isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmTakePhoto")) {
          store.setInputCameraMandatoryKey(itemRef.value.key)
          if (!taskAlreadyUpdatedByOtherFitter.value) {
            if (imageLength.value.length == 0) {
              showTakePicture.value = true
            }
          }
          taskAlreadyUpdatedByOtherFitter.value = false
        }
      }
      if (isSuccess.value == 'A' || isSuccess.value == 'B') {
        if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmTakePhotoAllRating")) {
          store.setInputCameraMandatoryKey(itemRef.value.key)
          if (!taskAlreadyUpdatedByOtherFitter.value) {
            if (imageLength.value.length == 0) {
              showTakePicture.value = true
            }
          }
          taskAlreadyUpdatedByOtherFitter.value = false
        }
      }
      if (isSuccess.value == 'C' || isSuccess.value == 'X') {
        if (
          (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmDefectTakePhoto")) ||
          (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmTakePhotoAllRating"))
        ) {
          store.setInputCameraMandatoryKey(itemRef.value.key)
          if (!taskAlreadyUpdatedByOtherFitter.value) {
            if (imageLength.value.length == 0) {
              showTakePicture.value = true
            }
          }
          taskAlreadyUpdatedByOtherFitter.value = false
        } else if (
          !isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation?.includes("cbmReplaceDefectTakePhoto")
        ) {
          store.setInputCameraMandatoryKey(itemRef.value.key)
          camStore.setIsReplacementCamera(false)
          taskAlreadyUpdatedByOtherFitter.value = false
        }
      }
      if (isSuccess.value !== "") {
        const isReplacement = (props.task?.rating ?? '').includes('AUTOMATIC_REPLACEMENT')
        if (isReplacement) {
          const allTasks = store.getAllReplacementTasks()
          const tasks = store.getReplacementPerGroupTask(allTasks, props.task?.groupTaskId ?? '') as Task[]
          const otherTasks = tasks.filter((t) => {
            return t.key !== props.task?.key && t.rating != 'CAB_SIDE'
          })
          const check = store.checkIfAnyRatingValueSet(otherTasks)
          if (!check) {
            store.updatePreviousReplacementValue(tasks)
          }
          const isNeedToUpdate = store.isAllTaskAlreadyHaveRating(otherTasks)
          const cabSide = taskReplacement.getCameraItem(props.task?.groupTaskId ?? "", store.stateSelectedSubGroups) as Task
          const cameraItem = cabSide.items.find((x) => {
            return x.itemType == 'smallCamera'
          }) as Item
          if (isNeedToUpdate && cameraItem.value.length < 2) {
            // photo need to update here
            camStore.setShowCloseButton(false)
            camStore.setIsReplacementCamera(true)
            let currentPosition = 'cab side'
            camStore.setReplacementPosition(currentPosition)
            camStore.setReplacementPhotoLength(imageLength.value.length)
            replacementTool.value = ''
            switch (props.task?.SectionData) {
              case "HV Alternator":
                replacementTool.value = "alternator"
                break;
              case "Retarder Grid Box 1":
              case "Retarder Grid Box 2":
                replacementTool.value = "blower motor"
                break;
              default:
                break;
            }
            camStore.setReplacementTool(replacementTool.value)
            showReplacementPhotoDialog.value = true
          }
        }
      }
    }
  }).catch((e) => {
    if (e?.message == "Out of range") {
      isOutOfRangeValidationShow.value = true;
      setTimeout(() => {
        isOutOfRangeValidationShow.value = false
      }, 2000)
      throw new Error("Out of range")
    }
  })
  .finally(() => {
    if (loader.value) {
      loader.value.close()
      loader.value = undefined
    }
  })
  if (loader.value) {
    loader.value.close()
    loader.value = undefined
  }
  return nextPost
}

const isCameraError = computed(() => {
  return camStore.stateIsCameraError
})

watch(isCameraError, async (newValue) => {
  if (newValue) {
    if (store.stateInputCameraMandatoryKey == itemRef.value.key) {
      // console.log("watch error camera");
      // await updateData("", false)
      await handleInputChange("")
      store.setInputCameraMandatoryKey("")
    }
  }
})

const dropDownColor = computed(() => {
  const val = itemRef.value.value?.toString().replaceAll("'", '');
  let color: string | undefined
  const isPrevTargetRating = itemRef.value.categoryItemType == CategoryItemTypeEnum.PREVIOUS_VALUE_PISTON_RATING || itemRef.value.categoryItemType == CategoryItemTypeEnum.PREVIOUS_TARGET_RATING;
  if (itemRef.value.categoryItemType == "targetRating" || isPrevTargetRating) {
    if (val == 'A') {
      color = 'a'
    } else if (val == 'B') {
      color = 'b'
    } else if (val == 'C') {
      color = 'c'
    } else if (val == 'X') {
      color = 'x'
    }
  }
  return color
})

const style = computed(() => {
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; ` : ""
  const fontColor = !isUndefined(itemRef.value.style) && itemRef.value.style.fontColor != 'none' ? `color: ${itemRef.value.style.fontColor}; ` : ""
  const borderTop = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.top != 'none' ? `border-top: ${itemRef.value.style.border.top}; ` : ""
  const borderRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.right != 'none' ? `border-right: ${itemRef.value.style.border.right}; ` : ""
  let borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
  // check for condition CBM auto has additional row, jadi harus cek apakah menampilkan border dari item atau dari additional row
  const isReplacement = (!isUndefined(props.task?.isShowReplacementRow) && props.task?.isShowReplacementRow)
  const isAdjustment = (!isUndefined(props.task?.isShowAdjustmentRow) && props.task?.isShowAdjustmentRow)
  const isCleaned = (!isUndefined(props.task?.isShowCleanedRow) && props.task?.isShowCleanedRow)
  const isRepJust = isReplacement || isAdjustment || isCleaned || props.isShowAdjustment
  if (isRepJust) {
    borderBottom = ''
  } else {
    // get total col for border bottom (if 12 this means full table and the border bottom must be below timestamp)
    // otherwise border bottom must be below item
    let totalCol = 0
    props.task?.items.forEach((item) => {
      if (!isUndefined(item.style)) {
        if (!isUndefined(item.style.border)) {
          if (item.style.border.right == 'none' || isUndefined(item.style.border.right)) {
            totalCol = totalCol + Number(item.style.breakPoint)
          }
          if (isEqual(item, last(props.task?.items))) {
            totalCol = totalCol + Number(item.style.breakPoint)
          }
        } else if (isUndefined(item.style.border)) {
          totalCol = totalCol + Number(item.style.breakPoint)
        }
      }
    })
    if (totalCol == 12) {
      borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
    }
  }
  const borderLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.left != 'none' ? `border-left: ${itemRef.value.style.border.left}; ` : ""

  const borderRadiusTopRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topRight != 'none' ? `border-top-right-radius: ${itemRef.value.style.borderRadius.topRight}; ` : ""
  const borderRadiusBottomRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomRight != 'none' ? `border-bottom-right-radius: ${itemRef.value.style.borderRadius.bottomRight}; ` : ""
  const borderRadiusTopLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topLeft != 'none' ? `border-top-left-radius: ${itemRef.value.style.borderRadius.topLeft}; ` : ""
  const borderRadiusBottomLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomLeft != 'none' ? `border-bottom-left-radius: ${itemRef.value.style.borderRadius.bottomLeft}; ` : ""

  // kondisi kalau dia row terakhir table (border bottom at last index)
  let paddingBottom = ''
  if (borderBottom) {
    paddingBottom = 'padding-bottom: 25px; '
  }
  return `${paddingBottom}${backGroundColor}${fontColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
})

const readOnly = computed(() => {
  if (itemRef.value.valueItemType && itemRef.value.valueItemType == 'comment') {
    if (props.task?.updatedBy && typeof props.task?.updatedBy != "string") {
      // check if same fitter
      return store.employee.id != props.task.updatedBy.id
    } else {
      return false
    }
  }
  const targetRating = itemRef.value.categoryItemType == 'targetRating'
  let sameFitter = true
  let sameFitterOnItem = true
  if (taskPropsItem.value?.updatedBy && itemRef.value.categoryItemType != "paramRating") {
    if (store.employee.id == taskPropsItem.value!.updatedBy!.id) {
      sameFitter = true
    } else {
      sameFitter = false
    }

    if (!isUndefined(itemRef.value!.updatedBy!) && !isUndefined(itemRef.value!.updatedBy!.id)) {
      if (store.employee.id == itemRef.value!.updatedBy!.id) {
        sameFitterOnItem = true
      } else {
        sameFitterOnItem = false
      }
    }

    // all fitter can edit on categoryItemType "paramRatingDynamic"
    if (itemRef.value.categoryItemType == "paramRatingDynamic") {
      sameFitterOnItem = true
      sameFitter = true
    }

    // all fitter can edit on categoryItemType piston INput
    if (itemRef.value.categoryItemType == CategoryItemTypeEnum.PISTON_INPUT_A || CategoryItemTypeEnum.PISTON_INPUT_B) {
      sameFitterOnItem = true
      sameFitter = true
    }
  }
  let readOnly = false
  if (!isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.visibility)) {
    if (itemRef.value.style.visibility == 'readonly') {
      readOnly = true
    }
  }

  let sameFitterOnAverage = true
  let targetItem
  if (itemRef.value.category == 'cbmCalculateAvg') {
    const item = store.stateSelectedSubGroups.find((subGroup) => {
      return subGroup.taskGroup.some((taskGroup) => {
        return taskGroup.task.some((task: Task) => {
          return task.items.some((item) => {
            if (item.key == itemRef.value.targetCalculateKeyId) {
              targetItem = item
            }
            return item.key == itemRef.value.targetCalculateKeyId
          })
        })
      });
    });
    if (!isUndefined(targetItem.updatedBy!) && !isUndefined(targetItem.updatedBy!.id)) {
      if (store.employee.id == targetItem.updatedBy!.id) {
        sameFitterOnAverage = true
      } else {
        sameFitterOnAverage = false
      }
    }
  }

  // if suspension input is NO, other fitter can change suspension measurement input
  if (itemRef.value.categoryItemType == "suspensionParamRating") {
    if (store.stateStoredAdjustmentOptionValue == "No" || store.stateStoredAdjustmentOptionValue == "1") {
      sameFitterOnItem = true
      sameFitter = true
    }
  }
  // other fitter can change adjustment suspension measurement input (input after yes is selected)
  if (itemRef.value.categoryItemType == "adjustmentSuspensionRating") {
    sameFitterOnItem = true
    sameFitter = true
  }

  // sebaiknya piston result n rating readonly karena valuenya di generate dari input lain
  const isPistonResultAndRating = pistonMovementResult.value || pistonMovementRating.value

  return targetRating || !sameFitter || readOnly || !sameFitterOnItem || !sameFitterOnAverage || isPistonResultAndRating
})

const closeOilNotInRangeModal = () => {
  showOilNotInRange.value = false
}

const closeCBMDefectCModal = () => {
  showCBMDefectC.value = false
}

const closeCBMDefectXModal = () => {
  showCBMDefectX.value = false
}

const closeOilNotMappedModal = () => {
  showOilNotMapped.value = false
}

const handleCheckOil = async (val) => {
  if (!store.stateOilToleranceNotMapped) {
    let validationVal
    // get mapping ket value online
    if (!isOfflineOrSlowInternetConnection()) {
      validationVal = await store.getValueFromItemKey(itemRef.value.mappingKeyId! as string)
    } else {
      // get mapping key value offline
      validationVal = await store.getFieldValueByKey(itemRef.value.mappingKeyId, "value")
      console.log("offline get oil", validationVal);
    }
    if (validationVal != '') {
      const oilTolerance = store.oilTolerance
      let minTolerance = oilTolerance.min
      let maxTolerance = oilTolerance.max
      const uom = oilTolerance.uom
      if (uom == '%') {
        minTolerance = Number(validationVal) * (minTolerance / 100)
        maxTolerance = Number(validationVal) * (maxTolerance / 100)
      }
      const minVal = Number(validationVal) + Number(minTolerance)
      const maxVal = Number(validationVal) + Number(maxTolerance)
      const minValFormat = parseFloat(minVal.toString()).toFixed(2)
      const maxValFormat = parseFloat(maxVal.toString()).toFixed(2)
      const checkMin = Number(val) >= Number(minValFormat)
      const checkMax = Number(val) <= Number(maxValFormat)
      if (checkMin && checkMax) {
        const taskValue = {
          keyValue: taskPropsItem.value!.key,
          propertyParams: [
            {
              propertyName: 'taskValue',
              propertyValue: val
            },
            {
              propertyName: 'updatedBy',
              propertyValue: JSON.stringify(store.employee)
            },
            {
              propertyName: 'updatedDate',
              propertyValue: AESTCurrentDateTime()
            },
          ]
        }
        loadingCommentIndicator.value = false
        await handlePostAnswer(taskValue, val)
        oldValue.value = val
      } else {
        validation.value = `Range refill capacity is between ${minValFormat} until ${maxValFormat}`
        loadingCommentIndicator.value = false
        showOilNotInRange.value = true
        itemRef.value.value = oldValue.value
      }
    }
  } else {
    showOilNotMapped.value = true
    itemRef.value.value = oldValue.value
  }
}

const cbmInput = ref<HTMLInputElement>()
const onlyNumber = ($event) => {
  const busy = document.getElementsByClassName('busy').length > 0
  if (busy) {
    $event.preventDefault()
  }
  if (integerItemValueType.value || percentageValidation.value || cbmAuto.value || checkOilItemValidation.value) {
    let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
    if (percentageValidation.value) {
      if ($event.target.value > 100) {
        $event.preventDefault()
      }
      // cek if input has .
      if ($event.target.value.includes(".")) {
        if ($event.target.value.split(".")[1].length >= 2) {
          $event.preventDefault()
        }
      } else {
        if ($event.target.value.length >= 3) {
          $event.preventDefault()
        }
      }
    }
    if (keyCode == 13) { // Allow 13 (Enter) to calculate
      cbmInput.value!.blur()
      return
    }
    if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
      $event.preventDefault();
    }
  }
}

const oldValue = ref('')
onMounted(async () => {
  oldValue.value = itemRef.value.value as string
  inputValue.value = itemRef.value.value as string
  await handleDisableOtherItem()
  if (props.task?.mappingToolGroup && props.item?.categoryItemType == 'paramRating') {
    checkDropdownToolGroup(store.dropdownToolGroup)
  }
  setTimeout(() => {
    resetCBMValue()
  }, 500);
})

const checkDropdownToolGroup = async (newVal) => {
  for (const key in newVal) {
    const newState = newVal[key].itemKeyDisabledReset.find((val) => {
      return val == props.item.key
    })
    if (newState) {
      if (!newVal[key].isFilled) {
        isDisabledByKeyDropdownToolGroup.value = true
      } else {
        isDisabledByKeyDropdownToolGroup.value = false
        // if (oldValueDropdownTool.value == '') {
        //   oldValueDropdownTool.value = newVal[key].value
        // } else {
        //   // if old state dropdown tool group = isFilled -> always isFilled but can be different value
        //   if (oldValueDropdownTool.value != newVal[key].value) {
        //     oldValueDropdownTool.value = newVal[key].value
        //     // reset
        //     console.log('ngereset', props.task?.key)
        //     // isi updateparam
        //     // taskkey -> taskvalue kosong
        //     // itemkey input measurement, targetrating, camera -> value kosong
        //     // taskkey adjustment -> semua isi value kosong
        //     // dlm 1 update_task
        //     await store.resetCBMAutomation(props.task)
        //   }
        // }
      }
      break
    }
  }
}

watch(() => {
  return store.dropdownToolGroup
}, (newVal) => {
  if (props.task?.mappingToolGroup && props.item?.categoryItemType == 'paramRating') {
    checkDropdownToolGroup(newVal)
  }
}, { deep: true })

onUnmounted(() => {
  itemRef.value = { } as Item
})

const handleInputValidation = (val) => {
  if (itemRef.value.valueType == 'int') {
    const check = `${val}`.split('.')
    let isComa = false
    let isFiveMoreDigit = check[0].length > 5
    if (check[1]) {
      isComa = check[1].length > 2
    }
    const lengthCheck = isFiveMoreDigit || isComa
    if (lengthCheck) {
      validation.value = 'max input length is 5 digits and 2 number after .'
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}

const isCalculatingTrue = computed(() => {
  return itemRef.value.isCalculatingTrue
})

watch(isCalculatingTrue, (newVal, oldVal) => {
  if (newVal) loadingIndicator.value = true
})

const handleDisableOtherItem = async () => {
  if (!isUndefined(itemRef.value.disabledByItemKey)) {
    let disabledItem = store.stateStoredDisableKeyValue.find((disabled) => {
      return disabled.key == itemRef.value.disabledByItemKey
    })
    if (isUndefined(disabledItem)) {
      let value
      if (!isOfflineOrSlowInternetConnection()) {
        value = await store.getValueFromItemKey(itemRef.value.disabledByItemKey)
      } else {
        value = await store.getFieldValueByKey(itemRef.value.disabledByItemKey, "value")
      }
      store.pushStoredDisabledItems({
        key: itemRef.value.disabledByItemKey,
        value: value
      })
    }
    disabledItem = store.stateStoredDisableKeyValue.find((disabled) => {
      return disabled.key == itemRef.value.disabledByItemKey
    })
    if (disabledItem?.value == '3') {
      validation.value = ""
      disabledByOtherItem.value = true
      if (itemRef.value.value) {
        if (props.task?.taskType == "inline") {
          await handleInputChange("", false)
          oldValue.value = ""
        }
      }
    } else {
      disabledByOtherItem.value = false
    }
  }
}

const itemLoadingComp = computed(() => {
  return props.itemLoading
})

watch(itemLoadingComp, (newVal) => {
  loadingCommentIndicator.value = newVal
})

const isGetDataByParam = computed(() => {
  return store.stateGetDataByParam
})

const selectedToolUOM = computed(() => {
  return store.stateSelectedUOMToolTaskKey
})

watch(selectedToolUOM, (newVal, oldVal) => {
  if (newVal == props.task?.key) {
    if (props.item?.categoryItemType == "paramRatingDynamic") {
      oldValue.value = ""
    }
  }
})

watch(isGetDataByParam, async (newVal, oldVal) => {
  if (newVal) {
    await handleDisableOtherItem()
  }
})

watch(inputValue, async (newVal, oldVal) => {
  if (newVal == "" && props.item?.customValidation == 'Required') oldValue.value = ""
  if (newVal == "" && pistonMovementInput.value) oldValue.value = ""
  // validation.value = ''
  if (itemRef.value.categoryItemType) {
    if (itemRef.value.categoryItemType == "resultParamRating") {
      if (itemRef.value.key == store.stateAvgTargetKey) {
        if (newVal.toString() != oldVal) {
          handleInputChange(newVal)
        }
      }
    }
  }
  if (!itemRef.value.disabledByItemKey) {
    await handleDisableOtherItem()
  }
}, { deep: true })

const disabledItemByKey = computed(() => {
  let val = ""
  if (!isUndefined(itemRef.value.disabledByItemKey)) {
    store.stateStoredDisableKeyValue.forEach((item) => {
      if (item.key == itemRef.value.disabledByItemKey) {
        val = item.value
      }
    })
  }
  return val
})

const onlineVal = computed(() => {
  return !isOfflineOrSlowInternetConnection()
})

// trigger when connection change from online to offline when inpuutin task that trigger fullscreen loading
// terminate all loading, then re run the function (will be executed on offline)
watch(onlineVal, async (newVal, old) => {
  if (!newVal && old && itemRef.value.categoryItemType == 'paramRating') {
    if (loader.value) {
      loader.value.close()
      loader.value = undefined
      loadingIndicator.value = false
      handleInputChange(itemRef.value.value)
    }
  }
})

watch(disabledItemByKey, async () => {
  if (isOfflineOrSlowInternetConnection()) {
    await handleDisableOtherItem()
  }
})

const isNASuccessUpdateFromNetworkError = computed(() => {
  return naStore.stateUpdateSuccessFromNetworkError
})

watch(isNASuccessUpdateFromNetworkError, async (newVal) => {
  if (newVal) {
    await handleDisableOtherItem()
    naStore.toggleUpdateSuccessFromNetworkError(false)
  }
})

const storedAdjustmentOptionValue = computed(() => {
  return store.stateStoredAdjustmentOptionValue
})

watch(storedAdjustmentOptionValue, (newVal, oldVal) => {
  if (oldVal == 2 && newVal == 1) {
    // reset old value  yang ada di adjustment calibration input
    if (props.task?.showParameter && props.task?.showParameter == "cylinderHeightNeedAdjustment") {
      oldValue.value = ""
    }
  }
}, { deep: true })

watch(props.item, (newVal, oldVal) => {
  itemRef.value = newVal
}, { deep: true })

const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2"
  if (!isUndefined(props.task!.updatedBy!.name) && props.task!.updatedBy!.name) paddingBottom = ''
  return paddingBottom
})
</script>

<style lang="scss">
.service-sheet-input {
  .el-input__inner {
    border-right: 0px;
  }
  .el-input-group__append {
    background-color: transparent;
    border-left: 0px;
  }
}

.e-form-container {
  .el-input {
    .el-input__inner::placeholder {
      font-size: 0.69rem;
    }
  }
  @media (max-width:900px) {
    .eform-table-row {
      .el-input {
        .el-input__inner::placeholder{
          font-size: 0.72rem;
        }
      }
    }
  }
}
</style>
