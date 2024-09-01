<template>
  <div :class="[widthStyle, potraitWidthStyle, paddingBottomCondition]" class="px-2 pt-2 input-eform-status prevent-split" :style="style">
    <el-input
      :class="[dropDownColor, inputSuffix != '' ? 'service-sheet-input' : '']"
      v-model="inputValue"
      size="small"
      :placeholder="placeholderLabel"
      :readonly="true"
      @keypress="onlyNumber"
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
        <span>Calculating...</span>
      </div>
    </template>
    <template v-if="loadingCommentIndicator">
      <div class="d-flex align-items-center">
        <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
          <span class="sr-only">Updating...</span>
        </div>
        <span>Updating...</span>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Item } from '@/core/types/entities/dma/e-form/Item';
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
} from "lodash"
import { useEFormStore } from "@/store/pinia/dma/e-form/useEFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpdateParam
} from "@/core/types/entities/dma/e-form/update-data/updateParam";
import { Task } from '@/core/types/entities/dma/e-form/Task';
import {
  useCameraStore
} from '@/store/pinia/application/useCameraStore';
import {
  formatNumberWithComma,
  maximumFiveDigitWithTwoFraction,
  reformatNumberWithComma
} from "@/core/helpers/number-format"
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'
import {
  useSuspensionCylinderFormStore
} from '@/store/pinia/dma/e-form/useSuspensionCylinderFormStore';

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
  }
});

const itemRef = toRef(props, 'item')
const taskPropsItem = toRef(props, 'task')
const store = useEFormStore();
const authStore = useAuthenticationStore();
const suspensionCylinderFormStore = useSuspensionCylinderFormStore()
const showOilNotInRange = ref(false)
const validation = ref('')
let timer
const loadingIndicator = ref(false)
const showOilNotMapped = ref(false)
const loadingCommentIndicator = ref(false)
const camStore = useCameraStore()
const globalConnectionStore = useGlobalConnectionStore()
const inputVal = ref('')

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
      if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("normalTakePhoto")) camStore.setShowCloseButton(false)
      if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmTakePhoto")) camStore.setShowCloseButton(false)
      camStore.toggleIsVisible(true, item.key as string)
    }
  })
  showTakePicture.value = false
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

const disabledCondition = computed(() => {
  let cond = false
  const categoryItemType = itemRef.value.categoryItemType
  if (categoryItemType == 'targetRating' || categoryItemType == 'resultParamRating') cond = true

  // let isCBMDefect = false
  // let ratingVal = ''
  // props.task!.items.forEach((item) => {
  //   if (item.categoryItemType == 'targetRating') {
  //     ratingVal = item.value as string
  //   }
  // })
  // props.task!.items.forEach((item) => {
  //   if (item.itemType == "button" && item.value == "Adjustment") {
  //     if (itemRef.value.categoryItemType == 'paramRating' && ratingVal == 'C' || ratingVal == 'X') {
  //       isCBMDefect = true
  //     }
  //   }
  // })

  // dynamic param rating
  let dynamicParamRatingUomNotSelected = false
  if (itemRef.value.categoryItemType == "paramRatingDynamic") {
    taskPropsItem.value!.items.forEach((item) => {
      if (item.itemType == "dropDown" && item.categoryItemType == "dropdownTool") {
        if (item.value == "") {
          dynamicParamRatingUomNotSelected = true
        }
      }
    })
  }

  return cond || props.task!.isShowAdjustmentRow || dynamicParamRatingUomNotSelected || disabledByOtherItem.value
})

const disabledByOtherItem = ref(false)

const inputMode = computed(() => {
  let value = 'text'
  if (itemRef.value.valueType == 'int' || itemRef.value.customValidation?.toLowerCase().includes('percentage')) {
    value = 'numeric'
  }
  return value
})

// --------------------- item client validation -----------------------------
const integerItemValueType = computed(() => {
  return itemRef.value.valueType == 'int'
})
const percentageValidation = computed(() => {
  return itemRef.value.customValidation?.toLowerCase().includes('percentage')
})
const cbmAuto = computed(() => {
  return itemRef.value.categoryItemType == 'paramRating' || itemRef.value.categoryItemType == 'paramRatingDynamic'
})
const checkOilItemValidation = computed(() => {
  return !isUndefined(itemRef.value.mappingKeyId) && !isArray(itemRef.value.mappingKeyId)
})
// --------------------- item client validation -----------------------------

const inputValue = computed({
  get: () => {
    let formatted = itemRef.value.value
    // if (integerItemValueType || percentageValidation || cbmAuto || checkOilItemValidation) {
    //   formatted = formatNumberWithComma(itemRef.value.value)
    //   return formatted
    // }
    return formatted
  },
  set: async (val) => {
    if (integerItemValueType.value || cbmAuto.value || checkOilItemValidation.value) {
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
    itemRef.value.value = val
    handlePostData()
    // if (integerItemValueType || percentageValidation || cbmAuto || checkOilItemValidation) {
    //   itemRef.value.value = reformatNumberWithComma(val)
    // } else {
    //   itemRef.value.value = val
    // }
  },
});

const handlePostData = () => {
  // jika anser kosong
  if (!itemRef.value.value) {
    suspensionCylinderFormStore.deleteParams(itemRef.value.key)
  } else {
    const paramItem = {
      keyValue: itemRef.value.key,
      propertyParams: [
        {
          propertyName: 'value',
          propertyValue: itemRef.value.value as string
        },
        {
          propertyName: 'updatedBy',
          propertyValue: JSON.stringify(store.employee)
        },
        {
          propertyName: 'updatedDate',
          propertyValue: '<<ServerDateTime>>'
        },
      ]
    }
    suspensionCylinderFormStore.addUpdateParams(paramItem)
  }
}

const changeEventToValue = (event) => {
  if (!globalConnectionStore.stateConnectionStatus) {
    globalConnectionStore.setSubmitConnectionError(true)
    itemRef.value.value = oldValue.value
  } else {
    if (readOnly.value) return
    // const val = reformatNumberWithComma(event.target.value)
    const val = event.target.value
    handleInputChange(val)
  }
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
  if (props.task!.category == 'CBM' && itemRef.value.categoryItemType == 'paramRating' || itemRef.value.categoryItemType == 'resultParamRating' || itemRef.value.categoryItemType == 'paramRatingDynamic') {
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

const handleInputChange = async (val) => {
  if (val != oldValue.value) {
    clearTimeout(timer)
    // console.log("itemRef sebelum diupdate dengan val", itemRef.value.value, "val", val);
    itemRef.value.value = val
    let clientValidationPassed = checkPercentageInput()
    if (clientValidationPassed) clientValidationPassed = checkCBMDecimal()
    // clientValidationPassed = checkCBMNumber()
    if (clientValidationPassed) {
      validation.value = ''
      timer = setTimeout(async () => {
        if ((props.task as Task).category == 'CBM' && (itemRef.value.categoryItemType == 'paramRating' || itemRef.value.categoryItemType == 'resultParamRating' || itemRef.value.categoryItemType == 'paramRatingDynamic')) {
          loadingIndicator.value = true
        } else if (!isUndefined(itemRef.value.mappingKeyId) && isArray(itemRef.value.mappingKeyId)) {
          loadingCommentIndicator.value = true
        } else {
          loadingCommentIndicator.value = true
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
                propertyValue: JSON.stringify(store.employee)
              },
              {
                propertyName: 'updatedDate',
                propertyValue: '<<ServerDateTime>>'
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
              // console.log("harusnya handle CBM dong");
              await handleCBM().then((val) => {
                continuePostData = val
                if (!val && !store.ratingNotMapped) {
                  // console.log('out of range');
                  // validation.value = 'Out Of Range'
                  // itemRef.value.value = oldValue.value
                }
              })
            }
            if (continuePostData) {
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
        // if (itemRef.value.category == 'cbmCalculateAvg') {
        //   handleCalculateAvg(val)
        // }
      }, 0)
    }
  } else {
    validation.value = ''
  }
}

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

  targetItem.isCalculatingTrue = true

  if (isArray(arrKey)) {
    for (let index = 0; index < arrKey.length; index++) {
      const num = await store.getValueFromItemKey(arrKey[index])
      avgArr.push(Number(num))
      if (Number(num) == 0) allFieldHaveValue = false
    }

    let avg = 0
    avgArr.forEach((number) => {
      avg = avg + number
    })
    avg = round(avg / avgArr.length, 2)

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
    targetItem.value = avg
  }
}

const handlePostAnswer = async (taskValue, val) => {
  const payload: UpdateParam[] = [
    {
      keyValue: itemRef.value.key,
      propertyParams: [
        {
          propertyName: 'value',
          propertyValue: val
        },
        {
          propertyName: 'updatedBy',
          propertyValue: JSON.stringify(store.employee)
        },
        {
          propertyName: 'updatedDate',
          propertyValue: '<<ServerDateTime>>'
        },
      ]
    },
  ]
  if (!isUndefined(itemRef.value.isTaskValue) && itemRef.value.isTaskValue) {
    payload.push(taskValue)
  }
  await store.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name);
}
const handleCBM = async () => {
  let nextPost = true;
  const task = props.task as Task;
  // need to set uom and measurement value
  const index = task.items.findIndex((i) => {
    return i.key == itemRef.value.key;
  }) + 1;
  const uomItem = task.items[index];
  const cameraItem = task.items.find((x) => {
    return x.itemType === 'smallCamera'
  });
  if (uomItem && cameraItem) {
    store.setMeasurementValueAndUOM(itemRef.value.value as string, uomItem.value as string, cameraItem.key);
  }
  // console.log("mencoba get cbm result");
  await store.getCBMResult(task, itemRef.value).then((isSuccess) => {
    // console.log("cbm result di then", isSuccess);
    nextPost = isSuccess.status
    if (isSuccess.status) {
      // if (isSuccess.value == 'C') showCBMDefectC.value = true
      // if (isSuccess.value == 'X') showCBMDefectX.value = true
      if (isSuccess.value) {
        if (
          !isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmTakePhoto")) {
          store.setInputCameraMandatoryKey(itemRef.value.key)
          showTakePicture.value = true
        }
      }
      if (isSuccess.value == 'A' || isSuccess.value == 'B') {
        if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmTakePhotoAllRating")) {
          store.setInputCameraMandatoryKey(itemRef.value.key)
          showTakePicture.value = true
        }
      }
      if (isSuccess.value == 'C' || isSuccess.value == 'X') {
        if (
          !isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmDefectTakePhoto") ||
          !isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmTakePhotoAllRating")
        ) {
          store.setInputCameraMandatoryKey(itemRef.value.key)
          showTakePicture.value = true
        }
      }
    }
  })

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
  const val = itemRef.value.value.toString().replaceAll("'", '');
  let color: string | undefined
  if (itemRef.value.categoryItemType == "targetRating") {
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
  if (!isUndefined(props.task?.isShowAdjustmentRow) && props.task?.isShowAdjustmentRow) {
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
      borderBottom = !props.task!.updatedBy?.name && !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
    }
  }
  const borderLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.left != 'none' ? `border-left: ${itemRef.value.style.border.left}; ` : ""

  const borderRadiusTopRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topRight != 'none' ? `border-top-right-radius: ${itemRef.value.style.borderRadius.topRight}; ` : ""
  const borderRadiusBottomRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomRight != 'none' ? `border-bottom-right-radius: ${itemRef.value.style.borderRadius.bottomRight}; ` : ""
  const borderRadiusTopLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topLeft != 'none' ? `border-top-left-radius: ${itemRef.value.style.borderRadius.topLeft}; ` : ""
  const borderRadiusBottomLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomLeft != 'none' ? `border-bottom-left-radius: ${itemRef.value.style.borderRadius.bottomLeft}; ` : ""

  return `${backGroundColor}${fontColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
})

const readOnly = computed(() => {
  const targetRating = itemRef.value.categoryItemType == 'targetRating'
  let sameFitter = true
  if (!isUndefined(taskPropsItem.value!.updatedBy!) && !isUndefined(taskPropsItem.value!.updatedBy!.id)) {
    if (store.employee.id == taskPropsItem.value!.updatedBy!.id) {
      sameFitter = true
    } else {
      sameFitter = false
    }
  }
  let sameFitterOnItem = true
  if (!isUndefined(itemRef.value!.updatedBy!) && !isUndefined(itemRef.value!.updatedBy!.id)) {
    if (store.employee.id == itemRef.value!.updatedBy!.id) {
      sameFitterOnItem = true
    } else {
      sameFitterOnItem = false
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
  return targetRating || !sameFitter || readOnly || !sameFitterOnItem || !sameFitterOnAverage
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
    await store.getValueFromItemKey(itemRef.value.mappingKeyId! as string).then(async (validationVal) => {
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
        const checkMin = val >= minVal
        const checkMax = val <= maxVal
        const minValFormat = parseFloat(minVal.toString()).toFixed(2)
        const maxValFormat = parseFloat(maxVal.toString()).toFixed(2)
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
                propertyValue: '<<ServerDateTime>>'
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
    })
  } else {
    showOilNotMapped.value = true
    itemRef.value.value = oldValue.value
  }
}

const onlyNumber = ($event) => {
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
})

onUnmounted(() => {
  itemRef.value = { } as Item
})

const handleInputValidation = (val) => {
  if (itemRef.value.valueType == 'int') {
    const check = val.split('.')
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
      const value = await store.getValueFromItemKey(itemRef.value.disabledByItemKey)
      store.pushStoredDisabledItems({
        key: itemRef.value.disabledByItemKey,
        value: value
      })
    }
    disabledItem = store.stateStoredDisableKeyValue.find((disabled) => {
      return disabled.key == itemRef.value.disabledByItemKey
    })
    if (disabledItem?.value == '3') {
      disabledByOtherItem.value = true
      if (itemRef.value.value) {
        if (props.task?.taskType == "inline") {
          await handleInputChange("")
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

watch(inputValue, async (newVal, oldVal) => {
  if (newVal == "") oldValue.value = ""
  // validation.value = ''
  if (itemRef.value.categoryItemType) {
    if (itemRef.value.categoryItemType == "resultParamRating") {
      if (itemRef.value.key == store.stateAvgTargetKey) {
        if (newVal != oldVal) {
          handleInputChange(newVal)
        }
      }
    }
  }
  await handleDisableOtherItem()
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
