<template>
  <div :class="[potraitWidthStyle, widthStyle, paddingBottomCondition]" class="px-2 pt-2 dropdown-eform-status" :style="style">
    <div class="px-0 mx-0 d-flex">
      <el-select
        v-model="inputValue"
        :placeholder="placeholderLabel"
        size="small"
        class="w-100"
        :disabled="readOnly"
        :class="dropDownColor"
        @change="handleChange"
        :key="triggerRender">
        <el-option
          v-for="option in options"
          :key="option"
          :value="option.value"
        >
        <span v-html="option && option.label ? content(option && option.label): ''"></span>
        </el-option>
        <!-- label if selected -->
        <template v-if="inputValue" #prefix>
          <span class="el-input__custom-option" v-html="selectedOption"></span>
        </template>
      </el-select>
      <!-- icon detail -->
      <div v-if="itemRef.value === '2'  && task?.category == 'NORMAL'" class="ms-2">
        <img src="/media/logos/bumaau/defect.png" alt="defect" class="d-icon" @click="onDefectClickDetail" />
      </div>
      <div v-if="itemRef.value === '3' && (task?.category == 'NORMAL' || task?.category == 'CBM')" class="ms-2" @click="onNAClickDetail">
        <img src="/media/logos/bumaau/na.png" alt="na" class="d-icon" />
      </div>
      <div v-if="itemRef.value === '2' && task?.category == 'CRACK'" class="ms-2" @click="onCrackClickDetail">
        <img src="/media/logos/bumaau/defect.png" alt="defect" class="d-icon" />
      </div>
      <div v-if="itemRef.value === '3' && task?.category == 'CRACK'" class="ms-2" @click="onCrackClickDetail">
        <img src="/media/logos/bumaau/defect.png" alt="defect" class="d-icon" />
      </div>
      <div v-if="itemRef.value === '4'" class="ms-2" @click="onNAClickDetail">
        <img src="/media/logos/bumaau/na.png" alt="na" class="d-icon" />
      </div>
    </div>
    <template v-if="loadingIndicator">
      <div class="ms-1 d-flex align-items-center">
        <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
          <span class="sr-only">Updating...</span>
        </div>
        <span>Updating...</span>
      </div>
    </template>
  </div>
  <CBMDefectC :show="showCBMDefectC" @close="closeCBMDefectCModal"/>
  <CBMDefectX :show="showCBMDefectX" @close="closeCBMDefectXModal"/>
  <template v-if="confirmSubmitVisibility">
    <DefectConfirmationDialog :show="confirmSubmitVisibility"
       :check-list-arr="checkBoxList"
       @update-check-list="updateCheckList"
       @submit="showDefectForm"
       @close="onCancel" />
  </template>
  <TakePhoto :show="showTakePicture" @close="handleTriggerCamera"/>
</template>

<script lang="ts" setup>
import { Item } from '@/core/types/entities/dma/e-form/Item';
import {
  computed,
  defineProps,
  PropType,
  toRef,
  ref,
  watch,
  onMounted,
  defineEmits
} from 'vue'
import { useEFormStore } from "@/store/pinia/dma/e-form/useEFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore";
import {
  UpdateParam
} from "@/core/types/entities/dma/e-form/update-data/updateParam";
import { isUndefined, isEqual, last } from 'lodash';
import { Task } from '@/core/types/entities/dma/e-form/Task';
import { useNAFormStore } from '@/store/pinia/dma/e-form/na/useNAFormStore';
import {
  useCracksFormStore
} from '@/store/pinia/dma/e-form/cracks/useCracksFormStore';
import {
  useCameraStore
} from '@/store/pinia/application/useCameraStore';
import { addSpanOnHyphen } from '@/core/helpers/manipulate-html-string';
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'
import { ElLoading } from 'element-plus';

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

const emits = defineEmits(["setLoading"])

const itemRef = toRef(props, 'item')
const taskPropsItem = toRef(props, 'task')
const authStore = useAuthenticationStore();
const store = useEFormStore();
const defectStore = useDefectsFormStore();
const crackStore = useCracksFormStore()
const naStore = useNAFormStore();
const globalConnectionStore = useGlobalConnectionStore()
const confirmSubmitVisibility = ref(false);
const reRenderTrigger = ref(false);
const oldValue = ref("");
const taskKey = ref("");
const loadingIndicator = ref(false)
const camStore = useCameraStore()

const checkBoxList = ref([])

const updateCheckList = (val) => {
  checkBoxList.value = val
}
const showDefectForm = () => {
  if (checkBoxList.value.length < 1) {
    onConfirmCancel()
  } else {
    onConfirmSubmit()
  }
  checkBoxList.value = []
}

const triggerRender = computed(() => {
  return reRenderTrigger;
});

const defectCancel = computed(() => {
  return defectStore.Cancelled;
});
const crackCancel = computed(() => {
  return crackStore.Cancelled;
});
const naCancel = computed(() => {
  return naStore.Cancelled;
});

const showCBMDefectC = ref(false)
const showCBMDefectX = ref(false)
const showTakePicture = ref(false)

const handleTriggerCamera = () => {
  props.task?.items.forEach((item) => {
    if (item.itemType === 'smallCamera') {
      camStore.toggleIsVisible(true, item.key as string)
      camStore.setShowCloseButton(false)
      camStore.setShowCloseButton(false)
    }
  })
  showTakePicture.value = false
}

const placeholderLabel = computed(() => {
  let placeholderLabel = 'Choose One'
  if (!isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.placeholder)) placeholderLabel = itemRef.value.style.placeholder
  return placeholderLabel
})

/* watchers */
watch(defectCancel, (newValue) => {
  emits("setLoading", false)
  if (newValue === true) {
    if (itemRef.value?.categoryItemType == "resultRating") return;
    const taskKey = localStorage.getItem("taskKey");
    console.log(taskPropsItem.value?.key)
    if (taskKey === taskPropsItem.value?.key as string) {
      itemRef.value.value = oldValue.value;
      reRenderTrigger.value = !reRenderTrigger.value;
      defectStore.setCancelledState(false);
      loadingIndicator.value = false;
    }
  }
});
watch(crackCancel, (newValue) => {
  emits("setLoading", false)
  if (newValue === true) {
    if (itemRef.value?.categoryItemType == "resultRating") return;
    const taskKey = localStorage.getItem("taskKey");
    if (taskKey === taskPropsItem.value?.key as string) {
      itemRef.value.value = oldValue.value;
      reRenderTrigger.value = !reRenderTrigger.value;
      crackStore.setCancelledState(false);
      loadingIndicator.value = false;
    }
  }
});
watch(naCancel, (newValue) => {
  emits("setLoading", false)
  if (newValue === true) {
    if (itemRef.value?.categoryItemType == "resultRating") return;
    const taskKey = localStorage.getItem("taskKey");
    if (taskKey === taskPropsItem.value?.key as string) {
      itemRef.value.value = oldValue.value;
      reRenderTrigger.value = !reRenderTrigger.value;
      naStore.setCancelledState(false);
      loadingIndicator.value = false;
    }
  }
});
const widthStyle = computed(() => {
  if (props.generalStyle) {
    return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col"
  }
  return ''
});

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

const selectedOption = computed(() => {
  if (inputValue.value) {
    return options.value.find((val) => {
      return val.value == String(inputValue.value)
    })?.label
  }
  return inputValue.value
})

const dropDownColor = computed(() => {
  const val = itemRef.value.value.toString().replaceAll("'", '');
  let color
  if (val == '1') {
    color = 'green'
  } else if (val == '2' || (val == '3' && taskPropsItem.value?.category == 'CRACK')) {
    color = 'red'
  } else if ((val == '3' && (taskPropsItem.value?.category == 'NORMAL' || itemRef.value.categoryItemType == 'resultStatus')) || val == '4') {
    color = 'yellow'
  } else if (val == 'A') {
    color = 'a'
  } else if (val == 'B') {
    color = 'b'
  } else if (val == 'C') {
    color = 'c'
  } else if (val == 'X') {
    color = 'x'
  }
  return color
})

const handleChange = (val) => {
  updateData(val, true)
}

const updateData = async (val, triggerAskCamera, clearData = false) => {
  if (!isUndefined(props.task?.updatedBy?.id)) emits("setLoading", true)
  store.setStateItemKey(itemRef.value.key as string)
  if (props.item.categoryItemType == "dropdownTool") {
    if (!globalConnectionStore.stateConnectionStatus) {
      globalConnectionStore.setSubmitConnectionError(true)
      itemRef.value.value = oldValue.value
      localStorage.removeItem("taskKey");
      return
    } else {
      loadingIndicator.value = true
      oldValue.value = inputValue.value;
      // update options value
      itemRef.value.value = val;
      // reset defect input
      // update uom (another item on this task)
      await store.updateToolUom(props.task!, itemRef.value)
      loadingIndicator.value = false
    }
  } else {
    if (inputValue.value === val) return;
    if (val === props.task?.taskValue && !(defectCancel.value || crackCancel.value || naCancel.value)) return;
    resetAllDialog();
    if (defectCancel.value || crackCancel.value || naCancel.value) {
      oldValue.value = "";
      localStorage.removeItem("taskKey");
      return;
    } else {
      if (!globalConnectionStore.stateConnectionStatus) {
        globalConnectionStore.setSubmitConnectionError(true)
        localStorage.removeItem("taskKey");
        itemRef.value.value = oldValue.value
        return
      } else {
        emits("setLoading", true);
        loadingIndicator.value = true;
        localStorage.setItem("taskKey", taskPropsItem.value?.key as string);
        oldValue.value = inputValue.value;
        taskKey.value = taskPropsItem.value?.key as string;
        itemRef.value.value = val;
        if (val === '2' && props.task?.category === 'NORMAL') {
          defectStore.setTask(props.task as Task);
          defectStore.setItemKey(itemRef.value.key);
          confirmSubmitVisibility.value = true;
          defectStore.setItem(itemRef.value as Item)
        } else if ((val === '3' && props.task?.category === 'CRACK')) {
          crackStore.setTask(props.task as Task);
          crackStore.setItemKey(itemRef.value.key);
          crackStore.cretateInstance(true);
          await crackStore.getPreviousCrack(store.generalForm.workOrder, store.generalForm.modelId, store.generalForm.psTypeId, props.task.key);
          crackStore.toggleYesVisible(true);
        } else if ((val === '2' && props.task?.category === 'CRACK')) {
          crackStore.setTask(props.task as Task);
          crackStore.setItemKey(itemRef.value.key);
          crackStore.cretateInstance(false);
          await crackStore.getPreviousCrack(store.generalForm.workOrder, store.generalForm.modelId, store.generalForm.psTypeId, props.task.key);
          crackStore.toggleNoVisible(true);
        } else if ((val === '3' && props.task?.category === 'NORMAL') || (val == '3' && itemRef.value.categoryItemType == 'resultStatus') ||
        (val === '4' && props.task?.category === 'CRACK')) {
          naStore.setTask(props.task as Task);
          naStore.setItemKey(itemRef.value.key);
          naStore.toggleIsVisible(true);
          naStore.setItem(itemRef.value)
        } else if (val == 'C' || val == 'X') {
          const cameraItem = (props.task as Task).items.find((x) => {
            return x.itemType === 'smallCamera'
          });
          if (cameraItem) {
            store.setMeasurementValueAndUOM('', '', cameraItem.key);
          }
          const isUpdated = await store.updateDefect(props.task, val, itemRef.value) as boolean
          if (isUpdated) {
            // if (val == 'C') showCBMDefectC.value = true
            // if (val == 'X') showCBMDefectX.value = true
            if (val == 'C' || val == 'X') {
              if (triggerAskCamera) {
                store.setInputCameraMandatoryKey(itemRef.value.key)
                showTakePicture.value = true
              }
            }
          }
        } else {
          if (oldValue.value) {
            if (props.task?.category === "CBM" || props.task?.category === "NORMAL") {
              await store.deleteDefect(props.task)
            }
          }
          // if (val === "" || props.task?.taskValue === "1") return;
          const taskValue = {
            keyValue: taskPropsItem.value?.key as string,
            propertyParams: [
              {
                propertyName: 'taskValue',
                propertyValue: itemRef.value.value.toString() ?? '1'
              },
              {
                propertyName: 'updatedBy',
                propertyValue: val === "" ? "" : JSON.stringify(store.employee)
              },
              {
                propertyName: 'updatedDate',
                propertyValue: val === "" ? "" : '<<ServerDateTime>>'
              },
            ]
          }

          // -------- case reset na field -------
          let resetOtherItemFieldParam = {} as UpdateParam
          let taskNormalValueParam = {} as UpdateParam
          if (itemRef.value.categoryItemType == "resultRating") {
            if (props.task!.taskValue == "3" || props.task!.taskValue == "4") await store.deleteDefect(props.task!)

            taskNormalValueParam = {
              keyValue: props.task!.key,
              propertyParams: [
                {
                  propertyName: 'taskNormalValue',
                  propertyValue: ""
                },
              ]
            }
            props.task!.items.forEach((searchItem) => {
              if (searchItem.categoryItemType == "resultStatus") {
                resetOtherItemFieldParam = {
                  keyValue: searchItem!.key,
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
                      propertyValue: ''
                    },
                  ]
                }
              }
            })
          }
          // -------- case reset na field -------
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
                  propertyValue: val === "" ? "" : JSON.stringify(store.employee)
                },
                {
                  propertyName: 'updatedDate',
                  propertyValue: val === "" ? "" : '<<ServerDateTime>>'
                },
              ]
            },
          ]
          if (!isUndefined(itemRef.value.isTaskValue) && itemRef.value.isTaskValue) {
            payload.push(taskValue)
          }
          if (itemRef.value.categoryItemType == "resultRating") {
            payload.push(resetOtherItemFieldParam)
            payload.push(taskNormalValueParam)
          }

          await store.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name).then((status) => {
            store.setStateItemKey("")
            if (!status) {
              itemRef.value.value = oldValue.value
            } else {
              if (props.task?.category === "CBM") {
                if (val == "A" || val == "B") {
                  store.setInputCameraMandatoryKey(itemRef.value.key)
                  if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmTakePhotoAllRating")) showTakePicture.value = true
                }
              }
              // console.log(val, oldValue.value);
              if (val == "1") {
                if (oldValue.value == "") {
                  // console.log("setting input camera mandatory");
                  store.setInputCameraMandatoryKey(itemRef.value.key)
                  // console.log("🙄🙄", oldValue.value, itemRef.value.value);
                  if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("normalTakePhoto")) showTakePicture.value = true
                  if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmTakePhoto")) showTakePicture.value = true
                }
              }
            }
          });
        }
        loadingIndicator.value = false
        emits("setLoading", false)
      }
    }
  }
}

const inputValue = computed(() => {
  return props.item.value.toString().replaceAll("'", '');
});

onMounted(() => {
  oldValue.value = itemRef.value.value as string
})

const disabledByOtherItem = ref(false)

watch(inputValue, async (newVal, oldVal) => {
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
      if (props.task?.taskType == "inline") {
        if (itemRef.value.value) {
          updateData("", false)
        }
      }
    } else {
      disabledByOtherItem.value = false
    }
  }
  if (newVal == "3") {
    store.stateStoredDisableKeyValue.forEach((disableKey) => {
      if (disableKey.key == itemRef.value.disabledByItemKey) {
        disableKey.value = newVal
      }
    })
  }
}, { deep: true })

const itemLoadingComp = computed(() => {
  return props.itemLoading
})

watch(itemLoadingComp, (newVal) => {
  loadingIndicator.value = newVal
})

const resetAllDialog = (() => {
  defectStore.toggleYesVisible(false);
  defectStore.toggleNoVisible(false);
  defectStore.toggleViewNoVisible(false);
  defectStore.toggleViewYesVisible(false);
  crackStore.toggleYesVisible(false);
  crackStore.toggleNoVisible(false);
  crackStore.toggleViewNoVisible(false);
  crackStore.toggleViewYesVisible(false);
  naStore.toggleIsVisible(false);
  naStore.toggleIsViewVisible(false);
})

const options = computed(() => {
  const itemValArr = props.item.caption!.replace("[", "").replace("]", "").split("; ")
  const valArr = props.item.itemValue!.replace("[", "").replace("]", "").split(", ")
  const options = itemValArr.map((el, index) => {
    return {
      label: el.replaceAll("'", ''),
      value: valArr[index].replaceAll("'", '')
    }
  });
  return options
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
      borderBottom = !props.task!.updatedBy?.name && !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem; ` : ""
    }
  }
  const borderLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.left != 'none' ? `border-left: ${itemRef.value.style.border.left}; ` : ""

  const borderRadiusTopRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topRight != 'none' ? `border-top-right-radius: ${itemRef.value.style.borderRadius.topRight}; ` : ""
  const borderRadiusBottomRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomRight != 'none' ? `border-bottom-right-radius: ${itemRef.value.style.borderRadius.bottomRight}; ` : ""
  const borderRadiusTopLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topLeft != 'none' ? `border-top-left-radius: ${itemRef.value.style.borderRadius.topLeft}; ` : ""
  const borderRadiusBottomLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomLeft != 'none' ? `border-bottom-left-radius: ${itemRef.value.style.borderRadius.bottomLeft}; ` : ""

  return `${backGroundColor}${fontColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
});

const onDefectClickDetail = (async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "Opening Form",
    background: "rgba(0, 0, 0, 0.7)",
  })
  await defectStore.getDefectDetail(store.selectedGroup?.id as string, taskPropsItem.value?.key as string);
  loading.close()
});
const onCrackClickDetail = (async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "Opening Form",
    background: "rgba(0, 0, 0, 0.7)",
  })
  await crackStore.getCrackDetail(store.selectedGroup?.id as string, taskPropsItem.value?.key as string);
  loading.close()
});
const onNAClickDetail = (async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "Opening Form",
    background: "rgba(0, 0, 0, 0.7)",
  })
  await naStore.getNADetail(store.selectedGroup?.id as string, taskPropsItem.value?.key as string);
  loading.close()
});

const onConfirmSubmit = async () => {
  confirmSubmitVisibility.value = false;
  defectStore.cretateInstance(true);
  defectStore.toggleYesVisible(true);
}
const onConfirmCancel = () => {
  confirmSubmitVisibility.value = false;
  defectStore.cretateInstance(false);
  defectStore.toggleNoVisible(true);
}
const onCancel = () => {
  checkBoxList.value = []
  confirmSubmitVisibility.value = false;
  itemRef.value.value = oldValue.value
}

const closeCBMDefectCModal = () => {
  showCBMDefectC.value = false
}

const closeCBMDefectXModal = () => {
  showCBMDefectX.value = false
}

const readOnly = computed(() => {
  let sameFitter = true
  if (!isUndefined(taskPropsItem.value!.updatedBy!) && !isUndefined(taskPropsItem.value!.updatedBy!.id) && taskPropsItem.value?.updatedBy.toString() != '') {
    if (store.employee.id != taskPropsItem.value!.updatedBy!.id) {
      sameFitter = false
    }
  }
  let defect = false
  if (inputValue.value == '2' || inputValue.value == '3' || inputValue.value == '4') {
    defect = true
  }
  return !sameFitter || defect || disabledByOtherItem.value || loadingIndicator.value
});

const content = ((string) => {
  return addSpanOnHyphen(string)
})

const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2"
  if (!isUndefined(props.task!.updatedBy!.name) && props.task!.updatedBy!.name) paddingBottom = ''
  return paddingBottom
})

const successUpdateItemKey = computed(() => {
  return naStore.stateSuccessUpdateItemKey
})

watch(successUpdateItemKey, (newValue) => {
  // console.log("🙄🙄", oldValue.value, itemRef.value.value);
  if (newValue == itemRef.value.key) {
    if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("normalTakePhoto")) {
      store.setInputCameraMandatoryKey(itemRef.value.key)
      showTakePicture.value = true
    }
  }
})

const isCameraError = computed(() => {
  return camStore.stateIsCameraError
})

watch(isCameraError, async (newValue) => {
  if (newValue) {
    if (store.stateInputCameraMandatoryKey == itemRef.value.key) {
      await updateData("", false, true)
      store.setInputCameraMandatoryKey("")
    }
  }
})
</script>

<style scoped>
  .d-icon {
    width: 24px;
    cursor: pointer;
  }
</style>
